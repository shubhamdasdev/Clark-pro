# Test Plan: Versioned Contracts and Upcasters

**ID:** T-001-001
**Project:** clark-pro
**Story:** S-001-001
**Epic:** E-001
**Stage:** Refinement
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13

---

## Scope

Verify Versioned Contracts and Upcasters end-to-end against every acceptance criterion, its trust-preserving negative path, boundary/idempotency behavior, and the canonical receipt/evidence contract. This plan does not infer story completion from a screen or document alone.

## Prerequisites

- A clean deterministic workspace fixture at the story’s required schema version.
- Access to clark-pro/contracts, clark-pro/evidence, and clark-pro/prototype and the canonical event/projection/receipt inspection harness.
- External systems use recorded or sandbox responses; no production mutation is required for routine CI.
- UI bucket note: product-team labels visible journey cases `Maestro`; Clark’s desktop executor is Playwright Electron with the same before/after evidence contract.

## AC Coverage Map

| AC | Test Cases | Bucket | Coverage |
|----|-----------|--------|----------|
| AC-001 | TC-001-001-001 (P0) | Unit / Harness | ✓ |
| AC-002 | TC-001-001-001 (P0), TC-001-001-002 | Unit / Harness · Unit / Harness | ✓ |

**Bucket totals:** 0 Maestro · 3 Unit / Harness · 0 Code Review. The P0 uses the cheapest bucket that still proves the AC; data and failure predicates remain Harness cases.

---

## Core Test Flow

### TC-001-001-001: Complete acceptance path for Versioned Contracts and Upcasters

**Type:** E2E
**Priority:** P0
**Automation:** Unit / Harness
**AC Covered:** AC-001, AC-002
**Dependencies:** Story dependencies and parent release architecture gate must be satisfied

**Setup:**
- Use the repository’s deterministic Node/Harness fixtures in clark-pro/contracts, clark-pro/evidence, and clark-pro/prototype.
- Reset canonical test state and record the starting event/projection/hash snapshot.
- Stub external providers or use recorded conformance responses; no production credentials.

**Steps:**
1. Establish: the contract verification commands run on the current commit.
2. Perform: all fixtures are evaluated.
3. Verify AC-001: all 18 schemas and generated outputs pass.
4. Establish: an unknown or future event version.
5. Perform: the runtime attempts to load it.
6. Verify AC-002: loading fails closed without rewriting history.
7. Re-run the same command or fixture identity and assert idempotent behavior with no duplicate mutation.

**Expected Result:**
- AC-001: Given the contract verification commands run on the current commit, when all fixtures are evaluated, then all 18 schemas and generated outputs pass.
- AC-002: Given an unknown or future event version, when the runtime attempts to load it, then loading fails closed without rewriting history.
- Canonical state and evidence match the exact tested revision; no hidden authority, duplicate mutation, or unsupported completion claim is introduced.

**Failure Indicators:**
Any AC outcome is absent, applies to a different version/actor/scope, bypasses a gate, duplicates state, loses lineage, or relies only on mocked/UI presence where runtime or human evidence is required.

---

## Sub Flows

### TC-001-001-002: Failed gate preserves prior trusted state and exposes recovery

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

### TC-001-001-003: Boundary, replay, and exact-version regression

**Type:** Edge Case
**Priority:** P2
**Automation:** Unit / Harness
**AC Covered:** AC-001, AC-002
**Dependencies:** None

**Setup:**
- Use the smallest deterministic fixture that exercises Keep the JSON Schema catalog and generated runtime manifest hash-pinned. and Reject unknown historical steps, future versions, and invalid upcast destinations..
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

- Broader capability beyond this verified slice remains in sibling stories and later releases.
- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.
- Full cross-story journey continuity is tested in TR plans and TF-006/TF-009/TF-015 where applicable, not repeated here.

## Automation Notes

- **Bucket allocation:** 0 Maestro · 3 Unit / Harness · 0 Code Review. The AC are backend/evidence predicates that can be proven without rendering, so Harness is the honest P0.
- **Desktop UI executor:** implement product-team `Maestro` bucket cases with Playwright Electron under `clark-pro/apps/desktop/tests/e2e/`; retain product-team TC IDs and screenshot labels.
- **Cheap journey-validating coverage:** TC-001-001-002 and TC-001-001-003 run in CI before any TF journey.
- **Harness location:** add a focused `node:test` fixture beside clark-pro/contracts, clark-pro/evidence, and clark-pro/prototype; use recorded providers and debug read APIs, not production secrets.
- **Selector strategy:** stable semantic roles/names first; `data-testid` only when role/name cannot distinguish exact-version state.
- **Flakiness risks:** OS prompts, signing/notarization, real providers, process death, and media timing require isolated release lanes with recorded receipts.
- **Automation priority:** Tier 1 = TC-001-001-001 and safety negative; Tier 2 = boundary/replay and analytics; Tier 3 = no source-only pass substitutes for a runtime/human AC.

---
