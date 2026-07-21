# Test Plan: Four-Week Whole-Product Proof

**ID:** T-009-004
**Project:** clark-pro
**Story:** S-009-004
**Epic:** E-009
**Stage:** Refinement
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13

---

## Scope

Verify Four-Week Whole-Product Proof end-to-end against every acceptance criterion, its trust-preserving negative path, boundary/idempotency behavior, and the AE-009 product event. This plan does not infer story completion from a screen or document alone.

## Prerequisites

- A clean deterministic workspace fixture at the story’s required schema version.
- Access to clark-pro/packages/sync, clark-pro/services/worker, relay, and hosted fixtures and the canonical event/projection/receipt inspection harness.
- External systems use recorded or sandbox responses; no production mutation is required for routine CI.
- UI bucket note: product-team labels visible journey cases `Maestro`; Clark’s desktop executor is Playwright Electron with the same before/after evidence contract.

## AC Coverage Map

| AC | Test Cases | Bucket | Coverage |
|----|-----------|--------|----------|
| AC-001 | TC-009-004-001 (P0) | Maestro | ✓ |
| AC-002 | TC-009-004-001 (P0), TC-009-004-002 | Maestro · Unit / Harness | ✓ |
| AE-009 | TC-009-004-004 | Analytics | ✓ |

**Bucket totals:** 1 Maestro · 2 Unit / Harness · 0 Code Review · 1 Analytics. The P0 uses the cheapest bucket that still proves the AC; data and failure predicates remain Harness cases.

---

## Core Test Flow

### TC-009-004-001: Complete acceptance path for Four-Week Whole-Product Proof

**Type:** E2E
**Priority:** P0
**Automation:** Maestro
**AC Covered:** AC-001, AC-002
**Dependencies:** Story dependencies and parent release architecture gate must be satisfied

**Captures:**
| Label | Screen | State |
|-------|--------|-------|
| before | DS-focus | default |
| after | DS-focus | verified |

**Preconditions:**
- A release-candidate Clark build is open on Screen: Focus with the story’s required canonical fixture and permissions.
- The tester can inspect Harness events/receipts after the UI journey.

**Steps:**
1. Establish: four consecutive weekly cycles finish.
2. Perform: evidence is audited.
3. Verify AC-001: every required action, artifact, publication, observation, memory, and Skill revision has complete lineage.
4. Establish: any duplicate publication, unexplained state, failed restore, silent learning, or missing fallback occurs.
5. Perform: the exit gate is evaluated.
6. Verify AC-002: Clark Pro 1.0 remains blocked.
7. Inspect the resulting canonical event, exact version, actor, permission/provenance receipt, and retained recovery state from Screen: Focus.

**Expected Result:**
- AC-001: Given four consecutive weekly cycles finish, when evidence is audited, then every required action, artifact, publication, observation, memory, and Skill revision has complete lineage.
- AC-002: Given any duplicate publication, unexplained state, failed restore, silent learning, or missing fallback occurs, when the exit gate is evaluated, then Clark Pro 1.0 remains blocked.
- Canonical state and evidence match the exact tested revision; no hidden authority, duplicate mutation, or unsupported completion claim is introduced.

**Failure Indicators:**
Any AC outcome is absent, applies to a different version/actor/scope, bypasses a gate, duplicates state, loses lineage, or relies only on mocked/UI presence where runtime or human evidence is required.

---

## Sub Flows

### TC-009-004-002: Failed gate preserves prior trusted state and exposes recovery

**Type:** Negative
**Priority:** P1
**Automation:** Unit / Harness
**AC Covered:** AC-002
**Dependencies:** None

**Setup:**
- Seed one valid prior canonical state and record aggregate version, event count, active revision/authority, asset hashes, and projection snapshot.
- Configure the relevant trust, evidence, compatibility, recovery, or policy check to fail deterministically.

**Steps:**
1. Invoke the story action against the failing gate.
2. Assert no unauthorized provider, filesystem, credential, package, publication, memory, Skill, or canonical mutation occurs.
3. Compare the post-run snapshot with the recorded trusted state.
4. Assert a bounded failure receipt identifies the failed gate, owner, and valid retry/rollback/read-only next action.
5. Restore the valid condition and prove the inverse path can proceed.

**Expected Result:**
A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

