# Routine Ricky: Activity Log Redirect

**Moved to Routine Ricky's row in the ClickUp 🤖 Agent Index, 2026-09-07.** The log now lives as COMMENTS on that row.

- Agent Index row: task id `86ajtqmp7`, list `901328043244`. Resolve it with the ClickUp task tools.
- 🚫 **No URL is printed here on purpose — that is Ricky's own rule** (this file's former header, earned 2026-08-06): an agent cannot see a real ClickUp URL, so writing one into a repo file writes back a dead internal placeholder. **Name the task, give the ID.**

This file is a compatibility pointer, not an empty ledger. **Do not append activity here and do not reconstruct a replacement log.** New session activity goes to the Agent Index row as a comment.

🚨 **THE INVOCATION-STAMP GATE SURVIVES THE MOVE AND IS NOT OPTIONAL.** First line of every new session record is `- HH:MM XM · INVOKED.`, written BEFORE triage, BEFORE reading schedule, BEFORE any work. The stamp IS proof of life; without it the next wake reads as first-time. It now goes in the comment instead of the file. ⚠️ Ricky logged this gate slipping TWICE (08-06, 08-17) with the honest cause: the stamp cost a repo round-trip before any work was visible. **A comment is cheaper than a commit, so the move removes that excuse rather than the rule.**

🔴 **STAMPS ARE STILL NOT HERE AND NEVER WILL BE.** `routines/last-run/<routine>.txt` remains the only home for last-run state — one file per routine, one writer. Anything in a comment is a NOTE about a run, never the run's state. **Read the stamp files at triage.**

Recreated as individual comments, read back before this redirect replaced them:

- 2026-07-26: built, then immediately redesigned around TRIAGE
- 2026-08-01 -> 08-03: the four runs that proved the stamp gate was needed (grouped)
- 2026-08-04: Job Market, resumed and landed PARTIAL
- 2026-08-05: Job Market, aborted at a role boundary
- 2026-08-06: invoked, triage, On Track run, then a locked ruling
- 2026-08-06 (evening): Job Market, its own session, FRESH full pull
- 2026-08-17: On Track catch-up, F1 no-op, Job Market left standing
- LIVE STATE snapshot through 2026-08-17, posted as history and labelled STALE

Original event dates are in the comment headings; ClickUp posting timestamps are the backfill date. 🔴 Routine standing, open flags and bundle-health numbers in that snapshot are as of 2026-08-17 and must be re-read before being quoted.

⚠️ `preferences.md` still names `activity-log.md` in its load path. It resolves HERE, so nothing breaks, but the repoint is PENDING — queued as one deliberate fleet-wide pass.

**Recovery:** [complete original log at the pre-migration commit](https://github.com/mawizorek/ClickUp_apps/blob/e2b4cc87b2096dbb12d9ae1c25d949739929be0e/brain-config/super-agents/routine-ricky/activity-log.md). History is preserved, not condensed into this pointer.
