# Design Spec — Inbox

**ID:** DS-inbox
**Project:** clark-pro
**Flow:** UF-005
**Screen:** Screen: Inbox
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-003-001, S-003-003
**Components:** ClarkAppShell, ClarkRailNav, ClarkViewHeading, ClarkDataTable, ClarkEmptyState

---

## Screen: Inbox

Hold captured originals that need project or intent clarification without losing provenance.

**Layout & Hierarchy**

1. Primary: Captured item list.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkRailNav | Primary navigation | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkDataTable | Evidence, receipts, compatibility | `reference/design/design.md` |
| ClarkEmptyState | Lists and first-run screens | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Inbox |
| Primary CTA | Clarify intent |
| Empty state | Inbox is clear. |
| Archive action | Archive capture |

**States**

- **Default:** Captured item list, source type, captured time, workspace/project suggestion, missing-intent prompts, archive action.
- **Loading:** Use row skeletons without changing sort position.
- **Empty:** Confirm no captured item needs attention.
- **Error:** Show stale cached rows read-only and preserve retry.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `inbox`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-005. |
