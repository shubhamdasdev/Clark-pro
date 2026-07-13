# ADR-0013 — stdio Server Secrets and Execution

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Connect, Security, Desktop

## Context

MCP authorization applies to HTTP transports; the specification directs stdio servers to retrieve credentials from their environment. A local MCP server is arbitrary code with the privileges and secrets given to its process. No wrapper can prevent a malicious server from abusing a credential it legitimately receives. Commands, environment inheritance, shell expansion, broad filesystem access, and long-lived credentials multiply that blast radius.

## Decision

Run approved stdio servers through a dedicated Clark Server Runner with these profiles:

### Default production profile

- exact executable and structured argv are pinned and shown without truncation before first launch/update;
- no shell, package-manager one-liner, `sudo`, command substitution, or user profile initialization;
- environment begins empty except required locale/runtime variables and explicit manifest values;
- cwd is isolated; filesystem grants are explicit inputs/read-only or a scoped project temp/output directory;
- stdin/stdout are the MCP channel; stderr is bounded/redacted; no listening network socket is exposed;
- runner uses the third-party/untrusted-process TCC responsibility profile and terminates with the connection;
- server revision, command, hash/signature, domains, permissions, and credential scopes are re-reviewed after change.

### Secret rule

Prefer remote HTTP OAuth or broker-mediated proxy credentials. If a stdio server only supports environment credentials, the broker may inject one dedicated, least-scope, short-lived credential into that child environment after explicit review. The secret is never placed in argv, a config file, the global app environment, logs, events, or model context. The UI states plainly that the server can read and misuse its assigned credential.

If a provider cannot offer a dedicated/rotatable credential with acceptable scope, the stdio server remains quarantined, read-only/manual, or unsupported. stdio secrets are never delegated to Relay.

## Consequences

### Positive

- The unavoidable trust is visible and bounded to one process, provider, and credential.
- Shell/startup-command attacks are removed from normal installation.
- Server updates cannot silently inherit trust or expanded secrets.

### Costs

- Some ecosystem servers will be incompatible with the production profile.
- Environment injection is still disclosure to the child and to any compromise inside that process.
- Strong host sandboxing for native Node/Python binaries remains platform-dependent; quarantine and scope are essential.

## Rejected alternatives

- **Pretend Keychain injection makes a malicious server safe:** the child necessarily receives the usable secret.
- **Secrets in argv:** exposed through process inspection and crash/diagnostic surfaces.
- **Inherit `process.env`:** leaks unrelated credentials, paths, and configuration.
- **Execute `npx ...` or shell snippets directly from server metadata:** turns configuration into arbitrary code execution.
- **One broad shared token across servers:** maximizes confused-deputy and exfiltration impact.

## Invariants

1. stdio configuration cannot contain a shell command string; executable and argv are separate fields.
2. Every injected credential is dedicated, least-scope, leased, attributable, revocable, and shown in effective permissions.
3. A server never receives Clark's master store, unrelated provider tokens, or workspace-wide file access.
4. Server stdout is protocol-only; logs and terminal control sequences are sanitized.
5. Updating executable/hash/command/domains/permissions/credential scope returns the revision to quarantine.

## Verification gates

- Malicious command manifests using shell metacharacters, `sudo`, package managers, path traversal, and hidden Unicode are rejected or require developer mode.
- Child environment snapshot contains only the allowlist and its own test credential canary.
- Canaries prove unrelated secrets/files/domains remain inaccessible under the declared profile.
- Process termination, token expiry, and revocation invalidate future calls and expose affected schedules.
- UI consent shows the exact executable, every argv element, file/network grants, and the unavoidable credential trust.

## Evidence

- [MCP authorization: stdio uses environment credentials](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization)
- [MCP security best practices: local server compromise](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)
- [Electron utility process options](https://www.electronjs.org/docs/latest/api/utility-process)

## Revisit triggers

- MCP standardizes a secure stdio credential broker/agent protocol.
- macOS provides a stable public sandbox profile suitable for arbitrary local runtimes.
- Provider offers a safer HTTP/OAuth adapter that supersedes stdio.
