import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { Ajv2020 } from "ajv/dist/2020.js";
import type { AnySchema } from "ajv";
import type { FormatsPlugin } from "ajv-formats";
import { upcastDomainEvent } from "../src/upcasters/domain-event.js";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const root = moduleDir.includes(`${path.sep}.build${path.sep}`) ? path.resolve(moduleDir, "..", "..") : path.resolve(moduleDir, "..");
const require = createRequire(import.meta.url);
const addFormats = require("ajv-formats") as FormatsPlugin;
const read = <T = unknown>(relative: string): T => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8")) as T;
const original = read("fixtures/historical/source-captured.v0.json");
const expected = read("fixtures/historical/source-captured.v1.expected.json");
const historicalSchema = read<AnySchema>("fixtures/historical/source-captured.v0.schema.json");
const commonSchema = read<AnySchema>("../contracts/schemas/common.schema.json");
const envelopeSchema = read<AnySchema>("../contracts/schemas/domain-event.schema.json");
const payloadSchema = read<AnySchema>("../contracts/schemas/event-payloads.schema.json");

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(commonSchema);
ajv.addSchema(envelopeSchema);
ajv.addSchema(payloadSchema);
const validateHistorical = ajv.compile(historicalSchema);
const validateEnvelope = ajv.getSchema("https://schemas.clark.pro/v1/domain-event.schema.json");
const validatePayload = ajv.getSchema("https://schemas.clark.pro/v1/event-payloads.schema.json#/$defs/sourceCaptured");
const validateCurrentEvent = (event: Readonly<Record<string, unknown>>): boolean => validateEnvelope?.(event) === true && validatePayload?.(event.payload) === true;

const deepFreeze = <T>(value: T): T => {
  if (value && typeof value === "object") {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
};

test("source.captured@0 upcasts immutably to schema-valid @1", () => {
  assert.equal(validateHistorical(original), true, JSON.stringify(validateHistorical.errors));
  const before = JSON.stringify(original);
  deepFreeze(original);
  const actual = upcastDomainEvent(original, validateCurrentEvent);
  assert.equal(JSON.stringify(original), before, "historical event was mutated");
  assert.notEqual(actual, original, "upcaster returned the original object");
  assert.deepEqual(actual, expected);
  assert.equal(validateEnvelope?.(actual), true, JSON.stringify(validateEnvelope?.errors));
  assert.equal(validatePayload?.(actual.payload), true, JSON.stringify(validatePayload?.errors));
});

test("current events are cloned without rewriting history", () => {
  const current = deepFreeze(structuredClone(expected));
  const actual = upcastDomainEvent(current, validateCurrentEvent);
  assert.deepEqual(actual, current);
  assert.notEqual(actual, current);
});

test("unknown historical event types fail closed on a missing step", () => {
  const unknown = { schemaVersion: 0, eventType: "unknown.historical" };
  assert.throws(() => upcastDomainEvent(unknown, validateCurrentEvent), /Missing upcaster unknown\.historical@0/);
});

test("future event versions fail closed rather than downcast", () => {
  const future = { schemaVersion: 2, eventType: "source.captured" };
  assert.throws(() => upcastDomainEvent(future, validateCurrentEvent), /Future event schema version 2 is unsupported/);
});

test("destination validation failure rejects the upcasted value", () => {
  assert.throws(() => upcastDomainEvent(original, () => false), /Upcaster source\.captured@0 failed destination validation/);
});
