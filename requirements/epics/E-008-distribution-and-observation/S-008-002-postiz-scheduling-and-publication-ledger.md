# Story: Postiz Scheduling and Publication Ledger

**ID:** S-008-002
**Project:** clark-pro
**Epic:** E-008
**Stage:** Ready
**Status:** Backlog
**Priority:** P0
**Phase:** P-003-01
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md)

---

## Story

As a **creator**, I want to **schedule or publish through Postiz with idempotent intent, receipt, verification, and reconciliation**, so that **every external mutation ends in a known, reviewable state without blind retry**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Every external mutation ends in a known, reviewable state without blind retry. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Discover current platform schemas and validate media, copy, disclosure, account health, and approval before submission.
- Track intent, scheduled, submitted, verified, failed, cancelled, removed, exported, and reconciliation states distinctly.

## Acceptance Criteria

- [ ] Given an approved platform artifact, when it is submitted, then Clark records an idempotency key and provider receipt before observing verification.
- [ ] Given the submission outcome is ambiguous, when recovery runs, then Clark enters reconciliation and does not issue a blind duplicate retry.

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
