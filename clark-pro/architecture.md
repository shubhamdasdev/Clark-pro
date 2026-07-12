# Clark Pro — Architecture

How the canvas, the agents, and the MCP tools fit together. Designed local-first and open-source, so a solo creator can run it on a laptop and a builder can extend it without forking core.

---

## High-Level Shape

```
┌──────────────────────────────────────────────────────────────┐
│                        CANVAS (Web UI)                         │
│   React + React Flow node graph · live streaming · inspector   │
└───────────────▲───────────────────────────────┬──────────────┘
                │ SSE / WebSocket (live node state)│ REST/RPC (commands)
┌───────────────┴───────────────────────────────▼──────────────┐
│                      ORCHESTRATOR (server)                     │
│   Graph engine · run scheduler · Claude Agent SDK · staleness  │
│   per-node agent runner · approval gates · learning scheduler  │
└──────┬───────────────────┬───────────────────┬───────────────┘
       │ MCP client         │ MCP client        │ MCP client
┌──────▼──────┐      ┌──────▼───────┐    ┌──────▼─────────┐
│ Higgsfield  │      │  Platform    │    │  Research /    │
│ MCP (media) │      │  Publisher   │    │  Analytics MCP │
│ Soul/Seedance│     │  MCPs        │    │  (search,trends│
│ Kling/Veo   │      │ (LI,X,YT...) │    │   ,perf data)  │
└─────────────┘      └──────────────┘    └────────────────┘
       │                     │                    │
┌──────▼─────────────────────▼────────────────────▼──────────────┐
│                        STORAGE                                  │
│  Graph/run state (SQLite local → Postgres hosted)               │
│  Media assets (local FS → S3/R2)  ·  Performance memory (vector)│
└─────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Canvas (frontend)
- **Stack:** Next.js (React) + **React Flow** for the node graph (purpose-built for exactly this: nodes, edges, handles, pan/zoom). tldraw-style freeform layer optional later for sketching.
- **Live updates:** subscribes to the orchestrator over **SSE/WebSocket**; each node has a state machine (`idle → queued → running → streaming → done → stale/error`) rendered as visual states.
- **Inspector & versions:** non-destructive — every regenerate creates a new version object; UI shows a version stack per node.
- **Why React Flow:** mature, open-source, handles big graphs, custom node renderers (a Reel node renders a video player; a Script node renders editable text). Community can ship custom node renderers.

### 2. Orchestrator (server)
The brain. Responsibilities:
- **Graph engine** — stores the DAG, resolves dependencies, computes execution order, propagates **staleness** when an upstream node changes (spreadsheet-style recalc).
- **Per-node agent runner** — each node type maps to an agent task or a direct MCP tool call. Runs on the **Claude Agent SDK** (TypeScript) so nodes can themselves be small agents (e.g., the Research node is a multi-step agent; the Reel node is mostly a single MCP call).
- **MCP client layer** — connects to all configured MCP servers, forwards bearer tokens (e.g., Higgsfield OAuth), exposes their tools to nodes.
- **Approval gates** — pause runs, emit a "needs approval" event to the canvas, resume on response.
- **Learning scheduler** — schedules the Learn node to wake N days post-publish, pull analytics, and write memory. (Same idea as a cron/scheduled wake-up.)
- **Cost/credit metering** — tracks Higgsfield credits + model token spend per run; enforces budget ceilings (the Creator plan's $100 instinct, generalized).

### 3. MCP Tool Layer
Clark Pro **is an MCP orchestrator**. It ships zero generators of its own. Categories:
- **Media:** Higgsfield MCP (Soul 2.0, Seedance 2.0, Kling 3.0, Veo 3.1, Flux 2). See [mcp-ecosystem.md](mcp-ecosystem.md).
- **Publishing:** per-platform publisher MCPs (API where it exists; browser-assist MCP like Playwright where it doesn't).
- **Research:** web search, trends, competitor scan.
- **Analytics:** platform insight pulls for the learning loop.

### 4. Storage
- **Graph/run state:** SQLite for local/self-host → Postgres for hosted multi-user.
- **Assets:** local filesystem (`output/`) for local → S3/R2 for hosted. Mirrors the Creator plan repo layout.
- **Performance memory:** a vector + structured store keyed by creator, capturing (idea → angle → hook → format → result). This is what the Learn node writes and the Research/Angles nodes read.

---

## The Plugin Model: "A Node = MCP Tool + Manifest"

The open-source flywheel. To add a capability to Clark Pro you don't fork core — you publish:

1. **An MCP server** exposing the tool (e.g., a new video model, a new platform publisher, a new research source).
2. **A node manifest** (JSON/YAML) describing:
   - `inputs` — typed ports (text, image, video, post-object, brand-voice...)
   - `outputs` — typed ports
   - `tool` — which MCP tool to call + param mapping
   - `render` — how the node draws itself (text editor, image preview, video player, form)
   - `config` — user-editable settings (model, aspect, duration, style preset)

The orchestrator reads the manifest, wires the ports, and the canvas renders the node. **No core changes.** A community "Pika video node" or "Bluesky publish node" is just a manifest + an MCP endpoint.

```yaml
# example: reel.node.yaml
name: Reel (Seedance)
category: media
inputs:
  - { name: script, type: text }
  - { name: avatar, type: image }
