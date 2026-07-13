# Story: Atomic Tool Pack Activation and Rollback

**ID:** S-006-002
**Project:** clark-pro
**Epic:** E-006
**Stage:** Ready
**Status:** Done
**Priority:** P0
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Harness evidence](../../research/history/import-2026-07-13/evidence/harness-latest-report.json)

---

## Story

As a **workspace_admin**, I want to **activate, update, suspend, and roll back an eligible Tool Pack revision atomically**, so that **a bad update cannot strand the workspace or silently retain superseded authority**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

A bad update cannot strand the workspace or silently retain superseded authority. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Require explicit creator decisions for activation and rollback.
- Retain the tested prior revision and atomically replace current capability authority.

## Acceptance Criteria

- [ ] Given an eligible quarantined revision, when the creator activates it, then only its verified adapter and capability revisions become current.
- [ ] Given a verified update fails or the creator rolls back, when the decision commits, then the new authority is removed and the exact retained prior revision is restored atomically.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Broader capability beyond this verified slice remains in sibling stories and later releases.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
