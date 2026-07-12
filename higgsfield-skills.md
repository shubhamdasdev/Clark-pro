# Higgsfield MCP — Claude Code Skills

> These are the five Claude Code slash-command skills that power the short-form content pipeline. Each skill is a `.md` file placed in `.claude/commands/` inside the project directory. Claude Code reads them when you type `/skill-name` in the terminal.

---

## Prerequisites

1. Higgsfield MCP added to Claude Code `settings.json`:
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
2. Soul 2.0 avatar trained on 10–15 of your photos inside Higgsfield (one-time setup).
3. `CLAUDE.md` in project root with the default settings (see `avatar-pipeline.md`).
4. Output directories exist: `output/reels/`, `output/carousels/`, `output/broll/`.

---

## Skill 1 — `/gen-hook`
**File:** `.claude/commands/gen-hook.md`

```markdown
# /gen-hook — Hook & Script Generator

Generate a hook + full reel script for a given content bucket and topic.

## Arguments (passed after the command)
- $BUCKET — one of: ambition-ai | lifestyle-chicago | dating-mindset
- $TOPIC — brief topic or angle (e.g. "why I don't do coffee dates")

## Steps

1. Read CLAUDE.md to load positioning (AI product guy in Chicago — money, style, dating, ambition).

2. Write a hook for $TOPIC in $BUCKET using this formula:
   - First 1.5 seconds: specific promise or curiosity gap (no generic openers)
   - Tone: confident, dry, observational — never preachy or hype
   - Format: single sentence, spoken aloud, <15 words

3. Write the full reel script:
   - Length: 45–75 words (fits 8–10 second video)
   - Structure: Hook → 2–3 punchy points → closing line (re-state or invert the hook)
   - No filler phrases ("honestly", "look", "here's the thing")
   - End with a micro-CTA when natural ("follow for more", "comment your take")

4. Output format:
   ```
   BUCKET: [value]
   TOPIC: [value]
   HOOK: [the hook line]
   SCRIPT:
   [full script]
   CAPTION: [IG/TikTok caption — 1–2 lines + 3–5 hashtags]
   ```

5. Save output to hook-bank.md with today's date as a new entry.
```

---

## Skill 2 — `/gen-reel`
**File:** `.claude/commands/gen-reel.md`

```markdown
# /gen-reel — Reel Generator (Avatar Talking Head)

Generate a complete AI-avatar reel using Soul 2.0 + Seedance 2.0 (or Lipsync Studio) via Higgsfield MCP.

## Arguments
- $SCRIPT — the script text (can be pasted, or reference a hook-bank.md entry by date/topic)
- $STYLE — optional: ugc (default) | cinematic | hyper-motion | tv-spot

## Steps

1. Read CLAUDE.md for defaults:
   - Avatar: Soul 2.0
   - Image aspect: 3:4
   - Video model: Seedance 2.0 for audio-synced or Lipsync Studio for pure talking-head
   - Video aspect: 9:16
   - Duration: 8–10 seconds

2. Generate avatar image:
   - Use Higgsfield MCP tool: generate_image
   - Model: Soul 2.0
   - Prompt: "photorealistic portrait of [trained character], direct eye contact, neutral expression,
     soft studio lighting, clean background, 3:4 vertical format"
   - Resolution: 2K
   - Save result to output/reels/[date]-[topic]-avatar.png

3. Generate reel video:
   - Use Higgsfield MCP tool: generate_video
   - Model: Seedance 2.0 (preferred — native audio + lipsync in one pass)
     OR Lipsync Studio if pure talking-head without music is needed
   - Input image: the avatar image from step 2
   - Prompt: "UGC creator style, natural hand gestures, direct address to camera,
     authentic lighting, vertical 9:16 format, [insert $SCRIPT key phrases for motion guidance]"
   - Aspect: 9:16
   - Duration: 8–10 seconds
   - Preset: $STYLE (default: ugc)
   - Wait for generation to complete (async — poll or notify when done)
   - Save result to output/reels/[date]-[topic]-reel.mp4

4. Log to SESSION-RESUME.md:
   ```
   [date] [topic] → avatar: [path] | reel: [path] | higgsfield_id: [generation_id] | status: done
   ```

5. Report:
   - Final file path
   - Generation ID (for re-fetching if needed)
   - Suggested CapCut step: import, add auto-captions, trim to tightest 8 sec, export
```

---

## Skill 3 — `/gen-carousel`
**File:** `.claude/commands/gen-carousel.md`

