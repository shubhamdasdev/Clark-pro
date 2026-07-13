function gate(id, label, status, evidence) {
  return { id, label, status, evidence };
}

function reviewStatus(value, passing, failed = ["failed", "forbidden"]) {
  if (passing.includes(value)) return "pass";
  if (failed.includes(value)) return "block";
  return "pending";
}

function describe(value) {
  return String(value).replaceAll("_", " ");
}

export function evaluateToolPackage(manifest) {
  const stableInterfaces = manifest.integration.interfaceCandidates.filter((candidate) => candidate.status === "stable");
  const interfaceReady = manifest.integration.interfaceRequirement === "none" ||
    (manifest.integration.interfaceRequirement === "any_stable" && stableInterfaces.length > 0) ||
    (manifest.integration.interfaceRequirement === "all_stable" && stableInterfaces.length === manifest.integration.interfaceCandidates.length && stableInterfaces.length > 0);
  const licenseStatuses = [
    reviewStatus(manifest.license.commercialUse, ["approved", "not_applicable"]),
    reviewStatus(manifest.license.redistribution, ["approved", "not_applicable"]),
    reviewStatus(manifest.license.dependencyReview, ["passed", "not_applicable"]),
    reviewStatus(manifest.license.trademarkReview, ["passed", "not_required"])
  ];
  const licenseStatus = licenseStatuses.includes("block") ? "block" : licenseStatuses.includes("pending") ? "pending" : "pass";
  const verifiedAdapters = manifest.integration.adapters.filter((adapter) => adapter.status === "verified");
  const capabilityById = new Map(manifest.components.capabilityRevisions.map((capability) => [capability.id, capability]));
  const adapterInventoryValid = verifiedAdapters.length > 0 && verifiedAdapters.length === manifest.integration.adapters.length && verifiedAdapters.every((adapter) =>
    adapter.capabilityRevisions.length > 0 && adapter.capabilityRevisions.every((reference) => {
      const capability = capabilityById.get(reference.id);
      return capability?.revision === reference.revision && capability?.contentHash === reference.contentHash;
    })
  );
  const activationTest = manifest.tests.find((test) => test.kind === "activation");
  const rollbackTest = manifest.tests.find((test) => test.kind === "rollback");
  const sbomStatus = reviewStatus(manifest.supplyChain.sbom.status, ["verified", "not_applicable"]);
  const vulnerabilityStatus = manifest.supplyChain.vulnerabilityScan.result === "pass" ? "pass" : manifest.supplyChain.vulnerabilityScan.result === "fail" ? "block" : "pending";
  const provenanceStatus = reviewStatus(manifest.supplyChain.provenance.status, ["verified", "not_applicable"]);
  const acquisitionReady = manifest.lifecycle.installed && manifest.install.mode !== "none_until_ready" &&
    (manifest.install.mode === "remote_service" || manifest.install.artifacts.length > 0);
  const gates = [
    gate("gate.source_integrity", "Immutable source", manifest.source.immutableRef && Boolean(manifest.source.contentHash) ? "pass" : "block", `${describe(manifest.source.kind)} ${manifest.source.revision.slice(0, 12)} · ${manifest.source.contentHash.slice(0, 19)}…`),
    gate("gate.upstream_interface", "Stable supported interface", interfaceReady ? "pass" : manifest.lifecycle.state === "blocked_upstream" ? "block" : "pending", interfaceReady ? `${stableInterfaces.length} stable interface${stableInterfaces.length === 1 ? "" : "s"}` : "No stable MCP, CLI, HTTP, library, plugin, WASM, or file boundary satisfies the declared requirement."),
    gate("gate.license", "License and dependency review", licenseStatus, `commercial ${describe(manifest.license.commercialUse)} · redistribution ${describe(manifest.license.redistribution)} · dependencies ${describe(manifest.license.dependencyReview)} · trademark ${describe(manifest.license.trademarkReview)}`),
    gate("gate.sbom", "Verified SBOM", sbomStatus, `SBOM ${describe(manifest.supplyChain.sbom.status)}`),
    gate("gate.vulnerability", "Vulnerability scan", vulnerabilityStatus, `scan ${describe(manifest.supplyChain.vulnerabilityScan.result)}`),
    gate("gate.provenance", "Build provenance", provenanceStatus, `provenance ${describe(manifest.supplyChain.provenance.status)}`),
    gate("gate.acquisition", "Verified acquisition", acquisitionReady ? "pass" : manifest.install.mode === "none_until_ready" ? "block" : "pending", `${describe(manifest.install.mode)} · ${manifest.lifecycle.installed ? "installed" : "not installed"} · ${manifest.install.artifacts.length} pinned artifacts`),
    gate("gate.adapter", "Verified adapter", adapterInventoryValid ? "pass" : "block", adapterInventoryValid ? `${verifiedAdapters.length}/${manifest.integration.adapters.length} adapters verified with exact capability hashes` : `${verifiedAdapters.length}/${manifest.integration.adapters.length} adapters verified; exact bundled capability mapping is incomplete`),
    gate("gate.capability", "Versioned capability inventory", manifest.components.capabilityRevisions.length > 0 ? "pass" : "block", `${manifest.components.capabilityRevisions.length} capability revisions`),
    gate("gate.activation", "Activation conformance", activationTest?.result === "pass" && activationTest.expected === "pass" ? "pass" : manifest.lifecycle.state === "blocked_upstream" ? "block" : activationTest?.result === "fail" ? "block" : "pending", activationTest ? `${activationTest.expected} expected · ${activationTest.result}` : "No activation test"),
    gate("gate.rollback", "Rollback conformance", rollbackTest?.result === "pass" && rollbackTest.expected === "pass" ? "pass" : rollbackTest?.result === "fail" ? "block" : "pending", rollbackTest ? `${rollbackTest.expected} expected · ${rollbackTest.result}` : "No passing rollback test")
  ];
  return {
    activationEligible: gates.every((candidate) => candidate.status === "pass"),
    stableInterfaceCount: stableInterfaces.length,
    gates
  };
}

export function toolPackageEvidenceStatus(manifest) {
  const license = manifest.license.declaredByUpstream && ["approved", "not_applicable"].includes(manifest.license.commercialUse) ? "pass" : manifest.license.commercialUse === "forbidden" ? "fail" : "pending";
  const dependencies = ["passed", "not_applicable"].includes(manifest.license.dependencyReview) ? "pass" : manifest.license.dependencyReview === "failed" ? "fail" : "pending";
  const sbom = ["verified", "not_applicable"].includes(manifest.supplyChain.sbom.status) ? "pass" : manifest.supplyChain.sbom.status === "failed" ? "fail" : "pending";
  const activationTest = manifest.tests.find((test) => test.kind === "activation");
  return {
    license,
    dependencies,
    sbom,
    vulnerability: manifest.supplyChain.vulnerabilityScan.result,
    activation: manifest.lifecycle.state === "blocked_upstream" ? "blocked" : activationTest?.result === "pass" && activationTest.expected === "pass" ? "pass" : activationTest?.result === "fail" ? "fail" : "not_run"
  };
}
