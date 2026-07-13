# Design Spec — Reconciliation

**ID:** DS-reconciliation
**Project:** clark-pro
**Flow:** UF-009, UF-015
**Screen:** Overlay: Reconciliation
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-002-002, S-004-003, S-008-001, S-008-002, S-008-003, S-009-003, S-009-005
**Components:** ClarkOverlay, ClarkTrustGate, ClarkDataTable, ClarkActionButton

---

## Overlay: Reconciliation

Resolve ambiguous external mutations and recovered work without blind retry.

**Layout & Hierarchy**

1. Primary: Intent.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkOverlay | All Overlay units | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkDataTable | Evidence, receipts, compatibility | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Reconcile this external action |
| Primary CTA | Check provider state |
| Secondary CTA | Continue observing |
| Warning | Do not retry until Clark can prove the prior intent did not publish. |

**States**

- **Default:** Intent, last known state, provider receipt, live lookup, possible outcomes, retry safety, operator choices, audit timeline.
- **Loading:** Show last canonical receipt while provider observation runs.
- **Error:** Keep the intent in needs_reconciliation and expose manual evidence entry.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `reconciliation`.
3. Preserve the overlay semantics from the linked flow: preserve parent context and dismiss only the top layer.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
