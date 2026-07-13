# Clark Class B Skill Sandbox — Ground Spike

This is executable Ground evidence for [ADR-0017](../decisions/0017-skill-execution-sandbox.md), not the production skill runtime. It uses the real Wasmtime runtime with core WebAssembly/WASI Preview 1 fixtures to prove the deny-all and resource-control primitives before the production component-model/WIT embedding is built.

## Run

```bash
mkdir -p .runtime
gh release download v46.0.1 --repo bytecodealliance/wasmtime \
  --pattern 'wasmtime-v46.0.1-aarch64-macos.tar.xz' --dir .runtime
tar -xJf .runtime/wasmtime-v46.0.1-aarch64-macos.tar.xz -C .runtime
python3 verify.py --write-receipt
```

The official runtime release is pinned exactly and kept out of Git. The runner checks the macOS arm64 archive against the release digest `sha256:acee50be70dbe90b0ab2ac7db1321fc44715153a1b1cc58291c97b6d7cffc558`. Set `CLARK_WASMTIME` to an equivalent pinned binary on another supported architecture. The test creates only temporary input/output directories and writes the attributable result to `evidence/latest-sandbox-receipt.json` when requested.

## Proved here

- no inherited environment or credential canary;
- no undeclared host function, network interface, or process-spawn import;
- no filesystem without a preopen;
- one exact preopen over a read-only host fixture works while writes, traversal, and symlink escape fail;
- fuel and epoch deadlines terminate hostile loops;
- memory growth fails at the store limit;
- captured output above the Ground receipt budget is rejected;
- WASI stdout is captured, ANSI-control sanitized, and display-truncated;
- fixture hashes and the pinned runtime version appear in the receipt.

## Deliberate limitation

Production Class B execution still requires pinned WebAssembly components, a pinned WIT interface, explicit `WasiDirPerms`/`WasiFilePerms`, streaming output termination, process isolation, signed package verification, advisory monitoring, macOS runtime QA, and broader fuzz/hostile-component coverage. This spike must not be relabeled as the production sandbox.
