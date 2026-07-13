/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/event-payloads.schema.json
 * Source SHA-256: 40b8eaa90001c4c4061a6209097a9b6d8335d1937ecbadecbb70f3025be95081
 * Generator: json-schema-to-typescript@15.0.4
 */

export interface ClarkDomainEventPayloads {
  [k: string]: unknown | undefined;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "workspaceCreated".
 */
export interface WorkspaceCreated {
  workspaceId: string;
  name: string;
  localCanonical: true;
  createdFrom: "new" | "import";
  backupLocationConfigured?: boolean;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "exportCreated".
 */
export interface ExportCreated {
  exportId: string;
  manifestHash: string;
  eventCount: number;
  assetCount: number;
  encrypted?: boolean;
  includesSecrets: false;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "projectCreated".
 */
export interface ProjectCreated {
  projectId: string;
  name: string;
  kind: "campaign" | "series" | "weekly_operation" | "library" | "custom";
  description?: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "sourceCaptured".
 */
export interface SourceCaptured {
  artifact: ArtifactRef;
  captureKind: "text" | "url" | "file" | "screenshot" | "voice_memo" | "selected_content";
  originalHash: string;
  sourceUri?: string;
  sensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
  classificationStatus: "proposed" | "confirmed" | "inbox";
}
export interface ArtifactRef {
  artifactId: string;
  versionId: string;
  contentHash?: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "artifactVersionCreated".
 */
export interface ArtifactVersionCreated {
  artifact: ArtifactRef;
  artifactType:
    | "idea"
    | "source"
    | "brief"
    | "claim_ledger"
    | "angle"
    | "script"
    | "image"
    | "audio"
    | "video"
    | "carousel"
    | "platform_post"
    | "published_post"
    | "outcome_report"
    | "memory_proposal"
    | "skill_proposal"
    | "export";
  assetHash: string;
  inputRefs: ArtifactRef[];
  provenance: {
    runId?: string;
    stepId?: string;
    modelProvider?: string;
    modelName?: string;
    skillRevision?: RevisionRef;
    capabilityRevision?: RevisionRef;
  };
  cost?: Money;
  sensitivity?: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
}
export interface RevisionRef {
  id: string;
  revision: string;
  contentHash?: string;
}
export interface Money {
  currency: string;
  micros: number;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "canonicalSelected".
 */
export interface CanonicalSelected {
  artifactId: string;
  fromVersionId: string;
  toVersionId: string;
  decisionId: string;
  reason?: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "artifactStaled".
 */
export interface ArtifactStaled {
  artifact: ArtifactRef;
  causedBy: ArtifactRef;
  invalidatedApprovals: string[];
  scheduledPublicationRisk: boolean;
  estimatedRegenerationCost?: Money;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "objectTombstoned".
 */
export interface ObjectTombstoned {
  objectId: string;
  objectType: "artifact" | "memory" | "skill" | "project" | "workspace";
  reason: string;
  assetRetention: "retain" | "trash_window" | "delete_when_unreferenced";
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "graphRevisionCreated".
 */
export interface GraphRevisionCreated {
  graphId: string;
  revision: string;
  definitionHash: string;
  changeSummary: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "loopRevisionRegistered".
 */
export interface LoopRevisionRegistered {
  loopRevision: RevisionRef;
  definitionHash: string;
  compatibility: "compatible" | "migration_required" | "breaking";
  validationStatus: "valid" | "invalid" | "quarantined";
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "runPlanned".
 */
export interface RunPlanned {
  runId: string;
  loopRevision: RevisionRef;
  planHash: string;
  inputRefs: ArtifactRef[];
  quotedCost: Money;
  budgetCeiling: Money;
  stepCount: number;
  humanGateCount: number;
  warnings?: string[];
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "runStateChanged".
 */
export interface RunStateChanged {
  runId: string;
  from:
    | "planned"
    | "waiting_approval"
    | "queued"
    | "running"
    | "paused"
    | "waiting_external"
    | "completed"
    | "failed"
    | "cancelled"
    | "recovering";
  to:
    | "waiting_approval"
    | "queued"
    | "running"
    | "paused"
    | "waiting_external"
    | "completed"
    | "failed"
    | "cancelled"
    | "recovering";
  reason?: string;
  recoveryCheckpointId?: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "stepStateChanged".
 */
export interface StepStateChanged {
  runId: string;
  stepId: string;
  from:
    | "pending"
    | "ready"
    | "queued"
    | "running"
    | "streaming"
    | "waiting_external"
    | "waiting_approval"
    | "paused"
    | "retrying"
    | "completed"
    | "failed"
    | "cancelled"
    | "orphaned";
  to:
    | "ready"
    | "queued"
    | "running"
    | "streaming"
    | "waiting_external"
    | "waiting_approval"
    | "paused"
    | "retrying"
    | "completed"
    | "failed"
    | "cancelled"
    | "orphaned";
  reason?: string;
  attempt?: number;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "externalJobAttached".
 */
export interface ExternalJobAttached {
  runId: string;
  stepId: string;
  provider: string;
  externalJobId: string;
  cancellable: boolean;
  observationMode: "poll" | "webhook" | "task" | "manual_reconcile";
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "decisionRecorded".
 */
export interface DecisionRecorded {
  decisionId: string;
  decisionType:
    | "angle_select"
    | "canonical_select"
    | "claim_accept"
    | "artifact_approve"
    | "publish_approve"
    | "policy_override"
    | "memory_promote"
    | "skill_promote"
    | "conflict_resolve";
  subjectRef: string;
  selectedOption: string;
  /**
   * @minItems 1
   */
  alternatives: [string, ...string[]];
  evidenceRefs: EvidenceRef[];
  reason?: string;
  reversible: boolean;
}
export interface EvidenceRef {
  type: "source" | "artifact" | "decision" | "observation" | "correction" | "run" | "publication" | "policy";
  refId: string;
  versionId?: string;
  excerptHash?: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "approvalChanged".
 */
export interface ApprovalChanged {
  approvalId: string;
  subjectRef: string;
  artifact?: ArtifactRef;
  accountConnectionId?: string;
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
  status: "granted" | "revoked" | "invalidated";
  policyRevisionId: string;
  expiresAt?: string;
  reason?: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "toolCallRequested".
 */
export interface ToolCallRequested {
  callId: string;
  runId: string;
  stepId: string;
  capabilityRevision: RevisionRef;
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
  inputHash: string;
  permissionReceiptId: string;
  quotedCost?: Money;
  egressSensitivity?: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "toolCallCompleted".
 */
export interface ToolCallCompleted {
  callId: string;
  status: "succeeded" | "failed" | "cancelled" | "ambiguous";
  resultRef?: string;
  resultHash?: string;
  durationMs: number;
  cost: Money;
  errorClass?:
    "none" | "validation" | "auth" | "rate_limit" | "transient" | "permanent" | "policy" | "ambiguous_external_state";
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "publicationIntentCreated".
 */
export interface PublicationIntentCreated {
  publicationId: string;
  artifact: ArtifactRef;
  accountConnectionId: string;
  platform: string;
  desiredAt: string;
  approvalId: string;
  intentKey: string;
  fallback?: "none" | "direct" | "postiz" | "assisted" | "export";
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "publicationStateChanged".
 */
export interface PublicationStateChanged {
  publicationId: string;
  from:
    | "desired"
    | "scheduled"
    | "submitting"
    | "submitted"
    | "reconciling"
    | "verified_live"
    | "failed"
    | "cancelled"
    | "exported";
  to:
    | "scheduled"
    | "submitting"
    | "submitted"
    | "reconciling"
    | "verified_live"
    | "failed"
    | "cancelled"
    | "exported"
    | "requires_human_check";
  artifact: ArtifactRef;
  accountConnectionId: string;
  providerReceipt?: string;
  liveUrl?: string;
  reason?: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "observationRecorded".
 */
export interface ObservationRecorded {
  observationId: string;
  subjectRef: string;
  observedAt: string;
  source: "platform" | "postiz" | "direct_api" | "creator_judgment" | "manual";
  sampleSize: number;
  metrics: {
    [k: string]: (number | string | null) | undefined;
  };
  quality: "complete" | "partial" | "estimated" | "disputed";
  definitionNotes?: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "memoryProposed".
 */
export interface MemoryProposed {
  memoryId: string;
  layer: "identity" | "semantic" | "episodic" | "procedural" | "performance";
  statement: string;
  /**
   * @minItems 1
   */
  evidence: [EvidenceRef, ...EvidenceRef[]];
  contradictions: EvidenceRef[];
  confidence: number;
  scope: {
    workspaceId?: string;
    projectId?: string;
    platform?: string;
    loopId?: string;
    accountConnectionId?: string;
  };
  sensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
  retrievalState: "proposal_only";
  expiresAt?: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "memoryStateChanged".
 */
export interface MemoryStateChanged {
  memoryId: string;
  from: "proposed" | "active" | "disputed" | "expired" | "rejected";
  to: "active" | "rejected" | "disputed" | "expired" | "forgotten";
  decisionId: string;
  reason?: string;
  searchDerivativesDeleted?: boolean;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "skillRevisionStateChanged".
 */
export interface SkillRevisionStateChanged {
  skillRevision: RevisionRef;
  sourceHash: string;
  from: "unseen" | "installed" | "quarantined" | "active" | "failed" | "superseded";
  to: "installed" | "quarantined" | "active" | "failed" | "superseded" | "rolled_back";
  effectivePermissions: string[];
  testStatus: "not_run" | "passed" | "failed";
  decisionId?: string;
  rollbackRevision?: RevisionRef;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "toolPackageRevisionStateChanged".
 */
export interface ToolPackageRevisionStateChanged {
  toolPackageRevision: RevisionRef;
  manifestHash: string;
  sourceRevision: string;
  sourceHash: string;
  from: "unseen" | "discovered" | "blocked_upstream" | "quarantined" | "testing" | "active" | "suspended" | "failed";
  to: "discovered" | "blocked_upstream" | "quarantined" | "testing" | "active" | "suspended" | "failed" | "rolled_back";
  capabilityRevisions: RevisionRef[];
  adapterRevisions: RevisionRef[];
  evidenceStatus: {
    license: "pending" | "pass" | "fail" | "not_applicable";
    dependencies: "pending" | "pass" | "fail" | "not_applicable";
    sbom: "pending" | "pass" | "fail" | "not_applicable";
    vulnerability: "not_run" | "pass" | "fail";
    activation: "not_run" | "pass" | "fail" | "blocked";
  };
  decisionId?: string;
  rollbackRevision?: RevisionRef;
  reason?: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "connectionStateChanged".
 */
export interface ConnectionStateChanged {
  connectionId: string;
  provider: string;
  externalAccountLabel?: string;
  from: "unconfigured" | "pending" | "healthy" | "limited" | "expired" | "revoked" | "failed";
  to: "pending" | "healthy" | "limited" | "expired" | "revoked" | "failed";
  credentialRef: string;
  scopes: string[];
  reason?: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "capabilityStateChanged".
 */
export interface CapabilityStateChanged {
  capabilityRevision: RevisionRef;
  manifestHash: string;
  from: "unregistered" | "registered" | "healthy" | "degraded" | "offline" | "revoked";
  to: "registered" | "healthy" | "degraded" | "offline" | "revoked";
  limitations: string[];
  reason?: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "bridgeClientStateChanged".
 */
export interface BridgeClientStateChanged {
  clientId: string;
  displayName: string;
  from: "unpaired" | "paired" | "active" | "expired" | "revoked";
  to: "paired" | "active" | "expired" | "revoked";
  workspaceScopes: string[];
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
  expiresAt: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "policyActivated".
 */
export interface PolicyActivated {
  policyRevision: RevisionRef;
  definitionHash: string;
  scope: "workspace" | "project" | "account" | "loop" | "action_class";
  supersedes: string | null;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "remoteJobDelegated".
 */
export interface RemoteJobDelegated {
  jobId: string;
  workerId: string;
  envelopeHash: string;
  inputRefs: ArtifactRef[];
  capabilityRevision: RevisionRef;
  budget: Money;
  expiresAt: string;
  outputContractRef: string;
}
/**
 * This interface was referenced by `ClarkDomainEventPayloads`'s JSON-Schema
 * via the `definition` "remoteReceiptReceived".
 */
export interface RemoteReceiptReceived {
  jobId: string;
  workerId: string;
  receiptId: string;
  status: "completed" | "failed" | "cancelled" | "expired" | "ambiguous";
  outputHashes: string[];
  signatureKeyId: string;
  cost?: Money;
}
