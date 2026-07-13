/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/skill-permission-receipt.schema.json
 * Source SHA-256: c1b258a5b0501047f94faf9d359b2c9e7fb2b5999f278ec27dc9ddd565d20901
 * Generator: json-schema-to-typescript@15.0.4
 */

export interface ClarkSkillEffectivePermissionReceipt {
  $schema: "https://schemas.clark.pro/v1/skill-permission-receipt.schema.json";
  schemaVersion: 1;
  receiptId: string;
  skillRevision: RevisionRef;
  invocationId: string;
  decision: "allow" | "deny" | "ask";
  sources: {
    skillRequest: Permissions;
    installedCapabilities: Permissions;
    workspacePolicy: Permissions;
    runApproval: Permissions;
  };
  effective: Permissions;
  denied: Permissions;
  evaluatedAt: string;
}
export interface RevisionRef {
  id: string;
  revision: string;
  contentHash?: string;
}
export interface Permissions {
  capabilityIds: string[];
  hostFunctions: string[];
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
  networkDomains: string[];
  credentialScopes: string[];
  readInputs: string[];
  writeOutputs: string[];
}
