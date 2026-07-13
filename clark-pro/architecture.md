# Clark Pro — Full Product Architecture

## Architecture Thesis

Clark is a local-first desktop system with a durable agent harness, not a browser UI wrapped around API calls. The Mac owns canonical identity, memory, credentials, project history, and approval state. Models, MCP servers, social platforms, and cloud workers are replaceable execution dependencies.

The architecture is incremental but not disposable: every delivery stratum uses the same domain contracts, event log, identity model, permissions, credential broker, run protocol, and migration system.

Accepted decisions and rejected alternatives are maintained in the [ADR registry](decisions/README.md). The authoritative trust boundaries, threat register, credential flows, and required security evidence are in the [security and threat model](security-and-threat-model.md). Architecture claims do not count as verified controls until the named executable evidence passes.

The versioned event envelope/catalog, loop definition, capability manifest, compiled run plan, and representative fixtures are authoritative in [contracts/](contracts/README.md). The pinned [contract runtime](contract-runtime/README.md) generates namespaced TypeScript and validates runtime data with Ajv; implementations may not fork schema semantics.

## Runtime Topology

```text
┌──────────────────────────────────────────────────────────────────┐
│                         CLARK STUDIO                              │
│ Electron macOS app                                               │
│ React renderer · Focus · Canvas · Timeline · Review · Memory     │
└───────────────┬──────────────────────────────────────────────────┘
                │ typed, allowlisted IPC
┌───────────────▼──────────────────────────────────────────────────┐
│                       CLARK HARNESS                               │
│ isolated utility process / local daemon                          │
│ planner · run engine · policies · agents · tools · skills        │
│ scheduler · evaluators · recovery · observability                │
└───────┬───────────────┬─────────────────┬────────────────────────┘
        │               │                 │
┌───────▼──────┐ ┌──────▼────────┐ ┌──────▼───────────────────────┐
│ CLARK MEMORY │ │ CLARK CONNECT │ │ CLARK BRIDGE                 │
│ event store  │ │ MCP clients   │ │ local/remote MCP server      │
│ creator model│ │ adapters      │ │ tools · resources · prompts  │
│ skills       │ │ auth broker   │ │ tasks/fallback jobs          │
└───────┬──────┘ └──────┬────────┘ └──────────────────────────────┘
        │               │
┌───────▼───────────────▼──────────────────────────────────────────┐
│ SQLite/WAL · content-addressed assets · Keychain · search index │
└──────────────────────────────────────────────────────────────────┘
        │
┌───────▼──────────────────────────────────────────────────────────┐
│ Optional scoped workers: rendering, scheduled jobs, team relay  │
└──────────────────────────────────────────────────────────────────┘
```

## Technology Decisions

| Layer | Decision | Reason |
|---|---|---|
| Desktop shell | **Electron**, hardened and notarized | React Flow and the MCP TypeScript ecosystem remain first-class; one JavaScript runtime minimizes integration friction. Media workloads already dominate footprint, so smaller shell size is not the primary constraint. |
| Renderer | **React + TypeScript + Vite** | No SSR is needed inside a desktop studio. Vite is simpler than carrying Next.js server semantics into a local app. |
| Canvas | **React Flow** with custom lane/group/render layers | Strong typed graph primitives and custom media/artifact cards. |
| UI state | **Zustand** for transient interaction; query cache for daemon state | Canvas movement is local UI state; canonical project state remains in the harness. |
| Harness | **TypeScript utility process/local daemon** | Isolates agent and connector failures from the UI and keeps compatibility with MCP and provider SDKs. |
| Domain contracts | **JSON Schema 2020-12 + generated TypeScript + Ajv** | One authority across IPC, persistence, MCP, import/export, plugins, and historical projection. |
| Database | **SQLite in WAL mode** through a repository interface | Correct for single-user canonical state and portable backups. Hosted storage is a separate adapter, not a promised dialect swap. |
| Search | SQLite FTS for text; vector extension only for bounded similarity use | Structured retrieval is primary; embeddings do not become the memory model. |
| Assets | Content-addressed local object store with typed metadata | Deduplication, integrity, deterministic export, and future remote mirroring. |
| Secrets | **macOS Keychain** through a credential broker | OAuth tokens and API keys never live in graph JSON, logs, or ordinary SQLite rows. |
| Model access | Provider-neutral model gateway | Anthropic, OpenAI, local, and routed providers are selectable per task. Agent SDKs are adapters, not the harness. |
| MCP | Official TypeScript SDK; Streamable HTTP and stdio | Clark hosts external servers and exposes Clark Bridge. |
| Media | ffmpeg/ffprobe workers plus provider adapters | Local validation, normalization, thumbnails, captions, and exports remain deterministic. |
| Packaging | Signed/notarized DMG with auto-update channel | Mac is the primary release surface; App Store sandbox restrictions are not assumed compatible with arbitrary local tools. |

