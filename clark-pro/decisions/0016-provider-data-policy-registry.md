# ADR-0016 — Provider Data-Policy Registry

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Security, Connect, Product Operations

## Context

Clark routes creator content and memory excerpts to models, research, media, publishing, analytics, and remote workers. Retention, training, region, subprocessors, zero-data-retention eligibility, and account-plan terms vary and change. Tool descriptions and MCP annotations are untrusted and cannot establish the provider's privacy behavior. A stale or overconfident label could cause confidential egress under false assumptions.

## Decision

Maintain a versioned, Clark-signed Provider Data-Policy Registry. Each record is scoped to provider, product/API, account/plan class, region, feature/endpoint, and credential configuration and includes:

- official source URLs and quoted/paraphrased claim identifiers;
- checked-at, effective-from, expiry/review-by, and reviewer;
- retention duration/status;
- training/default/opt-out status;
- zero-data-retention or enterprise exception requirements;
- storage/processing regions when known;
- subprocessors/third-party routing status;
- deletion/control capabilities;
- verification state: `official_documented`, `contract_confirmed`, `configured_and_tested`, `unknown`, or `conflicting`;
- allowed maximum Clark sensitivity and required redactions;
- limitations and evidence hash.

Unknown, expired, conflicting, or plan-mismatched policy never silently inherits a better status. Default behavior:

- public/workspace data may proceed only under the workspace's explicit provider allowance and visible warning;
- personal data requires current documented/configured policy and exact egress preview;
- confidential data is blocked unless a current contract/configuration and explicit run exception permit it;
- raw secrets are always forbidden.

Registry updates are signed data updates with diff, review, and rollback. Provider/MCP self-report may propose a change but cannot activate it. A creator may choose a stricter workspace rule; a local override cannot assert a provider policy fact that Clark cannot verify.

## Consequences

### Positive

- Routing and egress decisions use inspectable evidence instead of brand assumptions.
- Product can distinguish plan/configuration reality from provider-wide marketing.
- Staleness and uncertainty fail visibly.

### Costs

- Registry maintenance is continuous operational work.
- Some providers/features remain unusable for sensitive work.
- Legal terms may require human interpretation beyond automated scraping.

## Rejected alternatives

- **Trust MCP/provider metadata:** lets the data recipient declare its own safety.
- **One policy per vendor:** ignores endpoint, plan, region, and configuration differences.
- **Assume opt-out/paid API means no training:** not universally true and can change.
- **User checkbox makes any provider safe:** consent cannot correct a false factual claim.

## Invariants

1. Every remote egress plan references a specific registry record version or `unknown` state.
2. Expired/conflicting evidence cannot authorize personal/confidential egress.
3. Registry records contain no credentials or customer content.
4. Routing cannot silently fall back to a provider with weaker/unknown policy.
5. UI separates Clark's verified facts, provider claims, customer contract/configuration, and user policy.

## Verification gates

- Fixtures cover plan/region mismatch, stale evidence, conflicting sources, changed retention, opt-out loss, and unknown subprocessor.
- Context compiler blocks confidential/personal packets under the defined negative cases.
- Registry signature/hash tamper and rollback tests pass.
- Every displayed policy label links to record scope/date/source and uses uncertainty language correctly.
- Scheduled runs re-evaluate the registry at execution, not only planning.

## Evidence

- [MCP security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)
- [OpenTelemetry guidance: sensitive-data classification remains the implementer's responsibility](https://opentelemetry.io/docs/security/handling-sensitive-data/)

## Revisit triggers

- A widely adopted, signed provider-policy standard supplies equivalent scoped evidence.
- Legal/security operations cannot maintain registry freshness at the supported provider breadth.
- Enterprise customer contract ingestion requires a separate private registry layer.
