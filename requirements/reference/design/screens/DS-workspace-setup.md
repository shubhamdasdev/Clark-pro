# Design Spec — Workspace Setup

**ID:** DS-workspace-setup
**Project:** clark-pro
**Flow:** UF-001
**Screen:** Screen: Workspace Setup
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-001-002, S-002-003, S-002-004, S-003-001
**Components:** ClarkAppShell, ClarkViewHeading, ClarkFormField, ClarkActionButton, ClarkTrustGate

---

## Screen: Workspace Setup

Create or import the canonical local workspace, backup destination, provider, and Brand Constitution.

**Layout & Hierarchy**

1. Primary: Workspace identity.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkFormField | Setup, capture, decisions | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Set up your Clark workspace |
| Primary CTA | Open Focus |
| Optional action | Set up connections later |
| Error | Clark could not verify this workspace. Nothing was imported. |

**States**

- **Default:** Workspace identity, storage location, backup recipient, provider connection, Brand Constitution import, optional connector setup, guided template choice.
- **Loading:** Show step-local progress; never hide which local operation is running.
- **Empty:** New workspace begins with a guided Full Week template.
- **Error:** Keep the active workspace unchanged and show diagnostics plus rollback.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `workspace_setup`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-001. |
