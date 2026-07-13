import test from "node:test";
import assert from "node:assert/strict";
import { HarnessChannelGuard } from "../../src/harness-channel-guard.mjs";
import { minimalHarnessEnvironment, sanitizeDiagnostic } from "../../src/harness-boundary-utils.mjs";

const readyEvent = {
  schemaVersion: 1,
  kind: "event",
  sequence: 1,
  eventType: "harness.ready",
  emittedAt: "2026-07-12T00:00:00.000Z",
  payload: { protocolVersion: 1, recoveredRuns: 0 }
};

test("child channel rejects unknown and mismatched response identities", () => {
  const guard = new HarnessChannelGuard();
  const pending = new Map([["request.expected", { method: "harness.status" }]]);
  const base = {
    schemaVersion: 1,
    kind: "response",
    method: "harness.status",
    ok: true,
    result: {
      state: "ready",
      protocolVersion: 1,
      database: { journalMode: "wal", eventCount: 0 },
      activeRuns: 0,
      recoveredRuns: 0
    }
  };
  assert.throws(() => guard.accept({ ...base, requestId: "request.stale" }, pending), /unknown or mismatched response ID/);
  assert.throws(() => guard.accept({ ...base, requestId: "request.expected", method: "run.get" }, pending), /unknown or mismatched response ID/);
});

test("child channel rejects replayed or reordered event sequences", () => {
  const guard = new HarnessChannelGuard();
  const pending = new Map();
  assert.equal(guard.accept(readyEvent, pending).sequence, 1);
  assert.throws(() => guard.accept(readyEvent, pending), /replayed or reordered/);
  assert.throws(() => guard.accept({ ...readyEvent, sequence: 3 }, pending), /replayed or reordered/);
  guard.reset();
  assert.equal(guard.accept(readyEvent, pending).sequence, 1);
});

test("utility environment is allowlisted and diagnostics redact credential-like material", () => {
  assert.deepEqual(minimalHarnessEnvironment({
    LANG: "en_GB.UTF-8",
    NODE_ENV: "production",
    HOME: "/private/user",
    PATH: "/dangerous",
    GITHUB_TOKEN: "should-not-cross"
  }), {
    LANG: "en_GB.UTF-8",
    LC_ALL: "en_GB.UTF-8",
    NODE_ENV: "production"
  });
  assert.equal(sanitizeDiagnostic("Bearer abcdefghijklm"), "[redacted]");
  assert.equal(sanitizeDiagnostic("ghp_abcdefghijklm"), "[redacted]");
});
