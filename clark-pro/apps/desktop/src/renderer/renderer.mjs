const sections = ["focus", "canvas", "memory", "connections"];
const tabs = new Map(sections.map((section) => [section, document.querySelector(`[data-section="${section}"]`)]));
const views = new Map(sections.map((section) => [section, document.querySelector(`[data-view="${section}"]`)]));
const announcer = document.querySelector("#announcer");

async function activateSection(section, { focus = false, persist = true } = {}) {
  if (!sections.includes(section)) return;
  const changed = tabs.get(section).getAttribute("aria-selected") !== "true";
  for (const name of sections) {
    const selected = name === section;
    tabs.get(name).setAttribute("aria-selected", String(selected));
    tabs.get(name).tabIndex = selected ? 0 : -1;
    views.get(name).hidden = !selected;
  }
  if (focus) tabs.get(section).focus();
  announcer.textContent = `${tabs.get(section).textContent.trim()} view opened`;
  document.title = `${section[0].toUpperCase()}${section.slice(1)} — Clark Studio`;
  if (changed) document.querySelector("#workspace").scrollTop = 0;
  if (persist) await window.clarkDesktop.setActiveSection(section);
}

for (const [section, tab] of tabs) {
  tab.addEventListener("click", () => void activateSection(section));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = sections.indexOf(section);
    const next = event.key === "Home" ? 0 : event.key === "End" ? sections.length - 1 :
      (current + (event.key === "ArrowDown" ? 1 : -1) + sections.length) % sections.length;
    void activateSection(sections[next], { focus: true });
  });
}

document.addEventListener("keydown", (event) => {
  if (!event.metaKey || event.altKey || event.ctrlKey) return;
  const shortcuts = { "1": "focus", "2": "canvas", "6": "memory", "7": "connections" };
  if (shortcuts[event.key]) {
    event.preventDefault();
    void activateSection(shortcuts[event.key], { focus: true });
  }
});

let nodeDetails = {
  idea: ["Idea thesis", "Creator input only", "No revision", "Local canonical", "Not assessed"],
  assessment: ["Thesis stress-test", "No mutation authority", "Idea → MCP assessment", "Local zero-egress", "Not assessed"],
  evidence: ["Observed proof", "No evidence inferred", "Assessment → evidence gates", "Citations required", "Not observed"],
  brief: ["Idea brief", "Proposal only", "Assessment → deterministic brief", "Local artifact", "Not created"],
  review: ["Exact-version review", "Creator decision", "Brief → review gate", "Hash pinned", "Not waiting"]
};
const nodeButtons = [...document.querySelectorAll(".node-card")];
const inspector = document.querySelector(".inspector");

function inspectNode(button) {
  nodeButtons.forEach((candidate) => candidate.classList.toggle("selected", candidate === button));
  const [title, authority, lineage, trust, readiness] = nodeDetails[button.dataset.node];
  inspector.querySelector("h2").textContent = title;
  const values = inspector.querySelectorAll("dd");
  [authority, lineage, trust, readiness].forEach((value, index) => { values[index].textContent = value; });
  announcer.textContent = `${title} selected. Authority: ${authority}. Trust: ${trust}.`;
}

nodeButtons.forEach((button, index) => {
  button.addEventListener("focus", () => inspectNode(button));
  button.addEventListener("click", () => inspectNode(button));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
    const next = event.key === "Home" ? 0 : event.key === "End" ? nodeButtons.length - 1 :
      (index + direction + nodeButtons.length) % nodeButtons.length;
    nodeButtons[next].focus();
  });
});

function focusTrustCenter() {
  document.querySelector("#trust-summary").focus();
  announcer.textContent = "Trust center. Three decisions remain explicit.";
}

document.querySelector("#review-trust").addEventListener("click", focusTrustCenter);
window.clarkDesktop.onNavigate((section) => void activateSection(section, { focus: true }));
window.clarkDesktop.onTrustCenter(() => {
  void activateSection("connections", { persist: false }).then(focusTrustCenter);
});

