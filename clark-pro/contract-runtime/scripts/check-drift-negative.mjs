import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "clark-contract-drift-"));
const schemas = path.join(temp, "schemas");
const generated = path.join(temp, "generated");
try {
  fs.cpSync(path.join(root, "..", "contracts", "schemas"), schemas, { recursive: true });
  fs.cpSync(path.join(root, "src", "generated"), generated, { recursive: true });
  const target = path.join(schemas, "domain-event.schema.json");
  const schema = JSON.parse(fs.readFileSync(target, "utf8"));
  schema.description = "Hostile ungenerated schema drift";
  fs.writeFileSync(target, `${JSON.stringify(schema, null, 2)}\n`);
  const result = spawnSync(process.execPath, [path.join(root, "scripts", "generate.mjs"), "--check", "--schemas", schemas, "--output", generated], { encoding: "utf8" });
  if (result.status === 0 || !result.stderr.includes("domain-event.ts")) throw new Error(`Drift mutation was not rejected: ${result.stdout}${result.stderr}`);
  console.log(JSON.stringify({ mutation: "domain-event.schema.json", expectedDrift: "domain-event.ts", rejected: true, status: "pass" }, null, 2));
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
