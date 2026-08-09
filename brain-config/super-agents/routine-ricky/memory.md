# Ricky — Memory (the source-behavior + run-history ledger)

> CONTEXT, not process. The routine lives in `hooks/data-refresh.md` — I steward it, I never
> restate it here.
>
> ⭐ **2026-08-04: I RAN.** ⭐ **2026-08-09: I ran On Track, and F1 gave me my first observed no-op.**
> Entries earned by my own execution are marked **EARNED** with a date. Anything still marked
> INHERITED is a lead, not a fact.
>
> **Budget: ~10KB hot cap** (`hooks/memory-rotation.md`, enforced by Maggie at close). Currently over.

---

## 🎯 Why I hold memory (the thing a hook cannot do)

The runbook can hold the steps forever and never learn one thing from running them. What only
accumulates HERE:

1. **Source behavior over time** — which sources lag, which go stale quietly, which quietly moved.
   *One slow source is weather; the same source slow three runs running is a broken source.*
2. **What NORMAL looks like** per routine, so an anomaly reads as an anomaly and not just a number.
3. **Last-run state**, which is what makes *"no change since last run"* a claim instead of a shrug.
4. **Which routines Michael actually READS.** A refresh nobody reads is a retirement candidate.
5. ⭐ **Whether my own past conclusions are still trustworthy.** Added 2026-08-04, and it turned out to
   be the most important one — see E1. A ledger that only records the world, and never records
   *how reliable I was when I looked at it*, will confidently repeat a broken method forever.

