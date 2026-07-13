# ADR-0011 — Mac Entitlements and Share Extension Boundary

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Desktop, Security, Release Engineering

## Context

Clark needs local MCP processes, media workers, user-selected files, drag/drop, Finder and Share capture, Keychain, notifications, and direct Developer ID distribution. Apple requires Hardened Runtime for notarized software distributed outside the App Store; App Sandbox is optional for that distribution path but mandatory for Mac App Store distribution. A Share extension is a separate, constrained process and needs a safe transfer boundary to the containing app.

## Decision

Distribute Clark Studio directly as Developer ID-signed and notarized software with Hardened Runtime. The main application is not placed in App Sandbox in the initial topology because it must supervise explicitly approved local tools and user-selected project locations. This does not weaken the renderer: Chromium sandbox, context isolation, no Node integration, CSP, and typed preload APIs remain mandatory.

Implement Share capture as a minimal sandboxed Swift extension. The extension:

1. reads only the `NSItemProvider` items explicitly supplied by the host application;
2. stages an immutable capture bundle and hash-addressed manifest in a team-qualified App Group container;
3. stores no raw credentials and performs no model, MCP, social, or arbitrary network work;
4. notifies/opens Clark through a validated app-owned signal;
5. lets the main app revalidate type, size, hash, sensitivity, path, and user intent before importing;
6. deletes or expires staging data after acknowledged import.

Persistent access outside Clark-owned storage uses user-selected security-scoped bookmarks where required. Third-party code is never loaded as a plug-in into the main or renderer process. Each helper/extension has its own minimal entitlements; broad entitlements are not copied across targets.

## Consequences

### Positive

- Local creator workflows remain possible without pretending Mac App Store sandbox rules fit arbitrary local tools.
- The Share extension has a small, auditable authority surface.
- App Group data is an explicit import queue, not a shared canonical database.
- Hardened Runtime, signatures, notarization, and Gatekeeper remain release requirements.

### Costs

- Direct distribution and update trust are Clark responsibilities.
- The unsandboxed main process must never parse untrusted creative content itself.
- Every helper entitlement and TCC request needs separate review and testing.

## Rejected alternatives

- **Mac App Store-only launch:** incompatible with the assumed local tool/MCP model and makes App Sandbox a product constraint rather than a security choice.
- **Disable Hardened Runtime/library validation broadly:** expands code-injection risk and conflicts with notarization posture.
- **Share extension writes directly into SQLite or invokes Harness:** creates concurrent canonical state and secret/tool authority in an extension.
- **Broad Home-folder entitlement/access:** violates explicit user-selection and least privilege.

## Invariants

1. Every shipped executable, helper, extension, DMG/package, and update is signed and notarized as applicable.
2. Main/renderer do not load third-party dynamic libraries or scripts as in-process plug-ins.
3. Share extension cannot access Keychain secrets, Harness, social accounts, or creator memory.
4. App Group staging data is untrusted until main-app import validation completes.
5. Security-scoped bookmarks are created only from explicit user selection and revoked when the workspace no longer needs them.

## Verification gates

- CI emits an entitlement/signature inventory for every Mach-O target and fails on unapproved additions.
- Notarization log is warning-free; ticket is stapled and verified offline/online.
- Malicious `NSItemProvider`, oversized archive, symlink, polyglot, stale manifest, and hash mismatch fixtures fail before canonical import.
- Extension cannot open Clark databases, credential broker, arbitrary paths, or network destinations.
- TCC prompts identify the responsible process and match the user action that caused them.

## Evidence

- [Apple: preparing an app for distribution](https://developer.apple.com/documentation/xcode/preparing-your-app-for-distribution)
- [Apple: notarizing macOS software](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution)
- [Apple: App Groups](https://developer.apple.com/documentation/xcode/configuring-app-groups)
- [Apple: accessing files from App Sandbox](https://developer.apple.com/documentation/security/accessing-files-from-the-macos-app-sandbox)

## Revisit triggers

- App Sandbox can support the complete approved local-capability model without weakening workflows.
- App Store distribution becomes strategically required.
- A new Apple extension/capture API provides a narrower and more reliable boundary.
