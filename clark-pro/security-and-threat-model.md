# Clark Pro — Security and Threat Model

**Status:** authoritative Ground design; controls are specified but not yet implemented or verified.  
**Date:** July 12, 2026  
**Owners:** Security, Desktop, Harness, Connect, Memory, Relay, Release Engineering

## 1. Scope and security claim

Clark handles unusually sensitive material: a creator's identity model, unpublished work, sources, credentials, connected social accounts, local files, paid model access, installable code, and publishing authority. “Local-first” reduces some cloud exposure but does not make the product secure by default. The Mac app contains untrusted content and talks to untrusted services while holding authority to act.

This model covers:

- signed/notarized Mac application, renderer, main process, harness, and media workers;
- local databases, asset store, backups, imports, and diagnostics;
- model providers, MCP servers, direct APIs, Postiz, browsers, and social accounts;
- Agent Skills and Clark Kit packages;
- Clark Bridge clients;
- optional Relay workers, synchronization, and Team tenancy;
- updates, build artifacts, and third-party dependencies.

It does not claim to protect an unlocked Mac from an administrator/root compromise, malicious kernel extension, compromised macOS, hardware implant, or a provider that intentionally violates its contractual data policy. Those are residual/environmental risks that must be disclosed.

## 2. Security objectives

1. **Creator authority:** no paid, publishing, account, memory, skill, or destructive mutation occurs outside the effective policy and recorded approval.
2. **Secret containment:** raw credentials never enter renderer state, domain events, normal databases, logs, diagnostics, exports, model context, or memory.
3. **Workspace isolation:** a client, skill, capability, team member, or remote worker cannot access another workspace or a more sensitive scope.
4. **Canonical integrity:** artifacts, decisions, approvals, publications, memories, skills, and events cannot be silently overwritten, reordered, or forged.
5. **Egress control:** the creator can know which data may leave the Mac and which provider receives it before execution.
6. **Recoverable execution:** failure, restart, timeout, cancellation, or ambiguous provider state cannot cause silent loss or duplicate external mutation.
7. **Supply-chain trust:** packages and updates cannot gain authority merely by being installed or described as safe.
8. **Correctable personalization:** prompt injection, noisy outcomes, or mistaken inference cannot silently become active memory or skill behavior.
9. **Availability with limits:** loops cannot consume unbounded compute, network, storage, model spend, or publishing quota.
10. **Portable exit:** security controls cannot be used to trap the creator's non-secret canonical data.

## 3. Assets and data classification

| Class | Examples | Default handling |
|---|---|---|
| **Public** | already-published posts, public source URLs, public profile fields | May enter allowed providers; still integrity-checked |
| **Workspace** | drafts, project events, ordinary research, loop definitions, analytics | Local by default; scoped provider egress is visible and recorded |
| **Personal** | creator preferences, private notes, audience hypotheses, unpublished media | Explicit task need and provider policy required |
| **Confidential** | client material, day-job details, private correspondence, unreleased business data | Never remote by default; explicit per-run exception and redaction preview |
| **Secret reference** | opaque Keychain ID, credential/account metadata, lease ID | May exist in domain state; cannot resolve outside the broker |
| **Raw secret** | API key, access/refresh token, encryption key, Bridge client secret | Keychain/broker only; never renderer, event log, export, model, or diagnostic |

Classification follows an artifact and its derived context. A summary is not automatically less sensitive than its source. Combining individually ordinary items can raise sensitivity.

## 4. Actors and adversaries

### Legitimate actors

- local creator and explicitly registered devices;
- authorized team members with workspace roles;
- Clark Studio, Harness, trusted capabilities, and scoped workers;
- registered Clark Bridge clients;
- provider and platform identities authenticated through the broker.

### Adversaries and failure sources

- malicious or compromised web/source content carrying prompt injection or active payloads;
- malicious MCP server, MCP client, skill, connector, renderer extension, or package update;
- compromised model, social, media, analytics, or aggregator service;
- another local process attempting loopback, IPC, file, or token access;
- team member or client exceeding intended scope;
- supply-chain compromise of Clark, Electron, npm packages, native binaries, skills, or updater;
- accidental user approval, wrong-account selection, stale version, or misclassification;
- provider ambiguity, schema drift, replay, duplication, and unreliable analytics;
- denial-of-service and cost exhaustion, whether intentional or caused by a loop bug.