const harnessState = document.querySelector("#harness-state");
const harnessRail = document.querySelector("#harness-rail-status span:last-child");
const harnessConnectionState = document.querySelector("#harness-connection-state");
const harnessConnectionDetail = document.querySelector("#harness-connection-detail");
const capabilityConnectionState = document.querySelector("#capability-connection-state");
const capabilityConnectionDetail = document.querySelector("#capability-connection-detail");
const bridgeConnectionState = document.querySelector("#bridge-connection-state");
const bridgeConnectionDetail = document.querySelector("#bridge-connection-detail");
const openCutConnectionState = document.querySelector("#opencut-connection-state");
const openCutConnectionDetail = document.querySelector("#opencut-connection-detail");
const toolPackName = document.querySelector("#tool-pack-name");
const toolPackReason = document.querySelector("#tool-pack-reason");
const toolPackSource = document.querySelector("#tool-pack-source");
const toolPackManifest = document.querySelector("#tool-pack-manifest");
const toolPackComponents = document.querySelector("#tool-pack-components");
const toolPackPath = document.querySelector("#tool-pack-path");
const toolPackGates = document.querySelector("#tool-pack-gates");
const toolPackDecision = document.querySelector("#tool-pack-decision");
const recheckToolPack = document.querySelector("#recheck-tool-pack");
const resolveToolPack = document.querySelector("#resolve-tool-pack");
const ideaForm = document.querySelector("#idea-loop-form");
const ideaInput = document.querySelector("#idea-input");
const revisionReasonGroup = document.querySelector("#revision-reason-group");
const revisionReason = document.querySelector("#revision-reason");
const ideaFormContext = document.querySelector("#idea-form-context");
const runButton = document.querySelector("#run-idea-loop");
const runResult = document.querySelector("#harness-run");
const runEmpty = document.querySelector("#run-empty");
const runState = document.querySelector("#run-state");
const draftText = document.querySelector("#draft-text");
const runIntegrity = document.querySelector("#run-integrity");
const approvalActions = document.querySelector("#approval-actions");
const thesisReadiness = document.querySelector("#thesis-readiness");
const readinessHeading = document.querySelector("#readiness-heading");
const readinessSummary = document.querySelector("#readiness-summary");
const readinessGaps = document.querySelector("#readiness-gaps");
const canvasLineage = document.querySelector("#canvas-lineage");
const canvasReadiness = document.querySelector("#canvas-readiness");
const evidenceGapList = document.querySelector("#evidence-gap-list");
const approveBrief = document.querySelector("#approve-brief");
const rejectBrief = document.querySelector("#reject-brief");
const memoryMode = document.querySelector("#memory-mode");
const memoryProposedCount = document.querySelector("#memory-proposed-count");
const memoryActiveCount = document.querySelector("#memory-active-count");
const memoryDisputedCount = document.querySelector("#memory-disputed-count");
const memoryProposalForm = document.querySelector("#memory-proposal-form");
const memoryStatement = document.querySelector("#memory-statement");
const memoryLayer = document.querySelector("#memory-layer");
const memoryPolicy = document.querySelector("#memory-policy");
const memorySensitivity = document.querySelector("#memory-sensitivity");
const memoryConfidence = document.querySelector("#memory-confidence");
const memoryEvidenceContext = document.querySelector("#memory-evidence-context");
const proposeMemoryButton = document.querySelector("#propose-memory");
const memoryRetrievalForm = document.querySelector("#memory-retrieval-form");
const memoryQuery = document.querySelector("#memory-query");
const memoryDestination = document.querySelector("#memory-destination");
const memoryMaxSensitivity = document.querySelector("#memory-max-sensitivity");
const memoryIncludeExplicit = document.querySelector("#memory-include-explicit");
const retrieveMemoryButton = document.querySelector("#retrieve-memory");
const memoryRetrievalResult = document.querySelector("#memory-retrieval-result");
const memoryLedgerCount = document.querySelector("#memory-ledger-count");
const memoryList = document.querySelector("#memory-list");
const memoryInspectorHeading = document.querySelector("#memory-inspector-heading");
const memoryInspectorStatement = document.querySelector("#memory-inspector-statement");
const memoryInspectorState = document.querySelector("#memory-inspector-state");
const memoryInspectorScope = document.querySelector("#memory-inspector-scope");
const memoryInspectorPolicy = document.querySelector("#memory-inspector-policy");
const memoryInspectorEvidence = document.querySelector("#memory-inspector-evidence");
const memoryDecisionReason = document.querySelector("#memory-decision-reason");
const promoteMemoryButton = document.querySelector("#promote-memory");
const rejectMemoryButton = document.querySelector("#reject-memory");
const disputeMemoryButton = document.querySelector("#dispute-memory");
const forgetMemoryButton = document.querySelector("#forget-memory");
const memoryCorrectionForm = document.querySelector("#memory-correction-form");
const memoryCorrection = document.querySelector("#memory-correction");
const memoryCorrectionReason = document.querySelector("#memory-correction-reason");
let latestRun;
let refreshPromise;
let harnessReady = false;
let latestMemories = [];
let selectedMemoryId;
let selectedToolPackage;

