/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/domain-event.schema.json
 * Source SHA-256: f70e2ca9e475cea906d1fe2a5732e3629dbe8a1c0f4edfa3161eb6ff05339b94
 * Generator: json-schema-to-typescript@15.0.4
 */

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
