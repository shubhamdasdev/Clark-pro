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
const allowedAssets = new Set(["index.html", "app.css", "renderer.mjs"]);
const state = { activeSection: "focus" };
let mainWindow;
let saveTimer;
let harnessSupervisor;

const LOCAL_WORKSPACE_ID = "workspace.local";
const LOCAL_PROJECT_ID = "project.idea-lab";

if (process.env.CLARK_TEST_USER_DATA) app.setPath("userData", process.env.CLARK_TEST_USER_DATA);
app.setName("Clark Studio");
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
    const [status, list] = await Promise.all([
      harnessSupervisor.request("harness.status", {}),
      harnessSupervisor.request("run.list", { workspaceId: LOCAL_WORKSPACE_ID, limit: 10 })
    ]);
    return { available: true, ...status, runs: list.runs };
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
  ipcMain.handle("desktop:resolve-idea-approval", async (event, decision) => {
    assertTrustedSender(event, mainWindow?.webContents);
    if (!decision || typeof decision !== "object" || !["approve", "reject"].includes(decision.decision)) {
      throw new TypeError("A valid approval decision is required");
    }
    if (typeof decision.runId !== "string" || typeof decision.approvalId !== "string") {
      throw new TypeError("Run and approval IDs are required");
    }
    return harnessSupervisor.request("approval.resolve", {
      workspaceId: LOCAL_WORKSPACE_ID,
      runId: decision.runId,
      approvalId: decision.approvalId,
      decision: decision.decision,
      ...(typeof decision.reason === "string" && decision.reason ? { reason: decision.reason.slice(0, 1000) } : {}),
      idempotencyKey: `intent.approval.${randomUUID()}`
    });
  });
}

async function startHarness() {
  const entryPath = fileURLToPath(import.meta.resolve("@clark-pro/harness/utility"));
  harnessSupervisor = new HarnessSupervisor({
    entryPath,
    dataDirectory: path.join(app.getPath("userData"), "harness"),
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
    title: "Clark Studio",
    backgroundColor: "#111318",
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
