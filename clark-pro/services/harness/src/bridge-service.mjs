import { randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

const HOST = "127.0.0.1";
const MAX_BODY_BYTES = 64 * 1024;
const CLIENT_LIFETIME_MS = 24 * 60 * 60 * 1_000;
const TOOL_NAMES = Object.freeze(["clark.idea.start", "clark.runs.list", "clark.run.get"]);

const ideaStartInputSchema = Object.freeze({
  type: "object",
  properties: {
    ideaText: { type: "string", minLength: 20, maxLength: 12_000 },
    idempotencyKey: { type: "string", minLength: 8, maxLength: 256 }
  },
  required: ["ideaText", "idempotencyKey"],
  additionalProperties: false
});

const runGetInputSchema = Object.freeze({
  type: "object",
  properties: { runId: { type: "string", minLength: 3, maxLength: 128 } },
  required: ["runId"],
  additionalProperties: false
});

const runsListInputSchema = Object.freeze({
  type: "object",
  properties: { limit: { type: "integer", minimum: 1, maximum: 20, default: 10 } },
  additionalProperties: false
});

export class ClarkBridgeService {
  constructor({ engine, dataDirectory, now = () => new Date().toISOString(), tokenFactory, clientIdFactory } = {}) {
    if (!engine) throw new TypeError("Clark Bridge requires a Harness engine");
    if (!dataDirectory || !path.isAbsolute(dataDirectory)) throw new TypeError("Clark Bridge dataDirectory must be absolute");
    this.engine = engine;
    this.dataDirectory = dataDirectory;
    this.now = now;
    this.tokenFactory = tokenFactory ?? (() => randomBytes(32).toString("base64url"));
    this.clientIdFactory = clientIdFactory ?? (() => `bridge.client.${randomUUID()}`);
    this.state = "disabled";
    this.workspaceId = undefined;
    this.clientId = undefined;
    this.expiresAt = undefined;
    this.port = undefined;
    this.token = undefined;
    this.configPath = path.join(dataDirectory, "bridge", "connection.json");
  }

  async start(workspaceId) {
    if (this.state === "ready" && this.workspaceId === workspaceId) return this.status(workspaceId);
    if (this.state === "ready") throw new Error("Clark Bridge is already scoped to another workspace");
    if (this.state === "starting") throw new Error("Clark Bridge is already starting");
    if (!this.engine.store.getWorkspace(workspaceId)) throw new Error("Clark Bridge workspace does not exist");
    await this.closeInfrastructure();
    removeFile(this.configPath);
    this.port = undefined;
    this.state = "starting";
    this.workspaceId = workspaceId;
    this.token = this.tokenFactory();
    this.clientId = this.clientIdFactory();
    this.expiresAt = new Date(Date.parse(this.now()) + CLIENT_LIFETIME_MS).toISOString();
    try {
      this.httpServer = http.createServer((request, response) => {
        void this.handleRequest(request, response).catch(() => {
          if (!response.headersSent) writeJsonRpcError(response, 500, -32603, "Internal server error");
          else response.destroy();
        });
      });
      this.httpServer.maxConnections = 32;
      this.httpServer.requestTimeout = 5_000;
      this.httpServer.headersTimeout = 5_000;
      this.httpServer.keepAliveTimeout = 2_000;
      await listen(this.httpServer, HOST);
      const address = this.httpServer.address();
      if (!address || typeof address === "string") throw new Error("Clark Bridge did not receive a TCP port");
      this.port = address.port;
      this.engine.registerBridgeClient({
        workspaceId,
        clientId: this.clientId,
        displayName: "Local Clark MCP client",
        actionClasses: ["capture", "read"],
        expiresAt: this.expiresAt
      });
      this.writeConnectionFile();
      this.state = "ready";
      return this.status(workspaceId);
    } catch (error) {
      this.state = "failed";
      await this.closeInfrastructure();
      if (this.clientId) this.engine.revokeBridgeClient(this.clientId);
      removeFile(this.configPath);
      this.port = undefined;
      this.token = undefined;
      throw error;
    }
  }

  status(workspaceId) {
    this.invalidateUnavailableClient();
    if (this.workspaceId && workspaceId !== this.workspaceId) {
      return bridgeStatus("disabled");
    }
    return {
      ...bridgeStatus(this.state),
      ...(this.port ? { port: this.port } : {}),
      configured: this.state === "ready" && fs.existsSync(this.configPath),
      clientId: this.clientId ?? null,
      expiresAt: this.expiresAt ?? null,
      resources: this.workspaceId ? [resourceUri(this.workspaceId)] : []
    };
  }

  async close() {
    const clientId = this.clientId;
    await this.closeInfrastructure();
    removeFile(this.configPath);
    if (clientId) this.engine.revokeBridgeClient(clientId);
    this.state = "disabled";
    this.port = undefined;
    this.token = undefined;
  }

  async handleRequest(request, response) {
    this.invalidateUnavailableClient();
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    const expectedHost = `${HOST}:${this.port}`;
    if (request.headers.host !== expectedHost) return writeJsonRpcError(response, 421, -32000, "Misdirected request");
    const origin = singleHeader(request.headers.origin);
    if (origin && origin !== `http://${expectedHost}`) return writeJsonRpcError(response, 403, -32000, "Origin is not allowed");
    if (!this.isAuthorized(singleHeader(request.headers.authorization))) {
      response.setHeader("WWW-Authenticate", 'Bearer realm="Clark Bridge"');
      return writeJsonRpcError(response, 401, -32001, "Unauthorized");
    }
    const url = new URL(request.url ?? "/", `http://${expectedHost}`);
    if (url.pathname !== "/mcp" || url.search) return writeJsonRpcError(response, 404, -32000, "Not found");
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      return writeJsonRpcError(response, 405, -32000, "Method not allowed");
    }
    if (request.headers["content-encoding"]) return writeJsonRpcError(response, 415, -32000, "Encoded request bodies are not accepted");
    if (!singleHeader(request.headers["content-type"])?.toLowerCase().startsWith("application/json")) {
      return writeJsonRpcError(response, 415, -32000, "Content-Type must be application/json");
    }
    let body;
    try {
      body = await readJsonBody(request, MAX_BODY_BYTES);
    } catch (error) {
      return writeJsonRpcError(response, error?.statusCode ?? 400, -32700, error?.statusCode === 413 ? "Request body is too large" : "Parse error");
    }
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    const mcpServer = createBridgeMcpServer(this);
    await mcpServer.connect(transport);
    try {
      await transport.handleRequest(request, response, body);
    } finally {
      await mcpServer.close().catch(() => {});
    }
  }

  isAuthorized(header) {
    if (!header?.startsWith("Bearer ") || !this.token || this.state !== "ready") return false;
    if (this.engine.store.getBridgeClient(this.clientId)?.state !== "active") return false;
    const supplied = Buffer.from(header.slice("Bearer ".length));
    const expected = Buffer.from(this.token);
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
  }

  invalidateUnavailableClient() {
    if (this.state !== "ready") return;
    const client = this.engine.store.getBridgeClient(this.clientId);
    const expired = Date.parse(this.expiresAt) <= Date.now();
    if (client?.state === "active" && !expired) return;
    if (client?.state === "active") this.engine.revokeBridgeClient(this.clientId);
    removeFile(this.configPath);
    this.token = undefined;
    this.state = "failed";
  }

  writeConnectionFile() {
    const directory = path.dirname(this.configPath);
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
    fs.chmodSync(directory, 0o700);
    const temporaryPath = `${this.configPath}.${process.pid}.tmp`;
    const connection = {
      schemaVersion: 1,
      name: "Clark Bridge",
      transport: "streamable_http",
      url: `http://${HOST}:${this.port}/mcp`,
      headers: { Authorization: `Bearer ${this.token}` },
      workspaceId: this.workspaceId,
      clientId: this.clientId,
      expiresAt: this.expiresAt,
      actionClasses: ["capture", "read"]
    };
    fs.writeFileSync(temporaryPath, `${JSON.stringify(connection, null, 2)}\n`, { encoding: "utf8", mode: 0o600, flag: "wx" });
    fs.renameSync(temporaryPath, this.configPath);
    fs.chmodSync(this.configPath, 0o600);
  }

  async closeInfrastructure() {
    const server = this.httpServer;
    this.httpServer = undefined;
    if (server) await closeHttpServer(server);
  }
}

