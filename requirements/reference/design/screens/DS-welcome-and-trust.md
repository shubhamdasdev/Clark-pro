# Design Spec — Welcome & Trust

**ID:** DS-welcome-and-trust
**Project:** clark-pro
**Flow:** UF-001
**Screen:** Screen: Welcome & Trust
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-001-001, S-001-002, S-002-001, S-002-003, S-002-004, S-003-001
**Components:** ClarkAppShell, ClarkViewHeading, ClarkTrustGate, ClarkActionButton, ClarkPanel

---

## Screen: Welcome & Trust

Explain Clark’s local-first ownership and authority model before any setup choice.

**Layout & Hierarchy**

1. Primary: Signed-build status.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |
| ClarkPanel | Lists, summaries, inspectors | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Your work stays yours |
| Primary CTA | Create a workspace |
| Secondary CTA | Import a workspace |
| Safety link | View build and privacy details |

**States**

- **Default:** Signed-build status, local ownership summary, optional remote-call disclosure, memory/credential/Skill/Tool Pack distinctions, diagnostics link, create/import choices.
- **Loading:** Verify signature and local prerequisites without blocking access to diagnostics.
- **Error:** Show the failed trust check, preserve read-only diagnostics, and offer Safe Recovery.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `welcome_and_trust`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-001. |
