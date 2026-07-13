# Clark Pro — MCP, Capabilities, Skills, and Social Mesh

## The Boundary Model

Clark participates in four ecosystems that must remain conceptually separate.

| Layer | What it represents | Example |
|---|---|---|
| **Capability** | A typed action Clark can plan, authorize, execute, observe, and reconcile. | Publish a LinkedIn post. |
| **Transport/adapter** | How the capability is implemented. | Postiz MCP, direct LinkedIn API, CLI, local tool. |
| **Tool Pack** | The governed install/update unit for an external project and its adapters, capabilities, converters, UI, evidence, and rollback. | A pinned OpenCut package once a stable API exists. |
| **Skill** | Procedural knowledge for combining capabilities well. | Turn a technical article into a sourced LinkedIn carousel. |
| **Loop** | Durable executable workflow with state, gates, recovery, and evaluation. | Weekly build-in-public production and distribution. |

An MCP tool is not automatically a safe capability. A `SKILL.md` is not a durable workflow. A canvas node is not an integration strategy.

## Clark as an MCP Host

Clark Connect discovers and invokes external MCP servers through stdio or Streamable HTTP.

### Host responsibilities

- capability negotiation;
- OAuth and token lifecycle through the credential broker;
- schema validation;
- explicit trust and permission scopes;
- tool-name collision handling;
- timeout, cancellation, and progress;
- audit logging and redaction;
- rate and budget policy;
- mapping provider errors to Clark error classes;
- treating server descriptions and annotations as untrusted;
- health and version compatibility.

### Server trust levels

1. **Bundled:** reviewed and shipped with Clark.
2. **Verified:** signed publisher and conformance suite passed.
3. **Community:** user-installed with explicit permission review.
4. **Local development:** unrestricted testing profile, never trusted by default in production workspaces.

### First executable host slice

The Mac Harness now executes one bundled, deterministic `analyze_idea` MCP stdio tool through `@modelcontextprotocol/sdk@1.29.0`. Capability revision `1.1.0` pins its source hash and exact input schema. Clark launches it with no shell, exact argv/cwd, an explicit environment allowlist, zero network/credential/file authority, a 15-second lease, and durable permission/invocation receipts. Tool-count or schema drift, source drift, ambient-environment expansion, or policy expansion blocks execution.

The result is an evidence-honest thesis assessment rather than a score. It marks ten facets—outcome, target user, painful problem, current workaround, mechanism, wedge, trust boundary, distribution, business model, and evidence plan—as explicit or missing. Even when all ten are explicit, readiness is `evidence_required` and the observed evidence state remains `not_observed`. This deterministic phrase test helps a creator find omissions; it cannot establish truth, originality, demand, payment, retention, market size, or product quality.

This is production-path evidence for the host boundary, not proof that arbitrary community servers are safe or installable. OAuth, Keychain brokering, Streamable HTTP clients, third-party package activation, and long-running provider reconciliation remain later slices.

## Clark as an MCP Server

Clark Bridge lets external agents use Clark without bypassing its memory, policy, or provenance systems.

### First executable Bridge slice

The supervised Harness now hosts an official-SDK Streamable HTTP server on `127.0.0.1` with an ephemeral port. It validates Host and Origin, rejects oversized/encoded bodies, and requires a 256-bit bearer kept in an owner-only connection file outside the renderer and event log. The registered client is limited to one workspace and `capture`/`read` action classes.

The currently executable surface is intentionally smaller than the target catalog below: `clark.idea.start`, `clark.idea.revise`, `clark.runs.list`, `clark.run.get`, and `clark://workspace.local/runs`. Revision uses the same immutable Harness command as Studio, exposes root/parent lineage and compact readiness, and invalidates stale pending exact-version approval. Compact list/resource records omit full idea text. The Bridge cannot approve a brief, access credentials or memory, install code, build, or publish. Restart revokes the prior client before registering a fresh local capability.

### Tools

```text
clark.capture
clark.search
clark.plan_loop
clark.dry_run
clark.start_run
clark.get_run
clark.cancel_run
clark.list_review_items
clark.submit_decision
clark.stage_publication
clark.publish
clark.query_memory
clark.propose_memory
clark.list_skills
clark.install_skill
clark.invoke_skill
clark.export_artifact
```

Mutating tools accept a workspace, an intent ID, and an approval behavior. They return durable receipts.

### Resources

```text
clark://workspace/{id}/constitution
clark://workspace/{id}/capabilities
clark://project/{id}
clark://artifact/{id}/lineage
clark://run/{id}/events
clark://review/{id}
clark://memory/{id}
clark://skill/{name}/{revision}
```

Resources respect workspace and sensitivity policies. Personal memory is never broadly enumerable by default.

### Prompts

Clark can expose curated prompt workflows for compatible clients, but prompts remain convenience surfaces. The authoritative behavior lives in loops, policies, and capability contracts.

### Long-running work

Clark Bridge supports MCP Tasks when negotiated. Because Tasks are experimental and server support varies, every long operation also uses Clark's stable job receipt model:

