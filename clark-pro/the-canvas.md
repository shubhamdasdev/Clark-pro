# Clark Pro — Studio and Canvas Specification

## The Canvas Is a View, Not the Database

Clark's underlying truth is a versioned creative graph and immutable event history. The canvas is the richest visual projection of that truth, but it is not the only way to work.

This distinction matters. Most creators should be able to run a proven loop without wiring nodes. Experts should be able to open the graph, inspect lineage, branch, compare, replace capabilities, and author new loops.

## One Project, Six Views

All views operate on the same objects, versions, runs, and permissions.

| View | Primary question | Default user action |
|---|---|---|
| **Focus** | What needs my attention now? | Decide, edit, approve, retry, or continue. |
| **Canvas** | How is the work connected? | Inspect lineage, branch, rewire, compare, or run. |
| **Timeline** | What happens when? | Schedule, sequence, and see production/publish state. |
| **Review** | Is this safe and good enough to ship? | Compare versions, inspect sources, approve, reject, or request change. |
| **Library** | What do I already have? | Reuse artifacts, templates, sources, and successful patterns. |
| **Memory** | What does Clark believe and why? | Inspect, correct, promote, expire, or forget. |

Focus is the default. Canvas is one click away. A blank canvas is never the onboarding experience.

## The Canvas Layout

The default graph flows through six semantic lanes from left to right:

```text
INTENT → EVIDENCE → CREATIVE → PRODUCTION → DISTRIBUTION → OUTCOMES
```

Each lane can collapse into a summary group. Cross-lane dependencies are allowed, but the layout engine warns when a graph becomes difficult to read.

### Persistent chrome

- **Top run bar:** run, pause, resume, stop, dry-run, active policy, budget, estimated cost, model mode, and current run health.
- **Left studio rail:** projects, templates, capability palette, installed skills, connected accounts, and search.
- **Right inspector:** selected object's content, versions, configuration, inputs, outputs, permissions, cost, evidence, and history.
- **Bottom activity strip:** run events, async jobs, scheduled work, notifications, and logs.
- **Command field:** natural-language steering that always resolves to a visible proposed graph change or run command before execution.

## Visual Grammar

Calling everything a node makes the product hard to understand. Clark uses five visually distinct primitives.

### 1. Artifacts — durable things

Artifacts are the primary objects the creator owns:

- idea;
- source;
- research brief;
- claim;
- angle;
- script;
- image;
- audio;
- video;
- carousel;
- platform post;
- published post;
- outcome report;
- memory proposal;
- skill proposal.

Artifacts have append-only versions, canonical selection, provenance, status, and previews. Editing an artifact creates a new version. Prior versions remain addressable.

### 2. Operators — actions over artifacts

Operators transform, inspect, or move artifacts:

- deterministic transform;
- agent task;
- MCP tool call;
- local command;
- media render;
- platform adapter;
- publisher;
- analytics pull;
- evaluator.

Operators display provider, capability, permissions, budget class, expected duration, and last reliability. They are not durable creative output; their executions are recorded as runs.

### 3. Decisions — human or policy choices

Decision cards make judgment explicit:

- select an angle;
- choose a take;
- accept a claim;
- approve a post;
- resolve a policy warning;
- promote a memory;
- install or update a skill.

A decision shows who or what made it, alternatives considered, evidence shown, and whether it can be reversed.

### 4. Gates — constraints that must pass

Gates enforce:

- human approval;
- fact/evidence coverage;
- brand rules;
- platform requirements;
- budget ceilings;
- AI-content disclosure;
- legal or confidentiality policy;
- asset quality thresholds.

Gates are enforced by the harness, not merely drawn in the UI.

### 5. Loops — reusable durable workflows

A loop is a versioned group with:

- typed entry contract;
- success contract;
- internal graph;
- permissions;
- cost and time budget;
- checkpoint policy;
- recovery policy;
- evaluation rubric;
- reflection policy.

Loops can be collapsed to one card, opened as a sub-canvas, saved as templates, scheduled, called through MCP, or invoked by another loop.

## Edge Types

Edges communicate meaning, not merely connectivity.

