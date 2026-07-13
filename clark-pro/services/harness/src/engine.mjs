import { EventEmitter } from "node:events";
import fs from "node:fs";
import path from "node:path";
import { AssetStore } from "./asset-store.mjs";
import { canonicalJson, sha256 } from "./canonical.mjs";
import { evaluateCapabilityLease } from "./capability-policy.mjs";
import { approvalIdForRun, EventStore } from "./event-store.mjs";
import { compileIdeaRun, deriveRunIds, ideaInspectorManifest, structureIdea } from "./idea-compiler.mjs";
import { bundledMcpSourceHash, BundledIdeaMcpAdapter } from "./mcp-capability-adapter.mjs";
import { contractValidator } from "./protocol.mjs";

const LOOP_REVISION = Object.freeze({ id: "clark.loop.idea-to-approved-text", revision: "1.1.0" });

export class HarnessError extends Error {
  constructor(code, message, retryable = false) {
    super(message);
    this.name = "HarnessError";
    this.code = code;
    this.retryable = retryable;
  }
}

export class HarnessEngine extends EventEmitter {
  constructor({ dataDirectory, now = () => new Date().toISOString(), idFactory, stepDelayMs = 0, runtimeExecutable = process.execPath, mcpAdapter, capabilityPolicy = evaluateCapabilityLease } = {}) {
    super();
    if (!dataDirectory || !path.isAbsolute(dataDirectory)) throw new TypeError("Harness dataDirectory must be an absolute path");
    this.dataDirectory = dataDirectory;
    this.now = now;
    this.stepDelayMs = Math.max(0, Math.min(Number(stepDelayMs) || 0, 10_000));
    fs.mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
    this.assets = new AssetStore(path.join(dataDirectory, "assets", "objects"));
    this.store = new EventStore(path.join(dataDirectory, "clark.db"), { now, idFactory });
    this.mcpAdapter = mcpAdapter ?? new BundledIdeaMcpAdapter({ runtimeExecutable, workingDirectory: path.join(dataDirectory, "runtime", "mcp", "idea-inspector") });
    this.capabilityPolicy = capabilityPolicy;
    this.recoveredRuns = 0;
    this.state = "recovering";
  }

