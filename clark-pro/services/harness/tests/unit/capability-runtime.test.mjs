import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { evaluateCapabilityLease } from "../../src/capability-policy.mjs";
import { compileIdeaRun, deriveRunIds, ideaInspectorManifest } from "../../src/idea-compiler.mjs";
import { ideaAnalysisInputSchema } from "../../src/idea-inspector-contract.mjs";
import {
  assertPinnedToolContract,
  BUNDLED_MCP_ENVIRONMENT_KEYS,
  bundledMcpSourceHash,
  BundledIdeaMcpAdapter,
  createBundledMcpEnvironment
} from "../../src/mcp-capability-adapter.mjs";

test("bundled MCP runs with an exact environment and pinned source", async () => {
  const workingDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-mcp-runtime-"));
  try {
    const adapter = new BundledIdeaMcpAdapter({ workingDirectory });
    const execution = await adapter.analyze({
      schemaVersion: 1,
      ideaText: "Build a local creator tool for teams with approval control and measure time saved as evidence."
    });
    assert.equal(execution.result.kind, "idea_thesis_assessment");
    assert.equal(execution.result.evidenceState, "not_observed");
    assert.deepEqual(execution.result.evidenceGaps, ["problem_interviews", "workaround_baseline", "behavioral_demand", "willingness_to_pay", "retention_or_repeat_use"]);
    assert.deepEqual(execution.runtimeProfile.environmentKeys, [...BUNDLED_MCP_ENVIRONMENT_KEYS]);
    for (const forbidden of ["HOME", "PATH", "LOGNAME", "SHELL", "TERM", "USER", "GITHUB_TOKEN", "OPENAI_API_KEY"]) {
      assert.equal(execution.runtimeProfile.environmentKeys.includes(forbidden), false, forbidden);
    }
    assert.equal(bundledMcpSourceHash(), ideaInspectorManifest.publisher.sourceHash);
    assert.deepEqual(createBundledMcpEnvironment({
      LANG: "en_GB.UTF-8", HOME: "/private", PATH: "/danger", GITHUB_TOKEN: "must-not-cross", NODE_ENV: "production"
    }), {
      CLARK_MCP_SERVER_ID: "mcp.clark.idea-inspector",
      ELECTRON_RUN_AS_NODE: "1",
      LANG: "en_GB.UTF-8",
      LC_ALL: "en_GB.UTF-8",
      NODE_ENV: "production"
    });
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(
      adapter.analyze({ schemaVersion: 1, ideaText: "Build a local creator tool with approval and evidence for professional creators." }, { signal: controller.signal }),
      (error) => error.errorClass === "transient"
    );
  } finally {
    await rm(workingDirectory, { recursive: true, force: true });
  }
});

test("tool schema drift and authority expansion fail closed", () => {
  assert.throws(
    () => assertPinnedToolContract([{ name: "analyze_idea", inputSchema: { ...ideaAnalysisInputSchema, additionalProperties: true } }], "analyze_idea", ideaAnalysisInputSchema),
    (error) => error.errorClass === "validation"
  );
  const ids = deriveRunIds("intent.policy.0001");
  const plan = compileIdeaRun({ ...ids, workspaceId: "workspace.local", projectId: "project.idea-lab", compiledAt: "2026-07-12T12:00:00.000Z" });
  const run = {
    runId: ids.runId,
    workspaceId: "workspace.local",
    projectId: "project.idea-lab"
  };
  const expanded = structuredClone(ideaInspectorManifest);
  expanded.permissions.networkDomains = ["api.example.com"];
  assert.throws(
    () => evaluateCapabilityLease({ manifest: expanded, plan, run, stepId: "step.inspect", attempt: 1, now: "2026-07-12T12:00:00.000Z" }),
    (error) => error.code === "policy_denied" && error.receipt.decision === "deny" && error.receipt.effective.networkDomains.length === 0
  );
});
