# Clark Pro Architecture Decision Records

These records turn the product's resolved technology choices into team-owned decisions. An ADR is not complete because the document exists; each record includes invariants and verification gates that must be demonstrated in the relevant delivery stratum.

## Status vocabulary

- **Proposed** — under active review; dependent work must not assume it is permanent.
- **Accepted** — the current whole-product architecture; changes require a superseding ADR.
- **Superseded** — retained for history and linked to its replacement.
- **Rejected** — evaluated and deliberately not adopted.

## Registry

| ADR | Decision | Status | Primary dependency |
|---|---|---|---|
| [0001](0001-mac-desktop-and-process-topology.md) | Mac-first Electron application with isolated harness and media workers | Accepted | Studio, Harness, security |
| [0002](0002-local-canonical-event-state.md) | Local canonical event state, SQLite projections, and content-addressed assets | Accepted | Every domain aggregate |
| [0003](0003-provider-neutral-durable-harness.md) | Provider-neutral durable harness with explicit loops and bounded agents | Accepted | Execution, recovery, evaluation |
| [0004](0004-capabilities-above-mcp.md) | Capability contract above transport; Clark consumes and exposes MCP | Accepted | Connect, Bridge, Kit |
| [0005](0005-keychain-credential-broker.md) | Keychain-backed credential broker with scoped leases | Accepted | Models, MCP, social, remote work |
| [0006](0006-social-distribution-strategy.md) | Postiz-first breadth, selective direct adapters, permanent export fallback | Accepted | Distribution and analytics |
| [0007](0007-governed-memory-and-skills.md) | Structured creator model and quarantined, reviewable skill evolution | Accepted | Memory, reflection, skills |
| [0008](0008-remote-execution-and-team-sync.md) | Scoped remote execution and encrypted team relay without cloud ownership of personal state | Accepted | Relay and Team strata |
| [0009](0009-focus-first-canvas-projection.md) | Focus-first studio; Canvas is a projection of canonical state | Accepted | Product interaction model |
| [0010](0010-cumulative-whole-product-delivery.md) | Cumulative production strata rather than throwaway MVP architecture | Accepted | Planning and release governance |

## Dependency order

The records form one base-to-top stack:

```text
0001 process topology + 0002 canonical state + 0005 credential boundary
                              ↓
0003 harness + 0004 capabilities/MCP + 0007 memory/skills
                              ↓
0006 social distribution + 0009 Studio interaction
                              ↓
0008 Relay/Team topology
                              ↓
0010 governs how every layer is delivered and proven
```

## Change rule

Any change that breaks an invariant, changes canonical ownership, moves a trust boundary, changes the external protocol contract, or replaces a core runtime must add a superseding ADR. Routine implementation details do not need an ADR unless they make the earlier decision effectively irreversible.
