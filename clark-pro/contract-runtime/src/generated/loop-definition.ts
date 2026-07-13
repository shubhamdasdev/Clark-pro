/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/loop-definition.schema.json
 * Source SHA-256: a8e7727c53d7e1d79ed0590652f49309a114e5db78558918a4c185f3347995e4
 * Generator: json-schema-to-typescript@15.0.4
 */

/**
 * This interface was referenced by `ClarkLoopDefinition`'s JSON-Schema
 * via the `definition` "contract".
 */
export type Contract =
  | {
      schemaRef: string;
      description?: string;
    }
  | {
      inlineSchema: {};
      description?: string;
    };
/**
 * This interface was referenced by `ClarkLoopDefinition`'s JSON-Schema
 * via the `definition` "node".
 */
export type Node = {
  [k: string]: unknown | undefined;
} & {
  id: string;
  name: string;
  kind: "operator" | "decision" | "gate" | "loop";
  inputs: Port[];
  outputs: Port[];
  capabilityRevision?: RevisionRef;
  nestedLoopRevision?: RevisionRef;
  decisionType?:
    | "angle_select"
    | "canonical_select"
    | "claim_accept"
    | "artifact_approve"
    | "publish_approve"
    | "policy_override"
    | "memory_promote"
    | "memory_dispute"
    | "memory_correct"
    | "memory_forget"
    | "skill_promote"
    | "conflict_resolve";
  gateType?:
    | "human"
    | "evidence"
    | "brand"
    | "platform"
    | "budget"
    | "disclosure"
    | "legal"
    | "confidentiality"
    | "quality"
    | "accessibility";
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
  approval?: ApprovalRequirement;
  timeoutSeconds?: number;
  remoteEligible?: boolean;
  configuration?: {};
};

export interface ClarkLoopDefinition {
  $schema?: string;
  schemaVersion: 1;
  id: string;
  name: string;
  description?: string;
  revision: string;
  entryContract: Contract;
  successContract: Contract;
  parameters?: Parameter[];
  graph: {
    /**
     * @minItems 1
     */
    nodes: [Node, ...Node[]];
    edges: Edge[];
  };
  permissions: Permissions;
  budget: Budget;
  checkpoints: Checkpoint[];
  recovery: Recovery;
  evaluation: Evaluation;
  reflection: Reflection;
  schedulePolicy?: {
    allowed: boolean;
    timezoneSource?: "workspace" | "account" | "explicit";
    missedRunBehavior: "skip" | "ask" | "run_when_available";
    remoteEligible?: boolean;
  };
  extensions?: Extensions;
}
/**
 * This interface was referenced by `ClarkLoopDefinition`'s JSON-Schema
 * via the `definition` "parameter".
 */
export interface Parameter {
  id: string;
  schema: {};
  required: boolean;
  default?: unknown;
  sensitivity?: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
}
/**
 * This interface was referenced by `ClarkLoopDefinition`'s JSON-Schema
 * via the `definition` "port".
 */
export interface Port {
  id: string;
  schemaRef: string;
  cardinality: "one" | "many";
  required: boolean;
  sensitivityCeiling?: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
}
export interface RevisionRef {
  id: string;
  revision: string;
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
 * This interface was referenced by `ClarkLoopDefinition`'s JSON-Schema
 * via the `definition` "edge".
 */
export interface Edge {
  id: string;
  type: "data" | "control" | "evidence" | "learning" | "policy";
  from: Endpoint;
  to: Endpoint;
  condition?: string;
  adapterCapabilityRevision?: RevisionRef;
}
/**
 * This interface was referenced by `ClarkLoopDefinition`'s JSON-Schema
 * via the `definition` "endpoint".
 */
export interface Endpoint {
  nodeId: string;
  portId: string;
}
/**
 * This interface was referenced by `ClarkLoopDefinition`'s JSON-Schema
 * via the `definition` "permissions".
 */
export interface Permissions {
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
  capabilityAllowlist: string[];
  networkDomains: string[];
  credentialScopes: string[];
  maximumSensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
  remoteExecution: "forbidden" | "explicit_only" | "allowed";
}
/**
 * This interface was referenced by `ClarkLoopDefinition`'s JSON-Schema
 * via the `definition` "budget".
 */
export interface Budget {
  costCeiling: Money;
  tokenCeiling: number;
  durationSeconds: number;
  maxConcurrency: number;
  overageBehavior: "stop" | "ask" | "degrade";
}
export interface Money {
  currency: string;
  micros: number;
}
/**
 * This interface was referenced by `ClarkLoopDefinition`'s JSON-Schema
 * via the `definition` "checkpoint".
 */
export interface Checkpoint {
  id: string;
  afterNodeId: string;
  mode: "automatic" | "human";
  persist: ("inputs" | "outputs" | "external_job_ids" | "budget" | "approvals" | "context_refs")[];
  summary?: string;
}
/**
 * This interface was referenced by `ClarkLoopDefinition`'s JSON-Schema
 * via the `definition` "recovery".
 */
export interface Recovery {
  retry: {
    maxAttempts: number;
    backoff: "none" | "linear" | "exponential";
    retryableErrors: ("rate_limit" | "transient_network" | "provider_5xx" | "timeout_before_mutation")[];
  };
  onAmbiguousExternalState: "reconcile";
  onRestart: "resume_safe" | "ask" | "abort";
  onCancellation: "stop_dependents" | "continue_unaffected" | "compensate";
  compensationNodeIds?: string[];
}
/**
 * This interface was referenced by `ClarkLoopDefinition`'s JSON-Schema
 * via the `definition` "evaluation".
 */
export interface Evaluation {
  /**
   * @minItems 1
   */
  criteria: [
    {
      id: string;
      name: string;
      weight: number;
      required: boolean;
      evaluator: "schema" | "deterministic" | "policy" | "model" | "creator";
      configuration?: {};
    },
    ...{
      id: string;
      name: string;
      weight: number;
      required: boolean;
      evaluator: "schema" | "deterministic" | "policy" | "model" | "creator";
      configuration?: {};
    }[]
  ];
  minimumPass: number;
  onFailure: "block" | "review" | "targeted_retry";
}
/**
 * This interface was referenced by `ClarkLoopDefinition`'s JSON-Schema
 * via the `definition` "reflection".
 */
export interface Reflection {
  mode: "disabled" | "propose";
  minimumEvidenceCount?: number;
  maximumMemoryProposals?: number;
  maximumSkillProposals?: number;
  memoryPromotion: "human_or_policy_event";
  skillPromotion: "quarantine_tests_and_human_event";
}
export interface Extensions {}