## 5. Trust zones and data flow

```text
UNTRUSTED CONTENT / PROVIDERS / PACKAGES / CLIENTS
        │ validated schemas, identities, signatures, policies
        ▼
┌───────────────────────────────────────────────────────────┐
│ Renderer sandbox                                          │
│ untrusted previews + presentation-only state              │
└───────────────┬───────────────────────────────────────────┘
                │ typed allowlisted IPC; no raw secrets
┌───────────────▼───────────────────────────────────────────┐
│ Main process                                              │
│ native lifecycle, validated navigation, broker UI bridge  │
└───────────────┬───────────────────────────────────────────┘
                │ authenticated local protocol
┌───────────────▼───────────────────────────────────────────┐
│ Harness policy boundary                                   │
│ commands, event log, run engine, context, capability ACL  │
└───────┬──────────────────┬──────────────────────┬─────────┘
        │ scoped lease      │ job envelope         │ events
┌───────▼────────┐  ┌──────▼──────────┐  ┌────────▼─────────┐
│ Credential     │  │ Connector/media │  │ SQLite + assets  │
│ broker/Keychain│  │ worker sandbox  │  │ + backups        │
└────────────────┘  └────────┬────────┘  └──────────────────┘
                              │ allowlisted egress
                    MCP / models / social / Relay
```

Crossing a line never inherits trust automatically. The Harness validates identity, workspace, schema, policy, action class, cost, sensitivity, and current approval before granting a capability or credential lease.

## 6. Authorization model

The effective permission for an action is:

```text
authenticated actor/client scope
∩ workspace and project role
∩ action-class autonomy policy
∩ capability/skill declaration
∩ capability/skill trust
∩ credential/account scope
∩ artifact sensitivity and egress policy
∩ current run budget and approval
```

An empty intersection denies the action. Descriptions, prompts, manifests, tool annotations, and model claims cannot add permission. Approval is specific to actor, action class, artifact version, account, destination, policy revision, budget range, and expiration.

## 7. Threat register

Maturity values are **Specified**, **Implemented**, or **Verified**. Every row is currently Specified only.

