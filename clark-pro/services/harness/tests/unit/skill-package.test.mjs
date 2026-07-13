import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { sha256 } from "../../src/canonical.mjs";
import { HarnessEngine } from "../../src/engine.mjs";

async function createDeclarativePackage(root, revision, rollbackRevision = null, capabilityIds = ["clark.idea.inspect.mcp"]) {
  const directory = path.join(root, revision);
  await mkdir(directory, { recursive: true });
  const instructions = `# Lifecycle Skill ${revision}\n\nUse only the exact capability selected by the current run. Promotion grants revision trust, not invocation authority.\n`;
  await writeFile(path.join(directory, "SKILL.md"), instructions, { mode: 0o600 });
  const fileHash = sha256(instructions);
  const sourceHash = sha256({ files: [{ path: "SKILL.md", contentHash: fileHash }] });
  const manifest = {
    $schema: "https://schemas.clark.pro/v1/skill-package.schema.json",
    schemaVersion: 1,
    id: "clark.skill.fixture.lifecycle",
    name: "Lifecycle Fixture Skill",
    description: "Synthetic declarative fixture proving quarantine, promotion, update suspension, and rollback without invocation authority.",
    revision,
    source: { publisherId: "clark.first-party", kind: "bundled", uri: `clark://skills/fixture/${revision}`, revision, contentHash: sourceHash },
    executionClass: "A",
    files: [{ path: "SKILL.md", role: "skill_md", contentHash: fileHash, executable: false }],
    requestedPermissions: { capabilityIds, hostFunctions: [], actionClasses: ["local_transform"], networkDomains: [], credentialScopes: [], readInputs: [], writeOutputs: [] },
    lifecycle: { state: "quarantined", trustBasis: "declarative_review", rollbackRevision, remoteExecutionAllowed: false },
    tests: [{ id: "lifecycle-policy", fixture: "SKILL.md", expected: "pass" }],
    compatibility: { clarkApi: "1.0.0", platforms: ["macos-arm64", "macos-x64"] }
  };
  await writeFile(path.join(directory, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });
  return { directory, manifest };
}

