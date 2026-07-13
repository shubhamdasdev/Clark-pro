/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/event-stream.schema.json
 * Source SHA-256: 084239359b0eaa4773ac817cccbb9b142a38043b2b004d391192158f88d88440
 * Generator: json-schema-to-typescript@15.0.4
 */

export interface ClarkDomainEventStream {
  $schema?: string;
  schemaVersion: 1;
  streamId: string;
  /**
   * @minItems 1
   */
  events: [ClarkDomainEventEnvelope, ...ClarkDomainEventEnvelope[]];
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
export interface RevisionRef {
  id: string;
  revision: string;
  contentHash?: string;
}
export interface Extensions {}
