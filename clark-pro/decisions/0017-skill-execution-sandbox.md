# ADR-0017 — Skill Execution Sandbox

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Skills, Security, Developer Platform

## Context

Agent Skills may contain instructions, references, assets, and scripts. Text that orchestrates already trusted Clark capabilities can remain declarative, but native Node/Python/shell code executes with host-user authority unless a real sandbox intervenes. Node's own WASI documentation explicitly warns that `node:wasi` is not a secure sandbox for untrusted code. Wasmtime/WASI provides a capability-based filesystem model but still requires defense-in-depth, resource limits, update discipline, and explicit host imports.

## Decision

Use three execution classes:

### Class A — Declarative skill (default)

`SKILL.md`, references, templates, and assets may guide Harness and invoke only already trusted Clark capabilities. The package itself executes no host code and cannot add permission. Most community/learned skills should remain Class A.

### Class B — Sandboxed component

Untrusted executable skill logic must be a pinned WebAssembly component run in an embedded, current Wasmtime/WASI runtime:

- no inherited environment, stdin, terminal, network, clocks, randomness, or filesystem by default;
- exact read-only input artifacts and isolated output/temp directories are preopened as capabilities;
- network is absent; all external work occurs through narrow typed host functions that re-enter Clark capability policy;
- memory/table/instance, fuel/epoch, CPU/wall time, output, and storage limits are mandatory;
- stdout/stderr are captured, size-limited, and control-sequence sanitized;
- host functions expose opaque refs, never raw credentials;
- component, runtime, WIT interface, permissions, and test vectors are pinned per revision.

Use Wasmtime, not `node:wasi`, as the security boundary.

### Class C — Trusted host script

Native, Node, Python, or shell scripts are allowed only when bundled/signed by Clark or explicitly enabled in local developer mode. They show exact executable/argv and run as high-risk capabilities in separate processes. Community packages cannot graduate to Class C merely through user-friendly install UI; they require verified publisher/signature, dedicated security review, and explicit broader trust.

## Consequences

### Positive

- Installable skills remain useful without normalizing arbitrary host code execution.
- Network/credential authority stays in Clark's capability policy.
- Learned procedures naturally produce declarative packages and tests.

### Costs

- Existing arbitrary-script skills may require porting to WASI or capability calls.
- Wasmtime becomes a security-critical native dependency with its own advisories/update cadence.
- WASI host interface design and resource metering are substantial work.

## Rejected alternatives

- **Run package scripts in Harness/utilityProcess:** grants host filesystem/network/user authority.
- **Use `node:wasi` as sandbox:** Node explicitly states it is not secure for untrusted code.
- **macOS `sandbox-exec` profile as permanent public contract:** not selected as a stable cross-version product API.
- **Containers/VM per skill by default:** excessive footprint/latency for ordinary procedure skills.
- **Static scan alone:** hidden/runtime behavior still escapes declarations.

## Invariants

1. Skill text/manifest cannot grant tools, credentials, domains, filesystem, or host functions.
2. Class B starts deny-all and receives only the effective intersection approved for that invocation.
3. No untrusted skill receives a raw credential or unrestricted network socket.
4. Runtime/component/interface update returns the revision to quarantine and reruns malicious/regression fixtures.
5. Class C is visibly different from ordinary skill trust and unavailable to remote/team execution by default.

## Verification gates

- Malicious components attempt traversal, symlink escape, undeclared host imports, network, environment, fork/exec, resource exhaustion, terminal injection, and credential discovery.
- Preopen and host-function inventories exactly match permission receipts.
- Fuel/epoch/memory/output limits terminate hostile infinite/resource workloads.
- Wasmtime security advisories block affected runtime releases and trigger quarantine/retest.
- Node/Python/shell community fixtures remain non-executable outside explicit Class C developer/security flow.

## Evidence

- [Wasmtime security model](https://docs.wasmtime.dev/security.html)
- [Wasmtime WASI preopened directory/network APIs](https://docs.wasmtime.dev/c-api/wasi_8h.html)
- [Node WASI security warning](https://nodejs.org/api/wasi.html)

## Revisit triggers

- WASI component stability or security no longer meets the supported Mac release policy.
- A safer OS-native or microVM boundary becomes practical for Class C.
- Creator evidence shows executable community skills are not worth their supply-chain burden.
