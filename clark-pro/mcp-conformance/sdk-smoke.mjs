import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";

const fixture = fileURLToPath(new URL("./fixtures/stdio-server.mjs", import.meta.url));
const client = new Client({ name: "clark-conformance", version: "1.0.0" }, { capabilities: {} });
const transport = new StdioClientTransport({ command: process.execPath, args: [fixture, "valid"], stderr: "pipe" });

try {
  await client.connect(transport);
  const tools = await client.listTools();
  if (tools.tools.length !== 1 || tools.tools[0].name !== "echo") throw new Error("SDK baseline did not discover echo");
  const result = await client.callTool({ name: "echo", arguments: { text: "bounded" } });
  if (result.content?.[0]?.type !== "text" || result.content[0].text !== "bounded") throw new Error("SDK baseline call result mismatch");
  console.log(JSON.stringify({ sdk: "@modelcontextprotocol/sdk@1.29.0", transport: "stdio", discovery: 1, call: "pass", status: "pass" }));
} finally {
  await client.close();
}
