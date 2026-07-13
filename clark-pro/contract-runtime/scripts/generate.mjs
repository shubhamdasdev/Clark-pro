import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { compileFromFile } from "json-schema-to-typescript";

const require = createRequire(import.meta.url);
const generatorPath = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(generatorPath), "..");
const argument = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : path.resolve(process.argv[index + 1]);
};
const schemasDir = argument("--schemas", path.join(root, "..", "contracts", "schemas"));
const outputDir = argument("--output", path.join(root, "src", "generated"));
const check = process.argv.includes("--check");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const generatorVersion = require("json-schema-to-typescript/package.json").version;
const typescriptVersion = require("typescript/package.json").version;

const schemaFiles = fs.readdirSync(schemasDir).filter((name) => name.endsWith(".json")).sort();
const schemaFileSet = new Set(schemaFiles);
const clarkSchemaOrigin = "https://schemas.clark.pro/v1/";
const offlineClarkResolver = {
  order: 1,
  canRead: ({ url }) => url.startsWith(clarkSchemaOrigin),
  read: ({ url }) => {
    const filename = path.basename(new URL(url).pathname);
    if (!schemaFileSet.has(filename)) throw new Error(`Offline Clark schema resolver rejected ${url}`);
    return fs.readFileSync(path.join(schemasDir, filename));
  }
};
const outputs = new Map();
const manifest = {
  schemaVersion: 1,
  source: "../contracts/schemas",
  generator: { package: "json-schema-to-typescript", version: generatorVersion, implementationSha256: sha256(fs.readFileSync(generatorPath)) },
  compiler: { package: "typescript", version: typescriptVersion },
  resolution: { clarkSchemaOrigin, network: false },
  files: []
};

for (const filename of schemaFiles) {
  const schemaPath = path.join(schemasDir, filename);
  const schemaBytes = fs.readFileSync(schemaPath);
  const schemaHash = sha256(schemaBytes);
  const outputName = filename.replace(/\.schema\.json$/, ".ts");
  const bannerComment = `/* eslint-disable */\n/**\n * GENERATED FILE — DO NOT EDIT.\n * Source: contracts/schemas/${filename}\n * Source SHA-256: ${schemaHash}\n * Generator: json-schema-to-typescript@${generatorVersion}\n */`;
  const generated = await compileFromFile(schemaPath, {
    cwd: schemasDir,
    $refOptions: { resolve: { clark: offlineClarkResolver, http: false } },
    bannerComment,
    additionalProperties: false,
    declareExternallyReferenced: true,
    enableConstEnums: false,
    unreachableDefinitions: true,
    strictIndexSignatures: true,
    style: { singleQuote: false, semi: true, tabWidth: 2, trailingComma: "none" }
  });
  outputs.set(outputName, generated);
  manifest.files.push({ source: filename, sourceSha256: schemaHash, generated: outputName, generatedSha256: sha256(generated) });
}

const namespaceName = (filename) => filename
  .replace(/\.schema\.json$/, "")
  .split(/[^A-Za-z0-9]+/)
  .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
  .join("");
const indexSource = `${schemaFiles.map((filename) => `export type * as ${namespaceName(filename)} from "./${filename.replace(/\.schema\.json$/, ".js")}";`).join("\n")}\n`;
outputs.set("index.ts", indexSource);
const manifestSource = `${JSON.stringify(manifest, null, 2)}\n`;
outputs.set("manifest.json", manifestSource);

const expectedNames = [...outputs.keys()].sort();
const currentNames = fs.existsSync(outputDir) ? fs.readdirSync(outputDir).filter((name) => name.endsWith(".ts") || name === "manifest.json").sort() : [];
const drift = [];
for (const name of expectedNames) {
  const currentPath = path.join(outputDir, name);
  const current = fs.existsSync(currentPath) ? fs.readFileSync(currentPath, "utf8") : null;
  if (current !== outputs.get(name)) drift.push(name);
}
for (const name of currentNames) if (!outputs.has(name)) drift.push(name);

if (check) {
  if (drift.length) {
    process.stderr.write(`Generated contract drift: ${[...new Set(drift)].sort().join(", ")}\n`);
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({ schemas: schemaFiles.length, generatedFiles: outputs.size, generatorVersion, typescriptVersion, drift: 0, status: "pass" }, null, 2));
  }
} else {
  fs.mkdirSync(outputDir, { recursive: true });
  for (const [name, content] of outputs) fs.writeFileSync(path.join(outputDir, name), content);
  for (const name of currentNames) if (!outputs.has(name)) fs.rmSync(path.join(outputDir, name));
  console.log(JSON.stringify({ schemas: schemaFiles.length, generatedFiles: outputs.size, generatorVersion, typescriptVersion, writtenTo: path.relative(root, outputDir), status: "generated" }, null, 2));
}
