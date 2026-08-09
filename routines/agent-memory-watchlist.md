# Agent Memory Watchlist

**Referenced by:** `routines/agent-memory-report.md` (step 3).
**Purpose:** Agents listed here are always called out in the memory health report with a 📌 marker, regardless of what tier they land in. Use this for agents that are known to grow fast, have complex memory, or are early in their lifecycle and need extra visibility.

**Edit this file freely** — adding or removing an agent here changes report behavior without touching the runbook.

## Watched agents

| Slug | Why |
|---|---|
| `mainstage-milo` | Large session volume, complex production context, memory growth historically outpaces rotation |
| `dev-dexter` | Heavy build sessions generate dense memory candidates; has a `memory/` archive subdir that needs monitoring |
| `fmp-fiona` | FileMaker domain context is dense and domain-specific; native-flush intake added 2026-08-01, drain cadence unproven |

## How to add an agent

Add a row to the table above. The `Slug` must match the agent's folder name under `brain-config/super-agents/`. The `Why` column is for humans and for Maggie's prioritization context — keep it to one line.

## How to remove an agent

Delete the row. An agent removed from the watchlist still gets measured in every report — it just stops getting the 📌 callout and stops appearing in the WATCHLIST CALLOUTS section unless it independently lands in 🟠 or 🔴.
