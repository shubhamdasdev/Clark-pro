# Clark Studio Prototype Verification

**Date:** July 12, 2026

## Automated interaction checks

Executed in headless Chrome against the standalone `index.html`:

| Check | Result |
|---|---|
| Selecting an angle enables Continue | Pass |
| Switching to Canvas preserves the same project state | Pass |
| Selecting `Choose angle` updates the inspector | Pass |
| Selecting Reel A enables version approval | Pass |
| Promoting a memory proposal decrements the proposal count | Pass |
| Selecting a canvas object switches to bounded selected-lineage relationships | Pass |
| Connections actions preserve permission/trust review messaging | Pass |
| Final active view after full navigation is Connections | Pass |
| Selecting a publication exposes source, version, cost, approval, publish, outcome, and permission fields | Pass |
| Source-to-outcome trace action preserves bounded selected lineage | Pass |
| Inspecting a memory exposes evidence, confidence, contradiction, scope, and retrieval state | Pass |
| Promoting a memory preserves its evidence inspection while reducing the proposal count | Pass |
| Focus exposes automatic, always-ask, never-automatic, and remote-data boundaries | Pass |
| Connections exposes effective autonomy and the permission intersection | Pass |

Latest automated result:

```json
{
  "focusRunContract": true,
  "provenanceContract": true,
  "linkedInSpecific": true,
  "traceAction": true,
  "memoryEvidence": true,
  "memoryPromotion": true,
  "approvalSeparated": true,
  "effectiveAutonomy": true,
  "activeView": "cs-view-connections"
}
```

## Responsive check

Chrome DevTools device metrics were set to 390 CSS pixels.

```json
{
  "innerWidth": 390,
  "documentScrollWidth": 390,
  "bodyScrollWidth": 390,
  "prototypeScrollWidth": 362
}
```

The prototype does not introduce horizontal overflow at the checked narrow width.

## Visual checks

- Focus: hierarchy, decision choices, loop checkpoint, actions, context packet, reviewed run contract, and remote-data boundary are visible before execution.
- Canvas: all 50 objects render across six semantic lanes; readable critical-path, selected-lineage, evidence, learning, policy, all-structure, impact dimming, collapse, type icons, and a complete object provenance contract are available.
- Review: two media versions compare side by side; approval remains separate from publication authority.
- Memory: active, proposed, and disputed items are distinguishable; evidence inspection separates confidence and contradiction from explicit Promote/Reject actions.
- Connections: MCP host/server roles, social account states, skill trust/quarantine, Clark Bridge clients, harness health, and effective autonomy are visible.

Updated Focus, selected-publication Canvas, inspected-memory, and Connections screenshots were rendered from the standalone artifact and visually reviewed after the interaction pass.

## Remaining human gate

Automated and visual checks prove that the prototype functions as designed. They do not prove creator comprehension or product value. Five representative creator walkthroughs using `prototype-evaluation.md` remain required before the Ground canvas gate can pass.
