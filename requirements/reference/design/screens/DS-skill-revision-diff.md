# Design Spec — Skill Revision Diff

**ID:** DS-skill-revision-diff
**Project:** clark-pro
**Flow:** UF-004, UF-012
**Screen:** Overlay: Skill Revision Diff
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-007-001, S-007-002, S-007-003, S-007-004, S-007-005
**Components:** ClarkOverlay, ClarkDiffViewer, ClarkTrustGate, ClarkDataTable

---

## Overlay: Skill Revision Diff

Compare procedure, tools, permissions, compatibility, fixtures, and recovery behavior between Skill revisions.

**Layout & Hierarchy**

1. Primary: File diff.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkOverlay | All Overlay units | `reference/design/design.md` |
| ClarkDiffViewer | Review and revision diffs | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkDataTable | Evidence, receipts, compatibility | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Compare Skill revisions |
| Primary CTA | Review promotion |
| Secondary CTA | Keep current revision |
| Expansion warning | This revision requests additional authority. |

**States**

- **Default:** File diff, manifest diff, capability expansion, permission changes, fixture/regression results, compatibility, rollback target.
- **Loading:** Compute hashes and fixture deltas independently.
- **Error:** Candidate stays quarantined and prior revision stays active.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `skill_revision_diff`.
3. Preserve the overlay semantics from the linked flow: preserve parent context and dismiss only the top layer.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-004, UF-012. |
