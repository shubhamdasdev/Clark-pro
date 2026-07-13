# ADR-0007 — Governed Memory and Skills

- **Status:** Accepted
- **Date:** 2026-07-12
- **Owners:** Memory, AI, Skills, Product, Security

## Context

Clark's core promise requires continuity and improvement, but naïve chat history or vector retrieval mixes identity, preference, performance correlation, private facts, and procedures. Silent learning can amplify weak social signals, prompt injection, or a mistaken correction. Installable skills may include scripts and tool requests, making them a supply-chain and permission boundary.

## Decision

Use a structured creator model with distinct identity, semantic, episodic, procedural, and performance layers. Retrieval is task-, scope-, sensitivity-, and policy-specific. Every retrieved item is referenceable and can show where it influenced work.

Reflection produces memory or skill proposals with evidence, contradiction, confidence, scope, sensitivity, and expiry. Promotion follows explicit policy and is reversible. Agent Skills use the standard package shape, but install in quarantine with pinned source revision, declared tools/domains, effective-permission intersection, fixtures, regression tests, promotion, and rollback.

## Consequences

### Positive

- Personalization becomes inspectable, correctable, portable, and safer than prompt suffixes.
- Outcome observations do not automatically become creator taste or causal truth.
- Successful procedures can compound without granting silent new authority.
- Skill and memory revisions retain evidence and rollback history.

### Costs

- Proposal review can become burdensome and must be rate-limited and prioritized.
- Memory taxonomy and retrieval evaluation are product work, not merely embedding infrastructure.
- Sandboxing third-party scripts across local tools and networks is complex.

## Rejected alternatives

- **Raw conversation history as memory:** mixes temporary context with durable belief.
- **Opaque vector store as memory model:** lacks scope, evidence, contradiction, and governance.
- **Automatic memory writes from every edit/outcome:** creates drift and poisoning risk.
- **Skills trusted because their text asks for tools:** allows self-granted permissions.
- **General agent self-modification:** breaks provenance, review, and rollback.

## Invariants

1. Secret values are never memory items; only secret references may exist.
2. Creator preference and audience performance remain separate evidence types.
3. A proposal cannot become active without its policy-defined promotion event.
4. Effective skill permission is the intersection of package declaration, package trust, capability trust, workspace policy, and run approval.
5. Updating a skill cannot silently expand permissions or replace the active revision.
6. Forget removes retrieval/search derivatives and records a retention/tombstone receipt.

## Verification gates

- A creator can inspect evidence, contradiction, confidence, scope, retrieval history, and influenced outputs.
- Correcting or forgetting an item proves it no longer enters future context.
- Prompt-injected sources cannot create active memory or skill changes.
- Malicious skill fixtures cannot access undeclared files, domains, tools, credentials, or workspaces.
- Regression failure prevents promotion and supports rollback to the prior pinned revision.
- Retrieval evaluation measures helpfulness, false inclusion, sensitive leakage, and stale belief.

## Revisit triggers

- Proposal burden exceeds demonstrated continuity value.
- A standard emerges that represents governed memory or executable skill trust more completely.
- Creator research shows a different taxonomy is easier without weakening invariants.
