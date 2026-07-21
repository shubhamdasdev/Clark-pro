# Release Test Plan: Single-User Creator Alpha

**ID:** TR-002
**Project:** clark-pro
**Release:** R-002
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13

---

## Release Goal

Complete the remaining local single-user creator system and trust boundaries needed before real multi-channel distribution begins.

## Coverage Summary

| Story | Title | Test Plan | P0 | P1 | P2 | Gap |
|-------|-------|-----------|----|----|----|-----|
| S-001-003 | Representative Creator Validation | T-001-003 ✓ | 1 | 1 | 1 + A | — |
| S-001-004 | Commercial and Leadership Signoff | T-001-004 ✓ | 1 | 1 | 1 + A | — |
| S-002-003 | Workspace Portability and Backup Recovery | T-002-003 ✓ | 1 | 1 | 1 + A | — |
| S-002-004 | Keychain, Signing, and Safe Updates | T-002-004 ✓ | 1 | 1 | 1 + A | — |
| S-002-005 | Accessibility and Performance Release Evidence | T-002-005 ✓ | 1 | 1 | 1 | — |
| S-003-003 | Source Ingestion and Claim Ledger | T-003-003 ✓ | 1 | 1 | 1 | — |
| S-003-004 | Writing, Media, and Platform Variants | T-003-004 ✓ | 1 | 1 | 1 + A | — |
| S-003-005 | Version-Specific Review and Policy Gates | T-003-005 ✓ | 1 | 1 | 1 + A | — |
| S-004-003 | Durable Bridge Tasks and Client Pairing | T-004-003 ✓ | 1 | 1 | 1 + A | — |
| S-004-004 | External Client Examples and Compatibility | T-004-004 ✓ | 1 | 1 | 1 + A | — |
| S-005-003 | Semantic Retrieval and Reflection Lineage | T-005-003 ✓ | 1 | 1 | 1 + A | — |
| S-005-004 | Physical Erasure and Memory Validation Corpus | T-005-004 ✓ | 1 | 1 | 1 | — |
| S-006-004 | Real Third-Party Acquisition and Execution | T-006-004 ✓ | 1 | 1 | 1 + A | — |
| S-006-005 | Clark Kit SDK and Community Compatibility | T-006-005 ✓ | 1 | 1 | 1 | — |
| S-007-003 | Run-Scoped Skill Invocation and Receipts | T-007-003 ✓ | 1 | 1 | 1 + A | — |
| S-007-004 | Community Skills and Class B/C Sandbox | T-007-004 ✓ | 1 | 1 | 1 | — |
| S-007-005 | Reflection-Driven Skill Proposals and Regression | T-007-005 ✓ | 1 | 1 | 1 + A | — |

**Total:** 17 P0, 17 P1 safety, 17 P2 boundary/replay, and 12 Analytics cases across 17 stories. No documentation-coverage gaps; execution evidence remains pending where story status is not Done.

## Integration Test Cases

> product-team’s `Automation: Maestro` UI bucket is executed with Playwright Electron for this Mac desktop product, retaining ITC IDs, semantic assertions, and evidence screenshots.

### ITC-002-001: Install, restore, create, and approve one production-contract body of work

**Stories Covered:** S-002-003, S-002-004, S-002-005, S-003-003, S-003-004, S-003-005
**Priority:** P1
**Automation:** Maestro

**Preconditions:**
- All listed stories and architecture tasks for R-002 are implemented in the release-candidate environment.
- Deterministic fixtures and only approved sandbox/provider credentials are available.

**Steps:**
1. Start from the clean release fixture and record the build, schema, workspace, event offset, and consent state.
2. Install the release-trusted build, restore/import a workspace, run the evidence-to-variant loop with keyboard/VoiceOver, and approve one exact version.
3. Inspect exact actor, version, permission, cost, provenance, recovery, and external receipt evidence at each story boundary.
4. Interrupt once at the highest-risk boundary and resume through the documented recovery or reconciliation path.
5. Export the final QA evidence bundle and compare canonical state with the expected release fixture.

**Expected Result:**
The full scenario reaches the release goal without bypass, duplicate mutation, lost lineage, silent learning, ambiguous publication, or unsupported evidence claim.

**Failure Indicators:**
A story passes alone but composition loses scope, version, authority, receipt, recoverability, accessibility, or terminal-state honesty.

### ITC-002-002: External capability, Tool Pack, Skill, and Bridge execute under one run policy

