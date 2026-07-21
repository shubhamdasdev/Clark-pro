# Flow Test Plan: Run the Full-Week loop

**ID:** TF-006
**Project:** clark-pro
**Flow:** [UF-006 Run the Full-Week loop](../flows/UF-006-run-the-full-week-loop.md)
**Type:** Flow regression — evergreen, re-run every release + nightly
**Stage:** Active
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Owner:** QA Agent (curated by PM)
**Style:** Journeys

> Each journey is one continuous UI/runtime session. Clark executes the product-team Maestro bucket through Playwright Electron while preserving journey IDs, shared setup, assertions, screenshots, and run-log evidence.

---

## Scope

Protect the primary daily/weekly creator spine across evidence ingestion, governed memory and extensions, bounded creation, exact-version review, scheduling, and whole-cycle proof.

**In scope:**
- Cross-story state continuity, exact-version authority, interruption/recovery, provider ambiguity, and the bound health probes HP-002, HP-003, HP-004, HP-006, HP-008.
- All AC across S-003-003, S-003-004, S-003-005, S-005-003, S-006-004, S-007-003, S-008-002, S-009-004 at the journey level; story test plans remain unit safety nets.

**Out of scope:**
- Re-running every T-NNN case individually; TF is the journey-level test of record.
- Production content, secrets, or real external mutation in nightly CI; sandbox/recorded providers mirror the contract.

## Lifecycle & Cadence

| Trigger | Action | Pass criteria |
|---------|--------|---------------|
| **Pre-release** | Run all journeys end-to-end on the release candidate build | All journeys complete successfully |
| **Pre-ship (R-NNN Shipped)** | Re-run all journeys on production build | All complete |
| **Nightly (post-launch)** | Run all journeys against production | Failures alert QA channel; ≥2 consecutive nightly fails escalate to PM |
| **After any BUG fix lands on a touched story** | Re-run any journey whose Stories Covered list includes the BUG's story | Targeted journey passes |
| **Flow diff** | When UF-NNN changes materially, bump TF-NNN version and update affected journeys | Plan stays in sync with the flow |

The QA Agent records every run in the Run Log.

## Journey A — Prepare a trustworthy week from real source material

**Story arc:** A recurring creator opens a project, confirms sources, memory, the real supported Tool Pack, the selected Skill, budget, and authority before choosing an angle.

