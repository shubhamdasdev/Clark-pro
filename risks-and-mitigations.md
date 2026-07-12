# Risks & Mitigations

Combined risk register across both workstreams. Most plans fail not because the strategy was wrong but because predictable risks weren't planned for. Each risk below has a mitigation that should be in place before it bites, not after.

## Short-Form Risks (Higgsfield MCP Pipeline)

| Risk | Mitigation |
|---|---|
| **AI avatar uncanny → audience bounces** | Use real footage in the opener of every reel while avatar quality is dialing in. Pinned intro video shows real face. |
| **Audience perceives content as "low effort AI slop"** | Lean into transparency — "I built this with AI in 5 min" hooks become a series. Varun Mayya proved it works. |
| **Higgsfield MCP free tier hits limits mid-week** | Check credit balance at the start of every Monday batch run. Top up if under 20% — costs are low per generation. Budget $20–30/mo max for credits if free tier runs out. |
| **Higgsfield MCP tool names / API changes** | Verify exact tool names at session start ("list available Higgsfield MCP tools"). Update `higgsfield-skills.md` quick reference table when they change. |
| **Soul 2.0 character drifts (inconsistent avatar)** | Retrain Soul 2.0 every 4–6 weeks or when visual inconsistency appears in more than 2 consecutive reels. |
| **Seedance 2.0 lip-sync quality issues for specific scripts** | Fallback: Lipsync Studio (pure talking-head). For lifestyle/B-roll, Kling 3.0 doesn't do lipsync so no issue there. |
| **Dashboard becomes a side project that eats creator time** | Time-box build to 1 weekend. If MVP isn't usable by Day 14, fall back to Notion kanban. |
| **AI content gets demoted by TikTok/IG algorithms** | Always add captions, voiceover (your real voice clone via Seedance), and at least one real-footage clip/week. Pure AI output is what gets demoted, not AI-assisted. |
| **Account reads unfocused (3 buckets day one)** | Identity anchor in bio + visual style. Recurring series within each bucket. |
| **Skills break after a Claude Code update** | Each skill is a `.md` file — they're just text. Easy to debug. Re-run test: `/gen-content` on one topic, check MCP tool call in the Claude Code log. |

## Long-Form Risks

| Risk | Mitigation |
|---|---|
| **Day-job confidentiality (writing about work)** | Write about *patterns* and your own decisions, never name internal projects, customers, comp. Have one trusted reader review borderline pieces. |
| **LinkedIn cringe/hype voice creep** | Read every LinkedIn draft aloud. If it sounds like a bootcamp ad, rewrite. Self-deprecation > grandstanding. |
| **Newsletter death spiral** (4 weeks of low opens → quit) | First 6 months, ignore open rates. Metric is *posts shipped*, same as short-form. |
| **Overlap creates duplication, not leverage** | The atomic system handles this — same idea, different format/depth per channel. Never repost identical text. |
| **Medium SEO is slow** | Submit to publications. Use specific, searchable titles ("How I evaluate LLM features pre-launch" beats "Thinking about AI"). |
| **Beehiiv free tier outgrown unexpectedly fast** | Good problem. Free tier supports 2.5K subs. At ~2K, evaluate Beehiiv paid vs. self-hosted Ghost (~$10/mo). |

## Cross-Workstream Risks

| Risk | Mitigation |
|---|---|
| **Burnout (full-time job + Cortex + content)** | Strict batch system. Sunday rest. **Skip a day before skipping a week.** |
| **Day-job optics on AI/career posts** | Pre-decide what's shareable. Never name internal projects, customers, comp specifics. Cortex is the safe public artifact. |
| **Dating bucket misfires (preachy / incel-coded)** | Stay observational, not prescriptive. Self-deprecating > authoritative. Run any borderline take by a trusted friend before posting. |
| **First 60 days of no traction → quit** | This plan assumes it. The metric for weeks 1–8 is *posts shipped*, not followers. |
| **Cortex pulls focus from creator work (or vice versa)** | Cortex updates *are* creator content. Deliberately overlap them. If they feel like separate jobs, the framing is wrong. |
| **Both workstreams sustain but neither breaks out** | Quarterly review. Identify the one channel pulling weight (likely LinkedIn first), double down, let weakest format die. |

## Personal / Reputational Risks

| Risk | Mitigation |
|---|---|
| **Recognized at work / from day-job network** | Assume everything you post will be seen by your boss, your customer, your future hiring manager. If it would embarrass you in any of those contexts, don't post. |
| **Dating content read by people you've dated** | If you're using real anecdotes, anonymize or compress timelines. Generic patterns > specific stories. |
| **AI takes over and content stops feeling like you** | Quarterly "voice check": pick 5 random posts from the last 90 days. If you can't tell which were AI-drafted vs. your own, the AI has drifted too far. Recalibrate prompts. |

## Decision Triggers (when to change the plan)

| If this happens... | Then... |
|---|---|
| Spend tracking >$80 by end of Month 3 | Drop HeyGen + ElevenLabs immediately, move fully open-source |
| Newsletter <100 subs by Month 4 | Push LinkedIn cadence to 5×/week; promote newsletter in every post |
| One short-form bucket clearly under-performs across 30+ posts | Cut the bucket. Reallocate to the two performing buckets. |
| One viral video (>100K views) | Pause experimentation; produce 5–10 more videos in that format |
| Inbound starts arriving (DMs, podcast invites) | Triage hard. Say no to most. Pick what compounds the brand. |
| Plan feels like a job at any point | Reduce cadence by 30% rather than quit. The system has to survive. |
