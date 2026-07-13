import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { HarnessEngine } from "../../src/engine.mjs";

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
    assert.equal(started.run.draft.contentHash.startsWith("sha256:"), true);
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
    assert.equal(engine.store.eventEnvelopes().some((event) => event.eventType === "approval.granted"), false);
    assert.equal(engine.store.eventEnvelopes().some((event) => event.eventType === "decision.recorded"), true);
  } finally {
    engine.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});

test("restart recovers a deterministic step left running without duplicate artifact mutation", async () => {
  const dataDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-harness-recovery-"));
  const first = new HarnessEngine({ dataDirectory, stepDelayMs: 350 });
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
