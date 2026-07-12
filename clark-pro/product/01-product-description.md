# Clark Pro — Product Requirements

**Status:** Authoritative v2 · July 2026
**Product:** Mac-first, memory-native creator operating system
**Companion documents:** [Vision](../vision.md) · [Studio and Canvas](../the-canvas.md) · [Architecture](../architecture.md) · [Memory](../memory-and-learning.md) · [MCP Ecosystem](../mcp-ecosystem.md) · [Delivery Plan](../roadmap.md)

## 1. Definition

Clark Pro is a Mac application and durable creator harness that connects intent, evidence, creative production, distribution, outcomes, memory, and reusable skills. It consumes external capabilities through MCP and other adapters, and exposes its own permissioned MCP server so other agents can operate the same canonical workspace.

## 2. Primary User and Job

The primary user is a professional operator-creator building a multi-channel personal brand without a production team.

**Functional job:** turn rough intent into a coordinated, published body of work across channels without losing context, state, or judgment.

**Emotional job:** feel in control of a capable studio rather than dependent on opaque automation.

**Strategic job:** compound creator knowledge, procedures, and evidence into an owned operating advantage.

## 3. Product Outcomes

1. **Continuity:** creators stop repeating identity, project, and process context across tools.
2. **Control:** every paid or mutating action is visible, permissioned, interruptible, and recoverable.
3. **Coherence:** artifacts across platforms remain connected to one intent and evidence base.
4. **Compounding:** corrections, successful procedures, and outcomes can become governed memory and skills.
5. **Portability:** canonical state remains exportable and useful without a hosted Clark service.
6. **Composability:** UI users, external agents, connectors, and skills operate through the same domain contracts.

## 4. Product Domains

### F0 — Mac host and capture

- Signed/notarized app, native lifecycle, menus, notifications, updates, and recovery.
- Global capture for text, URL, screenshot, file, selected content, and voice memo.
- Share and drag/drop paths into a workspace or inbox.
- Menu-bar status for active work and pending review.

### F1 — Workspaces, projects, and library

- Workspace is the privacy, identity, policy, account, and memory boundary.
- Projects organize campaigns, series, or ongoing bodies of work.
- Library stores sources, artifacts, templates, loops, and exports.
- Search spans text and metadata without merging workspace boundaries.

### F2 — Studio views

- Focus, Canvas, Timeline, Review, Library, and Memory are synchronized projections.
- Focus is the default operating view.
- Canvas supports semantic lanes, groups, typed primitives, staleness, branch, compare, and live runs.
- Dedicated editors handle long text and media without losing graph context.

### F3 — Durable harness

- Versioned loops compile into durable run plans.
- Dry-run validates dependencies, credentials, permissions, cost, policy, and gates.
- Runs support parallel branches, checkpoints, pause, interruption, retry, cancellation, and restart recovery.
- External mutations use intent receipts and reconciliation.

### F4 — Creator model and context

- Identity, semantic, episodic, procedural, and performance memory are separate types.
- Memory items carry scope, evidence, confidence, sensitivity, status, and lifecycle.
- Context is compiled per task and retrieval is traceable.
- Creator can inspect, correct, dispute, expire, export, or forget any item.

### F5 — Research and creative development

- Source import, research, claim ledger, citations, uncertainty, and saturation analysis.
- Angle development, human/agent decisions, branch, compare, and canonical selection.
- Script and long-form production with platform-aware but shared lineage.
- No unsupported precise performance predictions.

### F6 — Media production

- Image, audio, video, reel, B-roll, carousel, caption, thumbnail, and composite artifact types.
- Higgsfield is an initial media adapter, not a permanent hard dependency.
- Local media workers validate, normalize, preview, caption, and package.
- Async jobs reconnect after restart and preserve provider IDs and cost.

### F7 — Review, policy, and trust

- Gates for human approval, evidence, brand, platform, disclosure, accessibility, confidentiality, and budget.
- Native platform previews and version comparison.
- Decision receipts include alternatives, evidence, actor, and reversibility.
- Autonomy is a policy matrix by action class and workspace, not one global slider.

### F8 — Distribution mesh

- Postiz is the first broad social adapter through MCP/API/CLI.
- Direct official connectors are added where strategically justified.
- Assisted handoff and deterministic export are permanent fallbacks.
- Publication intent, scheduled, submitted, verified, failed, removed, and exported states remain distinct.
- Timeline unifies production and distribution state.

### F9 — Observation and learning

- Collect quantitative, qualitative, and creator-judgment observations.
- Link outcomes to exact artifact and decision lineage.
- Show sample size, missingness, freshness, and uncertainty.
- Reflection proposes memories, experiments, strategies, or skill changes.
- Promotion requires policy-defined review and is reversible.

