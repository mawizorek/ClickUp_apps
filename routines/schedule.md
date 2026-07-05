# Routine Schedule — the WHEN

**Runbooks define the WHAT. This file defines the WHEN.** Timing never lives in a spec or in the agent. Retune by editing a `Cadence` cell here, or just tell Ricky in plain language ("run F1 only Sat + Sun now") and he edits the cell.

**The `last-run` ledger lives in per-routine files, NOT in this file** (see below). That split is deliberate: it's what makes concurrent stamping safe.

## Routines

| Routine file | Cadence | Window / notes | last-run file |
|------------------------|------------------------------|--------------------------------------------|------------------------------------|
| `on-track-refresh.md`  | Every **Wednesday**          | weekly motorsports TV refresh              | `routines/last-run/on-track.txt`   |
| `f1-refresh.md`        | Every **Thu, Fri, Sat, Sun** | race-weekend days                          | `routines/last-run/f1.txt`         |
| `world-cup-refresh.md` | **~3x/day**                  | ONLY through **2026-07-19**, then inactive | `routines/last-run/world-cup.txt`  |

## The last-run ledger (per-routine files — READ THIS)

Each routine's last-run timestamp lives in its OWN tiny file under `routines/last-run/` (one line, `YYYY-MM-DD HH:MM` ET, or `never`). Ricky reads the relevant file to decide if a routine is due, and after a successful run writes ONLY that routine's own file.

**Why per-file, not a column in this doc (LOCKED 2026-07-05):** when multiple routines run in the same wake, each stamp used to rewrite this whole shared file. A later stamp built from a stale snapshot would revert a sibling's stamp — the classic shared-file race. Real incident: on 2026-07-05, World Cup refreshed + stamped at 03:08, then F1's 06:07 stamp rewrote the shared file off a pre-03:08 snapshot and reverted World Cup to `never`, which then skipped World Cup at the next wake and double-ran F1. Per-routine files give each routine a private write target, so stamps can never collide. One writer per file, always.

## Wake windows (agent timer, America/New_York)

- **Now through 2026-07-19 (World Cup window):** Ricky fires **3 times a day — 06:00, 15:00, 21:00**. Back-loaded on purpose: matches resolve afternoon/evening ET, so the wakes are the morning-after sweep (06:00, catches everything from the night before), midday (15:00), and post-evening-matches (21:00). The old 03:00 wake was dropped 2026-07-05 as functionally identical to 06:00 — nothing resolves between 03:00 and 06:00, so both caught the same set.
- **After 2026-07-19:** relax to **once daily at 06:00** — covers On Track (Wed) and F1 (Thu–Sun) via day-cadence + catch-up. Retune the agent timer down when the window closes.

## How Ricky decides what to run (all times America/New_York)

On each wake, for every routine, read its `last-run` file and compare against its `Cadence`:

- **Day-of-week cadence** ("every Wednesday", "Thu–Sun"): due once per matching day. Run only if the last-run file is not already today AND today matches. After success, write today + time to that routine's file.
- **Interval / multi-wake cadence** ("~3x/day"): run if now is in-window and this wake-slot hasn't been run yet (last-run older than this slot). After success, write now.
- **Idempotency (double-run guard):** a routine whose last-run is already in the current period is done — skip it, even on many wakes.
- **Catch-up (missed-run guard):** if a due occurrence has passed and last-run is still older, it's overdue — run the latest missed occurrence once and flag it as catch-up. Don't replay every missed day.
- **Nothing due / already current** → wake, check, do nothing, no report.

## Error posture (background-quiet)

- **A failure in one routine never blocks the others.** Flag it, move on, run the rest of what's due.
- **Best-effort + flag** per the runbook's Data-Refresh Discipline (mark `Stream`/`Unknown`, keep prior value) rather than aborting the whole run.
- **A failed/stopped run leaves that routine's last-run file untouched** so it stays overdue and retries next wake (self-healing).
- **DM Michael ONLY for a recurring or large problem** — same routine fails 2+ wakes running, schema looks broken, or repo writes failing. One-off soft misses go in the report thread, not a DM.

## Rules for the ledger

- Ricky writes ONLY the single `last-run/<routine>.txt` file for the routine that just succeeded — never a shared file, never another routine's file.
- Format: one line, `YYYY-MM-DD HH:MM` ET. Use `never` if it has never successfully run.
- Changing a cadence/window: edit the `Cadence` cell above (or tell Ricky). Never reschedule by editing a runbook spec, never edit the agent.
