# Clark Pro — Product Epics and Acceptance Gates

**Status:** Authoritative v2 · July 2026
**Sequencing:** cumulative product strata from [roadmap.md](../roadmap.md); no throwaway implementation path.

## Ground — Product Contracts

### E0 — Studio Prototype and Domain Fixture

- Six-view clickable Mac prototype using one realistic Full-Week project.
- Representative sources, branches, scripts, media, posts, outcomes, memories, failures, and skill proposals.
- Five creator walkthroughs.

**Acceptance:** every visible state maps to a defined domain object/event; canvas gates pass; common flow works without graph knowledge.

### E1 — Schemas, ADRs, and Threat Model

- Versioned schemas for events, artifacts, graph, loops, runs, capabilities, decisions, publications, observations, memory, skills, and policies.
- Architecture decision records.
- Maintain the authoritative [threat model](../security-and-threat-model.md) and [ADR registry](../decisions/README.md) for renderer, harness, connectors, Tool Packs, skills, MCP clients/servers, credentials, updates, and remote workers.

**Acceptance:** schema compatibility and migration policy documented; no unresolved trust boundary blocks foundation work.

## Stratum 1 — Mac Studio Foundation

### E2 — Hardened Desktop Host

- Signed/notarized Electron app.
- Native lifecycle, menus, shortcuts, notifications, file/deep-link handling, window restore, updater, and rollback.
- Renderer isolation and typed preload APIs.

**Acceptance:** security test proves renderer lacks direct secrets/shell/filesystem authority; update rollback works.

### E3 — Event Store, Assets, and Portability

- SQLite/WAL event store and projections.
- Versioned migrations.
- Content-addressed assets and previews.
- Backup, export, import, checksum, and recovery.

**Acceptance:** workspace round-trip preserves event history, artifacts, hashes, and graph state; corrupt import fails safely.

### E4 — Graph Compiler and Durable Run Engine

- Typed graph validation, loops, staleness, dry-run, run plan.
- Parallel execution, checkpoints, pause, retry, cancellation, async jobs, and boot recovery.
- Intent receipts and reconciliation states.

**Acceptance:** forced termination at each run state recovers without duplicate mutation or lost approval.

### E5 — Studio Kernel

- Focus and Canvas over canonical projections.
- Semantic lanes, groups, typed primitives, inspector, activity strip, and live state.
- Dedicated artifact editor shell.

**Acceptance:** 50-object fixture stays responsive and legible; UI reload does not affect harness execution.

## Stratum 2 — Memory and Skills

### E6 — Creator Model

- Five memory layers, constitution editor, evidence links, sensitivity, scopes, lifecycle, and retrieval.
- Memory view with correction, dispute, expiry, export, and forget.

**Acceptance:** forgetting removes item and derivatives from retrieval; output references identify retrieved items.

### E7 — Context Compiler and Model Gateway

- Provider-neutral structured and agent task API.
- Per-task context packets and privacy budgets.
- Model routing and cost tracking.

**Acceptance:** same task can switch provider adapter without domain changes; sensitive context policies are enforced and audited.

### E8 — Agent Skills Host

- Agent Skills validation, quarantine, permissions, tests, install/update/rollback.
- Bundled initial creator skills.

**Acceptance:** skill cannot access undeclared or unapproved capabilities; failed revision rolls back.

### E9 — Reflection and Skill Evolution

- Reflection output schema and proposal queue.
- Memory and skill proposals from trajectories with evidence.
- Regression generation and promotion workflow.

**Acceptance:** no silent promotion; rejected proposal remains inactive; promoted revision is traceable and reversible.

## Stratum 3 — Creation Studio

### E10 — Capture and Source System

- Global capture, Share/drag/drop, Inbox, project routing.
- URL, document, screenshot, audio, video, and file source artifacts.

**Acceptance:** original bytes/text are retained with provenance; capture never triggers paid work implicitly.

### E11 — Research and Claim Ledger

- Search/import capabilities, citations, claims, uncertainty, source health, saturation scan.
- Pin, dispute, and replace claims.

**Acceptance:** final factual assertions trace to source or explicit creator assertion; missing evidence is visible.

### E12 — Angles, Branch, and Compare

- Angle sets, explicit decisions, branches, canonical promotion, text/media compare.
- Downstream impact preview.

**Acceptance:** promoting a branch appends a decision, preserves alternatives, and marks exact stale impact.

### E13 — Writing and Platform Adaptation

- Script/long-form editors, platform variants, shared lineage, Brand Constitution context.
- Structured platform artifacts rather than raw text blobs.

**Acceptance:** edits create versions; adapters preserve supported semantic fields and expose losses.

