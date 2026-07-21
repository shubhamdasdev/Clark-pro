# Analytics Plan — Clark Pro

**Project:** clark-pro
**Version:** 1.0
**Updated:** 2026-07-13

> Product-behaviour measurement. Operational reliability, logs, traces, audit, and SLO signals live in `observability.md`. Analytics export is governed by the same local-first consent posture: no event leaves the Mac without explicit opt-in.

---

## Analytics Platform

| Concern | Decision | Notes |
|---------|----------|-------|
| Event collection | Clark-owned product-event mapper from committed domain events to a privacy-safe local SQLite projection | Server/Harness-side after canonical commit; the renderer never becomes the event source of truth |
| Local analysis | DuckDB over a user-approved Parquet export of the analytics projection | Portable, inspectable, no mandatory account or cloud |
| Product dashboard | Embedded Clark Metrics screen using typed SQL views and Apache ECharts | Charts always have accessible table, definition, freshness, and sample count |
| Optional team sink | PostHog, only after explicit opt-in and allowlist/canary approval | Useful funnels/retention; never receives creative content or raw canonical IDs |
| Client vs. server | Harness-side preferred; UI events only for clearly defined inspection actions | Outcome events fire after durable commit, not button click or render |

## Naming Conventions

- Events are past-tense `snake_case` outcome phrases.
- `user_id` and timestamp are implicit locally; optional export uses a rotating pseudonymous installation key, never an account email or workspace ID.
- Properties are bounded enums or booleans. No UUIDs, raw URLs, paths, account names, artifact/source/memory text, prompt/completion, tokens, or free-form notes.
- An event fires once after the canonical state transition. Retry, replay, projection rebuild, or UI remount must not double-fire.
- Event schema version and app release are transport metadata, not ad-hoc properties.

## User Dimensions

| Dimension | Type | Description | Set When | Cardinality note |
|-----------|------|-------------|----------|------------------|
| `operator_role` | enum | Role context for the action: creator, workspace_admin, reviewer, external_agent, team_member | command actor is resolved | 5 values |
| `workspace_mode` | enum | personal_local or shared_team | workspace created/imported | 2 values |
| `installation_cohort_month` | string YYYY-MM | Local activation cohort for retention analysis | first successful workspace setup | ~12 values/year |
| `release_channel` | enum | development, alpha, beta, stable | build start | 4 values |
| `analytics_export_opt_in` | bool | Whether privacy-safe product events may leave the Mac | consent change | 2 values; false by default |
| `creator_experience_band` | enum | first_week, establishing, recurring | derived from completed weekly cycles | 3 values; no raw count exported |

## Core Funnel

| Step | Event | Source | Meaning |
|------|-------|--------|---------|
| 1 | `idea_revision_created` | AE-003 | Intent entered canonical lineage |
| 2 | `creation_loop_completed` | AE-003 | Bounded creator work produced persisted outputs |
| 3 | `artifact_version_approved` | AE-003 | Exact work passed creator/policy review |
| 4 | `publication_terminalized` | AE-008 | External intent reached a known state or explicit reconciliation |
| 5 | `observation_reviewed` | AE-008 | Outcome evidence was inspected with limitations |
| 6 | `memory_proposal_decided` or `strategy_proposal_decided` | AE-005 / AE-008 | Learning changed only through a visible decision |
| 7 | `weekly_cycle_completed` | AE-009 | Whole capture-to-learning cycle evidence finalized |

## Metric Catalogue

