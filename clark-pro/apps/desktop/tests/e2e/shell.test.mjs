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
    await page.getByRole("heading", { name: "Today", level: 1 }).waitFor();

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
    assert.deepEqual(boundary.apiKeys, ["correctMemory", "evaluateSkill", "getHarnessState", "getShellState", "onHarnessEvent", "onNavigate", "onTrustCenter", "proposeMemoryFromRun", "resolveIdeaApproval", "resolveMemory", "resolveSkill", "resolveToolPackage", "retrieveMemory", "reviseIdea", "setActiveSection", "startIdeaLoop", "version"]);
    assert.match(boundary.csp, /default-src 'none'/);

    await page.getByText(/Saved locally · \d+ updates/).waitFor();
    await page.getByRole("button", { name: "Shape this idea" }).click();
    await page.locator("#run-state").filter({ hasText: "Waiting for review" }).waitFor();
    const liveSnapshot = await page.evaluate(() => window.clarkDesktop.getHarnessState());
    assert.equal(liveSnapshot.capabilities.find((capability) => capability.id === "clark.idea.inspect.mcp").state, "healthy");
    assert.equal(liveSnapshot.bridge.state, "ready");
    assert.equal(liveSnapshot.bridge.host, "127.0.0.1");
    assert.equal("token" in liveSnapshot.bridge, false);
    assert.equal(liveSnapshot.toolPackages.length, 1);
    assert.equal(liveSnapshot.toolPackages[0].state, "blocked_upstream");
    assert.equal(liveSnapshot.toolPackages[0].activationEligible, false);
    assert.deepEqual(liveSnapshot.toolPackages[0].componentCounts, { adapters: 0, capabilities: 0, skills: 0, converters: 0, uiContributions: 0 });
    assert.equal(liveSnapshot.capabilities.some((capability) => capability.id.includes("opencut")), false);
    assert.equal(liveSnapshot.skills.length, 1);
    assert.equal(liveSnapshot.skills[0].skillId, "clark.skill.evidence-brief-review");
    assert.equal(liveSnapshot.skills[0].state, "quarantined");
    assert.equal(liveSnapshot.skills[0].testStatus, "passed");
    assert.equal(liveSnapshot.skills[0].activationEligible, true);
    assert.deepEqual(liveSnapshot.skills[0].trustedPermissionScopes, []);
    const draftHash = await page.locator("#run-integrity").textContent();
    assert.match(draftHash, /sha256:[a-f0-9]{64}/);
    assert.match(await page.locator("#draft-text").innerText(), /Strongest framing/);
    await page.reload();
    await page.locator("#run-state").filter({ hasText: "Waiting for review" }).waitFor();
    assert.equal(await page.locator("#run-integrity").textContent(), draftHash);
    await page.locator("#idea-input").fill("Build a local-first creator operating system for solo professional creators that replaces manual copy and paste across multiple tools with plugin-first open-source workflows, while creator approval controls memory and publication. Unlike closed suites, providers stay replaceable. Reach creators through an open-source plugin marketplace and charge a subscription after a pilot measures weekly time saved, willingness to pay, and repeat use.");
    await page.locator("#revision-reason").fill("Narrow the user and add the workaround, wedge, distribution, payment model, and evidence test.");
    await page.getByRole("button", { name: "Shape a new revision" }).click();
    await page.waitForFunction(() => document.querySelector("#run-integrity")?.textContent?.toLowerCase().includes("revision 2 ·"));
    await page.locator("#readiness-heading").filter({ hasText: /10\/10 parts clear/i }).waitFor();
    const revisedSnapshot = await page.evaluate(() => window.clarkDesktop.getHarnessState());
    assert.equal(revisedSnapshot.runs[0].revisionNumber, 2);
    assert.equal(revisedSnapshot.runs[1].state, "cancelled");
    assert.equal(revisedSnapshot.runs[1].approval.state, "invalidated");
    assert.equal(JSON.parse(revisedSnapshot.runs[0].analysis.text).readiness, "evidence_required");
    assert.equal(JSON.parse(revisedSnapshot.runs[0].analysis.text).evidenceState, "not_observed");
    await page.getByRole("button", { name: "Approve this version" }).click();
    await page.getByText("Approved", { exact: true }).waitFor();

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
    await page.getByRole("heading", { name: "Shape", level: 1 }).waitFor();
    assert.equal(await page.getByRole("tab", { name: /Shape/ }).getAttribute("aria-selected"), "true");
    const graph = page.getByRole("list", { name: "Idea shaping flow" });
    await graph.getByRole("button", { name: /Your idea · v2/ }).focus();
    await page.keyboard.press("ArrowDown");
    assert.match(await page.locator(":focus").innerText(), /Idea check/);
    assert.match(await page.locator("#canvas-readiness").innerText(), /ready to test/i);
    assert.equal(await page.locator("#evidence-gap-list li").count(), 5);
    assert.equal(await page.locator("h1").count(), 4);
    assert.equal(await page.locator("h1:visible").count(), 1);

    await page.keyboard.press("Meta+6");
    await page.getByRole("heading", { name: "Knowledge", level: 1 }).waitFor();
    await page.getByRole("button", { name: "Send for review" }).click();
    await page.getByText("Proposed · excluded", { exact: true }).waitFor();
    assert.match(await page.locator("#memory-inspector-evidence").innerText(), /artifact:/);
    await page.getByRole("button", { name: "Find approved knowledge" }).click();
    await page.getByText(/0 approved claims · This view only/i).waitFor();
    await page.getByRole("button", { name: "Approve", exact: true }).click();
    await page.getByText("Active · retrievable", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Find approved knowledge" }).click();
    await page.getByText(/1 approved claim · This view only/i).waitFor();
    await page.locator("#memory-correction").fill("Creator prefers operational explanations that separate observed evidence from aspirational claims.");
    await page.getByRole("button", { name: "Save correction for review" }).click();
    await page.getByText("2 claims", { exact: true }).waitFor();
    await page.getByText("Proposed · excluded", { exact: true }).waitFor();
    assert.equal(await page.locator(".memory-card").filter({ hasText: "Disputed" }).count(), 1);
    await page.getByRole("button", { name: "Approve", exact: true }).click();
    await page.getByText("Active · retrievable", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Remove", exact: true }).click();
    await page.getByText("Forgotten · excluded", { exact: true }).waitFor();
    assert.equal(await page.locator("#memory-inspector-statement").innerText(), "[forgotten]");
    await page.locator(".forget-details summary").click();
    assert.match(await page.getByText(/current audit event remains until cryptographic erasure/i).innerText(), /compaction/);

    await page.keyboard.press("Meta+7");
    await page.getByRole("heading", { name: "Integrations", level: 1 }).waitFor();
    await page.getByRole("button", { name: "Review permissions" }).click();
    await page.getByRole("heading", { name: /You stay in control/ }).waitFor();
    assert.match(await page.getByRole("listitem").filter({ hasText: "Idea analyzer" }).innerText(), /available/i);
    assert.match(await page.getByRole("listitem").filter({ hasText: "Local tool bridge" }).innerText(), /available/i);
    assert.match(await page.getByRole("listitem").filter({ hasText: "OpenCut video tools" }).innerText(), /not available/i);
    assert.match(await page.getByRole("listitem").filter({ hasText: "Brief review procedure" }).innerText(), /waiting for trust/i);
    await page.locator("#tool-pack-inspector > summary").click();
    assert.equal(await page.locator("#tool-pack-gates li").count(), 11);
    assert.match(await page.locator("#tool-pack-gates li").filter({ hasText: "Immutable source" }).innerText(), /pass/i);
    assert.match(await page.locator("#tool-pack-gates li").filter({ hasText: "Stable supported interface" }).innerText(), /block/i);
    assert.equal(await page.getByRole("button", { name: "Activation blocked" }).isDisabled(), true);
    await page.locator("#tool-pack-inspector").getByRole("button", { name: "Recheck" }).click();
    assert.match(await page.locator("#tool-pack-decision").innerText(), /No code, adapter, capability, converter, skill, or UI contribution/i);
    await page.locator("#skill-inspector > summary").click();
    assert.equal(await page.locator("#skill-gates li").count(), 11);
    assert.equal(await page.locator("#skill-gates li").filter({ hasText: "Immutable source" }).getByText("Pass", { exact: true }).count(), 1);
    assert.equal(await page.locator("#skill-gates li").filter({ hasText: "Run-specific invocation authority" }).getByText("Pass", { exact: true }).count(), 1);
    await page.locator("#skill-inspector").getByRole("button", { name: "Recheck" }).click();
    assert.equal(await page.getByRole("button", { name: "Trust this version" }).isEnabled(), true);
    await page.getByRole("button", { name: "Trust this version" }).click();
    await page.getByRole("button", { name: "Version trusted" }).waitFor();
    assert.equal(await page.getByRole("button", { name: "Version trusted" }).isDisabled(), true);
    assert.match(await page.locator("#skill-decision").innerText(), /no direct invocation endpoint/i);
    const trustedSkillSnapshot = await page.evaluate(() => window.clarkDesktop.getHarnessState());
    assert.equal(trustedSkillSnapshot.skills[0].state, "active");
    assert.deepEqual(trustedSkillSnapshot.skills[0].trustedPermissionScopes, ["capability.clark.idea.inspect.mcp", "action.local_transform"]);
    assert.equal(boundary.apiKeys.includes("invokeSkill"), false);
    assert.equal(await page.getByText(/Publishing is not available yet/).count(), 1);

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

    await electronApp.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setBounds({ x: 120, y: 120, width: 780, height: 560 }));
    await new Promise((resolve) => setTimeout(resolve, 250));
    const minimumLayout = await page.evaluate(() => {
      const visibleButtons = [...document.querySelectorAll("button")].filter((button) => button.getClientRects().length > 0);
      const formControls = [...document.querySelectorAll("input, select, textarea")];
      const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
      return {
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        workspaceOverflow: document.querySelector("#workspace").scrollWidth - document.querySelector("#workspace").clientWidth,
        minimumButtonHeight: Math.min(...visibleButtons.map((button) => button.getBoundingClientRect().height)),
        unlabeledControls: formControls.filter((control) => control.labels?.length === 0).map((control) => control.id),
        duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index)
      };
    });
    assert.ok(minimumLayout.documentOverflow <= 1, `Document overflows by ${minimumLayout.documentOverflow}px at minimum width`);
    assert.ok(minimumLayout.workspaceOverflow <= 1, `Workspace overflows by ${minimumLayout.workspaceOverflow}px at minimum width`);
    assert.ok(minimumLayout.minimumButtonHeight >= 40, `Smallest visible button is ${minimumLayout.minimumButtonHeight}px high`);
    assert.deepEqual(minimumLayout.unlabeledControls, []);
    assert.deepEqual(minimumLayout.duplicateIds, []);

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
    await restoredPage.getByRole("heading", { name: "Integrations", level: 1 }).waitFor();
    const restoredBounds = await electronApp.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].getBounds());
    assert.equal(restoredBounds.width, 940);
    assert.equal(restoredBounds.height, 640);
    await restoredPage.keyboard.press("Meta+1");
    await restoredPage.getByText("Approved", { exact: true }).waitFor();
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
    await page.getByText(/Saved locally · \d+ updates/).waitFor();
    await page.getByRole("button", { name: "Shape this idea" }).click();

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

    await page.locator("#run-state").filter({ hasText: "Waiting for review" }).waitFor({ timeout: 10_000 });
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
