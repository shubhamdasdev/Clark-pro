# Clark Pro — Epics & Stories

**Status:** Draft v1 · July 2026
Epics map to the feature sections in [01-product-description.md](01-product-description.md) and the phases in [roadmap.md](../roadmap.md). Sizing: **S** ≤ 1 day · **M** 2–4 days · **L** ~1 week (solo builder + Claude Code as labor). Stories are written for the Tier-1 persona ("creator"); builder-facing stories say "node author."

**Sequencing rule:** epics are ordered so every phase exit test from the roadmap is reachable without pulling stories from a later epic.

---

## Phase 0 — Spike

### E0 — Headless Pipeline Spike `[F2, F4]` — *the riskiest-assumption killer*

**Goal:** prove idea → reel through code (orchestrator + Higgsfield MCP), no UI.
**Exit:** one real reel in `output/reels/`, posted to the real account.

| # | Story | AC (acceptance criteria) | Size |
|---|---|---|---|
| E0.1 | As a creator, I can run `pnpm spike "<idea>"` and get a script written in my brand voice. | Reads positioning.md; outputs hook + script + caption to `output/scripts/`; runs via Claude Agent SDK, not chat. | M |
| E0.2 | As a creator, the spike calls Higgsfield MCP and produces a lip-synced avatar reel from that script. | Seedance 2.0 via MCP; 9:16 mp4 lands in `output/reels/`; generation ID logged; survives one retry on transient failure. | M |
| E0.3 | As a creator, I can see what the run cost. | Credits consumed + wall time printed at end of run; aborts if projected cost exceeds a `--budget` flag. | S |
| E0.4 | As a creator, I post the resulting reel to my real TikTok/IG and log the result. | Posted manually; quality judgment written into the repo (`spike-notes.md`): usable / not / why. | S |

---

## Phase 1 — MVP Canvas

### E1 — Graph Engine & Run Orchestration `[F1]`

**Goal:** the DAG brain — storage, execution order, node state machine, live events.

| # | Story | AC | Size |
|---|---|---|---|
| E1.1 | As a creator, my graph persists locally and reloads exactly as I left it. | SQLite schema for graphs/nodes/edges/versions/runs; app restart loses nothing, including mid-run media job IDs. | M |
| E1.2 | As a creator, when I hit Run, nodes execute in dependency order and I see each one's state change live. | Topological execution; state machine `idle→queued→running→streaming→done/error` streamed over WebSocket/SSE; UI states rendered within 200ms of server event. | L |
| E1.3 | As a creator, I can stop any running node without losing upstream work. | Stop cancels the task (and Higgsfield job where the API allows); upstream results intact; node returns to editable state. | M |
| E1.4 | As a creator, a failed node shows me the real error and a retry affordance. | Raw MCP/agent error visible in inspector; single-click retry re-runs only that node. | S |
| E1.5 | As a creator, I can Run-to-Approval so the graph never publishes without me. | Run halts at Approval gate; state survives restart. | S |

### E2 — Canvas UI Shell `[F1]`

**Goal:** the NLE-style surface: React Flow canvas, inspector, run bar, library.

| # | Story | AC | Size |
|---|---|---|---|
| E2.1 | As a creator, I get the studio layout: canvas center, inspector right, run bar top, library left. | Next.js + React Flow; pan/zoom; selected node drives inspector; layout usable at 13" laptop width. | L |
| E2.2 | As a creator, each node type renders its own content (text editor, image preview, video player). | Custom React Flow node renderers per manifest `render` type; video plays in-node. | M |
| E2.3 | As a creator, streaming output appears inside the node as it generates. | Text streams token-wise; media shows progress ring + gen ID. | M |
| E2.4 | As a creator, I can add/connect/delete nodes with typed ports that reject invalid connections. | Port types (text, image, video, post-object, brand-voice) enforced at drag time with a visible reason. | M |

### E3 — Core Content Nodes `[F2, F3, F4-script]`

**Goal:** Brain Dump → Research → Angles → Script working on canvas.

| # | Story | AC | Size |
|---|---|---|---|
| E3.1 | As a creator, I brain-dump raw text/link and get an editable classification chip. | Intent object (bucket, platform fit, direction) rendered as chip; editable before flow continues; auto-confirm on high autonomy. | M |
| E3.2 | As a creator, the Research node produces a brief with claims + sources + saturation read. | Multi-step agent w/ web-search MCP; three collapsible blocks; pinnable claims that survive into downstream context; graceful "unresearched" mode without search MCP. | L |
| E3.3 | As a creator, the Angles node gives me 3–6 distinct angle cards and pauses for my pick (low autonomy). | Cards show title, one-liner, predicted strength + why, platform badges; each pick forks a branch; regenerate-with-note supported. | M |
| E3.4 | As a creator, Script nodes write platform-native copy in my voice, in parallel. | One node per platform; injected with angle + pinned claims + Brand Voice + platform rules; editable in-node; edit creates version + marks downstream stale. | M |
| E3.5 | As a creator, the Brand Voice node loads my positioning rules once and applies them everywhere. | Loads positioning.md (file or paste); visible as a global context node; warning chip on generations when absent. | S |

