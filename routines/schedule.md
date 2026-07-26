# Routine Schedule — the WHEN

**Runbooks define the WHAT. This file defines the WHEN.** Timing never lives in a spec or in the agent. Retune by editing a `Cadence` cell here, or just tell Ricky in plain language ("run F1 only Sat + Sun now") and he edits the cell.

**The `last-run` ledger lives in per-routine files, NOT in this file** (see below). That split is deliberate: it's what makes concurrent stamping safe.

## 🚨 THERE IS NO SCHEDULER (LOCKED 2026-07-26, Michael)

**Nothing wakes up. No timer fires.** Routine Ricky is a git-teammate, and git-teammates have **no autonomous triggers** — they run only when a session invokes them. The native ClickUp Super Agent that used to hold the wake timer is being removed, so the wake-window model this file used to describe is **gone**. Do not restore it. Do not write a routine that assumes it.

What that changes, concretely:

- **Cadence is a STALENESS THRESHOLD, not a firing time.** It answers *"how old is too old?"* and it is evaluated the moment someone invokes — never on a clock.
- **Coverage depends on Michael invoking.** A routine is only as current as the last invocation. That is a real, accepted limitation, not a bug to route around, and **triage must never imply otherwise.**
- **Every invocation is potentially a catch-up.** Under a timer a missed occurrence was the exception; with no timer it is the normal case. See Catch-up below.
- **Silence is no longer an acceptable outcome.** A background agent that found nothing due should stay quiet. An **invoked** agent that found nothing due must SAY SO. "All current, nothing due, next up X" is a complete and good answer; saying nothing is a bug.
- **`last-run` stamps matter MORE now, not less.** They were a double-run guard under a timer. They are now the **only** input to the due-math. An unstamped run is invisible.

## Routines

| Routine file | Cadence | Window / notes | last-run file |
|------------------------|-------------------------------------------|--------------------------------------------|------------------------------------|
| `on-track-refresh.md`  | Every **Wednesday**                       | weekly motorsports TV refresh              | `routines/last-run/on-track.txt`   |
| `f1-refresh.md`        | **Thu–Sun, session-aware** (see note)     | eligible on EVERY invocation on race-weekend days; refreshes only when a session has finished since last-run | `routines/last-run/f1.txt` |
| `world-cup-refresh.md` | **inactive**                              | 🏁 RETIRED 2026-07-26 · ran through **2026-07-19**, tournament over | `routines/last-run/world-cup.txt`  |

> ⚠️ **VIEWER CONTRACT — do not rephrase these cells casually.** `routines/index.html` parses this table live. It finds the table by the header cell `Routine file`, needs **exactly these four columns in this order**, derives the day-strip by regexing **day names out of the `Cadence` cell**, and decides a routine is retired by matching **`through YYYY-MM-DD`** in the `Window / notes` cell. That is why the World Cup row still says *"ran through 2026-07-19"* rather than a cleaner sentence: drop the phrase and the viewer silently un-retires the card. Express state in the cell text; never add a column, a second table, or a table above this one.

### 🏁 World Cup stand-down (2026-07-26)

The 2026 World Cup Final was **Sun Jul 19, 2026**. The routine is retired, seven days late — its own runbook wrote the stand-down instruction ("the routine's row should be retired from `routines/schedule.md`") and there was no longer anything waking up to execute it.

- The **row stays** and is marked `inactive` rather than deleted. A retired routine is the cheapest available template for the next tournament, and the record of what ran is worth more than the tidiness of a short table.
- **`routines/last-run/world-cup.txt` is frozen** as the historical final stamp. Do not clear it.
- **The bracket app stays LIVE.** A finished tournament is still a thing you look at. Nothing in `world-cup-bracket/` was touched, and retiring the routine must never be read as retiring the app.

### F1 cadence note (session-aware, not once-a-day)

F1 used to run once per race-weekend day, which lagged: a race that finished in the morning wouldn't post until the next day. F1 is now **eligible at every invocation Thu–Sun**, and the runbook decides whether there is actually work: if an F1 session (Practice/Qualifying/Sprint/Race) has FINISHED since `last-run/f1.txt`, refresh with that result. If no new session has finished, it is a clean no-op — no rewrite, no stamp.

**This design survived the scheduler's death completely intact, and the reason is worth copying:** it already handed the *"is there new data?"* decision to the RUNBOOK instead of to a wake timer. Removing the timer changed nothing about it. Build future cadences the same way — the less a routine knows about clocks, the longer it lives.

## The last-run ledger (per-routine files — READ THIS)

Each routine's last-run timestamp lives in its OWN tiny file under `routines/last-run/` (one line, `YYYY-MM-DD HH:MM` ET, or `never`). Read the relevant file to decide if a routine is due, and after a successful run write ONLY that routine's own file.

