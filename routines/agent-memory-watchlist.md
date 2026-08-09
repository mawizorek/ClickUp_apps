# Agent Memory Watchlist

**Referenced by:** `routines/agent-memory-report.md`

Agents listed here are ALWAYS called out in the memory report regardless of their health tier. They get a dedicated section even if they're 🟢 CLEAR, because history says they drift, they're heavy workers, or their bundles need extra eyes.

**Edit this file freely.** Adding a slug here costs nothing; it just guarantees visibility in every report. Remove a slug when confidence in their rotation discipline is high.

---

## Watchlist

| Slug | Why |
|---|---|
| `mainstage-milo` | High-volume session activity, memory tends to bloat between rotations. |
| `dev-dexter` | Heavy builder with nested `memory/` archive dir. Codebase context grows fast. |
| `fmp-fiona` | Cross-domain knowledge (FileMaker + fleet facts) accumulates rapidly. Native flush was the reference implementation. |

---

## How the routine uses this

- After building the tiered report, scan this list.
- Any watchlist agent NOT already in 🔴 or 🟠 gets a dedicated "📌 WATCHLIST" callout with current sizes and last-rotation date (if detectable from archive file timestamps).
- Watchlist agents in 🔴 or 🟠 are annotated with `[WATCHLIST]` in their tier entry.

---

## Changelog

- 2026-08-09 — Created with initial watchlist: Milo, Dexter, Fiona.
