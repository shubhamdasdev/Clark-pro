# Clark Pro Quality Assurance Plan

**Project:** clark-pro
**Version:** 1.0
**Updated:** 2026-07-13
**Owner:** Quality Engineering with Product, Security, Desktop, Harness, Data, and Platform owners

---

## Quality Objective

Ship Clark Pro only when the complete creator cycle is correct, recoverable, inspectable, accessible, portable, privacy-safe, and honest about external/human evidence. Screen presence is not completion. The test system must prove exact versions, authority, lineage, idempotence, recovery, fallback, and decision ownership across the same canonical workspace.

## Coverage Inventory

| Layer | Artifact | Count | Purpose |
|-------|----------|------:|---------|
| Contract/unit | JSON Schema, upcaster, domain, repository, policy, adapter, sandbox tests | Existing suites + story additions | Fast predicate and invariant proof |
| Story | T-NNN-NNN | 42 | Every story AC, negative preservation, boundary/replay, and required analytics |
| Release | TR-NNN | 3 | Composition and go/no-go for each live release |
| Evergreen flow | TF-006, TF-009, TF-015 | 3 plans / 9 journeys | Primary creator spine, external mutation, and interruption continuity |
| Production health | HP-001…HP-010 | 10 | Local/hosted semantic safety net |
| Human/external evidence | Walkthrough, commercial signoff, VoiceOver, Apple, provider, four-week protocols | Story/release gated | Proof automation cannot legitimately manufacture |

## Verification Buckets and Executors

| product-team bucket | Clark executor | Use | Evidence |
|----------------|----------------|-----|----------|
| Maestro | Playwright Electron today; Maestro only for a future mobile surface | Visible pixels, keyboard, navigation, overlays/modals, OS prompts, exact copy/state | Before/after/checkpoint screenshots, trace, video on failure |
| Unit / Harness | Node `node:test`, repository fixtures, SDK/server harnesses | Contracts, policies, IPC, event append/replay, DB, providers, sync, sandbox, backup | Test log, seed/fixture version, file/commit, receipt snapshot |
| Code Review | Required security/architecture review with file:line evidence | Only obvious source branches; never substitutes for runtime/OS/content behavior | Reviewer citation and checklist |
| Analytics | Local product-event projection or logged-event spy | Exact event name, once-after-commit timing, bounded shape, no PII/content, opt-in export | Query/result fixture and canary scan |

## Test Environments

| Environment | Purpose | Data/credentials | Required gates |
|-------------|---------|------------------|----------------|
| PR deterministic | Contracts, repositories, policy, UI component, fixtures | Synthetic workspaces, fake/recorded providers, no production secrets | Fast unit/Harness, analytics spy, static security checks |
| Packaged Mac | Hardened renderer, menus, Keychain/TCC, crash, update, VoiceOver, performance | Dedicated test Keychain and signed fixtures | HP-001, packaged Playwright, code-sign/Gatekeeper, accessibility |
| Provider sandbox | MCP/model/media/Postiz/social conformance and ambiguity | Broker-owned sandbox credentials | Adapter conformance, schema discovery, revoke, cost, reconciliation/export |
| Two-device/team | Encrypted sync, conflicts, roles, remote workers | Synthetic personal/team data; scoped worker leases | HP-010, tenant and envelope hostile corpus |
| Release candidate | All story/release/TF, migration, backup/restore, support bundle | Representative non-production workspace | TR plan, TF suite, all applicable probes, evidence ledger |
| Production smoke | Exact shipped build and consent-safe checks | Minimum synthetic workspace/account | No destructive mutation; launch, local access, export, controlled publish if approved |

## Test Data and Privacy

- Version every fixture and schema; record the fixture ID in evidence.
- Use synthetic names/content and credential canaries. Never copy a real creator workspace into CI.
- Representative Full Week fixture includes text/media, missing/disputed evidence, stale branches, approval waits, ambiguous publication, memory/Skill proposals, and provider failures.
- Backup, diagnostics, analytics, logs, traces, crash annotations, and outbound network capture all run the ADR-0018/0019 secret/content/path corpus.
- Destructive/paid tests target recorded providers or sandbox accounts with explicit budget and cleanup.

