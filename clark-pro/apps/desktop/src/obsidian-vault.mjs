import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function hash(value) {
  return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
}

function writePrivateJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true, mode: 0o700 });
  const temporary = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  const handle = fs.openSync(temporary, "wx", 0o600);
  try {
    fs.writeFileSync(handle, `${JSON.stringify(value)}\n`, "utf8");
    fs.fsyncSync(handle);
  } finally {
    fs.closeSync(handle);
  }
  try {
    fs.renameSync(temporary, filePath);
  } catch (error) {
    fs.rmSync(temporary, { force: true });
    throw error;
  }
}

function within(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative && !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
}

function assertRegularDirectory(directory, label) {
  const stat = fs.lstatSync(directory);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new TypeError(`${label} must be a real directory`);
}

function dateParts(scheduledFor) {
  if (!scheduledFor) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(scheduledFor)) throw new TypeError("Publish date is invalid");
  const date = new Date(`${scheduledFor}T12:00:00.000Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== scheduledFor) throw new TypeError("Publish date is invalid");
  return { year: scheduledFor.slice(0, 4), month: scheduledFor.slice(0, 7), day: scheduledFor };
}

function draftPlan(draft) {
  const scheduledFor = draft.plan?.scheduledFor ?? "";
  const channel = draft.plan?.channel ?? "LinkedIn";
  if (!["LinkedIn", "X", "Instagram", "YouTube", "Newsletter"].includes(channel)) throw new TypeError("Content channel is invalid");
  return { scheduledFor, channel, date: dateParts(scheduledFor) };
}

function contentPathFor(draft) {
  const { date } = draftPlan(draft);
  const id = draft.id.slice("draft.".length);
  if (!date) return ["AI-Memory", "Content", "Unscheduled", `draft.${id}.md`];
  return ["AI-Memory", "Content", date.year, date.month, `${date.day}--draft.${id}.md`];
}

function ensureSafeDirectory(vaultPath, segments, label) {
  const directory = path.join(vaultPath, ...segments);
  if (!within(vaultPath, directory)) throw new TypeError(`${label} is outside the connected vault`);
  try {
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  } catch {
    throw new TypeError(`${label} is unavailable or unsafe`);
  }
  assertRegularDirectory(directory, label);
  const resolved = fs.realpathSync(directory);
  if (!within(vaultPath, resolved)) throw new TypeError(`${label} is outside the connected vault`);
  return resolved;
}

function assertOwnedFile(filePath, marker, message) {
  const stat = fs.lstatSync(filePath);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new TypeError(message);
  if (!fs.readFileSync(filePath, "utf8").includes(marker)) throw new TypeError(message);
}

function writeOwnedFile(directory, fileName, content, marker, message) {
  const destination = path.join(directory, fileName);
  if (!within(directory, destination)) throw new TypeError("Obsidian export path is invalid");
  if (fs.existsSync(destination)) assertOwnedFile(destination, marker, message);
  const temporary = path.join(directory, `.${fileName}.${process.pid}.${randomUUID()}.tmp`);
  const handle = fs.openSync(temporary, "wx", 0o600);
  try {
    fs.writeFileSync(handle, content, "utf8");
    fs.fsyncSync(handle);
  } finally {
    fs.closeSync(handle);
  }
  try {
    fs.renameSync(temporary, destination);
  } catch (error) {
    fs.rmSync(temporary, { force: true });
    throw error;
  }
  return destination;
}

function calendarMonthFromExport(fileName) {
  const match = /^AI-Memory\/Content\/\d{4}\/(\d{4}-\d{2})\//.exec(fileName ?? "");
  return match?.[1];
}

export function renderObsidianMarkdown(draft) {
  const title = draft.title.trim() || "Untitled draft";
  const body = draft.body.replace(/\r\n?/g, "\n").trimEnd();
  const { scheduledFor, channel } = draftPlan(draft);
  return `---\nclark_draft_id: ${draft.id}\nclark_updated_at: ${draft.updatedAt}\nclark_channel: ${channel}\nclark_scheduled_for: ${scheduledFor || "unscheduled"}\n---\n\n# ${title}\n\n${body}\n`;
}

