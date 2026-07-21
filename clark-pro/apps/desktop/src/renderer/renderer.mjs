import { changedLineIndexes } from "./comparison.mjs";

const sections = ["focus", "canvas", "review", "writing", "memory", "connections"];
const sectionLabels = {
  focus: "Today",
  canvas: "Shape",
  review: "Review",
  writing: "Write",
  memory: "Knowledge",
  connections: "Integrations"
};
const tabs = new Map(sections.map((section) => [section, document.querySelector(`[data-section="${section}"]`)]));
const views = new Map(sections.map((section) => [section, document.querySelector(`[data-view="${section}"]`)]));
const announcer = document.querySelector("#announcer");

async function activateSection(section, { focus = false, persist = true } = {}) {
  if (!sections.includes(section)) return;
  if (document.querySelector("dialog[open]") && section !== "review") {
    announcer.textContent = "Finish or cancel the open decision before changing views.";
    return;
  }
  const changed = tabs.get(section).getAttribute("aria-selected") !== "true";
  for (const name of sections) {
    const selected = name === section;
    tabs.get(name).setAttribute("aria-selected", String(selected));
    tabs.get(name).tabIndex = selected ? 0 : -1;
    views.get(name).hidden = !selected;
  }
  if (focus) tabs.get(section).focus();
  announcer.textContent = `${sectionLabels[section]} view opened`;
  document.title = `${sectionLabels[section]} — Clark Pro`;
  if (changed) document.querySelector("#workspace").scrollTop = 0;
  if (persist) await window.clarkDesktop.setActiveSection(section);
  if (section === "writing") void refreshWriting();
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
  const shortcuts = { "1": "focus", "2": "canvas", "3": "review", "4": "writing", "6": "memory", "7": "connections" };
  if (shortcuts[event.key]) {
    event.preventDefault();
    void activateSection(shortcuts[event.key], { focus: true });
  }
});

let nodeDetails = {
  idea: ["Your idea", "You", "No version yet", "Stored on this Mac", "Not assessed"],
  assessment: ["Idea check", "Clark can inspect, not change", "Your idea", "Runs on this Mac", "Not assessed"],
  evidence: ["Proof needed", "No proof is assumed", "Questions from the idea check", "Real observations required", "Not observed"],
  brief: ["Working brief", "Proposal for your review", "Your idea and its clarity check", "Stored on this Mac", "Not created"],
  review: ["Your review", "You", "The exact working brief", "No publishing permission", "Nothing waiting"]
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
  announcer.textContent = "Permission summary. Files, accounts, and publishing remain separate decisions.";
}

document.querySelector("#review-trust").addEventListener("click", focusTrustCenter);
const todayDate = document.querySelector("#today-date");
const startIdeaButton = document.querySelector("#start-idea");
const focusStage = document.querySelector("#focus-stage");
const focusProgress = document.querySelector("#focus-progress");
const focusStageDetail = document.querySelector("#focus-stage-detail");

todayDate.textContent = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric"
}).format(new Date());

startIdeaButton.addEventListener("click", () => {
  document.querySelector("#idea-input").focus();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelector("#idea-loop-form").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
});

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
const skillConnectionState = document.querySelector("#skill-connection-state");
const skillConnectionDetail = document.querySelector("#skill-connection-detail");
const skillEyebrow = document.querySelector("#skill-eyebrow");
const skillName = document.querySelector("#skill-name");
const skillReason = document.querySelector("#skill-reason");
const skillSource = document.querySelector("#skill-source");
const skillFiles = document.querySelector("#skill-files");
const skillRequested = document.querySelector("#skill-requested");
const skillTrusted = document.querySelector("#skill-trusted");
const skillGates = document.querySelector("#skill-gates");
const skillDecision = document.querySelector("#skill-decision");
const recheckSkill = document.querySelector("#recheck-skill");
const resolveSkillButton = document.querySelector("#resolve-skill");
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
const improveBrief = document.querySelector("#improve-brief");
const openReview = document.querySelector("#open-review");
const reviewMode = document.querySelector("#review-mode");
const reviewQueueCount = document.querySelector("#review-queue-count");
const reviewQueue = document.querySelector("#review-queue");
const reviewEmpty = document.querySelector("#review-empty");
const reviewComparison = document.querySelector("#review-comparison");
const reviewStartIdea = document.querySelector("#review-start-idea");
const reviewVersionLabel = document.querySelector("#review-version-label");
const reviewComparisonHeading = document.querySelector("#review-comparison-heading");
const reviewRevisionNote = document.querySelector("#review-revision-note");
const reviewState = document.querySelector("#review-state");
const reviewCurrentHash = document.querySelector("#review-current-hash");
const reviewParentVersion = document.querySelector("#review-parent-version");
const reviewPreviousHeading = document.querySelector("#review-previous-heading");
const reviewPreviousHash = document.querySelector("#review-previous-hash");
const reviewPreviousText = document.querySelector("#review-previous-text");
const reviewCurrentHeading = document.querySelector("#review-current-heading");
const reviewCurrentShortHash = document.querySelector("#review-current-short-hash");
const reviewCurrentText = document.querySelector("#review-current-text");
const reviewVersionGate = document.querySelector("#review-version-gate");
const reviewLineageGate = document.querySelector("#review-lineage-gate");
const reviewEvidenceGate = document.querySelector("#review-evidence-gate");
const reviewDecisionHeading = document.querySelector("#review-decision-heading");
const reviewDecisionHelp = document.querySelector("#review-decision-help");
const openReviewDecision = document.querySelector("#open-review-decision");
const reviewDecisionDialog = document.querySelector("#review-decision-dialog");
const reviewDecisionForm = document.querySelector("#review-decision-form");
const reviewDialogTitle = document.querySelector("#review-dialog-title");
const reviewDialogVersion = document.querySelector("#review-dialog-version");
const reviewDialogHash = document.querySelector("#review-dialog-hash");
const reviewDecisionApprove = document.querySelector("#review-decision-approve");
const reviewDecisionReject = document.querySelector("#review-decision-reject");
const reviewDecisionReason = document.querySelector("#review-decision-reason");
const reviewDecisionError = document.querySelector("#review-decision-error");
const cancelReviewDecision = document.querySelector("#cancel-review-decision");
const submitReviewDecision = document.querySelector("#submit-review-decision");
const obsidianStatus = document.querySelector("#obsidian-status");
const connectObsidianButton = document.querySelector("#connect-obsidian");
const newWritingDraftButton = document.querySelector("#new-writing-draft");
const writingDraftList = document.querySelector("#writing-draft-list");
const writingEmpty = document.querySelector("#writing-empty");
const writingEmptyCreate = document.querySelector("#writing-empty-create");
const writingEditor = document.querySelector("#writing-editor");
const writingSavingState = document.querySelector("#writing-saving-state");
const writingWordCount = document.querySelector("#writing-word-count");
const writingTitle = document.querySelector("#writing-title");
const writingBody = document.querySelector("#writing-body");
const writingExportNote = document.querySelector("#writing-export-note");
const exportObsidianButton = document.querySelector("#export-obsidian");
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
let latestRuns = [];
let selectedReviewRunId;
let reviewDecisionPending = false;
let refreshPromise;
let harnessReady = false;
let latestMemories = [];
let selectedMemoryId;
let selectedToolPackage;
let selectedSkill;

