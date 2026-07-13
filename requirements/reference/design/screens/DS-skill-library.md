# Design Spec — Skill Library

**ID:** DS-skill-library
**Project:** clark-pro
**Flow:** UF-004
**Screen:** Screen: Skill Library
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-007-001, S-007-002, S-007-003, S-007-004
**Components:** ClarkAppShell, ClarkViewHeading, ClarkPanel, ClarkStateBadge

---

## Screen: Skill Library

Discover bundled and community procedures while preserving trust class, quarantine, and compatibility state.

**Layout & Hierarchy**

1. Primary: Skill name.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkPanel | Lists, summaries, inspectors | `reference/design/design.md` |
| ClarkStateBadge | Runs, trust gates, publications, packages | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Agent Skills |
| Primary CTA | Inspect a Skill |
| Empty state | No Skill has been promoted for this workspace. |
| Quarantine label | Quarantined |

**States**

- **Default:** Skill name, source identity, class, requested capabilities, compatibility, state, active revision, available update.
- **Loading:** Read installed records locally; community lookup is opt-in.
- **Empty:** Explain that installed does not mean active.
- **Error:** Keep current active revisions available if update discovery fails.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `skill_library`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-004. |
