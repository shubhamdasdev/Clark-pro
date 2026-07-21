import test from "node:test";
import assert from "node:assert/strict";
import { compileIdeaRun, deriveRunIds, ideaLoopDefinition, structureIdea } from "../../src/idea-compiler.mjs";
import { analyzeIdeaText } from "../../src/idea-inspector-contract.mjs";
import { assertMessage, assertRequestFresh, contractValidator, createRequest, HarnessProtocolError, MAX_MESSAGE_BYTES } from "../../src/protocol.mjs";

test("canonical idea loop and compiled plan preserve zero-egress creator control", () => {
  contractValidator.validateLoopDefinition(ideaLoopDefinition);
  const ids = deriveRunIds("intent-compiler-test-0001");
  const plan = compileIdeaRun({
    ...ids,
    workspaceId: "workspace.local",
    projectId: "project.idea-lab",
    compiledAt: "2026-07-13T04:10:00Z"
  });
  contractValidator.validateRunPlan(plan);
  assert.equal(plan.steps.length, 4);
  assert.deepEqual(plan.steps.find((step) => step.id === "step.structure").dependsOn, ["step.capture", "step.inspect"]);
  assert.equal(plan.effectivePermissions.capabilityIds.includes("clark.idea.inspect.mcp"), true);
  assert.deepEqual(plan.effectivePermissions.networkDomains, []);
  assert.deepEqual(plan.effectivePermissions.credentialScopes, []);
  assert.equal(plan.quote.maximum.micros, 0);
  assert.equal(plan.steps.at(-1).approval.mode, "always");
  assert.equal(plan.steps.at(-1).permissionDecision.result, "ask");
});

test("deterministic structuring is stable and explicitly introduces no claims", () => {
  const idea = "Build a creator operating system that connects reusable tools while the creator retains memory and publication control.";
  const analysis = analyzeIdeaText(idea);
  const first = structureIdea(idea, analysis);
  assert.equal(first, structureIdea(idea, analysis));
  assert.match(first, /Creator intent/);
  assert.match(first, /Governed MCP inspection/);
  assert.match(first, /introduces no research claims, model output, external data, market validation, build authority, or publication authority/);
  assert.equal(analysis.kind, "idea_thesis_assessment");
  assert.equal(analysis.evidenceState, "not_observed");
  assert.equal(analysis.evidenceGaps.length, 5);
});

test("Harness protocol rejects unknown, expired, and oversized messages", () => {
  const valid = createRequest("harness.status", {}, { requestId: "request.protocol.001", deadlineAt: "2099-01-01T00:00:00Z" });
  assert.equal(assertMessage(valid), valid);
  assert.throws(() => assertRequestFresh({ ...valid, deadlineAt: "2020-01-01T00:00:00Z" }), /deadline elapsed/);
  assert.throws(() => assertMessage({ ...valid, command: { method: "shell.execute", payload: {} } }), HarnessProtocolError);
  assert.throws(
    () => assertMessage({ ...valid, command: { method: "loop.start", payload: { workspaceId: "workspace.local", projectId: "project.local", ideaText: "x".repeat(MAX_MESSAGE_BYTES), idempotencyKey: "intent-big" } } }),
    /exceeds/
  );
});

test("run reads carry explicit workspace scope", () => {
  assert.doesNotThrow(() => createRequest("run.get", { workspaceId: "workspace.local", runId: "run.idea.12345678" }));
  assert.throws(() => createRequest("run.get", { runId: "run.idea.12345678" }), HarnessProtocolError);
});

test("idea revision requests require explicit parent lineage and a reason", () => {
  assert.doesNotThrow(() => createRequest("idea.revise", {
    workspaceId: "workspace.local",
    parentRunId: "run.idea.12345678",
    ideaText: "A revised creator idea with enough detail for deterministic inspection.",
    revisionReason: "Clarify the target user and evidence plan.",
    idempotencyKey: "intent-revise-0001"
  }));
  assert.throws(() => createRequest("idea.revise", {
    workspaceId: "workspace.local",
    ideaText: "A revised creator idea with enough detail for deterministic inspection.",
    revisionReason: "Clarify it.",
    idempotencyKey: "intent-revise-0001"
  }), HarnessProtocolError);
});

