# Clark Pro Security Policy

Clark Pro is in pre-release product-definition work. There is no production release yet. This policy establishes the reporting and support boundary that must be operational before beta distribution.

## Report a vulnerability privately

Use GitHub's **Report a vulnerability** action on this repository's Security tab. The repository owners must enable private vulnerability reporting before any beta is distributed.

If that private action is unavailable, open a public issue containing only a request for private security contact. Do **not** include exploit details, proof-of-concept code, creator content, credentials, tokens, personal data, unpublished media, or another user's information in a public issue.

Include privately when possible:

- affected Clark version, macOS version, component, and installation source;
- impact and the minimum steps needed to reproduce safely;
- whether exploitation has been observed or remains theoretical;
- logs, screenshots, or fixtures after removing secrets and personal/creative content;
- your preferred contact and disclosure timeline.

The team will acknowledge critical reports within one business day, high-severity reports within two, and other valid reports within five. These are service objectives, not warranties. During active remediation, Clark aims to provide weekly status updates and daily updates for a confirmed critical exposure. Disclosure timing is coordinated around a verified fix and user protection.

## Supported versions

Once stable releases exist:

| Version | Security support |
|---|---|
| Latest stable release | Fully supported |
| Immediately previous minor line | Critical/high fixes for 90 days after supersession when technically feasible |
| Older releases and development snapshots | Unsupported; local read/export recovery should remain available |

Each release will state its supported macOS range. A build with a known exploitable critical vulnerability cannot remain supported merely because upgrading is inconvenient.

## Safe research rules

Test only with systems, workspaces, accounts, content, and social destinations you own or are explicitly authorized to use. Do not:

- access, modify, publish, or delete another user's data;
- trigger real public social mutations without explicit owner approval;
- degrade shared services, persist after demonstrating impact, or exfiltrate data;
- disclose secrets or creator content in reports;
- publicly disclose an unpatched issue before a coordinated protection plan.

Stop after demonstrating the minimum impact needed for validation. Clark does not currently promise a bounty or legal safe harbor; authorization from third-party providers remains subject to their rules.

## Scope

This policy covers Clark Studio, Harness, Memory, Connect, Bridge, Skills/Kit, official installers and updates, Relay/Team services when released, and official Clark-maintained connectors. Vulnerabilities in third-party services should also be reported to their owners, but Clark wants reports where its integration, permission, isolation, or disclosure behavior increases risk.

The authoritative system model is [clark-pro/security-and-threat-model.md](clark-pro/security-and-threat-model.md). Response and support decisions are recorded in [ADR-0020](clark-pro/decisions/0020-vulnerability-and-support-policy.md).
