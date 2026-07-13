# Design Spec — Memory Proposal

**ID:** DS-memory-proposal
**Project:** clark-pro
**Flow:** UF-011, UF-014
**Screen:** Overlay: Memory Proposal
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-005-001, S-005-002, S-005-003, S-005-004, S-008-005
**Components:** ClarkOverlay, ClarkTrustGate, ClarkLineageList, ClarkActionButton

---

## Overlay: Memory Proposal

Review a small evidence-linked belief proposal before it can influence retrieval.

**Layout & Hierarchy**

1. Primary: Statement.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkOverlay | All Overlay units | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkLineageList | Memory and provenance | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Review memory proposal |
| Primary CTA | Decide on proposal |
| Secondary CTA | Defer |
| Safety note | This proposal is not used in retrieval yet. |

**States**

- **Default:** Statement, evidence, contradiction, confidence, sensitivity, scope, expiry, retrieval policy, originating trajectory.
- **Loading:** Resolve evidence references before enabling promotion.
- **Error:** Proposal remains inactive and can be deferred.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `memory_proposal`.
3. Preserve the overlay semantics from the linked flow: preserve parent context and dismiss only the top layer.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-011, UF-014. |
