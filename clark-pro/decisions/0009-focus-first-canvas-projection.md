# ADR-0009 — Focus-First Studio and Canvas Projection

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Product, Design, Domain

## Context

A visual graph can make lineage and branching legible, but a 50-object workflow overwhelms normal daily operation and asks creators to become automation engineers. Treating the canvas as the database couples product truth to one visual layout. Removing the canvas entirely would weaken expert inspection, branching, impact analysis, and programmable loops.

## Decision

Focus is the default Studio view and presents the next bounded decision or intervention with context, evidence, impact, cost, and authority. Canvas is the richest projection of the same canonical creative graph, with semantic lanes, typed objects, collapsible loops, critical-path default, selected lineage, relationship filters, impact preview, and a consistent object provenance contract.

Timeline, Review, Library, Memory, and Connections are synchronized projections over the same objects, events, permissions, and runs. No view owns separate project truth.

## Consequences

### Positive

- New users can run proven loops without graph knowledge.
- Experts retain full lineage, branching, rewiring, and live execution visibility.
- Product complexity is disclosed progressively rather than hidden permanently.
- The canvas differentiates through provenance and control, not novelty of nodes.

### Costs

- Cross-view state consistency and orientation require disciplined projection design.
- Focus recommendations must never hide consequential cost, policy, or downstream impact.
- Canvas layout, accessibility, and performance remain substantial product work.

## Rejected alternatives

- **Blank canvas onboarding:** high cognitive and configuration burden.
- **Canvas as canonical database:** makes layout edits indistinguishable from domain mutations.
- **Linear wizard only:** insufficient for expert lineage, parallel branches, and intervention.
- **Chat as the primary durable surface:** conversations do not provide versioned creative state.
- **Show every edge by default:** recreates the spaghetti-canvas failure mode.

## Invariants

1. Every visible state maps to a domain object, event, projection, or explicit presentation-only state.
2. Focus never performs a paid or mutating continuation without showing its run contract.
3. Selecting a post exposes source, current version, cost, approval, publication, outcome, and permission state.
4. Canvas layout changes do not silently mutate workflow semantics.
5. Studio and Bridge commands produce the same canonical events.

## Verification gates

- Five representative creators complete the evaluation rubric with observed evidence.
- A new user operates the common loop without graph knowledge.
- An expert finds complete post lineage within ten seconds.
- A 50-object project remains legible and keyboard/screen-reader operable.
- Changing an upstream decision exposes stale work, reusable work, invalid approvals, schedule risk, and regeneration cost before execution.

## Revisit triggers

- Human testing shows Focus and Canvas create more orientation cost than continuity value.
- Creators consistently avoid the canvas even for lineage, impact, and advanced control.
- A different projection proves materially clearer without weakening domain invariants.
