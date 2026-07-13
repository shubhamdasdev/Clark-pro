# Story: Versioned Contracts and Upcasters

**ID:** S-001-001
**Project:** clark-pro
**Epic:** E-001
**Stage:** Ready
**Status:** Done
**Priority:** P0
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Harness evidence](../../research/history/import-2026-07-13/evidence/harness-latest-report.json)

---

## Story

As a **workspace_admin**, I want to **verify every canonical event and payload against generated, versioned contracts**, so that **implementation drift and unsafe historical data fail closed before they corrupt a workspace**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Implementation drift and unsafe historical data fail closed before they corrupt a workspace. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Keep the JSON Schema catalog and generated runtime manifest hash-pinned.
- Reject unknown historical steps, future versions, and invalid upcast destinations.

## Acceptance Criteria

- [ ] Given the contract verification commands run on the current commit, when all fixtures are evaluated, then all 18 schemas and generated outputs pass.
- [ ] Given an unknown or future event version, when the runtime attempts to load it, then loading fails closed without rewriting history.

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