function createBridgeMcpServer(bridge) {
  const server = new Server(
    { name: "mcp.clark.bridge", version: "1.0.0" },
    { capabilities: { tools: { listChanged: false }, resources: { listChanged: false, subscribe: false } } }
  );
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [
    {
      name: "clark.idea.start",
      description: "Capture creator-supplied text into the scoped local workspace and run Clark's durable idea-to-review loop. This does not approve or publish anything.",
      inputSchema: ideaStartInputSchema
    },
    {
      name: "clark.runs.list",
      description: "List compact run status records from the single workspace granted to this Bridge client.",
      inputSchema: runsListInputSchema
    },
    {
      name: "clark.run.get",
      description: "Read one durable run from the single workspace granted to this Bridge client.",
      inputSchema: runGetInputSchema
    }
  ] }));
  server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
    if (extra.signal.aborted) return toolError("cancelled", "The Bridge call was cancelled before execution.");
    const args = request.params.arguments ?? {};
    try {
      let result;
      if (request.params.name === "clark.idea.start") {
        assertObjectKeys(args, ["ideaText", "idempotencyKey"]);
        if (typeof args.ideaText !== "string" || args.ideaText.trim().length < 20 || args.ideaText.length > 12_000) throw invalidParams("ideaText must be between 20 and 12,000 characters");
        if (typeof args.idempotencyKey !== "string" || args.idempotencyKey.length < 8 || args.idempotencyKey.length > 256) throw invalidParams("idempotencyKey must be between 8 and 256 characters");
        result = await bridge.engine.startIdeaLoop({
          workspaceId: bridge.workspaceId,
          projectId: "project.idea-lab",
          ideaText: args.ideaText.trim(),
          idempotencyKey: args.idempotencyKey
        }, bridgeContext(bridge));
      } else if (request.params.name === "clark.runs.list") {
        assertObjectKeys(args, ["limit"]);
        const limit = args.limit ?? 10;
        if (!Number.isInteger(limit) || limit < 1 || limit > 20) throw invalidParams("limit must be an integer between 1 and 20");
        result = { runs: bridge.engine.store.listRunRows(bridge.workspaceId, limit).map((row) => compactRun(bridge.engine.runSummary(row))) };
      } else if (request.params.name === "clark.run.get") {
        assertObjectKeys(args, ["runId"]);
        if (typeof args.runId !== "string" || args.runId.length < 3 || args.runId.length > 128) throw invalidParams("runId is required");
        result = bridge.engine.getRunInWorkspace(bridge.workspaceId, args.runId);
      } else {
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool ${request.params.name}`);
      }
      if (extra.signal.aborted) return toolError("cancelled", "The Bridge call completed locally after the caller disconnected; inspect Clark by idempotency key before retrying.");
      return toolResult(result);
    } catch (error) {
      if (error instanceof McpError) throw error;
      return toolError(error?.code ?? "internal", safeMessage(error));
    }
  });
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({ resources: [{
    uri: resourceUri(bridge.workspaceId),
    name: "Clark workspace runs",
    description: "Compact durable run records for the workspace granted to this local Bridge client.",
    mimeType: "application/json"
  }] }));
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = resourceUri(bridge.workspaceId);
    if (request.params.uri !== uri) throw new McpError(ErrorCode.InvalidParams, "Resource is outside this Bridge client's workspace scope");
    const runs = bridge.engine.store.listRunRows(bridge.workspaceId, 20).map((row) => compactRun(bridge.engine.runSummary(row)));
    return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify({ workspaceId: bridge.workspaceId, runs }) }] };
  });
  return server;
}

function bridgeContext(bridge) {
  return {
    requestId: `request.bridge.${randomUUID()}`,
    actor: { type: "bridge_client", id: bridge.clientId },
    source: "bridge",
    clientId: bridge.clientId
  };
}

function compactRun(run) {
  return {
    runId: run.runId,
    workspaceId: run.workspaceId,
    projectId: run.projectId,
    state: run.state,
    loopRevision: run.loopRevision,
    activeStepId: run.activeStepId,
    eventCount: run.eventCount,
    recoveredFromCheckpoint: run.recoveredFromCheckpoint,
    ...(run.approval ? { approval: { approvalId: run.approval.approvalId, state: run.approval.state } } : {})
  };
}

function toolResult(result) {
  return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
}

function toolError(code, message) {
  const result = { error: { code: String(code).slice(0, 64), message: String(message).slice(0, 500) } };
  return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result, isError: true };
}

function safeMessage(error) {
  const allowed = new Set(["invalid_request", "deadline_exceeded", "not_found", "conflict", "policy_denied", "not_ready"]);
  return allowed.has(error?.code) ? String(error.message) : "Clark Bridge call failed safely";
}

function invalidParams(message) {
  return new McpError(ErrorCode.InvalidParams, message);
}

function assertObjectKeys(value, allowedKeys) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw invalidParams("Tool arguments must be an object");
  const allowed = new Set(allowedKeys);
  if (Object.keys(value).some((key) => !allowed.has(key))) throw invalidParams("Tool arguments contain an unknown field");
}

function resourceUri(workspaceId) {
  return `clark://${workspaceId}/runs`;
}

function bridgeStatus(state) {
  return {
    state,
    transport: "streamable_http",
    host: HOST,
    configured: false,
    clientId: null,
    expiresAt: null,
    tools: [...TOOL_NAMES],
    resources: []
  };
}

function singleHeader(value) {
  return Array.isArray(value) ? value[0] : value;
}

async function readJsonBody(request, maximumBytes) {
  const declared = Number(singleHeader(request.headers["content-length"]));
  if (Number.isFinite(declared) && declared > maximumBytes) throw httpError(413, "Request body is too large");
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maximumBytes) throw httpError(413, "Request body is too large");
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw httpError(400, "Request body is not valid JSON");
  }
}

function httpError(statusCode, message) {
  return Object.assign(new Error(message), { statusCode });
}

function writeJsonRpcError(response, statusCode, code, message) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify({ jsonrpc: "2.0", error: { code, message }, id: null }));
}

function listen(server, host) {
  return new Promise((resolve, reject) => {
    const onError = (error) => { server.off("listening", onListening); reject(error); };
    const onListening = () => { server.off("error", onError); resolve(); };
    server.once("error", onError);
    server.once("listening", onListening);
    server.listen({ host, port: 0, exclusive: true });
  });
}

function closeHttpServer(server) {
  return new Promise((resolve) => server.close(() => resolve()));
}

function removeFile(filePath) {
  try { fs.unlinkSync(filePath); } catch (error) { if (error.code !== "ENOENT") throw error; }
}

export { MAX_BODY_BYTES as BRIDGE_MAX_BODY_BYTES, TOOL_NAMES as BRIDGE_TOOL_NAMES };
