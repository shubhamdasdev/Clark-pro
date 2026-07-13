/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/ground-evidence-ledger.schema.json
 * Source SHA-256: 306e4f1090a07c95012e6fbdd3fa845990ab0f3b746d666050b91982ff30524e
 * Generator: json-schema-to-typescript@15.0.4
 */

/**
 * This interface was referenced by `ClarkGroundEvidenceLedger`'s JSON-Schema
 * via the `definition` "evidenceKind".
 */
export type EvidenceKind =
  | "design_document"
  | "adr"
  | "schema"
  | "fixture"
  | "prototype"
  | "automated_test"
  | "expert_review"
  | "observed_session"
  | "design_partner_record"
  | "binding_action"
  | "runtime_test"
  | "signoff";

export interface ClarkGroundEvidenceLedger {
  $schema?: "https://schemas.clark.pro/v1/ground-evidence-ledger.schema.json";
  schemaVersion: string;
  ledgerId: "clark.evidence.ground";
  stratum: "ground";
  reviewedAt: string;
  currentGate: "before-stratum-1-implementation";
  gateState: "open" | "ready_with_explicit_risk" | "closed";
  /**
   * @minItems 34
   */
  entries: [
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    Entry,
    ...Entry[]
  ];
  signoff: Signoff;
}
/**
 * This interface was referenced by `ClarkGroundEvidenceLedger`'s JSON-Schema
 * via the `definition` "entry".
 */
export interface Entry {
  id: string;
  area: "objective" | "canvas" | "business" | "delivery";
  requirement: string;
  ownerRole: string;
  /**
   * @minItems 1
   */
  proofRequired: [EvidenceKind, ...EvidenceKind[]];
  result:
    | "verified"
    | "contract_verified"
    | "prototype_verified"
    | "defined"
    | "human_evidence_pending"
    | "specified_not_verified"
    | "missing"
    | "failed"
    | "not_applicable";
  evidence: Evidence[];
  acceptanceRule: string;
  limitations: string[];
  nextAction: string;
  groundBlocking: boolean;
  releaseTarget: "ground" | "stratum-1" | "stratum-2" | "stratum-3" | "stratum-4" | "stratum-5" | "stratum-6";
  updatedAt: string;
}
/**
 * This interface was referenced by `ClarkGroundEvidenceLedger`'s JSON-Schema
 * via the `definition` "evidence".
 */
export interface Evidence {
  kind: EvidenceKind;
  location: string;
  claim: string;
  result: "pass" | "pending" | "fail" | "not_run";
  command?: string;
  observedAt?: string;
}
/**
 * This interface was referenced by `ClarkGroundEvidenceLedger`'s JSON-Schema
 * via the `definition` "signoff".
 */
export interface Signoff {
  state: "pending" | "approved" | "rejected";
  /**
   * @minItems 7
   */
  requiredRoles: [string, string, string, string, string, string, string, ...string[]];
  approvals: Approval[];
}
/**
 * This interface was referenced by `ClarkGroundEvidenceLedger`'s JSON-Schema
 * via the `definition` "approval".
 */
export interface Approval {
  role: string;
  person: string;
  decision: "approve" | "reject" | "approve_with_bounded_risk";
  at: string;
  note?: string;
}
