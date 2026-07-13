import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { HarnessEngine } from "../../src/engine.mjs";

const idea = "Build a local creator system that replaces manual coordination while creator approval controls evidence and publication.";

async function harnessWithEvidence() {
  const dataDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-memory-"));
  const engine = new HarnessEngine({ dataDirectory });
  await engine.initialize();
  engine.ensureWorkspace({ workspaceId: "workspace.local", name: "Local" });
  const run = (await engine.startIdeaLoop({
    workspaceId: "workspace.local", projectId: "project.idea-lab", ideaText: idea, idempotencyKey: "intent.memory.evidence.0001"
  })).run;
  return { dataDirectory, engine, run };
}

function proposal(run, overrides = {}) {
  return {
    workspaceId: "workspace.local",
    layer: "identity",
    statement: "Creator prefers evidence-first operational explanations.",
    evidence: [
      { type: "artifact", refId: run.draft.artifactId, versionId: run.draft.versionId },
      { type: "run", refId: run.runId }
    ],
    contradictions: [],
    confidence: 0.72,
    scope: { workspaceId: "workspace.local", projectId: "project.idea-lab" },
    sensitivity: "personal",
    retrievalPolicy: "default",
    idempotencyKey: "intent.memory.propose.0001",
    ...overrides
  };
}

function retrieval(overrides = {}) {
  return {
    workspaceId: "workspace.local",
    query: "operational evidence",
    purpose: "Assemble creator-visible context for an idea revision.",
    destination: "creator_view",
    scope: { workspaceId: "workspace.local", projectId: "project.idea-lab" },
    maxSensitivity: "personal",
    includeExplicitOnly: false,
    limit: 10,
    idempotencyKey: "intent.memory.retrieve.0001",
    ...overrides
  };
}

