# Design Spec — Credential Authorization

**ID:** DS-credential-authorization
**Project:** clark-pro
**Flow:** UF-002
**Screen:** Modal: Credential Authorization
**Stage:** Ready
**Version:** 1.0
**Created:** 2026-07-13
**Updated:** 2026-07-13
**Stories:** S-004-001, S-004-003, S-008-001
**Components:** ClarkDialog, ClarkTrustGate, ClarkActionButton

---

## Modal: Credential Authorization

Collect OAuth or API-key authorization through the broker without exposing secret material to renderer state.

**Layout & Hierarchy**

1. Primary: Provider identity.
2. Secondary: The exact state, evidence, authority, and next-action controls needed for this decision.
3. Tertiary: Provenance, diagnostics, and navigation that preserve context without competing with the primary action.

**Components**

| Component | Usage | Source |
|-----------|-------|--------|
| ClarkDialog | All Modal units | `reference/design/design.md` |
| ClarkTrustGate | Connections, approvals, packages, Skills | `reference/design/design.md` |
| ClarkActionButton | All actionable surfaces | `reference/design/design.md` |

**Copy**

| Element | Copy |
|---------|------|
| Heading | Authorize this capability |
| Primary CTA | Authorize securely |
| Secondary CTA | Cancel |
| Privacy note | Clark stores the secret in Keychain, not in your workspace. |

**States**

- **Default:** Provider identity, requested scopes, redirect status, Keychain destination, cancel action, privacy note.
- **Loading:** Show broker-owned progress without rendering secret values.
- **Error:** State whether authorization was denied, expired, or invalid; no token text is shown.

---

## Implementation Notes

1. Use only the listed Clark components and values from `design-tokens.md`.
2. Source every visible string from `locales/en.json` under `credential_authorization`.
3. Preserve the modal semantics from the linked flow: trap focus and require an explicit decision or cancel.
4. Implement every state above and keep prior trusted canonical state visible when a check fails.

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-07-13 | 1.0 | PM Agent | Created and linked to UF-002. |
