import { EventEmitter } from "node:events";
import fs from "node:fs";
import path from "node:path";
import { AssetStore } from "./asset-store.mjs";
import { canonicalJson, sha256 } from "./canonical.mjs";
import { approvalIdForRun, EventStore } from "./event-store.mjs";
import { compileIdeaRun, deriveRunIds, structureIdea } from "./idea-compiler.mjs";

const LOOP_REVISION = Object.freeze({ id: "clark.loop.idea-to-approved-text", revision: "1.0.0" });

export class HarnessError extends Error {
  constructor(code, message, retryable = false) {
    super(message);
    this.name = "HarnessError";
    this.code = code;
    this.retryable = retryable;
  }
}

export class HarnessEngine extends EventEmitter {
  constructor({ dataDirectory, now = () => new Date().toISOString(), idFactory, stepDelayMs = 0 } = {}) {
    super();
    if (!dataDirectory || !path.isAbsolute(dataDirectory)) throw new TypeError("Harness dataDirectory must be an absolute path");
    this.dataDirectory = dataDirectory;
    this.now = now;
    this.stepDelayMs = Math.max(0, Math.min(Number(stepDelayMs) || 0, 10_000));
    fs.mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
    this.assets = new AssetStore(path.join(dataDirectory, "assets", "objects"));
    this.store = new EventStore(path.join(dataDirectory, "clark.db"), { now, idFactory });
    this.recoveredRuns = 0;
    this.state = "recovering";
  }

  async initialize() {
    if (!this.store.verifyHashChain()) throw new HarnessError("internal", "Harness event integrity verification failed; canonical state was not opened");
    this.store.rebuildProjections();
    const interrupted = this.store.interruptedRunRows();
    for (const row of interrupted) {
      const checkpoint = this.store.latestCheckpoint(row.run_id);
      this.store.transaction(() => {
        this.store.appendEvent({
          eventType: "run.recovered", aggregateType: "run", aggregateId: row.run_id,
          workspaceId: row.workspace_id, projectId: row.project_id, correlationId: row.run_id,
          payload: {
            runId: row.run_id,
            from: row.state,
            to: "recovering",
            reason: checkpoint ? "Restoring the latest durable checkpoint." : "Resuming deterministic local work from the event projection.",
            ...(checkpoint ? { recoveryCheckpointId: checkpoint.checkpoint_id } : {})
          }
        });
      });
      await this.advanceRun(row.run_id, { recovery: true, recoveryCheckpoint: Boolean(checkpoint) });
      this.recoveredRuns += 1;
    }
    this.state = "ready";
    return this.status();
  }

  close() {
    this.store.close();
  }

  status() {
    return {
      state: this.state,
      protocolVersion: 1,
      database: { journalMode: this.store.journalMode, eventCount: this.store.countEvents() },
      activeRuns: this.store.database.prepare("SELECT COUNT(*) AS count FROM runs WHERE state NOT IN ('completed', 'failed', 'cancelled')").get().count,
      recoveredRuns: this.recoveredRuns
    };
  }

  async handle(method, payload, context = {}) {
    switch (method) {
      case "harness.status": return this.status();
      case "workspace.ensure": return this.ensureWorkspace(payload, context);
      case "loop.start": return this.startIdeaLoop(payload, context);
      case "run.get": return this.getRunInWorkspace(payload.workspaceId, payload.runId);
      case "run.list": return { runs: this.store.listRunRows(payload.workspaceId, payload.limit).map((row) => this.runSummary(row)) };
      case "approval.resolve": return this.resolveApproval(payload, context);
      default: throw new HarnessError("invalid_request", `Unsupported Harness method ${method}`);
    }
  }

  ensureWorkspace({ workspaceId, name }, context = {}) {
    const existing = this.store.getWorkspace(workspaceId);
    if (existing) return { workspaceId, created: false, aggregateVersion: Number(existing.aggregate_version) };
    this.store.transaction(() => {
      this.store.appendEvent({
        eventType: "workspace.created", aggregateType: "workspace", aggregateId: workspaceId, workspaceId,
        commandId: context.requestId, sensitivity: "workspace", actor: { type: "studio", id: "studio.local" }, source: "studio",
        payload: { workspaceId, name, localCanonical: true, createdFrom: "new", backupLocationConfigured: false }
      });
    });
    return { workspaceId, created: true, aggregateVersion: 1 };
  }

