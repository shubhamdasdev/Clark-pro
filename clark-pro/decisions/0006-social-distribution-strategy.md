# ADR-0006 — Social Distribution Strategy

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Connect, Distribution, Product, Reliability

## Context

Social networks differ in account eligibility, app review, OAuth scopes, content types, media constraints, rate limits, analytics, publication receipts, and policy. Claiming universal direct integrations would create a permanent breadth burden and misleading reliability. A single aggregator provides breadth but can hide provider-specific state or become an outage dependency.

## Decision

Use Postiz as the initial broad scheduling/publishing/analytics adapter. Add direct Clark adapters selectively when a strategic platform capability, richer state, reliability requirement, or creator demand justifies the cost. Maintain validated export and assisted handoff for every supported content type.

Clark owns the publication intent ledger, idempotency key, approval and disclosure gates, submission receipt, observation/reconciliation state, and final truth. An adapter never becomes the canonical publication database.

## Consequences

### Positive

- Broad channel coverage arrives without pretending Clark owns every platform API.
- Selective direct adapters can close high-value gaps.
- Export prevents connector or policy failure from trapping completed work.
- Publication reliability remains a Clark product property.

### Costs

- Clark must continuously validate changing platform schemas and adapter behavior.
- Some analytics and comments will be missing or delayed.
- Direct and aggregate paths require reconciliation without duplicate publication.

## Rejected alternatives

- **Build every platform directly:** unsustainable approval, schema, audit, and maintenance burden.
- **Postiz as canonical state:** loses Clark's approval, lineage, and recovery semantics.
- **Promise automatic publishing everywhere:** misrepresents account and platform constraints.
- **Export-only product:** fails the whole-operation continuity promise for supported channels.

## Invariants

1. Content approval never implies publication authority.
2. Every publish attempt has a Clark intent ID and version-specific approval receipt.
3. Ambiguous provider outcomes enter reconciliation, not blind retry.
4. Adapter capability and limitations are visible before scheduling.
5. A complete export package remains available when automation cannot proceed.
6. Metrics retain platform/source definitions and missing-data markers.

## Verification gates

- Recorded and sandbox fixtures cover success, rejection, timeout before/after submission, duplicate response, revoked scope, schema drift, and deletion.
- A stale artifact cannot publish using an earlier approval.
- Reconciliation can prove live, failed, cancelled, removed, or requires-human-check—never silently unknown.
- Export media and metadata pass platform-specific validators.
- Switching between Postiz and a direct adapter cannot duplicate a publication intent.

## Revisit triggers

- Postiz no longer provides sufficient breadth or operational reliability.
- A platform becomes strategically dominant enough to justify a direct adapter.
- Platform policy removes automation access; the fallback contract remains.
