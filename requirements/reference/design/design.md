# Design Brief — Clark Pro

**Project:** clark-pro
**Version:** 1.0
**Updated:** 2026-07-13
**Sources:** [Current desktop tokens](../../../clark-pro/apps/desktop/src/renderer/app.css), [Verified prototype](../../../clark-pro/prototype/index.html), [Authoritative flows](../../flows/)

---

## Design Philosophy

| # | Principle | Derived from |
|---|-----------|-------------|
| 1 | Focus before graph — show the next consequential decision first, with Canvas one action away. | Operator-Creator pain: opaque automation and fragmented evidence |
| 2 | Authority is visible before action — permissions, exact revisions, cost, evidence, and reversibility precede every mutation. | Trust-Conscious Operator goal and 100% mutation-receipt metric |
| 3 | Evidence and uncertainty stay distinct — structural completeness, observed proof, preference, and hypothesis never share one status. | North Star and Ground evidence requirements |
| 4 | Recovery is a first-class state — every interrupted path names what recovered, paused, failed, reconciles, or needs a creator. | Durable Harness and publication invariants |
| 5 | Dense, calm, keyboard-first Mac craft — professional information density without hiding labels, focus, or state in decoration. | Native Studio scope, accessibility story, current shell evidence |

---

## Visual Language

The production direction extends the implemented Clark Studio dark shell. The older light prototype remains evidence for information architecture, not a competing token source.

| Token | Value | Notes |
|-------|-------|-------|
| Background | `#111318` | Current Electron shell `--bg` |
| Surface | `#181B21` | Panels and cards |
| Surface raised | `#20242C` | Selected rows, overlays, inspectors |
| Border / divider | `#313641` | Increase to `#737B89` under increased contrast |
| Text primary | `#F5F3ED` | Warm white; WCAG AA on Background |
| Text secondary | `#9AA3B2` | Secondary labels; avoid below 12px for long copy |
| Brand / primary action | `#FF6B35` | Creator decision and active selection |
| Brand soft | `#3A241D` | Selection halo and low-emphasis accent surface |
| Focus ring | `#7AB8FF` | 3px visible keyboard focus |
| Success | `#63D297` | Always paired with state text/icon |
| Warning | `#E7B85D` | Pending, quarantine, reconciliation |
| Destructive | `#F1A4A4` on `#321D1D` | Forget, revoke, destructive rollback |
| Font family | Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, “SF Pro Text”, sans-serif | Matches current shell |
| Monospace | ui-monospace, SFMono-Regular, Menlo, monospace | Hashes, schemas, receipts, code |
| Base font size | 13px application density; 16px minimum for long-form editor content | Dense Mac tool, readable content |
| Spacing unit | 4px grid | Existing shell values normalize to 4/8/12/16/20/24 |
| Radius | 8px controls, 12px panels, 999px pills | Current shell |

---

## Component Library & Framework

| Concern | Decision | Notes |
|---------|----------|-------|
| Styling framework | Tokenized CSS Modules plus shared CSS custom properties | Extend current `app.css`; no utility framework or parallel theme system |
| Component library | Clark-owned semantic React components listed below | Trust and evidence states are domain-specific; build on native HTML semantics |
| Graph | React Flow custom nodes and lanes | Canonical state remains in Harness projections |
| Icon set | Lucide, bundled locally | Already used in the verified prototype; no runtime CDN |
| Animation | CSS transitions for state and layout; React Flow motion only where it preserves orientation | Respect reduced motion; no decorative blocking animation |
| Form handling | Controlled React forms with schema validation through typed IPC | Do not duplicate canonical schema logic in renderer |

### Component Inventory

