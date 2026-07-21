import { app, BrowserWindow, ipcMain, Menu, net, protocol, screen, session } from "electron";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { HarnessSupervisor } from "./harness-supervisor.mjs";
import { minimalHarnessEnvironment } from "./harness-boundary-utils.mjs";
import { createMenuTemplate, SECTIONS } from "./menu.mjs";
import { assertTrustedSender, denyAllSessionPermissions, hardenWebContents } from "./security.mjs";
import { normalizeWindowBounds, readWindowState, writeWindowState, writeWindowStateSync } from "./window-state.mjs";

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));
const rendererDirectory = path.join(sourceDirectory, "renderer");
const allowedAssets = new Set(["index.html", "app.css", "renderer.mjs", "comparison.mjs"]);
const state = { activeSection: "focus" };
let mainWindow;
let saveTimer;
let harnessSupervisor;

const LOCAL_WORKSPACE_ID = "workspace.local";
const LOCAL_PROJECT_ID = "project.idea-lab";
const MEMORY_LAYERS = new Set(["identity", "semantic", "episodic", "procedural", "performance"]);
const MEMORY_SENSITIVITIES = new Set(["public", "workspace", "personal", "confidential", "secret_reference"]);
const MEMORY_POLICIES = new Set(["default", "explicit_only", "never_send_to_model"]);
const MEMORY_ACTIONS = new Set(["promote", "reject", "dispute", "forget"]);
const MEMORY_DESTINATIONS = new Set(["creator_view", "local_model", "remote_model"]);
const SKILL_ACTIONS = new Set(["promote", "rollback"]);
const TOOL_PACKAGE_ACTIONS = new Set(["activate", "rollback"]);

if (process.env.CLARK_TEST_USER_DATA) app.setPath("userData", process.env.CLARK_TEST_USER_DATA);
app.setName("Clark Pro");
app.enableSandbox();
protocol.registerSchemesAsPrivileged([
  {
    scheme: "clark-app",
    privileges: { secure: true, standard: true, supportFetchAPI: true }
  }
]);

function statePath() {
  return path.join(app.getPath("userData"), "shell-state.json");
}

function sendNavigation(section) {
  if (!SECTIONS.includes(section)) return;
  state.activeSection = section;
  mainWindow?.webContents.send("desktop:navigate", section);
  scheduleStateSave();
}

function showTrustCenter() {
  sendNavigation("connections");
  mainWindow?.webContents.send("desktop:show-trust-center");
}

function scheduleStateSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => void persistState(), 120);
}

async function persistState() {
  clearTimeout(saveTimer);
  if (!mainWindow || mainWindow.isDestroyed()) return;
  await writeWindowState(statePath(), {
    windowBounds: mainWindow.getBounds(),
    activeSection: state.activeSection
  });
}

function persistStateBeforeExit() {
  clearTimeout(saveTimer);
  if (!mainWindow || mainWindow.isDestroyed()) return;
  writeWindowStateSync(statePath(), {
    windowBounds: mainWindow.getBounds(),
    activeSection: state.activeSection
  });
}