### E14 — Media Production

- Higgsfield adapter, async jobs, media artifacts, take management.
- ffmpeg validation, normalization, captions, thumbnails, and export.

**Acceptance:** provider reconnect and fallback work; every accepted asset has valid technical metadata and cost receipt.

### E15 — Review and Policy Gates

- Review view, native previews, diffs, evidence, costs, disclosures, accessibility, confidentiality, and brand policies.
- Policy matrix by workspace/account/action.

**Acceptance:** approval is version-specific; stale or invalid artifact cannot publish under prior approval.

## Stratum 4 — Distribution

### E16 — Account and Credential Center

- Keychain broker, OAuth/PKCE, scopes, leases, health, revocation, account/workspace grants.

**Acceptance:** revoked account blocks future work and exposes affected schedule without leaking token material.

### E17 — Postiz Distribution Adapter

- MCP/API adapter, dynamic platform schemas, upload, schedule, publish, status, and analytics hooks.

**Acceptance:** conformance fixtures pass for target platforms; provider errors map to actionable Clark states.

### E18 — Timeline and Publication Ledger

- Production/schedule timeline, publication intents, receipts, verification, reconciliation, retries, cancellation.

**Acceptance:** chaos tests produce no duplicate verified publications and no unexplained unknown state.

### E19 — Direct, Assisted, and Export Paths

- Strategically selected direct official connectors.
- Assisted handoff with human final action.
- Deterministic export for every supported artifact.

**Acceptance:** any connector outage can end in a complete, platform-valid export package.

## Stratum 5 — Observation and Learning

### E20 — Observation Ingestion

- Postiz/direct analytics, manual values, qualitative judgment, comments where permitted.
- Freshness, missingness, deletion, and platform-specific metrics.

**Acceptance:** observations attach to exact publication/artifact lineage and never merge incompatible platform semantics silently.

### E21 — Evidence Review

- Cohorts, medians/ranges, sample counts, cost, creator satisfaction, and comparable context.
- Review surface for outcomes and anomalies.

**Acceptance:** every displayed recommendation exposes sample and evidence; UI avoids unsupported causal language.

### E22 — Strategy and Experiment Loops

- Reflection proposals, experiments, follow-ups, strategy decisions, memory promotion.

**Acceptance:** accepted proposals influence future context visibly; rejected proposals do not return without new evidence.

## Stratum 6 — Bridge and Ecosystem

### E23 — Clark Bridge MCP Server

- Scoped tools, resources, prompts, jobs, Tasks mapping, auth, audit, and revocation.

**Acceptance:** external agent completes capture-to-review-to-result flow with identical state and policy as Studio.

### E24 — Clark Kit and Conformance

- SDK for governed Tool Packs, capabilities, adapters, converters, isolated UI renderers, loops, templates, policies, and skills.
- Reuse-review template and MCP/headless/API/library/WASM/sidecar/file/browser/fork integration ladder.
- Validation CLI, fixtures, sandbox, license/SBOM/provenance checks, compatibility matrix, signed packages, migration preview, and rollback.

**Acceptance:** a third-party Tool Pack can be built without core changes, cannot exceed declared/trusted permissions, cannot replace Clark's canonical model, and cannot activate without immutable source/artifact identity plus complete legal, supply-chain, compatibility, adapter/capability, migration, and rollback evidence.

### E25 — External Agent Integrations

- Documented Hermes, Claude, Codex, and additional MCP-client paths.

**Acceptance:** disconnect/reconnect and long jobs work; sensitive workspace/memory scopes remain isolated.

## Stratum 7 — Team and Elastic Execution

### E26 — Shared Workspaces

- Roles, assignments, comments, approvals, account boundaries, audit.

**Acceptance:** authorization tests cover every aggregate and mutating action.

### E27 — Sync and Remote Workers

- Encrypted event sync, conflict resolution, asset mirror, scoped job envelopes, schedules.

**Acceptance:** offline conflict and worker-compromise tests preserve canonical ownership and least privilege.

### E28 — Hosted Operations

- Managed relay/workers, organization policy, billing, reliability, privacy controls, and local export continuity.

**Acceptance:** hosted outage does not prevent local workspace access/export; tenant isolation is independently verified.

## Whole-Product Exit Gate

Clark Pro 1.0 requires all E0–E25 and the single-user portions of E26–E27 necessary for safe optional remote schedules. It must complete four real Creator-plan weekly cycles with:

- complete provenance;
- successful interruption recovery;
- no duplicate publications;
- inspectable memory and skill changes;
- connector fallbacks;
- creator-rated publishable outputs;
- UI and MCP state equivalence;
- verified backup/restore;
- signed/notarized distribution.
