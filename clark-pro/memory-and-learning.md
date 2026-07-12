# Clark Pro — Memory, Personalization, and Learning

## Thesis

Personalization is not a long system prompt and memory is not a vector database. Clark's creator model is a governed set of claims about the creator, their operation, their work, and observed outcomes. Every claim has a type, source, confidence, scope, lifecycle, and correction path.

The model should become more useful with experience without becoming more certain than the evidence allows.

## Five Memory Layers

### 1. Identity and brand constitution

High-importance, low-churn rules explicitly owned by the creator:

- identity and positioning;
- target audiences;
- voice and taste;
- active projects and goals;
- visual language;
- values and prohibited behaviors;
- confidentiality and reputational boundaries;
- channel roles;
- accessibility and disclosure preferences.

These are edited directly or promoted through explicit review. They are never inferred into permanence from a single post.

### 2. Semantic operating knowledge

Durable facts useful across work:

- recurring people, products, projects, and terms;
- account and platform metadata;
- reusable claims and source records;
- preferred tools, formats, models, and settings;
- constraints such as time, money, or available equipment.

Each item supports validity windows and source references.

### 3. Episodic memory

What happened in specific sessions and runs:

- decisions and alternatives;
- creator edits and corrections;
- failures and recovery paths;
- published versions;
- qualitative creator judgment;
- conversations relevant to a project;
- tool trajectories and run summaries.

Episodes are summarized for retrieval but retain links to original events.

### 4. Procedural memory

How repeatable work is performed:

- loop definitions;
- templates;
- checklists;
- prompt/context recipes;
- Agent Skills;
- connector procedures;
- evaluation rubrics;
- recovery playbooks.

Procedures are versioned, testable, scoped, and rollbackable.

### 5. Performance evidence

Observed outcomes attached to exact publication lineage:

- impressions, views, watch time, retention, saves, comments, replies, clicks, conversions;
- time and cost to produce;
- creator satisfaction and revision count;
- platform, audience, date, format, topic, hook, angle, length, media, and distribution state;
- missing metrics and known measurement problems.

Performance memory supports descriptive comparison and retrieval. It does not claim causality from small samples.

## Memory Item Contract

Every active item includes:

```yaml
id: mem_...
type: identity | semantic | episodic | procedural | performance
statement: "Direct, specific openings are preferred over generic list hooks."
scope: workspace | project | platform | loop | account
status: proposed | active | disputed | expired | forgotten
confidence: 0.74
evidence:
  - eventId: decision_...
    relation: supports
  - observationId: obs_...
    relation: weakly-supports
createdBy: human | reflection-agent | import
createdAt: ...
validFrom: ...
validUntil: null
supersedes: null
sensitivity: normal | personal | confidential | secret-reference
retrievalPolicy: default | explicit-only | never-send-to-model
```

Confidence is an aid to review and retrieval, not a truth score.

## Write Path

Clark does not write directly from an agent conclusion to active memory.

```text
events + observations + corrections
        ↓
reflection candidate
        ↓
deduplicate / detect contradiction
        ↓
memory proposal with evidence and uncertainty
        ↓
policy gate
        ↓
human approve / edit / reject / defer
        ↓
active revision + audit event
```

Low-risk ephemeral facts may be auto-accepted under an explicit policy, but identity, confidential, strategic, and procedural mutations require review by default.

## Retrieval Path

Retrieval is task-specific and layered:

1. Apply workspace, project, platform, sensitivity, and recency filters.
2. Include mandatory constitution and policy items.
3. Retrieve structured matches by entities, topics, loop, and platform.
4. Retrieve relevant episodes using text search and bounded similarity.
5. Add performance aggregates with sample size and uncertainty.
6. Add relevant skill and correction history.
7. Compile a context packet within a token and privacy budget.
8. Record item references and whether they influenced the output.

The agent receives cited memory summaries, not an unbounded dump.

## Correction and Forgetting

The Memory view must support:

