# Design Spec — Approval Decision

**ID:** DS-approval-decision
**Project:** clark-pro
**Flow:** UF-008
**Screen:** Modal: Approval Decision
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-003-002, S-003-005
**Components:** ClarkDialog, ClarkTrustGate, ClarkFormField, ClarkActionButton

---

## Modal: Approval Decision

Bind approval, rejection, edit, or change request to one exact artifact version and actor.

**Layout & Hierarchy**

1. Primary: Exact version hash.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkDialog | All Modal units | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkFormField | Setup, capture, decisions | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Record this exact-version decision |
| Primary CTA | Approve version |
| Secondary CTA | Request changes |
| Reject CTA | Reject version |

**States**

- **Default:** Exact version hash, selected alternative, required gates, reason/note, reversibility, impacted platform adaptations.
- **Loading:** No loading; decisions only open against fully identified versions.
- **Error:** Leave the version unapproved and retain the entered note for retry.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `approval_decision`.
3. Preserve the modal semantics from the linked flow: trap focus and require an explicit decision or cancel.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
