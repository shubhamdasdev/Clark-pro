# Clark Pro — Vision

## The Problem

AI can write a script, make an image, generate a video, and draft a post. But today creators do this by **bouncing between ten chat tabs and ten tools**, copy-pasting between them, losing context at every hop. Nothing is connected, nothing is visible as a whole, and nothing learns from what actually performed.

The result: AI made *generation* cheap but left the *workflow* broken. The bottleneck moved from "can I make a video?" to "can I run the whole idea→published→learned loop without it eating my life?"

That loop is exactly what the [Creator plan](../README.md) designed by hand. Clark Pro productizes it.

## The Vision

> A creator opens Clark Pro, types one messy idea into a node, and watches it bloom across a canvas: research branches out, content angles fork, scripts write themselves per platform, images and videos render in place, posts assemble for LinkedIn / X / Instagram / TikTok / Substack / Medium / YouTube Shorts, an approval gate waits for a thumbs-up, and then it publishes — and a week later the performance flows back into the canvas and teaches the next idea.

It should feel less like *chatting with AI* and more like **operating a studio** — the way a video editor feels: visual, direct-manipulation, powerful, everything on one surface.

## The Three Feelings It Must Evoke

1. **"I can see the work."** The agent isn't a black box behind a chat bubble. It's a worker moving across a canvas, lighting up nodes, streaming output you can watch and interrupt.
2. **"Everything is connected."** Change one thing upstream and the canvas knows what downstream is now stale. The idea, the angle, the script, the video, the post — one connected graph, not ten disconnected files.
3. **"It gets better."** Every publish feeds a learning loop. The studio remembers which hooks held attention and biases tomorrow's ideas toward them.

## Who It's For

- **Tier 1 (design partner / first user): the solo operator-creator** — someone like the Creator plan's subject: builds in public, posts across short-form + long-form, wants volume without a team. This is who we build for first.
- **Tier 2: small creator teams & ghostwriting/agency shops** — where the approval gate, multi-account, and collaboration matter.
- **Tier 3: the open-source / builder community** — people who want to add their own nodes (a new model, a new platform, a new research tool) by plugging in an MCP server.

We build for Tier 1, design so Tier 2 is a natural extension, and structure the codebase so Tier 3 can extend it.

## Why "Video Editor for Social Workflows"

A video editor is the reference because of *how it feels*, not what it does:
- **A timeline / canvas you direct**, not a prompt you submit.
- **Clips (nodes) you rearrange, trim, branch, and regenerate** without starting over.
- **Real-time preview** — you see the result as you work.
- **Non-destructive** — every version is kept; you can fork any node.

Clark Pro applies that feel to the *entire content workflow*, not just the final cut.

## Positioning vs. Existing Tools

| Tool | What it nails | What it misses |
|---|---|---|
| **ChatGPT / Claude chat** | Generation quality | No canvas, no connection, no platform output, no learning |
| **ComfyUI** | Visual node graph for media gen | Media-only; not social workflow, no publishing, no agents-as-workers |
| **n8n / Make** | Integrations + automation | Wiring-heavy, not creative, no visual content preview, not agent-native |
| **Buffer / Hootsuite / Postiz** | Scheduling + multi-platform publish | No generation, no canvas, no agentic creation |
| **Cassidy / Flowith / agent canvases** | Agent visual workspace | Generic; not social-content-native, no media pipeline, no performance loop |

**Clark Pro's lane:** the *only* tool that is visual + connected + agent-driven + media-native + multi-platform-publishing + performance-learning, **and** open-source + MCP-native.

## Open-Source, MCP-Native — On Purpose

- **Open-source** because the moat isn't the generators (those commoditize) — it's the *connected canvas and the learning loop*. Open-source drives the node ecosystem, which is the real network effect.
- **MCP-native** because every capability — Higgsfield media, platform publishing, web research, analytics — is already (or becoming) an MCP server. Clark Pro doesn't reinvent integrations; it **orchestrates MCP tools on a canvas**. A new node = a new MCP server + a small render manifest.

This is the same bet the Creator plan already made by choosing Higgsfield MCP: don't build generators, orchestrate them.

## Explicit Assumptions (the "combination of assumptions")

Stated so they can be challenged:

1. **Generation is solved; orchestration is the product.** We assume best-in-class models stay available via MCP (Higgsfield and successors). Clark Pro never trains models.
2. **Posting can be assisted, not fully automated, and that's fine.** Some platforms have publish APIs (LinkedIn, X, YouTube); others don't (TikTok personal, Substack, IG personal). For those, Clark Pro does "format + stage + one-click hand-off / browser-assist," matching the Creator plan's "manual posting is a 1-minute non-blocker" stance.
3. **The human stays in the loop by design.** The approval node is a feature, not a limitation. Trust is the constraint, so the canvas makes review fast, not absent.
4. **A node is just an MCP tool + a manifest.** This makes the platform extensible without forking core — the open-source flywheel.
5. **The learning loop is the long-term moat.** Per-creator performance memory (which hook/angle/format won) is the compounding asset competitors can't copy.
6. **Local-first, single-user MVP.** Runs on the creator's machine, SQLite + local files, before any multi-tenant cloud. Mirrors how the Creator plan starts local.
7. **Self-hostable + optional hosted.** Open-source self-host for builders; a hosted version later for non-technical creators (the business model).

## Non-Goals (at least early)

- Not a model lab — no fine-tuning, no inference hosting.
- Not a generic automation tool — opinionated toward social content, not "any workflow."
- Not a scheduler-first product — generation + canvas come first; scheduling is a node, not the point.
- Not trying to fully bypass platform ToS with mass auto-posting — assisted publishing respects platform rules.

## North-Star Outcome

A creator runs their **entire week of content** — short-form reels, carousels, LinkedIn posts, a newsletter, a Medium piece — from **one canvas, in one sitting**, watching agents do the heavy lifting, approving with a glance, and publishing across every platform. Then the canvas tells them what worked and seeds next week. That is the Creator plan, made into software.