### F10 — Skills and ecosystem

- Install Agent Skills packages with quarantine, permission review, tests, revisions, and rollback.
- Propose skills from successful or corrected trajectories.
- Clark Connect hosts external MCP servers and capability adapters.
- Clark Bridge exposes permissioned tools, resources, prompts, and durable jobs.
- Clark Kit supports connectors, capabilities, renderers, loops, templates, policies, and skills.

### F11 — Team and elastic execution

- Roles, assignments, comments, shared approval, and workspace policies.
- Encrypted event synchronization and asset mirroring.
- Scoped remote workers for schedules and long jobs.
- Personal and team memory remain separate unless explicitly shared.

## 5. Core Requirements

### Data and provenance

- Every artifact is versioned and content-addressed where applicable.
- Every external call records capability revision, provider, inputs, outputs, timing, cost, and permission receipt.
- Every publication traces to its approved artifact version.
- Every active memory or skill revision traces to evidence and a promotion event.

### Reliability

- Restart cannot lose canonical state, approval state, or external job identity.
- Ambiguous publication failures enter reconciliation rather than blind retry.
- Connector outages degrade to export.
- Backups, migration preview, import, and rollback are first-class.

### Security

- Renderer has no direct secrets, shell, filesystem, or arbitrary network authority.
- Credentials live in macOS Keychain behind scopes and leases.
- MCP servers, skills, and connectors are untrusted until reviewed.
- Remote context obeys sensitivity and workspace policy.
- Clark Bridge is localhost-only by default with explicit scoped clients.

### Usability

- Common loops require no manual graph construction.
- Every blocked state explains the cause and valid next actions.
- The creator can answer what happened, why, what it cost, and what will change.
- Canvas complexity is managed through lanes, groups, filters, templates, and Focus mode.

## 6. Non-Goals

- Training proprietary foundation models.
- Becoming a generic workflow automation platform.
- Circumventing platform policy or hiding AI disclosure.
- Optimizing solely for follower count or reach.
- Silent self-modification of memory, skills, or strategy.
- Requiring cloud storage for canonical personal state.
- Promising every social platform through direct Clark-owned integrations.

## 7. Success Measures

### Product utility

- Time from capture to first reviewable artifact.
- Human edit time and revision count per approved artifact.
- Cost per approved and per published artifact.
- Weekly active creator loops and four-week retention.
- Percentage of weekly work completed inside one canonical Clark workspace.

### Trust and reliability

- Duplicate or unknown publication rate.
- Recovery success after forced interruption.
- Percentage of paid/mutating actions with complete receipts.
- Policy warning precision and override rate.
- Backup restore and migration success.

### Personalization

- Memory retrieval helpfulness feedback.
- Memory proposal acceptance, edit, rejection, and correction rates.
- Percentage of outputs with visible memory/skill references.
- Skill success, regression, and rollback rates.
- Time required to correct or forget a belief.

### Creative outcomes

- Creator-rated publishability and satisfaction.
- Evidence coverage and factual correction rate.
- Platform-specific outcome distributions with sample size.
- Production consistency without loss of creator voice.

Follower targets belong to the Creator plan, not Clark product acceptance.

## 8. Resolved Decisions

| Decision | Resolution |
|---|---|
| First product surface | Signed/notarized Mac application. |
| Desktop framework | Electron with hardened renderer and isolated harness process. |
| Default interaction | Focus mode with templates; Canvas is advanced visibility/control. |
| Canonical ownership | Local Mac event log, asset store, memory, and Keychain credentials. |
| Model runtime | Provider-neutral gateway; no required single-vendor Agent SDK. |
| MCP role | Clark is both MCP host/client and permissioned MCP server. |
| Social breadth | Postiz first, direct adapters selectively, assisted/export always. |
| Learning | Evidence-bound proposals; no silent memory or skill promotion. |
| Delivery | Cumulative production strata; no throwaway MVP architecture. |

## 9. Riskiest Assumptions

1. Focus + Canvas is meaningfully better than a strong linear production interface.
2. Creators value continuity, provenance, and memory enough to adopt a desktop operating layer.
3. The creator-model review burden remains lower than the value it creates.
4. Postiz and selected providers supply enough publishing/analytics coverage without Clark owning every integration.
5. A Mac-local canonical system can support schedules and teams through scoped remote execution without confusing state.
6. Evidence-linked learning improves creator judgment without overfitting small, noisy platform data.
7. The plugin/skill ecosystem can remain powerful while permissioned and understandable.

Each assumption requires representative workflow evidence before its dependent strata expand.
