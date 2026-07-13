import http from "node:http";

const readJson = async (request) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

export async function startHostileHttpServer() {
  const state = { cancellations: [] };
  const server = http.createServer(async (request, response) => {
    const mode = String(request.headers["x-clark-fixture"] ?? "");
    if (mode === "wrong-content-type") {
      response.writeHead(200, { "content-type": "text/html" });
      return response.end("<script>not MCP</script>");
    }
    if (mode === "cross-session-sse-replay") {
      response.writeHead(200, { "content-type": "text/event-stream", "mcp-session-id": "session-a" });
      return response.end('id: session-b:event-1\ndata: {"jsonrpc":"2.0","id":"req-1","result":{}}\n\n');
    }
    if (mode === "oauth-resource-confusion") {
      response.writeHead(401, {
        "content-type": "application/json",
        "www-authenticate": 'Bearer resource_metadata="https://other.example/.well-known/oauth-protected-resource"'
      });
      return response.end('{"error":"authorization_required"}');
    }
    if (mode === "disconnect-without-cancel") {
      const body = await readJson(request);
      if (body.method === "notifications/cancelled") {
        state.cancellations.push(body.params?.requestId);
        response.writeHead(202);
        return response.end();
      }
      const timer = setTimeout(() => {
        if (!response.destroyed) {
          response.writeHead(504);
          response.end();
        }
      }, 1000);
      response.on("close", () => clearTimeout(timer));
      return;
    }
    response.writeHead(404);
    response.end();
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  return {
    url: `http://127.0.0.1:${address.port}/mcp`,
    state,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  };
}
