# Design Spec — Memory

**ID:** DS-memory
**Project:** clark-pro
**Flow:** UF-011, UF-014
**Screen:** Screen: Memory
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-005-001, S-005-002, S-005-003, S-005-004, S-008-005
**Components:** ClarkAppShell, ClarkRailNav, ClarkViewHeading, ClarkMetricCard, ClarkLineageList, ClarkInspector

---

## Screen: Memory

Inspect active beliefs, proposals, evidence, scope, sensitivity, retrieval history, influence, correction, and forgetting.

**Layout & Hierarchy**

1. Primary: Memory metrics.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkAppShell | All full-screen Studio surfaces | `reference/design/design.md` |
| ClarkRailNav | Primary navigation | `reference/design/design.md` |
| ClarkViewHeading | Every screen header | `reference/design/design.md` |
| ClarkMetricCard | Observation and operational summaries | `reference/design/design.md` |
| ClarkLineageList | Memory and provenance | `reference/design/design.md` |
| ClarkInspector | Canvas, Review, Memory, package review | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Memory |
| Primary CTA | Review proposal |
| Empty state | Clark has no active memory for this scope. |
| Governance note | Clark never promotes memory without your decision. |

**States**

- **Default:** Memory metrics, search/filter, item list, proposal state, statement, confidence, evidence, contradictions, scope, sensitivity, expiry, retrievals, influenced artifacts.
- **Loading:** Search and inspector load independently; never flash hidden sensitive text.
- **Empty:** Explain proposal and import paths.
- **Error:** Keep memory excluded from retrieval if its policy state cannot be verified.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `memory`.
3. Preserve the screen semantics from the linked flow: maintain one visible H1 and keyboard-restorable navigation state.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
