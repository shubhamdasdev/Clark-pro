# Release: Single-User Creator Alpha

**ID:** R-002
**Project:** clark-pro
**Stage:** Draft
**Status:** Backlog
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13

---

## Architecture Gate

**Gate:** Closed

| AT | Title | Stage | Status | Phase |
|----|-------|-------|--------|-------|
| AT-002-001 | Release Security, Keychain, and Update Pipeline | Ready | Backlog | P-002-02 |
| AT-002-002 | Portable Encrypted Backup and Migration Substrate | Ready | Backlog | P-002-02 |
| AT-002-003 | Isolated Media, Tool Pack, and Skill Execution Substrate | Ready | Backlog | P-002-03 |
| AT-002-004 | Privacy-Safe Observability and Diagnostics | Ready | Backlog | P-002-02 |

Coding may begin only after each task is Done and the architect opens this gate.

## Goal

Complete the remaining local single-user creator system and trust boundaries needed before real multi-channel distribution begins.

## Stories in Scope

| Story | Title | Epic | Stage | Status |
|-------|-------|------|-------|--------|
| S-001-003 | Representative Creator Validation | E-001 | Ready | Backlog |
| S-001-004 | Commercial and Leadership Signoff | E-001 | Ready | Backlog |
| S-002-003 | Workspace Portability and Backup Recovery | E-002 | Ready | Backlog |
| S-002-004 | Keychain, Signing, and Safe Updates | E-002 | Ready | Backlog |
| S-002-005 | Accessibility and Performance Release Evidence | E-002 | Ready | Backlog |
| S-003-003 | Source Ingestion and Claim Ledger | E-003 | Ready | Backlog |
| S-003-004 | Writing, Media, and Platform Variants | E-003 | Ready | Backlog |
| S-003-005 | Version-Specific Review and Policy Gates | E-003 | Ready | Backlog |
| S-004-003 | Durable Bridge Tasks and Client Pairing | E-004 | Ready | Backlog |
| S-004-004 | External Client Examples and Compatibility | E-004 | Ready | Backlog |
| S-005-003 | Semantic Retrieval and Reflection Lineage | E-005 | Ready | Backlog |
| S-005-004 | Physical Erasure and Memory Validation Corpus | E-005 | Ready | Backlog |
| S-006-004 | Real Third-Party Acquisition and Execution | E-006 | Ready | Backlog |
| S-006-005 | Clark Kit SDK and Community Compatibility | E-006 | Ready | Backlog |
| S-007-003 | Run-Scoped Skill Invocation and Receipts | E-007 | Ready | Backlog |
| S-007-004 | Community Skills and Class B/C Sandbox | E-007 | Ready | Backlog |
| S-007-005 | Reflection-Driven Skill Proposals and Regression | E-007 | Ready | Backlog |
| AT-002-001 | Release Security, Keychain, and Update Pipeline | Architecture | Ready | Backlog |
| AT-002-002 | Portable Encrypted Backup and Migration Substrate | Architecture | Ready | Backlog |
| AT-002-003 | Isolated Media, Tool Pack, and Skill Execution Substrate | Architecture | Ready | Backlog |
| AT-002-004 | Privacy-Safe Observability and Diagnostics | Architecture | Ready | Backlog |

## Phases

| ID | Name | Start | End | Milestone | Summary |
|----|------|-------|-----|-----------|---------|
| P-002-01 | Ground Signoff |  |  | Ground closed | Representative human, commercial, security, and ownership evidence |
| P-002-02 | Native Runtime Completion |  |  | Release-trusted Mac build | Portability, Keychain, signing, updater, accessibility, and performance |
| P-002-03 | Creation and Ecosystem Completion |  |  | Complete single-user creator loop | Research, media, review, durable Bridge, memory, Tool Packs, and Skill execution |

## Evidence Alignment

| Layer | Required artifacts / evidence |
|-------|-------------------------------|
| Flows | UF-001 through UF-008 and UF-011 through UF-014; TF-006 protects the primary creation spine |
| Design | design.md, design-tokens.md, sitemap, and all linked DS screens/states/copy |
| Architecture | ARCH-001 through ARCH-003 and AT-002-001 through AT-002-004 |
| Metrics | AE-001 through AE-007; local-first analytics dashboard; no export before opt-in |
| QA | 17 story plans, TR-002, HP-001 through HP-009, conformance/chaos/migration/accessibility/human evidence |
| Exit | Ground signoff, production-trusted Mac build, portable restore, complete single-user loop, one real supported Tool Pack, run-scoped Skill receipts |

