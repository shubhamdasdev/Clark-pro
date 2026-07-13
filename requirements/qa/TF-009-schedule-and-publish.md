# Flow Test Plan: Schedule and publish

**ID:** TF-009
**Project:** clark-pro
**Flow:** [UF-009 Schedule and publish](../flows/UF-009-schedule-and-publish.md)
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

Protect the external-mutation safety boundary across account scope, exact approval, idempotent publication, reconciliation, and deterministic fallback export.

**In scope:**
- Cross-story state continuity, exact-version authority, interruption/recovery, provider ambiguity, and the bound health probes HP-004, HP-007.
- All AC across S-008-001, S-008-002, S-008-003 at the journey level; story test plans remain unit safety nets.

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

## Journey A — Connect an account and verify one live publication

**Story arc:** A workspace admin connects a scoped account; the creator schedules an approved exact version and follows it to verified live state.

**Stories covered:** S-008-001, S-008-002
**ACs hit inline:** S-008-001/AC-001, S-008-001/AC-002; S-008-002/AC-001, S-008-002/AC-002
**T-NNN backup (don't re-run):** T-008-001, T-008-002

**Preconditions:**
- The exact release fixture for UF-009 is seeded, the build/schema/consent state is recorded, and required sandbox providers are deterministic.
- Bound health probes HP-004, HP-007 are queryable without exposing creative content or secrets.

**The journey:**

1. Open Connections and select the social provider.
2. Review publisher, scopes, workspace grants, domains, cost, and trust state.
3. ✓ Verify: no token material is rendered or stored in canonical events.
4. Complete broker-owned authorization and health checks.
5. Open Timeline and select the approved artifact.
6. ✓ Verify: current platform schema, account health, disclosure, and exact approval are valid.
7. Schedule the artifact and open Publication Approval.
8. Submit the exact intent once.
9. ✓ Verify: idempotency identity and provider receipt persist before observation.
10. Observe until the fixture reports verified live.
11. ✓ Verify: live URL/receipt reconcile to one intent and one artifact version.
12. Revoke the account.
13. ✓ Verify: future dependent work blocks and affected schedules are identified.
14. Capture HP-004/HP-007 evidence.

**Alt branch — permission, provider, or interruption denial:** Repeat the highest-authority action with the permission revoked or provider unavailable. ✓ Verify: no hidden mutation occurs, prior canonical state remains intact, and the journey rejoins through the named recovery/reconciliation/export path.

**Failure indicators:**
- Any cross-story handoff loses exact version, actor, evidence, permission, cost, state, or recovery context.
- A bound probe (HP-004, HP-007) fails, an external mutation duplicates, or an unknown state is mislabeled terminal.
- The UI appears complete while canonical, human, provider, or release evidence remains absent.

---

## Journey B — Reconcile an ambiguous provider outcome without duplication

**Story arc:** A creator loses the provider response after submission, restarts Clark, and resolves the publication by observation rather than retry.

**Stories covered:** S-008-002
**ACs hit inline:** S-008-002/AC-001, S-008-002/AC-002
**T-NNN backup (don't re-run):** T-008-002

**Preconditions:**
- The exact release fixture for UF-009 is seeded, the build/schema/consent state is recorded, and required sandbox providers are deterministic.
- Bound health probes HP-004, HP-007 are queryable without exposing creative content or secrets.

**The journey:**

1. Seed an approved artifact and healthy account in Timeline.
2. Submit through the response-loss-after-commit fixture.
3. Terminate Harness before a response is recorded.
4. Relaunch Clark and open Recovery Summary.
5. ✓ Verify: the publication is classified needs_reconciliation, not failed or ready-to-retry.
6. Open Reconciliation and inspect intent/last receipt.
7. Run Check provider state.
8. ✓ Verify: no new submit call occurs during observation.
9. Resolve the provider fixture to live.
10. ✓ Verify: exactly one verified publication exists and the original intent is terminal.
11. Replay the same intent command.
12. ✓ Verify: it returns the existing publication, not a duplicate.
13. Capture the HP-007 receipt and provider call count.

**Alt branch — permission, provider, or interruption denial:** Repeat the highest-authority action with the permission revoked or provider unavailable. ✓ Verify: no hidden mutation occurs, prior canonical state remains intact, and the journey rejoins through the named recovery/reconciliation/export path.

**Failure indicators:**
- Any cross-story handoff loses exact version, actor, evidence, permission, cost, state, or recovery context.
- A bound probe (HP-004, HP-007) fails, an external mutation duplicates, or an unknown state is mislabeled terminal.
- The UI appears complete while canonical, human, provider, or release evidence remains absent.

---

## Journey C — Export safely when automation cannot proceed

**Story arc:** A creator encounters a connector outage, exports a complete platform-valid package, performs the human handoff, and records the assisted result distinctly.

**Stories covered:** S-008-003
**ACs hit inline:** S-008-003/AC-001, S-008-003/AC-002
**T-NNN backup (don't re-run):** T-008-003

**Preconditions:**
- The exact release fixture for UF-009 is seeded, the build/schema/consent state is recorded, and required sandbox providers are deterministic.
- Bound health probes HP-004, HP-007 are queryable without exposing creative content or secrets.

**The journey:**

1. Open Timeline with an approved artifact and an unavailable connector.
2. Choose the documented export fallback.
3. ✓ Verify: Export Package names exact artifact version, platform, metadata, disclosures, and lineage.
4. Build the deterministic package.
5. ✓ Verify: media/copy/metadata/checksums/instructions pass local validation.
6. Inspect the manifest and compare it with canonical provenance.
7. Complete the manual platform handoff in the sandbox.
8. Record the assisted result and live URL/receipt.
9. ✓ Verify: the publication state is assisted/exported, not falsely labeled direct API verified.
10. Repeat package generation.
11. ✓ Verify: equivalent inputs produce the same manifest/checksums.
12. Return to Timeline and inspect the final state.
13. Capture export and assisted-result evidence.

**Alt branch — permission, provider, or interruption denial:** Repeat the highest-authority action with the permission revoked or provider unavailable. ✓ Verify: no hidden mutation occurs, prior canonical state remains intact, and the journey rejoins through the named recovery/reconciliation/export path.

**Failure indicators:**
- Any cross-story handoff loses exact version, actor, evidence, permission, cost, state, or recovery context.
- A bound probe (HP-004, HP-007) fails, an external mutation duplicates, or an unknown state is mislabeled terminal.
- The UI appears complete while canonical, human, provider, or release evidence remains absent.

---

## Coverage matrix

| Story | All ACs covered by | Notes |
|-------|--------------------|-------|
| S-008-001 Social Account and Credential Center | Journey A (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-008-001 remains the unit-level safety net |
| S-008-002 Postiz Scheduling and Publication Ledger | Journey A (all checkpoints), Journey B (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-008-002 remains the unit-level safety net |
| S-008-003 Assisted Handoff and Deterministic Export | Journey C (all checkpoints) | AC-001 and AC-002 exercised in continuous state; T-008-003 remains the unit-level safety net |

Every AC across S-008-001, S-008-002, S-008-003 is verified by at least one continuous journey. No invented story behavior; T-NNN are not re-run at flow level.

## Maestro implementation notes (for the QA Agent)

- One Playwright Electron flow per journey, retaining PMAgent naming `TF-009-journey-a|b|c`; do not split state continuity.
- Alt branches live in separate files such as `TF-009-journey-b-alt-provider-unavailable.spec.mjs` and reuse a shared seeded setup.
- Map ✓ Verify checkpoints to semantic role/name assertions and canonical debug-receipt queries; use AI visual assertions only for non-deterministic media layout.
- Capture one screenshot per ✓ Verify plus final state, and attach bound probe receipts HP-004, HP-007.
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
| 2026-07-13 | 1.0 | PM Agent | Created — 3 journeys cover all AC across 3 stories and bind HP-004, HP-007. |