| ID | Threat and consequence | Risk | Required controls | Required verification | Maturity |
|---|---|---:|---|---|---|
| DESK-01 | Generated HTML, media metadata, or provider content escapes preview and executes privileged code | Critical | sandboxed renderer, no Node integration, context isolation, CSP, safe preview transforms, no remote privileged content | XSS/content corpus cannot access preload authority, files, shell, network credentials, or navigation | Specified |
| IPC-01 | Compromised renderer forges privileged IPC or confuses a handler | Critical | allowlisted channels, versioned schemas, sender/window/origin validation, request identity, no generic invoke/eval | fuzz every IPC input and attempt from untrusted frame/window | Specified |
| NATIVE-01 | Deep link, file-open, drag/drop, clipboard, notification, or custom URL injects a command/path | High | parse as untrusted input, explicit confirmation for mutations, canonical path validation, size/type limits | malicious URL/path/Unicode/symlink corpus | Specified |
| FILE-01 | Import, archive, media, or preview causes traversal, symlink escape, zip bomb, parser exploit, or disk exhaustion | High | stage imports, canonicalize paths, reject archive escape, quotas, content sniffing, worker isolation, content hashes | traversal/archive bomb/polyglot/oversize fixtures | Specified |
| HARNESS-01 | Tool input becomes shell injection or arbitrary local execution | Critical | no shell-string composition, executable allowlist, structured argv, constrained cwd/env, worker sandbox, action policy | metacharacter/path/env injection corpus and unauthorized executable attempts | Specified |
| LOCAL-01 | Another local process impersonates Studio/Harness, hijacks loopback callback, or calls the daemon | High | per-install/device identity, authenticated local channel, restrictive socket permissions, random callback state/port, localhost bind | local spoof, replay, socket theft, callback race | Specified |
| CRED-01 | Raw API/OAuth/social credentials leak through UI, IPC, events, logs, crash reports, context, exports, or child processes | Critical | broker-owned secret entry, Keychain, opaque references, short leases, redaction/canaries, no renderer return | secret canary scan across every output and crash path | Specified |
| OAUTH-01 | OAuth CSRF, redirect substitution, PKCE theft, token replay, or wrong-account binding | Critical | authorization code + PKCE, strong state/nonce, exact redirect/provider/session binding, account confirmation, token rotation | callback substitution, replay, wrong-provider/account, refresh theft tests | Specified |
| MCP-S01 | Malicious server descriptions, prompts, schemas, output, sampling request, or tool behavior manipulates Clark or exfiltrates data | Critical | untrusted metadata, schema limits, trust levels, capability ACL, egress policy, output sanitization, cancellation/timeouts | hostile MCP conformance server and prompt-injection fixtures | Specified |
| MCP-C01 | Clark Bridge client becomes a confused deputy and uses Clark's credentials outside its scope | Critical | explicit client registration, scoped tokens, domain command reuse, intent IDs, approval behavior, audit, revocation | cross-workspace/sensitivity/account/action and replay attempts | Specified |
| SKILL-01 | Skill package hides executable behavior, expands tools on update, reads secrets/files, or reaches undeclared domains | Critical | pinned source hash, quarantine, static/dynamic scan, declared domains/tools, permission intersection, sandbox, tests, promotion/rollback | malicious package suite and update permission-diff tests | Specified |
| AI-01 | Source prompt injection or model output requests tools/data beyond the creator's intent | Critical | source/data instruction separation, bounded context compiler, tool allowlist, policy before every call, egress preview, no model-granted permission | indirect injection corpus across web, PDF, image OCR, memory, and tool results | Specified |
| MEM-01 | Sensitive or irrelevant memory leaks to a provider, client, team member, or output | Critical | typed sensitivity, scoped retrieval, provider/data policy, minimum context, remote packet preview, retrieval audit | cross-scope and canary leakage evaluation | Specified |
| MEM-02 | Weak outcome, malicious source, or mistaken inference poisons permanent memory/strategy | High | proposal-only learning, evidence/contradiction/confidence, explicit promotion, expiry, dispute, rollback | poisoned evidence cannot become active without attributable approval | Specified |
| PUB-01 | Duplicate, wrong-account, wrong-version, or unintended publication damages reputation | Critical | version/account-specific approval, publication intent ledger, idempotency, destination preview, reconciliation, no blind retry | ambiguous timeout, stale approval, account switch, duplicate/replay fixtures | Specified |
| PUB-02 | Provider/platform reports false or incomplete final state and Clark presents it as truth | High | submitted vs verified states, provider receipt, independent observation when available, requires-human-check state | delayed/missing/contradictory provider status fixtures | Specified |
| COST-01 | Recursive/parallel loops exhaust model spend, media quota, CPU, storage, or platform rate limits | High | compile-time quote, hard budgets, bounded concurrency/depth/time, quotas, cancellation, rate limits, reservation ledger | runaway loop and cancellation-under-load tests | Specified |
| UPDATE-01 | Compromised update, dependency, native binary, or build pipeline gains local authority | Critical | protected build identity, reproducible build metadata, lockfiles, SBOM, signatures, notarization, updater signature, staged rollout, rollback | provenance/signature/tamper/rollback drills | Specified |
| LOG-01 | Logs, telemetry, analytics, diagnostics, or support bundles expose content, prompts, identifiers, paths, or secrets | High | structured allowlist logging, redaction, local preview, opt-in submission, retention limits, secret canaries | snapshot and canary scan of every diagnostic class | Specified |
| BACKUP-01 | Backup/export exposes personal or confidential state or silently loses integrity | High | explicit destination, optional encryption, checksums, no raw secrets, manifest/classification summary, restore verification | stolen-export review, corruption, partial restore, wrong-key tests | Specified |
| RELAY-01 | Remote worker or relay reads unrelated context/credentials, alters jobs, replays receipts, or crosses tenant | Critical | encrypted scoped envelopes, device/service identity, signed receipts, nonce/expiry, tenant/workspace enforcement, egress allowlist | compromised-worker blast-radius and tenant-isolation suite | Specified |
| SYNC-01 | Reordered, duplicated, forged, or conflicting events corrupt team truth or approvals | Critical | event identity/hash/signature, monotonic actor sequence, replay detection, domain-specific conflict resolution | tamper/reorder/duplicate/offline-concurrency fixtures | Specified |
| PRIV-01 | Provider retention/training/residency behavior conflicts with creator expectation | High | provider policy metadata, per-workspace allow/deny, visible egress destination, local alternative, no silent fallback to weaker policy | policy routing fixtures and provider configuration audit | Specified |
| AVAIL-01 | Connector outage, provider removal, account revocation, or corrupted projection blocks access to owned work | High | local canonical state, projection rebuild, export fallback, adapter health, read-only recovery, backup/restore | outage and dependency-removal game days | Specified |

