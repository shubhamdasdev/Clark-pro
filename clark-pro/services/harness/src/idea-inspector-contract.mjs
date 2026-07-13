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

const facetDefinitions = Object.freeze({
  outcome: {
    pattern: /\b(help|enable|improve|reduce|sav(?:e|es|ed|ing)|replace|deliver|increase|grow|faster|simplif(?:y|ies)|automate)\b/i,
    prompt: "Name the observable change the user should experience."
  },
  targetUser: {
    pattern: /\b(creators?|users?|customers?|founders?|teams?|marketers?|designers?|editors?|businesses|agencies|freelancers?|solo|professionals?)\b/i,
    prompt: "Name a narrow first user and the moment this matters to them."
  },
  painfulProblem: {
    pattern: /\b(problem|pain|struggl|friction|slow|costly|expensive|fragment|manual|repetitive|overwhelm|waste|difficult|hard to|cannot|can't)\b/i,
    prompt: "State the painful recurring problem, its frequency, and its consequence."
  },
  currentWorkaround: {
    pattern: /\b(currently|today|instead|workaround|spreadsheet|manual|copy|paste|switch(?:ing)?|multiple tools|existing tools?|hire|outsourc|do it themselves|status quo|replace)\b/i,
    prompt: "Name what the user does today and why that workaround is insufficient."
  },
  mechanism: {
    pattern: /\b(app|system|tool|workflow|platform|harness|loop|mcp|server|client|connect|automation|plugin|integrat|orchestrat)\b/i,
    prompt: "Explain the smallest mechanism that causes the promised outcome."
  },
  wedge: {
    pattern: /\b(unlike|different|unique|wedge|advantage|open source|local.first|plugin.first|interoperab|portable|replaceable|without lock.in|faster than|better than)\b/i,
    prompt: "Explain why this wins against the current workaround or closest alternative."
  },
  trustBoundary: {
    pattern: /\b(control|approval|permission|private|privacy|local|trust|credential|authority|secure|safety|review|consent|revoke)\b/i,
    prompt: "State what may happen automatically and what always requires creator authority."
  },
  distribution: {
    pattern: /\b(distribut|acqui|channel|community|audience|marketplace|plugin ecosystem|open.source adoption|social|referral|partner|creator network|launch)\b/i,
    prompt: "Name the first repeatable path by which the target user discovers and adopts it."
  },
  businessModel: {
    pattern: /\b(pay|paid|price|pricing|subscription|revenue|business model|moneti[sz]|license|commission|seat|usage.based|willingness)\b/i,
    prompt: "State who pays, for what unit of value, and why payment is preferable to the workaround."
  },
  evidencePlan: {
    pattern: /\b(test|measure|metric|evidence|validate|proof|interview|prototype|pilot|conversion|retention|benchmark|time saved|willingness|experiment)\b/i,
    prompt: "Define the next falsifiable test, metric, threshold, and decision it will drive."
  }
});

const evidenceGaps = Object.freeze([
  "problem_interviews",
  "workaround_baseline",
  "behavioral_demand",
  "willingness_to_pay",
  "retention_or_repeat_use"
]);

export function analyzeIdeaText(ideaText) {
  const normalized = String(ideaText).replace(/\s+/g, " ").trim();
  if (normalized.length < 20 || normalized.length > 12_000) throw new TypeError("ideaText must be between 20 and 12,000 characters");
  const facets = Object.fromEntries(Object.entries(facetDefinitions).map(([name, definition]) => [name, {
    state: definition.pattern.test(normalized) ? "explicit" : "missing",
    prompt: definition.prompt
  }]));
  const missingFacets = Object.entries(facets).filter(([, facet]) => facet.state === "missing").map(([name]) => name);
  const explicitCount = Object.keys(facets).length - missingFacets.length;
  const structuralState = missingFacets.length === 0 ? "ready_for_evidence" : "needs_clarification";
  const readiness = missingFacets.length === 0 ? "evidence_required" : "needs_clarification";
  const summary = missingFacets.length === 0
    ? "All ten thesis facets are explicit. This is structurally ready for evidence collection, but no problem, demand, payment, or retention evidence has been observed."
    : `${explicitCount} of 10 thesis facets are explicit. Clarify ${formatSignalList(missingFacets)} before spending time on evidence collection; no market evidence has been observed.`;
  return {
    schemaVersion: 1,
    kind: "idea_thesis_assessment",
    wordCount: normalized.split(" ").length,
    facets,
    missingFacets,
    structuralCompleteness: { explicitCount, totalCount: 10, state: structuralState },
    readiness,
    evidenceState: "not_observed",
    evidenceGaps: [...evidenceGaps],
    summary,
    limitations: [
      "Deterministic phrase detection can reveal omitted thesis facets but cannot establish truth, originality, product quality, or market size.",
      "No interviews, behavior, payment, retention, competitive research, or external sources were observed by this local inspection."
    ]
  };
}

function formatSignalList(signals) {
  if (signals.length === 1) return signals[0];
  return `${signals.slice(0, -1).join(", ")}, and ${signals.at(-1)}`;
}
