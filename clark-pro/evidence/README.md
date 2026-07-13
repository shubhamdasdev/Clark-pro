# Clark Pro Ground Evidence Ledger

This directory is the machine-checked source of truth for whether Ground is actually ready to close. It covers all ten original product requirements, all nine Canvas quality gates, all seven business gates, and eight delivery-readiness gates.

Counts are requirement-level. One evidence run can satisfy several entries—for example, the same five walkthroughs supply the aggregate Canvas objective, nine specific Canvas checks, and part of the commercial comprehension gate. The ledger does not imply 34 independent studies.

The ledger deliberately distinguishes:

- a document from runtime enforcement;
- a valid contract fixture from a real provider integration;
- a working prototype from observed creator comprehension;
- an opinion from behavior;
- stated willingness to pay from a binding action;
- role definitions from named people with capacity and dates.

## Files

| File | Role |
|---|---|
| `ground-ledger.json` | Versioned requirement, proof, status, limitation, next-action, blocker, and signoff records |
| `../contracts/schemas/ground-evidence-ledger.schema.json` | JSON Schema for the ledger and its evidence/signoff records |
| `verify.mjs` | Schema, semantic, path, closure, signoff, and anti-fabrication verifier |
| `fixtures/negative-entry.verified-without-observation.json` | Proves that a prototype cannot be relabeled as verified human evidence |
| `status.md` | Generated concise summary of current counts and blocking entries |
| `../skills-sandbox/evidence/latest-sandbox-receipt.json` | Attributable pinned-runtime result for the hostile Class B Ground suite |
| `../mcp-conformance/evidence/latest-report.json` | Attributable complete 36-case Ground MCP result with production-boundary limitations |
| `../contract-runtime/src/generated/manifest.json` | Pinned source/output hashes for every generated implementation contract |

## Run

Install the contract verifier dependencies once:

```bash
npm --prefix contracts ci
npm --prefix contract-runtime ci
```

Verify without changing files:

```bash
npm --prefix evidence run verify
```

Regenerate the human-readable status after an evidence change:

```bash
npm --prefix evidence run status
```

## Status rule

The verifier passing means the ledger is structurally valid, internally honest, and points to files that exist. It does not mean Ground passed. `gateState` may become `closed` only when no blocking entry lacks required proof and every required leadership role has an attributable approval.

Never add a session, design-partner, purchase, runtime, or signoff record that did not occur. If evidence is partial, preserve the pending result and record the precise limitation.
