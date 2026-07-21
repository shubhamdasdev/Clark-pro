# Architecture Task: Privacy-Safe Observability and Diagnostics

**ID:** AT-002-004
**Project:** clark-pro
**Release:** R-002
**Phase:** P-002-02
**Stage:** Ready
**Status:** Backlog
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Extends:** None
**Depends On:** AT-002-001

---

## What

Create the local-first structured logging, manual OpenTelemetry, Crashpad-local, diagnostics projection, health-probe, dashboard, alert, and user-previewed support-bundle substrate defined in reference/observability.md.

## Artifact Location

- `clark-pro/packages/observability/`
- `clark-pro/apps/desktop/src/diagnostics/`
- `clark-pro/services/harness/src/observability/`
- `clark-pro/fixtures/telemetry-canaries/`

## Invariants

| Key | Value |
|-----|-------|
| Remote telemetry default | Off |
| Crash upload default | Off; local Crashpad only |
| Attribute policy | Allowlist; unknown attributes dropped |
| Forbidden telemetry | Creative/memory/prompt content, raw URL/path/name/account/IP/email, credential ref/token |

## Goals

- Correlate renderer request, Harness command, run/step, capability receipt, publication intent, and recovery classification without sensitive attributes.
- Surface launch, crash, latency, projection, queue, cost, audit, recovery, publication, and sandbox health locally.
- Export a diagnostics bundle only after preview, canary redaction, destination/retention disclosure, and explicit consent.

## Steps

1. `[Agent]` Implement the allowlist schema, pino serializer, manual OTel spans/metrics, local storage/retention, Crashpad-local configuration, and diagnostics projection.
2. `[Agent]` Implement HP-001 through HP-009, local dashboards, error grouping, source-map metadata, and release-blocking safety probes.
3. `[Agent]` Run the content/secret/path canary corpus across logs, spans, metrics, crash annotations, bundles, and outbound capture.

## Acceptance Criteria

- [ ] Fresh install emits no telemetry or crash upload before explicit opt-in/action.
- [ ] Canary corpus yields zero forbidden fields across every telemetry surface and outbound capture.
- [ ] Local Diagnostics traces a failed run or publication from UI request to exact error/reconciliation receipt using correlation IDs.
- [ ] Turning export off stops future remote emission without disabling local workspace operation.

## Depends On

AT-002-001

---
