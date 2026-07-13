# Release: Whole-Product Beta

**ID:** R-003
**Project:** clark-pro
**Stage:** Draft
**Status:** Backlog
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13

---

## Goal

Run the complete creator cycle on real channels, then prove collaboration, remote continuity, and the Clark Pro 1.0 exit gate over four representative weeks.

## Stories in Scope

| Story | Title | Epic | Stage | Status |
|-------|-------|------|-------|--------|
| S-008-001 | Social Account and Credential Center | E-008 | Ready | Backlog |
| S-008-002 | Postiz Scheduling and Publication Ledger | E-008 | Ready | Backlog |
| S-008-003 | Assisted Handoff and Deterministic Export | E-008 | Ready | Backlog |
| S-008-004 | Observation Ingestion and Evidence Review | E-008 | Ready | Backlog |
| S-008-005 | Experiment and Strategy Loop | E-008 | Ready | Backlog |
| S-009-001 | Shared Workspaces, Roles, and Approval | E-009 | Ready | Backlog |
| S-009-002 | Encrypted Event Sync and Asset Mirror | E-009 | Ready | Backlog |
| S-009-003 | Scoped Remote Workers and Schedules | E-009 | Ready | Backlog |
| S-009-004 | Four-Week Whole-Product Proof | E-009 | Ready | Backlog |
| S-009-005 | Release, Hosted Continuity, and Tenant Isolation | E-009 | Ready | Backlog |

## Phases

| ID | Name | Start | End | Milestone | Summary |
|----|------|-------|-----|-----------|---------|
| P-003-01 | Distribution and Learning |  |  | Verified publication-to-reflection loop | Accounts, Postiz, export, observations, and experiments |
| P-003-02 | Team and Release Proof |  |  | Clark Pro 1.0 exit evidence | Shared workspaces, sync, remote workers, four-week proof, and release continuity |

## Out of Scope

- Broad enterprise administration beyond the minimum safe team model
- Direct Clark connectors for every social platform

## Dependencies

- R-002 must deliver the complete single-user creator loop.
- Postiz and selected platform accounts must pass capability and policy conformance.

## Definition of Done

- All stories in scope are `Status: Done`.
- Required automated, human, migration, recovery, security, and release evidence is attributable and linked.
- Product Team validation has no blocking errors and the static board export matches the committed requirements.

## developer Handoff

1. Load the `` skill and pull the latest main branch.
2. Read this release, then the story files below in dependency order.
3. Set a story to `In Progress` when picked up and `QA` only after self-testing every acceptance criterion.
4. File a Change Request instead of silently changing approved requirements.

### Pickup Order

- `requirements/epics/E-008-distribution-and-observation/S-008-001-social-account-and-credential-center.md` — Social Account and Credential Center
- `requirements/epics/E-008-distribution-and-observation/S-008-002-postiz-scheduling-and-publication-ledger.md` — Postiz Scheduling and Publication Ledger
- `requirements/epics/E-008-distribution-and-observation/S-008-003-assisted-handoff-and-deterministic-export.md` — Assisted Handoff and Deterministic Export
- `requirements/epics/E-008-distribution-and-observation/S-008-004-observation-ingestion-and-evidence-review.md` — Observation Ingestion and Evidence Review
- `requirements/epics/E-008-distribution-and-observation/S-008-005-experiment-and-strategy-loop.md` — Experiment and Strategy Loop
- `requirements/epics/E-009-team-and-whole-product-release/S-009-001-shared-workspaces-roles-and-approval.md` — Shared Workspaces, Roles, and Approval
- `requirements/epics/E-009-team-and-whole-product-release/S-009-002-encrypted-event-sync-and-asset-mirror.md` — Encrypted Event Sync and Asset Mirror
- `requirements/epics/E-009-team-and-whole-product-release/S-009-003-scoped-remote-workers-and-schedules.md` — Scoped Remote Workers and Schedules
- `requirements/epics/E-009-team-and-whole-product-release/S-009-004-four-week-whole-product-proof.md` — Four-Week Whole-Product Proof
- `requirements/epics/E-009-team-and-whole-product-release/S-009-005-release-hosted-continuity-and-tenant-isolation.md` — Release, Hosted Continuity, and Tenant Isolation

### Preservation Rules

- Keep canonical state, exact versions, permission receipts, and provenance on every path.
- Do not convert missing human, provider, or release evidence into an implementation claim.
- Keep external mutations idempotent or explicitly reconciling; do not blind-retry.

---
