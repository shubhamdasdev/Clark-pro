# Story: Scoped Retrieval, Correction, and Forgetting

**ID:** S-005-002
**Project:** clark-pro
**Epic:** E-005
**Stage:** Ready
**Status:** Done
**Priority:** P0
**Version:** 1.0
**Analytics:** AE-005
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Harness evidence](../../research/history/import-2026-07-13/evidence/harness-latest-report.json)

---

## Story

As a **creator**, I want to **retrieve memory by task policy and replace, dispute, or forget an active claim**, so that **the creator can correct Clark without hidden residual retrieval behavior**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

The creator can correct Clark without hidden residual retrieval behavior. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Enforce workspace/project scope, active state, expiry, sensitivity ceilings, and destination send policy.
- Use append-only correction lineage and logical forgetting with projection redaction and derivative deletion.

## Acceptance Criteria

- [ ] Given an active claim is corrected, when the replacement is promoted, then the prior claim is disputed and excluded while lineage remains inspectable.
- [ ] Given a memory is forgotten, when fresh or idempotently replayed retrieval runs, then the item is not returned and projected personal text is redacted.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Broader capability beyond this verified slice remains in sibling stories and later releases.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
