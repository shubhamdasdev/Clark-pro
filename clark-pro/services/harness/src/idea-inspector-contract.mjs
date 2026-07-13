export const IDEA_INSPECTOR_SERVER_ID = "mcp.clark.idea-inspector";
export const IDEA_ANALYSIS_TOOL = "analyze_idea";
export const RUNTIME_PROFILE_TOOL = "runtime_profile";

export const ideaAnalysisInputSchema = Object.freeze({
  type: "object",
  properties: {
    schemaVersion: { const: 1 },
    ideaText: { type: "string", minLength: 20, maxLength: 12_000 }
  },
  required: ["schemaVersion", "ideaText"],
  additionalProperties: false
});

export const runtimeProfileInputSchema = Object.freeze({
  type: "object",
  properties: {},
  additionalProperties: false
});

const signalPatterns = Object.freeze({
  outcome: /\b(help|enable|improve|reduce|save|replace|deliver|make|create|build|grow)\b/i,
  user: /\b(creators?|users?|customers?|founders?|teams?|marketers?|designers?|editors?|businesses|person|people)\b/i,
  mechanism: /\b(app|system|tool|workflow|platform|harness|loop|mcp|server|client|connect|automation)\b/i,
  trust: /\b(control|approval|permission|private|privacy|local|trust|credential|authority|secure|safety)\b/i,
  evidence: /\b(test|measure|metric|evidence|validate|proof|conversion|retention|benchmark|time saved|willingness)\b/i
});

export function analyzeIdeaText(ideaText) {
  const normalized = String(ideaText).replace(/\s+/g, " ").trim();
  if (normalized.length < 20 || normalized.length > 12_000) throw new TypeError("ideaText must be between 20 and 12,000 characters");
  const signals = Object.fromEntries(Object.entries(signalPatterns).map(([name, pattern]) => [name, pattern.test(normalized)]));
  const missingSignals = Object.entries(signals).filter(([, present]) => !present).map(([name]) => name);
  const disposition = missingSignals.length === 0 ? "structured" : "needs_clarification";
  const summary = missingSignals.length === 0
    ? "The idea explicitly names an outcome, user, mechanism, trust boundary, and evidence signal."
    : `The idea still needs explicit ${formatSignalList(missingSignals)} before it can be treated as structurally complete.`;
  return {
    schemaVersion: 1,
    kind: "idea_analysis",
    wordCount: normalized.split(" ").length,
    signals,
    missingSignals,
    disposition,
    summary
  };
}

function formatSignalList(signals) {
  if (signals.length === 1) return signals[0];
  return `${signals.slice(0, -1).join(", ")}, and ${signals.at(-1)}`;
}
