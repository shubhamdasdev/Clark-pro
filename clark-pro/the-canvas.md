# Clark Pro — The Canvas

The canvas is the product. Everything else is plumbing. This doc defines the node system: the building blocks, how they connect, and how the agent ("Clark") walks the graph while you watch.

---

## Mental Model

A **content idea is a graph.** It starts as one node (the brain dump) and grows downstream into research, angles, scripts, media, platform posts, approval, publish, and learning. The creator and the agent both manipulate this graph directly.

```
  BRAIN DUMP
      │
      ▼
  RESEARCH ───────► ANGLES ──┬─► SCRIPT (TikTok) ─► REEL ──────► POST (TikTok) ──┐
                             │                                                    │
                             ├─► SCRIPT (LinkedIn) ─► CAROUSEL ─► POST (LinkedIn)─┤
                             │                                                    ▼
                             └─► SCRIPT (Substack) ─► (long-form) ─► POST (Sub.) APPROVAL ─► PUBLISH ─► LEARN
                                                                                              │           │
                                                                                              └───────────┘
                                                                                          (loop feeds new ideas)
```

Each box is a **node**. Each arrow is a **connection** that carries data + context. The agent travels the graph; you can grab any node and redirect it.

---

## Core Principles

1. **Every step is a visible node.** No hidden chain-of-thought-only steps. If the agent did it, there's a node for it.
2. **Connections carry context.** A SCRIPT node downstream of an ANGLE node *inherits* the angle, the research, the brand voice — automatically.
3. **Non-destructive & forkable.** Regenerate a node and the old version is kept as a sibling. Branch any node to explore alternatives.
4. **Staleness propagates.** Edit an upstream node and everything downstream is marked stale (dimmed) with a "regenerate" affordance — like a spreadsheet recalc.
5. **Human gates are nodes too.** Approval isn't a modal popup; it's a node in the flow you can see waiting.

---

## Node Types

### 1. Brain Dump (input)
- **In:** raw text, voice memo, link, screenshot, or a half-formed thought.
- **Does:** Clark parses intent, detects which buckets/pillars it maps to (Ambition/AI, Lifestyle, Dating — or the long-form pillars), and proposes a direction.
- **Out:** a structured "intent" that seeds the graph.
- *Example input:* "something about how everyone's using RAG wrong and I'm tired of it"

### 2. Research
- **In:** the intent.
- **Does:** runs a research agent (web search MCP, trend lookup, your own past-performance memory) to gather supporting facts, current takes, what's already saturated, and a contrarian angle.
- **Out:** a research brief (claims + sources + "saturation/opportunity" read).
- **MCP:** web search, trends, optionally your analytics memory.

### 3. Angles
- **In:** research brief + intent.
- **Does:** generates 3–6 distinct content angles, each with a predicted strength and target platform fit. You pick one or more (each pick forks a branch).
- **Out:** one selected angle per branch.
- *Example angles:* "RAG is dead, here's what's next" (hot take) / "I audited my own RAG pipeline" (build-in-public) / "RAG vs agents, decided" (explainer).

### 4. Script (platform-aware)
- **In:** chosen angle + brand voice + platform target.
- **Does:** writes the script/copy tuned to the platform's format and your voice rules (from [positioning.md](../positioning.md)). One Script node per platform — the same angle becomes a 8-sec TikTok hook, a 250-word LinkedIn post, and a 600-word Substack section.
- **Out:** platform-ready script + hook + caption.
- **This is the old `/gen-hook` skill, now a node.**

### 5. Media — Image / Reel / Carousel / B-roll
- **In:** script + your trained avatar (Soul 2.0) + style preset.
- **Does:** calls **Higgsfield MCP** to generate the asset in place. The node shows the render live, async, with the generation ID. Regenerate, pick a take, or branch styles.
  - **Image node** → Soul 2.0 / Flux 2
  - **Reel node** → Seedance 2.0 (native lip-sync + audio) or Lipsync Studio
  - **Carousel node** → multi-slide image set
  - **B-roll node** → Kling 3.0 / Veo 3.1
- **Out:** media file(s) + metadata.
- **These are the old `/gen-reel`, `/gen-carousel`, `/gen-broll` skills, now nodes.**

