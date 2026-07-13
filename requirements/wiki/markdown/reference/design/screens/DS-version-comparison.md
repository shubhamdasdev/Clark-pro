# Design Spec — Version Comparison

**ID:** DS-version-comparison
**Project:** clark-pro
**Flow:** UF-008
**Screen:** Overlay: Version Comparison
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-003-002, S-003-005
**Components:** ClarkOverlay, ClarkDiffViewer, ClarkDataTable, ClarkActionButton

---

## Overlay: Version Comparison

Compare text or synchronized media versions without losing evidence and technical differences.

**Layout & Hierarchy**

1. Primary: Side-by-side versions.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkOverlay | All Overlay units | `reference/design/design.md` |
| ClarkDiffViewer | Review and revision diffs | `reference/design/design.md` |
| ClarkDataTable | Evidence, receipts, compatibility | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Compare exact versions |
| Primary CTA | Choose this version |
| Secondary CTA | Back to review |
| Media action | Play both |

**States**

- **Default:** Side-by-side versions, synchronized playback, diff markers, source/evidence changes, cost, policy and accessibility changes, annotations.
- **Loading:** Load both previews independently and label unavailable media.
- **Error:** Allow metadata comparison even if one preview cannot render.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `version_comparison`.
3. Preserve the overlay semantics from the linked flow: preserve parent context and dismiss only the top layer.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
