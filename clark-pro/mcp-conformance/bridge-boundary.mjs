import http from "node:http";
import { randomUUID } from "node:crypto";

const protocol = "2025-11-25";
const activeToken = "clark-bridge-ground-active";
const allowedOrigins = new Set(["http://127.0.0.1", "clark://studio"]);

const json = (response, status, body, headers = {}) => {
  const encoded = Buffer.from(JSON.stringify(body));
  response.writeHead(status, { "content-type": "application/json", "content-length": encoded.length, ...headers });
  response.end(encoded);
};

const readBody = async (request, limit = 65_536) => {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > limit) throw new Error("body_limit");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
};

export async function startBridgeBoundary() {
  const sessions = new Map();
  const server = http.createServer(async (request, response) => {
    if (request.url !== "/mcp") return json(response, 404, { error: "not_found" });
    const origin = request.headers.origin;
    if (origin && !allowedOrigins.has(origin)) return json(response, 403, { error: "invalid_origin" });
    if (request.headers.authorization !== `Bearer ${activeToken}`) return json(response, 401, { error: "invalid_client" }, { "www-authenticate": "Bearer" });

    if (request.method === "GET") {
      if (!String(request.headers.accept ?? "").includes("text/event-stream")) return json(response, 406, { error: "sse_accept_required" });
      response.writeHead(405, { allow: "POST" });
      return response.end();
    }
    if (request.method !== "POST") {
      response.writeHead(405, { allow: "POST, GET" });
      return response.end();
    }
    if (!String(request.headers["content-type"] ?? "").toLowerCase().startsWith("application/json")) return json(response, 415, { error: "json_content_type_required" });
    const accept = String(request.headers.accept ?? "");
    if (!accept.includes("application/json") || !accept.includes("text/event-stream")) return json(response, 406, { error: "json_and_sse_accept_required" });

    let bodyText;
    try {
      bodyText = await readBody(request);
    } catch {
      return json(response, 413, { error: "request_too_large" });
    }
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return json(response, 400, { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
    }
    if (Array.isArray(body)) return json(response, 400, { jsonrpc: "2.0", id: null, error: { code: -32600, message: "Batching is not supported" } });
    if (!body || body.jsonrpc !== "2.0" || typeof body.method !== "string") return json(response, 400, { jsonrpc: "2.0", id: body?.id ?? null, error: { code: -32600, message: "Invalid Request" } });

    if (body.method === "initialize") {
      if (body.params?.protocolVersion !== protocol) return json(response, 400, { jsonrpc: "2.0", id: body.id, error: { code: -32602, message: "Unsupported protocol version" } });
      const sessionId = `bridge-${randomUUID()}`;
      sessions.set(sessionId, activeToken);
      return json(response, 200, { jsonrpc: "2.0", id: body.id, result: { protocolVersion: protocol, capabilities: { tools: { listChanged: false } }, serverInfo: { name: "clark-bridge-ground", version: "1.0.0" } } }, { "mcp-session-id": sessionId });
    }

    if (request.headers["mcp-protocol-version"] !== protocol) return json(response, 400, { error: "protocol_header_required" });
    const sessionId = String(request.headers["mcp-session-id"] ?? "");
    if (!sessions.has(sessionId) || sessions.get(sessionId) !== activeToken) return json(response, 404, { error: "unknown_session" });
    if (!("id" in body)) {
      response.writeHead(202);
      return response.end();
    }
    if (body.method === "ping") return json(response, 200, { jsonrpc: "2.0", id: body.id, result: {} });
    return json(response, 404, { jsonrpc: "2.0", id: body.id, error: { code: -32601, message: "Method not found" } });
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  return {
    host: address.address,
    url: `http://127.0.0.1:${address.port}/mcp`,
    activeToken,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  };
}
