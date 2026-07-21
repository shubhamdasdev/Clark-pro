# Release Test Plan: Whole-Product Beta

**ID:** TR-003
**Project:** clark-pro
**Release:** R-003
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13

---

## Release Goal

Run the complete creator cycle on real channels, then prove collaboration, remote continuity, and the Clark Pro 1.0 exit gate over four representative weeks.

## Coverage Summary

| Story | Title | Test Plan | P0 | P1 | P2 | Gap |
|-------|-------|-----------|----|----|----|-----|
| S-008-001 | Social Account and Credential Center | T-008-001 ✓ | 1 | 1 | 1 | — |
| S-008-002 | Postiz Scheduling and Publication Ledger | T-008-002 ✓ | 1 | 1 | 1 + A | — |
| S-008-003 | Assisted Handoff and Deterministic Export | T-008-003 ✓ | 1 | 1 | 1 | — |
| S-008-004 | Observation Ingestion and Evidence Review | T-008-004 ✓ | 1 | 1 | 1 + A | — |
| S-008-005 | Experiment and Strategy Loop | T-008-005 ✓ | 1 | 1 | 1 + A | — |
| S-009-001 | Shared Workspaces, Roles, and Approval | T-009-001 ✓ | 1 | 1 | 1 | — |
| S-009-002 | Encrypted Event Sync and Asset Mirror | T-009-002 ✓ | 1 | 1 | 1 + A | — |
| S-009-003 | Scoped Remote Workers and Schedules | T-009-003 ✓ | 1 | 1 | 1 | — |
| S-009-004 | Four-Week Whole-Product Proof | T-009-004 ✓ | 1 | 1 | 1 + A | — |
| S-009-005 | Release, Hosted Continuity, and Tenant Isolation | T-009-005 ✓ | 1 | 1 | 1 + A | — |

**Total:** 10 P0, 10 P1 safety, 10 P2 boundary/replay, and 6 Analytics cases across 10 stories. No documentation-coverage gaps; execution evidence remains pending where story status is not Done.

## Integration Test Cases

> PMAgent’s `Automation: Maestro` UI bucket is executed with Playwright Electron for this Mac desktop product, retaining ITC IDs, semantic assertions, and evidence screenshots.

### ITC-003-001: Approved work reaches a known publication and learning state

**Stories Covered:** S-008-001, S-008-002, S-008-003, S-008-004, S-008-005
**Priority:** P1
**Automation:** Maestro

**Preconditions:**
- All listed stories and architecture tasks for R-003 are implemented in the release-candidate environment.
- Deterministic fixtures and only approved sandbox/provider credentials are available.

**Steps:**
1. Start from the clean release fixture and record the build, schema, workspace, event offset, and consent state.
2. Connect account, submit exact intent, verify or export/reconcile, review fresh/missing evidence, and decide a bounded strategy proposal.
3. Inspect exact actor, version, permission, cost, provenance, recovery, and external receipt evidence at each story boundary.
4. Interrupt once at the highest-risk boundary and resume through the documented recovery or reconciliation path.
5. Export the final QA evidence bundle and compare canonical state with the expected release fixture.

**Expected Result:**
The full scenario reaches the release goal without bypass, duplicate mutation, lost lineage, silent learning, ambiguous publication, or unsupported evidence claim.

**Failure Indicators:**
A story passes alone but composition loses scope, version, authority, receipt, recoverability, accessibility, or terminal-state honesty.

### ITC-003-002: Offline team work converges and scoped remote execution continues

**Stories Covered:** S-009-001, S-009-002, S-009-003
**Priority:** P2
**Automation:** Maestro

**Preconditions:**
- All listed stories and architecture tasks for R-003 are implemented in the release-candidate environment.
- Deterministic fixtures and only approved sandbox/provider credentials are available.

**Steps:**
1. Start from the clean release fixture and record the build, schema, workspace, event offset, and consent state.
2. Create concurrent offline work, sync without last-write-wins loss, delegate one signed scoped job, revoke it, and confirm personal/team memory separation.
3. Inspect exact actor, version, permission, cost, provenance, recovery, and external receipt evidence at each story boundary.
4. Interrupt once at the highest-risk boundary and resume through the documented recovery or reconciliation path.
5. Export the final QA evidence bundle and compare canonical state with the expected release fixture.

**Expected Result:**
The full scenario reaches the release goal without bypass, duplicate mutation, lost lineage, silent learning, ambiguous publication, or unsupported evidence claim.

**Failure Indicators:**
A story passes alone but composition loses scope, version, authority, receipt, recoverability, accessibility, or terminal-state honesty.

### ITC-003-003: Four-week proof survives hosted outage and production rollback

**Stories Covered:** S-009-004, S-009-005
**Priority:** P2
**Automation:** Maestro

**Preconditions:**
- All listed stories and architecture tasks for R-003 are implemented in the release-candidate environment.
- Deterministic fixtures and only approved sandbox/provider credentials are available.

**Steps:**
1. Start from the clean release fixture and record the build, schema, workspace, event offset, and consent state.
2. Complete four representative weekly evidence records, disable hosted services, preserve local access/export, test tenant isolation, and roll back a production candidate.
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
- [ ] All 6 required Analytics cases prove exact once-after-commit, bounded properties, no PII/content, and opt-in export behavior.
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
- UI cases use Playwright Electron rather than mobile Maestro while preserving PMAgent’s UI-bucket traceability contract.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created release rollup for all 10 stories with 3 cross-story journeys. |
