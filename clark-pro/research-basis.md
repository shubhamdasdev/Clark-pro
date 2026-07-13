# Clark Pro — Research Basis and Competitive Reality

**Reviewed:** July 12, 2026

This document records the external evidence that shaped the v2 product decisions. Product claims must be updated when the market or protocols change.

## Harness, Memory, and Skills

### Hermes Agent

The official Hermes Agent repository describes persistent memory, agent-created and improving skills, scheduled work, model neutrality, subagents, and multiple interfaces. Clark adopts the durable-harness lesson but specializes it for creator operations and adds evidence-bound memory/skill promotion.

- https://github.com/NousResearch/hermes-agent
- https://hermes-agent.nousresearch.com/docs/user-guide/features/skills/

### Agent Skills

The Agent Skills specification defines a package directory with `SKILL.md` and optional scripts, references, and assets. Clark uses the standard package shape and adds quarantine, effective permission intersection, test fixtures, revisions, trust, and rollback.

- https://agentskills.io/specification

## MCP

Clark must support capability negotiation rather than assuming every MCP peer implements every feature. Durable Tasks are useful for media and batch work but remain experimental, so Clark retains its own stable job receipts and recovery model.

- https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/tasks
- https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation
- https://modelcontextprotocol.io/docs/develop/build-client
- https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization

## Social Distribution

Postiz already provides MCP tools plus CLI/API coverage for integration discovery, dynamic platform schemas, media generation/upload, scheduling, publishing, and analytics. Clark should integrate this capability before rebuilding platform breadth.

- https://docs.postiz.com/mcp/introduction
- https://docs.postiz.com/mcp/tools
- https://docs.postiz.com/cli/introduction
- https://docs.postiz.com/public-api/introduction

Direct social publishing still carries provider approval, audit, account-type, OAuth, and content-state constraints. Clark's publication ledger, policy gates, reconciliation, assisted handoff, and export fallback are therefore permanent architecture.

- https://developers.tiktok.com/doc/content-posting-api-reference-direct-post
- https://developers.google.com/youtube/v3/docs/videos/insert
- https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access

## Open-Source Tool Reuse and OpenCut

OpenCut's current rewrite is useful architectural evidence, not yet an integration dependency. Its pinned `bab8af831b354a0b5a98a4a6e818ab7d633b94df` tree separates web, desktop, and API scaffolds and declares a future Rust engine serving Editor API, plugins, MCP, headless mode, and scripting. The public rewrite tracker still leaves architecture documentation, engine core, Editor API, Plugin API/host, storage, built-in plugins, MCP, headless, scripting, and platform applications unchecked.

- https://github.com/OpenCut-app/OpenCut/tree/bab8af831b354a0b5a98a4a6e818ab7d633b94df
- https://github.com/OpenCut-app/OpenCut/issues/811
- https://github.com/OpenCut-app/OpenCut/blob/bab8af831b354a0b5a98a4a6e818ab7d633b94df/LICENSE

OpenCut Classic is substantial and demonstrates internal `EditorCore` managers, commands, actions, definition registries, Rust/WASM crates, rendering, and browser persistence. Those internal registries are helpful design references but are not a supported third-party plugin, headless, or project-interchange contract. Clark therefore prefers a future supported MCP/headless/library boundary and rejects coupling to private browser DOM or TypeScript types as its default.

- https://github.com/OpenCut-app/opencut-classic/blob/cf5e79e919144200294fb9fed22a222592a0aeea/AGENTS.md
- https://github.com/OpenCut-app/opencut-classic/blob/cf5e79e919144200294fb9fed22a222592a0aeea/apps/web/src/core/index.ts
- https://github.com/OpenCut-app/opencut-classic/blob/cf5e79e919144200294fb9fed22a222592a0aeea/apps/web/src/actions/registry.ts
- https://github.com/OpenCut-app/opencut-classic/blob/cf5e79e919144200294fb9fed22a222592a0aeea/apps/web/src/effects/registry.ts

The repository is MIT licensed, which permits commercial use and modification when the notice is retained. That does not settle licenses for every dependency/asset/model or use of upstream trademarks. ADR-0022 therefore makes source pinning, dependency/license review, SBOM, vulnerability/provenance evidence, quarantine, compatibility, and rollback part of Tool Pack activation rather than assuming “open source” means safe to embed.

## Mac and Electron Security

Electron supports the chosen TypeScript/React/MCP architecture but requires an explicit security posture: current runtime, sandboxing, context isolation, restrictive preload APIs, validated IPC senders, CSP, no remote Node integration, and controlled navigation. On macOS, Electron safe storage uses Keychain-backed keys; Clark still places all secret access behind its credential broker.

