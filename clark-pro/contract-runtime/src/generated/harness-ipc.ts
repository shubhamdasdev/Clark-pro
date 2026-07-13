/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/harness-ipc.schema.json
 * Source SHA-256: 411e1c1f3309dabd04420675d3a040ec01ec1b892d9f9276b2fce6ac081454aa
 * Generator: json-schema-to-typescript@15.0.4
 */

export type ClarkHarnessIPCMessage = Request | Response | Event;
export type Response = {
  schemaVersion: 1;
  kind: "response";
  requestId: string;
  method: "harness.status" | "workspace.ensure" | "loop.start" | "run.get" | "run.list" | "approval.resolve";
  ok: boolean;
  result?: StatusResult | WorkspaceResult | LoopStartResult | RunSummary | RunListResult;
  error?: Error;
} & Response1;
export type Response1 =
  | {
      ok?: true;
    }
  | {
      ok?: false;
    };

export interface Request {
  schemaVersion: 1;
  kind: "request";
  requestId: string;
  deadlineAt: string;
  command:
    StatusCommand | WorkspaceEnsureCommand | LoopStartCommand | RunGetCommand | RunListCommand | ApprovalResolveCommand;
}
export interface StatusCommand {
  method: "harness.status";
  payload: {};
}
export interface WorkspaceEnsureCommand {
  method: "workspace.ensure";
  payload: {
    workspaceId: string;
    name: string;
  };
}
export interface LoopStartCommand {
  method: "loop.start";
  payload: {
    workspaceId: string;
    projectId: string;
    ideaText: string;
    idempotencyKey: string;
  };
}
export interface RunGetCommand {
  method: "run.get";
  payload: {
    workspaceId: string;
    runId: string;
  };
}
export interface RunListCommand {
  method: "run.list";
  payload: {
    workspaceId: string;
    limit: number;
  };
}
export interface ApprovalResolveCommand {
  method: "approval.resolve";
  payload: {
    workspaceId: string;
    runId: string;
    approvalId: string;
    decision: "approve" | "reject";
    reason?: string;
    idempotencyKey: string;
  };
}
export interface StatusResult {
  state: "ready" | "recovering";
  protocolVersion: 1;
  database: {
    journalMode: "wal";
    eventCount: number;
  };
  activeRuns: number;
  recoveredRuns: number;
}
export interface WorkspaceResult {
  workspaceId: string;
  created: boolean;
  aggregateVersion: number;
}
export interface LoopStartResult {
  run: RunSummary;
  deduplicated: boolean;
}
export interface RunSummary {
  runId: string;
  workspaceId: string;
  projectId: string;
  loopRevision: RevisionRef;
  state: "planned" | "running" | "recovering" | "waiting_approval" | "completed" | "failed" | "cancelled";
  activeStepId: string | null;
  idea: AssetSummary;
  draft?: AssetSummary;
  approval?: ApprovalSummary;
  eventCount: number;
  recoveredFromCheckpoint: boolean;
  updatedAt: string;
}
export interface RevisionRef {
  id: string;
  revision: string;
  contentHash?: string;
}
export interface AssetSummary {
  artifactId: string;
  versionId: string;
  contentHash: string;
  text: string;
}
export interface ApprovalSummary {
  approvalId: string;
  subjectRef: string;
  state: "waiting" | "approved" | "rejected";
  reason: string;
}
export interface RunListResult {
  /**
   * @maxItems 50
   */
  runs: RunSummary[];
}
export interface Error {
  code: "invalid_request" | "deadline_exceeded" | "not_found" | "conflict" | "policy_denied" | "not_ready" | "internal";
  message: string;
  retryable: boolean;
}
export interface Event {
  schemaVersion: 1;
  kind: "event";
  sequence: number;
  eventType: "harness.ready" | "harness.recovering" | "run.updated" | "approval.required";
  emittedAt: string;
  payload: HarnessReadyPayload | HarnessRecoveringPayload | RunUpdatedPayload | ApprovalRequiredPayload;
}
export interface HarnessReadyPayload {
  protocolVersion: 1;
  recoveredRuns: number;
}
export interface HarnessRecoveringPayload {
  reason: string;
  restartAttempt: number;
}
export interface RunUpdatedPayload {
  runId: string;
  state: "planned" | "running" | "recovering" | "waiting_approval" | "completed" | "failed" | "cancelled";
}
export interface ApprovalRequiredPayload {
  runId: string;
  approvalId: string;
  subjectRef: string;
}
