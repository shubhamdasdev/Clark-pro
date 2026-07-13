# Story: Durable Bridge Tasks and Client Pairing

**ID:** S-004-003
**Project:** clark-pro
**Epic:** E-004
**Stage:** Ready
**Status:** Backlog
**Priority:** P0
**Phase:** P-002-03
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md)

---

## Story

As a **external_agent**, I want to **start long-running Clark work, reconnect, observe status, cancel when allowed, and resume creator review**, so that **client disconnects or Mac restarts do not lose work or create ambiguous duplicate mutations**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Client disconnects or Mac restarts do not lose work or create ambiguous duplicate mutations. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Map negotiated MCP Tasks or Clark job receipts to durable Harness runs with explicit cancellation and reconciliation states.
- Pair and revoke clients through a Keychain-backed, workspace-scoped flow.

## Acceptance Criteria

- [ ] Given a client disconnects after starting durable work, when it reconnects with the same intent identity, then it receives the existing job rather than creating a duplicate.
- [ ] Given client access is revoked, when it attempts a new read or mutation, then Clark denies access immediately while the canonical job state remains intact.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Scope not named in this story remains in sibling stories or a later release; this story does not absorb the full parent epic.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
