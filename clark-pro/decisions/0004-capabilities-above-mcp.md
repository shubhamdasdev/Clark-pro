# ADR-0004 — Capabilities Above MCP

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Connect, Bridge, Harness, Developer Platform

## Context

MCP provides an open way to discover and invoke tools, resources, prompts, and evolving task behavior. Clark must consume third-party MCP servers and expose its own MCP server. It also needs direct APIs, local commands, browser or OS adapters, cost quotes, credential lifecycle, idempotency, reconciliation, health, UI renderers, and reliability metadata that are not a stable universal MCP domain model.

## Decision

Define a versioned Clark Capability contract above transport. MCP, HTTP APIs, local processes, browser adapters, and deterministic libraries implement that contract. Clark Connect is the host/client boundary for external capabilities. Clark Bridge is a permissioned MCP server over the same domain commands and resources used by Studio.

MCP descriptions, annotations, prompts, schemas, and returned content are untrusted input. MCP Tasks are used when negotiated and suitable; Clark durable job receipts remain the compatibility fallback.

## Consequences

### Positive

- Clark gains ecosystem openness without turning a protocol into its database.
- Studio and external agents operate one canonical domain path.
- Capabilities expose uniform auth, quote, execute, observe, cancel, reconcile, health, and revoke lifecycles.
- Transport can change without rewriting creative loops.

### Costs

- Adapters must map incomplete provider behavior into explicit limitations.
- Bridge compatibility and MCP conformance become permanent test obligations.
- Clark must prevent confused-deputy behavior when a trusted client asks it to use another credentialed capability.

## Rejected alternatives

- **MCP schemas as Clark's internal domain model:** insufficient for provenance, publication, cost, lifecycle, and UI invariants.
- **Direct bespoke integrations only:** creates lock-in and duplicates discovery/auth patterns.
- **Bridge as a separate automation backend:** would create state divergence from Studio.
- **Trust server annotations by default:** lets an external server declare its own safety.

## Invariants

1. Every external invocation resolves to a pinned capability revision and permission intersection.
2. Studio and Bridge mutations call the same domain command handlers.
3. Mutating Bridge tools require client identity, workspace, intent ID, and approval behavior.
4. Server-provided metadata cannot grant trust or credentials.
5. Revocation invalidates leases and blocks future calls immediately.
6. Long work returns a durable Clark receipt even when MCP Tasks are unavailable.

## Verification gates

- MCP stdio and Streamable HTTP servers pass discovery, schema, cancellation, disconnect, and malicious-response fixtures.
- Bridge clients cannot cross workspace, sensitivity, tool, or action scopes.
- Repeating a mutating intent does not create duplicate external effects.
- Studio and Bridge produce equivalent events for the same authorized command.
- Capability conformance reports limitations rather than fabricating support.

## Revisit triggers

- MCP standardizes a lifecycle that can replace a Clark capability field without losing compatibility.
- Another protocol becomes essential to the ecosystem; it should be added as a transport adapter, not a second domain path.
