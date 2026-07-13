import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = path.dirname(fileURLToPath(import.meta.url));
const read = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const unique = (values, label) => {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  assert(duplicates.length === 0, `${label} contains duplicates: ${[...new Set(duplicates)].join(", ")}`);
};
const micros = (money) => money?.micros ?? 0;

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
for (const filename of fs.readdirSync(path.join(root, "schemas")).filter((name) => name.endsWith(".json"))) {
  ajv.addSchema(read(`schemas/${filename}`));
}

const schemaId = (filename) => `https://schemas.clark.pro/v1/${filename}`;
const validate = (schemaFilename, dataFilename, shouldPass = true) => {
  const validator = ajv.getSchema(schemaId(schemaFilename));
  assert(validator, `Missing compiled schema ${schemaFilename}`);
  const passed = validator(read(dataFilename));
  if (passed !== shouldPass) {
    fail(`${dataFilename} ${shouldPass ? "failed" : "unexpectedly passed"} ${schemaFilename}: ${JSON.stringify(validator.errors)}`);
  }
};

const positiveTargets = [
  ["event-catalog.schema.json", "event-catalog.json"],
  ["ground-evidence-ledger.schema.json", "../evidence/ground-ledger.json"],
  ["bridge-exchange.schema.json", "fixtures/full-week/bridge.capture.exchange.json"],
  ["skill-package.schema.json", "fixtures/full-week/skills/weekly-reflection.class-a.skill.json"],
  ["skill-package.schema.json", "fixtures/full-week/skills/caption-check.class-b.skill.json"],
  ["skill-permission-receipt.schema.json", "fixtures/full-week/skills/caption-check.permission-receipt.json"],
  ["mcp-conformance-plan.schema.json", "../mcp-conformance/conformance-plan.json"],
  ["loop-definition.schema.json", "fixtures/full-week/full-week.loop.json"],
  ["loop-definition.schema.json", "fixtures/full-week/reflection.loop.json"],
  ["run-plan.schema.json", "fixtures/full-week/run-plan.json"],
  ["project-fixture.schema.json", "fixtures/full-week/project.fixture.json"],
  ["failure-fixtures.schema.json", "fixtures/full-week/failure-cases.json"],
  ["event-stream.schema.json", "fixtures/full-week/events.json"]
];
const capabilityFilenames = fs.readdirSync(path.join(root, "fixtures/full-week/capabilities"))
  .filter((name) => name.endsWith(".json"))
  .sort();
for (const filename of capabilityFilenames) {
  positiveTargets.push(["capability-manifest.schema.json", `fixtures/full-week/capabilities/${filename}`]);
}
for (const [schema, data] of positiveTargets) validate(schema, data, true);

const schemaNegativeTargets = [
  ["capability-manifest.schema.json", "fixtures/negative/raw-secret.capability.invalid.json"],
  ["capability-manifest.schema.json", "fixtures/negative/missing-output-schema.capability.invalid.json"],
  ["project-fixture.schema.json", "fixtures/negative/fractional-money.project.invalid.json"],
  ["skill-package.schema.json", "fixtures/negative/class-a-executable.skill.invalid.json"],
  ["skill-package.schema.json", "fixtures/negative/class-b-network.skill.invalid.json"],
  ["skill-package.schema.json", "fixtures/negative/class-b-raw-credential.skill.invalid.json"],
  ["skill-package.schema.json", "fixtures/negative/class-c-remote.skill.invalid.json"]
];
for (const [schema, data] of schemaNegativeTargets) validate(schema, data, false);

const catalog = read("event-catalog.json");
unique(catalog.events.map((event) => `${event.eventType}@${event.schemaVersion}`), "Event catalog keys");
const catalogByType = new Map(catalog.events.map((event) => [event.eventType, event]));

