# Architecture Task: Encrypted Relay, Sync, Asset Mirror, and Worker Envelopes

**ID:** AT-003-002
**Project:** clark-pro
**Release:** R-003
**Phase:** P-003-02
**Stage:** Ready
**Status:** Backlog
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Extends:** None
**Depends On:** AT-003-001

---

## What

Build the provider-neutral encrypted relay contract, device identity, ordered workspace event synchronization, content-addressed asset mirror, explicit conflict resolution, and signed scoped remote-worker envelope substrate.

## Artifact Location

- `clark-pro/packages/sync/`
- `clark-pro/packages/remote-envelope/`
- `clark-pro/services/relay/`
- `clark-pro/services/worker/`
- `clark-pro/fixtures/sync/`

## Invariants

| Key | Value |
|-----|-------|
| Personal local replica | Remains usable and canonical for personal work |
| Conflict policy | Aggregate/version/domain decision; never raw last-write-wins |
| Envelope | Signed, expiring, replay-protected, workspace/input/capability/credential scoped |
| Credential delegation | Short-lived lease; never wholesale Keychain copy |

## Goals

- Synchronize encrypted workspace-scoped events and content-addressed assets with deterministic ordering and integrity.
- Preserve both evidence trails on conflicting commands and require an explicit domain decision where necessary.
- Run delegated jobs using only named inputs, credentials, capabilities, sensitivity level, and time window; validate signed results locally.

## Steps

1. `[Agent]` Define provider-neutral relay, device, envelope, ordering, conflict, asset, revocation, and reconciliation contracts before choosing cloud-specific deployment details.
2. `[Agent]` Implement two-device offline convergence, replay, expiry, revoked-device, malicious-envelope, asset-corruption, concurrent-decision, and hosted-outage fixtures.
3. `[Agent]` Prove local workspace read/export and personal/team memory separation with relay and worker unavailable.

## Acceptance Criteria

- [ ] Two offline replicas converge with valid ordering/hash integrity and no loss of non-conflicting events or assets.
- [ ] Conflicting decisions/approvals preserve both evidence trails and never resolve through last-write-wins replacement.
- [ ] A compromised, expired, replayed, or revoked worker envelope cannot access unrelated workspace, memory, credentials, capabilities, or time.
- [ ] Hosted outage leaves complete local access and export usable.

## Depends On

AT-003-001

---
