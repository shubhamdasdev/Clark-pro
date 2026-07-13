# Design Spec — Memory History

**ID:** DS-memory-history
**Project:** clark-pro
**Flow:** UF-014
**Screen:** Overlay: Memory History
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-005-002, S-005-004
**Components:** ClarkOverlay, ClarkLineageList, ClarkDataTable, ClarkActionButton

---

## Overlay: Memory History

Show revisions, evidence, retrieval history, and influenced outputs before correction or forgetting.

**Layout & Hierarchy**

1. Primary: Revision timeline.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkOverlay | All Overlay units | `reference/design/design.md` |
| ClarkLineageList | Memory and provenance | `reference/design/design.md` |
| ClarkDataTable | Evidence, receipts, compatibility | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Memory history and influence |
| Primary CTA | Correct this memory |
| Destructive CTA | Forget memory |
| Caveat | Backup retention is shown before deletion. |

**States**

- **Default:** Revision timeline, active/disputed/expired state, evidence links, retrieval receipts, influenced artifacts, backup-retention caveat.
- **Loading:** Load redacted history first; sensitive payloads follow policy.
- **Error:** Disable mutation while retention boundaries cannot be established.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `memory_history`.
3. Preserve the overlay semantics from the linked flow: preserve parent context and dismiss only the top layer.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
