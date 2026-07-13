# Story: External Client Examples and Compatibility

**ID:** S-004-004
**Project:** clark-pro
**Epic:** E-004
**Stage:** Ready
**Status:** Backlog
**Priority:** P1
**Phase:** P-002-03
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md)

---

## Story

As a **external_agent**, I want to **connect Claude, Codex, Hermes, and another MCP client using documented scope and recovery patterns**, so that **builders can integrate with Clark without reverse-engineering private implementation details**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Builders can integrate with Clark without reverse-engineering private implementation details. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Publish example registrations, tool/resource usage, task negotiation, reconnect, and revocation flows.
- Maintain a versioned compatibility matrix and conformance fixtures for supported clients.

## Acceptance Criteria

- [ ] Given a documented client configuration, when the conformance example runs, then capture-to-review-to-result completes through supported public contracts.
- [ ] Given a client lacks MCP Tasks, when it starts long work, then the documented Clark receipt fallback preserves status and reconnect behavior.

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
