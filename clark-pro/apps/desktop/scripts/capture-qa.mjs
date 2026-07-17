import { mkdir, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { _electron as electron } from "playwright";

const appDirectory = path.resolve(import.meta.dirname, "..");
const outputDirectory = path.join(appDirectory, "screenshots");
const userData = await mkdtemp(path.join(os.tmpdir(), "clark-desktop-capture-"));
let electronApp;

try {
  await mkdir(outputDirectory, { recursive: true });
  electronApp = await electron.launch({
    args: [appDirectory],
    env: { ...process.env, CLARK_E2E: "1", CLARK_TEST_USER_DATA: userData }
  });
  const page = await electronApp.firstWindow();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("heading", { name: "Today", level: 1 }).waitFor();
  await page.getByText(/Saved locally · \d+ updates/).waitFor();
  await page.getByRole("button", { name: "Shape this idea" }).click();
  await page.locator("#run-state").filter({ hasText: "Waiting for review" }).waitFor();
  await page.locator("#idea-input").fill("Build a local-first creator operating system for solo professional creators that replaces manual copy and paste across multiple tools with plugin-first open-source workflows, while creator approval controls memory and publication. Unlike closed suites, providers stay replaceable. Reach creators through an open-source plugin marketplace and charge a subscription after a pilot measures weekly time saved, willingness to pay, and repeat use.");
  await page.locator("#revision-reason").fill("Narrow the user and add the workaround, wedge, distribution, payment model, and evidence test.");
  await page.getByRole("button", { name: "Shape a new revision" }).click();
  await page.waitForFunction(() => document.querySelector("#run-integrity")?.textContent?.toLowerCase().includes("revision 2 ·"));
  await page.locator("#workspace").evaluate((element) => { element.scrollTop = 0; });
  await page.screenshot({ path: path.join(outputDirectory, "focus.png") });
  await page.locator(".harness-panel").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(outputDirectory, "focus-harness.png") });
  await page.keyboard.press("Meta+2");
  await page.getByRole("heading", { name: "Shape", level: 1 }).waitFor();
  await page.screenshot({ path: path.join(outputDirectory, "canvas.png") });
  await page.keyboard.press("Meta+3");
  await page.getByRole("heading", { name: "Review", level: 1 }).waitFor();
  await page.screenshot({ path: path.join(outputDirectory, "review.png") });
  await page.getByRole("button", { name: "Decide on version 2" }).click();
  await page.getByRole("dialog").waitFor();
  await page.screenshot({ path: path.join(outputDirectory, "review-decision.png") });
  await page.getByRole("button", { name: "Cancel" }).click();
  await page.keyboard.press("Meta+6");
  await page.getByRole("heading", { name: "Knowledge", level: 1 }).waitFor();
  await page.getByRole("button", { name: "Send for review" }).click();
  await page.getByText("Proposed · excluded", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Approve", exact: true }).click();
  await page.getByText("Active · retrievable", { exact: true }).waitFor();
  await page.locator("#memory-correction").fill("Creator prefers operational explanations that separate observed evidence from aspirational claims.");
  await page.getByRole("button", { name: "Save correction for review" }).click();
  await page.getByText("2 claims", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Approve", exact: true }).click();
  await page.getByText("Active · retrievable", { exact: true }).waitFor();
  await page.locator("#memory-query").fill("observed evidence aspirational");
  await page.getByRole("button", { name: "Find approved knowledge" }).click();
  await page.getByText(/1 approved claim · This view only/i).waitFor();
  await page.screenshot({ path: path.join(outputDirectory, "memory-detail.png") });
  await page.locator("#workspace").evaluate((element) => { element.scrollTop = 0; });
  await page.screenshot({ path: path.join(outputDirectory, "memory.png") });
  await page.keyboard.press("Meta+7");
  await page.getByRole("heading", { name: "Integrations", level: 1 }).waitFor();
  await page.screenshot({ path: path.join(outputDirectory, "connections.png") });
  await page.locator("#tool-pack-inspector > summary").click();
  await page.locator("#tool-pack-inspector").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(outputDirectory, "connections-tool-pack.png") });
  await page.locator("#skill-inspector > summary").click();
  await page.locator("#skill-inspector").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(outputDirectory, "connections-skill-quarantine.png") });
  await page.getByRole("button", { name: "Trust this version" }).click();
  await page.getByRole("button", { name: "Version trusted" }).waitFor();
  await page.screenshot({ path: path.join(outputDirectory, "connections-skill.png") });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.keyboard.press("Meta+3");
  await page.getByRole("heading", { name: "Review", level: 1 }).waitFor();
  await page.locator("#workspace").evaluate((element) => { element.scrollTop = 0; });
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(outputDirectory, "review-dark.png") });
  await page.keyboard.press("Meta+1");
  await page.getByRole("heading", { name: "Today", level: 1 }).waitFor();
  await page.locator("#workspace").evaluate((element) => { element.scrollTop = 0; });
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(outputDirectory, "today-dark.png") });
  console.log(outputDirectory);
} finally {
  if (electronApp) await electronApp.close().catch(() => {});
  await rm(userData, { recursive: true, force: true });
}
