import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { contractPackageDirectory } from "@clark/contracts/paths";
import { HarnessEngine } from "../../src/engine.mjs";

function verifiedCandidate(revision, rollbackRevision = null) {
  const manifest = JSON.parse(readFileSync(path.join(contractPackageDirectory, "fixtures", "negative", "active-without-adapter.tool-package.invalid.json"), "utf8"));
  manifest.id = "clark.toolpack.fixture.lifecycle";
  manifest.name = "Lifecycle Fixture Tool Pack";
  manifest.description = "Executable test fixture for immutable quarantine, activation, update suspension, and rollback state transitions.";
  manifest.revision = revision;
  manifest.source.revision = revision;
  manifest.compatibility.upstreamRevision = revision;
  manifest.integration.adapters = [{
    id: "fixture.adapter.http", revision: "1.0.0", path: "http_api", status: "verified",
    executionBoundary: "harness_managed", entrypointRef: "https://example.invalid/api",
    contentHash: `sha256:${"2".repeat(64)}`, capabilityRevisions: structuredClone(manifest.components.capabilityRevisions)
  }];
  manifest.tests.push({ id: "fixture.rollback", kind: "rollback", automation: "executable", fixture: "fixture", expected: "pass", result: "pass" });
  manifest.lifecycle = {
    state: "quarantined", installed: true, trustBasis: "source_reviewed", rollbackRevision,
    statusReason: "Acquired into quarantine with synthetic passing evidence for state-machine verification only."
  };
  manifest.limitations = ["Synthetic lifecycle fixture only; it exposes no real provider authority."];
  return manifest;
}

