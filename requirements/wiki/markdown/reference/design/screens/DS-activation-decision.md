# Design Spec — Activation Decision

**ID:** DS-activation-decision
**Project:** clark-pro
**Flow:** UF-003
**Screen:** Modal: Activation Decision
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-006-001, S-006-002, S-006-003, S-006-004, S-006-005
**Components:** ClarkDialog, ClarkTrustGate, ClarkDataTable, ClarkActionButton

---

## Modal: Activation Decision

Bind activation or rollback to an exact tested Tool Pack revision and explicit creator decision.

**Layout & Hierarchy**

1. Primary: Revision diff.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkDialog | All Modal units | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkDataTable | Evidence, receipts, compatibility | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Activate this exact revision? |
| Primary CTA | Activate revision |
| Secondary CTA | Keep in quarantine |
| Rollback CTA | Restore prior revision |

**States**

- **Default:** Revision diff, effective capabilities, workspace scope, permission/egress changes, migration preview, rollback target, evidence receipt.
- **Loading:** No loading; decision is available only after conformance finishes.
- **Error:** Atomic failure leaves the previous active revision unchanged.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `activation_decision`.
3. Preserve the modal semantics from the linked flow: trap focus and require an explicit decision or cancel.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
