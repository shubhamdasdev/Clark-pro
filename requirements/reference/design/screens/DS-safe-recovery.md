# Design Spec — Safe Recovery

**ID:** DS-safe-recovery
**Project:** clark-pro
**Flow:** UF-001
**Screen:** Modal: Safe Recovery
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-001-002, S-002-003, S-002-004, S-003-001
**Components:** ClarkDialog, ClarkTrustGate, ClarkActionButton

---

## Modal: Safe Recovery

Explain why setup or launch failed and protect the last trusted workspace state.

**Layout & Hierarchy**

1. Primary: Failure class.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkDialog | All Modal units | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Clark stopped before changing your workspace |
| Primary CTA | Retry safely |
| Secondary CTA | Open read-only |
| Destructive CTA | Roll back to last trusted version |

**States**

- **Default:** Failure class, affected operation, last trusted version, diagnostics preview, read-only option, retry, rollback.
- **Loading:** No loading state; the modal is rendered from a completed failure receipt.
- **Error:** If rollback itself fails, retain the modal and expose the diagnostics bundle.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `safe_recovery`.
3. Preserve the modal semantics from the linked flow: trap focus and require an explicit decision or cancel.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-001. |
