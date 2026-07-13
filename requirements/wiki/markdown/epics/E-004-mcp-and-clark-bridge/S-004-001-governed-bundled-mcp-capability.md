# Story: Governed Bundled MCP Capability

**ID:** S-004-001
**Project:** clark-pro
**Epic:** E-004
**Stage:** Ready
**Status:** Done
**Priority:** P0
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Harness evidence](../../research/history/import-2026-07-13/evidence/harness-latest-report.json)

---

## Story

As a **workspace_admin**, I want to **register and invoke a pinned MCP capability through exact schemas and short-lived permission leases**, so that **external tool results enter canonical state without inheriting ambient process authority**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

External tool results enter canonical state without inheriting ambient process authority. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Pin the server source hash, tool inventory, schemas, environment profile, and structured result envelope.
- Record permission, lease, invocation, health, and denial receipts in canonical events.

## Acceptance Criteria

- [ ] Given the bundled server starts, when discovery and invocation complete, then the exact two-tool inventory and schemas match the pinned capability contract.
- [ ] Given source, schema, environment, or authority expands, when validation runs, then the invocation is denied before a lease or tool call is issued.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Broader capability beyond this verified slice remains in sibling stories and later releases.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