## 8. Credential and identity flows

### 8.1 API key entry

1. Renderer requests `credential.setup(provider)` with provider identity only.
2. Main opens a broker-owned native or isolated secret sheet.
3. Secret value goes directly to the broker/Keychain and is zeroed from transient buffers where practical.
4. Harness receives an opaque credential reference plus verified provider/account metadata.
5. Renderer receives status, account label, scopes, and opaque reference—never the secret.
6. A non-mutating provider health check runs under a short lease.

### 8.2 OAuth authorization code with PKCE

1. Harness creates state, nonce, PKCE verifier/challenge, provider, expected scopes, workspace, and initiating session.
2. Main opens the system browser; OAuth never occurs inside an untrusted embedded provider page with Node authority.
3. Exact registered deep link or random localhost callback returns code + state.
4. Broker validates state/session/provider/redirect and exchanges the code with the verifier.
5. Broker stores tokens in Keychain and returns opaque account connection metadata.
6. User confirms the actual external account and effective scopes before workspace grant.
7. Refresh, rotation, expiry, and revocation stay in the broker.

### 8.3 Local MCP stdio server

1. User reviews package/executable identity, command, cwd, declared capabilities, domains, and requested credential references.
2. Harness launches the pinned executable with structured argv and a minimal environment.
3. If unavoidable, a server receives only its own short-lived secret via the least exposed mechanism it supports; the limitation is shown.
4. Tool discovery remains untrusted until capability review.
5. Calls run with workspace/action scopes, timeouts, output limits, and receipts.
6. Disconnect/revocation terminates the process and invalidates leases.

### 8.4 Remote MCP/API capability

1. Server origin, transport, TLS expectations, publisher/trust level, tool schemas, and requested auth are recorded.
2. Broker attaches a scoped credential lease only after policy approves the exact capability/action.
3. Context compiler supplies the minimum permitted inputs; egress destination and sensitivity are logged.
4. Response is size/schema/content validated before becoming an artifact or event.
5. Mutation receives an intent ID and reconciliation path.

### 8.5 Clark Bridge client pairing

1. Local user initiates pairing and reviews client identity, workspaces, resources, tools, action classes, and expiry.
2. Broker uses one-time localhost pairing or writes client configuration with user confirmation; long-lived token is not returned to renderer state.
3. Every call authenticates the client and re-evaluates current scopes/policy.
4. Mutations call the same domain handlers as Studio and require intent/approval semantics.
5. Revocation takes effect immediately and remains an audit event.

### 8.6 Relay job delegation

1. Harness compiles a job envelope containing job ID, workspace, pinned input references or encrypted blobs, minimum context, capability, budget, policy, expiry, and output contract.
2. Broker creates job-specific delegation; personal Keychain contents never synchronize.
3. Envelope is encrypted to the worker/service identity and authenticated by the device.
4. Worker cannot discover other workspace state and sends only allowlisted egress.
5. Signed receipt and output hashes return to the local event log.
6. Late/replayed output is rejected or enters explicit reconciliation.

## 9. Content and model egress controls

Before a remote step, the run plan must show:

- provider and capability receiving data;
- artifact references and exact excerpt/derived fields, not merely “project context”;
- sensitivity class and any redaction;
- reason each memory item is included;
- provider retention/training/residency policy known to Clark;
- whether the call is paid, mutating, or eligible for remote execution;
- local or lower-egress alternative when one exists.

The model never sees raw secret values, credential references it can resolve, unrestricted filesystem paths, other workspace indexes, or hidden policy text that would grant new authority. Tool calls from a model are proposals evaluated by Harness policy, not executable instructions.

## 10. Supply-chain and update controls

- Reproducible build metadata, locked dependencies, SBOM, license/security scan, and signed provenance for every release.
- Separate protected signing/notarization identity from ordinary developer credentials.
- Electron, Node, native media binaries, MCP SDK, database extensions, and updater remain on explicit supported versions.
- Update manifest and package signatures are verified before install.
- Staged rollout, migration preview, backup checkpoint, health check, and automatic/read-only rollback path.
- Skills, connectors, templates with scripts, and Clark Kit packages retain publisher, source revision, hash, compatibility, permission diff, test results, and quarantine state.
- A trusted prior version remains available until the new revision passes post-update health and migration checks.

