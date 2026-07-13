# ADR-0019 — Portable Encrypted Backups

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Data, Security, Desktop

## Context

Workspace exports/backups may contain the creator's full unpublished operation and memory. Apple-only encryption would reduce portability; proprietary encryption risks lock-in and implementation mistakes. The backup must exclude raw secrets, verify integrity before restore, work without Clark cloud, and offer recovery when the original Mac/Keychain is lost.

## Decision

Produce a deterministic manifest plus events, schemas, skills, policies, asset hashes/content, and restore metadata in a staged archive. Raw credentials, tokens, leases, crash dumps, caches, and provider secret material are excluded.

Encrypt the entire archive using the interoperable age v1 file format through a vetted implementation. Default recipients:

1. a per-install X25519 backup identity whose private key is stored in Keychain; and
2. an optional separate recovery X25519 identity generated during backup setup and exported/displayed once for user-controlled offline storage.

Users may instead/additionally use age's passphrase recipient where supported, with clear loss/strength guidance. Multiple recipient stanzas permit device and recovery access without duplicating plaintext. Clark records recipient public identifiers, format/algorithm version, manifest hash, encrypted size, created time, and restore-test state—never private identities/passphrases.

Encryption streams before leaving the protected staging area. Destination write is atomic; plaintext staging uses restrictive permissions and is securely unlinked on completion/failure where the filesystem permits. Restore decrypts into quarantine, validates age authentication, manifest/schema versions, hashes, sizes, paths, signatures, and migrations before canonical import.

## Consequences

### Positive

- Backups are portable and decryptable with independent age tooling.
- Keychain convenience and user-held disaster recovery can coexist.
- Whole-archive encryption hides filenames/content structure inside the payload.

### Costs

- Losing all recipient identities/passphrases makes encrypted backups unrecoverable by design.
- Ciphertext still reveals approximate file size, creation location/name, and access timing.
- Large media archives need streaming, interruption, and partial-file cleanup discipline.

## Rejected alternatives

- **Unencrypted export by default:** unacceptable for memory/unpublished content.
- **Raw zip password/AES without specified KDF/container:** inconsistent and easy to misuse.
- **Keychain-only key:** fails device-loss recovery and portability.
- **Clark cloud recovery master key:** makes Clark a secret/data recovery authority and creates systemic compromise risk.
- **Invent a proprietary crypto container:** unnecessary interoperability and audit burden.

## Invariants

1. Backup plaintext contains no raw secrets and encrypted output is authenticated.
2. Restore never mutates canonical state before full validation/migration preview.
3. Recovery material is never uploaded or silently copied to Relay.
4. User can verify/decrypt with documented independent tooling and inspect the manifest after decryption.
5. Backup key/format rotation preserves restore support for retained historical archives.

## Verification gates

- Official age/interoperability test vectors and at least two independent implementations decrypt fixture archives.
- Corruption, truncation, wrong key, malicious path/archive, oversized asset, schema mismatch, and interrupted-write fixtures fail safely.
- Secret canaries are absent from decrypted backup and encryption temp/destination traces.
- New-Mac recovery with only the offline identity succeeds; missing-key UX states permanent loss honestly.
- Backup/restore performance and free-space checks pass the representative large-media fixture.

## Evidence

- [C2SP age v1 specification](https://age-encryption.org/v1)
- [age reference implementation](https://github.com/FiloSottile/age)

## Revisit triggers

- An approved post-quantum age recipient reaches required implementation/interoperability maturity.
- Enterprise key-management/HSM recipients are required.
- Backup scale requires a seekable/chunk-deduplicated encrypted format with equivalent portability and integrity.
