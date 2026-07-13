# Story: Source Ingestion and Claim Ledger

**ID:** S-003-003
**Project:** clark-pro
**Epic:** E-003
**Stage:** Ready
**Status:** Backlog
**Priority:** P0
**Phase:** P-002-03
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md)

---

## Story

As a **creator**, I want to **bring text, URLs, documents, screenshots, audio, video, and files into a traceable claim workflow**, so that **final assertions retain original evidence and visible uncertainty**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Final assertions retain original evidence and visible uncertainty. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Retain original bytes or text, source health, citations, claims, uncertainty, and creator assertions.
- Support pin, dispute, replace, and saturation review without triggering paid work on capture.

## Acceptance Criteria

- [ ] Given a supported source is captured, when it enters a project, then its original content and provenance remain retrievable without starting research or generation.
- [ ] Given a final factual assertion is reviewed, when no source or explicit creator assertion supports it, then approval is blocked with the missing evidence visible.

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
