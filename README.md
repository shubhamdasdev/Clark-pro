# Creator Plan — AI Product Guy in Chicago

A two-workstream content strategy aimed at **100K followers by Dec 2027** plus an owned audience of newsletter + LinkedIn readers built around AI/PM authority.

## North Star

> **AI product guy building a life in Chicago — money, style, dating, ambition.**

The unfair advantage is the combination: AI/product brain + ambition (building Cortex) + actual Chicago social life + dating/mindset POV. Treated as a **personal brand startup with a 12-month runway**, not "posting content."

## The Two Workstreams

| Workstream | Channels | Rhythm | Goal |
|---|---|---|---|
| **Short-form (AI pipeline)** | TikTok, IG Reels, IG Carousels | 14 pieces/week | Reach + brand: 100K followers |
| **Long-form** | LinkedIn, Beehiiv newsletter, Medium | ~17 pieces/month | Authority + owned audience |

Both share the same positioning, voice, and topic universe — long-form deepens what short-form spreads. The atomic content system below makes one idea travel across both.

## The Third Workstream → Clark Pro (the product)

The pipeline we designed to run *this* creator plan is itself a product: **[Clark Pro](clark-pro/README.md)** — an open-source, MCP-native, visual AI social media studio. Brain-dump an idea and watch it become research → angles → scripts → images → videos → platform posts → approval → publish → learning, all on a connected canvas where you *see* the agents work.

This creator plan is Clark Pro's **first user and launch story**; Clark Pro is what makes this creator plan scale. They compound. See [clark-pro/](clark-pro/README.md).

## Hard Constraints

- **External spend cap: $100** across the launch period.
- **Time budget: ~1–1.5 hrs/day** on top of full-time AI PM role.
- **Posting is manual** (1 min). No posting APIs to build.
- **Claude Code + Codex are the labor.** No paid AI API spend on those.

## Core Technology

**Higgsfield MCP** (launched April 30, 2026) is the engine of the short-form pipeline. It gives Claude Code direct access to 30+ image and video models — Soul 2.0 (avatar), Seedance 2.0 (native lip-sync + audio video), Kling 3.0 / Veo 3.1 (B-roll) — all via a single MCP endpoint at `https://mcp.higgsfield.ai/mcp`. No HeyGen, no ElevenLabs, no local model setup. Budget drops to near $0.

## Documents in this Plan

1. **[positioning.md](positioning.md)** — shared north star, bio, voice rules. Read first.
2. **[avatar-pipeline.md](avatar-pipeline.md)** — short-form AI production pipeline (Higgsfield MCP edition), tool stack, dashboard plan, budget breakdown.
3. **[higgsfield-skills.md](higgsfield-skills.md)** — the 5 Claude Code slash-command skills (`/gen-hook`, `/gen-reel`, `/gen-carousel`, `/gen-broll`, `/gen-content`) with full `.md` file contents, `CLAUDE.md` template, and `SESSION-RESUME.md` template.
4. **[longform-content.md](longform-content.md)** — LinkedIn + newsletter + Medium strategy, atomic content system, channel-specific tactics.
5. **[cadence.md](cadence.md)** — combined weekly schedule across both workstreams.
6. **[milestones.md](milestones.md)** — 20-month timeline through Dec 2027.
7. **[risks-and-mitigations.md](risks-and-mitigations.md)** — full risk register for both workstreams.

## What Happens Next (no code yet until reviewed)

1. Review all docs and make any edits.
2. **One-time setup:** Add Higgsfield MCP to Claude Code `settings.json`. Train Soul 2.0 on 10–15 photos.
3. **Build skills:** create `.claude/commands/` directory, write the 5 skill files from `higgsfield-skills.md`.
4. **Write `CLAUDE.md`** in project root using the template in `higgsfield-skills.md`.
5. **Dashboard:** 1-hour spike on Postiz. If it fits, use it. If not, build minimal Next.js + SQLite kanban.
6. **First batch:** run `/gen-content` × 3 (one per bucket) as a pipeline test.

See [avatar-pipeline.md](avatar-pipeline.md) → First 14 Days section for day-by-day steps.
