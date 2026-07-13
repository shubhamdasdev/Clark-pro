# Clark Pro — Implementation Contracts and Technology Stack

**Status:** Authoritative v2 · July 2026
**Architecture source:** [architecture.md](../architecture.md)
**Machine-readable contracts:** [contracts/](../contracts/README.md)

## 1. Stack

| Layer | Choice |
|---|---|
| Mac desktop | Electron, signed/notarized, hardened renderer |
| Renderer | React, TypeScript, Vite, React Flow, Zustand |
| Harness | Isolated TypeScript utility process/local daemon |
| Validation | Canonical JSON Schema 2020-12, generated TypeScript, and Ajv runtime validation |
| Persistence | SQLite/WAL through repositories; immutable events + projections |
| Assets | Content-addressed local store with checksums and previews |
| Secrets | macOS Keychain credential broker |
| Models | Provider-neutral model gateway; structured calls and bounded agents |
| MCP | Official TypeScript SDK; stdio + Streamable HTTP; client and server |
| Search | SQLite FTS; vector extension only for bounded similarity retrieval |
| Media | ffmpeg/ffprobe isolated workers |
| Packaging | pnpm workspace, reproducible builds, DMG, notarization, auto-update rollback |

No Next.js server, Redis, Postgres, Kubernetes, or required cloud service is part of the Mac canonical runtime.

## 2. Monorepo

```text
apps/desktop
  src/main/           Electron lifecycle and native integration
  src/preload/        allowlisted typed IPC
  src/renderer/       Focus, Canvas, Timeline, Review, Library, Memory
apps/bridge-cli       setup, doctor, export, MCP registration
services/harness      command handlers, projections, supervisors
services/worker       optional scoped remote worker
packages/domain       events, aggregates, schemas, invariants
packages/graph        compiler, port typing, staleness, layout metadata
packages/run-engine   plans, steps, jobs, checkpoints, reconciliation
packages/memory       creator model, retrieval, reflection, forgetting
packages/skills       Agent Skills packages, trust, tests, revisions
packages/policy       permissions, budgets, disclosure, confidentiality
packages/model-gateway
packages/capabilities
packages/mcp-host
packages/mcp-server
packages/connectors
packages/media
packages/plugin-sdk    Tool Pack manifests, adapters, converters, safe UI, tests
packages/observability
schemas/
skills/
templates/
tool-packages/
```

## 3. Command and Event Contract

Every state change enters through a command envelope:

```ts
type CommandEnvelope<T> = {
  commandId: string;
  schemaVersion: string;
  workspaceId: string;
  actor: { type: "human" | "agent" | "client" | "system"; id: string };
  intentId?: string;
  expectedAggregateVersion?: number;
  payload: T;
};
```

Accepted commands append events:

```ts
type DomainEvent<T> = {
  eventId: string;
  eventType: string;
  schemaVersion: string;
  workspaceId: string;
  aggregateType: string;
  aggregateId: string;
  aggregateVersion: number;
  actor: CommandEnvelope<unknown>["actor"];
  commandId: string;
  occurredAt: string;
  payload: T;
};
```

Optimistic aggregate versions prevent accidental overwrites. Projection checkpoints permit deterministic rebuild.

## 4. Primary Tables

