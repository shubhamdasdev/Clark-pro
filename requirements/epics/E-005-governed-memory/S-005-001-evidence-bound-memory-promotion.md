# Story: Evidence-Bound Memory Promotion

**ID:** S-005-001
**Project:** clark-pro
**Epic:** E-005
**Stage:** Ready
**Status:** Done
**Priority:** P0
**Version:** 1.0
**Analytics:** AE-005
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Harness evidence](../../research/history/import-2026-07-13/evidence/harness-latest-report.json)

---

## Story

As a **creator**, I want to **review a memory proposal with exact evidence, scope, confidence, sensitivity, and retrieval policy**, so that **only deliberate creator decisions can make a belief active**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Only deliberate creator decisions can make a belief active. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Require exact same-workspace evidence and keep proposals excluded from retrieval until promotion.
- Record revision-specific creator decisions and trusted retrieval ceilings.

## Acceptance Criteria

- [ ] Given a new memory proposal, when retrieval runs before promotion, then the proposal is absent.
- [ ] Given the creator promotes the exact proposal revision, when retrieval policy permits it, then the active memory is returned with its evidence and decision lineage.

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
