# Clark Pro — Whole-Product Team Delivery Plan

## Operating model

Clark is built through vertical proofs over one canonical product, not independent feature silos. Each workstream owns a bounded system, but no team may create a private state model, permission path, event dialect, connector semantics, or alternate prototype-to-production shortcut.

Named people and capacity must be assigned before implementation begins. This document defines accountable roles, interfaces, dependencies, and evidence so staffing can change without changing product truth.

## Leadership roles

| Role | Accountable for |
|---|---|
| Product Lead | Product thesis, ICP, value/replacement gates, scope, stratum acceptance |
| Design Lead | Focus/Canvas system, Mac interaction, accessibility, cross-view coherence |
| Chief Architect | ADRs, contract integrity, dependency topology, superseding decisions |
| Security Lead | Threat model, credential/permission boundaries, security release evidence |
| Quality Lead | Cross-system test strategy, fixtures, chaos/conformance, evidence ledger |
| Release Lead | Signing, notarization, updates, migrations, rollback, supported-version policy |
| Research Lead | Participant integrity, observed evidence, design-partner and purchase studies |

One named person may hold multiple roles in a small team, but each accountability must remain explicit.

## Workstreams

| ID | Workstream | Accountable owner role | Permanent system boundary | Primary dependencies | Release evidence |
|---|---|---|---|---|---|
| W1 | Product research and operating model | Product + Research Leads | ICP, workflows, validation, packaging, outcomes | Prototype, analytics definitions | Session/design-partner records, purchase actions, product gate decision |
| W2 | Mac Studio and interaction | Desktop + Design Leads | Electron main/preload/renderer, native behavior, all seven surfaces | Domain queries/commands, policy summaries | Renderer isolation, accessibility, performance, interaction tests, native QA |
| W3 | Domain, events, storage, portability | Domain/Data Lead | Aggregates, event log, projections, schemas, assets, migrations, export/import | Contracts/ADRs | Replay determinism, migration/restore, checksum, projection rebuild evidence |
| W4 | Harness, loops, models, evaluation | Harness Lead | Compiler, run engine, context, bounded agents, recovery, evaluation | W3, W5, W6, W8 | State-machine, provider conformance, chaos, cost, recovery evidence |
| W5 | Creator model and skills | Memory/Skills Lead | Retrieval, memory proposals, forgetting, skill quarantine/testing/promotion | W3, W4, W8 | Leakage/poisoning, helpfulness, correction/forget, malicious-skill, rollback evidence |
| W6 | Connect, MCP host, Bridge, Kit | Connect/Developer Platform Lead | Capability adapters, MCP transports, Bridge, SDK/conformance | W3, W4, W8 | Hostile server/client, scope, revocation, state-equivalence, compatibility evidence |
| W7 | Media, social distribution, analytics | Distribution Lead | Higgsfield/media workers, Postiz/direct adapters, publication ledger, observation | W4, W6, W8 | Media validation, platform fixtures, idempotency/reconciliation, export evidence |
| W8 | Security, credentials, policy | Security Lead | Keychain broker, OAuth, leases, permission engine, egress, package trust | All privileged paths | Threat-to-test matrix, canary scans, attack suites, security signoff |
| W9 | Relay, synchronization, Team | Relay/Team Lead | Remote envelopes, encrypted sync, roles, tenancy, shared queues | W3–W8 proven locally | Tenant isolation, replay/conflict, outage, key/member revocation evidence |
| W10 | Quality, release, observability | Quality + Release Leads | Test harnesses, fixtures, telemetry/diagnostics, builds, signing, updates | Every workstream | Full evidence ledger, SBOM/provenance, notarization, update/rollback drills |

## Dependency graph

```text
W1 observed product evidence ───────────────┐
                                            ▼
W2 Studio ──────────────┐             Stratum gate
                        │
W3 Domain/contracts ────┼──► W4 Harness/evaluation ──► W7 Distribution
                        │          │                         │
W8 Security/policy ─────┤          ├──► W5 Memory/skills ───┤
                        │          └──► W6 MCP/Bridge/Kit ───┤
W10 Quality/release ────┴───────────────────────────────────┘
                                                              │
                                                              ▼
                                                   W9 Relay/Team only after
                                                   local invariants are proven
```

W8 and W10 are not final review queues; they participate in every interface and vertical proof.

## Decision ownership

| Decision | Accountable | Required reviewers | Evidence required |
|---|---|---|---|
| Product/canvas gate | Product Lead | Design, Research, Architecture | Five-session matrix and redesign/retest record |
| ICP or category change | Product Lead | Research, Commercial, Architecture | Repeated behavioral/commercial evidence; effect on requirements |
| ADR acceptance/supersession | Chief Architect | Owning teams, Security, Quality | Alternatives, migration, invariant and test impact |
| Contract/schema change | Domain Lead | Every producer/consumer owner | Compatibility class, fixtures, upcaster/migration, generated-type diff |
| New privileged capability | Security Lead | Connect/Harness/Product | Threat mapping, effective permissions, conformance, UX and revocation |
| New direct social adapter | Distribution Lead | Product, Connect, Security, Quality | Strategic gap, platform approval, fixture/reconciliation/fallback evidence |
| Memory taxonomy/retrieval change | Memory Lead | Product, Security, Research | Helpful/leakage evaluation and migration behavior |
| Remote/team expansion | Relay Lead | Domain, Security, Product, Quality | Local gates passed; envelope/sync/tenant evidence |
| Stratum release | Product Lead | All leadership roles | Complete release evidence ledger; no unresolved blocking gate |

