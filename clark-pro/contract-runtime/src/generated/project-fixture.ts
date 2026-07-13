/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/project-fixture.schema.json
 * Source SHA-256: a980e5ee034ff6b12a5543c585b63879d267c811947336b3d5947039cf3f827a
 * Generator: json-schema-to-typescript@15.0.4
 */

export interface ClarkProjectFixture {
  $schema?: string;
  schemaVersion: 1;
  fixtureId: string;
  workspace: {
    id: string;
    name: string;
    localCanonical: true;
  };
  project: {
    id: string;
    name: string;
    kind: "weekly_operation";
    week: string;
  };
  expectedObjectCount: number;
  /**
   * @minItems 1
   */
  objects: [Object, ...Object[]];
  edges: Edge[];
  /**
   * @minItems 1
   */
  assertions: [
    {
      id: string;
      description: string;
      expected: unknown;
    },
    ...{
      id: string;
      description: string;
      expected: unknown;
    }[]
  ];
}
/**
 * This interface was referenced by `ClarkProjectFixture`'s JSON-Schema
 * via the `definition` "object".
 */
export interface Object {
  id: string;
  name: string;
  lane: "intent" | "evidence" | "creative" | "production" | "distribution" | "outcomes";
  kind: "source" | "artifact" | "memory" | "policy" | "gate" | "operator" | "decision" | "loop" | "skill";
  status: "done" | "ready" | "review" | "running" | "blocked" | "learning" | "stale" | "failed";
  version?: string;
  detail?: string;
  sensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
  sourceRefs: string[];
  cost?: Money;
  approvalState: "not_applicable" | "not_requested" | "waiting" | "granted" | "invalidated" | "blocked";
  publishState:
    | "not_applicable"
    | "not_authorized"
    | "planned"
    | "scheduled"
    | "submitted"
    | "verified_live"
    | "reconciling"
    | "failed"
    | "export_ready";
  outcomeState: "not_applicable" | "pending" | "observing" | "partial" | "complete" | "disputed";
  permissions: string[];
  canonical?: boolean;
}
export interface Money {
  currency: string;
  micros: number;
}
/**
 * This interface was referenced by `ClarkProjectFixture`'s JSON-Schema
 * via the `definition` "edge".
 */
export interface Edge {
  id: string;
  type: "data" | "control" | "evidence" | "learning" | "policy";
  from: string;
  to: string;
}
