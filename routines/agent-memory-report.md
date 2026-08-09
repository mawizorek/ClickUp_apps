# Agent Memory Report

goal:       Produce a fleet-wide memory health diagnostic that tells Maggie exactly which agents need rotation, draining, or manual review — and in what priority order.
target:     Standing ClickUp comment thread (🧭 STANDING · Agent Memory Report task) · always plus routines/last-run/agent-memory-report.txt
report-to:  DETAIL → standing task thread · ROLL-UP → 🧭 STANDING · Routine Ricky — Run Reports · https://app.clickup.com/t/86ajuhw1d

## Companion references (never restated here)

- **Measurement logic:** `brain-config/super-agents/_shared/bundle-measurement-spec.md`
- **Watchlist (always-flag agents):** `routines/agent-memory-watchlist.md`
- **Budget definitions:** `hooks/memory-rotation.md` (10KB memory hot cap, 5KB activity-log cap, 22KB read ceiling)
- **Agent directory:** 🤖 Agent Index ClickUp list (list id `901328043244`) — the canonical roster of active agents. Query for Class = `super-agent` to get the bundle-holding set.

## Steps

1. **Read the current state.** `routines/last-run/agent-memory-report.txt` for prior run date.

2. **Get the active agent list.** Query the 🤖 Agent Index ClickUp list for all agents where Class = `super-agent` and Status is active. Each represents a bundle at `brain-config/super-agents/<slug>/`.

3. **Load the watchlist.** Read `routines/agent-memory-watchlist.md`. These agents get called out in the report regardless of tier.

4. **For each agent, run the measurement spec.** Follow `brain-config/super-agents/_shared/bundle-measurement-spec.md` against that agent's bundle folder. Record all measurements.

5. **Classify each agent into priority tiers** per the thresholds in the measurement spec:
   - 🔴 **CRITICAL**: any file over the hard read ceiling (~22KB) — blocks next session open
   - 🟠 **ACTION**: over the target budget (10KB memory / 5KB activity) — rotation needed
   - 🟡 **WATCH**: near cap (>70% of budget) OR has a loaded native-flush pending drain OR is on the watchlist
   - 🟢 **CLEAR**: under budget, archives exist or unnecessary, no pending flush

6. **Build the report.** Format below. Sort by tier (🔴 first), then by largest overage within tier. Watchlist agents appear with a 📌 marker in whatever tier they land in.

7. **Post the report** as a comment on the standing task thread. One comment per run, dated.

8. **STAMP** — `routines/last-run/agent-memory-report.txt`, one line, `YYYY-MM-DD HH:MM` ET, only after the report posted.

9. **REPORT** — one-line roll-up on the standing Run Reports thread.

## Guardrails (STOP + flag if any is true)

- This routine is **READ-ONLY**. It never edits, rotates, or drains any agent file. Maggie does that.
- If the Agent Index list cannot be queried → STOP. The audit surface is gone.
- If a bundle folder does not exist for an active agent → mark that agent as "NO BUNDLE" and continue. Never skip silently.
- If a file cannot be read (permissions, missing, truncated) → mark that agent as "UNREADABLE: <file>" and continue.
- Never recommend specific content to cut. The report says WHO and HOW BIG, not WHAT TO DELETE. That is Maggie's judgment.
- Never stamp before the report comment is posted.
- Never skip a step because the read feels repetitive. Discipline rule 13.

## Report format

```
═══ AGENT MEMORY HEALTH REPORT · <YYYY-MM-DD> ═══

FLEET SUMMARY: <N> agents audited · <N> 🔴 · <N> 🟠 · <N> 🟡 · <N> 🟢

🔴 CRITICAL (blocks session open)
  <slug> · memory.md <size>KB · activity-log.md <size>KB · <note>

🟠 ACTION (rotation needed)
  <slug> · memory.md <size>KB · activity-log.md <size>KB · <signals>

🟡 WATCH
  <slug> · <reason: near cap / native-flush loaded / watchlist>

🟢 CLEAR (<N> agents)
  <comma-separated slugs>

📌 WATCHLIST CALLOUTS
  <slug> — <current tier> — <why they're watched per watchlist.md>

RECOMMENDED MAGGIE SESSION ORDER:
  1. <slug> — <reason>
  2. <slug> — <reason>
  ...
```

---

## After creation checklist (done in the PR that ships this file)

- [x] Row added to `routines/schedule.md`
- [x] `routines/last-run/agent-memory-report.txt` created with `never`
- [ ] Standing ClickUp task created (🧭 STANDING · Agent Memory Report)
- [x] `routines/agent-memory-watchlist.md` created
- [x] `brain-config/super-agents/_shared/bundle-measurement-spec.md` created
