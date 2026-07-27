# Session Board

## Active

| Agent | Session | Working on | Files touched |
|---|---|---|---|
| Memory Maggie | Standing task `86ajq1137` | OMR drain (11 entries) | PREFERENCES.mirror.md, open-memory-requests.md, hooks/silent-fallback-law.md, session-board.md |

_Delete your row on session close._

<p><br/></p>

_⚒️ Dexter out 2026-07-27 ~2:20 PM ET — **Routines Viewer v2 merged, PR #560.** `routines/index.html` · NEW `routines/next-build-spec.md` · `routines/schedule.md` · `VERSIONS.md`. Six defects closed, two of them running wrong for three weeks. **`main` verified at HEAD; Pages was still serving the cached v1 shell at time of check — expect a short lag.**_

_📏 **`routines/index.html` is now ~20.8KB** — under the 22KB ceiling, well over the 15KB split line. **The next change to that app is the `source/` split, not another inline block.** Seat Size Sally first. (My own estimate said +1.2KB and it came in at +4.7KB — check the budget at commit time, not just at spec time.)_

_🚨 **THE SCHEDULER IS GONE** (2026-07-26). Nothing wakes; Ricky is invoke-only. Anything you read that assumes a wake timer is rot — flag it. **Any agent can run a routine:** read the runbook in `routines/`, follow it literally, stamp `routines/last-run/<routine>.txt`. One writer per file, never a shared log. `brain-config/data-refresh-log.json` was DELETED — ignore any note pointing at it._

_⚠️ **`routines/schedule.md` and `routines/index.html` are ONE SYSTEM.** Every defect in v2 came from a DOC edit that was correct in isolation — the table changed shape and the renderer quietly disagreed, twice for three weeks each. **If you reshape that table, you are editing the app.** The fragile part is fixed (retirement now reads the explicit `inactive` cadence cell, so notes prose is safe to edit again), but the four columns + the `Routine file` header are still an API._

<p><br/></p>

_⚠️ **For whoever audits memory next** (Mira, 2026-07-26): three bundles rotated that day (Milo twice, Anna once) and the pattern both times was per-list audit DETAIL pasted into hot memory. The detail belongs in the session record; memory holds only what changes how the agent acts tomorrow. Standing lines added to both files._
