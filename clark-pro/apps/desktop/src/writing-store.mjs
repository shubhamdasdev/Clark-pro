import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const MAX_TITLE_LENGTH = 180;
const MAX_BODY_LENGTH = 200_000;
export const CONTENT_CHANNELS = Object.freeze(["LinkedIn", "X", "Instagram", "YouTube", "Newsletter"]);

function validScheduleDate(value) {
  if (value === "") return true;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function normalizedPlan(plan = {}) {
  const scheduledFor = plan.scheduledFor ?? "";
  const channel = plan.channel ?? "LinkedIn";
  if (!validScheduleDate(scheduledFor)) throw new TypeError("Publish date must be a valid calendar date");
  if (!CONTENT_CHANNELS.includes(channel)) throw new TypeError("Choose a supported content channel");
  return { scheduledFor, channel };
}

function clone(value) {
  return structuredClone(value);
}

function validDraft(value) {
  return value && typeof value === "object" && typeof value.id === "string" &&
    typeof value.title === "string" && typeof value.body === "string" &&
    typeof value.createdAt === "string" && typeof value.updatedAt === "string" &&
    (value.plan === undefined || (() => {
      try { normalizedPlan(value.plan); return true; } catch { return false; }
    })());
}

export function contentHash(value) {
  return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
}

export class WritingStore {
  constructor(filePath, { now = () => new Date().toISOString(), idFactory = () => randomUUID() } = {}) {
    if (!path.isAbsolute(filePath)) throw new TypeError("Writing store path must be absolute");
    this.filePath = filePath;
    this.now = now;
    this.idFactory = idFactory;
  }

  list() {
    return this.read().sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)).map(clone);
  }

  get(draftId) {
    const draft = this.read().find((candidate) => candidate.id === draftId);
    return draft ? clone(draft) : undefined;
  }

  create() {
    const now = this.now();
    const draft = {
      id: `draft.${this.idFactory()}`,
      title: "Untitled draft",
      body: "",
      plan: { scheduledFor: "", channel: "LinkedIn" },
      createdAt: now,
      updatedAt: now
    };
    const drafts = this.read();
    drafts.push(draft);
    this.write(drafts);
    return clone(draft);
  }

  save({ draftId, title, body, scheduledFor, channel }) {
    this.assertDraftInput({ draftId, title, body });
    const drafts = this.read();
    const index = drafts.findIndex((candidate) => candidate.id === draftId);
    if (index < 0) throw new TypeError("Writing draft does not exist");
    const existing = drafts[index];
    const draft = {
      ...existing,
      title: title.trim() || "Untitled draft",
      body: body.replace(/\r\n?/g, "\n"),
      plan: normalizedPlan({
        scheduledFor: scheduledFor ?? existing.plan?.scheduledFor ?? "",
        channel: channel ?? existing.plan?.channel ?? "LinkedIn"
      }),
      updatedAt: this.now()
    };
    drafts[index] = draft;
    this.write(drafts);
    return clone(draft);
  }

  markExported({ draftId, exportFileName, exportedAt = this.now(), markdownHash }) {
    const drafts = this.read();
    const index = drafts.findIndex((candidate) => candidate.id === draftId);
    if (index < 0) throw new TypeError("Writing draft does not exist");
    if (typeof exportFileName !== "string" || !/^AI-Memory\/Content\/(?:Unscheduled|\d{4}\/\d{4}-\d{2})\/(?:\d{4}-\d{2}-\d{2}--)?draft\.[a-z0-9-]+\.md$/i.test(exportFileName)) throw new TypeError("Invalid Obsidian export name");
    if (typeof markdownHash !== "string" || !/^sha256:[a-f0-9]{64}$/.test(markdownHash)) throw new TypeError("Invalid Obsidian export hash");
    drafts[index] = {
      ...drafts[index],
      obsidianExport: { fileName: exportFileName, exportedAt, markdownHash }
    };
    this.write(drafts);
    return clone(drafts[index]);
  }

  assertDraftInput({ draftId, title, body }) {
    if (typeof draftId !== "string" || !/^draft\.[a-z0-9-]+$/i.test(draftId)) throw new TypeError("Invalid writing draft");
    if (typeof title !== "string" || title.length > MAX_TITLE_LENGTH) throw new TypeError(`Title must be at most ${MAX_TITLE_LENGTH} characters`);
    if (typeof body !== "string" || body.length > MAX_BODY_LENGTH) throw new TypeError(`Draft must be at most ${MAX_BODY_LENGTH} characters`);
  }

  read() {
    try {
      const parsed = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
      if (!Array.isArray(parsed) || !parsed.every(validDraft)) throw new TypeError("Writing store is invalid");
      return parsed;
    } catch (error) {
      if (error?.code === "ENOENT") return [];
      throw error;
    }
  }

  write(drafts) {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true, mode: 0o700 });
    const temporary = `${this.filePath}.${process.pid}.${randomUUID()}.tmp`;
    const handle = fs.openSync(temporary, "wx", 0o600);
    try {
      fs.writeFileSync(handle, `${JSON.stringify(drafts, null, 2)}\n`, "utf8");
      fs.fsyncSync(handle);
    } finally {
      fs.closeSync(handle);
    }
    try {
      fs.renameSync(temporary, this.filePath);
    } catch (error) {
      fs.rmSync(temporary, { force: true });
      throw error;
    }
  }
}
