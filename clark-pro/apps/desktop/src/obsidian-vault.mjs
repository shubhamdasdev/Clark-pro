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

export function renderObsidianMarkdown(draft) {
  const title = draft.title.trim() || "Untitled draft";
  const body = draft.body.replace(/\r\n?/g, "\n").trimEnd();
  return `---\nclark_draft_id: ${draft.id}\nclark_updated_at: ${draft.updatedAt}\n---\n\n# ${title}\n\n${body}\n`;
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

  exportDraft(draft) {
    const vaultPath = this.connectedVaultPath();
    const exportDirectory = path.join(vaultPath, "Clark Pro");
    try {
      fs.mkdirSync(exportDirectory, { recursive: true, mode: 0o700 });
    } catch {
      throw new TypeError("Clark Pro export folder is unavailable or unsafe");
    }
    assertRegularDirectory(exportDirectory, "Clark Pro export folder");
    const verifiedDirectory = fs.realpathSync(exportDirectory);
    if (!within(vaultPath, verifiedDirectory)) throw new TypeError("Obsidian export folder is outside the connected vault");

    const fileName = `draft.${draft.id.slice("draft.".length)}.md`;
    const outputPath = path.join(verifiedDirectory, fileName);
    if (!within(verifiedDirectory, outputPath)) throw new TypeError("Obsidian export path is invalid");
    const markdown = renderObsidianMarkdown(draft);
    if (fs.existsSync(outputPath)) {
      const stat = fs.lstatSync(outputPath);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new TypeError("Clark will not overwrite a linked or non-file Obsidian note");
      const existing = fs.readFileSync(outputPath, "utf8");
      if (!existing.includes(`clark_draft_id: ${draft.id}\n`)) throw new TypeError("Clark will not overwrite a note it did not create");
    }
    const temporary = path.join(verifiedDirectory, `.${fileName}.${process.pid}.${randomUUID()}.tmp`);
    const handle = fs.openSync(temporary, "wx", 0o600);
    try {
      fs.writeFileSync(handle, markdown, "utf8");
      fs.fsyncSync(handle);
    } finally {
      fs.closeSync(handle);
    }
    try {
      fs.renameSync(temporary, outputPath);
    } catch (error) {
      fs.rmSync(temporary, { force: true });
      throw error;
    }
    return { fileName: `Clark Pro/${fileName}`, markdownHash: hash(markdown) };
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