function installIpc() {
  ipcMain.handle("desktop:get-shell-state", (event) => {
    assertTrustedSender(event, mainWindow?.webContents);
    return Object.freeze({ activeSection: state.activeSection, platform: process.platform, nativeShell: true });
  });
  ipcMain.handle("desktop:set-active-section", (event, section) => {
    assertTrustedSender(event, mainWindow?.webContents);
    if (!SECTIONS.includes(section)) throw new TypeError("Unknown section");
    state.activeSection = section;
    scheduleStateSave();
    return { activeSection: section };
  });
  ipcMain.handle("desktop:get-harness-state", async (event) => {
    assertTrustedSender(event, mainWindow?.webContents);
    if (!harnessSupervisor || harnessSupervisor.state !== "ready") {
      return { available: false, state: harnessSupervisor?.state ?? "stopped", runs: [] };
    }
    const [status, list, memories, skills, toolPackages, capabilities, bridge] = await Promise.all([
      harnessSupervisor.request("harness.status", {}),
      harnessSupervisor.request("run.list", { workspaceId: LOCAL_WORKSPACE_ID, limit: 10 }),
      harnessSupervisor.request("memory.list", { workspaceId: LOCAL_WORKSPACE_ID, limit: 100, includeForgotten: true }),
      harnessSupervisor.request("skill.list", { workspaceId: LOCAL_WORKSPACE_ID, limit: 100 }),
      harnessSupervisor.request("tool_package.list", { workspaceId: LOCAL_WORKSPACE_ID, limit: 100 }),
      harnessSupervisor.request("capability.list", { workspaceId: LOCAL_WORKSPACE_ID }),
      harnessSupervisor.request("bridge.status", { workspaceId: LOCAL_WORKSPACE_ID })
    ]);
    return { available: true, ...status, runs: list.runs, memories: memories.memories, skills: skills.skills, toolPackages: toolPackages.toolPackages, capabilities: capabilities.capabilities, bridge };
  });
  ipcMain.handle("desktop:start-idea-loop", async (event, ideaText) => {
    assertTrustedSender(event, mainWindow?.webContents);
    if (typeof ideaText !== "string" || ideaText.trim().length < 20 || ideaText.length > 12_000) {
      throw new TypeError("Idea text must be between 20 and 12,000 characters");
    }
    return harnessSupervisor.request("loop.start", {
      workspaceId: LOCAL_WORKSPACE_ID,
      projectId: LOCAL_PROJECT_ID,
      ideaText: ideaText.trim(),
      idempotencyKey: `intent.desktop.${randomUUID()}`
    });
  });
  ipcMain.handle("desktop:revise-idea", async (event, revision) => {
    assertTrustedSender(event, mainWindow?.webContents);
    if (!revision || typeof revision !== "object" || typeof revision.parentRunId !== "string") throw new TypeError("A parent run is required");
    if (typeof revision.ideaText !== "string" || revision.ideaText.trim().length < 20 || revision.ideaText.length > 12_000) throw new TypeError("Revised idea text must be between 20 and 12,000 characters");
    if (typeof revision.revisionReason !== "string" || revision.revisionReason.trim().length < 3 || revision.revisionReason.length > 1_000) throw new TypeError("A revision reason is required");
    return harnessSupervisor.request("idea.revise", {
      workspaceId: LOCAL_WORKSPACE_ID,
      parentRunId: revision.parentRunId,
      ideaText: revision.ideaText.trim(),
      revisionReason: revision.revisionReason.trim(),
      idempotencyKey: `intent.revision.${randomUUID()}`
    });
  });
  ipcMain.handle("desktop:resolve-idea-approval", async (event, decision) => {
    assertTrustedSender(event, mainWindow?.webContents);
    if (!decision || typeof decision !== "object" || !["approve", "reject"].includes(decision.decision)) {
      throw new TypeError("A valid approval decision is required");
    }
    if (typeof decision.runId !== "string" || typeof decision.approvalId !== "string") {
      throw new TypeError("Run and approval IDs are required");
    }
    if (typeof decision.reason !== "string" || decision.reason.trim().length < 3 || decision.reason.length > 1_000) {
      throw new TypeError("An approval decision reason between 3 and 1,000 characters is required");
    }
    return harnessSupervisor.request("approval.resolve", {
      workspaceId: LOCAL_WORKSPACE_ID,
      runId: decision.runId,
      approvalId: decision.approvalId,
      decision: decision.decision,
      reason: decision.reason.trim(),
      idempotencyKey: `intent.approval.${randomUUID()}`
    });
  });
  ipcMain.handle("desktop:propose-memory-from-run", async (event, proposal) => {
    assertTrustedSender(event, mainWindow?.webContents);
    assertHarnessReady();
    if (!proposal || typeof proposal !== "object" || typeof proposal.runId !== "string") throw new TypeError("A durable run is required");
    if (typeof proposal.statement !== "string" || proposal.statement.trim().length < 3 || proposal.statement.length > 4_000) throw new TypeError("Memory statement must be between 3 and 4,000 characters");
    if (!MEMORY_LAYERS.has(proposal.layer) || !MEMORY_SENSITIVITIES.has(proposal.sensitivity) || !MEMORY_POLICIES.has(proposal.retrievalPolicy)) throw new TypeError("Memory governance fields are invalid");
    if (typeof proposal.confidence !== "number" || proposal.confidence < 0 || proposal.confidence > 1) throw new TypeError("Memory confidence must be between 0 and 1");
    const run = await harnessSupervisor.request("run.get", { workspaceId: LOCAL_WORKSPACE_ID, runId: proposal.runId });
    if (!run.draft) throw new TypeError("The selected run has no exact-version brief evidence");
    return harnessSupervisor.request("memory.propose", {
      workspaceId: LOCAL_WORKSPACE_ID,
      layer: proposal.layer,
      statement: proposal.statement.trim(),
      evidence: [
        { type: "artifact", refId: run.draft.artifactId, versionId: run.draft.versionId },
        { type: "run", refId: run.runId }
      ],
      contradictions: [],
      confidence: proposal.confidence,
      scope: { workspaceId: LOCAL_WORKSPACE_ID, projectId: run.projectId },
      sensitivity: proposal.sensitivity,
      retrievalPolicy: proposal.retrievalPolicy,
      idempotencyKey: `intent.memory.propose.${randomUUID()}`
    });
  });
  ipcMain.handle("desktop:resolve-memory", async (event, decision) => {
    assertTrustedSender(event, mainWindow?.webContents);
    assertHarnessReady();
    if (!decision || typeof decision !== "object" || typeof decision.memoryId !== "string" || !MEMORY_ACTIONS.has(decision.action)) throw new TypeError("A valid memory decision is required");
    if (typeof decision.reason !== "string" || decision.reason.trim().length < 3 || decision.reason.length > 1_000) throw new TypeError("A decision reason is required");
    return harnessSupervisor.request("memory.resolve", {
      workspaceId: LOCAL_WORKSPACE_ID,
      memoryId: decision.memoryId,
      action: decision.action,
      reason: decision.reason.trim(),
      idempotencyKey: `intent.memory.${decision.action}.${randomUUID()}`
    });
  });
  ipcMain.handle("desktop:correct-memory", async (event, correction) => {
    assertTrustedSender(event, mainWindow?.webContents);
    assertHarnessReady();
    if (!correction || typeof correction !== "object" || typeof correction.memoryId !== "string") throw new TypeError("A memory is required");
    if (typeof correction.statement !== "string" || correction.statement.trim().length < 3 || correction.statement.length > 4_000) throw new TypeError("Corrected statement must be between 3 and 4,000 characters");
    if (typeof correction.reason !== "string" || correction.reason.trim().length < 3 || correction.reason.length > 1_000) throw new TypeError("A correction reason is required");
    return harnessSupervisor.request("memory.correct", {
      workspaceId: LOCAL_WORKSPACE_ID,
      memoryId: correction.memoryId,
      statement: correction.statement.trim(),
      reason: correction.reason.trim(),
      idempotencyKey: `intent.memory.correct.${randomUUID()}`
    });
  });
  ipcMain.handle("desktop:retrieve-memory", async (event, request) => {
    assertTrustedSender(event, mainWindow?.webContents);
    assertHarnessReady();
    if (!request || typeof request !== "object" || typeof request.query !== "string" || request.query.trim().length < 1 || request.query.length > 1_000) throw new TypeError("A retrieval query is required");
    if (!MEMORY_DESTINATIONS.has(request.destination) || !MEMORY_SENSITIVITIES.has(request.maxSensitivity) || typeof request.includeExplicitOnly !== "boolean") throw new TypeError("Retrieval policy is invalid");
    return harnessSupervisor.request("memory.retrieve", {
      workspaceId: LOCAL_WORKSPACE_ID,
      query: request.query.trim(),
      purpose: "Creator-requested context review in the governed Memory workspace.",
      destination: request.destination,
      scope: { workspaceId: LOCAL_WORKSPACE_ID, projectId: LOCAL_PROJECT_ID },
      maxSensitivity: request.maxSensitivity,
      includeExplicitOnly: request.includeExplicitOnly,
      limit: 20,
      idempotencyKey: `intent.memory.retrieve.${randomUUID()}`
    });
  });
  ipcMain.handle("desktop:resolve-tool-package", async (event, decision) => {
    assertTrustedSender(event, mainWindow?.webContents);
    assertHarnessReady();
    if (!decision || typeof decision !== "object" || typeof decision.toolPackageId !== "string" || typeof decision.revision !== "string" || !TOOL_PACKAGE_ACTIONS.has(decision.action)) throw new TypeError("A valid Tool Package decision is required");
    if (typeof decision.reason !== "string" || decision.reason.trim().length < 3 || decision.reason.length > 1_000) throw new TypeError("A Tool Package decision reason is required");
    return harnessSupervisor.request("tool_package.resolve", {
      workspaceId: LOCAL_WORKSPACE_ID,
      toolPackageId: decision.toolPackageId,
      revision: decision.revision,
      action: decision.action,
      reason: decision.reason.trim(),
      idempotencyKey: `intent.tool-package.${decision.action}.${randomUUID()}`
    });
  });
  ipcMain.handle("desktop:resolve-skill", async (event, decision) => {
    assertTrustedSender(event, mainWindow?.webContents);
    assertHarnessReady();
    if (!decision || typeof decision !== "object" || typeof decision.skillId !== "string" || typeof decision.revision !== "string" || !SKILL_ACTIONS.has(decision.action)) throw new TypeError("A valid Skill trust decision is required");
    if (typeof decision.reason !== "string" || decision.reason.trim().length < 3 || decision.reason.length > 1_000) throw new TypeError("A Skill trust decision reason is required");
    return harnessSupervisor.request("skill.resolve", {
      workspaceId: LOCAL_WORKSPACE_ID,
      skillId: decision.skillId,
      revision: decision.revision,
      action: decision.action,
      reason: decision.reason.trim(),
      idempotencyKey: `intent.skill.${decision.action}.${randomUUID()}`
    });
  });
  ipcMain.handle("desktop:evaluate-skill", async (event, identity) => {
    assertTrustedSender(event, mainWindow?.webContents);
    assertHarnessReady();
    if (!identity || typeof identity !== "object" || typeof identity.skillId !== "string" || typeof identity.revision !== "string") throw new TypeError("An exact Skill revision is required");
    return harnessSupervisor.request("skill.evaluate", {
      workspaceId: LOCAL_WORKSPACE_ID,
      skillId: identity.skillId,
      revision: identity.revision
    });
  });
}

