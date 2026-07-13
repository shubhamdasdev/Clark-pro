# ADR-0014 — Remote Envelopes and Device Identity

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Relay, Security, Domain

## Context

Relay workers and future team devices exchange sensitive job inputs, events, and receipts through infrastructure Clark operates or rents. TLS protects transport but does not make stored relay payloads unreadable to the service, establish durable device authorship, or prevent application-level replay. HPKE provides recipient encryption but explicitly does not provide message ordering or replay protection.

## Decision

Use two layers:

1. **Transport:** TLS 1.3 with normal certificate validation. Disable 0-RTT for authentication, mutation, job delegation, events, receipts, and key management.
2. **Application envelope:** encrypt each job/event bundle to the intended worker/device using a reviewed RFC 9180 HPKE implementation with the initial suite `DHKEM(X25519, HKDF-SHA256) + HKDF-SHA256 + ChaCha20-Poly1305`. Sign the canonical envelope header and ciphertext hash with the sender device key using Ed25519 over RFC 8785 canonical JSON.

Each envelope includes version, workspace, sender device/key ID, recipient/key ID, job/intent ID, action class, policy revision, issued/expiry times, random nonce, monotonic sender sequence, causal parents, plaintext/ciphertext hashes, and capability/output contract references as authenticated data.

Private device/worker keys live in Keychain or the platform's strongest available key store; export is not assumed. Workspace content keys are separately wrapped to authorized device/member keys. The relay stores ciphertext and routing metadata, not plaintext workspace keys.

Replay protection is application state: accepted envelope/receipt IDs, sender sequence windows, nonce uniqueness, expiry, intent idempotency, and aggregate-version checks. Cryptographic primitives are consumed through audited libraries and official test vectors; Clark does not implement them from scratch.

## Consequences

### Positive

- Relay storage compromise does not automatically disclose job/workspace payloads.
- Device authorship, tamper detection, and key revocation are explicit.
- Envelopes remain independently verifiable after transport ends.

### Costs

- Key enrollment, rotation, device loss, member removal, backup, and cryptographic agility become product systems.
- Metadata such as timing, recipient, size, and routing remains visible unless separately padded/hidden.
- HPKE/signatures do not solve authorization, replay, or domain conflict by themselves.

## Rejected alternatives

- **TLS only:** relay/service compromise can read stored payloads and forge application records.
- **Home-grown X25519 + AES construction:** unnecessary custom cryptographic protocol risk.
- **One organization symmetric key:** weak device attribution and expensive revocation blast radius.
- **Trust server timestamps/order as truth:** lets Relay rewrite causal/domain history.
- **TLS 0-RTT mutations:** replay can duplicate side effects and requires avoidable complexity.

## Invariants

1. No remote envelope is accepted without authenticated sender, intended recipient, workspace, expiry, nonce, sequence, and policy/intent binding.
2. Relay cannot unwrap workspace/job content without an explicitly authorized worker/device key.
3. Revoked keys cannot create accepted future events/jobs; historical signatures remain attributable.
4. Mutation idempotency and replay ledgers remain mandatory above TLS/HPKE.
5. Algorithm/suite identifiers are versioned and migration supports decrypting retained historical data.

## Verification gates

- RFC test vectors and cross-implementation vectors pass for every enabled suite.
- Tamper, wrong-recipient, wrong-workspace, expired, replayed, reordered, sequence-gap, duplicate-intent, and revoked-key envelopes fail deterministically.
- Relay database dump contains no plaintext content keys, job inputs, memory excerpts, or credentials.
- Device loss/member removal/key rotation drills preserve authorized access and block removed identities.
- 0-RTT is proven disabled on all mutating/auth/key endpoints.

## Evidence

- [RFC 9180: Hybrid Public Key Encryption](https://www.rfc-editor.org/rfc/rfc9180.html)
- [RFC 8032: Ed25519/EdDSA](https://www.rfc-editor.org/info/rfc8032/)
- [RFC 8785: JSON Canonicalization Scheme](https://www.rfc-editor.org/rfc/rfc8785.html)
- [RFC 8446: TLS 1.3 and 0-RTT replay considerations](https://www.rfc-editor.org/info/rfc8446/)

## Revisit triggers

- A vetted standard envelope (for example a suitable COSE/MLS profile) meets all job/event requirements with less custom composition.
- Post-quantum migration policy selects an interoperable HPKE/recipient profile.
- Platform secure hardware changes the available device-key algorithms.
