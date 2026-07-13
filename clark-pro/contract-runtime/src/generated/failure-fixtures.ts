/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/failure-fixtures.schema.json
 * Source SHA-256: e610d9e1bbf2bcfef02b9453df49f0bbb194307c21a1a74bd6ca01618441ab7f
 * Generator: json-schema-to-typescript@15.0.4
 */

export interface ClarkFailureAndAbuseFixtures {
  $schema?: string;
  schemaVersion: 1;
  suiteId: string;
  /**
   * @minItems 1
   */
  cases: [Case, ...Case[]];
}
/**
 * This interface was referenced by `ClarkFailureAndAbuseFixtures`'s JSON-Schema
 * via the `definition` "case".
 */
export interface Case {
  id: string;
  title: string;
  /**
   * @minItems 1
   */
  threatIds: [string, ...string[]];
  initialState: {};
  /**
   * @minItems 1
   */
  stimulus: [
    {
      type:
        | "process_crash"
        | "provider_response"
        | "provider_timeout"
        | "credential_revoke"
        | "input_payload"
        | "package_update"
        | "policy_change"
        | "event_replay"
        | "network_disconnect"
        | "budget_exhaustion"
        | "user_command";
      target: string;
      data?: {};
    },
    ...{
      type:
        | "process_crash"
        | "provider_response"
        | "provider_timeout"
        | "credential_revoke"
        | "input_payload"
        | "package_update"
        | "policy_change"
        | "event_replay"
        | "network_disconnect"
        | "budget_exhaustion"
        | "user_command";
      target: string;
      data?: {};
    }[]
  ];
  /**
   * @minItems 1
   */
  expectedEvents: [string, ...string[]];
  expectedFinalState: {};
  /**
   * @minItems 1
   */
  forbiddenOutcomes: [string, ...string[]];
  /**
   * @minItems 1
   */
  invariants: [string, ...string[]];
}