  async initialize() {
    if (!this.store.verifyHashChain()) throw new HarnessError("internal", "Harness event integrity verification failed; canonical state was not opened");
    this.store.rebuildProjections();
    this.revokeOrphanedAuthority();
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
      case "capability.list": return this.listCapabilities(payload.workspaceId);
      default: throw new HarnessError("invalid_request", `Unsupported Harness method ${method}`);
    }
  }

  ensureWorkspace({ workspaceId, name }, context = {}) {
    const existing = this.store.getWorkspace(workspaceId);
    if (!existing) {
      this.store.transaction(() => {
        this.store.appendEvent({
          eventType: "workspace.created", aggregateType: "workspace", aggregateId: workspaceId, workspaceId,
          commandId: context.requestId, sensitivity: "workspace", actor: { type: "studio", id: "studio.local" }, source: "studio",
          payload: { workspaceId, name, localCanonical: true, createdFrom: "new", backupLocationConfigured: false }
        });
      });
    }
    this.ensureBundledCapability(workspaceId, context);
    const workspace = this.store.getWorkspace(workspaceId);
    return { workspaceId, created: !existing, aggregateVersion: Number(workspace.aggregate_version) };
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
    const commandSource = context.source ?? "studio";
    const projectActor = context.actor ?? { type: "studio", id: "studio.local" };
    const captureActor = context.actor ?? { type: "creator", id: "creator.local" };
    const eventMetadata = context.clientId ? { clientId: context.clientId } : undefined;
    this.store.transaction(() => {
      this.store.beginCommand({ idempotencyKey, method: "loop.start", requestHash, subjectId: ids.runId });
      if (!project) {
        this.store.appendEvent({
          eventType: "project.created", aggregateType: "project", aggregateId: projectId,
          workspaceId, projectId, commandId: context.requestId, correlationId: ids.runId,
          actor: projectActor, source: commandSource, metadata: eventMetadata, sensitivity: "workspace",
          payload: { projectId, name: "Idea Lab", kind: "custom", description: "Durable local idea-structuring and review runs." }
        });
      }
      this.store.appendEvent({
        eventType: "source.captured", aggregateType: "artifact", aggregateId: ids.ideaArtifactId,
        workspaceId, projectId, commandId: context.requestId, correlationId: ids.runId, idempotencyKey,
        actor: captureActor, source: commandSource, metadata: eventMetadata, sensitivity: "workspace",
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
    let inspect = this.store.getStep(runId, "step.inspect");
    if (inspect.state !== "completed") {
      const completed = await this.inspectIdea(row, plan, inspect);
      if (!completed) return this.getRun(runId);
      row = this.store.getRunRow(runId);
    }

    structure = this.store.getStep(runId, "step.structure");
    if (structure.state !== "completed") {
      this.store.transaction(() => {
        this.store.appendEvent(stepEvent(row, "step.started", "step.structure", structure.state, "running", structure.attempt + 1));
      });
      if (this.stepDelayMs) await new Promise((resolve) => setTimeout(resolve, this.stepDelayMs));
      row = this.store.getRunRow(runId);
      const idea = this.assetSummary(row.idea_artifact_id, row.idea_version_id);
      const analysisAsset = this.assetSummary(row.analysis_artifact_id, row.analysis_version_id);
      const analysis = JSON.parse(analysisAsset.text);
      contractValidator.validateRef("https://schemas.clark.pro/v1/capability-runtime.schema.json#/$defs/ideaAnalysisResult", analysis);
      const draftText = structureIdea(idea.text, analysis);
      const draftAsset = this.assets.writeText(draftText);
      structure = this.store.getStep(runId, "step.structure");
      this.store.transaction(() => {
        this.store.appendEvent({
          eventType: "artifact.version_created", aggregateType: "artifact", aggregateId: ids.draftArtifactId,
          workspaceId: row.workspace_id, projectId: row.project_id, correlationId: runId,
          payload: {
            artifact: { artifactId: ids.draftArtifactId, versionId: ids.draftVersionId, contentHash: draftAsset.contentHash },
            artifactType: "brief", assetHash: draftAsset.contentHash,
            inputRefs: [
              { artifactId: ids.ideaArtifactId, versionId: ids.ideaVersionId },
              { artifactId: ids.analysisArtifactId, versionId: ids.analysisVersionId }
            ],
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
          analysis: { artifactId: ids.analysisArtifactId, versionId: ids.analysisVersionId },
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
      ...(row.analysis_artifact_id ? { analysis: this.assetSummary(row.analysis_artifact_id, row.analysis_version_id) } : {}),
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

  ensureBundledCapability(workspaceId, context = {}) {
    if (ideaInspectorManifest.publisher.sourceHash !== bundledMcpSourceHash()) {
      throw new HarnessError("conflict", "Bundled MCP source no longer matches its pinned capability manifest");
    }
    const existing = this.store.getCapability(workspaceId, ideaInspectorManifest.id, ideaInspectorManifest.version);
    const manifestHash = sha256(canonicalJson(ideaInspectorManifest));
    if (existing) {
      if (existing.manifest_hash !== manifestHash) throw new HarnessError("conflict", "Pinned bundled capability manifest changed without a revision");
      return existing;
    }
    this.store.transaction(() => this.store.appendEvent({
      eventType: "capability.revision_registered", aggregateType: "capability", aggregateId: ideaInspectorManifest.id,
      workspaceId, commandId: context.requestId, sensitivity: "workspace",
      payload: {
        capabilityRevision: { id: ideaInspectorManifest.id, revision: ideaInspectorManifest.version },
        manifestHash, manifest: ideaInspectorManifest, from: "unregistered", to: "registered",
        limitations: ideaInspectorManifest.limitations.map((limitation) => limitation.description)
      }
    }));
    return this.store.getCapability(workspaceId, ideaInspectorManifest.id, ideaInspectorManifest.version);
  }

  listCapabilities(workspaceId) {
    if (!this.store.getWorkspace(workspaceId)) throw new HarnessError("not_found", "Workspace does not exist");
    return {
      capabilities: this.store.listCapabilities(workspaceId).map((row) => ({
        id: row.manifest.id,
        version: row.manifest.version,
        name: row.manifest.name,
        state: row.state,
        transport: row.transport,
        actionClass: row.action_class,
        networkDomains: row.manifest.permissions.networkDomains,
        credentialScopes: row.manifest.permissions.credentialScopes,
        limitations: row.manifest.limitations.map((limitation) => limitation.description)
      }))
    };
  }

  registerBridgeClient({ workspaceId, clientId, displayName, actionClasses, expiresAt }) {
    if (!this.store.getWorkspace(workspaceId)) throw new HarnessError("not_found", "Workspace does not exist");
    if (Date.parse(expiresAt) <= Date.now()) throw new HarnessError("invalid_request", "Bridge client expiry must be in the future");
    const existing = this.store.getBridgeClient(clientId);
    if (existing?.state === "active") return existing;
    this.store.transaction(() => this.store.appendEvent({
      eventType: "bridge.client_registered", aggregateType: "bridge_client", aggregateId: clientId,
      workspaceId, actor: { type: "system", id: "system.bridge" }, source: "system", sensitivity: "secret_reference",
      payload: { clientId, displayName, from: "unpaired", to: "active", workspaceScopes: [workspaceId], actionClasses, expiresAt }
    }));
    return this.store.getBridgeClient(clientId);
  }

  revokeBridgeClient(clientId) {
    const client = this.store.getBridgeClient(clientId);
    if (!client || client.state !== "active") return false;
    this.store.transaction(() => this.store.appendEvent({
      eventType: "bridge.client_revoked", aggregateType: "bridge_client", aggregateId: clientId,
      workspaceId: client.workspace_id, actor: { type: "system", id: "system.bridge" }, source: "system", sensitivity: "secret_reference",
      payload: {
        clientId, displayName: client.display_name, from: "active", to: "revoked",
        workspaceScopes: [client.workspace_id], actionClasses: JSON.parse(client.action_classes_json), expiresAt: client.expires_at
      }
    }));
    return true;
  }

  async inspectIdea(row, plan, currentStep) {
    const attempt = currentStep.attempt + 1;
    this.store.transaction(() => this.store.appendEvent(stepEvent(row, "step.started", "step.inspect", currentStep.state, "running", attempt)));
    const currentRun = this.runSummary(this.store.getRunRow(row.run_id));
    let receipt;
    let lease;
    try {
      ({ receipt, lease } = this.capabilityPolicy({ manifest: ideaInspectorManifest, plan, run: currentRun, stepId: "step.inspect", attempt, now: this.now() }));
    } catch (error) {
      if (!error?.receipt) throw error;
      this.store.transaction(() => {
        this.store.appendEvent(capabilityPermissionEvent(row, error.receipt));
        this.store.appendEvent(stepEvent(row, "step.failed", "step.inspect", "running", "failed", attempt));
        this.store.appendEvent({
          eventType: "run.failed", aggregateType: "run", aggregateId: row.run_id,
          workspaceId: row.workspace_id, projectId: row.project_id, correlationId: row.run_id,
          payload: { runId: row.run_id, from: row.state === "recovering" ? "recovering" : "running", to: "failed", reason: "Capability policy denied the bundled MCP inspection." }
        });
      });
      this.emit("run.updated", { runId: row.run_id, state: "failed" });
      return false;
    }
    const suffix = `${row.run_id.slice("run.idea.".length)}.inspect.a${attempt}`;
    const callId = `call.${suffix}`;
    const input = { schemaVersion: 1, ideaText: currentRun.idea.text };
    const inputHash = sha256(canonicalJson(input));
    this.store.transaction(() => {
      this.store.appendEvent(capabilityPermissionEvent(row, receipt));
      this.store.appendEvent(capabilityLeaseEvent(row, "capability.lease_issued", receipt, lease, "none", "active", "Policy intersection allowed one bounded MCP call."));
      this.store.appendEvent({
        eventType: "tool.call_requested", aggregateType: "run", aggregateId: row.run_id,
        workspaceId: row.workspace_id, projectId: row.project_id, correlationId: row.run_id,
        payload: {
          callId, runId: row.run_id, stepId: "step.inspect",
          capabilityRevision: lease.capabilityRevision, actionClass: "local_transform", inputHash,
          permissionReceiptId: receipt.receiptId, leaseId: lease.leaseId,
          quotedCost: { currency: "USD", micros: 0 }, egressSensitivity: "confidential"
        }
      });
    });

    const startedAt = this.now();
    const startedClock = Date.now();
    try {
      const execution = await this.mcpAdapter.analyze(input, { timeoutMs: ideaInspectorManifest.reliability.timeoutSeconds * 1_000 });
      const completedAt = this.now();
      const durationMs = Math.max(0, Date.now() - startedClock);
      const analysisText = canonicalJson(execution.result);
      const analysisAsset = this.assets.writeText(analysisText);
      const ids = deriveRunIdsFromRow(row);
      const invocationReceipt = {
        schemaVersion: 1, kind: "invocation_receipt", callId, leaseId: lease.leaseId, permissionReceiptId: receipt.receiptId,
        workspaceId: row.workspace_id, projectId: row.project_id, runId: row.run_id, stepId: "step.inspect",
        capabilityRevision: lease.capabilityRevision, transport: "mcp_stdio", serverRef: ideaInspectorManifest.transport.serverRef,
        toolName: ideaInspectorManifest.transport.toolName, inputHash, status: "succeeded",
        resultRef: ids.analysisArtifactId, resultHash: analysisAsset.contentHash, durationMs,
        cost: { currency: "USD", micros: 0 }, errorClass: "none", startedAt, completedAt
      };
      contractValidator.validateCapabilityRuntime(invocationReceipt);
      const capability = this.store.getCapability(row.workspace_id, ideaInspectorManifest.id, ideaInspectorManifest.version);
      this.store.transaction(() => {
        this.store.appendEvent({
          eventType: "tool.call_completed", aggregateType: "run", aggregateId: row.run_id,
          workspaceId: row.workspace_id, projectId: row.project_id, correlationId: row.run_id,
          payload: { callId, status: "succeeded", resultRef: ids.analysisArtifactId, resultHash: analysisAsset.contentHash, durationMs, cost: { currency: "USD", micros: 0 }, errorClass: "none", invocationReceipt }
        });
        this.store.appendEvent({
          eventType: "artifact.version_created", aggregateType: "artifact", aggregateId: ids.analysisArtifactId,
          workspaceId: row.workspace_id, projectId: row.project_id, correlationId: row.run_id,
          payload: {
            artifact: { artifactId: ids.analysisArtifactId, versionId: ids.analysisVersionId, contentHash: analysisAsset.contentHash },
            artifactType: "outcome_report", assetHash: analysisAsset.contentHash,
            inputRefs: [{ artifactId: ids.ideaArtifactId, versionId: ids.ideaVersionId }],
            provenance: { runId: row.run_id, stepId: "step.inspect", capabilityRevision: lease.capabilityRevision },
            cost: { currency: "USD", micros: 0 }, sensitivity: "confidential"
          }
        });
        this.store.appendEvent(stepEvent(row, "step.completed", "step.inspect", "running", "completed", attempt));
        this.store.appendEvent(capabilityLeaseEvent(row, "capability.lease_revoked", receipt, lease, "active", "revoked", "The bounded MCP call reached a terminal result."));
        if (capability.state !== "healthy") {
          this.store.appendEvent({
            eventType: "capability.health_changed", aggregateType: "capability", aggregateId: ideaInspectorManifest.id,
            workspaceId: row.workspace_id,
            payload: {
              capabilityRevision: lease.capabilityRevision, manifestHash: capability.manifest_hash,
              from: capability.state, to: "healthy", limitations: ideaInspectorManifest.limitations.map((limitation) => limitation.description),
              reason: `SDK discovery, exact schema match, environment profile, and ${execution.server?.name ?? "MCP server"} call passed.`
            }
          });
        }
      });
      return true;
    } catch (error) {
      const completedAt = this.now();
      const durationMs = Math.max(0, Date.now() - startedClock);
      const errorClass = ["validation", "auth", "rate_limit", "transient", "permanent", "policy", "ambiguous_external_state"].includes(error?.errorClass) ? error.errorClass : "permanent";
      const invocationReceipt = {
        schemaVersion: 1, kind: "invocation_receipt", callId, leaseId: lease.leaseId, permissionReceiptId: receipt.receiptId,
        workspaceId: row.workspace_id, projectId: row.project_id, runId: row.run_id, stepId: "step.inspect",
        capabilityRevision: lease.capabilityRevision, transport: "mcp_stdio", serverRef: ideaInspectorManifest.transport.serverRef,
        toolName: ideaInspectorManifest.transport.toolName, inputHash, status: "failed", durationMs,
        cost: { currency: "USD", micros: 0 }, errorClass, startedAt, completedAt
      };
      contractValidator.validateCapabilityRuntime(invocationReceipt);
      this.store.transaction(() => {
        this.store.appendEvent({
          eventType: "tool.call_completed", aggregateType: "run", aggregateId: row.run_id,
          workspaceId: row.workspace_id, projectId: row.project_id, correlationId: row.run_id,
          payload: { callId, status: "failed", durationMs, cost: { currency: "USD", micros: 0 }, errorClass, invocationReceipt }
        });
        this.store.appendEvent(capabilityLeaseEvent(row, "capability.lease_revoked", receipt, lease, "active", "revoked", `MCP call failed with ${errorClass}.`));
        this.store.appendEvent(stepEvent(row, "step.failed", "step.inspect", "running", "failed", attempt));
        this.store.appendEvent({
          eventType: "run.failed", aggregateType: "run", aggregateId: row.run_id,
          workspaceId: row.workspace_id, projectId: row.project_id, correlationId: row.run_id,
          payload: { runId: row.run_id, from: row.state === "recovering" ? "recovering" : "running", to: "failed", reason: `Bundled MCP inspection failed safely: ${errorClass}.` }
        });
      });
      this.emit("run.updated", { runId: row.run_id, state: "failed" });
      return false;
    }
  }

  revokeOrphanedAuthority() {
    for (const leaseRow of this.store.activeCapabilityLeases()) {
      const receipt = this.store.getPermissionReceipt(leaseRow.permission_receipt_id);
      const run = this.store.getRunRow(leaseRow.run_id);
      const capability = this.store.getCapability(leaseRow.workspace_id, leaseRow.capability_id, leaseRow.revision);
      if (!receipt || !run || !capability) throw new HarnessError("internal", `Orphaned capability authority is missing canonical context: ${leaseRow.lease_id}`);
      const lease = {
        schemaVersion: 1, kind: "capability_lease", leaseId: leaseRow.lease_id, permissionReceiptId: leaseRow.permission_receipt_id,
        workspaceId: leaseRow.workspace_id, projectId: run.project_id, runId: leaseRow.run_id, stepId: leaseRow.step_id,
        capabilityRevision: { id: leaseRow.capability_id, revision: leaseRow.revision }, state: "active",
        effective: JSON.parse(leaseRow.effective_json), issuedAt: leaseRow.issued_at, expiresAt: leaseRow.expires_at
      };
      const pendingCalls = this.store.requestedToolCallsForLease(leaseRow.lease_id);
      this.store.transaction(() => {
        for (const call of pendingCalls) {
          const completedAt = this.now();
          const durationMs = Math.max(0, Date.parse(completedAt) - Date.parse(lease.issuedAt));
          const invocationReceipt = {
            schemaVersion: 1, kind: "invocation_receipt", callId: call.call_id, leaseId: lease.leaseId,
            permissionReceiptId: receipt.receiptId, workspaceId: run.workspace_id, projectId: run.project_id,
            runId: run.run_id, stepId: call.step_id, capabilityRevision: lease.capabilityRevision,
            transport: capability.transport, serverRef: capability.manifest.transport.serverRef,
            toolName: capability.manifest.transport.toolName, inputHash: call.input_hash, status: "cancelled", durationMs,
            cost: { currency: "USD", micros: 0 }, errorClass: "transient", startedAt: lease.issuedAt, completedAt
          };
          contractValidator.validateCapabilityRuntime(invocationReceipt);
          this.store.appendEvent({
            eventType: "tool.call_completed", aggregateType: "run", aggregateId: run.run_id,
            workspaceId: run.workspace_id, projectId: run.project_id, correlationId: run.run_id,
            payload: { callId: call.call_id, status: "cancelled", durationMs, cost: { currency: "USD", micros: 0 }, errorClass: "transient", invocationReceipt }
          });
        }
        this.store.appendEvent(capabilityLeaseEvent(run, "capability.lease_revoked", receipt, lease, "active", "revoked", "Harness restart revoked an orphaned process lease before recovery."));
      });
    }
    for (const client of this.store.activeBridgeClients()) {
      this.store.transaction(() => this.store.appendEvent({
        eventType: "bridge.client_revoked", aggregateType: "bridge_client", aggregateId: client.client_id,
        workspaceId: client.workspace_id, sensitivity: "secret_reference",
        payload: {
          clientId: client.client_id, displayName: client.display_name, from: "active", to: "revoked",
          workspaceScopes: [client.workspace_id], actionClasses: JSON.parse(client.action_classes_json), expiresAt: client.expires_at
        }
      }));
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
    analysisArtifactId: row.analysis_artifact_id ?? `artifact.analysis.${token}`,
    analysisVersionId: row.analysis_version_id ?? `version.analysis.${token}.v1`,
    draftArtifactId: row.draft_artifact_id ?? `artifact.brief.${token}`,
    draftVersionId: row.draft_version_id ?? `version.brief.${token}.v1`,
    approvalId: row.approval_id ?? approvalIdForRun(row.run_id),
    decisionId: `decision.brief.${token}.v1`,
    checkpointId: `checkpoint.brief.${token}.review`
  };
}

function capabilityLeaseEvent(row, eventType, receipt, lease, from, to, reason) {
  return {
    eventType, aggregateType: "capability", aggregateId: lease.capabilityRevision.id,
    workspaceId: row.workspace_id ?? row.workspaceId, projectId: row.project_id ?? row.projectId,
    correlationId: row.run_id ?? row.runId, sensitivity: "secret_reference",
    payload: {
      leaseId: lease.leaseId, permissionReceiptId: receipt.receiptId, permissionReceipt: receipt,
      capabilityRevision: lease.capabilityRevision, runId: lease.runId, stepId: lease.stepId,
      from, to, issuedAt: lease.issuedAt, expiresAt: lease.expiresAt, effectiveAuthority: lease.effective, reason
    }
  };
}

function capabilityPermissionEvent(row, permissionReceipt) {
  return {
    eventType: "capability.permission_evaluated", aggregateType: "capability", aggregateId: permissionReceipt.capabilityRevision.id,
    workspaceId: row.workspace_id ?? row.workspaceId, projectId: row.project_id ?? row.projectId,
    correlationId: row.run_id ?? row.runId, sensitivity: "secret_reference",
    payload: { permissionReceipt }
  };
}

export function requestHash(method, payload) {
  return sha256(canonicalJson({ method, payload }));
}