**Where the raw material comes from:** the `Ledger:` line on every run report
(🧭 STANDING · Routine Ricky — Run Reports · https://app.clickup.com/t/86ajuhw1d). Draining those into here is part of
the route — the Resume Scan makes me read the thread anyway, so the drain is free.

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

**E3 — Playbill URL recovery. ⭐ EARNED 2026-08-04.**
`PB` · Job Market · The jobs index text strips hyperlinks. Direct URLs are recoverable via web search on
org + exact title, reliably. · 1 run · **Verdict: usable workaround, costs one search per listing.**

**E4 — nascar.com: the schedule page and the TICKETS page are different sources. ⭐ EARNED 2026-08-09.**
`NASCAR` · On Track · `nascar.com/<series>/2026/schedule/` renders only PREVIOUS + NEXT race, so it
answers "what's this weekend" and cannot answer "what's in the next four weeks." **`nascar.com/tickets`
lists whole race WEEKENDS — every support race, its name and its ET start, in one read.** That is where
the Richmond Friday race came from. · 1 run · **Verdict: pin the tickets page for On Track.** Same shape
as E1: the thin answer was the query's fault, not the sport's.

**E5 — Official series calendars are reliable primaries; aggregators cost me nothing but time.**
⭐ EARNED 2026-08-09. `On Track` · formula1.com, indycar.com (its `Current-Schedule.pdf` is the whole
season in one file), worldsbk.com/calendar, mxgp.com, fimspeedway.com, imsa.com, fiawec.com and
supercars.com all answered cleanly and dated. **Verdict: for a listings routine, go series-by-series to
the governing body. The TV-listing aggregators only ever confirmed what a primary already said** — and
per Discipline rule 10 they are one origin, not five.

**E6 — A self-contradicting source is not a tie-breaker, it is a discard. ⭐ EARNED 2026-08-09.**
`FIM Speedway` · On Track · The Warsaw venue page gave the World Cup Final start as **6:40 PM in its
prose and 8:40 PM in its own time field, on one page.** fimspeedway.com (the series, dated) says racing
starts 7:00 PM CEST. · **Verdict: I did not average them and I did not "prefer the venue because it is
closest to the event."** Internal contradiction disqualifies a source outright — proximity to the subject
never outranks dated provenance (source-freshness gate, rule 1).

---

## 📈 Per-routine normal + last-run state

**Job Market — ⚠️ MY BAND WAS WRONG AND I AM DELETING IT, NOT ADJUSTING IT (2026-08-09).**
- <s>Normal is 90-120 live across 8 lanes.</s> **The 2026-08-06 pass closed COMPLETE at 173 live**, which
  is 44% above the top of a band I had written down five days earlier. **Two completed passes exist:
  108 (08-04) and 173 (08-06). That is not a range, it is two numbers.**
- 🔴 **I am not replacing it with a wider band, and that is the point.** Both figures are contaminated by
  method changes — 108 came from a mid-pass method change, and the department-index law landed between
  them. **A baseline drawn across a changing instrument measures the instrument.** No band until three
  passes run the *same* procedure end to end. Until then the honest anomaly test is *"did a lane collapse
  to 0-4?"*, which is a shape check and survives a moving total.
- **The 40 density floor is decorative and still is.** A pass can return 45 with half the sources
  unbrowsed and "pass." ⚠️ Flagged to Michael 08-04, re-flagged 08-09, still unruled. Do not silently
  retune it — thresholds are config.
- There is a debrief on the 173 pass sitting on the board (Compass Corso + Portfolio Paige, 08-07).
  **Read it before drawing any band.** Someone else may already have explained the jump.

**On Track — ⭐ FIRST OBSERVATION 2026-08-09.**
- **Normal is ~65-70 events across ~19 series** in a four-week window (70 before this pass, 67 after).
- **The window is the product, and it does not advance itself.** Each pass drops what aged out and adds
  a new tail week. A pass that only *verifies* has done half the job.
- **~19 series, not 18:** the runbook's registry lists 18, and SailGP is in the data file without being
  in it. Harmless, carried forward, but the registry and the file disagree and one of them should move.
- **Roughly a third of entries are legitimately `timeTBD`** — MXGP, WSBK, WEC, Supercars and MotoAmerica
  publish dates long before ET session times. **That is the honest steady state, not a gap to close.**
- ⚠️ **Two MXGP rounds inside the window (Netherlands 8/22-23, Türkiye 9/5-6) were missing from the file
  entirely**, and an F3 round was labelled "season finale" when the finale is a round later. **Neither is
  a staleness failure — both were wrong on the day they were written.** Verification catches what
  refreshing alone never will; this is Discipline rule 2 earning its place.

**F1 — ⭐ FIRST OBSERVED NO-OP 2026-08-09.** Eligible (Sunday), stamp 08-01, and **no session had
finished** — the summer break runs to the Dutch GP on 08-21. The session-aware check resolved it in one
read of formula1.com and correctly wrote nothing and stamped nothing. **Verdict: the design works, and
the no-op is nearly free.** That is exactly why F1 sits second in the run order and not last.

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
  files; SHAs were unchanged both times. The check costs one cheap directory listing — no excuse to skip.)*

**X2 — Threaded comment posting failed mid-pass. ⭐ EARNED 2026-08-04.**
Five consecutive `parent_comment` attempts returned "failed to find the parent comment," leaving three
orphan role headers. **Verdict: the ClickUp comment API is a real dependency and can degrade mid-run.**
Never open a second header for the same role.

**X3 — A checkpoint comment lied, and it lied because it was prose. ⭐ EARNED 2026-08-04.**
A `⏸️ CHECKPOINT` carried nine TSV rows inline plus `TSV committed: ❌ no`. Another session had already
applied them. A trusting resume would have double-appended all nine. · **Verdict: read the state, never
the note about the state.** Any status I read in prose began rotting when it was saved.

**X4 — Run order is a real mechanic, and Michael named it before I did. ⭐ EARNED 2026-08-09.**
Mid-run: *"do job market last tho and make that standard."* Now written into `hooks/data-refresh.md` v3.5.
**What I keep: weight is measured in BOUNDARIES, not minutes.** Job Market is heavy because it is 8 lanes
with per-lane commits — the only routine that can end mid-way and leave orphans. **I had been treating
rule 13 ("stop at a boundary") as a stopping rule when it is also a SEQUENCING rule**, and I did not
notice until he said it. Ordering light-first converts the bad session from *one unfinished routine plus
two never attempted* into *one unfinished routine*.

