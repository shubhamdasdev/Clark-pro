import test from "node:test";
import assert from "node:assert/strict";
import { changedLineIndexes } from "../../src/renderer/comparison.mjs";

test("line comparison preserves order, duplicate, and exact-whitespace changes", () => {
  assert.deepEqual([...changedLineIndexes(["one", "two"], ["two", "one"])], [0]);
  assert.deepEqual([...changedLineIndexes(["same", "same"], ["same"])], [1]);
  assert.deepEqual([...changedLineIndexes(["exact "], ["exact"])], [0]);
  assert.deepEqual([...changedLineIndexes(["one", "inserted", "two"], ["one", "two"])], [1]);
});

test("large comparisons fail visibly without quadratic memory growth", () => {
  const target = Array.from({ length: 600 }, (_value, index) => `line ${index}`);
  const comparison = [...target];
  comparison[320] = "changed";
  assert.deepEqual([...changedLineIndexes(target, comparison)], [320]);
});
