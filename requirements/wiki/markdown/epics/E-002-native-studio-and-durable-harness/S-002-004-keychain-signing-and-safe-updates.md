# Story: Keychain, Signing, and Safe Updates

**ID:** S-002-004
**Project:** clark-pro
**Epic:** E-002
**Stage:** Ready
**Status:** Backlog
**Priority:** P0
**Phase:** P-002-02
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md)

---

## Story

As a **workspace_admin**, I want to **install and update a trusted Clark build whose credentials stay behind scoped Keychain leases**, so that **the product can leave local development without weakening its security model**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

The product can leave local development without weakening its security model. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Broker credentials through macOS Keychain without returning token material to the renderer or event log.
- Ship Developer ID signing, Hardened Runtime entitlements, notarization, stapling, Gatekeeper acceptance, and signed rollback-capable updates.

## Acceptance Criteria

- [ ] Given a release candidate, when strict code-sign and Gatekeeper checks run, then the bundle passes with an attributable Team ID and notarization evidence.
- [ ] Given a credential is revoked, when dependent work starts or resumes, then Clark blocks it without exposing the stored secret.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Scope not named in this story remains in sibling stories or a later release; this story does not absorb the full parent epic.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
