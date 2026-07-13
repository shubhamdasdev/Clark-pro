# Release: Local Trust Core

**ID:** R-001
**Project:** clark-pro
**Stage:** Ready
**Status:** QA
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13

---

## Goal

Validate the already-implemented local trust core as one bounded release: generated contracts, hardened desktop/Harness boundaries, evidence-honest Idea Foundry, governed MCP and Bridge, governed memory, Tool Pack lifecycle, and Class A Skill trust.

## Stories in Scope

| Story | Title | Epic | Stage | Status |
|-------|-------|------|-------|--------|
| S-001-001 | Versioned Contracts and Upcasters | E-001 | Ready | Done |
| S-001-002 | Ground Prototype and Evidence Ledger | E-001 | Ready | QA |
| S-002-001 | Hardened Mac Shell Boundary | E-002 | Ready | Done |
| S-002-002 | Durable Event Store and Run Recovery | E-002 | Ready | Done |
| S-003-001 | Immutable Idea Capture and Revision Lineage | E-003 | Ready | Done |
| S-003-002 | Evidence-Honest Idea Inspection and Canvas | E-003 | Ready | Done |
| S-004-001 | Governed Bundled MCP Capability | E-004 | Ready | Done |
| S-004-002 | Scoped Clark Bridge Core | E-004 | Ready | Done |
| S-005-001 | Evidence-Bound Memory Promotion | E-005 | Ready | Done |
| S-005-002 | Scoped Retrieval, Correction, and Forgetting | E-005 | Ready | Done |
| S-006-001 | Tool Pack Quarantine and Trust Gates | E-006 | Ready | Done |
| S-006-002 | Atomic Tool Pack Activation and Rollback | E-006 | Ready | Done |
| S-006-003 | OpenCut Candidate Blocked Upstream | E-006 | Ready | Done |
| S-007-001 | Bundled Class A Skill Trust Lifecycle | E-007 | Ready | Done |
| S-007-002 | Skill Update, Expansion Denial, and Rollback | E-007 | Ready | Done |

## Out of Scope

- Representative creator and commercial Ground signoff
- Production signing, Keychain, social publishing, community Skill execution, and real third-party Tool Pack execution

## Dependencies

- Required human Ground walkthroughs and named signoff remain outside this release and block product-level Ground closure.

## Definition of Done

- All stories in scope are `Status: Done`.
- Required automated, human, migration, recovery, security, and release evidence is attributable and linked.
- Product Team validation has no blocking errors and the static board export matches the committed requirements.

## developer Handoff

1. Load the `` skill and pull the latest main branch.
2. Read this release, then the story files below in dependency order.
3. Set a story to `In Progress` when picked up and `QA` only after self-testing every acceptance criterion.
4. File a Change Request instead of silently changing approved requirements.

### Pickup Order

- `requirements/epics/E-001-contracts-and-product-proof/S-001-001-versioned-contracts-and-upcasters.md` — Versioned Contracts and Upcasters
- `requirements/epics/E-001-contracts-and-product-proof/S-001-002-ground-prototype-and-evidence-ledger.md` — Ground Prototype and Evidence Ledger
- `requirements/epics/E-002-native-studio-and-durable-harness/S-002-001-hardened-mac-shell-boundary.md` — Hardened Mac Shell Boundary
- `requirements/epics/E-002-native-studio-and-durable-harness/S-002-002-durable-event-store-and-run-recovery.md` — Durable Event Store and Run Recovery
- `requirements/epics/E-003-idea-foundry-and-creation-studio/S-003-001-immutable-idea-capture-and-revision-lineage.md` — Immutable Idea Capture and Revision Lineage
- `requirements/epics/E-003-idea-foundry-and-creation-studio/S-003-002-evidence-honest-idea-inspection-and-canvas.md` — Evidence-Honest Idea Inspection and Canvas
- `requirements/epics/E-004-mcp-and-clark-bridge/S-004-001-governed-bundled-mcp-capability.md` — Governed Bundled MCP Capability
- `requirements/epics/E-004-mcp-and-clark-bridge/S-004-002-scoped-clark-bridge-core.md` — Scoped Clark Bridge Core
- `requirements/epics/E-005-governed-memory/S-005-001-evidence-bound-memory-promotion.md` — Evidence-Bound Memory Promotion
- `requirements/epics/E-005-governed-memory/S-005-002-scoped-retrieval-correction-and-forgetting.md` — Scoped Retrieval, Correction, and Forgetting
- `requirements/epics/E-006-reuse-first-tool-packs/S-006-001-tool-pack-quarantine-and-trust-gates.md` — Tool Pack Quarantine and Trust Gates
- `requirements/epics/E-006-reuse-first-tool-packs/S-006-002-atomic-tool-pack-activation-and-rollback.md` — Atomic Tool Pack Activation and Rollback
- `requirements/epics/E-006-reuse-first-tool-packs/S-006-003-opencut-candidate-blocked-upstream.md` — OpenCut Candidate Blocked Upstream
- `requirements/epics/E-007-governed-agent-skills/S-007-001-bundled-class-a-skill-trust-lifecycle.md` — Bundled Class A Skill Trust Lifecycle
- `requirements/epics/E-007-governed-agent-skills/S-007-002-skill-update-expansion-denial-and-rollback.md` — Skill Update, Expansion Denial, and Rollback

### Preservation Rules

- Keep canonical state, exact versions, permission receipts, and provenance on every path.
- Do not convert missing human, provider, or release evidence into an implementation claim.
- Keep external mutations idempotent or explicitly reconciling; do not blind-retry.

---
