# Story: Hardened Mac Shell Boundary

**ID:** S-002-001
**Project:** clark-pro
**Epic:** E-002
**Stage:** Ready
**Status:** Done
**Priority:** P0
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Desktop evidence](../../research/history/import-2026-07-13/evidence/desktop-latest-report.json)

---

## Story

As a **creator**, I want to **navigate Clark with native Mac controls while the renderer remains isolated**, so that **the desktop experience feels native without exposing shell, filesystem, secrets, or raw IPC**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

The desktop experience feels native without exposing shell, filesystem, secrets, or raw IPC. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Keep context isolation, sandboxing, web security, and sender validation enabled.
- Expose only named preload methods and native menu/view accelerators.

## Acceptance Criteria

- [ ] Given the Electron boundary tests run, when the renderer is inspected, then Node globals, raw IPC, shell, path, and secret access are absent.
- [ ] Given the creator uses menus or keyboard shortcuts, when a Studio view is selected, then the expected view opens with accessible names and one visible level-one heading.

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
