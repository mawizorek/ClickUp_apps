# Routines — Agent-Agnostic Runbook Standard

**The core idea: separate the WHAT from the WHO from the WHEN.** A routine is a repeatable job whose *procedure* lives as a runbook file here. Any agent could execute it by reading the file and following it literally. **Routine Ricky** is simply the agent we put on the clock. The *schedule* lives in `schedule.md`, never in the runbook. Change a procedure = edit the runbook. Change a cadence = edit `schedule.md` (or just tell Ricky). Change the executor = swap the agent. Three concerns, three homes, none entangled.

## The contract

- **Runbooks are the source of truth for the procedure** (the WHAT), and must be SELF-SUFFICIENT — any agent reads the runbook and knows exactly what to do, without inheriting behavior from a specific executor. Never put procedure in the agent; if it describes what/how the work is done, it lives here.
- **Schedules live in `schedule.md`** (the WHEN), not in runbook specs.
- **DATA FILES ONLY.** A routine may only write data files (e.g. `data.json`). NEVER engine/source (`index.html`, JS, CSS, README) or structure. If a routine seems to need an engine change, that's a build session — STOP and flag, never do it inside a routine.
- **Auto-commit is allowed because scope is data-only** and self-correcting. This safety only holds while the data-only rail holds.
- **Fail loud, never guess.** Unclear runbook, unverifiable data, failed step, or a non-data target: STOP and report.

## Data-Refresh Discipline (UNIVERSAL — applies to every refresh routine)

This is process, not executor behavior — it lives here so ANY agent running ANY refresh routine does the right thing. A “refresh” is a **verify-and-merge**, never a blank-slate rebuild:

1. **Read the current data file first.** It is the baseline you extend and correct, not something you overwrite from scratch.
2. **Verify existing entries, don't just trust them.** Double/triple-check that each existing event's time, channel, and status are still accurate — times shift, sessions get added to a weekend, events get canceled or rain-delayed. The primary job is keeping what's there ACCURATE, second is scraping in new entries that belong.
3. **Merge, don't replace.** Add newly-found entries, correct changed ones, drop only what has truly aged out of the window.
4. **Never shrink coverage silently.** A category/series represented last run must not vanish this run. If you can't find its data, KEEP the prior entries and flag the gap in the report — deleting coverage is a STOP-and-flag event, not a quiet outcome.
5. **Notable changes are worth surfacing.** If an event materially shifted (rain delay, moved session, cancellation), note it in the run report. Rendering a “was X → now Y” callout in the UI requires an engine field + render support → that is a BUILD task, out of routine scope; flag it, don't attempt it in a data refresh. (Expected to be rare.)

Runbooks may add domain specifics on top of this, but this discipline is the floor for all of them.

## Runbook shape (every routine file uses this exact structure)

```
# <Routine Name>

goal:       <one sentence, what a successful run produces>
target:     <exact repo path(s) this writes — MUST be a data file>
report-to:  <where the run report goes>

## Steps
1. <literal, ordered, unambiguous step>
2. ...

## Guardrails (STOP + flag if any is true)
- Target is not a data file.
- A required value can't be verified.
- Coverage would shrink vs the current file.
- <routine-specific tripwires>

## Report format
<commit link, live URL, count previous → new, categories covered, anomalies, Files touched>
```

## Risk tiers (locked)

- **Data-only refresh** → auto-commit to `main`. (All current routines.)
- **Anything touching engine/source** → NOT a routine. Route to a build session.

## Adding a routine

1. Drop a new runbook file in `routines/` using the shape above (procedure only).
2. Add one row to `schedule.md` for its cadence.
Zero agent changes. If adding a routine requires editing the executor, the framework is wrong; fix the framework.

## Current routines

| Routine | Target (data-only) | Cadence (see schedule.md) |
|---------|--------------------|---------------------------|
| `on-track-refresh.md` | `on-track/data.json` | every Wednesday |
| `f1-refresh.md` | `f1-racetracks/data.json` | Thu–Sun |
| `world-cup-refresh.md` | `world-cup-bracket/data.json` | every 2h, through 2026-07-19 |

## Executor

**Routine Ricky** — `brain-config/agents/routine-ricky.md`. Deliberately minimal: scheduled hands, not a brain. He holds executor mechanics only (when to wake, idempotency, commit+stamp, report, fail-loud). All refresh *procedure* lives in this folder, not in him.