const runStateLabels = {
  planned: "Planned", running: "Running", recovering: "Recovering", waiting_approval: "Waiting approval",
  completed: "Completed", failed: "Revision required", cancelled: "Cancelled"
};

function setHarnessAvailability(snapshot) {
  const ready = snapshot.available && snapshot.state === "ready";
  harnessReady = ready;
  harnessState.textContent = ready ? `Ready · ${snapshot.database.eventCount} events` : runStateLabels[snapshot.state] ?? "Unavailable";
  harnessRail.textContent = ready ? "Harness live · SQLite WAL" : `Harness ${snapshot.state ?? "unavailable"}`;
  harnessConnectionState.textContent = ready ? "Live" : snapshot.state ?? "Unavailable";
  harnessConnectionState.className = `state ${ready ? "complete" : "waiting"}`;
  harnessConnectionDetail.textContent = ready ? `Supervised utility process · SQLite WAL · ${snapshot.database.eventCount} events` : "Supervised utility process unavailable";
  const inspector = snapshot.capabilities
    ?.filter((capability) => capability.id === "clark.idea.inspect.mcp")
    .sort((left, right) => right.version.localeCompare(left.version, undefined, { numeric: true }))[0];
  const inspectorLive = ready && inspector?.state === "healthy";
  capabilityConnectionState.textContent = inspectorLive ? "Live" : inspector?.state ?? "Unavailable";
  capabilityConnectionState.className = `state ${inspectorLive ? "complete" : "waiting"}`;
  capabilityConnectionDetail.textContent = inspector
    ? `Exact stdio · ${inspector.actionClass} · no network or credential scopes`
    : "Exact stdio process unavailable";
  const bridgeLive = ready && snapshot.bridge?.state === "ready";
  bridgeConnectionState.textContent = bridgeLive ? "Live" : snapshot.bridge?.state ?? "Unavailable";
  bridgeConnectionState.className = `state ${bridgeLive ? "complete" : "waiting"}`;
  bridgeConnectionDetail.textContent = bridgeLive
    ? `${snapshot.bridge.host}:${snapshot.bridge.port} · ${snapshot.bridge.tools.length} scoped tools · memory requires a separate future pairing scope`
    : "Authenticated localhost MCP unavailable";
  runButton.disabled = !ready;
}

function renderRun(run) {
  latestRun = run;
  if (!run) {
    runResult.hidden = true;
    runEmpty.hidden = false;
    thesisReadiness.hidden = true;
    revisionReasonGroup.hidden = true;
    revisionReason.required = false;
    ideaFormContext.textContent = "Local deterministic stress-test · $0 · no network, model, credentials, build, or publishing authority";
    runButton.textContent = "Structure idea";
    runButton.disabled = !harnessReady;
    renderCanvas();
    return;
  }
  runEmpty.hidden = true;
  runResult.hidden = false;
  runState.textContent = runStateLabels[run.state] ?? run.state;
  const stateClass = run.state === "completed" ? "complete" : run.state === "failed" ? "failed" : run.state === "waiting_approval" ? "waiting" : "running";
  runState.className = `state ${stateClass}`;
  draftText.textContent = run.draft?.text ?? "The durable run is preparing the local brief…";
  approvalActions.hidden = run.state !== "waiting_approval" || !run.approval;
  const assessment = parseThesis(run.analysis?.text);
  renderThesisReadiness(assessment);
  renderCanvas(run, assessment);
  const canRevise = ["waiting_approval", "completed", "failed"].includes(run.state);
  revisionReasonGroup.hidden = !canRevise;
  revisionReason.required = canRevise;
  if (document.activeElement !== ideaInput) ideaInput.value = run.idea.text;
  ideaFormContext.textContent = canRevise
    ? `Revision ${run.revisionNumber} is immutable · describe why the next revision is stronger`
    : "Wait for the current durable run to reach review before revising.";
  runButton.textContent = canRevise ? "Create stronger revision" : "Run in progress";
  runButton.disabled = !harnessReady || !canRevise;
  const lineage = `revision ${run.revisionNumber}${run.parentRunId ? ` · parent ${shortId(run.parentRunId)}` : " · root"}`;
  runIntegrity.textContent = run.draft ? `${lineage} · ${run.eventCount} correlated events · ${run.draft.contentHash}${run.recoveredFromCheckpoint ? " · restored from checkpoint" : ""}` : `${lineage} · ${run.eventCount} correlated events`;
}

