# Architecture Task: Portable Encrypted Backup and Migration Substrate

**ID:** AT-002-002
**Project:** clark-pro
**Release:** R-002
**Phase:** P-002-02
**Stage:** Ready
**Status:** Backlog
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Extends:** None
**Depends On:** None

---

## What

Create the shared deterministic export, age-v1 encryption, quarantine restore, schema migration preview, and restore-evidence substrate required by workspace portability, privacy, and release recovery.

## Artifact Location

- `clark-pro/packages/backup/`
- `clark-pro/packages/domain/src/migrations/`
- `clark-pro/services/harness/src/backup/`
- `clark-pro/fixtures/backups/`

## Invariants

| Key | Value |
|-----|-------|
| Encryption container | age v1 |
| Default recipients | Per-install X25519 identity plus optional user-held recovery identity |
| Raw secrets in archive | Forbidden |
| Canonical mutation during validation | Forbidden until full quarantine validation passes |

## Goals

- Export events, schemas, policies, Skills, assets, hashes, and restore metadata deterministically without raw secrets.
- Stream encryption before destination write and commit the encrypted file atomically.
- Restore on a clean Mac after authentication, manifest, path, size, hash, schema, signature, and migration validation.

## Steps

1. `[Agent]` Define the deterministic manifest, recipient metadata, streaming archive, quarantine restore, migration preview, and atomic commit contracts.
2. `[Agent]` Add interoperability, corruption, truncation, wrong-key, malicious-path, oversized-asset, schema, disk-full, and interrupted-write fixtures.
3. `[Agent]` Prove new-Mac recovery with only user-held recovery material and independent age tooling.

## Acceptance Criteria

- [ ] A representative workspace round-trip preserves event history, artifact versions, assets, hashes, graph state, memory/Skill metadata, and lineage.
- [ ] Corrupt, incompatible, malicious, or incomplete imports leave the active workspace byte-for-byte unchanged and produce an actionable report.
- [ ] Decrypted archives and staging traces contain no raw credentials, tokens, leases, crash dumps, or provider secrets.
- [ ] At least two independent age implementations decrypt the fixture archive.

## Depends On

None

---
