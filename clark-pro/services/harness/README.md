# Clark Harness local substrate

This package is the permanent local run substrate defined by ADR-0002, ADR-0003, and ADR-0012. It is launched by Electron as a supervised `utilityProcess`; the renderer never receives its MessagePort or database path.

## Implemented foundation

- one canonical Harness IPC JSON Schema, validated with the pinned contract runtime on both sides;
- bounded requests with IDs, deadlines, 64 KiB maximum size, 32-request main-process backpressure, and typed errors;
- SQLite/WAL append-only events, aggregate versions, per-workspace SHA-256 hash chains, transactional projections, immutable artifact-version rejection, and deterministic projection rebuild;
- content-addressed text assets with integrity checks and owner-only files;
- an idempotent command ledger that rejects key reuse with changed content;
- a contract-compiled `Idea to Approved Text` loop whose exact validated plan is pinned inside `run.planned`: local capture → governed MCP inspection → deterministic local structure → exact-version creator approval;
- immutable idea revisions with root/parent run lineage, stable logical artifact IDs, new content-addressed versions, idempotent replay, and atomic invalidation/cancellation of a superseded pending review;
- an official-SDK MCP client that launches one source-hash-pinned bundled server with exact executable/argv/cwd, no shell, a minimal environment, bounded stdio/stderr, exact tool-schema discovery, and fail-closed drift checks;
- durable capability registration, permission receipts, 15-second leases, invocation receipts, health state, and boot-time revocation of orphaned authority;
- an official-SDK Clark Bridge MCP server bound to `127.0.0.1` on an ephemeral port, with Host/Origin/body checks, a 256-bit bearer stored only in an owner-readable connection file, one-workspace client scope, and capture/revision/read tools only;
- boot-time event/row integrity verification and projection rebuild before durable step recovery;
- durable step attempts, checkpoint metadata, creator decision events, and approval/publishing separation;
- governed memory claims with exact evidence references, proposal-only creation, explicit promotion/rejection/dispute/forget decisions, append-only correction lineage, scoped retrieval policies, content-free retrieval receipts, and deterministic replay;
- a workspace-scoped Tool Pack repository that stores immutable manifests in events, evaluates eleven source/legal/supply-chain/interface/adapter/activation/rollback gates, rejects quarantine bypass, suspends prior authority on update, and atomically restores a retained verified rollback revision;
- additive SQLite schema-v5 migration that restores older runs as revision-one roots, adds memory/retrieval and Tool Package projections, and preserves deterministic event replay;
- zero network, credential, model, social, skill, file, build, or publication authority in this executable loop; the only tool call is a bundled deterministic zero-egress MCP transform.

## Deliberate limitations

- Electron 43.1.0 pins Node 24.18 and SQLite 3.53.1; `node:sqlite` is isolated behind `EventStore` because Node still labels the API experimental/release-candidate. A binding change must preserve the repository and event semantics and pass the same recovery suite.
- This loop is a deterministic thesis-structure baseline, not research, observed evidence, model generation, a general graph compiler, or proof of creator value. The MCP inspector marks ten explicit facets and always keeps market evidence unobserved until a separate evidence path supplies it.
- The current process has no Keychain credential leases, third-party MCP/tool installation, external jobs, budgets beyond zero-cost local work, scheduling, backup/export, or signed release evidence.
- Clark Bridge currently exposes `clark.idea.start`, `clark.idea.revise`, `clark.runs.list`, `clark.run.get`, and one compact run resource. It cannot approve, mutate memory, install skills, access credentials, build, or publish.
- The Tool Pack lifecycle is executable and replayable, but its passing activation/update/rollback proof uses a synthetic non-provider fixture. OpenCut remains `blocked_upstream` with zero adapters, capabilities, converters, skills, UI contributions, or installed artifacts.
- Studio memory is deliberately not enumerable through the currently paired Bridge client. Any future Bridge memory surface requires a separate explicit memory-read scope and privacy review.
- Forgetting immediately removes a claim from retrieval, redacts the active projection, clears projected evidence/contradictions, and records derivative deletion. The original personal event payload remains in the immutable log until cryptographic erasure or compaction exists, so this slice does not claim complete physical deletion.
- Recovery coverage proves an interrupted local run plus orphaned capability/Bridge revocation; broader transition chaos, in-flight cancellation, and ambiguous external-mutation reconciliation remain release gates.

## Verify

```bash
npm ci
npm run verify
```
