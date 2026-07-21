const { contextBridge, ipcRenderer } = require("electron");

const allowedSections = new Set(["focus", "canvas", "review", "writing", "memory", "connections"]);
const memoryLayers = new Set(["identity", "semantic", "episodic", "procedural", "performance"]);
const memorySensitivities = new Set(["public", "workspace", "personal", "confidential", "secret_reference"]);
const memoryPolicies = new Set(["default", "explicit_only", "never_send_to_model"]);
const memoryActions = new Set(["promote", "reject", "dispute", "forget"]);
const memoryDestinations = new Set(["creator_view", "local_model", "remote_model"]);
const skillActions = new Set(["promote", "rollback"]);
const toolPackageActions = new Set(["activate", "rollback"]);

const api = Object.freeze({
  version: "0.1.0",
  getShellState: () => ipcRenderer.invoke("desktop:get-shell-state"),
  setActiveSection: (section) => {
    if (!allowedSections.has(section)) return Promise.reject(new TypeError("Unknown section"));
    return ipcRenderer.invoke("desktop:set-active-section", section);
  },
  onNavigate: (listener) => {
    if (typeof listener !== "function") throw new TypeError("A listener function is required");
    const handler = (_event, section) => {
      if (allowedSections.has(section)) listener(section);
    };
    ipcRenderer.on("desktop:navigate", handler);
    return () => ipcRenderer.removeListener("desktop:navigate", handler);
  },
  onTrustCenter: (listener) => {
    if (typeof listener !== "function") throw new TypeError("A listener function is required");
    const handler = () => listener();
    ipcRenderer.on("desktop:show-trust-center", handler);
    return () => ipcRenderer.removeListener("desktop:show-trust-center", handler);
  },
  getHarnessState: () => ipcRenderer.invoke("desktop:get-harness-state"),
  getWritingState: () => ipcRenderer.invoke("desktop:get-writing-state"),
  createWritingDraft: () => ipcRenderer.invoke("desktop:create-writing-draft"),
  saveWritingDraft: (draft) => {
    const safe = draft && typeof draft === "object" ? { draftId: draft.draftId, title: draft.title, body: draft.body } : undefined;
    if (!safe || typeof safe.draftId !== "string" || typeof safe.title !== "string" || safe.title.length > 180 || typeof safe.body !== "string" || safe.body.length > 200000) {
      return Promise.reject(new TypeError("A valid writing draft is required"));
    }
    return ipcRenderer.invoke("desktop:save-writing-draft", safe);
  },
  connectObsidian: () => ipcRenderer.invoke("desktop:connect-obsidian"),
  exportWritingDraft: (draftId) => {
    if (typeof draftId !== "string") return Promise.reject(new TypeError("A writing draft is required"));
    return ipcRenderer.invoke("desktop:export-writing-draft", draftId);
  },
  startIdeaLoop: (ideaText) => {
    if (typeof ideaText !== "string" || ideaText.trim().length < 20 || ideaText.length > 12000) {
      return Promise.reject(new TypeError("Idea text must be between 20 and 12,000 characters"));
    }
    return ipcRenderer.invoke("desktop:start-idea-loop", ideaText);
  },
  reviseIdea: (revision) => {
    const safe = revision && typeof revision === "object" ? {
      parentRunId: revision.parentRunId,
      ideaText: revision.ideaText,
      revisionReason: revision.revisionReason
    } : undefined;
    if (!safe || typeof safe.parentRunId !== "string" || typeof safe.ideaText !== "string" || safe.ideaText.trim().length < 20 || safe.ideaText.length > 12000 || typeof safe.revisionReason !== "string" || safe.revisionReason.trim().length < 3 || safe.revisionReason.length > 1000) {
      return Promise.reject(new TypeError("A parent run, revised idea, and revision reason are required"));
    }
    return ipcRenderer.invoke("desktop:revise-idea", safe);
  },
  resolveIdeaApproval: (decision) => {
    const safe = decision && typeof decision === "object" ? {
      runId: decision.runId,
      approvalId: decision.approvalId,
      decision: decision.decision,
      reason: decision.reason
    } : undefined;
    if (!safe || typeof safe.runId !== "string" || typeof safe.approvalId !== "string" || !["approve", "reject"].includes(safe.decision) || typeof safe.reason !== "string" || safe.reason.trim().length < 3 || safe.reason.length > 1000) {
      return Promise.reject(new TypeError("A valid approval decision and reason are required"));
    }
    safe.reason = safe.reason.trim();
    return ipcRenderer.invoke("desktop:resolve-idea-approval", safe);
  },
  proposeMemoryFromRun: (proposal) => {
    const safe = proposal && typeof proposal === "object" ? {
      runId: proposal.runId,
      statement: proposal.statement,
      layer: proposal.layer,
      confidence: proposal.confidence,
      sensitivity: proposal.sensitivity,
      retrievalPolicy: proposal.retrievalPolicy
    } : undefined;
    if (!safe || typeof safe.runId !== "string" || typeof safe.statement !== "string" || safe.statement.trim().length < 3 || safe.statement.length > 4000 || !memoryLayers.has(safe.layer) || typeof safe.confidence !== "number" || safe.confidence < 0 || safe.confidence > 1 || !memorySensitivities.has(safe.sensitivity) || !memoryPolicies.has(safe.retrievalPolicy)) {
      return Promise.reject(new TypeError("A valid evidence-bound memory proposal is required"));
    }
    return ipcRenderer.invoke("desktop:propose-memory-from-run", safe);
  },
  resolveMemory: (decision) => {
    const safe = decision && typeof decision === "object" ? { memoryId: decision.memoryId, action: decision.action, reason: decision.reason } : undefined;
    if (!safe || typeof safe.memoryId !== "string" || !memoryActions.has(safe.action) || typeof safe.reason !== "string" || safe.reason.trim().length < 3 || safe.reason.length > 1000) {
      return Promise.reject(new TypeError("A valid memory decision is required"));
    }
    return ipcRenderer.invoke("desktop:resolve-memory", safe);
  },
  correctMemory: (correction) => {
    const safe = correction && typeof correction === "object" ? { memoryId: correction.memoryId, statement: correction.statement, reason: correction.reason } : undefined;
    if (!safe || typeof safe.memoryId !== "string" || typeof safe.statement !== "string" || safe.statement.trim().length < 3 || safe.statement.length > 4000 || typeof safe.reason !== "string" || safe.reason.trim().length < 3 || safe.reason.length > 1000) {
      return Promise.reject(new TypeError("A valid append-only memory correction is required"));
    }
    return ipcRenderer.invoke("desktop:correct-memory", safe);
  },
  retrieveMemory: (request) => {
    const safe = request && typeof request === "object" ? {
      query: request.query,
      destination: request.destination,
      maxSensitivity: request.maxSensitivity,
      includeExplicitOnly: request.includeExplicitOnly
    } : undefined;
    if (!safe || typeof safe.query !== "string" || safe.query.trim().length < 1 || safe.query.length > 1000 || !memoryDestinations.has(safe.destination) || !memorySensitivities.has(safe.maxSensitivity) || typeof safe.includeExplicitOnly !== "boolean") {
      return Promise.reject(new TypeError("A valid scoped memory retrieval is required"));
    }
    return ipcRenderer.invoke("desktop:retrieve-memory", safe);
  },
  resolveToolPackage: (decision) => {
    const safe = decision && typeof decision === "object" ? {
      toolPackageId: decision.toolPackageId,
      revision: decision.revision,
      action: decision.action,
      reason: decision.reason
    } : undefined;
    if (!safe || typeof safe.toolPackageId !== "string" || typeof safe.revision !== "string" || !toolPackageActions.has(safe.action) || typeof safe.reason !== "string" || safe.reason.trim().length < 3 || safe.reason.length > 1000) {
      return Promise.reject(new TypeError("A valid Tool Package decision is required"));
    }
    return ipcRenderer.invoke("desktop:resolve-tool-package", safe);
  },
  resolveSkill: (decision) => {
    const safe = decision && typeof decision === "object" ? {
      skillId: decision.skillId,
      revision: decision.revision,
      action: decision.action,
      reason: decision.reason
    } : undefined;
    if (!safe || typeof safe.skillId !== "string" || typeof safe.revision !== "string" || !skillActions.has(safe.action) || typeof safe.reason !== "string" || safe.reason.trim().length < 3 || safe.reason.length > 1000) {
      return Promise.reject(new TypeError("A valid Skill trust decision is required"));
    }
    return ipcRenderer.invoke("desktop:resolve-skill", safe);
  },
  evaluateSkill: (identity) => {
    const safe = identity && typeof identity === "object" ? { skillId: identity.skillId, revision: identity.revision } : undefined;
    if (!safe || typeof safe.skillId !== "string" || typeof safe.revision !== "string") return Promise.reject(new TypeError("An exact Skill revision is required"));
    return ipcRenderer.invoke("desktop:evaluate-skill", safe);
  },
  onHarnessEvent: (listener) => {
    if (typeof listener !== "function") throw new TypeError("A listener function is required");
    const handler = (_event, message) => listener(message);
    ipcRenderer.on("desktop:harness-event", handler);
    return () => ipcRenderer.removeListener("desktop:harness-event", handler);
  }
});

contextBridge.exposeInMainWorld("clarkDesktop", api);
