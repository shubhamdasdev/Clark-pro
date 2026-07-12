# Clark Pro — Architecture & Tech Stack (Full Detail)

**Status:** Draft v1 · July 2026
This is the buildable expansion of [architecture.md](../architecture.md): concrete stack choices, data model, API/event contracts, the node manifest schema, agent runtime design, and repo layout. Where the high-level doc said "SQLite → Postgres," this doc says which library, which tables, and which endpoints.

---

## 1. Stack Summary (the whole thing on one screen)

| Layer | Choice | Why |
|---|---|---|
| Language | **TypeScript everywhere** (strict) | One language across canvas/orchestrator/SDK; the Agent SDK is TS-native. |
| Frontend | **Next.js 15 (App Router) + React 19** | Standard, self-hostable, no SSR complexity needed beyond the shell. |
| Node graph UI | **React Flow (xyflow)** | Purpose-built: typed handles, custom node renderers, pan/zoom, large-graph perf. (Decision D2.) |
| Client state | **Zustand** + React Query | Zustand for canvas/UI state (React Flow pairs with it natively); React Query for server data. |
| Styling | **Tailwind CSS + shadcn/ui** | Fast, consistent, themeable; no design-system yak-shaving. |
| Server | **Node.js 22 + Fastify** | Light, fast, first-class WebSocket/SSE support; no framework lock-in. |
| Agent runtime | **Claude Agent SDK (TypeScript)** | Per-node agents with tight prompts + minimal tools; MCP client built in. |
| MCP connectivity | **`@modelcontextprotocol/sdk`** via a shared `packages/mcp-client` | One connection pool, token forwarding, health checks for all servers. |
| Database | **SQLite via Drizzle ORM** (`better-sqlite3`) | Local-first; Drizzle gives a typed schema that ports to Postgres for hosted with minimal churn. |
| Vector memory | **sqlite-vec** extension | Performance-memory similarity recall without running a second datastore. |
| Job scheduling | **In-process queue (p-queue) + a `scheduled_wakes` table** | No Redis in self-host. Learn-node wakes are DB rows polled on boot + interval — survives restarts. |
| Media storage | **Local filesystem `output/`** (content-addressed: `sha256[0:12]/asset.mp4`) | Mirrors the Creator plan repo layout; hosted swaps in S3/R2 behind the same interface. |
| Live updates | **WebSocket (primary) with SSE fallback** | Node state + token streams are bidirectional-adjacent (interrupts go up). |
| Packaging | **pnpm workspaces + Turborepo** | The monorepo from architecture.md. |
| Distribution | **docker compose** (one service + volume) & `pnpm dev` | Self-host in one command. (Decision from vision assumption 6.) |
| License | **AGPL-3.0** | Decision D1 — protects hosted business, keeps core open; manifests/MCP servers are external and unconstrained. |

**Explicitly not in the stack (v1):** Redis, Postgres, Kubernetes, tRPC/GraphQL (plain REST + WS is enough for a local app), Electron (browser UI on localhost is fine), any Python.

---

## 2. Repo Layout

```
clark-pro/
├── apps/
│   ├── canvas/                 # Next.js frontend
│   │   ├── app/                # routes: /, /graph/[id], /library, /settings, /review/[runId]
│   │   ├── components/nodes/   # React Flow renderers, one per manifest render type
│   │   └── stores/             # Zustand: canvas, run, budget
│   └── orchestrator/           # Fastify server
│       ├── src/graph/          # DAG engine: topo-sort, staleness, diff/replan
│       ├── src/runner/         # node executors: agent-backed & direct-MCP
│       ├── src/agents/         # per-node-type prompts + tool allowlists
│       ├── src/mcp/            # server registry, auth, health
│       ├── src/scheduler/      # scheduled_wakes poller (Learn node)
│       ├── src/budget/         # metering + ceiling enforcement
│       └── src/api/            # REST + WS handlers
├── packages/
│   ├── nodes/                  # built-in manifests: the Higgsfield five + adapters + publishers
│   ├── mcp-client/             # shared MCP pool
│   ├── sdk/                    # types + validation CLI for third-party node authors
│   └── shared/                 # zod schemas shared FE/BE (single source of truth)
├── output/                     # media assets (gitignored)
├── clark.config.yaml           # MCP servers, tokens (env-ref), budget
└── docker-compose.yml
```

---

## 3. Data Model (Drizzle/SQLite)

