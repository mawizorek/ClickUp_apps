# native-flush.md — FMP Fiona (slug: fmp-frank)

**This file is the single flush intake ("native-flush") for this agent.** It is the ONLY place this agent's native runtime writes a memory dump, and it is filled ONLY when Michael says "dump your memory." Nothing else writes here. It is the reference implementation of the per-agent flush pattern the fleet copies.

## What this file is

A write-ahead delta between memory consolidations. Its emptiness is the signal:

- **Empty** — this agent's canonical git memory (`memory.md`) is current. A cold start reads `memory.md` alone.
- **Non-empty** — there is a memory delta Maggie has not yet folded into `memory.md`. A cold start must read `memory.md` AND then this file, treating the content here as the freshest truth until the next consolidation.

## The flow (per-agent, manual)

1. Michael tells the agent "dump your memory."
2. The agent appends its live memory **verbatim** in the dump zone below — newest dump on top, timestamped. No normalizing, no triage; that is the curator's job.
3. Michael triggers a separate Memory Maggie run.
4. Maggie consolidates this file into `memory.md` per `brain-config/hooks/native-flush-consolidation.md`, then clears this file back to bare.
5. The native runtime's own memory then collapses to a pointer: "canonical brain = `memory.md`; check `native-flush.md` — empty = current, full = unmerged delta." Live working memory is only collapsed AT or AFTER a dump, never mid-session, or the dump destroys the thing it was meant to capture.

## Dump zone (newest on top)

_(bare — canonical memory is current)_
