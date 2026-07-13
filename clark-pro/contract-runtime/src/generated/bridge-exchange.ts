/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/bridge-exchange.schema.json
 * Source SHA-256: 7145647121c8b4d6f61a27ed6a80f7d33642586d0e56d2446c5d4e14a530601a
 * Generator: json-schema-to-typescript@15.0.4
 */

export interface ClarkBridgeCommandAndReceiptExchange {
  $schema: "../../../schemas/bridge-exchange.schema.json";
  schemaVersion: 1;
  exchangeId: string;
  transport: "stdio" | "streamable_http";
  client: Client;
  command: Command;
  permissionDecision: PermissionDecision;
  domainEvent: ClarkDomainEventEnvelope;
  initialReceipt: Receipt;
  replayReceipt: Receipt;
  equivalence: Equivalence;
}
/**
 * This interface was referenced by `ClarkBridgeCommandAndReceiptExchange`'s JSON-Schema
 * via the `definition` "client".
 */
export interface Client {
  clientId: string;
  displayName: string;
  registrationRevision: string;
  trust: "quarantined" | "verified" | "revoked";
  /**
   * @minItems 1
   */
  workspaceScopes: [string, ...string[]];
  /**
   * @minItems 1
   */
  toolScopes: [string, ...string[]];
  /**
   * @minItems 1
   */
  actionScopes: [
    (
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
    ),
    ...(
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
    )[]
  ];
  expiresAt: string;
}
/**
 * This interface was referenced by `ClarkBridgeCommandAndReceiptExchange`'s JSON-Schema
 * via the `definition` "command".
 */
export interface Command {
  commandId: string;
  requestId: string;
  toolName: "clark.capture";
  workspaceId: string;
  projectId: string;
  intentId: string;
  idempotencyKey: string;
  issuedAt: string;
  deadlineAt: string;
  approvalBehavior: "none" | "policy" | "always";
  expectedAggregateVersion: number;
  arguments: CaptureArguments;
}
/**
 * This interface was referenced by `ClarkBridgeCommandAndReceiptExchange`'s JSON-Schema
 * via the `definition` "captureArguments".
 */
export interface CaptureArguments {
  captureKind: "text";
  text: string;
  sensitivity: "workspace" | "personal" | "confidential";
  classificationStatus: "proposed" | "confirmed" | "inbox";
}
/**
 * This interface was referenced by `ClarkBridgeCommandAndReceiptExchange`'s JSON-Schema
 * via the `definition` "permissionDecision".
 */
export interface PermissionDecision {
  result: "allow" | "ask" | "deny";
  policyRevision: RevisionRef;
  effectiveWorkspaceId: string;
  effectiveToolScopes: string[];
  effectiveActionScopes: (
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
  reason: string;
}
export interface RevisionRef {
  id: string;
  revision: string;
  contentHash?: string;
}
export interface ClarkDomainEventEnvelope {
  schemaVersion: 1;
  eventId: string;
  eventType: string;
  aggregate: {
    type:
      | "workspace"
      | "project"
      | "artifact"
      | "creative_graph"
      | "loop"
      | "run"
      | "decision"
      | "publication"
      | "observation"
      | "memory"
      | "skill"
      | "tool_package"
      | "capability"
      | "account_connection"
      | "bridge_client"
      | "policy"
      | "remote_job";
    id: string;
    version: number;
  };
  workspaceId: string;
  projectId?: string;
  occurredAt: string;
  recordedAt: string;
  actor: ActorRef;
  commandId?: string;
  causationId?: string;
  correlationId?: string;
  idempotencyKey?: string;
  sensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
  payload: {};
  integrity?: {
    previousEventHash?: string;
    eventHash: string;
    signature?: string;
    signingKeyId?: string;
  };
  metadata?: {
    source?: "studio" | "bridge" | "harness" | "import" | "relay" | "system";
    deviceId?: string;
    clientId?: string;
    capabilityRevision?: RevisionRef;
    policyRevision?: RevisionRef;
    extensions?: Extensions;
  };
}
export interface ActorRef {
  type: "creator" | "team_member" | "studio" | "bridge_client" | "harness" | "remote_worker" | "system" | "provider";
  id: string;
  displayName?: string;
}
export interface Extensions {}
/**
 * This interface was referenced by `ClarkBridgeCommandAndReceiptExchange`'s JSON-Schema
 * via the `definition` "receipt".
 */
export interface Receipt {
  receiptId: string;
  status: "accepted" | "deduplicated" | "rejected";
  requestId: string;
  commandId: string;
  intentId: string;
  idempotencyKey: string;
  workspaceId: string;
  projectId: string;
  emittedEventIds: string[];
  objectRef: ObjectRef;
  recordedAt: string;
}
/**
 * This interface was referenced by `ClarkBridgeCommandAndReceiptExchange`'s JSON-Schema
 * via the `definition` "objectRef".
 */
export interface ObjectRef {
  objectId: string;
  aggregateVersion: number;
  stateHash: string;
  resourceUri: string;
}
/**
 * This interface was referenced by `ClarkBridgeCommandAndReceiptExchange`'s JSON-Schema
 * via the `definition` "equivalence".
 */
export interface Equivalence {
  objectCountBefore: number;
  objectCountAfterInitial: number;
  objectCountAfterReplay: number;
  studioProjection: ProjectionRef;
  bridgeResource: ProjectionRef;
  /**
   * @minItems 5
   */
  assertions: [
    "same_object_id" | "same_aggregate_version" | "same_event_id" | "same_state_hash" | "replay_emits_no_event",
    "same_object_id" | "same_aggregate_version" | "same_event_id" | "same_state_hash" | "replay_emits_no_event",
    "same_object_id" | "same_aggregate_version" | "same_event_id" | "same_state_hash" | "replay_emits_no_event",
    "same_object_id" | "same_aggregate_version" | "same_event_id" | "same_state_hash" | "replay_emits_no_event",
    "same_object_id" | "same_aggregate_version" | "same_event_id" | "same_state_hash" | "replay_emits_no_event",
    ...("same_object_id" | "same_aggregate_version" | "same_event_id" | "same_state_hash" | "replay_emits_no_event")[]
  ];
}
/**
 * This interface was referenced by `ClarkBridgeCommandAndReceiptExchange`'s JSON-Schema
 * via the `definition` "projectionRef".
 */
export interface ProjectionRef {
  objectId: string;
  aggregateVersion: number;
  eventId: string;
  stateHash: string;
  resourceUri?: string;
  visibleInView?: "focus" | "canvas" | "timeline" | "review" | "library" | "memory" | "connections";
}
