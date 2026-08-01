# <Routine Name>

> 📋 **COPY THIS FILE to start a new routine.** Delete every `<placeholder>` and this banner.
>
> **Why a template exists (added 2026-08-01):** `routines/README.md` states the required shape in prose, and prose is not enforceable. Job Market shipped 2026-07-30 with **no `goal:`/`target:`/`report-to:` header and no Guardrails section at all**, and nobody noticed for two days. "Copy the template" is checkable; "follow the shape described in the README" is a good intention, and this framework has now proven twice that good intentions are the failure mode.
>
> **Read `routines/README.md` before filling this in** — the Data-Refresh Discipline (13 rules), THE STAMP LAW, and the Run-reports split are the floor under every routine and are NOT restated here.

goal:       <one sentence: what a successful run PRODUCES. Not what it looks at — what lands.>
target:     <the exact surface(s) this writes: repo data file(s) · a named ClickUp list + whitelisted fields · a named comment thread · always plus routines/last-run/<routine>.txt>
report-to:  DETAIL → <this routine's own surface> · ROLL-UP → 🧭 STANDING · Routine Ricky — Run Reports · https://app.clickup.com/t/86ajuhw1d

> ⚠️ **`report-to:` must name a REAL destination.** Never a role ("per the executor's reporting standard" — that standard did not exist for two months), never a chat channel. Chat is a pointer surface, never the record.

## Steps

1. **Read the current state FIRST.** The data file, the prior pass, `routines/last-run/<routine>.txt`. It is the baseline you extend and correct, never a blank slate. Preserve every join key.
2. <literal, ordered, unambiguous step — write it for an agent with zero context>
3. <...>
4. <If this routine reads a companion reference file, NAME IT IN THE STEP THAT NEEDS IT. A cold agent following steps literally never opens a sibling file it was not told to open at that moment. The World Cup stand-down lived in the right file and went seven days unexecuted for exactly this reason.>

N-2. **Land the product** on the target surface (commit / post / field write).
N-1. **STAMP** — `routines/last-run/<routine>.txt`, one line, `YYYY-MM-DD HH:MM` ET, **only after the product landed.** Per THE STAMP LAW: success and partial stamp; failure and no-op do not. A stamp written before the product lands is a lie with a timestamp on it.
N.   **REPORT** — detail per the format below, plus the one-line roll-up on the standing thread.

## Guardrails (STOP + flag if any is true)

> ⚠️ **This section is MANDATORY and may not be empty.** If the routine has no domain-specific tripwires it still inherits the universal ones — **write them in anyway.** A cold agent reads the runbook, not the README, at the moment it needs to STOP.

- Target is app source / engine / structure, or would create / delete / move / reparent a ClickUp task or list.
- A required value cannot be verified → flag, never guess.
- A mapping key does not resolve 1:1 → STOP. ClickUp writes are not git-revertible.
- Coverage would shrink versus the current file → keep the prior entries and flag the gap.
- The schema would need to change → that is a build session, not a refresh.
- You are about to stamp before the product landed, or stamp a failure → STOP.
- You are about to skip a step because the procedure feels long → STOP. Discipline rule 13.
- <routine-specific tripwires — INCLUDING any condition this runbook DECLARES a failure. A declared failure overrides PARTIAL and withholds the stamp. Job Market's density floor is the reference case.>

## Report format

<commit link · live URL · count previous → new · categories/coverage this run (so a drop is obvious) · anything unverifiable or marked Unknown · **whether this run was a CATCH-UP** · files touched — the self-audit line>

---

## After you create the file (all three, or the routine does not exist)

1. **Add one row to `routines/schedule.md`.** That table is the cadence AND the only ON/OFF switch. If the routine is date-bounded, **put the end date in the ROW**, not only in the runbook.
2. **Create `routines/last-run/<routine>.txt`** containing `never`.
3. **Add its row to the Current routines table** in `routines/README.md`.

🚫 **Do not put a `status:` / `enabled:` / `cadence:` key in this file's frontmatter and expect it to mean anything.** Frontmatter is metadata; the schedule table is the switch. A second switch makes *"is this running?"* a two-lookup question with two possible answers.

**Zero agent changes.** If adding a routine requires editing the executor, the framework is wrong — fix the framework.