## 11. Security verification matrix

| Gate | Ground evidence | Production evidence | Owner |
|---|---|---|---|
| Process boundary | ADR-0001 + IPC/preload inventory design | renderer-compromise and IPC fuzz suite | Desktop + Security |
| Canonical integrity | ADR-0002 + event/schema contracts | replay, migration, corruption, restore tests | Domain + Data |
| Harness safety | ADR-0003 + state machines | chaos, cancellation, idempotency, command-injection tests | Harness + Quality |
| MCP/Bridge isolation | ADR-0004 + capability/scopes contract | malicious server/client conformance suites | Connect + Security |
| Secret containment | ADR-0005 + credential flows | canary scans, OAuth attacks, lease/revocation tests | Security + Desktop |
| Publication authority | ADR-0006 + ledger states | stale/duplicate/wrong-account/reconciliation tests | Distribution + Quality |
| Memory/skill governance | ADR-0007 + proposal/permission model | leakage, poisoning, malicious-package, rollback tests | Memory + Skills + Security |
| Remote/team isolation | ADR-0008 + envelope/sync protocol | tenant isolation, tamper/replay, compromised-worker suite | Relay + Security |
| Human authority comprehension | ADR-0009 + prototype rubric | five observed creator walkthroughs | Product + Research |
| Release integrity | ADR-0010 + release gates | provenance, notarization, update and rollback drills | Release Engineering |

No row moves to Verified from a document review alone. Verification requires the named executable evidence against the shipped topology.

## 12. Incident and revocation behavior

### Suspected credential compromise

1. Revoke provider/account through broker and provider where possible.
2. Invalidate leases and block dependent scheduled work.
3. Show affected capabilities, runs, publications, and remote jobs without exposing the token.
4. Rotate and reauthorize; reconcile external mutations made during the uncertainty window.
5. Preserve an incident receipt and redacted diagnostics.

### Malicious skill, connector, or MCP server

1. Quarantine revision and terminate active processes/calls.
2. Revoke credential and workspace grants.
3. Identify calls, files, events, egress, outputs, and memories influenced by the revision.
4. Mark derived artifacts for review rather than deleting history.
5. Roll back to the last trusted revision and publish a compatibility/security advisory.

### Compromised Clark release or signing identity

1. Stop rollout and revoke update metadata/signing credentials where supported.
2. Notify affected versions and force read-only safe mode when trust cannot be established.
3. Provide independently verifiable clean installer and workspace export path.
4. Preserve local data; do not require opening an untrusted workspace in the compromised build.

### Relay/team incident

1. Revoke service/device/member identity and job leases.
2. Stop remote mutations while retaining local workspace access.
3. Verify event/receipt signatures and identify tenant/workspace exposure.
4. Rotate encryption keys and re-encrypt future state; document backup/history limits.

## 13. Residual risks and open security decisions

1. Exact macOS sandbox/entitlement design for local MCP executables and Swift Share extension.
2. Secure mechanism for injecting a credential into third-party stdio servers that only accept environment variables.
3. Choice of authenticated local IPC transport and device identity storage.
4. Remote envelope encryption, signing, key rotation, and recovery protocol.
5. Team event conflict rules and cryptographic actor sequence design.
6. Provider policy metadata source, freshness, and how Clark represents unverifiable retention claims.
7. Sandboxing technology for third-party skill scripts across interpreted runtimes.
8. Telemetry default, crash reporter vendor, retention, and regional processing.
9. Encrypted backup UX and recovery-key loss model.
10. Vulnerability disclosure, security-contact, update-support lifetime, and incident notification policy.

These are not permission to hand-wave implementation. Each must become a superseding ADR, protocol specification, or release-blocking test plan before its dependent stratum ships.

## 14. Ground security gate

Ground is security-ready only when:

1. every privileged data path maps to a trust boundary and threat ID;
2. every raw-secret flow ends at the broker/Keychain and never traverses renderer state;
3. every external mutation maps to actor, artifact version, account, intent, policy, approval, and reconciliation;
4. every package/client/server/worker has an identity, trust state, scope, revocation path, and audit trail;
5. open security decisions are assigned to an owner and block the correct dependent stratum;
6. security reviewers can derive the required executable tests from this model without inventing missing product semantics.