const runStateLabels = {
  planned: "Preparing", running: "Shaping", recovering: "Restoring", waiting_approval: "Waiting for review",
  completed: "Approved", failed: "Revision needed", cancelled: "Cancelled"
};

const memoryKindLabels = {
  identity: "Preference",
  semantic: "Fact",
  episodic: "Past work",
  procedural: "Process",
  performance: "Performance"
};

const memoryPolicyLabels = {
  default: "Use when relevant",
  explicit_only: "Ask every time",
  never_send_to_model: "Keep out of models"
};

const memoryDestinationLabels = {
  creator_view: "This view only",
  local_model: "Local model",
  remote_model: "Remote model"
};

function setHarnessAvailability(snapshot) {
  const ready = snapshot.available && snapshot.state === "ready";
  harnessReady = ready;
  const updateCount = snapshot.database?.eventCount ?? 0;
  harnessState.textContent = ready ? `Saved locally · ${updateCount} updates` : runStateLabels[snapshot.state] ?? "Unavailable";
  harnessRail.textContent = ready ? "All changes saved locally" : "Local workspace unavailable";
  document.querySelector("#harness-rail-status").classList.toggle("ready", ready);
  harnessConnectionState.textContent = ready ? "Available" : snapshot.state ?? "Unavailable";
  harnessConnectionState.className = `state ${ready ? "complete" : "waiting"}`;
  harnessConnectionDetail.textContent = ready ? `Your work is saved on this Mac · ${updateCount} recorded updates` : "Your local workspace could not be opened";
  const inspector = snapshot.capabilities
    ?.filter((capability) => capability.id === "clark.idea.inspect.mcp")
    .sort((left, right) => right.version.localeCompare(left.version, undefined, { numeric: true }))[0];
  const inspectorLive = ready && inspector?.state === "healthy";
  capabilityConnectionState.textContent = inspectorLive ? "Available" : inspector?.state ?? "Unavailable";
  capabilityConnectionState.className = `state ${inspectorLive ? "complete" : "waiting"}`;
  capabilityConnectionDetail.textContent = inspector
    ? "Built in · runs locally · no account or network access"
    : "The built-in idea check is unavailable";
  const bridgeLive = ready && snapshot.bridge?.state === "ready";
  bridgeConnectionState.textContent = bridgeLive ? "Available" : snapshot.bridge?.state ?? "Unavailable";
  bridgeConnectionState.className = `state ${bridgeLive ? "complete" : "waiting"}`;
  bridgeConnectionDetail.textContent = bridgeLive
    ? `Private connection on this Mac · ${snapshot.bridge.tools.length} scoped tools · knowledge remains separate`
    : "The private local tool connection is unavailable";
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
    ideaFormContext.textContent = "Runs on this Mac. Nothing is published or sent to an account.";
    runButton.textContent = "Shape this idea";
    runButton.disabled = !harnessReady;
    focusStage.textContent = "Ready to begin";
    focusProgress.textContent = "Step 1 of 3";
    focusStageDetail.textContent = "Write the idea in your own words. It does not need to be polished.";
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
    ? `Version ${run.revisionNumber} is saved. Explain what the next version improves.`
    : "Clark is shaping this idea locally. You can revise it when the working brief is ready.";
  runButton.textContent = canRevise ? "Shape a new revision" : "Shaping locally…";
  runButton.disabled = !harnessReady || !canRevise;
  const lineage = `revision ${run.revisionNumber}${run.parentRunId ? ` · parent ${shortId(run.parentRunId)}` : " · root"}`;
  runIntegrity.textContent = run.draft ? `${lineage} · ${run.eventCount} correlated events · ${run.draft.contentHash}${run.recoveredFromCheckpoint ? " · restored from checkpoint" : ""}` : `${lineage} · ${run.eventCount} correlated events`;
  if (["planned", "running", "recovering"].includes(run.state)) {
    focusStage.textContent = "Shaping your idea";
    focusProgress.textContent = "Step 2 of 3";
    focusStageDetail.textContent = "Clark is organizing the thought and separating clear claims from assumptions.";
  } else if (run.state === "waiting_approval") {
    focusStage.textContent = "Waiting for your review";
    focusProgress.textContent = "Step 3 of 3";
    focusStageDetail.textContent = "Read the working brief and approve this exact wording or create a stronger revision.";
  } else if (run.state === "completed") {
    focusStage.textContent = "Version approved";
    focusProgress.textContent = "Loop complete";
    focusStageDetail.textContent = "This exact brief is approved. The idea still needs real-world evidence before it is validated.";
  } else {
    focusStage.textContent = "Revision requested";
    focusProgress.textContent = "Needs your input";
    focusStageDetail.textContent = "Update the idea and explain what the next version will make clearer.";
  }
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
  readinessHeading.textContent = `${explicitCount}/${totalCount} parts clear · ${state === "ready_for_evidence" ? "ready to test" : "needs clarification"}`;
  readinessSummary.textContent = assessment.summary;
  readinessGaps.textContent = assessment.missingFacets.length
    ? `Make these clearer: ${assessment.missingFacets.map(humanize).join(", ")}.`
    : "The structure is clear. You still need observed demand, payment, and repeat-use evidence.";
}

