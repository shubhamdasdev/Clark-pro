import { EventEmitter } from "node:events";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { MessageChannelMain, utilityProcess } from "electron";
import { createRequest, extractPortMessage, HARNESS_PROTOCOL_VERSION, MAX_IN_FLIGHT_REQUESTS } from "@clark-pro/harness/protocol";
import { minimalHarnessEnvironment, sanitizeDiagnostic } from "./harness-boundary-utils.mjs";
import { HarnessChannelGuard } from "./harness-channel-guard.mjs";

const RESTART_DELAYS_MS = [50, 250, 1_000];

export class HarnessSupervisor extends EventEmitter {
  constructor({ entryPath, dataDirectory, runtimeExecutable, environment = minimalHarnessEnvironment(), requestTimeoutMs = 5_000 } = {}) {
    super();
    if (!path.isAbsolute(entryPath) || !path.isAbsolute(dataDirectory) || !path.isAbsolute(runtimeExecutable)) throw new TypeError("Harness paths must be absolute");
    this.entryPath = entryPath;
    this.dataDirectory = dataDirectory;
    this.runtimeExecutable = runtimeExecutable;
    this.environment = Object.freeze({ ...environment });
    this.requestTimeoutMs = requestTimeoutMs;
    this.state = "stopped";
    this.pending = new Map();
    this.lastDiagnostics = [];
    this.restartAttempt = 0;
    this.expectedExit = false;
    this.lastEvent = undefined;
    this.channelGuard = new HarnessChannelGuard();
    fs.mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
  }

  async start() {
    if (this.state === "ready") return;
    if (this.readyPromise) return this.readyPromise;
    this.expectedExit = false;
    this.state = this.restartAttempt ? "recovering" : "starting";
    this.readyPromise = new Promise((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });
    this.spawn();
    return this.readyPromise;
  }

  spawn() {
    const child = utilityProcess.fork(this.entryPath, [`--data-dir=${this.dataDirectory}`, `--runtime=${this.runtimeExecutable}`], {
      env: this.environment,
      cwd: this.dataDirectory,
      stdio: "pipe",
      serviceName: "Clark Harness",
      allowLoadingUnsignedLibraries: false,
      disclaim: false
    });
    this.child = child;
    this.captureDiagnostics(child.stdout, "stdout");
    this.captureDiagnostics(child.stderr, "stderr");
    child.once("spawn", () => {
      if (this.child !== child) return;
      const { port1, port2 } = new MessageChannelMain();
      this.port = port2;
      this.channelGuard.reset();
      port2.on("message", (event) => this.handleMessage(extractPortMessage(event)));
      port2.on("close", () => {
        if (!this.expectedExit && this.child === child) this.failPending("Harness channel closed", true);
      });
      port2.start();
      child.postMessage({ kind: "clark.harness.connect", protocolVersion: HARNESS_PROTOCOL_VERSION }, [port1]);
    });
    child.once("exit", (code) => this.handleExit(child, code));
    child.once("error", (_type, location) => this.recordDiagnostic("error", `fatal utility error at ${location}`));
  }

  async request(method, payload, { timeoutMs = this.requestTimeoutMs } = {}) {
    if (this.state !== "ready") await this.start();
    if (this.pending.size >= MAX_IN_FLIGHT_REQUESTS) throw createClientError("not_ready", "Harness backpressure limit reached", true);
    const request = createRequest(method, payload, { requestId: `request.${randomUUID()}`, timeoutMs });
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(request.requestId);
        reject(createClientError("deadline_exceeded", `Harness ${method} timed out`, true));
      }, timeoutMs + 25);
      this.pending.set(request.requestId, { method, resolve, reject, timer });
      try {
        this.port.postMessage(request);
      } catch (error) {
        clearTimeout(timer);
        this.pending.delete(request.requestId);
        reject(createClientError("not_ready", error.message, true));
      }
    });
  }

  handleMessage(rawMessage) {
    let message;
    try {
      message = this.channelGuard.accept(rawMessage, this.pending);
    } catch (error) {
      this.protocolFault(error.message);
      return;
    }
    if (message.kind === "event") {
      this.lastEvent = message;
      if (message.eventType === "harness.ready") {
        this.state = "ready";
        this.restartAttempt = 0;
        this.resolveReady?.();
        this.readyPromise = undefined;
        this.resolveReady = undefined;
        this.rejectReady = undefined;
      }
      this.emit("event", message);
      return;
    }
    const pending = this.pending.get(message.requestId);
    clearTimeout(pending.timer);
    this.pending.delete(message.requestId);
    if (message.ok) pending.resolve(message.result);
    else pending.reject(createClientError(message.error.code, message.error.message, message.error.retryable));
  }

  protocolFault(reason) {
    this.recordDiagnostic("protocol", reason);
    this.failPending("Harness protocol fault", true);
    this.child?.kill();
  }

  handleExit(child, code) {
    if (this.child !== child) return;
    this.child = undefined;
    this.port?.close();
    this.port = undefined;
    this.failPending(`Harness exited with code ${code}`, true);
    if (this.expectedExit) {
      this.state = "stopped";
      return;
    }
    const delay = RESTART_DELAYS_MS[this.restartAttempt];
    if (delay === undefined) {
      this.state = "failed";
      this.rejectReady?.(createClientError("not_ready", "Harness restart budget exhausted", false));
      this.readyPromise = undefined;
      this.emit("failed", { code });
      return;
    }
    this.restartAttempt += 1;
    this.state = "recovering";
    this.emit("recovering", { reason: `Utility process exited with code ${code}`, restartAttempt: this.restartAttempt });
    if (!this.readyPromise) {
      this.readyPromise = new Promise((resolve, reject) => {
        this.resolveReady = resolve;
        this.rejectReady = reject;
      });
    }
    setTimeout(() => this.spawn(), delay);
  }

  failPending(message, retryable) {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(createClientError("not_ready", message, retryable));
    }
    this.pending.clear();
  }

  captureDiagnostics(stream, source) {
    stream?.on("data", (chunk) => this.recordDiagnostic(source, chunk.toString("utf8")));
  }

  recordDiagnostic(source, text) {
    const sanitized = sanitizeDiagnostic(text);
    if (!sanitized) return;
    this.lastDiagnostics.push({ source, text: sanitized, observedAt: new Date().toISOString() });
    if (this.lastDiagnostics.length > 20) this.lastDiagnostics.shift();
  }

  stop() {
    this.expectedExit = true;
    this.failPending("Harness stopped", false);
    this.port?.close();
    this.port = undefined;
    this.child?.kill();
    this.child = undefined;
    this.state = "stopped";
  }

  killForTest() {
    if (process.env.CLARK_E2E !== "1") throw new Error("Harness test kill is unavailable");
    return this.child?.kill() ?? false;
  }
}

function createClientError(code, message, retryable) {
  return Object.assign(new Error(message), { code, retryable });
}
