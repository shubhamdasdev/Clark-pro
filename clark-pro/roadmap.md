# Clark Pro — Cumulative Whole-Product Delivery Plan

## Delivery Philosophy

Clark will not build a throwaway demo and later replace it with the “real architecture.” It will also not attempt every feature simultaneously without integration gates.

The product is delivered in **cumulative strata**. Each stratum is production-quality, uses the final domain contracts, and becomes the base of the next. A stratum may expose only part of the eventual product, but it cannot rely on disposable state, bypass security, or invent a second architecture.

This is not an MVP roadmap. It is a whole-product construction sequence.

## Product Completion Definition

Clark Pro 1.0 is complete only when the Mac application can operate the full creator cycle:

```text
capture → understand → create → review → distribute → observe → reflect → improve
```

The same canonical workspace must be usable from Clark Studio and Clark Bridge, with local ownership, durable recovery, inspectable memory, skill governance, and platform fallbacks.

## Ground — Contracts and Product Proof

**Purpose:** eliminate ambiguity before implementation fans out.

### Deliverables

- authoritative vision, canvas grammar, harness architecture, memory model, MCP boundary, and security model;
- clickable Mac studio prototype covering Focus, Canvas, Review, Timeline, Library, and Memory;
- versioned domain event and JSON schema catalog;
- capability adapter contract;
- loop definition contract;
- authoritative threat model, trust boundaries, credential flows, and threat-to-test matrix;
- representative Full-Week project fixture with realistic artifacts and failure cases;
- accepted architecture decision records for desktop shell/processes, canonical state, harness, MCP/capabilities, credentials, distribution, memory/skills, remote/team topology, interaction model, and delivery governance.
- positioning, packaging, replacement target, economic principles, and explicit commercial failure conditions.

### Gate

- The canvas passes every quality gate in `the-canvas.md` with five representative users.
- Engineering can trace every visible state to a domain object or event.
- Security can explain every path from renderer to credential or external mutation.
- Every Ground threat is mapped to a required executable test, and unmet ADR security gates block the correct dependent stratum.
- Product can explain why Clark wins without claiming uniqueness for canvas, generation, MCP, or scheduling alone.
- Target creators demonstrate first-week value, commit representative workflow data, and provide a binding willingness-to-pay signal under the gates in `positioning-and-business.md`.

## Stratum 1 — Mac Studio Foundation

**Purpose:** establish the permanent local product substrate.

### Deliverables

- signed/notarized Electron Mac application;
- hardened main/preload/renderer boundaries;
- project and workspace creation;
- content-addressed asset library;
- event log, projections, schema migrations, backup/export/import;
- macOS Keychain credential broker;
- Focus and Canvas read/write surfaces;
- graph compiler and dry-run;
- durable run engine with pause, retry, cancellation, checkpointing, and restart recovery;
- model gateway with at least two providers or one provider plus local test adapter;
- observability, diagnostics bundle, crash recovery, and update rollback.

### Vertical proof

Run a production-contract loop from captured idea to an approved text artifact. It must use the real event log, memory references, capability policy, run ledger, and review gate.

### Gate

- forced-termination recovery passes at every run state;
- renderer cannot access secrets or arbitrary execution;
- workspace round-trip export/import preserves checksums and lineage;
- 50-object fixture remains responsive;
- no throwaway alternate path exists.

## Stratum 2 — Creator Model and Skills Foundation

**Purpose:** make personalization and self-improvement first-class before broad automation.

### Deliverables

- Memory view and five memory layers;
- brand constitution editor and import from existing positioning documents;
- memory proposals, evidence, contradiction, expiry, correction, and forgetting;
- task-specific context compiler with retrieval audit;
- Agent Skills package host;
- skill installation, quarantine, permissions, revisions, tests, promotion, and rollback;
- reflection loop producing reviewable memory and skill proposals;
- creator edit/rejection signals recorded as evidence;
- sensitivity and remote-context policies.

### Vertical proof

The same idea is developed twice: once without creator context and once with the governed creator model and a trusted skill. Review must show exactly which memories and skill revision affected the result.

### Gate

- creator can correct or forget any active belief and prove it no longer appears in retrieval;
- a proposed skill cannot expand permissions;
- skill regression forces rollback;
- retrieved context has traceable references and sensitivity policy.

## Stratum 3 — Full Creation Studio

**Purpose:** support serious multi-format content production.

### Deliverables

- source ingestion for text, URLs, PDFs, screenshots, files, audio, and video;
- research loop with claim ledger, citations, and uncertainty;
- angle development, branch, compare, and canonical decisions;
- script and long-form editors;
- Higgsfield capability adapter and async media jobs;
- image, reel, B-roll, carousel, audio, and caption artifact types;
- ffmpeg validation, normalization, previews, subtitles, and packaging;
- dedicated media comparison and version review;
- brand, evidence, cost, accessibility, disclosure, and confidentiality gates;
- full creator templates: Short-Form Series, Long-Form Atomic, Build-in-Public, and Full Week.

### Vertical proof

Produce a complete, reviewed weekly content set from real Creator-plan inputs, with sources, lineage, costs, versions, and export packages.

### Gate

- every final claim traces to a source or explicit creator assertion;
- every media asset survives restart and provider reconnect;
- downstream impact is previewed before regeneration spend;
- creator judges at least 80% of approved artifacts publishable with normal editing rather than rescue work;
- total human time and cost are recorded, not estimated from demos.

## Stratum 4 — Distribution Mesh

**Purpose:** connect the studio to the real social operating environment without letting platform variance corrupt core.

### Deliverables