function renderCanvas(run, assessment) {
  if (!run) {
    canvasLineage.textContent = "Waiting for your first idea";
    canvasReadiness.textContent = "Not assessed";
    evidenceGapList.replaceChildren(listItem("Start an idea to reveal its proof questions."));
    return;
  }
  const revision = `Revision ${run.revisionNumber}`;
  const structural = assessment?.structuralCompleteness;
  const readiness = assessment?.readiness === "evidence_required" ? "Ready to test" : assessment ? "Needs clarification" : "Check in progress";
  canvasLineage.textContent = `${revision}${run.parentRunId ? " · based on an earlier version" : " · first version"}`;
  canvasReadiness.textContent = readiness;
  setCanvasNode("idea", `Your idea · v${run.revisionNumber}`, "Saved exactly as you wrote it");
  setCanvasNode("assessment", "Idea check", assessment ? `${structural.explicitCount}/${structural.totalCount} parts clear` : "Local check in progress");
  setCanvasNode("evidence", "Proof needed", assessment ? `${assessment.evidenceGaps.length} real-world questions open` : "No proof is assumed");
  setCanvasNode("brief", `Working brief · v${run.revisionNumber}`, run.draft ? "Ready to read" : "Being prepared");
  setCanvasNode("review", "Your review", run.approval ? `${humanize(run.approval.state)} · this wording only` : "No decision waiting");
  nodeDetails = {
    idea: [`Your idea · v${run.revisionNumber}`, "You", run.parentRunId ? "An earlier version of your idea" : "Your first captured version", "Stored exactly on this Mac", revision],
    assessment: ["Idea check", "Clark can inspect, not change", `Your idea · version ${run.revisionNumber}`, "Runs locally with no files or accounts", structural ? `${structural.explicitCount}/${structural.totalCount} parts clear` : "In progress"],
    evidence: ["Proof needed", "No proof can be invented", "Questions created from the idea check", "Observed or cited inputs required", assessment ? `${assessment.evidenceGaps.length} questions open` : "In progress"],
    brief: [`Working brief · v${run.revisionNumber}`, "Proposal for your review", `Your idea and its clarity check`, "Stored locally", run.draft ? "Ready to review" : "In progress"],
    review: ["Your review", "You", `Working brief · version ${run.revisionNumber}`, "No build or publishing permission", run.approval ? humanize(run.approval.state) : humanize(run.state)]
  };
  const gaps = assessment?.evidenceGaps ?? ["problem_interviews", "workaround_baseline", "behavioral_demand", "willingness_to_pay", "retention_or_repeat_use"];
  evidenceGapList.replaceChildren(...gaps.map((gap) => listItem(humanize(gap))));
  const selected = nodeButtons.find((button) => button.classList.contains("selected")) ?? nodeButtons[0];
  inspectNode(selected);
}

