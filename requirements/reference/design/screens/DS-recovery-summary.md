# Design Spec — Recovery Summary

**ID:** DS-recovery-summary
**Project:** clark-pro
**Flow:** UF-015
**Screen:** Screen: Recovery Summary
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-002-002, S-004-003, S-008-002, S-009-003, S-009-005
**Components:** ClarkAppShell, ClarkViewHeading, ClarkPanel, ClarkStateBadge, ClarkActionButton

---

## Screen: Recovery Summary

Classify incomplete local and delegated work after wake, relaunch, or crash and present safe next actions.

**Layout & Hierarchy**

1. Primary: Recovered.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkPanel | Lists, summaries, inspectors | `reference/design/design.md` |
| ClarkStateBadge | Runs, trust gates, publications, packages | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Recovery summary |
| Primary CTA | Resume safe work |
| Secondary CTA | Leave paused |
| Success | Clark recovered your durable work without duplicating it. |

**States**

- **Default:** Recovered, paused, failed, waiting approval, externally completed, and needs-reconciliation groups; checkpoint; provider identity; affected publication intents.
- **Loading:** Boot recovery streams classified groups but never exposes an unclassified item as safe.
- **Empty:** Confirm there was no incomplete work.
- **Error:** Keep uncertain work paused and provide diagnostics.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `recovery_summary`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-015. |