**Failure Indicators:**
Partial canonical write, lost prior revision, leaked secret/content, silent retry, vague error without next action, or a false “complete” state.

### TC-009-004-003: Boundary, replay, and exact-version regression

**Type:** Edge Case
**Priority:** P2
**Automation:** Unit / Harness
**AC Covered:** AC-001, AC-002
**Dependencies:** None

**Setup:**
- Use the smallest deterministic fixture that exercises Run capture, understand, create, review, distribute, observe, reflect, and improve across the creator's actual channels. and Record provenance, interruptions, publications, fallbacks, time, cost, creator judgment, memory changes, and skill changes..
- Capture the input identity, schema/revision, actor/scope, event count, and expected output hash/receipt.

**Steps:**
1. Execute at the lower valid boundary and assert the documented result.
2. Execute at the upper/expanded/expired/stale or incompatible boundary and assert fail-closed behavior.
3. Replay the original command, intent, provider response, or recovery checkpoint.
4. Assert exact-version binding, no duplicate mutation/cost, and deterministic projection state.
5. Rebuild the relevant projection or reopen the app and confirm the same observable result.

**Expected Result:**
The story remains deterministic across boundary input, replay, restart, and projection rebuild; permissions and approvals do not expand or transfer to another revision.

**Failure Indicators:**
Off-by-one acceptance, replay duplication, stale approval, permission expansion, nondeterministic projection, or output/receipt drift.

### TC-009-004-004: Analytics — weekly_cycle_completed fires with the documented shape

**Type:** Analytics
**Priority:** P1
**Automation:** Analytics
**AC Covered:** None (AE-009 coverage)
**Dependencies:** None

**AE reference:** AE-009 — `weekly_cycle_completed`; properties: week_number: "one" | "two" | "three" | "four_plus", result: "complete" | "blocked", fallback_used: boolean; trigger: after one capture-to-learning cycle evidence record is finalized.

**Setup:**
- A debug build with the local product-event projection queryable or a logged-event spy attached after canonical commit.

**Steps:**
1. Perform the action that reaches this trigger: after one capture-to-learning cycle evidence record is finalized.
2. Confirm `weekly_cycle_completed` fires exactly once after the trigger, not on render, click intent, retry, replay, or projection rebuild.
3. Confirm the payload carries only the documented bounded properties: week_number: "one" | "two" | "three" | "four_plus", result: "complete" | "blocked", fallback_used: boolean.
4. Exercise each documented enum/boolean path and confirm invalid or unbounded values are rejected.
5. Confirm no PII, creative/source/memory text, prompt/completion, raw URL/path/name/account, UUID, credential reference, or token appears.

**Expected Result:**
`weekly_cycle_completed` lands once in the local analytics projection with the exact privacy-safe shape. Remote export remains absent unless explicit opt-in is enabled.

**Failure Indicators:**
Missing, misnamed, early, double-fired, replay-fired, malformed, unbounded, or privacy-leaking event.

---

## Out of Scope

- Scope not named in this story remains in sibling stories or a later release; this story does not absorb the full parent epic.
- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.
- Full cross-story journey continuity is tested in TR plans and TF-006/TF-009/TF-015 where applicable, not repeated here.

## Automation Notes

- **Bucket allocation:** 1 Maestro · 2 Unit / Harness · 0 Code Review · 1 Analytics. The visible exact-state journey stays in the UI bucket; failure and replay predicates run cheaply in Harness.
- **Desktop UI executor:** implement product-team `Maestro` bucket cases with Playwright Electron under `clark-pro/apps/desktop/tests/e2e/`; retain product-team TC IDs and screenshot labels.
- **Cheap journey-validating coverage:** TC-009-004-002 and TC-009-004-003 run in CI before any TF journey.
- **Harness location:** add a focused `node:test` fixture beside clark-pro/packages/sync, clark-pro/services/worker, relay, and hosted fixtures; use recorded providers and debug read APIs, not production secrets.
- **Selector strategy:** stable semantic roles/names first; `data-testid` only when role/name cannot distinguish exact-version state.
- **Flakiness risks:** OS prompts, signing/notarization, real providers, process death, and media timing require isolated release lanes with recorded receipts.
- **Automation priority:** Tier 1 = TC-009-004-001 and safety negative; Tier 2 = boundary/replay and analytics; Tier 3 = no source-only pass substitutes for a runtime/human AC.

---
