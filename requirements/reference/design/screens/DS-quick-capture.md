# Design Spec — Quick Capture

**ID:** DS-quick-capture
**Project:** clark-pro
**Flow:** UF-005
**Screen:** Overlay: Quick Capture
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-003-001, S-003-003
**Components:** ClarkOverlay, ClarkFormField, ClarkActionButton, ClarkTrustGate

---

## Overlay: Quick Capture

Capture text, URL, screenshot, file, selection, or voice without automatically starting paid research or generation.

**Layout & Hierarchy**

1. Primary: Source preview.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkOverlay | All Overlay units | `reference/design/design.md` |
| ClarkFormField | Setup, capture, decisions | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Capture to Clark |
| Primary CTA | Save capture |
| Secondary CTA | Leave in Inbox |
| Safety note | Capturing does not start research or generation. |

**States**

- **Default:** Source preview, immutable-original notice, workspace/project suggestion, intent note, Inbox option.
- **Loading:** Show local checksum and import progress for large files.
- **Error:** Retain the original outside canonical state until the append succeeds; allow retry.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `quick_capture`.
3. Preserve the overlay semantics from the linked flow: preserve parent context and dismiss only the top layer.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-005. |
