# Story: Experiment and Strategy Loop

**ID:** S-008-005
**Project:** clark-pro
**Epic:** E-008
**Stage:** Ready
**Status:** Backlog
**Priority:** P1
**Phase:** P-003-01
**Version:** 1.0
**Analytics:** AE-008
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md)

---

## Story

As a **creator**, I want to **turn reviewed outcomes into scoped experiments, follow-ups, and optional memory proposals**, so that **future work changes only through visible, reversible decisions with new evidence**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Future work changes only through visible, reversible decisions with new evidence. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Generate no change or a small set of evidence-linked experiment and strategy proposals.
- Keep rejected proposals inactive unless genuinely new evidence is attached.

## Acceptance Criteria

- [ ] Given a review has sufficient evidence, when the strategy loop runs, then each proposal names observations, sample size, uncertainty, and the decision it could change.
- [ ] Given a proposal is rejected, when future reflection runs without new evidence, then the rejected proposal does not silently return.

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
| 2026-07-13 11:28 | 1.0 | PM Agent | Imported from authoritative v2 requirements after requirements review; implementation remains Backlog and no completion is claimed. |
