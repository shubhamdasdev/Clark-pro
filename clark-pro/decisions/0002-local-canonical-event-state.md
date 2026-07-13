# ADR-0002 — Local Canonical Event State

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Domain, Data, Desktop, Sync

## Context

Clark must explain what happened, recover interrupted work, preserve prior versions, rebuild views, trace outcomes to decisions, support undo/audit, export a complete workspace, and later synchronize selected team state. A canvas JSON file or mutable row model cannot reliably represent external jobs, approvals, publication ambiguity, memory evidence, and cross-view consistency.

## Decision

The Mac owns canonical personal state through a versioned append-only domain event log. SQLite in WAL mode stores events and rebuildable projections. Binary assets live in a content-addressed local object store. Commands validate invariants and append events; Focus, Canvas, Timeline, Review, Library, Memory, and Bridge resources read projections of the same event history.

Canonical selection, approval, publication, memory promotion, skill promotion, deletion/tombstone, and policy override are explicit decision events rather than in-place truth replacement.

## Consequences

### Positive

- Provenance, undo, recovery, audit, and view consistency share one mechanism.
- Workspace export can include events, schemas, assets, skills, and checksums.
- Projection corruption can be repaired from the event stream.
- Later encrypted synchronization has a stable unit of change.

### Costs

- Event and schema evolution require discipline from the first release.
- Projection lag, replay, compaction, and migration need explicit operational tooling.
- Event sourcing is used only for domain truth; ephemeral UI state must stay outside it.

## Rejected alternatives

- **Canvas document as database:** couples truth to one view and loses execution/audit semantics.
- **Mutable CRUD-only SQLite:** simpler initially but weak for recovery, provenance, and synchronization.
- **Cloud Postgres as canonical state:** violates local ownership and offline operation.
- **CRDT-first everything:** introduces conflict semantics before shared editing is required; only selected collaborative projections may later use CRDT techniques.
- **Vector database as memory truth:** similarity retrieval is not a governed creator model.

## Invariants

1. Every event carries event ID, aggregate ID, workspace ID, schema version, actor, and timestamp.
2. Artifact versions and decision receipts are append-only.
3. Projection state can be discarded and deterministically rebuilt.
4. Asset metadata and content hash are verified before import or use.
5. Credentials are references only and never part of exported event payloads.
6. A publication intent, provider submission, and verified live state are different events.

## Verification gates

- Full workspace export/import preserves event ordering, hashes, lineage, active revisions, and tombstones.
- Every projection rebuild produces the same canonical read model from a fixed event fixture.
- Forced termination at every command/event boundary cannot create half-applied domain state.
- Migration preview, backup restore, forward migration, and rollback/read-only recovery pass fixture suites.
- The 50-object project reads identically through Studio and Bridge.

## Revisit triggers

- Measured write contention exceeds SQLite's intended single-machine workload.
- Team collaboration becomes canonical for a workspace and requires a new shared-state ADR.
- Event volume or asset scale invalidates the documented backup and rebuild budgets.
