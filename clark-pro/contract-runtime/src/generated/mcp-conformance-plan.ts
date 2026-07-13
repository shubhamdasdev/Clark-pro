/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/mcp-conformance-plan.schema.json
 * Source SHA-256: b57c2a18320e08ea271ba4ecd2b497dd9772e4fc6c086b854b6949fc8465422c
 * Generator: json-schema-to-typescript@15.0.4
 */

export interface ClarkMCPHostAndBridgeConformancePlan {
  $schema: "https://schemas.clark.pro/v1/mcp-conformance-plan.schema.json";
  schemaVersion: 1;
  planId: string;
  revision: string;
  protocolRevision: "2025-11-25";
  sdkBaseline: {
    package: "@modelcontextprotocol/sdk";
    version: string;
    policy: "pinned-v1-production-baseline" | "pinned-v2-after-stable-review";
  };
  /**
   * @minItems 4
   */
  owners: [
    {
      area: "connect" | "bridge" | "security" | "quality" | "incident";
      primaryRole: string;
      backupRole: string;
      artifactDuty: string;
    },
    {
      area: "connect" | "bridge" | "security" | "quality" | "incident";
      primaryRole: string;
      backupRole: string;
      artifactDuty: string;
    },
    {
      area: "connect" | "bridge" | "security" | "quality" | "incident";
      primaryRole: string;
      backupRole: string;
      artifactDuty: string;
    },
    {
      area: "connect" | "bridge" | "security" | "quality" | "incident";
      primaryRole: string;
      backupRole: string;
      artifactDuty: string;
    },
    ...{
      area: "connect" | "bridge" | "security" | "quality" | "incident";
      primaryRole: string;
      backupRole: string;
      artifactDuty: string;
    }[]
  ];
  blockingPolicy: {
    critical: "block_release_and_quarantine";
    high: "block_capability_promotion";
    medium: "block_when_protocol_must" | "warn_with_owned_exception";
    secretCanary: "block_release_rotate_canary_review_logs";
    duplicateEffect: "block_release_reconcile_and_incident_review";
    /**
     * @minItems 5
     */
    quarantineTriggers: [
      (
        | "protocol_corruption"
        | "schema_abuse"
        | "secret_canary"
        | "scope_violation"
        | "unbounded_resource"
        | "untrusted_instruction"
        | "replay_side_effect"
        | "origin_failure"
        | "auth_failure"
      ),
      (
        | "protocol_corruption"
        | "schema_abuse"
        | "secret_canary"
        | "scope_violation"
        | "unbounded_resource"
        | "untrusted_instruction"
        | "replay_side_effect"
        | "origin_failure"
        | "auth_failure"
      ),
      (
        | "protocol_corruption"
        | "schema_abuse"
        | "secret_canary"
        | "scope_violation"
        | "unbounded_resource"
        | "untrusted_instruction"
        | "replay_side_effect"
        | "origin_failure"
        | "auth_failure"
      ),
      (
        | "protocol_corruption"
        | "schema_abuse"
        | "secret_canary"
        | "scope_violation"
        | "unbounded_resource"
        | "untrusted_instruction"
        | "replay_side_effect"
        | "origin_failure"
        | "auth_failure"
      ),
      (
        | "protocol_corruption"
        | "schema_abuse"
        | "secret_canary"
        | "scope_violation"
        | "unbounded_resource"
        | "untrusted_instruction"
        | "replay_side_effect"
        | "origin_failure"
        | "auth_failure"
      ),
      ...(
        | "protocol_corruption"
        | "schema_abuse"
        | "secret_canary"
        | "scope_violation"
        | "unbounded_resource"
        | "untrusted_instruction"
        | "replay_side_effect"
        | "origin_failure"
        | "auth_failure"
      )[]
    ];
  };
  /**
   * @minItems 24
   */
  cases: [
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    {
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    },
    ...({
      [k: string]: unknown | undefined;
    } & {
      [k: string]: unknown | undefined;
    })[]
  ];
  /**
   * @minItems 1
   */
  limitations: [string, ...string[]];
}
