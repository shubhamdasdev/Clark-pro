# Clark Pro — Core User Flows

**Status:** Authoritative v2 · July 2026

## Flow 1 — Install and establish trust

1. Creator installs a signed/notarized Mac application.
2. Clark explains local canonical ownership, optional remote calls, and the difference between memory, credentials, skills, and connected tools.
3. Creator creates a workspace or imports an encrypted/portable workspace.
4. Clark creates the local event store and asset library and confirms backup location.
5. Creator configures a model provider; the credential is stored in Keychain.
6. Creator imports or writes the Brand Constitution.
7. Clark offers connector setup but does not block first use.
8. Creator chooses a guided template and lands in Focus mode.

**Failure paths:** unsupported Mac; signature/update failure; database migration failure; Keychain denial; invalid provider credential; imported-workspace checksum failure. Every failure offers diagnostics and a safe rollback or read-only path.

## Flow 2 — Connect a capability

1. Creator opens Connections and chooses a bundled, verified, community, or local-development source.
2. Clark displays publisher identity, transport, requested permissions, network domains, credential scopes, cost behavior, and trust level.
3. Creator authorizes through OAuth/PKCE, API key, local process, or provider-specific flow.
4. Credential broker stores secrets in Keychain and returns an opaque reference.
5. Adapter runs discovery, schema validation, health, and a non-mutating conformance check.
6. Creator grants the capability to selected workspaces and action classes.
7. Capability appears in the palette and dry-run planner.

**Failure paths:** invalid metadata; expired scopes; provider does not support expected async/cancel behavior; duplicate tool name; untrusted annotations; conformance failure; revoked credentials.

## Flow 3 — Install an Agent Skill

1. Creator selects a package source or drops a skill folder.
2. Clark validates the Agent Skills structure and locks the source revision.
3. Clark scans scripts, references, domains, compatibility, and requested tools.
4. UI shows the effective-permission intersection for the selected workspace.
5. Skill installs in quarantine and runs fixtures/dry-run tests.
6. Creator reviews results and promotes, limits, or rejects it.
7. Active revision becomes available to matching loops; prior revision remains for rollback.

**Failure paths:** invalid frontmatter; hidden executable; unavailable capability; overly broad tools; network request outside declaration; regression failure; incompatible update.

## Flow 4 — Quick capture

1. Creator invokes global shortcut, Share action, drag/drop, or menu-bar capture.
2. Adds text, URL, screenshot, file, selected content, or voice memo.
3. Clark stores the original as an immutable source artifact and proposes workspace/project classification.
4. Focus mode asks only for missing information needed to preserve intent.
5. Creator accepts, edits, or leaves the item in Inbox.

No research or generation runs merely because an item was captured.

## Flow 5 — Run the Full-Week loop

1. Creator opens a project and chooses Full Week.
2. Focus shows inputs, selected Brand Constitution, accounts, budget, time window, and expected review gates.
3. Creator runs dry-run.
4. Harness validates credentials, capabilities, platform schemas, costs, permissions, and graph contracts.
5. Creator starts the run.
6. Sensemaking branch imports sources, searches, builds claim ledger, retrieves relevant memory, and marks uncertainty.
7. Angle decision arrives in Focus; Canvas shows alternatives and evidence.
8. Creator chooses one or more angles.
9. Script and media branches execute in parallel within budgets.
10. Review collects platform previews, evidence, policy warnings, versions, and cost.
11. Creator approves, edits, rejects, or requests targeted changes.
12. Approved artifacts move to Timeline for schedule and distribution.

At every step the creator can open Canvas, inspect lineage, pause a branch, replace a capability, or lower permissions.

## Flow 6 — Change an upstream decision

1. Creator edits or promotes a different angle.
2. Harness computes downstream input-hash impact.
3. UI shows stale artifacts, reusable work, invalidated approvals, scheduled-publication risk, and estimated regeneration cost.
4. Creator chooses affected branches to regenerate or preserve manually.
5. New artifact versions are appended; old versions remain.
6. Decisions and schedule are reconciled before any new publication.

