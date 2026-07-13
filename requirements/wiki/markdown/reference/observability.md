# Observability Plan — Clark Pro

**Project:** clark-pro
**Version:** 1.0
**Updated:** 2026-07-13

> Operational telemetry for performance, stability, debugging, audit, recovery, and hosted health. Product-behaviour measurement lives in `analytics.md`. No telemetry leaves the Mac without the consent defined by ADR-0018.

---

## Recommended Stack

| Concern | Tool / Service | Library / SDK | Native or 3rd-party | Notes / rationale |
|---------|----------------|---------------|---------------------|-------------------|
| Structured logging | Clark local JSONL/SQLite diagnostics projection | `pino` with a Clark allowlist serializer | local/native | Fast structured Node logging; rotating local files, correlation IDs, release/process tags, user-previewed export |
| Error & crash tracking | Electron Crashpad local store | Electron `crashReporter` with `uploadToServer: false` | native | Confidential minidumps stay local; explicit reviewed support upload only |
| Metrics & monitoring | Clark Diagnostics projection and embedded dashboard | `@opentelemetry/api`, `@opentelemetry/sdk-metrics` | local/native | Manual allowlisted instruments; no broad automatic HTTP/DB/AI capture |
| Tracing / APM | OpenTelemetry manual spans → local OTLP file/collector | `@opentelemetry/sdk-node`, OTLP exporter only after opt-in | vendor-neutral | Run/step/tool/publication correlation; optional customer-managed collector |
| Health / synthetic | Harness probe runner plus optional hosted probe service in R-003 | Node test runner + `health-probes.md` registry | local first | Desktop critical paths are semantic probes, not a fake “website uptime” check |
| Audit / security logging | Hash-chained domain events + append-only audit projection; cloud-native audit logs after provider selection | Clark domain contracts | native | Captures actor, action, target, decision, before/after refs; never raw secret values |
| Optional remote error backend | Sentry only after explicit opt-in and privacy canary approval | `@sentry/electron` with deny-by-default event processor | optional 3rd-party | Upgrade only when local/support bundles cannot meet MTTR needs; no automatic minidump/content upload |

## Structured Logging Standard

- **Format:** one JSON object per line with `timestamp`, `level`, `message_code`, `correlation_id`, `trace_id`, `process_type`, `app_version`, `schema_version`, `capability_class`, `result_class`, and bounded duration/count fields.
- **Aggregation:** local rotating diagnostics under the Clark application-support directory plus a queryable local projection. Hosted logs are a separate opt-in/export sink.
- **Retention:** local ordinary logs 14 days by default; crash dumps 7 days; security/audit events follow canonical workspace retention and export policy. Users can clear diagnostics without deleting canonical project history.
- **PII/content redaction:** never log artifact text/media, prompts/completions, source excerpts, memory statements, raw URLs/query strings, absolute paths, file/account names, email/IP, credential references, tokens, clipboard, or local filenames. Unknown attributes are dropped.
- **Correlation:** one correlation ID crosses renderer request → main/preload → Harness command → run/step → capability/tool receipt → provider observation. Publication intent and external job IDs are locally joined but not exported as raw high-cardinality analytics properties.

## Key Metrics to Surface

Targets are baseline-first unless they are completeness/safety invariants already accepted in the brief.

### Performance

| Metric | Source | Target |
|--------|--------|--------|
| Cold launch to interactive Focus p50/p95/p99 | manual OTel spans | Establish baseline on oldest supported Mac |
| Renderer → Harness command latency p50/p95/p99 by command class | OTel spans | Establish baseline |
| Projection rebuild duration and events/sec | Harness metrics | Establish baseline; deterministic result required |
| Canvas initial render and interaction latency for 50-object fixture | renderer performance marks | Establish baseline before S-002-005 review |
| Asset import/hash/preview duration by coarse size bucket | worker spans | Establish baseline |
| Provider/tool latency by capability class and result class | capability spans | Establish baseline; no provider payload attributes |

### Stability

| Metric | Source | Target |
|--------|--------|--------|
| Crash-free local sessions | Crashpad metadata + clean shutdown marker | Establish baseline; no remote upload by default |
| Supported interruption recoveries without duplicate mutation | recovery audit events | 100% of declared supported states |
| Projection integrity/replay pass rate | deterministic Harness probe | 100% |
| Publication intents with explicit terminal or reconciliation state | publication projection | 100% |
| Tool Pack/Skill sandbox escape attempts denied | sandbox receipt metrics | 100% of hostile corpus |
| Backup restore verification pass rate | backup probe receipts | 100% before external release |

### Debugging

| Capability | Source | Status |
|------------|--------|--------|
| End-to-end correlation IDs across process boundaries | pino + OTel | Planned in AT-002-004 |
| Grouped error classes with release, process, and bounded breadcrumbs | local error projection | Planned in AT-002-004 |
| Source-map/symbol metadata without automatic upload | packaged build manifest | Planned in AT-002-001 |
| User-previewed diagnostics bundle with canary redaction scan | diagnostics exporter | Planned in AT-002-004 |
| Run/step/tool/publication trace viewer | local Diagnostics screen | Planned in AT-002-004 |

