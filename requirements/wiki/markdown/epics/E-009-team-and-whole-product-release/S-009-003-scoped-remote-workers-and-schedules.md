# Story: Scoped Remote Workers and Schedules

**ID:** S-009-003
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

As a **workspace_admin**, I want to **delegate long jobs and schedules through revocable, sensitivity-bounded remote envelopes**, so that **work can continue while the Mac sleeps without copying broad personal authority to the cloud**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Work can continue while the Mac sleeps without copying broad personal authority to the cloud. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Use signed job envelopes, device identity, scoped credential delegation, sensitivity policy, expiry, and revocation.
- Reconcile remote results through the canonical local event model and preserve offline access.

## Acceptance Criteria

- [ ] Given a job is delegated, when the remote worker runs it, then it can access only the named workspace, inputs, credentials, capabilities, and time window.
- [ ] Given the worker is compromised or revoked, when it attempts unrelated memory or credential access, then the request fails and local export remains available.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Scope not named in this story remains in sibling stories or a later release; this story does not absorb the full parent epic.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
