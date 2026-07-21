# Design Spec — Review

**ID:** DS-review
**Project:** clark-pro
**Flow:** UF-006, UF-007, UF-008, UF-010, UF-011, UF-013, UF-015
**Screen:** Screen: Review
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-002-002, S-003-001, S-003-002, S-003-003, S-003-004, S-003-005, S-004-002, S-004-003, S-004-004, S-005-001, S-005-003, S-006-004, S-007-003, S-008-002, S-008-004, S-008-005, S-009-001, S-009-003, S-009-004, S-009-005
**Components:** ClarkAppShell, ClarkRailNav, ClarkViewHeading, ClarkDiffViewer, ClarkTrustGate, ClarkInspector

---

## Screen: Review

Compare exact artifact versions with evidence, policy, cost, lineage, and creator decisions before mutation.

**Layout & Hierarchy**

1. Primary: Review queue.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkRailNav | Primary navigation | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkDiffViewer | Review and revision diffs | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkInspector | Canvas, Review, Memory, package review | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Review |
| Primary CTA | Review decision |
| Empty state | Nothing is waiting for review. |
| Stale warning | This version changed upstream and needs a new decision. |

**States**

- **Default:** Review queue, paired text diff or synchronized media, sources, model/provider, Skill and memory revisions, policies, annotations, cost, approval status.
- **Loading:** Preserve queue position and version identity while preview assets load.
- **Empty:** Confirm no approval or evidence decision is pending.
- **Error:** Keep metadata visible and offer local export or retry for preview failures.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `review`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