**Why per-file, not a shared file (LOCKED 2026-07-05, RE-AFFIRMED 2026-07-26):** when several routines stamp close together, each stamp used to rewrite one shared file. A later stamp built from a stale snapshot reverts a sibling's stamp — the classic shared-file race. Real incident: on 2026-07-05 World Cup refreshed + stamped at 03:08, then F1's 06:07 stamp rewrote the shared file off a pre-03:08 snapshot and reverted World Cup to `never`, which skipped World Cup on the next pass and double-ran F1. Per-routine files give each routine a private write target. **One writer per file, always.**

> ⚠️ **Re-affirmed the hard way, same month.** On 2026-07-26 a shared `brain-config/data-refresh-log.json` was created holding every routine's row in a single file — precisely the shape this rule forbids, and it shipped with an explicit "any agent may stamp it" invitation that made the race *likelier*. It was deleted the same day, never used. Two lessons, both general: **(1) losing the wake timer does NOT make a shared stamp file safe** — concurrent SESSIONS collide exactly as happily as concurrent wakes did, and the fleet has already proven that on the session board. **(2) The rule was findable and wasn't found.** It was searched for in `brain-config/` only, and the silence there was read as proof nothing existed. If you are about to build state for routines, the answer lives in `routines/`.

## How to decide what to run (all times America/New_York)

On invocation, for every ACTIVE routine, read its `last-run` file and compare against its `Cadence`:

- **Day-of-week cadence** ("every Wednesday"): due once per matching day. Due if last-run is older than the most recent occurrence of that day. After success, write now.
- **Session-aware cadence** (F1, "Thu–Sun"): eligible on those days; the runbook checks whether a session has finished since last-run and refreshes only if so (else clean no-op). Stamp only on an actual refresh.
- **`never`** means NEVER RUN. Report it as exactly that — never as a huge overdue interval. Rendering an unset stamp as arithmetic is lying with numbers, and it is what a confident cold agent does.
- **Idempotency (double-run guard):** a routine whose last-run already covers the current occurrence/session is done — skip it, however many times you are invoked.
- **Catch-up — now the DEFAULT path, not an edge case.** With no timer, occurrences pass unattended by design. If a due occurrence has passed and last-run is older, it is overdue: run the **latest missed occurrence once** and label it a catch-up. **Never replay every missed day.** A routine overdue by three weeks gets ONE run, flagged as such.
- **`inactive` routines are never proposed.** Not due, not overdue, not a gap — say nothing about them unless asked directly.
- **Nothing due → say so and stop.** *(Changed 2026-07-26. The old rule read "wake, check, do nothing, no report" — correct for a background sweep, wrong for an invoked one.)*

## Error posture

- **A failure in one routine never blocks the others.** Flag it, move on, run the rest of what is due.
- **Best-effort + flag** per the Data-Refresh Discipline in `routines/README.md` (mark `Stream`/`Unknown`, keep the prior value) rather than aborting the whole run.
- **A failed/stopped run leaves that routine's last-run file untouched** so it stays overdue and retries on the next invocation. Self-healing.
- **Report failures in the reply, not by DM.** *(Changed 2026-07-26. The old rule — "DM Michael only for a recurring or large problem" — assumed a background agent talking to an absent human. Invocation means he is right there; tell him in the answer.)*

## Rules for the ledger

- Write ONLY the single `last-run/<routine>.txt` file for the routine that just succeeded — never a shared file, never another routine's file.
- Format: one line, `YYYY-MM-DD HH:MM` ET. Use `never` if it has never successfully run.
- Changing a cadence/window: edit the `Cadence` cell above (or tell Ricky). Never reschedule by editing a runbook spec, and never by editing the agent.
- Retiring a routine: mark the row `inactive`, keep a `through YYYY-MM-DD` phrase in the notes (viewer contract), and add a dated reason. **Do not delete the row and do not delete the runbook.**

## 🚨 Known viewer breakage — OPEN, not mine to fix (found 2026-07-26)

`routines/index.html` is app source, so it is a BUILD task (Dexter), not a routine edit. Two live defects, both verified by reading the parser:

1. **The "Current wake window" card is now a lie.** `renderWindow()` does not read this file at all — it hardcodes the wake schedule and prints *"Ricky wakes once daily at 06:00 ET."* **Nothing wakes.** This is the most visible surface in the app and it states the one thing that is no longer true. It also disagreed with this file *before* today (card said 06:00/15:00/21:00/03:00; this file said 06:00/12:00/16:00/00:00), so it has been drifting for a while. The card should be replaced with an invoke-only statement, and the section heading "Scheduled routines" should lose the word Scheduled.
2. **Every routine has displayed "Last run: never" since 2026-07-05.** `parseLastRun()` expects a TIMESTAMP in column 4, but column 4 became a FILE PATH the day stamps moved per-routine. It parses `routines/last-run/on-track.txt` as a date, gets `NaN`, and renders `never`. **Three weeks of a silently wrong core field**, in the app whose entire job is showing last-run. The fix is small: if the cell looks like a path, fetch it from the raw base and use its contents.

Both are quietly self-inflicted by doc changes that were correct in isolation. **A schedule doc and its renderer are one system; changing the doc's shape is a change to the app.**
