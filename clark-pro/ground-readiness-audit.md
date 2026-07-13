# Clark Pro — Ground Readiness Audit

**Date:** July 12, 2026  
**Decision:** Ground is not yet closed. Product direction and architecture are coherent, and bounded permanent implementation slices may continue behind the same contracts. Human/commercial evidence, native accessibility, named contract/team ownership, broader security-test ownership, and leadership signoff remain mandatory before capability fan-out or release claims.

## Evidence vocabulary

- **Defined** — authoritative product/architecture artifact exists and is internally consistent.
- **Prototype-verified** — behavior is exercised in the clickable artifact and automated checks.
- **Human evidence pending** — expert reasoning exists but representative creator behavior is unobserved.
- **Specified, not verified** — controls/tests are designed and may have bounded executable proof, but required production or human evidence remains incomplete.
- **Missing** — required Ground artifact has not yet been produced.

## Original product objective

| Requirement | Authoritative evidence | Status | Remaining proof |
|---|---|---|---|
| Mac application first | `vision.md`, `architecture.md`, ADR-0001, `apps/desktop/` | Defined with bounded executable shell | Observed VoiceOver/design review and Developer ID/Hardened Runtime/notarization/Gatekeeper release evidence |
| Durable harness and loops | `architecture.md`, `roadmap.md`, ADR-0003, `contracts/` | Defined and contract-verified | Production run state machine and forced-recovery tests |
| Canvas must be strong before implementation | `the-canvas.md`, `prototype/`, `apps/desktop/`, ADR-0009 | Prototype plus live Idea Foundry projection; human evidence pending | Five observed sessions must pass the canvas rubric and failed gates must be redesigned |
| Clark consumes MCP capabilities | `mcp-ecosystem.md`, ADR-0004, capability manifests, 36-case MCP suite | Ground harness and contract-verified | Production Connect runtime, real-provider compatibility, and remote network-fault evidence |
| Clark exposes its own MCP server | Clark Bridge docs, ADR-0004, Bridge exchange schema/fixture, official-SDK localhost server, interactive capture/revision/replay | Bounded production-path execution with hostile tests | Keychain pairing/token registry, concurrency/long-job semantics, broader catalog, and production security signoff |
| Social-media connectivity | `mcp-ecosystem.md`, ADR-0006 | Defined | Recorded/sandbox adapter fixtures, real account capability matrix, platform approval evidence |
| Installable skills | `memory-and-learning.md`, ADR-0007/0017, package schemas, 19-case Wasmtime suite | Ground contract/prototype-verified | Production component/WIT host, signing, process isolation, advisory automation, fuzzing, and Mac QA |
| Reuse mature open-source tools instead of rebuilding every engine | ADR-0022, Tool Package schema, semantic verifier, pinned OpenCut candidate | Ground contract-verified; OpenCut honestly upstream-blocked | Production installer/quarantine/update/rollback runtime and at least one active Tool Pack over a stable supported interface |
| Hermes-like memory/personalization core | `memory-and-learning.md`, prototype Memory view, ADR-0007 | Prototype-verified at interaction level | Real creator retrieval value, leakage/poisoning evaluation, correction/forget proof |
| Whole product rather than throwaway MVP | `roadmap.md`, ADR-0010 | Defined | Every stratum must prove no alternate state/security path |
| Incremental architecture from Ground upward | `roadmap.md`, ADR dependency stack | Defined | Versioned contracts and team-owned release plans |
| Proper product/team direction | product requirements, epics, flows, positioning/business | Defined | Named ownership, capacity/dependency plan, design partners, willingness-to-pay evidence |

## Ground deliverable audit

| Ground deliverable | Evidence | Status | Required next artifact/evidence |
|---|---|---|---|
| Product vision and differentiation | `vision.md`, `positioning-and-business.md`, research basis | Defined | Target-creator interviews and replacement-value evidence |
| Canvas grammar and interaction | `the-canvas.md`, standalone prototype, screenshots, automated checks | Prototype-verified; human evidence pending | Five observed walkthrough records |
| Harness architecture | `architecture.md`, ADR-0003 | Defined | Executable run/step state-machine specification |
| Memory and learning model | `memory-and-learning.md`, ADR-0007 | Defined | Retrieval/proposal evaluation protocol and real creator corpus |
| MCP and capability boundary | `mcp-ecosystem.md`, ADR-0004, `mcp-conformance/` | Ground contract/harness-verified | Production-boundary execution and named owner signoff |
| Security model and trust boundaries | `security-and-threat-model.md`, ADR-0001/0005 and ADR-0011–0022 | Specified, with skill/MCP Ground suites and Tool Pack contract gates | Convert every remaining accepted security gate into owned executable production tests and release evidence |
| Architecture decisions | `decisions/` registry and twenty-two accepted ADRs | Defined | Team review/signoff; superseding ADR for any invariant change |
| Versioned domain event catalog | 60 types, 18 schemas, generated namespaces, representative stream, historical upcaster, and Tool Pack lifecycle events | Defined and Ground contract/runtime-verified | Team signoff and full production replay/restore evidence |
| Versioned loop contract | Loop JSON Schema, generated types, Full-Week and Reflection definitions | Defined and contract-verified | Runtime graph/compiler conformance |
| Capability adapter contract | Capability schema, generated types, eight provider fixtures, 36 hostile MCP cases | Defined and Ground conformance-verified | Real adapter/provider compatibility matrix |
| Governed Tool Pack contract | Source/license/SBOM/install/adapter/converter/UI/update/rollback schema, generated types, OpenCut blocked fixture, valid-active shape, active-without-adapter and eleven hostile activation rejections | Defined and Ground contract-verified | Production installer and one stable external-tool integration with full activation/rollback evidence |
| Threat-to-test matrix | Threat model plus owned MCP and skill executable suites | Partially executable, not signed off | Complete ADR-to-test ownership and name primary/backup responders |
| Representative Full-Week fixture | Exact 50-object/46-edge project, two loops, 11-step run plan, events, eight capabilities, eleven failure/abuse cases | Contract-verified | Real creator artifacts and production runtime replay |
| Platform, domain, credential, execution, recovery, release, and ecosystem ADRs | ADR-0001 through ADR-0022 | Defined | Verification gates remain future production evidence unless explicitly recorded in the ledger |
| Business/category architecture | `positioning-and-business.md` | Defined as hypotheses | Ten interviews, three real-week design partners, binding willingness-to-pay |
| Team-owned release plan | `team-delivery-plan.md` defines ten workstreams, dependencies, decision/contract ownership, readiness/done, and evidence ledger | Defined by role | Assign named people, capacity, dates, and Ground evidence signoff |
| Machine-checked Ground evidence ledger | `evidence/ground-ledger.json`, JSON Schema, semantic negative fixture, verifier, generated status | Defined and verifier-checked open | Resolve blocking proof, keep statuses evidence-bound, and obtain seven-role named signoff |
| Native Mac interaction shell | `apps/desktop/`, ten boundary tests, two Electron E2E tests, packaged-app test, live Idea Foundry screenshots | Bounded executable evidence, not release-verified | VoiceOver/accessibility and design review; native trust flows; signed, hardened, notarized, Gatekeeper-accepted release bundle |