- account connection center and scope display;
- Postiz MCP/API adapter for broad platform coverage;
- platform schema discovery and validation;
- direct connectors selected by strategic need;
- Timeline with production, schedule, submission, verification, and failure state;
- approval policies per account, platform, campaign, and mutation class;
- assisted handoff and deterministic export fallbacks;
- idempotent publish intent ledger and ambiguous-failure reconciliation;
- disclosure and platform-policy enforcement;
- retry, reschedule, revoke, and account-health flows.

### Vertical proof

Operate a full week across the creator's actual channels from one workspace. Every publication must end as verified live, explicitly failed, cancelled, or exported—never unknown without a reconciliation task.

### Gate

- duplicate publication chaos test passes;
- revoked credentials block dependent scheduled work immediately;
- connector outage degrades to export without artifact loss;
- live URLs and provider receipts reconcile to publication intent;
- platform-specific requirements are visible before approval.

## Stratum 5 — Observation and Evidence-Based Learning

**Purpose:** close the loop without inventing fake certainty.

### Deliverables

- analytics ingestion from Postiz and selected direct sources;
- manual and qualitative observation capture;
- comment/audience signal ingestion under explicit permission;
- performance evidence linked to exact artifact and decision lineage;
- cohort-aware descriptive comparisons with sample counts;
- Review and Memory surfaces for proposed lessons;
- experiment proposals and follow-up tracking;
- strategy review loop;
- production-efficiency and creator-satisfaction metrics beside reach;
- data freshness, missingness, and deletion handling.

### Vertical proof

Run four real weekly cycles. Clark must produce a useful review that identifies evidence, uncertainty, and a small set of proposed changes without asserting unsupported causal predictions.

### Gate

- every recommendation cites observations and sample size;
- creator can distinguish preference, outcome, and hypothesis;
- deleted or unavailable platform data is represented honestly;
- accepted lessons influence later context through visible references;
- rejected lessons do not silently return.

## Stratum 6 — Clark Bridge and Ecosystem

**Purpose:** make Clark the composable creator system other agents and builders can use.

### Deliverables

- permissioned local Clark MCP server;
- tools, resources, prompts, and job receipts defined in `mcp-ecosystem.md`;
- MCP Tasks mapping when negotiated;
- client registration, scopes, revocation, and audit;
- Clark Kit for capability adapters, UI renderers, loops, templates, policies, and skills;
- conformance CLI and fixture harness;
- signed/verified package channel plus community installation;
- sample integrations for Hermes, Claude, Codex, and another MCP client;
- developer documentation and compatibility matrix.

### Vertical proof

An external agent captures an idea, starts a permitted loop, waits through a durable job, receives a review requirement, submits a creator-approved decision, and retrieves the exported artifact without creating state outside Clark's event model.

### Gate

- UI and Bridge operations converge on identical state and policy;
- client scopes prevent cross-workspace and sensitive-memory access;
- disconnect/reconnect does not lose long-running work;
- malicious manifests and skills cannot escape quarantine permissions;
- packages can upgrade and roll back without corrupting projects.

## Stratum 7 — Team and Elastic Execution

**Purpose:** extend the local-first operating model to teams and work that must continue when the Mac sleeps.

### Deliverables

- workspace roles and shared decision queues;
- encrypted event synchronization and conflict handling;
- optional object storage mirror;
- scoped remote worker and scheduled execution;
- credential delegation without copying personal Keychain state wholesale;
- activity, comment, assignment, and approval coordination;
- organization policies and audit export;
- managed hosted offering built on the same contracts.

### Gate

- offline Mac edits reconcile without last-write-wins data loss;
- remote worker cannot read unrelated memory or credentials;
- personal and team creator models remain separate;
- local export remains complete and usable without hosted service.

## Cross-Cutting Workstreams

These proceed across every stratum:

1. **Product and research:** user workflows, canvas testing, connector reality, creator outcome studies.
2. **Desktop and design:** Mac interaction, accessibility, performance, media editing, information architecture.
3. **Harness and domain:** events, graph, runs, policies, agents, recovery, evaluation.
4. **Memory and learning:** creator model, retrieval, reflection, skills, governance.
5. **Connectors:** MCP host, auth, Higgsfield, Postiz, direct social and analytics.
6. **Security and trust:** threat models, sandboxing, Keychain, permissions, updates, supply chain.
7. **Quality:** fixtures, conformance, chaos tests, migrations, performance, release verification.
8. **Developer ecosystem:** Clark Bridge, SDK, docs, package verification, examples.

## Release Gates, Not Feature Checklists

No stratum is complete because screens exist. Completion requires:

- representative real workflows;
- failure and restart tests;
- measurable creator judgment;
- security evidence;
- migration and rollback evidence;
- observability;
- documented limitations;
- no bypass around the permanent architecture.

## Immediate Next Work

Before implementation begins:

1. Convert the authoritative documents into versioned domain schemas and ADRs.
2. Produce the clickable six-view Mac prototype using the Full-Week fixture.
3. Run five creator walkthroughs focused on Focus-vs-Canvas comprehension, provenance, memory evidence, and authority.
4. Recruit three design partners for a real multi-channel week and a binding willingness-to-pay test.
5. Convert ADR-0011 through ADR-0020 into owned executable test specifications, enable private vulnerability reporting, and assign named incident responders.
6. Review and lock the v1 event, loop, capability, run-plan, and fixture contracts with every owning team; derive generated types and conformance test plans without forking schema semantics.
7. Assign named people, capacity, and dates to `team-delivery-plan.md`; create the Ground evidence ledger without weakening any acceptance gate.
