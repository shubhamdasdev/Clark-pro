const sections = ["focus", "canvas", "connections"];
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
  const shortcuts = { "1": "focus", "2": "canvas", "7": "connections" };
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
let latestRun;
let refreshPromise;
let harnessReady = false;

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
    ? `${snapshot.bridge.host}:${snapshot.bridge.port} · ${snapshot.bridge.tools.length} scoped tools · bearer kept outside renderer`
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
window.clarkDesktop.onHarnessEvent(() => void refreshHarness());

const initialState = await window.clarkDesktop.getShellState();
await activateSection(initialState.activeSection, { persist: false });
await refreshHarness();
