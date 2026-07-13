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
  await page.getByRole("heading", { name: "Focus", level: 1 }).waitFor();
  await page.getByText(/Ready · \d+ events/).waitFor();
  await page.getByRole("button", { name: "Structure idea" }).click();
  await page.getByText("Waiting approval", { exact: true }).waitFor();
  await page.locator("#idea-input").fill("Build a local-first creator operating system for solo professional creators that replaces manual copy and paste across multiple tools with plugin-first open-source workflows, while creator approval controls memory and publication. Unlike closed suites, providers stay replaceable. Reach creators through an open-source plugin marketplace and charge a subscription after a pilot measures weekly time saved, willingness to pay, and repeat use.");
  await page.locator("#revision-reason").fill("Narrow the user and add the workaround, wedge, distribution, payment model, and evidence test.");
  await page.getByRole("button", { name: "Create stronger revision" }).click();
  await page.locator("#run-integrity").filter({ hasText: /revision 2 ·/i }).waitFor();
  await page.screenshot({ path: path.join(outputDirectory, "focus.png") });
  await page.locator(".harness-panel").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(outputDirectory, "focus-harness.png") });
  await page.keyboard.press("Meta+2");
  await page.getByRole("heading", { name: "Canvas", level: 1 }).waitFor();
  await page.screenshot({ path: path.join(outputDirectory, "canvas.png") });
  await page.keyboard.press("Meta+6");
  await page.getByRole("heading", { name: "Memory", level: 1 }).waitFor();
  await page.getByRole("button", { name: "Propose memory" }).click();
  await page.getByText("Proposed · excluded", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Promote", exact: true }).click();
  await page.getByText("Active · retrievable", { exact: true }).waitFor();
  await page.locator("#memory-correction").fill("Creator prefers operational explanations that separate observed evidence from aspirational claims.");
  await page.getByRole("button", { name: "Propose corrected claim" }).click();
  await page.getByText("2 immutable claims", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Promote", exact: true }).click();
  await page.getByText("Active · retrievable", { exact: true }).waitFor();
  await page.locator("#memory-query").fill("observed evidence aspirational");
  await page.getByRole("button", { name: "Retrieve active claims" }).click();
  await page.getByText(/1 active claim · Creator view/i).waitFor();
  await page.screenshot({ path: path.join(outputDirectory, "memory-detail.png") });
  await page.locator("#workspace").evaluate((element) => { element.scrollTop = 0; });
  await page.screenshot({ path: path.join(outputDirectory, "memory.png") });
  await page.keyboard.press("Meta+7");
  await page.getByRole("heading", { name: "Connections", level: 1 }).waitFor();
  await page.screenshot({ path: path.join(outputDirectory, "connections.png") });
  console.log(outputDirectory);
} finally {
  if (electronApp) await electronApp.close().catch(() => {});
  await rm(userData, { recursive: true, force: true });
}