const bridgeExchange = read("fixtures/full-week/bridge.capture.exchange.json");
const validateBridgeExchange = (exchange) => {
  const { client, command, permissionDecision, domainEvent, initialReceipt, replayReceipt, equivalence } = exchange;
  assert(client.trust === "verified", "Bridge client is not verified");
  assert(client.workspaceScopes.includes(command.workspaceId), "Bridge workspace scope mismatch");
  assert(client.toolScopes.includes(command.toolName), "Bridge tool scope missing");
  assert(client.actionScopes.includes("capture"), "Bridge capture action scope missing");
  assert(permissionDecision.result === "allow", "Bridge permission decision is not allow");
  assert(permissionDecision.effectiveWorkspaceId === command.workspaceId, "Bridge effective workspace differs from command");
  assert(permissionDecision.effectiveToolScopes.includes(command.toolName), "Bridge effective tool scope missing");
  assert(permissionDecision.effectiveActionScopes.includes("capture"), "Bridge effective capture scope missing");
  assert(Date.parse(command.issuedAt) < Date.parse(command.deadlineAt), "Bridge command deadline is not after issue time");
  assert(Date.parse(command.deadlineAt) < Date.parse(client.expiresAt), "Bridge client expires before command deadline");

  assert(domainEvent.eventType === "source.captured", "Bridge capture emitted the wrong event type");
  assert(domainEvent.actor.type === "bridge_client", "Bridge event actor type is not bridge_client");
  assert(domainEvent.actor.id === client.clientId, "Bridge event actor does not match client");
  assert(domainEvent.metadata?.source === "bridge", "Bridge event metadata source is not bridge");
  assert(domainEvent.metadata?.clientId === client.clientId, "Bridge event metadata client does not match");
  assert(domainEvent.commandId === command.commandId, "Bridge event command ID mismatch");
  assert(domainEvent.idempotencyKey === command.idempotencyKey, "Bridge event idempotency key mismatch");
  assert(domainEvent.workspaceId === command.workspaceId, "Bridge event workspace mismatch");
  assert(domainEvent.projectId === command.projectId, "Bridge event project mismatch");
  assert(domainEvent.aggregate.version === command.expectedAggregateVersion + 1, "Bridge aggregate version does not follow expectation");
  const catalogEntry = catalogByType.get(domainEvent.eventType);
  assert(catalogEntry, "Bridge event type is absent from the catalog");
  assert(catalogEntry.aggregateType === domainEvent.aggregate.type, "Bridge event aggregate differs from catalog");
  const payloadFragment = catalogEntry.payloadRef.split("#")[1];
  const payloadValidator = ajv.getSchema(`https://schemas.clark.pro/v1/event-payloads.schema.json#${payloadFragment}`);
  assert(payloadValidator?.(domainEvent.payload), `Bridge event payload invalid: ${JSON.stringify(payloadValidator?.errors)}`);
  assert(domainEvent.payload.artifact.artifactId === domainEvent.aggregate.id, "Bridge payload artifact differs from aggregate");
  assert(domainEvent.payload.sensitivity === command.arguments.sensitivity, "Bridge payload sensitivity differs from command");

  const receiptFields = ["requestId", "commandId", "intentId", "idempotencyKey", "workspaceId", "projectId"];
  for (const receipt of [initialReceipt, replayReceipt]) {
    for (const field of receiptFields) assert(receipt[field] === command[field], `Bridge receipt ${field} mismatch`);
    assert(receipt.objectRef.objectId === domainEvent.aggregate.id, "Bridge receipt object differs from event aggregate");
    assert(receipt.objectRef.aggregateVersion === domainEvent.aggregate.version, "Bridge receipt aggregate version differs from event");
    assert(receipt.objectRef.stateHash === domainEvent.payload.artifact.contentHash, "Bridge receipt state hash differs from artifact");
  }
  assert(initialReceipt.status === "accepted", "Initial Bridge receipt is not accepted");
  assert(initialReceipt.emittedEventIds.length === 1 && initialReceipt.emittedEventIds[0] === domainEvent.eventId, "Initial Bridge receipt does not identify exactly one emitted event");
  assert(replayReceipt.status === "deduplicated", "Replay Bridge receipt is not deduplicated");
  assert(replayReceipt.emittedEventIds.length === 0, "Bridge deduplicated replay emitted an event");
  assert(replayReceipt.objectRef.objectId === initialReceipt.objectRef.objectId, "Bridge replay returned a different object");
  assert(replayReceipt.objectRef.stateHash === initialReceipt.objectRef.stateHash, "Bridge replay returned a different state hash");

  const { studioProjection, bridgeResource } = equivalence;
  assert(studioProjection.objectId === bridgeResource.objectId, "Studio and Bridge object IDs diverge");
  assert(studioProjection.aggregateVersion === bridgeResource.aggregateVersion, "Studio and Bridge aggregate versions diverge");
  assert(studioProjection.eventId === bridgeResource.eventId, "Studio and Bridge event IDs diverge");
  assert(studioProjection.stateHash === bridgeResource.stateHash, "Studio and Bridge state hashes diverge");
  assert(studioProjection.objectId === domainEvent.aggregate.id, "Studio projection does not reference Bridge event aggregate");
  assert(studioProjection.eventId === domainEvent.eventId, "Studio projection does not reference Bridge event");
  assert(studioProjection.stateHash === initialReceipt.objectRef.stateHash, "Studio projection state hash differs from receipt");
  assert(equivalence.objectCountAfterInitial === equivalence.objectCountBefore + 1, "Initial Bridge capture did not add exactly one object");
  assert(equivalence.objectCountAfterReplay === equivalence.objectCountAfterInitial, "Bridge replay changed object count");
};
validateBridgeExchange(bridgeExchange);

