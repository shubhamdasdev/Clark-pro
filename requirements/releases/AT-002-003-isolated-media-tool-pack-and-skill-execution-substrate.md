# Architecture Task: Isolated Media, Tool Pack, and Skill Execution Substrate

**ID:** AT-002-003
**Project:** clark-pro
**Release:** R-002
**Phase:** P-002-03
**Stage:** Ready
**Status:** Backlog
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Extends:** None
**Depends On:** AT-002-001

---

## What

Build the common supervised process/sandbox, acquisition quarantine, resource ceilings, egress policy, converter boundary, and canonical receipt plumbing needed before real external Tool Packs, media jobs, and Class B/C Skills execute.

## Artifact Location

- `clark-pro/packages/plugin-sdk/`
- `clark-pro/packages/media/`
- `clark-pro/packages/skills/`
- `clark-pro/services/harness/src/supervision/`
- `clark-pro/tool-packages/`

## Invariants

| Key | Value |
|-----|-------|
| Integration preference | MCP → CLI → HTTP → library → WASM → sidecar → typed file → isolated browser → fork |
| Execution grant | Declaration ∩ trust ceiling ∩ workspace policy ∩ run grant |
| Blocked candidate authority | Zero |
| Update behavior | Return to quarantine; retain verified rollback revision |

## Goals

- Verify source/artifact identity before unpack/build and reject archive, symlink, path, signature, substitution, and dependency attacks.
- Run media and external execution under time, memory, filesystem, process, network, credential, and capability ceilings.
- Record exact inputs, outputs, revisions, timing, cost, permissions, failure class, converter loss, migration, and rollback receipts.

## Steps

1. `[Agent]` Implement provider-neutral supervisors, quarantine storage, acquisition verification, sandbox policy, converter loss contract, and lifecycle receipts.
2. `[Agent]` Integrate the existing WASM hostile corpus and add acquisition, UI-origin, media, migration, upgrade, and rollback fixtures.
3. `[Agent]` Activate one supported real Tool Pack only after legal, supply-chain, compatibility, conformance, migration, and rollback evidence pass.

## Acceptance Criteria

- [ ] No hostile fixture escapes its declared filesystem, network, process, credential, capability, time, or memory boundary.
- [ ] OpenCut remains blocked with zero executable components until a stable reviewed upstream interface exists.
- [ ] A real supported Tool Pack completes one creator-loop capability call with a complete canonical receipt and verified rollback.
- [ ] A failed update or activation leaves the exact prior trusted revision active and workspace data compatible.

## Depends On

AT-002-001

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created from arch.md, observability.md, release scope, and accepted Clark ADRs. |
