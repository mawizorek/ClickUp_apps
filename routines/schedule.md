# Routine Schedule — the WHEN + the last-run ledger

**Runbooks define the WHAT. This file defines the WHEN, and records the LAST RUN.** Timing never lives in a spec or in the agent. Retune by editing a row here, or just tell Ricky in plain language ("run F1 only Sat + Sun now") and he edits the row.

The `last-run` column is Ricky's memory. He reads it every wake to decide what's due, updates it after every successful run, and uses it to catch up on anything missed. This is the whole audit trail — no separate log.

## Routines

| Routine file | Cadence | Window / notes | last-run (ET) |
|---|---|---|---|
| `on-track-refresh.md` | Every **Wednesday** | weekly motorsports TV refresh | never |
| `f1-refresh.md` | Every **Thu, Fri, Sat, Sun** | race-weekend days | never |
| `world-cup-refresh.md` | **Every 2 hours** | ONLY through **2026-07-19**, then inactive | never |

## How Ricky decides what to run (all times America/New_York)

On each wake, for every routine, compute **“is there a due occurrence that hasn’t been run yet?”** using `cadence` + `last-run`:

- **Day-of-week cadence** ("every Wednesday", "Thu–Sun"): the routine is due once per matching day. Run it **only if `last-run` is not already today** AND today matches. After success, set `last-run` to today's date + time.
- **Interval cadence** ("every 2 hours"): run only if now is inside the window AND at least the interval has elapsed since `last-run`. After success, set `last-run` to now.
- **Idempotency (the once-a-day guard):** because the run only fires when `last-run` isn't already in the current period, waking hourly can never double-run a daily routine. First qualifying wake runs it and stamps the date; every later wake that day sees `last-run == today` and skips.
- **Catch-up (the missed-run guard):** if a matching day/occurrence has passed and `last-run` is still older than it, the routine is overdue — run it now and note in the report that it's a catch-up for the missed date. Example: F1 was due Tuesday, nobody woke, Ricky wakes Wednesday and sees `last-run` predates Tuesday → he runs the missed refresh and flags it. Catch-up runs the latest occurrence once; it does not replay every missed day.
- **Nothing due / already current** → wake, check, do nothing, no report.

## Rules for the ledger

- Ricky updates ONLY the `last-run` cell of a routine, and ONLY after that routine's run fully succeeds. A failed/stopped run leaves `last-run` untouched (so it stays overdue and gets retried next wake).
- `last-run` format: `YYYY-MM-DD HH:MM`. Use `never` for a routine that has never successfully run.
- Changing a cadence: tell Ricky conversationally OR edit the `Cadence` cell. Never reschedule by editing a runbook spec, never edit the agent.
