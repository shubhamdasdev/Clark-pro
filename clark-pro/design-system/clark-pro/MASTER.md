# Clark Pro Product System

This file is the source of truth for Clark Pro's desktop product language and visual system.

## Product promise

Clark helps independent creators turn rough ideas into clear, reviewable work while keeping memory, tools, and final decisions under their control.

### Information architecture

| Product area | Creator question | Current capability |
| --- | --- | --- |
| Today | What should I work on now? | Capture an idea, create a structured brief, review the exact version |
| Shape | Is the idea clear and what proof is missing? | Inspect the idea-to-brief flow and its evidence gaps |
| Review | What changed, and exactly what am I approving? | Compare immutable brief versions and record an exact-version approve/reject decision with a reason |
| Knowledge | What does Clark remember about my work? | Propose, review, retrieve, correct, dispute, and forget claims |
| Integrations | What tools can act, and with which permissions? | Inspect local services, OpenCut package gates, and Skill trust |

Internal architecture names such as Harness, MCP, WAL, hashes, projections, and execution classes belong in secondary or advanced detail. They are never the primary navigation or headline.

## Voice

Clark is calm, direct, exact, and creator-respecting.

- Say what the creator can do before explaining how the system does it.
- Prefer everyday verbs: start, shape, review, remember, connect, allow.
- State limits plainly. Never imply that a planned capability already works.
- Use technical language only where it helps a person verify trust or diagnose a problem.
- Avoid hype, cute metaphors, exclamation marks, and vague AI language.

Examples:

- Use “Start with a rough idea,” not “Initialize creator intent.”
- Use “Waiting for your review,” not “Human gate pending.”
- Use “Saved locally,” not “Harness live · SQLite WAL.”
- Use “This tool is not active,” then expose the exact gate details on demand.

## Visual philosophy: Quiet Workshop

Clark should feel like a serious editorial workspace, not a technical dashboard. A dark, stable navigation column frames a warm paper-like work surface. The contrast establishes orientation immediately: navigation is infrastructure; the creator's work is the visual center.

The composition follows a restrained Swiss grid with generous negative space. Large headlines are used only for the creator's current job. Cards are flat, bordered work surfaces rather than floating glass. Status is communicated with text and shape as well as color.

Color is intentionally limited. Ink and warm neutral surfaces carry most of the interface. A restrained rust accent marks the current place or primary action. Green, amber, and red are reserved for semantic states and never carry meaning alone.

Typography uses the native system sans for controls and information, with the system editorial serif used sparingly for major workspace headlines. No network fonts are required; the product remains fast and fully local.

Motion is subtle and causal: short color, opacity, and shadow transitions only. Nothing bounces, floats, or shifts layout. Reduced-motion preference disables nonessential transitions.

## Tokens

The implementation uses three layers: primitive values, semantic roles, then component aliases. Components must not use raw color literals.

### Primitive palette

| Token | Value | Purpose |
| --- | --- | --- |
| `--ink-950` | `#151513` | navigation and strongest text |
| `--ink-800` | `#292824` | primary control hover |
| `--stone-50` | `#fbfaf7` | elevated work surface |
| `--stone-100` | `#f3f0e8` | application canvas |
| `--stone-200` | `#e6e0d5` | borders and separators |
| `--stone-500` | `#777268` | secondary text |
| `--rust-600` | `#a4482b` | restrained brand/action accent |
| `--sage-700` | `#37664f` | success |
| `--ochre-700` | `#8a5a16` | waiting/warning |
| `--red-700` | `#a83b38` | destructive/error |

### Semantic roles

- Background: warm stone canvas.
- Surface: near-white paper.
- Primary text: ink.
- Secondary text: stone gray with WCAG AA contrast.
- Primary action: ink background with white text.
- Focus ring: rust, 3px visual ring.
- Borders: warm stone; selected borders use ink or rust.

### Type and spacing

- UI family: `-apple-system`, BlinkMacSystemFont, `SF Pro Text`, `Segoe UI`, sans-serif.
- Display family: `Iowan Old Style`, `Palatino Linotype`, Georgia, serif.
- Type scale: 12, 13, 14, 16, 18, 24, 32, 44.
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Body line-height: 1.55; readable text measure: 62–72 characters.
- Radius scale: 6, 10, 14. Pills are reserved for status only.

## Component rules

- Keep one primary action per visible work area.
- Buttons and navigation targets are at least 40px high on desktop; major actions are 44px.
- Every input has a visible label and persistent helper text where the consequence is not obvious.
- Disabled controls use the native `disabled` attribute and explanatory nearby copy.
- Advanced trust and architecture detail uses native `details`/`summary` progressive disclosure.
- Use one consistent 1.75px outline SVG icon family. Do not use emoji or text glyphs as structural icons.
- Empty states explain what will appear and identify the next useful action.
- The current location is shown by background, border, weight, and `aria-selected`, never color alone.

## Accessibility and behavior

- Preserve the skip link, semantic landmarks, sequential headings, tab roles, and arrow-key navigation.
- All functionality remains keyboard reachable, with a visible `:focus-visible` ring.
- Use polite live regions for background status and action results.
- Do not rely on hover to reveal essential actions or information.
- Respect `prefers-reduced-motion` and `prefers-contrast`.
- At narrow desktop widths, collapse decorative copy before hiding primary labels or actions.
- Test at 940×640 (minimum supported desktop proof), 1280×800, and 1440×900.

## Truth rules

- The interface may show only capabilities backed by the current local implementation.
- OpenCut remains a candidate until its exact activation gates pass.
- Skill promotion means revision trust, not run permission or execution.
- Approval pins wording only; it does not validate demand, authorize a build, or publish anything.
- Review decisions require an explicit reason and remain pinned to the selected content hash; superseded authority never transfers to a newer revision.
- Forgetting removes a claim from active retrieval; the current immutable audit limitation must remain discoverable.
