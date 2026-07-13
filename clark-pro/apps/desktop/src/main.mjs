import { app, BrowserWindow, ipcMain, Menu, net, protocol, screen, session } from "electron";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createMenuTemplate, SECTIONS } from "./menu.mjs";
import { assertTrustedSender, denyAllSessionPermissions, hardenWebContents } from "./security.mjs";
import { normalizeWindowBounds, readWindowState, writeWindowState, writeWindowStateSync } from "./window-state.mjs";

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));
const rendererDirectory = path.join(sourceDirectory, "renderer");
const allowedAssets = new Set(["index.html", "app.css", "renderer.mjs"]);
const state = { activeSection: "focus" };
let mainWindow;
let saveTimer;

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
app.on("window-all-closed", () => {
  if (process.platform !== "darwin" || process.env.CLARK_E2E === "1") app.quit();
});
