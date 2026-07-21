import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { ObsidianVault, renderObsidianMarkdown } from "../../src/obsidian-vault.mjs";
import { WritingStore } from "../../src/writing-store.mjs";

async function fixture() {
  const directory = await mkdtemp(path.join(os.tmpdir(), "clark-writing-"));
  const now = () => "2026-07-21T12:00:00.000Z";
  let sequence = 0;
  const store = new WritingStore(path.join(directory, "state", "drafts.json"), {
    now,
    idFactory: () => `00000000-0000-4000-8000-${String(++sequence).padStart(12, "0")}`
  });
  return { directory, store, now };
}

test("writing drafts save atomically and keep the draft contract bounded", async () => {
  const { directory, store } = await fixture();
  try {
    const draft = store.create();
    const saved = store.save({ draftId: draft.id, title: "A clearer creator loop", body: "First paragraph.\r\n\r\nSecond paragraph." });
    assert.equal(saved.title, "A clearer creator loop");
    assert.equal(saved.body, "First paragraph.\n\nSecond paragraph.");
    assert.equal(store.list().length, 1);
    assert.match(await readFile(path.join(directory, "state", "drafts.json"), "utf8"), /A clearer creator loop/);
    assert.throws(() => store.save({ draftId: draft.id, title: "x".repeat(181), body: "" }), /Title must be/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("Obsidian exporter only writes a Clark-owned Markdown file inside a selected vault", async () => {
  const { directory, store } = await fixture();
  try {
    const vaultDirectory = path.join(directory, "Creator notes");
    await mkdir(path.join(vaultDirectory, ".obsidian"), { recursive: true });
    const vault = new ObsidianVault(path.join(directory, "state", "obsidian.json"));
    assert.deepEqual(vault.connect(vaultDirectory), { connected: true, vaultName: "Creator notes" });
    const draft = store.save({ draftId: store.create().id, title: "Launch plan", body: "Make the opening specific." });
    const exported = vault.exportDraft(draft);
    assert.match(exported.fileName, /^Clark Pro\/draft\./);
    const output = await readFile(path.join(vaultDirectory, exported.fileName), "utf8");
    assert.equal(output, renderObsidianMarkdown(draft));
    assert.match(output, /clark_draft_id: draft\./);
    const saved = store.markExported({ draftId: draft.id, exportFileName: exported.fileName, markdownHash: exported.markdownHash });
    assert.equal(saved.obsidianExport.fileName, exported.fileName);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("Obsidian exporter rejects unowned files and symlink escape attempts", async () => {
  const { directory, store } = await fixture();
  try {
    const vaultDirectory = path.join(directory, "Vault");
    await mkdir(path.join(vaultDirectory, ".obsidian"), { recursive: true });
    const vault = new ObsidianVault(path.join(directory, "state", "obsidian.json"));
    vault.connect(vaultDirectory);
    const draft = store.create();
    const exportDirectory = path.join(vaultDirectory, "Clark Pro");
    await mkdir(exportDirectory);
    const target = path.join(exportDirectory, `draft.${draft.id.slice("draft.".length)}.md`);
    await import("node:fs/promises").then(({ writeFile }) => writeFile(target, "# Someone else's note\n"));
    assert.throws(() => vault.exportDraft(draft), /did not create/);
    await rm(target);
    await rm(exportDirectory, { recursive: true });
    await symlink(path.join(directory, "outside"), exportDirectory);
    assert.throws(() => vault.exportDraft(draft), /unavailable or unsafe/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
