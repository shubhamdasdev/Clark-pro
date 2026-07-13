# Design Spec — Run Approval

**ID:** DS-run-approval
**Project:** clark-pro
**Flow:** UF-006
**Screen:** Modal: Run Approval
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-003-003, S-003-004, S-003-005, S-005-003, S-006-004, S-007-003, S-008-002, S-009-004
**Components:** ClarkDialog, ClarkTrustGate, ClarkDataTable, ClarkActionButton

---

## Modal: Run Approval

Show the compiled run plan, permissions, paid calls, selected revisions, budget, and review gates before execution.

**Layout & Hierarchy**

1. Primary: Plan hash.
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
| Heading | Approve this run plan? |
| Primary CTA | Start approved run |
| Secondary CTA | Edit inputs |
| Cancel CTA | Cancel |

**States**

- **Default:** Plan hash, inputs, capability and Skill revisions, permission leases, predicted cost/range, checkpoints, approval gates, remote eligibility.
- **Loading:** Compilation progress is visible; approval remains disabled until the plan is complete.
- **Error:** Show invalid credential, schema, permission, or budget gate and link to its owner surface.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `run_approval`.
3. Preserve the modal semantics from the linked flow: trap focus and require an explicit decision or cancel.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-006. |
