# Clark Pro — MCP, Capabilities, Skills, and Social Mesh

## The Boundary Model

Clark participates in four ecosystems that must remain conceptually separate.

| Layer | What it represents | Example |
|---|---|---|
| **Capability** | A typed action Clark can plan, authorize, execute, observe, and reconcile. | Publish a LinkedIn post. |
| **Transport/adapter** | How the capability is implemented. | Postiz MCP, direct LinkedIn API, CLI, local tool. |
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

## Clark as an MCP Server

Clark Bridge lets external agents use Clark without bypassing its memory, policy, or provenance systems.

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

A connector or skill is production-ready only when it provides:

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

## Research Basis

- MCP defines clients, servers, tools, resources, prompts, elicitation, and experimental durable Tasks; Clark uses capability negotiation rather than assuming every server supports every feature.
- Agent Skills standardizes `SKILL.md` packages with optional scripts, references, and assets; Clark adds trust, permission, revision, and regression layers.
- Postiz currently exposes MCP tools and a CLI/API for broad publishing and analytics, making it a better first distribution dependency than rebuilding every platform integration.
- Hermes demonstrates the value of persistent memory, agent-created skills, scheduled work, model neutrality, and multiple surfaces. Clark applies those harness lessons to the creator domain while keeping learning inspectable and policy-bound.
