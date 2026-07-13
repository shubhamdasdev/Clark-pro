import test from "node:test";
import assert from "node:assert/strict";
import { compileIdeaRun, deriveRunIds, ideaLoopDefinition, structureIdea } from "../../src/idea-compiler.mjs";
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
  assert.equal(plan.steps.length, 3);
  assert.deepEqual(plan.effectivePermissions.networkDomains, []);
  assert.deepEqual(plan.effectivePermissions.credentialScopes, []);
  assert.equal(plan.quote.maximum.micros, 0);
  assert.equal(plan.steps.at(-1).approval.mode, "always");
  assert.equal(plan.steps.at(-1).permissionDecision.result, "ask");
});

test("deterministic structuring is stable and explicitly introduces no claims", () => {
  const idea = "Build a creator operating system that connects reusable tools while the creator retains memory and publication control.";
  const first = structureIdea(idea);
  assert.equal(first, structureIdea(idea));
  assert.match(first, /Creator intent/);
  assert.match(first, /introduces no research claims, model output, external data, or publication authority/);
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