test("OpenCut is durably pinned and visibly blocked without gaining plugin authority", async () => {
  const dataDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-tool-package-"));
  const engine = new HarnessEngine({ dataDirectory });
  try {
    await engine.initialize();
    engine.ensureWorkspace({ workspaceId: "workspace.local", name: "Local" });
    const eventCount = engine.store.countEvents();
    engine.ensureWorkspace({ workspaceId: "workspace.local", name: "Local" });
    assert.equal(engine.store.countEvents(), eventCount);

    const listed = engine.listToolPackages({ workspaceId: "workspace.local", limit: 20 });
    assert.equal(listed.toolPackages.length, 1);
    const candidate = listed.toolPackages[0];
    assert.equal(candidate.toolPackageId, "clark.toolpack.opencut.rewrite");
    assert.equal(candidate.revision, "0.1.0");
    assert.equal(candidate.state, "blocked_upstream");
    assert.equal(candidate.installed, false);
    assert.equal(candidate.activationEligible, false);
    assert.equal(candidate.stableInterfaceCount, 0);
    assert.deepEqual(candidate.componentCounts, { adapters: 0, capabilities: 0, skills: 0, converters: 0, uiContributions: 0 });
    assert.match(candidate.sourceHash, /^sha256:[a-f0-9]{64}$/);
    assert.match(candidate.manifestHash, /^sha256:[a-f0-9]{64}$/);
    assert.equal(candidate.evidenceStatus.activation, "blocked");
    assert.equal(candidate.gates.find((gate) => gate.id === "gate.source_integrity").status, "pass");
    assert.equal(candidate.gates.find((gate) => gate.id === "gate.upstream_interface").status, "block");
    assert.equal(candidate.gates.find((gate) => gate.id === "gate.license").status, "pending");
    assert.equal(candidate.gates.find((gate) => gate.id === "gate.adapter").status, "block");
    assert.throws(() => engine.resolveToolPackage({
      workspaceId: "workspace.local", toolPackageId: candidate.toolPackageId, revision: candidate.revision,
      action: "activate", reason: "Try to activate the blocked candidate.", idempotencyKey: "intent.tool-package.blocked.0001"
    }), /activation gates are incomplete/);

    const inspected = engine.getToolPackageInWorkspace({
      workspaceId: "workspace.local", toolPackageId: candidate.toolPackageId, revision: candidate.revision
    });
    assert.deepEqual(inspected, candidate);
    assert.throws(() => engine.getToolPackageInWorkspace({
      workspaceId: "workspace.second", toolPackageId: candidate.toolPackageId, revision: candidate.revision
    }), /does not exist in this workspace/);

    const discovery = engine.store.eventEnvelopes().find((event) => event.eventType === "tool_package.revision_discovered");
    assert.equal(discovery.payload.to, "blocked_upstream");
    assert.equal(discovery.payload.manifest.lifecycle.installed, false);
    assert.deepEqual(discovery.payload.capabilityRevisions, []);
    assert.deepEqual(discovery.payload.adapterRevisions, []);
    assert.equal(engine.store.listCapabilities("workspace.local").some((row) => row.capability_id.includes("opencut")), false);

    const beforeRebuild = engine.store.projectionSnapshot();
    assert.deepEqual(engine.store.rebuildProjections(), beforeRebuild);
    assert.equal(engine.store.verifyHashChain(), true);
  } finally {
    engine.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});

test("verified Tool Package updates activate atomically and retain a tested rollback revision", async () => {
  const dataDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-tool-package-lifecycle-"));
  const engine = new HarnessEngine({ dataDirectory });
  try {
    await engine.initialize();
    engine.ensureWorkspace({ workspaceId: "workspace.local", name: "Local" });
    const firstManifest = verifiedCandidate("1.0.0");
    engine.registerToolPackageManifest({ workspaceId: "workspace.local", manifest: firstManifest });
    const quarantined = engine.getToolPackageInWorkspace({ workspaceId: "workspace.local", toolPackageId: firstManifest.id, revision: "1.0.0" });
    assert.equal(quarantined.state, "quarantined");
    assert.equal(quarantined.installed, true);
    assert.equal(quarantined.activationEligible, true);

    const falseRollbackManifest = verifiedCandidate("0.9.0", "0.8.0");
    engine.registerToolPackageManifest({ workspaceId: "workspace.local", manifest: falseRollbackManifest });
    assert.throws(() => engine.resolveToolPackage({
      workspaceId: "workspace.local", toolPackageId: falseRollbackManifest.id, revision: "0.9.0", action: "activate",
      reason: "Attempt to claim an unproven rollback target.", idempotencyKey: "intent.tool-package.false-rollback.0001"
    }), /first activation cannot claim a rollback revision/);

    const firstActive = engine.resolveToolPackage({
      workspaceId: "workspace.local", toolPackageId: firstManifest.id, revision: "1.0.0", action: "activate",
      reason: "Creator reviewed every exact activation and rollback gate.", idempotencyKey: "intent.tool-package.activate.v1.0001"
    });
    assert.equal(firstActive.state, "active");
    assert.equal(firstActive.installed, true);
    assert.deepEqual(engine.resolveToolPackage({
      workspaceId: "workspace.local", toolPackageId: firstManifest.id, revision: "1.0.0", action: "activate",
      reason: "Creator reviewed every exact activation and rollback gate.", idempotencyKey: "intent.tool-package.activate.v1.0001"
    }), firstActive);

    const updateManifest = verifiedCandidate("1.1.0", "1.0.0");
    updateManifest.source.contentHash = `sha256:${"9".repeat(64)}`;
    engine.registerToolPackageManifest({ workspaceId: "workspace.local", manifest: updateManifest });
    const updateActive = engine.resolveToolPackage({
      workspaceId: "workspace.local", toolPackageId: updateManifest.id, revision: "1.1.0", action: "activate",
      reason: "Creator approved the verified update and retained revision 1.0.0 for rollback.", idempotencyKey: "intent.tool-package.activate.v1-1.0001"
    });
    assert.equal(updateActive.state, "active");
    assert.equal(engine.store.getToolPackage("workspace.local", updateManifest.id, "1.0.0").state, "suspended");
    assert.equal(engine.store.getToolPackage("workspace.local", updateManifest.id, "1.0.0").installed, 1);

    const restored = engine.resolveToolPackage({
      workspaceId: "workspace.local", toolPackageId: updateManifest.id, revision: "1.1.0", action: "rollback",
      reason: "Regression fixture requires restoring the last verified revision.", idempotencyKey: "intent.tool-package.rollback.v1-1.0001"
    });
    assert.equal(restored.revision, "1.0.0");
    assert.equal(restored.state, "active");
    assert.equal(engine.store.getToolPackage("workspace.local", updateManifest.id, "1.1.0").state, "rolled_back");
    assert.equal(engine.store.getToolPackage("workspace.local", updateManifest.id, "1.1.0").installed, 1);
    const lifecycleEvents = engine.store.eventEnvelopes().filter((event) => event.aggregate.id === updateManifest.id);
    assert.equal(lifecycleEvents.some((event) => event.eventType === "tool_package.revision_suspended"), true);
    assert.equal(lifecycleEvents.filter((event) => event.eventType === "tool_package.revision_activated").length, 3);
    assert.equal(lifecycleEvents.some((event) => event.eventType === "tool_package.revision_rolled_back"), true);
    const decisions = engine.store.eventEnvelopes().filter((event) => event.eventType === "decision.recorded").map((event) => event.payload.decisionType);
    assert.deepEqual(decisions, ["tool_package_activate", "tool_package_activate", "tool_package_rollback"]);

    const beforeRebuild = engine.store.projectionSnapshot();
    assert.deepEqual(engine.store.rebuildProjections(), beforeRebuild);
    assert.equal(engine.store.verifyHashChain(), true);
  } finally {
    engine.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});
