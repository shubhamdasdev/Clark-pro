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

const initialState = await window.clarkDesktop.getShellState();
await activateSection(initialState.activeSection, { persist: false });
