# Clark Pro — Roadmap

Built in phases that each ship something usable, and each phase is **dogfooded by the personal [Creator plan](../README.md)**. You are user zero; your 100K journey is the test suite and the launch story.

---

## Guiding Rule

> Every phase must make *your own* weekly content faster before it's offered to anyone else. If it doesn't help you ship the Creator plan, it doesn't ship.

---

## Phase 0 — Spike (1 weekend)

**Goal:** prove the core loop end-to-end, ugly.

- Hardcode one graph: Brain Dump → Script → Reel (Higgsfield MCP) → manual export.
- No fancy canvas yet — even a list UI. Just prove: idea in → reel out, through the orchestrator + MCP.
- **Dogfood:** generate one real reel for your account this way.
- **Exit:** one reel produced through code, not the chat skills.

## Phase 1 — MVP Canvas (2–4 weeks)

**Goal:** the visual canvas for a single idea, single-to-few platforms, manual publish.

- React Flow canvas with live node states (idle/running/streaming/done/stale).
- Node types: Brain Dump, Research, Angles, Script, Reel, Carousel, B-roll, Platform Adapter, Approval.
- Higgsfield nodes wired (the five skills → five node manifests).
- Publish = **export/staged** (manual 1-min upload — matches the plan).
- Local-first: SQLite + local `output/`. `docker compose up`.
- Brand Voice node loads [positioning.md](../positioning.md).
- **Dogfood:** run your actual short-form "triple" template (TikTok + IG + carousel) for a full week from the canvas.
- **Exit:** you produce a week of content faster on the canvas than via slash commands.

## Phase 2 — Connected + Learning (4–6 weeks)

**Goal:** the graph becomes *connected* and *learning*.

- Staleness propagation (edit upstream → downstream dims → regenerate).
- Versions/forks per node; Branch/Compare node for A/B.
- **Learn node + performance memory** — manual analytics entry first, then API pulls.
- Research/Angles read performance memory (the loop closes).
- Templates: short-form triple, long-form atomic, full-week.
- Autonomy slider.
- **Dogfood:** the weekly review ritual ([avatar-pipeline.md](../avatar-pipeline.md)) now runs *inside* Clark Pro.
- **Exit:** the canvas tells you what worked last week and seeds this week.

## Phase 3 — Multi-Platform Publish (4–6 weeks)

**Goal:** real publishing where APIs allow, assisted everywhere else.

- Publisher nodes: YouTube + LinkedIn + X via API; TikTok/IG/Substack/Medium via assisted (browser MCP) or staged export.
- Schedule node + calendar/timeline view (uses [cadence.md](../cadence.md) times).
- Cost/credit meter + budget ceilings.
- **Dogfood:** an entire week auto-publishes (or one-click-publishes) across all your platforms.
- **Exit:** you run the full [cadence.md](../cadence.md) week from one canvas in one sitting.

## Phase 4 — Open-Source Launch (ongoing)

**Goal:** ship it publicly; ignite the node ecosystem.

- Clean the plugin SDK (`packages/sdk`) so third parties can author nodes (MCP + manifest).
- Docs, example nodes, `docker compose` quickstart.
- License decision: **AGPL** (protect hosted business) vs **MIT** (max adoption) — decide here.
- Public repo + a launch reel: *"I built an open-source AI studio to run my own creator pipeline — here's the canvas."* (This is itself Ambition/AI bucket content — the product launch *is* content.)
- **Dogfood → flywheel:** your audience (built via the Creator plan) becomes Clark Pro's first users. The two projects feed each other.

## Phase 5 — Hosted (business model, later)

**Goal:** non-technical creators without self-hosting.

- Multi-tenant: Postgres + object storage + auth.
- Managed MCP keys / credit reselling.
- Team features: roles, shared approval, multi-account.
- Pricing: free self-host forever; hosted = subscription + usage. Open-core.

---

## How the Two Projects Compound

| Creator plan gives Clark Pro | Clark Pro gives Creator plan |
|---|---|
| A real workflow to productize | Faster content production each phase |
| A first user with real needs (you) | The weekly review automated |
| Launch-story content + an audience | Multi-platform publishing from one place |
| Templates (triple, atomic, full-week) | A compounding performance-memory edge |
| Brand voice + positioning rules | The product *is* your build-in-public story |

**The build-in-public loop:** building Clark Pro generates Ambition/AI content for the Creator plan; the Creator plan's audience becomes Clark Pro's launch users; their usage improves Clark Pro; a better Clark Pro produces better content. Each turn of the loop strengthens both.

---

## Open Questions (decide before/early in build)

1. **License:** AGPL vs MIT. (Leaning AGPL to keep a hosted business viable.)
2. **Canvas lib:** React Flow (node-graph-native, recommended) vs tldraw (freeform) vs hybrid.
3. **Publishing depth at MVP:** staged-export only (safe, fast) vs. attempt LinkedIn/YouTube API early.
4. **Hosted timing:** how long to stay self-host-only before building multi-tenant.
5. **Scope discipline:** resist becoming generic n8n — stay social-content-opinionated.

---

## Immediate Next Step (when you say go)

Scaffold **Phase 0**: a single hardcoded Brain Dump → Script → Reel path that calls Higgsfield MCP through a tiny orchestrator and drops an `.mp4` in `output/reels/`. One weekend. Prove the loop, then grow the canvas around it.
