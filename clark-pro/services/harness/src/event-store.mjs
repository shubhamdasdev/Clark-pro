import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { canonicalJson, sha256 } from "./canonical.mjs";
import { contractValidator } from "./protocol.mjs";

const RUN_STATE_EVENT_TYPES = new Set(["run.started", "run.paused", "run.recovered", "run.completed", "run.failed", "run.cancelled"]);
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
      INSERT OR IGNORE INTO metadata(key, value) VALUES ('schema_version', '6');
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
        root_run_id TEXT NOT NULL,
        parent_run_id TEXT,
        revision_number INTEGER NOT NULL,
        revision_reason TEXT,
        workspace_id TEXT NOT NULL,
        project_id TEXT NOT NULL,
        loop_id TEXT NOT NULL,
        loop_revision TEXT NOT NULL,
        plan_hash TEXT NOT NULL,
        state TEXT NOT NULL,
        active_step_id TEXT,
        idea_artifact_id TEXT NOT NULL,
        idea_version_id TEXT NOT NULL,
        analysis_artifact_id TEXT,
        analysis_version_id TEXT,
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
      CREATE TABLE IF NOT EXISTS capabilities (
        workspace_id TEXT NOT NULL,
        capability_id TEXT NOT NULL,
        revision TEXT NOT NULL,
        manifest_hash TEXT NOT NULL,
        manifest_json TEXT NOT NULL,
        state TEXT NOT NULL,
        transport TEXT NOT NULL,
        action_class TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        PRIMARY KEY(workspace_id, capability_id, revision)
      ) STRICT;
      CREATE TABLE IF NOT EXISTS permission_receipts (
        receipt_id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        run_id TEXT NOT NULL,
        step_id TEXT NOT NULL,
        record_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      ) STRICT;
      CREATE TABLE IF NOT EXISTS capability_leases (
        lease_id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        run_id TEXT NOT NULL,
        step_id TEXT NOT NULL,
        capability_id TEXT NOT NULL,
        revision TEXT NOT NULL,
        permission_receipt_id TEXT NOT NULL,
        state TEXT NOT NULL,
        effective_json TEXT NOT NULL,
        issued_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      ) STRICT;
      CREATE INDEX IF NOT EXISTS capability_leases_state ON capability_leases(state, expires_at);
      CREATE TABLE IF NOT EXISTS tool_calls (
        call_id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        run_id TEXT NOT NULL,
        step_id TEXT NOT NULL,
        capability_id TEXT NOT NULL,
        revision TEXT NOT NULL,
        permission_receipt_id TEXT NOT NULL,
        lease_id TEXT,
        input_hash TEXT NOT NULL,
        status TEXT NOT NULL,
        result_ref TEXT,
        result_hash TEXT,
        duration_ms INTEGER,
        error_class TEXT,
        receipt_json TEXT,
        updated_at TEXT NOT NULL
      ) STRICT;
      CREATE TABLE IF NOT EXISTS bridge_clients (
        client_id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        display_name TEXT NOT NULL,
        state TEXT NOT NULL,
        action_classes_json TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      ) STRICT;
      CREATE TABLE IF NOT EXISTS memories (
        memory_id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        layer TEXT NOT NULL,
        statement TEXT NOT NULL,
        evidence_json TEXT NOT NULL,
        contradictions_json TEXT NOT NULL,
        confidence REAL NOT NULL,
        scope_json TEXT NOT NULL,
        sensitivity TEXT NOT NULL,
        retrieval_policy TEXT NOT NULL,
        state TEXT NOT NULL,
        created_by TEXT NOT NULL,
        supersedes_memory_id TEXT,
        replacement_memory_id TEXT,
        decision_id TEXT,
        expires_at TEXT,
        search_derivatives_deleted INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL
      ) STRICT;
      CREATE INDEX IF NOT EXISTS memories_workspace_state ON memories(workspace_id, state, updated_at DESC);
      CREATE TABLE IF NOT EXISTS memory_retrievals (
        retrieval_id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        query_hash TEXT NOT NULL,
        purpose TEXT NOT NULL,
        destination TEXT NOT NULL,
        scope_json TEXT NOT NULL,
        memory_ids_json TEXT NOT NULL,
        result_count INTEGER NOT NULL,
        max_sensitivity TEXT NOT NULL,
        explicit_only_authorized INTEGER NOT NULL,
        influence_state TEXT NOT NULL,
        policy_revision_id TEXT NOT NULL,
        created_at TEXT NOT NULL
      ) STRICT;
      CREATE TABLE IF NOT EXISTS tool_packages (
        workspace_id TEXT NOT NULL,
        tool_package_id TEXT NOT NULL,
        revision TEXT NOT NULL,
        manifest_hash TEXT NOT NULL,
        manifest_json TEXT NOT NULL,
        source_revision TEXT NOT NULL,
        source_hash TEXT NOT NULL,
        state TEXT NOT NULL,
        installed INTEGER NOT NULL,
        trust_basis TEXT NOT NULL,
        evidence_status_json TEXT NOT NULL,
        status_reason TEXT NOT NULL,
        decision_id TEXT,
        rollback_revision TEXT,
        updated_at TEXT NOT NULL,
        PRIMARY KEY(workspace_id, tool_package_id, revision)
      ) STRICT;
      CREATE INDEX IF NOT EXISTS tool_packages_workspace_state ON tool_packages(workspace_id, state, updated_at DESC);
      CREATE TABLE IF NOT EXISTS skill_packages (
        workspace_id TEXT NOT NULL,
        skill_id TEXT NOT NULL,
        revision TEXT NOT NULL,
        manifest_hash TEXT NOT NULL,
        manifest_json TEXT NOT NULL,
        source_hash TEXT NOT NULL,
        state TEXT NOT NULL,
        trust_basis TEXT NOT NULL,
        test_status TEXT NOT NULL,
        conformance_json TEXT NOT NULL,
        effective_permissions_json TEXT NOT NULL,
        status_reason TEXT NOT NULL,
        decision_id TEXT,
        rollback_revision TEXT,
        updated_at TEXT NOT NULL,
        PRIMARY KEY(workspace_id, skill_id, revision)
      ) STRICT;
      CREATE INDEX IF NOT EXISTS skill_packages_workspace_state ON skill_packages(workspace_id, state, updated_at DESC);
    `);
    let version = this.database.prepare("SELECT value FROM metadata WHERE key = 'schema_version'").get()?.value;
    if (version === "1") {
      const columns = new Set(this.database.prepare("PRAGMA table_info(runs)").all().map((column) => column.name));
      this.database.exec("BEGIN IMMEDIATE");
      try {
        if (!columns.has("analysis_artifact_id")) this.database.exec("ALTER TABLE runs ADD COLUMN analysis_artifact_id TEXT");
        if (!columns.has("analysis_version_id")) this.database.exec("ALTER TABLE runs ADD COLUMN analysis_version_id TEXT");
        this.database.prepare("UPDATE metadata SET value = '2' WHERE key = 'schema_version'").run();
        this.database.exec("COMMIT");
      } catch (error) {
        try { this.database.exec("ROLLBACK"); } catch {}
        throw error;
      }
      version = "2";
    }
    if (version === "2") {
      const columns = new Set(this.database.prepare("PRAGMA table_info(runs)").all().map((column) => column.name));
      this.database.exec("BEGIN IMMEDIATE");
      try {
        if (!columns.has("root_run_id")) this.database.exec("ALTER TABLE runs ADD COLUMN root_run_id TEXT");
        if (!columns.has("parent_run_id")) this.database.exec("ALTER TABLE runs ADD COLUMN parent_run_id TEXT");
        if (!columns.has("revision_number")) this.database.exec("ALTER TABLE runs ADD COLUMN revision_number INTEGER NOT NULL DEFAULT 1");
        if (!columns.has("revision_reason")) this.database.exec("ALTER TABLE runs ADD COLUMN revision_reason TEXT");
        this.database.exec("UPDATE runs SET root_run_id = run_id WHERE root_run_id IS NULL");
        this.database.prepare("UPDATE metadata SET value = '3' WHERE key = 'schema_version'").run();
        this.database.exec("COMMIT");
      } catch (error) {
        try { this.database.exec("ROLLBACK"); } catch {}
        throw error;
      }
      version = "3";
    }
    if (version === "3") {
      this.database.prepare("UPDATE metadata SET value = '4' WHERE key = 'schema_version'").run();
      version = "4";
    }
    if (version === "4") {
      this.database.prepare("UPDATE metadata SET value = '5' WHERE key = 'schema_version'").run();
      version = "5";
    }
    if (version === "5") {
      this.database.prepare("UPDATE metadata SET value = '6' WHERE key = 'schema_version'").run();
      version = "6";
    }
    if (version !== "6") throw new Error(`Unsupported Harness database schema ${version}`);
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
      metadata: { source: specification.source ?? "harness", ...(specification.metadata ?? {}) }
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
      if (event.payload.provenance?.runId && event.payload.artifactType === "brief") {
        this.database.prepare("UPDATE runs SET draft_artifact_id = ?, draft_version_id = ?, updated_at = ? WHERE run_id = ?")
          .run(artifact.artifactId, artifact.versionId, updatedAt, event.payload.provenance.runId);
      }
      if (event.payload.provenance?.runId && event.payload.artifactType === "outcome_report") {
        this.database.prepare("UPDATE runs SET analysis_artifact_id = ?, analysis_version_id = ?, updated_at = ? WHERE run_id = ?")
          .run(artifact.artifactId, artifact.versionId, updatedAt, event.payload.provenance.runId);
      }
      return;
    }
    if (event.eventType === "run.planned") {
      const input = event.payload.inputRefs[0];
      this.assertPinnedPlan(event.payload.plan, event);
      this.database.prepare(`INSERT INTO runs(run_id, root_run_id, parent_run_id, revision_number, revision_reason, workspace_id, project_id, loop_id, loop_revision, plan_hash, state, active_step_id, idea_artifact_id, idea_version_id, approval_id, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'planned', NULL, ?, ?, ?, ?)`)
        .run(
          event.payload.runId,
          event.payload.rootRunId ?? event.payload.runId,
          event.payload.parentRunId ?? null,
          event.payload.revisionNumber ?? 1,
          event.payload.revisionReason ?? null,
          event.workspaceId,
          event.projectId,
          event.payload.loopRevision.id,
          event.payload.loopRevision.revision,
          event.payload.planHash,
          input.artifactId,
          input.versionId,
          event.payload.approvalId ?? approvalIdForRun(event.payload.runId),
          updatedAt
        );
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
      const approvalId = event.eventType === "step.waiting_for_approval" ? (this.getRunRow(event.payload.runId)?.approval_id ?? approvalIdForRun(event.payload.runId)) : null;
      this.database.prepare("UPDATE runs SET active_step_id = ?, approval_id = COALESCE(?, approval_id), approval_state = CASE WHEN ? IS NULL THEN approval_state ELSE 'waiting' END, updated_at = ? WHERE run_id = ?")
        .run(event.payload.stepId, approvalId, approvalId, updatedAt, event.payload.runId);
      return;
    }
    if (event.eventType === "approval.granted") {
      this.database.prepare("UPDATE runs SET approval_state = 'approved', updated_at = ? WHERE draft_artifact_id = ?")
        .run(updatedAt, event.payload.subjectRef);
      return;
    }
    if (event.eventType === "approval.invalidated") {
      this.database.prepare("UPDATE runs SET approval_state = 'invalidated', updated_at = ? WHERE approval_id = ?")
        .run(updatedAt, event.payload.approvalId);
      return;
    }
    if (event.eventType === "decision.recorded" && event.payload.decisionType === "artifact_approve") {
      const state = event.payload.selectedOption === "approve" ? "approved" : "rejected";
      this.database.prepare("UPDATE runs SET approval_state = ?, updated_at = ? WHERE draft_artifact_id = ?")
        .run(state, updatedAt, event.payload.subjectRef);
      return;
    }
    if (event.eventType === "memory.proposed") {
      const payload = event.payload;
      this.database.prepare(`INSERT INTO memories(memory_id, workspace_id, layer, statement, evidence_json, contradictions_json, confidence, scope_json, sensitivity, retrieval_policy, state, created_by, supersedes_memory_id, expires_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'proposed', ?, ?, ?, ?)`)
        .run(
          payload.memoryId, event.workspaceId, payload.layer, payload.statement,
          canonicalJson(payload.evidence), canonicalJson(payload.contradictions), payload.confidence,
          canonicalJson(payload.scope), payload.sensitivity, payload.retrievalPolicy ?? "default",
          payload.createdBy ?? "creator", payload.supersedesMemoryId ?? null, payload.expiresAt ?? null, updatedAt
        );
      return;
    }
    if (["memory.promoted", "memory.rejected", "memory.disputed", "memory.forgotten"].includes(event.eventType)) {
      const payload = event.payload;
      const forgotten = event.eventType === "memory.forgotten";
      const result = this.database.prepare(`UPDATE memories SET state = ?, decision_id = ?, replacement_memory_id = COALESCE(?, replacement_memory_id),
        statement = CASE WHEN ? THEN '[forgotten]' ELSE statement END,
        evidence_json = CASE WHEN ? THEN '[]' ELSE evidence_json END,
        contradictions_json = CASE WHEN ? THEN '[]' ELSE contradictions_json END,
        search_derivatives_deleted = CASE WHEN ? THEN 1 ELSE search_derivatives_deleted END,
        updated_at = ? WHERE memory_id = ? AND workspace_id = ?`)
        .run(payload.to, payload.decisionId, payload.replacementMemoryId ?? null, forgotten ? 1 : 0, forgotten ? 1 : 0, forgotten ? 1 : 0, forgotten ? 1 : 0, updatedAt, payload.memoryId, event.workspaceId);
      if (result.changes !== 1) throw new Error(`Memory projection missing ${payload.memoryId}`);
      return;
    }
    if (event.eventType === "memory.retrieval_recorded") {
      const payload = event.payload;
      this.database.prepare(`INSERT INTO memory_retrievals(retrieval_id, workspace_id, query_hash, purpose, destination, scope_json, memory_ids_json, result_count, max_sensitivity, explicit_only_authorized, influence_state, policy_revision_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(
          payload.retrievalId, event.workspaceId, payload.queryHash, payload.purpose, payload.destination,
          canonicalJson(payload.scope), canonicalJson(payload.memoryIds), payload.resultCount, payload.maxSensitivity,
          payload.explicitOnlyAuthorized ? 1 : 0, payload.influenceState, payload.policyRevisionId, updatedAt
        );
      this.database.prepare("UPDATE workspaces SET aggregate_version = ?, updated_at = ? WHERE workspace_id = ?")
        .run(event.aggregate.version, updatedAt, event.workspaceId);
      return;
    }
    if (event.eventType.startsWith("skill.revision_")) {
      const payload = event.payload;
      const existing = this.getSkillPackage(event.workspaceId, payload.skillRevision.id, payload.skillRevision.revision);
      const manifest = payload.manifest ?? (existing ? JSON.parse(existing.manifest_json) : undefined);
      if (!manifest) throw new Error(`Skill ${payload.skillRevision.id}@${payload.skillRevision.revision} has no pinned manifest`);
      contractValidator.validateSkillPackage(manifest);
      const manifestHash = sha256(canonicalJson(manifest));
      if (manifest.id !== payload.skillRevision.id || manifest.revision !== payload.skillRevision.revision || manifest.source.contentHash !== payload.sourceHash || payload.skillRevision.contentHash !== payload.sourceHash || (payload.manifestHash && payload.manifestHash !== manifestHash)) {
        throw new Error(`Skill ${payload.skillRevision.id}@${payload.skillRevision.revision} manifest identity or hash mismatch`);
      }
      const conformance = payload.conformance ?? (existing ? JSON.parse(existing.conformance_json) : {
        sourceIntegrity: false, fileIntegrity: false, executionBoundaryVerified: false, declaredTestsExecuted: false,
        observations: ["Historical event has no replayable conformance evidence"]
      });
      this.database.prepare(`INSERT INTO skill_packages(workspace_id, skill_id, revision, manifest_hash, manifest_json, source_hash, state, trust_basis, test_status, conformance_json, effective_permissions_json, status_reason, decision_id, rollback_revision, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(workspace_id, skill_id, revision) DO UPDATE SET manifest_hash = excluded.manifest_hash, manifest_json = excluded.manifest_json, source_hash = excluded.source_hash, state = excluded.state, trust_basis = excluded.trust_basis, test_status = excluded.test_status, conformance_json = excluded.conformance_json, effective_permissions_json = excluded.effective_permissions_json, status_reason = excluded.status_reason, decision_id = excluded.decision_id, rollback_revision = excluded.rollback_revision, updated_at = excluded.updated_at`)
        .run(
          event.workspaceId, manifest.id, manifest.revision, manifestHash, canonicalJson(manifest), manifest.source.contentHash,
          payload.to, manifest.lifecycle.trustBasis, payload.testStatus, canonicalJson(conformance), canonicalJson(payload.effectivePermissions),
          payload.reason ?? `${payload.to} by governed skill lifecycle`, payload.decisionId ?? null,
          payload.rollbackRevision?.revision ?? manifest.lifecycle.rollbackRevision ?? null, updatedAt
        );
      return;
    }
    if (event.eventType.startsWith("tool_package.revision_")) {
      const payload = event.payload;
      const existing = this.getToolPackage(event.workspaceId, payload.toolPackageRevision.id, payload.toolPackageRevision.revision);
      const manifest = payload.manifest ?? (existing ? JSON.parse(existing.manifest_json) : undefined);
      if (!manifest) throw new Error(`Tool Package ${payload.toolPackageRevision.id}@${payload.toolPackageRevision.revision} has no pinned manifest`);
      contractValidator.validateToolPackage(manifest);
      const manifestHash = sha256(canonicalJson(manifest));
      if (manifest.id !== payload.toolPackageRevision.id || manifest.revision !== payload.toolPackageRevision.revision || manifestHash !== payload.manifestHash || manifest.source.revision !== payload.sourceRevision || manifest.source.contentHash !== payload.sourceHash) {
        throw new Error(`Tool Package ${payload.toolPackageRevision.id}@${payload.toolPackageRevision.revision} manifest identity or hash mismatch`);
      }
      this.database.prepare(`INSERT INTO tool_packages(workspace_id, tool_package_id, revision, manifest_hash, manifest_json, source_revision, source_hash, state, installed, trust_basis, evidence_status_json, status_reason, decision_id, rollback_revision, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(workspace_id, tool_package_id, revision) DO UPDATE SET manifest_hash = excluded.manifest_hash, manifest_json = excluded.manifest_json, source_revision = excluded.source_revision, source_hash = excluded.source_hash, state = excluded.state, installed = excluded.installed, trust_basis = excluded.trust_basis, evidence_status_json = excluded.evidence_status_json, status_reason = excluded.status_reason, decision_id = excluded.decision_id, rollback_revision = excluded.rollback_revision, updated_at = excluded.updated_at`)
        .run(
          event.workspaceId, manifest.id, manifest.revision, manifestHash, canonicalJson(manifest), manifest.source.revision,
          manifest.source.contentHash, payload.to, manifest.lifecycle.installed ? 1 : 0, manifest.lifecycle.trustBasis,
          canonicalJson(payload.evidenceStatus), payload.reason ?? manifest.lifecycle.statusReason, payload.decisionId ?? null,
          payload.rollbackRevision?.revision ?? manifest.lifecycle.rollbackRevision ?? null, updatedAt
        );
      return;
    }
    if (event.eventType === "capability.revision_registered" || event.eventType === "capability.health_changed") {
      const existing = this.getCapability(event.workspaceId, event.payload.capabilityRevision.id, event.payload.capabilityRevision.revision);
      const manifest = event.payload.manifest ?? existing?.manifest;
      if (!manifest) throw new Error(`Capability ${event.payload.capabilityRevision.id} has no pinned manifest`);
      contractValidator.validateCapabilityManifest(manifest);
      if (manifest.id !== event.payload.capabilityRevision.id || manifest.version !== event.payload.capabilityRevision.revision || sha256(canonicalJson(manifest)) !== event.payload.manifestHash) {
        throw new Error(`Capability ${event.payload.capabilityRevision.id} manifest scope or hash mismatch`);
      }
      const transport = manifest.transport.type === "mcp" ? `mcp_${manifest.transport.modes[0]}` : manifest.transport.type;
      this.database.prepare(`INSERT INTO capabilities(workspace_id, capability_id, revision, manifest_hash, manifest_json, state, transport, action_class, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(workspace_id, capability_id, revision) DO UPDATE SET manifest_hash = excluded.manifest_hash, manifest_json = excluded.manifest_json, state = excluded.state, transport = excluded.transport, action_class = excluded.action_class, updated_at = excluded.updated_at`)
        .run(event.workspaceId, manifest.id, manifest.version, event.payload.manifestHash, canonicalJson(manifest), event.payload.to, transport, manifest.permissions.actionClass, updatedAt);
      return;
    }
    if (event.eventType === "capability.permission_evaluated") {
      const receipt = event.payload.permissionReceipt;
      contractValidator.validateCapabilityRuntime(receipt);
      this.database.prepare(`INSERT INTO permission_receipts(receipt_id, workspace_id, run_id, step_id, record_json, created_at) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(receipt_id) DO UPDATE SET record_json = excluded.record_json`)
        .run(receipt.receiptId, event.workspaceId, receipt.runId, receipt.stepId, canonicalJson(receipt), receipt.evaluatedAt);
      return;
    }
    if (event.eventType === "capability.lease_issued" || event.eventType === "capability.lease_revoked") {
      const payload = event.payload;
      contractValidator.validateCapabilityRuntime(payload.permissionReceipt);
      this.database.prepare(`INSERT INTO permission_receipts(receipt_id, workspace_id, run_id, step_id, record_json, created_at) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(receipt_id) DO UPDATE SET record_json = excluded.record_json`)
        .run(payload.permissionReceiptId, event.workspaceId, payload.runId, payload.stepId, canonicalJson(payload.permissionReceipt), payload.permissionReceipt.evaluatedAt);
      this.database.prepare(`INSERT INTO capability_leases(lease_id, workspace_id, run_id, step_id, capability_id, revision, permission_receipt_id, state, effective_json, issued_at, expires_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(lease_id) DO UPDATE SET state = excluded.state, effective_json = excluded.effective_json, updated_at = excluded.updated_at`)
        .run(payload.leaseId, event.workspaceId, payload.runId, payload.stepId, payload.capabilityRevision.id, payload.capabilityRevision.revision, payload.permissionReceiptId, payload.to, canonicalJson(payload.effectiveAuthority), payload.issuedAt, payload.expiresAt, updatedAt);
      return;
    }
    if (event.eventType === "tool.call_requested") {
      const payload = event.payload;
      this.database.prepare(`INSERT INTO tool_calls(call_id, workspace_id, run_id, step_id, capability_id, revision, permission_receipt_id, lease_id, input_hash, status, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'requested', ?)`)
        .run(payload.callId, event.workspaceId, payload.runId, payload.stepId, payload.capabilityRevision.id, payload.capabilityRevision.revision, payload.permissionReceiptId, payload.leaseId ?? null, payload.inputHash, updatedAt);
      return;
    }
    if (event.eventType === "tool.call_completed") {
      const payload = event.payload;
      if (payload.invocationReceipt) contractValidator.validateCapabilityRuntime(payload.invocationReceipt);
      const changed = this.database.prepare("UPDATE tool_calls SET status = ?, result_ref = ?, result_hash = ?, duration_ms = ?, error_class = ?, receipt_json = ?, updated_at = ? WHERE call_id = ?")
        .run(payload.status, payload.resultRef ?? null, payload.resultHash ?? null, payload.durationMs, payload.errorClass ?? "none", payload.invocationReceipt ? canonicalJson(payload.invocationReceipt) : null, updatedAt, payload.callId);
      if (Number(changed.changes) !== 1) throw new Error(`Tool completion has no request: ${payload.callId}`);
      return;
    }
    if (event.eventType === "bridge.client_registered" || event.eventType === "bridge.client_revoked") {
      const payload = event.payload;
      this.database.prepare(`INSERT INTO bridge_clients(client_id, workspace_id, display_name, state, action_classes_json, expires_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(client_id) DO UPDATE SET state = excluded.state, action_classes_json = excluded.action_classes_json, expires_at = excluded.expires_at, updated_at = excluded.updated_at`)
        .run(payload.clientId, event.workspaceId, payload.displayName, payload.to, canonicalJson(payload.actionClasses), payload.expiresAt, updatedAt);
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

  getCapability(workspaceId, capabilityId, revision) {
    const row = this.database.prepare("SELECT * FROM capabilities WHERE workspace_id = ? AND capability_id = ? AND revision = ?").get(workspaceId, capabilityId, revision);
    return row ? { ...row, manifest: JSON.parse(row.manifest_json) } : undefined;
  }

  listCapabilities(workspaceId) {
    return this.database.prepare("SELECT * FROM capabilities WHERE workspace_id = ? ORDER BY capability_id, revision").all(workspaceId)
      .map((row) => ({ ...row, manifest: JSON.parse(row.manifest_json) }));
  }

  activeCapabilityLeases() {
    return this.database.prepare("SELECT * FROM capability_leases WHERE state = 'active' ORDER BY issued_at").all();
  }

  getCapabilityLease(leaseId) {
    return this.database.prepare("SELECT * FROM capability_leases WHERE lease_id = ?").get(leaseId);
  }

  getPermissionReceipt(receiptId) {
    const row = this.database.prepare("SELECT * FROM permission_receipts WHERE receipt_id = ?").get(receiptId);
    return row ? JSON.parse(row.record_json) : undefined;
  }

  getToolCall(callId) {
    return this.database.prepare("SELECT * FROM tool_calls WHERE call_id = ?").get(callId);
  }

  requestedToolCallsForLease(leaseId) {
    return this.database.prepare("SELECT * FROM tool_calls WHERE lease_id = ? AND status = 'requested' ORDER BY call_id").all(leaseId);
  }

  activeBridgeClients() {
    return this.database.prepare("SELECT * FROM bridge_clients WHERE state = 'active' ORDER BY updated_at").all();
  }

  getBridgeClient(clientId) {
    return this.database.prepare("SELECT * FROM bridge_clients WHERE client_id = ?").get(clientId);
  }

  getMemory(memoryId) {
    return this.database.prepare("SELECT * FROM memories WHERE memory_id = ?").get(memoryId);
  }

  listMemoryRows(workspaceId, limit = 50, includeForgotten = false) {
    return this.database.prepare(`SELECT * FROM memories WHERE workspace_id = ? AND (? = 1 OR state != 'forgotten') ORDER BY updated_at DESC, memory_id LIMIT ?`)
      .all(workspaceId, includeForgotten ? 1 : 0, limit);
  }

  listActiveMemoryRows(workspaceId) {
    return this.database.prepare("SELECT * FROM memories WHERE workspace_id = ? AND state = 'active' ORDER BY updated_at DESC, memory_id").all(workspaceId);
  }

  getMemoryRetrieval(retrievalId) {
    return this.database.prepare("SELECT * FROM memory_retrievals WHERE retrieval_id = ?").get(retrievalId);
  }

  getToolPackage(workspaceId, toolPackageId, revision) {
    return this.database.prepare("SELECT * FROM tool_packages WHERE workspace_id = ? AND tool_package_id = ? AND revision = ?")
      .get(workspaceId, toolPackageId, revision);
  }

  getActiveToolPackage(workspaceId, toolPackageId) {
    return this.database.prepare("SELECT * FROM tool_packages WHERE workspace_id = ? AND tool_package_id = ? AND state = 'active' ORDER BY updated_at DESC LIMIT 1")
      .get(workspaceId, toolPackageId);
  }

  listToolPackageRows(workspaceId, limit = 50) {
    return this.database.prepare("SELECT * FROM tool_packages WHERE workspace_id = ? ORDER BY updated_at DESC, tool_package_id, revision LIMIT ?")
      .all(workspaceId, limit);
  }

  getSkillPackage(workspaceId, skillId, revision) {
    return this.database.prepare("SELECT * FROM skill_packages WHERE workspace_id = ? AND skill_id = ? AND revision = ?")
      .get(workspaceId, skillId, revision);
  }

  getActiveSkillPackage(workspaceId, skillId) {
    return this.database.prepare("SELECT * FROM skill_packages WHERE workspace_id = ? AND skill_id = ? AND state = 'active' ORDER BY updated_at DESC LIMIT 1")
      .get(workspaceId, skillId);
  }

  listSkillPackageRows(workspaceId, limit = 50) {
    return this.database.prepare("SELECT * FROM skill_packages WHERE workspace_id = ? ORDER BY updated_at DESC, skill_id, revision LIMIT ?")
      .all(workspaceId, limit);
  }

  evidenceRefExists(workspaceId, evidence) {
    if (["artifact", "source"].includes(evidence.type)) {
      if (!evidence.versionId) return false;
      return Boolean(this.database.prepare("SELECT 1 FROM artifacts WHERE workspace_id = ? AND artifact_id = ? AND version_id = ?").get(workspaceId, evidence.refId, evidence.versionId));
    }
    if (evidence.type === "run") return Boolean(this.database.prepare("SELECT 1 FROM runs WHERE workspace_id = ? AND run_id = ?").get(workspaceId, evidence.refId));
    const aggregateType = evidence.type === "correction" ? "decision" : evidence.type;
    return Boolean(this.database.prepare("SELECT 1 FROM events WHERE workspace_id = ? AND aggregate_type = ? AND aggregate_id = ? LIMIT 1").get(workspaceId, aggregateType, evidence.refId));
  }

  listWorkspaces() {
    return this.database.prepare("SELECT * FROM workspaces ORDER BY workspace_id").all();
  }

  listRunRows(workspaceId, limit = 20) {
    return this.database.prepare("SELECT * FROM runs WHERE workspace_id = ? ORDER BY updated_at DESC, revision_number DESC, run_id DESC LIMIT ?").all(workspaceId, limit);
  }

  nextRevisionNumber(rootRunId) {
    return Number(this.database.prepare("SELECT COALESCE(MAX(revision_number), 0) + 1 AS revision FROM runs WHERE root_run_id = ?").get(rootRunId).revision);
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

  latestArtifactDecision(runId, subjectRef) {
    const rows = this.database.prepare("SELECT envelope_json FROM events WHERE correlation_id = ? AND event_type = 'decision.recorded' ORDER BY sequence DESC").all(runId);
    for (const row of rows) {
      const event = JSON.parse(row.envelope_json);
      if (event.payload.decisionType === "artifact_approve" && event.payload.subjectRef === subjectRef) return event;
    }
    return undefined;
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
      steps: select("steps", "run_id, step_id"),
      capabilities: select("capabilities", "workspace_id, capability_id, revision"),
      permissionReceipts: select("permission_receipts", "receipt_id"),
      capabilityLeases: select("capability_leases", "lease_id"),
      toolCalls: select("tool_calls", "call_id"),
      bridgeClients: select("bridge_clients", "client_id"),
      memories: select("memories", "memory_id"),
      memoryRetrievals: select("memory_retrievals", "retrieval_id"),
      skillPackages: select("skill_packages", "workspace_id, skill_id, revision"),
      toolPackages: select("tool_packages", "workspace_id, tool_package_id, revision")
    };
  }

  rebuildProjections() {
    const events = this.eventEnvelopes();
    const checkpoints = this.database.prepare("SELECT * FROM checkpoints ORDER BY event_sequence").all();
    this.transaction(() => {
      this.database.exec("DELETE FROM skill_packages; DELETE FROM tool_packages; DELETE FROM memory_retrievals; DELETE FROM memories; DELETE FROM tool_calls; DELETE FROM capability_leases; DELETE FROM permission_receipts; DELETE FROM capabilities; DELETE FROM bridge_clients; DELETE FROM steps; DELETE FROM runs; DELETE FROM artifacts; DELETE FROM projects; DELETE FROM workspaces;");
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
