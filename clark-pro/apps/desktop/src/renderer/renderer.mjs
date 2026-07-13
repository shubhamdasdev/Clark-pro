const sections = ["focus", "canvas", "connections"];
const tabs = new Map(sections.map((section) => [section, document.querySelector(`[data-section="${section}"]`)]));
const views = new Map(sections.map((section) => [section, document.querySelector(`[data-view="${section}"]`)]));
const announcer = document.querySelector("#announcer");

async function activateSection(section, { focus = false, persist = true } = {}) {
  if (!sections.includes(section)) return;
  for (const name of sections) {
    const selected = name === section;
    tabs.get(name).setAttribute("aria-selected", String(selected));
    tabs.get(name).tabIndex = selected ? 0 : -1;
    views.get(name).hidden = !selected;
  }
  if (focus) tabs.get(section).focus();
  announcer.textContent = `${tabs.get(section).textContent.trim()} view opened`;
  document.title = `${section[0].toUpperCase()}${section.slice(1)} — Clark Studio`;
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

const nodeDetails = {
  idea: ["Creator thesis", "Read only", "Capture → Idea", "Local source"],
  narrative: ["Launch narrative", "Propose artifact", "Idea → Skill run", "Review required"],
  video: ["Video assembly", "No authority", "Narrative → Tool Pack", "Quarantined"]
};
const nodeButtons = [...document.querySelectorAll(".node-card")];
const inspector = document.querySelector(".inspector");

function inspectNode(button) {
  nodeButtons.forEach((candidate) => candidate.classList.toggle("selected", candidate === button));
  const [title, authority, lineage, trust] = nodeDetails[button.dataset.node];
  inspector.querySelector("h2").textContent = title;
  const values = inspector.querySelectorAll("dd");
  [authority, lineage, trust].forEach((value, index) => { values[index].textContent = value; });
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
const runButton = document.querySelector("#run-idea-loop");
const runResult = document.querySelector("#harness-run");
const runEmpty = document.querySelector("#run-empty");
const runState = document.querySelector("#run-state");
const draftText = document.querySelector("#draft-text");
const runIntegrity = document.querySelector("#run-integrity");
const approvalActions = document.querySelector("#approval-actions");
const approveBrief = document.querySelector("#approve-brief");
const rejectBrief = document.querySelector("#reject-brief");
let latestRun;
let refreshPromise;

const runStateLabels = {
  planned: "Planned", running: "Running", recovering: "Recovering", waiting_approval: "Waiting approval",
  completed: "Completed", failed: "Revision required", cancelled: "Cancelled"
};

function setHarnessAvailability(snapshot) {
  const ready = snapshot.available && snapshot.state === "ready";
  harnessState.textContent = ready ? `Ready · ${snapshot.database.eventCount} events` : runStateLabels[snapshot.state] ?? "Unavailable";
  harnessRail.textContent = ready ? "Harness live · SQLite WAL" : `Harness ${snapshot.state ?? "unavailable"}`;
  harnessConnectionState.textContent = ready ? "Live" : snapshot.state ?? "Unavailable";
  harnessConnectionState.className = `state ${ready ? "complete" : "waiting"}`;
  harnessConnectionDetail.textContent = ready ? `Supervised utility process · SQLite WAL · ${snapshot.database.eventCount} events` : "Supervised utility process unavailable";
  const inspector = snapshot.capabilities?.find((capability) => capability.id === "clark.idea.inspect.mcp");
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
    return;
  }
  runEmpty.hidden = true;
  runResult.hidden = false;
  runState.textContent = runStateLabels[run.state] ?? run.state;
  const stateClass = run.state === "completed" ? "complete" : run.state === "failed" ? "failed" : run.state === "waiting_approval" ? "waiting" : "running";
  runState.className = `state ${stateClass}`;
  draftText.textContent = run.draft?.text ?? "The durable run is preparing the local brief…";
  approvalActions.hidden = run.state !== "waiting_approval" || !run.approval;
  runIntegrity.textContent = run.draft ? `${run.eventCount} correlated events · ${run.draft.contentHash}${run.recoveredFromCheckpoint ? " · restored from checkpoint" : ""}` : `${run.eventCount} correlated events`;
}

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
  runButton.textContent = "Structuring…";
  try {
    const result = await window.clarkDesktop.startIdeaLoop(ideaInput.value);
    renderRun(result.run);
    announcer.textContent = "Idea brief created locally and waiting for exact-version approval.";
  } catch (error) {
    announcer.textContent = `Idea loop interrupted: ${error.message}`;
  } finally {
    runButton.textContent = "Structure idea";
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
