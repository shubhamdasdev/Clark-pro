# Design Spec — Tool Pack Review

**ID:** DS-tool-pack-review
**Project:** clark-pro
**Flow:** UF-003
**Screen:** Screen: Tool Pack Review
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-006-001, S-006-002, S-006-003, S-006-004, S-006-005
**Components:** ClarkAppShell, ClarkViewHeading, ClarkTrustGate, ClarkDataTable, ClarkInspector, ClarkActionButton

---

## Screen: Tool Pack Review

Inspect immutable source, legal, supply-chain, interface, permission, converter, UI, migration, and rollback evidence.

**Layout & Hierarchy**

1. Primary: Revision/hash.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkDataTable | Evidence, receipts, compatibility | `reference/design/design.md` |
| ClarkInspector | Canvas, Review, Memory, package review | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Tool Pack review |
| Primary CTA | Acquire to quarantine |
| Blocked CTA | Keep blocked |
| Warning | Installation does not grant execution authority. |

**States**

- **Default:** Revision/hash, license, SBOM, vulnerability/provenance, interface ladder, adapter/capability inventory, converters/loss, UI origins, tests, compatibility, migration, rollback.
- **Loading:** Each evidence gate has an independent pending state.
- **Error:** Display exact gate failure and the retained prior trusted revision.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `tool_pack_review`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
