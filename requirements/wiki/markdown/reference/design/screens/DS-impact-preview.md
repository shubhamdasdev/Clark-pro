# Design Spec — Impact Preview

**ID:** DS-impact-preview
**Project:** clark-pro
**Flow:** UF-007
**Screen:** Overlay: Impact Preview
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-003-001, S-003-002, S-003-005, S-008-002
**Components:** ClarkOverlay, ClarkDataTable, ClarkStateBadge, ClarkActionButton

---

## Overlay: Impact Preview

Show which downstream artifacts, approvals, schedules, costs, and reusable work change after an upstream decision.

**Layout & Hierarchy**

1. Primary: Changed input.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkOverlay | All Overlay units | `reference/design/design.md` |
| ClarkDataTable | Evidence, receipts, compatibility | `reference/design/design.md` |
| ClarkStateBadge | Runs, trust gates, publications, packages | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Preview downstream impact |
| Primary CTA | Regenerate selected branches |
| Secondary CTA | Preserve selected work |
| Warning | Existing approval will no longer authorize changed output. |

**States**

- **Default:** Changed input, stale artifacts, reusable outputs, invalidated approvals, scheduled-publication risk, estimated regeneration cost, branch selection.
- **Loading:** Compute impact from pinned input hashes and show deterministic progress.
- **Error:** Do not allow regeneration until impact calculation is complete.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `impact_preview`.
3. Preserve the overlay semantics from the linked flow: preserve parent context and dismiss only the top layer.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