function parseThesis(text) {
  if (!text) return undefined;
  try {
    const value = JSON.parse(text);
    return value?.kind === "idea_thesis_assessment" ? value : undefined;
  } catch {
    return undefined;
  }
}

function renderThesisReadiness(assessment) {
  thesisReadiness.hidden = !assessment;
  if (!assessment) return;
  const { explicitCount, totalCount, state } = assessment.structuralCompleteness;
  readinessHeading.textContent = `${explicitCount}/${totalCount} thesis facets explicit · ${state === "ready_for_evidence" ? "ready for evidence" : "clarification required"}`;
  readinessSummary.textContent = assessment.summary;
  readinessGaps.textContent = assessment.missingFacets.length
    ? `Clarify: ${assessment.missingFacets.map(humanize).join(", ")}.`
    : "Structure is complete; observed demand, payment, and repeat-use evidence are still required.";
}

function renderCanvas(run, assessment) {
  if (!run) {
    canvasLineage.textContent = "Idea Foundry · waiting for a thesis";
    canvasReadiness.textContent = "No assessment";
    evidenceGapList.replaceChildren(listItem("Capture a thesis to reveal exact gaps."));
    return;
  }
  const revision = `Revision ${run.revisionNumber}`;
  const structural = assessment?.structuralCompleteness;
  const readiness = assessment?.readiness === "evidence_required" ? "Evidence required" : assessment ? "Clarification required" : "Assessment pending";
  canvasLineage.textContent = `Idea Foundry · ${revision}${run.parentRunId ? ` · derived from ${shortId(run.parentRunId)}` : " · root thesis"}`;
  canvasReadiness.textContent = readiness;
  setCanvasNode("idea", `Idea thesis v${run.revisionNumber}`, `Content-addressed · ${shortHash(run.idea.contentHash)}`);
  setCanvasNode("assessment", "Thesis stress-test", assessment ? `${structural.explicitCount}/${structural.totalCount} facets explicit · MCP 1.1` : "Governed MCP inspection pending");
  setCanvasNode("evidence", "Observed proof", assessment ? `${assessment.evidenceGaps.length} gates open · ${humanize(assessment.evidenceState)}` : "No evidence inferred");
  setCanvasNode("brief", `Idea brief v${run.revisionNumber}`, run.draft ? `Deterministic · ${shortHash(run.draft.contentHash)}` : "Structure pending");
  setCanvasNode("review", "Exact-version review", run.approval ? `${humanize(run.approval.state)} · wording only` : "Gate pending");
  nodeDetails = {
    idea: [`Idea thesis v${run.revisionNumber}`, "Creator-supplied text only", run.parentRunId ? `${shortId(run.parentRunId)} → ${shortId(run.runId)}` : `${shortId(run.runId)} · root`, "Local content-addressed source", revision],
    assessment: ["Thesis stress-test", "One leased local transform", `Idea v${run.revisionNumber} → MCP 1.1 assessment`, "Zero egress · no files or credentials", structural ? `${structural.explicitCount}/${structural.totalCount} explicit` : "Pending"],
    evidence: ["Observed proof", "Cannot infer or promote evidence", "Assessment → five falsifiable gates", "Observed or cited inputs required", assessment ? `${assessment.evidenceGaps.length} open · not validated` : "Pending"],
    brief: [`Idea brief v${run.revisionNumber}`, "Proposal only", `Idea + assessment → brief v${run.revisionNumber}`, "Deterministic local artifact", run.draft ? "Ready for wording review" : "Pending"],
    review: ["Exact-version review", "Creator wording decision only", `Brief v${run.revisionNumber} → exact hash gate`, "No build or publish authority", run.approval ? humanize(run.approval.state) : humanize(run.state)]
  };
  const gaps = assessment?.evidenceGaps ?? ["problem_interviews", "workaround_baseline", "behavioral_demand", "willingness_to_pay", "retention_or_repeat_use"];
  evidenceGapList.replaceChildren(...gaps.map((gap) => listItem(humanize(gap))));
  const selected = nodeButtons.find((button) => button.classList.contains("selected")) ?? nodeButtons[0];
  inspectNode(selected);
}

