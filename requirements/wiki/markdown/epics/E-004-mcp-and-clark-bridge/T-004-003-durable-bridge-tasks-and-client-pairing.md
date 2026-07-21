# Test Plan: Durable Bridge Tasks and Client Pairing

**ID:** T-004-003
**Project:** clark-pro
**Story:** S-004-003
**Epic:** E-004
**Stage:** Refinement
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13

---

## Scope

Verify Durable Bridge Tasks and Client Pairing end-to-end against every acceptance criterion, its trust-preserving negative path, boundary/idempotency behavior, and the AE-004 product event. This plan does not infer story completion from a screen or document alone.

## Prerequisites

- A clean deterministic workspace fixture at the story’s required schema version.
- Access to clark-pro/mcp-conformance and clark-pro/services/harness and the canonical event/projection/receipt inspection harness.
- External systems use recorded or sandbox responses; no production mutation is required for routine CI.
- UI bucket note: product-team labels visible journey cases `Maestro`; Clark’s desktop executor is Playwright Electron with the same before/after evidence contract.

## AC Coverage Map

| AC | Test Cases | Bucket | Coverage |
|----|-----------|--------|----------|
| AC-001 | TC-004-003-001 (P0) | Unit / Harness | ✓ |
| AC-002 | TC-004-003-001 (P0), TC-004-003-002 | Unit / Harness · Unit / Harness | ✓ |
| AE-004 | TC-004-003-004 | Analytics | ✓ |

**Bucket totals:** 0 Maestro · 3 Unit / Harness · 0 Code Review · 1 Analytics. The P0 uses the cheapest bucket that still proves the AC; data and failure predicates remain Harness cases.

---

## Core Test Flow

### TC-004-003-001: Complete acceptance path for Durable Bridge Tasks and Client Pairing

**Type:** E2E
**Priority:** P0
**Automation:** Unit / Harness
**AC Covered:** AC-001, AC-002
**Dependencies:** Story dependencies and parent release architecture gate must be satisfied

**Setup:**
- Use the repository’s deterministic Node/Harness fixtures in clark-pro/mcp-conformance and clark-pro/services/harness.
- Reset canonical test state and record the starting event/projection/hash snapshot.
- Stub external providers or use recorded conformance responses; no production credentials.

**Steps:**
1. Establish: a client disconnects after starting durable work.
2. Perform: it reconnects with the same intent identity.
3. Verify AC-001: it receives the existing job rather than creating a duplicate.
4. Establish: client access is revoked.
5. Perform: it attempts a new read or mutation.
6. Verify AC-002: Clark denies access immediately while the canonical job state remains intact.
7. Re-run the same command or fixture identity and assert idempotent behavior with no duplicate mutation.

**Expected Result:**
- AC-001: Given a client disconnects after starting durable work, when it reconnects with the same intent identity, then it receives the existing job rather than creating a duplicate.
- AC-002: Given client access is revoked, when it attempts a new read or mutation, then Clark denies access immediately while the canonical job state remains intact.
- Canonical state and evidence match the exact tested revision; no hidden authority, duplicate mutation, or unsupported completion claim is introduced.

**Failure Indicators:**
Any AC outcome is absent, applies to a different version/actor/scope, bypasses a gate, duplicates state, loses lineage, or relies only on mocked/UI presence where runtime or human evidence is required.

---

## Sub Flows

### TC-004-003-002: Failed gate preserves prior trusted state and exposes recovery

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

### TC-004-003-003: Boundary, replay, and exact-version regression

**Type:** Edge Case
**Priority:** P2
**Automation:** Unit / Harness
**AC Covered:** AC-001, AC-002
**Dependencies:** None

**Setup:**
- Use the smallest deterministic fixture that exercises Map negotiated MCP Tasks or Clark job receipts to durable Harness runs with explicit cancellation and reconciliation states. and Pair and revoke clients through a Keychain-backed, workspace-scoped flow..
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

### TC-004-003-004: Analytics — bridge_job_reconnected fires with the documented shape

**Type:** Analytics
**Priority:** P1
**Automation:** Analytics
**AC Covered:** None (AE-004 coverage)
**Dependencies:** None

**AE reference:** AE-004 — `bridge_job_reconnected`; properties: task_mode: "mcp_task" | "clark_receipt", state: "running" | "waiting_review" | "terminal", duplicate_prevented: boolean; trigger: after a client reconnect resolves the same durable intent to a job.

**Setup:**
- A debug build with the local product-event projection queryable or a logged-event spy attached after canonical commit.

**Steps:**
1. Perform the action that reaches this trigger: after a client reconnect resolves the same durable intent to a job.
2. Confirm `bridge_job_reconnected` fires exactly once after the trigger, not on render, click intent, retry, replay, or projection rebuild.
3. Confirm the payload carries only the documented bounded properties: task_mode: "mcp_task" | "clark_receipt", state: "running" | "waiting_review" | "terminal", duplicate_prevented: boolean.
4. Exercise each documented enum/boolean path and confirm invalid or unbounded values are rejected.
5. Confirm no PII, creative/source/memory text, prompt/completion, raw URL/path/name/account, UUID, credential reference, or token appears.

**Expected Result:**
`bridge_job_reconnected` lands once in the local analytics projection with the exact privacy-safe shape. Remote export remains absent unless explicit opt-in is enabled.

**Failure Indicators:**
Missing, misnamed, early, double-fired, replay-fired, malformed, unbounded, or privacy-leaking event.

---

## Out of Scope

- Scope not named in this story remains in sibling stories or a later release; this story does not absorb the full parent epic.
- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.
- Full cross-story journey continuity is tested in TR plans and TF-006/TF-009/TF-015 where applicable, not repeated here.

## Automation Notes

- **Bucket allocation:** 0 Maestro · 3 Unit / Harness · 0 Code Review · 1 Analytics. The AC are backend/evidence predicates that can be proven without rendering, so Harness is the honest P0.
- **Desktop UI executor:** implement product-team `Maestro` bucket cases with Playwright Electron under `clark-pro/apps/desktop/tests/e2e/`; retain product-team TC IDs and screenshot labels.
- **Cheap journey-validating coverage:** TC-004-003-002 and TC-004-003-003 run in CI before any TF journey.
- **Harness location:** add a focused `node:test` fixture beside clark-pro/mcp-conformance and clark-pro/services/harness; use recorded providers and debug read APIs, not production secrets.
- **Selector strategy:** stable semantic roles/names first; `data-testid` only when role/name cannot distinguish exact-version state.
- **Flakiness risks:** OS prompts, signing/notarization, real providers, process death, and media timing require isolated release lanes with recorded receipts.
- **Automation priority:** Tier 1 = TC-004-003-001 and safety negative; Tier 2 = boundary/replay and analytics; Tier 3 = no source-only pass substitutes for a runtime/human AC.

---
