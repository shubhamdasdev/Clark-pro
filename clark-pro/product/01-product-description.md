# Clark Pro — Product Description (PRD)

**Status:** Draft v1 · July 2026
**Source docs:** [vision.md](../vision.md) · [the-canvas.md](../the-canvas.md) · [architecture.md](../architecture.md) · [mcp-ecosystem.md](../mcp-ecosystem.md) · [roadmap.md](../roadmap.md)
**Companion docs:** [02-user-flows.md](02-user-flows.md) · [03-epics-and-stories.md](03-epics-and-stories.md) · [04-architecture-and-tech-stack.md](04-architecture-and-tech-stack.md)

---

## 1. One-Sentence Definition

Clark Pro is an **open-source, MCP-native visual studio** where a creator turns one brain-dumped idea into researched, scripted, rendered, platform-formatted, approved, and published content across every channel — on a connected canvas where they watch the agents work, and where every published result feeds back to make the next idea smarter.

## 2. The Problem

AI made *generation* cheap but left the *workflow* broken. A solo creator producing 14 short-form pieces + 4 long-form pieces a week today:

1. **Bounces between 8–10 tools** (chat, image gen, video gen, caption writer, scheduler, analytics) losing context at every hop.
2. **Cannot see the whole pipeline** — work lives in chat scrollback and scattered files; there is no single surface showing idea → published.
3. **Repeats dead work** — changing the angle means manually redoing scripts, media, and captions with no dependency tracking.
4. **Never learns systematically** — what hook/format/angle actually performed lives in platform dashboards, disconnected from where the next idea is created.

The result: content volume is limited not by generation quality but by **orchestration overhead** — exactly the constraint the [Creator plan](../../README.md) hit and solved by hand.

## 3. Target Users

