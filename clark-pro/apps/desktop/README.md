# Clark Studio bounded Mac shell

This is the first executable desktop slice on Clark's accepted Electron topology. It proves a narrow interaction and isolation boundary; it is not a production Studio or release candidate.

## What is real

- a native macOS application menu with standard roles and Clark navigation shortcuts;
- a sandboxed renderer with context isolation, no Node integration, a restrictive CSP, denied navigation/popups/webviews/permissions, and an allowlisted custom protocol;
- a small validated preload API;
- keyboard-operable Focus, Canvas, Connections, and trust-center interactions;
- persisted and screen-clamped window bounds plus active-view restoration;
- automated boundary, menu, keyboard, semantic-accessibility, and relaunch tests.

## What is deliberately not claimed

- Developer ID signing, Hardened Runtime, notarization, stapling, Gatekeeper acceptance, or update signatures;
- an observed VoiceOver task pass or expert design/accessibility review;
- production Keychain, TCC notification, Share Extension, file-bookmark, updater, or Harness utility-process flows;
- OpenCut execution or any third-party Tool Pack authority.

The local `pack:mac` command produces an unsigned inspection bundle only. Release signing must use CI-held identity material and the gates in ADR-0011.

## Verify

```bash
npm ci
npm run verify
npm run pack:mac
```
