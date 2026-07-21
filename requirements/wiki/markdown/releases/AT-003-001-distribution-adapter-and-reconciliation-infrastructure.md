# Architecture Task: Distribution Adapter and Reconciliation Infrastructure

**ID:** AT-003-001
**Project:** clark-pro
**Release:** R-003
**Phase:** P-003-01
**Stage:** Ready
**Status:** Backlog
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Extends:** None
**Depends On:** None

---

## What

Establish the shared Postiz/direct/assisted distribution adapter boundary, account broker integration, platform schema registry, idempotent publication intent store, observation scheduler, and reconciliation worker before distribution stories implement UI behavior.

## Artifact Location

- `clark-pro/packages/connectors/postiz/`
- `clark-pro/packages/connectors/social/`
- `clark-pro/packages/policy/src/publication/`
- `clark-pro/services/harness/src/publications/`
- `clark-pro/fixtures/publications/`

## Invariants

| Key | Value |
|-----|-------|
| Canonical state | Clark publication intent and receipt ledger |
| Retry from needs_reconciliation | Forbidden until prior outcome disproved |
| Credential material | Keychain reference/lease only |
| Fallback | Deterministic export remains available |

## Goals

- Discover/validate current platform schemas and account health before mutation.
- Submit with intent/idempotency identity, persist provider receipt, observe to verified live or explicit reconciliation.
- Ingest supported outcomes with definition, freshness, missingness, deletion, and exact publication lineage.

## Steps

1. `[User]` Provision approved Postiz test/production workspaces and representative social accounts through the credential broker; do not commit secrets. Tell me when this is done.
2. `[Agent]` Implement the adapter lifecycle, schema registry, account health, intent ledger, observer/reconciler, export fallback, and recorded provider fixtures.
3. `[Agent]` Run duplicate-response, response-loss-after-commit, revoked-account, provider-schema-change, outage/export, delete, and observation-missingness chaos cases.

## Acceptance Criteria

- [ ] Every publication intent reaches verified, failed, cancelled, removed, exported, or needs_reconciliation with attributable receipts.
- [ ] Ambiguous response/restart scenarios create no blind retry or duplicate verified publication.
- [ ] Revoked accounts immediately block dependent scheduled work and identify affected intents.
- [ ] Connector outage produces a platform-valid deterministic export without losing artifact lineage.

## Depends On

None

---
