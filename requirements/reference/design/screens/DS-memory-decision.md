# Design Spec — Memory Decision

**ID:** DS-memory-decision
**Project:** clark-pro
**Flow:** UF-011
**Screen:** Modal: Memory Decision
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-005-001, S-005-003, S-008-005
**Components:** ClarkDialog, ClarkFormField, ClarkTrustGate, ClarkActionButton

---

## Modal: Memory Decision

Record a revision-specific promote, edit, dispute, defer, or reject decision.

**Layout & Hierarchy**

1. Primary: Exact revision.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkDialog | All Modal units | `reference/design/design.md` |
| ClarkFormField | Setup, capture, decisions | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Record memory decision |
| Primary CTA | Promote this revision |
| Secondary CTA | Keep inactive |
| Reject CTA | Reject proposal |

**States**

- **Default:** Exact revision, final statement, scope, sensitivity, expiry, retrieval policy, reason, actor.
- **Loading:** No loading; decision is local and exact-version bound.
- **Error:** Keep the proposal inactive and preserve the drafted reason.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `memory_decision`.
3. Preserve the modal semantics from the linked flow: trap focus and require an explicit decision or cancel.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-011. |
