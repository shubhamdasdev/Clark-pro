# Clark Pro Versioned Contracts

This directory is the machine-readable Ground layer shared by Studio, Harness, Bridge, Connect, Memory, Relay, fixtures, import/export, and future SDKs. These files define product semantics; generated TypeScript types may implement them, but generated code does not become a second source of truth.

The pinned [`../contract-runtime/`](../contract-runtime/README.md) generates namespaced TypeScript for every schema, records source/output hashes, fails on drift, and proves immutable sequential event upcasting. Runtime validation continues to use these JSON Schemas.

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
| `schemas/capability-runtime.schema.json` | Effective authority, permission receipts, expiring capability leases, invocation receipts, and the first bundled MCP tool input/output contracts |
| `schemas/run-plan.schema.json` | Compiled immutable run plan with pinned revisions, steps, gates, egress, quote, and policy decisions |
| `schemas/project-fixture.schema.json` | Machine-readable project/canvas fixture with exact object state and lineage |
| `schemas/failure-fixtures.schema.json` | Expected safety/recovery behavior for failure, abuse, and policy cases |
| `schemas/ground-evidence-ledger.schema.json` | Ground requirement, proof class, result, limitation, blocker, release target, and attributable signoff records |
| `schemas/bridge-exchange.schema.json` | Scoped Bridge client, command intent, permission decision, domain event, durable receipts, idempotent replay, and Studio/resource equivalence |
| `schemas/skill-package.schema.json` | Agent Skill Class A/B/C package inventory, hashes, entrypoint, permissions, lifecycle, compatibility, tests, and sandbox limits |
| `schemas/skill-permission-receipt.schema.json` | Four-way requested/installed/workspace/run permission intersection with effective and denied authority |
| `schemas/tool-package.schema.json` | Governed external-tool source/license/SBOM/install/adapters/capabilities/converters/UI/tests/update/rollback lifecycle |
| `schemas/mcp-conformance-plan.schema.json` | Two-sided MCP host/Bridge cases, ownership, severity, automation, disposition, evidence, and release-blocking policy |
| `schemas/harness-ipc.schema.json` | Private Studio/Harness requests, responses, events, deadlines, run summaries, and exact-version approval commands |

## Versioning rules

1. Every persisted object carries a positive integer `schemaVersion`.
2. Additive optional fields may remain within the same schema version.
3. Removing a field, changing meaning, narrowing accepted values, or changing an invariant requires a new version and migration/upcaster.
4. Events are immutable. An event payload is interpreted under the schema version recorded when it was written.
5. Consumers must reject unknown required semantics; they may preserve unknown optional extension data only in explicitly named `extensions` objects.
6. A loop, capability, policy, skill, Tool Pack, and artifact version is pinned by ID + revision, not by mutable “latest.”
7. JSON numbers are not used for currency. Money uses integer micros and an ISO-style currency code.
8. Secrets are forbidden. Schemas permit opaque credential references, never raw keys or tokens.

## Compatibility policy

- The event catalog states the owning aggregate and compatibility class for each event.
- Upcasters transform old payloads into the current in-memory interpretation without rewriting historical events.
- Downcasting is not assumed. Export includes original schemas or declared compatible schema IDs.
- Bridge and capability clients negotiate supported contract versions and fail with an explicit compatibility error.
- A fixture is valid only when JSON Schema validation and the semantic conformance rules below both pass.

## Semantic conformance beyond JSON Schema

JSON Schema proves shape, not graph or security truth. The conformance runner also proves:

- IDs and event IDs are unique within their scope;
- aggregate versions increase monotonically;
- event type exists in `event-catalog.json` and payload validates against its referenced definition;
- node/port/edge references resolve and data/control cycles are allowed only inside declared loop semantics;
- every operator resolves to a pinned capability revision;
- permission, credential, network, sensitivity, and egress intersections are non-empty;
- every paid/mutating step has quote, budget, intent, idempotency/reconciliation, and approval behavior;
- every publication references one artifact version and account connection;
- every active memory or skill revision references a promotion event;
- every active Tool Pack resolves to immutable source/artifact hashes, reviewed legal/supply-chain evidence, at least one adapter and capability, compatible converters/UI boundaries, and passing activation/rollback gates;
- the compiled run plan contains no unresolved capability, schema, policy, or approval ambiguity.

## Directory policy

Fixtures are representative evidence, not production implementation. They must use the same contracts that production will use and may not introduce prototype-only semantics. Negative fixtures are expected to fail for one named reason so tests can prove the validator is not merely accepting everything.

## Verification

```bash
npm install
npm run verify
npm audit --audit-level=moderate
```

Verify generated implementation types and migrations separately:

```bash
npm --prefix ../contract-runtime ci
npm --prefix ../contract-runtime run verify
npm --prefix ../contract-runtime audit --audit-level=moderate
```

The verifier performs draft-2020 JSON Schema checks and semantic checks for event catalog membership/payload references, aggregate versions, exact fixture count, object/edge/port resolution, graph and run-plan cycles, nested loops, capability/action/permission alignment, Tool Pack source/interface/ladder/component/readiness truth, egress references, human gates, publication idempotency/reconciliation, Bridge scope/actor/intent/receipt/replay/state equivalence, budget bounds, threat/event references, the Ground evidence ledger, secret-key prohibition, and expected negative-fixture rejection.

Current checked fixture evidence:

- 18 schema files, including governed capability-runtime, Tool Package, and private Harness IPC contracts plus an honestly upstream-blocked OpenCut candidate;
- 62 event types and 10 representative payload-bearing events, including explicit capability permission/lease, governed memory retrieval, and Tool Pack lifecycle transitions;
- 10 capability manifests, including a source-pinned zero-egress MCP idea inspector;
- 3 loops, an 11-step Full-Week plan, and a 4-step Idea-to-Approved-Text plan;
- exactly 50 project objects and 46 lineage edges;
- 11 failure/abuse cases referencing 16 threat IDs, including Tool Pack substitution and unreviewed UI-origin expansion;
- 1 accepted Bridge capture/replay exchange plus 5 hostile semantic mutations rejected;
- 2 governed skill packages and 1 four-way effective-permission receipt;
- 1 immutable OpenCut Tool Pack candidate with zero installed authority, 1 active-without-adapter negative package, and 11 hostile activation mutations rejected;
- 36 owned MCP host/Bridge conformance cases, all executable or shared-contract and passing in the Ground harness;
- 18 schemas deterministically generate 18 namespaced TypeScript modules plus a barrel/manifest with zero drift;
- 1 historical event migration passes 5 immutable/validated/fail-closed upcaster tests, and a hostile schema mutation fails drift checking;
- 9 schema-invalid and 5 semantic-invalid documents rejected, plus lifecycle-only OpenCut activation and critical-MCP-nonblocking mutations rejected;
- zero dependency vulnerabilities at the configured audit threshold.

The ledger's additional fail-closed semantic checks and generated status live in [`../evidence/`](../evidence/README.md).
