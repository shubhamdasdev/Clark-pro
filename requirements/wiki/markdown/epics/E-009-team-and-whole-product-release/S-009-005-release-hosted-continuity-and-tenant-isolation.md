# Story: Release, Hosted Continuity, and Tenant Isolation

**ID:** S-009-005
**Project:** clark-pro
**Epic:** E-009
**Stage:** Ready
**Status:** Backlog
**Priority:** P0
**Phase:** P-003-02
**Version:** 1.0
**Analytics:** AE-009
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md)

---

## Story

As a **workspace_admin**, I want to **install a signed production release and retain complete local access during hosted failure**, so that **a managed offering adds elasticity without becoming the owner of canonical creator state**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

A managed offering adds elasticity without becoming the owner of canonical creator state. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Complete signing, notarization, privacy, vulnerability response, organization policy, billing, tenant isolation, reliability, and audit evidence.
- Verify hosted outage behavior, local workspace access, complete export, and recovery.

## Acceptance Criteria

- [ ] Given a production build, when release checks run, then signing, notarization, privacy, update, rollback, security, and incident-response evidence is attributable and passing.
- [ ] Given the hosted service is unavailable, when a creator opens Clark, then local workspace access and complete export remain usable without cross-tenant exposure.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Scope not named in this story remains in sibling stories or a later release; this story does not absorb the full parent epic.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
