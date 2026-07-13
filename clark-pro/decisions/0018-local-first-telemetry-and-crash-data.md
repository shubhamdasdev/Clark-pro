# ADR-0018 — Local-First Telemetry and Crash Data

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Quality, Security, Desktop, Product

## Context

Clark needs reliability, cost, migration, connector, recovery, and performance evidence. Creator projects, paths, prompts, memory, account labels, provider responses, and minidumps may be personal/confidential. Generic auto-instrumentation can capture sensitive fields; OpenTelemetry cannot decide sensitivity for Clark. Electron Crashpad can store crash dumps locally without uploading.

## Decision

### Local observability

Structured logs, traces, metrics, run receipts, and crash dumps are local by default. Use Clark-owned allowlist schemas and OpenTelemetry APIs/OTLP as the vendor-neutral representation/export transport. Do not enable broad automatic HTTP/database/AI instrumentation until its emitted attributes are reviewed and fixture-scanned.

Never include artifact text/media, prompts/completions, source excerpts, memory statements, raw URLs/query strings, local absolute paths, account names, email/IP, credential refs, secrets, clipboard, or file names in remote telemetry. Use bounded enums, process type, app/schema/capability versions, error class, durations, counts, coarse sizes, and keyed/rotating pseudonymous install ID only when necessary.

### Consent tiers

1. **Local diagnostics:** on; remains on the Mac under retention controls.
2. **Anonymous health metrics:** off until explicit opt-in; previewable schema, reversible at any time.
3. **Diagnostic bundle/support upload:** explicit per-upload review and consent.
4. **Product-content research:** separate study consent; never implied by telemetry opt-in.

### Crashes

Start Electron Crashpad with `uploadToServer: false`. Store minidumps locally with restrictive permissions and short retention. A minidump is treated as confidential because process memory may contain content. Upload requires an explicit action, a warning, report metadata preview, scrubbed companion logs, destination/retention disclosure, and the ability to exclude the dump while sending ordinary diagnostics.

## Consequences

### Positive

- Reliability evidence remains possible without silent content collection.
- Backend vendor can change through OTLP.
- Crash collection does not imply automatic exfiltration.

### Costs

- Opt-in telemetry may be sparse and biased.
- Allowlist instrumentation and redaction testing require more deliberate engineering.
- Some crashes will remain undiagnosable without a user-provided dump.

## Rejected alternatives

- **Automatic crash upload:** minidumps may contain confidential process memory.
- **Telemetry on by default because “anonymous”:** metadata and identifiers can still be sensitive.
- **Capture prompts/completions with redaction:** redaction cannot reliably understand all creator secrets.
- **Vendor-specific SDK as source of truth:** hidden defaults and schema lock-in weaken control.

## Invariants

1. Remote telemetry is an allowlist; unknown attributes are dropped, not forwarded.
2. Telemetry consent never grants content/model-training/research consent.
3. Secrets and raw creative/memory content have no telemetry schema path.
4. User can inspect current setting, destination, categories, retention, and recent uploads.
5. Turning telemetry off stops future export without disabling local workspace operation.

## Verification gates

- Secret/content/path canary corpus across logs, spans, metrics, crash annotations, bundles, and network capture yields zero forbidden fields.
- Fresh install sends no telemetry/crash upload before explicit opt-in/action.
- Crash fixture proves local creation, no auto-upload, retention deletion, explicit send/exclude-dump flows.
- Collector/backend rejects attributes outside the Clark allowlist even if a library emits them.
- Consent changes and diagnostic uploads produce local receipts.

## Evidence

- [OpenTelemetry: handling sensitive data](https://opentelemetry.io/docs/security/handling-sensitive-data/)
- [OpenTelemetry Protocol](https://opentelemetry.io/docs/specs/otlp/)
- [Electron crashReporter](https://www.electronjs.org/docs/latest/api/crash-reporter)

## Revisit triggers

- Reliability evidence is insufficient and a new category can be proven privacy-preserving.
- Customer-managed OTLP becomes a required enterprise option.
- Platform crash tooling provides a more privacy-preserving direct-distribution path.
