/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/common.schema.json
 * Source SHA-256: 44dc6da6108d91c046b298401b51de8deaa02052c27089e6715e590e9f92756e
 * Generator: json-schema-to-typescript@15.0.4
 */

/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "id".
 */
export type Id = string;
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "eventType".
 */
export type EventType = string;
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "semver".
 */
export type Semver = string;
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "timestamp".
 */
export type Timestamp = string;
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "contentHash".
 */
export type ContentHash = string;
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "schemaRef".
 */
export type SchemaRef = string;
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "sensitivity".
 */
export type Sensitivity = "public" | "workspace" | "personal" | "confidential" | "secret_reference";
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "actionClass".
 */
export type ActionClass =
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
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "permissionScope".
 */
export type PermissionScope = string;

export interface ClarkCommonContractTypes {
  [k: string]: unknown | undefined;
}
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "money".
 */
export interface Money {
  currency: string;
  micros: number;
}
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "actorRef".
 */
export interface ActorRef {
  type: "creator" | "team_member" | "studio" | "bridge_client" | "harness" | "remote_worker" | "system" | "provider";
  id: Id;
  displayName?: string;
}
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "artifactRef".
 */
export interface ArtifactRef {
  artifactId: Id;
  versionId: Id;
  contentHash?: ContentHash;
}
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "evidenceRef".
 */
export interface EvidenceRef {
  type: "source" | "artifact" | "decision" | "observation" | "correction" | "run" | "publication" | "policy";
  refId: Id;
  versionId?: Id;
  excerptHash?: ContentHash;
}
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "revisionRef".
 */
export interface RevisionRef {
  id: Id;
  revision: Semver;
  contentHash?: ContentHash;
}
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "credentialRef".
 */
export interface CredentialRef {
  credentialRef: Id;
  provider: Id;
  scopes: PermissionScope[];
}
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "approvalRequirement".
 */
export interface ApprovalRequirement {
  mode: "none" | "policy" | "always";
  actionClass?: ActionClass;
  expiresAfterSeconds?: number;
  reason?: string;
}
/**
 * This interface was referenced by `ClarkCommonContractTypes`'s JSON-Schema
 * via the `definition` "extensions".
 */
export interface Extensions {}