```markdown
# /gen-carousel — Carousel Generator

Generate a 6–8 slide carousel: copy + images via Higgsfield MCP, assembled as PNGs.

## Arguments
- $TOPIC — the carousel topic or angle
- $BUCKET — ambition-ai | lifestyle-chicago | dating-mindset
- $SLIDES — number of slides (default: 7)

## Steps

1. Write the carousel copy:
   - Slide 1: Hook (same rules as /gen-hook — specific promise or curiosity gap)
   - Slides 2–6: One point per slide. Max 20 words/slide. Punchy.
   - Slide 7: CTA ("Follow for more", "Save this", or "Comment your take")
   - Tone: same as all content — confident, dry, not preachy

2. For each slide, generate an image via Higgsfield MCP:
   - Use generate_image tool
   - Model: Flux 2 (for text-heavy design slides) or Soul 2.0 (if your face appears)
   - Prompt per slide: describe the visual concept + "clean vertical 4:5 aspect,
     bold sans-serif text overlay space at center, high contrast, modern design"
   - Resolution: 2K
   - Save each to output/carousels/[date]-[topic]/slide-[n].png

3. Write a carousel spec file:
   ```
   output/carousels/[date]-[topic]/spec.md
   ---
   Slide 1: [copy] | image: slide-1.png
   Slide 2: [copy] | image: slide-2.png
   ...
   Caption: [caption for IG post]
   Hashtags: [3–5]
   ```

4. Report: all file paths, spec location, suggested Canva/CapCut import step.

## Note on text overlays
Higgsfield generates the background image. Add the actual text overlay in CapCut or Canva
(free) by importing the PNG and adding text layers. This gives cleaner typography than
asking the image model to render text.
```

---

## Skill 4 — `/gen-broll`
**File:** `.claude/commands/gen-broll.md`

```markdown
# /gen-broll — B-Roll Generator (Lifestyle / Ambient Scenes)

Generate cinematic B-roll footage for the Lifestyle/Chicago bucket or ambient cutaways.

## Arguments
- $SCENE — describe the scene (e.g. "Chicago rooftop bar at night, golden hour",
  "dark moody cocktail bar interior, slow motion", "city walk Michigan Avenue winter")
- $MODEL — optional: kling-3 (default, photorealistic) | veo-3 (4K cinematic) | seedance-2 (motion-rich)
- $DURATION — optional: 5 | 8 | 10 | 15 seconds (default: 8)

## Steps

1. Read CLAUDE.md defaults: video aspect 9:16, output to output/broll/

2. Write an optimized video prompt for $SCENE:
   - Add cinematic details: camera movement (slow pan, static, dolly), lighting, mood
   - Specify: "vertical 9:16 format, no text, no people's faces, ambient lifestyle footage"
   - Include: "Chicago aesthetic" or relevant geographic/style cue

3. Generate via Higgsfield MCP:
   - Tool: generate_video
   - Model: $MODEL (default: kling-3)
   - Prompt: enhanced prompt from step 2
   - Aspect: 9:16
   - Duration: $DURATION

4. Save to output/broll/[date]-[scene-slug].mp4

5. Log to SESSION-RESUME.md.

6. Report: file path, generation ID, suggested use case (which reel it fits).

## Common B-roll scene bank (expand over time)
- Chicago rooftop bar, night, city lights bokeh
- Dark cocktail bar interior, ice in glass, candlelight
- Michigan Avenue walk, winter, golden streetlights
- Office desk with MacBook, ambient light, morning coffee
- Outfit flatlay, minimal background, overhead shot
- City highway time-lapse, dusk
```

---

## Skill 5 — `/gen-content`
**File:** `.claude/commands/gen-content.md`