```text
events
  event_id, event_type, schema_version, workspace_id,
  aggregate_type, aggregate_id, aggregate_version,
  actor_json, command_id, occurred_at, payload_json

projection_checkpoints
  projection_name, event_offset, schema_version, updated_at

workspaces
  id, name, policy_set_id, creator_model_id, created_at, archived_at

projects
  id, workspace_id, name, kind, status, created_at, archived_at

graphs
  id, project_id, revision, entry_contract_json, success_contract_json

graph_objects
  id, graph_id, object_kind, type_ref, position_json, config_json

graph_edges
  id, graph_id, edge_kind, from_object_id, from_port,
  to_object_id, to_port

artifacts
  id, workspace_id, project_id, artifact_type,
  canonical_version_id, status, created_at

artifact_versions
  id, artifact_id, sequence, content_json, content_hash,
  provenance_json, created_by, created_at

asset_objects
  hash, mime_type, byte_size, metadata_json, local_path, created_at

artifact_assets
  artifact_version_id, asset_hash, role

decisions
  id, workspace_id, project_id, subject_ref, decision_type,
  actor_json, alternatives_json, evidence_refs_json, outcome_json, created_at

runs
  id, workspace_id, graph_id, graph_revision, status,
  policy_snapshot_json, plan_json, started_at, ended_at

run_steps
  id, run_id, object_id, attempt, state, input_hash,
  capability_revision, external_job_id, checkpoint_json,
  started_at, ended_at, error_json

tool_receipts
  id, run_step_id, intent_id, capability_id, provider,
  request_hash, result_ref, cost_json, permission_receipt_json, created_at

account_connections
  id, workspace_id, provider, external_account_id,
  credential_ref, scopes_json, health, revoked_at

publications
  id, workspace_id, artifact_version_id, account_connection_id,
  intent_id, state, scheduled_at, provider_receipt_json,
  live_url, last_observed_at

observations
  id, publication_id, observation_type, schema_version,
  observed_at, freshness_at, values_json, source, missingness_json

memory_items
  id, creator_model_id, memory_type, scope_json, status,
  sensitivity, active_revision_id

memory_revisions
  id, memory_item_id, statement, confidence, evidence_refs_json,
  retrieval_policy, valid_from, valid_until, created_at

memory_retrievals
  id, task_id, memory_revision_id, influence, created_at

skill_packages
  id, source, name, trust_level, active_revision_id

skill_revisions
  id, package_id, source_hash, manifest_json, permission_json,
  test_result_json, state, created_at

tool_packages
  id, publisher_id, active_revision_id, lifecycle_state, installed,
  created_at, updated_at

tool_package_revisions
  id, package_id, revision, source_revision, source_hash, manifest_hash,
  license_json, supply_chain_json, compatibility_json, state, created_at

tool_package_components
  package_revision_id, component_kind, component_id, component_revision,
  content_hash, activation_state

tool_package_evidence
  package_revision_id, evidence_kind, result, artifact_ref,
  observed_at, reviewer_ref

credentials are not stored here; credential_ref points to Keychain.
```

Arrays shown above are JSON columns or normalized join tables as specified—not fictional SQLite array types.

## 5. Artifact Provenance

Every artifact version records:

```json
{
  "inputVersions": ["artv_1", "artv_2"],
  "sourceRefs": ["source_1"],
  "memoryRevisionRefs": ["memrev_3"],
  "skillRevisionRef": "skillrev_4",
  "toolPackageRevisionRefs": ["toolpackrev_1"],
  "capabilityRevisionRefs": ["caprev_2"],
  "model": { "provider": "...", "id": "..." },
  "runId": "run_1",
  "runStepId": "step_2",
  "humanEdit": true
}
```

Staleness compares current upstream canonical version IDs and operator configuration with the provenance input fingerprint.

## 6. Run State Machines

### Run

```text
planned → waiting_approval → queued → running
running → paused | waiting_external | waiting_approval | completed
running → cancelling → cancelled
running → failed | needs_reconciliation
paused/failed/needs_reconciliation → running
```

### Step

```text
pending → ready → queued → running
running → streaming | waiting_external | waiting_approval
running → completed | failed | cancelled | orphaned
failed/orphaned → retrying → running
```

### Publication

```text
draft → approved → scheduled → submitting → submitted → verified
submitting/submitted → needs_reconciliation
scheduled/submitting → cancelled
any pre-verified state → failed | exported
verified → removed
```

Blind retry is prohibited from `needs_reconciliation`.

## 7. Typed IPC

Renderer calls a narrow API exposed by preload:

```text
workspace.list/get/create/import/export
project.list/get/create
graph.get/applyCommand/dryRun
artifact.get/createVersion/selectCanonical/export
run.plan/start/pause/resume/cancel/getEvents
review.list/get/submitDecision
timeline.query/reschedule
memory.search/get/propose/decide/forget
skill.list/inspect/install/decide/rollback
connection.list/connect/revoke/health
system.capture/diagnostics/update
```

IPC payloads are schema-validated on both sides. Renderer never passes executable command strings.

## 8. Capability Interface