test("memory is proposal-only, evidence-bound, scoped, correctable, retrievable, and forgettable", async () => {
  const { dataDirectory, engine, run } = await harnessWithEvidence();
  try {
    const proposed = engine.proposeMemory(proposal(run));
    assert.equal(proposed.memory.state, "proposed");
    assert.equal(proposed.memory.retrievalEligible, false);
    assert.equal(engine.listMemories({ workspaceId: "workspace.local", limit: 20, includeForgotten: false }).memories.length, 1);

    const beforePromotion = engine.retrieveMemories(retrieval());
    assert.deepEqual(beforePromotion.memories, []);
    const firstRetrievalEvent = engine.store.eventEnvelopes().find((event) => event.eventType === "memory.retrieval_recorded");
    assert.equal("query" in firstRetrievalEvent.payload, false);
    assert.match(firstRetrievalEvent.payload.queryHash, /^sha256:[a-f0-9]{64}$/);
    const retrievalEventCount = engine.store.countEvents();
    assert.equal(engine.retrieveMemories(retrieval()).deduplicated, true);
    assert.equal(engine.store.countEvents(), retrievalEventCount);

    const promoted = engine.resolveMemory({
      workspaceId: "workspace.local", memoryId: proposed.memory.memoryId, action: "promote",
      reason: "Creator reviewed the evidence and wants this scoped preference active.", idempotencyKey: "intent.memory.promote.0001"
    });
    assert.equal(promoted.memory.state, "active");
    assert.equal(promoted.memory.retrievalEligible, true);
    const active = engine.retrieveMemories(retrieval({ idempotencyKey: "intent.memory.retrieve.0002" }));
    assert.deepEqual(active.memories.map((memory) => memory.memoryId), [proposed.memory.memoryId]);
    assert.equal(active.memories[0].matchedTerms, 2);

    const explicit = engine.proposeMemory(proposal(run, {
      statement: "Creator wants explicit approval before personal context enters any model.",
      retrievalPolicy: "explicit_only",
      idempotencyKey: "intent.memory.propose.explicit.0001"
    }));
    engine.resolveMemory({
      workspaceId: "workspace.local", memoryId: explicit.memory.memoryId, action: "promote",
      reason: "Creator made this privacy boundary explicit.", idempotencyKey: "intent.memory.promote.explicit.0001"
    });
    const withoutExplicit = engine.retrieveMemories(retrieval({
      query: "explicit approval personal context", idempotencyKey: "intent.memory.retrieve.explicit.0001"
    }));
    assert.equal(withoutExplicit.memories.some((memory) => memory.memoryId === explicit.memory.memoryId), false);
    const withExplicit = engine.retrieveMemories(retrieval({
      query: "explicit approval personal context", includeExplicitOnly: true, idempotencyKey: "intent.memory.retrieve.explicit.0002"
    }));
    assert.equal(withExplicit.memories.some((memory) => memory.memoryId === explicit.memory.memoryId), true);

    const neverModel = engine.proposeMemory(proposal(run, {
      statement: "Creator keeps confidential client examples out of model context.",
      retrievalPolicy: "never_send_to_model",
      sensitivity: "confidential",
      idempotencyKey: "intent.memory.propose.never.0001"
    }));
    engine.resolveMemory({
      workspaceId: "workspace.local", memoryId: neverModel.memory.memoryId, action: "promote",
      reason: "Creator confirmed this model boundary.", idempotencyKey: "intent.memory.promote.never.0001"
    });
    const remote = engine.retrieveMemories(retrieval({
      query: "confidential client examples model", destination: "remote_model", maxSensitivity: "confidential",
      idempotencyKey: "intent.memory.retrieve.remote.0001"
    }));
    assert.equal(remote.memories.some((memory) => memory.memoryId === neverModel.memory.memoryId), false);
    const creatorView = engine.retrieveMemories(retrieval({
      query: "confidential client examples model", maxSensitivity: "confidential",
      idempotencyKey: "intent.memory.retrieve.creator.0001"
    }));
    assert.equal(creatorView.memories.some((memory) => memory.memoryId === neverModel.memory.memoryId), true);

    const corrected = engine.correctMemory({
      workspaceId: "workspace.local", memoryId: proposed.memory.memoryId,
      statement: "Creator prefers concrete operational tradeoffs before aspirational claims.",
      reason: "The original wording overemphasized evidence and missed the actual ordering preference.",
      confidence: 0.9, idempotencyKey: "intent.memory.correct.0001"
    });
    assert.equal(corrected.memory.state, "proposed");
    assert.equal(corrected.memory.supersedesMemoryId, proposed.memory.memoryId);
    const disputed = engine.getMemoryInWorkspace("workspace.local", proposed.memory.memoryId);
    assert.equal(disputed.state, "disputed");
    assert.equal(disputed.replacementMemoryId, corrected.memory.memoryId);
    assert.equal(corrected.memory.evidence.at(-1).type, "correction");
    engine.resolveMemory({
      workspaceId: "workspace.local", memoryId: corrected.memory.memoryId, action: "promote",
      reason: "Creator approved the corrected scoped claim.", idempotencyKey: "intent.memory.promote.corrected.0001"
    });
    const correctedRetrieval = engine.retrieveMemories(retrieval({
      query: "operational tradeoffs aspirational", idempotencyKey: "intent.memory.retrieve.corrected.0001"
    }));
    assert.deepEqual(correctedRetrieval.memories.map((memory) => memory.memoryId), [corrected.memory.memoryId]);

    const forgotten = engine.resolveMemory({
      workspaceId: "workspace.local", memoryId: corrected.memory.memoryId, action: "forget",
      reason: "Creator no longer wants this claim retained or retrieved.", idempotencyKey: "intent.memory.forget.0001"
    });
    assert.equal(forgotten.memory.state, "forgotten");
    assert.equal(forgotten.memory.statement, "[forgotten]");
    assert.deepEqual(forgotten.memory.evidence, []);
    assert.equal(forgotten.memory.searchDerivativesDeleted, true);
    const afterForget = engine.retrieveMemories(retrieval({
      query: "operational tradeoffs aspirational", idempotencyKey: "intent.memory.retrieve.after-forget.0001"
    }));
    assert.deepEqual(afterForget.memories, []);
    const replayAfterForget = engine.retrieveMemories(retrieval({
      query: "operational tradeoffs aspirational", idempotencyKey: "intent.memory.retrieve.corrected.0001"
    }));
    assert.equal(replayAfterForget.deduplicated, true);
    assert.deepEqual(replayAfterForget.memories, []);

    engine.ensureWorkspace({ workspaceId: "workspace.second", name: "Second" });
    assert.throws(() => engine.proposeMemory(proposal(run, {
      workspaceId: "workspace.second", scope: { workspaceId: "workspace.second" }, idempotencyKey: "intent.memory.cross-scope.0001"
    })), /does not resolve in this workspace/);

    const beforeRebuild = engine.store.projectionSnapshot();
    assert.deepEqual(engine.store.rebuildProjections(), beforeRebuild);
    assert.equal(engine.store.verifyHashChain(), true);
  } finally {
    engine.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});
