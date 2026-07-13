# Story: Physical Erasure and Memory Validation Corpus

**ID:** S-005-004
**Project:** clark-pro
**Epic:** E-005
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

As a **workspace_admin**, I want to **prove deletion, backup retention, and retrieval behavior against a representative privacy corpus**, so that **forgetting claims match the physical data lifecycle and regulatory expectations**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Forgetting claims match the physical data lifecycle and regulatory expectations. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Define cryptographic erasure or safe event-log compaction for personal payloads and derived indexes.
- Maintain a corpus covering leakage, poisoning, expiry, correction, forget, backup, and restore behavior.

## Acceptance Criteria

- [ ] Given a creator completes physical erasure, when active storage, derivatives, exports, and defined backup-retention boundaries are inspected, then deleted payloads are absent or explicitly disclosed under the retention policy.
- [ ] Given the memory corpus runs on a release candidate, when any leakage, correction, or forget case fails, then release signoff is blocked.

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
