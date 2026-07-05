# Routines — Agent-Agnostic Runbook Standard

**The core idea: separate the WHAT from the WHO from the WHEN.** A routine is a repeatable job whose *procedure* lives as a runbook file here. Any agent could execute it by reading the file and following it literally. **Routine Ricky** is simply the agent we put on the clock. The *schedule* lives in `schedule.md`, never in the runbook. Change a procedure = edit the runbook. Change a cadence = edit `schedule.md` (or just tell Ricky). Change the executor = swap the agent. Three concerns, three homes, none entangled.

## The contract

- **Runbooks are the source of truth for the procedure** (the WHAT). Ricky reads, follows, reports. No improvising, no re-scoping, no “flavoring,” no relearning.
- **Schedules live in `schedule.md`** (the WHEN), not in runbook specs. This is what lets you retune cadence loosely without editing a spec or the agent.
- **DATA FILES ONLY.** A routine may only write data files (e.g. `data.json`). It must NEVER edit engine/source (`index.html`, JS, CSS, README) or app structure. If a routine seems to need an engine change, that is a signal for a real build session — STOP and flag, never do it inside a routine.
- **Auto-commit is allowed because scope is data-only.** Data refreshes are low-blast-radius and self-correcting (next refresh overwrites). This safety only holds while the data-only rail holds.
- **Fail loud, never guess.** Unclear runbook, unverifiable data, failed step, or a non-data target: STOP and report. A missed refresh is fine; a wrong silent commit is not.

## Runbook shape (every routine file uses this exact structure)

Rigid on purpose. No `schedule` line — timing is external.

```
# <Routine Name>

goal:       <one sentence, what a successful run produces>
target:     <exact repo path(s) this writes — MUST be a data file>
report-to:  <ClickUp channel/thread for the run report>

## Steps
1. <literal, ordered, unambiguous step>
2. ...

## Guardrails (STOP + flag if any is true)
- Target is not a data file.
- A required value can't be verified.
- <routine-specific tripwires>

## Report format
<what the run report must contain: commit link, live URL, counts, anomalies>
```

## Risk tiers (locked)

- **Data-only refresh** → auto-commit to `main`. (All current routines.)
- **Anything touching engine/source** → NOT a routine. Route to a build session (human + Brain, or a PR). Ricky never does this.

## Adding a routine

1. Drop a new runbook file in `routines/` using the shape above (procedure only).
2. Add one row to `schedule.md` for its cadence.
Zero agent changes. If adding a routine requires editing Ricky, the framework is wrong; fix the framework, not the agent.

## Current routines

| Routine | Target (data-only) | Cadence (see schedule.md) |
|---------|--------------------|---------------------------|
| `on-track-refresh.md` | `on-track/data.json` | every Wednesday |
| `f1-refresh.md` | `f1-racetracks/data.json` | Thu–Sun |
| `world-cup-refresh.md` | `world-cup-bracket/data.json` | every 2h, through 2026-07-19 |

## Executor

**Routine Ricky** — `brain-config/agents/routine-ricky.md`. Deliberately minimal: scheduled hands, not a brain. His reliability is the product.
