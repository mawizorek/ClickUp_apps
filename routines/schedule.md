# Routine Schedule — the WHEN (kept OUT of the runbook specs)

**Runbooks define the WHAT** (steps + target). **This file defines the WHEN.** They're deliberately separate so a cadence change never touches a spec file and never touches the agent. Retune by editing a row here, or just tell Ricky in plain language ("run F1 only Sat + Sun now") and he updates this file.

Ricky reads this on every wake and runs only the routines due right now.

| Routine file | Cadence | Window / notes |
|---|---|---|
| `on-track-refresh.md` | Every **Wednesday** | weekly motorsports TV refresh |
| `f1-refresh.md` | Every **Thu, Fri, Sat, Sun** | race-weekend days, higher care |
| `world-cup-refresh.md` | **Every 2 hours** | ONLY through **2026-07-19** (two-week window), then inactive |

## How Ricky reads this (all times America/New_York)

- **Day-of-week cadence** ("every Wednesday", "Thu–Sun"): run if today matches.
- **Interval cadence** ("every 2 hours"): run if it hasn't run within the last interval and now is inside the window.
- **Window limits** ("through DATE"): past the end date, treat the routine as inactive and skip.
- **Nothing due** → wake, check, do nothing, no report.

## Changing a cadence

Tell Ricky conversationally OR edit the row above. Never reschedule by editing a runbook spec, and never edit the agent. This file is the only home for timing.
