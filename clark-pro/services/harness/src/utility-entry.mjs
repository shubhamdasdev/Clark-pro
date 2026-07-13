import path from "node:path";
import process from "node:process";
import { ClarkBridgeService } from "./bridge-service.mjs";
import { HarnessEngine } from "./engine.mjs";
import { assertMessage, assertRequestFresh, createErrorResponse, createProtocolEvent, createSuccessResponse, extractPortMessage, HARNESS_PROTOCOL_VERSION } from "./protocol.mjs";

const dataArgument = process.argv.find((argument) => argument.startsWith("--data-dir="));
const dataDirectory = dataArgument?.slice("--data-dir=".length);
const runtimeArgument = process.argv.find((argument) => argument.startsWith("--runtime="));
const runtimeExecutable = runtimeArgument?.slice("--runtime=".length);
if (!dataDirectory || !path.isAbsolute(dataDirectory) || dataDirectory.length > 4096 || !runtimeExecutable || !path.isAbsolute(runtimeExecutable) || runtimeExecutable.length > 4096) process.exit(64);

const engine = new HarnessEngine({
  dataDirectory,
  runtimeExecutable,
  stepDelayMs: process.env.CLARK_TEST_STEP_DELAY_MS
});
await engine.initialize();
const bridge = new ClarkBridgeService({ engine, dataDirectory });

async function handleCommand(method, payload, context) {
  if (method === "bridge.status") {
    const status = bridge.status(payload.workspaceId);
    if (status.state === "failed") return bridge.start(payload.workspaceId);
    return status;
  }
  const result = await engine.handle(method, payload, context);
  if (method === "workspace.ensure" && bridge.state !== "ready") await bridge.start(payload.workspaceId);
  return result;
}

process.parentPort.once("message", (connectionEvent) => {
  if (connectionEvent.data?.kind !== "clark.harness.connect" || connectionEvent.data?.protocolVersion !== HARNESS_PROTOCOL_VERSION || connectionEvent.ports.length !== 1) {
    process.exit(65);
  }
  const [port] = connectionEvent.ports;
  let sequence = 0;
  let queue = Promise.resolve();
  const emitProtocolEvent = (eventType, payload) => port.postMessage(createProtocolEvent(++sequence, eventType, payload));
  engine.on("run.updated", (payload) => emitProtocolEvent("run.updated", payload));
  engine.on("approval.required", (payload) => emitProtocolEvent("approval.required", payload));

  port.on("message", (messageEvent) => {
    queue = queue.then(async () => {
      let request;
      try {
        request = assertMessage(extractPortMessage(messageEvent));
        if (request.kind !== "request") throw Object.assign(new Error("Harness accepts request messages only"), { code: "invalid_request" });
        assertRequestFresh(request);
        const result = await handleCommand(request.command.method, request.command.payload, { requestId: request.requestId });
        port.postMessage(createSuccessResponse(request, result));
      } catch (error) {
        port.postMessage(createErrorResponse(request, error));
      }
    }).catch(() => process.exit(70));
  });
  port.start?.();
  emitProtocolEvent("harness.ready", { protocolVersion: HARNESS_PROTOCOL_VERSION, recoveredRuns: engine.recoveredRuns });
});

process.on("exit", () => engine.close());
let shuttingDown = false;
process.on("SIGTERM", () => {
  if (shuttingDown) return;
  shuttingDown = true;
  void bridge.close().catch(() => {}).finally(() => {
    engine.close();
    process.exit(0);
  });
});
