# Test Plan: Source Ingestion and Claim Ledger

**ID:** T-003-003
**Project:** clark-pro
**Story:** S-003-003
**Epic:** E-003
**Stage:** Refinement
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13

---

## Scope

Verify Source Ingestion and Claim Ledger end-to-end against every acceptance criterion, its trust-preserving negative path, boundary/idempotency behavior, and the canonical receipt/evidence contract. This plan does not infer story completion from a screen or document alone.

## Prerequisites

- A clean deterministic workspace fixture at the story’s required schema version.
- Access to clark-pro/apps/desktop and clark-pro/services/harness and the canonical event/projection/receipt inspection harness.
- External systems use recorded or sandbox responses; no production mutation is required for routine CI.
- UI bucket note: product-team labels visible journey cases `Maestro`; Clark’s desktop executor is Playwright Electron with the same before/after evidence contract.

## AC Coverage Map

| AC | Test Cases | Bucket | Coverage |
|----|-----------|--------|----------|
| AC-001 | TC-003-003-001 (P0) | Maestro | ✓ |
| AC-002 | TC-003-003-001 (P0), TC-003-003-002 | Maestro · Unit / Harness | ✓ |

**Bucket totals:** 1 Maestro · 2 Unit / Harness · 0 Code Review. The P0 uses the cheapest bucket that still proves the AC; data and failure predicates remain Harness cases.

---

## Core Test Flow

### TC-003-003-001: Complete acceptance path for Source Ingestion and Claim Ledger

**Type:** E2E
**Priority:** P0
**Automation:** Maestro
**AC Covered:** AC-001, AC-002
**Dependencies:** Story dependencies and parent release architecture gate must be satisfied

**Captures:**
| Label | Screen | State |
|-------|--------|-------|
| before | DS-inbox | default |
| after | DS-inbox | verified |

**Preconditions:**
- A release-candidate Clark build is open on Screen: Inbox with the story’s required canonical fixture and permissions.
- The tester can inspect Harness events/receipts after the UI journey.

**Steps:**
1. Establish: a supported source is captured.
2. Perform: it enters a project.
3. Verify AC-001: its original content and provenance remain retrievable without starting research or generation.
4. Establish: a final factual assertion is reviewed.
5. Perform: no source or explicit creator assertion supports it.
6. Verify AC-002: approval is blocked with the missing evidence visible.
7. Inspect the resulting canonical event, exact version, actor, permission/provenance receipt, and retained recovery state from Screen: Inbox.

**Expected Result:**
- AC-001: Given a supported source is captured, when it enters a project, then its original content and provenance remain retrievable without starting research or generation.
- AC-002: Given a final factual assertion is reviewed, when no source or explicit creator assertion supports it, then approval is blocked with the missing evidence visible.
- Canonical state and evidence match the exact tested revision; no hidden authority, duplicate mutation, or unsupported completion claim is introduced.

**Failure Indicators:**
Any AC outcome is absent, applies to a different version/actor/scope, bypasses a gate, duplicates state, loses lineage, or relies only on mocked/UI presence where runtime or human evidence is required.

---

## Sub Flows

### TC-003-003-002: Failed gate preserves prior trusted state and exposes recovery

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

### TC-003-003-003: Boundary, replay, and exact-version regression

**Type:** Edge Case
**Priority:** P2
**Automation:** Unit / Harness
**AC Covered:** AC-001, AC-002
**Dependencies:** None

**Setup:**
- Use the smallest deterministic fixture that exercises Retain original bytes or text, source health, citations, claims, uncertainty, and creator assertions. and Support pin, dispute, replace, and saturation review without triggering paid work on capture..
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

---

## Out of Scope

- Scope not named in this story remains in sibling stories or a later release; this story does not absorb the full parent epic.
- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.
- Full cross-story journey continuity is tested in TR plans and TF-006/TF-009/TF-015 where applicable, not repeated here.

## Automation Notes

- **Bucket allocation:** 1 Maestro · 2 Unit / Harness · 0 Code Review. The visible exact-state journey stays in the UI bucket; failure and replay predicates run cheaply in Harness.
- **Desktop UI executor:** implement product-team `Maestro` bucket cases with Playwright Electron under `clark-pro/apps/desktop/tests/e2e/`; retain product-team TC IDs and screenshot labels.
- **Cheap journey-validating coverage:** TC-003-003-002 and TC-003-003-003 run in CI before any TF journey.
- **Harness location:** add a focused `node:test` fixture beside clark-pro/apps/desktop and clark-pro/services/harness; use recorded providers and debug read APIs, not production secrets.
- **Selector strategy:** stable semantic roles/names first; `data-testid` only when role/name cannot distinguish exact-version state.
- **Flakiness risks:** OS prompts, signing/notarization, real providers, process death, and media timing require isolated release lanes with recorded receipts.
- **Automation priority:** Tier 1 = TC-003-003-001 and safety negative; Tier 2 = boundary/replay and analytics; Tier 3 = no source-only pass substitutes for a runtime/human AC.

---
