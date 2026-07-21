# Story: Bundled Class A Skill Trust Lifecycle

**ID:** S-007-001
**Project:** clark-pro
**Epic:** E-007
**Stage:** Ready
**Status:** Done
**Priority:** P0
**Version:** 1.0
**Analytics:** AE-007
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Harness evidence](../../research/history/import-2026-07-13/evidence/harness-latest-report.json)

---

## Story

As a **workspace_admin**, I want to **inspect exact Skill bytes, requested tools, effective permissions, compatibility, and tests before promotion**, so that **a readable Skill package cannot execute merely because it was discovered or installed**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

A readable Skill package cannot execute merely because it was discovered or installed. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Verify SKILL.md and package file hashes, Class A non-executable mode, fixtures, compatibility, and installed capabilities.
- Install into quarantine with zero trusted scopes until an explicit creator promotion.

## Acceptance Criteria

- [ ] Given the bundled Skill is registered, when its exact bytes and manifest are evaluated, then all trust gates are visible while it remains quarantined.
- [ ] Given a manifest falsely claims active state or bytes drift after quarantine, when evaluation or promotion runs, then trust is denied or revoked.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Broader capability beyond this verified slice remains in sibling stories and later releases.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
