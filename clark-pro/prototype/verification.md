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
| Expanding the skill receipt distinguishes requested, effective, and denied permissions | Pass |
| Skill receipt exposes Class A/B/C boundaries and the 19-case Wasmtime Ground result | Pass |
| OpenCut Tool Pack remains visibly upstream-blocked with zero installed authority | Pass |
| Expanding the Tool Pack receipt exposes the reuse ladder, canonical boundary, incomplete legal/supply-chain evidence, and 11 rejected activation attacks | Pass |
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
| Scoped Hermes `clark.capture` changes the same model Canvas renders from 50 to 51 objects | Pass |
| Accepted Bridge exchange emits exactly one `source.captured` event and exposes one state hash | Pass |
| Replaying the same intent remains at 51 objects and emits zero new events | Pass |
| Reload restores the 51-object receipt-backed state and deduplicated status | Pass |
| Opening the Bridge object selects `Bridge capture` in Canvas with source and permission lineage | Pass |
| Bridge proof remains page-width safe at 320px and produces no runtime warnings/errors | Pass |

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
  "bridgeAccepted": true,
  "bridgeObjectCounts": "50 -> 51 -> 51",
  "bridgeInitialEvents": 1,
  "bridgeReplayEvents": 0,
  "bridgeStateHashesEqual": true,
  "bridgeReloadRestored": true,
  "bridgeCanvasInspector": "Bridge capture",
  "skillReceiptOpen": true,
  "skillClassesVisible": 3,
  "skillHostileCases": "19 / 19 pass",
  "toolPackReceiptOpen": true,
  "toolPackLifecycle": "blocked_upstream",
  "toolPackStableInterfaces": "0 / 3",
  "toolPackInstalledAuthority": 0,
  "toolPackActivationAttacks": "11 / 11 reject",
  "activeView": "cs-view-connections"
}
```

## Responsive check

The prototype was checked at both the previous 390 CSS-pixel target and the supported 320 CSS-pixel minimum.

```json
{
  "320": {
    "innerWidth": 320,
    "documentClientWidth": 305,
    "bodyScrollWidth": 320,
    "prototypeScrollWidth": 292,
    "canvasViewportWidth": 292,
    "canvasInternalWidth": 1050,
    "reviewTableWidth": 292,
    "bridgeProofWidth": 292,
    "toolPackProofWidth": 277,
    "connectionsRootScrollWidth": 305,
    "connectionsHorizontalOverflow": false
  },
  "390": {
    "innerWidth": 390,
    "documentClientWidth": 375,
    "bodyScrollWidth": 390,
    "prototypeScrollWidth": 362,
    "canvasViewportWidth": 362,
    "canvasInternalWidth": 1050,
    "reviewTableWidth": 362,
    "toolPackProofWidth": 347,
    "connectionsRootScrollWidth": 375,
    "connectionsHorizontalOverflow": false
  }
}
```

The prototype does not introduce page-level horizontal overflow at either checked width. The expert Canvas deliberately keeps six semantic lanes inside its own bounded pannable viewport instead of collapsing the graph into an unreadable single column.

## Visual checks

- Focus: hierarchy, decision choices, loop checkpoint, actions, context packet, reviewed run contract, and remote-data boundary are visible before execution.
- Canvas: all 50 objects render across six semantic lanes; pan, zoom, fit, critical-path, selected-lineage, evidence, learning, policy, all-structure, impact dimming, collapse, type icons, keyboard movement, and a complete object provenance contract are available.
- Review: two media versions share a playhead and expose evidence/cost/policy/derivative comparison plus annotations; approval remains separate from publication authority.
- Memory: active, proposed, and disputed items are distinguishable; evidence inspection separates confidence and contradiction from explicit Promote/Reject actions.
- Connections: MCP host/server roles, social account states, Tool Pack readiness/authority, skill trust/quarantine, Clark Bridge clients, harness health, and effective autonomy are visible.
- Tool Pack proof: pinned OpenCut source, blocked upstream interfaces, incomplete legal/supply-chain evidence, zero installed components, reuse order, canonical ownership, and hostile activation results are visible without implying working compatibility.
- Skill proof: Class A/B/C trust is visibly distinct; the effective permission intersection, denied authority, hostile-case result, and Ground-to-production limitations are inspectable in a native disclosure control.
- Bridge proof: client scope, command intent, permission intersection, event receipt, idempotent replay, state hash, Studio projection, and Bridge resource identity are visible in one interaction.

Updated Focus, selected-publication Canvas, synchronized Review, inspected-memory, and Connections surfaces were visually reviewed at desktop and narrow widths after the interaction pass. The controlled browser reported no runtime warnings or errors.

## Remaining human gate

Automated and visual checks prove that the prototype functions as designed. They do not prove creator comprehension or product value. Five representative creator walkthroughs using `prototype-evaluation.md` remain required before the Ground canvas gate can pass.
