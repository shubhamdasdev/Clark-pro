# Story: Reflection-Driven Skill Proposals and Regression

**ID:** S-007-005
**Project:** clark-pro
**Epic:** E-007
**Stage:** Ready
**Status:** Backlog
**Priority:** P1
**Phase:** P-002-03
**Version:** 1.0
**Analytics:** AE-007
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md)

---

## Story

As a **creator**, I want to **turn a successful or corrected trajectory into a reviewable Skill proposal with tests**, so that **reliable procedures compound without silent self-modification**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Reliable procedures compound without silent self-modification. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Extract procedure, inputs, outputs, tools, permissions, compatibility, recovery, and examples from exact trajectory evidence.
- Require quarantine fixtures and regression results before creator promotion; allow monitoring to propose rollback only.

## Acceptance Criteria

- [ ] Given a trajectory produces a stable procedure, when reflection proposes a Skill, then the proposal cites exact evidence and remains inactive.
- [ ] Given an active Skill fails its regression threshold, when monitoring evaluates it, then rollback is proposed and no silent revision is installed.

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