## Why Electron for the First Mac Product

The product's center is a rich React graph, TypeScript MCP ecosystem, background agent process, and media orchestration. Electron permits one coherent capability and type system across those layers while still providing native menus, dock behavior, notifications, deep links, protocol handlers, secure storage, and signed distribution.

Mac quality is a product requirement rather than a framework label. Clark must implement native keyboard behavior, window restoration, drag/drop, Quick Look, menu-bar status, Keychain, notifications, file coordination, accessibility, and notarization. A future Swift helper or extension may provide Share Extension and deeper system integration without moving the harness into Swift.

### Executable Ground shell

`apps/desktop` is the first bounded implementation on this permanent topology. It uses Electron 43.1.0, a secure custom local protocol, native macOS menu roles, an allowlisted preload bridge, denied navigation/popups/webviews/permissions, screen-clamped window restoration, and semantic keyboard-operable Focus, Canvas, and Connections surfaces. Its renderer is deliberately framework-light while the interaction and security boundary is tested; Stratum 1 may introduce the accepted React/TypeScript renderer without changing the main/preload authority model.

This shell is implementation evidence, not a release candidate. It now supervises the first real Harness utility process: a canonical-contract-validated private MessagePort, an allowlisted child environment, SQLite/WAL event and projection storage, content-addressed assets, checkpoints, idempotent commands, recovery, and one exact-version creator-approval loop. Its live Idea Foundry Canvas is a disposable projection of that state: immutable idea revisions preserve root/parent lineage, a revision atomically invalidates any stale pending review, and assessment/evidence/brief/gate nodes expose their authority and readiness. The renderer receives only narrow domain methods and never the Harness port, database path, MCP transport, or Bridge bearer.

The local bundle is still explicitly unsigned by a Developer ID and has not passed Hardened Runtime, notarization, Gatekeeper, observed VoiceOver, Keychain/TCC, Share Extension, updater, general graph/agent/MCP execution, memory, social, or publishing gates. Those limitations are recorded in `apps/desktop/evidence/latest-report.json` and remain blocking.

## Process Boundaries

### Renderer process

- No Node integration.
- Context isolation on.
- Strict Content Security Policy.
- Only typed preload APIs.
- No direct filesystem, network credential, shell, or MCP access.
- Treats all artifact HTML and provider output as untrusted.

### Main process

- Window and lifecycle management.
- Native menus, notifications, deep links, file dialogs, update flow.
- Starts and supervises the harness process.
- Does not execute model or connector work itself.

### Harness process

- Owns project commands and run state.
- Connects to MCP servers and model providers.
- Executes allowlisted local capabilities.
- Emits immutable domain events.
- Survives renderer reloads and recovers runs after application restart.

### Media workers

- Separate processes for ffmpeg, probes, thumbnails, transcription, and large transforms.
- Resource and time limits.
- No credential access unless a job explicitly receives a scoped lease.

## Domain Model

The model is event-backed and versioned.

### Core aggregates

- `Workspace` — creator boundary, policies, accounts, memory namespace.
- `Project` — a campaign, series, or body of related work.
- `CreativeGraph` — versioned declarative graph of artifacts, operators, decisions, gates, and loops.
- `Artifact` and `ArtifactVersion` — durable creator-owned content with provenance.
- `LoopDefinition` — reusable graph with contracts, policies, and evaluation.
- `Run` and `RunStep` — compiled execution and durable state.
- `Capability` — tool/connector behavior independent of transport.
- `AccountConnection` — platform identity plus credential reference.
- `Decision` — human, agent, or policy choice with alternatives and evidence.
- `Publication` — desired, scheduled, submitted, verified, failed, or removed platform state.
- `Observation` — metrics, comments, qualitative judgment, or external event.
- `MemoryItem` and `MemoryProposal` — governed creator-model state.
- `SkillPackage` and `SkillRevision` — installed or learned procedures.
- `ToolPackage` and `ToolPackageRevision` — pinned external-tool source, legal/supply-chain evidence, adapters, capabilities, compatibility, and lifecycle.
- `Policy` — permissions, disclosure, budget, confidentiality, and autonomy.