test("bundled Class A Skill installs into quarantine and requires creator promotion without invocation authority", async () => {
  const dataDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-skill-package-"));
  const engine = new HarnessEngine({ dataDirectory });
  try {
    await engine.initialize();
    engine.ensureWorkspace({ workspaceId: "workspace.local", name: "Local" });
    const eventCount = engine.store.countEvents();
    engine.ensureWorkspace({ workspaceId: "workspace.local", name: "Local" });
    assert.equal(engine.store.countEvents(), eventCount);

    const listed = engine.listSkills({ workspaceId: "workspace.local", limit: 20 });
    assert.equal(listed.skills.length, 1);
    const skill = listed.skills[0];
    assert.equal(skill.skillId, "clark.skill.evidence-brief-review");
    assert.equal(skill.executionClass, "A");
    assert.equal(skill.state, "quarantined");
    assert.equal(skill.testStatus, "passed");
    assert.equal(skill.activationEligible, true);
    assert.equal(skill.executableFileCount, 0);
    assert.deepEqual(skill.trustedPermissionScopes, []);
    assert.equal(skill.gates.length, 11);
    assert.equal(skill.gates.every((gate) => gate.status === "pass"), true);
    assert.throws(() => engine.getSkillInWorkspace({
      workspaceId: "workspace.other", skillId: skill.skillId, revision: skill.revision
    }), /does not exist in this workspace/);

    const active = engine.resolveSkill({
      workspaceId: "workspace.local", skillId: skill.skillId, revision: skill.revision, action: "promote",
      reason: "Creator reviewed the exact declarative files and revision trust ceiling.", idempotencyKey: "intent.skill.promote.bundled.0001"
    });
    assert.equal(active.state, "active");
    assert.deepEqual(active.trustedPermissionScopes, ["capability.clark.idea.inspect.mcp", "action.local_transform"]);
    assert.deepEqual(engine.resolveSkill({
      workspaceId: "workspace.local", skillId: skill.skillId, revision: skill.revision, action: "promote",
      reason: "Creator reviewed the exact declarative files and revision trust ceiling.", idempotencyKey: "intent.skill.promote.bundled.0001"
    }), active);
    assert.equal(engine.store.listCapabilities("workspace.local").length, 1);
    assert.equal(engine.store.eventEnvelopes().some((event) => event.eventType === "skill.invoked"), false);
    assert.equal(engine.store.eventEnvelopes().filter((event) => event.aggregate.id === skill.skillId).some((event) => event.eventType === "skill.revision_promoted"), true);

    const beforeRebuild = engine.store.projectionSnapshot();
    assert.deepEqual(engine.store.rebuildProjections(), beforeRebuild);
    assert.equal(engine.store.verifyHashChain(), true);
  } finally {
    engine.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});

test("Skill updates suspend the prior revision, deny unavailable capability expansion, and roll back atomically", async () => {
  const dataDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-skill-lifecycle-"));
  const packageRoot = await mkdtemp(path.join(os.tmpdir(), "clark-skill-packages-"));
  const engine = new HarnessEngine({ dataDirectory });
  try {
    await engine.initialize();
    engine.ensureWorkspace({ workspaceId: "workspace.local", name: "Local" });
    const first = await createDeclarativePackage(packageRoot, "1.0.0");
    engine.registerSkillPackage({ workspaceId: "workspace.local", manifest: first.manifest, packageDirectory: first.directory });
    const firstActive = engine.resolveSkill({
      workspaceId: "workspace.local", skillId: first.manifest.id, revision: "1.0.0", action: "promote",
      reason: "Creator reviewed the first exact revision.", idempotencyKey: "intent.skill.fixture.promote.v1.0001"
    });
    assert.equal(firstActive.state, "active");

    const expanded = await createDeclarativePackage(packageRoot, "1.0.1", "1.0.0", ["clark.idea.inspect.mcp", "provider.unavailable.generate"]);
    engine.registerSkillPackage({ workspaceId: "workspace.local", manifest: expanded.manifest, packageDirectory: expanded.directory });
    const expandedSummary = engine.getSkillInWorkspace({ workspaceId: "workspace.local", skillId: expanded.manifest.id, revision: "1.0.1" });
    assert.equal(expandedSummary.activationEligible, false);
    assert.equal(expandedSummary.gates.find((gate) => gate.id === "gate.skill_capabilities").status, "block");
    assert.throws(() => engine.resolveSkill({
      workspaceId: "workspace.local", skillId: expanded.manifest.id, revision: "1.0.1", action: "promote",
      reason: "Attempt untrusted capability expansion.", idempotencyKey: "intent.skill.fixture.expand.0001"
    }), /promotion gates are incomplete/);
    assert.equal(engine.store.getSkillPackage("workspace.local", first.manifest.id, "1.0.0").state, "active");

    const update = await createDeclarativePackage(packageRoot, "1.1.0", "1.0.0");
    engine.registerSkillPackage({ workspaceId: "workspace.local", manifest: update.manifest, packageDirectory: update.directory });
    const updateActive = engine.resolveSkill({
      workspaceId: "workspace.local", skillId: update.manifest.id, revision: "1.1.0", action: "promote",
      reason: "Creator approved the exact update and retained revision 1.0.0.", idempotencyKey: "intent.skill.fixture.promote.v1-1.0001"
    });
    assert.equal(updateActive.state, "active");
    assert.equal(engine.store.getSkillPackage("workspace.local", update.manifest.id, "1.0.0").state, "suspended");

    const restored = engine.resolveSkill({
      workspaceId: "workspace.local", skillId: update.manifest.id, revision: "1.1.0", action: "rollback",
      reason: "Regression requires the previously verified procedure.", idempotencyKey: "intent.skill.fixture.rollback.v1-1.0001"
    });
    assert.equal(restored.revision, "1.0.0");
    assert.equal(restored.state, "active");
    assert.equal(engine.store.getSkillPackage("workspace.local", update.manifest.id, "1.1.0").state, "rolled_back");
    const lifecycleEvents = engine.store.eventEnvelopes().filter((event) => event.aggregate.id === update.manifest.id);
    assert.equal(lifecycleEvents.some((event) => event.eventType === "skill.revision_suspended"), true);
    assert.equal(lifecycleEvents.some((event) => event.eventType === "skill.revision_rolled_back"), true);
    const decisions = engine.store.eventEnvelopes().filter((event) => event.eventType === "decision.recorded").map((event) => event.payload.decisionType);
    assert.deepEqual(decisions, ["skill_promote", "skill_promote", "skill_rollback"]);
    const beforeRebuild = engine.store.projectionSnapshot();
    assert.deepEqual(engine.store.rebuildProjections(), beforeRebuild);
    assert.equal(engine.store.verifyHashChain(), true);
  } finally {
    engine.close();
    await rm(dataDirectory, { recursive: true, force: true });
    await rm(packageRoot, { recursive: true, force: true });
  }
});

test("Skill registration quarantines active-state claims and blocks byte drift or community acquisition", async () => {
  const dataDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-skill-negative-"));
  const packageRoot = await mkdtemp(path.join(os.tmpdir(), "clark-skill-negative-packages-"));
  const engine = new HarnessEngine({ dataDirectory });
  try {
    await engine.initialize();
    engine.ensureWorkspace({ workspaceId: "workspace.local", name: "Local" });

    const bypass = await createDeclarativePackage(packageRoot, "2.0.0");
    bypass.manifest.lifecycle.state = "active";
    engine.registerSkillPackage({ workspaceId: "workspace.local", manifest: bypass.manifest, packageDirectory: bypass.directory });
    const bypassSummary = engine.getSkillInWorkspace({ workspaceId: "workspace.local", skillId: bypass.manifest.id, revision: "2.0.0" });
    assert.equal(bypassSummary.state, "quarantined");
    assert.equal(bypassSummary.testStatus, "passed");
    assert.deepEqual(bypassSummary.trustedPermissionScopes, []);
    await writeFile(path.join(bypass.directory, "SKILL.md"), "# Changed after quarantine\n", { mode: 0o600 });
    const reevaluated = engine.evaluateSkillInWorkspace({ workspaceId: "workspace.local", skillId: bypass.manifest.id, revision: "2.0.0" });
    assert.equal(reevaluated.state, "quarantined");
    assert.equal(reevaluated.testStatus, "failed");

    const promotionDrift = await createDeclarativePackage(packageRoot, "2.0.1");
    engine.registerSkillPackage({ workspaceId: "workspace.local", manifest: promotionDrift.manifest, packageDirectory: promotionDrift.directory });
    await writeFile(path.join(promotionDrift.directory, "SKILL.md"), "# Changed immediately before promotion\n", { mode: 0o600 });
    assert.throws(() => engine.resolveSkill({
      workspaceId: "workspace.local", skillId: promotionDrift.manifest.id, revision: "2.0.1", action: "promote",
      reason: "Attempt promotion after a byte substitution.", idempotencyKey: "intent.skill.toctou.promote.0001"
    }), /changed after quarantine/);
    assert.equal(engine.store.getSkillPackage("workspace.local", promotionDrift.manifest.id, "2.0.1").test_status, "failed");

    const tampered = await createDeclarativePackage(packageRoot, "2.1.0");
    await writeFile(path.join(tampered.directory, "SKILL.md"), "# Substituted bytes\n", { mode: 0o600 });
    engine.registerSkillPackage({ workspaceId: "workspace.local", manifest: tampered.manifest, packageDirectory: tampered.directory });
    const tamperedSummary = engine.getSkillInWorkspace({ workspaceId: "workspace.local", skillId: tampered.manifest.id, revision: "2.1.0" });
    assert.equal(tamperedSummary.state, "quarantined");
    assert.equal(tamperedSummary.testStatus, "failed");
    assert.equal(tamperedSummary.activationEligible, false);
    assert.equal(tamperedSummary.gates.find((gate) => gate.id === "gate.skill_source").status, "block");
    assert.equal(tamperedSummary.gates.find((gate) => gate.id === "gate.skill_files").status, "block");
    assert.throws(() => engine.resolveSkill({
      workspaceId: "workspace.local", skillId: tampered.manifest.id, revision: "2.1.0", action: "promote",
      reason: "Attempt to promote substituted bytes.", idempotencyKey: "intent.skill.tampered.promote.0001"
    }), /promotion gates are incomplete/);

    const community = structuredClone(tampered.manifest);
    community.revision = "2.2.0";
    community.source.kind = "git";
    community.source.uri = "https://example.invalid/community.git";
    community.source.revision = "deadbeef";
    community.source.signature = "ed25519:fixture-signature";
    assert.throws(() => engine.registerSkillPackage({
      workspaceId: "workspace.local", manifest: community, packageDirectory: tampered.directory
    }), /Community Skill acquisition/);
    assert.equal(engine.store.verifyHashChain(), true);
  } finally {
    engine.close();
    await rm(dataDirectory, { recursive: true, force: true });
    await rm(packageRoot, { recursive: true, force: true });
  }
});
