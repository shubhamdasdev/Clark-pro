# Story: Scoped Clark Bridge Core

**ID:** S-004-002
**Project:** clark-pro
**Epic:** E-004
**Stage:** Ready
**Status:** Done
**Priority:** P0
**Version:** 1.0
**Analytics:** AE-004
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Harness evidence](../../research/history/import-2026-07-13/evidence/harness-latest-report.json)

---

## Story

As a **external_agent**, I want to **capture, revise, list, and read ideas through an authenticated workspace-scoped Bridge**, so that **external agents can collaborate without creating a second state model or gaining approval authority**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

External agents can collaborate without creating a second state model or gaining approval authority. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Bind Streamable HTTP to localhost with bearer material outside renderer and event state.
- Route Bridge mutations through the same Harness commands as Studio and record client actor metadata.

## Acceptance Criteria

- [ ] Given a scoped Bridge client, when it captures or revises an idea, then Studio shows the same canonical lineage and policy state.
- [ ] Given a missing bearer, hostile Origin or Host, oversized body, or cross-workspace request, when the request arrives, then it fails without leaking the credential.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Broader capability beyond this verified slice remains in sibling stories and later releases.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
