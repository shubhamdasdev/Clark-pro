# ADR-0012 — Harness Lifetime and Local IPC

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Desktop, Harness, Security

## Context

The Harness must survive renderer reloads, isolate model/connector failures, and recover durable work after app restart. A separately installed daemon or localhost API would add discovery, impersonation, port-hijack, update skew, and lifecycle risk before the product needs always-on local work. Electron provides a supervised utility process and transferable MessagePorts.

## Decision

In local strata, run Clark Harness as a trusted, signed Electron `utilityProcess` supervised by the main process.

- Main launches a pinned bundled entry module only after `app.ready`.
- Main passes an explicit minimal environment; it never accepts the default inherited environment.
- Main and Harness communicate through a transferred MessagePort with versioned schema validation, request IDs, deadlines, backpressure, and maximum message sizes.
- Renderer never receives the privileged Harness port. It calls narrow preload APIs; main validates window/frame/sender and translates allowed commands.
- Harness stdout/stderr are piped through bounded structured redaction; `inherit` is forbidden in production.
- `allowLoadingUnsignedLibraries` remains false. Trusted Harness does not use `disclaim`; separately launched third-party processes do.
- Harness exits with the application. Event-backed recovery, not an always-running local daemon, restores incomplete work on next launch.
- Work that must continue while the app is quit or Mac is asleep belongs to scoped Relay, not a hidden LaunchAgent in Ground/Stratum 1.

Clark Bridge is a separate external-client boundary governed by ADR-0004 and explicit client authentication; it is not the internal Harness IPC channel.

## Consequences

### Positive

- No open TCP port, socket discovery, or shared local bearer token is needed for core Studio/Harness communication.
- Renderer compromise still crosses main-process validation before domain authority.
- App and Harness update atomically as one signed bundle.
- Restart behavior remains explicit and testable.

### Costs

- Local work stops when the app fully quits.
- Main becomes a small but security-critical command gateway.
- Utility-process compromise can access its explicitly granted local authority; it is isolated from the renderer, not magically sandboxed from all harm.

## Rejected alternatives

- **Independent localhost daemon from day one:** adds authentication, port/DNS-rebinding, version skew, installer, and persistence attack surface.
- **Renderer-to-Harness MessagePort:** bypasses main sender/window validation and expands compromised-renderer authority.
- **Harness in Electron main:** couples native lifecycle to untrusted provider and run-engine failures.
- **LaunchAgent for schedules:** obscures always-on behavior and duplicates the future Relay topology.

## Invariants

1. Only the signed main process can create the internal Harness channel.
2. Every message validates against a pinned contract version before dispatch.
3. Renderer cannot send arbitrary domain command names, filesystem paths, executables, or credential references.
4. Harness state is durable in events/checkpoints; process lifetime is never treated as persistence.
5. Third-party process output cannot write directly to the application terminal or logs.

## Verification gates

- IPC fuzz suite covers unknown channels, schema bombs, oversized messages, stale request IDs, replay, reordered replies, and compromised frames.
- Killing renderer/main/Harness at each state produces the expected fixture recovery with no duplicate mutation.
- Process/env inventory proves Harness receives only allowlisted variables and no ambient secrets.
- Static/runtime assertion proves no renderer receives the Harness MessagePort.
- App update cannot leave an older Harness binary paired with newer schemas.

## Evidence

- [Electron utilityProcess](https://www.electronjs.org/docs/latest/api/utility-process)
- [Electron process model](https://www.electronjs.org/docs/latest/tutorial/process-model)
- [Electron MessagePortMain](https://www.electronjs.org/docs/latest/api/message-port-main)
- [Electron sandboxing](https://www.electronjs.org/docs/latest/tutorial/sandbox)

## Revisit triggers

- Verified requirements demand local work after app quit and Relay cannot satisfy them.
- Electron changes the utility-process security or lifecycle contract.
- A signed XPC service provides materially better isolation with acceptable complexity.
