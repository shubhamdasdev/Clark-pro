# ADR-0005 — Keychain Credential Broker

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Security, Desktop, Connect, Relay

## Context

Clark connects to models, MCP servers, social accounts, analytics, storage, and remote workers. Secrets must not leak through graph JSON, events, diagnostics, model context, renderer state, exports, skills, or third-party processes. At the same time, a capability needs temporary access to exactly the credential and scopes required for one action.

## Decision

Store API keys, OAuth tokens, encryption keys, and Bridge client secrets in macOS Keychain behind a Clark credential broker. Ordinary databases contain opaque credential references, provider/account identity, scopes, health, and revocation state—not secret values.

The broker issues short-lived, capability-bound leases to approved harness steps. OAuth uses authorization code with PKCE and state validation. Remote workers receive a job-specific delegated token or provider grant when possible, never a wholesale copy of personal Keychain state.

API-key entry uses a broker-owned native or isolated credential sheet whose value is sent directly to Keychain; it is not an ordinary React form, renderer state, event, or IPC response. Bridge clients use one-time local pairing or broker-written configuration so long-lived client tokens are not rendered for copy/paste.

## Consequences

### Positive

- Secret access is centralized, observable, revocable, and separate from creative state.
- Workspace export cannot accidentally become a credential export.
- Capabilities and workers operate with least privilege and bounded lifetime.

### Costs

- Keychain denial, lock state, migration, account rotation, and recovery require first-class UX.
- Some providers have coarse scopes; Clark must display effective reality rather than imply precision.
- OAuth callback and token refresh logic become security-critical code.

## Rejected alternatives

- **Secrets in SQLite or graph manifests:** expands compromise and backup/export blast radius.
- **Environment variables as product storage:** poor lifecycle, scope, UX, and revocation model.
- **Renderer-owned OAuth/tokens:** violates the renderer boundary.
- **Giving connectors the master credential store:** prevents least privilege and reliable revocation.
- **Copying Keychain state to Relay:** makes the cloud a credential owner.

## Invariants

1. No raw secret appears in domain events, logs, diagnostics, model packets, exports, or renderer messages.
2. A lease binds credential reference, capability, action class, workspace, scopes, expiry, and run step.
3. Refresh tokens and encryption keys never enter connector stdout/stderr.
4. Revocation invalidates active leases and marks dependent scheduled work blocked.
5. OAuth callbacks bind state, PKCE verifier, expected provider, and initiating local session.
6. Secret-entry and Bridge-pairing flows never return the secret value to the renderer.

## Verification gates

- Secret canary tests scan events, logs, crash reports, exports, IPC, and model requests.
- Renderer and untrusted skill compromise tests cannot request arbitrary credential references.
- Lease expiry, scope mismatch, revocation during a job, refresh failure, and Keychain denial have deterministic states.
- OAuth CSRF, callback substitution, loopback-port race, and token replay tests fail safely.
- Instrumented renderer tests prove API-key entry, OAuth completion, refresh, and Bridge pairing expose status and opaque references only.
- Remote job envelopes prove they cannot enumerate or use unrelated credentials.

## Revisit triggers

- A hardware-backed or enterprise secret provider is required; it should implement the broker interface.
- Team accounts require organization-managed credentials with a separate ownership ADR.