```
graphs        id, name, template_id?, autonomy_level, created_at, archived
nodes         id, graph_id, manifest_ref, position(x,y), config_json, canonical_version_id
edges         id, graph_id, from_node/port, to_node/port          -- typed at insert against manifests
node_versions id, node_id, seq, inputs_hash, output_json, media_refs[], created_by(agent|human), created_at
runs          id, graph_id, mode(full|to_approval|single_node), status, cost_credits, cost_tokens, started/ended_at
run_steps     id, run_id, node_id, version_id, state, error_text?, started/ended_at   -- resume = replay incomplete steps
approvals     id, run_id, post_version_id, state(pending|approved|changes|rejected), note, decided_at
posts         id, node_id, platform, post_object_json, publish_state(staged|scheduled|published|published_unverified|dead), live_url?, external_id?, publish_at
scheduled_wakes id, kind(learn|retry|nag), payload_json, wake_at, completed   -- polled queue
perf_memory   id, post_id, platform, metrics_json, attribution_json(idea/angle/hook/format), embedding BLOB(sqlite-vec), recorded_at
mcp_servers   id, name, url, auth_kind, enabled, last_health
budget_ledger id, run_id?, node_id?, kind(credits|usd_tokens), amount, recorded_at    -- ceilings enforced by SUM per window
```

Key invariants:
- **Versions are append-only.** `canonical_version_id` points at the active one; regenerate = new row.
- **Staleness is computed, not stored:** a node is stale iff its canonical version's `inputs_hash` ≠ hash of upstream canonical outputs. Cheap to evaluate, impossible to desync.
- **Resume is free:** `runs` + `run_steps` replay incomplete steps on boot — this is the productized `SESSION-RESUME.md`.
- **Money is a ledger, not a counter** — auditable, and ceiling checks are one SUM.

---

## 4. API & Event Contracts

### REST (orchestrator, `/api/v1`)

```
POST   /graphs                      create (blank | from template)
GET    /graphs/:id                  full graph + canonical versions
PATCH  /graphs/:id                  autonomy, name
POST   /graphs/:id/nodes            add node (manifest_ref, position, config)
PATCH  /nodes/:id                   config/position; input edits → new version + staleness recompute
POST   /nodes/:id/regenerate        re-run just this node
POST   /graphs/:id/runs             start run {mode}
POST   /runs/:id/stop               stop run (or {nodeId} for one node)
POST   /runs/:id/resume             re-run stale/incomplete only
GET    /runs/:id/review             approval payload: per-platform previews
POST   /approvals/:id               {state, note}
POST   /posts/:id/published         manual URL paste-back
POST   /posts/:id/metrics           manual analytics entry (Learn)
GET    /library/week                Sunday-review view
GET/POST /settings/mcp-servers      registry + health
GET    /budget                      spend vs ceilings
```

### WebSocket events (server → canvas)

```
node.state    {nodeId, runId, state, error?}          # the state machine
node.stream   {nodeId, versionId, chunk}              # token/asset-progress streaming
node.version  {nodeId, versionId, summary}            # new version created
graph.stale   {nodeIds[]}                             # staleness wave after an edit
run.status    {runId, status, costSoFar}
approval.wait {runId, approvalIds[]}                  # gate reached → UI pulses
budget.alert  {level: warn80|halt100, window}
```

Client → server over WS: `node.interrupt`, `run.pause` — everything else is REST.

---

## 5. Node Manifest Schema (the plugin contract)

Zod-validated (`packages/sdk`); YAML on disk. This is the **entire** third-party surface — decision: *a node = MCP tool + manifest, nothing else.*

```yaml
name: Reel (Seedance)
id: higgsfield.reel.seedance          # namespaced, unique
version: 1.0.0
category: media                        # media|copy|research|adapter|publisher|gate|utility
runner: direct                         # direct = single MCP call; agent = multi-step (needs `agent:` block)
inputs:
  - { name: script, type: text, required: true }
  - { name: avatar, type: image, required: false }
outputs:
  - { name: video, type: video }
tool:
  server: higgsfield                   # key in clark.config.yaml
  call: generate_video
  params: { model: seedance-2, aspect_ratio: "9:16", duration: 8 }
  paramMap: { prompt: $inputs.script, image_ref: $inputs.avatar }
render: video-player                   # text-editor|image-preview|video-player|card-list|form|gate
config:
  - { name: style, type: select, options: [ugc, cinematic, hyper-motion], default: ugc }
budgetClass: media-heavy               # drives metering + ceiling category
retries: { count: 2, backoff: exponential }
fallback: higgsfield.reel.lipsync-studio   # optional: offered on terminal failure
```

Agent-backed nodes (`runner: agent`) add:

```yaml
agent:
  prompt: ./prompts/research.md        # tight, single-purpose system prompt
  tools: [websearch.search, trends.lookup, memory.query]   # allowlist — nothing else
  maxSteps: 12
```

**Port types (v1):** `text`, `image`, `video`, `image[]`, `post-object`, `intent`, `research-brief`, `angle`, `brand-voice`, `memory-context`. Edges type-check at connect time; the palette greys out incompatible ports while dragging.

---