| Component | Contract | Used for |
|-----------|----------|----------|
| ClarkAppShell | Window-safe page shell with titlebar spacing, command routing, landmark structure, and durable loading boundary. | All full-screen Studio surfaces |
| ClarkRailNav | Keyboard-operable primary rail for Focus, Canvas, Timeline, Review, Library, Memory, Connections, and Observation. | Primary navigation |
| ClarkViewHeading | Eyebrow, one H1, supporting copy, primary action, and state badge. | Every screen header |
| ClarkPanel | Bordered surface container with semantic heading and optional actions. | Lists, summaries, inspectors |
| ClarkMetricCard | Value, definition, freshness, comparison context, and missingness state. | Observation and operational summaries |
| ClarkNodeCard | Typed Canvas object card with selection, authority, evidence, and stale states. | Canvas only |
| ClarkStateBadge | Text-plus-color state indicator using bounded domain enums. | Runs, trust gates, publications, packages |
| ClarkActionButton | Primary, secondary, quiet, and destructive action with pending/disabled states. | All actionable surfaces |
| ClarkFormField | Label, description, control, validation, and sensitivity hint. | Setup, capture, decisions |
| ClarkDataTable | Keyboard-readable table with sticky headings, sorting, empty/error states, and row actions. | Evidence, receipts, compatibility |
| ClarkTrustGate | Named trust/evidence gate with pass, pending, block, reason, and remediation. | Connections, approvals, packages, Skills |
| ClarkInspector | Contextual detail pane preserving selected object identity across refresh. | Canvas, Review, Memory, package review |
| ClarkDialog | Blocking, focus-trapped confirmation for authority, destructive action, or external mutation. | All Modal units |
| ClarkOverlay | Dismissible slide-over that preserves parent context and unsaved-change protection. | All Overlay units |
| ClarkTimelineRow | Artifact/account/time/state row with receipt and reconciliation affordances. | Timeline |
| ClarkDiffViewer | Text diff or synchronized media comparison with evidence and annotation rails. | Review and revision diffs |
| ClarkLineageList | Revision/evidence/influence timeline with stable links and redaction states. | Memory and provenance |
| ClarkEmptyState | Reason-specific empty state with one recovery or creation action. | Lists and first-run screens |
| ClarkToast | Non-blocking success or recoverable-error notice; never used for irreversible decisions. | Cross-surface feedback |

---

## Navigation Patterns

| Concern | Decision | Notes |
|---------|----------|-------|
| Primary navigation | Persistent left rail: Focus, Canvas, Timeline, Review, Library, Memory, Connections; Observation is contextual from verified publications | Focus remains default; Command Palette exposes every surface |
| Screen transitions | Same-window route/projection switch; preserve project, selected object, scroll, and keyboard focus | No web-style full-page reload |
| Back navigation | Native Mac menu/shortcut plus explicit Back where an inspection path has history | Escape dismisses topmost overlay only |
| Deep linking | `clark://` links to workspace-safe object references after scope validation | Never embed bearer material |
| Modal presentation | Modal for authority/destructive/external mutation; Overlay for comparison, inspection, and contextual editing | Exact distinctions are encoded in UF docs |
| Quick capture | Global shortcut and Share entry open a compact overlay independent of current surface | Capture never starts paid work |

---

## Authentication Gates

Clark is local-first and has no mandatory product account for personal work. Authentication is capability- and workspace-scoped rather than a global sign-in wall.

| Action | Authorization Required | Rationale |
|--------|:---:|-----------|
| Open personal local workspace and inspect canonical state | No | Local ownership remains usable offline and during hosted failure |
| Connect provider, social account, or MCP client | Yes — provider/pairing flow | Grants external or client authority |
| Start paid or capability-using run | Yes — exact run approval | Binds permission, budget, revisions, and intent |
| Promote memory, Skill, or Tool Pack | Yes — explicit creator/admin decision | Trust promotion cannot be implicit |
| Publish, schedule, revoke, forget, or change shared authority | Yes — exact mutation decision | Irreversible or externally visible consequence |
| Access a shared/team workspace | Yes — workspace role and device identity | Personal and team authority must remain separate |

---

## Key UX Patterns

### Empty States
Every list or work surface explains why it is empty, whether that is safe/expected, and offers one relevant action. Empty must not be confused with failed loading or filtered-out sensitive data.

