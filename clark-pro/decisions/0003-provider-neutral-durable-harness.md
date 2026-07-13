# ADR-0003 — Provider-Neutral Durable Harness

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Harness, AI, Evaluation, Reliability

## Context

Creator work includes deterministic transforms, model calls, tool-using agents, long media jobs, human decisions, schedules, external publication, and later reflection. Vendor agent SDKs optimize one runtime but do not define Clark's canonical recovery, approval, cost, provenance, or policy semantics. Treating every step as an autonomous agent would increase latency, cost, opacity, and failure surface.

## Decision

Clark Harness owns a provider-neutral run protocol and compiles versioned loops into durable run plans. It supports deterministic operators, structured one-shot model calls, bounded tool-using loops, specialist agents, parallel delegates, external async jobs, human gates, schedules, compensation, reconciliation, and boot recovery.

Models and vendor agent runtimes are adapters selected per step by quality, privacy, latency, and cost. Most classification, validation, adaptation, and deterministic media work does not use an autonomous agent loop.

## Consequences

### Positive

- Providers can change without corrupting domain history or workflow definitions.
- Every step shares budgets, permissions, state transitions, cancellation, and receipts.
- Agent autonomy is bounded by the loop contract and capability policy.
- Recovery remains Clark's product behavior rather than a provider feature.

### Costs

- Clark must own orchestration, state machines, evaluation, and provider conformance.
- Adapter behavior must normalize streaming, tool calls, async jobs, and error classes without erasing provider-specific capability.
- Determinism is limited where providers are nondeterministic; receipts and fixtures must capture enough context to diagnose.

## Rejected alternatives

- **One vendor Agent SDK as the core runtime:** creates provider lock-in and delegates canonical semantics.
- **Autonomous multi-agent system for every task:** maximizes theater and cost while reducing control.
- **Simple queue of API calls:** cannot represent human gates, lineage, async recovery, or reconciliation.
- **Embedding workflow logic in the renderer:** violates durability and process isolation.

## Invariants

1. A run is compiled from a pinned loop revision, capability revisions, policy revision, and input versions.
2. Paid and mutating work has a quote, budget class, intent ID, and permission receipt.
3. External async jobs retain provider IDs and reconnect after restart.
4. Retry is based on classified safety and idempotency, never on “failed therefore retry.”
5. Human decisions are explicit wait states and events.
6. Agent tool use cannot exceed step allowlists, budgets, or leases.

## Verification gates

- Forced termination is tested at every run/step transition.
- At least two model providers, or one real provider plus a complete fake adapter, pass the same contract suite.
- Chaos fixtures cover timeout, rate limit, malformed tool output, partial streaming, orphaned media job, cancellation, and ambiguous mutation.
- Dry-run and actual run produce consistent capability, budget, and approval plans.
- Provider replacement changes output/evaluation evidence but not domain invariants.

## Revisit triggers

- A standardized protocol provides Clark's full run, policy, receipt, and recovery semantics without losing product control.
- Provider-specific features become impossible to expose through capability extensions.
- Measured orchestration complexity materially exceeds the value of provider neutrality.
