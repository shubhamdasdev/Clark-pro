# Clark Harness local substrate

This package is the permanent local run substrate defined by ADR-0002, ADR-0003, and ADR-0012. It is launched by Electron as a supervised `utilityProcess`; the renderer never receives its MessagePort or database path.

## Implemented foundation

- one canonical Harness IPC JSON Schema, validated with the pinned contract runtime on both sides;
- bounded requests with IDs, deadlines, 64 KiB maximum size, 32-request main-process backpressure, and typed errors;
- SQLite/WAL append-only events, aggregate versions, per-workspace SHA-256 hash chains, transactional projections, immutable artifact-version rejection, and deterministic projection rebuild;
- content-addressed text assets with integrity checks and owner-only files;
- an idempotent command ledger that rejects key reuse with changed content;
- a contract-compiled `Idea to Approved Text` loop whose exact validated plan is pinned inside `run.planned`: local capture → deterministic local structure → exact-version creator approval;
- boot-time event/row integrity verification and projection rebuild before durable step recovery;
- durable step attempts, checkpoint metadata, creator decision events, and approval/publishing separation;
- zero network, credential, model, social, skill, or external-tool authority in this first executable loop.

## Deliberate limitations

- Electron 43.1.0 pins Node 24.18 and SQLite 3.53.1; `node:sqlite` is isolated behind `EventStore` because Node still labels the API experimental/release-candidate. A binding change must preserve the repository and event semantics and pass the same recovery suite.
- This loop is a deterministic structural baseline, not research, model generation, a general graph compiler, or proof of creator value.
- The current process has no Keychain leases, MCP/tool execution, external jobs, budgets beyond zero-cost local work, scheduling, backup/export, migration, or signed release evidence.
- Recovery coverage here proves a local deterministic step interrupted while `running`; every transition and external-mutation ambiguity remains a later release gate.

## Verify

```bash
npm ci
npm run verify
```
