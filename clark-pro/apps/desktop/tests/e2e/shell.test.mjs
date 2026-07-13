import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { _electron as electron } from "playwright";

const appDirectory = path.resolve(import.meta.dirname, "../..");

async function launch(userDataDirectory) {
  return electron.launch({
    args: [appDirectory],
    env: { ...process.env, CLARK_E2E: "1", CLARK_TEST_USER_DATA: userDataDirectory }
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
    assert.deepEqual(boundary.apiKeys, ["getShellState", "onNavigate", "onTrustCenter", "setActiveSection", "version"]);
    assert.match(boundary.csp, /default-src 'none'/);

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
  } finally {
    if (electronApp) await electronApp.close().catch(() => {});
    await rm(userData, { recursive: true, force: true });
  }
});