| Tier | Who | What they need | When we serve them |
|---|---|---|---|
| **1 — Solo operator-creator** (design partner: the Creator plan's author) | Builds in public, posts short-form + long-form across 5–7 platforms, ~1.5 hrs/day budget, no team | Volume without a team; visibility; trust ramp (approve everything → full auto); hard budget caps | MVP (Phases 0–2) |
| **2 — Small creator teams / agencies** | Ghostwriting shops, 2–10 person content teams | Approval workflows, multi-account, roles, shared templates | v1+ (Phase 5) |
| **3 — Builder community** | Devs who want to add models/platforms/research sources | Plugin SDK: a node = MCP server + manifest, no core fork | Phase 4 launch |

**Primary JTBD:** *"When I have a content idea, I want to turn it into published, on-brand, platform-native posts everywhere I have an audience — without babysitting ten tools — so I can hit my posting cadence in ≤90 min/day and grow my brand."*

Secondary emotional job: *feel like a studio operator, not a prompt typist.* Secondary social job: *the tool itself is my build-in-public story.*

## 4. Goals & Non-Goals

### Goals
1. **G1 — Collapse the workflow:** one idea → a full multi-platform content set from a single canvas, in one sitting.
2. **G2 — Make agent work visible and steerable:** every step is a node you can watch, interrupt, edit, fork, and regenerate.
3. **G3 — Close the learning loop:** published performance attributes back to idea/angle/hook/format and biases future generations (the moat).
4. **G4 — Stay extensible:** any new model/platform/research source drops in as MCP server + manifest, no core changes.
5. **G5 — Respect trust and money:** human approval gate on by default; hard budget ceilings; bring-your-own keys; local-first.

### Non-Goals (v1)
- No model training, fine-tuning, or inference hosting — we orchestrate MCP tools, never build generators.
- No generic workflow automation (not n8n) — opinionated for social content only.
- No mass auto-posting or ToS circumvention — assisted publishing where APIs don't exist.
- No multi-tenant/hosted/teams until Phase 5 — local-first, single user.
- No mobile app.

## 5. The Big Feature Sections

These eight sections structure the whole product. [02-user-flows.md](02-user-flows.md) has one flow set per section; [03-epics-and-stories.md](03-epics-and-stories.md) maps epics to them.

### F1 — Canvas & Graph Engine
The core surface: a pannable/zoomable node graph (video-editor NLE feel: canvas center, inspector right, run bar top, library left, timeline bottom). Nodes have a visible state machine (`idle → queued → running → streaming → done → stale → error`). Non-destructive versions per node; branch/fork any node; staleness propagates downstream spreadsheet-style when an upstream node changes.

### F2 — Idea Intake (Brain Dump)
The entry point: raw text, link, voice memo, or screenshot in; Clark classifies it against the creator's content buckets and emits a structured intent that seeds the graph. Zero-friction — messier input is a feature.

### F3 — Idea Intelligence (Research & Angles)
Research node: multi-step agent pulling web search, trends, and the creator's own performance memory into a brief (claims + sources + saturation/opportunity read). Angles node: 3–6 distinct angles with predicted strength and platform fit; each pick forks a branch. Autonomy slider decides auto-pick vs. ask.

### F4 — Content Generation (Script & Media)
Platform-aware Script nodes (same angle → 8-sec TikTok hook / 250-word LinkedIn post / 600-word newsletter section), all injected with the Brand Voice node ([positioning.md](../../positioning.md)). Media nodes call Higgsfield MCP and render live in place: Image (Soul 2.0/Flux 2), Reel (Seedance 2.0/Lipsync Studio), Carousel (Flux 2 multi-slide), B-roll (Kling 3.0/Veo 3.1). These are the Creator plan's five skills, productized as the first five node manifests.

### F5 — Platform Assembly & Approval
Platform Adapter nodes assemble native post objects (aspect, caption limits, hashtags, first comment, alt text, thumbnail) for LinkedIn, X, Instagram, TikTok, Substack, Medium, YouTube Shorts. The Approval node is a first-class gate: the run pauses, the creator reviews per-platform previews exactly as they'll appear, then approves / requests changes (regenerates just that node) / rejects.

### F6 — Publishing (API + Assisted)
API publish where platforms allow (YouTube, X, LinkedIn where approved, IG Business); **assisted publish** everywhere else — the post arrives fully assembled and staged for a 1-minute manual upload or a browser hand-off that pre-fills and leaves the final click to the human. Schedule node applies per-platform posting times from [cadence.md](../../cadence.md). Design rule: **publishing never blocks the pipeline.**

### F7 — Learning Loop & Performance Memory
The Learn node wakes N days post-publish, pulls analytics (API or manual entry), attributes results back to idea → angle → hook → format, and writes per-creator performance memory. Research and Angles nodes read this memory — the loop closes and compounds. This is the long-term moat.

### F8 — Platform Chrome: Templates, Library, Settings & Budget
Starter templates (pre-wired graphs): *Short-form triple*, *Long-form atomic*, *Full week*, *Build-in-public*. Library of past graphs, assets, brand voice, avatar. Settings: MCP server registry (`clark.config.yaml` or UI), bring-your-own tokens. Cost meter on the run bar; budget ceilings that **halt runs** (generalizing the Creator plan's $100 cap).

## 6. Success Metrics

| Metric | Target | Phase |
|---|---|---|
| **Activation:** brain dump → first staged post | ≤ 15 min, first session | MVP |
| **Core efficiency:** full "short-form triple" (reel + IG reel + carousel) human time | ≤ 20 min (vs ~45 via slash commands) | MVP exit |
| **Weekly dogfood:** full Creator-plan week run from the canvas | 1 sitting, ≤ 3 hrs human time | Phase 3 exit |
| **Reliability:** node-level run failures requiring manual restart | < 5% of runs | MVP+ |
| **Learning loop:** % published posts with performance attributed to memory | > 80% | Phase 2 exit |
| **Ecosystem:** third-party node manifests published | ≥ 5 within 90 days of OSS launch | Phase 4 |
| **Budget safety:** runs halted at ceiling with zero overage | 100% | MVP |

**North-star metric:** *published posts per human-hour* — the whole product exists to raise it.

## 7. Release Phases (summary — full detail in [roadmap.md](../roadmap.md))

| Phase | Scope | Feature sections | Exit test |
|---|---|---|---|
| **0 — Spike** (1 weekend) | Headless pipeline: Brain Dump → Script → Reel via Higgsfield MCP → `output/reels/*.mp4` | F2, F4 (thin) | One real reel produced through code |
| **1 — MVP Canvas** (2–4 wks) | Visual canvas, core nodes, staged publish, templates v0 | F1–F5, F6 (staged only), F8 (basic) | A week of content faster on canvas than via slash commands |
| **2 — Connected + Learning** (4–6 wks) | Staleness, versions, branch/compare, Learn node, memory | F1 (full), F7 | Canvas tells you what worked last week and seeds this week |
| **3 — Multi-Platform Publish** (4–6 wks) | API publishers, assisted browser publish, schedule + calendar, cost metering v2 | F6 (full), F8 (full) | Full cadence week runs from one canvas in one sitting |
| **4 — OSS Launch** | Plugin SDK, docs, launch content | F8 (SDK) | Public repo + launch reel; first external node |
| **5 — Hosted** | Multi-tenant, teams, billing | — | Business model live |

## 8. Key Decisions (resolved from roadmap open questions)

| # | Question | Decision | Rationale |
|---|---|---|---|
| D1 | License | **AGPL-3.0** | Protects the hosted business (Phase 5) while staying genuinely open; the node ecosystem lives in manifests + MCP servers, which third parties license however they want — AGPL only binds the core. |
| D2 | Canvas library | **React Flow** | Node-graph-native (ports, edges, custom renderers), mature, huge community — community node renderers are the Tier-3 growth path. tldraw freeform layer deferred. |
| D3 | Publishing depth at MVP | **Staged export only** | Matches the Creator plan's "1-minute manual post" stance; APIs are the highest-variance, lowest-learning part of MVP. API publishers land in Phase 3. |
| D4 | Hosted timing | **Not before OSS launch proves node ecosystem pull** | Self-host adoption and external nodes are the signal to invest in multi-tenant. |
| D5 | Scope discipline | **Social-content-opinionated, always** | Every node type must map to the idea→publish→learn loop; generic workflow features are rejected by default. |

## 9. Riskiest Assumptions (test order)

1. **A1 — The orchestrated pipeline produces *usable* content end-to-end** (not just demos). *Test: Phase 0 spike — one real reel posted to the real account.* Cheapest, first.
2. **A2 — The canvas is genuinely faster than slash commands** for a practiced operator. *Test: Phase 1 exit — timed week-for-week comparison.* If false, Clark Pro is a demo, not a tool.
3. **A3 — Performance memory measurably improves content choices.** *Test: Phase 2 — do memory-biased angles beat non-biased on retention over 4 weeks?*
4. **A4 — Assisted publish is acceptable UX** (creators tolerate the 1-minute final click). *Test: dogfood; watch for skipped posts.*
5. **A5 — Third parties will author nodes.** *Test: Phase 4 — SDK + 3 example nodes; count external manifests in 90 days.*

## 10. Out of Scope / Deferred

Teams & roles (Phase 5) · multi-account (Phase 5) · mobile · paid template marketplace · fine-tuned per-creator models · full-auto publishing as default (opt-in only, ever).
