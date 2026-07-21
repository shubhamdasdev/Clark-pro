# Design Spec — Capability Health

**ID:** DS-capability-health
**Project:** clark-pro
**Flow:** UF-002
**Screen:** Screen: Capability Health
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-004-001, S-004-003, S-008-001
**Components:** ClarkAppShell, ClarkViewHeading, ClarkPanel, ClarkDataTable, ClarkStateBadge

---

## Screen: Capability Health

Confirm discovery, schema, health, scope, and dry-run readiness after connection.

**Layout & Hierarchy**

1. Primary: Health summary.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkPanel | Lists, summaries, inspectors | `reference/design/design.md` |
| ClarkDataTable | Evidence, receipts, compatibility | `reference/design/design.md` |
| ClarkStateBadge | Runs, trust gates, publications, packages | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Capability health |
| Primary CTA | Finish setup |
| Secondary CTA | Run health check |
| Success | Capability is ready for governed use. |

**States**

- **Default:** Health summary, tool inventory, schema revisions, granted workspaces, action classes, latest conformance receipt, revoke and recheck actions.
- **Loading:** Show last verified receipt while the fresh health check runs.
- **Error:** Retain the connection but block execution until health returns.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `capability_health`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-002. |
