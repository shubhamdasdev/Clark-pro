# Avatar Pipeline — Short-Form Content System (Higgsfield MCP Edition)

> **Updated April 30, 2026.** Higgsfield launched their official MCP server today. The entire video/avatar generation layer now runs directly inside Claude Code via MCP — no HeyGen, no ElevenLabs, no separate tooling. The pipeline is now tighter, cheaper, and fully scriptable.

---

## What Higgsfield MCP Changes

| Before | After (Higgsfield MCP) |
|---|---|
| HeyGen $24/mo for avatar video | Higgsfield MCP — avatar + lipsync via Lipsync Studio or Seedance 2.0 |
| ElevenLabs $5/mo for voice clone | Seedance 2.0 native audio-video (lip-sync + SFX + music in one pass) |
| SadTalker/LivePortrait local setup | Soul 2.0 via MCP — consistent character, trained on your photos |
| Kling/Pika free credits for B-roll | Kling 3.0 or Veo 3.1 via same MCP |
| Manual script → voice → avatar stitch | Single `gen_reel` skill call end-to-end |
| $58 in Months 1–2 on HeyGen + ElevenLabs | Higgsfield credits (free tier compatible; no separate tools) |

Everything — avatar image, talking-head video, B-roll, carousel images — comes from one MCP server inside Claude Code.

---

## Goal

100K TikTok + IG Reels followers by **Dec 2027** (~20 months). Posting is manual (1 min). Bottleneck the pipeline solves: **creation throughput** — 14 pieces/week at ~20 min human work per piece.

---

## Output Matrix

| Bucket | Primary production mode | Real footage |
|---|---|---|
| Ambition / AI | Lipsync Studio avatar OR Soul 2.0 + Seedance 2.0 reel | Cortex screen-recordings |
| Lifestyle / Chicago | Kling 3.0 / Veo 3.1 B-roll + voiceover | Phone clips at bars/streets |
| Dating / Mindset | Lipsync Studio avatar (talking head, text-on-screen cuts) | None |

Real footage: at minimum 2 clips/week to prevent the account reading as pure-AI.

---

## New Pipeline — Higgsfield MCP as Core

```
[1] Hook/Script       → /gen-hook skill (Claude Code — free)
[2] Avatar image      → Soul 2.0 via Higgsfield MCP (consistent character)
[3] Reel video        → Seedance 2.0 or Lipsync Studio via Higgsfield MCP
                         (native lip-sync + audio + SFX in one pass, 9:16, 8–15s)
[4] B-roll            → Kling 3.0 or Veo 3.1 via Higgsfield MCP
[5] Carousel images   → Soul 2.0 / Flux 2 via Higgsfield MCP
[6] Captions          → CapCut auto-captions (free) — Seedance 2.0 handles audio natively
[7] 5-min review      → Human pass (catch AI weirdness, pick best take)
[8] Post              → Manual (1 min)
```

No ElevenLabs. No HeyGen. No local model setup. No manual stitching of voice + avatar.

### Key model decisions

- **Avatar video (talking head):** `Lipsync Studio` — purpose-built for creator talking-head reels, maintains your face from Soul training.
- **AI-driven story/cinematic reels:** `Seedance 2.0` — native synced audio + video. Feed it script + Soul image + audio cue; it returns one cohesive reel.
- **B-roll scenes:** `Kling 3.0` for photorealism, `Veo 3.1` for 4K cinematic.
- **Character consistency:** Train `Soul 2.0` once on 10–15 of your real photos. Reuse across all generations. This is your AI avatar.
- **Carousel images:** `Flux 2` or `Soul 2.0` depending on whether slides need your face.

---

## Higgsfield MCP Setup (one-time)

1. Add to Claude Code `settings.json` → `mcpServers`:
```json
{
  "mcpServers": {
    "higgsfield": {
      "type": "http",
      "url": "https://mcp.higgsfield.ai/mcp"
    }
  }
}
```
2. Claude Code will prompt for OAuth → log in with Higgsfield account.
3. Free tier is compatible. Credits are shared with the Higgsfield platform.
4. Test: ask Claude Code to "generate a test image using Soul model" — confirm it calls the MCP tool.

---

## Claude Code Skills (Slash Commands)

Five skills live in `.claude/commands/` inside the project. See `higgsfield-skills.md` for full spec and file contents.

| Skill | Command | What it does |
|---|---|---|
| Hook generator | `/gen-hook` | Generates hook + full script for given bucket + topic |
| Reel generator | `/gen-reel` | Soul image → Lipsync/Seedance video via MCP, 9:16, 8–15s |
| Carousel generator | `/gen-carousel` | Generates 6–8 PNG slides via Higgsfield + assembles spec |
| B-roll generator | `/gen-broll` | Kling/Veo B-roll for lifestyle/ambient scenes |
| Full content run | `/gen-content` | Orchestrates all above: hook → images → reel + carousel in one call |

---

## CLAUDE.md Defaults

A `CLAUDE.md` in the project root tells Claude Code the session rules on every launch. Key defaults:

```markdown
## Higgsfield Pipeline Defaults

- Avatar model: Soul 2.0
- Image aspect: 3:4 (portrait)
- Image resolution: 2K
- Video model: Seedance 2.0 (lipsync) or Kling 3.0 (B-roll)
- Video aspect: 9:16
- Video duration: 8–10 seconds
- Always clear prompt fields before submitting (see SESSION-RESUME.md if batch fails mid-run)
- Output paths: output/reels/, output/carousels/, output/broll/
- Bucket rotation: Ambition → Lifestyle → Dating → repeat
```

---

## Weekly Pipeline Rhythm