export function renderMonthlyCalendar(month, drafts) {
  const entries = drafts
    .filter((draft) => draftPlan(draft).scheduledFor.startsWith(month) && draft.obsidianExport?.fileName)
    .sort((left, right) => left.plan.scheduledFor.localeCompare(right.plan.scheduledFor) || left.title.localeCompare(right.title));
  const lines = [
    "---",
    `clark_calendar: ${month}`,
    "clark_managed: true",
    "---",
    "",
    `# Content calendar · ${month}`,
    ""
  ];
  if (!entries.length) lines.push("No exported posts are scheduled for this month.");
  for (const draft of entries) lines.push(`- [ ] ${draft.plan.scheduledFor} · **${draft.plan.channel}** · [${draft.title || "Untitled draft"}](../Content/${draft.obsidianExport.fileName.split("/Content/")[1]})`);
  return `${lines.join("\n")}\n`;
}

export class ObsidianVault {
  constructor(connectionPath) {
    if (!path.isAbsolute(connectionPath)) throw new TypeError("Obsidian connection path must be absolute");
    this.connectionPath = connectionPath;
  }

  status() {
    try {
      const vaultPath = this.connectedVaultPath();
      return { connected: true, vaultName: path.basename(vaultPath) };
    } catch {
      return { connected: false };
    }
  }

  connect(vaultDirectory) {
    if (typeof vaultDirectory !== "string" || !path.isAbsolute(vaultDirectory)) throw new TypeError("Choose an Obsidian vault folder");
    const vaultPath = fs.realpathSync(vaultDirectory);
    assertRegularDirectory(vaultPath, "Obsidian vault");
    assertRegularDirectory(path.join(vaultPath, ".obsidian"), "Obsidian configuration");
    writePrivateJson(this.connectionPath, { vaultPath });
    return { connected: true, vaultName: path.basename(vaultPath) };
  }

  exportDraft(draft, { drafts = [] } = {}) {
    const vaultPath = this.connectedVaultPath();
    const relativePath = contentPathFor(draft);
    const directory = ensureSafeDirectory(vaultPath, relativePath.slice(0, -1), "AI-Memory content folder");
    const fileName = relativePath.at(-1);
    const markdown = renderObsidianMarkdown(draft);
    const outputPath = writeOwnedFile(directory, fileName, markdown, `clark_draft_id: ${draft.id}\n`, "Clark will not overwrite a linked, unowned, or non-file Obsidian note");
    const outputFileName = path.posix.join(...relativePath);
    const previousFileName = draft.obsidianExport?.fileName;
    if (previousFileName && previousFileName !== outputFileName && previousFileName.startsWith("AI-Memory/")) {
      const previousPath = path.join(vaultPath, ...previousFileName.split("/"));
      if (within(vaultPath, previousPath) && fs.existsSync(previousPath)) {
        assertOwnedFile(previousPath, `clark_draft_id: ${draft.id}\n`, "Clark will not remove an unowned Obsidian note");
        fs.unlinkSync(previousPath);
      }
    }
    const allDrafts = drafts.map((candidate) => candidate.id === draft.id ? { ...candidate, obsidianExport: { fileName: outputFileName } } : candidate);
    const months = new Set([draftPlan(draft).date?.month, calendarMonthFromExport(previousFileName)].filter(Boolean));
    const calendarDirectory = ensureSafeDirectory(vaultPath, ["AI-Memory", "Calendar"], "AI-Memory calendar folder");
    for (const month of months) {
      const calendar = renderMonthlyCalendar(month, allDrafts);
      writeOwnedFile(calendarDirectory, `${month}.md`, calendar, `clark_calendar: ${month}\n`, "Clark will not overwrite an unowned Obsidian calendar");
    }
    return { fileName: outputFileName, markdownHash: hash(markdown) };
  }

  connectedVaultPath() {
    const connection = JSON.parse(fs.readFileSync(this.connectionPath, "utf8"));
    if (!connection || typeof connection.vaultPath !== "string") throw new TypeError("No Obsidian vault is connected");
    const vaultPath = fs.realpathSync(connection.vaultPath);
    assertRegularDirectory(vaultPath, "Obsidian vault");
    assertRegularDirectory(path.join(vaultPath, ".obsidian"), "Obsidian configuration");
    return vaultPath;
  }
}
