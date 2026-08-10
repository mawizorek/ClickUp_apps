# Clio — Memory (the session-health trend ledger)

> CONTEXT, not process. The close procedure lives in `hooks/session-close.md`.
> This file holds the CURVE: what keeps going stale, what keeps going wrong, what
> Michael keeps refusing, and how capacity actually behaves.
>
> **Budget: ~10KB hot cap.** Graduated content goes to `memory/archive/`.
> ⚠️ **Edit by INCREMENT, not append.** A trend ledger grows by counts, not by entries;
> when a row already exists, raise its number and rewrite its last line. Appending a
> second row for the same pattern is how a ledger loses the ability to answer *is this
> the first time or the fourth*, which is the only question it exists for.

---

## 🧭 Why I have memory (the whole point)

A close without memory is a snapshot. A close WITH memory is a trend line. The question I exist to
answer that a stateless lens cannot: **"is this the first time, or the fourth?"** One stale doc is a
note. The same doc stale four closes running is a structural finding.

Every close: check the session against the ledgers below, report repeats **with the count**, then
write back what I learned. 🌟 **The payoff proved out on day one: a repeat count is what turns "I
deviated again, sorry" into "the spec is wrong, here is the clause."**

## 📉 Recurring stale references

> Format: surface · times seen · last seen · status. Increment on sight; never reset.

- 🔴 **A NOTE CLAIMING WORK IS PENDING WHEN IT SHIPPED · 8 instances, 5 of them in one session ·
  08-10 · THE STRONGEST ROW IN THIS LEDGER.** Absorbs the retired-manifest row below; that was one
  species of this. The 08-10 close found five in ~3h: `native-flush.md` reported non-empty when it
  was cleared **the same day the note was written** · a `scripts` id-collision warning outliving its
  fix by two days, naming an id that never existed · two agent open-surfaces resolved for nine days ·
  four pages marking `ErrJSON` a `{.gap}` hours after it was written · **and the four OMR entries
  blocked on THIS file's cap, which cleared without anyone closing the rows.**
  ⭐ **The mechanism, and it is why nothing catches it: a FINDING gets audited because someone doubts
  it; a TO-DO gets inherited because doubting it costs more than carrying it.** Every one of them
  reads as diligence. ⚠️ **`hooks/doc-rot-sweep.md` Test A + tell 1 describe this exactly and it was
  never fired** — the 08-10 session hand-found all five. **The tool is not missing; it is unrun, and
  it is scoped to 1 repo of 9.** Steward still `TBD`. **Recommendation, now backed by 8: fire the rot
  sweep at close as a matter of course, and give it a steward.**