## Required Suites by Risk

| Risk | Suites | Release blocker |
|------|--------|-----------------|
| Contract/schema drift | 18+ schema verification, generated outputs, upcasters, future/unknown rejection | Any failure |
| Renderer/process authority | IPC sender/origin, navigation/popups/webview/permission denial, environment/secret canaries | Any expansion or leak |
| Event integrity/recovery | append/idempotence/hash chain, projection rebuild, kill-at-state, orphan lease, async reconnect | Duplicate/lost/invalid state |
| Extension supply chain | immutable acquisition, license/SBOM/provenance, hostile archive, interface ladder, activation/update/rollback | Missing/failed gate or escape |
| Skill sandbox | hidden executable, signature/advisory, filesystem/network/process/capability/time/memory hostile corpus | Any undeclared authority |
| Publication | schema/account/policy, response loss, duplicate response, restart, revoke, reconcile, export | Duplicate or unexplained state |
| Memory/privacy | proposal/promotion, leakage, poisoning, expiry, correction, logical/physical forget, backup disclosure | Forgotten retrieval or false erasure claim |
| Portability | age interoperability, corruption/path/size/schema/disk/interruption, clean-Mac restore | Failed round trip or active-state mutation on invalid input |
| Accessibility/performance | keyboard, VoiceOver, 200% zoom, reduced motion, 50-object Canvas, oldest supported Mac | Critical unreachable/unannounced action; agreed baseline gate failure |
| Team/hosted | role matrix, offline convergence, replay/revoke/envelope, tenant isolation, audit logs, outage/local export | Data loss, authority leak, local continuity failure |

## Cadence

| Trigger | Required run |
|---------|--------------|
| Every PR | Changed story T-plan Unit/Harness + analytics, contract drift, lint/security, focused Playwright |
| Main nightly | Full deterministic Harness/conformance/hostile suites + TF-006/009/015 + HP-001…009 |
| Weekly | Backup clean-Mac restore, packaged Mac accessibility/performance baseline, dependency/vulnerability scan |
| R-002/R-003 infrastructure change | Relevant AT acceptance suite and gate evidence before story branches proceed |
| Release candidate | All in-scope T and TR, all applicable TF/probes, migration/update/rollback, diagnostics canary, manual/human gates |
| After production BUG | Target story T plus every TF journey listing the story; add regression fixture before close |

## Defect Severity and Triage

| Severity | Definition | Disposition |
|----------|------------|-------------|
| P0 | Secret/content/tenant exposure, duplicate external mutation, canonical corruption/data loss, sandbox escape, false approval/erasure, app cannot launch/restore | Stop work/release; incident owner immediately |
| P1 | Core flow blocked, incorrect authority/evidence, unrecoverable run, inaccessible critical action, no safe fallback | Release blocked until fixed and regression added |
| P2 | Degraded secondary path with safe workaround and no integrity/trust loss | Named owner and explicit risk acceptance may defer |
| P3 | Cosmetic/documentation issue with no ambiguity, accessibility, or state impact | Backlog with release note if user-visible |

## Evidence and Traceability

Every pass records build/commit, story/release/flow ID, TC/ITC/journey/probe ID, fixture/schema, environment, precondition, executor, result, screenshot/log/receipt paths, and defect link. Product/human evidence additionally records participant/provider, observation method, assistance, and signoff owner. Evidence never contains raw secrets or unapproved creator content.

## Release Decision

- R-001 can leave QA only when S-001-002 becomes Done through required evidence, every scoped P0/P1/ITC passes, and existing suites remain green.
- R-002 cannot become Ready for coding until AT-002-001…004 are Ready (they are) and cannot begin story execution until the architecture gate opens after all ATs are Done. It cannot ship without Ground, packaged Mac, restore, real Tool Pack, accessibility, and creator-loop evidence.
- R-003 follows the same gate for AT-003-001…003 and cannot ship without publication, learning, sync, remote, tenant, hosted-outage/local-export, and four-week proof.
- No release decision uses invented performance/SLO numbers; baseline evidence precedes a threshold decision.
