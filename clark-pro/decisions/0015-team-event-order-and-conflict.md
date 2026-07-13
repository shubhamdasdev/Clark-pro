# ADR-0015 — Team Event Order and Conflict Resolution

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Domain, Relay, Team, Security

## Context

Offline devices and team members can create valid concurrent events. A relay receive-order or wall clock is not causal truth. Generic last-write-wins is unsafe for approvals, policies, publication, canonical selection, memory, skills, and deletion. Full CRDT semantics for every aggregate would hide necessary human judgment and complicate audit.

## Decision

Every synchronized event carries a signed device identity, per-device monotonic sequence, causal parent event IDs, workspace/aggregate version expectation, and canonical payload/hash under ADR-0014. Relay assigns a receipt/transport order for delivery and indexing only.

Conflict behavior is aggregate-specific:

| Aggregate/action | Concurrent behavior |
|---|---|
| Artifact version | Both append-only versions survive as branches. |
| Canonical selection | Create an explicit unresolved canonical conflict; downstream paid/mutating work pauses. |
| Content approval | Both receipts survive, but each binds one version/policy/account scope; no merged authority. |
| Publication intent | Same intent key deduplicates; competing versions/accounts/schedules create a conflict and block submission. |
| Policy/permission | Most restrictive effective result applies until an authorized human resolves it. |
| Memory/skill promotion | Concurrent revisions remain separate; retrieval/invocation uses prior active revision until conflict resolution. |
| Tombstone versus edit | Preserve edit/version and tombstone; remove from active use pending retention/restoration decision. |
| Comment/annotation | Append both; deterministic display order may use relay order after causality. |

Conflict resolution is a signed `decision.recorded` event that names alternatives, evidence, actor, and resulting canonical revision. Automatic merges are limited to declared commutative fields with fixture proof.

## Consequences

### Positive

- Human authority and provenance remain explicit.
- Offline work is preserved without letting timestamps silently decide truth.
- Safety-critical actions fail closed during ambiguity.

### Costs

- Some team work pauses for conflict resolution.
- Projections must expose conflicts as first-class states.
- Causal metadata and compaction require careful migration and retention.

## Rejected alternatives

- **Last-write-wins:** clock skew/relay order can silently replace approval, policy, or memory.
- **Server is always canonical:** contradicts local-first/offline ownership and lets Relay rewrite truth.
- **CRDT every field:** inappropriate for non-commutative decisions and external side effects.
- **Reject all concurrent work:** unnecessary loss for append-only artifacts/comments.

## Invariants

1. No event is discarded solely because another concurrent event arrived first.
2. Safety-critical conflicts block dependent mutation; read/inspection remains available.
3. Conflict resolution is a new attributable event, never history rewrite.
4. Relay order cannot grant authority or determine canonical creative judgment.
5. Projection rebuild produces the same conflict set from the same signed event set.

## Verification gates

- Pairwise and multi-device fixtures cover every table row with reordered/delayed delivery.
- Clock skew cannot change conflict outcome or grant publication.
- Duplicate/replayed events do not advance aggregate version twice.
- Offline edits converge to visible branches; policy deny and revocation take effect safely.
- Full export/import preserves causal parents, signatures, conflicts, and resolutions.

## Evidence

- [RFC 8785 canonical JSON for repeatable hashes/signatures](https://www.rfc-editor.org/rfc/rfc8785.html)
- [RFC 8446 notes that application-layer replay protection remains necessary](https://www.rfc-editor.org/info/rfc8446/)

## Revisit triggers

- Real collaboration evidence identifies a high-volume commutative data type that benefits from a scoped CRDT ADR.
- Event metadata/replay costs exceed measured Team value.
- The canonical ownership model is superseded with an explicit migration.
