#!/usr/bin/env python3
"""Ground-only hostile fixture orchestrator for the pinned Wasmtime CLI."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import stat
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent
FIXTURES = ROOT / "fixtures"
DEFAULT_RUNTIME = ROOT / ".runtime" / "wasmtime-v46.0.1-aarch64-macos" / "wasmtime"
RELEASE_ARCHIVE = ROOT / ".runtime" / "wasmtime-v46.0.1-aarch64-macos.tar.xz"
RELEASE_ARCHIVE_SHA256 = "acee50be70dbe90b0ab2ac7db1321fc44715153a1b1cc58291c97b6d7cffc558"
WASMTIME = Path(os.environ.get("CLARK_WASMTIME", DEFAULT_RUNTIME))
ANSI = re.compile(rb"\x1b(?:\[[0-?]*[ -/]*[@-~]|\][^\x07]*(?:\x07|\x1b\\))")
CASES: list[dict[str, object]] = []
BASE_WASI = [
    "-S", "inherit-env=n,inherit-stdin=n,inherit-stderr=n,inherit-network=n,tcp=n,udp=n,allow-ip-name-lookup=n"
]


def record(case_id: str, boundary: str, passed: bool, observation: str) -> None:
    if not passed:
        raise AssertionError(f"{case_id}: {observation}")
    CASES.append({"id": case_id, "boundary": boundary, "result": "pass", "observation": observation})


def run(fixture: str, *options: str, env: dict[str, str] | None = None, timeout: float = 3.0) -> subprocess.CompletedProcess[bytes]:
    command = [str(WASMTIME), *BASE_WASI, *options, "--invoke", "run", str(FIXTURES / fixture)]
    return subprocess.run(command, capture_output=True, env=env, timeout=timeout, check=False)


def returned_i32(result: subprocess.CompletedProcess[bytes]) -> int:
    lines = [line.strip() for line in result.stdout.splitlines() if line.strip()]
    if result.returncode != 0 or not lines:
        raise AssertionError(f"expected i32 result; rc={result.returncode} stderr={result.stderr.decode(errors='replace')}")
    return int(lines[-1])


def verify_runtime() -> tuple[str, str]:
    if not WASMTIME.is_file():
        raise AssertionError(f"missing pinned runtime at {WASMTIME}; follow README bootstrap instructions")
    version = subprocess.run([str(WASMTIME), "--version"], capture_output=True, text=True, check=True).stdout.strip()
    record("runtime-pinned", "supply_chain", version.startswith("wasmtime 46.0.1 "), version)
    archive_digest = hashlib.sha256(RELEASE_ARCHIVE.read_bytes()).hexdigest() if RELEASE_ARCHIVE.is_file() else "external-runtime"
    if WASMTIME == DEFAULT_RUNTIME:
        record("runtime-release-digest", "supply_chain", archive_digest == RELEASE_ARCHIVE_SHA256, f"release archive sha256:{archive_digest}")
    return version, archive_digest


def verify_environment_and_credentials() -> None:
    environment = os.environ.copy()
    environment["CLARK_GROUND_RAW_CREDENTIAL_CANARY"] = "must-never-enter-wasi"
    result = run("environment-probe.wat", env=environment)
    count = returned_i32(result)
    record("environment-deny", "environment", count == 0, f"guest observed {count} inherited environment entries")
    record("credential-env-canary", "credentials", count == 0, "host credential canary was not inherited")


def verify_import_denials() -> None:
    for fixture, case_id, boundary in [
        ("undeclared-host-import.wat", "undeclared-host-deny", "host_imports"),
        ("network-import.wat", "network-import-deny", "network"),
        ("process-import.wat", "process-spawn-deny", "process"),
    ]:
        result = run(fixture)
        error = result.stderr.decode(errors="replace").lower()
        record(case_id, boundary, result.returncode != 0 and "unknown import" in error, "link failed closed because the host did not define the requested authority")


def verify_filesystem() -> None:
    without_preopen = returned_i32(run("path-allowed.wat"))
    record("filesystem-default-deny", "filesystem", without_preopen != 0, f"path_open errno={without_preopen} without a preopen")
    with tempfile.TemporaryDirectory(prefix="clark-sandbox-") as temp:
        root = Path(temp)
        inputs = root / "inputs"
        inputs.mkdir()
        allowed_file = inputs / "allowed.txt"
        allowed_file.write_text("allowed")
        secret = root / "secret.txt"
        secret.write_text("CLARK_FILE_CREDENTIAL_CANARY")
        (inputs / "link.txt").symlink_to(secret)
        allowed_file.chmod(stat.S_IRUSR | stat.S_IRGRP | stat.S_IROTH)
        inputs.chmod(stat.S_IRUSR | stat.S_IXUSR | stat.S_IRGRP | stat.S_IXGRP | stat.S_IROTH | stat.S_IXOTH)
        preopen = "--dir"
        mapping = f"{inputs}::/input"
        allowed = returned_i32(run("path-allowed.wat", preopen, mapping))
        traversal = returned_i32(run("path-traversal.wat", preopen, mapping))
        symlink = returned_i32(run("path-symlink.wat", preopen, mapping))
        write = returned_i32(run("path-write.wat", preopen, mapping))
        record("filesystem-exact-preopen", "filesystem", allowed == 0, f"the one declared input opened with errno={allowed}")
        record("filesystem-traversal-deny", "filesystem", traversal != 0, f"parent traversal failed with errno={traversal}")
        record("filesystem-symlink-escape-deny", "filesystem", symlink != 0, f"symlink escape failed with errno={symlink}")
        record("filesystem-readonly-deny", "filesystem", write != 0 and not (inputs / "created.txt").exists(), f"write/create failed with errno={write}")
        record("credential-file-canary", "credentials", traversal != 0 and symlink != 0, "credential canary outside the preopen stayed unreachable")


def verify_resource_limits() -> None:
    fuel = run("infinite-loop.wat", "-W", "fuel=10000")
    record("fuel-exhaustion-trap", "fuel", fuel.returncode != 0 and b"fuel" in fuel.stderr.lower(), "infinite loop trapped after consuming 10,000 fuel")
    deadline = run("infinite-loop.wat", "-W", "timeout=20ms", timeout=1.0)
    deadline_error = deadline.stderr.lower()
    record("epoch-deadline-trap", "wall_time", deadline.returncode != 0 and (b"interrupt" in deadline_error or b"deadline" in deadline_error), "infinite loop trapped at the 20ms engine deadline")
    memory = returned_i32(run("memory-grow.wat", "-W", "max-memory-size=65536,max-instances=1,max-memories=1,max-tables=0"))
    record("memory-growth-deny", "memory", memory == -1, f"memory.grow returned {memory}; -1 is fail-closed")


def verify_output() -> None:
    limit = 16
    flood = run("output-flood.wat")
    accepted = flood.returncode == 0 and len(flood.stdout) <= limit
    record("output-budget-reject", "output", not accepted and len(flood.stdout) == 24, f"receipt rejected {len(flood.stdout)} captured bytes above the {limit}-byte budget")
    controlled = run("stdout-control.wat")
    sanitized = ANSI.sub(b"", controlled.stdout)
    preview = sanitized[:8]
    record("stdout-captured", "output", controlled.returncode == 0 and b"CANARY" in controlled.stdout, f"captured {len(controlled.stdout)} stdout bytes in the child pipe")
    record("stdout-sanitized-and-truncated", "terminal", b"\x1b" not in sanitized and len(preview) == 8 and len(sanitized) > len(preview), "ANSI controls were removed and the display preview was byte-limited")


def build_receipt(runtime_version: str, archive_digest: str) -> dict[str, object]:
    hashes = {path.name: "sha256:" + hashlib.sha256(path.read_bytes()).hexdigest() for path in sorted(FIXTURES.glob("*.wat"))}
    return {
        "schemaVersion": 1,
        "evidenceId": "clark.skill-sandbox.ground-spike",
        "runtime": {"name": "wasmtime", "version": runtime_version, "release": "v46.0.1", "releaseArchiveSha256": archive_digest, "wasiModel": "core-preview1-ground-spike"},
        "policy": {"environmentInherited": False, "networkInterfacesDefined": False, "filesystemDefault": "none", "preopens": "one_fixture_directory", "preopenWriteBehavior": "denied_by_readonly_host_fixture", "rawCredentialsExposed": False, "outputLimitBytes": 16, "memoryLimitBytes": 65536, "fuel": 10000, "engineDeadlineMs": 20},
        "cases": CASES,
        "fixtureHashes": hashes,
        "result": "pass",
        "limitations": [
            "This Ground spike proves Wasmtime CLI denial and metering primitives with core Wasm/WASI Preview 1; production must use pinned components and WIT interfaces.",
            "The CLI directory flag does not express WasiDirPerms; this spike combines one exact preopen with a read-only host fixture. Production embedding must set explicit read-only directory and file capabilities.",
            "The orchestrator rejects captured output above budget after the fixture returns. Production must enforce the byte limit while streaming and terminate the guest on overflow.",
            "It does not replace process isolation, advisory monitoring, signed package verification, macOS runtime QA, or production fuzzing."
        ]
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write-receipt", action="store_true")
    args = parser.parse_args()
    runtime_version, archive_digest = verify_runtime()
    verify_environment_and_credentials()
    verify_import_denials()
    verify_filesystem()
    verify_resource_limits()
    verify_output()
    result = build_receipt(runtime_version, archive_digest)
    result["generatedAt"] = datetime.now(timezone.utc).isoformat()
    if args.write_receipt:
        destination = ROOT / "evidence" / "latest-sandbox-receipt.json"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({"runtime": result["runtime"], "cases": len(CASES), "result": result["result"]}, indent=2))


if __name__ == "__main__":
    main()
