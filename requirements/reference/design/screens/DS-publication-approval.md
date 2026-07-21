# Design Spec — Publication Approval

**ID:** DS-publication-approval
**Project:** clark-pro
**Flow:** UF-009
**Screen:** Modal: Publication Approval
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-008-001, S-008-002, S-008-003
**Components:** ClarkDialog, ClarkTrustGate, ClarkDataTable, ClarkActionButton

---

## Modal: Publication Approval

Confirm platform schema, account health, disclosure, exact artifact version, schedule, cost, and idempotent intent before external mutation.

**Layout & Hierarchy**

1. Primary: Account and platform.
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
| Heading | Approve publication intent? |
| Primary CTA | Submit publication |
| Secondary CTA | Cancel |
| Safety note | Clark will reconcile an ambiguous result before retrying. |

**States**

- **Default:** Account and platform, artifact version, schema validation, disclosures, scheduled time, idempotency intent, policy result, fallback.
- **Loading:** Revalidate account and platform schema; disable submission while stale.
- **Error:** Return the creator to the exact blocking account, policy, or schema requirement.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `publication_approval`.
3. Preserve the modal semantics from the linked flow: trap focus and require an explicit decision or cancel.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-009. |