function renderReview(runs = latestRuns) {
  latestRuns = runs;
  const waitingRuns = latestRuns.filter((run) => run.state === "waiting_approval" && run.approval?.state === "waiting");
  reviewMode.textContent = waitingRuns.length
    ? `${waitingRuns.length} waiting for you`
    : latestRuns.length ? "All caught up" : "Nothing waiting";
  reviewQueueCount.textContent = `${latestRuns.length} ${latestRuns.length === 1 ? "version" : "versions"}`;

  if (!latestRuns.some((run) => run.runId === selectedReviewRunId)) {
    selectedReviewRunId = waitingRuns[0]?.runId ?? latestRuns[0]?.runId;
  }

  if (!latestRuns.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Create a working brief to begin a review.";
    reviewQueue.replaceChildren(empty);
    reviewEmpty.hidden = false;
    reviewComparison.hidden = true;
    return;
  }

  reviewQueue.replaceChildren(...latestRuns.map(reviewQueueItem));
  const run = latestRuns.find((candidate) => candidate.runId === selectedReviewRunId) ?? latestRuns[0];
  const parent = run.parentRunId ? latestRuns.find((candidate) => candidate.runId === run.parentRunId) : undefined;
  const status = reviewStatus(run);
  const assessment = parseThesis(run.analysis?.text);
  const canDecide = run.state === "waiting_approval" && run.approval?.state === "waiting";

  reviewEmpty.hidden = true;
  reviewComparison.hidden = false;
  reviewVersionLabel.textContent = `Version ${run.revisionNumber} · ${run.parentRunId ? "revision" : "first version"}`;
  reviewComparisonHeading.textContent = `Working brief · version ${run.revisionNumber}`;
  reviewRevisionNote.textContent = run.revisionReason
    ? `Revision reason: ${run.revisionReason}`
    : "First captured version. No earlier revision reason exists.";
  reviewState.textContent = status.label;
  reviewState.className = `state ${status.className}`;
  reviewCurrentHash.textContent = run.draft?.contentHash ?? "Brief is still being prepared";
  reviewCurrentShortHash.textContent = run.draft ? shortHash(run.draft.contentHash) : "Preparing";
  reviewCurrentHeading.textContent = `Version ${run.revisionNumber}`;
  reviewVersionGate.textContent = run.draft ? `Exact local version · ${shortHash(run.draft.contentHash)}` : "Exact version is still being prepared";
  reviewLineageGate.textContent = parent
    ? `Based on version ${parent.revisionNumber}`
    : run.parentRunId ? "Parent retained outside recent history" : "First-version lineage retained";

  if (parent?.draft) {
    reviewParentVersion.textContent = `Version ${parent.revisionNumber} · ${shortHash(parent.draft.contentHash)}`;
    reviewPreviousHeading.textContent = `Version ${parent.revisionNumber}`;
    reviewPreviousHash.textContent = shortHash(parent.draft.contentHash);
    renderComparedText(reviewPreviousText, parent.draft.text, run.draft?.text, "removed");
  } else {
    reviewParentVersion.textContent = run.parentRunId ? `Parent ${shortId(run.parentRunId)} · outside recent history` : "No parent · first captured version";
    reviewPreviousHeading.textContent = run.parentRunId ? "Earlier version unavailable" : "No parent version";
    reviewPreviousHash.textContent = "—";
    const placeholder = document.createElement("p");
    placeholder.className = "comparison-placeholder";
    placeholder.textContent = run.parentRunId
      ? "The parent remains in canonical history but is outside this recent-version window."
      : "This is the first version, so there is no earlier brief to compare.";
    reviewPreviousText.replaceChildren(placeholder);
  }
  renderComparedText(reviewCurrentText, run.draft?.text ?? "The brief is still being prepared.", parent?.draft?.text, parent?.draft ? "added" : undefined);

  if (assessment) {
    const { explicitCount, totalCount } = assessment.structuralCompleteness;
    reviewEvidenceGate.textContent = `${explicitCount}/${totalCount} parts clear · observed evidence still required`;
  } else {
    reviewEvidenceGate.textContent = "Real-world evidence still required";
  }

  const decision = reviewDecisionCopy(run);
  reviewDecisionHeading.textContent = decision.heading;
  reviewDecisionHelp.textContent = decision.help;
  openReviewDecision.disabled = !canDecide;
  openReviewDecision.textContent = canDecide ? `Decide on version ${run.revisionNumber}` : decision.button;
}

function reviewQueueItem(run) {
  const item = document.createElement("div");
  item.setAttribute("role", "listitem");
  const button = document.createElement("button");
  const status = reviewStatus(run);
  const selected = run.runId === selectedReviewRunId;
  button.type = "button";
  button.className = `review-queue-item${selected ? " selected" : ""}`;
  button.dataset.runId = run.runId;
  button.setAttribute("aria-pressed", String(selected));
  button.setAttribute("aria-label", `Version ${run.revisionNumber}, ${status.label}`);

  const heading = document.createElement("span");
  heading.className = "review-queue-item-heading";
  const title = document.createElement("strong");
  title.textContent = `Version ${run.revisionNumber}`;
  const state = document.createElement("span");
  state.className = `state ${status.className}`;
  state.textContent = status.label;
  heading.append(title, state);

  const reason = document.createElement("p");
  reason.textContent = run.revisionReason ?? (run.parentRunId ? "Revised wording" : "First captured brief");
  const details = document.createElement("small");
  details.textContent = `${run.draft ? shortHash(run.draft.contentHash) : "preparing"} · ${formatReviewTime(run.updatedAt)}`;
  button.append(heading, reason, details);
  button.addEventListener("click", () => {
    selectedReviewRunId = run.runId;
    renderReview(latestRuns);
    [...reviewQueue.querySelectorAll(".review-queue-item")]
      .find((candidate) => candidate.dataset.runId === run.runId)
      ?.focus();
    announcer.textContent = `Version ${run.revisionNumber} selected. ${status.label}.`;
  });
  item.append(button);
  return item;
}

function reviewStatus(run) {
  if (run.approval?.state === "rejected") return { label: "Needs revision", className: "failed" };
  if (run.state === "failed") return { label: "Run stopped", className: "failed" };
  if (run.approval?.state === "waiting") return { label: "Waiting", className: "waiting" };
  if (run.approval?.state === "approved" || run.state === "completed") return { label: "Approved", className: "complete" };
  if (run.approval?.state === "invalidated") return { label: "Superseded", className: "specified" };
  if (["planned", "running", "recovering"].includes(run.state)) return { label: "Preparing", className: "running" };
  return { label: humanize(run.state), className: "specified" };
}

function reviewDecisionCopy(run) {
  if (run.approval?.state === "rejected") {
    return { heading: "This version was sent back", help: `Reason: ${run.approval?.reason ?? "Creator requested a revision."} Revise the idea in Today to create a new review.`, button: "Needs revision" };
  }
  if (run.state === "failed") {
    return { heading: "This run stopped before your decision", help: "No creator rejection was recorded. Check the run status in Today before retrying or revising.", button: "Run stopped" };
  }
  if (run.approval?.state === "waiting" && run.state === "waiting_approval") {
    return { heading: "Your decision is required", help: "Approve or send back this exact wording. Record a reason either way.", button: "Decide on this version" };
  }
  if (run.approval?.state === "approved" || run.state === "completed") {
    return { heading: "This wording is approved", help: `Reason: ${run.approval?.reason ?? "Creator approved the exact wording."} Nothing was published.`, button: "Already approved" };
  }
  if (run.approval?.state === "invalidated") {
    return { heading: "A newer version replaced this gate", help: "This version remains in history, but its old approval authority cannot transfer forward.", button: "Superseded" };
  }
  return { heading: "Decision not ready", help: "The exact brief must finish preparing before a decision can be recorded.", button: "Not ready" };
}

