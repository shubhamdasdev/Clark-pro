# Clark Contract Runtime

This package is the implementation bridge from Clark's canonical [JSON Schemas](../contracts/README.md) to TypeScript consumers and historical event projection. It prevents Studio, Harness, Connect, Bridge, Memory, Relay, and Kit from maintaining hand-written dialects.

## Authority model

```text
contracts/schemas/*.json       authoritative persisted/wire semantics
          │
          ├── Ajv runtime validation against the exact schema revision
          └── deterministic generation
                    │
                    └── contract-runtime/src/generated/*.ts
                              compile-time convenience only
```

Generated TypeScript never becomes a runtime validator or a second source of truth. A value crossing IPC, persistence, MCP, import/export, plugin, or remote boundaries still validates against its pinned JSON Schema.

## Pinned toolchain

- `json-schema-to-typescript@15.0.4`
- `typescript@7.0.2`
- `ajv@8.20.0` and `ajv-formats@3.0.1` for migration fixture validation

Generation uses a custom offline resolver. References under `https://schemas.clark.pro/v1/` can resolve only to files inside `contracts/schemas`; general HTTP resolution is disabled. Every generated file embeds its source hash, and `manifest.json` records source/output hashes, tool versions, resolver policy, and the generator implementation hash.

## Generated surface

All 16 canonical schemas produce 16 namespaced TypeScript modules, one namespace barrel, and one manifest. Consumers avoid helper-name collisions by importing namespaces:

```ts
import type * as Contracts from "@clark/contract-runtime/generated";

type Event = Contracts.DomainEvent.ClarkDomainEventEnvelope;
type Run = Contracts.RunPlan.ClarkCompiledRunPlan;
```

## Event evolution

Historical events are immutable. Projection/import performs explicit sequential upcasting in memory:

1. Read the stored `eventType` and `schemaVersion`.
2. Reject future versions.
3. Resolve exactly one `eventType@fromVersion` step.
4. Require the step to preserve event type and advance exactly one version.
5. Repeat until current.
6. Validate the current envelope and payload before projection.
7. Never rewrite the original event log; never assume downcasting.

The Ground fixture proves `source.captured@0 → @1`, including renamed envelope fields, capture-kind/classification mapping, content-hash normalization, import provenance, and current-schema validation. It also proves the input remains byte-equivalent, current events are cloned, missing steps fail, and future versions fail.

## Drift and verification

```bash
npm ci
npm run generate:check
npm run generate:negative
npm run verify
npm audit --audit-level=moderate
```

`generate:negative` copies schemas and generated output to a temporary directory, mutates `domain-event.schema.json`, and requires `--check` to fail on `domain-event.ts`. CI should run `npm run verify`; changing a schema without committing the exact generated diff fails.

## Change policy

- Schema changes land before generated changes in review order.
- Generator/compiler upgrades are pinned changes with a complete generated diff and fixture replay.
- Breaking semantics require a new schema version and one explicit upcaster per version step.
- Upcasters are pure deterministic functions: no I/O, clock, random, model, network, credentials, or mutable global state.
- Unknown event types, missing steps, future versions, and invalid current output fail closed into migration review/read-only recovery.

## Remaining evidence

The technical Ground gate passes, but real Domain and Chief Architect signoff is intentionally not fabricated. Production event-store replay, backup/restore migration preview, large-history performance, and rollback evidence belong to implementation strata.