### Important invariants

1. Artifact versions are append-only.
2. Canonical selection is a decision event, not an overwrite.
3. Every external mutation has an idempotency key when the provider supports one and an internal intent ID regardless.
4. A run step cannot access a credential outside its capability lease.
5. Memory and skill proposals cannot become active without their policy-defined promotion event.
6. Publishing intent, provider submission, and verified live publication are distinct states.
7. Deleting local content produces explicit tombstones and asset-retention decisions.
8. Every schema and event carries a version.
9. External tool schemas and databases never become Clark's canonical creator, workflow, approval, memory, publication-intent, or provenance model.

## Event Log and Projections

Commands validate policy and append domain events. Read models project the event log into query-optimized tables for canvas, timeline, search, review, and memory.

Representative events:

```text
idea.captured
artifact.version_created
artifact.canonical_selected
graph.edge_changed
run.planned
run.started
step.waiting_for_approval
tool.call_requested
tool.call_completed
publication.submitted
publication.verified
observation.recorded
memory.proposed
memory.promoted
skill.revision_proposed
skill.revision_promoted
```

This is not event sourcing for fashion. It provides provenance, undo, audit, deterministic recovery, memory evidence, and synchronization boundaries.

### Executable local persistence slice

`services/harness` implements the first repository-backed form of this model. Before every append it validates the domain envelope and catalog-selected payload against the canonical contract runtime. The SQLite transaction advances the aggregate version, extends a per-workspace SHA-256 event chain, and updates the read projection atomically. The exact validated plan is embedded in `run.planned`; recovery rechecks its self-excluding content hash and run/workspace/project scope instead of recompiling mutable “latest” definitions. Projection tables are disposable: the committed suite deletes and deterministically rebuilds them from events while retaining checkpoints and verifying the same snapshot.

The first compiled loop captures an idea as an immutable asset version, invokes a source-pinned bundled MCP assessment under a one-call lease, runs a deterministic local structure capability, and pauses on an exact artifact-version approval. The assessment reports ten thesis facets, structural completeness, and five still-unobserved evidence gates; it cannot promote the idea to “validated.” `idea.revise` creates a new immutable run and artifact versions linked to a root and parent run. When it supersedes a pending review, `approval.invalidated`, `step.cancelled`, and `run.cancelled` are committed in the same SQLite transaction as the replacement plan, so stale authority cannot survive a revision. Schema-v3 projection migration and replay preserve old roots as revision 1.

This path has no network, model, credential, third-party skill, creator-memory, social, build, or publication authority. Approval means only that the creator accepts the exact brief wording. That zero-authority baseline is intentional: later capabilities must extend the same run/event/policy boundary rather than add an alternate execution path.

## Clark Harness

The harness is a collection of explicit services.

### Graph compiler

- validates typed ports and cycles;
- expands loop groups;
- resolves capabilities and adapters;
- calculates staleness and reuse;
- produces a run plan with predicted paid calls, gates, and permissions;
- supports dry-run before execution.

### Durable run engine

- dependency scheduling;
- bounded parallelism and provider-specific rate limits;
- checkpointing and replay;
- async job attachment by external ID;
- retries based on error class and idempotency safety;
- cancellation, timeout, and orphan detection;
- compensation steps for reversible mutations;
- boot-time recovery.

### Context compiler

Builds the minimum task context from:

- current artifact inputs;
- pinned sources and claims;
- relevant creator-model slices;
- active policies;
- selected skill revision;
- platform rules;
- prior corrections for this loop;
- explicit uncertainty and missing information.

Context assembly is logged as references, not as duplicated secret-bearing prompts.

### Agent runner

The agent runner is provider-neutral and supports:

- one-shot structured model calls;
- bounded tool-using loops;
- specialist agents;
- isolated parallel delegates;
- model routing by quality, latency, privacy, and cost;
- tool allowlists and step budgets;
- interruption and human elicitation;
- recorded trajectories for evaluation and later skill proposals.