function renderComparedText(container, text, comparisonText, changeClass) {
  const pre = document.createElement("pre");
  const lines = String(text).split("\n");
  const changedIndexes = comparisonText === undefined
    ? new Set()
    : changedLineIndexes(lines, String(comparisonText).split("\n"));
  for (const [index, line] of lines.entries()) {
    const row = document.createElement("span");
    const changed = changedIndexes.has(index) && changeClass;
    row.className = `comparison-line${changed && changeClass ? ` ${changeClass}` : ""}`;
    const marker = document.createElement("span");
    marker.className = "comparison-change-marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = changed ? (changeClass === "added" ? "+" : "−") : "";
    if (changed) {
      const changeLabel = document.createElement("span");
      changeLabel.className = "sr-only";
      changeLabel.textContent = `${changeClass === "added" ? "Added" : "Removed"} line: `;
      row.append(changeLabel);
    }
    const copy = document.createElement("span");
    copy.textContent = line || " ";
    row.append(marker, copy);
    pre.append(row);
  }
  container.replaceChildren(pre);
}

function formatReviewTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved locally";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

function renderMemory(snapshot) {
  latestMemories = snapshot.memories ?? [];
  const count = (state) => latestMemories.filter((memory) => memory.state === state).length;
  const activeCount = count("active");
  memoryMode.textContent = `${activeCount} in use`;
  memoryProposedCount.textContent = String(count("proposed"));
  memoryActiveCount.textContent = String(activeCount);
  memoryDisputedCount.textContent = String(count("disputed"));
  memoryLedgerCount.textContent = `${latestMemories.length} ${latestMemories.length === 1 ? "claim" : "claims"}`;
  const evidenceReady = harnessReady && Boolean(latestRun?.draft);
  proposeMemoryButton.disabled = !evidenceReady;
  retrieveMemoryButton.disabled = !harnessReady;
  memoryEvidenceContext.textContent = evidenceReady
    ? `Source: your latest working brief. This will remain a proposal until you approve it.`
    : "Create a working brief first so this claim has a source.";

  if (!latestMemories.some((memory) => memory.memoryId === selectedMemoryId)) {
    selectedMemoryId = latestMemories.find((memory) => memory.state !== "forgotten")?.memoryId ?? latestMemories[0]?.memoryId;
  }
  if (!latestMemories.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No saved knowledge yet. Create a brief, then propose the first useful claim.";
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
  detail.textContent = `${memoryKindLabels[memory.layer] ?? humanize(memory.layer)} · ${Math.round(memory.confidence * 100)}% confidence · ${memoryPolicyLabels[memory.retrievalPolicy] ?? humanize(memory.retrievalPolicy)}`;
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
  memoryInspectorHeading.textContent = `${memoryKindLabels[memory.layer] ?? humanize(memory.layer)} claim`;
  memoryInspectorStatement.textContent = memory.statement;
  memoryInspectorState.textContent = `${humanize(memory.state)}${memory.retrievalEligible ? " · retrievable" : " · excluded"}`;
  memoryInspectorScope.textContent = Object.values(memory.scope).map(shortId).join(" / ");
  memoryInspectorPolicy.textContent = `${memoryPolicyLabels[memory.retrievalPolicy] ?? humanize(memory.retrievalPolicy)} · ${humanize(memory.sensitivity)}`;
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
    openCutConnectionDetail.textContent = "No OpenCut candidate is available for review";
    toolPackReason.textContent = "No OpenCut package is registered in this workspace.";
    return;
  }
  openCutConnectionState.textContent = candidate.state === "blocked_upstream" ? "Not available" : humanize(candidate.state);
  openCutConnectionState.className = `state ${candidate.activationEligible ? "complete" : "quarantine"}`;
  openCutConnectionDetail.textContent = candidate.activationEligible
    ? "Every required review passes · still needs your activation"
    : `Review found ${candidate.componentCounts.capabilities} usable capabilities · nothing can run`;
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

function renderSkills(snapshot) {
  const candidate = snapshot.skills?.find((skill) => skill.skillId === "clark.skill.evidence-brief-review") ?? snapshot.skills?.[0];
  selectedSkill = candidate;
  if (!candidate) {
    skillConnectionState.textContent = "Unavailable";
    skillConnectionState.className = "state failed";
    skillConnectionDetail.textContent = "No review procedure is available";
    skillReason.textContent = "No procedure version is installed in this workspace.";
    resolveSkillButton.disabled = true;
    return;
  }
  skillConnectionState.textContent = candidate.state === "active" ? "Trusted" : "Waiting for trust";
  skillConnectionState.className = `state ${candidate.state === "active" ? "complete" : candidate.activationEligible ? "tested" : "quarantine"}`;
  skillConnectionDetail.textContent = candidate.state === "active"
    ? "This exact procedure is trusted · each future use still needs permission"
    : "Checks passed · review this exact procedure before it can be trusted";
  skillEyebrow.textContent = candidate.state === "active" ? `Trusted Class ${candidate.executionClass} revision` : `Bundled Class ${candidate.executionClass} candidate`;
  skillName.textContent = `${candidate.name} ${candidate.revision}`;
  skillReason.textContent = candidate.state === "active"
    ? "This exact declarative revision is trusted. It still cannot run without a current run and an effective permission receipt."
    : candidate.description;
  skillSource.textContent = `${humanize(candidate.sourceKind)} ${candidate.sourceRevision} · ${shortHash(candidate.sourceHash)}`;
  skillFiles.textContent = `${candidate.fileCount} ${candidate.fileCount === 1 ? "file" : "files"} · ${candidate.executableFileCount} executable · tests ${humanize(candidate.testStatus)}`;
  skillRequested.textContent = `${candidate.requestedPermissions.capabilityIds.length} ${candidate.requestedPermissions.capabilityIds.length === 1 ? "capability" : "capabilities"} · ${candidate.requestedPermissions.actionClasses.map(humanize).join(", ") || "no actions"}`;
  skillTrusted.textContent = candidate.trustedPermissionScopes.length ? `${candidate.trustedPermissionScopes.length} revision scopes · invocation still gated` : "None while quarantined";
  skillGates.replaceChildren(...candidate.gates.map((gate) => {
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
  skillDecision.textContent = candidate.state === "active"
    ? "Creator trust is revision-specific. No Skill code executed, no run approval was inferred, and no direct invocation endpoint exists."
    : candidate.activationEligible
      ? "Every promotion gate passes. Promotion stores the exact revision trust ceiling; each future invocation must intersect package trust, capabilities, workspace policy, and run approval."
      : `${blockers} promotion gates remain pending or blocked. The retained package has no active trust or invocation authority.`;
  const canPromote = candidate.activationEligible && candidate.state === "quarantined";
  const canRollback = candidate.state === "active" && Boolean(candidate.rollbackRevision);
  resolveSkillButton.disabled = !canPromote && !canRollback;
  resolveSkillButton.dataset.action = canRollback ? "rollback" : "promote";
  resolveSkillButton.textContent = canRollback ? `Restore ${candidate.rollbackRevision}` : canPromote ? "Trust this version" : candidate.state === "active" ? "Version trusted" : "Trust blocked";
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
      renderReview(snapshot.runs ?? []);
      renderMemory(snapshot);
      renderSkills(snapshot);
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
  runButton.textContent = latestRun ? "Creating the new version…" : "Shaping locally…";
  try {
    const result = latestRun
      ? await window.clarkDesktop.reviseIdea({ parentRunId: latestRun.runId, ideaText: ideaInput.value, revisionReason: revisionReason.value })
      : await window.clarkDesktop.startIdeaLoop(ideaInput.value);
    selectedReviewRunId = result.run.runId;
    renderRun(result.run);
    if (latestRun?.revisionNumber > 1) revisionReason.value = "";
    announcer.textContent = latestRun?.revisionNumber > 1
      ? `Idea version ${latestRun.revisionNumber} created. Its clarity and proof questions are visible in Shape.`
      : "Working brief created locally and waiting for your review.";
  } catch (error) {
    announcer.textContent = `Idea loop interrupted: ${error.message}`;
  } finally {
    await refreshHarness();
  }
});

openReview.addEventListener("click", () => {
  if (latestRun) selectedReviewRunId = latestRun.runId;
  void activateSection("review", { focus: true });
});

improveBrief.addEventListener("click", () => {
  const target = revisionReasonGroup.hidden ? ideaInput : revisionReason;
  target.focus();
  target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  announcer.textContent = "Update the idea and explain what the next version will improve.";
});

reviewStartIdea.addEventListener("click", () => void activateSection("focus", { focus: true }));
openReviewDecision.addEventListener("click", () => openReviewDecisionDialog());
cancelReviewDecision.addEventListener("click", () => reviewDecisionDialog.close("cancel"));
reviewDecisionApprove.addEventListener("change", updateReviewDecisionDialog);
reviewDecisionReject.addEventListener("change", updateReviewDecisionDialog);
reviewDecisionDialog.addEventListener("close", () => {
  reviewDecisionError.hidden = true;
  reviewDecisionReason.setCustomValidity("");
});
reviewDecisionDialog.addEventListener("cancel", (event) => {
  if (!reviewDecisionPending) return;
  event.preventDefault();
  announcer.textContent = "The decision is still being recorded. Keep this window open until it finishes.";
});

function openReviewDecisionDialog() {
  const run = latestRuns.find((candidate) => candidate.runId === selectedReviewRunId);
  if (!run?.approval || run.state !== "waiting_approval" || run.approval.state !== "waiting") return;
  reviewDecisionApprove.checked = true;
  reviewDecisionReason.value = "";
  reviewDecisionError.hidden = true;
  reviewDialogVersion.textContent = `Version ${run.revisionNumber}`;
  reviewDialogHash.textContent = `Exact brief ${run.draft.contentHash}`;
  updateReviewDecisionDialog();
  reviewDecisionDialog.showModal();
  reviewDecisionApprove.focus();
}

function updateReviewDecisionDialog() {
  const run = latestRuns.find((candidate) => candidate.runId === selectedReviewRunId);
  const decision = reviewDecisionReject.checked ? "reject" : "approve";
  reviewDialogTitle.textContent = decision === "approve"
    ? `Approve version ${run?.revisionNumber ?? "—"}?`
    : `Send version ${run?.revisionNumber ?? "—"} back?`;
  submitReviewDecision.textContent = decision === "approve" ? "Approve exact version" : "Send back for revision";
  submitReviewDecision.className = decision === "approve" ? "primary-action" : "danger-action";
}

reviewDecisionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const run = latestRuns.find((candidate) => candidate.runId === selectedReviewRunId);
  const decision = reviewDecisionReject.checked ? "reject" : "approve";
  const reason = reviewDecisionReason.value.trim();
  if (!run?.approval || run.state !== "waiting_approval" || run.approval.state !== "waiting") {
    reviewDecisionError.textContent = "This version is no longer waiting. Close this dialog and review the latest state.";
    reviewDecisionError.hidden = false;
    return;
  }
  if (reason.length < 3) {
    reviewDecisionReason.setCustomValidity("Enter at least three characters so the decision has a useful reason.");
    reviewDecisionError.textContent = "Add a short reason before recording this decision.";
    reviewDecisionError.hidden = false;
    reviewDecisionReason.reportValidity();
    reviewDecisionReason.focus();
    return;
  }

  reviewDecisionReason.setCustomValidity("");
  reviewDecisionError.hidden = true;
  reviewDecisionPending = true;
  submitReviewDecision.disabled = true;
  cancelReviewDecision.disabled = true;
  reviewDecisionApprove.disabled = true;
  reviewDecisionReject.disabled = true;
  submitReviewDecision.textContent = decision === "approve" ? "Recording approval…" : "Recording decision…";
  try {
    const resolved = await window.clarkDesktop.resolveIdeaApproval({
      runId: run.runId,
      approvalId: run.approval.approvalId,
      decision,
      reason
    });
    selectedReviewRunId = resolved.runId;
    reviewDecisionDialog.close(decision);
    await refreshHarness();
    announcer.textContent = decision === "approve"
      ? `Version ${resolved.revisionNumber} approved. The decision is pinned to ${shortHash(resolved.draft.contentHash)} and nothing was published.`
      : `Version ${resolved.revisionNumber} sent back with your reason. Its history remains intact.`;
  } catch (error) {
    reviewDecisionError.textContent = `The decision was not recorded: ${error.message}. Review the version state and try again.`;
    reviewDecisionError.hidden = false;
  } finally {
    reviewDecisionPending = false;
    submitReviewDecision.disabled = false;
    cancelReviewDecision.disabled = false;
    reviewDecisionApprove.disabled = false;
    reviewDecisionReject.disabled = false;
    updateReviewDecisionDialog();
  }
});

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
    announcer.textContent = "Knowledge proposed with its source. It will not be used until you approve it.";
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
      ? "Knowledge removed from future use and redacted from the active record."
      : `Knowledge decision recorded. Status: ${result.memory.state}.`;
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
    announcer.textContent = "Correction saved. The old claim is marked incorrect and the replacement is waiting for review.";
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
    summary.textContent = `${result.memories.length} approved ${result.memories.length === 1 ? "claim" : "claims"} · ${memoryDestinationLabels[result.destination] ?? humanize(result.destination)} · audit ${shortHash(result.queryHash)}`;
    const list = document.createElement("ul");
    list.append(...result.memories.map((memory) => listItem(memory.statement)));
    memoryRetrievalResult.replaceChildren(summary, list);
    announcer.textContent = `${result.memories.length} approved knowledge claims found. The search words were not written to the audit record.`;
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
    if (snapshot) renderToolPackages(snapshot);
    const candidate = snapshot?.toolPackages?.[0];
    announcer.textContent = candidate?.activationEligible
      ? "Tool Package gates pass, but activation still requires a separate creator decision."
      : "Tool Package gates rechecked. OpenCut remains upstream-blocked with zero installed authority.";
  } finally {
    recheckToolPack.disabled = false;
  }
});

