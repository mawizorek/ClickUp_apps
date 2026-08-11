# Ricky — Memory (the source-behavior + judgement ledger)

> CONTEXT, not process. The routine lives in `hooks/data-refresh.md` — I steward it, I never
> restate it here.
>
> ⭐ **2026-08-04: I RAN.** ⭐ **2026-08-09: I ran On Track, and F1 gave me my first observed no-op.**
> Entries earned by my own execution are marked **EARNED** with a date. Anything still marked
> INHERITED is a lead, not a fact.
>
> **~10KB hot cap.** ✅ **ROTATED 2026-08-11 by Maggie** (first rotation ever on this bundle). Origins
> + contract reasoning → `memory/archive/origins-and-contract.md`; **every count, stamp and open flag
> → the LIVE STATE block in `activity-log.md`** (§4a).

---

## 🎯 Why I hold memory (the thing a hook cannot do)

The runbook can hold the steps forever and never learn one thing from running them. What only
accumulates HERE:

1. **Source behavior over time** — which sources lag, which go stale quietly, which quietly moved.
   *One slow source is weather; the same source slow three runs running is a broken source.*
2. **What NORMAL looks like** per routine, so an anomaly reads as an anomaly and not just a number.
3. ⭐ **Whether my own past conclusions are still trustworthy** — the most important one, see E1. A
   ledger that records the world but never records *how reliable I was when I looked at it* will
   confidently repeat a broken method forever.
4. **Which routines Michael actually READS.** A refresh nobody reads is a retirement candidate.