Most classification, adaptation, and validation tasks should not use an autonomous agent loop.

### Policy engine

Policies decide:

- which capabilities an agent may use;
- whether an action requires approval;
- which accounts and projects are in scope;
- allowed spend and rate limits;
- disclosure requirements;
- confidential topics or sources;
- memory retrieval and mutation permissions;
- remote-worker eligibility.

### Evaluation engine

Evaluation happens at several levels:

- schema and media validity;
- evidence coverage;
- brand-policy compliance;
- platform requirements;
- creator rubric;
- run reliability and cost;
- post-publication observations;
- skill regression tests.

## Capability Contract

MCP tools are one way to implement a capability, not the capability model itself.

Each capability declares:

```yaml
id: social.publish.postiz
version: 1.0.0
kind: mutation
transport: mcp
inputSchema: schemas/postiz-publish.json
outputSchema: schemas/publication-receipt.json
permissions: [network, social.publish]
credentialScopes: [postiz.write]
async:
  mode: job
  cancellable: true
idempotency:
  strategy: provider-or-intent-ledger
cost:
  quote: supported
ui:
  renderer: publication-card
reliability:
  retryPolicy: safe-transient-only
```

An adapter implements lifecycle hooks for auth, validation, quote, execute, observe, cancel, reconcile, and health. Simple MCP tools can use a generic adapter; complex providers can ship a driver without changing core domain logic.

## Tool Packs and the Reuse Boundary

Clark owns creator continuity, not every specialized engine. Before a workstream builds a video editor, renderer, scheduler, caption engine, design surface, browser worker, model runtime, or analytics backend, it performs the reuse review accepted in [ADR-0022](decisions/0022-governed-tool-packs-and-reuse-first-integration.md).

A governed [`ToolPackage`](contracts/schemas/tool-package.schema.json) is the installable Clark Kit unit above capabilities and skills:

```text
immutable upstream source/release + license/SBOM/provenance
                              │
                     quarantined Tool Pack
                              │
          ┌───────────────────┼────────────────────┐
          ▼                   ▼                    ▼
 typed capability       governed skills     safe UI/converters
 manifests/adapters     that use them        without canonical drift
```

The default integration order is MCP, headless CLI, HTTP API, supported library, WASM component, supervised sidecar, typed file handoff, isolated browser automation, and finally a maintained fork. A pack records exceptions and ownership explicitly.

Tool Pack installation never means trust. Source and artifacts are hash-pinned; acquisition is staged; license and dependencies are reviewed; SBOM, vulnerability, compatibility, permission-diff, migration, activation, upgrade, and rollback evidence are retained. Updates return to quarantine. The Harness grants only the intersection of package declarations, component capabilities, workspace policy, and current run approval.

UI contributions are declarative, Clark-rendered, sandboxed web origins, or explicit external-app handoffs. They receive no preload, filesystem, credential, shell, or unrestricted navigation authority. Converters translate external formats at the boundary and report unsupported or lossy fields; external schemas remain replaceable.

The pinned OpenCut fixture is a candidate, not an integration. Its public rewrite direction supports the engine-first thesis, but the exact reviewed revision exposes no stable Editor API, MCP server, headless interface, or plugin host. It therefore remains `blocked_upstream` with zero installed components until real conformance evidence exists.

## Storage

### SQLite databases

Separate logical stores reduce blast radius:

- `clark.db` — projects, graphs, artifacts, runs, publications, policies, projections.
- `memory.db` — creator-model items, evidence links, proposals, retrieval feedback.
- `skills.db` — installed packages, revisions, tests, trust and promotion state.
- `packages.db` — Tool Pack manifests, source/artifact hashes, legal and supply-chain evidence, adapters, compatibility, quarantine, update, and rollback state.

They may begin as one physical database with separate schemas/tables, but repository boundaries remain explicit.

### Asset store

```text
Clark Library/
  objects/sha256/<prefix>/<hash>
  previews/<hash>/<variant>
  exports/<project>/<platform>/
  backups/
```

Asset metadata records MIME type, dimensions, duration, checksum, origin, rights note, creator, and references. Garbage collection only removes unreferenced objects after a retention window and recoverable trash stage.

### Backups and portability

