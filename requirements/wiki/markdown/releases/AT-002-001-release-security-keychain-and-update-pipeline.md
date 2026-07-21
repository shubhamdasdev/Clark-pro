# Architecture Task: Release Security, Keychain, and Update Pipeline

**ID:** AT-002-001
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

Establish the production Mac release substrate shared by credential, signing, notarization, Gatekeeper, update, rollback, and packaged-evidence stories before feature branches depend on an unsigned development shell.

## Artifact Location

- `clark-pro/apps/desktop/build/entitlements.mac.plist`
- `clark-pro/apps/desktop/electron-builder.yml or equivalent checked-in build config`
- `clark-pro/packages/credentials/`
- `clark-pro/apps/desktop/scripts/release-evidence/`

## Invariants

| Key | Value |
|-----|-------|
| Bundle identifier | com.clarkpro.studio |
| Credential storage | macOS Keychain; opaque references outside broker |
| Renderer secret access | None |
| Release surface | Signed/notarized Developer ID DMG with rollback-capable signed update |

## Goals

- A clean release checkout produces a Hardened Runtime build whose designated requirement and Team ID are attributable.
- Notarization, stapling, Gatekeeper, packaged smoke, update, failed-update rollback, and credential-revocation evidence are machine-readable.
- Credential material never appears in renderer state, canonical events, logs, diagnostics bundles, or model context.

## Steps

1. `[User]` Provide the Apple Developer Team/Developer ID certificate access and approved update-channel signing destination outside the repository. Tell me when this is done.
2. `[Agent]` Establish the broker package, entitlements, reproducible packaging, notarization/stapling, update signature, rollback, and evidence pipeline.
3. `[Agent]` Run secret canaries, strict codesign/Gatekeeper checks, packaged smoke, revoked-credential, failed-update, and rollback fixtures.

## Acceptance Criteria

- [ ] Release candidate passes strict codesign, Hardened Runtime, notarization, stapling, Gatekeeper, and packaged launch checks with attributable evidence.
- [ ] Renderer/preload/event/log/diagnostics canary scans contain zero raw credential material.
- [ ] A revoked credential blocks dependent execution before provider access while the secret remains unreadable.
- [ ] A bad or interrupted update restores the last verified build and preserves workspace compatibility.

## Depends On

None

---