### E4 — Media Nodes: Higgsfield Integration `[F4-media]`

**Goal:** the five Creator-plan skills as the first five node manifests.

| # | Story | AC | Size |
|---|---|---|---|
| E4.1 | As a builder, node manifests (YAML) define ports, MCP tool mapping, render type, and config — and the engine loads them dynamically. | The manifest schema from [architecture.md](../architecture.md) implemented; manifests in `packages/nodes/` hot-load into the palette. | L |
| E4.2 | As a creator, the Reel node renders a lip-synced avatar video from a script. | Seedance 2.0 (Lipsync Studio fallback); take selector on multiple renders; regenerate appends versions. | M |
| E4.3 | As a creator, the Image and Carousel nodes produce on-brand visuals. | Soul 2.0/Flux 2 image; multi-slide carousel with per-slide preview + reorder. | M |
| E4.4 | As a creator, the B-roll node generates scene video from a text direction. | Kling 3.0 default, Veo 3.1 variant via config. | S |
| E4.5 | As a creator, media node failures degrade usefully. | 2 auto-retries → error state with raw error + model-fallback offer; ceiling hit → `blocked-budget`, never silent spend. | M |

### E5 — Platform Adapters, Approval & Staged Publish `[F5, F6-staged]`

**Goal:** finished posts, human gate, 60-second manual publish.

| # | Story | AC | Size |
|---|---|---|---|
| E5.1 | As a creator, Platform Adapter nodes assemble native post objects for my 7 platforms. | Aspect/caption/hashtag/first-comment/alt-text rules per platform (TikTok, IG Reels, LinkedIn, X, Substack, Medium, YT Shorts) encoded as adapter configs. | L |
| E5.2 | As a creator, the Approval gate shows me per-platform previews that look like the real thing. | Native-style preview per platform incl. caption fold behavior; approve / request-changes / reject per post; partial approval works. | L |
| E5.3 | As a creator, request-changes regenerates only the affected chain. | Change note routes to the right node; only that chain re-runs; post returns to gate; 2-strike guard suggests manual edit. | M |
| E5.4 | As a creator, an approved post becomes a staged package I can publish manually in ≤60s. | Staged card: file reveal + copy blocks (caption, hashtags, first comment) in platform order; paste-back field for live URL. | M |
| E5.5 | As a creator, I can set my known-good posting times per platform. | Schedule node with cadence.md defaults; staged cards sort by scheduled time. | S |

### E6 — Templates & Setup Wizard `[F8-basic, F0]`

**Goal:** zero-wiring start; the Creator plan's workflows shipped as product assets.

| # | Story | AC | Size |
|---|---|---|---|
| E6.1 | As a new creator, the setup wizard gets me from `docker compose up` to a ready canvas in one sitting. | Wizard enforces Higgsfield auth + budget + brand voice; everything else skippable; ends on focused template. | M |
| E6.2 | As a creator, I can instantiate the Short-form triple and Long-form atomic templates. | Pre-wired graphs with empty inputs; Full-week + Build-in-public templates stubbed. | M |
| E6.3 | As a creator, I can save any graph as a reusable template. | Inputs emptied, structure/config kept; appears in Library. | S |
| E6.4 | As a creator, a basic cost meter shows run + monthly spend against my ceiling. | Credits + token cost per run; 80% yellow banner; 100% halts (v1: halt only, detailed metering in E10). | M |

**⛳ Phase 1 exit test:** one full week of the creator's real cadence produced on the canvas, timed, and faster than the slash-command baseline. If not faster — stop and fix before Phase 2.

---

## Phase 2 — Connected + Learning

### E7 — Connected Graph: Staleness, Versions, Branch/Compare `[F1-full]`

| # | Story | AC | Size |
|---|---|---|---|
| E7.1 | As a creator, editing an upstream node dims everything downstream and offers one-click regenerate. | Staleness propagation with visual dimming; Resume re-runs only stale nodes; mid-run edits diff and re-plan. | L |
| E7.2 | As a creator, every node keeps a version stack I can flip through. | Cap 20 w/ LRU pruning of unreferenced media; restore any version → downstream stale. | M |
| E7.3 | As a creator, I can A/B two versions in a Branch/Compare node and promote the winner. | Side-by-side render; Promote sets canonical + marks loser's downstream stale. | M |

