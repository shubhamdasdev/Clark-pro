# Clark Pro

**A visual AI social media creation studio.** Brain-dump an idea and watch it become research, angles, scripts, images, videos, platform-specific posts, approvals, publishing, and performance learning — all on a connected visual canvas where you *see* the agents working.

> Think **ComfyUI for social content** crossed with **a video editor's timeline** and **n8n's integrations** — open-source, MCP-native, agent-driven.

---

## The Combination (why this project exists)

This project is the synthesis of three things we built up in the [Creator plan](../README.md):

| What we had | What it becomes in Clark Pro |
|---|---|
| A **personal creator workflow** (idea → research → script → media → post → learn) | The **canvas pipeline** — the product's core UX |
| **Higgsfield MCP skills** (`/gen-hook`, `/gen-reel`, `/gen-carousel`...) | **Nodes** on the canvas instead of slash commands |
| **Manual multi-platform posting** (TikTok, IG, LinkedIn, Medium, Beehiiv) | **Platform adapter nodes** + assisted publishing |
| **The weekly review ritual** (retention → what to repeat) | The **performance learning loop** baked into the graph |

**The key realization:** the pipeline we designed for one creator (you) is a product. You are now both the *builder* and the *first user / design partner*. Your 100K creator journey dogfoods Clark Pro; Clark Pro is the launch story of your creator journey. They compound.

---

## What Makes It Different

Most AI content tools are **chat → copy → paste**. You lose the thread, you can't see the work, nothing is connected, and nothing learns.

Clark Pro is **visual, connected, and agent-driven**:
- Every idea, script, image, post, approval, and publish step is a **node you can see and steer**.
- Agents **work inside the canvas** — nodes light up as they run, stream output live, and branch.
- The whole graph is **connected** — change the angle and downstream scripts/media regenerate.
- It **learns** — published performance flows back and biases the next idea.

---

## Documents

**Vision layer:**

1. **[vision.md](vision.md)** — the product vision, who it's for, the problem, the "video editor for social workflows" framing, and the explicit assumptions.
2. **[the-canvas.md](the-canvas.md)** — the heart of the product: the node system, every node type, how the agent walks the graph.
3. **[architecture.md](architecture.md)** — tech stack, agent orchestration, the MCP plugin model, open-source structure.
4. **[mcp-ecosystem.md](mcp-ecosystem.md)** — the tools and agents that plug in (Higgsfield, publishers, research, analytics) and how they collaborate.
5. **[roadmap.md](roadmap.md)** — MVP → v1 → v2, and how the personal Creator plan dogfoods each phase.

**Build layer (product/, July 2026):**

6. **[product/01-product-description.md](product/01-product-description.md)** — the PRD: problem, users, goals/non-goals, the 8 feature sections, success metrics, resolved decisions (license, canvas lib, publishing depth), riskiest assumptions.
7. **[product/02-user-flows.md](product/02-user-flows.md)** — user flows per feature section, with happy paths, decision points, and edge cases.
8. **[product/03-epics-and-stories.md](product/03-epics-and-stories.md)** — 12 epics (E0–E11) with stories, acceptance criteria, and sizing, sequenced against the roadmap phases.
9. **[product/04-architecture-and-tech-stack.md](product/04-architecture-and-tech-stack.md)** — buildable detail: full stack table, data model, API/event contracts, node manifest schema, orchestrator internals.

---

## One-Line Pitch

> **Clark Pro turns a single brain-dump into a week of published, on-brand, multi-platform content — and you watch every step happen on a canvas instead of copy-pasting from a chat.**

---

## Status

Vision + full product plan stage (PRD, user flows, epics/stories, detailed architecture in [product/](product/)). **No code yet.** Next step: **Epic E0 — the weekend spike** (headless Brain Dump → Script → Reel via Higgsfield MCP). See [product/03-epics-and-stories.md](product/03-epics-and-stories.md).
