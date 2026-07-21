# Design Spec — Connections

**ID:** DS-connections
**Project:** clark-pro
**Flow:** UF-002, UF-003, UF-013
**Screen:** Screen: Connections
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-004-001, S-004-002, S-004-003, S-004-004, S-006-001, S-006-002, S-006-003, S-006-004, S-006-005, S-008-001
**Components:** ClarkAppShell, ClarkRailNav, ClarkViewHeading, ClarkPanel, ClarkStateBadge, ClarkTrustGate

---

## Screen: Connections

Manage capabilities, social accounts, MCP clients, Tool Packs, Skills, and their effective workspace authority.

**Layout & Hierarchy**

1. Primary: Source and trust filters.
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
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Connections |
| Primary CTA | Add a connection |
| Empty state | No external capability has authority yet. |
| Revoke action | Revoke access |

**States**

- **Default:** Source and trust filters, connection cards, health, scopes, trust states, affected schedules, revoke controls, developer mode.
- **Loading:** Keep stored connection names hidden until scoped projections load.
- **Empty:** Explain bundled, verified, community, and local-development sources.
- **Error:** Show health as unknown without erasing the last verified trust record.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `connections`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-002, UF-003, UF-013. |
