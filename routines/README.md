# Routines — Agent-Agnostic Runbook Standard

**The core idea: separate the WHAT from the WHO from the WHEN.** A routine is a repeatable job whose *procedure* lives as a runbook file here. Any agent could execute it by reading the file and following it literally. **Routine Ricky** is simply the agent we point at it. The *schedule* lives in `schedule.md`, never in the runbook. Change a procedure = edit the runbook. Change a cadence = edit `schedule.md` (or just tell Ricky). Change the executor = swap the agent. Three concerns, three homes, none entangled.

> 📌 **Where a finished run gets reported: [🧭 STANDING · Routine Ricky — Run Reports](https://app.clickup.com/t/86ajuhw1d).** One comment per invocation. See **Run reports** below. Added 2026-08-01 because two of the three active runbooks pointed `report-to:` at an "executor's reporting standard" that had never been written.

## 🚨 INVOKE-ONLY (LOCKED 2026-07-26, Michael)

**No routine runs on its own. There is no timer, no wake, no background sweep.** The executor is a **git-teammate**, which by definition has no autonomous triggers — it runs when a session invokes it and never otherwise. The native ClickUp Super Agent that used to hold the clock is being removed.

This is a real capability loss, stated plainly rather than papered over: **a routine is only as current as the last time Michael asked.** Everything below is written for that world. When reading anything in `routines/` that sounds like it assumes a clock, it is rot — flag it.

## Editing an executor agent — REQUIRED CHECK (do this before every executor edit)

This is a rule, not a suggestion. Before adding ANY instruction to an executor agent (Routine Ricky or any future executor), you MUST route the detail to its correct home instead of the agent:

- If it is **procedure** (what/how the work is done) → it goes in the routine's runbook `routines/<name>.md`. NOT the agent.
- If it is a **shared rule across refreshes** (verify-first, merge, never shrink coverage, platform honesty, source freshness, complete loops, where the report lands) → it goes in the Data-Refresh Discipline below. NOT the agent.
- If it is **timing** → it goes in `schedule.md`. NOT the agent.
- Only **executor mechanics** (triage/due-math, idempotency, catch-up, commit+stamp, reporting shape, fail-loud, the data-only rail) may live in the agent profile.

**The test:** if any other agent could be dropped in as the executor and would need this same instruction, it is NOT an agent-level detail — it belongs in one of the files above so everyone inherits it. Making the executor "smarter" is almost always a sign the detail is in the wrong place. Keep executors dumb on purpose; their reliability is the product. (An executor writing procedure into its own profile is exactly this failure — relocate it here.)

> ⚠️ **This check has a bigger sibling, learned 2026-07-26: run it on the FRAMEWORK too, not just on the agent.** That day a second, parallel refresh framework was authored under `brain-config/` — its own schedule, its own timestamp store, its own registry — by someone who searched `brain-config/` for prior art, found none, and never looked in `routines/`. Nothing was wrong with the reasoning except where it looked. **Before building any state or scheduling machinery for a routine, read this directory first.** Two claimants on one truth is the failure mode this whole standard exists to prevent.

> ⚠️ **Third sibling, learned 2026-08-01: run it on a RUNBOOK too.** A cross-routine problem fixed inside one runbook is a rule the other routines never inherit. Job Market grew a density floor, a sweep-depth standard and a mobile-output law that every future routine will want — all of them sitting in one file. When a runbook teaches a lesson that is not domain-specific, **promote it here** and leave the domain example behind.

## The contract

- **Runbooks are the source of truth for the procedure** (the WHAT), and must be SELF-SUFFICIENT — any agent reads the runbook and knows exactly what to do, without inheriting behavior from a specific executor. Never put procedure in the agent; if it describes what/how the work is done, it lives here.
- **Schedules live in `schedule.md`** (the WHEN), not in runbook specs.
- **Stamps live in `routines/last-run/<routine>.txt`** (the STATE) — one file per routine, one writer per file, never a shared log. See `schedule.md` for the incident that locked this and the 2026-07-26 attempt to un-lock it.
- **Run reports land on the standing thread** (the RECORD) — see Run reports below.
- ⚠️ **Runbook FRONTMATTER is metadata, never a switch (added 2026-08-01).** A `status:`, `enabled:`, `cadence:` or `last_run:` key in a runbook's YAML header is orientation for a reader and nothing more. **The row in `schedule.md` is the only ON/OFF switch and the only cadence** (LOCKED 2026-07-30). If frontmatter and the schedule table disagree, **the table wins and the frontmatter is rot** — fix it in the same pass. Never decide whether to run something by reading a runbook's own header.
- **APPROVED DATA SURFACES ONLY.** A routine may only write *data*, never app source, engine, or structure. The rail exists to keep routines away from `index.html`, JS, CSS, README, and repo/list structure — it is NOT a ban on writing data objects that happen to live on another platform. Approved write surfaces:
  - **(a) Repo data files** (e.g. `data.json`, a state `.tsv`) — the primary store.
  - **(b) Designated ClickUp task fields** — only when a runbook explicitly names the list and the whitelisted fields (typically name, status, dates, and named custom fields), and only on *existing* tasks.
  - **(c) A named ClickUp COMMENT THREAD** the runbook designates as its read surface. Comments are additive and non-structural; they are an approved surface. (Job Market is the reference case.)
  - **(d) The routine's own `last-run` stamp file.**
  - **(e) A run-report comment on the standing thread.**
  If a routine seems to need an engine/source/structure change, that's a build session — STOP and flag, never do it inside a routine.
- **ClickUp object writes are field-scoped and non-structural.** A routine may update whitelisted fields on existing tasks; it may NEVER create, delete, move, reparent, or restructure tasks or lists. Unlike a git commit, a ClickUp write is not auto-revertible, so the mapping from data → task MUST be an explicit key defined in the data (e.g. a `cuTaskId` on each record) — never fuzzy name-matching. On any ambiguity (missing key, task not found, field missing) the routine STOPS and flags instead of guessing.
- **Fail loud, never guess.** Unclear runbook, unverifiable data, failed step, an unresolved mapping, or a non-data/structural target: STOP and report.

---

## 📌 THE STAMP LAW (rewritten 2026-08-01 — it used to contradict itself)

The stamp is the **only** input to the due-math. With no scheduler it is the entire memory of the system, so it gets one unambiguous rule instead of three that disagreed.

> 🩹 **What was wrong, kept visible so nobody re-derives it.** Old rule 12 was headed **"ALWAYS stamp after a run — including a FAILURE"** and then its own body said *"on failure, leave it untouched."* Old rule 11 said a dead pinned source should *"stamp anyway."* Ricky's profile said **"NEVER stamp a failed one."** Four statements, three answers, on the single most load-bearing mechanic in the framework — and a cold agent skimming headings would have stamped failures, which hides a broken source behind a clean-looking timestamp. Resolved below.

**The test is one question: did this routine's product LAND on its target surface?**

| Outcome | Meaning | Stamp? |
|---|---|---|
| ✅ **SUCCESS** | Every step ran, the product landed. | **STAMP.** |
| ⚠️ **PARTIAL** | The product landed, but something was missing or blocked (a pinned source was dead, one sub-step was gated). | **STAMP**, and name the gap in the report. The surface moved; leaving it overdue makes every later triage lie about it. |
| ❌ **FAILURE** | The product did NOT land, OR a **runbook-declared failure condition** fired. | **DO NOT STAMP.** It stays overdue and self-heals on the next invocation. Report it in the reply, never by DM. |
| ⏭️ **NO-OP** | Legitimately nothing to do (F1 with no finished session). | **DO NOT STAMP.** A no-op is not a run. Say so out loud. |

- **A runbook may declare its own FAILURE conditions, and they override PARTIAL.** Job Market's density floor is the live example: a pass under 40 live listings is a declared failure, so it does not stamp even though rows landed. If a runbook wants a condition to block the stamp, it must say so explicitly in its Guardrails.
- **Never stamp a routine you did not run.** Never write another routine's file. Never a shared log.
- **Format:** one line, `YYYY-MM-DD HH:MM` ET, or `never`.
- **Stamp is the second-to-last step, always.** Order: run → land the product → **stamp** → report. A stamp written before the product lands is a lie with a timestamp on it.

---

## 📮 Run reports — WHERE a finished run goes (LOCKED 2026-08-01, Michael)

Two different things, two different homes. Confusing them is why `report-to:` rotted.

1. **Per-routine DETAIL** → wherever that runbook says. Job Market restates its whole inventory to its own standing thread; On Track and F1 report through their data commits. The runbook owns its detail surface and always has.
2. **The ROLL-UP — what fired and how it went** → **[🧭 STANDING · Routine Ricky — Run Reports](https://app.clickup.com/t/86ajuhw1d)**, one comment per invocation. This is the answer to *"what has actually happened on the rounds?"*

**Why a standing ClickUp task and not a repo file:** a ledger file with a row per run is the same single-writer shape that caused the 2026-07-05 stamp race and got rebuilt-and-deleted again on 07-26. Comments are append-only, per-session, phone-readable, and cannot clobber each other. **Do not build a run-log file. Do not create a second report task.**

**The template lives on the task itself** so it can be edited without a commit. Shape, for orientation only:

```
🔄 RUN REPORT · <date/time ET> · <n> routines · invoked by <who>
✅/⚠️/❌/⏭️ <routine> — <one clause> · <link> · stamped <HH:MM>
Left standing: <due routines not attempted, and why>
Next due: <routine> — <when>
Ledger: <source behavior / cadence honesty worth remembering>
```

- **Triage does not post here.** Triage proposes and stops; it is a conversation, not a run. No run, no comment.
- **Every line links to its real artifact.** A count with no link is a rumor.
- **`Left standing` is mandatory** whenever something due was not attempted. A report listing only what ran implies nothing else was due.
- **Any agent that runs a routine posts here**, not just Ricky. Same standard, same thread.

---

## Data-Refresh Discipline (UNIVERSAL — applies to every refresh routine)

This is process, not executor behavior — it lives here so ANY agent running ANY refresh routine does the right thing. A "refresh" is a **verify-and-merge**, never a blank-slate rebuild:

1. **Read the current data file first.** It is the baseline you extend and correct, not something you overwrite from scratch. Preserve any join keys (e.g. `cuTaskId`) that link records to other surfaces — they are structural glue, never drop them.
2. **Verify existing entries, don't just trust them.** Double/triple-check that each existing entry's time, platform, and status are still accurate — times shift, sessions get added, events get canceled or delayed. The primary job is keeping what's there ACCURATE; second is scraping in new entries that belong. (Two 2026 F1 results sat silently WRONG in the store until a verify pass caught them — trust nothing unverified.)
3. **Merge, don't replace.** Add newly-found entries, correct changed ones, drop only what has truly aged out of the window.
4. **Never shrink coverage silently.** A category/series represented last run must not vanish this run. If you can't find its data, KEEP the prior entries and flag the gap — deleting coverage is a STOP-and-flag event, not a quiet outcome.
5. **Confirmed event > complete metadata. Do NOT omit a confirmed event just because platform or exact time is missing:**
 - **Event date confirmed** (official/reliable source) → eligible for inclusion, even if platform or exact time is still open.
 - **Exact time confirmed** → use normal `start`/`end`.
 - **Time still TBD** (event too far out) → include it honestly with a TBD-style handling pattern in the existing schema. NEVER invent or guess an exact time.
6. **Platform honesty — `Stream` vs `Unknown` are distinct and NOT interchangeable:**
 - **`Stream`** = a confirmed streaming-only / direct-to-consumer source exists, but no traditional TV channel should be named.
 - **`Unknown`** = the event is confirmed but no reliable viewing platform has been verified yet.
 - Never collapse one into the other, and never invent a channel to fill an `Unknown`.
7. **Schema stability.** Prefer working within the current schema; do NOT change it unless absolutely necessary. If a confirmed-date / TBD-time (or platform-`Unknown`) entry genuinely can't be represented cleanly, that's the SMALLEST-possible schema/engine change — STOP, flag it as a build task (engine work, out of routine scope), and describe it. Never expand the schema inside a data refresh.
8. **Mirror writes follow the source.** When a routine mirrors data to a second surface (e.g. ClickUp tasks), the repo data file is the source of truth and the mirror is derived. Only push whitelisted fields, only on records whose mapping key resolves 1:1, and reflect the same verify-and-merge outcome. A mapping that doesn't resolve is a STOP-and-flag, never a create. NOTE: direction of truth can INVERT by time horizon — see the Anchor Convention in the Apps/Artifacts reference (live lens canonical in-season; a frozen archive lens canonical for closed periods, fill-if-blank + conflict-flag, never clobber).
9. **Notable changes are worth surfacing.** If an entry materially shifted (delay, moved session, cancellation), note it in the run report. Rendering a "was X → now Y" callout in the UI needs an engine field + render support → that's a BUILD task, out of routine scope; flag it, don't attempt it in a data refresh. (Rare.)
10. **SOURCE FRESHNESS — rank by dated provenance, never by proximity** *(added 2026-07-26 from `brain-config/hooks/source-freshness-gate.md`, itself born from a live wrong-answer on 07-25).* Fires the moment a routine FETCHES anything:
 - **Ranking:** owner-updated dated profile > the subject's own dated page > a third party about its OWN operation > a third party reporting someone else's facts > undated aggregators (near worthless).
 - **A first-party snapshot EXPIRES.** A two-year-old post by the owner is not current.
 - **Agreeing aggregators are ONE source, not five.** Count ORIGINS, not rows.
 - **Never assert a volatile fact without knowing the AGE of the claim.** Say "unverified" instead. Age is part of the fact, not a footnote.
 - **Confirm you matched the right ENTITY** before trusting anything it says.
11. **Never substitute a source silently** (`brain-config/hooks/silent-fallback-law.md`). If a pinned source is dead, say so and mark the run PARTIAL. <s>Stamp anyway.</s> **Corrected 2026-08-01: stamping is decided by THE STAMP LAW above, not here** — a dead source that still let the product land is a PARTIAL and stamps; a dead source that prevented the product from landing is a FAILURE and does not. Do not quietly answer from a different source and report as if the pinned one answered.
12. **Stamp per THE STAMP LAW above, then report.** <s>ALWAYS stamp after a run — including a FAILURE.</s> **Corrected 2026-08-01 — that heading was the opposite of its own body and of every other statement in the framework.** Success and partial stamp; failure and no-op do not. With no scheduler, an unreported failure is indistinguishable from a routine nobody invoked — so report it either way, in the reply and on the standing thread.
13. **COMPLETE LOOPS — never speed, never skip a step, however long the procedure feels** *(LOCKED 2026-08-01, Michael).* The reliability of a routine IS its product; a fast pass that skipped three steps is not a pass.
 - **No compression.** Run the steps in the written order, all of them. A step that looks redundant is not permission to fold it into another one. If a step is genuinely dead, say so in the report and propose a runbook edit — never drop it silently mid-run.
 - **One routine finished before the next is started.** Never interleave two routines to "save a pass."
 - **Stop at a BOUNDARY, never inside one.** If you are running low on room, budget, or capacity, finish the routine you are in, stamp it, and stop. **Whole finished routines plus their stamps are what the next agent picks up from** — a half-finished routine with no stamp reads to the next triage as never-run, and its partial writes are invisible.
 - **The stamp is the seam.** Sequence, every time: run → land the product → stamp → report → next routine. That is what makes a mid-run failure recoverable instead of ambiguous.
 - **Length is not a reason to hurry.** Job Market's density floor exists precisely because a shallow sweep is indistinguishable from a thin market. A long procedure is long on purpose.

Runbooks may add domain specifics on top of this, but this discipline is the floor for all of them.

## Runbook shape (every routine file uses this exact structure)

```
# <Routine Name>

goal:       <one sentence, what a successful run produces>
target:     <exact surface(s) this writes — repo data file(s), a named ClickUp list + whitelisted fields, and/or a named comment thread>
report-to:  DETAIL → <this routine's own surface> · ROLL-UP → the standing Run Reports thread

## Steps
1. <literal, ordered, unambiguous step>
2. ...
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
<commit link, live URL, count previous → new, categories covered, mirror surface touched, anomalies, catch-up?, Files touched>
```

- ⚠️ **`report-to:` must name a REAL destination.** Never a role ("per the executor's reporting standard"), never a channel that may not exist. **This is not hypothetical:** on 2026-08-01 two of three active runbooks pointed at a standard that had never been written, and the third pointed at a chat channel. Nothing had a home.
- ⚠️ **A runbook with no `## Guardrails` section is not finished.** If a routine genuinely has no domain-specific tripwires it still inherits the five universal ones above — **write them in anyway.** A cold agent reads the runbook, not this file, at the moment it needs to STOP.

## Risk tiers (locked; re-scoped 2026-07-26)

These were written when the executor ran unattended, so "auto-commit" meant *without a human in the loop*. **Under invoke-only there is always a human in the loop** — the invocation itself. The tiers now describe what may proceed **once the invoked run is approved**, not what may happen unsupervised:

- **Data-only refresh** → commit to `main` without further confirmation. (All current routines.)
- **ClickUp task-field refresh** (whitelisted fields on existing tasks, keyed mapping) → same tier — field-scoped and non-structural.
- **ClickUp comment writes to a runbook-named thread** → same tier. Additive and non-structural.
- **Anything touching engine/source, or creating/deleting/moving/reparenting tasks or lists** → NOT a routine. Route to a build session.

**Do not re-gate an approved run.** Asking again inside a run the human just authorized is a confirmation in front of a confirmation, and it trains people to click through.

## Adding a routine

1. Drop a new runbook file in `routines/` using the shape above (procedure only) — **including a Guardrails section and a real `report-to:`**.
2. Add one row to `schedule.md` for its cadence — and if it is date-bounded, put the **end date in the row**, not only in the runbook. (The World Cup stand-down instruction lived only in its runbook and went seven days unexecuted.)
3. Create `routines/last-run/<routine>.txt` containing `never`.
4. Add its row to the Current routines table below.

Zero agent changes. **If adding a routine requires editing the executor, the framework is wrong; fix the framework.**

## Current routines

> ⚠️ This table is ORIENTATION. **`schedule.md` is authoritative for cadence and for whether a routine is on.** Job Market was added 2026-07-30 and was missing from this table for two days — if the two disagree, `schedule.md` wins and this table gets corrected.

| Routine | Target | Cadence (see schedule.md) | Status |
|---------|--------|---------------------------|--------|
| `on-track-refresh.md` | `on-track/data.json` | every Wednesday | active |
| `f1-refresh.md` | `f1-racetracks/f1-results/2026/` + ClickUp "Race History" field (slim mirror) | Thu–Sun, session-aware | active |
| `job-market-refresh.md` | `routines/job-market-state.tsv` + its own ClickUp standing thread (`86ajtgbt3`) | daily | active |
| `world-cup-refresh.md` | `world-cup-bracket/data.json` + ClickUp "World Cup" list (mirror) | — | 🏁 **RETIRED 2026-07-26** (tournament ended Jul 19; app stays live) |

## Executor

**Routine Ricky** — a **git-teammate**. The canonical definition is the repo bundle at **`brain-config/super-agents/routine-ricky/`**, invoked with `/session.agent=Ricky`. His runbook door is `brain-config/hooks/data-refresh.md`, which triages against THIS directory. His row in the 🤖 **Agent Index** ClickUp list is the structured record; `roster.json` is a tombstone as of 2026-07-30 and must not be consulted.

> ⚠️ **Reversed 2026-07-26.** This section used to read: *"the live ClickUp Super Agent is the source of truth for his behavior; the repo profile is a non-canonical reference."* **That is now backwards.** The native ClickUp agent is being removed, a workspace sweep found no native agents at all, and the repo bundle is the only definition that exists. Anything still describing a live native Ricky is rot.

He is deliberately minimal: **invoked hands, not a brain.** He holds executor mechanics only — triage/due-math, idempotency, catch-up, commit+stamp, report, fail-loud, and respecting the approved-surfaces rail. All refresh *procedure*, including any ClickUp mirror mapping, lives in the runbooks. All *timing* lives in `schedule.md`. Before editing him, run the **Editing an executor agent** check above.

**Any agent may run any routine.** That is the point of the standard, and it matters more now: with no clock, whoever is already in a session is the cheapest executor. Read the runbook, follow it literally, stamp the last-run file, post the roll-up to the standing thread. You do not need to be Ricky.
