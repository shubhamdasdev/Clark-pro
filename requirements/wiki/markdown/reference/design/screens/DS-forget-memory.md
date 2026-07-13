# Design Spec — Forget Memory

**ID:** DS-forget-memory
**Project:** clark-pro
**Flow:** UF-014
**Screen:** Modal: Forget Memory
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-005-002, S-005-004
**Components:** ClarkDialog, ClarkTrustGate, ClarkActionButton

---

## Modal: Forget Memory

Confirm logical removal, derivative deletion, audit tombstone, and disclosed backup-retention limits.

**Layout & Hierarchy**

1. Primary: Exact memory revision.
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
| Heading | Forget this memory? |
| Primary CTA | Forget and remove from retrieval |
| Secondary CTA | Cancel |
| Warning | Clark will show any backup copy that remains under retention policy. |

**States**

- **Default:** Exact memory revision, retrieval removal, derivative/index deletion, active storage result, backup and export retention caveats, confirmation.
- **Loading:** No loading before confirmation; deletion progress is explicit after commit.
- **Error:** Show partial lifecycle state honestly and keep release-blocking evidence open.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `forget_memory`.
3. Preserve the modal semantics from the linked flow: trap focus and require an explicit decision or cancel.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
