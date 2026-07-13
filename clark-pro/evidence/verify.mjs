import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const clarkRoot = path.resolve(root, "..");
const read = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const unique = (values, label) => {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  assert(duplicates.length === 0, `${label} contains duplicates: ${[...new Set(duplicates)].join(", ")}`);
};

const requiredIds = [
  ...Array.from({ length: 10 }, (_, index) => `OBJ-${String(index + 1).padStart(2, "0")}`),
  ...Array.from({ length: 9 }, (_, index) => `CANVAS-${String(index + 1).padStart(2, "0")}`),
  ...Array.from({ length: 7 }, (_, index) => `BIZ-${String(index + 1).padStart(2, "0")}`),
  ...Array.from({ length: 8 }, (_, index) => `GROUND-${String(index + 1).padStart(2, "0")}`)
];
const completeResults = new Set(["verified", "contract_verified", "prototype_verified"]);
const pendingResults = new Set(["human_evidence_pending", "specified_not_verified", "missing"]);

const validateEntrySemantics = (entry) => {
  const passedKinds = new Set(entry.evidence.filter((item) => item.result === "pass").map((item) => item.kind));
  const missingKinds = entry.proofRequired.filter((kind) => !passedKinds.has(kind));
  if (completeResults.has(entry.result)) {
    assert(missingKinds.length === 0, `${entry.id} claims ${entry.result} without passing proof: ${missingKinds.join(", ")}`);
  }
  if (entry.result === "defined") {
    assert(passedKinds.has("design_document") || passedKinds.has("adr"), `${entry.id} claims defined without design/ADR evidence`);
  }
  if (pendingResults.has(entry.result)) {
    assert(missingKinds.length > 0, `${entry.id} is ${entry.result} but all required proof is already present; status must be reviewed`);
  }
  if (entry.result === "human_evidence_pending") {
    const humanKinds = new Set(["observed_session", "design_partner_record", "binding_action"]);
    assert(entry.proofRequired.some((kind) => humanKinds.has(kind)), `${entry.id} is human_evidence_pending without a human/commercial proof requirement`);
    assert(missingKinds.some((kind) => humanKinds.has(kind)), `${entry.id} claims human evidence pending but already contains all required human/commercial proof`);
  }
  if (entry.groundBlocking) {
    assert(entry.releaseTarget === "ground", `${entry.id} blocks Ground but targets ${entry.releaseTarget}`);
    assert(entry.result !== "defined", `${entry.id} cannot be Ground-blocking while only marked defined`);
  }
  for (const evidence of entry.evidence) {
    const resolved = path.resolve(clarkRoot, evidence.location);
    assert(resolved.startsWith(`${clarkRoot}${path.sep}`), `${entry.id} evidence escapes clark-pro: ${evidence.location}`);
    assert(fs.existsSync(resolved), `${entry.id} evidence path does not exist: ${evidence.location}`);
  }
  return { missingKinds };
};

const contractOutput = execFileSync(process.execPath, [path.join(clarkRoot, "contracts", "verify.mjs")], {
  cwd: path.join(clarkRoot, "contracts"),
  encoding: "utf8"
});
const contractResult = JSON.parse(contractOutput);
assert(contractResult.status === "pass", "Contract/schema verification did not pass");

const ledger = read("ground-ledger.json");
unique(ledger.entries.map((entry) => entry.id), "Ledger IDs");
assert(ledger.entries.length === requiredIds.length, `Expected ${requiredIds.length} ledger entries, found ${ledger.entries.length}`);
for (const id of requiredIds) assert(ledger.entries.some((entry) => entry.id === id), `Ledger is missing ${id}`);
for (const entry of ledger.entries) validateEntrySemantics(entry);

const invalidEntry = read("fixtures/negative-entry.verified-without-observation.json");
let negativeRejected = false;
try {
  validateEntrySemantics(invalidEntry);
} catch {
  negativeRejected = true;
}
assert(negativeRejected, "Fabricated verified-without-observation fixture was not rejected");

unique(ledger.signoff.requiredRoles, "Required signoff roles");
unique(ledger.signoff.approvals.map((approval) => approval.role), "Signoff approval roles");
for (const approval of ledger.signoff.approvals) {
  assert(ledger.signoff.requiredRoles.includes(approval.role), `Unexpected signoff role ${approval.role}`);
}

