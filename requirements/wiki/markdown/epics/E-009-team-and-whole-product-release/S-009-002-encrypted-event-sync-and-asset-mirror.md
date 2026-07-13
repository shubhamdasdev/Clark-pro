# Story: Encrypted Event Sync and Asset Mirror

**ID:** S-009-002
**Project:** clark-pro
**Epic:** E-009
**Stage:** Ready
**Status:** Backlog
**Priority:** P0
**Phase:** P-003-02
**Version:** 1.0
**Analytics:** AE-009
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md)

---

## Story

As a **team_member**, I want to **work offline and reconcile events and assets without losing concurrent changes**, so that **local-first collaboration remains deterministic across devices**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Local-first collaboration remains deterministic across devices. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Synchronize encrypted event envelopes and content-addressed assets with explicit ordering and conflict semantics.
- Avoid last-write-wins replacement of canonical decisions, approvals, or artifact versions.

## Acceptance Criteria

- [ ] Given two offline Macs append non-conflicting events, when they reconnect, then both histories converge with valid ordering and hash integrity.
- [ ] Given concurrent commands conflict, when sync resolves them, then Clark preserves both evidence trails and requires an explicit domain decision where necessary.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Scope not named in this story remains in sibling stories or a later release; this story does not absorb the full parent epic.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