### E8 — Learning Loop & Performance Memory `[F7]`

| # | Story | AC | Size |
|---|---|---|---|
| E8.1 | As a creator, the Learn node wakes N days after publish and asks for (or pulls) results. | Scheduler survives restarts; manual-entry form ≤30s per post; per-platform attribution, never merged. | L |
| E8.2 | As a creator, results attribute back to idea → angle → hook → format and write memory. | Structured store keyed by those dimensions + embedding for similarity recall; human-readable summary on the node. | L |
| E8.3 | As a creator, Research and Angles visibly use my memory. | "Your history says" block cites actual memory entries; angle strength scores explain their memory basis. | M |
| E8.4 | As a creator, a Sunday-review surface lists the week's posts and metric gaps in one place. | Library "This week" view; empty-metric posts flagged; bulk entry. | M |
| E8.5 | As a creator, the autonomy slider controls where Clark pauses. | Three stops (approve everything / wake at gate / full auto opt-in); per-graph setting; full-auto requires explicit enable per graph. | M |

**⛳ Phase 2 exit test:** the canvas tells you what worked last week and seeds this week (memory-biased Angles live).

---

## Phase 3 — Multi-Platform Publish

### E9 — API & Assisted Publishers `[F6-full]`

| # | Story | AC | Size |
|---|---|---|---|
| E9.1 | As a creator, YouTube Shorts publishes via API from the canvas. | Upload + metadata + scheduled time; live URL captured; fall back to staged on failure. | M |
| E9.2 | As a creator, X and LinkedIn publish via API where my account allows. | Publisher MCPs w/ OAuth; graceful staged fallback; never blocks. | L |
| E9.3 | As a creator, assisted publish opens the platform with everything pre-filled and leaves the final click to me. | Playwright-style browser MCP; TikTok/Substack/Medium/IG-personal; UI-change degradation to staged card. | L |
| E9.4 | As a creator, unverified posts chase me exactly once. | `published-unverified` state, single nag at 48h, manual URL paste closes it. | S |

### E10 — Schedule, Calendar & Cost Metering v2 `[F8-full]`

| # | Story | AC | Size |
|---|---|---|---|
| E10.1 | As a creator, a calendar/timeline view shows scheduled + published posts across platforms. | Bottom-panel timeline; drag to reschedule; cadence.md defaults. | L |
| E10.2 | As a creator, cost metering breaks down spend by node type, run, and month. | Per-node attribution; export CSV; ceilings per category (media vs tokens). | M |

**⛳ Phase 3 exit test:** the full cadence week runs from one canvas in one sitting.

---

## Phase 4 — Open-Source Launch

### E11 — Plugin SDK & Community Nodes `[F8-SDK]`

| # | Story | AC | Size |
|---|---|---|---|
| E11.1 | As a node author, I can build a working node from `packages/sdk` docs + 3 examples without reading core code. | Typed manifest schema, example nodes (one media, one publisher, one research); validation CLI (`clark validate-node`). | L |
| E11.2 | As a node author, my node installs from a folder/URL without a core rebuild. | Manifest hot-load; sandboxed config; version pinning. | M |
| E11.3 | As a creator/maintainer, the repo is launch-ready. | AGPL-3.0 license; README quickstart ≤10 min to first canvas; docker compose one-liner; contribution guide. | M |
| E11.4 | As the creator, the launch reel about Clark Pro is made *in* Clark Pro. | Build-in-public template used; the run itself recorded as the launch story. | S |

---

## Backlog (captured, deliberately not scheduled)

- Teams: roles, shared approval queues, multi-account (Phase 5 / Tier 2)
- Hosted multi-tenant: Postgres, object storage, auth, billing (Phase 5)
- tldraw freeform sketch layer on the canvas
- Voice-memo brain dump transcription; screenshot-to-intent
- Template marketplace / community template sharing
- A/B auto-experiments (publish two hooks to the same platform, auto-learn)
- Per-creator fine-tuned scoring model for angle prediction (only after memory data exists)

## Traceability

| Feature section | Epics |
|---|---|
| F1 Canvas & engine | E1, E2, E7 |
| F2 Idea intake | E0, E3 |
| F3 Research & angles | E3 |
| F4 Script & media | E0, E3, E4 |
| F5 Assembly & approval | E5 |
| F6 Publishing | E5 (staged), E9 |
| F7 Learning loop | E8 |
| F8 Chrome/SDK | E6, E10, E11 |