| Day | Pipeline work | Output |
|---|---|---|
| Mon | `/gen-hook` batch — 7 scripts across all buckets | 7 scripts ready |
| Tue | `/gen-reel` × 4 (Ambition + Dating buckets) | 4 reels queued |
| Wed | `/gen-broll` × 3 (Lifestyle bucket); post 1 reel + 1 carousel | 3 lifestyle B-roll clips |
| Thu | `/gen-carousel` × 7 (all buckets); assemble in CapCut | 7 carousels ready |
| Fri | Real-footage capture; post 1 reel + 1 carousel | Real B-roll |
| Sat | Cut real footage; `/gen-content` for next week's overflow; post 1 reel + 1 carousel | Pre-loaded queue |
| Sun | Weekly review (30 min); refill hook bank | Next week planned |

Daily human time: **45–60 min** once pipeline is stable.

---

## Budget — Revised for Higgsfield MCP

| Item | Old plan | New plan | Savings |
|---|---|---|---|
| HeyGen Creator | $24/mo × 2 = $48 | **$0** | $48 |
| ElevenLabs Starter | $5/mo × 2 = $10 | **$0** | $10 |
| Higgsfield credits | $0 | **Free tier** (upgrade only if volume demands) | — |
| Replicate API buffer | $20 | **$0** (MCP covers all model access) | $20 |
| Dashboard VPS (optional) | $20 | $20 (or $0 local) | — |
| **Total** | **$78–98** | **$0–20** | **Up to $78 saved** |

Spend now is essentially **$0** unless you scale past the Higgsfield free tier. The $100 budget becomes a buffer for paid Higgsfield credits if free limits are hit at volume, plus optional VPS.

---

## Dashboard / Board

**Same recommendation as before: spike on Postiz first (open-source), build minimal custom dashboard if it doesn't fit.**

With Higgsfield MCP the dashboard's main job is now lighter — it doesn't need to shell out to local voice/avatar scripts. Its job is:
- Track kanban state per piece (Idea → Scripted → Generated → Posted)
- Store Higgsfield generation IDs + output paths
- Surface "today's queue" for manual upload
- Record post-mortem (views, retention, comments)

Stack: Next.js + SQLite + Tailwind. Localhost. Built with Claude Code in one weekend.

---

## Content Hooks

### Ambition / AI
- "How I make $100K in AI at 29"
- "Day in life of an AI PM in Chicago"
- "I built this entire reel with AI in 4 minutes" ← meta, always works
- "Cortex build update — week N"
- "Why most $100K guys are still broke"

### Lifestyle / Chicago
- "$120 night at this Chicago bar — worth it?"
- "Outfit that gets compliments vs one that doesn't"
- "Thursday night in Chicago" — Veo 3.1 B-roll over voiceover

### Dating / Mindset
- "I don't do coffee dates. If I like you, it's dinner."
- "How I'd text her after she doesn't reply"
- "Why most guys lose girls after the first date"

---

## Posting & Distribution

- **Primary:** TikTok. **Mirror:** IG Reels (re-encode, strip watermark).
- Carousels: IG primary → TikTok slideshow → LinkedIn (AI/career bucket only).
- **Posting times:** TikTok 7–9pm CT, IG 8–10pm CT.
- **Tags:** 3–5 specific, no spray.

---

## First 14 Days — Revised

### Days 1–2: Setup
- Add Higgsfield MCP to Claude Code `settings.json`. Authenticate.
- Train Soul 2.0 on 10–15 photos (your avatar — do this once, reuse forever).
- Spike: Postiz vs. custom dashboard decision.
- Lock profile bio + photos on both platforms.

### Days 3–5: Build skills + CLAUDE.md
- Write `CLAUDE.md` in project root (defaults from above).
- Build the 5 slash command skills in `.claude/commands/` — see `higgsfield-skills.md`.
- Run each skill once as a test to confirm MCP calls land correctly.

### Days 6–8: First batch
- `/gen-content` × 7 — one full week of content end-to-end.
- Fix any prompt or MCP failures.
- Build/install dashboard; load all 7 pieces in.

### Days 9–14: Ship
- 1 reel + 1 carousel/day, both platforms.
- Track time-per-piece — target: ≤20 min human work by Day 14.
- End of Day 14 checkpoint: pipeline stable, first real analytics visible.

---

## Verification

### Pipeline KPIs
- **Day 5:** All 5 skills tested successfully, Soul 2.0 avatar trained.
- **Day 14:** Finished reel ≤20 min human work. Zero skill failures in last 5 runs. Dashboard tracking every piece.
- **Day 30:** 30 reels + 30 carousels live. External spend ≤$5 (optional VPS only).
- **Day 60:** Higgsfield credit usage logged and understood. Free tier holding or upgrade path clear.

### Content KPIs
- **Week 4:** ≥1 video over 5K views OR retention >60% on 3+ videos.
- **Week 8:** 1K followers, one video over 25K views.
- **Month 6 (Oct 2026):** 30K followers, recurring AI-built series.
- **Month 12 (Apr 2027):** 65K. Reassess if under 35K.
- **Dec 2027:** 100K.

---

## Repo Layout

```
~/creator/  (or ~/Creator plan/)
├── CLAUDE.md                       ← session defaults for Claude Code
├── SESSION-RESUME.md               ← batch recovery tracker
├── .claude/
│   └── commands/                   ← slash command skill files
│       ├── gen-hook.md
│       ├── gen-reel.md
│       ├── gen-carousel.md
│       ├── gen-broll.md
│       └── gen-content.md
├── dashboard/                      ← Next.js kanban (or Postiz)
├── output/
│   ├── reels/
│   ├── carousels/
│   └── broll/
├── hook-bank.md
└── weekly-review.md
```
