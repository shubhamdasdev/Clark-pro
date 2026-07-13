# Clark Pro Versioned Contracts

This directory is the machine-readable Ground layer shared by Studio, Harness, Bridge, Connect, Memory, Relay, fixtures, import/export, and future SDKs. These files define product semantics; generated TypeScript/Zod types may implement them, but generated code does not become a second source of truth.

## Contract set

| Contract | Purpose |
|---|---|
| `schemas/common.schema.json` | Shared identifiers, money, actors, artifact/evidence references, sensitivity, permissions, and hashes |
| `schemas/domain-event.schema.json` | Immutable event envelope used by local state, export, synchronization, and receipts |
| `schemas/event-stream.schema.json` | Ordered fixture/export container for event envelopes |
| `schemas/event-catalog.schema.json` | Schema for the authoritative list of event types and compatibility rules |
| `schemas/event-payloads.schema.json` | Version 1 payload shapes referenced by the event catalog |
| `event-catalog.json` | Event ownership, aggregate, schema version, sensitivity, mutation class, and payload reference |
| `schemas/loop-definition.schema.json` | Durable loop entry/success contracts, typed graph, budgets, permissions, checkpoints, recovery, evaluation, and reflection |
| `schemas/capability-manifest.schema.json` | Transport-neutral capability lifecycle, schemas, permissions, credentials, egress, async/idempotency, cost, reliability, and UI metadata |
| `schemas/run-plan.schema.json` | Compiled immutable run plan with pinned revisions, steps, gates, egress, quote, and policy decisions |
| `schemas/project-fixture.schema.json` | Machine-readable project/canvas fixture with exact object state and lineage |
| `schemas/failure-fixtures.schema.json` | Expected safety/recovery behavior for failure, abuse, and policy cases |

## Versioning rules

1. Every persisted object carries a positive integer `schemaVersion`.
2. Additive optional fields may remain within the same schema version.
3. Removing a field, changing meaning, narrowing accepted values, or changing an invariant requires a new version and migration/upcaster.
4. Events are immutable. An event payload is interpreted under the schema version recorded when it was written.
5. Consumers must reject unknown required semantics; they may preserve unknown optional extension data only in explicitly named `extensions` objects.
6. A loop, capability, policy, skill, and artifact version is pinned by ID + revision, not by mutable “latest.”
7. JSON numbers are not used for currency. Money uses integer micros and an ISO-style currency code.
8. Secrets are forbidden. Schemas permit opaque credential references, never raw keys or tokens.

## Compatibility policy

- The event catalog states the owning aggregate and compatibility class for each event.
- Upcasters transform old payloads into the current in-memory interpretation without rewriting historical events.
- Downcasting is not assumed. Export includes original schemas or declared compatible schema IDs.
- Bridge and capability clients negotiate supported contract versions and fail with an explicit compatibility error.
- A fixture is valid only when JSON Schema validation and the semantic conformance rules below both pass.

## Semantic conformance beyond JSON Schema

JSON Schema proves shape, not graph or security truth. The future conformance runner must also prove:

- IDs and event IDs are unique within their scope;
- aggregate versions increase monotonically;
- event type exists in `event-catalog.json` and payload validates against its referenced definition;
- node/port/edge references resolve and data/control cycles are allowed only inside declared loop semantics;
- every operator resolves to a pinned capability revision;
- permission, credential, network, sensitivity, and egress intersections are non-empty;
- every paid/mutating step has quote, budget, intent, idempotency/reconciliation, and approval behavior;
- every publication references one artifact version and account connection;
- every active memory or skill revision references a promotion event;
- the compiled run plan contains no unresolved capability, schema, policy, or approval ambiguity.

## Directory policy

Fixtures are representative evidence, not production implementation. They must use the same contracts that production will use and may not introduce prototype-only semantics. Negative fixtures are expected to fail for one named reason so tests can prove the validator is not merely accepting everything.

## Verification

```bash
npm install
npm run verify
npm audit --audit-level=moderate
```

The verifier performs draft-2020 JSON Schema checks and semantic checks for event catalog membership/payloads, aggregate versions, exact fixture count, object/edge/port resolution, graph and run-plan cycles, nested loops, capability/action/permission alignment, egress references, human gates, publication idempotency/reconciliation, budget bounds, threat/event references, secret-key prohibition, and expected negative-fixture rejection.

Current checked fixture evidence:

- 10 schema files;
- 52 event types and 10 representative payload-bearing events;
- 8 capability manifests;
- 2 loops and an 11-step compiled run plan;
- exactly 50 project objects and 46 lineage edges;
- 10 failure/abuse cases referencing 15 threat IDs;
- 3 schema-invalid and 3 semantic-invalid fixtures rejected;
- zero dependency vulnerabilities at the configured audit threshold.
