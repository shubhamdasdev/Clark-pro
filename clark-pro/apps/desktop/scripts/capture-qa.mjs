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
  await page.screenshot({ path: path.join(outputDirectory, "focus.png") });
  await page.keyboard.press("Meta+2");
  await page.getByRole("heading", { name: "Canvas", level: 1 }).waitFor();
  await page.screenshot({ path: path.join(outputDirectory, "canvas.png") });
  await page.keyboard.press("Meta+7");
  await page.getByRole("heading", { name: "Connections", level: 1 }).waitFor();
  await page.screenshot({ path: path.join(outputDirectory, "connections.png") });
  console.log(outputDirectory);
} finally {
  if (electronApp) await electronApp.close().catch(() => {});
  await rm(userData, { recursive: true, force: true });
}
