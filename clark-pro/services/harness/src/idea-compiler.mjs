import fs from "node:fs";
import path from "node:path";
import { harnessFixtureDirectory } from "@clark/contracts/paths";
import { contractValidator } from "./protocol.mjs";
import { canonicalJson, sha256, stableToken } from "./canonical.mjs";

const loopDefinition = JSON.parse(fs.readFileSync(path.join(harnessFixtureDirectory, "idea-to-text.loop.json"), "utf8"));
contractValidator.validateLoopDefinition(loopDefinition);
const loopContentHash = sha256(loopDefinition);

export function deriveRunIds(idempotencyKey) {
  const token = stableToken(idempotencyKey);
  return Object.freeze({
    token,
    runId: `run.idea.${token}`,
    planId: `plan.idea.${token}`,
    ideaArtifactId: `artifact.idea.${token}`,
    ideaVersionId: `version.idea.${token}.v1`,
    draftArtifactId: `artifact.brief.${token}`,
    draftVersionId: `version.brief.${token}.v1`,
    approvalId: `approval.brief.${token}.v1`,
    decisionId: `decision.brief.${token}.v1`,
    checkpointId: `checkpoint.brief.${token}.review`
  });
}

export function compileIdeaRun({ runId, planId, workspaceId, projectId, ideaArtifactId, ideaVersionId, draftArtifactId, draftVersionId, compiledAt }) {
  const plan = {
    $schema: "https://schemas.clark.pro/v1/run-plan.schema.json",
    schemaVersion: 1,
    planId,
    planHash: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
    runId,
    workspaceId,
    projectId,
    compiledAt,
    compiledFrom: {
      loopRevision: { id: loopDefinition.id, revision: loopDefinition.revision, contentHash: loopContentHash },
      graphRevision: { id: "graph.idea-lab", revision: "1.0.0" },
      policyRevision: { id: "policy.creator-default", revision: "1.0.0" },
      creatorModelRevision: { id: "creator-model.local", revision: "1.0.0" },
      capabilityRevisions: [
        { id: "clark.capture.local", revision: "1.0.0" },
        { id: "clark.idea.structure.local", revision: "1.0.0" }
      ]
    },
    inputs: [{ artifactId: ideaArtifactId, versionId: ideaVersionId }],
    steps: [
      {
        id: "step.capture", nodeId: "capture", kind: "operator", dependsOn: [],
        inputRefs: [{ artifactId: ideaArtifactId, versionId: ideaVersionId }],
        outputContractRef: "https://schemas.clark.pro/v1/artifact.schema.json#/$defs/idea",
        capabilityRevision: { id: "clark.capture.local", revision: "1.0.0" }, actionClass: "capture", initialState: "ready",
        permissionDecision: { result: "allow", policyRevisionId: "policy.creator-default", reason: "Explicit creator text remains local." },
        approval: { mode: "none" }, quote: zeroQuote("Local capture"), retryPolicy: "never", idempotency: "clark_intent_ledger",
        reconciliation: "not_required", executionLocation: "local", egressItemIds: [], timeoutSeconds: 30
      },
      {
        id: "step.structure", nodeId: "structure", kind: "operator", dependsOn: ["step.capture"],
        inputRefs: [{ artifactId: ideaArtifactId, versionId: ideaVersionId }],
        outputContractRef: "https://schemas.clark.pro/v1/artifact.schema.json#/$defs/brief",
        capabilityRevision: { id: "clark.idea.structure.local", revision: "1.0.0" }, actionClass: "local_transform", initialState: "pending",
        permissionDecision: { result: "allow", policyRevisionId: "policy.creator-default", reason: "Deterministic local transform with no egress." },
        approval: { mode: "none" }, quote: zeroQuote("Local deterministic transform"), retryPolicy: "never", idempotency: "clark_intent_ledger",
        reconciliation: "not_required", executionLocation: "local", egressItemIds: [], timeoutSeconds: 30
      },
      {
        id: "step.review", nodeId: "review", kind: "gate", dependsOn: ["step.structure"],
        inputRefs: [{ artifactId: draftArtifactId, versionId: draftVersionId }],
        outputContractRef: "https://schemas.clark.pro/v1/artifact.schema.json#/$defs/brief",
        actionClass: "artifact_approve", initialState: "waiting_approval",
        permissionDecision: { result: "ask", policyRevisionId: "policy.creator-default", reason: "Creator approval pins the exact brief version." },
        approval: { mode: "always", actionClass: "artifact_approve", reason: "Approval does not authorize publication." },
        quote: zeroQuote("Human decision"), retryPolicy: "never", idempotency: "clark_intent_ledger", reconciliation: "not_required",
        executionLocation: "local", egressItemIds: []
      }
    ],
    humanGates: [{ id: "gate.brief-review", stepId: "step.review", reason: "Approve the exact content-addressed brief.", actionClass: "artifact_approve", subjectRefs: [draftArtifactId], requiredActorType: "creator" }],
    quote: zeroQuote("All execution is local and deterministic."),
    budget: { ceiling: money(0), reserved: money(0), overageBehavior: "stop" },
    effectivePermissions: { actionClasses: ["capture", "local_transform", "artifact_approve"], capabilityIds: ["clark.capture.local", "clark.idea.structure.local"], networkDomains: [], credentialScopes: [], maximumSensitivity: "confidential", remoteExecution: "forbidden" },
    egressPlan: [], warnings: []
  };
  plan.planHash = sha256(canonicalJson({ ...plan, planHash: undefined }));
  contractValidator.validateRunPlan(plan);
  return plan;
}

function money(micros) { return { currency: "USD", micros }; }
function zeroQuote(basis) { return { minimum: money(0), maximum: money(0), confidence: "exact", basis }; }

export function structureIdea(ideaText) {
  const normalized = String(ideaText).replace(/\s+/g, " ").trim();
  const shortIntent = normalized.length > 360 ? `${normalized.slice(0, 357)}…` : normalized;
  return [
    "# Idea brief",
    "",
    "## Creator intent",
    shortIntent,
    "",
    "## Strongest framing",
    "- **Outcome:** State the concrete change the user should experience.",
    "- **User:** Name the person, their current workaround, and the moment this matters.",
    "- **Mechanism:** Separate the durable system of record from replaceable tools and providers.",
    "- **Trust:** Keep external mutation, credentials, memory promotion, and publication behind explicit authority.",
    "- **Proof:** Require observable behavior and replacement value before treating the idea as validated.",
    "",
    "## Product boundary",
    "The original idea remains the source. This local deterministic pass adds structure but introduces no research claims, model output, external data, or publication authority.",
    "",
    "## Assumptions to test",
    "1. The target user can identify the current tool or workflow this replaces.",
    "2. The proposed loop saves enough coordination or reconstruction effort to change behavior.",
    "3. The user understands what the system may do automatically and what still requires approval.",
    "",
    "## Creator review",
    "Approve only if this brief preserves the intent and makes the outcome, mechanism, trust boundary, and evidence gap clearer. Approval pins this exact version; it does not authorize publishing."
  ].join("\n");
}

export { loopDefinition as ideaLoopDefinition };
