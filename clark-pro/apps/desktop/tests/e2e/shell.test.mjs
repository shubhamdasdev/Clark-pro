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
    assert.deepEqual(boundary.apiKeys, ["correctMemory", "getHarnessState", "getShellState", "onHarnessEvent", "onNavigate", "onTrustCenter", "proposeMemoryFromRun", "resolveIdeaApproval", "resolveMemory", "retrieveMemory", "reviseIdea", "setActiveSection", "startIdeaLoop", "version"]);
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
    await page.locator("#idea-input").fill("Build a local-first creator operating system for solo professional creators that replaces manual copy and paste across multiple tools with plugin-first open-source workflows, while creator approval controls memory and publication. Unlike closed suites, providers stay replaceable. Reach creators through an open-source plugin marketplace and charge a subscription after a pilot measures weekly time saved, willingness to pay, and repeat use.");
    await page.locator("#revision-reason").fill("Narrow the user and add the workaround, wedge, distribution, payment model, and evidence test.");
    await page.getByRole("button", { name: "Create stronger revision" }).click();
    await page.locator("#run-integrity").filter({ hasText: /revision 2 ·/i }).waitFor();
    await page.getByText(/10\/10 thesis facets explicit/i).waitFor();
    const revisedSnapshot = await page.evaluate(() => window.clarkDesktop.getHarnessState());
    assert.equal(revisedSnapshot.runs[0].revisionNumber, 2);
    assert.equal(revisedSnapshot.runs[1].state, "cancelled");
    assert.equal(revisedSnapshot.runs[1].approval.state, "invalidated");
    assert.equal(JSON.parse(revisedSnapshot.runs[0].analysis.text).readiness, "evidence_required");
    assert.equal(JSON.parse(revisedSnapshot.runs[0].analysis.text).evidenceState, "not_observed");
    await page.getByRole("button", { name: "Approve exact version" }).click();
    await page.getByText("Completed", { exact: true }).waitFor();

    const menu = await electronApp.evaluate(({ Menu }) => {
      const applicationMenu = Menu.getApplicationMenu();
      return {
        top: applicationMenu.items.map((item) => item.label),
        canvas: applicationMenu.getMenuItemById("view-canvas")?.accelerator,
        memory: applicationMenu.getMenuItemById("view-memory")?.accelerator,
        services: applicationMenu.items[0].submenu.items.some((item) => item.role === "services")
      };
    });
    assert.equal(menu.services, true);
    assert.equal(menu.canvas, "CmdOrCtrl+2");
    assert.equal(menu.memory, "CmdOrCtrl+6");
    assert.ok(menu.top.includes("Edit"));
    assert.ok(menu.top.includes("Window"));

    await page.keyboard.press("Meta+2");
    await page.getByRole("heading", { name: "Canvas", level: 1 }).waitFor();
    assert.equal(await page.getByRole("tab", { name: /Canvas/ }).getAttribute("aria-selected"), "true");
    const graph = page.getByRole("list", { name: "Idea Foundry graph" });
    await graph.getByRole("button", { name: /Idea thesis v2/ }).focus();
    await page.keyboard.press("ArrowDown");
    assert.match(await page.locator(":focus").innerText(), /Thesis stress-test/);
    assert.match(await page.locator("#canvas-readiness").innerText(), /Evidence required/);
    assert.equal(await page.locator("#evidence-gap-list li").count(), 5);
    assert.equal(await page.locator("h1").count(), 4);
    assert.equal(await page.locator("h1:visible").count(), 1);

    await page.keyboard.press("Meta+6");
    await page.getByRole("heading", { name: "Memory", level: 1 }).waitFor();
    await page.getByRole("button", { name: "Propose memory" }).click();
    await page.getByText("Proposed · excluded", { exact: true }).waitFor();
    assert.match(await page.locator("#memory-inspector-evidence").innerText(), /artifact:/);
    await page.getByRole("button", { name: "Retrieve active claims" }).click();
    await page.getByText(/0 active claims · Creator view/i).waitFor();
    await page.getByRole("button", { name: "Promote", exact: true }).click();
    await page.getByText("Active · retrievable", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Retrieve active claims" }).click();
    await page.getByText(/1 active claim · Creator view/i).waitFor();
    await page.locator("#memory-correction").fill("Creator prefers operational explanations that separate observed evidence from aspirational claims.");
    await page.getByRole("button", { name: "Propose corrected claim" }).click();
    await page.getByText("2 immutable claims", { exact: true }).waitFor();
    await page.getByText("Proposed · excluded", { exact: true }).waitFor();
    assert.equal(await page.locator(".memory-card").filter({ hasText: "Disputed" }).count(), 1);
    await page.getByRole("button", { name: "Promote", exact: true }).click();
    await page.getByText("Active · retrievable", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Forget", exact: true }).click();
    await page.getByText("Forgotten · excluded", { exact: true }).waitFor();
    assert.equal(await page.locator("#memory-inspector-statement").innerText(), "[forgotten]");
    assert.match(await page.getByText(/immutable audit event remains until cryptographic erasure/i).innerText(), /compaction/);

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
