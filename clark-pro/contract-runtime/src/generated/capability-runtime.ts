/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/capability-runtime.schema.json
 * Source SHA-256: c09919f08e4622e2a465c47f3672563e73d285bc2c01c040da19756784642230
 * Generator: json-schema-to-typescript@15.0.4
 */

export type ClarkCapabilityRuntimeRecord =
  | PermissionReceipt
  | CapabilityLease
  | InvocationReceipt
  | IdeaAnalysisInput
  | IdeaAnalysisResult
  | IdeaThesisAssessment
  | RuntimeProfileResult;

export interface PermissionReceipt {
  schemaVersion: 1;
  kind: "permission_receipt";
  receiptId: string;
  decision: "allow" | "ask" | "deny";
  workspaceId: string;
  projectId: string;
  runId: string;
  stepId: string;
  capabilityRevision: RevisionRef;
  policyRevision: RevisionRef;
  requested: EffectiveAuthority;
  effective: EffectiveAuthority;
  reason: string;
  evaluatedAt: string;
}
export interface RevisionRef {
  id: string;
  revision: string;
  contentHash?: string;
}
export interface EffectiveAuthority {
  actionClasses: (
    | "read"
    | "capture"
    | "decision_record"
    | "artifact_approve"
    | "research"
    | "local_transform"
    | "model_generate"
    | "media_generate"
    | "external_write"
    | "social_publish"
    | "account_manage"
    | "memory_mutate"
    | "skill_mutate"
    | "policy_override"
    | "destructive"
  )[];
  systemScopes: string[];
  credentialScopes: string[];
  networkDomains: string[];
  fileAccess: "none" | "explicit_inputs_readonly" | "isolated_temp" | "project_assets_write";
  maximumSensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
  remoteExecution: "forbidden" | "allowed";
}
export interface CapabilityLease {
  schemaVersion: 1;
  kind: "capability_lease";
  leaseId: string;
  permissionReceiptId: string;
  workspaceId: string;
  projectId: string;
  runId: string;
  stepId: string;
  capabilityRevision: RevisionRef;
  state: "active" | "revoked" | "expired";
  effective: EffectiveAuthority;
  issuedAt: string;
  expiresAt: string;
  revokedAt?: string;
  reason?: string;
}
export interface InvocationReceipt {
  schemaVersion: 1;
  kind: "invocation_receipt";
  callId: string;
  leaseId: string;
  permissionReceiptId: string;
  workspaceId: string;
  projectId: string;
  runId: string;
  stepId: string;
  capabilityRevision: RevisionRef;
  transport: "library" | "mcp_stdio" | "mcp_streamable_http" | "http_api" | "local_process" | "browser";
  serverRef: string;
  toolName: string;
  inputHash: string;
  status: "succeeded" | "failed" | "cancelled" | "ambiguous";
  resultRef?: string;
  resultHash?: string;
  durationMs: number;
  cost: Money;
  errorClass:
    "none" | "validation" | "auth" | "rate_limit" | "transient" | "permanent" | "policy" | "ambiguous_external_state";
  startedAt: string;
  completedAt: string;
}
export interface Money {
  currency: string;
  micros: number;
}
export interface IdeaAnalysisInput {
  schemaVersion: 1;
  ideaText: string;
}
export interface IdeaAnalysisResult {
  schemaVersion: 1;
  kind: "idea_analysis";
  wordCount: number;
  signals: {
    outcome: boolean;
    user: boolean;
    mechanism: boolean;
    trust: boolean;
    evidence: boolean;
  };
  missingSignals: ("outcome" | "user" | "mechanism" | "trust" | "evidence")[];
  disposition: "structured" | "needs_clarification";
  summary: string;
}
export interface IdeaThesisAssessment {
  schemaVersion: 1;
  kind: "idea_thesis_assessment";
  wordCount: number;
  facets: {
    outcome: IdeaThesisFacet;
    targetUser: IdeaThesisFacet;
    painfulProblem: IdeaThesisFacet;
    currentWorkaround: IdeaThesisFacet;
    mechanism: IdeaThesisFacet;
    wedge: IdeaThesisFacet;
    trustBoundary: IdeaThesisFacet;
    distribution: IdeaThesisFacet;
    businessModel: IdeaThesisFacet;
    evidencePlan: IdeaThesisFacet;
  };
  missingFacets: (
    | "outcome"
    | "targetUser"
    | "painfulProblem"
    | "currentWorkaround"
    | "mechanism"
    | "wedge"
    | "trustBoundary"
    | "distribution"
    | "businessModel"
    | "evidencePlan"
  )[];
  structuralCompleteness: {
    explicitCount: number;
    totalCount: 10;
    state: "needs_clarification" | "ready_for_evidence";
  };
  readiness: "needs_clarification" | "evidence_required";
  evidenceState: "not_observed";
  /**
   * @minItems 5
   * @maxItems 5
   */
  evidenceGaps: [
    (
      | "problem_interviews"
      | "workaround_baseline"
      | "behavioral_demand"
      | "willingness_to_pay"
      | "retention_or_repeat_use"
    ),
    (
      | "problem_interviews"
      | "workaround_baseline"
      | "behavioral_demand"
      | "willingness_to_pay"
      | "retention_or_repeat_use"
    ),
    (
      | "problem_interviews"
      | "workaround_baseline"
      | "behavioral_demand"
      | "willingness_to_pay"
      | "retention_or_repeat_use"
    ),
    (
      | "problem_interviews"
      | "workaround_baseline"
      | "behavioral_demand"
      | "willingness_to_pay"
      | "retention_or_repeat_use"
    ),
    (
      | "problem_interviews"
      | "workaround_baseline"
      | "behavioral_demand"
      | "willingness_to_pay"
      | "retention_or_repeat_use"
    )
  ];
  summary: string;
  /**
   * @minItems 2
   */
  limitations: [string, string, ...string[]];
  supersedes?: string;
}
export interface IdeaThesisFacet {
  state: "explicit" | "missing";
  prompt: string;
}
export interface RuntimeProfileResult {
  schemaVersion: 1;
  kind: "runtime_profile";
  serverId: string;
  /**
   * @maxItems 20
   */
  environmentKeys:
    | []
    | [string]
    | [string, string]
    | [string, string, string]
    | [string, string, string, string]
    | [string, string, string, string, string]
    | [string, string, string, string, string, string]
    | [string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string, string, string, string, string]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ];
}