recheckSkill.addEventListener("click", async () => {
  recheckSkill.disabled = true;
  try {
    if (!selectedSkill) return;
    const candidate = await window.clarkDesktop.evaluateSkill({ skillId: selectedSkill.skillId, revision: selectedSkill.revision });
    renderSkills({ skills: [candidate] });
    await refreshHarness();
    announcer.textContent = candidate.activationEligible
      ? "Skill trust gates pass. Promotion still requires a separate creator decision and grants no invocation authority."
      : "Skill trust gates rechecked. The revision remains quarantined without active trust.";
  } catch (error) {
    announcer.textContent = `Skill recheck failed: ${error.message}`;
  } finally {
    recheckSkill.disabled = false;
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

resolveSkillButton.addEventListener("click", async () => {
  if (!selectedSkill || resolveSkillButton.disabled) return;
  const action = resolveSkillButton.dataset.action;
  resolveSkillButton.disabled = true;
  try {
    const result = await window.clarkDesktop.resolveSkill({
      skillId: selectedSkill.skillId,
      revision: selectedSkill.revision,
      action,
      reason: action === "rollback" ? "Creator restored the exact suspended Skill revision." : "Creator reviewed the exact files, conformance gates, and revision trust ceiling."
    });
    announcer.textContent = action === "rollback"
      ? `Skill trust rolled back to ${result.revision}; no invocation was started.`
      : `Skill ${result.revision} promoted. Invocation still requires run-scoped permission intersection.`;
    await refreshHarness();
  } catch (error) {
    announcer.textContent = `Skill trust decision failed: ${error.message}`;
  } finally {
    if (selectedSkill) renderSkills({ skills: [selectedSkill] });
  }
});

let writingDrafts = [];
let selectedWritingDraftId;
let writingConnection = { connected: false };
let writingSaveTimer;
let writingSavePromise;

function wordCount(value) {
  const words = value.trim().match(/\S+/g);
  return words?.length ?? 0;
}

function selectedWritingDraft() {
  return writingDrafts.find((draft) => draft.id === selectedWritingDraftId);
}

function renderWriting(state, { preserveEditor = false } = {}) {
  writingDrafts = state.drafts ?? [];
  writingConnection = state.obsidian ?? { connected: false };
  if (!writingDrafts.some((draft) => draft.id === selectedWritingDraftId)) selectedWritingDraftId = writingDrafts[0]?.id;
  const draft = selectedWritingDraft();
  obsidianStatus.textContent = writingConnection.connected ? `Obsidian · ${writingConnection.vaultName}` : "Obsidian not connected";
  connectObsidianButton.textContent = writingConnection.connected ? "Change Obsidian vault" : "Connect Obsidian vault";
  exportObsidianButton.disabled = !draft || !writingConnection.connected;
  writingEmpty.hidden = Boolean(draft);
  writingEditor.hidden = !draft;
  writingDraftList.replaceChildren();
  if (!writingDrafts.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Create a draft to begin.";
    writingDraftList.append(empty);
  } else {
    writingDraftList.append(...writingDrafts.map((candidate) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "writing-draft-item";
      button.dataset.draftId = candidate.id;
      button.setAttribute("role", "listitem");
      button.setAttribute("aria-current", String(candidate.id === selectedWritingDraftId));
      const title = document.createElement("strong");
      title.textContent = candidate.title || "Untitled draft";
      const detail = document.createElement("span");
      detail.textContent = candidate.obsidianExport ? "Exported to Obsidian" : "Local draft";
      button.append(title, detail);
      return button;
    }));
  }
  if (!draft || preserveEditor) return;
  writingTitle.value = draft.title;
  writingBody.value = draft.body;
  writingWordCount.textContent = `${wordCount(draft.body)} ${wordCount(draft.body) === 1 ? "word" : "words"}`;
  writingSavingState.textContent = "Saved locally";
  writingExportNote.textContent = writingConnection.connected
    ? draft.obsidianExport
      ? `Last exported ${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(draft.obsidianExport.exportedAt))}. Export again to update the Clark-owned Markdown copy.`
      : `Ready to export a Clark-owned Markdown copy to ${writingConnection.vaultName}.`
    : "Connect an Obsidian vault when you want a Markdown copy there.";
}

async function refreshWriting() {
  try {
    renderWriting(await window.clarkDesktop.getWritingState());
  } catch (error) {
    announcer.textContent = `Writing workspace unavailable: ${error.message}`;
  }
}

async function createWritingDraft() {
  newWritingDraftButton.disabled = true;
  writingEmptyCreate.disabled = true;
  try {
    if (selectedWritingDraft()) await saveWritingDraft();
    const draft = await window.clarkDesktop.createWritingDraft();
    writingDrafts = [draft, ...writingDrafts];
    selectedWritingDraftId = draft.id;
    renderWriting({ drafts: writingDrafts, obsidian: writingConnection });
    writingTitle.focus();
    announcer.textContent = "New local draft created.";
  } catch (error) {
    announcer.textContent = `Could not create draft: ${error.message}`;
  } finally {
    newWritingDraftButton.disabled = false;
    writingEmptyCreate.disabled = false;
  }
}

async function saveWritingDraft() {
  clearTimeout(writingSaveTimer);
  const draft = selectedWritingDraft();
  if (!draft) return undefined;
  writingSavingState.textContent = "Saving locally…";
  const request = window.clarkDesktop.saveWritingDraft({
    draftId: draft.id,
    title: writingTitle.value,
    body: writingBody.value
  });
  writingSavePromise = request;
  try {
    const saved = await request;
    writingDrafts = writingDrafts.map((candidate) => candidate.id === saved.id ? saved : candidate);
    if (writingSavePromise === request) writingSavingState.textContent = "Saved locally";
    return saved;
  } catch (error) {
    if (writingSavePromise === request) writingSavingState.textContent = "Not saved";
    announcer.textContent = `Draft was not saved: ${error.message}`;
    throw error;
  } finally {
    if (writingSavePromise === request) writingSavePromise = undefined;
  }
}

function scheduleWritingSave() {
  const count = wordCount(writingBody.value);
  writingWordCount.textContent = `${count} ${count === 1 ? "word" : "words"}`;
  writingSavingState.textContent = "Unsaved changes";
  clearTimeout(writingSaveTimer);
  writingSaveTimer = setTimeout(() => void saveWritingDraft(), 550);
}

writingTitle.addEventListener("input", scheduleWritingSave);
writingBody.addEventListener("input", scheduleWritingSave);
writingDraftList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-draft-id]");
  if (!button || button.dataset.draftId === selectedWritingDraftId) return;
  try {
    await saveWritingDraft();
    selectedWritingDraftId = button.dataset.draftId;
    renderWriting({ drafts: writingDrafts, obsidian: writingConnection });
    writingTitle.focus();
  } catch {
    // The visible save error already explains why selection did not change.
  }
});
newWritingDraftButton.addEventListener("click", () => void createWritingDraft());
writingEmptyCreate.addEventListener("click", () => void createWritingDraft());
connectObsidianButton.addEventListener("click", async () => {
  connectObsidianButton.disabled = true;
  try {
    const result = await window.clarkDesktop.connectObsidian();
    if (!result.cancelled) {
      await refreshWriting();
      announcer.textContent = `Obsidian vault ${result.vaultName} connected. Clark can only write its own Markdown copies there.`;
    }
  } catch (error) {
    announcer.textContent = `Obsidian was not connected: ${error.message}`;
  } finally {
    connectObsidianButton.disabled = false;
  }
});
exportObsidianButton.addEventListener("click", async () => {
  const draft = selectedWritingDraft();
  if (!draft) return;
  exportObsidianButton.disabled = true;
  try {
    await saveWritingDraft();
    const exported = await window.clarkDesktop.exportWritingDraft(draft.id);
    writingDrafts = writingDrafts.map((candidate) => candidate.id === exported.draft.id ? exported.draft : candidate);
    writingConnection = exported.obsidian;
    renderWriting({ drafts: writingDrafts, obsidian: writingConnection });
    announcer.textContent = "Markdown copy exported to your connected Obsidian vault.";
  } catch (error) {
    announcer.textContent = `Obsidian export did not run: ${error.message}`;
  } finally {
    exportObsidianButton.disabled = !selectedWritingDraft() || !writingConnection.connected;
  }
});

window.clarkDesktop.onHarnessEvent(() => void refreshHarness());

const initialState = await window.clarkDesktop.getShellState();
await activateSection(initialState.activeSection, { persist: false });
await refreshWriting();
await refreshHarness();
