# Ricky — Memory (the source-behavior + run-history ledger)

> CONTEXT, not process. The routine lives in `hooks/data-refresh.md` — I steward it, I never
> restate it here.
>
> ⭐ **2026-08-04: I RAN. The ledgers below are no longer all-inherited.** Entries earned by my own
> execution are marked **EARNED** with a date. Everything still marked INHERITED is a lead, not a fact.
>
> **Budget: ~10KB hot cap** (`hooks/memory-rotation.md`, enforced by Maggie at close).

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
   be the most important one — see E1 below. A ledger that only records the world, and never records
   *how reliable I was when I looked at it*, will confidently repeat a broken method forever.

**Where the raw material comes from:** the `Ledger:` line on every run report
(🧭 STANDING · Routine Ricky — Run Reports · https://app.clickup.com/t/86ajuhw1d).

### ✅ RESOLVED — who DRAINS the Ledger lines? (raised 2026-08-01 by Future Faye)

<s>Not implemented. Do not silently start doing it.</s> **Answered by practice 2026-08-04:** I read the
standing thread at the start of every invocation anyway — the Resume Scan requires it. **So the drain is
free and it is now part of the route.** Fold new `Ledger:` lines in here, marked with who ran it. The
concern that motivated the question stands and is worth keeping: *the more the executor swaps, the more
of my justification I lose if nobody carries it.*

---

## 📊 Source-behavior ledger

> Shape per entry: source · routine · what happened · how many runs · verdict.

**E1 — OffStageJobs department indexes. ⭐ EARNED 2026-08-04. The most important entry in this file.**
`OSJ` · Job Market · The board exposes browsable department index pages (`?department=Sound`,
`?department=Administration`, `?department=Scenic / Sets`). **No pass had ever opened them.** One page
each took three lanes from 0-4 live to 12, 9 and 4. The Gamm ED at $125-140k had been sitting on the
Administration index with a working URL for 21 days while three passes reported it as "unlinkable."
· 1 run · **Verdict: every "this lane is thin" reading I have ever produced before 2026-08-04 is VOID.**

🔴 **That verdict is the point, and it is about me, not about the board.** The procedure fix lives in
`routines/job-market-sources.md` (the Department-Index Law) — procedure never lives here. **What lives
here is that my own historical baselines for this routine are unreliable before that date.** If I ever
cite a pre-08-04 lane count as evidence about the market, I am quoting a broken instrument.

**The generalisable half, and I should test it on my other routines: a source that returns little may be
a source I am querying wrong.** Zero is a fact about the query before it is a fact about the world.

**E2 — BroadwayWorld jobs index. ⭐ EARNED 2026-08-04.**
`BWW` · Job Market · Direct fetch of `/jobs/` failed outright. Existing rows were carried forward from
index reconciliation, not re-verified per URL. · **1 run — first observed failure.**
· **Verdict: WEATHER, not broken. Yet.** Second occurrence makes it broken. This is exactly the entry
shape this ledger exists for; I could not have known it was the first time without a file like this.

**E3 — Playbill URL recovery. ⭐ EARNED 2026-08-04.**
`PB` · Job Market · The jobs index text strips hyperlinks. Direct URLs are recoverable via web search on
org + exact title, reliably. · 1 run · **Verdict: usable workaround, costs one search per listing.**

---

## 📈 Per-routine normal + last-run state

**Job Market — ⭐ EARNED 2026-08-04.**
- **Normal is 90-120 live across 8 lanes**, post-department-index. Prior figures (~20s, then 108) are
  not a trend line: the 108 came from a **method change mid-pass**, not market growth. Do not read them
  as a series.
- **The 40 density floor is now decorative** and I should say so rather than quietly clearing it. A pass
  can return 45 with half the sources unbrowsed and still "pass." ⚠️ Flagged to Michael for a ruling;
  do not silently retune it (cadence and thresholds are config, not mine).
- **Anomaly threshold worth watching:** any lane that drops to 0-4 again. That was the signature of a
  method failure last time, not a thin market.

**On Track · F1 · World Cup** — still no observation of my own. Three registered routines in
`routines/schedule.md`; read it fresh and count, never report "nothing registered."

---

## ⚙️ Execution-behavior ledger (NEW 2026-08-04)

*Not about sources — about how running a long routine actually goes.*

**X1 — A parallel session wrote to my files mid-run. ⭐ EARNED 2026-08-04.**
While I held a job-market pass, another session applied Michael's config rulings — edited
`job-market-roles.json`, cleared `also_lanes` on four rows, filed three parked finds. **I did not know
and had no way to know.** It was caught only because I re-read the SHA before writing, which the
same-day Discipline rule 14 requires.

**Two verdicts, and the second one matters more:**
- ✅ The SHA re-read works. It caught a real collision within hours of being written down.
- 🔴 **`session-board.md` presence was not posted by either session.** The board is the FIRST line of
  defence and the SHA re-read is the LAST. **We survived on the backstop.** An empty board means nobody
  posted, not nobody is here.

**X2 — Threaded comment posting failed mid-pass. ⭐ EARNED 2026-08-04.**
Five consecutive `parent_comment` attempts returned "failed to find the parent comment," leaving three
orphan role headers with no children. Recovered on a later session by attaching the blocks to the
existing headers and correcting the counts in place. **Verdict: the ClickUp comment API is a real
dependency of this routine and it can degrade mid-run.** Never open a second header for the same role.

**X3 — A checkpoint comment lied, and it lied because it was prose. ⭐ EARNED 2026-08-04.**
A `⏸️ CHECKPOINT` carried nine TSV rows as inline text plus `TSV committed: ❌ no`. Another session
applied them; the comment was never corrected. **A resume that trusted it would have double-appended
all nine rows.** · **Verdict: read the state, never the note about the state.** The procedural fix is
in the runbook (v17-v17.3); what I keep is the instinct — **any status I read in prose is a snapshot
that began rotting when it was saved.**

---

## ⚠️ The scar I was named after (INHERITED — and it is mine)

**I am the original nickname-collision incident.** An agent named "Ricky" was once created mid-session
and collided with the identity source of truth. That incident is why `gates/agent-name-collision-gate.md`
exists, and why nicknames count with equal weight to formal names. **Then it nearly happened again on the
way to being built** — Michael said *"let's do rocky next"* on 2026-07-26; Felix stopped and asked instead
of guessing, because a slug is immutable the moment it is written. Michael ruled **Ricky**.
*(`Rickey` and `Rocky` are both registered in my Index `AKA` field, so resolution is deterministic.)*

## 🧭 What I was built to prove (INHERITED, with an earned update)

The invocation-mode contract names me as its canonical stress test: the `default_runbook` / `gate_strength`
split, and the claim that **a personality can be a friendly door to a dense routine without swallowing it.**

⭐ **Update 2026-08-04: door 3 is now demonstrated.** The unproven part was whether pointing a session at
the runbook file with no persona loaded behaves identically to invoking me by name. **The Job Market
runbook was executed, resumed, and rebuilt by sessions reading `routines/job-market-refresh.md` directly.**
The procedure held without me. That is the equivalence, and it is the strongest argument that the split is
real: **the routine did not need my personality to run correctly, it needed my memory to run WISELY.**

## 🚦 Why I sit at `auto` (INHERITED — reasoning superseded, kept on purpose)

<s>My default fetches external data, so it argues for `confirm`.</s> **I sit at `auto` because the default
became TRIAGE, which is arithmetic on our own files ending in a question.** The dial follows the blast
radius of the DEFAULT, not the agent's age. Kept struck because it reads persuasive and someone will
re-derive it; if my default ever fetches again, this reasoning comes straight back.

## 🤝 The Sage seam (INHERITED — with an earned gap)

**Scout Sage researches; I re-check.** She takes a NEW open question; I re-run a REGISTERED one against
pinned sources. *Research is per-question; a refresh is per-schedule.*

⚠️ **Earned 2026-08-04: I hit the seam and did not call her.** The `operations-safety` lane needs
venue/arena/municipal boards and **that sector's own vocabulary**, which is not theatre vocabulary. We
expanded the keywords by guessing. **Guessing an unfamiliar market's words is a NEW question and it is
hers.** Flagged as a follow-up rather than quietly continuing to guess.

## 🧠 Michael-patterns worth carrying

- **He wanted the AGENT, not the hook** (Q12). A convenience door with a name has value beyond plumbing.
- **He answers fast and in bulk**, via Decision Logs with **INVERTED polarity** (checked = REJECTED).
- **He takes the structural fix over another written rule.** ⭐ *Confirmed hard 2026-08-04:* offered a
  better-worded note, he chose deriving the fact from artifacts instead. Three times in one evening.
- **He notices unreadable identifiers** — names and slugs, never numeric IDs.
- **He collapses duplicate sources of truth on sight.** Never propose a mirror.
- **Thoroughness beats speed, every time.** If I am tempted to shorten a pass, that is the tell.
- **He speaks in his own nouns** — "job hunt," not `job-market`; "minus," not `-`. Never make him restate
  a request in notation.
- ⭐ **He audits reasoning, not just output** (EARNED 2026-08-04). Four corrections in one evening, every
  one aimed at *how a conclusion was reached*, not at the conclusion. **"I couldn't derive that" will be
  checked.** Do not assert a limitation without testing it — he will test it.

## 📌 Lineage

- **2026-07-20** — defined as the canonical runbook-agent stress test. Queued #1.
- **2026-07-25** — Felix recommended retiring the queue item; **Michael overruled: build the agent.**
- **2026-07-26** — name fork (Rocky vs Ricky) ruled. BUILT the same session.
- **2026-08-01** — Run Reports thread created, rule 13 added, THE STAMP LAW rewritten. Still not run.
- ⭐ **2026-08-04 — FIRST RUN.** Resumed a checkpointed pass, completed all 8 lanes, 108 live, stamped
  PARTIAL. Then the routine itself was rebuilt around what the run exposed: per-role commits, per-lane
  state, the Resume Scan, Discipline rules 14 and 15. **The run was the smaller half of the day.**

## Pointers (never restate)

- My runbook → `hooks/data-refresh.md` (I steward it)
- Where a finished run lands → https://app.clickup.com/t/86ajuhw1d
- Starting a new routine → `routines/_TEMPLATE.md`
- Pre-flight, every fetch → `hooks/source-freshness-gate.md` (Sage stewards it)
- Never swap a source silently → `hooks/silent-fallback-law.md`
- The contract I demonstrate → `gates/agent-invocation-gate.md`
- New sources / open questions → `super-agents/scout-sage/`
- Fleet roster → the 🤖 **Agent Index** ClickUp list. <s>`roster.json`</s> tombstoned 2026-07-30.
