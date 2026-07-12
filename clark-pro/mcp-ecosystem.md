# Clark Pro — MCP & Agent Ecosystem

Clark Pro orchestrates MCP tools on a canvas. This doc catalogs the tool categories, what's real today vs. assisted, and how agents collaborate across them. Every entry is a candidate **node**.

---

## Categories

```
                        ┌─────────────────┐
                        │   CLARK (orch.) │
                        └───┬────┬────┬────┘
            ┌───────────────┘    │    └───────────────┐
            ▼                    ▼                     ▼
     ┌─────────────┐     ┌──────────────┐      ┌──────────────┐
     │   CREATE     │     │   PUBLISH     │      │ LEARN/RESEARCH│
     │ (media+copy) │     │ (platforms)   │      │ (data in/out) │
     └─────────────┘     └──────────────┘      └──────────────┘
```

---

## 1. Create — Media & Copy

### Higgsfield MCP (primary media engine)
`https://mcp.higgsfield.ai/mcp` — already chosen in [avatar-pipeline.md](../avatar-pipeline.md).

| Capability | Model | Clark Pro node |
|---|---|---|
| Consistent avatar image | Soul 2.0 | Image node |
| Talking-head reel (native lip-sync + audio) | Seedance 2.0 | Reel node |
| Pure talking head | Lipsync Studio | Reel node (variant) |
| Photoreal B-roll | Kling 3.0 | B-roll node |
| 4K cinematic B-roll | Veo 3.1 | B-roll node (variant) |
| Design/slide images | Flux 2 | Carousel node |

### Copy / scripts
- **Claude (Agent SDK)** — hooks, scripts, captions, long-form. Not an external MCP; native to the orchestrator. Becomes the Script/Angles nodes.
- Optional: **brand-voice MCP/skills** for voice enforcement (the existing `brand-voice` plugin).

### Extensible media nodes (community)
Any image/video model with an MCP server drops in as a node via manifest: Pika, Runway, Luna, ElevenLabs (if voice is wanted separately), etc.

---

## 2. Publish — Platforms

Honest matrix of what's automatable. Where there's no API, Clark Pro does **assisted publish** (format + stage + browser hand-off), consistent with the Creator plan's "manual posting is a 1-minute non-blocker."

| Platform | Publish path | Reality |
|---|---|---|
| **LinkedIn** | Official API (w/ approved app) or assisted | Personal posting via API is gated; assisted hand-off is the safe default |
| **X / Twitter** | Official API (paid tiers) | Works, but API pricing matters; assisted fallback |
| **YouTube Shorts** | YouTube Data API | Solid official upload path |
| **Instagram Reels** | Graph API (Business/Creator accounts) | Works for Business accounts; personal = assisted |
| **TikTok** | Content Posting API (approved partners) or assisted | Often assisted for solo creators |
| **Substack** | No official write API | Assisted publish (browser) / draft export |
| **Medium** | API deprecated | Assisted publish / draft export |

**Assisted-publish node** uses a browser-automation MCP (Playwright-style) to open the platform, pre-fill the post, and hand control to the human for the final click — or simply exports a perfectly-formatted package for 1-minute manual upload.

**Design principle:** never block the pipeline on publishing. A post that can't auto-publish still arrives **fully assembled and staged** — the creator spends the same 60 seconds they already planned to.

---

## 3. Research & Learn — Data In/Out

### Research (feeds Angles)
- **Web search MCP** — current takes, what's saturated, source facts.
- **Trends MCP** — what's rising on each platform.
- **Performance memory (internal)** — the creator's own past winners.

### Learn (closes the loop)
- **Platform analytics** — views, retention, watch-time, engagement. Via platform APIs where available, manual entry where not.
- **Attribution** — map results back to idea → angle → hook → format.
- **Memory write** — update the vector/structured store that biases future Research + Angles.

This is the **moat**: a per-creator, compounding model of what works *for them*, that no generic tool has.

---

## How Agents Collaborate (a single run)

A walk through "RAG is dead" from brain dump to learning:

1. **Brain Dump** → Clark classifies it as Ambition/AI bucket, long-form + short-form candidate.
2. **Research agent** calls web-search + trends MCP + reads performance memory → brief: "RAG-fatigue is rising, contrarian take has room, your explainer hooks historically beat hot-takes by 1.4x."
3. **Angles agent** proposes 4 angles, ranks them using that memory, recommends the explainer. (Autonomy slider decides auto-pick vs. ask.)
4. **Script agents** (parallel, one per platform) write: 8-sec TikTok hook, 250-word LinkedIn post, 600-word Substack section — each pulling the **Brand Voice** node.
5. **Media agents** call **Higgsfield**: Reel node (Seedance 2.0) for TikTok, Carousel node (Flux 2) for LinkedIn. Render live on canvas.
6. **Platform Adapter** agents assemble native posts (aspect, caption, hashtags, first comment).
7. **Approval** gate pauses; creator reviews all three previews, tweaks the TikTok hook, approves.
8. **Publish** agents fire: YouTube/LinkedIn via API, TikTok via assisted hand-off.
9. **Learn** node sleeps 5 days, wakes, pulls analytics, attributes, writes memory → step 2 of the *next* idea is now smarter.

Each numbered actor is a small agent or direct MCP call, coordinated by the orchestrator, all **visible as nodes** on the canvas.

---

## Tool Configuration (self-host)

A single `clark.config.yaml` (or UI settings) registers MCP servers and tokens:

```yaml
mcp_servers:
  higgsfield:
    url: https://mcp.higgsfield.ai/mcp
    auth: oauth        # bearer forwarded per-run
  websearch:
    url: <search mcp>
  publisher_linkedin:
    url: <li publisher mcp>
    auth: oauth
  publisher_assisted:
    url: <playwright-style browser mcp>
budget:
  higgsfield_credits_ceiling: 1000   # halt run if exceeded
  monthly_spend_cap_usd: 100         # the Creator plan instinct, generalized
```

Bring-your-own keys. Nothing proxied through a third party in self-host mode.

---

## Why MCP and Not Custom Integrations

- **Integrations are the expensive part of every social tool** — and they rot constantly. MCP turns them into swappable, community-maintainable units.
- **The ecosystem is already moving to MCP** — Higgsfield shipped theirs; publishers and analytics will follow. Clark Pro rides that wave instead of fighting it.
- **Extensibility = network effect.** Every new MCP node makes Clark Pro more capable without core work. That's the open-source flywheel from [vision.md](vision.md).
