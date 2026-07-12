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

## Mac and Electron Security

Electron supports the chosen TypeScript/React/MCP architecture but requires an explicit security posture: current runtime, sandboxing, context isolation, restrictive preload APIs, validated IPC senders, CSP, no remote Node integration, and controlled navigation. On macOS, Electron safe storage uses Keychain-backed keys; Clark still places all secret access behind its credential broker.

- https://www.electronjs.org/docs/latest/tutorial/security
- https://www.electronjs.org/docs/latest/tutorial/context-isolation
- https://www.electronjs.org/docs/latest/tutorial/sandbox
- https://www.electronjs.org/docs/latest/api/safe-storage
- https://developer.apple.com/documentation/security/keychain-services/

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

These properties must be implemented deeply. If Clark becomes primarily a node canvas, generator catalog, or scheduler, it will be undifferentiated.