## Canvas evidence audit

### Proven by the current artifact

- Focus starts from one bounded judgment rather than a blank graph.
- Fifty objects render across Intent, Evidence, Creative, Production, Distribution, and Outcomes.
- Critical path is the default; selected lineage and relationship filters reduce edge noise.
- A selected publication shows source, version, cost, approval, publish state, outcome state, and permission.
- Impact preview exposes downstream staleness and estimated regeneration cost before execution.
- Review approval remains version-specific and separate from publication.
- Memory inspection exposes evidence, confidence, contradiction, scope, and retrieval status.
- Connections explains MCP host/client, Clark Bridge, social adapters, skill trust, and effective autonomy.
- A scoped Hermes Bridge capture creates one canonical Canvas object and receipt; replay emits no event, reload restores state, and Studio/Bridge hashes match.
- Canvas supports bounded click-drag pan, zoom/fit, arrow-key lane navigation, Enter-to-inspect, command palette, and reversible staged/view state.
- Review exposes a shared Reel A/B playhead with evidence, cost, policy, derivative impact, notes, selection, and approval.
- Automated interaction checks pass; 320px and 390px viewports have no page-level horizontal overflow.

### Not proven by the current artifact

- A new creator can complete the loop without facilitator help.
- An expert can find lineage within ten measured seconds.
- The canvas is better than the creator's current coordination system.
- Media comparison is superior with real video, audio, text, and image artifacts rather than representative cards.
- Node-position drag, graph rewire, durable edits, and VoiceOver/screen-reader use are usable; the bounded Mac shell proves menus, keyboard semantics, isolation, and restoration but not these broader behaviors.
- Studio and a real Bridge client remain consistent under concurrent commands.
- The system delivers first-week value strong enough to change behavior or earn payment.

## Technology judgment

The chosen stack is coherent with the product:

- Electron/TypeScript minimizes impedance across the graph UI, MCP ecosystem, schemas, and harness while the process topology contains privilege.
- SQLite/WAL plus event-backed projections fits one canonical Mac and preserves recovery/provenance; team topology is deliberately separate.
- Keychain plus a broker and leases gives secrets a narrower authority path than ordinary application state.
- A Clark capability contract above MCP prevents protocol lock-in while preserving interoperability in both directions.
- Provider-neutral bounded agents match the durable-loop product better than one vendor's agent SDK.
- Postiz-first distribution plus direct strategic adapters and export is more credible than promising every platform directly.
- Structured, governed memory and quarantined skills protect the actual moat: accumulated creator judgment.
- Governed Tool Packs preserve focus by reusing specialized open-source engines through immutable, licensed, sandboxed, tested, reversible adapters rather than copying their internal state model.

The stack is not yet *proven*. Its highest engineering risks are production isolation and supply-chain governance of third-party Tool Packs, durable external-mutation recovery, large-history migration/restore, remote delegation, and team synchronization. Its highest overall risks remain creator adoption, proposal-review burden, and replacement value.

## Next closure sequence

1. Run and record five observed creator walkthroughs; redesign every failed or ambiguous canvas gate.
2. Recruit three design partners and operate one real multi-channel week with their existing tools and representative content.
3. Test a binding purchase action and first-week replacement value.
4. Implement and verify remaining ADR-0011 through ADR-0022 gates; enable private vulnerability reporting and assign executable security/conformance owners.
5. Review and lock v1 event, capability, Tool Pack, skill, loop, and run contracts plus generated namespaces/upcaster rules across owning teams without semantic forks.
6. Assign named people, capacity, and dates to the defined workstreams; resolve and sign the machine-checked ledger in `evidence/` without reclassifying missing proof as accepted risk by default.

Implementation can begin only after product leadership explicitly accepts any remaining Ground risk; it cannot be inferred from document volume or a functioning prototype.