- https://www.electronjs.org/docs/latest/tutorial/security
- https://www.electronjs.org/docs/latest/tutorial/context-isolation
- https://www.electronjs.org/docs/latest/tutorial/sandbox
- https://www.electronjs.org/docs/latest/api/safe-storage
- https://developer.apple.com/documentation/security/keychain-services/

## Ground Security Decision Evidence

The Ground security ADRs use primary specifications and platform documentation rather than treating framework defaults as guarantees:

- Apple permits Developer ID/notarized distribution outside the Mac App Store and requires Hardened Runtime for notarization; the Share extension remains a separately sandboxed target with an App Group staging boundary.
  - https://developer.apple.com/documentation/xcode/preparing-your-app-for-distribution
  - https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution
  - https://developer.apple.com/documentation/xcode/configuring-app-groups
  - https://developer.apple.com/documentation/security/accessing-files-from-the-macos-app-sandbox
- Electron's utility process and MessagePort APIs support a supervised private Harness channel; its security guidance still requires renderer sandboxing, context isolation, sender validation, restricted navigation, and current runtime updates.
  - https://www.electronjs.org/docs/latest/api/utility-process
  - https://www.electronjs.org/docs/latest/api/message-port-main
  - https://www.electronjs.org/docs/latest/tutorial/process-model
  - https://www.electronjs.org/docs/latest/tutorial/security
- MCP HTTP authorization does not secure local stdio execution. The specification directs stdio implementations toward environment-sourced credentials, while MCP security guidance treats local servers as an arbitrary-code trust decision.
  - https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization
  - https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
- HPKE supplies recipient encryption but not application replay/order protection, so Clark combines TLS 1.3, an RFC 9180 suite, RFC 8032 signatures, RFC 8785 canonicalization, and durable replay/idempotency state.
  - https://www.rfc-editor.org/rfc/rfc9180.html
  - https://www.rfc-editor.org/info/rfc8032/
  - https://www.rfc-editor.org/rfc/rfc8785.html
  - https://www.rfc-editor.org/info/rfc8446/
- Wasmtime/WASI provides explicit preopened capabilities for the executable-skill class. Node's own WASI documentation says `node:wasi` is not a secure sandbox for untrusted code, so it is not Clark's isolation boundary.
  - https://docs.wasmtime.dev/security.html
  - https://docs.wasmtime.dev/c-api/wasi_8h.html
  - https://nodejs.org/api/wasi.html
- OpenTelemetry leaves sensitive-data classification and filtering to the implementer; Electron can retain crash dumps locally without automatic upload. Clark therefore uses allowlisted local-first telemetry and explicit diagnostic upload consent.
  - https://opentelemetry.io/docs/security/handling-sensitive-data/
  - https://opentelemetry.io/docs/specs/otlp/
  - https://www.electronjs.org/docs/latest/api/crash-reporter
- Portable backups use the documented age v1 format rather than a Clark-specific cryptographic container.
  - https://age-encryption.org/v1
  - https://github.com/FiloSottile/age
- GitHub private vulnerability reporting and repository security advisories supply the pre-release confidential intake/collaboration path selected in ADR-0020.
  - https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately
  - https://docs.github.com/en/code-security/concepts/vulnerability-reporting-and-management/repository-security-advisories

## Competitive Reality

### PixVerse Canvas

PixVerse Canvas offers a connected visual video workflow with sources, storyboards, assets, model results, batches, lineage, reusable context, and cost awareness. Clark cannot differentiate on “video generation on a node canvas” alone.

- https://pixverse.ai/en/blog/pixverse-canvas-ai-video-workflow

### ViralCanvas

ViralCanvas connects research sources, creator voice context, AI generation, and repurposing in a visual workspace. Clark cannot differentiate on “visual research context for creators” alone.

- https://www.viralcanvas.ai/

### Postiz

Postiz combines social scheduling, publishing, AI media, MCP, CLI/API, and analytics. Clark should treat it as infrastructure and differentiate above it.

- https://docs.postiz.com/introduction

### Socheli and other local/open systems

Open creator systems increasingly combine local execution, publishing, human gates, and learning. “Open source + local + agentic publishing” is not sufficient positioning by itself.

- https://socheli.com/
- https://simplepost.dev/

## Differentiation Conclusion

The defensible Clark thesis is the integrated decision graph:

1. governed creator identity and memory;
2. durable loops and recovery;
3. artifact and decision provenance;
4. evidence-linked outcomes;
5. reviewable skill evolution;
6. Mac-local canonical ownership;
7. one state model across Studio and MCP.
8. a governed Tool Pack layer that reuses specialized engines without surrendering creator truth.

These properties must be implemented deeply. If Clark becomes primarily a node canvas, generator catalog, or scheduler, it will be undifferentiated.
