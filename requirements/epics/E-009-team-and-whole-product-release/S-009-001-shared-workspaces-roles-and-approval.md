# Story: Shared Workspaces, Roles, and Approval

**ID:** S-009-001
**Project:** clark-pro
**Epic:** E-009
**Stage:** Ready
**Status:** Backlog
**Priority:** P1
**Phase:** P-003-02
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md)

---

## Story

As a **team_member**, I want to **coordinate assignments, comments, decisions, and approval under workspace roles**, so that **teams can collaborate without collapsing personal and shared authority**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Teams can collaborate without collapsing personal and shared authority. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Define roles and authorization for every aggregate, read, mutation, assignment, comment, and approval.
- Keep personal creator memory separate unless an explicit share decision is recorded.

## Acceptance Criteria

- [ ] Given a team member lacks a required workspace role, when they attempt a protected mutation, then Clark denies it and records the authorization result.
- [ ] Given a personal memory has not been shared, when team context compiles, then the memory remains unavailable.

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