function renderMemory(snapshot) {
  latestMemories = snapshot.memories ?? [];
  const count = (state) => latestMemories.filter((memory) => memory.state === state).length;
  const activeCount = count("active");
  memoryMode.textContent = `${activeCount} active`;
  memoryProposedCount.textContent = String(count("proposed"));
  memoryActiveCount.textContent = String(activeCount);
  memoryDisputedCount.textContent = String(count("disputed"));
  memoryLedgerCount.textContent = `${latestMemories.length} immutable ${latestMemories.length === 1 ? "claim" : "claims"}`;
  const evidenceReady = harnessReady && Boolean(latestRun?.draft);
  proposeMemoryButton.disabled = !evidenceReady;
  retrieveMemoryButton.disabled = !harnessReady;
  memoryEvidenceContext.textContent = evidenceReady
    ? `Evidence: ${shortId(latestRun.draft.artifactId)} @ ${shortId(latestRun.draft.versionId)} + run ${shortId(latestRun.runId)}. Proposal only.`
    : "Create an Idea Foundry brief to attach an exact artifact version and durable run.";

  if (!latestMemories.some((memory) => memory.memoryId === selectedMemoryId)) {
    selectedMemoryId = latestMemories.find((memory) => memory.state !== "forgotten")?.memoryId ?? latestMemories[0]?.memoryId;
  }
  if (!latestMemories.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No governed claims yet.";
    memoryList.replaceChildren(empty);
  } else {
    memoryList.replaceChildren(...latestMemories.map(memoryCard));
  }
  renderMemoryInspector();
}

function memoryCard(memory) {
  const item = document.createElement("div");
  item.setAttribute("role", "listitem");
  const button = document.createElement("button");
  button.type = "button";
  button.className = `memory-card${memory.memoryId === selectedMemoryId ? " selected" : ""}`;
  button.setAttribute("aria-pressed", String(memory.memoryId === selectedMemoryId));
  const statement = document.createElement("strong");
  statement.textContent = memory.statement;
  const state = document.createElement("span");
  state.className = `state ${memoryStateClass(memory.state)}`;
  state.textContent = humanize(memory.state);
  const detail = document.createElement("small");
  detail.textContent = `${humanize(memory.layer)} · ${Math.round(memory.confidence * 100)}% · ${humanize(memory.retrievalPolicy)}`;
  button.append(statement, state, detail);
  button.addEventListener("click", () => {
    selectedMemoryId = memory.memoryId;
    renderMemory({ memories: latestMemories });
    announcer.textContent = `${memory.statement} selected. State: ${humanize(memory.state)}.`;
  });
  item.append(button);
  return item;
}

function renderMemoryInspector() {
  const memory = latestMemories.find((candidate) => candidate.memoryId === selectedMemoryId);
  const actionButtons = [promoteMemoryButton, rejectMemoryButton, disputeMemoryButton, forgetMemoryButton];
  if (!memory) {
    memoryInspectorHeading.textContent = "Nothing selected";
    memoryInspectorStatement.textContent = "Select a claim to review its evidence, scope, and authority.";
    [memoryInspectorState, memoryInspectorScope, memoryInspectorPolicy, memoryInspectorEvidence].forEach((element) => { element.textContent = "—"; });
    actionButtons.forEach((button) => { button.hidden = true; });
    memoryDecisionReason.disabled = true;
    memoryCorrectionForm.hidden = true;
    return;
  }
  memoryInspectorHeading.textContent = `${humanize(memory.layer)} claim`;
  memoryInspectorStatement.textContent = memory.statement;
  memoryInspectorState.textContent = `${humanize(memory.state)}${memory.retrievalEligible ? " · retrievable" : " · excluded"}`;
  memoryInspectorScope.textContent = Object.values(memory.scope).map(shortId).join(" / ");
  memoryInspectorPolicy.textContent = `${humanize(memory.retrievalPolicy)} · ${humanize(memory.sensitivity)}`;
  memoryInspectorEvidence.textContent = memory.evidence.length
    ? memory.evidence.map((reference) => `${reference.type}:${shortId(reference.refId)}${reference.versionId ? `@${shortId(reference.versionId)}` : ""}`).join(", ")
    : memory.searchDerivativesDeleted ? "Redacted from active projection" : "No evidence";
  memoryDecisionReason.disabled = false;
  promoteMemoryButton.hidden = !["proposed", "disputed"].includes(memory.state);
  rejectMemoryButton.hidden = memory.state !== "proposed";
  disputeMemoryButton.hidden = !["proposed", "active"].includes(memory.state);
  forgetMemoryButton.hidden = !["proposed", "active", "disputed", "expired", "rejected"].includes(memory.state);
  memoryCorrectionForm.hidden = !["proposed", "active"].includes(memory.state);
  if (document.activeElement !== memoryCorrection) memoryCorrection.value = memory.state === "forgotten" ? "" : memory.statement;
}

