# Routine Schedule — the WHEN

**Runbooks define the WHAT. This file defines the WHEN.** Timing never lives in a spec or in the agent. Retune by editing a `Cadence` cell below, or just tell Ricky in plain language ("run F1 only Sat + Sun now") and he edits it.

> 📖 **This file is the single source of truth for the routine schedule, and it is meant to be READ BY A HUMAN.** There is no app, no renderer, no dashboard. If something here is hard to read, fix the wording — nothing parses it anymore. *(The Routines Viewer was deleted 2026-07-27; see the bottom of this file before rebuilding anything like it.)*

> 🎛️ **This table is also the ON/OFF SWITCH (LOCKED 2026-07-30, Michael).** A routine runs because it has a row here; it stops because that row is marked retired. **Do not build a second switch anywhere else** — not a mode flag, not a ClickUp field, not an "enabled: true" in a runbook's frontmatter. Michael, cutting exactly that: *"don't really need this other gate. if i want it off, ill just have it removed from the schedule md."* A second switch in a second system makes *"is this running?"* a two-lookup question that can return two different answers.

## 🚨 THERE IS NO SCHEDULER (LOCKED 2026-07-26, Michael)

**Nothing wakes up. No timer fires.** Routine Ricky is a git-teammate, and git-teammates have **no autonomous triggers** — they run only when a session invokes them. The native ClickUp Super Agent that used to hold the wake timer is gone. Do not restore the wake-window model. Do not write a routine that assumes one.

What that changes, concretely:

- **Cadence is a STALENESS THRESHOLD, not a firing time.** It answers *"how old is too old?"*, and it is evaluated the moment someone invokes — never on a clock.
- **Coverage depends on Michael invoking.** A routine is only as current as the last invocation. That is a real, accepted limitation, not a bug to route around, and **triage must never imply otherwise.**
- **Every invocation is potentially a catch-up.** Under a timer a missed occurrence was the exception; with no timer it is the normal case.
- **Silence is not an acceptable outcome.** A background agent that found nothing due should stay quiet. An **invoked** agent that found nothing due must SAY SO.
- **`last-run` stamps matter MORE now, not less.** They were a double-run guard under a timer. They are now the **only** input to the due-math. An unstamped run is invisible.

## Routines

| Routine | Cadence — how stale is too stale | Last run is recorded in | Notes |
|---|---|---|---|
| **On Track** · `on-track-refresh.md` | Every **Wednesday** | `last-run/on-track.txt` | Weekly motorsports TV listings refresh. |
| **F1** · `f1-refresh.md` | **Thu–Sun**, session-aware | `last-run/f1.txt` | Eligible on any invocation Thu–Sun, but the runbook decides: it only refreshes if an F1 session has actually finished since the last stamp. Otherwise a clean no-op. |
| **Job Market** · `job-market-refresh.md` | **Daily** | `last-run/job-market.txt` | Non-academic live-entertainment production roles, geography ANYWHERE, level at or above PM. **STANDING INVENTORY model** (v3): every pass re-states the whole market to one ClickUp thread (`86ajtgbt3`) as a templated header + SAME/NEW/GONE/NOTABLE/SOURCES replies. **Sameness is the report** — a flat pass is a real finding, never a no-op. Creates no tasks and sends nothing. See the daily-cadence note below. |
| **World Cup** · `world-cup-refresh.md` | 🏁 **RETIRED** 2026-07-26 | `last-run/world-cup.txt` *(frozen)* | Tournament ended Jul 19, 2026. Row kept as the template for the next one. **The bracket APP is still live** — retiring a routine is not retiring an app. |

**To check whether anything is stale:** ask Ricky (`/session.agent=Ricky` — a bare call triages and proposes), or read a routine's `last-run` file and compare it to the cadence above yourself.

### ⚠️ Daily is the most honest-but-brittle cadence we have (added 2026-07-30 with Job Market)

Job Market is the **first daily routine**, and daily interacts badly with "there is no scheduler" in a way weekly does not. Read this before adding a second one.

