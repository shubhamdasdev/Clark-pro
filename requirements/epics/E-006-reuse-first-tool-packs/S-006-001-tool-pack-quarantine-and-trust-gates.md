# Story: Tool Pack Quarantine and Trust Gates

**ID:** S-006-001
**Project:** clark-pro
**Epic:** E-006
**Stage:** Ready
**Status:** Done
**Priority:** P0
**Version:** 1.0
**Analytics:** AE-006
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Harness evidence](../../research/history/import-2026-07-13/evidence/harness-latest-report.json)

---

## Story

As a **workspace_admin**, I want to **inspect a pinned Tool Pack revision, its interface, license, supply chain, permissions, converters, UI boundary, migration, and rollback evidence**, so that **untrusted packages cannot gain capability authority by appearing installed**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Untrusted packages cannot gain capability authority by appearing installed. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Track immutable source and artifact identity plus eleven independently visible activation and rollback gates.
- Separate installed retention, quarantine state, and active execution authority.

## Acceptance Criteria

- [ ] Given a Tool Pack lacks any required interface, legal, SBOM, vulnerability, provenance, adapter, capability, test, migration, or rollback evidence, when activation is requested, then it remains inactive.
- [ ] Given projections rebuild, when package events replay, then exact manifests, gates, decisions, and runtime state are reproduced.

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