- Atomic local snapshots.
- User-selected backup location.
- Portable workspace export with JSONL events, schemas, skills, and assets.
- Import validation and migration preview.
- Optional encrypted sync later; no hidden cloud dependency.

## Credential and Authorization Architecture

- API keys, access tokens, refresh tokens, and encryption keys live in macOS Keychain.
- Database rows store opaque credential references and scopes.
- API-key entry uses a broker-owned native or isolated credential sheet; the raw value never enters ordinary renderer state.
- OAuth uses PKCE and state validation.
- Connector processes receive short-lived capability leases, not raw access to every secret.
- Logs and model context pass through redaction.
- Revocation immediately disables dependent capabilities and marks scheduled work blocked.
- Clark Bridge uses one-time local pairing, explicit client registration, scoped tokens, and localhost-only binding by default; long-lived client secrets are not rendered for copy/paste.

## MCP Dual Role

### Clark as MCP client/host

Clark connects to stdio and Streamable HTTP servers, negotiates capabilities, validates tool schemas, enforces local permissions, and records every call. Server-provided descriptions and annotations are untrusted until the user trusts the server.

### Clark as MCP server: Clark Bridge

Clark exposes a stable external surface:

- capture and query ideas;
- inspect projects and artifact lineage;
- plan or start approved loops;
- query run and review state;
- submit creator decisions;
- query permitted memory;
- stage or publish through policy;
- install or invoke trusted skills;
- retrieve exported artifacts.

Long-running work uses Clark's internal job protocol. Clark maps it to MCP Tasks when both sides negotiate support; otherwise tools return a `jobId` with explicit status, result, and cancel tools. MCP Tasks remain experimental and cannot be the only recovery mechanism.

## Cloud and Team Evolution

Local-first does not mean painting the product into a single-user corner.

- Every aggregate is workspace-scoped from the first schema.
- Identity and access decisions are explicit events.
- The local repository interface and remote repository interface are separate implementations.
- Remote workers accept encrypted, scoped job envelopes and return signed results.
- Teams add a relay, shared event synchronization, role policies, and object storage without moving personal Keychain credentials into project rows.
- Conflict resolution operates on aggregate versions and decision events, not raw last-write-wins tables.

## Repository Shape

```text
clark-pro/
  apps/
    desktop/                 # executable Electron main, preload, renderer, and native-shell evidence
    bridge-cli/              # local admin and MCP setup CLI
  services/
    harness/                 # durable runtime and IPC/API
    worker/                  # optional remote/scoped worker
  packages/
    domain/                  # aggregates, events, schemas, invariants
    graph/                   # compiler, staleness, layout metadata
    run-engine/              # scheduler, recovery, job state
    memory/                  # creator model and retrieval
    skills/                  # Agent Skills host and evolution
    policy/                  # permissions, budgets, disclosure
    model-gateway/           # provider-neutral model interface
    capabilities/            # capability registry and adapters
    mcp-host/                # outbound MCP clients
    mcp-server/              # Clark Bridge
    connectors/              # Higgsfield, Postiz, direct providers
    media/                   # ffmpeg, validation, previews, exports
    plugin-sdk/              # Tool Pack SDK, manifests, adapters, converters, safe UI, tests
    observability/           # structured events, traces, diagnostics
  skills/                    # bundled Agent Skills packages
  templates/                 # bundled loops and project templates
  schemas/                   # published versioned JSON schemas
  contract-runtime/          # generated TS namespaces, offline drift gate, event upcasters
  tool-packages/             # bundled/verified package manifests and compatibility fixtures
```

## Quality and Security Gates

The architecture is not production-ready until it proves:

1. Signed/notarized installation and update rollback.
2. Renderer compromise cannot directly access credentials or arbitrary local execution.
3. Run recovery after forced termination during model call, media job, approval wait, and publish submission.
4. Duplicate publish prevention across restart and network retry.
5. Workspace export/import with checksums and schema migration preview.
6. Memory and skill mutation audit, correction, deletion, and rollback.
7. MCP server permission isolation and revocation.
8. Connector conformance tests with recorded provider fixtures.
9. Budget reservation and reconciliation under failure.
10. A 50-object canvas remains responsive and legible on the oldest supported Mac.
11. Tool Pack acquisition, activation, upgrade, and rollback reject substitution, license/SBOM gaps, permission expansion, incompatible schemas, and unsafe UI/runtime boundaries.
