# Agent Memory Report

goal:       Produce a fleet-wide memory health diagnostic that tells Maggie exactly which agents need rotation, draining, or manual review — and in what priority order.
target:     Standing ClickUp comment thread (🧭 STANDING · Agent Memory Report task) · always plus routines/last-run/agent-memory-report.txt
report-to:  DETAIL → standing task thread · ROLL-UP → 🧭 STANDING · Routine Ricky — Run Reports · https://app.clickup.com/t/86ajuhw1d

## 🔴 THE STANDING TASK IS `86ajy5acn`. REOPEN IT. NEVER CUT A NEW ONE.

**Canonical detail surface: task `86ajy5acn`** in 🟢 Agent Activity Board (subtask of `📦 P6 · Fleet, agents + AgentGlass`). It is a STANDING thread — a resting state, never a terminal one. Closed or done still means reopen.

⚠️ **This is written as an ID rather than a name because the name was not enough.** The task shipped 2026-08-09 as a DUPLICATE PAIR — `86ajy5acn` and `86ajy5a9r`, identical titles, same minute, same PR (#779) — on a thread whose own title reads *"reopen, don't recreate."* Both were still empty when the first run found them on 2026-08-10, so nothing was lost and no history had to be chosen between; the duplicate was merged into `86ajy5acn` the same day. **The next occurrence would not have been free**, because by then one of the two would have held real reports. **A name can be recreated by accident. An ID cannot be typed twice without noticing.**

⚠️ **The likely cause is one line down in this very file:** the after-creation checklist below carried `[ ] Standing ClickUp task created` UNCHECKED while two of them existed. **An unchecked box is an instruction to create the thing.** Close checklist boxes in the same pass as the work, or the checklist becomes a trap for the next reader.

## Companion references (never restated here)

- **Measurement logic:** `brain-config/super-agents/_shared/bundle-measurement-spec.md`
- **Watchlist (always-flag agents):** `routines/agent-memory-watchlist.md`
- **Budget definitions:** `hooks/memory-rotation.md` (10KB memory hot cap, 5KB activity-log cap, 22KB read ceiling)
- **Agent directory:** 🤖 Agent Index ClickUp list (list id `901328043244`) — the canonical roster of active agents. Query for Class = `super-agent` to get the bundle-holding set.

## Steps

1. **Read the current state.** `routines/last-run/agent-memory-report.txt` for prior run date.

2. **Get the active agent list.** Query the 🤖 Agent Index ClickUp list for all agents where Class = `super-agent` and Status is active. Each represents a bundle at `brain-config/super-agents/<slug>/`.

3. **Load the watchlist.** Read `routines/agent-memory-watchlist.md`. These agents get called out in the report regardless of tier. ⚠️ **Resolve each watchlist slug against the Agent Index before trusting it** — a row whose slug does not match a real folder fails silently, and one shipped that way (`fmp-fiona` for `fmp-frank`, caught on the first run).

4. **For each agent, run the measurement spec.** Follow `brain-config/super-agents/_shared/bundle-measurement-spec.md` against that agent's bundle folder. Record all measurements.

   💡 **A directory listing returns every file's raw byte size**, so the whole fleet can be measured from ~28 listings with no file bodies decoded. Only open a body when you must judge content — e.g. bare-vs-loaded on a `native-flush.md`. Keeping this routine cheap is what makes a weekly cadence honest.

5. **Classify each agent into priority tiers** per the thresholds in the measurement spec:
   - 🔴 **CRITICAL**: any file over the hard read ceiling (~22KB) — blocks next session open
   - 🟠 **ACTION**: over the target budget (10KB memory / 5KB activity) — rotation needed
   - 🟡 **WATCH**: near cap (>70% of budget) OR has a loaded native-flush pending drain OR is on the watchlist
   - 🟢 **CLEAR**: under budget, archives exist or unnecessary, no pending flush

   ⚠️ **A file sitting just UNDER the ceiling is not a pass — say which way you called it and why.** The thresholds are written with `>` and a bundle at 21.8KB is technically 🟠. Round toward the alarm on a high-velocity agent, round toward the truth in the wording, and never let the tier hide the actual number.

   ⚠️ **Report WHY a bundle is small, not just that it is.** A brand-new agent and a well-maintained one both measure 🟢 and mean opposite things. Note when a 🟢 block is really "new and barely used."

6. **Build the report.** Format below. Sort by tier (🔴 first), then by largest overage within tier. Watchlist agents appear with a 📌 marker in whatever tier they land in.

   ⭐ **Also report the FLEET-LEVEL pattern, not only the rows.** Count how many agents have a `memory/` archive dir at all — that is the difference between "this bundle is big" and "nothing has ever been cut, fleet-wide." The first run found rotation had fired for 6 of 28 and activity-drain for 2, which was the actual headline and appears in no individual row.

7. **Post the report** as a comment on standing task **`86ajy5acn`**. One comment per run, dated. **Reopen it if closed. Never create a second task.**

8. **STAMP** — `routines/last-run/agent-memory-report.txt`, one line, `YYYY-MM-DD HH:MM` ET, only after the report posted.

9. **REPORT** — one-line roll-up on the standing Run Reports thread.

## Guardrails (STOP + flag if any is true)

- This routine is **READ-ONLY**. It never edits, rotates, or drains any agent file. Maggie does that.
- **It is also read-only about its own scaffolding.** A defect found in the watchlist, the spec or this runbook gets REPORTED in the run, not silently patched mid-pass. Fixing it is a separate, named act.
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

FLEET-LEVEL FINDINGS
  <patterns visible only across rows: how many bundles have ever been rotated, etc.>

RECOMMENDED MAGGIE SESSION ORDER:
  1. <slug> — <reason>
  2. <slug> — <reason>
  ...
```

---

## After creation checklist (done in the PR that ships this file)

- [x] Row added to `routines/schedule.md`
- [x] `routines/last-run/agent-memory-report.txt` created with `never`
- [x] Standing ClickUp task created — **`86ajy5acn`**, 2026-08-09, PR #779. ⚠️ Shipped as a duplicate pair; `86ajy5a9r` merged in and deleted 2026-08-10.
- [x] `routines/agent-memory-watchlist.md` created
- [x] `brain-config/super-agents/_shared/bundle-measurement-spec.md` created

## Run history

- **2026-08-10 22:34 ET — FIRST RUN.** 28 super-agents audited, clean 1:1 against `brain-config/super-agents/`. 1 🔴 (`mainstage-milo`) · 11 🟠 · 4 🟡 · 12 🟢. Headline finding: rotation has fired for 6 of 28 agents ever, quarterly activity-drain for 2. Two scaffolding defects found and fixed the next pass: the non-resolving watchlist slug and the duplicated standing task. PR #794 (stamp).
