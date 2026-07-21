# Design Spec — Export Package

**ID:** DS-export-package
**Project:** clark-pro
**Flow:** UF-009
**Screen:** Screen: Export Package
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-008-001, S-008-002, S-008-003
**Components:** ClarkAppShell, ClarkViewHeading, ClarkPanel, ClarkDataTable, ClarkActionButton

---

## Screen: Export Package

Produce a deterministic, platform-valid handoff with complete lineage when automation cannot proceed.

**Layout & Hierarchy**

1. Primary: Artifact files.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkPanel | Lists, summaries, inspectors | `reference/design/design.md` |
| ClarkDataTable | Evidence, receipts, compatibility | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Publication export package |
| Primary CTA | Export complete package |
| Secondary CTA | Record assisted result |
| Success | Export verified and linked to this publication intent. |

**States**

- **Default:** Artifact files, copy, metadata, disclosures, technical validation, checksums, platform instructions, lineage manifest, assisted-result recording.
- **Loading:** Stream package assembly with per-file checksums.
- **Empty:** Not applicable; an export package always has an artifact version.
- **Error:** Remove partial output or mark it invalid; retain canonical artifact state.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `export_package`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-009. |