function memoryStateClass(state) {
  if (state === "active") return "complete";
  if (state === "proposed") return "waiting";
  if (["disputed", "rejected", "forgotten", "expired"].includes(state)) return "failed";
  return "specified";
}

function renderToolPackages(snapshot) {
  const candidate = snapshot.toolPackages?.find((toolPackage) => toolPackage.toolPackageId === "clark.toolpack.opencut.rewrite") ?? snapshot.toolPackages?.[0];
  selectedToolPackage = candidate;
  if (!candidate) {
    openCutConnectionState.textContent = "Unavailable";
    openCutConnectionState.className = "state failed";
    openCutConnectionDetail.textContent = "No workspace-scoped Tool Package projection";
    toolPackReason.textContent = "No Tool Package candidate is registered in this workspace.";
    return;
  }
  openCutConnectionState.textContent = candidate.state === "blocked_upstream" ? "Upstream blocked" : humanize(candidate.state);
  openCutConnectionState.className = `state ${candidate.activationEligible ? "complete" : "quarantine"}`;
  openCutConnectionDetail.textContent = `${candidate.sourceRevision.slice(0, 10)} · ${candidate.stableInterfaceCount} stable interfaces · ${candidate.componentCounts.capabilities} capabilities`;
  toolPackName.textContent = `${candidate.name} ${candidate.revision}`;
  toolPackReason.textContent = candidate.statusReason;
  toolPackSource.textContent = `${candidate.sourceRevision.slice(0, 10)} · ${shortHash(candidate.sourceHash)}`;
  toolPackManifest.textContent = shortHash(candidate.manifestHash);
  const installedComponents = Object.values(candidate.componentCounts).reduce((total, value) => total + value, 0);
  toolPackComponents.textContent = `${installedComponents} declared components · ${candidate.installed ? "package retained" : "not installed"}`;
  toolPackPath.textContent = `${candidate.preferredPath === "mcp" ? "MCP" : humanize(candidate.preferredPath)} · ${candidate.stableInterfaceCount} stable`;
  toolPackGates.replaceChildren(...candidate.gates.map((gate) => {
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = gate.label;
    const status = document.createElement("strong");
    status.className = gate.status;
    status.textContent = humanize(gate.status);
    const evidence = document.createElement("small");
    evidence.textContent = gate.evidence;
    item.append(label, status, evidence);
    return item;
  }));
  const blockers = candidate.gates.filter((gate) => gate.status !== "pass").length;
  toolPackDecision.textContent = candidate.activationEligible
    ? "Every declared activation gate passes. Creator activation is still a separate decision and grants only the package's exact capability inventory."
    : `${blockers} activation gates remain pending or blocked. ${candidate.installed ? "The package is retained in quarantine, but no declared contribution is executable." : "No code, adapter, capability, converter, skill, or UI contribution from this candidate is installed or executable."}`;
  const canActivate = candidate.activationEligible && ["quarantined", "testing"].includes(candidate.state);
  const canRollback = candidate.state === "active" && Boolean(candidate.rollbackRevision);
  resolveToolPack.disabled = !canActivate && !canRollback;
  resolveToolPack.dataset.action = canRollback ? "rollback" : "activate";
  resolveToolPack.textContent = canRollback ? `Roll back to ${candidate.rollbackRevision}` : canActivate ? "Activate exact revision" : "Activation blocked";
}

