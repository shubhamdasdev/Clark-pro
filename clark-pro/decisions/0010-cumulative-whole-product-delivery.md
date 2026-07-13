# ADR-0010 — Cumulative Whole-Product Delivery

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Product, Architecture, Engineering, Quality

## Context

The intended product includes a Mac studio, durable harness, governed memory, skills, MCP in both directions, social distribution, remote jobs, teams, and an extension ecosystem. Attempting all surfaces simultaneously would prevent integrated proof. Building a disposable MVP with separate state, insecure shortcuts, or fake automation would produce misleading validation and a costly rewrite.

## Decision

Deliver Clark through cumulative production strata. Each stratum exposes a coherent vertical slice of the final system and uses the permanent domain contracts, event model, process boundaries, credential broker, policy model, migration system, observability, and release discipline.

“Not an MVP” means no throwaway architecture or fake product semantics. It does not mean parallel implementation of every feature before the foundations are proven. Release gates require representative workflows, failure recovery, security evidence, migration/rollback, measurable creator judgment, and documented limitations.

## Consequences

### Positive

- Every completed stratum becomes the tested base of the next.
- Product learning can reshape higher layers without discarding canonical state.
- Teams can own bounded systems against shared invariants.
- Progress is measured by integrated evidence rather than feature count.

### Costs

- Foundation work cannot be bypassed for demo speed.
- A stratum may feel narrower than the whole vision even though its architecture is final.
- Gate failures can pause expansion and require redesign.

## Rejected alternatives

- **Disposable MVP stack:** validates the wrong reliability, trust, and continuity assumptions.
- **Big-bang whole-product implementation:** maximizes integration and product-risk simultaneously.
- **Feature-team roadmap without vertical proofs:** creates screens and services with no canonical workflow.
- **Protocol-first platform before creator value:** optimizes extension before proving the job to be done.

## Invariants

1. No stratum introduces a second canonical state or bypass command path.
2. Prototype fixtures may be simulated, but production strata use real security and recovery contracts.
3. Gates measure behavior and failure modes, not merely deliverable presence.
4. Higher strata extend lower ones through versioned contracts and migrations.
5. Product, security, reliability, and portability evidence are required for release.

## Verification gates

- Architecture checks trace every stratum deliverable to accepted ADRs and domain contracts.
- No production path uses placeholder credentials, unrecorded mutation, or throwaway storage.
- Each vertical proof includes forced interruption and rollback/recovery evidence.
- Human product gates remain open until observed evidence passes; expert rehearsal is labeled accurately.
- The whole-product completion audit maps every requirement to authoritative runtime or artifact evidence.

## Revisit triggers

- A stratum cannot deliver useful integrated value without violating a permanent invariant.
- Observed creator evidence invalidates the core product thesis rather than a surface detail.
- A superseding architecture changes the foundation and includes a migration path.