  async startIdeaLoop(payload, context = {}) {
    const { workspaceId, projectId, ideaText, idempotencyKey } = payload;
    if (!this.store.getWorkspace(workspaceId)) throw new HarnessError("not_found", "Workspace does not exist");
    const requestHash = sha256({ method: "loop.start", workspaceId, projectId, ideaText });
    const ids = deriveRunIds(idempotencyKey);
    const existingCommand = this.store.getCommand(idempotencyKey);
    if (existingCommand) {
      this.assertIdempotentMatch(existingCommand, "loop.start", requestHash);
      if (!existingCommand.response) {
        await this.advanceRun(existingCommand.subject_id, { recovery: true });
        const recoveredResult = { run: this.getRun(existingCommand.subject_id), deduplicated: true };
        this.store.completeCommand(idempotencyKey, recoveredResult);
        return recoveredResult;
      }
      return { run: this.getRun(existingCommand.subject_id), deduplicated: true };
    }

    const project = this.store.getProject(projectId);
    if (project && project.workspace_id !== workspaceId) throw new HarnessError("conflict", "Project belongs to a different workspace");
    const captured = this.assets.writeText(ideaText);
    const compiledAt = this.now();
    const plan = compileIdeaRun({ ...ids, workspaceId, projectId, compiledAt });
    this.store.transaction(() => {
      this.store.beginCommand({ idempotencyKey, method: "loop.start", requestHash, subjectId: ids.runId });
      if (!project) {
        this.store.appendEvent({
          eventType: "project.created", aggregateType: "project", aggregateId: projectId,
          workspaceId, projectId, commandId: context.requestId, correlationId: ids.runId,
          actor: { type: "studio", id: "studio.local" }, source: "studio", sensitivity: "workspace",
          payload: { projectId, name: "Idea Lab", kind: "custom", description: "Durable local idea-structuring and review runs." }
        });
      }
      this.store.appendEvent({
        eventType: "source.captured", aggregateType: "artifact", aggregateId: ids.ideaArtifactId,
        workspaceId, projectId, commandId: context.requestId, correlationId: ids.runId, idempotencyKey,
        actor: { type: "creator", id: "creator.local" }, source: "studio", sensitivity: "workspace",
        payload: {
          artifact: { artifactId: ids.ideaArtifactId, versionId: ids.ideaVersionId, contentHash: captured.contentHash },
          captureKind: "text", originalHash: captured.contentHash, sensitivity: "workspace", classificationStatus: "confirmed"
        }
      });
      this.store.appendEvent({
        eventType: "run.planned", aggregateType: "run", aggregateId: ids.runId,
        workspaceId, projectId, commandId: context.requestId, correlationId: ids.runId, idempotencyKey,
        payload: {
          runId: ids.runId,
          loopRevision: plan.compiledFrom.loopRevision,
          planHash: plan.planHash,
          plan,
          inputRefs: plan.inputs,
          quotedCost: plan.quote.maximum,
          budgetCeiling: plan.budget.ceiling,
          stepCount: plan.steps.length,
          humanGateCount: plan.humanGates.length,
          warnings: []
        }
      });
      this.store.ensurePlanSteps(ids.runId, plan);
      this.store.appendEvent({
        eventType: "run.started", aggregateType: "run", aggregateId: ids.runId,
        workspaceId, projectId, commandId: context.requestId, correlationId: ids.runId,
        payload: { runId: ids.runId, from: "planned", to: "running" }
      });
    });
    this.emit("run.updated", { runId: ids.runId, state: "running" });
    await this.advanceRun(ids.runId);
    const result = { run: this.getRun(ids.runId), deduplicated: false };
    this.store.completeCommand(idempotencyKey, result);
    return result;
  }

