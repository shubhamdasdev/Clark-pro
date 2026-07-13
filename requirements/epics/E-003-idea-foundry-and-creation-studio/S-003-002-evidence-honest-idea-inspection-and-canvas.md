# Story: Evidence-Honest Idea Inspection and Canvas

**ID:** S-003-002
**Project:** clark-pro
**Epic:** E-003
**Stage:** Ready
**Status:** Done
**Priority:** P0
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Desktop evidence](../../research/history/import-2026-07-13/evidence/desktop-latest-report.json)

---

## Story

As a **creator**, I want to **inspect thesis structure, open evidence gates, lineage, and the next creator decision in one Canvas**, so that **structural completeness is never confused with market validation or research proof**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Structural completeness is never confused with market validation or research proof. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Show ten thesis facets, structural completeness, evidence readiness, and five open observed-proof gates from canonical events.
- Keep Canvas and Focus synchronized through the same projections and exact-version review state.

## Acceptance Criteria

- [ ] Given a structurally complete idea scores ten of ten, when no observed evidence exists, then the UI reports evidence required rather than validated.
- [ ] Given a revision supersedes a prior run, when Canvas reloads, then lineage, stale authority, and the current review gate remain correct.

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
