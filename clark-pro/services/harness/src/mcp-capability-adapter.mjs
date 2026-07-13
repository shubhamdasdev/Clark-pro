import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { canonicalJson } from "./canonical.mjs";
import { ExactEnvironmentStdioTransport } from "./exact-stdio-transport.mjs";
import { contractValidator } from "./protocol.mjs";
import {
  IDEA_ANALYSIS_TOOL,
  IDEA_INSPECTOR_SERVER_ID,
  ideaAnalysisInputSchema,
  RUNTIME_PROFILE_TOOL,
  runtimeProfileInputSchema
} from "./idea-inspector-contract.mjs";

const serverEntry = fileURLToPath(new URL("./bundled-idea-mcp-server.mjs", import.meta.url));
const contractEntry = fileURLToPath(new URL("./idea-inspector-contract.mjs", import.meta.url));
export const BUNDLED_MCP_ENVIRONMENT_KEYS = Object.freeze(["CLARK_MCP_SERVER_ID", "ELECTRON_RUN_AS_NODE", "LANG", "LC_ALL", "NODE_ENV", "__CF_USER_TEXT_ENCODING"].sort());

export class McpCapabilityError extends Error {
  constructor(message, errorClass = "permanent") {
    super(message);
    this.name = "McpCapabilityError";
    this.code = errorClass === "policy" ? "policy_denied" : "internal";
    this.errorClass = errorClass;
    this.retryable = errorClass === "transient";
  }
}

export class BundledIdeaMcpAdapter {
  constructor({ runtimeExecutable = process.execPath, workingDirectory, environment = createBundledMcpEnvironment(), entryPath = serverEntry } = {}) {
    if (!path.isAbsolute(runtimeExecutable) || !path.isAbsolute(workingDirectory) || !path.isAbsolute(entryPath)) throw new TypeError("MCP runtime, cwd, and entry paths must be absolute");
    this.runtimeExecutable = runtimeExecutable;
    this.workingDirectory = workingDirectory;
    this.environment = Object.freeze({ ...environment });
    this.entryPath = entryPath;
    this.lastDiagnostics = [];
    fs.mkdirSync(workingDirectory, { recursive: true, mode: 0o700 });
  }

  async analyze(input, { signal, timeoutMs = 15_000 } = {}) {
    contractValidator.validateRef("https://schemas.clark.pro/v1/capability-runtime.schema.json#/$defs/ideaAnalysisInput", input);
    const transport = new ExactEnvironmentStdioTransport({
      command: this.runtimeExecutable,
      args: [this.entryPath],
      env: this.environment,
      cwd: this.workingDirectory
    });
    transport.stderr?.on("data", (chunk) => this.recordDiagnostic(chunk.toString("utf8")));
    const client = new Client({ name: "clark-connect", version: "1.0.0" }, { capabilities: {} });
    try {
      await client.connect(transport, { signal, timeout: timeoutMs, maxTotalTimeout: timeoutMs });
      const discovery = await client.listTools({}, { signal, timeout: timeoutMs, maxTotalTimeout: timeoutMs });
      assertPinnedToolContract(discovery.tools, IDEA_ANALYSIS_TOOL, ideaAnalysisInputSchema);
      assertPinnedToolContract(discovery.tools, RUNTIME_PROFILE_TOOL, runtimeProfileInputSchema);
      if (discovery.tools.length !== 2) throw new McpCapabilityError("Bundled MCP server exposed an unreviewed tool", "validation");

      const profile = parseTextResult(await client.callTool({ name: RUNTIME_PROFILE_TOOL, arguments: {} }, undefined, { signal, timeout: timeoutMs, maxTotalTimeout: timeoutMs }));
      contractValidator.validateCapabilityRuntime(profile);
      if (profile.serverId !== IDEA_INSPECTOR_SERVER_ID || canonicalJson(profile.environmentKeys) !== canonicalJson([...BUNDLED_MCP_ENVIRONMENT_KEYS])) {
        throw new McpCapabilityError("Bundled MCP server environment exceeded the allowlist", "policy");
      }

      const result = parseTextResult(await client.callTool({ name: IDEA_ANALYSIS_TOOL, arguments: input }, undefined, { signal, timeout: timeoutMs, maxTotalTimeout: timeoutMs }));
      contractValidator.validateRef("https://schemas.clark.pro/v1/capability-runtime.schema.json#/$defs/ideaAnalysisResult", result);
      return { result, runtimeProfile: profile, server: client.getServerVersion() };
    } catch (error) {
      if (error instanceof McpCapabilityError) throw error;
      if (error?.name === "AbortError" || /timeout/i.test(error?.message ?? "")) throw new McpCapabilityError("Bundled MCP call timed out or was cancelled", "transient");
      throw new McpCapabilityError(`Bundled MCP call failed: ${String(error?.message ?? error).slice(0, 500)}`, "permanent");
    } finally {
      await client.close().catch(() => {});
    }
  }

  recordDiagnostic(text) {
    const sanitized = sanitizeDiagnostic(text);
    if (!sanitized) return;
    this.lastDiagnostics.push(sanitized);
    if (this.lastDiagnostics.length > 10) this.lastDiagnostics.shift();
  }
}

export function createBundledMcpEnvironment(source = process.env) {
  return {
    CLARK_MCP_SERVER_ID: IDEA_INSPECTOR_SERVER_ID,
    ELECTRON_RUN_AS_NODE: "1",
    LANG: source.LANG ?? "en_US.UTF-8",
    LC_ALL: source.LC_ALL ?? source.LANG ?? "en_US.UTF-8",
    NODE_ENV: source.NODE_ENV === "production" ? "production" : "development"
  };
}

export function bundledMcpSourceHash() {
  const digest = createHash("sha256");
  for (const filePath of [serverEntry, contractEntry].sort()) {
    digest.update(path.basename(filePath));
    digest.update("\0");
    digest.update(fs.readFileSync(filePath));
    digest.update("\0");
  }
  return `sha256:${digest.digest("hex")}`;
}

export function assertPinnedToolContract(tools, name, inputSchema) {
  const tool = tools.find((candidate) => candidate.name === name);
  if (!tool || canonicalJson(tool.inputSchema) !== canonicalJson(inputSchema)) throw new McpCapabilityError(`Bundled MCP tool schema drifted: ${name}`, "validation");
}

function parseTextResult(response) {
  if (response.isError || response.content?.length !== 1 || response.content[0]?.type !== "text" || Buffer.byteLength(response.content[0].text, "utf8") > 32_768) {
    throw new McpCapabilityError("Bundled MCP server returned an invalid result envelope", "validation");
  }
  try {
    return JSON.parse(response.content[0].text);
  } catch {
    throw new McpCapabilityError("Bundled MCP server returned invalid JSON", "validation");
  }
}

function sanitizeDiagnostic(text) {
  return String(text)
    .replace(/\x1b\[[0-9;]*m/g, "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/(?:gh[opusr]_|sk-|Bearer\s+)[A-Za-z0-9._-]{8,}/gi, "[redacted]")
    .trim()
    .slice(0, 4_096);
}
