# Story: Immutable Idea Capture and Revision Lineage

**ID:** S-003-001
**Project:** clark-pro
**Epic:** E-003
**Stage:** Ready
**Status:** Done
**Priority:** P0
**Version:** 1.0
**Analytics:** AE-003
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Harness evidence](../../research/history/import-2026-07-13/evidence/harness-latest-report.json)

---

## Story

As a **creator**, I want to **capture an idea and create explicit revisions with root and parent lineage**, so that **upstream decisions can change without rewriting history or preserving stale approval**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Upstream decisions can change without rewriting history or preserving stale approval. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Store each revision as an immutable artifact version with stable logical identity.
- Atomically cancel superseded runs and invalidate pending exact-version approvals.

## Acceptance Criteria

- [ ] Given an approved or pending idea revision, when the creator requests a revision with a reason, then a new version and run are appended with root and parent lineage.
- [ ] Given the prior revision had approval authority, when the new revision is created, then the old authority is invalidated and cannot complete the replacement artifact.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Broader capability beyond this verified slice remains in sibling stories and later releases.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 11:28 | 1.0 | PM Agent | Imported from authoritative v2 requirements and reconciled to current automated repository evidence; Status set to Done. |
