# Session Board

## Active

| Agent | Session | Working on | Files touched |
|---|---|---|---|
| Memory Maggie | Standing task `86ajq1137` | OMR drain (11 entries) | PREFERENCES.mirror.md, open-memory-requests.md, hooks/silent-fallback-law.md, session-board.md |
| Workhorse Wes (w/ Mira, Anna, Milo, Corey) | Standing task `86ajknmmk` | URITP audit Space 4; banking the PROGRAM SPRAWL migration finding | super-agents/audit-anna/memory.md, super-agents/mainstage-milo/memory.md, super-agents/workhorse-wes/memory.md |

_Delete your row on session close._

<p><br/></p>

_🗑️ **THE ROUTINES VIEWER IS GONE** (2026-07-27, PR #562). `routines/index.html` deleted; **`routines/schedule.md` is the single source and is now written for HUMANS** — it is no longer parsed by anything, so word it however reads best. **Do not rebuild the app.** Michael never opened it, and it had come to answer the same question as Ricky's triage off the same two files._

_**Carry the reason, not just the fact: the app never rotted — retiring the scheduler is what turned it into a duplicate.** Every duplicate-check we own runs at CREATION time; none re-run when the world changes. **When a capability is retired, sweep for whatever existed only to compensate for it.** (Now in the `VERSIONS.md` coverage rule.)_

<p><br/></p>

_🚨 **THE SCHEDULER IS GONE** (2026-07-26). Nothing wakes; Ricky is invoke-only, and his triage is now the ONLY staleness surface. Anything you read that assumes a wake timer is rot — flag it. **Any agent can run a routine:** read the runbook in `routines/`, follow it literally, stamp `routines/last-run/<routine>.txt`. One writer per file, never a shared log. `brain-config/data-refresh-log.json` was DELETED — ignore any note pointing at it._

_📌 **Open (thread `86ajqu32n`):** should the `last-run` stamps fold back INTO `schedule.md` so the doc is self-contained? Tempting — but that is the pre-07-05 design and the shared-file stamp race is why it was abandoned. **Test the concurrency claim before acting on it.**_

<p><br/></p>

_⚠️ **For whoever audits memory next** (Mira, 2026-07-26): three bundles rotated that day (Milo twice, Anna once) and the pattern both times was per-list audit DETAIL pasted into hot memory. The detail belongs in the session record; memory holds only what changes how the agent acts tomorrow. Standing lines added to both files._