| Metric | Definition | Events / source | Target |
|--------|------------|-----------------|--------|
| First-value activation | installations with idea revision → approved artifact in first cohort window | AE-003 funnel | Establish baseline |
| Weekly whole-cycle completion | completed weekly cycles by creator experience band | `weekly_cycle_completed` | 4 consecutive representative cycles before 1.0 (product exit gate) |
| Publishability | approved artifacts judged publishable with normal editing / reviewed artifacts | validation evidence + `artifact_version_approved` | At least 80% in Stratum 3 validation (existing product gate) |
| Mutation receipt completeness | paid/mutating actions with permission + provenance receipt / all such actions | canonical audit projection | 100% |
| Publication ambiguity | intents without explicit terminal or reconciliation state | `publication_terminalized` + publication projection | 0 |
| Duplicate verified publication | duplicate live outcomes per intent | publication projection + HP-007 | 0 |
| Recovery continuity | interrupted runs recovered/paused/reconciled without duplicate / supported interruptions | `run_recovery_completed` | 100% supported states |
| Evidence honesty | reviewed claims blocked or explicitly asserted when source absent | AE-003 + claim ledger | 100% final factual assertions supported or explicit creator assertion |
| Memory governance | proposal decision mix and forgotten-item retrieval leakage | AE-005 + memory corpus | leakage 0; decision mix baseline first |
| Reuse-first proof | real external Tool Pack runs with complete evidence and rollback | AE-006 | At least 1 before production creation gate |
| Skill receipt coverage | production invocations with exact revision/permission/cost receipt | AE-007 | 100% after invocation ships |
| Sync convergence | multi-device fixtures converged without last-write-wins loss | AE-009 | 100% fixtures; last-write-wins loss 0 |

## Dashboard Requirements

### Creator Loop and North Star

**Controls:** date range (7d, 28d, quarter, all), installation cohort month, experience band, workspace mode, release channel, refresh/last-updated.

**Display order:** weekly-cycle scorecard and trend → seven-step core funnel with step conversion → time-between-step distribution → approved artifact/publishability table → publication route/state stack → observation-to-decision conversion. Sources: local analytics SQL views over AE-003, AE-005, AE-008, AE-009.

### Trust and Governance

**Controls:** date range, operator role, release, trust surface (credential, capability, Tool Pack, Skill, memory, publication, team).

**Display order:** receipt completeness scorecard → blocked/denied decision trend → Tool Pack eligibility/activation funnel → Skill promotion/invocation/regression funnel → memory decision mix → publication ambiguity/duplicate table. Sources: AE-002, AE-004–008 plus canonical audit completeness view.

### Release and Validation

**Controls:** release, build, evidence class, story/epic, result, last-updated.

**Display order:** Ground evidence status → creator walkthrough outcomes → release trust gates → recovery/restore evidence → conformance results → whole-week evidence table. Sources: AE-001, AE-002, AE-004, AE-006, AE-007, AE-009.

## Epic Analytics Docs

| Doc | Epic | Events |
|-----|------|--------|
| AE-001 | E-001 Contracts and Product Proof | `ground_evidence_updated`, `creator_validation_completed`, `ground_signoff_decided` |
| AE-002 | E-002 Native Studio and Durable Harness | `run_recovery_completed`, `workspace_restore_completed`, `release_trust_gate_completed` |
| AE-003 | E-003 Idea Foundry and Creation Studio | `idea_revision_created`, `artifact_version_approved`, `creation_loop_completed` |
| AE-004 | E-004 MCP and Clark Bridge | `bridge_mutation_completed`, `bridge_job_reconnected`, `client_conformance_completed` |
| AE-005 | E-005 Governed Creator Memory | `memory_proposal_decided`, `memory_forget_completed`, `memory_influence_inspected` |
| AE-006 | E-006 Reuse-First Tool Packs | `tool_pack_evaluated`, `tool_pack_revision_activated`, `external_tool_pack_run_completed` |
| AE-007 | E-007 Governed Agent Skills | `skill_revision_decided`, `skill_invocation_completed`, `skill_regression_evaluated` |
| AE-008 | E-008 Distribution and Observation | `publication_terminalized`, `observation_reviewed`, `strategy_proposal_decided` |
| AE-009 | E-009 Team and Whole-Product Release | `workspace_sync_converged`, `weekly_cycle_completed`, `hosted_continuity_verified` |

## Implementation Notes

1. Find the story’s parent epic and read its `AE-NNN.md`.
2. Implement only rows whose Story column matches the story.
3. Fire after the canonical commit or completed inspection named in Trigger; never on render, click intent, retry, replay, or projection rebuild.
4. Validate event name, properties, enum values, one-fire semantics, and PII/content absence with the story’s `Automation: Analytics` test case.
5. Keep the local analytics projection rebuildable from canonical events without turning analytics rows into canonical product state.
6. Remote export stays off by default and passes the ADR-0018 canary corpus before release.

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created a local-first product analytics plan with 27 lean outcome events across nine epics. |