## Out of Scope

- Live social scheduling and publication
- Observation ingestion across real platforms
- Team synchronization and hosted operations

## Dependencies

- R-001 Local Trust Core must complete QA.
- Representative providers and a supported real Tool Pack candidate must be selected.

## Definition of Done

- All stories in scope are `Status: Done`.
- Required automated, human, migration, recovery, security, and release evidence is attributable and linked.
- PM Agent validation has no blocking errors and the static board export matches the committed requirements.

## Coding Agent Handoff

1. Load the `requirements-reader` skill and pull the latest main branch.
2. Read this release, then the story files below in dependency order.
3. Set a story to `In Progress` when picked up and `QA` only after self-testing every acceptance criterion.
4. File a Change Request instead of silently changing approved requirements.

### Pickup Order

- `requirements/epics/E-001-contracts-and-product-proof/S-001-003-representative-creator-validation.md` — Representative Creator Validation
- `requirements/epics/E-001-contracts-and-product-proof/S-001-004-commercial-and-leadership-signoff.md` — Commercial and Leadership Signoff
- `requirements/epics/E-002-native-studio-and-durable-harness/S-002-003-workspace-portability-and-backup-recovery.md` — Workspace Portability and Backup Recovery
- `requirements/epics/E-002-native-studio-and-durable-harness/S-002-004-keychain-signing-and-safe-updates.md` — Keychain, Signing, and Safe Updates
- `requirements/epics/E-002-native-studio-and-durable-harness/S-002-005-accessibility-and-performance-release-evidence.md` — Accessibility and Performance Release Evidence
- `requirements/epics/E-003-idea-foundry-and-creation-studio/S-003-003-source-ingestion-and-claim-ledger.md` — Source Ingestion and Claim Ledger
- `requirements/epics/E-003-idea-foundry-and-creation-studio/S-003-004-writing-media-and-platform-variants.md` — Writing, Media, and Platform Variants
- `requirements/epics/E-003-idea-foundry-and-creation-studio/S-003-005-version-specific-review-and-policy-gates.md` — Version-Specific Review and Policy Gates
- `requirements/epics/E-004-mcp-and-clark-bridge/S-004-003-durable-bridge-tasks-and-client-pairing.md` — Durable Bridge Tasks and Client Pairing
- `requirements/epics/E-004-mcp-and-clark-bridge/S-004-004-external-client-examples-and-compatibility.md` — External Client Examples and Compatibility
- `requirements/epics/E-005-governed-memory/S-005-003-semantic-retrieval-and-reflection-lineage.md` — Semantic Retrieval and Reflection Lineage
- `requirements/epics/E-005-governed-memory/S-005-004-physical-erasure-and-memory-validation-corpus.md` — Physical Erasure and Memory Validation Corpus
- `requirements/epics/E-006-reuse-first-tool-packs/S-006-004-real-third-party-acquisition-and-execution.md` — Real Third-Party Acquisition and Execution
- `requirements/epics/E-006-reuse-first-tool-packs/S-006-005-clark-kit-sdk-and-community-compatibility.md` — Clark Kit SDK and Community Compatibility
- `requirements/epics/E-007-governed-agent-skills/S-007-003-run-scoped-skill-invocation-and-receipts.md` — Run-Scoped Skill Invocation and Receipts
- `requirements/epics/E-007-governed-agent-skills/S-007-004-community-skills-and-class-b-c-sandbox.md` — Community Skills and Class B/C Sandbox
- `requirements/epics/E-007-governed-agent-skills/S-007-005-reflection-driven-skill-proposals-and-regression.md` — Reflection-Driven Skill Proposals and Regression

### Preservation Rules

- Keep canonical state, exact versions, permission receipts, and provenance on every path.
- Do not convert missing human, provider, or release evidence into an implementation claim.
- Keep external mutations idempotent or explicitly reconciling; do not blind-retry.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 11:28 | 1.0 | PM Agent | Created from the evidence-reconciled Clark Pro whole-product board import. |
| 2026-07-13 11:50 | — | PM Agent | Added architecture and evidence alignment gates for flows, design, metrics, observability, and QA. |