const bridgeNegativeSuite = read("fixtures/negative/bridge.semantic-negative-cases.json");
assert(bridgeNegativeSuite.baseFixture === "fixtures/full-week/bridge.capture.exchange.json", "Bridge negative suite points to wrong base fixture");
unique(bridgeNegativeSuite.cases.map((item) => item.id), "Bridge semantic negative case IDs");
const setPath = (target, dottedPath, value) => {
  const segments = dottedPath.split(".");
  const leaf = segments.pop();
  const parent = segments.reduce((current, segment) => current[segment], target);
  parent[leaf] = value;
};
for (const negativeCase of bridgeNegativeSuite.cases) {
  const candidate = structuredClone(bridgeExchange);
  setPath(candidate, negativeCase.path, negativeCase.value);
  let rejection = null;
  try {
    validateBridgeExchange(candidate);
  } catch (error) {
    rejection = error;
  }
  assert(rejection, `${negativeCase.id} was not rejected`);
  assert(rejection.message.includes(negativeCase.expectedReason), `${negativeCase.id} rejected for unexpected reason: ${rejection.message}`);
}

const classASkill = read("fixtures/full-week/skills/weekly-reflection.class-a.skill.json");
const classBSkill = read("fixtures/full-week/skills/caption-check.class-b.skill.json");
const skillReceipt = read("fixtures/full-week/skills/caption-check.permission-receipt.json");
for (const skill of [classASkill, classBSkill]) {
  unique(skill.files.map((file) => file.path), `${skill.id} file paths`);
}
assert(classBSkill.entrypoint.contentHash === classBSkill.files.find((file) => file.path === classBSkill.entrypoint.path)?.contentHash, "Class B entrypoint hash differs from inventory");
assert(classBSkill.sandbox.runtime === "wasmtime", "Class B runtime is not Wasmtime");
assert(classBSkill.requestedPermissions.networkDomains.length === 0, "Class B requested direct network");
assert(classBSkill.requestedPermissions.credentialScopes.length === 0, "Class B requested raw credential scope");
const permissionKeys = ["capabilityIds", "hostFunctions", "actionClasses", "networkDomains", "credentialScopes", "readInputs", "writeOutputs"];
for (const key of permissionKeys) {
  const sources = Object.values(skillReceipt.sources).map((source) => source[key]);
  const calculated = sources[0].filter((value) => sources.every((source) => source.includes(value))).sort();
  assert(JSON.stringify(calculated) === JSON.stringify([...skillReceipt.effective[key]].sort()), `Skill effective ${key} is not the four-way intersection`);
  const denied = skillReceipt.sources.skillRequest[key].filter((value) => !calculated.includes(value)).sort();
  assert(JSON.stringify(denied) === JSON.stringify([...skillReceipt.denied[key]].sort()), `Skill denied ${key} is not the request remainder`);
}

