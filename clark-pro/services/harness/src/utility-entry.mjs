import path from "node:path";
import process from "node:process";
import { HarnessEngine } from "./engine.mjs";
import { assertMessage, assertRequestFresh, createErrorResponse, createProtocolEvent, createSuccessResponse, extractPortMessage, HARNESS_PROTOCOL_VERSION } from "./protocol.mjs";

const dataArgument = process.argv.find((argument) => argument.startsWith("--data-dir="));
const dataDirectory = dataArgument?.slice("--data-dir=".length);
if (!dataDirectory || !path.isAbsolute(dataDirectory) || dataDirectory.length > 4096) process.exit(64);

const engine = new HarnessEngine({
  dataDirectory,
  stepDelayMs: process.env.CLARK_TEST_STEP_DELAY_MS
});
await engine.initialize();

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
        const result = await engine.handle(request.command.method, request.command.payload, { requestId: request.requestId });
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
process.on("SIGTERM", () => {
  engine.close();
  process.exit(0);
});
