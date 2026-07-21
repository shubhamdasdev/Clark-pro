import test from "node:test";
import assert from "node:assert/strict";
import { access, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { _electron as electron } from "playwright";

const appDirectory = path.resolve(import.meta.dirname, "../..");
const executablePath = path.join(appDirectory, "dist", "mac-arm64", "Clark Pro.app", "Contents", "MacOS", "Clark Pro");

test("packaged app contains and executes the supervised Harness", async () => {
  await access(executablePath);
  const userData = await mkdtemp(path.join(os.tmpdir(), "clark-packaged-harness-"));
  let electronApp;
  try {
    electronApp = await electron.launch({
      executablePath,
      env: { ...process.env, CLARK_E2E: "1", CLARK_TEST_USER_DATA: userData }
    });
    const page = await electronApp.firstWindow();
    await page.getByText(/Saved locally · \d+ updates/).waitFor({ timeout: 10_000 });
    await page.getByRole("button", { name: "Shape this idea" }).click();
    await page.locator("#run-state").filter({ hasText: "Waiting for review" }).waitFor({ timeout: 10_000 });
    const snapshot = await page.evaluate(() => window.clarkDesktop.getHarnessState());
    assert.equal(snapshot.available, true);
    assert.equal(snapshot.database.journalMode, "wal");
    assert.equal(snapshot.runs[0].state, "waiting_approval");
    assert.equal(snapshot.runs[0].analysis.kind, undefined);
    assert.equal(JSON.parse(snapshot.runs[0].analysis.text).kind, "idea_thesis_assessment");
    assert.equal(JSON.parse(snapshot.runs[0].analysis.text).evidenceState, "not_observed");
    assert.equal(snapshot.capabilities.find((capability) => capability.id === "clark.idea.inspect.mcp").state, "healthy");
    assert.equal(snapshot.toolPackages.length, 1);
    assert.equal(snapshot.toolPackages[0].toolPackageId, "clark.toolpack.opencut.rewrite");
    assert.equal(snapshot.toolPackages[0].state, "blocked_upstream");
    assert.equal(snapshot.toolPackages[0].installed, false);
    assert.equal(snapshot.toolPackages[0].activationEligible, false);
    assert.equal(snapshot.toolPackages[0].gates.length, 11);
    assert.equal(snapshot.capabilities.some((capability) => capability.id.includes("opencut")), false);
    assert.equal(snapshot.skills.length, 1);
    assert.equal(snapshot.skills[0].skillId, "clark.skill.evidence-brief-review");
    assert.equal(snapshot.skills[0].state, "quarantined");
    assert.equal(snapshot.skills[0].testStatus, "passed");
    assert.equal(snapshot.skills[0].activationEligible, true);
    assert.equal(snapshot.skills[0].gates.length, 11);
    assert.deepEqual(snapshot.skills[0].trustedPermissionScopes, []);
    assert.equal(snapshot.bridge.state, "ready");
    assert.equal("token" in snapshot.bridge, false);
    assert.match(snapshot.runs[0].draft.contentHash, /^sha256:[a-f0-9]{64}$/);
  } finally {
    if (electronApp) await electronApp.close().catch(() => {});
    await rm(userData, { recursive: true, force: true });
  }
});
