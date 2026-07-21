# Flow Test Plan: Mac sleeps, quits, or crashes

**ID:** TF-015
**Project:** clark-pro
**Flow:** [UF-015 Mac sleeps, quits, or crashes](../flows/UF-015-mac-sleeps-quits-or-crashes.md)
**Type:** Flow regression — evergreen, re-run every release + nightly
**Stage:** Active
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Owner:** QA Agent (curated by PM)
**Style:** Journeys

> Each journey is one continuous UI/runtime session. Clark executes the PMAgent Maestro bucket through Playwright Electron while preserving journey IDs, shared setup, assertions, screenshots, and run-log evidence.

---

## Scope

Protect continuity when the renderer, Harness, Mac, client, provider, relay, or hosted worker disappears while work, approval, or publication is in flight.

**In scope:**
- Cross-story state continuity, exact-version authority, interruption/recovery, provider ambiguity, and the bound health probes HP-001, HP-002, HP-003, HP-005, HP-007, HP-009, HP-010.
- All AC across S-002-002, S-004-003, S-008-002, S-009-003, S-009-005 at the journey level; story test plans remain unit safety nets.

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

## Journey A — Recover local work at every durable gate

**Story arc:** A creator starts work from Studio and Bridge, kills the relevant process at a checkpoint, and returns to the same run/review identity with no duplicate.