  async advanceRun(runId, { recovery = false, recoveryCheckpoint = false } = {}) {
    let row = this.store.getRunRow(runId);
    if (!row) throw new HarnessError("not_found", `Run ${runId} does not exist`);
    if (["waiting_approval", "completed", "failed", "cancelled"].includes(row.state)) return this.runSummary(row);
    const ids = deriveRunIdsFromRow(row);
    const plan = this.store.getRunPlan(runId);
    this.store.transaction(() => this.store.ensurePlanSteps(runId, plan));

    let capture = this.store.getStep(runId, "step.capture");
    if (capture.state !== "completed") {
      this.store.transaction(() => {
        this.store.appendEvent(stepEvent(row, "step.started", "step.capture", capture.state, "running", capture.attempt + 1));
        this.store.appendEvent(stepEvent(row, "step.completed", "step.capture", "running", "completed", capture.attempt + 1));
      });
    }

    let structure = this.store.getStep(runId, "step.structure");
    if (structure.state !== "completed") {
      this.store.transaction(() => {
        this.store.appendEvent(stepEvent(row, "step.started", "step.structure", structure.state, "running", structure.attempt + 1));
      });
      if (this.stepDelayMs) await new Promise((resolve) => setTimeout(resolve, this.stepDelayMs));
      row = this.store.getRunRow(runId);
      const idea = this.assetSummary(row.idea_artifact_id, row.idea_version_id);
      const draftText = structureIdea(idea.text);
      const draftAsset = this.assets.writeText(draftText);
      structure = this.store.getStep(runId, "step.structure");
      this.store.transaction(() => {
        this.store.appendEvent({
          eventType: "artifact.version_created", aggregateType: "artifact", aggregateId: ids.draftArtifactId,
          workspaceId: row.workspace_id, projectId: row.project_id, correlationId: runId,
          payload: {
            artifact: { artifactId: ids.draftArtifactId, versionId: ids.draftVersionId, contentHash: draftAsset.contentHash },
            artifactType: "brief", assetHash: draftAsset.contentHash,
            inputRefs: [{ artifactId: ids.ideaArtifactId, versionId: ids.ideaVersionId }],
            provenance: { runId, stepId: "step.structure", capabilityRevision: { id: "clark.idea.structure.local", revision: "1.0.0" } },
            cost: { currency: "USD", micros: 0 }, sensitivity: "workspace"
          }
        });
        this.store.appendEvent(stepEvent(row, "step.completed", "step.structure", "running", "completed", structure.attempt));
        this.store.appendEvent(stepEvent(row, "step.waiting_for_approval", "step.review", "pending", "waiting_approval"));
        this.store.appendEvent({
          eventType: "run.paused", aggregateType: "run", aggregateId: runId,
          workspaceId: row.workspace_id, projectId: row.project_id, correlationId: runId,
          payload: { runId, from: recovery ? "recovering" : "running", to: "waiting_approval", reason: "The exact brief version requires creator approval." }
        });
        this.store.createCheckpoint(ids.checkpointId, runId, {
          schemaVersion: 1, state: "waiting_approval", activeStepId: "step.review",
          idea: { artifactId: ids.ideaArtifactId, versionId: ids.ideaVersionId },
          draft: { artifactId: ids.draftArtifactId, versionId: ids.draftVersionId },
          approvalId: ids.approvalId
        });
        if (recoveryCheckpoint) this.store.setRecoveredFromCheckpoint(runId, true);
      });
      this.emit("run.updated", { runId, state: "waiting_approval" });
      this.emit("approval.required", { runId, approvalId: ids.approvalId, subjectRef: ids.draftArtifactId });
    }
    return this.getRun(runId);
  }

  resolveApproval(payload, context = {}) {
    const { runId, workspaceId, approvalId, decision, reason, idempotencyKey } = payload;
    const row = this.store.getRunRow(runId);
    if (!row || row.workspace_id !== workspaceId) throw new HarnessError("not_found", "Run does not exist in this workspace");
    if (row.approval_id !== approvalId) throw new HarnessError("conflict", "Approval does not match the active exact-version gate");
    const requestHash = sha256({ method: "approval.resolve", runId, approvalId, decision, reason: reason ?? "" });
    const existing = this.store.getCommand(idempotencyKey);
    if (existing) {
      this.assertIdempotentMatch(existing, "approval.resolve", requestHash);
      if (existing.response) return existing.response;
      const reconstructed = this.getRun(runId);
      this.store.completeCommand(idempotencyKey, reconstructed);
      return reconstructed;
    }
    if (row.state !== "waiting_approval") throw new HarnessError("conflict", `Run is ${row.state}, not waiting for approval`);
    const ids = deriveRunIdsFromRow(row);
    this.store.transaction(() => {
      this.store.beginCommand({ idempotencyKey, method: "approval.resolve", requestHash, subjectId: runId });
      if (decision === "approve") {
        this.store.appendEvent({
          eventType: "approval.granted", aggregateType: "decision", aggregateId: approvalId,
          workspaceId, projectId: row.project_id, commandId: context.requestId, correlationId: runId, idempotencyKey,
          actor: { type: "creator", id: "creator.local" }, source: "studio", sensitivity: "personal",
          payload: {
            approvalId, subjectRef: ids.draftArtifactId,
            artifact: { artifactId: ids.draftArtifactId, versionId: ids.draftVersionId },
            actionClass: "artifact_approve", status: "granted", policyRevisionId: "policy.creator-default", reason: reason ?? "Creator approved the exact brief version."
          }
        });
      }
      this.store.appendEvent({
        eventType: "decision.recorded", aggregateType: "decision", aggregateId: ids.decisionId,
        workspaceId, projectId: row.project_id, commandId: context.requestId, correlationId: runId, idempotencyKey,
        actor: { type: "creator", id: "creator.local" }, source: "studio", sensitivity: "personal",
        payload: {
          decisionId: ids.decisionId, decisionType: "artifact_approve", subjectRef: ids.draftArtifactId,
          selectedOption: decision, alternatives: decision === "approve" ? ["reject"] : ["approve"],
          evidenceRefs: [{ type: "artifact", refId: ids.draftArtifactId, versionId: ids.draftVersionId }],
          reason: reason ?? (decision === "approve" ? "Approved exact brief version." : "Rejected exact brief version."), reversible: true
        }
      });
      if (decision === "approve") {
        this.store.appendEvent(stepEvent(row, "step.started", "step.review", "waiting_approval", "running", 1));
        this.store.appendEvent(stepEvent(row, "step.completed", "step.review", "running", "completed", 1));
        this.store.appendEvent({
          eventType: "run.completed", aggregateType: "run", aggregateId: runId,
          workspaceId, projectId: row.project_id, correlationId: runId,
          payload: { runId, from: "waiting_approval", to: "completed", reason: "The exact brief version was approved." }
        });
      } else {
        this.store.appendEvent(stepEvent(row, "step.cancelled", "step.review", "waiting_approval", "cancelled"));
        this.store.appendEvent({
          eventType: "run.failed", aggregateType: "run", aggregateId: runId,
          workspaceId, projectId: row.project_id, correlationId: runId,
          payload: { runId, from: "waiting_approval", to: "failed", reason: "Creator rejected the brief version; revision is required." }
        });
      }
    });
    const result = this.getRun(runId);
    this.store.completeCommand(idempotencyKey, result);
    this.emit("run.updated", { runId, state: result.state });
    return result;
  }

