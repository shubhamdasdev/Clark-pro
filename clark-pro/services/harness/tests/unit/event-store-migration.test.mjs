import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { EventStore } from "../../src/event-store.mjs";

test("schema v1 databases migrate additively to capability runtime schema v2", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "clark-db-migration-"));
  const databasePath = path.join(directory, "clark.db");
  const legacy = new DatabaseSync(databasePath);
  legacy.exec(`
    CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL) STRICT;
    INSERT INTO metadata(key, value) VALUES ('schema_version', '1');
    CREATE TABLE runs (
      run_id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL, project_id TEXT NOT NULL, loop_id TEXT NOT NULL,
      loop_revision TEXT NOT NULL, plan_hash TEXT NOT NULL, state TEXT NOT NULL, active_step_id TEXT,
      idea_artifact_id TEXT NOT NULL, idea_version_id TEXT NOT NULL, analysis_artifact_id TEXT, draft_artifact_id TEXT, draft_version_id TEXT,
      approval_id TEXT, approval_state TEXT, recovered_from_checkpoint INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL
    ) STRICT;
  `);
  legacy.close();
  let store;
  try {
    store = new EventStore(databasePath);
    assert.equal(store.database.prepare("SELECT value FROM metadata WHERE key = 'schema_version'").get().value, "2");
    const columns = store.database.prepare("PRAGMA table_info(runs)").all().map((column) => column.name);
    assert.equal(columns.includes("analysis_artifact_id"), true);
    assert.equal(columns.includes("analysis_version_id"), true);
    assert.equal(store.database.prepare("SELECT COUNT(*) AS count FROM capabilities").get().count, 0);
    assert.equal(store.database.prepare("SELECT COUNT(*) AS count FROM bridge_clients").get().count, 0);
    assert.equal(store.journalMode, "wal");
  } finally {
    store?.close();
    await rm(directory, { recursive: true, force: true });
  }
});
