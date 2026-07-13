# Clark Pro Design Tokens

**Project:** clark-pro
**Version:** 1.0
**Updated:** 2026-07-13
**Source:** `clark-pro/apps/desktop/src/renderer/app.css`

---

## Color Tokens

| Token | Value | Semantic use |
|-------|-------|--------------|
| `color.bg` | `#111318` | Window and application background |
| `color.surface` | `#181B21` | Standard panels |
| `color.surfaceRaised` | `#20242C` | Selected/raised content |
| `color.border` | `#313641` | Dividers and control borders |
| `color.text` | `#F5F3ED` | Primary content |
| `color.textMuted` | `#9AA3B2` | Secondary content |
| `color.accent` | `#FF6B35` | Primary creator action and active location |
| `color.accentSoft` | `#3A241D` | Selection surface |
| `color.focus` | `#7AB8FF` | Keyboard focus ring |
| `color.success` | `#63D297` | Verified/complete |
| `color.warning` | `#E7B85D` | Pending/quarantine/reconciliation |
| `color.danger` | `#F1A4A4` | Destructive/error text |
| `color.dangerSurface` | `#321D1D` | Destructive surface |

## Typography Tokens

| Token | Value | Use |
|-------|-------|-----|
| `font.sans` | `Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif` | Product UI |
| `font.mono` | `ui-monospace, SFMono-Regular, Menlo, monospace` | Hashes, receipts, schema/code |
| `text.eyebrow` | 11px / 760 / 0.12em | Uppercase location or category |
| `text.meta` | 11px / 500 / 1.45 | Supporting metadata |
| `text.body` | 13px / 450 / 1.55 | Dense product copy |
| `text.heading3` | 17px / 700 / 1.25 | Panel or inspector heading |
| `text.heading2` | 24px / 760 / 1.2 | View heading |
| `text.editor` | 16px / 450 / 1.65 | Long-form creator content |

## Spacing and Shape Tokens

| Token | Value |
|-------|-------|
| `space.1` | 4px |
| `space.2` | 8px |
| `space.3` | 12px |
| `space.4` | 16px |
| `space.5` | 20px |
| `space.6` | 24px |
| `space.8` | 32px |
| `radius.control` | 8px |
| `radius.panel` | 12px |
| `radius.pill` | 999px |
| `focus.width` | 3px |
| `target.minimum` | 44px |

## State Mapping

| Domain state | Surface | Text/icon color | Rule |
|--------------|---------|-----------------|------|
| verified / complete / active | `#1D382B` | `color.success` | Always show the state word |
| running / selected / specified | `#263249` | `#AEC7F6` | Use progress or selected icon |
| waiting / quarantine / needs_reconciliation | `#3D291D` | `#EFBD72` | Must include owner/next action |
| failed / blocked / destructive | `#422424` | `color.danger` | Must include retained-state and recovery copy |
| stale / revoked | `#2E263D` | `#C2A8FF` | Never reuse prior approval/authority |