## 6. Orchestrator Internals

### Graph engine
1. **Execution order:** topological sort of the canonical graph; independent branches run concurrently (p-queue, default concurrency 4 — media renders are remote-async anyway).
2. **Staleness:** on any canonical-version change, walk downstream and emit `graph.stale`. Resume runs exactly the stale/incomplete set.
3. **Mid-run edit (replan):** pause affected branch → diff `inputs_hash` → invalidate downstream `run_steps` → continue. The unaffected branch never notices.

### Node runners
- **`direct` runner:** resolve `paramMap` → one MCP call → persist output → stream progress. No LLM tokens. Used by all Higgsfield media nodes — deterministic and cheap, per the agent-design principle in [architecture.md](../architecture.md).
- **`agent` runner:** Claude Agent SDK session with manifest prompt + tool allowlist; every step streams as `node.stream`; hard `maxSteps` cap; token cost metered to the ledger per node.
- **Long async media jobs:** MCP call returns a generation ID → job recorded on the version → poller checks status; app restarts re-attach by ID (no lost renders, no double-billing).

### Approval gates & scheduler
- Gate node = `runner: gate`: flips run to `waiting_approval`, emits `approval.wait`, resumes on decision. Nothing downstream can execute while pending — enforced by the engine, not UI.
- `scheduled_wakes` poller (30s interval): Learn wakes, publish-time triggers, `published_unverified` nags. Boot-time catch-up runs anything missed while the app was closed — matches how the creator actually uses a laptop.

### Budget enforcement (trust feature, not accounting)
- Every runner writes to `budget_ledger` *before* firing paid calls (reserve) and reconciles after.
- Ceiling check on reserve: would this exceed the window ceiling? → node enters `blocked-budget`, run halts, `budget.alert` fires. **No paid call is ever fired past the ceiling.** Raising it is an explicit, logged user action.

---

## 7. Agent Design Details

| Node | Runner | Model tier | Context injected |
|---|---|---|---|
| Brain Dump classify | agent (1–2 steps) | small/fast | buckets, platform list |
| Research | agent (≤12 steps) | mid | intent, memory top-K, search/trends tools |
| Angles | agent (≤4 steps) | mid | brief, memory stats, platform fits |
| Script (per platform) | agent (≤3 steps) | **top** | angle, pinned claims, brand voice, platform rules — quality lives here |
| Media (all) | direct | — | — |
| Platform Adapter | direct + template | small | post rules table |
| Learn attribution | agent (≤6 steps) | mid | metrics, graph lineage |

Principles: **one node = one small agent** with the minimum tools (debuggable, cheap); **brand voice is context, not a prompt suffix** — injected as a structured block so Script agents can cite rules; **model tiers are per-node config**, so the cost/quality dial is a manifest edit, not a code change.

## 8. Performance Memory Design

Write path (Learn): metrics + lineage → structured row (`attribution_json`: idea topic, angle type, hook text, format, platform) + an embedding of `hook + angle + topic` (sqlite-vec).
Read path (Research/Angles): (a) **stat aggregates** — "explainer vs hot-take retention by platform" from plain SQL; (b) **similarity recall** — top-K nearest past posts to the current intent, injected as `memory-context`.
Cold start: nodes show "no memory yet"; the system degrades to research-only ranking rather than fabricating history. Memory is **per-creator and local** — it never leaves the machine in self-host; this is a stated privacy promise, not an implementation detail.

## 9. Security & Trust (implementation level)

- Tokens live in `clark.config.yaml` as env-var references (`${HIGGSFIELD_TOKEN}`), never in the DB; self-host never proxies them through third parties.
- Assisted-publish browser sessions run locally (Playwright MCP on the creator's machine); Clark never stores platform passwords.
- Approval gate default-on per graph; full-auto is per-graph opt-in stored explicitly (`autonomy_level=3`), never a global default.
- The orchestrator binds to localhost by default; exposing it (LAN/tunnel) requires an explicit flag + auth token — small guard, big footgun avoided.

## 10. Hosted-Version Deltas (Phase 5, recorded so v1 choices don't foreclose it)

SQLite→Postgres via Drizzle dialect swap · `output/` → S3/R2 behind the existing storage interface · in-process queue → BullMQ/Redis · per-tenant row scoping (`creator_id` is already on every table from day 1 — cheap now, painful later) · auth (better-auth) + managed MCP keys/credit reselling.

## 11. Build Order Note (matches [03-epics-and-stories.md](03-epics-and-stories.md))

The spike (E0) intentionally bypasses layers 2–5: one script calling Agent SDK + Higgsfield MCP directly. Its code is throwaway; its *learnings* (MCP quirks, render latency, real cost per reel) parameterize everything above — especially p-queue concurrency, retry budgets, and the default budget ceiling.
