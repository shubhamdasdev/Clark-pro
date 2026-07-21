# Design Spec — Focus

**ID:** DS-focus
**Project:** clark-pro
**Flow:** UF-001, UF-005, UF-006, UF-013, UF-015
**Screen:** Screen: Focus
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-001-002, S-001-003, S-001-004, S-002-002, S-002-003, S-002-004, S-002-005, S-003-001, S-003-003, S-003-004, S-003-005, S-004-002, S-004-003, S-004-004, S-005-003, S-006-004, S-007-003, S-008-002, S-009-003, S-009-004, S-009-005
**Components:** ClarkAppShell, ClarkRailNav, ClarkViewHeading, ClarkPanel, ClarkStateBadge, ClarkActionButton

---

## Screen: Focus

Present the next creator decision, required inputs, active gates, and resumable work without exposing the whole graph.

**Layout & Hierarchy**

1. Primary: Inbox count.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkRailNav | Primary navigation | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkPanel | Lists, summaries, inspectors | `reference/design/design.md` |
| ClarkStateBadge | Runs, trust gates, publications, packages | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Focus |
| Primary CTA | Run to review |
| Dry-run CTA | Check readiness |
| Empty state | Capture an idea to begin. |

**States**

- **Default:** Inbox count, current project, next decision, run readiness, budget, selected accounts and Brand Constitution, recovery summary, recent activity.
- **Loading:** Render stable shell and skeleton panels while projections load.
- **Empty:** Explain capture entry points and offer Quick Capture.
- **Error:** Show the last durable checkpoint and a retry or diagnostics action.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `focus`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-001, UF-005, UF-006, UF-013, UF-015. |
