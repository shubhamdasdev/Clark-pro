import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
assert(duplicateIds.length === 0, `Duplicate IDs: ${[...new Set(duplicateIds)].join(", ")}`);

for (const requiredId of ["cs-view-connections", "cs-tool-pack-proof", "cs-tool-pack-proof-title", "cs-tool-pack-receipt", "cs-skill-proof-title", "cs-skill-receipt", "cs-bridge-proof"]) {
  assert(ids.includes(requiredId), `Missing required prototype element ${requiredId}`);
}
for (const phrase of [
  "Weekly Reflection · Class A",
  "Caption Check · Class B",
  "Native package · Class C",
  "skill request ∩ installed trust ∩ workspace policy ∩ run approval",
  "19 / 19 pass",
  "Production still requires pinned components/WIT"
]) assert(html.includes(phrase), `Missing governed skill proof: ${phrase}`);
for (const phrase of [
  "OpenCut is promising, but roadmap code is not a plugin",
  "Blocked upstream",
  "0 adapters · 0 capabilities · 0 skills · 0 converters · 0 UI contributions",
  "MCP → headless CLI → HTTP → library → WASM → sidecar → file handoff → browser → fork",
  "11 / 11 reject",
  "does not bundle, execute, or browser-automate this candidate today"
]) assert(html.includes(phrase), `Missing governed Tool Pack proof: ${phrase}`);
assert(/<details id="cs-skill-receipt">[\s\S]*?<summary>Inspect effective permission and sandbox receipt<\/summary>/.test(html), "Skill receipt is not a native disclosure control");
assert(/<details id="cs-tool-pack-receipt">[\s\S]*?<summary>Inspect reuse and activation decision<\/summary>/.test(html), "Tool Pack receipt is not a native disclosure control");
assert(!/<(?:div|span)[^>]+(?:onclick|tabindex)=/i.test(html), "Non-semantic clickable element found");

const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .filter((script) => script.trim());
for (const script of inlineScripts) new Function(script);

console.log(JSON.stringify({
  ids: ids.length,
  duplicateIds: 0,
  governedSkillClasses: 3,
  governedToolPacks: 1,
  toolPackActivationAttacksShown: 11,
  hostileRuntimeCasesShown: 19,
  inlineScriptsParsed: inlineScripts.length,
  status: "pass"
}, null, 2));
