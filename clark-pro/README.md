# Clark Pro

**A Mac-first, memory-native operating system for serious creators.** Clark turns intent into published work through visible, repeatable loops, and it learns only from evidence the creator can inspect, correct, or forget.

Clark is not another AI content generator and not a scheduler with a chat box. It is the durable layer between a creator and every model, skill, media service, publishing platform, and analytics source they use.

> **One creator model. One visual studio. Every tool. Every channel. Every lesson retained.**

## The Product System

| Product surface | Role |
|---|---|
| **Clark Studio** | The signed macOS app: Focus, Canvas, Timeline, Review, Library, and Memory views. |
| **Clark Harness** | The local durable runtime: loops, runs, agents, tools, approvals, budgets, retries, schedules, and recovery. |
| **Clark Memory** | The inspectable creator model: identity, brand rules, facts, episodes, performance evidence, and learned procedures. |
| **Clark Connect** | MCP client + connector runtime for Higgsfield, Postiz, research, analytics, files, browsers, and direct APIs. |
| **Clark Bridge** | Clark's own MCP server so Claude, Codex, ChatGPT, Hermes, and other clients can use Clark as a tool. |
| **Clark Skills** | Installable Agent Skills plus creator-specific skills proposed from successful runs and promoted only through review. |
| **Clark Kit** | SDK and governed Tool Packs for capabilities, adapters, converters, renderers, templates, policies, and skills. |

## The Strongest Wedge

The initial user is a professional solo creator running a multi-channel personal brand while holding a demanding job. Their problem is not access to generation. It is preserving intent, brand judgment, source evidence, production state, approvals, distribution state, and lessons across dozens of tools and hundreds of posts.

Clark's wedge is **creator continuity**:

1. Capture a rough idea anywhere.
2. Enrich it with sources and relevant personal memory.
3. Develop and compare angles without losing lineage.
4. Produce platform-native artifacts with visible costs and provenance.
5. Review and publish through the best available connector.
6. Observe outcomes and attach them to the exact decisions that produced them.
7. Propose a reusable lesson or skill; let the creator approve what Clark learns.

The result is not merely more content. It is a studio that becomes more aligned, more useful, and more operationally capable without becoming opaque.

## Product Invariants

1. **Local-first, not local-only.** The Mac owns the canonical personal state; optional cloud workers can perform remote jobs without owning identity or memory.
2. **Artifacts are durable; agents are replaceable.** Models and agent runtimes can change without corrupting project history.
3. **Every action has provenance.** Inputs, model, tools, skill version, cost, approvals, and outputs are recorded.
4. **Learning is proposed, never silently absorbed.** Memory and skill mutations are reviewable, reversible, and attributable to evidence.
5. **MCP is a protocol, not the product model.** Clark consumes MCP servers and exposes an MCP server, while its internal capability contract also handles auth, async work, idempotency, UI, cost, and lifecycle.
6. **The canvas cannot become spaghetti.** Templates, lanes, groups, Focus mode, and automatic layout are first-class.
7. **Publishing is policy-bound.** Platform rules, account permissions, AI disclosure, human approval, and fallback export are enforced by the harness.
8. **No throwaway architecture.** Delivery is incremental, but each stratum uses the production contracts, event log, migrations, security model, and observability foundation.
9. **Reuse engines; own creator truth.** Mature open-source tools enter through pinned, licensed, tested, reversible Tool Packs and never replace Clark's canonical creator, workflow, approval, memory, or provenance model.

## Authoritative Documents

Read these in order:

1. **[vision.md](vision.md)** — product thesis, target user, differentiation, principles, and boundaries.
2. **[the-canvas.md](the-canvas.md)** — the studio information architecture and visual grammar.
3. **[architecture.md](architecture.md)** — Mac application, harness, data, security, agent, and deployment architecture.
4. **[decisions/](decisions/README.md)** — accepted ADRs, rejected alternatives, invariants, revisit triggers, and verification gates.
5. **[contracts/](contracts/README.md)** — versioned JSON Schemas, event catalog, loop/capability/run contracts, exact 50-object fixture, negative cases, and reproducible verifier.
   - **[contract-runtime/](contract-runtime/README.md)** — offline generated TypeScript, drift enforcement, and immutable event upcasters.
6. **[security-and-threat-model.md](security-and-threat-model.md)** — assets, trust boundaries, threat register, credential flows, incident behavior, and security evidence requirements.
7. **[SECURITY.md](../SECURITY.md)** — private reporting path, supported-version policy, response objectives, and safe-testing rules.
8. **[memory-and-learning.md](memory-and-learning.md)** — creator model, memory types, reflection, skill evolution, and governance.
9. **[mcp-ecosystem.md](mcp-ecosystem.md)** — MCP client/server roles, capability adapters, skills, and social integration strategy.
   - **[mcp-conformance/](mcp-conformance/README.md)** — pinned SDK baseline and 36-case hostile Connect/Bridge Ground suite.
10. **[roadmap.md](roadmap.md)** — cumulative product strata and whole-product delivery gates; no throwaway MVP.
11. **[research-basis.md](research-basis.md)** — current external evidence and competitive reality behind the v2 decisions.
12. **[positioning-and-business.md](positioning-and-business.md)** — category, buyer, replacement target, packaging, economics, acquisition, and commercial validation gates.
13. **[ground-readiness-audit.md](ground-readiness-audit.md)** — requirement-by-requirement evidence and remaining blockers before implementation.
14. **[evidence/](evidence/README.md)** — versioned 34-entry Ground evidence ledger, anti-fabrication verifier, open blockers, and required signoff.
15. **[validation/](validation/README.md)** — observed creator, real-week design-partner, and binding purchase protocols with precommitted decision rules.
16. **[team-delivery-plan.md](team-delivery-plan.md)** — workstream ownership, dependencies, contract governance, readiness/done, and release evidence.
17. **[product/](product/)** — detailed v2 requirements, flows, epics, acceptance gates, and implementation contracts.
18. **[prototype/](prototype/README.md)** — clickable seven-surface studio concept using a 50-object Full-Week fixture and a structured evaluation guide.

## One-Line Pitch

> **Clark Pro is the Mac studio that remembers how you create, coordinates every tool you use, shows its work on a living canvas, and turns proven experience into reusable creative capability.**

## Current Status

Ground-stratum product-definition stage. The original social-content canvas concept has been expanded into the full Mac-first creator operating system, with a clickable Focus/Canvas/Timeline/Review/Library/Memory/Connections prototype, twenty-two accepted ADRs, and versioned contracts. Bridge state equivalence, governed skills and Tool Packs, the 19-case Wasmtime spike, the 36-case hostile MCP suite, and deterministic generated contracts/upcasting now pass at their stated Ground proof level. The OpenCut candidate is deliberately upstream-blocked rather than presented as a working integration. The machine-checked Ground ledger remains open: creator/commercial evidence, native Mac accessibility, named contract/team ownership, broader security-test ownership, and leadership signoff are not yet proven. Implementation should not fan out by treating Ground harnesses or prototype checks as production evidence.
