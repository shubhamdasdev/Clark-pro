const { contextBridge, ipcRenderer } = require("electron");

const allowedSections = new Set(["focus", "canvas", "connections"]);

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
      ...(typeof decision.reason === "string" ? { reason: decision.reason } : {})
    } : undefined;
    if (!safe || typeof safe.runId !== "string" || typeof safe.approvalId !== "string" || !["approve", "reject"].includes(safe.decision)) {
      return Promise.reject(new TypeError("A valid approval decision is required"));
    }
    return ipcRenderer.invoke("desktop:resolve-idea-approval", safe);
  },
  onHarnessEvent: (listener) => {
    if (typeof listener !== "function") throw new TypeError("A listener function is required");
    const handler = (_event, message) => listener(message);
    ipcRenderer.on("desktop:harness-event", handler);
    return () => ipcRenderer.removeListener("desktop:harness-event", handler);
  }
});

contextBridge.exposeInMainWorld("clarkDesktop", api);