function setCanvasNode(name, title, detail) {
  const button = nodeButtons.find((candidate) => candidate.dataset.node === name);
  if (!button) return;
  button.querySelector("strong").textContent = title;
  button.querySelector("small").textContent = detail;
}

function listItem(text) {
  const item = document.createElement("li");
  item.textContent = text;
  return item;
}

function humanize(value) {
  return String(value ?? "unknown").replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());
}

function shortId(value) { return String(value).split(".").at(-1).slice(0, 8); }
function shortHash(value) { return String(value).replace("sha256:", "").slice(0, 10); }

async function refreshHarness() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = window.clarkDesktop.getHarnessState()
    .then((snapshot) => {
      setHarnessAvailability(snapshot);
      renderRun(snapshot.runs?.[0]);
      renderMemory(snapshot);
      renderToolPackages(snapshot);
      return snapshot;
    })
    .catch((error) => {
      setHarnessAvailability({ available: false, state: "unavailable" });
      announcer.textContent = `Harness unavailable: ${error.message}`;
    })
    .finally(() => { refreshPromise = undefined; });
  return refreshPromise;
}

ideaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  runButton.disabled = true;
  runButton.textContent = latestRun ? "Creating revision…" : "Structuring…";
  try {
    const result = latestRun
      ? await window.clarkDesktop.reviseIdea({ parentRunId: latestRun.runId, ideaText: ideaInput.value, revisionReason: revisionReason.value })
      : await window.clarkDesktop.startIdeaLoop(ideaInput.value);
    renderRun(result.run);
    if (latestRun?.revisionNumber > 1) revisionReason.value = "";
    announcer.textContent = latestRun?.revisionNumber > 1
      ? `Idea revision ${latestRun.revisionNumber} created. Its structure and evidence gaps are visible in Canvas.`
      : "Idea brief created locally and waiting for exact-version approval.";
  } catch (error) {
    announcer.textContent = `Idea loop interrupted: ${error.message}`;
  } finally {
    await refreshHarness();
  }
});

async function resolveBrief(decision) {
  if (!latestRun?.approval) return;
  approveBrief.disabled = true;
  rejectBrief.disabled = true;
  try {
    const run = await window.clarkDesktop.resolveIdeaApproval({
      runId: latestRun.runId,
      approvalId: latestRun.approval.approvalId,
      decision,
      reason: decision === "approve" ? "Creator approved the exact local brief version." : "Creator requested a revised brief."
    });
    renderRun(run);
    announcer.textContent = decision === "approve" ? "Exact brief version approved. No publication authority was granted." : "Brief rejected. The run requires revision.";
  } catch (error) {
    announcer.textContent = `Approval decision failed: ${error.message}`;
  } finally {
    approveBrief.disabled = false;
    rejectBrief.disabled = false;
  }
}

approveBrief.addEventListener("click", () => void resolveBrief("approve"));
rejectBrief.addEventListener("click", () => void resolveBrief("reject"));

memoryProposalForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!latestRun?.draft) return;
  proposeMemoryButton.disabled = true;
  try {
    const result = await window.clarkDesktop.proposeMemoryFromRun({
      runId: latestRun.runId,
      statement: memoryStatement.value,
      layer: memoryLayer.value,
      confidence: Number(memoryConfidence.value),
      sensitivity: memorySensitivity.value,
      retrievalPolicy: memoryPolicy.value
    });
    selectedMemoryId = result.memory.memoryId;
    announcer.textContent = "Memory proposed with exact evidence. It is excluded from retrieval until you promote it.";
    await refreshHarness();
  } catch (error) {
    announcer.textContent = `Memory proposal failed: ${error.message}`;
  } finally {
    proposeMemoryButton.disabled = !harnessReady || !latestRun?.draft;
  }
});

async function resolveSelectedMemory(action) {
  const memory = latestMemories.find((candidate) => candidate.memoryId === selectedMemoryId);
  if (!memory) return;
  [promoteMemoryButton, rejectMemoryButton, disputeMemoryButton, forgetMemoryButton].forEach((button) => { button.disabled = true; });
  try {
    const result = await window.clarkDesktop.resolveMemory({ memoryId: memory.memoryId, action, reason: memoryDecisionReason.value });
    selectedMemoryId = result.memory.memoryId;
    announcer.textContent = action === "forget"
      ? "Memory removed from retrieval and redacted in the active projection; its immutable audit event remains."
      : `Memory ${action} decision recorded. State: ${result.memory.state}.`;
    await refreshHarness();
  } catch (error) {
    announcer.textContent = `Memory decision failed: ${error.message}`;
  } finally {
    [promoteMemoryButton, rejectMemoryButton, disputeMemoryButton, forgetMemoryButton].forEach((button) => { button.disabled = false; });
  }
}

