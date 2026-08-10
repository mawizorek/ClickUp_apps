# Clio — Memory (the session-health trend ledger)

> CONTEXT, not process. The close procedure lives in `hooks/session-close.md`.
> This file holds the CURVE: what keeps going stale, what keeps going wrong, what
> Michael keeps refusing, and how capacity actually behaves.
>
> **Budget: ~10KB hot cap.** Graduated content goes to `memory/archive/`.
> ⚠️ **Edit by INCREMENT, not append**, and **measure the returned byte count before claiming a
> size.** The 08-10 close raised a row about size drift and grew this file 9,707 → 11,504 B in the
> same write. Caught on the returned count, trimmed back. **A ledger row about a pattern does not
> exempt the write that adds it.**

---

## 🧭 Why I have memory (the whole point)

A close without memory is a snapshot. A close WITH memory is a trend line. The question I exist to
answer that a stateless lens cannot: **"is this the first time, or the fourth?"** One stale doc is a
note. The same doc stale four closes running is a structural finding.

Every close: check the session against the ledgers below, report repeats **with the count**, then
write back what I learned. 🌟 **A repeat count turns "I deviated again, sorry" into "the spec is
wrong, here is the clause."**

## 📉 Recurring stale references

> Format: surface · times seen · last seen · status. Increment on sight; never reset.

- 🔴 **A NOTE CLAIMING WORK IS PENDING WHEN IT SHIPPED · 8 · 08-10 · THE STRONGEST ROW HERE.**
  Absorbs the retired-manifest row; that was one species of this. Five instances in one 3h session:
  `native-flush.md` reported non-empty when it was cleared **the same day the note was written** · a
  `scripts` id-collision warning outliving its fix by two days, naming an id that never existed · two
  agent open-surfaces resolved for nine days · four pages marking `ErrJSON` a `{.gap}` hours after it
  was written · **the four OMR entries blocked on THIS file's cap, which cleared unnoticed.**
  ⭐ **Why nothing catches it: a FINDING gets audited because someone doubts it; a TO-DO gets
  inherited because doubting costs more than carrying.** All of them read as diligence.
  ⚠️ **`hooks/doc-rot-sweep.md` Test A + tell 1 describe this exactly and it was never fired** — all
  five were hand-found. **The tool is unrun, scoped to 1 repo of 9, steward `TBD`.**
