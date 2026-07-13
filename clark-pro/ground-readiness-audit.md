# Clark Pro — Ground Readiness Audit

**Date:** July 12, 2026  
**Decision:** Ground is not yet closed. Product direction and architecture are coherent; human product evidence and executable contracts remain mandatory before implementation fans out.

## Evidence vocabulary

- **Defined** — authoritative product/architecture artifact exists and is internally consistent.
- **Prototype-verified** — behavior is exercised in the clickable artifact and automated checks.
- **Human evidence pending** — expert reasoning exists but representative creator behavior is unobserved.
- **Specified, not verified** — controls/tests are designed but no production runtime exists to prove them.
- **Missing** — required Ground artifact has not yet been produced.

## Original product objective

| Requirement | Authoritative evidence | Status | Remaining proof |
|---|---|---|---|
| Mac application first | `vision.md`, `architecture.md`, ADR-0001 | Defined | Native interaction prototype and signed runtime evidence in Stratum 1 |
| Durable harness and loops | `architecture.md`, `roadmap.md`, ADR-0003, `contracts/` | Defined and contract-verified | Production run state machine and forced-recovery tests |
| Canvas must be strong before implementation | `the-canvas.md`, `prototype/`, ADR-0009 | Prototype-verified; human evidence pending | Five observed sessions must pass the canvas rubric and failed gates must be redesigned |
| Clark consumes MCP capabilities | `mcp-ecosystem.md`, ADR-0004, capability manifests | Defined and contract-verified | Hostile-server and transport conformance suite |
| Clark exposes its own MCP server | Clark Bridge in `mcp-ecosystem.md`, ADR-0004 | Defined | Bridge tool/resource schemas, client-scope tests, UI/Bridge state-equivalence test |
| Social-media connectivity | `mcp-ecosystem.md`, ADR-0006 | Defined | Recorded/sandbox adapter fixtures, real account capability matrix, platform approval evidence |
| Installable skills | `memory-and-learning.md`, ADR-0007 | Defined | Package schema, quarantine sandbox choice, malicious-package and regression suite |
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
| MCP and capability boundary | `mcp-ecosystem.md`, ADR-0004 | Defined | Versioned JSON schemas and conformance fixtures |
| Security model and trust boundaries | `security-and-threat-model.md`, ADR-0001/0005 | Specified, not verified | Resolve ten open decisions; derive owned executable security test plans |
| Architecture decisions | `decisions/` registry and ten accepted ADRs | Defined | Team review/signoff; superseding ADR for any invariant change |
| Versioned domain event catalog | 52 types in `contracts/event-catalog.json`, event/payload schemas, representative stream | Defined and contract-verified | Team signoff, upcaster implementations, full production event fixtures |
| Versioned loop contract | Loop JSON Schema, Full-Week and Reflection definitions | Defined and contract-verified | Generated types and runtime graph/compiler conformance |
| Capability adapter contract | Capability JSON Schema and eight transport/provider fixtures | Defined and contract-verified | Hostile transport fixtures and real adapter conformance runner |
| Threat-to-test matrix | Section 11 of threat model | Specified, not verified | Concrete test cases, tools, owners, severity/blocking policy |
| Representative Full-Week fixture | Exact 50-object/46-edge project, two loops, 11-step run plan, events, eight capabilities, ten failure/abuse cases | Contract-verified | Real creator artifacts and production runtime replay |
| Desktop/database/credential/model/distribution ADRs | ADR-0001 through ADR-0010 | Defined | Verification gates remain future production evidence |
| Business/category architecture | `positioning-and-business.md` | Defined as hypotheses | Ten interviews, three real-week design partners, binding willingness-to-pay |
| Team-owned release plan | Epics and cumulative roadmap | Partially defined | Named workstreams, dependency graph, capacity, definition of ready/done, release evidence owners |

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
- Automated interaction checks pass and a 390px viewport has no horizontal overflow.

### Not proven by the current artifact

- A new creator can complete the loop without facilitator help.
- An expert can find lineage within ten measured seconds.
- The canvas is better than the creator's current coordination system.
- Media comparison is superior with real video, audio, text, and image artifacts.
- Pan, zoom, drag, rewire, undo, keyboard operation, screen-reader use, and Mac-native behavior are usable.
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

The stack is not yet *proven*. Its highest engineering risks are sandboxing third-party local code, durable external-mutation recovery, schema evolution, remote delegation, and team synchronization. Its highest overall risks remain creator adoption, proposal-review burden, and replacement value.

## Next closure sequence

1. Run and record five observed creator walkthroughs; redesign every failed or ambiguous canvas gate.
2. Recruit three design partners and operate one real multi-channel week with their existing tools and representative content.
3. Test a binding purchase action and first-week replacement value.
4. Resolve open threat-model decisions and assign executable security/conformance tests.
5. Review and lock v1 contracts across owning teams; generate implementation types from the schemas without semantic forks.
6. Convert epics into named team workstreams with dependency and evidence ownership.

Implementation can begin only after product leadership explicitly accepts any remaining Ground risk; it cannot be inferred from document volume or a functioning prototype.