## Contract ownership

| Contract | Schema owner | Primary producers | Primary consumers | Compatibility approver |
|---|---|---|---|---|
| Domain event/catalog | W3 | All command handlers | Projections, export, sync, audit | Chief Architect + Domain Lead |
| Loop definition | W4 | Studio/templates/Kit | Compiler, Bridge, scheduler | Harness + Product Leads |
| Capability manifest | W6 | Bundled/third-party adapters | Compiler, policy, Connections, SDK | Connect + Security Leads |
| Compiled run plan | W4 | Compiler | Studio, run engine, audit, Bridge | Harness + Security Leads |
| Project fixture | W1/W3 | Research/Product/Domain | UI, compiler, tests, demos | Product + Quality Leads |
| Failure/abuse fixture | W8/W10 | Security/Quality/owners | Test harnesses and release gates | Security + Quality Leads |

Schema owners do not own product semantics alone. Any change affecting creator authority, canonical state, remote egress, or compatibility requires the corresponding decision owner.

## Definition of Ready

A work item is ready for implementation only when all applicable items exist:

1. User/problem evidence and intended outcome are linked.
2. Owning workstream and one accountable person are named.
3. Accepted ADR/invariant or explicit proposed ADR is linked.
4. Versioned input/output/event schemas are defined or the change is confirmed internal-only.
5. Positive, failure, and abuse fixtures describe expected behavior.
6. Threat IDs, data sensitivity, permissions, credential/egress path, and revocation are mapped.
7. UI state and authority wording are defined for visible work.
8. Observability, cost, migration, rollback, and support behavior are specified.
9. Dependencies provide a versioned interface rather than an undocumented promise.
10. Acceptance evidence can be produced by an executable test or observed study.

If one of these is unknown, the item may remain discovery work but cannot enter committed implementation.

## Definition of Done

A work item is done only when:

- production code uses the accepted canonical path and generated/verified contracts;
- unit, integration, conformance, failure, security, accessibility, and performance tests applicable to its risk pass;
- events, logs, metrics, cost, and diagnostics are observable without secret leakage;
- restart, cancellation, idempotency, reconciliation, migration, and rollback behavior are proven where applicable;
- permissions, Keychain leases, egress, account/version scope, and revocation are proven where applicable;
- docs, limitations, support/recovery steps, and evidence ledger links are current;
- no bypass, hidden alternate state, mock mutation, or prototype-only production path remains;
- owning lead and Quality accept the evidence; Security accepts privileged changes; Product accepts user-visible behavior.

“Screen exists,” “API returns 200,” and “happy-path demo works” are not definitions of done.

## Stratum integration cadence

Each stratum runs a recurring integration loop:

1. **Contract review:** producers/consumers review schema and threat changes before code forks.
2. **Vertical fixture:** Full-Week fixture executes through the current permanent path.
3. **Failure day:** one or more failure/abuse cases run with observable recovery.
4. **Creator review:** current visible behavior is tested against the active product gate.
5. **Evidence review:** Quality updates the release ledger; missing proof remains open.
6. **ADR review:** unexpected irreversible decisions become ADRs before they spread.

Frequency is set by the team, but no workstream may remain unintegrated for an entire stratum.

## Release evidence ledger

For every stratum, W10 maintains one table:

| Requirement/invariant | Owner | Evidence artifact/run | Result | Environment/version | Open limitation | Blocking? |
|---|---|---|---|---|---|---:|
|  |  |  |  |  |  |  |

Rules:

- Evidence must cover the requirement's full scope.
- A mocked provider can prove contract behavior, not real provider approval or reliability.
- A unit test cannot prove renderer isolation, restart recovery, tenant isolation, or creator comprehension.
- A document proves a design decision, not runtime enforcement.
- A failed or missing critical control blocks release; it is not converted into “known risk” without explicit Product/Security/Architecture acceptance and a bounded exposure plan.

## Change and escalation rules

- Contract conflicts stop integration; teams do not create temporary private dialects.
- Security/product gate conflict escalates to Product + Security + Architecture, with creator authority as the default constraint.
- Scope pressure cannot waive canonical state, secrets, publication safety, memory/skill governance, export, or recovery invariants.
- A superseding ADR must include migration, fixture updates, threat/test updates, and affected release gates.
- External platform limitations are represented honestly through capability state and fallback, not hidden behind roadmap optimism.

## Immediate Ground assignments

Before Stratum 1 begins, assign named owners and dates for:

- five creator sessions and the analysis decision;
- three design partners and purchase test;
- ten open security decisions;
- v1 contract review/signoff by W2–W10;
- event upcaster and schema-generation approach;
- hostile MCP/capability conformance plan;
- skill sandbox decision;
- Mac native interaction/accessibility prototype;
- team capacity/dependency plan;
- Ground evidence ledger signoff.

Ground closes only when the readiness audit changes through evidence, not because roles or documents were created.