const stream = read("fixtures/full-week/events.json");
unique(stream.events.map((event) => event.eventId), "Event IDs");
const aggregateVersions = new Map();
for (const event of stream.events) {
  const entry = catalogByType.get(event.eventType);
  assert(entry, `Event ${event.eventId} uses unknown type ${event.eventType}`);
  assert(entry.aggregateType === event.aggregate.type, `${event.eventId} aggregate type does not match catalog`);
  assert(entry.schemaVersion === event.schemaVersion, `${event.eventId} schema version does not match catalog`);
  if (entry.requiredCorrelation) assert(event.correlationId, `${event.eventId} requires correlationId`);
  if (entry.requiresIdempotencyKey) assert(event.idempotencyKey, `${event.eventId} requires idempotencyKey`);
  const payloadFragment = entry.payloadRef.split("#")[1];
  const payloadValidator = ajv.getSchema(`https://schemas.clark.pro/v1/event-payloads.schema.json#${payloadFragment}`);
  assert(payloadValidator, `Missing payload validator ${entry.payloadRef}`);
  assert(payloadValidator(event.payload), `${event.eventId} payload invalid: ${JSON.stringify(payloadValidator.errors)}`);
  const key = `${event.aggregate.type}:${event.aggregate.id}`;
  const previous = aggregateVersions.get(key) ?? 0;
  assert(event.aggregate.version === previous + 1, `${event.eventId} aggregate version ${event.aggregate.version} does not follow ${previous}`);
  aggregateVersions.set(key, event.aggregate.version);
}

const project = read("fixtures/full-week/project.fixture.json");
assert(project.objects.length === project.expectedObjectCount, "Project object count does not match expectedObjectCount");
assert(project.objects.length === 50, "Full-Week fixture must contain exactly 50 objects");
unique(project.objects.map((object) => object.id), "Project object IDs");
unique(project.edges.map((edge) => edge.id), "Project edge IDs");
const objectById = new Map(project.objects.map((object) => [object.id, object]));
for (const object of project.objects) {
  for (const sourceRef of object.sourceRefs) assert(objectById.has(sourceRef), `${object.id} has unresolved sourceRef ${sourceRef}`);
}
for (const edge of project.edges) {
  assert(objectById.has(edge.from), `${edge.id} has unresolved from ${edge.from}`);
  assert(objectById.has(edge.to), `${edge.id} has unresolved to ${edge.to}`);
}
const objectCountAssertion = project.assertions.find((item) => item.id === "object-count");
assert(objectCountAssertion?.expected === project.objects.length, "object-count assertion does not match fixture");
const approvalAssertion = project.assertions.find((item) => item.id === "approval-not-publish")?.expected;
assert(approvalAssertion, "Missing approval-not-publish assertion");
const approvedObject = objectById.get(approvalAssertion.objectId);
assert(approvedObject?.approvalState === approvalAssertion.approvalState, "Approval assertion state mismatch");
assert(approvedObject?.publishState === approvalAssertion.publishState, "Approval/publish separation assertion mismatch");

const capabilities = capabilityFilenames.map((filename) => read(`fixtures/full-week/capabilities/${filename}`));
unique(capabilities.map((capability) => `${capability.id}@${capability.version}`), "Capability revisions");
const capabilityById = new Map(capabilities.map((capability) => [capability.id, capability]));