- edit with before/after diff;
- mark wrong or disputed;
- identify contradicting items;
- scope an item more narrowly;
- expire at a date;
- forget an item and remove it from retrieval;
- trace all artifacts and decisions influenced by an item;
- export all active and historical revisions;
- delete derived embeddings and summaries when the source is forgotten.

Forget is a real operation, not hiding a row from the UI.

## Creator Model Sections

The human-readable model is organized as:

- **Who I am** — identity, expertise, boundaries.
- **Who I serve** — audience segments and jobs.
- **What I am building** — projects, campaigns, goals.
- **How I sound** — voice rules with examples and counterexamples.
- **How I look** — visual identity and reusable assets.
- **How I work** — cadence, tools, budgets, approval preferences.
- **What has evidence** — structured observations and comparisons.
- **What Clark is uncertain about** — conflicts, gaps, and pending proposals.
- **What Clark has learned to do** — active loops, templates, and skills.

## Reflection Loop

Reflection is a scheduled or manually invoked loop with a strict output schema.

### Inputs

- recent runs and decisions;
- publication observations;
- creator corrections;
- failures and recovery;
- existing active memories and skills;
- sample-size and measurement warnings.

### Outputs

- no change;
- memory proposal;
- contradiction proposal;
- skill creation/update proposal;
- experiment proposal;
- connector reliability update;
- policy warning.

### Guardrails

- Cite evidence IDs.
- Distinguish creator preference from audience outcome.
- Distinguish correlation from causal claim.
- Report sample size and missing data.
- Prefer a scoped, reversible proposal over a global rule.
- Never optimize solely for reach when the creator has authority, safety, or reputation goals.

## Skill Evolution

Clark supports the Agent Skills directory format: a skill has `SKILL.md` and may include scripts, references, and assets.

### Sources of skill proposals

- A complex run completed successfully.
- A repeated manual correction reveals a stable procedure.
- A connector failure produced a reliable recovery path.
- The creator explicitly asks Clark to learn a workflow.
- An installed skill produces repeated failures and needs a revision.

### Promotion pipeline

1. Extract a procedure from the trajectory.
2. Generalize only the stable parts.
3. Declare required tools, permissions, inputs, outputs, and compatibility.
4. Generate examples and regression cases.
5. Run in a sandbox against fixtures or a dry-run environment.
6. Present a diff and evidence to the creator.
7. Promote as a new revision or reject.
8. Monitor reliability and roll back automatically on regression threshold.

Skills do not receive unrestricted tools merely because their text asks for them. Effective permissions are the intersection of skill declaration, capability trust, workspace policy, and run approval.

## Performance Learning Without False Science

Clark begins with descriptive evidence:

- medians and ranges rather than single winners;
- platform-specific comparisons;
- sample counts on every aggregate;
- production cost and creator satisfaction beside reach;
- time-window and audience-growth context;
- explicit missingness;
- comparable cohorts where possible.

An angle recommendation can say:

> Three prior LinkedIn explainers in this topic family had higher median saves than two hot takes. The sample is small; treat this as a weak preference, not a prediction.

Clark should not assign precise “predicted strength” scores until there is a validated scoring method and enough data.

## Privacy and Safety

- Canonical memory is local by default.
- Sensitive items can be `explicit-only` or `never-send-to-model`.
- Remote model context is logged as item references and redacted summaries.
- Secret values are never memory items; only Keychain references are stored.
- Workspaces provide hard retrieval boundaries.
- Team members do not automatically inherit personal memory.
- Imported archives are quarantined until reviewed for scope and sensitivity.

## Memory Quality Metrics

- retrieval precision judged by creator feedback;
- percentage of outputs with traceable memory references;
- correction rate by memory type;
- stale/expired item rate;
- contradiction-resolution time;
- proposal acceptance and edit rates;
- skill success and rollback rates;
- percentage of sensitive context sent remotely;
- creator ability to answer “why did Clark do this?” within one interaction.
