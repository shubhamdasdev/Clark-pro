# Story: Version-Specific Review and Policy Gates

**ID:** S-003-005
**Project:** clark-pro
**Epic:** E-003
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

As a **reviewer**, I want to **compare versions and approve only the exact artifact that passed evidence, brand, budget, accessibility, disclosure, and confidentiality checks**, so that **no stale or invalid output can publish under a prior approval**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

No stale or invalid output can publish under a prior approval. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Render platform previews, text or media comparisons, evidence, costs, policy results, and decision alternatives.
- Bind approvals to exact artifact versions and invalidate them when upstream lineage changes.

## Acceptance Criteria

- [ ] Given two artifact versions, when the reviewer selects one, then Clark records the chosen version, alternatives, actor, reason, and reversibility.
- [ ] Given an approved artifact becomes stale or violates a required gate, when publication is attempted, then the prior approval cannot authorize the mutation.

## Negative Scenarios

- A failed trust, evidence, compatibility, recovery, or policy check must leave the prior canonical state intact and expose a valid next action.

## Future Scope

- Scope not named in this story remains in sibling stories or a later release; this story does not absorb the full parent epic.

## Do Not Do

- In this story, do not infer completion from UI presence, documents, or mocked fixtures when the acceptance criteria require runtime or human evidence.
- Do not bypass Clark's event, permission, approval, provenance, or rollback contracts to make the happy path appear complete.

---
