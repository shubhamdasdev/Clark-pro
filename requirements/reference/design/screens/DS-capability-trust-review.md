# Design Spec — Capability Trust Review

**ID:** DS-capability-trust-review
**Project:** clark-pro
**Flow:** UF-002
**Screen:** Overlay: Capability Trust Review
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-004-001, S-004-003, S-008-001
**Components:** ClarkOverlay, ClarkTrustGate, ClarkDataTable, ClarkActionButton

---

## Overlay: Capability Trust Review

Review publisher identity, transport, scopes, egress, cost behavior, and conformance before granting authority.

**Layout & Hierarchy**

1. Primary: Publisher.
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
| Heading | Review capability authority |
| Primary CTA | Continue to authorization |
| Secondary CTA | Keep disconnected |
| Failure | This capability failed a required trust check. |

**States**

- **Default:** Publisher, immutable revision, requested permissions, domains, credential scopes, discovery result, health, non-mutating conformance, workspace/action-class grants.
- **Loading:** Progressively reveal verified metadata; disable authorization until checks settle.
- **Error:** Show the exact failed gate and preserve zero authority.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `capability_trust_review`.
3. Preserve the overlay semantics from the linked flow: preserve parent context and dismiss only the top layer.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-002. |