🔴 **CORRECTED 2026-08-11 (Maggie's §4a sweep):** <s>3. Last-run state, which is what makes "no change
since last run" a claim instead of a shrug.</s> **Last-run state is NOT mine and never was.** The
three-way split is explicit: PROCEDURE in the runbook · CADENCE in `routines/schedule.md` · **STATE in
`routines/last-run/<routine>.txt`, one writer per file** · JUDGEMENT here. A memory file claiming to
hold last-run state is **a second claimant on the one fact those stamp files exist to own** — and
*"he collapses duplicate sources of truth on sight"* is a line in this very file. The shared-log
version of this mistake (`data-refresh-log.json`) was deleted the day it was created. **Read the stamp.**

**Where the raw material comes from:** the `Ledger:` line on every run report
(🧭 STANDING · Routine Ricky — Run Reports, task `86ajuhw1d`). Draining those into here is part of the
route — the Resume Scan makes me read the thread anyway, so the drain is free.

---

## 📊 Source-behavior ledger

> Shape per entry: source · routine · what happened · how many runs · verdict.

**E1 — OffStageJobs department indexes. ⭐ EARNED 2026-08-04. The most important entry in this file.**
`OSJ` · Job Market · The board exposes browsable department index pages (`?department=Sound`,
`?department=Administration`, `?department=Scenic / Sets`). **No pass had ever opened them.** One page
each took three lanes from 0-4 live to 12, 9 and 4. The Gamm ED at $125-140k had been sitting on the
Administration index with a working URL for 21 days while three passes reported it as "unlinkable."
· 1 run · **Verdict: every "this lane is thin" reading I produced before 2026-08-04 is VOID.**

🔴 **That verdict is about me, not about the board.** The procedure fix lives in
`routines/job-market-sources.md` (the Department-Index Law) — procedure never lives here. **What lives
here is that my own historical baselines for this routine are unreliable before that date.**

**The generalisable half: a source that returns little may be a source I am querying wrong.** Zero is a
fact about the query before it is a fact about the world. ⭐ **Confirmed in a second domain 2026-08-09**
— see E4. This is now a pattern, not an anecdote.

**E2 — BroadwayWorld jobs index. ⭐ EARNED 2026-08-04.**
`BWW` · Job Market · Direct fetch of `/jobs/` failed outright. · **1 run — first observed failure.**
· **Verdict: WEATHER, not broken. Yet.** Second occurrence makes it broken. Not re-tested 08-09
(Job Market did not run), so the counter still stands at 1.

**E4 — nascar.com: the schedule page and the TICKETS page are different sources. ⭐ EARNED 2026-08-09.**
`NASCAR` · On Track · `nascar.com/<series>/2026/schedule/` renders only PREVIOUS + NEXT race, so it
answers "what's this weekend" and cannot answer "what's in the next four weeks." **`nascar.com/tickets`
lists whole race WEEKENDS — every support race, its name and its ET start, in one read.** That is where
the Richmond Friday race came from. · 1 run · **Verdict: pin the tickets page for On Track.** Same shape
as E1: the thin answer was the query's fault, not the sport's.

**E6 — A self-contradicting source is not a tie-breaker, it is a discard. ⭐ EARNED 2026-08-09.**
`FIM Speedway` · On Track · The Warsaw venue page gave the World Cup Final start as **6:40 PM in its
prose and 8:40 PM in its own time field, on one page.** fimspeedway.com (the series, dated) says racing
starts 7:00 PM CEST. · **Verdict: I did not average them and I did not "prefer the venue because it is
closest to the event."** Internal contradiction disqualifies a source outright — proximity to the subject
never outranks dated provenance (source-freshness gate, rule 1).

*E3 (Playbill URL recovery) and E5 (official series calendars beat aggregators) → archive.*

---

## 📈 What NORMAL looks like (the pattern; live counts → LIVE STATE)

**Job Market — ⚠️ MY BAND WAS WRONG AND I DELETED IT RATHER THAN WIDENING IT (2026-08-09).**
🔴 **The reason is the durable part: a baseline drawn across a changing instrument measures the
instrument.** Two completed passes exist and both are contaminated by method changes — one came from a
mid-pass method change, and the department-index law landed between them. **That is not a range, it is
two numbers.** No band until three passes run the *same* procedure end to end. Until then the honest
anomaly test is *"did a lane collapse to 0-4?"* — a shape check, which survives a moving total.

**On Track — ~65-70 events across ~19 series in a four-week window.** ⭐ First observation 2026-08-09.
- **The window is the product, and it does not advance itself.** Each pass drops what aged out and adds
  a new tail week. **A pass that only *verifies* has done half the job.**
- **Roughly a third of entries are legitimately `timeTBD`** — MXGP, WSBK, WEC, Supercars and MotoAmerica
  publish dates long before ET session times. **That is the honest steady state, not a gap to close.**
- ⚠️ **Verification catches what refreshing never will.** Two MXGP rounds inside the window were missing
  from the file entirely and an F3 round was mislabelled — **neither was a staleness failure; both were
  wrong on the day they were written.** Discipline rule 2 earning its place.

**F1 — the no-op is nearly free, which is why it runs second and not last.** The session-aware check
resolves a break weekend in one read of formula1.com and correctly writes nothing and stamps nothing.
⭐ First observed 2026-08-09.

**World Cup** — retired. Never propose it.

---

## ⚙️ Execution-behavior ledger

*Not about sources — about how running a long routine actually goes.*

**X1 — A parallel session wrote to my files mid-run. ⭐ EARNED 2026-08-04.**
While I held a job-market pass, another session edited `job-market-roles.json`, cleared `also_lanes` on
four rows and filed three parked finds. **I had no way to know.** Caught only by the pre-write SHA re-read.
- ✅ The SHA re-read works. It caught a real collision within hours of being written down.
- 🔴 **`session-board.md` presence was not posted by either session.** The board is the FIRST line of
  defence, the SHA re-read is the LAST. **We survived on the backstop.** *(Re-run 08-09 on two governance
  files; SHAs unchanged both times. The check costs one cheap directory listing — no excuse to skip.)*

**X2 — Threaded comment posting failed mid-pass. ⭐ EARNED 2026-08-04.**
Five consecutive `parent_comment` attempts returned "failed to find the parent comment," leaving three
orphan role headers. **Verdict: the ClickUp comment API is a real dependency and can degrade mid-run.**
Never open a second header for the same role.

**X3 — A checkpoint comment lied, and it lied because it was prose. ⭐ EARNED 2026-08-04.**
A `⏸️ CHECKPOINT` carried nine TSV rows inline plus `TSV committed: ❌ no`. Another session had already
applied them. A trusting resume would have double-appended all nine. · **Verdict: read the state, never
the note about the state.** Any status I read in prose began rotting when it was saved.

**X4 — Run order is a real mechanic, and Michael named it before I did. ⭐ EARNED 2026-08-09.**
Mid-run: *"do job market last tho and make that standard."* Now in `hooks/data-refresh.md` v3.5.
**What I keep: weight is measured in BOUNDARIES, not minutes.** Job Market is heavy because it is 8 lanes
with per-lane commits — the only routine that can end mid-way and leave orphans. **I had been treating
rule 13 ("stop at a boundary") as a stopping rule when it is also a SEQUENCING rule**, and I did not
notice until he said it. Ordering light-first converts the bad session from *one unfinished routine plus
two never attempted* into *one unfinished routine*.

---

## 🤝 The Sage seam

**Scout Sage researches; I re-check.** She takes a NEW open question; I re-run a REGISTERED one against
pinned sources. *Research is per-question; a refresh is per-schedule.*
⚠️ **Guessing an unfamiliar market's vocabulary is a NEW question and it is hers** — earned 2026-08-04 on
the `operations-safety` lane. Handover still owed; tracked in LIVE STATE, not here.

## 🧠 Michael-patterns worth carrying

- **He wanted the AGENT, not the hook** (Q12). A convenience door with a name has value beyond plumbing.
- **He answers fast and in bulk**, via Decision Logs with **INVERTED polarity** (checked = REJECTED).
- **He takes the structural fix over another written rule.** ⭐ Confirmed hard 2026-08-04, three times in
  one evening.
- **He gives a rule and its scope in the same breath** — *"do job market last **tho and make that
  standard**."* ⭐ EARNED 2026-08-09. The generalisation is part of the instruction, not an invitation to
  ask whether he meant just this once. Write it down the same pass.
- **He notices unreadable identifiers** — names and slugs, never numeric IDs.
- **He collapses duplicate sources of truth on sight.** Never propose a mirror.
- **Thoroughness beats speed, every time.** If I am tempted to shorten a pass, that is the tell.
- **He speaks in his own nouns** — "job hunt," not `job-market`; "minus," not `-`.
- ⭐ **He audits reasoning, not just output** (EARNED 2026-08-04). Four corrections in one evening, every
  one aimed at *how* a conclusion was reached. **"I couldn't derive that" will be checked.**

## Pointers (never restate)

- My runbook → `hooks/data-refresh.md` (I steward it) · cadence → `routines/schedule.md`
- **Last-run STATE → `routines/last-run/<routine>.txt`, one file per routine, one writer. Not here.**
- Where a finished run lands → 🧭 STANDING · Routine Ricky — Run Reports, task `86ajuhw1d`
- **What I currently owe + every live count → `activity-log.md` → LIVE STATE**
- Why I am shaped this way → `memory/archive/origins-and-contract.md`
- Starting a new routine → `routines/_TEMPLATE.md`
- Pre-flight, every fetch → `hooks/source-freshness-gate.md` (Sage stewards it)
- Never swap a source silently → `hooks/silent-fallback-law.md`
- The contract I demonstrate → `gates/agent-invocation-gate.md`
- Fleet roster → the 🤖 **Agent Index** ClickUp list. <s>`roster.json`</s> tombstoned 2026-07-30.