```json
{
  "jobId": "job_123",
  "runId": "run_456",
  "status": "working",
  "statusResource": "clark://run/run_456"
}
```

Status, result, and cancellation remain available even when the client disconnects.

### Command and receipt equivalence

The versioned [`bridge-exchange` contract](contracts/schemas/bridge-exchange.schema.json) prevents Bridge from becoming a second automation backend. A mutating exchange binds:

- registered client identity and trust revision;
- workspace, tool, and action scopes;
- request, command, intent, idempotency key, deadline, and approval behavior;
- effective permission decision and policy revision;
- the exact canonical domain event;
- accepted or deduplicated durable receipts;
- the Studio projection and Bridge resource object ID, aggregate version, event ID, and state hash.

The representative [`clark.capture` exchange](contracts/fixtures/full-week/bridge.capture.exchange.json) adds one object to the Full-Week project. Replaying the same intent returns the original object with no new event. Cross-workspace execution, missing tool scope, replay duplication, actor mismatch, or Studio/Bridge state-hash divergence fails semantic verification.

## Capability Adapter Lifecycle

Every connector supports the applicable subset of:

1. `discover` — capabilities and dynamic schemas;
2. `authorize` — account connection and scopes;
3. `health` — credentials, quota, and provider status;
4. `validate` — input and platform constraints;
5. `quote` — estimated cost and latency;
6. `execute` — sync or async invocation;
7. `progress` — provider progress normalization;
8. `cancel` — safe cancellation where available;
9. `observe` — status and analytics retrieval;
10. `reconcile` — determine truth after ambiguous failure;
11. `revoke` — remove access and invalidate leases.

Generic MCP tools can be wrapped automatically. Publishing, long media generation, and browser-assisted flows normally require explicit adapter behavior.

## Reuse-First Tool Packs

Clark does not win by reimplementing every open-source creator tool. It wins by preserving creator context and durable workflow truth while the best available engines remain replaceable.

The governed [`tool-package` contract](contracts/schemas/tool-package.schema.json) binds:

- exact publisher, upstream revision, archive/tree hash, and evidence URI;
- license notices, commercial/redistribution disposition, dependency and trademark review;
- SBOM, vulnerability scan, signature, build, and provenance state;
- acquisition artifacts, network/admin requirements, and reviewed update/rollback policy;
- ordered integration paths and the reason for any degraded browser/fork choice;
- adapters and their exact capability revisions;
- skills, converters, and isolated UI contributions;
- compatibility, activation, conformance, migration, and rollback tests;
- discovered, blocked, quarantined, testing, active, suspended, and rolled-back lifecycle.

Installation preference is native MCP → headless CLI → HTTP API → supported library → WASM → supervised sidecar → typed file handoff → isolated browser automation → maintained fork. The Harness still evaluates every call through the capability contract; Tool Pack metadata cannot widen authority.

### OpenCut disposition

The [pinned OpenCut candidate](contracts/fixtures/tool-packages/opencut.rewrite.blocked.json) proves that Clark can track promising open-source work without claiming it works. At the reviewed revision, OpenCut's Editor API, MCP server, headless mode, plugin API, and plugin host are roadmap items. The candidate therefore installs nothing and exposes no capabilities or UI.

The executable Harness now registers that immutable manifest into each workspace, reconstructs it from the event log, and evaluates eleven independent activation/rollback gates. Studio shows the source-integrity pass alongside the remaining blockers and disables activation. A synthetic non-provider package proves quarantine → activation → verified update with prior-revision suspension → rollback restoration; this proves lifecycle mechanics, not OpenCut compatibility or a real external installation.

Once one stable upstream boundary exists, it re-enters quarantine. Clark must complete dependency/asset/trademark review, produce an SBOM and vulnerability report, implement typed converters and capabilities, verify golden rendering and failure behavior, and prove upgrade/rollback before activation. Private browser DOM or internal TypeScript types do not count as supported interfaces.

## Social Integration Strategy

Clark should not maintain dozens of social APIs before it has to. It should use a tiered mesh.

### Tier 1 — Aggregator connector

**Postiz** is the default broad distribution adapter because it already exposes MCP, CLI, public API, platform schemas, media upload, scheduling, and analytics across many platforms.

Clark adds value above Postiz through creator memory, creative provenance, approvals, loop orchestration, and evidence-based learning. It should not duplicate a mature scheduling backend merely to claim integration count.

### Tier 2 — Direct official connectors

Build direct adapters when one of these is true:

- the platform is strategically central;
- the aggregator omits required publishing or analytics data;
- reliability or cost justifies ownership;
- platform review requires Clark's own application;
- Clark needs richer comments, audience, or experiment signals.

Likely direct priorities are YouTube, LinkedIn, Instagram professional accounts, and TikTok after approval requirements are understood.

### Tier 3 — Assisted handoff

When safe official automation is unavailable:

- generate a validated platform package;
- open the relevant app or browser destination;
- copy or hand off fields and media;
- require the creator to confirm the final post;
- request the resulting URL for verification.

