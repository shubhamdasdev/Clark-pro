/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/event-catalog.schema.json
 * Source SHA-256: e66ee9e1f29431257f1b370bdbce2f2efc0813cac89c3a4c73430bbc12bc2b67
 * Generator: json-schema-to-typescript@15.0.4
 */

export interface ClarkEventCatalog {
  $schema?: string;
  schemaVersion: 1;
  catalogVersion: string;
  /**
   * @minItems 1
   */
  events: [
    {
      eventType: string;
      schemaVersion: number;
      aggregateType:
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
      payloadRef: string;
      compatibility: "additive" | "upcast_required" | "terminal";
      defaultSensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
      mutationClass: "local_state" | "external_read" | "external_mutation" | "security_state";
      description: string;
      requiredCorrelation?: boolean;
      requiresIdempotencyKey?: boolean;
      piiNotes?: string;
    },
    ...{
      eventType: string;
      schemaVersion: number;
      aggregateType:
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
      payloadRef: string;
      compatibility: "additive" | "upcast_required" | "terminal";
      defaultSensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
      mutationClass: "local_state" | "external_read" | "external_mutation" | "security_state";
      description: string;
      requiredCorrelation?: boolean;
      requiresIdempotencyKey?: boolean;
      piiNotes?: string;
    }[]
  ];
}
