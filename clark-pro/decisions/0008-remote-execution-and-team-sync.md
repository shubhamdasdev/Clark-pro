# ADR-0008 — Remote Execution and Team Synchronization

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Relay, Team, Domain, Security

## Context

A Mac-first local product must still schedule work while the Mac sleeps, reconnect to long provider jobs, and eventually support teams. Moving all canonical personal state to a cloud backend would undermine ownership and create a second architecture. Pretending hosted/team support is only a database adapter would ignore identity, conflict, credential delegation, policy, tenancy, and availability.

## Decision

Keep personal identity, memory, credentials, and local project history canonical on the Mac. Clark Relay receives scoped, encrypted job envelopes for explicitly delegated work and returns signed receipts/events. Clark Team adds an encrypted workspace event relay, asset mirror, organization identity, roles, shared decision queues, conflict policy, and tenant isolation.

Personal and team creator models remain distinct unless an item is explicitly promoted into a shared scope. Remote workers receive only the artifact references, context slice, capability lease, budget, policy, and output contract needed for one job.

## Consequences

### Positive

- Studio remains usable and exportable during hosted outage.
- Remote execution does not make the cloud owner of the creator's full context.
- Team topology is added cumulatively over workspace-scoped events and policies.
- Delegation and synchronization are observable domain behavior.

### Costs

- Encrypted sync, conflict handling, device identity, key rotation, and offline convergence are major product systems.
- Some jobs cannot run remotely if provider credentials cannot be safely delegated.
- Team state needs a clear authority model when several replicas act concurrently.

## Rejected alternatives

- **Cloud canonical from day one:** violates local-first ownership and offline reliability.
- **Copy the local SQLite database to the cloud:** unsafe concurrency and credential/data leakage.
- **Give Relay the full Keychain:** destroys least privilege.
- **Last-write-wins for all conflicts:** invalid for approvals, publication, memory, and policy.
- **Mix personal and team memory automatically:** leaks identity and weakens consent.

## Invariants

1. A hosted outage cannot prevent local read, edit, backup, or export.
2. Remote envelopes cannot enumerate unrelated memory, assets, credentials, or accounts.
3. Every remote mutation returns a signed receipt tied to workspace, actor, device, intent, and policy.
4. Approval, publication, policy, and memory conflicts use domain-specific resolution—not generic last-write-wins.
5. Tenant and workspace identity are enforced below application query convenience.
6. Revocation stops future jobs and invalidates unstarted leases.

## Verification gates

- Remote worker compromise fixtures prove the envelope's blast radius is one job.
- Offline/local operations converge or surface explicit conflicts after reconnection.
- Duplicate, reordered, tampered, and replayed events are detected.
- Tenant-isolation tests run independently of ordinary application tests.
- Hosted outage, device loss, key rotation, member removal, and account revocation have documented recovery.

## Revisit triggers

- Evidence shows collaboration, not personal operation, is the primary product.
- macOS platform capabilities permit reliable always-on local scheduling without Relay for the intended use cases.
- A shared-workspace authority model requires a superseding canonical-ownership decision.
