import { spawn } from "node:child_process";
import { PassThrough } from "node:stream";
import { deserializeMessage, serializeMessage } from "@modelcontextprotocol/sdk/shared/stdio.js";

const MAX_MESSAGE_BYTES = 64 * 1024;

export class ExactEnvironmentStdioTransport {
  constructor({ command, args = [], env, cwd }) {
    this.command = command;
    this.args = [...args];
    this.env = Object.freeze({ ...env });
    this.cwd = cwd;
    this.stderr = new PassThrough();
    this.buffer = Buffer.alloc(0);
  }

  async start() {
    if (this.child) throw new Error("Exact stdio transport already started");
    await new Promise((resolve, reject) => {
      const child = spawn(this.command, this.args, {
        env: this.env,
        cwd: this.cwd,
        shell: false,
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe"]
      });
      this.child = child;
      child.once("spawn", resolve);
      child.once("error", (error) => {
        if (this.child === child) this.child = undefined;
        reject(error);
      });
      child.stdout.on("data", (chunk) => this.consume(chunk));
      child.stdout.on("error", (error) => this.fault(error));
      child.stdin.on("error", (error) => this.fault(error));
      child.stderr.pipe(this.stderr);
      child.once("close", () => {
        if (this.child === child) this.child = undefined;
        this.onclose?.();
      });
    });
  }

  get pid() {
    return this.child?.pid ?? null;
  }

  consume(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    if (this.buffer.length > MAX_MESSAGE_BYTES && this.buffer.indexOf(0x0a) === -1) return this.fault(new Error("MCP stdout frame exceeded 64 KiB"));
    while (true) {
      const newline = this.buffer.indexOf(0x0a);
      if (newline === -1) break;
      const line = this.buffer.subarray(0, newline + 1);
      this.buffer = this.buffer.subarray(newline + 1);
      if (line.length > MAX_MESSAGE_BYTES) return this.fault(new Error("MCP stdout frame exceeded 64 KiB"));
      try {
        this.onmessage?.(deserializeMessage(line.toString("utf8")));
      } catch (error) {
        return this.fault(error);
      }
    }
  }

  fault(error) {
    this.onerror?.(error);
    this.child?.kill("SIGTERM");
  }

  async send(message) {
    if (!this.child?.stdin) throw new Error("MCP stdio transport is not connected");
    const encoded = serializeMessage(message);
    if (Buffer.byteLength(encoded, "utf8") > MAX_MESSAGE_BYTES) throw new Error("MCP stdin frame exceeded 64 KiB");
    await new Promise((resolve, reject) => this.child.stdin.write(encoded, (error) => error ? reject(error) : resolve()));
  }

  async close() {
    const child = this.child;
    this.child = undefined;
    this.buffer = Buffer.alloc(0);
    if (!child) return;
    const closed = new Promise((resolve) => child.once("close", resolve));
    child.stdin?.end();
    await Promise.race([closed, delay(500)]);
    if (child.exitCode === null && child.signalCode === null) child.kill("SIGTERM");
    await Promise.race([closed, delay(500)]);
    if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
  }
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds).unref());
}
