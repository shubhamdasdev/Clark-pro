import { randomUUID } from "node:crypto";
import { createContractValidator, ContractValidationError } from "@clark/contract-runtime/validator";

export const HARNESS_PROTOCOL_VERSION = 1;
export const MAX_MESSAGE_BYTES = 64 * 1024;
export const MAX_IN_FLIGHT_REQUESTS = 32;
export const DEFAULT_REQUEST_TIMEOUT_MS = 5_000;

const validator = createContractValidator();

export class HarnessProtocolError extends Error {
  constructor(code, message, retryable = false) {
    super(message);
    this.name = "HarnessProtocolError";
    this.code = code;
    this.retryable = retryable;
  }
}

export function messageSize(message) {
  try {
    return Buffer.byteLength(JSON.stringify(message), "utf8");
  } catch {
    throw new HarnessProtocolError("invalid_request", "Message is not serializable");
  }
}

export function assertMessage(message) {
  if (messageSize(message) > MAX_MESSAGE_BYTES) {
    throw new HarnessProtocolError("invalid_request", `Message exceeds ${MAX_MESSAGE_BYTES} bytes`);
  }
  try {
    return validator.validateHarnessMessage(message);
  } catch (error) {
    if (error instanceof ContractValidationError) {
      throw new HarnessProtocolError("invalid_request", error.message);
    }
    throw error;
  }
}

export function extractPortMessage(value) {
  return value && value.kind === undefined && value.data?.kind ? value.data : value;
}

export function createRequest(method, payload, options = {}) {
  const requestId = options.requestId ?? `request.${randomUUID()}`;
  const timeoutMs = options.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
  const request = {
    schemaVersion: HARNESS_PROTOCOL_VERSION,
    kind: "request",
    requestId,
    deadlineAt: options.deadlineAt ?? new Date(Date.now() + timeoutMs).toISOString(),
    command: { method, payload }
  };
  return assertMessage(request);
}

export function createSuccessResponse(request, result) {
  return assertMessage({
    schemaVersion: HARNESS_PROTOCOL_VERSION,
    kind: "response",
    requestId: request.requestId,
    method: request.command.method,
    ok: true,
    result
  });
}

export function createErrorResponse(request, error) {
  const knownCodes = new Set(["invalid_request", "deadline_exceeded", "not_found", "conflict", "policy_denied", "not_ready", "internal"]);
  return assertMessage({
    schemaVersion: HARNESS_PROTOCOL_VERSION,
    kind: "response",
    requestId: request?.requestId ?? "request.invalid",
    method: request?.command?.method ?? "harness.status",
    ok: false,
    error: {
      code: knownCodes.has(error?.code) ? error.code : "internal",
      message: String(error?.message ?? "Harness request failed").slice(0, 1000),
      retryable: Boolean(error?.retryable)
    }
  });
}

export function createProtocolEvent(sequence, eventType, payload, emittedAt = new Date().toISOString()) {
  return assertMessage({
    schemaVersion: HARNESS_PROTOCOL_VERSION,
    kind: "event",
    sequence,
    eventType,
    emittedAt,
    payload
  });
}

export function assertRequestFresh(request, now = Date.now()) {
  if (Date.parse(request.deadlineAt) <= now) {
    throw new HarnessProtocolError("deadline_exceeded", "Harness request deadline elapsed", true);
  }
}

export { validator as contractValidator };
