# Story: Durable Event Store and Run Recovery

**ID:** S-002-002
**Project:** clark-pro
**Epic:** E-002
**Stage:** Ready
**Status:** Done
**Priority:** P0
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Harness evidence](../../research/history/import-2026-07-13/evidence/harness-latest-report.json)

---

## Story

As a **creator**, I want to **resume an interrupted idea run from canonical local events**, so that **work, approvals, and exact artifact identity survive process death without duplicate mutation**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Work, approvals, and exact artifact identity survive process death without duplicate mutation. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Persist immutable workspace events in SQLite WAL mode with per-workspace hash chains and replayable projections.
- Terminalize interrupted calls, revoke orphaned leases, and retry under fresh authority.

## Acceptance Criteria

- [ ] Given a running step is interrupted by Harness process death, when the supervisor restarts it, then the run returns to its correct durable gate without creating a duplicate artifact.
- [ ] Given projections are deleted, when events replay, then run, memory, Tool Pack, and Skill projections reproduce the same state.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Broader capability beyond this verified slice remains in sibling stories and later releases.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