### Other — Security, Cost, Saturation

| Metric | Source | Target |
|--------|--------|--------|
| Privileged/mutating actions with actor, policy, permission, provenance receipt | application audit projection | 100% |
| Credential denial/revocation enforcement | broker audit events | 100% of conformance cases |
| Run budget reservation vs reconciled cost by bounded class | tool receipts | Establish baseline; unexplained cost = 0 |
| Harness memory/CPU/event-loop lag and worker queue depth | OTel metrics | Establish baseline on representative fixtures |
| Remote envelope rejection by class | relay/worker audit logs | Establish baseline; all hostile corpus requests denied |
| Telemetry canary leaks | outbound capture test | 0 |

## Audit & Security Logging

| Layer | What is captured | Where it lands | Retention | On today? |
|-------|------------------|----------------|-----------|-----------|
| Local platform/process audit | app launch, signature/update status, crash marker, broker operation result class | local diagnostics; Keychain/security APIs | 14 days except release evidence | Partial — bounded shell evidence exists |
| Application audit trail | actor, command, target refs, policy result, decision, permission receipt, before/after version refs | hash-chained canonical events + audit projection | workspace retention/export policy | Yes for bounded canonical events; expand per story |
| Auth/client events | client pair/revoke, scope denial, token lifecycle result, role decision | local audit projection; hosted platform audit later | security retention policy | Partial |
| Hosted platform audit | organization admin, relay/worker deploy, key access, tenant policy, operator access | cloud-native immutable audit sink selected in R-003 | minimum 1 year for production security audit unless policy sets longer | Not selected; AT-003-003 must enable default-off data-access logs |
| Diagnostic upload receipts | user choice, categories, destination, retention disclosure, dump included/excluded, result | local canonical receipt | workspace audit retention | Not implemented |

## Alerts & SLOs

| Critical path | SLI | SLO | Alert condition | Severity | Routing | Runbook |
|---------------|-----|-----|-----------------|----------|---------|---------|
| Local launch + Harness handshake | successful interactive launch and probe | Establish baseline, then set release SLO | Two failed launches for one install or HP-001 hard fail | local critical + support ticket | creator/admin; QA on shared evidence | Verify signature, disk, migration, Harness crash receipt |
| Canonical event append + projection | integrity and latency | 100% integrity; latency baseline first | HP-002 integrity failure | block mutation/release | local admin + engineering incident | Stop writes, preserve DB, export diagnostics, run read-only verification |
| Run recovery | no duplicate + correct durable gate | 100% supported scenarios | HP-003 fails or duplicate intent detected | release-blocking/page for hosted | QA / on-call | Inspect exact run plan, checkpoint, orphan lease, provider identity |
| Publication | explicit terminal/reconciliation state | 100% intents classified | ambiguous state outside policy window or duplicate verified | page for live publication | distribution on-call + creator | Freeze retry, inspect intent/receipt/provider live state |
| Backup/restore | authenticated verified restore | 100% release fixture pass | HP-009 failure | release-blocking | QA + security | Quarantine import; compare manifest, key, hashes, migration |
| Hosted relay / tenant boundary | authorized availability and isolation | Establish baseline; isolation invariant 100% | HP-010 isolation failure or fast error-budget burn | immediate page | security/on-call | Revoke worker/tenant keys, isolate relay, preserve local access/export |

## Dashboards

### Local Diagnostics

**Controls:** time range (15m, 1h, 24h, 7d), process, release, workspace-safe pseudonymous scope, capability class, result class, refresh/last updated.

**Display order:** launch/Harness health → crash-free and error-class scorecards → command/run/provider latency trends → active/paused/orphan/reconciliation counts → projection/DB/asset health → cost reconciliation → audit coverage → recent trace list. Every tile reads an allowlisted local metric or audit projection.

### Hosted Operations — R-003 only

**Controls:** environment, region, release, tenant-safe cohort, worker class, 15m–30d range, last updated. **Displays:** availability/error-budget burn, relay/worker latency and saturation, queue age, sync lag, rejected envelopes, tenant-isolation probes, audit-log coverage, cost anomaly. No creative content or raw tenant identifier appears.

## Implementation Work

| Type | ID | What |
|------|----|------|
| AT | AT-002-004 | Create the local privacy-safe observability package, crash store, diagnostics projection, redaction corpus, dashboard, and support-bundle contract. |
| Story | S-002-002 | Emit recovery, projection, DB health, and duplicate-prevention signals. |
| Story | S-002-005 | Establish accessibility and performance baselines on representative fixtures. |
| Story | S-004-003 | Trace Bridge jobs, pairing, reconnect, cancellation, and revocation. |
| Story | S-008-002 | Instrument publication state, provider latency, reconciliation age, and duplicate prevention. |
| AT | AT-003-003 | Provision hosted monitoring, platform audit logs, tenant-safe telemetry, SLO dashboards, and alert routing after provider selection. |
| Story | S-009-005 | Verify hosted outage, local continuity, tenant isolation, incident response, and audit export. |
