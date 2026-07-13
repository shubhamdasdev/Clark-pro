# Design Spec — Tool Pack Library

**ID:** DS-tool-pack-library
**Project:** clark-pro
**Flow:** UF-003
**Screen:** Screen: Tool Pack Library
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-006-001, S-006-002, S-006-003, S-006-004, S-006-005
**Components:** ClarkAppShell, ClarkViewHeading, ClarkPanel, ClarkStateBadge, ClarkFormField

---

## Screen: Tool Pack Library

Discover reuse-first integration candidates without implying that discovery equals installation or trust.

**Layout & Hierarchy**

1. Primary: Bundled.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkPanel | Lists, summaries, inspectors | `reference/design/design.md` |
| ClarkStateBadge | Runs, trust gates, publications, packages | `reference/design/design.md` |
| ClarkFormField | Setup, capture, decisions | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Tool Packs |
| Primary CTA | Evaluate a source |
| Empty state | No Tool Pack is active. Clark can evaluate a supported source. |
| Blocked label | Blocked upstream |

**States**

- **Default:** Bundled, verified, community, local, and blocked-upstream candidates; source revision; interface type; compatibility and risk summaries.
- **Loading:** Load local package records first; network discovery is explicit.
- **Empty:** Explain the integration ladder and evaluation requirement.
- **Error:** Do not convert network discovery failure into a trust decision.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `tool_pack_library`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-003. |