const openBlockers = ledger.entries.filter((entry) => entry.groundBlocking && !completeResults.has(entry.result));
if (ledger.gateState === "closed") {
  assert(openBlockers.length === 0, `Ground cannot close with ${openBlockers.length} open blockers`);
  assert(ledger.signoff.state === "approved", "Ground cannot close without approved signoff");
  for (const role of ledger.signoff.requiredRoles) {
    assert(ledger.signoff.approvals.some((approval) => approval.role === role && approval.decision !== "reject"), `Ground lacks approval from ${role}`);
  }
} else if (ledger.gateState === "open") {
  assert(openBlockers.length > 0 || ledger.signoff.state !== "approved", "Ground is marked open without blockers or pending signoff");
}
if (ledger.signoff.state === "approved") {
  assert(ledger.signoff.approvals.length === ledger.signoff.requiredRoles.length, "Approved signoff does not cover every required role");
}

const counts = Object.fromEntries(
  [...new Set(ledger.entries.map((entry) => entry.result))]
    .sort()
    .map((result) => [result, ledger.entries.filter((entry) => entry.result === result).length])
);
const areas = Object.fromEntries(
  [...new Set(ledger.entries.map((entry) => entry.area))]
    .sort()
    .map((area) => [area, ledger.entries.filter((entry) => entry.area === area).length])
);

const escapeCell = (value) => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
const statusMarkdown = () => {
  const lines = [
    "# Clark Pro — Ground Evidence Status",
    "",
    `**Generated from:** \`evidence/ground-ledger.json\``,
    `**Reviewed:** ${ledger.reviewedAt}`,
    `**Gate:** ${ledger.gateState.toUpperCase()}`,
    `**Signoff:** ${ledger.signoff.state}`,
    "",
    "A passing verifier means the ledger is internally honest and its referenced files exist. It does **not** mean Ground is closed.",
    "",
    "## Result counts",
    "",
    "| Result | Entries |",
    "|---|---:|",
    ...Object.entries(counts).map(([result, count]) => `| ${result} | ${count} |`),
    "",
    `## Open Ground requirements (${openBlockers.length})`,
    "",
    "Some entries share one future evidence run—for example, the five creator sessions cover the aggregate objective and multiple Canvas/business requirements. Counts are requirement-level, not separate recruiting tasks.",
    "",
    "| ID | Area | Result | Owner | Next action |",
    "|---|---|---|---|---|",
    ...openBlockers.map((entry) => `| ${entry.id} | ${entry.area} | ${entry.result} | ${escapeCell(entry.ownerRole)} | ${escapeCell(entry.nextAction)} |`),
    "",
    "## Required signoff",
    "",
    ...ledger.signoff.requiredRoles.map((role) => `- [${ledger.signoff.approvals.some((approval) => approval.role === role) ? "x" : " "}] ${role}`),
    "",
    "## Non-negotiable interpretation",
    "",
    "- Documents prove decisions; they do not prove runtime enforcement.",
    "- Automated prototype checks do not prove creator comprehension or replacement value.",
    "- Mocked capability fixtures do not prove real provider approval or reliability.",
    "- Compliments and hypothetical willingness to pay do not satisfy commercial gates.",
    "- Ground stays open until required evidence and named signoff are present."
  ];
  return `${lines.join("\n")}\n`;
};

const statusPath = path.join(root, "status.md");
const expectedStatus = statusMarkdown();
if (process.argv.includes("--write-status")) fs.writeFileSync(statusPath, expectedStatus);
else {
  assert(fs.existsSync(statusPath), "Generated status.md is missing; run npm --prefix evidence run status");
  assert(fs.readFileSync(statusPath, "utf8") === expectedStatus, "status.md is stale; run npm --prefix evidence run status");
}

console.log(JSON.stringify({
  ledgerId: ledger.ledgerId,
  schemaVersion: ledger.schemaVersion,
  entries: ledger.entries.length,
  requiredIds: requiredIds.length,
  areas,
  results: counts,
  groundBlockingEntries: ledger.entries.filter((entry) => entry.groundBlocking).length,
  openGroundBlockers: openBlockers.length,
  gateState: ledger.gateState,
  signoffState: ledger.signoff.state,
  approvals: ledger.signoff.approvals.length,
  semanticNegativeDocumentsRejected: 1,
  referencedPathsVerified: ledger.entries.reduce((sum, entry) => sum + entry.evidence.length, 0),
  contractVerifierStatus: contractResult.status,
  verifierStatus: "pass"
}, null, 2));