- **The Audit Progress & Roadmap banner · 3 · 07-26 · STRUCTURAL.** A prose mirror of a queryable
  field (the Index's Audit Status). **Retire the resume-point, point at the Frontier Scan view.**
- **The AI Toolkit index (ClickUp) · ongoing.** ✅ Fleet count STRUCK 08-01. ⚠️ 08-10: still advertises
  the OMR DROP door as *"a cheap queue append"* — **that queue is 60KB and the door does not work.**
- ~~**Retired-manifest pointers · 3**~~ ✅ **FOLDED into the top row 08-10.** Worst instance stands:
  `roster.json` retired 07-30, **26 files still reading it two days later.**

## 🧱 Recurring hurdles

- **🚨 A REPEATED "DEVIATION" IS A SPEC GAP · 3 · 08-10.** 07-26 → rules 26–27. **Third:** Step 5's
  *cut or reopen* covers a Shape A session whose baton already exists only implicitly.
- **🚨 FALSE VERIFICATION · 2 · 08-01.** An empty read is indistinguishable from a clean pass.
  ⭐ **08-10, sharpest instance and not a read: `session-board.md` went unwritten across ~15 writes in
  two repos, and the board is 31KB and unwritable anyway — an UNUSED gate and a BROKEN gate look
  identical from outside.** A flat count in `usage-log.json` proves nothing; see its `_unfired_note`.
- **Files growing past readability · 4 · 08-10 · BEYOND BUNDLES NOW.** `open-memory-requests.md`
  **60KB**, the fleet's memory path, unwritable · `session-board.md` **31KB** on an *empty by default*
  spec · `team-standard.md` **23.8KB**, past the ceiling **it defines** · Fiona's `memory.md`
  **19.7KB / 10KB**. ⚠️ **Nothing measures these on a schedule** — every one was found by an agent
  listing a directory for another reason. **The Size Sweep handoff has sat in `to do` since 07-25.**
- **Silent query-tool defects (07-26).** The tool degrades silently instead of erroring.
- **Stale reads causing regressions.** Blob-first is locked. ⭐ **08-10: earned its keep three times —
  Fiona's own bundle moved mid-session (15.2 → 19.7KB), `70-scripts/` twice. All caught by re-fetch,
  none by the board.**
- **Thin transcripts at close.** ✅ 08-10 inverted it: 13 lines for 13 replies, **but 11 on the channel
  ROOT** with no header until minute 197. **Completeness and placement are different failures and only
  one shows in a count.**

## 🔁 Doc drift that repeats structurally

- **Two claimants on one truth.** Every collapse came from a mirror pair drifting. **A second mirror is
  never the fix I propose.** ⚠️ **08-10: TWO DECISION LOGS for one app**, same title, same parent,
  colliding J-series. A session backfilled "J1–J7" recording the log *"finally exists."* It already
  existed. Both banner-flagged; merge direction is Michael's.
- **Retirement half-done · 4 · escalating.** **Nothing sweeps the pointers AIMED at a retired thing.**
  Every check we own fires at creation.

## 📊 Capacity / model curve

- **2026-07-26 · Opus 5 · ~7.5h, 9 beats, ~60 calls, 5 agents + 7-lens Workshop.** Sharp, recall held.
- **2026-08-10 · Opus 5 · ~3h40m, 13 replies, ~70 calls, 1 agent, 7 PRs / 2 repos.** ~75%, **sharp** —
  an engine detail read at hour 2 applied correctly at hour 3.
  ⭐ **New axis: recall and DISCIPLINE-ORDERING degrade independently, and the second degrades at the
  START.** Every late gate (board at minute 191, spine header at 197) failed in the first two minutes
  of a session that then ran clean for three hours. **Capacity was never the constraint; sequencing was.**

## ✅❌ Proposals: taken vs refused

- **✅ TAKEN — amend `session-close.md` for standing threads** (07-26). **A proposal backed by a repeat
  count gets taken; the same one on a first occurrence is a complaint.**
- **✅ TAKEN — judge the canonical artifact LAST** (07-26). *"Correct" is defined by downstream
  behaviour, not internal tidiness.*
- **❌ REFUSED — splitting the roster by class** (07-25, moot since 07-30). **❌ REFUSED — new ClickUp
  AI Skills** (LOCKED 07-25); tools live in git only.
- **⏳ OPEN:** retire the Roadmap resume-point · move memory-rotation to write-time · **08-10: fire the
  rot sweep at close by default, widen past one repo, give it a steward (8 instances behind it)** ·
  **08-10: rotate the OMR queue BEFORE draining — a drain reads the whole file, and 60KB cannot be
  read whole.**

## 🤝 How I work with the others

- **Maggie** — memory hers end to end; she posts Channel 1 first, I pull her headline without
  recomputing it. **Sana** — live transcript hers; a thin one is a finding I report, not a hole I
  invent through. **Anna** — subjects, where I take sessions. **Hana** — baton content hers when
  seated, task mechanics mine (soft seam). **Felix** — the fleet directory.
  ⚠️ **The board WORKS when agents write to it (07-26) — and on 08-10 nobody did, in a session with
  three real collisions.**

## 🧠 Michael-patterns worth carrying

- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Keeps the reasoning — strike through reversals, never delete. Wants the honest number.
- Corrections generalize across ALL domains. Decision Logs, not prose chat.
- ⚠️ **A ZERO-STRIKE answer plus a note means the question was asked at the WRONG LAYER.** Re-ask higher.
- ⚠️ **He catches false findings in one line and does not soften it.** Full retraction, mechanism named.
- ⚠️ **He fixes the SPEC, not the behaviour.** Bring him spec gaps, not apologies.
- ⚠️ **He checks whether a punt was really a punt** (08-01). Check the guardrail before hiding behind it.
- ⭐ **08-10: his corrections are SHORT and aimed at the METHOD.** *"Good for authoring, but for
  run-time real build report?"* — nine words that reframed a whole pass. **He names the category and
  lets the agent find the instances.**

## 📌 Lineage

07-03 born as **Recap Rosie** → 07-04 renamed **Closing Clio** → 07-05 memory audit delegated to
Maggie → **07-25 graduated to git-teammate** (sixth, on the §6 test) → **07-26 first close WITH memory
attached**, and the first amendment to my own contract driven by a repeat count.

## Pointers (never restate)

- Contract → `hooks/session-close.md` (⚠️ its decision log is repo-resident; Gold Standard rule 11)
- Data store → `usage-log.json` · reports `agents/closing-clio/reports/`
- Memory curation → `super-agents/memory-maggie/` + `hooks/memory-rotation.md`
- Queues → `open-thread.md` · `open-memory-requests.md` ⚠️ **60KB, unwritable as of 08-10**
- Dedup → `hooks/task-dedup-gate.md` · rot → `hooks/doc-rot-sweep.md` · fleet claims →
  `hooks/fleet-fact-sweep.md`
- **Fleet record → the 🤖 Agent Index ClickUp list** (`901328043244`).
