import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";

export const DEFAULT_WINDOW_BOUNDS = Object.freeze({
  width: 1180,
  height: 760
});

export const MIN_WINDOW_BOUNDS = Object.freeze({
  width: 780,
  height: 560
});

function finiteInteger(value) {
  return Number.isFinite(value) ? Math.round(value) : undefined;
}

export function normalizeWindowBounds(candidate, workArea) {
  const area = {
    x: finiteInteger(workArea?.x) ?? 0,
    y: finiteInteger(workArea?.y) ?? 0,
    width: Math.max(MIN_WINDOW_BOUNDS.width, finiteInteger(workArea?.width) ?? 1440),
    height: Math.max(MIN_WINDOW_BOUNDS.height, finiteInteger(workArea?.height) ?? 900)
  };

  const width = Math.min(
    Math.max(finiteInteger(candidate?.width) ?? DEFAULT_WINDOW_BOUNDS.width, MIN_WINDOW_BOUNDS.width),
    area.width
  );
  const height = Math.min(
    Math.max(finiteInteger(candidate?.height) ?? DEFAULT_WINDOW_BOUNDS.height, MIN_WINDOW_BOUNDS.height),
    area.height
  );
  const fallbackX = area.x + Math.round((area.width - width) / 2);
  const fallbackY = area.y + Math.round((area.height - height) / 2);
  const x = Math.min(
    Math.max(finiteInteger(candidate?.x) ?? fallbackX, area.x),
    area.x + area.width - width
  );
  const y = Math.min(
    Math.max(finiteInteger(candidate?.y) ?? fallbackY, area.y),
    area.y + area.height - height
  );

  return { x, y, width, height };
}

export async function readWindowState(filePath) {
  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    if (error?.code === "ENOENT" || error instanceof SyntaxError) return {};
    throw error;
  }
}

export async function writeWindowState(filePath, state) {
  await mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 });
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
  await rename(temporaryPath, filePath);
}

export function writeWindowStateSync(filePath, state) {
  mkdirSync(path.dirname(filePath), { recursive: true, mode: 0o700 });
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  writeFileSync(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
  renameSync(temporaryPath, filePath);
}
