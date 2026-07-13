# Release Test Plan: Local Trust Core

**ID:** TR-001
**Project:** clark-pro
**Release:** R-001
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13

---

## Release Goal

Validate the already-implemented local trust core as one bounded release: generated contracts, hardened desktop/Harness boundaries, evidence-honest Idea Foundry, governed MCP and Bridge, governed memory, Tool Pack lifecycle, and Class A Skill trust.

## Coverage Summary

| Story | Title | Test Plan | P0 | P1 | P2 | Gap |
|-------|-------|-----------|----|----|----|-----|
| S-001-001 | Versioned Contracts and Upcasters | T-001-001 ✓ | 1 | 1 | 1 | — |
| S-001-002 | Ground Prototype and Evidence Ledger | T-001-002 ✓ | 1 | 1 | 1 + A | — |
| S-002-001 | Hardened Mac Shell Boundary | T-002-001 ✓ | 1 | 1 | 1 | — |
| S-002-002 | Durable Event Store and Run Recovery | T-002-002 ✓ | 1 | 1 | 1 + A | — |
| S-003-001 | Immutable Idea Capture and Revision Lineage | T-003-001 ✓ | 1 | 1 | 1 + A | — |
| S-003-002 | Evidence-Honest Idea Inspection and Canvas | T-003-002 ✓ | 1 | 1 | 1 | — |
| S-004-001 | Governed Bundled MCP Capability | T-004-001 ✓ | 1 | 1 | 1 | — |
| S-004-002 | Scoped Clark Bridge Core | T-004-002 ✓ | 1 | 1 | 1 + A | — |
| S-005-001 | Evidence-Bound Memory Promotion | T-005-001 ✓ | 1 | 1 | 1 + A | — |
| S-005-002 | Scoped Retrieval, Correction, and Forgetting | T-005-002 ✓ | 1 | 1 | 1 + A | — |
| S-006-001 | Tool Pack Quarantine and Trust Gates | T-006-001 ✓ | 1 | 1 | 1 + A | — |
| S-006-002 | Atomic Tool Pack Activation and Rollback | T-006-002 ✓ | 1 | 1 | 1 + A | — |
| S-006-003 | OpenCut Candidate Blocked Upstream | T-006-003 ✓ | 1 | 1 | 1 | — |
| S-007-001 | Bundled Class A Skill Trust Lifecycle | T-007-001 ✓ | 1 | 1 | 1 + A | — |
| S-007-002 | Skill Update, Expansion Denial, and Rollback | T-007-002 ✓ | 1 | 1 | 1 | — |

**Total:** 15 P0, 15 P1 safety, 15 P2 boundary/replay, and 9 Analytics cases across 15 stories. No documentation-coverage gaps; execution evidence remains pending where story status is not Done.

## Integration Test Cases

> product-team’s `Automation: Maestro` UI bucket is executed with Playwright Electron for this Mac desktop product, retaining ITC IDs, semantic assertions, and evidence screenshots.

### ITC-001-001: Verified local core survives restart

**Stories Covered:** S-001-001, S-002-001, S-002-002, S-003-001, S-003-002
**Priority:** P1
**Automation:** Maestro

**Preconditions:**
- All listed stories and architecture tasks for R-001 are implemented in the release-candidate environment.
- Deterministic fixtures and only approved sandbox/provider credentials are available.

**Steps:**
1. Start from the clean release fixture and record the build, schema, workspace, event offset, and consent state.
2. Run contract verification, capture/revise an idea, kill Harness, relaunch, and confirm exact Canvas/review lineage without duplicate artifacts.
3. Inspect exact actor, version, permission, cost, provenance, recovery, and external receipt evidence at each story boundary.
4. Interrupt once at the highest-risk boundary and resume through the documented recovery or reconciliation path.
5. Export the final QA evidence bundle and compare canonical state with the expected release fixture.

**Expected Result:**
The full scenario reaches the release goal without bypass, duplicate mutation, lost lineage, silent learning, ambiguous publication, or unsupported evidence claim.

**Failure Indicators:**
A story passes alone but composition loses scope, version, authority, receipt, recoverability, accessibility, or terminal-state honesty.

### ITC-001-002: Studio and Bridge converge on governed state

**Stories Covered:** S-004-001, S-004-002, S-005-001, S-005-002
**Priority:** P2
**Automation:** Maestro

**Preconditions:**
- All listed stories and architecture tasks for R-001 are implemented in the release-candidate environment.
- Deterministic fixtures and only approved sandbox/provider credentials are available.

**Steps:**
1. Start from the clean release fixture and record the build, schema, workspace, event offset, and consent state.
2. Capture/revise through Bridge, inspect in Studio, promote/correct/forget memory, and confirm scope/revocation and projection replay.
3. Inspect exact actor, version, permission, cost, provenance, recovery, and external receipt evidence at each story boundary.
4. Interrupt once at the highest-risk boundary and resume through the documented recovery or reconciliation path.
5. Export the final QA evidence bundle and compare canonical state with the expected release fixture.

**Expected Result:**
The full scenario reaches the release goal without bypass, duplicate mutation, lost lineage, silent learning, ambiguous publication, or unsupported evidence claim.

**Failure Indicators:**
A story passes alone but composition loses scope, version, authority, receipt, recoverability, accessibility, or terminal-state honesty.

### ITC-001-003: Blocked and trusted extensions retain honest authority

**Stories Covered:** S-006-001, S-006-002, S-006-003, S-007-001, S-007-002
**Priority:** P2
**Automation:** Maestro

**Preconditions:**
- All listed stories and architecture tasks for R-001 are implemented in the release-candidate environment.
- Deterministic fixtures and only approved sandbox/provider credentials are available.

**Steps:**
1. Start from the clean release fixture and record the build, schema, workspace, event offset, and consent state.
2. Evaluate OpenCut as blocked, activate/rollback eligible fixtures, update a Skill with expansion denial, and verify exact prior authority remains.
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
- [ ] All 9 required Analytics cases prove exact once-after-commit, bounded properties, no PII/content, and opt-in export behavior.
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