```ts
interface CapabilityAdapter<I, O> {
  manifest: CapabilityManifest;
  discover?(ctx: DiscoveryContext): Promise<DiscoveryResult>;
  authorize?(ctx: AuthorizationContext): Promise<CredentialReference>;
  health(ctx: CapabilityContext): Promise<HealthResult>;
  validate(input: I, ctx: CapabilityContext): Promise<ValidationResult>;
  quote?(input: I, ctx: CapabilityContext): Promise<Quote>;
  execute(input: I, ctx: ExecutionContext): Promise<O | JobReceipt>;
  progress?(job: JobReceipt, ctx: CapabilityContext): Promise<JobStatus<O>>;
  cancel?(job: JobReceipt, ctx: CapabilityContext): Promise<CancelResult>;
  observe?(receipt: ToolReceipt, ctx: CapabilityContext): Promise<Observation[]>;
  reconcile?(intent: MutationIntent, ctx: CapabilityContext): Promise<Reconciliation>;
  revoke?(credential: CredentialReference): Promise<void>;
}
```

MCP, API, CLI, local, and browser adapters implement this interface.

## 9. Loop Definition

```yaml
id: clark.loop.full-week
version: 1.0.0
entryContract: schemas/full-week-input.json
successContract: schemas/full-week-result.json
graph: graphs/full-week.json
policyDefaults:
  approval: before-external-mutation
  memoryPromotion: always-review
  skillPromotion: always-review
budgets:
  usd: 50
  wallClockMinutes: 180
checkpoints:
  - after-research
  - after-angle-decision
  - before-publication
evaluation:
  rubric: rubrics/full-week.yaml
reflection:
  enabled: true
  output: proposal-only
```

## 10. Memory Retrieval Packet

```ts
type ContextPacket = {
  taskId: string;
  constitution: MemoryReference[];
  policies: PolicyReference[];
  semantic: MemoryReference[];
  episodes: MemoryReference[];
  performance: {
    summaries: EvidenceSummary[];
    sampleWarnings: string[];
  };
  skill?: SkillReference;
  exclusions: { reason: string; count: number }[];
  tokenBudget: number;
};
```

Raw secret values and `never-send-to-model` items cannot enter packets.

## 11. Clark Bridge Surface

Clark Bridge translates MCP calls into the same command/query layer used by Studio.

- Mutations require scoped client identity, workspace, intent ID, and policy.
- Resources return stable URIs and revision metadata.
- Long work returns MCP Tasks when negotiated or Clark `jobId` receipts.
- Client disconnect never cancels work unless requested by policy.
- `localhost` is the default bind; remote exposure requires TLS, scoped auth, and explicit user action.

## 12. Observability

- Structured logs with secret redaction.
- Run traces keyed by run/step/tool receipt.
- Provider latency, reliability, retry, cost, and reconciliation metrics.
- Projection lag and database health.
- Connector conformance results.
- Diagnostics export with user preview and sensitive-field removal.

No telemetry leaves the Mac without opt-in.

## 13. Test Architecture

### Contract tests

- schemas and migrations;
- event upcasting;
- projection rebuild;
- capability adapter conformance;
- MCP client/server compatibility;
- skill validation and permission intersection.

### Deterministic fixtures

- fake model provider;
- recorded MCP servers;
- fake async media provider;
- Postiz sandbox/recorded responses;
- fake platform publication with ambiguous failure;
- representative Full-Week workspace.

### Chaos tests

- kill process during every run/publication state;
- network loss and duplicate response;
- expired/revoked credential;
- provider schema change;
- disk-full and corrupt asset;
- projection rebuild during update;
- malicious skill or MCP output.

### Product tests

- Focus-to-Canvas comprehension;
- lineage discovery time;
- memory correction/forgetting;
- compare and impact preview;
- full-week real dogfood cycles.

## 14. Hosted Evolution

Hosted/team support is not a database dialect toggle. It introduces a separate synchronization and execution topology:

- local event replica remains canonical for personal work;
- relay synchronizes workspace-scoped encrypted events;
- remote repositories implement the same interfaces but have independent migrations;
- object storage mirrors content-addressed assets;
- remote workers receive scoped job envelopes;
- organization auth and policy wrap workspace aggregates;
- conflicts resolve through aggregate versions and explicit decisions.