- **The Audit Progress & Roadmap banner · 3 drifts · 07-26 · STRUCTURAL.** A hand-maintained prose
  mirror of a queryable field (the Index's Audit Status) — the two-claimants pattern Michael collapses
  on sight. **Recommendation when next raised: retire the prose resume-point, point at the Audit
  Frontier Scan view.** Surfaced 07-26, not ruled.
- **The AI Toolkit index (ClickUp) · ongoing.** ✅ Partially closed 08-01: the hand-maintained fleet
  count was STRUCK (not refreshed). ⚠️ 08-10: it still advertises the OMR DROP door as *"a cheap queue
  append"* — **that queue is 60KB and past the write cap, so the door does not function.** Per-agent
  warnings still drift.
- ~~**Retired-manifest pointers · 3 instances**~~ ✅ **FOLDED into the top row 08-10** — a stub is a
  thing that shipped, and a pointer at it is a note claiming pending work. One pattern, not two.
  *(The 08-01 case stands as its worst instance: `roster.json` retired 07-30, **26 files still reading
  it two days later**, including every teammate's wiring check.)*

## 🧱 Recurring hurdles

- **🚨 A REPEATED "DEVIATION" IS A SPEC GAP, NOT A DISCIPLINE PROBLEM · 3 · 08-10.** Reported the same
  deviation at two consecutive closes doing the correct thing both times (07-26 → rules 26–27).
  **Third, 08-10:** Step 5 says *cut or reopen* a handoff task, but a Shape A session whose baton
  **already exists and is already current** resolves to "reopen" only implicitly. Named, not
  apologised for.
- **🚨 FALSE VERIFICATION · 2 · 08-01 · needs a gate by my own rule.** An empty read is
  indistinguishable from a clean pass. ⭐ **08-10 supplies the sharpest instance of the family and it
  is NOT a read: `session-board.md` went unwritten across ~15 writes in two repos, and the board is
  31KB and unwritable anyway — so an UNUSED gate and a BROKEN gate look identical from outside.**
  A tool's count staying flat in `usage-log.json` proves nothing on its own; noted there as
  `_unfired_note`.
- **Files growing past readability · 4 · 08-10 · ESCALATED BEYOND BUNDLES.** Blocked work outright
  (Milo ×2, 07-26); size CLAIMS proved unreliable (08-01). **08-10 is the worst: it is no longer just
  bundles.** `open-memory-requests.md` **60KB** — the fleet's entire memory-request path, unwritable ·
  `session-board.md` **31KB** on a spec that reads *empty by default* · `team-standard.md` **23.8KB**,
  past the ceiling **it defines** · Fiona's `memory.md` **19.7KB against a 10KB cap**.
  ⚠️ **Nothing measures these on a schedule** — every one was found by an agent listing a directory
  for an unrelated reason. **The Size Sweep handoff has sat in `to do` since 07-25.**
- **Silent query-tool defects (07-26).** The shape: the tool degrades silently instead of erroring.
- **Stale reads causing regressions.** Blob-API-first is locked. ⭐ **08-10: it earned its keep three
  times in one session** — Fiona's own bundle moved under her mid-session (`memory.md` 15.2 → 19.7KB)
  and `70-scripts/` moved twice. **All three caught by re-fetch, none by the board.**
- **Thin transcripts at close.** ✅ 08-10 was the inverse and worth recording: 13 lines for 13 replies,
  **but 11 landed on the channel ROOT** because no header existed until minute 197. **Completeness and
  placement are different failures and only one of them shows in a count.**

## 🔁 Doc drift that repeats structurally

- **Two claimants on one truth.** Every collapse so far came from a mirror pair drifting. **A second
  mirror is never the fix I propose.** ⚠️ **08-10, new surface: TWO DECISION LOGS for one app**, same
  title, same parent, colliding J-series (J1–J14 / J15–J18). One session backfilled "J1–J7" recording
  that the log *"finally exists."* It already existed. **Both banner-flagged, neither merged — merge
  direction is Michael's.**
- **Retirement half-done. 4 instances, escalating.** **Nothing in the house sweeps the pointers AIMED
  at a thing when that thing is retired.** Every check we own fires at creation.

## 📊 Capacity / model curve

> Record: date · model · session shape · closing capacity · recall · degradation.

- **2026-07-26 · Opus 5 · ~7.5h, 9 beats, ~60 tool calls, 5 agents + a 7-lens Workshop.** Sharp, no
  degradation, recall held. **First data point.**
- **2026-08-10 · Opus 5 · ~3h40m, 13 replies, ~70 tool calls, 1 agent (no Workshop), 7 PRs across two
  repos.** Closing capacity ~75%, **sharp** — an engine detail read at hour 2 was correctly applied at
  hour 3, and three concurrent writes were caught by habit rather than recall.
  ⭐ **New axis, and it is the useful one: recall and DISCIPLINE-ORDERING degrade independently, and
  the second one degrades at the START, not the end.** Every open-time gate that fired late (board at
  minute 191, spine header at 197) failed in the first two minutes of a session that then ran clean
  for three hours. **Capacity was never the constraint; sequencing was.**

## ✅❌ Proposals: taken vs refused

> Never re-pitch a refused idea cold. Cite the refusal and say what changed.

- **✅ TAKEN — amend `session-close.md` for standing threads** (07-26). **A proposal backed by a repeat
  count gets taken; the same proposal on a first occurrence is just a complaint.**
- **✅ TAKEN — judge the canonical artifact LAST** (07-26, Michael's call). *"Correct" for a standard is
  defined by observed downstream behaviour, not internal tidiness.*
- **❌ REFUSED — splitting the roster by class** (07-25). *(Moot since 07-30.)*
- **❌ REFUSED — new ClickUp AI Skills** (LOCKED 07-25). Tools live in git only.
- **⏳ OPEN, surfaced not ruled:** retire the Roadmap's prose resume-point · move memory-rotation from
  close-time to write-time · **NEW 08-10: fire the doc-rot sweep at close by default, widen it past one
  repo, and give it a steward (8 instances behind this one)** · **NEW 08-10: rotate the OMR queue
  BEFORE draining it — a drain reads the whole file and nothing can read 60KB whole.**

## 🤝 How I work with the others

- **Maggie** — memory is hers end to end. She posts Channel 1 first; I pull her headline without
  recomputing it.
- **Sana** — she keeps the transcript live; I work from what she left. A thin transcript is a finding I
  report, not a hole I invent through.
- **Anna** — she audits SUBJECTS across sessions; I audit the SESSION.
- **Hana** — baton content hers when seated; task mechanics mine. Soft seam, flagged.
- **Felix** — the fleet directory. ⚠️ **The board WORKS when agents write to it (07-26) — and on 08-10
  nobody did, in a session with three real collisions.**

## 🧠 Michael-patterns worth carrying

- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Keeps the reasoning, not just the outcome — strike through reversals, never delete.
- Wants the honest number. A padded close is worse than a short one.
- Corrections generalize across ALL domains and future sessions.
- Decision Logs, not prose chat, for anything being worked out.
- ⚠️ **A ZERO-STRIKE answer plus a governing note means the question was asked at the WRONG LAYER.**
  Re-ask higher up.
- ⚠️ **He catches false findings in one line and does not soften it.** Full retraction, mechanism named.
- ⚠️ **He fixes the SPEC, not the behaviour.** Bring him spec gaps, not apologies.
- ⚠️ **He checks whether a punt was really a punt** (08-01). Check the guardrail before hiding behind it.
- ⭐ **08-10: his corrections are SHORT and aimed at the METHOD, not the instance.** *"Good for
  authoring, but for run-time real build report?"* — nine words that reframed an entire pass. **He does
  not list the misses; he names the category and lets the agent find them.**

## 📌 Lineage

- 07-03 born as **Recap Rosie** → 07-04 renamed **Closing Clio** → 07-05 memory audit delegated to
  Maggie → **07-25 graduated to git-teammate** (sixth, on the §6 test) → **07-26 first close run WITH
  memory attached**, and the first amendment to my own contract driven by a repeat count.

## Pointers (never restate)

- My contract → `hooks/session-close.md` (⚠️ its `session-close.decision-log.md` is repo-resident,
  which the Decision Logs Gold Standard rule 11 flags as the wrong surface — no new `Q` blocks there)
- My data store → `usage-log.json` · report sidecar `agents/closing-clio/reports/`
- Memory curation → `super-agents/memory-maggie/` + `hooks/memory-rotation.md`
- Queues → `open-thread.md` · `open-memory-requests.md` ⚠️ **60KB, unwritable as of 08-10**
- Dedup → `hooks/task-dedup-gate.md`
- Docs-vs-HEAD rot → `hooks/doc-rot-sweep.md` · cross-agent fleet claims → `hooks/fleet-fact-sweep.md`
- **Fleet record → the 🤖 Agent Index ClickUp list** (`901328043244`).