promoteMemoryButton.addEventListener("click", () => void resolveSelectedMemory("promote"));
rejectMemoryButton.addEventListener("click", () => void resolveSelectedMemory("reject"));
disputeMemoryButton.addEventListener("click", () => void resolveSelectedMemory("dispute"));
forgetMemoryButton.addEventListener("click", () => void resolveSelectedMemory("forget"));

memoryCorrectionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const memory = latestMemories.find((candidate) => candidate.memoryId === selectedMemoryId);
  if (!memory) return;
  const button = document.querySelector("#correct-memory");
  button.disabled = true;
  try {
    const result = await window.clarkDesktop.correctMemory({
      memoryId: memory.memoryId,
      statement: memoryCorrection.value,
      reason: memoryCorrectionReason.value
    });
    selectedMemoryId = result.memory.memoryId;
    announcer.textContent = "Correction recorded: the old claim is disputed and a linked replacement proposal is waiting for review.";
    await refreshHarness();
  } catch (error) {
    announcer.textContent = `Memory correction failed: ${error.message}`;
  } finally {
    button.disabled = false;
  }
});

memoryRetrievalForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  retrieveMemoryButton.disabled = true;
  try {
    const result = await window.clarkDesktop.retrieveMemory({
      query: memoryQuery.value,
      destination: memoryDestination.value,
      maxSensitivity: memoryMaxSensitivity.value,
      includeExplicitOnly: memoryIncludeExplicit.checked
    });
    const summary = document.createElement("p");
    summary.textContent = `${result.memories.length} active ${result.memories.length === 1 ? "claim" : "claims"} · ${humanize(result.destination)} · audit ${shortHash(result.queryHash)}`;
    const list = document.createElement("ul");
    list.append(...result.memories.map((memory) => listItem(memory.statement)));
    memoryRetrievalResult.replaceChildren(summary, list);
    announcer.textContent = `${result.memories.length} policy-eligible memory claims retrieved. The raw query was not written to the event log.`;
  } catch (error) {
    announcer.textContent = `Memory retrieval failed: ${error.message}`;
  } finally {
    retrieveMemoryButton.disabled = !harnessReady;
    await refreshHarness();
  }
});

recheckToolPack.addEventListener("click", async () => {
  recheckToolPack.disabled = true;
  try {
    const snapshot = await refreshHarness();
    renderToolPackages(snapshot);
    const candidate = snapshot?.toolPackages?.[0];
    announcer.textContent = candidate?.activationEligible
      ? "Tool Package gates pass, but activation still requires a separate creator decision."
      : "Tool Package gates rechecked. OpenCut remains upstream-blocked with zero installed authority.";
  } finally {
    recheckToolPack.disabled = false;
  }
});

resolveToolPack.addEventListener("click", async () => {
  if (!selectedToolPackage || resolveToolPack.disabled) return;
  const action = resolveToolPack.dataset.action;
  resolveToolPack.disabled = true;
  try {
    const result = await window.clarkDesktop.resolveToolPackage({
      toolPackageId: selectedToolPackage.toolPackageId,
      revision: selectedToolPackage.revision,
      action,
      reason: action === "rollback" ? "Creator restored the pinned verified rollback revision." : "Creator reviewed every exact activation and rollback gate."
    });
    announcer.textContent = action === "rollback" ? `Tool Package rolled back to ${result.revision}.` : `Tool Package ${result.revision} activated with its exact component inventory.`;
    await refreshHarness();
  } catch (error) {
    announcer.textContent = `Tool Package decision failed: ${error.message}`;
  } finally {
    renderToolPackages({ toolPackages: selectedToolPackage ? [selectedToolPackage] : [] });
  }
});

window.clarkDesktop.onHarnessEvent(() => void refreshHarness());

const initialState = await window.clarkDesktop.getShellState();
await activateSection(initialState.activeSection, { persist: false });
await refreshHarness();