### Loading & Skeletons
Render the durable local shell and last verified state first. Use skeletons for local projections, per-source freshness for external data, and explicit progress rows for long jobs. A spinner never hides the identity of the exact version or intent being processed.

### Error Handling
Inline validation handles correctable input. A persistent gate row handles policy, trust, schema, and evidence blocks. A toast is limited to non-blocking feedback. Recovery, reconciliation, and destructive failures use their named screen or modal because they change authority.

### Confirmation Dialogs
Require `ClarkDialog` for publication, promotion, revocation, forgetting, activation, rollback, and exact-version approval. The primary action names the mutation; Cancel is always available before commit.

### Provenance and Staleness
Every generated artifact can reveal inputs, provider/model, Skill, memory, Tool Pack/capability revisions, run/step, cost, and human edit. Stale status is text plus icon/color and invalidates approval visibly.

### Recovery and Reconciliation
Interrupted local work routes through Recovery Summary. Ambiguous external mutations route through Reconciliation. Neither uses blind retry, generic “something went wrong” copy, or optimistic terminal status.

---

## Accessibility

| Concern | Standard | Notes |
|---------|---------|-------|
| Color contrast | WCAG 2.2 AA; 4.5:1 normal text, 3:1 large text and non-text indicators | State never relies on color alone |
| Pointer targets | 44×44 CSS px minimum for primary actions; dense rows expose a full-row target | Mac pointer precision does not remove accessibility requirements |
| Keyboard | All actions reachable; logical tab order; arrows within composite widgets; Escape dismisses one layer | Shortcuts appear in menus and help |
| Screen reader | One visible H1 per view, landmarks, live-region status for runs, labeled icon-only buttons | VoiceOver evidence required before external release |
| Dynamic text | Layout survives 200% zoom and increased macOS text/contrast settings | Canvas inspector reflows; no clipped gates |
| Motion | Respect reduced motion; state changes remain understandable with animation removed | No auto-playing media with audio |
| Data visualization | Tables accompany charts; freshness, sample size, and missingness are textual | Applies to Observation and diagnostics |

---

## Tone & Voice

| Rule | Source | Example |
|------|--------|---------|
| Calm, precise, and accountable; say what Clark knows, what it does not know, and what changed. | Brief constraints and evidence-honest product positioning | “Evidence is still required” not “Validated” |
| Name the actor and exact object for authority decisions. | Provenance and approval invariants | “Approve artifact version 4” not “Approve” |
| Explain recovery in operational language with a next action. | Durable Harness and reconciliation rules | “Publication result is unknown; check provider state before retrying.” |
| Never market a planned or blocked integration as available. | Tool Pack/OpenCut decision | “Blocked upstream — no executable capability” |

---

## Copy & Strings

All new UI copy is canonical in `requirements/locales/en.json`. During the current framework-light shell, the renderer may consume the same JSON through a small typed loader; the accepted React renderer should use i18next. DS Copy tables mirror these exact values.

- Keys are nested by visual-unit slug or shared namespace.
- Interpolation uses `{{variable}}`; no source content, secrets, or raw identifiers appear in translation keys.
- Visible state terms use the canonical domain enum plus plain-language explanation.
- Coding agents add the string key before using the copy; hardcoded user-visible strings are not accepted.

---

## Implementation Notes

1. Use the Clark component contracts above and the tokens in `design-tokens.md`; do not introduce a second component library or theme.
2. Use exact copy from `locales/en.json` and the linked DS spec.
3. Enforce the authorization decision in Harness/typed IPC; the renderer may present a gate but cannot grant itself authority.
4. Implement every DS state, including loading, empty where applicable, error, stale, quarantined, and needs-reconciliation variants.
5. Preserve keyboard focus and the selected exact object across projection refresh, overlay dismissal, and recovery.
6. Validate state with canonical schemas at the preload and Harness boundary; do not pass executable command strings.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created from the implemented Mac shell, verified prototype, architecture, and 15 authoritative user flows. |