### 6. Platform Adapter / Post
- **In:** script + media.
- **Does:** assembles the final platform-native post — aspect ratio, caption length, hashtag rules, link placement, thumbnail, first-comment, alt text. Knows each platform's quirks (TikTok ≠ Reels ≠ Shorts even if the video is the same).
- **Out:** a ready-to-publish post object per platform.
- **Platforms:** LinkedIn, X, Instagram, TikTok, Substack, Medium, YouTube Shorts (+ extensible).

### 7. Approval (human-in-the-loop gate)
- **In:** one or more finished posts.
- **Does:** pauses the flow. Shows a clean review surface — preview exactly as it'll appear on each platform. You approve, request changes (Clark regenerates just that node), or reject.
- **Out:** approved posts move forward; the gate state is visible on the canvas.

### 8. Publish
- **In:** approved posts.
- **Does:** publishes via the platform's MCP/API where available (LinkedIn, X, YouTube), or stages for **assisted publish** (browser hand-off / export + one-click) where no API exists (TikTok personal, Substack, IG personal). Honors scheduling.
- **Out:** live post URLs + post IDs.
- **Matches the Creator plan's "manual posting is a 1-min non-blocker" stance** — Clark Pro makes that minute one click.

### 9. Learn (performance loop)
- **In:** published post IDs.
- **Does:** after a set delay, pulls analytics (views, retention, engagement) via platform analytics MCPs or manual entry, attributes them back to the **idea → angle → hook → format**, and writes to per-creator **performance memory**.
- **Out:** updated memory that biases future Research and Angles nodes. *This closes the loop and is the moat.*

---

## Utility / Glue Nodes

- **Brand Voice node** — injects [positioning.md](../positioning.md) rules into any downstream generation (global context node).
- **Memory node** — surfaces "what worked before" relevant to the current idea.
- **Note / Comment node** — human annotations on the canvas (for teams).
- **Branch / Compare node** — A/B two versions of any node side by side, promote the winner.
- **Schedule node** — sets publish time per platform (TikTok 7–9pm CT, etc., pulled from [cadence.md](../cadence.md)).

---

## How the Agent ("Clark") Walks the Graph

1. You drop a **Brain Dump** and hit **Run** (or "Run to Approval").
2. Clark executes nodes in dependency order. The **active node glows**; output **streams into it live** (text types out, images resolve, video renders with a progress ring).
3. At fork points (Angles), Clark either **auto-picks** (autonomy slider high) or **pauses for you to choose** (autonomy slider low).
4. The flow **stops at the Approval gate** and waits. You review, nudge, approve.
5. **Publish** fires; **Learn** is scheduled for N days later and wakes itself.
6. You can **interrupt any running node**, edit its input, and Clark replans downstream.

### Autonomy Slider
A single control from **"Watch me approve everything"** → **"Wake me at the approval gate"** → **"Full auto, just publish."** Early on you keep it low (trust); as the pipeline proves out you raise it. Mirrors the Creator plan's Day-1→Day-60 trust ramp.

---

## Templates (pre-wired graphs)

Ship the Creator plan's workflows as **starter templates** — a new user picks one instead of wiring from scratch:

- **"Short-form triple"** — one idea → TikTok reel + IG reel + carousel (the Higgsfield pipeline).
- **"Long-form atomic"** — one idea → newsletter + 3 LinkedIn posts + 1 Medium piece (the [longform-content.md](../longform-content.md) atomic system).
- **"Full week"** — orchestrates a whole week across both, following the [cadence.md](../cadence.md) rotation.
- **"Build-in-public"** — Cortex update → reel + LinkedIn + newsletter mention.

A template is just a saved graph with empty input nodes. This is how the personal plan literally becomes product features.

---

## What the User Sees (the surface)

- **Canvas** (center): the node graph, pannable/zoomable, nodes streaming live.
- **Inspector** (right): selected node's inputs, outputs, versions, regenerate controls.
- **Run bar** (top): Run / Run-to-Approval / autonomy slider / cost + credit meter.
- **Library** (left): templates, brand voice, avatar/Soul, saved assets, past graphs.
- **Timeline / Calendar** (bottom, optional): scheduled + published posts across platforms.

The feeling: **a video editor's NLE layout**, repurposed for the whole content workflow.
