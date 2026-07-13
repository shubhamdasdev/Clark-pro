import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { normalizeWindowBounds, readWindowState, writeWindowState, writeWindowStateSync } from "../../src/window-state.mjs";

test("normalizes missing bounds into the visible work area", () => {
  assert.deepEqual(normalizeWindowBounds({}, { x: 0, y: 25, width: 1440, height: 875 }), {
    x: 130, y: 83, width: 1180, height: 760
  });
});

test("clamps off-screen and undersized saved bounds", () => {
  assert.deepEqual(normalizeWindowBounds({ x: -5000, y: 8000, width: 200, height: 100 }, { x: 100, y: 40, width: 1000, height: 700 }), {
    x: 100, y: 180, width: 780, height: 560
  });
});

test("writes state atomically with owner-only permissions and reads it back", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "clark-window-state-"));
  const file = path.join(directory, "nested", "shell-state.json");
  const expected = { activeSection: "canvas", windowBounds: { x: 1, y: 2, width: 900, height: 700 } };
  try {
    await writeWindowState(file, expected);
    assert.deepEqual(await readWindowState(file), expected);
    assert.match(await readFile(file, "utf8"), /"activeSection": "canvas"/);
    writeWindowStateSync(file, { ...expected, activeSection: "connections" });
    assert.equal((await readWindowState(file)).activeSection, "connections");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("treats a corrupt state file as recoverable", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "clark-window-state-"));
  const file = path.join(directory, "shell-state.json");
  try {
    await import("node:fs/promises").then(({ writeFile }) => writeFile(file, "not-json"));
    assert.deepEqual(await readWindowState(file), {});
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
