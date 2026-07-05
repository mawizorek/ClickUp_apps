# Routines — Agent-Agnostic Runbook Standard

**The core idea: separate the WHAT from the WHO.** A routine is a scheduled, repeatable job defined entirely as a runbook file in this folder. Any agent could execute it by reading the file and following it literally. **Routine Ricky** is simply the agent we put on the clock as the executor — he owns nothing about the procedure, he just runs it. Change a procedure = edit the runbook here, never the agent.

## The contract

- **Runbooks are the source of truth for the procedure.** Ricky (or any agent) reads, follows, reports. No improvising, no re-scoping, no “flavoring,” no relearning.
- **DATA FILES ONLY.** A routine may only write data files (e.g. `data.json`). It must NEVER edit engine/source (`index.html`, JS, CSS, README) or app structure. If a routine seems to need an engine change, that is a signal for a real build session — STOP and flag, never do it inside a routine.
- **Auto-commit is allowed because scope is data-only.** Data refreshes are low-blast-radius and self-correcting (next refresh overwrites). This safety only holds while the data-only rail holds.
- **Fail loud, never guess.** If the runbook is unclear, a step fails, a source can’t be verified, or the target isn’t a data file: STOP and report. A missed refresh is fine; a wrong silent commit is not.

## Runbook shape (every routine file uses this exact structure)

Rigid on purpose. If two runbooks don’t look structurally identical, the executor has to think to bridge the gap — which is the thing we’re eliminating.

```
# <Routine Name>

schedule:   <cron, in America/New_York>
goal:       <one sentence, what a successful run produces>
target:     <exact repo path(s) this writes — MUST be a data file>
report-to:  <ClickUp channel/thread for the run report>

## Steps
1. <literal, ordered, unambiguous step>
2. ...

## Guardrails (STOP + flag if any is true)
- Target is not a data file.
- A required time/channel can't be verified.
- <routine-specific tripwires>

## Report format
<what the run report must contain: commit link, live URL, counts, anomalies>
```

## Risk tiers (locked)

- **Data-only refresh** → auto-commit to `main`. (All current routines.)
- **Anything touching engine/source** → NOT a routine. Route to a build session (human + Brain, or a PR). Ricky never does this.

## Adding a routine

Drop a new file in `routines/` using the shape above. Zero agent changes — Ricky picks it up because he sweeps this folder. If adding a routine requires editing Ricky, the framework is wrong; fix the framework, not the agent.

## Current routines

| Routine | Target (data-only) | Schedule |
|---------|--------------------|----------|
| `on-track-refresh.md` | `on-track/data.json` | Thu 09:00 ET, weekly |
| `f1-refresh.md` | `f1-racetracks/data.json` | Mon 10:00 ET, weekly |
| `world-cup-refresh.md` | `world-cup-bracket/data.json` | Mon 10:00 ET, weekly (tournament window) |

## Executor

**Routine Ricky** — `brain-config/agents/routine-ricky.md`. Deliberately minimal: scheduled hands, not a brain. His reliability is the product.