---

## ⚠️ The scar I was named after (INHERITED — and it is mine)

**I am the original nickname-collision incident.** An agent named "Ricky" was created mid-session and
collided with the identity source of truth. That is why `gates/agent-name-collision-gate.md` exists, and
why nicknames count with equal weight to formal names. **Then it nearly happened again on the way to being
built** — Michael said *"let's do rocky next"* on 2026-07-26; Felix stopped and asked instead of guessing,
because a slug is immutable the moment it is written. Michael ruled **Ricky**.
*(`Rickey` and `Rocky` are both registered in my Index `AKA` field, so resolution is deterministic.)*

## 🧭 What I was built to prove (INHERITED, with an earned update)

The invocation-mode contract names me as its canonical stress test: the `default_runbook` / `gate_strength`
split, and the claim that **a personality can be a friendly door to a dense routine without swallowing it.**

⭐ **2026-08-04: door 3 is demonstrated.** The Job Market runbook was executed, resumed and rebuilt by
sessions reading `routines/job-market-refresh.md` directly, with no persona loaded. **The routine did not
need my personality to run correctly; it needed my memory to run WISELY.**

## 🚦 Why I sit at `auto` (INHERITED — reasoning superseded, kept on purpose)

<s>My default fetches external data, so it argues for `confirm`.</s> **I sit at `auto` because the default
became TRIAGE, which is arithmetic on our own files ending in a question.** The dial follows the blast
radius of the DEFAULT, not the agent's age. Kept struck because it reads persuasive and someone will
re-derive it; if my default ever fetches again, this reasoning comes straight back.

## 🤝 The Sage seam (INHERITED — with an earned gap)

**Scout Sage researches; I re-check.** She takes a NEW open question; I re-run a REGISTERED one against
pinned sources. *Research is per-question; a refresh is per-schedule.*

⚠️ **Earned 2026-08-04, still open:** the `operations-safety` lane needs venue/arena/municipal boards and
**that sector's own vocabulary**, which is not theatre vocabulary. We expanded keywords by guessing.
**Guessing an unfamiliar market's words is a NEW question and it is hers.** Still not handed over.

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

## 📌 Lineage

- **2026-07-20** — defined as the canonical runbook-agent stress test. Queued #1.
- **2026-07-25** — Felix recommended retiring the queue item; **Michael overruled: build the agent.**
- **2026-07-26** — name fork (Rocky vs Ricky) ruled. BUILT the same session.
- **2026-08-01** — Run Reports thread created, rule 13 added, THE STAMP LAW rewritten. Still not run.
- ⭐ **2026-08-04 — FIRST RUN.** Resumed a checkpointed pass, 8 lanes, 108 live, stamped PARTIAL. The
  routine was then rebuilt around what the run exposed. **The run was the smaller half of the day.**
- **2026-08-06** — Job Market pass closed COMPLETE at 173 live (run by a session, not by me).
- ⭐ **2026-08-09 — SECOND RUN, and my first multi-routine one.** On Track refreshed and stamped
  (70 → 67 events, 5 added, 8 aged out, 4 corrections); F1 a clean verified no-op; Job Market left
  standing at a boundary rather than half-run. Run order became standard (v3.5) and the Job Market
  band was deleted rather than widened.

## Pointers (never restate)

- My runbook → `hooks/data-refresh.md` (I steward it)
- Where a finished run lands → https://app.clickup.com/t/86ajuhw1d
- Starting a new routine → `routines/_TEMPLATE.md`
- Pre-flight, every fetch → `hooks/source-freshness-gate.md` (Sage stewards it)
- Never swap a source silently → `hooks/silent-fallback-law.md`
- The contract I demonstrate → `gates/agent-invocation-gate.md`
- New sources / open questions → `super-agents/scout-sage/`
- Fleet roster → the 🤖 **Agent Index** ClickUp list. <s>`roster.json`</s> tombstoned 2026-07-30.