function assertHarnessReady() {
  if (!harnessSupervisor || harnessSupervisor.state !== "ready") throw new TypeError("Harness is not ready");
}

async function startHarness() {
  const entryPath = fileURLToPath(import.meta.resolve("@clark-pro/harness/utility"));
  harnessSupervisor = new HarnessSupervisor({
    entryPath,
    dataDirectory: path.join(app.getPath("userData"), "harness"),
    runtimeExecutable: process.execPath,
    environment: minimalHarnessEnvironment()
  });
  harnessSupervisor.on("event", (event) => mainWindow?.webContents.send("desktop:harness-event", event));
  await harnessSupervisor.start();
  await harnessSupervisor.request("workspace.ensure", { workspaceId: LOCAL_WORKSPACE_ID, name: "Local creator workspace" });
  if (process.env.CLARK_E2E === "1") {
    globalThis.__clarkTest = Object.freeze({
      killHarness: () => harnessSupervisor.killForTest(),
      harnessDebug: () => ({
        state: harnessSupervisor.state,
        lastEvent: harnessSupervisor.lastEvent,
        environmentKeys: Object.keys(harnessSupervisor.environment).sort(),
        diagnostics: structuredClone(harnessSupervisor.lastDiagnostics)
      })
    });
  }
}

async function installProtocol() {
  await protocol.handle("clark-app", (request) => {
    const url = new URL(request.url);
    const requestedAsset = url.pathname.replace(/^\//, "") || "index.html";
    if (url.hostname !== "shell" || !allowedAssets.has(requestedAsset)) {
      return new Response("Not found", { status: 404 });
    }
    return net.fetch(pathToFileURL(path.join(rendererDirectory, requestedAsset)).toString());
  });
}

async function createMainWindow() {
  const savedState = await readWindowState(statePath());
  if (SECTIONS.includes(savedState.activeSection)) state.activeSection = savedState.activeSection;
  const workArea = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea;
  const bounds = normalizeWindowBounds(savedState.windowBounds, workArea);

  mainWindow = new BrowserWindow({
    ...bounds,
    minWidth: 780,
    minHeight: 560,
    show: false,
    title: "Clark Pro",
    backgroundColor: "#151513",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 18, y: 18 },
    webPreferences: {
      preload: path.join(sourceDirectory, "preload.cjs"),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      webviewTag: false,
      devTools: process.env.NODE_ENV !== "production",
      spellcheck: true
    }
  });

  hardenWebContents(mainWindow.webContents);
  mainWindow.on("resize", scheduleStateSave);
  mainWindow.on("move", scheduleStateSave);
  mainWindow.on("close", persistStateBeforeExit);
  mainWindow.on("closed", () => { mainWindow = undefined; });
  mainWindow.once("ready-to-show", () => mainWindow?.show());
  await mainWindow.loadURL("clark-app://shell/index.html");
}

async function start() {
  await installProtocol();
  denyAllSessionPermissions(session.defaultSession);
  installIpc();
  await startHarness();
  Menu.setApplicationMenu(Menu.buildFromTemplate(createMenuTemplate({
    appName: app.name,
    navigate: sendNavigation,
    showTrustCenter
  })));
  await createMainWindow();
}

app.whenReady().then(start).catch((error) => {
  console.error("Clark desktop failed to start", error);
  app.exit(1);
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) void createMainWindow();
});

app.on("before-quit", persistStateBeforeExit);
app.on("before-quit", () => harnessSupervisor?.stop());
app.on("window-all-closed", () => {
  if (process.platform !== "darwin" || process.env.CLARK_E2E === "1") app.quit();
});