**Stories covered:** S-002-002, S-004-003
**ACs hit inline:** S-002-002/AC-001, S-002-002/AC-002; S-004-003/AC-001, S-004-003/AC-002
**T-NNN backup (don't re-run):** T-002-002, T-004-003

**Preconditions:**
- The exact release fixture for UF-015 is seeded, the build/schema/consent state is recorded, and required sandbox providers are deterministic.
- Bound health probes HP-001, HP-002, HP-003, HP-005, HP-007, HP-009, HP-010 are queryable without exposing creative content or secrets.

**The journey:**

1. Start a fixture run from Focus and note run/intent/artifact identities.
2. Pair a scoped Bridge client and attach it to the same workspace.
3. Interrupt Harness during a running step.
4. Relaunch Clark and open Recovery Summary.
5. ✓ Verify: the step is classified, orphan lease revoked, and exact plan/checkpoint retained.
6. Reconnect the Bridge client with the same intent.
7. ✓ Verify: it receives the existing durable job rather than creating another.
8. Resume to a waiting Review gate.
9. Quit the renderer while Harness remains alive.
10. Reopen Studio.
11. ✓ Verify: the same review context and exact artifact version appear.
12. Delete/rebuild projections in the test harness.
13. ✓ Verify: state and event-chain integrity reproduce identically.
14. Capture HP-001/002/003/005 evidence.

**Alt branch — permission, provider, or interruption denial:** Repeat the highest-authority action with the permission revoked or provider unavailable. ✓ Verify: no hidden mutation occurs, prior canonical state remains intact, and the journey rejoins through the named recovery/reconciliation/export path.

**Failure indicators:**
- Any cross-story handoff loses exact version, actor, evidence, permission, cost, state, or recovery context.
- A bound probe (HP-001, HP-002, HP-003, HP-005, HP-007, HP-009, HP-010) fails, an external mutation duplicates, or an unknown state is mislabeled terminal.
- The UI appears complete while canonical, human, provider, or release evidence remains absent.

---

## Journey B — Let only explicitly delegated work continue during sleep

**Story arc:** A workspace admin delegates one sensitivity-safe job, sleeps the Mac, revokes the worker, and confirms unrelated personal authority and local continuity remain protected.

**Stories covered:** S-009-003, S-009-005
**ACs hit inline:** S-009-003/AC-001, S-009-003/AC-002; S-009-005/AC-001, S-009-005/AC-002
**T-NNN backup (don't re-run):** T-009-003, T-009-005

**Preconditions:**
- The exact release fixture for UF-015 is seeded, the build/schema/consent state is recorded, and required sandbox providers are deterministic.
- Bound health probes HP-001, HP-002, HP-003, HP-005, HP-007, HP-009, HP-010 are queryable without exposing creative content or secrets.

**The journey:**

1. Open Run Approval for a remote-eligible job.
2. Inspect named workspace, inputs, credential lease, capabilities, sensitivity, expiry, and worker identity.
3. Approve the exact envelope and put the Mac to sleep.
4. ✓ Verify: local-only jobs pause while only the delegated job continues.
5. Wake the Mac and open Recovery Summary.
6. ✓ Verify: the signed worker result is validated before canonical append.
7. Attempt unrelated memory/credential access from the worker fixture.
8. ✓ Verify: access is denied and audited.
9. Revoke the worker and replay the envelope.
10. ✓ Verify: replay/revoked access fails.
11. Disable hosted relay/worker service.
12. Open the local workspace and export it.
13. ✓ Verify: complete local access/export work without cross-tenant exposure.
14. Capture HP-010 and local continuity evidence.

**Alt branch — permission, provider, or interruption denial:** Repeat the highest-authority action with the permission revoked or provider unavailable. ✓ Verify: no hidden mutation occurs, prior canonical state remains intact, and the journey rejoins through the named recovery/reconciliation/export path.

**Failure indicators:**
- Any cross-story handoff loses exact version, actor, evidence, permission, cost, state, or recovery context.
- A bound probe (HP-001, HP-002, HP-003, HP-005, HP-007, HP-009, HP-010) fails, an external mutation duplicates, or an unknown state is mislabeled terminal.
- The UI appears complete while canonical, human, provider, or release evidence remains absent.

---

## Journey C — Reconcile publication before any recovered retry

**Story arc:** A creator submits a publication immediately before crash, then uses recovery and provider observation to prove the outcome before any retry is possible.

**Stories covered:** S-002-002, S-008-002
**ACs hit inline:** S-002-002/AC-001, S-002-002/AC-002; S-008-002/AC-001, S-008-002/AC-002
**T-NNN backup (don't re-run):** T-002-002, T-008-002

**Preconditions:**
- The exact release fixture for UF-015 is seeded, the build/schema/consent state is recorded, and required sandbox providers are deterministic.
- Bound health probes HP-001, HP-002, HP-003, HP-005, HP-007, HP-009, HP-010 are queryable without exposing creative content or secrets.

**The journey:**

1. Seed one approved artifact and healthy account.
2. Submit the publication intent.
3. Crash after provider commit but before Clark records the response.
4. Relaunch Clark.
5. ✓ Verify: Recovery Summary identifies an ambiguous publication intent.
6. Open Reconciliation.
7. Inspect intent, last local receipt, provider identity, and retry safety.
8. Run provider observation.
9. ✓ Verify: no submit retry fires while state is unknown.
10. Resolve fixture to verified live or proven not submitted.
11. If live, terminalize the original intent; if absent, request a fresh explicit retry decision.
12. ✓ Verify: one outcome and one canonical intent; no duplicate.
13. Run backup/restore fixture and inspect the publication state after restore.
14. Capture HP-007/HP-009 evidence.

**Alt branch — permission, provider, or interruption denial:** Repeat the highest-authority action with the permission revoked or provider unavailable. ✓ Verify: no hidden mutation occurs, prior canonical state remains intact, and the journey rejoins through the named recovery/reconciliation/export path.

**Failure indicators:**
- Any cross-story handoff loses exact version, actor, evidence, permission, cost, state, or recovery context.
- A bound probe (HP-001, HP-002, HP-003, HP-005, HP-007, HP-009, HP-010) fails, an external mutation duplicates, or an unknown state is mislabeled terminal.
- The UI appears complete while canonical, human, provider, or release evidence remains absent.

---

## Coverage matrix

| Story | All ACs covered by | Notes |
|-------|--------------------|-------|
| S-002-002 Durable Event Store and Run Recovery | Journey A (all checkpoints), Journey C (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-002-002 remains the unit-level safety net |
| S-004-003 Durable Bridge Tasks and Client Pairing | Journey A (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-004-003 remains the unit-level safety net |
| S-008-002 Postiz Scheduling and Publication Ledger | Journey C (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-008-002 remains the unit-level safety net |
| S-009-003 Scoped Remote Workers and Schedules | Journey B (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-009-003 remains the unit-level safety net |
| S-009-005 Release, Hosted Continuity, and Tenant Isolation | Journey B (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-009-005 remains the unit-level safety net |

Every AC across S-002-002, S-004-003, S-008-002, S-009-003, S-009-005 is verified by at least one continuous journey. No invented story behavior; T-NNN are not re-run at flow level.

## Maestro implementation notes (for the QA Agent)

- One Playwright Electron flow per journey, retaining PMAgent naming `TF-015-journey-a|b|c`; do not split state continuity.
- Alt branches live in separate files such as `TF-015-journey-c-alt-reconciliation-unavailable.spec.mjs` and reuse a shared seeded setup.
- Map ✓ Verify checkpoints to semantic role/name assertions and canonical debug-receipt queries; use AI visual assertions only for non-deterministic media layout.
- Capture one screenshot per ✓ Verify plus final state, and attach bound probe receipts HP-001, HP-002, HP-003, HP-005, HP-007, HP-009, HP-010.
- Run the listed T-plan Unit/Harness cases as cheap CI prechecks before the full UI journey.
- Never seed production credentials or creator content; use versioned representative fixtures and recorded provider responses.

## Run Log

| Run date | Build / commit | Trigger | Result | Failed journeys | Notes |
|----------|----------------|---------|--------|-----------------|-------|
| _no runs yet_ | — | — | — | — | Plan v1.0 created 2026-07-13 |

## Open Questions

1. Establish performance and remote SLO thresholds from representative baseline runs; no threshold is fabricated in this plan.
2. Confirm the production provider/account/hosted matrix before the pre-ship run; contract fixtures remain the CI default.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created — 3 journeys cover all AC across 5 stories and bind HP-001, HP-002, HP-003, HP-005, HP-007, HP-009, HP-010. |
