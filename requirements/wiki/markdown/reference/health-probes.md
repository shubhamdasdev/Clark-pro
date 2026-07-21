# Health Probe Registry — Clark Pro

**Project:** clark-pro
**Version:** 1.0
**Updated:** 2026-07-13

---

| ID | Critical path | Probe | Signal / pass rule | Cadence | Owner | Bound flow tests |
|----|---------------|-------|--------------------|---------|-------|------------------|
| HP-001 | Launch and Harness handshake | Start packaged app with a verified fixture and query typed health | Focus interactive; Harness contract version matches; no renderer authority regression | release + nightly packaged smoke | Desktop / Harness | TF-015 |
| HP-002 | Event append and projections | Append idempotent fixture command, verify hash chain/checkpoint, rebuild projection | One event for command; aggregate version valid; rebuilt snapshot identical | every PR + nightly | Domain / Data | TF-006, TF-015 |
| HP-003 | Run recovery | Kill Harness at each supported state and relaunch | Correct durable gate; orphan lease revoked; no duplicate artifact/tool intent | nightly chaos + release | Harness / QA | TF-006, TF-015 |
| HP-004 | Credential boundary | Revoke fixture credential while dependent work is queued | Work blocks before provider call; secret absent from renderer/events/logs | every PR boundary suite | Security / Connect | TF-006, TF-009 |
| HP-005 | Bridge and client scope | Run hostile Origin/Host/body/workspace and reconnect fixtures | Unauthorized requests denied; same intent reconnects to existing job | nightly conformance | Bridge / Security | TF-015 |
| HP-006 | Tool Pack and Skill isolation | Execute acquisition, hostile archive/sandbox, permission-expansion, update/rollback corpus | Escape/expansion denied; prior active revision preserved; receipt complete | every PR + release | Ecosystem / Security | TF-006 |
| HP-007 | Publication reconciliation | Simulate response loss after provider commit and restart | Intent enters reconciliation; provider observation finds one outcome; no blind retry/duplicate | nightly + pre-ship | Distribution | TF-009, TF-015 |
| HP-008 | Observation freshness | Load fresh, stale, deleted, missing, and incomparable provider fixtures | Each limitation is visible and no incompatible metrics merge | nightly | Data / Product | TF-006 |
| HP-009 | Backup and restore | Encrypt representative workspace, corrupt variants, restore on clean fixture | Valid archive matches hashes/history; invalid archive never mutates active workspace | release + weekly | Data / Security | TF-015 |
| HP-010 | Relay, remote worker, and tenant isolation | Replay/expire/revoke/cross-tenant envelope corpus; disable hosted services | Unauthorized envelope denied; valid result reconciles; local access/export remain usable | R-003 CI + production synthetic | Platform / Security | TF-015 |

## Evidence Contract

Each run records probe ID, app/schema version, environment, fixture version, start/end, bounded result class, evidence artifact path, and owner. Probe output must exclude creative content, raw identifiers, credentials, absolute paths, and provider payloads. A failing safety/integrity probe blocks the applicable release; a baseline performance probe opens a measured follow-up rather than inventing a threshold.
