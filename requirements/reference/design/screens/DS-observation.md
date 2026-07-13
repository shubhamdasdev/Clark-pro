# Design Spec — Observation

**ID:** DS-observation
**Project:** clark-pro
**Flow:** UF-010
**Screen:** Screen: Observation
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-008-004
**Components:** ClarkAppShell, ClarkRailNav, ClarkViewHeading, ClarkMetricCard, ClarkDataTable, ClarkTrustGate

---

## Screen: Observation

Review quantitative, qualitative, and manual outcomes attached to exact publication lineage.

**Layout & Hierarchy**

1. Primary: Freshness.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkRailNav | Primary navigation | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkMetricCard | Observation and operational summaries | `reference/design/design.md` |
| ClarkDataTable | Evidence, receipts, compatibility | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Observation |
| Primary CTA | Add context |
| Empty state | No comparable observations are available yet. |
| Missingness note | Some platform fields are unavailable or not comparable. |

**States**

- **Default:** Freshness, missingness, platform definitions, sample counts, cohort controls, ranges, cost, satisfaction, comments, qualitative context.
- **Loading:** Show freshness per source instead of one global spinner.
- **Empty:** State why no comparable data exists and when the next observation is due.
- **Error:** Retain last observation with its freshness stamp and surface the provider failure.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `observation`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-010. |
