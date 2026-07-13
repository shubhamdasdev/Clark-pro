import fs from "node:fs";
import path from "node:path";
import { sha256 } from "./canonical.mjs";

function gate(id, label, status, evidence) {
  return { id, label, status, evidence };
}

function walkPackageFiles(root, current = root) {
  const files = [];
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const absolute = path.join(current, entry.name);
    const relative = path.relative(root, absolute).split(path.sep).join("/");
    if (entry.isSymbolicLink()) {
      files.push({ relative, absolute, kind: "symlink" });
    } else if (entry.isDirectory()) {
      files.push(...walkPackageFiles(root, absolute));
    } else if (entry.isFile() && relative !== "manifest.json") {
      files.push({ relative, absolute, kind: "file" });
    }
  }
  return files;
}

export function inspectSkillPackageDirectory(manifest, packageDirectory) {
  const root = fs.realpathSync(packageDirectory);
  const actualEntries = walkPackageFiles(root);
  const actualByPath = new Map(actualEntries.map((entry) => [entry.relative, entry]));
  const declaredPaths = new Set(manifest.files.map((file) => file.path));
  const observations = [];
  let fileIntegrity = actualEntries.every((entry) => entry.kind === "file") &&
    actualEntries.length === manifest.files.length && actualEntries.every((entry) => declaredPaths.has(entry.relative));
  const observedFiles = [];

  for (const declared of manifest.files) {
    const entry = actualByPath.get(declared.path);
    const resolved = path.resolve(root, declared.path);
    const contained = resolved.startsWith(`${root}${path.sep}`);
    if (!entry || entry.kind !== "file" || !contained) {
      fileIntegrity = false;
      observations.push(`${declared.path} is missing, linked, or outside the package root`);
      continue;
    }
    const stat = fs.lstatSync(entry.absolute);
    const contentHash = sha256(fs.readFileSync(entry.absolute));
    const unexpectedExecutableBit = !declared.executable && Boolean(stat.mode & 0o111);
    if (contentHash !== declared.contentHash || unexpectedExecutableBit) fileIntegrity = false;
    observedFiles.push({ path: declared.path, contentHash });
    if (contentHash !== declared.contentHash) observations.push(`${declared.path} content hash differs from the manifest`);
    if (unexpectedExecutableBit) observations.push(`${declared.path} has an undeclared executable mode`);
  }

  observedFiles.sort((left, right) => left.path.localeCompare(right.path));
  const observedSourceHash = sha256({ files: observedFiles });
  const sourceIntegrity = fileIntegrity && observedSourceHash === manifest.source.contentHash;
  if (!sourceIntegrity) observations.push("Observed package bytes do not match the immutable source hash");

  const executionBoundaryVerified = manifest.executionClass === "A" && !manifest.entrypoint &&
    manifest.files.every((file) => !file.executable && !["component", "native_script"].includes(file.role));
  if (!executionBoundaryVerified) {
    observations.push(manifest.executionClass === "B"
      ? "Class B awaits the production component-model Wasmtime host; the Ground spike is not an activation boundary"
      : manifest.executionClass === "C"
        ? "Class C awaits bundled signing and isolated native-process verification"
        : "Class A contains executable behavior");
  }

  const declaredTestsExecuted = manifest.executionClass === "A" && manifest.tests.every((test) =>
    test.expected === "pass" && declaredPaths.has(test.fixture) && actualByPath.get(test.fixture)?.kind === "file"
  );
  if (!declaredTestsExecuted) observations.push("Declared regression fixtures were not executed by a production-safe class boundary");

  const testStatus = sourceIntegrity && fileIntegrity && executionBoundaryVerified && declaredTestsExecuted
    ? "passed"
    : sourceIntegrity && fileIntegrity ? "not_run" : "failed";
  if (testStatus === "passed") observations.push(`${manifest.tests.length} declarative conformance fixture${manifest.tests.length === 1 ? "" : "s"} passed over exact package bytes`);

  return {
    testStatus,
    conformance: {
      sourceIntegrity,
      fileIntegrity,
      executionBoundaryVerified,
      declaredTestsExecuted,
      observations: observations.slice(0, 20)
    }
  };
}

