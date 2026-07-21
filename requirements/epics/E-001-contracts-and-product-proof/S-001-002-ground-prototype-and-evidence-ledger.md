# Story: Ground Prototype and Evidence Ledger

**ID:** S-001-002
**Project:** clark-pro
**Epic:** E-001
**Stage:** Ready
**Status:** QA
**Priority:** P0
**Version:** 1.0
**Analytics:** AE-001
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Desktop evidence](../../research/history/import-2026-07-13/evidence/desktop-latest-report.json)

---

## Story

As a **creator**, I want to **walk through the real Clark surfaces with visible provenance, authority, and evidence state**, so that **product decisions are evaluated against an honest fixture instead of a feature checklist**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Product decisions are evaluated against an honest fixture instead of a feature checklist. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Render Focus, Canvas, Review, Timeline, Library, Memory, and Connections from one representative project model.
- Keep human-evidence, runtime-evidence, and missing-evidence results distinct in the Ground ledger.

## Acceptance Criteria

- [ ] Given the automated prototype checks run, when the project is verified, then all mapped prototype and contract evidence remains internally consistent.
- [ ] Given a requirement needs observed creator behavior, when only a prototype or document exists, then the ledger keeps that requirement pending rather than marking it verified.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Scope not named in this story remains in sibling stories or a later release; this story does not absorb the full parent epic.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 11:28 | 1.0 | PM Agent | Imported from authoritative v2 requirements; Status set to QA because automated proof exists while representative human evidence and signoff remain pending. |
