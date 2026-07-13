import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { _electron as electron } from "playwright";

const appDirectory = path.resolve(import.meta.dirname, "../..");

async function launch(userDataDirectory, extraEnvironment = {}) {
  return electron.launch({
    args: [appDirectory],
    env: { ...process.env, CLARK_E2E: "1", CLARK_TEST_USER_DATA: userDataDirectory, ...extraEnvironment }
  });
}

test("renderer boundary, native menu, keyboard views, accessibility, and restoration work", async () => {
  const userData = await mkdtemp(path.join(os.tmpdir(), "clark-desktop-e2e-"));
  let electronApp;
  try {
    electronApp = await launch(userData);
    const page = await electronApp.firstWindow();
    await page.getByRole("heading", { name: "Focus", level: 1 }).waitFor();

    const boundary = await page.evaluate(() => ({
      requireType: typeof globalThis.require,
      processType: typeof globalThis.process,
      apiKeys: Object.keys(window.clarkDesktop).sort(),
      protocol: location.protocol,
      csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content
    }));
    assert.equal(boundary.requireType, "undefined");
    assert.equal(boundary.processType, "undefined");
    assert.equal(boundary.protocol, "clark-app:");
    assert.deepEqual(boundary.apiKeys, ["getHarnessState", "getShellState", "onHarnessEvent", "onNavigate", "onTrustCenter", "resolveIdeaApproval", "setActiveSection", "startIdeaLoop", "version"]);
    assert.match(boundary.csp, /default-src 'none'/);

    await page.getByText(/Ready · \d+ events/).waitFor();
    await page.getByRole("button", { name: "Structure idea" }).click();
    await page.getByText("Waiting approval", { exact: true }).waitFor();
    const liveSnapshot = await page.evaluate(() => window.clarkDesktop.getHarnessState());
    assert.equal(liveSnapshot.capabilities.find((capability) => capability.id === "clark.idea.inspect.mcp").state, "healthy");
    assert.equal(liveSnapshot.bridge.state, "ready");
    assert.equal(liveSnapshot.bridge.host, "127.0.0.1");
    assert.equal("token" in liveSnapshot.bridge, false);
    const draftHash = await page.locator("#run-integrity").innerText();
    assert.match(draftHash, /sha256:[a-f0-9]{64}/);
    assert.match(await page.locator("#draft-text").innerText(), /Strongest framing/);
    await page.reload();
    await page.getByText("Waiting approval", { exact: true }).waitFor();
    assert.equal(await page.locator("#run-integrity").innerText(), draftHash);
    await page.getByRole("button", { name: "Approve exact version" }).click();
    await page.getByText("Completed", { exact: true }).waitFor();

    const menu = await electronApp.evaluate(({ Menu }) => {
      const applicationMenu = Menu.getApplicationMenu();
      return {
        top: applicationMenu.items.map((item) => item.label),
        canvas: applicationMenu.getMenuItemById("view-canvas")?.accelerator,
        services: applicationMenu.items[0].submenu.items.some((item) => item.role === "services")
      };
    });
    assert.equal(menu.services, true);
    assert.equal(menu.canvas, "CmdOrCtrl+2");
    assert.ok(menu.top.includes("Edit"));
    assert.ok(menu.top.includes("Window"));

    await page.keyboard.press("Meta+2");
    await page.getByRole("heading", { name: "Canvas", level: 1 }).waitFor();
    assert.equal(await page.getByRole("tab", { name: /Canvas/ }).getAttribute("aria-selected"), "true");
    const graph = page.getByRole("list", { name: "Launch production graph" });
    await graph.getByRole("button", { name: /Creator thesis/ }).focus();
    await page.keyboard.press("ArrowDown");
    assert.match(await page.locator(":focus").innerText(), /Launch narrative/);
    assert.equal(await page.locator("h1").count(), 3);
    assert.equal(await page.locator("h1:visible").count(), 1);

    await page.keyboard.press("Meta+7");
    await page.getByRole("heading", { name: "Connections", level: 1 }).waitFor();
    await page.getByRole("button", { name: "Review trust" }).click();
    await page.getByRole("heading", { name: /3 decisions remain explicit/ }).waitFor();
    assert.match(await page.getByRole("listitem").filter({ hasText: "Bundled MCP idea inspector" }).innerText(), /live/i);
    assert.match(await page.getByRole("listitem").filter({ hasText: "Clark Bridge" }).innerText(), /live/i);
    assert.equal(await page.getByText("Signed flows not built").count(), 1);

    const webPreferences = await electronApp.evaluate(({ BrowserWindow }) => {
      const preferences = BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences();
      return {
        contextIsolation: preferences.contextIsolation,
        sandbox: preferences.sandbox,
        nodeIntegration: preferences.nodeIntegration,
        webSecurity: preferences.webSecurity,
        webviewTag: preferences.webviewTag
      };
    });
    assert.deepEqual(webPreferences, {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true,
      webviewTag: false
    });

    await electronApp.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setBounds({ x: 120, y: 120, width: 940, height: 640 }));
    await new Promise((resolve) => setTimeout(resolve, 250));
    await electronApp.close();
    electronApp = undefined;

    const persisted = JSON.parse(await readFile(path.join(userData, "shell-state.json"), "utf8"));
    assert.equal(persisted.activeSection, "connections");
    assert.equal(persisted.windowBounds.width, 940);
    assert.equal(persisted.windowBounds.height, 640);

    electronApp = await launch(userData);
    const restoredPage = await electronApp.firstWindow();
    await restoredPage.getByRole("heading", { name: "Connections", level: 1 }).waitFor();
    const restoredBounds = await electronApp.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].getBounds());
    assert.equal(restoredBounds.width, 940);
    assert.equal(restoredBounds.height, 640);
    await restoredPage.keyboard.press("Meta+1");
    await restoredPage.getByText("Completed", { exact: true }).waitFor();
  } finally {
    if (electronApp) await electronApp.close().catch(() => {});
    await rm(userData, { recursive: true, force: true });
  }
});