export function evaluateSkillPackage(manifest, { conformance, testStatus, installedCapabilities = [], previousActiveRevision = null } = {}) {
  const installedById = new Map(installedCapabilities.map((capability) => [capability.id ?? capability.manifest?.id, capability]));
  const missingCapabilities = manifest.requestedPermissions.capabilityIds.filter((id) => {
    const capability = installedById.get(id);
    const state = capability?.state;
    return !capability || !["registered", "healthy"].includes(state);
  });
  const sensitiveRequests = [
    ...manifest.requestedPermissions.networkDomains,
    ...manifest.requestedPermissions.credentialScopes,
    ...manifest.requestedPermissions.hostFunctions,
    ...manifest.requestedPermissions.readInputs,
    ...manifest.requestedPermissions.writeOutputs
  ];
  const permissionBoundaryReady = manifest.executionClass === "A" ? sensitiveRequests.length === 0
    : manifest.executionClass === "B" ? manifest.requestedPermissions.networkDomains.length === 0 && manifest.requestedPermissions.credentialScopes.length === 0
      : manifest.lifecycle.remoteExecutionAllowed === false && ["bundled_signed", "developer_mode"].includes(manifest.lifecycle.trustBasis);
  const platform = process.platform === "darwin" ? `macos-${process.arch === "arm64" ? "arm64" : "x64"}` : null;
  const rollbackReady = previousActiveRevision
    ? manifest.lifecycle.rollbackRevision === previousActiveRevision
    : manifest.lifecycle.rollbackRevision === null;
  const publisherReady = manifest.source.kind === "bundled";
  const gates = [
    gate("gate.skill_source", "Immutable source", conformance?.sourceIntegrity ? "pass" : "block", conformance?.sourceIntegrity ? manifest.source.contentHash : "Observed package bytes do not match the declared source hash."),
    gate("gate.skill_files", "Exact file inventory", conformance?.fileIntegrity ? "pass" : "block", conformance?.fileIntegrity ? `${manifest.files.length} declared files match exact hashes and modes` : "A file is missing, extra, linked, executable without declaration, or hash-mismatched."),
    gate("gate.skill_class", "Execution class boundary", conformance?.executionBoundaryVerified ? "pass" : manifest.executionClass === "B" ? "pending" : "block", conformance?.executionBoundaryVerified ? `Class ${manifest.executionClass} is declarative and executes no package code` : `Class ${manifest.executionClass} lacks its production-safe execution boundary`),
    gate("gate.skill_publisher", "Acquisition and publisher trust", publisherReady ? "pass" : "block", publisherReady ? `${manifest.source.publisherId} is bundled with Clark` : "Community acquisition, signature verification, and advisory monitoring are not implemented."),
    gate("gate.skill_permissions", "Bounded permission declaration", permissionBoundaryReady ? "pass" : "block", permissionBoundaryReady ? `${manifest.requestedPermissions.capabilityIds.length} ${manifest.requestedPermissions.capabilityIds.length === 1 ? "capability" : "capabilities"} · ${manifest.requestedPermissions.actionClasses.length} ${manifest.requestedPermissions.actionClasses.length === 1 ? "action class" : "action classes"} · no ambient authority` : "The class requests authority outside its permitted boundary."),
    gate("gate.skill_capabilities", "Installed capability intersection", missingCapabilities.length === 0 ? "pass" : "block", missingCapabilities.length === 0 ? `${manifest.requestedPermissions.capabilityIds.length} requested ${manifest.requestedPermissions.capabilityIds.length === 1 ? "capability is" : "capabilities are"} installed and trusted` : `Unavailable capabilities: ${missingCapabilities.join(", ")}`),
    gate("gate.skill_compatibility", "Clark and platform compatibility", platform && manifest.compatibility.clarkApi === "1.0.0" && manifest.compatibility.platforms.includes(platform) ? "pass" : "block", `${manifest.compatibility.clarkApi} · ${platform ?? "unsupported host"}`),
    gate("gate.skill_tests", "Declared regression fixtures", conformance?.declaredTestsExecuted ? "pass" : "pending", conformance?.declaredTestsExecuted ? `${manifest.tests.length} declared fixtures executed` : "Declared fixtures have not run through a production-safe class boundary."),
    gate("gate.skill_regression", "Revision conformance", testStatus === "passed" ? "pass" : testStatus === "failed" ? "block" : "pending", `test status ${String(testStatus ?? "not_run").replaceAll("_", " ")}`),
    gate("gate.skill_revision", "Revision trust and rollback", rollbackReady ? "pass" : "block", rollbackReady ? previousActiveRevision ? `Pins active revision ${previousActiveRevision} as rollback` : "First promotion claims no unproven rollback revision" : "Rollback does not match the currently active revision."),
    gate("gate.skill_invocation", "Run-specific invocation authority", "pass", "Promotion stores only a revision trust ceiling; no direct skill invocation endpoint exists.")
  ];
  return { activationEligible: gates.every((candidate) => candidate.status === "pass"), gates };
}

export function trustedSkillPermissionScopes(manifest) {
  return [
    ...manifest.requestedPermissions.capabilityIds.map((id) => `capability.${id}`),
    ...manifest.requestedPermissions.actionClasses.map((actionClass) => `action.${actionClass}`)
  ];
}