test("exact-version approval requests require an explicit decision reason", () => {
  const approval = {
    workspaceId: "workspace.local",
    runId: "run.idea.12345678",
    approvalId: "approval.idea.12345678",
    decision: "approve",
    reason: "Creator reviewed this exact wording.",
    idempotencyKey: "intent-approval-0001"
  };
  assert.doesNotThrow(() => createRequest("approval.resolve", approval));
  const { reason: _reason, ...withoutReason } = approval;
  assert.throws(() => createRequest("approval.resolve", withoutReason), HarnessProtocolError);
  assert.throws(() => createRequest("approval.resolve", { ...approval, reason: "x" }), HarnessProtocolError);
  assert.throws(() => createRequest("approval.resolve", { ...approval, reason: "   " }), HarnessProtocolError);
  assert.throws(() => createRequest("approval.resolve", { ...approval, reason: "ab " }), HarnessProtocolError);
});

test("memory mutation and retrieval requests require workspace scope, evidence, and explicit send policy", () => {
  const scope = { workspaceId: "workspace.local", projectId: "project.idea-lab" };
  assert.doesNotThrow(() => createRequest("memory.propose", {
    workspaceId: "workspace.local", layer: "identity", statement: "Creator prefers evidence-first explanations.",
    evidence: [{ type: "run", refId: "run.idea.12345678" }], contradictions: [], confidence: 0.7,
    scope, sensitivity: "personal", retrievalPolicy: "explicit_only", idempotencyKey: "intent-memory-propose-0001"
  }));
  assert.doesNotThrow(() => createRequest("memory.retrieve", {
    workspaceId: "workspace.local", query: "evidence explanations", purpose: "Creator-visible inspection",
    destination: "creator_view", scope, maxSensitivity: "personal", includeExplicitOnly: true,
    limit: 10, idempotencyKey: "intent-memory-retrieve-0001"
  }));
  assert.throws(() => createRequest("memory.retrieve", {
    workspaceId: "workspace.local", query: "evidence", purpose: "Remote context", destination: "remote_model",
    scope, maxSensitivity: "personal", limit: 10, idempotencyKey: "intent-memory-retrieve-0002"
  }), HarnessProtocolError);
});

test("Tool Package inspection requests require exact workspace and revision identity", () => {
  assert.doesNotThrow(() => createRequest("tool_package.list", { workspaceId: "workspace.local", limit: 20 }));
  assert.doesNotThrow(() => createRequest("tool_package.evaluate", {
    workspaceId: "workspace.local", toolPackageId: "clark.toolpack.opencut.rewrite", revision: "0.1.0"
  }));
  assert.doesNotThrow(() => createRequest("tool_package.resolve", {
    workspaceId: "workspace.local", toolPackageId: "clark.toolpack.fixture", revision: "1.0.0",
    action: "activate", reason: "Creator reviewed every gate.", idempotencyKey: "intent-tool-package-activate-0001"
  }));
  assert.throws(() => createRequest("tool_package.get", {
    workspaceId: "workspace.local", toolPackageId: "clark.toolpack.opencut.rewrite", revision: "latest"
  }), HarnessProtocolError);
});

test("Skill inspection and trust decisions require exact workspace and revision identity", () => {
  assert.doesNotThrow(() => createRequest("skill.list", { workspaceId: "workspace.local", limit: 20 }));
  assert.doesNotThrow(() => createRequest("skill.evaluate", {
    workspaceId: "workspace.local", skillId: "clark.skill.evidence-brief-review", revision: "1.0.0"
  }));
  assert.doesNotThrow(() => createRequest("skill.resolve", {
    workspaceId: "workspace.local", skillId: "clark.skill.evidence-brief-review", revision: "1.0.0",
    action: "promote", reason: "Creator reviewed the exact files and trust ceiling.", idempotencyKey: "intent-skill-promote-0001"
  }));
  assert.throws(() => createRequest("skill.get", {
    workspaceId: "workspace.local", skillId: "clark.skill.evidence-brief-review", revision: "latest"
  }), HarnessProtocolError);
  assert.throws(() => createRequest("skill.invoke", {
    workspaceId: "workspace.local", skillId: "clark.skill.evidence-brief-review", revision: "1.0.0"
  }), HarnessProtocolError);
});
