import test from "node:test";
import assert from "node:assert/strict";
import { readFile, rm, stat } from "node:fs/promises";
import http from "node:http";
import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ClarkBridgeService } from "../../src/bridge-service.mjs";
import { HarnessEngine } from "../../src/engine.mjs";
import { analyzeIdeaText } from "../../src/idea-inspector-contract.mjs";

const idea = "Build a creator system that connects local tools while keeping explicit approval, evidence, and publication control.";

test("Clark Bridge exposes scoped MCP tools with owner-only configuration and no bearer leakage", async () => {
  const dataDirectory = await mkdtemp(path.join(os.tmpdir(), "clark-bridge-"));
  const mcpAdapter = { analyze: async ({ ideaText }) => ({ result: analyzeIdeaText(ideaText), server: { name: "mcp.clark.idea-inspector" } }) };
  const engine = new HarnessEngine({ dataDirectory, mcpAdapter });
  let bridge;
  let client;
  try {
    await engine.initialize();
    engine.ensureWorkspace({ workspaceId: "workspace.local", name: "Local" });
    engine.ensureWorkspace({ workspaceId: "workspace.second", name: "Second" });
    const second = await engine.startIdeaLoop({
      workspaceId: "workspace.second", projectId: "project.second", ideaText: idea, idempotencyKey: "intent.second.0001"
    });

    bridge = new ClarkBridgeService({ engine, dataDirectory });
    const status = await bridge.start("workspace.local");
    assert.equal(status.state, "ready");
    assert.equal(status.host, "127.0.0.1");
    assert.equal(status.configured, true);
    assert.deepEqual(status.tools, ["clark.idea.start", "clark.idea.revise", "clark.runs.list", "clark.run.get"]);

    const connectionPath = path.join(dataDirectory, "bridge", "connection.json");
    const connection = JSON.parse(await readFile(connectionPath, "utf8"));
    assert.equal((await stat(connectionPath)).mode & 0o777, 0o600);
    assert.match(connection.headers.Authorization, /^Bearer [A-Za-z0-9_-]{40,}$/);
    const bearer = connection.headers.Authorization.slice("Bearer ".length);
    assert.equal(JSON.stringify(status).includes(bearer), false);
    assert.equal(JSON.stringify(engine.store.eventEnvelopes()).includes(bearer), false);

    client = new Client({ name: "clark-bridge-test", version: "1.0.0" }, { capabilities: {} });
    const transport = new StreamableHTTPClientTransport(new URL(connection.url), { requestInit: { headers: connection.headers } });
    await client.connect(transport);
    const tools = await client.listTools();
    assert.deepEqual(tools.tools.map((tool) => tool.name), status.tools);
    const resources = await client.listResources();
    assert.deepEqual(resources.resources.map((resource) => resource.uri), status.resources);

    const started = await client.callTool({ name: "clark.idea.start", arguments: { ideaText: idea, idempotencyKey: "intent.bridge.0001" } });
    assert.equal(started.isError, undefined);
    assert.equal(started.structuredContent.run.state, "waiting_approval");
    const eventCount = engine.store.countEvents();
    const replay = await client.callTool({ name: "clark.idea.start", arguments: { ideaText: idea, idempotencyKey: "intent.bridge.0001" } });
    assert.equal(replay.structuredContent.deduplicated, true);
    assert.equal(engine.store.countEvents(), eventCount);

    const revised = await client.callTool({ name: "clark.idea.revise", arguments: {
      parentRunId: started.structuredContent.run.runId,
      ideaText: `${idea} It replaces manual copy and paste for solo creators, reaches them through an open-source plugin marketplace, and uses a paid pilot to measure time saved, willingness to pay, and repeat use.`,
      revisionReason: "Add the workaround, distribution, business model, and evidence plan.",
      idempotencyKey: "intent.bridge.revise.0002"
    } });
    assert.equal(revised.isError, undefined);
    assert.equal(revised.structuredContent.run.revisionNumber, 2);
    assert.equal(revised.structuredContent.run.parentRunId, started.structuredContent.run.runId);

    const source = engine.store.eventEnvelopes().find((event) => event.eventType === "source.captured" && event.workspaceId === "workspace.local");
    assert.deepEqual(source.actor, { type: "bridge_client", id: status.clientId });
    assert.equal(source.metadata.source, "bridge");
    assert.equal(source.metadata.clientId, status.clientId);

    const crossWorkspace = await client.callTool({ name: "clark.run.get", arguments: { runId: second.run.runId } });
    assert.equal(crossWorkspace.isError, true);
    assert.equal(crossWorkspace.structuredContent.error.code, "not_found");
    const listed = await client.callTool({ name: "clark.runs.list", arguments: { limit: 5 } });
    assert.equal(listed.structuredContent.runs.length, 2);
    assert.equal("text" in listed.structuredContent.runs[0], false);
    assert.equal(listed.structuredContent.runs[0].thesis.evidenceState, "not_observed");
    const beforeRebuild = engine.store.projectionSnapshot();
    assert.deepEqual(engine.store.rebuildProjections(), beforeRebuild);

    const unauthorized = await fetch(connection.url, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    assert.equal(unauthorized.status, 401);
    const hostileOrigin = await fetch(connection.url, { method: "POST", headers: { ...connection.headers, "Content-Type": "application/json", Origin: "https://attacker.invalid" }, body: "{}" });
    assert.equal(hostileOrigin.status, 403);
    assert.equal(await requestWithHost(connection, "localhost"), 421);
    const oversized = await fetch(connection.url, {
      method: "POST",
      headers: { ...connection.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ value: "x".repeat(70_000) })
    });
    assert.equal(oversized.status, 413);
    assert.equal(engine.revokeBridgeClient(status.clientId), true);
    const afterRevocation = await fetch(connection.url, { method: "POST", headers: { ...connection.headers, "Content-Type": "application/json" }, body: "{}" });
    assert.equal(afterRevocation.status, 401);
    assert.equal(bridge.status("workspace.local").state, "failed");
  } finally {
    await client?.close().catch(() => {});
    await bridge?.close().catch(() => {});
    if (bridge?.clientId) assert.equal(engine.store.getBridgeClient(bridge.clientId).state, "revoked");
    engine.close();
    await rm(dataDirectory, { recursive: true, force: true });
  }
});

function requestWithHost(connection, host) {
  const url = new URL(connection.url);
  return new Promise((resolve, reject) => {
    const request = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: "POST",
      headers: { ...connection.headers, Host: host, "Content-Type": "application/json", "Content-Length": 2 }
    }, (response) => {
      response.resume();
      response.once("end", () => resolve(response.statusCode));
    });
    request.once("error", reject);
    request.end("{}");
  });
}
