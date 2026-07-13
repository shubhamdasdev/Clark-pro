/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/run-plan.schema.json
 * Source SHA-256: 76908e4de40b3141e33f20d560f998f5bd95c87562c3e110b75e28f062ad1977
 * Generator: json-schema-to-typescript@15.0.4
 */

/**
 * This interface was referenced by `ClarkCompiledRunPlan`'s JSON-Schema
 * via the `definition` "step".
 */
export type Step = {
  [k: string]: unknown | undefined;
} & {
  id: string;
  nodeId: string;
  kind: "operator" | "decision" | "gate" | "loop";
  dependsOn: string[];
  inputRefs: ArtifactRef[];
  outputContractRef: string;
  capabilityRevision?: RevisionRef;
  actionClass:
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
    | "destructive";
  initialState: "pending" | "ready" | "waiting_approval" | "blocked";
  permissionDecision: {
    result: "allow" | "ask" | "deny";
    policyRevisionId: string;
    reason: string;
  };
  credentialLeaseRequest?: {
    credentialRef: string;
    scopes: string[];
    expiresAfterSeconds: number;
  };
  approval: ApprovalRequirement;
  quote: Quote;
  retryPolicy: "never" | "safe_transient_only" | "idempotent_only";
  idempotency?: "not_applicable" | "provider_key" | "clark_intent_ledger" | "provider_key_and_ledger";
  reconciliation?: "not_required" | "observe_provider" | "manual_check" | "export_only";
  executionLocation: "local" | "remote_explicit";
  egressItemIds?: string[];
  timeoutSeconds?: number;
};

export interface ClarkCompiledRunPlan {
  $schema?: string;
  schemaVersion: 1;
  planId: string;
  planHash: string;
  runId: string;
  workspaceId: string;
  projectId: string;
  compiledAt: string;
  compiledFrom: {
    loopRevision: RevisionRef;
    graphRevision: RevisionRef;
    policyRevision: RevisionRef;
    creatorModelRevision: RevisionRef;
    /**
     * @minItems 1
     */
    capabilityRevisions: [RevisionRef, ...RevisionRef[]];
  };
  /**
   * @minItems 1
   */
  inputs: [ArtifactRef, ...ArtifactRef[]];
  /**
   * @minItems 1
   */
  steps: [Step, ...Step[]];
  humanGates: HumanGate[];
  quote: Quote;
  budget: {
    ceiling: Money;
    reserved: Money;
    overageBehavior: "stop" | "ask" | "degrade";
  };
  effectivePermissions: {
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
    capabilityIds: string[];
    networkDomains: string[];
    credentialScopes: string[];
    maximumSensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
    remoteExecution: "forbidden" | "explicit_only" | "allowed";
  };
  egressPlan: EgressItem[];
  warnings: {
    code: string;
    severity: "info" | "warning" | "error";
    message: string;
    blocksRun: boolean;
  }[];
  extensions?: Extensions;
}
export interface RevisionRef {
  id: string;
  revision: string;
  contentHash?: string;
}
export interface ArtifactRef {
  artifactId: string;
  versionId: string;
  contentHash?: string;
}
export interface ApprovalRequirement {
  mode: "none" | "policy" | "always";
  actionClass?:
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
    | "destructive";
  expiresAfterSeconds?: number;
  reason?: string;
}
/**
 * This interface was referenced by `ClarkCompiledRunPlan`'s JSON-Schema
 * via the `definition` "quote".
 */
export interface Quote {
  minimum: Money;
  maximum: Money;
  confidence: "exact" | "bounded" | "estimate" | "unknown";
  basis: string;
}
export interface Money {
  currency: string;
  micros: number;
}
/**
 * This interface was referenced by `ClarkCompiledRunPlan`'s JSON-Schema
 * via the `definition` "humanGate".
 */
export interface HumanGate {
  id: string;
  stepId: string;
  reason: string;
  actionClass:
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
    | "destructive";
  /**
   * @minItems 1
   */
  subjectRefs: [string, ...string[]];
  requiredActorType: "creator" | "team_member";
  expiresAt?: string;
}
/**
 * This interface was referenced by `ClarkCompiledRunPlan`'s JSON-Schema
 * via the `definition` "egressItem".
 */
export interface EgressItem {
  id: string;
  stepId: string;
  destination: string;
  fields: string[];
  inputRefs: ArtifactRef[];
  sensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
  redactions: string[];
  retentionPolicy: "none" | "transient" | "provider_declared" | "unknown";
  trainingPolicy: "not_used" | "opt_out_configured" | "provider_declared" | "unknown";
  approvedByPolicy: boolean;
}
export interface Extensions {}
