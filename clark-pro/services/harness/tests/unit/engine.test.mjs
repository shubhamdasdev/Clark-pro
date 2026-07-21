import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { evaluateCapabilityLease } from "../../src/capability-policy.mjs";
import { HarnessEngine } from "../../src/engine.mjs";
import { analyzeIdeaText } from "../../src/idea-inspector-contract.mjs";

const idea = "Build a local-first creator operating system that connects reusable tools while keeping memory, approval, and publication under creator control.";

async function temporaryHarness() {
  const dataDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-harness-"));
  const engine = new HarnessEngine({ dataDirectory });
  await engine.initialize();
  engine.ensureWorkspace({ workspaceId: "workspace.local", name: "Local creator workspace" }, { requestId: "request.workspace.001" });
  return { dataDirectory, engine };
}

test("idea loop is durable, idempotent, rebuildable, and approval-bound", async () => {
  const { dataDirectory, engine } = await temporaryHarness();
  try {
    const started = await engine.startIdeaLoop({
      workspaceId: "workspace.local",
      projectId: "project.idea-lab",
      ideaText: idea,
      idempotencyKey: "intent-engine-0001"
    }, { requestId: "request.loop.001" });
    assert.equal(started.run.state, "waiting_approval");
    assert.equal(started.run.approval.state, "waiting");
    assert.match(started.run.draft.text, /Strongest framing/);
    assert.equal(JSON.parse(started.run.analysis.text).kind, "idea_thesis_assessment");
    assert.equal(JSON.parse(started.run.analysis.text).evidenceState, "not_observed");
    assert.equal(started.run.draft.contentHash.startsWith("sha256:"), true);
    assert.equal(engine.listCapabilities("workspace.local").capabilities[0].state, "healthy");
    assert.equal(engine.store.database.prepare("SELECT COUNT(*) AS count FROM tool_calls WHERE status = 'succeeded'").get().count, 1);
    assert.equal(engine.store.eventEnvelopes().some((event) => event.eventType === "capability.permission_evaluated"), true);
    assert.equal(engine.store.database.prepare("SELECT COUNT(*) AS count FROM capability_leases WHERE state = 'revoked'").get().count, 1);
    assert.equal(engine.store.activeCapabilityLeases().length, 0);
    assert.equal(engine.store.verifyHashChain(), true);
    const pinnedPlan = engine.store.getRunPlan(started.run.runId);
    assert.equal(pinnedPlan.runId, started.run.runId);
    assert.equal(pinnedPlan.planHash, engine.store.getRunRow(started.run.runId).plan_hash);

    const eventCount = engine.store.countEvents();
    const replay = await engine.startIdeaLoop({
      workspaceId: "workspace.local",
      projectId: "project.idea-lab",
      ideaText: idea,
      idempotencyKey: "intent-engine-0001"
    }, { requestId: "request.loop.002" });
    assert.equal(replay.deduplicated, true);
    assert.equal(replay.run.runId, started.run.runId);
    assert.equal(engine.store.countEvents(), eventCount);
    await assert.rejects(
      engine.startIdeaLoop({ workspaceId: "workspace.local", projectId: "project.idea-lab", ideaText: `${idea} changed`, idempotencyKey: "intent-engine-0001" }),
      /different command content/
    );

    assert.throws(() => engine.resolveApproval({
      workspaceId: "workspace.local",
      runId: started.run.runId,
      approvalId: started.run.approval.approvalId,
      decision: "approve",
      reason: "  ",
      idempotencyKey: "intent-approval-no-reason-0001"
    }), /decision reason/);
    assert.equal(engine.store.countEvents(), eventCount);

    const approved = engine.resolveApproval({
      workspaceId: "workspace.local",
      runId: started.run.runId,
      approvalId: started.run.approval.approvalId,
      decision: "approve",
      reason: "The brief preserves the intent and makes the boundaries explicit.",
      idempotencyKey: "intent-approval-0001"
    }, { requestId: "request.approval.001" });
    assert.equal(approved.state, "completed");
    assert.equal(approved.approval.state, "approved");
    assert.equal(approved.approval.reason, "The brief preserves the intent and makes the boundaries explicit.");
    assert.equal(engine.store.verifyHashChain(), true);

    const approvedEventCount = engine.store.countEvents();
    engine.store.database.prepare("UPDATE commands SET response_json = NULL, completed_at = NULL WHERE idempotency_key = ?").run("intent-approval-0001");
    const reconstructedApproval = engine.resolveApproval({
      workspaceId: "workspace.local",
      runId: started.run.runId,
      approvalId: started.run.approval.approvalId,
      decision: "approve",
      reason: "The brief preserves the intent and makes the boundaries explicit.",
      idempotencyKey: "intent-approval-0001"
    });
    assert.equal(reconstructedApproval.state, "completed");
    assert.equal(engine.store.countEvents(), approvedEventCount);
    assert.equal(engine.store.getCommand("intent-approval-0001").response.state, "completed");

    const checkpointBeforeRebuild = engine.store.latestCheckpoint(approved.runId);
    const beforeRebuild = engine.store.projectionSnapshot();
    const afterRebuild = engine.store.rebuildProjections();
    assert.deepEqual(afterRebuild, beforeRebuild);
    assert.deepEqual(engine.store.latestCheckpoint(approved.runId), checkpointBeforeRebuild);
    assert.equal(afterRebuild.projects.length, 1);
    assert.equal(engine.getRun(approved.runId).draft.contentHash, approved.draft.contentHash);
  } finally {
    engine.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});

test("idea revision preserves lineage and atomically invalidates stale exact-version authority", async () => {
  const { dataDirectory, engine } = await temporaryHarness();
  try {
    const first = await engine.startIdeaLoop({
      workspaceId: "workspace.local", projectId: "project.idea-lab", ideaText: idea, idempotencyKey: "intent-revision-root-0001"
    });
    const revisedText = `${idea} It replaces manual copying across multiple tools for solo creators. Unlike closed suites, plugin-first open-source integrations stay replaceable. Creators discover it through an open-source plugin marketplace and pay a subscription after a five-user pilot measures weekly time saved, willingness to pay, and repeat use.`;
    const revised = await engine.reviseIdea({
      workspaceId: "workspace.local",
      parentRunId: first.run.runId,
      ideaText: revisedText,
      revisionReason: "Narrow the user, workaround, wedge, distribution, payment model, and falsifiable evidence plan.",
      idempotencyKey: "intent-revision-child-0002"
    });

    const superseded = engine.getRun(first.run.runId);
    assert.equal(superseded.state, "cancelled");
    assert.equal(superseded.approval.state, "invalidated");
    assert.equal(revised.run.revisionNumber, 2);
    assert.equal(revised.run.rootRunId, first.run.runId);
    assert.equal(revised.run.parentRunId, first.run.runId);
    assert.equal(revised.run.idea.artifactId, first.run.idea.artifactId);
    assert.notEqual(revised.run.idea.versionId, first.run.idea.versionId);
    assert.equal(revised.run.analysis.artifactId, first.run.analysis.artifactId);
    assert.notEqual(revised.run.analysis.versionId, first.run.analysis.versionId);
    assert.equal(JSON.parse(revised.run.analysis.text).readiness, "evidence_required");
    assert.equal(JSON.parse(revised.run.analysis.text).evidenceState, "not_observed");
    assert.equal(engine.store.eventEnvelopes().some((event) => event.eventType === "approval.invalidated"), true);
    assert.equal(engine.store.eventEnvelopes().some((event) => event.eventType === "run.cancelled"), true);
    assert.throws(() => engine.resolveApproval({
      workspaceId: "workspace.local", runId: first.run.runId, approvalId: first.run.approval.approvalId,
      decision: "approve", reason: "Attempt to approve a superseded version.", idempotencyKey: "intent-stale-approval-0001"
    }), /not waiting for approval/);

    const eventCount = engine.store.countEvents();
    const replay = await engine.reviseIdea({
      workspaceId: "workspace.local",
      parentRunId: first.run.runId,
      ideaText: revisedText,
      revisionReason: "Narrow the user, workaround, wedge, distribution, payment model, and falsifiable evidence plan.",
      idempotencyKey: "intent-revision-child-0002"
    });
    assert.equal(replay.deduplicated, true);
    assert.equal(replay.run.runId, revised.run.runId);
    assert.equal(engine.store.countEvents(), eventCount);
    const beforeRebuild = engine.store.projectionSnapshot();
    assert.deepEqual(engine.store.rebuildProjections(), beforeRebuild);
    assert.equal(engine.store.verifyHashChain(), true);
  } finally {
    engine.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});

test("workspace scope, per-workspace chains, and immutable artifact versions fail closed", async () => {
  const { dataDirectory, engine } = await temporaryHarness();
  try {
    const started = await engine.startIdeaLoop({
      workspaceId: "workspace.local", projectId: "project.idea-lab", ideaText: idea, idempotencyKey: "intent-scope-0001"
    });
    engine.ensureWorkspace({ workspaceId: "workspace.second", name: "Second workspace" });
    const secondWorkspaceFirstEvent = engine.store.eventEnvelopes().find((event) => event.workspaceId === "workspace.second");
    assert.equal(secondWorkspaceFirstEvent.integrity.previousEventHash, undefined);
    assert.equal(engine.store.verifyHashChain(), true);
    await assert.rejects(engine.handle("run.get", { workspaceId: "workspace.second", runId: started.run.runId }), /does not exist in this workspace/);

    const beforeDuplicate = engine.store.countEvents();
    assert.throws(() => engine.store.transaction(() => engine.store.appendEvent({
      eventType: "artifact.version_created", aggregateType: "artifact", aggregateId: started.run.draft.artifactId,
      workspaceId: "workspace.local", projectId: "project.idea-lab", correlationId: started.run.runId,
      payload: {
        artifact: { artifactId: started.run.draft.artifactId, versionId: started.run.draft.versionId, contentHash: started.run.draft.contentHash },
        artifactType: "brief", assetHash: started.run.draft.contentHash,
        inputRefs: [{ artifactId: started.run.idea.artifactId, versionId: started.run.idea.versionId }],
        provenance: { runId: started.run.runId, stepId: "step.structure", capabilityRevision: { id: "clark.idea.structure.local", revision: "1.0.0" } },
        cost: { currency: "USD", micros: 0 }, sensitivity: "workspace"
      }
    })), /Immutable artifact version already exists/);
    assert.equal(engine.store.countEvents(), beforeDuplicate);

    engine.store.database.prepare("UPDATE events SET event_hash = ? WHERE workspace_id = ? AND sequence = (SELECT MAX(sequence) FROM events WHERE workspace_id = ?)")
      .run(`sha256:${"0".repeat(64)}`, "workspace.local", "workspace.local");
    assert.equal(engine.store.verifyHashChain(), false);
    engine.close();
    const reopened = new HarnessEngine({ dataDirectory });
    try {
      await assert.rejects(reopened.initialize(), /event integrity verification failed/);
    } finally {
      reopened.close();
    }
  } finally {
    engine.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});

test("rejected brief records creator decision without granting approval", async () => {
  const { dataDirectory, engine } = await temporaryHarness();
  try {
    const started = await engine.startIdeaLoop({ workspaceId: "workspace.local", projectId: "project.idea-lab", ideaText: idea, idempotencyKey: "intent-reject-0001" });
    const rejected = engine.resolveApproval({
      workspaceId: "workspace.local", runId: started.run.runId, approvalId: started.run.approval.approvalId,
      decision: "reject", reason: "The target user is still too broad.", idempotencyKey: "intent-reject-decision-0001"
    });
    assert.equal(rejected.state, "failed");
    assert.equal(rejected.approval.state, "rejected");
    assert.equal(rejected.approval.reason, "The target user is still too broad.");
    assert.equal(engine.store.eventEnvelopes().some((event) => event.eventType === "approval.granted"), false);
    assert.equal(engine.store.eventEnvelopes().some((event) => event.eventType === "decision.recorded"), true);
  } finally {
    engine.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});

test("restart recovers a deterministic step left running without duplicate artifact mutation", async () => {
  const dataDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-harness-recovery-"));
  const mcpAdapter = { analyze: async ({ ideaText }) => ({ result: analyzeIdeaText(ideaText), server: { name: "mcp.clark.idea-inspector" } }) };
  const first = new HarnessEngine({ dataDirectory, stepDelayMs: 350, mcpAdapter });
  await first.initialize();
  first.ensureWorkspace({ workspaceId: "workspace.local", name: "Local creator workspace" });
  const pending = first.startIdeaLoop({ workspaceId: "workspace.local", projectId: "project.idea-lab", ideaText: idea, idempotencyKey: "intent-recovery-0001" });
  await new Promise((resolve) => setTimeout(resolve, 80));
  const running = first.store.interruptedRunRows();
  assert.equal(running.length, 1);
  assert.equal(first.store.getStep(running[0].run_id, "step.structure").state, "running");
  first.close();

  const second = new HarnessEngine({ dataDirectory });
  try {
    await second.initialize();
    assert.equal(second.recoveredRuns, 1);
    const recovered = second.getRun(running[0].run_id);
    assert.equal(recovered.state, "waiting_approval");
    assert.equal(recovered.recoveredFromCheckpoint, false);
    assert.equal(second.store.listSteps(recovered.runId).find((step) => step.step_id === "step.structure").attempt, 2);
    assert.equal(second.store.database.prepare("SELECT COUNT(*) AS count FROM artifacts WHERE artifact_type = 'brief'").get().count, 1);
    assert.equal(second.store.verifyHashChain(), true);
  } finally {
    await pending.catch(() => {});
    second.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});

test("restart revokes orphaned Bridge authority before accepting new work", async () => {
  const dataDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-harness-bridge-restart-"));
  const first = new HarnessEngine({ dataDirectory });
  await first.initialize();
  first.ensureWorkspace({ workspaceId: "workspace.local", name: "Local creator workspace" });
  first.registerBridgeClient({
    workspaceId: "workspace.local",
    clientId: "bridge.client.orphaned",
    displayName: "Interrupted local client",
    actionClasses: ["capture", "read"],
    expiresAt: new Date(Date.now() + 60_000).toISOString()
  });
  first.close();

  const second = new HarnessEngine({ dataDirectory });
  try {
    await second.initialize();
    assert.equal(second.store.getBridgeClient("bridge.client.orphaned").state, "revoked");
    assert.equal(second.store.activeBridgeClients().length, 0);
    assert.equal(second.store.verifyHashChain(), true);
  } finally {
    second.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});

test("denied capability policy is a durable terminal decision without a process lease", async () => {
  const dataDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-harness-policy-denial-"));
  const capabilityPolicy = (arguments_) => {
    const expanded = structuredClone(arguments_.manifest);
    expanded.permissions.networkDomains = ["api.example.com"];
    return evaluateCapabilityLease({ ...arguments_, manifest: expanded });
  };
  const engine = new HarnessEngine({ dataDirectory, capabilityPolicy });
  try {
    await engine.initialize();
    engine.ensureWorkspace({ workspaceId: "workspace.local", name: "Local creator workspace" });
    const result = await engine.startIdeaLoop({
      workspaceId: "workspace.local", projectId: "project.idea-lab", ideaText: idea, idempotencyKey: "intent-policy-denial-0001"
    });
    assert.equal(result.run.state, "failed");
    const permissionEvent = engine.store.eventEnvelopes().find((event) => event.eventType === "capability.permission_evaluated");
    assert.equal(permissionEvent.payload.permissionReceipt.decision, "deny");
    assert.deepEqual(permissionEvent.payload.permissionReceipt.effective.networkDomains, []);
    assert.equal(engine.store.activeCapabilityLeases().length, 0);
    assert.equal(engine.store.database.prepare("SELECT COUNT(*) AS count FROM tool_calls").get().count, 0);
    assert.equal(engine.store.verifyHashChain(), true);
  } finally {
    engine.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});

test("restart terminalizes an interrupted MCP call and retries under a new lease", async () => {
  const dataDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-harness-mcp-restart-"));
  let rejectCall;
  const stalledAdapter = { analyze: () => new Promise((_resolve, reject) => { rejectCall = reject; }) };
  const first = new HarnessEngine({ dataDirectory, mcpAdapter: stalledAdapter });
  await first.initialize();
  first.ensureWorkspace({ workspaceId: "workspace.local", name: "Local creator workspace" });
  const pending = first.startIdeaLoop({
    workspaceId: "workspace.local", projectId: "project.idea-lab", ideaText: idea, idempotencyKey: "intent-mcp-recovery-0001"
  });
  await waitUntil(() => first.store.database.prepare("SELECT COUNT(*) AS count FROM tool_calls WHERE status = 'requested'").get().count === 1);
  const runId = first.store.interruptedRunRows()[0].run_id;
  first.close();
  rejectCall(new Error("simulated process termination"));
  await pending.catch(() => {});

  const second = new HarnessEngine({ dataDirectory });
  try {
    await second.initialize();
    const calls = second.store.database.prepare("SELECT status FROM tool_calls ORDER BY call_id").all().map((row) => row.status);
    assert.deepEqual(calls, ["cancelled", "succeeded"]);
    assert.equal(second.store.activeCapabilityLeases().length, 0);
    assert.equal(second.getRun(runId).state, "waiting_approval");
    assert.equal(second.store.getStep(runId, "step.inspect").attempt, 2);
    assert.equal(second.store.verifyHashChain(), true);
  } finally {
    second.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});

async function waitUntil(predicate, timeoutMs = 2_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  assert.fail("Timed out waiting for Harness state");
}