Browser automation is an adapter of last resort, scoped per platform, versioned, observable, and always able to degrade to export.

### Tier 4 — Export

Every platform path ends with a deterministic export fallback containing media, caption, title, alt text, tags, disclosure, thumbnail, and instructions. Publishing failure never traps the artifact.

## Initial Connector Catalog

### Creation

- Higgsfield MCP for supported image/video models and avatar workflows.
- Model gateway for scripts, research, adaptation, evaluation, and structured output.
- ffmpeg local capability for validation, normalization, subtitles, thumbnails, and packaging.
- Optional design adapters for Canva or other creator tools when their APIs or connectors support the needed workflow.
- OpenCut as an upstream-blocked Tool Pack candidate, activatable only after a stable supported API and full package conformance.

### Research

- web search and page fetch;
- source import from URL, PDF, file, screenshot, transcript, and clipboard;
- trend sources where permitted;
- creator's existing library and performance evidence.

### Distribution

- Postiz MCP/API/CLI as broad adapter;
- direct official adapters based on strategic need;
- assisted handoff;
- deterministic export.

### Observation

- Postiz analytics where available;
- direct platform analytics for richer data;
- manual metrics and creator judgment;
- comment and audience-signal connectors only under explicit scopes.

## Agent Skills Host

Clark installs skills following the Agent Skills directory convention:

```text
skill-name/
  SKILL.md
  scripts/
  references/
  assets/
```

### Installation flow

1. Resolve package source and revision.
2. Validate metadata and file layout.
3. Scan scripts and references.
4. Display requested capabilities, permissions, network domains, and compatibility.
5. Install into a quarantined revision.
6. Run declared validation and Clark conformance checks.
7. User trusts for selected workspaces and scopes.
8. Promote to active; retain rollback revision.

### Skill permission rule

Effective tools are:

```text
skill declaration
  ∩ installed capabilities
  ∩ workspace policy
  ∩ current run approval
```

Text inside a skill can never expand this set.

### Bundled skills

- research with claim ledger;
- platform-native script adaptation;
- reel production through Higgsfield;
- carousel production;
- build-in-public weekly loop;
- approval and disclosure review;
- Postiz distribution;
- Sunday performance review;
- skill reflection and regression testing.

The existing Creator-plan command documents become source material for these packages, not the runtime format by themselves.

## Model and Agent Ecosystem

Clark supports multiple model providers behind one task interface.

Task routing considers:

- required modality;
- structured-output reliability;
- reasoning/tool requirements;
- creator privacy policy;
- context size;
- quality rubric;
- latency;
- current price and budget;
- provider health.

External agent harnesses such as Hermes can operate Clark through Clark Bridge. Clark does not need to recreate every general-agent feature. Its specialized value is the creator domain model, studio, loops, permissions, provenance, and social operating context.

## Ecosystem Conformance

A connector, Tool Pack, or skill is production-ready only when it provides:

- versioned identity and source;
- declared permissions and domains;
- typed inputs and outputs;
- deterministic validation;
- error classification;
- idempotency/reconciliation behavior for mutations;
- cost semantics where applicable;
- fixtures or sandbox tests;
- upgrade and rollback path;
- observability without secret leakage;
- compatible license.

Tool Packs additionally require dependency/license disposition, SBOM, vulnerability and provenance evidence, verified install/activation, isolated UI and runtime boundaries, migration preview, and rollback. A roadmap, repository star count, top-level license, or successful local build does not satisfy those gates.

### Ground hostile conformance boundary

The versioned [`mcp-conformance` plan](mcp-conformance/conformance-plan.json) makes Clark's two MCP roles testable before production adapters fan out. It pins the stable protocol revision and SDK baseline, assigns primary/backup role ownership, defines severity and quarantine policy, and separates executable, shared-contract, and still-planned cases.

The current Ground report runs a real official-SDK stdio baseline plus raw hostile stdio, hostile Streamable HTTP, localhost Bridge, domain-policy, and canonical-state fixtures. All 36 executable/shared-contract cases pass. This proves the Ground harness boundary, not production conformance; the same matrix must pass inside the shipped Connect/Bridge runtime against real providers and network faults.

## Research Basis

- MCP defines clients, servers, tools, resources, prompts, elicitation, and experimental durable Tasks; Clark uses capability negotiation rather than assuming every server supports every feature.
- Agent Skills standardizes `SKILL.md` packages with optional scripts, references, and assets; Clark adds trust, permission, revision, and regression layers.
- Postiz currently exposes MCP tools and a CLI/API for broad publishing and analytics, making it a better first distribution dependency than rebuilding every platform integration.
- Hermes demonstrates the value of persistent memory, agent-created skills, scheduled work, model neutrality, and multiple surfaces. Clark applies those harness lessons to the creator domain while keeping learning inspectable and policy-bound.
- OpenCut's rewrite tracker demonstrates the useful one-engine/many-surfaces direction while also leaving its Editor API, Plugin API/host, MCP, headless, and scripting work unfinished; Clark records that distinction in the blocked candidate fixture rather than treating roadmap text as compatibility.
