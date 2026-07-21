# Design Spec — Canvas

**ID:** DS-canvas
**Project:** clark-pro
**Flow:** UF-006, UF-007
**Screen:** Screen: Canvas
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-003-001, S-003-002, S-003-003, S-003-004, S-003-005, S-005-003, S-006-004, S-007-003, S-008-002, S-009-004
**Components:** ClarkAppShell, ClarkRailNav, ClarkViewHeading, ClarkNodeCard, ClarkInspector, ClarkStateBadge

---

## Screen: Canvas

Expose the typed creative graph, lineage, evidence gaps, decisions, branches, staleness, and run state as an inspectable projection.

**Layout & Hierarchy**

1. Primary: Lanes.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkRailNav | Primary navigation | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkNodeCard | Canvas only | `reference/design/design.md` |
| ClarkInspector | Canvas, Review, Memory, package review | `reference/design/design.md` |
| ClarkStateBadge | Runs, trust gates, publications, packages | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Canvas |
| Primary CTA | Preview downstream impact |
| Empty state | The graph will appear after the first capture. |
| Evidence warning | Evidence is still required. |

**States**

- **Default:** Lanes, typed nodes, edges, selected-node inspector, evidence readiness, lineage, stale markers, branch controls, keyboard help.
- **Loading:** Render the stable viewport and node skeletons; keep keyboard focus predictable.
- **Empty:** Offer capture and template entry points.
- **Error:** Keep the last durable projection visible with a rebuild action.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `canvas`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
