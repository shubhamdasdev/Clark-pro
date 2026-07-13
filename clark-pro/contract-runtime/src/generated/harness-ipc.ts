/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/harness-ipc.schema.json
 * Source SHA-256: 6fe19f29e6ad991ced76811860bd1750828659215eda5d5ea6b413931fd8eb9e
 * Generator: json-schema-to-typescript@15.0.4
 */

export type ClarkHarnessIPCMessage = Request | Response | Event;
export type Response = {
  schemaVersion: 1;
  kind: "response";
  requestId: string;
  method:
    | "harness.status"
    | "workspace.ensure"
    | "loop.start"
    | "idea.revise"
    | "run.get"
    | "run.list"
    | "approval.resolve"
    | "memory.propose"
    | "memory.resolve"
    | "memory.correct"
    | "memory.list"
    | "memory.retrieve"
    | "capability.list"
    | "bridge.status";
  ok: boolean;
  result?:
    | StatusResult
    | WorkspaceResult
    | LoopStartResult
    | RunSummary
    | RunListResult
    | MemoryMutationResult
    | MemoryListResult
    | MemoryRetrievalResult
    | CapabilityListResult
    | BridgeStatusResult;
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
    | StatusCommand
    | WorkspaceEnsureCommand
    | LoopStartCommand
    | IdeaReviseCommand
    | RunGetCommand
    | RunListCommand
    | ApprovalResolveCommand
    | MemoryProposeCommand
    | MemoryResolveCommand
    | MemoryCorrectCommand
    | MemoryListCommand
    | MemoryRetrieveCommand
    | CapabilityListCommand
    | BridgeStatusCommand;
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
export interface IdeaReviseCommand {
  method: "idea.revise";
  payload: {
    workspaceId: string;
    parentRunId: string;
    ideaText: string;
    revisionReason: string;
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
export interface MemoryProposeCommand {
  method: "memory.propose";
  payload: {
    workspaceId: string;
    layer: "identity" | "semantic" | "episodic" | "procedural" | "performance";
    statement: string;
    /**
     * @minItems 1
     * @maxItems 20
     */
    evidence:
      | [EvidenceRef]
      | [EvidenceRef, EvidenceRef]
      | [EvidenceRef, EvidenceRef, EvidenceRef]
      | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
      | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
      | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
      | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
      | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ];
    /**
     * @maxItems 20
     */
    contradictions:
      | []
      | [EvidenceRef]
      | [EvidenceRef, EvidenceRef]
      | [EvidenceRef, EvidenceRef, EvidenceRef]
      | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
      | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
      | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
      | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
      | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ]
      | [
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef,
          EvidenceRef
        ];
    confidence: number;
    scope: MemoryScope;
    sensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
    retrievalPolicy: "default" | "explicit_only" | "never_send_to_model";
    expiresAt?: string;
    idempotencyKey: string;
  };
}
export interface EvidenceRef {
  type: "source" | "artifact" | "decision" | "observation" | "correction" | "run" | "publication" | "policy";
  refId: string;
  versionId?: string;
  excerptHash?: string;
}
export interface MemoryScope {
  workspaceId: string;
  projectId?: string;
  platform?: string;
  loopId?: string;
  accountConnectionId?: string;
}
export interface MemoryResolveCommand {
  method: "memory.resolve";
  payload: {
    workspaceId: string;
    memoryId: string;
    action: "promote" | "reject" | "dispute" | "forget";
    reason: string;
    idempotencyKey: string;
  };
}
export interface MemoryCorrectCommand {
  method: "memory.correct";
  payload: {
    workspaceId: string;
    memoryId: string;
    statement: string;
    reason: string;
    confidence?: number;
    scope?: MemoryScope;
    sensitivity?: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
    retrievalPolicy?: "default" | "explicit_only" | "never_send_to_model";
    expiresAt?: string;
    idempotencyKey: string;
  };
}
export interface MemoryListCommand {
  method: "memory.list";
  payload: {
    workspaceId: string;
    limit: number;
    includeForgotten: boolean;
  };
}
export interface MemoryRetrieveCommand {
  method: "memory.retrieve";
  payload: {
    workspaceId: string;
    query: string;
    purpose: string;
    destination: "creator_view" | "local_model" | "remote_model";
    scope: MemoryScope;
    maxSensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
    includeExplicitOnly: boolean;
    limit: number;
    idempotencyKey: string;
  };
}
export interface CapabilityListCommand {
  method: "capability.list";
  payload: {
    workspaceId: string;
  };
}
export interface BridgeStatusCommand {
  method: "bridge.status";
  payload: {
    workspaceId: string;
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
  rootRunId?: string;
  parentRunId?: string;
  revisionNumber?: number;
  revisionReason?: string;
  state: "planned" | "running" | "recovering" | "waiting_approval" | "completed" | "failed" | "cancelled";
  activeStepId: string | null;
  idea: AssetSummary;
  analysis?: AssetSummary;
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
  state: "waiting" | "approved" | "rejected" | "invalidated";
  reason: string;
}
export interface RunListResult {
  /**
   * @maxItems 50
   */
  runs: RunSummary[];
}
export interface MemoryMutationResult {
  memory: MemorySummary;
  deduplicated: boolean;
}
export interface MemorySummary {
  memoryId: string;
  workspaceId: string;
  layer: "identity" | "semantic" | "episodic" | "procedural" | "performance";
  statement: string;
  /**
   * @maxItems 20
   */
  evidence:
    | []
    | [EvidenceRef]
    | [EvidenceRef, EvidenceRef]
    | [EvidenceRef, EvidenceRef, EvidenceRef]
    | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
    | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
    | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
    | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
    | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ];
  /**
   * @maxItems 20
   */
  contradictions:
    | []
    | [EvidenceRef]
    | [EvidenceRef, EvidenceRef]
    | [EvidenceRef, EvidenceRef, EvidenceRef]
    | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
    | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
    | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
    | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
    | [EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef, EvidenceRef]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ]
    | [
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef,
        EvidenceRef
      ];
  confidence: number;
  scope: MemoryScope;
  sensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
  retrievalPolicy: "default" | "explicit_only" | "never_send_to_model";
  state: "proposed" | "active" | "disputed" | "expired" | "rejected" | "forgotten";
  retrievalEligible: boolean;
  createdBy: "creator" | "reflection_agent" | "import";
  supersedesMemoryId?: string;
  replacementMemoryId?: string;
  decisionId?: string;
  expiresAt?: string;
  searchDerivativesDeleted: boolean;
  matchedTerms?: number;
  updatedAt: string;
}
export interface MemoryListResult {
  /**
   * @maxItems 100
   */
  memories: MemorySummary[];
}
export interface MemoryRetrievalResult {
  retrievalId: string;
  queryHash: string;
  purpose: string;
  destination: "creator_view" | "local_model" | "remote_model";
  /**
   * @maxItems 20
   */
  memories:
    | []
    | [MemorySummary]
    | [MemorySummary, MemorySummary]
    | [MemorySummary, MemorySummary, MemorySummary]
    | [MemorySummary, MemorySummary, MemorySummary, MemorySummary]
    | [MemorySummary, MemorySummary, MemorySummary, MemorySummary, MemorySummary]
    | [MemorySummary, MemorySummary, MemorySummary, MemorySummary, MemorySummary, MemorySummary]
    | [MemorySummary, MemorySummary, MemorySummary, MemorySummary, MemorySummary, MemorySummary, MemorySummary]
    | [
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary
      ]
    | [
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary
      ]
    | [
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary
      ]
    | [
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary
      ]
    | [
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary
      ]
    | [
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary
      ]
    | [
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary
      ]
    | [
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary
      ]
    | [
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary
      ]
    | [
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary
      ]
    | [
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary
      ]
    | [
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary
      ]
    | [
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary,
        MemorySummary
      ];
  policyRevisionId: string;
  deduplicated: boolean;
}
export interface CapabilityListResult {
  /**
   * @maxItems 100
   */
  capabilities: {
    id: string;
    version: string;
    name: string;
    state: "registered" | "healthy" | "degraded" | "offline" | "revoked";
    transport: "library" | "mcp_stdio" | "mcp_streamable_http" | "http_api" | "local_process" | "browser";
    actionClass:
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
    networkDomains: string[];
    credentialScopes: string[];
    limitations: string[];
  }[];
}
export interface BridgeStatusResult {
  state: "disabled" | "starting" | "ready" | "failed";
  transport: "streamable_http";
  host: "127.0.0.1";
  port?: number;
  configured: boolean;
  clientId: string | null;
  expiresAt: string | null;
  tools: string[];
  resources: string[];
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
  eventType: "harness.ready" | "harness.recovering" | "run.updated" | "approval.required" | "memory.updated";
  emittedAt: string;
  payload:
    HarnessReadyPayload | HarnessRecoveringPayload | RunUpdatedPayload | ApprovalRequiredPayload | MemoryUpdatedPayload;
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
export interface MemoryUpdatedPayload {
  memoryId: string;
  state: "proposed" | "active" | "disputed" | "expired" | "rejected" | "forgotten";
}
