# Clark Studio Prototype Verification

**Date:** July 12, 2026

## Automated interaction checks

Executed in a controlled Chromium browser against the standalone `index.html`:

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
| Canvas renders all 50 objects inside a bounded pannable surface | Pass |
| Click-drag pans the Canvas without mutating canonical object position | Pass |
| Zoom out changes 100% → 90%; Undo restores 100%; Redo becomes available | Pass |
| Arrow Right moves focus from Intent to the corresponding Evidence object | Pass |
| Enter inspects the keyboard-focused object and switches to selected lineage | Pass |
| `⌘K` opens the command palette and focuses the first command | Pass |
| `⌘Z` reverses a staged angle decision and restores the waiting state | Pass |
| Reel A/B share a working playhead; Play/Pause updates both comparison surfaces | Pass |
| Reel comparison exposes evidence, cost, source angle, policy, derivative impact, and notes | Pass |
| Tabs expose native tablist/tab/tabpanel semantics and arrow-key navigation | Pass |

Combined recorded result:

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
  "canvasObjects": 50,
  "canvasPanScrollLeft": 238,
  "zoomUndo": "90% -> 100%",
  "keyboardNode": "1-0",
  "keyboardInspector": "Hermes harness",
  "commandPalette": true,
  "shortcutUndo": true,
  "synchronizedPlayhead": "0:02 / 0:18",
  "activeView": "cs-view-connections"
}
```

## Responsive check

The prototype was checked at both the previous 390 CSS-pixel target and the supported 320 CSS-pixel minimum.

```json
{
  "320": {
    "innerWidth": 320,
    "bodyScrollWidth": 320,
    "prototypeScrollWidth": 292,
    "canvasViewportWidth": 292,
    "canvasInternalWidth": 1050,
    "reviewTableWidth": 292
  },
  "390": {
    "innerWidth": 390,
    "bodyScrollWidth": 390,
    "prototypeScrollWidth": 362,
    "canvasViewportWidth": 362,
    "canvasInternalWidth": 1050,
    "reviewTableWidth": 362
  }
}
```

The prototype does not introduce page-level horizontal overflow at either checked width. The expert Canvas deliberately keeps six semantic lanes inside its own bounded pannable viewport instead of collapsing the graph into an unreadable single column.

## Visual checks

- Focus: hierarchy, decision choices, loop checkpoint, actions, context packet, reviewed run contract, and remote-data boundary are visible before execution.
- Canvas: all 50 objects render across six semantic lanes; pan, zoom, fit, critical-path, selected-lineage, evidence, learning, policy, all-structure, impact dimming, collapse, type icons, keyboard movement, and a complete object provenance contract are available.
- Review: two media versions share a playhead and expose evidence/cost/policy/derivative comparison plus annotations; approval remains separate from publication authority.
- Memory: active, proposed, and disputed items are distinguishable; evidence inspection separates confidence and contradiction from explicit Promote/Reject actions.
- Connections: MCP host/server roles, social account states, skill trust/quarantine, Clark Bridge clients, harness health, and effective autonomy are visible.

Updated Focus, selected-publication Canvas, synchronized Review, inspected-memory, and Connections surfaces were visually reviewed at desktop and narrow widths after the interaction pass. The controlled browser reported no runtime warnings or errors.

## Remaining human gate

Automated and visual checks prove that the prototype functions as designed. They do not prove creator comprehension or product value. Five representative creator walkthroughs using `prototype-evaluation.md` remain required before the Ground canvas gate can pass.
