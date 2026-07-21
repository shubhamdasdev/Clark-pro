# Story: Real Third-Party Acquisition and Execution

**ID:** S-006-004
**Project:** clark-pro
**Epic:** E-006
**Stage:** Ready
**Status:** Backlog
**Priority:** P0
**Phase:** P-002-03
**Version:** 1.0
**Analytics:** AE-006
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md)

---

## Story

As a **workspace_admin**, I want to **acquire, verify, unpack, build when permitted, activate, execute, update, and roll back one supported external Tool Pack**, so that **the reuse-first strategy is proven against a real maintained engine rather than a synthetic package**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

The reuse-first strategy is proven against a real maintained engine rather than a synthetic package. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Implement safe archive acquisition, traversal protection, signature/hash checks, dependency controls, supervised build, and isolated runtime boundaries.
- Select a candidate with a stable supported interface and complete legal, compatibility, migration, and rollback evidence.

## Acceptance Criteria

- [ ] Given a valid external package, when it is acquired, then source and artifact identity are verified before unpack or build and no file escapes quarantine.
- [ ] Given the activated capability runs in a creator loop, when it completes or fails, then inputs, outputs, timing, cost, permission receipt, and rollback state are canonical and inspectable.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Scope not named in this story remains in sibling stories or a later release; this story does not absorb the full parent epic.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