| Edge | Meaning | Visual treatment |
|---|---|---|
| **Data** | Output becomes an input. | Solid neutral line. |
| **Control** | Completion or decision enables the next step. | Arrowed line. |
| **Evidence** | A source or outcome supports a claim, decision, or memory. | Thin blue line with citation marker. |
| **Learning** | An observed result can propose a memory, strategy, or skill change. | Dashed violet line; never auto-promoted by default. |
| **Policy** | A rule constrains an action. | Red/gold line visible on selection. |

Ports are typed. Connection errors explain the mismatch and offer valid adapters.

## The Default Full-Week Loop

```text
Capture
  ↓
Intent + relevant Creator Model context
  ↓
Research + claim ledger + saturation scan
  ↓
Angle set → Decision
  ↓
Platform scripts in parallel
  ↓
Media production + deterministic adapters
  ↓
Evidence / brand / cost / platform gates
  ↓
Human review
  ↓
Postiz or direct publisher connectors
  ↓
Publish verification
  ↓
Outcome observation
  ↓
Reflection → memory and skill proposals → Human promotion
```

The creator can run this from Focus mode as a guided sequence or open the entire graph.

## Canvas Behaviors

### Staleness and impact

Changing a canonical artifact recalculates downstream input hashes. Affected artifacts become stale but are never destroyed. Before regeneration, Clark shows:

- what will change;
- what can be reused;
- estimated cost;
- approvals that will be invalidated;
- scheduled posts at risk.

### Branch and compare

Any artifact can branch. Compare supports text diff, image A/B, synchronized video playback, cost, evidence coverage, policy status, and creator annotations. Promoting a branch is an explicit decision event.

### Live execution

During a run, operators show queued, waiting, running, streaming, blocked, retrying, complete, failed, cancelled, or orphaned state. Async provider jobs reconnect by durable external ID after restart.

### Dry-run

Dry-run compiles the graph without paid or mutating calls. It checks capability availability, credentials, permissions, port types, platform rules, budgets, and expected human gates.

### Intervention

The creator can pause a branch, edit an artifact, redirect an agent, change a model, replace a tool, or lower autonomy. Unaffected branches continue when safe.

### Explain mode

Every recommendation and proposed mutation has a “Why?” affordance showing retrieved memories, sources, policies, skill versions, and uncertainty.

## Avoiding Canvas Failure Modes

### No spaghetti

- semantic lanes and automatic layout by default;
- loops and campaigns collapse into groups;
- edge bundling for repeated context;
- filters for data, control, evidence, learning, or policy edges;
- Focus mode for normal operation;
- graph complexity warnings;
- templates start opinionated and editable.

### No tiny-dashboard problem

Media and long text open into dedicated editors while preserving graph context. The canvas preview is a summary, not the only editing surface.

### No fake agent theater

Animations represent real state transitions. Clark never invents an “agent thinking” visualization that is not backed by events.

### No black-box learning

Learning edges end in proposals. Permanent memory or skill changes require policy-based approval and retain the evidence used.

## Mac-Specific Interaction

- Global quick capture for text, URL, screenshot, selected file, or voice memo.
- Share extension for Safari, Finder, Photos, and supported apps.
- Drag files, folders, browser links, and media directly onto a project.
- Menu-bar run status and review queue.
- Native notifications for decisions, failed runs, completed renders, and scheduled-publish problems.
- Quick Look previews and Finder reveal for local assets.
- Keyboard-first command palette and undo/redo aligned with Mac conventions.
- Credentials stored through macOS Keychain; the canvas never displays raw secrets.

## Canvas Quality Gate

The canvas design is ready for implementation only when a clickable prototype proves all of the following with representative real content:

1. A new user can run the Full-Week loop from Focus mode without understanding graphs.
2. An expert can open Canvas and identify source, current version, cost, approval state, publish state, and outcome lineage for any post within ten seconds.
3. Editing an angle clearly explains downstream impact before spending money.
4. Comparing two scripts and two reels is easier than opening separate tools.
5. A memory proposal shows evidence and can be corrected or rejected in place.
6. A 50-object project remains legible through lanes, groups, filters, and Focus mode.
7. The same project can be operated through UI or Clark Bridge without state divergence.
