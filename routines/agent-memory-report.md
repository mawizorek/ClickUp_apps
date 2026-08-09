# Agent Memory Report

goal:       Produce a fleet-wide memory health diagnostic that tells Maggie exactly which agents need rotation, draining, or manual review, and in what priority order.
target:     Standing ClickUp comment thread (task: 🧭 STANDING · Agent Memory Report) · always plus `routines/last-run/agent-memory-report.txt`
report-to:  DETAIL → standing task thread · ROLL-UP → 🧭 STANDING · Routine Ricky — Run Reports · https://app.clickup.com/t/86ajuhw1d

---

## References (read before running)

- **Measurement logic:** `brain-config/super-agents/_shared/bundle-measurement-spec.md` — defines what to measure, thresholds, and structural signals.
- **Watchlist:** `routines/agent-memory-watchlist.md` — agents that get called out every run regardless of tier.
- **Budget source of truth:** `brain-config/hooks/memory-rotation.md` — the 10KB/5KB targets and the tiered architecture.

---

## Steps

1. **Read the current state.** `routines/last-run/agent-memory-report.txt` for prior run date.

2. **Get the active agent list from ClickUp.** Query the 🤖 Agent Index list (list ID `901328043244`). Every row with Status = active is an agent to audit. Use the `Slug` field to locate their git bundle at `brain-config/super-agents/<slug>/`.

3. **For each agent, run the Bundle Measurement Spec.** Read the directory listing of `brain-config/super-agents/<slug>/` (use the `size` field from directory listings, do NOT fetch file bodies). Record all metrics defined in `_shared/bundle-measurement-spec.md`.

4. **Classify each agent into tiers** per the threshold bands in the measurement spec (🔴 CRITICAL / 🟠 ACTION / 🟡 WATCH / 🟢 CLEAR).

5. **Apply the watchlist.** Read `routines/agent-memory-watchlist.md`. Any watchlist agent not already in 🔴 or 🟠 gets a dedicated 📌 WATCHLIST callout. Watchlist agents in 🔴/🟠 are annotated `[WATCHLIST]`.

6. **Build the report** in the format below. Sort by tier (🔴 first), then by largest overage within tier.

7. **Post the report** as a comment on the standing task thread. One comment per run, dated.

8. **STAMP** — `routines/last-run/agent-memory-report.txt`, one line, `YYYY-MM-DD HH:MM` ET, only after the report posted.

9. **REPORT** — one-line roll-up on the standing Run Reports thread.

---

## Guardrails (STOP + flag if any is true)

- This routine is **READ-ONLY**. It never edits, rotates, or drains any agent file. Maggie does that.
- If the Agent Index list cannot be queried → STOP. The roster surface is gone.
- If a bundle directory cannot be listed → mark that agent as `UNREADABLE` and continue. Never skip silently.
- Never recommend specific content to cut. The report says WHO and HOW BIG, not WHAT TO DELETE.
- Never stamp before the report comment is posted.
- Never create, modify, or delete any file outside `routines/last-run/agent-memory-report.txt`.

---

## Report format

```
═══ AGENT MEMORY HEALTH REPORT · <YYYY-MM-DD> ═══

FLEET SUMMARY: <N> agents audited · <N> 🔴 · <N> 🟠 · <N> 🟡 · <N> 🟢

🔴 CRITICAL (blocks session open)
  <slug> · memory.md <size>KB · activity-log.md <size>KB

🟠 ACTION (rotation needed)
  <slug> · memory.md <size>KB · [notes: no archive dir / never rotated / etc.]

🟡 WATCH
  <slug> · memory.md <size>KB · [native-flush LOADED / near cap / etc.]

📌 WATCHLIST (always reported)
  <slug> · memory.md <size>KB · activity-log.md <size>KB · [status note]

🟢 CLEAR (<N> agents)
  <comma-separated slugs>

RECOMMENDED MAGGIE SESSION ORDER: <ranked list of 🔴 then 🟠 then watchlist agents>
```

---

## Changelog

- 2026-08-09 — Created. Fleet-wide memory health diagnostic, wired into Ricky's routines path. Measurement logic extracted to `_shared/bundle-measurement-spec.md`, watchlist extracted to `routines/agent-memory-watchlist.md`.
