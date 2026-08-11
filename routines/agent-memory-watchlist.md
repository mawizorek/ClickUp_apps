# Agent Memory Watchlist

**Referenced by:** `routines/agent-memory-report.md` (step 3).
**Purpose:** Agents listed here are always called out in the memory health report with a 📌 marker, regardless of what tier they land in. Use this for agents that are known to grow fast, have complex memory, or are early in their lifecycle and need extra visibility.

**Edit this file freely** — adding or removing an agent here changes report behavior without touching the runbook.

🚨 **THE SLUG IS THE FOLDER NAME, NOT THE DISPLAY NAME — and this file has already been burned by it once.** A display name can be changed; a slug is immutable. When they disagree, the folder wins. **Resolve every row against the 🤖 Agent Index list (`901328043244`) before adding it**, and put the human-facing name in the `Why` column where it belongs. ⚠️ **A row whose slug does not resolve fails SILENTLY** — the report finds no folder and either skips the agent or reports it as absent. That is worse than having no row at all, because the callout it promises never fires and nobody notices it stopped.

## Watched agents

| Slug | Why |
|---|---|
| `mainstage-milo` | Mainstage Milo. Large session volume, complex production context, memory growth historically outpaces rotation. **Confirmed 2026-08-10:** the only agent in the fleet with BOTH archive dirs, and still hit 🔴 at the read ceiling — for him rotation fires and does not keep up, which is a different problem from never having been cut. |
| `dev-dexter` | Dev Dexter. Heavy build sessions generate dense memory candidates; has a `memory/` archive subdir that needs monitoring. |
| `fmp-frank` | **FMP Fiona** — slug is `fmp-frank` and is immutable; the display name changed and the slug did not. FileMaker domain context is dense and domain-specific; native-flush intake added 2026-08-01, drain cadence unproven. ⚠️ <s>`fmp-fiona`</s> — this row carried that non-resolving slug from creation until 2026-08-10, when the first report run caught it. Kept struck because the display name is the intuitive guess and someone will re-make it. |

## How to add an agent

Add a row to the table above. The `Slug` must match the agent's folder name under `brain-config/super-agents/` — **verify it against the Agent Index, never type it from the name you know the agent by.** The `Why` column is for humans and for Maggie's prioritization context; lead it with the display name so the row is findable by either token, then keep the reason to a line or two.

## How to remove an agent

Delete the row. An agent removed from the watchlist still gets measured in every report — it just stops getting the 📌 callout and stops appearing in the WATCHLIST CALLOUTS section unless it independently lands in 🟠 or 🔴.
