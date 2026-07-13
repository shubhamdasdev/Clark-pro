# Story: Social Account and Credential Center

**ID:** S-008-001
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

As a **workspace_admin**, I want to **connect, scope, inspect, and revoke social accounts without exposing credentials**, so that **publishing authority remains visible and workspace-specific**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Publishing authority remains visible and workspace-specific. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Support OAuth or provider flows through the Keychain broker with scopes, leases, health, revocation, and workspace grants.
- Show affected schedules and capabilities when account health or grants change.

## Acceptance Criteria

- [ ] Given an account is connected, when the creator inspects it, then publisher identity, scopes, workspace grants, health, and revocation controls are visible without token material.
- [ ] Given an account is revoked, when dependent work starts, then Clark blocks it and identifies affected scheduled intents.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Scope not named in this story remains in sibling stories or a later release; this story does not absorb the full parent epic.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