**Stories Covered:** S-004-003, S-004-004, S-006-004, S-006-005, S-007-003, S-007-004
**Priority:** P2
**Automation:** Maestro

**Preconditions:**
- All listed stories and architecture tasks for R-002 are implemented in the release-candidate environment.
- Deterministic fixtures and only approved sandbox/provider credentials are available.

**Steps:**
1. Start from the clean release fixture and record the build, schema, workspace, event offset, and consent state.
2. Pair a client, acquire a supported pack/community Skill, execute under the four-way permission intersection, disconnect/reconnect, and inspect receipts/rollback.
3. Inspect exact actor, version, permission, cost, provenance, recovery, and external receipt evidence at each story boundary.
4. Interrupt once at the highest-risk boundary and resume through the documented recovery or reconciliation path.
5. Export the final QA evidence bundle and compare canonical state with the expected release fixture.

**Expected Result:**
The full scenario reaches the release goal without bypass, duplicate mutation, lost lineage, silent learning, ambiguous publication, or unsupported evidence claim.

**Failure Indicators:**
A story passes alone but composition loses scope, version, authority, receipt, recoverability, accessibility, or terminal-state honesty.

### ITC-002-003: Evidence becomes governed memory/Skill without silent learning

**Stories Covered:** S-005-003, S-005-004, S-007-005, S-001-003, S-001-004
**Priority:** P2
**Automation:** Maestro

**Preconditions:**
- All listed stories and architecture tasks for R-002 are implemented in the release-candidate environment.
- Deterministic fixtures and only approved sandbox/provider credentials are available.

**Steps:**
1. Start from the clean release fixture and record the build, schema, workspace, event offset, and consent state.
2. Complete a representative creator trajectory, inspect memory/Skill proposals, exercise correction/forget/regression, and retain Ground blocks until human/commercial evidence signs.
3. Inspect exact actor, version, permission, cost, provenance, recovery, and external receipt evidence at each story boundary.
4. Interrupt once at the highest-risk boundary and resume through the documented recovery or reconciliation path.
5. Export the final QA evidence bundle and compare canonical state with the expected release fixture.

**Expected Result:**
The full scenario reaches the release goal without bypass, duplicate mutation, lost lineage, silent learning, ambiguous publication, or unsupported evidence claim.

**Failure Indicators:**
A story passes alone but composition loses scope, version, authority, receipt, recoverability, accessibility, or terminal-state honesty.

## Go / No-Go Criteria

- [ ] Every story P0 and P1 case passes; P2 exceptions have a named owner, risk acceptance, and expiry.
- [ ] Every ITC passes on the exact release candidate, including one interruption/recovery branch.
- [ ] All 12 required Analytics cases prove exact once-after-commit, bounded properties, no PII/content, and opt-in export behavior.
- [ ] Architecture Gate is open where present; every AT acceptance criterion has attributable evidence.
- [ ] All included stories are Status Done and no P0/P1 defect or security/privacy/duplicate-publication/restore/tenant-isolation defect remains open.
- [ ] Contract, migration, conformance, hostile, accessibility, performance, backup, packaging, and health-probe evidence required by this release is linked.
- [ ] Human, provider, commercial, and four-week evidence is not replaced by mocked or automated proof.

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Real provider/platform behavior differs from recorded fixtures | Medium | High | Contract discovery, sandbox smoke, schema/freshness visibility, deterministic export fallback |
| Process interruption exposes replay/duplicate bugs | Medium | Critical | HP-003/HP-007 chaos, exact intent/job identities, TF-015 |
| OS signing, Keychain, VoiceOver, or update behavior passes source tests but fails packaged Mac | Medium | High | Isolated packaged release lane on oldest supported Mac; observed evidence |
| Telemetry/support evidence leaks creator content or secrets | Low | Critical | ADR-0018 allowlist, canary corpus, preview and opt-in, outbound capture |
| Planned open-source integration lacks a stable boundary | High | Medium | Keep blocked_upstream; select another supported engine; never fork by default |

## Known Gaps

- Calendar/performance/SLO targets remain baseline-first until representative measurements and named capacity exist.
- Production provider, Apple, hosted, commercial, and representative-creator evidence must be collected in execution; this test plan does not claim it now.
- UI cases use Playwright Electron rather than mobile Maestro while preserving product-team’s UI-bucket traceability contract.

---