outputs:
  - { name: video, type: video }
tool:
  server: higgsfield
  call: generate_video
  params: { model: seedance-2, aspect_ratio: "9:16", duration: 8 }
render: video-player
config:
  - { name: style, type: select, options: [ugc, cinematic, hyper-motion] }
```

This makes the Creator plan's five Higgsfield skills the **first five built-in node manifests**.

---

## Agent Design

- **Clark** is the orchestrating persona, but under the hood it's **many small agents**, one per node type, each with a tight system prompt and the minimum tools it needs. This keeps each step debuggable and cheap.
- **Brand voice as shared context:** the Brand Voice node injects [positioning.md](../positioning.md) into every generation agent's context. (Could integrate the existing `brand-voice` skills.)
- **Determinism where possible:** simple nodes (a single MCP call) skip the agent and call the tool directly — faster, cheaper, predictable. Agents are reserved for nodes that genuinely need multi-step reasoning (Research, Angles, Learn).
- **Replanning:** if you edit a node mid-run, the orchestrator diffs the graph and re-runs only what's stale.

---

## Open-Source Structure

- **Monorepo** (pnpm/turbo):
  - `apps/canvas` — Next.js frontend
  - `apps/orchestrator` — server + graph engine + Agent SDK
  - `packages/nodes` — built-in node manifests (the Higgsfield five + publishers)
  - `packages/mcp-client` — shared MCP connection layer
  - `packages/sdk` — types for third-party node authors
- **License:** lean **AGPL** (protects the hosted-version business while staying open) — or MIT if maximizing adoption matters more. Decision deferred; flagged in [roadmap.md](roadmap.md).
- **Self-host first:** `docker compose up` runs the whole thing locally with SQLite + local files. Bring-your-own MCP keys (Higgsfield, platform tokens).
- **Hosted later:** managed multi-tenant version is the business model (see roadmap). Same core, Postgres + object storage + auth.

---

## Security & Trust

- **Tokens stay local in self-host;** never proxied through a third party.
- **Publishing respects platform ToS** — assisted/manual where APIs forbid automation; no mass auto-posting.
- **Approval gate is mandatory by default** — full-auto is opt-in per graph.
- **Human-visible cost meter** — no surprise credit burn; budget ceilings halt runs (generalizing the $100 cap).

---

## Why This Architecture Fits the Plan We Already Have

- The **Higgsfield MCP** decision from [avatar-pipeline.md](../avatar-pipeline.md) becomes the media node layer — unchanged, just wrapped.
- The **five skills** in [higgsfield-skills.md](../higgsfield-skills.md) become the first node manifests.
- **`CLAUDE.md` defaults** become per-graph config + the Brand Voice node.
- **`SESSION-RESUME.md` batch recovery** becomes the orchestrator's run-state persistence (resume a failed run = built-in).
- **The weekly review ritual** becomes the Learn node + performance memory.

Nothing is thrown away. Clark Pro is the personal pipeline, lifted into a visual, multi-tenant, extensible product.
