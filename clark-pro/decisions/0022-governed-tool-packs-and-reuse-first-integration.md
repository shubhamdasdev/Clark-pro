# ADR-0022 — Governed Tool Packs and Reuse-First Integration

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Architecture, Connect, Security, Clark Kit, Product

## Context

Clark's value is the creator model, durable Harness, policy, provenance, visual operating surface, memory, skills, and cross-tool loops. It should not recreate mature video editors, renderers, schedulers, caption engines, design tools, browsers, model runtimes, or analytics systems merely to own their implementation.

OpenCut's rewrite articulates the useful engine-first shape: one engine serving UI, plugins, MCP, headless automation, and scripting. Its pinned July 2026 revision is also a useful warning. The repository advertises those surfaces, while its public tracker still marks the Editor API, Plugin API, plugin host, MCP server, headless mode, and scripting unfinished. Clark must learn from the boundary without fabricating compatibility with roadmap code.

Capabilities and skills already solve different lower-level concerns. A capability is a transport-neutral action. A skill is governed procedural knowledge. Neither is the installable unit that pins an external project's source, legal posture, binaries, adapters, converters, UI contributions, supply-chain evidence, compatibility, and rollback together.

## Decision

Add **Tool Pack** as the governed Clark Kit distribution boundary for external tools and open-source projects.

A Tool Pack may bundle or reference:

- one immutable upstream source/release revision and content hash;
- license notices, commercial/redistribution disposition, dependency review, and trademark review;
- SBOM, vulnerability scan, signature, build, and provenance evidence;
- an installation/acquisition recipe and reviewed update/rollback policy;
- one or more adapters that implement Clark capability revisions;
- import/export converters that preserve Clark's canonical schemas;
- optional governed skill revisions;
- declarative or isolated UI contributions;
- compatibility, conformance, migration, activation, and rollback tests.

Clark uses this integration preference ladder unless recorded evidence justifies a different order:

1. native MCP server;
2. stable headless CLI;
3. stable HTTP API;
4. supported library API;
5. WASM component;
6. supervised local sidecar;
7. typed file handoff;
8. isolated browser automation;
9. maintained fork/vendor copy.

Browser automation is a degraded adapter, not the normal definition of support. Forking is last resort because it converts integration cost into permanent product, security, legal, and update ownership.

Before Clark builds a subsystem, the owning workstream records a reuse review covering interface stability, license, security posture, local-first behavior, data portability, platform support, maintenance health, testability, upgrade/rollback, and total ownership cost. “Build internally” must beat the integration ladder on Clark's differentiated value or on a non-negotiable trust/correctness boundary.

External schemas never become Clark's canonical creator, workflow, approval, memory, provenance, publication-intent, or lineage model. Adapters translate typed commands and receipts or typed files. The external tool owns its specialized execution domain; Clark owns orchestration and durable creator truth.

Tool Pack activation fails closed. An active package requires at least one installed adapter, at least one versioned capability, completed license/dependency disposition, acceptable supply-chain evidence, a passing vulnerability scan, compatibility, and a passing activation test. A discovered or upstream-blocked candidate may be documented and pinned but cannot expose capabilities, executable adapters, skills, converters, or UI code as installed functionality.

## OpenCut disposition

The first fixture pins OpenCut revision `bab8af831b354a0b5a98a4a6e818ab7d633b94df` and its MIT license evidence. It remains `blocked_upstream` because no stable Editor API, MCP server, headless API, plugin host, or project interchange contract exists at that revision. Clark bundles and executes nothing from that fixture.

When a stable upstream boundary exists, the candidate starts again at quarantine: pin source/release artifacts, complete dependency/asset/trademark review, generate and verify an SBOM, implement typed capability and converter contracts, run hostile and golden-render tests, verify update/rollback, then request activation. Internal OpenCut types or browser DOM structure are not compatibility contracts.

## Consequences

### Positive

- Clark can compose excellent tools without rebuilding their specialized engines.
- One install surface covers capabilities, skills, UI, conversion, permissions, provenance, and lifecycle.
- External projects remain replaceable execution dependencies rather than hidden canonical databases.
- Source, license, update, and supply-chain decisions become reviewable evidence.
- Roadmap candidates can be recorded honestly without being presented as working integrations.

### Costs

- Every active Tool Pack needs compatibility and rollback maintenance.
- Legal and dependency review cannot be inferred from the repository's top-level license alone.
- Converters and capability adapters still require Clark-owned engineering.
- Embedded or browser-based surfaces require additional isolation and accessibility work.

## Rejected alternatives

- **Rebuild every creator tool inside Clark:** duplicates mature engineering and destroys focus.
- **Treat a Git URL as an installed plugin:** omits authority, license, lifecycle, compatibility, and rollback.
- **Treat skills as executable integration packages:** confuses procedural knowledge with tool supply chain and runtime boundaries.
- **Adopt an external project schema as Clark's domain model:** couples durable creator truth to a replaceable tool.
- **Browser automation first:** depends on private UI structure and creates fragile, high-authority behavior.
- **Fork on first integration friction:** creates an unbounded maintenance and security obligation.
- **Claim planned upstream APIs as supported:** converts roadmap language into false product evidence.

## Invariants

1. Tool Pack source and executable artifacts are immutable and hash-attributed.
2. No active package has unresolved license, dependency, vulnerability, compatibility, adapter, or activation evidence.
3. Capability permissions remain authoritative; a Tool Pack or skill cannot widen them.
4. External tool state does not replace Clark's canonical creator and workflow state.
5. UI contributions have declarative, Clark-rendered, sandboxed-web, or external-app isolation; no package receives renderer authority by description.
6. Updates enter quarantine, show permission and data-migration diffs, and retain a verified rollback path.
7. Browser automation and forks are visible degraded choices with explicit ownership.
8. A blocked candidate exposes no installed capabilities or executable components.

## Verification gates

- Canonical Tool Package schema and generated implementation type compile without drift.
- Positive and negative fixtures prove active packages cannot omit an adapter/capability or bypass license and supply-chain gates.
- Semantic verification checks the ordered integration ladder, source/evidence pin agreement, adapter-to-capability references, interface readiness, and honest blocked state.
- Installer tests verify hash/signature before execution and reject path, archive, symlink, dependency-confusion, and substitution attacks.
- Compatibility fixtures cover install, health, capability behavior, converters, UI isolation, upstream upgrade, project migration, and rollback.
- An OpenCut fixture remains blocked until a stable upstream boundary and the complete activation evidence exist.

## Evidence

- [`contracts/schemas/tool-package.schema.json`](../contracts/schemas/tool-package.schema.json)
- [`contracts/fixtures/tool-packages/opencut.rewrite.blocked.json`](../contracts/fixtures/tool-packages/opencut.rewrite.blocked.json)
- [OpenCut rewrite tracker](https://github.com/OpenCut-app/OpenCut/issues/811)
- [Pinned OpenCut source](https://github.com/OpenCut-app/OpenCut/tree/bab8af831b354a0b5a98a4a6e818ab7d633b94df)
- [Pinned OpenCut MIT license](https://github.com/OpenCut-app/OpenCut/blob/bab8af831b354a0b5a98a4a6e818ab7d633b94df/LICENSE)

## Revisit triggers

- OpenCut or another major dependency ships a stable cross-platform plugin ABI that can replace part of Clark Kit.
- WASI component maturity changes the preferred adapter order.
- Mac distribution rules materially constrain supervised local tools.
- Supply-chain standards require a stronger manifest or attestation format.
