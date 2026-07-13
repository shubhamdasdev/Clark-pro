# Design Spec — Skill Review

**ID:** DS-skill-review
**Project:** clark-pro
**Flow:** UF-004, UF-012
**Screen:** Screen: Skill Review
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-007-001, S-007-002, S-007-003, S-007-004, S-007-005
**Components:** ClarkAppShell, ClarkViewHeading, ClarkTrustGate, ClarkDataTable, ClarkInspector

---

## Screen: Skill Review

Inspect exact Skill bytes, requested tools, effective permission intersection, compatibility, fixtures, and trust ceiling.

**Layout & Hierarchy**

1. Primary: Source hash.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkDataTable | Evidence, receipts, compatibility | `reference/design/design.md` |
| ClarkInspector | Canvas, Review, Memory, package review | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Skill review |
| Primary CTA | Review promotion |
| Secondary CTA | Keep quarantined |
| Failure | This Skill requests authority that is not available. |

**States**

- **Default:** Source hash, files, hidden-executable scan, requested tools/domains, installed capabilities, effective permission intersection, fixture results, revision history.
- **Loading:** Show hash verification and fixture progress separately.
- **Error:** Never show a promotable state while any required check is unknown or failed.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `skill_review`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-004, UF-012. |
