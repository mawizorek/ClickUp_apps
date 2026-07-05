# Routine Schedule — the WHEN + the last-run ledger

**Runbooks define the WHAT. This file defines the WHEN, and records the LAST RUN.**

Timing never lives in a spec or in the agent. Retune by editing a row here, or just tell Ricky in plain language ("run F1 only Sat + Sun now") and he edits the row.

The `last-run` column is Ricky's memory. He reads it every wake to decide what's due, updates it after every successful run, and uses it to catch up on anything missed. This is the whole audit trail — no separate log.

## Routines

| Routine file           | Cadence             | Window / notes                                  | last-run (ET) |
|------------------------|---------------------|-------------------------------------------------|---------------|
| `on-track-refresh.md`  | Every **Wednesday** | weekly motorsports TV refresh                   | 2026-07-04 23:37 |
| `f1-refresh.md`        | Every **Thu, Fri, Sat, Sun** | race-weekend days | 2026-07-05 03:07 |
| `world-cup-refresh.md` | **~4x/day**         | ONLY through **2026-07-19**, then inactive      | never         |

## Wake windows (agent timer, America/New_York)

- **Now through 2026-07-19 (World Cup window):** Ricky fires **4 times a day — 06:00, 15:00, 21:00, 03:00**. Deliberately back-loaded: mornings are dead for motorsport/football results, so after the 06:00 open the wakes cluster in the afternoon/evening/late-night when matches actually resolve. World Cup is due at each; the `last-run` guard prevents double-runs.

- **After 2026-07-19:** severely relax to **once daily at 06:00**. That comfortably covers On Track (Wed) and F1 (Thu–Sun) via day-cadence + catch-up. Retune the agent timer down when the window closes.

## How Ricky decides what to run (all times America/New_York)

On each wake, for every routine, compute “is there a due occurrence that hasn’t been run yet?” using `cadence` + `last-run`:

- **Day-of-week cadence** ("every Wednesday", "Thu–Sun"): due once per matching day. Run only if `last-run` is not already today AND today matches. After success, set `last-run` to today + time.

- **Interval / multi-wake cadence** ("~4x/day"): run if now is in-window and this wake-slot hasn't been run yet (guard on `last-run` being older than this slot). After success, set `last-run` to now.

- **Idempotency (double-run guard):** a routine whose `last-run` is already in the current period is done — skip it, even on many wakes. Waking often is harmless.

- **Catch-up (missed-run guard):** if a due occurrence has passed and `last-run` is still older, it's overdue — run the latest missed occurrence once and flag it as catch-up in the report. Don't replay every missed day.

- **Nothing due / already current** → wake, check, do nothing, no report. (No-op wakes are cheap by design.)

## Error posture (background-quiet)

Ricky runs in the background and should feel invisible unless something's genuinely wrong:

- **A failure in one routine never blocks the others.** Flag it, move on, run the rest of what's due.

- **Best-effort + flag:** if part of a refresh is uncertain (a time/channel can't be verified), do the honest version (mark "Stream" / drop the row) and note it in the report rather than aborting the whole run.

- **A failed/stopped run leaves `last-run` untouched** so it stays overdue and retries next wake (self-healing).

- **DM Michael ONLY for a recurring or large problem** — e.g. the same routine fails 2+ wakes running, a schema looks broken, or repo writes are failing. One-off soft misses go in the routine's report thread, not a DM.

## Rules for the ledger

- Ricky updates ONLY the `last-run` cell of a routine, and ONLY after that routine's run fully succeeds.

- `last-run` format: `YYYY-MM-DD HH:MM`. Use `never` if it has never successfully run.

- Changing a cadence/window: tell Ricky conversationally OR edit the cell here. Never reschedule by editing a runbook spec, never edit the agent.