test("supervisor restarts a killed Harness and resumes the running step from durable events", async () => {
  const userData = await mkdtemp(path.join(os.tmpdir(), "clark-harness-process-e2e-"));
  let electronApp;
  try {
    electronApp = await launch(userData, { CLARK_TEST_STEP_DELAY_MS: "1200" });
    const page = await electronApp.firstWindow();
    await page.getByText(/Ready · \d+ events/).waitFor();
    await page.getByRole("button", { name: "Structure idea" }).click();

    await assertEventually(async () => {
      const debug = await electronApp.evaluate(() => globalThis.__clarkTest.harnessDebug());
      return debug.lastEvent?.eventType === "run.updated" && debug.lastEvent.payload.state === "running";
    }, "Harness did not enter the running step before the kill");

    const beforeKill = await electronApp.evaluate(() => globalThis.__clarkTest.harnessDebug());
    assert.deepEqual(beforeKill.environmentKeys, ["CLARK_TEST_STEP_DELAY_MS", "LANG", "LC_ALL", "NODE_ENV"]);
    assert.equal(beforeKill.environmentKeys.some((key) => /TOKEN|KEY|SECRET|HOME|PATH/.test(key)), false);
    assert.equal(await electronApp.evaluate(() => globalThis.__clarkTest.killHarness()), true);

    await assertEventually(async () => {
      const debug = await electronApp.evaluate(() => globalThis.__clarkTest.harnessDebug());
      return debug.state === "ready" && debug.lastEvent?.eventType === "harness.ready" && debug.lastEvent.payload.recoveredRuns === 1;
    }, "Harness did not restart with one recovered run");

    await page.getByText("Waiting approval", { exact: true }).waitFor({ timeout: 10_000 });
    const snapshot = await page.evaluate(() => window.clarkDesktop.getHarnessState());
    assert.equal(snapshot.recoveredRuns, 1);
    assert.equal(snapshot.runs[0].state, "waiting_approval");
    assert.equal(snapshot.runs[0].recoveredFromCheckpoint, false);
    assert.match(snapshot.runs[0].draft.contentHash, /^sha256:[a-f0-9]{64}$/);
  } finally {
    if (electronApp) await electronApp.close().catch(() => {});
    await rm(userData, { recursive: true, force: true });
  }
});

async function assertEventually(predicate, message, timeoutMs = 8_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  assert.fail(message);
}
