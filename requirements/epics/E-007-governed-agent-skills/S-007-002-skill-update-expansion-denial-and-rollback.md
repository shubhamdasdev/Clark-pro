# Story: Skill Update, Expansion Denial, and Rollback

**ID:** S-007-002
**Project:** clark-pro
**Epic:** E-007
**Stage:** Ready
**Status:** Done
**Priority:** P0
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Harness evidence](../../research/history/import-2026-07-13/evidence/harness-latest-report.json)

---

## Story

As a **workspace_admin**, I want to **review Skill revision diffs and retain a tested prior revision for rollback**, so that **updates cannot silently add tools or break the last trusted procedure**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Updates cannot silently add tools or break the last trusted procedure. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Suspend the prior active revision only when an eligible update activates atomically.
- Deny unavailable capability expansion and retain revision-specific trust ceilings.

## Acceptance Criteria

- [ ] Given an update requests an unavailable provider capability, when evaluated, then it stays quarantined and the prior active revision remains active.
- [ ] Given the creator rolls back a verified revision, when the decision commits, then the exact retained prior revision and trust ceiling become current atomically.

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
