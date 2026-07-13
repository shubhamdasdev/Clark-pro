# Design Spec — Skill Promotion

**ID:** DS-skill-promotion
**Project:** clark-pro
**Flow:** UF-004, UF-012
**Screen:** Modal: Skill Promotion
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-007-001, S-007-002, S-007-003, S-007-004, S-007-005
**Components:** ClarkDialog, ClarkTrustGate, ClarkActionButton

---

## Modal: Skill Promotion

Record the explicit promotion, limitation, rejection, or rollback decision for an exact Skill revision.

**Layout & Hierarchy**

1. Primary: Revision.
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
| Heading | Promote this Skill revision? |
| Primary CTA | Promote within this ceiling |
| Secondary CTA | Keep quarantined |
| Rollback CTA | Restore prior Skill |

**States**

- **Default:** Revision, trust class, capability ceiling, workspace scope, fixture summary, regression result, prior rollback revision.
- **Loading:** No loading; promotion is unavailable until all test evidence resolves.
- **Error:** A failed atomic decision retains the prior active Skill.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `skill_promotion`.
3. Preserve the modal semantics from the linked flow: trap focus and require an explicit decision or cancel.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