  getRun(runId) {
    const row = this.store.getRunRow(runId);
    if (!row) throw new HarnessError("not_found", `Run ${runId} does not exist`);
    return this.runSummary(row);
  }

  getRunInWorkspace(workspaceId, runId) {
    const row = this.store.getRunRow(runId);
    if (!row || row.workspace_id !== workspaceId) throw new HarnessError("not_found", "Run does not exist in this workspace");
    return this.runSummary(row);
  }

  runSummary(row) {
    const summary = {
      runId: row.run_id,
      workspaceId: row.workspace_id,
      projectId: row.project_id,
      loopRevision: { id: row.loop_id, revision: row.loop_revision },
      state: row.state,
      activeStepId: row.active_step_id ?? null,
      idea: this.assetSummary(row.idea_artifact_id, row.idea_version_id),
      ...(row.draft_artifact_id ? { draft: this.assetSummary(row.draft_artifact_id, row.draft_version_id) } : {}),
      ...(row.approval_id ? { approval: { approvalId: row.approval_id, subjectRef: row.draft_artifact_id, state: row.approval_state, reason: "Approve or reject this exact content-addressed brief version." } } : {}),
      eventCount: this.store.countEventsForRun(row.run_id),
      recoveredFromCheckpoint: Boolean(row.recovered_from_checkpoint),
      updatedAt: row.updated_at
    };
    return summary;
  }

  assetSummary(artifactId, versionId) {
    const artifact = this.store.getArtifact(artifactId, versionId);
    if (!artifact) throw new HarnessError("internal", `Artifact projection missing ${artifactId}@${versionId}`);
    return { artifactId, versionId, contentHash: artifact.content_hash, text: this.assets.readText(artifact.content_hash) };
  }

  assertIdempotentMatch(existing, method, requestHash) {
    if (existing.method !== method || existing.request_hash !== requestHash) {
      throw new HarnessError("conflict", "Idempotency key was already used for different command content");
    }
  }
}

function stepEvent(row, eventType, stepId, from, to, attempt) {
  return {
    eventType, aggregateType: "run", aggregateId: row.run_id,
    workspaceId: row.workspace_id, projectId: row.project_id, correlationId: row.run_id,
    payload: { runId: row.run_id, stepId, from, to, ...(attempt ? { attempt } : {}) }
  };
}

function deriveRunIdsFromRow(row) {
  const token = row.run_id.slice("run.idea.".length);
  return {
    token,
    runId: row.run_id,
    planId: `plan.idea.${token}`,
    ideaArtifactId: row.idea_artifact_id,
    ideaVersionId: row.idea_version_id,
    draftArtifactId: row.draft_artifact_id ?? `artifact.brief.${token}`,
    draftVersionId: row.draft_version_id ?? `version.brief.${token}.v1`,
    approvalId: row.approval_id ?? approvalIdForRun(row.run_id),
    decisionId: `decision.brief.${token}.v1`,
    checkpointId: `checkpoint.brief.${token}.review`
  };
}

export function requestHash(method, payload) {
  return sha256(canonicalJson({ method, payload }));
}