```markdown
# /gen-content — Full Content Run (End-to-End Orchestrator)

One command produces: hook + script + avatar reel + carousel + B-roll for one content piece.

## Arguments
- $BUCKET — ambition-ai | lifestyle-chicago | dating-mindset
- $TOPIC — topic or angle (or omit to let Claude pick from hook-bank.md backlog)
- $TYPE — reel-only | carousel-only | both (default: both)

## Steps

1. If $TOPIC is omitted:
   - Read hook-bank.md, find the bucket with the fewest entries this week,
     pick the top unused topic from that bucket's list.

2. Run /gen-hook:
   - Pass $BUCKET and $TOPIC
   - Capture HOOK, SCRIPT, CAPTION output

3. If $TYPE includes reel:
   - Run /gen-reel with the SCRIPT from step 2
   - Wait for completion, capture reel path

4. If $BUCKET is lifestyle-chicago and $TYPE includes reel:
   - Also run /gen-broll for one ambient B-roll clip to use as cutaway
   - Suggest in output: "Open reel with 2s of this B-roll, then cut to avatar talking head"

5. If $TYPE includes carousel:
   - Run /gen-carousel with $TOPIC and $BUCKET
   - Capture carousel path and spec

6. Assemble the batch record:
   - Update SESSION-RESUME.md with all generation IDs and file paths
   - Add a new row to dashboard (or weekly-review.md if dashboard isn't up yet):
     | Date | Bucket | Topic | Reel | Carousel | Status |
     |------|--------|-------|------|----------|--------|
     | [date] | [bucket] | [topic] | [path] | [path] | Ready to post |

7. Final output summary:
   ```
   ✅ Content piece complete
   Bucket: [bucket]
   Topic: [topic]
   Hook: [hook line]
   Reel: [path] ([duration]s, Seedance 2.0)
   Carousel: [path] ([n] slides, Flux 2)
   Caption: [caption]
   Post on: TikTok 7–9pm CT | IG 8–10pm CT
   ```

## Batch mode
To generate a full week in one session:
"Run /gen-content for all three buckets (ambition-ai, lifestyle-chicago, dating-mindset),
both reel and carousel, picking the best unused topic from hook-bank.md for each."
Claude will run three sequential /gen-content calls, pausing after each for a quick review.
```

---

## CLAUDE.md Template

Place this file at the **project root** (the `~/Creator plan/` or `~/creator/` directory):

```markdown
# Creator Pipeline — Session Rules

Read this file at the start of every Claude Code session.

## Identity
AI product guy building a life in Chicago — money, style, dating, ambition.
All content must reinforce this positioning. See positioning.md.

## Higgsfield MCP Defaults
- Avatar model: Soul 2.0 (trained character ID: [fill in after Soul training])
- Image aspect: 3:4 (portrait)
- Image resolution: 2K
- Primary video model: Seedance 2.0 (audio-synced, 9:16, 8–10s)
- Fallback video model: Lipsync Studio (pure talking head, no music)
- B-roll model: Kling 3.0 (photorealism) or Veo 3.1 (4K cinematic)
- Carousel image model: Flux 2 (design slides) or Soul 2.0 (face present)

## Output Paths
- Reels: output/reels/
- Carousels: output/carousels/
- B-roll: output/broll/

## Batch Recovery
If a batch generation fails mid-run, check SESSION-RESUME.md for the last successful
generation ID before re-running. Do not re-generate pieces already marked "done".

## Content Rules
- Hook first 1.5 seconds: specific promise or curiosity gap, never generic
- Tone: confident, dry, observational — never preachy or hype
- Voice: self-deprecating > authoritative on dating content
- Never name internal day-job projects, customers, or exact comp
- Cortex build updates are always safe to publish

## Weekly Targets
- 7 reels + 7 carousels/week minimum
- At least 2 real-footage clips/week (not AI-generated)
- 3 LinkedIn posts + 1 newsletter sent by Saturday

## Bucket Rotation
Monday: ambition-ai | Tuesday: lifestyle-chicago | Wednesday: dating-mindset
Thursday: ambition-ai | Friday: lifestyle-chicago | Saturday: dating-mindset
```

---

## SESSION-RESUME.md Template

Place at project root. Claude Code updates this during every batch run.

```markdown
# Session Resume — Batch Recovery Tracker

| Date | Topic | Bucket | Avatar ID | Reel ID | Carousel IDs | Status |
|------|-------|--------|-----------|---------|--------------|--------|
| [date] | [topic] | [bucket] | [hf-id] | [hf-id] | [hf-id-1, hf-id-2...] | done / in-progress / failed |
```

---

## Quick Reference — Higgsfield MCP Tool Names

These are the MCP tool names Claude Code calls. Include these in skill prompts so Claude knows exactly what to invoke:

| Action | MCP Tool | Key params |
|---|---|---|
| Generate image | `generate_image` | model, prompt, aspect_ratio, resolution |
| Generate video | `generate_video` | model, prompt, aspect_ratio, duration, input_image |
| List presets | `list_presets` | — |
| Check generation status | `get_generation` | generation_id |
| List asset library | `list_assets` | type (image/video) |
| Browse generation history | `list_generations` | — |

> **Note:** MCP tool names above are based on the Higgsfield MCP spec as of April 30, 2026. Verify exact names by asking Claude Code: "List all available Higgsfield MCP tools." Update this table accordingly.
