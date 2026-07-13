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
| [0011](0011-mac-entitlements-and-share-extension.md) | Developer ID/notarized Mac topology with a minimal sandboxed Share extension | Accepted | Desktop, capture, release security |
| [0012](0012-harness-lifetime-and-local-ipc.md) | App-supervised Harness utility process and private typed MessagePort IPC | Accepted | Studio/Harness isolation and recovery |
| [0013](0013-stdio-server-secrets-and-execution.md) | Exact-command, empty-environment runner for explicitly trusted stdio servers | Accepted | Local MCP execution and credentials |
| [0014](0014-remote-envelope-and-device-identity.md) | TLS plus signed HPKE envelopes, device identity, and replay state | Accepted | Relay and team cryptography |
| [0015](0015-team-event-order-and-conflict.md) | Signed causal events with aggregate-specific conflict rules | Accepted | Offline/team synchronization |
| [0016](0016-provider-data-policy-registry.md) | Signed, scoped, expiring evidence for provider data-policy decisions | Accepted | Remote egress and context compilation |
| [0017](0017-skill-execution-sandbox.md) | Declarative-by-default skills; Wasmtime/WASI for untrusted executable components | Accepted | Skill supply-chain and execution |
| [0018](0018-local-first-telemetry-and-crash-data.md) | Local-first diagnostics and explicit remote telemetry/crash consent | Accepted | Observability and support |
| [0019](0019-portable-encrypted-backups.md) | Portable age-encrypted backups with user-held recovery | Accepted | Export, restore, and disaster recovery |
| [0020](0020-vulnerability-and-support-policy.md) | Private vulnerability reporting and explicit security support lifecycle | Accepted | Release and incident response |

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
0011–0019 resolve platform, execution, egress, sync, observability, and recovery boundaries
                              ↓
0010 + 0020 govern how every layer is delivered, supported, and proven
```

## Change rule

Any change that breaks an invariant, changes canonical ownership, moves a trust boundary, changes the external protocol contract, or replaces a core runtime must add a superseding ADR. Routine implementation details do not need an ADR unless they make the earlier decision effectively irreversible.