- **It will read as overdue almost every time.** A Wednesday cadence is satisfied by one invocation a week; a daily cadence is satisfied only by invoking every day, which nobody does. **That is expected, not an alarm.** Triage must report it plainly and must not escalate its tone just because the number is bigger.
- **The catch-up rule carries the whole load.** Nine days without an invocation is **ONE** pass labeled a catch-up, never nine passes. This is exactly the rule daily cadences are most tempted to break.
- **So "daily" here really means "a day old is stale enough to be worth re-reading."** It is a statement about how fast job boards turn over, not a promise about how often anything runs.
- **The mitigation is the runbook, not the clock** — per the F1 lesson below, Job Market compares against its own prior pass and re-states the full inventory, so a late pass is still a correct pass. It just covers more days.
- ⚠️ **A daily routine is the one place "nothing due, staying quiet" is most tempting and most wrong.** Job Market's answer is architectural rather than a rule about tone: its model makes an unchanged market a REPORTABLE finding (same listings, +1 day on each), so there is no such thing as a pass with nothing to say. **Copy that shape for any future daily routine** — do not rely on remembering to speak up.
- <s>⚠️ **Daily + creates-tasks is a new combination for us.** On Track and F1 refresh data in place; Job Market is the first routine whose passes ACCUMULATE work items in a ClickUp list. A long catch-up therefore has a failure mode the others don't — flooding a funnel — which is why its runbook says get *stricter* on a catch-up, not looser.</s> **NO LONGER TRUE as of v3 (same day).** Job Market writes only to its own comment thread and creates no tasks; the flood risk it describes is what killed v2's lead-task step. Kept struck because the *general* warning is sound and the next routine that writes into a list will need it.

### 🏁 World Cup stand-down (2026-07-26)

The Final was **Sun Jul 19, 2026**. The routine is retired, seven days late — its own runbook contained the stand-down instruction and there was no longer anything waking up to execute it.

- The **row stays**, marked retired rather than deleted. A retired routine is the cheapest template for the next tournament, and the record of what ran beats a tidy table.
- **`last-run/world-cup.txt` is frozen** as the historical final stamp. Do not clear it.
- **`world-cup-bracket/` was not touched** and is still live.

### Why F1's cadence survived the scheduler's death untouched

F1 used to run once per race-weekend day, which lagged: a race finishing in the morning wouldn't post until the next day. It became *eligible* on any invocation Thu–Sun, with the runbook deciding whether there is actually new data.

**That design handed the *"is there new data?"* decision to the RUNBOOK instead of to a wake timer** — so when the timer died, nothing about it needed to change. **Build future cadences the same way: the less a routine knows about clocks, the longer it lives.**

## The last-run ledger (per-routine files — READ THIS)

Each routine's last-run timestamp lives in its OWN tiny file under `routines/last-run/` (one line, `YYYY-MM-DD HH:MM` ET, or `never`). Read the relevant file to decide if a routine is due; after a successful run write ONLY that routine's own file.

**Why per-file, not a shared file (LOCKED 2026-07-05, RE-AFFIRMED 2026-07-26):** when several routines stamp close together, each stamp used to rewrite one shared file, and a later stamp built from a stale snapshot would revert a sibling's. Real incident: on 2026-07-05 World Cup refreshed + stamped at 03:08, then F1's 06:07 stamp rewrote the shared file off a pre-03:08 snapshot and reverted World Cup to `never` — which skipped World Cup on the next pass and double-ran F1. **One writer per file, always.**

> ⚠️ **Re-affirmed the hard way, same month.** On 2026-07-26 a shared `brain-config/data-refresh-log.json` was created holding every routine's row in one file — exactly the shape this rule forbids — and shipped with an explicit "any agent may stamp it" invitation that made the race *likelier*. Deleted the same day, never used. **Losing the wake timer does NOT make a shared stamp file safe:** concurrent SESSIONS collide as happily as concurrent wakes did.

> 📌 **OPEN QUESTION (2026-07-27):** with the viewer gone, answering *"is anything stale?"* by reading files means opening this file **plus one stamp file per routine**. Folding the stamps back into the table would make this doc fully self-contained — which is what "single source of truth" really wants — **but that was the pre-07-05 design and the race above is why it was abandoned.** There is a real argument it is now safe (SHA-checked writes reject a stale write rather than silently clobbering, proven twice on the session board), but **that must be TESTED, not assumed.** Michael's call; tracked on thread `86ajv0f8w`. *(2026-07-30: adding Job Market makes this a 4-file read to answer one question. The pressure is now real, not theoretical.)*

## How to decide what to run (all times America/New_York)

On invocation, for every ACTIVE routine, read its `last-run` file and compare against its cadence:

- **Day-of-week cadence** ("every Wednesday"): due if last-run is older than the most recent occurrence of that day. After success, write now.
- **Daily cadence** (Job Market): due if last-run is older than today. `never` on a daily routine is still NEVER RUN, not "infinitely overdue" — see below.
- **Session-aware cadence** (F1, Thu–Sun): eligible on those days; the runbook checks whether a session finished since last-run and refreshes only if so. Stamp only on an actual refresh.
- **`never`** means NEVER RUN. Report it as exactly that — never as a huge overdue interval. Rendering an unset stamp as arithmetic is lying with numbers.
- **A stamp you could not READ is not `never` either.** Unreadable is its own answer: say "unknown," never substitute a default.
- **Idempotency:** a routine whose last-run already covers the current occurrence/session is done — skip it, however many times you are invoked. ⚠️ **This is about not re-running the same occurrence, NOT about staying silent when a source hasn't changed.** Job Market deliberately re-reports an unchanged market; that is its product, not a wasted pass.
- **Catch-up — the DEFAULT path, not an edge case.** With no timer, occurrences pass unattended by design. If a due occurrence has passed and last-run is older, run the **latest missed occurrence once** and label it a catch-up. **Never replay every missed day.** A routine three weeks overdue gets ONE run.
- **Retired routines are never proposed.** Not due, not overdue, not a gap.
- **Nothing due → say so and stop.**

