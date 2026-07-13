# ADR-0021 — Generated Contracts and Event Upcasters

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Domain, Architecture, Quality

## Context

Clark's JSON Schemas define persisted, IPC, MCP, plugin, import/export, and remote semantics. Hand-written TypeScript types would drift across Studio, Harness, Connect, Bridge, Memory, Relay, and Kit. Historical events must remain readable without rewriting the immutable log or silently guessing at changed meaning.

## Decision

JSON Schema Draft 2020-12 remains authoritative. Generate namespaced TypeScript modules with pinned `json-schema-to-typescript`; validate runtime values with pinned Ajv against the exact schema revision. Commit generated output and a source/output hash manifest. CI regenerates in check mode and fails on drift.

Resolve Clark schema references offline from the checked-in schema directory. General HTTP resolution is forbidden during generation.

Use explicit pure event upcasters keyed by `eventType@fromVersion`. Each step must:

- preserve event type;
- advance exactly one integer schema version;
- perform no I/O, clock, randomness, model, network, credential, or global mutation;
- return a new value without modifying the stored event;
- validate under the destination envelope and payload schemas before projection.

Reject future versions, missing steps, invalid destination values, and attempted downcasts. Historical bytes remain unchanged; projection/import uses the current in-memory interpretation.

## Consequences

### Positive

- Every implementation surface consumes one generated contract family.
- Schema drift becomes a deterministic CI failure.
- Historical behavior is explicit, reviewable, testable, and replayable.
- Generator upgrades produce attributable diffs instead of silent type churn.

### Costs

- Generated files are committed and reviewed.
- Every breaking event change needs a sequential migration step and fixtures.
- Runtime validators remain necessary; TypeScript alone cannot enforce wire data.

## Rejected alternatives

- **Hand-written TypeScript as peer authority:** creates dialects and ambiguous ownership.
- **Generate JSON Schema from TypeScript:** reverses the already accepted cross-language contract authority.
- **Rewrite historical events in place:** destroys auditability and rollback.
- **Best-effort/default-filled migration:** hides missing semantics and corrupts projections.
- **Network resolution during generation:** makes builds non-hermetic and permits schema substitution.

## Invariants

1. Canonical schemas are the only persisted/wire authority.
2. Generated files carry source hashes and are never edited by hand.
3. Runtime boundaries validate data even when compile-time types exist.
4. Upcasting never mutates or rewrites the historical log.
5. No version gap, unknown future version, or invalid output is silently accepted.
6. Generator/compiler upgrades rerun all contracts, migration fixtures, and drift tests.

## Verification gates

- Every canonical schema has a deterministic generated module and manifest entry.
- Clean regeneration produces zero diff.
- A mutated source schema fails the drift check.
- Generated TypeScript compiles in strict mode.
- At least one historical event fixture upcasts to current envelope/payload validation.
- Input immutability, current cloning, missing step, future version, and invalid-output behavior are tested.
- Production replay/restore tests prove large-history migration, interruption recovery, and safe read-only failure.

## Evidence

- [`contract-runtime/`](../contract-runtime/README.md)
- [`contracts/`](../contracts/README.md)
- [json-schema-to-typescript](https://github.com/bcherny/json-schema-to-typescript)
- [TypeScript](https://www.typescriptlang.org/)

## Revisit triggers

- The generator cannot faithfully represent a required Draft 2020-12 construct.
- A cross-language schema compiler becomes necessary for Clark Kit.
- TypeScript compiler/tooling changes break deterministic output or namespace consumption.
- Event volumes require compiled/lazy migration beyond the sequential registry without weakening auditability.
