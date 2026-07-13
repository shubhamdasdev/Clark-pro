# Design Spec — Manual Observation

**ID:** DS-manual-observation
**Project:** clark-pro
**Flow:** UF-010
**Screen:** Overlay: Manual Observation
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-008-004
**Components:** ClarkOverlay, ClarkFormField, ClarkTrustGate, ClarkActionButton

---

## Overlay: Manual Observation

Capture qualitative judgment or manual values with source and uncertainty rather than pretending they came from a connector.

**Layout & Hierarchy**

1. Primary: Observation type.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkOverlay | All Overlay units | `reference/design/design.md` |
| ClarkFormField | Setup, capture, decisions | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Add observation context |
| Primary CTA | Save observation |
| Secondary CTA | Cancel |
| Source label | Entered manually |

**States**

- **Default:** Observation type, bounded value or note, source, observed date, freshness, confidence/context, exact publication link.
- **Loading:** No remote loading; verify local publication linkage before save.
- **Error:** Keep entered values and show the invalid field or stale publication link.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `manual_observation`.
3. Preserve the overlay semantics from the linked flow: preserve parent context and dismiss only the top layer.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