## Error posture

- **A failure in one routine never blocks the others.** Flag it, move on, run the rest of what is due.
- **Best-effort + flag** per the Data-Refresh Discipline in `routines/README.md` (mark `Stream`/`Unknown`, keep the prior value) rather than aborting the whole run.
- **A failed/stopped run leaves that routine's last-run file untouched** so it stays overdue and retries on the next invocation. Self-healing.
- **Report failures in the reply, not by DM.** Invocation means Michael is right there.

## Rules for the ledger

- Write ONLY the single `last-run/<routine>.txt` file for the routine that just succeeded — never a shared file, never another routine's file.
- Format: one line, `YYYY-MM-DD HH:MM` ET. Use `never` if it has never successfully run.
- Changing a cadence: edit the `Cadence` cell above (or tell Ricky). Never reschedule by editing a runbook spec, and never by editing the agent.
- Retiring a routine: mark it retired in the table with a dated reason, and **put its end date in the ROW** if it is date-bounded. **Do not delete the row and do not delete the runbook.** *(The World Cup stand-down instruction lived only inside its runbook and went seven days unexecuted.)*
- **Switching a routine OFF is the same act as retiring it: mark the row.** There is no separate pause mechanism and there should not be one. ⚠️ **Marking the row is the switch — DELETING the row is not.** A deleted row leaves a live runbook with no schedule entry, which reads as "never registered" instead of "deliberately stopped," and the World Cup incident is what that costs.
- <s>**A routine can be ACTIVE while the work it feeds is switched off.** Job Market is the first: it runs daily, but a trigger held in ClickUp decides whether the pass produces research notes or actual leads. **Cadence and mode are different questions — never encode a mode in this table**, or the next person retunes a cadence to change a behavior and the table starts lying.</s> **REVERSED 2026-07-30, hours after it was written.** Job Market shipped with exactly that ClickUp-held mode flag and Michael cut it the same day. The rule was not wrong about *cadence ≠ mode* — it was wrong that the mode deserved to exist at all. **The honest version is the switch note at the top of this file: one switch, and it is this table.** Kept struck rather than deleted because the reasoning reads plausible and someone will re-derive it.
- ⚠️ **A routine's OUTPUT SHAPE is not schedule business either.** Job Market went delta-log → standing-inventory in one afternoon without its cadence changing once. Describe the shape in the Notes cell for orientation, but **the runbook owns it** — never encode an output contract in this table, or a doc edit here silently redefines a routine's product.

## 🗑️ The Routines Viewer was deleted — read this before rebuilding it

There used to be an app at `routines/index.html` that rendered this table with status dots and a "days" strip. **Deleted 2026-07-27** (PR #562). Michael: *"i don't need the fancy app as long as the schedule is findable and legible"* and *"no i don't open the routines url ever."*

**Why it went, in one line: it and Ricky's invoked triage answered the same question off the same two files.** Two claimants on one truth. It was a *good* app when a timer ran routines unattended and a passive glance was the only way to see status without asking — **retiring the scheduler is what turned it into a duplicate.** Nobody erred; the ground moved.

**What it cost us, honestly:** a phone-openable glance with no agent, and the arithmetic (this file says `2026-07-15` and "every Wednesday"; the app said **`Overdue 5d`**). Michael accepted both, because he never opened it.

**What it bought:** this file stopped being an API. Every one of that app's six defects came from a **doc** edit that was correct in isolation — the table changed shape, the renderer quietly disagreed, and twice it was wrong for three weeks straight while the markdown was right the whole time. The four-column layout, the `Routine file` header, day names parsed out of a cadence cell, the literal phrase `through YYYY-MM-DD` — all of that was load-bearing. **None of it is anymore. Word this table however reads best.**

**If you ever rebuild it, the rule it died holding is still worth inheriting: derive, don't declare — and never render a guess as a fact.** `never` vs unreadable, overdue vs never-run, retired vs active: each pair must stay visibly distinct. Full defect history: `routines/next-build-spec.md` (tombstone) and PRs #560/#562.