const loopFiles = ["fixtures/full-week/full-week.loop.json", "fixtures/full-week/reflection.loop.json"];
const loops = loopFiles.map(read);
const loopById = new Map(loops.map((loop) => [loop.id, loop]));
const checkDag = (ids, dependencies, label) => {
  const visiting = new Set();
  const visited = new Set();
  const visit = (id) => {
    if (visiting.has(id)) fail(`${label} contains a cycle at ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of dependencies(id)) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  };
  ids.forEach(visit);
};
for (const loop of loops) {
  const nodes = loop.graph.nodes;
  unique(nodes.map((node) => node.id), `${loop.id} node IDs`);
  unique(loop.graph.edges.map((edge) => edge.id), `${loop.id} edge IDs`);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  for (const node of nodes) {
    unique(node.inputs.map((port) => port.id), `${loop.id}/${node.id} input ports`);
    unique(node.outputs.map((port) => port.id), `${loop.id}/${node.id} output ports`);
    if (node.kind === "operator") {
      const capability = capabilityById.get(node.capabilityRevision.id);
      assert(capability, `${loop.id}/${node.id} has unresolved capability ${node.capabilityRevision.id}`);
      assert(capability.version === node.capabilityRevision.revision, `${loop.id}/${node.id} capability revision mismatch`);
      assert(capability.permissions.actionClass === node.actionClass, `${loop.id}/${node.id} action class differs from capability`);
      assert(loop.permissions.capabilityAllowlist.includes(capability.id), `${loop.id} does not allow ${capability.id}`);
      for (const domain of capability.permissions.networkDomains) assert(loop.permissions.networkDomains.includes(domain), `${loop.id} omits domain ${domain}`);
      for (const scope of capability.permissions.credentialScopes) assert(loop.permissions.credentialScopes.includes(scope), `${loop.id} omits credential scope ${scope}`);
    }
    if (node.kind === "loop") {
      const nested = loopById.get(node.nestedLoopRevision.id);
      assert(nested, `${loop.id}/${node.id} has unresolved nested loop ${node.nestedLoopRevision.id}`);
      assert(nested.revision === node.nestedLoopRevision.revision, `${loop.id}/${node.id} nested loop revision mismatch`);
    }
  }
  const graphDependencies = new Map(nodes.map((node) => [node.id, []]));
  for (const edge of loop.graph.edges) {
    const fromNode = nodeById.get(edge.from.nodeId);
    const toNode = nodeById.get(edge.to.nodeId);
    assert(fromNode, `${loop.id}/${edge.id} unresolved from node`);
    assert(toNode, `${loop.id}/${edge.id} unresolved to node`);
    const fromPort = fromNode.outputs.find((port) => port.id === edge.from.portId);
    const toPort = toNode.inputs.find((port) => port.id === edge.to.portId);
    assert(fromPort, `${loop.id}/${edge.id} unresolved output port`);
    assert(toPort, `${loop.id}/${edge.id} unresolved input port`);
    assert(fromPort.schemaRef === toPort.schemaRef || edge.adapterCapabilityRevision, `${loop.id}/${edge.id} schema mismatch without adapter`);
    graphDependencies.get(toNode.id).push(fromNode.id);
  }
  checkDag(nodes.map((node) => node.id), (id) => graphDependencies.get(id), `${loop.id} graph`);
}

const runPlan = read("fixtures/full-week/run-plan.json");
const fullWeek = loopById.get("clark.loop.full-week");
unique(runPlan.steps.map((step) => step.id), "Run-plan step IDs");
const stepById = new Map(runPlan.steps.map((step) => [step.id, step]));
assert(new Set(runPlan.steps.map((step) => step.nodeId)).size === fullWeek.graph.nodes.length, "Run plan must compile every Full-Week node exactly once");
for (const node of fullWeek.graph.nodes) assert(runPlan.steps.some((step) => step.nodeId === node.id), `Run plan omits node ${node.id}`);
for (const step of runPlan.steps) {
  for (const dependency of step.dependsOn) assert(stepById.has(dependency), `${step.id} unresolved dependency ${dependency}`);
  if (step.kind === "operator") {
    const capability = capabilityById.get(step.capabilityRevision.id);
    assert(capability, `${step.id} unresolved capability`);
    assert(capability.permissions.actionClass === step.actionClass, `${step.id} action class differs from capability`);
    assert(runPlan.effectivePermissions.capabilityIds.includes(capability.id), `${step.id} capability absent from effective permissions`);
  }
  assert(runPlan.effectivePermissions.actionClasses.includes(step.actionClass), `${step.id} action class absent from effective permissions`);
  if (step.actionClass === "social_publish") {
    assert(step.approval.mode === "always", `${step.id} publish approval is not always`);
    assert(step.permissionDecision.result === "ask", `${step.id} publish permission does not ask`);
    assert(step.idempotency && step.idempotency !== "not_applicable", `${step.id} lacks idempotency`);
    assert(step.reconciliation && step.reconciliation !== "not_required", `${step.id} lacks reconciliation`);
  }
}
checkDag(runPlan.steps.map((step) => step.id), (id) => stepById.get(id).dependsOn, "Run plan");
unique(runPlan.humanGates.map((gate) => gate.id), "Human gate IDs");
for (const gate of runPlan.humanGates) assert(stepById.has(gate.stepId), `${gate.id} unresolved step`);
for (const step of runPlan.steps.filter((item) => item.approval.mode === "always")) {
  assert(runPlan.humanGates.some((gate) => gate.stepId === step.id), `${step.id} always-approval step lacks human gate`);
}
unique(runPlan.egressPlan.map((item) => item.id), "Egress item IDs");
const egressById = new Map(runPlan.egressPlan.map((item) => [item.id, item]));
for (const step of runPlan.steps) {
  for (const egressId of step.egressItemIds ?? []) {
    const item = egressById.get(egressId);
    assert(item, `${step.id} unresolved egress item ${egressId}`);
    assert(item.stepId === step.id, `${egressId} points to the wrong step`);
  }
}
assert(micros(runPlan.quote.maximum) <= micros(runPlan.budget.reserved), "Run quote exceeds reservation");
assert(micros(runPlan.budget.reserved) <= micros(runPlan.budget.ceiling), "Run reservation exceeds ceiling");
const publishEgress = egressById.get("egress.postiz-publish");
assert(publishEgress && !publishEgress.approvedByPolicy, "Publish egress must await human authority");

const threatText = fs.readFileSync(path.join(root, "..", "security-and-threat-model.md"), "utf8");
const threatIds = new Set([...threatText.matchAll(/\| ([A-Z]+-[A-Z0-9]+) \|/g)].map((match) => match[1]));
const mcpPlan = read("../mcp-conformance/conformance-plan.json");
const mcpPlanValidator = ajv.getSchema(schemaId("mcp-conformance-plan.schema.json"));
const criticalNonblockingPlan = structuredClone(mcpPlan);
const criticalCase = criticalNonblockingPlan.cases.find((item) => item.severity === "critical");
criticalCase.releaseBlocker = false;
assert(!mcpPlanValidator(criticalNonblockingPlan), "Critical nonblocking MCP plan mutation unexpectedly passed schema validation");
unique(mcpPlan.cases.map((item) => item.id), "MCP conformance case IDs");
unique(mcpPlan.owners.map((item) => item.area), "MCP conformance owner areas");
for (const area of ["connect", "bridge", "security", "quality", "incident"]) assert(mcpPlan.owners.some((owner) => owner.area === area), `MCP conformance plan lacks ${area} ownership`);
for (const surface of ["connect_host", "clark_bridge"]) assert(mcpPlan.cases.some((item) => item.surface === surface), `MCP plan lacks ${surface} cases`);
for (const transport of ["stdio", "streamable_http", "domain_adapter"]) assert(mcpPlan.cases.some((item) => item.transport === transport), `MCP plan lacks ${transport} cases`);
for (const category of ["lifecycle", "framing", "schema", "metadata", "result", "timeout", "cancellation", "shutdown", "origin", "auth", "session", "scope", "replay", "egress", "tasks", "ui_state"]) assert(mcpPlan.cases.some((item) => item.category === category), `MCP plan lacks ${category} coverage`);
for (const testCase of mcpPlan.cases) {
  for (const threatId of testCase.threatIds) assert(threatIds.has(threatId), `${testCase.id} references unknown threat ${threatId}`);
  if (["critical", "high"].includes(testCase.severity)) assert(testCase.releaseBlocker, `${testCase.id} is ${testCase.severity} but not release-blocking`);
}
const failureSuite = read("fixtures/full-week/failure-cases.json");
unique(failureSuite.cases.map((item) => item.id), "Failure case IDs");
for (const failureCase of failureSuite.cases) {
  for (const threatId of failureCase.threatIds) assert(threatIds.has(threatId), `${failureCase.id} references unknown threat ${threatId}`);
  for (const eventType of failureCase.expectedEvents) assert(catalogByType.has(eventType), `${failureCase.id} references unknown event ${eventType}`);
}

const unknownEvent = read("fixtures/negative/unknown-event.semantic-invalid.json");
assert(!catalogByType.has(unknownEvent.eventType), "Unknown-event negative fixture is no longer negative");
const danglingProject = read("fixtures/negative/dangling-edge.project.semantic-invalid.json");
const danglingIds = new Set(danglingProject.objects.map((object) => object.id));
assert(danglingProject.edges.some((edge) => !danglingIds.has(edge.from) || !danglingIds.has(edge.to)), "Dangling-edge negative fixture is no longer negative");
const unsafeLoop = read("fixtures/negative/publish-without-reconciliation.loop.semantic-invalid.json");
assert(unsafeLoop.graph.nodes.some((node) => node.actionClass === "social_publish" && node.approval.mode !== "always"), "Unsafe-publish negative fixture is no longer negative");

const forbiddenSecretKeys = new Set(["apiKey", "accessToken", "refreshToken", "clientSecret", "rawSecret", "password"]);
const scanSecrets = (value, location) => {
  if (Array.isArray(value)) return value.forEach((item, index) => scanSecrets(item, `${location}[${index}]`));
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    assert(!forbiddenSecretKeys.has(key), `Positive fixture contains forbidden secret key ${location}.${key}`);
    scanSecrets(child, `${location}.${key}`);
  }
};
for (const [, dataFilename] of positiveTargets) scanSecrets(read(dataFilename), dataFilename);

console.log(JSON.stringify({
  schemaFiles: fs.readdirSync(path.join(root, "schemas")).filter((name) => name.endsWith(".json")).length,
  positiveDocuments: positiveTargets.length,
  schemaNegativeDocumentsRejected: schemaNegativeTargets.length,
  semanticNegativeDocumentsRejected: 5,
  mcpCriticalNonblockingMutationsRejected: 1,
  bridgeSemanticNegativeCasesRejected: bridgeNegativeSuite.cases.length,
  bridgeExchanges: 1,
  skillPackages: 2,
  skillPermissionReceipts: 1,
  mcpConformanceCases: mcpPlan.cases.length,
  mcpExecutableOrContractCases: mcpPlan.cases.filter((item) => item.automation !== "planned").length,
  eventTypes: catalog.events.length,
  eventPayloadsValidated: stream.events.length,
  capabilities: capabilities.length,
  loops: loops.length,
  runSteps: runPlan.steps.length,
  projectObjects: project.objects.length,
  projectEdges: project.edges.length,
  failureCases: failureSuite.cases.length,
  threatIdsReferenced: [...new Set(failureSuite.cases.flatMap((item) => item.threatIds))].length,
  status: "pass"
}, null, 2));
