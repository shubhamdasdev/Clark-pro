import process from "node:process";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from "@modelcontextprotocol/sdk/types.js";
import {
  analyzeIdeaText,
  IDEA_ANALYSIS_TOOL,
  IDEA_INSPECTOR_SERVER_ID,
  ideaAnalysisInputSchema,
  RUNTIME_PROFILE_TOOL,
  runtimeProfileInputSchema
} from "./idea-inspector-contract.mjs";

const server = new Server(
  { name: IDEA_INSPECTOR_SERVER_ID, version: "1.1.0" },
  { capabilities: { tools: { listChanged: false } } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: IDEA_ANALYSIS_TOOL,
      description: "Deterministically stress-tests ten explicit idea-thesis facets and reports missing real-world evidence. It performs no research and makes no market-value judgment.",
      inputSchema: ideaAnalysisInputSchema
    },
    {
      name: RUNTIME_PROFILE_TOOL,
      description: "Reports environment variable names only so Clark can verify the child received the exact allowlist. Values are never returned.",
      inputSchema: runtimeProfileInputSchema
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  if (name === IDEA_ANALYSIS_TOOL) {
    if (args.schemaVersion !== 1 || typeof args.ideaText !== "string" || Object.keys(args).some((key) => !["schemaVersion", "ideaText"].includes(key))) {
      throw new McpError(ErrorCode.InvalidParams, "Invalid analyze_idea input");
    }
    return textResult(analyzeIdeaText(args.ideaText));
  }
  if (name === RUNTIME_PROFILE_TOOL) {
    if (Object.keys(args).length !== 0) throw new McpError(ErrorCode.InvalidParams, "runtime_profile accepts no input");
    return textResult({
      schemaVersion: 1,
      kind: "runtime_profile",
      serverId: IDEA_INSPECTOR_SERVER_ID,
      environmentKeys: Object.keys(process.env).sort()
    });
  }
  throw new McpError(ErrorCode.MethodNotFound, `Unknown tool ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);

async function shutdown() {
  await server.close().catch(() => {});
}

process.once("SIGTERM", () => void shutdown().finally(() => process.exit(0)));
process.once("SIGINT", () => void shutdown().finally(() => process.exit(0)));

function textResult(value) {
  return { content: [{ type: "text", text: JSON.stringify(value) }] };
}
