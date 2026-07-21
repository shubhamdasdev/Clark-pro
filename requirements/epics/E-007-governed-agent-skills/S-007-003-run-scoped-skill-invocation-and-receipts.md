# Story: Run-Scoped Skill Invocation and Receipts

**ID:** S-007-003
**Project:** clark-pro
**Epic:** E-007
**Stage:** Ready
**Status:** Backlog
**Priority:** P0
**Phase:** P-002-03
**Version:** 1.0
**Analytics:** AE-007
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md)

---

## Story

As a **creator**, I want to **invoke a trusted Skill only inside an approved run and capability intersection**, so that **promotion remains a trust decision rather than implicit authorization to act**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Promotion remains a trust decision rather than implicit authorization to act. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Enforce the intersection of package request, creator trust ceiling, workspace policy, and run grant.
- Record Skill revision, inputs, outputs, capability calls, cost, timing, and permission receipts without exposing a generic renderer invocation method.

## Acceptance Criteria

- [ ] Given a promoted Skill lacks a run grant, when invocation is attempted, then no code or capability executes.
- [ ] Given all four permission layers allow invocation, when the Skill runs, then every capability call is bounded and the complete revision-specific receipt is linked to the artifact lineage.

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
