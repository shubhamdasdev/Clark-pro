import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { canonicalJson, sha256 } from "./canonical.mjs";
import { contractValidator } from "./protocol.mjs";

const RUN_STATE_EVENT_TYPES = new Set(["run.started", "run.paused", "run.recovered", "run.completed", "run.failed"]);
const STEP_STATE_BY_EVENT = new Map([
  ["step.started", "running"],
  ["step.waiting_for_approval", "waiting_approval"],
  ["step.completed", "completed"],
  ["step.failed", "failed"],
  ["step.cancelled", "cancelled"]
]);

export class EventStore {
  constructor(databasePath, { now = () => new Date().toISOString(), idFactory } = {}) {
    this.now = now;
    this.idFactory = idFactory ?? (() => randomUUID());
    this.database = new DatabaseSync(databasePath, { timeout: 5_000 });
    this.initialize();
  }

  initialize() {
    this.database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = FULL;
      PRAGMA foreign_keys = ON;
      PRAGMA busy_timeout = 5000;
      PRAGMA trusted_schema = OFF;
      CREATE TABLE IF NOT EXISTS metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      ) STRICT;
      INSERT OR IGNORE INTO metadata(key, value) VALUES ('schema_version', '1');
      CREATE TABLE IF NOT EXISTS events (
        sequence INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL UNIQUE,
        event_type TEXT NOT NULL,
        schema_version INTEGER NOT NULL,
        aggregate_type TEXT NOT NULL,
        aggregate_id TEXT NOT NULL,
        aggregate_version INTEGER NOT NULL,
        workspace_id TEXT NOT NULL,
        project_id TEXT,
        command_id TEXT,
        correlation_id TEXT,
        idempotency_key TEXT,
        recorded_at TEXT NOT NULL,
        previous_event_hash TEXT,
        event_hash TEXT NOT NULL UNIQUE,
        envelope_json TEXT NOT NULL,
        UNIQUE(aggregate_type, aggregate_id, aggregate_version)
      ) STRICT;
      CREATE INDEX IF NOT EXISTS events_workspace_sequence ON events(workspace_id, sequence);
      CREATE INDEX IF NOT EXISTS events_correlation ON events(correlation_id, sequence);
      CREATE TABLE IF NOT EXISTS workspaces (
        workspace_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        aggregate_version INTEGER NOT NULL,
        updated_at TEXT NOT NULL
      ) STRICT;
      CREATE TABLE IF NOT EXISTS artifacts (
        artifact_id TEXT NOT NULL,
        version_id TEXT NOT NULL,
        workspace_id TEXT NOT NULL,
        project_id TEXT,
        artifact_type TEXT NOT NULL,
        content_hash TEXT NOT NULL,
        run_id TEXT,
        step_id TEXT,
        created_at TEXT NOT NULL,
        PRIMARY KEY(artifact_id, version_id)
      ) STRICT;
      CREATE TABLE IF NOT EXISTS projects (
        project_id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        name TEXT NOT NULL,
        kind TEXT NOT NULL,
        aggregate_version INTEGER NOT NULL,
        updated_at TEXT NOT NULL
      ) STRICT;
      CREATE TABLE IF NOT EXISTS runs (
        run_id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        project_id TEXT NOT NULL,
        loop_id TEXT NOT NULL,
        loop_revision TEXT NOT NULL,
        plan_hash TEXT NOT NULL,
        state TEXT NOT NULL,
        active_step_id TEXT,
        idea_artifact_id TEXT NOT NULL,
        idea_version_id TEXT NOT NULL,
        draft_artifact_id TEXT,
        draft_version_id TEXT,
        approval_id TEXT,
        approval_state TEXT,
        recovered_from_checkpoint INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL
      ) STRICT;
      CREATE INDEX IF NOT EXISTS runs_workspace_updated ON runs(workspace_id, updated_at DESC);
      CREATE TABLE IF NOT EXISTS steps (
        run_id TEXT NOT NULL,
        step_id TEXT NOT NULL,
        state TEXT NOT NULL,
        attempt INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL,
        PRIMARY KEY(run_id, step_id),
        FOREIGN KEY(run_id) REFERENCES runs(run_id) ON DELETE CASCADE
      ) STRICT;
      CREATE TABLE IF NOT EXISTS checkpoints (
        checkpoint_id TEXT PRIMARY KEY,
        run_id TEXT NOT NULL,
        event_sequence INTEGER NOT NULL,
        state_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(run_id) REFERENCES runs(run_id) ON DELETE CASCADE
      ) STRICT;
      CREATE INDEX IF NOT EXISTS checkpoints_run_sequence ON checkpoints(run_id, event_sequence DESC);
      CREATE TABLE IF NOT EXISTS commands (
        idempotency_key TEXT PRIMARY KEY,
        method TEXT NOT NULL,
        request_hash TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        response_json TEXT,
        created_at TEXT NOT NULL,
        completed_at TEXT
      ) STRICT;
    `);
    const version = this.database.prepare("SELECT value FROM metadata WHERE key = 'schema_version'").get()?.value;
    if (version !== "1") throw new Error(`Unsupported Harness database schema ${version}`);
    const journalMode = this.database.prepare("PRAGMA journal_mode").get()?.journal_mode;
    if (journalMode !== "wal") throw new Error(`Harness database did not enter WAL mode: ${journalMode}`);
  }

  transaction(callback) {
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const result = callback();
      this.database.exec("COMMIT");
      return result;
    } catch (error) {
      try { this.database.exec("ROLLBACK"); } catch {}
      throw error;
    }
  }

  close() {
    if (this.database.isOpen) this.database.close();
  }

  get journalMode() {
    return this.database.prepare("PRAGMA journal_mode").get()?.journal_mode;
  }

  countEvents() {
    return Number(this.database.prepare("SELECT COUNT(*) AS count FROM events").get().count);
  }

  countEventsForRun(runId) {
    return Number(this.database.prepare("SELECT COUNT(*) AS count FROM events WHERE correlation_id = ?").get(runId).count);
  }

  aggregateVersion(aggregateType, aggregateId) {
    return Number(this.database.prepare("SELECT COALESCE(MAX(aggregate_version), 0) AS version FROM events WHERE aggregate_type = ? AND aggregate_id = ?").get(aggregateType, aggregateId).version);
  }

  appendEvent(specification) {
    const recordedAt = specification.recordedAt ?? this.now();
    const occurredAt = specification.occurredAt ?? recordedAt;
    const aggregateVersion = this.aggregateVersion(specification.aggregateType, specification.aggregateId) + 1;
    const previousEventHash = this.database.prepare("SELECT event_hash FROM events WHERE workspace_id = ? ORDER BY sequence DESC LIMIT 1").get(specification.workspaceId)?.event_hash;
    const event = {
      schemaVersion: 1,
      eventId: specification.eventId ?? `event.${this.idFactory()}`,
      eventType: specification.eventType,
      aggregate: { type: specification.aggregateType, id: specification.aggregateId, version: aggregateVersion },
      workspaceId: specification.workspaceId,
      ...(specification.projectId ? { projectId: specification.projectId } : {}),
      occurredAt,
      recordedAt,
      actor: specification.actor ?? { type: "harness", id: "harness.local" },
      ...(specification.commandId ? { commandId: specification.commandId } : {}),
      ...(specification.causationId ? { causationId: specification.causationId } : {}),
      ...(specification.correlationId ? { correlationId: specification.correlationId } : {}),
      ...(specification.idempotencyKey ? { idempotencyKey: specification.idempotencyKey } : {}),
      sensitivity: specification.sensitivity ?? "workspace",
      payload: specification.payload,
      metadata: { source: specification.source ?? "harness" }
    };
    const hashInput = { previousEventHash: previousEventHash ?? null, event };
    event.integrity = {
      ...(previousEventHash ? { previousEventHash } : {}),
      eventHash: sha256(hashInput)
    };
    contractValidator.validateDomainEvent(event);
    this.database.prepare(`
      INSERT INTO events(event_id, event_type, schema_version, aggregate_type, aggregate_id, aggregate_version, workspace_id, project_id, command_id, correlation_id, idempotency_key, recorded_at, previous_event_hash, event_hash, envelope_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      event.eventId, event.eventType, event.schemaVersion, event.aggregate.type, event.aggregate.id, event.aggregate.version,
      event.workspaceId, event.projectId ?? null, event.commandId ?? null, event.correlationId ?? null,
      event.idempotencyKey ?? null, event.recordedAt, previousEventHash ?? null, event.integrity.eventHash, canonicalJson(event)
    );
    const sequence = Number(this.database.prepare("SELECT last_insert_rowid() AS id").get().id);
    this.applyProjection(event);
    return { sequence, event };
  }

  applyProjection(event) {
    const updatedAt = event.recordedAt;
    if (event.eventType === "workspace.created") {
      this.database.prepare("INSERT INTO workspaces(workspace_id, name, aggregate_version, updated_at) VALUES (?, ?, ?, ?)")
        .run(event.workspaceId, event.payload.name, event.aggregate.version, updatedAt);
      return;
    }
    if (event.eventType === "source.captured") {
      const artifact = event.payload.artifact;
      this.insertArtifact({
        artifactId: artifact.artifactId, versionId: artifact.versionId, workspaceId: event.workspaceId,
        projectId: event.projectId ?? null, artifactType: "idea", contentHash: artifact.contentHash ?? event.payload.originalHash,
        runId: event.correlationId ?? null, stepId: "step.capture", createdAt: updatedAt
      });
      return;
    }
    if (event.eventType === "project.created") {
      this.database.prepare("INSERT INTO projects(project_id, workspace_id, name, kind, aggregate_version, updated_at) VALUES (?, ?, ?, ?, ?, ?)")
        .run(event.payload.projectId, event.workspaceId, event.payload.name, event.payload.kind, event.aggregate.version, updatedAt);
      return;
    }
    if (event.eventType === "artifact.version_created") {
      const artifact = event.payload.artifact;
      this.insertArtifact({
        artifactId: artifact.artifactId, versionId: artifact.versionId, workspaceId: event.workspaceId,
        projectId: event.projectId ?? null, artifactType: event.payload.artifactType, contentHash: event.payload.assetHash,
        runId: event.payload.provenance?.runId ?? null, stepId: event.payload.provenance?.stepId ?? null, createdAt: updatedAt
      });
      if (event.payload.provenance?.runId) {
        this.database.prepare("UPDATE runs SET draft_artifact_id = ?, draft_version_id = ?, updated_at = ? WHERE run_id = ?")
          .run(artifact.artifactId, artifact.versionId, updatedAt, event.payload.provenance.runId);
      }
      return;
    }
    if (event.eventType === "run.planned") {
      const input = event.payload.inputRefs[0];
      this.assertPinnedPlan(event.payload.plan, event);
      this.database.prepare(`INSERT INTO runs(run_id, workspace_id, project_id, loop_id, loop_revision, plan_hash, state, active_step_id, idea_artifact_id, idea_version_id, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'planned', NULL, ?, ?, ?)`)
        .run(event.payload.runId, event.workspaceId, event.projectId, event.payload.loopRevision.id, event.payload.loopRevision.revision, event.payload.planHash, input.artifactId, input.versionId, updatedAt);
      return;
    }
    if (RUN_STATE_EVENT_TYPES.has(event.eventType)) {
      const recovered = event.eventType === "run.recovered" && event.payload.recoveryCheckpointId ? 1 : 0;
      this.database.prepare("UPDATE runs SET state = ?, recovered_from_checkpoint = MAX(recovered_from_checkpoint, ?), updated_at = ? WHERE run_id = ?")
        .run(event.payload.to, recovered, updatedAt, event.payload.runId);
      return;
    }
    if (STEP_STATE_BY_EVENT.has(event.eventType)) {
      const state = STEP_STATE_BY_EVENT.get(event.eventType);
      const attempt = event.payload.attempt ?? this.getStep(event.payload.runId, event.payload.stepId)?.attempt ?? 0;
      this.database.prepare(`INSERT INTO steps(run_id, step_id, state, attempt, updated_at) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(run_id, step_id) DO UPDATE SET state = excluded.state, attempt = MAX(steps.attempt, excluded.attempt), updated_at = excluded.updated_at`)
        .run(event.payload.runId, event.payload.stepId, state, attempt, updatedAt);
      const approvalId = event.eventType === "step.waiting_for_approval" ? approvalIdForRun(event.payload.runId) : null;
      this.database.prepare("UPDATE runs SET active_step_id = ?, approval_id = COALESCE(?, approval_id), approval_state = CASE WHEN ? IS NULL THEN approval_state ELSE 'waiting' END, updated_at = ? WHERE run_id = ?")
        .run(event.payload.stepId, approvalId, approvalId, updatedAt, event.payload.runId);
      return;
    }
    if (event.eventType === "approval.granted") {
      this.database.prepare("UPDATE runs SET approval_state = 'approved', updated_at = ? WHERE draft_artifact_id = ?")
        .run(updatedAt, event.payload.subjectRef);
      return;
    }
    if (event.eventType === "decision.recorded" && event.payload.decisionType === "artifact_approve") {
      const state = event.payload.selectedOption === "approve" ? "approved" : "rejected";
      this.database.prepare("UPDATE runs SET approval_state = ?, updated_at = ? WHERE draft_artifact_id = ?")
        .run(state, updatedAt, event.payload.subjectRef);
    }
  }

  ensurePlanSteps(runId, plan) {
    const now = this.now();
    const statement = this.database.prepare("INSERT OR IGNORE INTO steps(run_id, step_id, state, attempt, updated_at) VALUES (?, ?, ?, 0, ?)");
    for (const step of plan.steps) statement.run(runId, step.id, step.initialState, now);
  }

  insertArtifact({ artifactId, versionId, workspaceId, projectId, artifactType, contentHash, runId, stepId, createdAt }) {
    if (this.getArtifact(artifactId, versionId)) throw new Error(`Immutable artifact version already exists: ${artifactId}@${versionId}`);
    this.database.prepare(`INSERT INTO artifacts(artifact_id, version_id, workspace_id, project_id, artifact_type, content_hash, run_id, step_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(artifactId, versionId, workspaceId, projectId, artifactType, contentHash, runId, stepId, createdAt);
  }

  assertPinnedPlan(plan, event) {
    if (!plan) throw new Error(`Run ${event.payload.runId} has no pinned compiled plan`);
    contractValidator.validateRunPlan(plan);
    const expectedHash = sha256(canonicalJson({ ...plan, planHash: undefined }));
    if (plan.planHash !== expectedHash || event.payload.planHash !== expectedHash) throw new Error(`Run ${event.payload.runId} plan hash mismatch`);
    if (plan.runId !== event.payload.runId || plan.workspaceId !== event.workspaceId || plan.projectId !== event.projectId) {
      throw new Error(`Run ${event.payload.runId} plan scope mismatch`);
    }
  }

  getWorkspace(workspaceId) {
    return this.database.prepare("SELECT * FROM workspaces WHERE workspace_id = ?").get(workspaceId);
  }

  getRunRow(runId) {
    return this.database.prepare("SELECT * FROM runs WHERE run_id = ?").get(runId);
  }

  getRunPlan(runId) {
    const row = this.database.prepare("SELECT envelope_json FROM events WHERE event_type = 'run.planned' AND aggregate_id = ? ORDER BY sequence LIMIT 1").get(runId);
    if (!row) throw new Error(`Pinned plan event missing for ${runId}`);
    const event = JSON.parse(row.envelope_json);
    this.assertPinnedPlan(event.payload.plan, event);
    return event.payload.plan;
  }

  getProject(projectId) {
    return this.database.prepare("SELECT * FROM projects WHERE project_id = ?").get(projectId);
  }

  listRunRows(workspaceId, limit = 20) {
    return this.database.prepare("SELECT * FROM runs WHERE workspace_id = ? ORDER BY updated_at DESC LIMIT ?").all(workspaceId, limit);
  }

  interruptedRunRows() {
    return this.database.prepare("SELECT * FROM runs WHERE state IN ('running', 'recovering') ORDER BY updated_at").all();
  }

  getStep(runId, stepId) {
    return this.database.prepare("SELECT * FROM steps WHERE run_id = ? AND step_id = ?").get(runId, stepId);
  }

  listSteps(runId) {
    return this.database.prepare("SELECT * FROM steps WHERE run_id = ? ORDER BY step_id").all(runId);
  }

  getArtifact(artifactId, versionId) {
    return this.database.prepare("SELECT * FROM artifacts WHERE artifact_id = ? AND version_id = ?").get(artifactId, versionId);
  }

  createCheckpoint(checkpointId, runId, state) {
    const sequence = Number(this.database.prepare("SELECT COALESCE(MAX(sequence), 0) AS sequence FROM events").get().sequence);
    this.database.prepare("INSERT OR REPLACE INTO checkpoints(checkpoint_id, run_id, event_sequence, state_json, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(checkpointId, runId, sequence, canonicalJson(state), this.now());
  }

  latestCheckpoint(runId) {
    const row = this.database.prepare("SELECT * FROM checkpoints WHERE run_id = ? ORDER BY event_sequence DESC LIMIT 1").get(runId);
    return row ? { ...row, state: JSON.parse(row.state_json) } : undefined;
  }

  beginCommand({ idempotencyKey, method, requestHash, subjectId }) {
    this.database.prepare("INSERT INTO commands(idempotency_key, method, request_hash, subject_id, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(idempotencyKey, method, requestHash, subjectId, this.now());
  }

  getCommand(idempotencyKey) {
    const row = this.database.prepare("SELECT * FROM commands WHERE idempotency_key = ?").get(idempotencyKey);
    return row ? { ...row, response: row.response_json ? JSON.parse(row.response_json) : undefined } : undefined;
  }

  completeCommand(idempotencyKey, response) {
    this.database.prepare("UPDATE commands SET response_json = ?, completed_at = ? WHERE idempotency_key = ?")
      .run(canonicalJson(response), this.now(), idempotencyKey);
  }

  setRecoveredFromCheckpoint(runId, recovered = true) {
    this.database.prepare("UPDATE runs SET recovered_from_checkpoint = ? WHERE run_id = ?").run(recovered ? 1 : 0, runId);
  }

  eventEnvelopes() {
    return this.eventRecords().map((row) => JSON.parse(row.envelope_json));
  }

  eventRecords() {
    return this.database.prepare("SELECT workspace_id, previous_event_hash, event_hash, envelope_json FROM events ORDER BY sequence").all();
  }

  verifyHashChain() {
    const previousByWorkspace = new Map();
    for (const row of this.eventRecords()) {
      const event = JSON.parse(row.envelope_json);
      const previousEventHash = previousByWorkspace.get(event.workspaceId);
      if (row.workspace_id !== event.workspaceId || (row.previous_event_hash ?? undefined) !== previousEventHash) return false;
      if ((event.integrity.previousEventHash ?? undefined) !== previousEventHash) return false;
      const { integrity, ...withoutIntegrity } = event;
      const expected = sha256({ previousEventHash: previousEventHash ?? null, event: withoutIntegrity });
      if (integrity.eventHash !== expected || row.event_hash !== expected) return false;
      try {
        contractValidator.validateDomainEvent(event);
      } catch {
        return false;
      }
      previousByWorkspace.set(event.workspaceId, integrity.eventHash);
    }
    return true;
  }

  projectionSnapshot() {
    const select = (table, order) => this.database.prepare(`SELECT * FROM ${table} ORDER BY ${order}`).all();
    return {
      workspaces: select("workspaces", "workspace_id"),
      projects: select("projects", "project_id"),
      artifacts: select("artifacts", "artifact_id, version_id"),
      runs: select("runs", "run_id"),
      steps: select("steps", "run_id, step_id")
    };
  }

  rebuildProjections() {
    const events = this.eventEnvelopes();
    const checkpoints = this.database.prepare("SELECT * FROM checkpoints ORDER BY event_sequence").all();
    this.transaction(() => {
      this.database.exec("DELETE FROM steps; DELETE FROM runs; DELETE FROM artifacts; DELETE FROM projects; DELETE FROM workspaces;");
      for (const event of events) this.applyProjection(event);
      const restore = this.database.prepare("INSERT OR REPLACE INTO checkpoints(checkpoint_id, run_id, event_sequence, state_json, created_at) VALUES (?, ?, ?, ?, ?)");
      for (const checkpoint of checkpoints) {
        if (this.getRunRow(checkpoint.run_id)) restore.run(checkpoint.checkpoint_id, checkpoint.run_id, checkpoint.event_sequence, checkpoint.state_json, checkpoint.created_at);
      }
    });
    return this.projectionSnapshot();
  }
}

export function approvalIdForRun(runId) {
  return `approval.brief.${runId.slice("run.idea.".length)}.v1`;
}
