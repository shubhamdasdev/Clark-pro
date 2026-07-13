# Story: Community Skills and Class B/C Sandbox

**ID:** S-007-004
**Project:** clark-pro
**Epic:** E-007
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

As a **workspace_admin**, I want to **acquire signed community Skills and execute higher-risk classes in production isolation**, so that **extensible procedures cannot escape filesystem, network, process, or capability policy**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Extensible procedures cannot escape filesystem, network, process, or capability policy. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Add community source identity, signatures, advisories, compatibility, and revocation checks.
- Implement the production Class B/C sandbox with declared filesystem, network, process, and capability ceilings.

## Acceptance Criteria

- [ ] Given a community Skill has mutable identity, failed signature, known blocked advisory, or undeclared executable content, when acquired, then it cannot enter trusted execution.
- [ ] Given a hostile Class B/C fixture attempts an undeclared resource, when executed, then the sandbox denies it and records the attempted boundary crossing.

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