## Flow 7 — Compare and approve

1. Review shows paired text diffs or synchronized media previews.
2. Creator sees sources, model/provider, skill revision, memory references, policy results, cost, and prior annotations.
3. Creator selects a canonical version or edits directly.
4. Clark records the decision, alternatives, reason/note, and actor.
5. Approval applies only to that artifact version and required platform adaptation.

**Edge cases:** source becomes disputed; disclosure missing; brand policy conflict; model output includes unsafe claim; media validation failure; approval occurs after upstream staleness.

## Flow 8 — Schedule and publish

1. Timeline shows approved artifacts and account/platform requirements.
2. Creator schedules or chooses immediate publish.
3. Clark creates a publication intent with an idempotency key.
4. Connector validates current platform schema and account health.
5. Policy engine requests approval if required.
6. Adapter submits through Postiz, direct API, or assisted handoff.
7. Clark records provider receipt and observes until verified live.
8. On ambiguous failure, publication enters reconciliation—not blind retry.
9. If automation cannot proceed, Clark produces a complete export package.

## Flow 9 — Observe outcomes

1. Observation loop wakes according to platform and campaign policy.
2. Clark pulls Postiz/direct analytics and flags unavailable fields.
3. Creator may add qualitative judgment, context, or manual values.
4. Observations attach to exact publication, artifact, angle, source, and decision lineage.
5. Review shows distributions and comparable cohorts with sample counts.
6. No memory changes occur yet.

## Flow 10 — Reflect and promote memory

1. Reflection loop reads recent evidence, decisions, corrections, failures, and active memory.
2. It returns no change or a small set of scoped proposals.
3. Memory view shows statement, evidence, contradiction, confidence, sensitivity, scope, and expiration.
4. Creator approves, edits, disputes, defers, or rejects.
5. Promoted revision becomes retrievable and is linked to the promotion decision.
6. Later outputs show when the memory influenced context.

## Flow 11 — Learn or revise a skill

1. A successful or corrected trajectory triggers a skill proposal.
2. Clark extracts stable procedure, inputs, outputs, tools, permissions, compatibility, and recovery behavior.
3. Proposal includes tests and examples and runs in quarantine.
4. Creator reviews a new package or revision diff.
5. On promotion, the revision is pinned for future runs.
6. Reliability monitoring can propose rollback; it cannot silently rewrite the active skill.

## Flow 12 — External agent uses Clark Bridge

1. Creator registers an MCP client and grants workspace/tool/resource scopes.
2. External agent calls `clark.capture` or `clark.start_run` with an intent ID.
3. Clark applies the same domain validation and policies as Studio.
4. Long work returns an MCP Task when negotiated or Clark job receipt fallback.
5. When review is required, the job waits and Review/Focus notify the creator.
6. Creator submits the decision through Studio or a scoped MCP call.
7. External client retrieves result/resource; event history remains canonical in Clark.
8. Revocation immediately blocks further client access.

## Flow 13 — Correct or forget personal data

1. Creator searches Memory and opens an item.
2. Sees statement, revisions, evidence, retrieval history, and influenced outputs.
3. Chooses edit, dispute, narrow scope, expire, or forget.
4. Forget produces an audit/tombstone event, removes item from retrieval, and deletes derived search/vector material.
5. Clark shows completion and any legal/backup retention caveat.

## Flow 14 — Mac sleeps, quits, or crashes

1. Harness checkpoints local state before suspension where possible.
2. Remote jobs continue only if explicitly delegated; local-only jobs pause.
3. On wake/launch, boot recovery classifies incomplete steps.
4. Async jobs reconnect by provider ID.
5. Publication intents reconcile before retry.
6. Approval waits resume with original context.
7. Focus summarizes recovered, paused, failed, and externally completed work.
