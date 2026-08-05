# Routines — Agent-Agnostic Runbook Standard

**The core idea: separate the WHAT from the WHO from the WHEN.** A routine is a repeatable job whose *procedure* lives as a runbook file here. Any agent could execute it by reading the file and following it literally. **Routine Ricky** is simply the agent we point at it. The *schedule* lives in `schedule.md`, never in the runbook. Change a procedure = edit the runbook. Change a cadence = edit `schedule.md`. Change the executor = swap the agent. Three concerns, three homes, none entangled.

> 📌 **Where a finished run gets reported: [🧭 STANDING · Routine Ricky — Run Reports](https://app.clickup.com/t/86ajuhw1d).** One comment per invocation. **The TEMPLATE for that comment is procedure and lives in the repo** — `brain-config/hooks/data-refresh.md` → Output template 2.

## 🚨 INVOKE-ONLY (LOCKED 2026-07-26, Michael)

**No routine runs on its own. There is no timer, no wake, no background sweep.** The executor is a **git-teammate**, which by definition has no autonomous triggers.

This is a real capability loss, stated plainly: **a routine is only as current as the last time Michael asked.** When reading anything in `routines/` that sounds like it assumes a clock, it is rot — flag it.

**How to invoke** (full table in `brain-config/hooks/data-refresh.md`): a bare `Ricky` or `/refresh` **triages**; `/refresh run` executes everything due; `/refresh run -<routine>` executes everything due minus an exclusion; `/refresh run <routine>` executes a named set.

## Editing an executor agent — REQUIRED CHECK (do this before every executor edit)

Before adding ANY instruction to an executor agent, route the detail to its correct home instead of the agent:

- **Procedure** (what/how the work is done) → the routine's runbook `routines/<name>.md`. NOT the agent.
- **A shared rule across refreshes** → the Data-Refresh Discipline below. NOT the agent.
- **Timing** → `schedule.md`. NOT the agent.
- Only **executor mechanics** (triage/due-math, idempotency, catch-up, commit+stamp, reporting shape, fail-loud, the data-only rail) may live in the agent profile.

**The test:** if any other agent could be dropped in as the executor and would need this same instruction, it is NOT an agent-level detail. Keep executors dumb on purpose; their reliability is the product.

> ⚠️ **Bigger sibling, learned 2026-07-26: run it on the FRAMEWORK too.** A second, parallel refresh framework was authored under `brain-config/` by someone who searched there for prior art, found none, and never looked in `routines/`. **Before building any state or scheduling machinery for a routine, read this directory first.**

> ⚠️ **Third sibling, 2026-08-01: run it on a RUNBOOK too.** A cross-routine problem fixed inside one runbook is a rule the other routines never inherit. When a runbook teaches a lesson that is not domain-specific, **promote it here** and leave the domain example behind.

> ⚠️ **Fourth sibling, same day: run it on a CLICKUP SURFACE too.** Procedure does not stop being procedure because it was typed into a task description. A rule parked in a task has **no diff, no history, no review**, and instantly becomes a second claimant. **ClickUp holds RECORDS; the repo holds PROCEDURE.**

> ⚠️ **Fifth sibling, 2026-08-04: run it on a COMMENT too.** A `⏸️ CHECKPOINT` carrying nine TSV rows as inline text for the next session to apply is state living in prose. The rows were committed by one session, the comment was never corrected, and the resuming session was told they were uncommitted. **If a comment is carrying data that belongs in a file, commit the file — don't write a better comment.** See rules 14 and 15.

> ⚠️ **Sixth sibling, 2026-08-04: when you PROMOTE a rule here, audit the inheritors in the same pass.** Rule 14 was promoted from Job Market without anyone checking whether On Track or F1 comply. **They are now retroactively bound by a rule they were never read against.** Promotion without an audit creates silent debt across the framework — the same shape as the third sibling, one level up. 🔻 **OWED: a rule-14/15 compliance read of `on-track-refresh.md` and `f1-refresh.md`.**

## The contract

- **Runbooks are the source of truth for the procedure** (the WHAT), and must be SELF-SUFFICIENT. Never put procedure in the agent.
- **Schedules live in `schedule.md`** (the WHEN), not in runbook specs.
- **Stamps live in `routines/last-run/<routine>.txt`** (the STATE) — one file per routine, one writer per file, never a shared log.
- **Run reports land on the standing thread** (the RECORD); **their template lives in the repo** (the PROCEDURE).
- ⚠️ **Runbook FRONTMATTER is metadata, never a switch.** **The row in `schedule.md` is the only ON/OFF switch and the only cadence** (LOCKED 2026-07-30). If frontmatter and the schedule table disagree, the table wins and the frontmatter is rot.
- ⚠️ **A runbook may be SPLIT across files, but only by concern, and only one claimant per fact (2026-08-04).** When a runbook outgrows what can comfortably be read whole, split it — procedure/guardrails in the runbook, output shape in a `-templates.md`, source list and domain intelligence in a `-sources.md`. The runbook names its siblings at the top and **never restates their content.** Reference case: `job-market-refresh.md` v17.
- **APPROVED DATA SURFACES ONLY.** A routine may only write *data*, never app source, engine, or structure. Approved write surfaces:
  - **(a) Repo data files** (a `data.json`, a state `.tsv`, or a DIRECTORY of them) — the primary store.
  - **(b) Designated ClickUp task fields** — only when a runbook names the list and whitelisted fields, and only on *existing* tasks.
  - **(c) A named ClickUp COMMENT THREAD** the runbook designates as its read surface.
  - **(d) The routine's own `last-run` stamp file.**
  - **(e) A run-report comment on the standing thread.**
  If a routine seems to need an engine/source/structure change, that's a build session — STOP and flag.
- **ClickUp object writes are field-scoped and non-structural.** Never create, delete, move, reparent, or restructure tasks or lists. The data → task mapping MUST be an explicit key in the data, never fuzzy name-matching.
- **Fail loud, never guess.**

---

## 📌 THE STAMP LAW (rewritten 2026-08-01 — it used to contradict itself)

The stamp is the **only** input to the due-math. With no scheduler it is the entire memory of the system.

> 🩹 **What was wrong, kept visible so nobody re-derives it.** Old rule 12 was headed **"ALWAYS stamp after a run — including a FAILURE"** and then its own body said *"on failure, leave it untouched."* Ricky's profile said **"NEVER stamp a failed one."** Four statements, three answers, on the most load-bearing mechanic in the framework.

**The test is one question: did this routine's product LAND on its target surface?**

| Outcome | Meaning | Stamp? |
|---|---|---|
| ✅ **SUCCESS** | Every step ran, the product landed. | **STAMP.** |
| ⚠️ **PARTIAL** | The product landed, but something was blocked. | **STAMP**, and name the gap. |
| ❌ **FAILURE** | The product did NOT land, OR a **runbook-declared failure condition** fired. | **DO NOT STAMP.** |
| ⏭️ **NO-OP** | Legitimately nothing to do. | **DO NOT STAMP.** A no-op is not a run. |

- **A runbook may declare its own FAILURE conditions, and they override PARTIAL.**
- **Never stamp a routine you did not run.** Never write another routine's file. Never a shared log.
- **Format:** one line, `YYYY-MM-DD HH:MM` ET, or `never`.
- **Stamp is the second-to-last step, always.** A stamp written before the product lands is a lie with a timestamp on it.
- ⭐ **Corollary added 2026-08-04: the absence of a stamp is itself a signal.** An unfinished pass that does not stamp is what tells the next session to resume rather than restart. **Stamping a partial run does not just misreport it — it silently deletes the remaining work from view.**

---

## 📮 Run reports — WHERE a finished run goes (LOCKED 2026-08-01, Michael)

1. **Per-routine DETAIL** → wherever that runbook says.
2. **The ROLL-UP** → **[🧭 STANDING · Routine Ricky — Run Reports](https://app.clickup.com/t/86ajuhw1d)**, one comment per invocation.
3. **The TEMPLATE for that roll-up** → **`brain-config/hooks/data-refresh.md` → Output template 2.**

**Why a standing ClickUp task and not a repo file, for the RECORD:** a ledger file with a row per run is the same single-writer shape that caused the 2026-07-05 stamp race. Comments are append-only and cannot clobber each other. **Do not build a run-log file. Do not create a second report task.**

**Why the repo and not the task, for the TEMPLATE:** <s>the template lives on the task so it can be edited without a commit.</s> **Reversed 2026-08-01** — *"template should live in repo as procedure notes. not clickup task scratch."* "Editable without a commit" is the defect, not the feature.

**The split, in one line: ClickUp holds the RECORD, the repo holds the PROCEDURE.**

- **Triage does not post to the thread.** No run, no comment.
- **Every line links to its real artifact.** A count with no link is a rumor.
- **`Left standing` is mandatory** whenever something due was not attempted.
- **Any agent that runs a routine posts there**, not just Ricky.

---

## Data-Refresh Discipline (UNIVERSAL — applies to every refresh routine)

A "refresh" is a **verify-and-merge**, never a blank-slate rebuild:

1. **Read the current data file first.** It is the baseline you extend and correct. Preserve any join keys.
2. **Verify existing entries, don't just trust them.** The primary job is keeping what's there ACCURATE; second is scraping in new entries. (Two 2026 F1 results sat silently WRONG until a verify pass caught them.)
3. **Merge, don't replace.**
4. **Never shrink coverage silently.** If you can't find a category's data, KEEP the prior entries and flag the gap.
5. **Confirmed event > complete metadata.** Include a confirmed event with a TBD time; NEVER invent an exact time.
6. **Platform honesty — `Stream` vs `Unknown` are distinct and NOT interchangeable.** Never invent a channel to fill an `Unknown`.
7. **Schema stability.** Do NOT change the schema inside a refresh. If an entry genuinely can't be represented, STOP and flag it as a build task.
8. **Mirror writes follow the source.** The repo data file is the source of truth; the mirror is derived. A mapping that doesn't resolve is a STOP-and-flag, never a create.
9. **Notable changes are worth surfacing.** Rendering a "was X → now Y" callout is a BUILD task, out of routine scope.
10. **SOURCE FRESHNESS — rank by dated provenance, never by proximity** (`hooks/source-freshness-gate.md`):
 - Ranking: owner-updated dated profile > the subject's own dated page > a third party about its OWN operation > a third party reporting someone else's facts > undated aggregators.
 - **A first-party snapshot EXPIRES.**
 - **Agreeing aggregators are ONE source, not five.** Count ORIGINS, not rows.
 - **Never assert a volatile fact without knowing the AGE of the claim.**
 - **Confirm you matched the right ENTITY.**
11. **Never substitute a source silently** (`hooks/silent-fallback-law.md`). If a pinned source is dead, say so and mark the run PARTIAL. Stamping is decided by THE STAMP LAW, not here.
12. **Stamp per THE STAMP LAW above, then report.** With no scheduler, an unreported failure is indistinguishable from a routine nobody invoked.
13. **COMPLETE LOOPS — never speed, never skip a step, however long the procedure feels** *(LOCKED 2026-08-01, Michael).*
 - **No compression.** A step that looks redundant is not permission to fold it into another one.
 - **One routine finished before the next is started.**
 - **Stop at a BOUNDARY, never inside one.**
 - **The stamp is the seam.** run → land the product → stamp → report → next routine.
 - **Length is not a reason to hurry.** A long procedure is long on purpose.
14. **COMMIT AT THE BOUNDARY — never hand state to another session as text** *(LOCKED 2026-08-04, Michael).* Rule 13 says stop at a boundary; this says what must be TRUE at every boundary. **The committed file is the only handoff.**
 - **Michael:** *"Each session should complete its loop fully and not try to pass TSV data between sessions for exactly the reasons you found."*
 - **A routine with internal boundaries commits at every one of them**, not once at the end. The window in which real work exists only in a session's head is one unit long, never a whole pass.
 - 🚫 **A checkpoint, handoff or status comment carries POSITION, never DATA.** **If you are tempted to paste a data row into a comment so the next session can apply it, commit it instead.**
 - **Corollary — read the state, not the note about the state.** Any prose claim about what is committed is a secondary source and may be stale. HEAD is the fact.
 - **Re-read a file's SHA immediately before writing it.** A SHA captured early in a long pass is stale by the time you use it. ⭐ **This is not theoretical: on 2026-08-04 a parallel session edited a config and four data rows mid-pass, and the SHA re-read is the only thing that caught it.** ⚠️ **It is the LAST line of defence, not the first — `brain-config/session-board.md` presence is the first, and neither session posted.**
 - **Size state so it can always be read whole**, and **split it by natural unit before it gets large.** <s>Past roughly 22KB a read can truncate.</s> ⚠️ **Corrected 2026-08-04: that number was quoted, not measured, and was NOT reproducible — a 41KB and a 31.8KB file both read back whole the same day.** The rule is the behaviour, not the constant: **if a file did not come back whole, STOP and never write from a partial read.** Splitting by unit is still right on its own merits (a whole-file rewrite of a monolith at every boundary is a payload problem that grows daily). **Do not re-introduce a byte threshold you have not measured.**
15. **DERIVE STATUS FROM ARTIFACTS — name the artifact before you write a status into prose** *(LOCKED 2026-08-04, Michael).* Rule 14 governs the WRITE side; this is its READ-side twin, and shipping one without the other is half a mechanism.
 - **Michael:** *"Instead of using them as conditionals, we could use them as references… then check the middle of the routine to see where we are."*
 - **The check, and it is a check rather than a slogan: before writing any status into prose, name the artifact that already implies it.** If one exists, the prose is a second claimant and will rot. A note is a snapshot that starts decaying the instant it is saved.
 - **Most of what a routine wants to "remember" was already recorded by work it had to do anyway.** What ran → the comments/commits it posted. When → their timestamps. What it captured → the committed rows. Which sources produced → the source field on those rows. **Nothing has to be added to make these derivable; they are already true and we were writing notes instead of reading them.**
 - 🔴 **The one genuine exception is a NEGATIVE result.** A source checked that returned nothing leaves no artifact at all, and "checked, found nothing" is not the same fact as "never checked." **When a negative result matters, create the smallest possible artifact for it** — one explicit line — rather than trusting anyone to remember. *(Live case: a lane was declared structurally dead for weeks because zero-yield sweeps and never-swept sources were indistinguishable in the record.)*
 - **A status note may still be written for a HUMAN** — context, why something stopped, what it felt like. That is legitimate and not derivable. **It must never be the thing a machine reads to decide what to do.**
 - **The acceptance test, and it is falsifiable: the routine must reach the right answer with the note absent entirely.** If removing a status note breaks a resume, the derivation is broken, not the note. **Test it deliberately at least once rather than assuming.**
 - ⚠️ **Derivation is not free and the runbook should say so.** It costs a thread read plus a state read at every invocation, forever, to answer what a two-line note would have answered instantly. **It is worth it when the fact changes faster than the note does** — which, for anything a multi-session routine tracks, it always does. Name the trade so someone can correctly decide *not* to derive somewhere else.

Runbooks may add domain specifics on top of this, but this discipline is the floor.

## Runbook shape (every routine file uses this exact structure)

```
# <Routine Name>

goal:       <one sentence, what a successful run produces>
target:     <exact surface(s) this writes>
report-to:  DETAIL → <this routine's own surface> · ROLL-UP → the standing Run Reports thread

## Steps
1. <literal, ordered, unambiguous step>
N-1. Stamp routines/last-run/<routine>.txt   (per THE STAMP LAW)
N.   Report

## Guardrails (STOP + flag if any is true)
- Target is app source/engine/structure, or would create/delete/move a ClickUp task or list.
- A required value can't be verified.
- A mapping key doesn't resolve 1:1.
- Coverage would shrink vs the current file.
- The schema would need to change.
- <routine-specific tripwires — including any condition this runbook declares a FAILURE>

## Report format
<commit link, live URL, count previous → new, categories covered, anomalies, catch-up?, Files touched>
```

- ⚠️ **`report-to:` must name a REAL destination.** Never a role, never a channel that may not exist. On 2026-08-01 two of three active runbooks pointed at a standard that had never been written.
- ⚠️ **A runbook with no `## Guardrails` section is not finished.** A cold agent reads the runbook, not this file, at the moment it needs to STOP.
- ⚠️ **A guardrail list nobody finishes reading is not a guardrail list (2026-08-04).** When one runbook's STOP list passed thirty bullets, three of them were the same rule with different examples. **Merge duplicates into one bullet with the examples nested.** Length in a procedure is fine; length in a STOP list defeats its own purpose, because it is read at the moment of least patience.

## Risk tiers (locked; re-scoped 2026-07-26)

**Under invoke-only there is always a human in the loop** — the invocation itself. The tiers describe what may proceed **once the invoked run is approved**:

- **Data-only refresh** → commit to `main` without further confirmation. **This includes many commits in one pass** — per-boundary commits under rule 14 are the same tier, and each one is not a fresh gate.
- **ClickUp task-field refresh** (whitelisted fields, keyed mapping) → same tier.
- **ClickUp comment writes to a runbook-named thread** → same tier.
- **Anything touching engine/source, or creating/deleting/moving/reparenting tasks or lists** → NOT a routine. Route to a build session.

**Do not re-gate an approved run.** Asking again inside a run the human just authorized trains people to click through.

> ⚠️ **But SAY when you cross the line (2026-08-04).** A routine invocation that turns into structural work has changed rulesets mid-flight — different tier, different gates, different acceptance test. **The executor announces the transition in one sentence before the first structural write.** Not an approval gate; an announcement. Reference case: a `pick this up` refresh became a schema migration plus four runbook versions, and nobody named the moment it stopped being a pass. Authorisation arrived, but *after* the drift rather than at it, and for ~3 hours nobody could have said which ruleset was live.

## Adding a routine

1. Drop a new runbook file in `routines/` using the shape above — **including a Guardrails section and a real `report-to:`**.
2. Add one row to `schedule.md` for its cadence — and if it is date-bounded, put the **end date in the row**, not only in the runbook.
3. Create `routines/last-run/<routine>.txt` containing `never`.
4. Add its row to the Current routines table below.

Zero agent changes. **If adding a routine requires editing the executor, the framework is wrong; fix the framework.**

## Current routines

> ⚠️ This table is ORIENTATION. **`schedule.md` is authoritative for cadence and for whether a routine is on.**

| Routine | Target | Cadence (see schedule.md) | Status |
|---------|--------|---------------------------|--------|
| `on-track-refresh.md` | `on-track/data.json` | every Wednesday | active · 🔻 rule 14/15 audit owed |
| `f1-refresh.md` | `f1-racetracks/f1-results/2026/` + ClickUp "Race History" field (slim mirror) | Thu–Sun, session-aware | active · 🔻 rule 14/15 audit owed |
| `job-market-refresh.md` (+ `-templates.md`, `-sources.md`) | `routines/job-market-state/<role_id>.tsv` (one file per lane, committed per role) + its own ClickUp standing thread (`86ajtgbt3`) | daily | active |
| `world-cup-refresh.md` | `world-cup-bracket/data.json` + ClickUp "World Cup" list (mirror) | — | 🏁 **RETIRED 2026-07-26** (app stays live) |

> 🪦 `routines/job-market-state.tsv` (single combined file) is a **tombstone stub** as of 2026-08-04 — state split per lane. Do not read or write it. See `routines/job-market-state/_MIGRATION.md`.

## Executor

**Routine Ricky** — a **git-teammate**. The canonical definition is the repo bundle at **`brain-config/super-agents/routine-ricky/`**, invoked with `/session.agent=Ricky`. His runbook door is `brain-config/hooks/data-refresh.md`. His row in the 🤖 **Agent Index** ClickUp list is the structured record; `roster.json` is a tombstone as of 2026-07-30.

> ⚠️ **Reversed 2026-07-26.** This section used to read *"the live ClickUp Super Agent is the source of truth."* **That is now backwards.** The repo bundle is the only definition that exists.

He is deliberately minimal: **invoked hands, not a brain.** He holds executor mechanics only. All refresh *procedure* lives in the runbooks; all *timing* lives in `schedule.md`.

**Any agent may run any routine.** That is the point of the standard, and it matters more now: with no clock, whoever is already in a session is the cheapest executor. **You do not need to be Ricky.** ⭐ *Demonstrated 2026-08-04: a full Job Market pass was executed, checkpointed, resumed and rebuilt by sessions reading the runbook directly. The procedure held without the persona.*
