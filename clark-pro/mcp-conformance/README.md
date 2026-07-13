# Clark MCP Host + Bridge Conformance

This directory turns [ADR-0004](../decisions/0004-capabilities-above-mcp.md) into an owned, executable Ground boundary for both directions of MCP participation:

- **Clark Connect as host/client:** external MCP servers are hostile until their framing, lifecycle, schemas, metadata, results, deadlines, cancellation, shutdown, authorization, and egress behavior pass.
- **Clark Bridge as server:** external clients cannot bypass Origin/auth/session/protocol validation or Clark's canonical workspace, scope, replay, sensitivity, credential, task, and UI-state rules.

The suite pins MCP protocol revision `2025-11-25`, which the official specification identifies as the latest stable revision as of July 12, 2026. It pins `@modelcontextprotocol/sdk@1.29.0`; the official SDK repository says v1.x remains the recommended production line while v2 is pre-alpha. Raw hostile framing tests deliberately sit below the SDK so corrupt input cannot be normalized before Clark classifies it.

## Authoritative artifacts

| Artifact | Role |
|---|---|
| `conformance-plan.json` | 36-case owner, severity, fixture, disposition, blocking, and evidence inventory |
| `../contracts/schemas/mcp-conformance-plan.schema.json` | Fails critical/high cases that are not release-blocking and executable cases without evidence paths |
| `sdk-smoke.mjs` | Real pinned-SDK stdio initialize, tool discovery, call, and shutdown baseline |
| `fixtures/stdio-server.mjs` | Raw hostile stdio modes for framing, lifecycle, schema, injection, result, timeout, cancellation, and shutdown |
| `bridge-boundary.mjs` | Localhost-only Streamable HTTP boundary for Origin, auth, Accept, content type, JSON, batching, protocol, session, and notification behavior |
| `verify.mjs` | Executes runtime cases, invokes the shared Bridge contract verifier, and refuses missing results |
| `evidence/latest-report.json` | Attributable result that keeps unimplemented release gates visible |

## Current evidence

```text
36 total cases
36 / 36 executable or shared-contract cases pass
0 planned cases
```

Coverage includes Connect stdio and Streamable HTTP framing, SSE session replay, OAuth resource confusion, explicit disconnect cancellation, schema depth, Bridge sensitivity intersection, confused-deputy credential denial, and unnegotiated Tasks fallback. Production still has to prove the same behaviors inside the shipped Connect/Bridge runtime against real providers and network faults.

## Ownership and blocking

The plan assigns primary and backup **roles** across Connect, Bridge, Security, Quality, and incident response. It intentionally does not invent employees. Product leadership must map those roles to named people and record signoff before Ground closes.

- Critical failure: block release and quarantine.
- High failure: block capability/client promotion.
- Medium protocol `MUST` failure: block; other medium failures need an owned exception.
- Secret canary: block release, rotate the canary, review logs, and quarantine.
- Duplicate external effect: block release, reconcile provider truth, and run incident review.

## Run

```bash
npm ci
npm run report
npm audit --audit-level=moderate
```

The suite uses only localhost and child-process fixtures. It does not contact a real provider, mutate a real social account, or establish production Bridge authentication.

## Official basis

- [MCP 2025-11-25 specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [Lifecycle, negotiation, timeout, cancellation, and shutdown](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle)
- [stdio and Streamable HTTP transport requirements](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)
- [Authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- [Official TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