**Stories covered:** S-003-003, S-005-003, S-006-004, S-007-003
**ACs hit inline:** S-003-003/AC-001, S-003-003/AC-002; S-005-003/AC-001, S-005-003/AC-002; S-006-004/AC-001, S-006-004/AC-002; S-007-003/AC-001, S-007-003/AC-002
**T-NNN backup (don't re-run):** T-003-003, T-005-003, T-006-004, T-007-003

**Preconditions:**
- The exact release fixture for UF-006 is seeded, the build/schema/consent state is recorded, and required sandbox providers are deterministic.
- Bound health probes HP-002, HP-003, HP-004, HP-006, HP-008 are queryable without exposing creative content or secrets.

**The journey:**

1. Open Focus on the seeded representative Full Week project.
2. ✓ Verify: selected Brand Constitution, accounts, budget, time window, and required review gates are visible.
3. Add text, URL, screenshot, and media sources through capture.
4. ✓ Verify: originals and provenance exist without research/generation starting on capture.
5. Run Check readiness and open Run Approval.
6. ✓ Verify: exact Tool Pack, adapter, capability, Skill, memory policy, cost, and permission revisions are named.
7. Deny one expanded permission in the alt fixture.
8. ✓ Verify: no external execution occurs and the prior trusted package/Skill remains active.
9. Approve the valid exact plan.
10. Follow Sensemaking to the angle decision in Focus.
11. ✓ Verify: claims, uncertainty, source health, and included/excluded memory references are inspectable.
12. Choose an angle and open Canvas.
13. ✓ Verify: the graph and receipt lineage match the exact approved plan.
14. Capture evidence screenshots and the HP-002/HP-004/HP-006 probe receipts.

**Alt branch — permission, provider, or interruption denial:** Repeat the highest-authority action with the permission revoked or provider unavailable. ✓ Verify: no hidden mutation occurs, prior canonical state remains intact, and the journey rejoins through the named recovery/reconciliation/export path.

**Failure indicators:**
- Any cross-story handoff loses exact version, actor, evidence, permission, cost, state, or recovery context.
- A bound probe (HP-002, HP-003, HP-004, HP-006, HP-008) fails, an external mutation duplicates, or an unknown state is mislabeled terminal.
- The UI appears complete while canonical, human, provider, or release evidence remains absent.

---

## Journey B — Create, compare, and approve a coordinated body of work

**Story arc:** The creator lets text and media branches execute under the approved plan, reconnects one async job, compares versions, and approves only the evidence-complete exact artifact.

**Stories covered:** S-003-004, S-003-005, S-005-003, S-006-004, S-007-003
**ACs hit inline:** S-003-004/AC-001, S-003-004/AC-002; S-003-005/AC-001, S-003-005/AC-002; S-005-003/AC-001, S-005-003/AC-002; S-006-004/AC-001, S-006-004/AC-002; S-007-003/AC-001, S-007-003/AC-002
**T-NNN backup (don't re-run):** T-003-004, T-003-005, T-005-003, T-006-004, T-007-003

**Preconditions:**
- The exact release fixture for UF-006 is seeded, the build/schema/consent state is recorded, and required sandbox providers are deterministic.
- Bound health probes HP-002, HP-003, HP-004, HP-006, HP-008 are queryable without exposing creative content or secrets.

**The journey:**

1. Resume the approved Full Week run from Canvas.
2. ✓ Verify: bounded text and media branches start with named revisions and budgets.
3. Interrupt the Harness during one asynchronous media provider job.
4. Relaunch Clark and open Recovery Summary.
5. ✓ Verify: the provider job reconnects by external identity and no second paid job starts.
6. Return to Canvas and wait for Review gates.
7. ✓ Verify: each artifact records inputs, provider/model, Tool Pack/capability, Skill, memory, cost, and technical metadata.
8. Open Review and Version Comparison.
9. ✓ Verify: synchronized previews/diffs preserve version identity and show evidence/policy/accessibility/disclosure state.
10. Approve one exact version and reject one alternative with a reason.
11. Change the upstream angle and open Impact Preview.
12. ✓ Verify: stale artifacts, reusable work, invalid approval, schedule risk, and regeneration cost appear before action.
13. Approve the replacement exact version.
14. Capture HP-003 and lineage evidence.

**Alt branch — permission, provider, or interruption denial:** Repeat the highest-authority action with the permission revoked or provider unavailable. ✓ Verify: no hidden mutation occurs, prior canonical state remains intact, and the journey rejoins through the named recovery/reconciliation/export path.

**Failure indicators:**
- Any cross-story handoff loses exact version, actor, evidence, permission, cost, state, or recovery context.
- A bound probe (HP-002, HP-003, HP-004, HP-006, HP-008) fails, an external mutation duplicates, or an unknown state is mislabeled terminal.
- The UI appears complete while canonical, human, provider, or release evidence remains absent.

---

## Journey C — Publish the week and close the evidence-to-learning loop

**Story arc:** The creator moves approved work to Timeline, submits one idempotent intent, reviews outcome evidence, and finalizes one weekly-cycle record without silent memory or Skill change.

**Stories covered:** S-003-005, S-008-002, S-009-004
**ACs hit inline:** S-003-005/AC-001, S-003-005/AC-002; S-008-002/AC-001, S-008-002/AC-002; S-009-004/AC-001, S-009-004/AC-002
**T-NNN backup (don't re-run):** T-003-005, T-008-002, T-009-004

**Preconditions:**
- The exact release fixture for UF-006 is seeded, the build/schema/consent state is recorded, and required sandbox providers are deterministic.
- Bound health probes HP-002, HP-003, HP-004, HP-006, HP-008 are queryable without exposing creative content or secrets.

**The journey:**

1. Open Timeline with the approved platform artifact.
2. ✓ Verify: account health, platform requirements, approval version, and schedule state are visible.
3. Open Publication Approval and submit the exact intent.
4. ✓ Verify: an intent/idempotency identity and provider receipt are persisted before verification.
5. Simulate a provider response loss after commit.
6. ✓ Verify: the intent enters Reconciliation and no blind retry occurs.
7. Resolve the fixture to one verified publication.
8. Open Observation and review fresh plus missing/incomparable fields.
9. ✓ Verify: lineage, definitions, freshness, missingness, and sample count remain visible.
10. Run reflection/strategy and reject one proposal.
11. ✓ Verify: rejected learning remains inactive and does not return without new evidence.
12. Finalize the weekly cycle evidence record.
13. ✓ Verify: capture → understand → create → review → distribute → observe → reflect → improve lineage is complete.
14. Capture HP-007/HP-008 and weekly evidence.

**Alt branch — permission, provider, or interruption denial:** Repeat the highest-authority action with the permission revoked or provider unavailable. ✓ Verify: no hidden mutation occurs, prior canonical state remains intact, and the journey rejoins through the named recovery/reconciliation/export path.

**Failure indicators:**
- Any cross-story handoff loses exact version, actor, evidence, permission, cost, state, or recovery context.
- A bound probe (HP-002, HP-003, HP-004, HP-006, HP-008) fails, an external mutation duplicates, or an unknown state is mislabeled terminal.
- The UI appears complete while canonical, human, provider, or release evidence remains absent.

---

## Coverage matrix

| Story | All ACs covered by | Notes |
|-------|--------------------|-------|
| S-003-003 Source Ingestion and Claim Ledger | Journey A (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-003-003 remains the unit-level safety net |
| S-003-004 Writing, Media, and Platform Variants | Journey B (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-003-004 remains the unit-level safety net |
| S-003-005 Version-Specific Review and Policy Gates | Journey B (all checkpoints), Journey C (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-003-005 remains the unit-level safety net |
| S-005-003 Semantic Retrieval and Reflection Lineage | Journey A (all checkpoints), Journey B (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-005-003 remains the unit-level safety net |
| S-006-004 Real Third-Party Acquisition and Execution | Journey A (all checkpoints), Journey B (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-006-004 remains the unit-level safety net |
| S-007-003 Run-Scoped Skill Invocation and Receipts | Journey A (all checkpoints), Journey B (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-007-003 remains the unit-level safety net |
| S-008-002 Postiz Scheduling and Publication Ledger | Journey C (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-008-002 remains the unit-level safety net |
| S-009-004 Four-Week Whole-Product Proof | Journey C (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-009-004 remains the unit-level safety net |

Every AC across S-003-003, S-003-004, S-003-005, S-005-003, S-006-004, S-007-003, S-008-002, S-009-004 is verified by at least one continuous journey. No invented story behavior; T-NNN are not re-run at flow level.

## Maestro implementation notes (for the QA Agent)

- One Playwright Electron flow per journey, retaining product-team naming `TF-006-journey-a|b|c`; do not split state continuity.
- Alt branches live in separate files such as `TF-006-journey-a-alt-permission-denied.spec.mjs` and reuse a shared seeded setup.
- Map ✓ Verify checkpoints to semantic role/name assertions and canonical debug-receipt queries; use AI visual assertions only for non-deterministic media layout.
- Capture one screenshot per ✓ Verify plus final state, and attach bound probe receipts HP-002, HP-003, HP-004, HP-006, HP-008.
- Run the listed T-plan Unit/Harness cases as cheap CI prechecks before the full UI journey.
- Never seed production credentials or creator content; use versioned representative fixtures and recorded provider responses.

## Run Log

| Run date | Build / commit | Trigger | Result | Failed journeys | Notes |
|----------|----------------|---------|--------|-----------------|-------|
| _no runs yet_ | — | — | — | — | Plan v1.0 created 2026-07-13 |
