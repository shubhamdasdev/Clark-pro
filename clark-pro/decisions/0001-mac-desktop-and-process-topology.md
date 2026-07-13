# ADR-0001 — Mac Desktop and Process Topology

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Product, Desktop, Harness, Security

## Context

Clark needs a graph-rich studio, local files and media, native capture and notifications, Keychain credentials, MCP processes, long-running work, and recovery after renderer or app restarts. A browser-only product cannot provide the required local operating boundary. A single privileged Electron renderer would make untrusted content, model output, and third-party UI an unacceptable path to the filesystem, shell, or secrets.

## Decision

Ship a signed and notarized macOS application using Electron for the desktop shell and React/TypeScript for the renderer. Split runtime authority across:

1. a sandboxed renderer with no Node integration;
2. an Electron main process limited to window and native lifecycle duties;
3. an isolated Clark Harness utility process/local daemon that owns domain commands and external capabilities;
4. separately constrained media workers for expensive deterministic transforms;
5. optional Swift helpers/extensions only where macOS integration requires them.

All renderer-to-main and main-to-harness communication uses typed, allowlisted, versioned messages. Provider HTML, artifacts, web content, and connector output remain untrusted.

## Consequences

### Positive

- One TypeScript capability ecosystem spans React Flow, MCP, domain schemas, and providers.
- Renderer reloads do not own or destroy canonical run state.
- Native Mac behavior can coexist with a portable harness.
- Privileged authority can be tested at process boundaries.

### Costs

- Electron footprint and update/supply-chain discipline are accepted costs.
- Native quality still requires deliberate menus, shortcuts, drag/drop, Quick Look, accessibility, notifications, and window restoration.
- Share extensions or deeper OS integration may require a signed Swift companion.

## Rejected alternatives

- **Browser/PWA:** insufficient local lifecycle, process, filesystem, Keychain, and tool-hosting control.
- **SwiftUI-only:** strong native shell but splits the graph/MCP/provider ecosystem across Swift and TypeScript without enough product benefit.
- **Tauri as the primary shell:** smaller binary is less important than one coherent TypeScript runtime; Rust introduces a second core implementation surface before the trust model is proven.
- **Single Electron process or Node-enabled renderer:** violates the renderer compromise boundary.
- **Mac App Store-only distribution:** its sandbox is not assumed compatible with arbitrary local MCP servers and tools; direct signed/notarized distribution remains primary.

## Invariants

1. The renderer never receives raw credentials or arbitrary shell authority.
2. Navigation, popups, deep links, and IPC senders are validated.
3. Canonical runs survive renderer reload and recover after application restart.
4. Media workers receive explicit job inputs and no ambient credential access.
5. Every shipped binary and helper is signed; the release is notarized.

## Verification gates

- A renderer-compromise test cannot read Keychain values, spawn arbitrary processes, or access arbitrary files.
- Forced termination of renderer, main, harness, and media worker produces the documented recovery state.
- CSP, sandbox, context isolation, permission handlers, navigation rules, and preload API inventory are release artifacts.
- Notarization, update signature validation, and rollback are exercised on supported macOS versions.

## Revisit triggers

- Electron can no longer meet required macOS security or accessibility behavior.
- A native component becomes the dominant product surface rather than an integration helper.
- Distribution policy makes the chosen local-tool model impossible.
