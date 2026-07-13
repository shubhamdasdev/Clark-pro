# Clark Studio Mac shell and local Harness

This is the first executable desktop-and-Harness slice on Clark's permanent Electron topology. It proves a narrow creator loop, durable process boundary, and interaction boundary; it is not yet the complete Studio or a release candidate.

## What is real

- a native macOS application menu with standard roles and Clark navigation shortcuts;
- a sandboxed renderer with context isolation, no Node integration, a restrictive CSP, denied navigation/popups/webviews/permissions, and an allowlisted custom protocol;
- a small validated preload API;
- keyboard-operable Focus, Canvas, Memory, Connections, and trust-center interactions;
- persisted and screen-clamped window bounds plus active-view restoration;
- an app-supervised Electron `utilityProcess` connected only to main through a transferred, schema-validated MessagePort;
- an explicit minimal child environment, bounded/redacted diagnostics, restart budget, request deadlines, message-size and in-flight limits, and stale/replayed channel rejection;
- SQLite/WAL append-only events, transactional projections, checkpoints, command idempotency, per-workspace hash chains, pinned compiled plans, and content-addressed text assets;
- a contract-compiled, zero-egress `Idea to Approved Text` loop with a real bundled MCP inspection step, durable recovery, and exact-version creator approval/rejection;
- live Connections state for the source-pinned stdio MCP capability and the authenticated localhost Clark Bridge, without exposing the Bridge bearer to the renderer;
- live Focus and Connections projections that survive renderer reload, Harness death, application quit/relaunch, and packaged-ASAR execution;
- a live governed Memory workspace with exact brief/run evidence, proposal-only claims, creator promotion/rejection/dispute/forget actions, append-only correction, sensitivity/destination-aware retrieval, and explicit-only/never-send-to-model policy controls;
- a live Tool Pack gate review that shows OpenCut's immutable source pin separately from ten still-pending/blocked interface, legal, supply-chain, acquisition, adapter, activation, and rollback gates; activation remains disabled with zero installed authority;
- a live Skill trust review that shows exact source/files, Class A isolation, requested versus trusted scopes, eleven promotion gates, creator promotion, and the explicit absence of direct invocation authority;
- automated boundary, persistence, recovery, menu, keyboard, semantic-accessibility, relaunch, and packaged-app tests.

## What is deliberately not claimed

- Developer ID signing, Hardened Runtime, notarization, stapling, Gatekeeper acceptance, or update signatures;
- an observed VoiceOver task pass or expert design/accessibility review;
- production Keychain, TCC notification, Share Extension, file-bookmark, or updater flows;
- a general graph compiler, model/agent execution, third-party MCP installation, a real active external Tool Pack, community Skill installation, Class B/C execution, direct Skill invocation, reflection-driven memory proposals, semantic/vector retrieval, complete physical erasure, social connections, or publishing authority;
- OpenCut execution or any third-party Tool Pack authority.

The local `pack:mac` command produces an unsigned inspection bundle only. Release signing must use CI-held identity material and the gates in ADR-0011.

## Verify

```bash
npm ci
npm run verify
npm run verify:packaged
```
