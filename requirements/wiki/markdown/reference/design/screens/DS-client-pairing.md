# Design Spec — Client Pairing

**ID:** DS-client-pairing
**Project:** clark-pro
**Flow:** UF-013
**Screen:** Modal: Client Pairing
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-004-002, S-004-003, S-004-004
**Components:** ClarkDialog, ClarkTrustGate, ClarkFormField, ClarkActionButton

---

## Modal: Client Pairing

Register an MCP client through one-time local pairing and explicit workspace, tool, resource, and job scopes.

**Layout & Hierarchy**

1. Primary: Client identity.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkDialog | All Modal units | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkFormField | Setup, capture, decisions | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Pair an MCP client |
| Primary CTA | Pair with these scopes |
| Secondary CTA | Cancel |
| Safety note | The client cannot approve work unless that scope is explicitly granted. |

**States**

- **Default:** Client identity, one-time code, allowed workspaces/tools/resources, task support, token storage, expiry, revoke behavior.
- **Loading:** Pairing code progress never exposes long-lived bearer material.
- **Error:** Invalidate failed or expired one-time codes and preserve zero access.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `client_pairing`.
3. Preserve the modal semantics from the linked flow: trap focus and require an explicit decision or cancel.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---
