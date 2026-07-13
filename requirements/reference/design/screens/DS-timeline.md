# Design Spec — Timeline

**ID:** DS-timeline
**Project:** clark-pro
**Flow:** UF-006, UF-007, UF-009, UF-015
**Screen:** Screen: Timeline
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-002-002, S-003-001, S-003-002, S-003-003, S-003-004, S-003-005, S-004-003, S-005-003, S-006-004, S-007-003, S-008-001, S-008-002, S-008-003, S-009-003, S-009-004, S-009-005
**Components:** ClarkAppShell, ClarkRailNav, ClarkViewHeading, ClarkTimelineRow, ClarkStateBadge, ClarkActionButton

---

## Screen: Timeline

Coordinate approved artifacts, account requirements, schedules, submission, verification, and reconciliation states.

**Layout & Hierarchy**

1. Primary: Calendar/list modes.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkRailNav | Primary navigation | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkTimelineRow | Timeline | `reference/design/design.md` |
| ClarkStateBadge | Runs, trust gates, publications, packages | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Timeline |
| Primary CTA | Schedule approved work |
| Empty state | Approved work will appear here. |
| Reconciliation label | Needs reconciliation |

**States**

- **Default:** Calendar/list modes, artifact and account, approval state, platform requirements, scheduled time, publication state, receipts, affected-account warnings.
- **Loading:** Show local intents immediately and refresh provider state independently.
- **Empty:** Link back to Review and explain approval requirement.
- **Error:** Keep intent state visible; never collapse unknown into failed or retry.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `timeline`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-006, UF-007, UF-009, UF-015. |
