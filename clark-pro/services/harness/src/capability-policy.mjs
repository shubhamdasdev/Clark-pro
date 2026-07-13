import { contractValidator } from "./protocol.mjs";

const POLICY_REVISION = Object.freeze({ id: "policy.creator-default", revision: "1.0.0" });
const sensitivityRank = new Map([["public", 0], ["workspace", 1], ["personal", 2], ["confidential", 3], ["secret_reference", 4], ["raw_secret", 5]]);

export class CapabilityPolicyError extends Error {
  constructor(message) {
    super(message);
    this.name = "CapabilityPolicyError";
    this.code = "policy_denied";
    this.retryable = false;
  }
}

export function evaluateCapabilityLease({ manifest, plan, run, stepId, attempt, now = new Date().toISOString(), leaseSeconds = 15 }) {
  contractValidator.validateCapabilityManifest(manifest);
  contractValidator.validateRunPlan(plan);
  const step = plan.steps.find((candidate) => candidate.id === stepId);
  const requested = authorityFromManifest(manifest);
  const reasons = [];
  if (!step) reasons.push("The run plan does not contain the requested step.");
  if (step?.capabilityRevision?.id !== manifest.id || step?.capabilityRevision?.revision !== manifest.version) reasons.push("The step does not pin this capability revision.");
  if (step?.actionClass !== manifest.permissions.actionClass) reasons.push("The step action class differs from the capability manifest.");
  if (step?.permissionDecision.result !== "allow") reasons.push("The compiled plan did not allow this step.");
  if (!plan.effectivePermissions.capabilityIds.includes(manifest.id)) reasons.push("The capability is outside the run allowlist.");
  if (!plan.effectivePermissions.actionClasses.includes(manifest.permissions.actionClass)) reasons.push("The action class is outside the run allowlist.");
  if (requested.systemScopes.length || requested.credentialScopes.length || requested.networkDomains.length || requested.fileAccess !== "none") {
    reasons.push("The first executable capability policy grants no system, credential, network, or file authority.");
  }
  if (requested.remoteExecution !== "forbidden") reasons.push("Remote execution is forbidden for this local loop.");
  if (sensitivityRank.get(requested.maximumSensitivity) > sensitivityRank.get(plan.effectivePermissions.maximumSensitivity)) reasons.push("The capability sensitivity exceeds the run ceiling.");

  const suffix = `${run.runId.slice("run.idea.".length)}.${stepId.slice("step.".length)}.a${attempt}`;
  const effective = reasons.length ? deniedAuthority() : requested;
  const receipt = {
    schemaVersion: 1,
    kind: "permission_receipt",
    receiptId: `permission.${suffix}`,
    decision: reasons.length ? "deny" : "allow",
    workspaceId: run.workspaceId,
    projectId: run.projectId,
    runId: run.runId,
    stepId,
    capabilityRevision: { id: manifest.id, revision: manifest.version },
    policyRevision: POLICY_REVISION,
    requested,
    effective,
    reason: reasons.join(" ") || "The pinned bundled capability intersects the zero-egress local policy and compiled run authority.",
    evaluatedAt: now
  };
  contractValidator.validateCapabilityRuntime(receipt);
  if (reasons.length) throw Object.assign(new CapabilityPolicyError(receipt.reason), { receipt });

  const expiresAt = new Date(Date.parse(now) + Math.max(1, Math.min(leaseSeconds, manifest.reliability.timeoutSeconds)) * 1_000).toISOString();
  const lease = {
    schemaVersion: 1,
    kind: "capability_lease",
    leaseId: `lease.${suffix}`,
    permissionReceiptId: receipt.receiptId,
    workspaceId: run.workspaceId,
    projectId: run.projectId,
    runId: run.runId,
    stepId,
    capabilityRevision: receipt.capabilityRevision,
    state: "active",
    effective,
    issuedAt: now,
    expiresAt
  };
  contractValidator.validateCapabilityRuntime(lease);
  return { receipt, lease };
}

function authorityFromManifest(manifest) {
  return {
    actionClasses: [manifest.permissions.actionClass],
    systemScopes: [...manifest.permissions.systemScopes],
    credentialScopes: [...manifest.permissions.credentialScopes],
    networkDomains: [...manifest.permissions.networkDomains],
    fileAccess: manifest.permissions.fileAccess,
    maximumSensitivity: manifest.egress.maximumSensitivity,
    remoteExecution: "forbidden"
  };
}

function deniedAuthority() {
  return { actionClasses: [], systemScopes: [], credentialScopes: [], networkDomains: [], fileAccess: "none", maximumSensitivity: "public", remoteExecution: "forbidden" };
}
