# Story: OpenCut Candidate Blocked Upstream

**ID:** S-006-003
**Project:** clark-pro
**Epic:** E-006
**Stage:** Ready
**Status:** Done
**Priority:** P1
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Sources:** [Authoritative epics](../../research/history/import-2026-07-13/product/03-epics-and-stories.md), [Whole-product roadmap](../../research/history/import-2026-07-13/roadmap.md), [Harness evidence](../../research/history/import-2026-07-13/evidence/harness-latest-report.json)

---

## Story

As a **workspace_admin**, I want to **evaluate OpenCut at an immutable revision against the reuse-first boundary ladder**, so that **Clark does not fork or embed a promising editor before a stable supported integration surface exists**.

## Goal

Deliver the observable capability described above through Clark's canonical workspace, with enough evidence to determine whether it is complete.

## Why / Rationale

Clark does not fork or embed a promising editor before a stable supported integration surface exists. This story is separated from adjacent work so the board can report verified progress without treating an incomplete product epic as finished.

## Functional Requirements

- Pin the reviewed OpenCut source and manifest hashes and record the preferred interface ladder result.
- Grant no adapter, capability, skill, converter, UI, credential, filesystem, network, build, or execution authority while blocked.

## Acceptance Criteria

- [ ] Given the pinned OpenCut candidate exposes no supported MCP, CLI, API, library, WASM, sidecar, or typed-file boundary, when evaluated, then it remains blocked_upstream.
- [ ] Given the creator opens Connections, when OpenCut is inspected, then the exact failed gates and zero executable capabilities are visible.

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
