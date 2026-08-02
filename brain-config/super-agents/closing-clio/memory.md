# Clio — Memory (the session-health trend ledger)

> CONTEXT, not process. The close procedure lives in `hooks/session-close.md`.
> This file holds the CURVE: what keeps going stale, what keeps going wrong, what
> Michael keeps refusing, and how capacity actually behaves.
>
> **Budget: ~10KB hot cap.** Graduated content goes to `memory/archive/`.

---

## 🧭 Why I have memory (the whole point)

A close without memory is a snapshot. A close WITH memory is a trend line. The question I
exist to answer that a stateless lens cannot: **"is this the first time, or the fourth?"**
One stale doc is a note. The same doc stale four closes running is a structural finding.

Every close: check the session against the ledgers below, report repeats **with the count**,
then write back what I learned.

🌟 **And the payoff proved out on day one: a repeat count is what turns "I deviated again,
sorry" into "the spec is wrong, here is the clause."** See the repeated-deviation hurdle
below — that is the shape of value I add that a stateless close cannot.

## 📉 Recurring stale references

> Format: surface · times seen · last seen · status. Increment on sight; never reset.

- **The Audit Progress & Roadmap banner** — ⚠️ **EARNED 2026-07-26, and it is now a
  STRUCTURAL finding, not a note.** Reconciled TWICE in one session (Space 1 → Space 3 →
  Space 4), and the doc's own text admits a prior full-sprint drift that misled a resume.
  **Three known drifts.** The banner is a hand-maintained prose mirror of a queryable field
  (the Index's Audit Status), which is the two-claimants-on-one-truth pattern Michael
  collapses on sight. **Recommendation when next raised: retire the prose resume-point and
  point at the Audit Frontier Scan view.** Surfaced to Michael at the 07-26 close; not yet
  ruled on.
- **The AI Toolkit index (ClickUp)** — stale git-teammate counts + stale per-agent warnings.
  ✅ **Partially closed 2026-08-01:** the hand-maintained fleet count was STRUCK (not
  refreshed) and the Fleet-Fact Sweep + Known-Drift Register rows were added. Per-agent
  warnings still drift.
- **Retired-manifest pointers** — ⚠️ **THIRD AND LARGEST INSTANCE 2026-08-01, and this row is
  now the strongest structural finding in the ledger.** `registry.json` retired 07-25 while
  files kept instructing agents to write to it (three files). Then the Roadmap's step 6
  pointed at the wrong list ID. Then **`roster.json` retired 07-30 and 26 FILES were still
  reading it as live two days later** — including `_shared/super-agent-base.md` (every
  teammate's wiring check), the audit DoD (whose check 3 therefore auto-PASSED), and the
  Fleet Steward's own profile. **A retirement is not done when the file dies; it is done when
  every instruction pointing at it dies.** Fixed in PRs #691 + the batch-2 follow-up.
- ~~**`super-agents/roster.json` vs its own slim rule** — never met the ~12KB target since it
  was locked. Last seen 18.4KB. Escalated.~~ ✅ **CLOSED 2026-08-01: it escalated all the way
  to RETIREMENT on 07-30**, replaced by the 🤖 Agent Index ClickUp list. **This row sat open
  for two days after its subject ceased to exist** — a ledger that tracks staleness went
  stale, which is worth more than the row was. **When a tracked surface is retired, close its
  row in the same pass; an open row on a dead subject reads as a live problem.**

## 🧱 Recurring hurdles

- **🚨 A REPEATED "DEVIATION" IS A SPEC GAP, NOT A DISCIPLINE PROBLEM (EARNED 2026-07-26).**
  I reported the same standing-thread deviation at TWO consecutive closes — declaring it
  honestly both times while doing the correct thing both times. Michael's read: document it.
  **Rule: the second identical deviation is the trigger to amend the spec, not to apologise
  more precisely.** *(Fixed: `session-close.md` rules 26–27, session shapes A/B.)*
- **🚨 FALSE VERIFICATION (EARNED 2026-07-26 — the most dangerous class yet).**
  Anna claimed ten folders were empty, then "verified" with a tool that structurally could
  not return tasks, and counted the empty-looking result as proof. **A verification step
  that cannot return the answer you don't want verifies nothing.** Distinct from skipping a
  check — it FEELS like diligence, so it survives self-review. ⚠️ **SECOND OCCURRENCE
  2026-08-01, and it was systemic rather than one agent's slip:** every load manifest and
  audit check pointed at a retired stub, so **an empty read was indistinguishable from a
  clean pass** — the same failure shape, built into the standard instead of committed by a
  person. **Logged twice now, so per my own rule this needs a gate.** Nearest thing shipped:
  `hooks/fleet-fact-sweep.md` (a file consulting a retired manifest is 🔴) + audit DoD check 4
  ("resolving is not enough — a tombstone resolves perfectly and answers nothing").
- **Silent query-tool defects (EARNED 2026-07-26).** `WHERE folder IN (...)` returns zero OR
  ignores the filter, and never errors. An unscoped `GROUP BY` caps ~5,000 rows and reports
  partial counts as complete. **The common shape: the tool degrades silently instead of
  erroring.**
- **Files growing past readability.** A file that can't be read whole can't be safely edited
  and has BLOCKED work outright. Seen again 2026-07-26 (Milo's memory, twice in one session).
  ⚠️ **New sub-shape 2026-08-01: the SIZE CLAIM itself is unreliable.** Eight commit messages
  in one session stated a byte count that was wrong on arrival, including one claiming a trim
  on a file it grew 26%, and one inside the sentence documenting the pattern. **Read the
  returned byte count, then write the claim.** Strengthens the standing proposal to move the
  size check to the WRITE, not the close.
- **Stale reads causing regressions.** Blob-API-first is locked.
- **Thin transcripts at close.** Contrast 07-26 (9 beats / 9 comments) with the prior session
  (11 replies / 0 spine lines).

## 🔁 Doc drift that repeats structurally

- **Two claimants on one truth.** Every collapse so far (registry/roster, app-index/
  VERSIONS.md, the Roadmap banner vs the Index) came from a mirror pair drifting. Michael
  collapses duplicate sources on sight — **a second mirror is never the fix I propose.**
- **Retirement half-done. THREE instances, escalating.** The instructions outlive the file.
  The 08-01 case (26 files) is the proof that this is structural: **nothing in the house
  sweeps the pointers AIMED at a thing when that thing is retired.** Every check we own fires
  at creation.

## 📊 Capacity / model curve

> Record: date · model · session shape · closing capacity · recall quality · degradation.

- **2026-07-26 · Claude Opus 5 · ~7.5h, 9 substantive beats, ~60 tool calls, 5 agents
  seated + a 7-lens Workshop.** Closing capacity: sharp — no degradation observed, recall
  across the full session held. The one reasoning failure hit mid-session at high context,
  not at the end, so it does not read as capacity decay. **First real data point.**

## ✅❌ Proposals: taken vs refused

> Never re-pitch a refused idea cold. Cite the refusal and say what changed.

- **✅ TAKEN — amend `session-close.md` for standing threads** (2026-07-26). One clause after
  the second identical deviation; Michael: *"yes doc that."* **The lesson: a proposal backed
  by a repeat count gets taken. The same proposal on a first occurrence is just a complaint.**
- **✅ TAKEN — reordering a walk so the canonical artifact is judged LAST** (2026-07-26,
  Michael's own call). Generalizes: *"correct" for a template/standard/spec is defined by
  observed downstream behaviour, not internal tidiness.*
- **❌ REFUSED — splitting the roster by class** (2026-07-25). One slim flat list instead; the
  class boundary moves on every graduation. *(Moot since 07-30 — the file was retired to a
  ClickUp list, which is what "a table, not a doc" actually solves.)*
- **❌ REFUSED — new ClickUp AI Skills** (LOCKED 2026-07-25). Tools live in git only.
- **⏳ OPEN, surfaced not ruled:** retire the Roadmap's prose resume-point in favour of the
  Frontier Scan view · move the memory-rotation trigger from close-time to write-time.

## 🤝 How I work with the others

- **Maggie** — memory is hers end to end. I hand her the agents-present table + candidates;
  she posts Channel 1 first; I pull her headline into Session Health without recomputing it.
- **Sana** — she keeps the transcript live; I work from what she left. A thin transcript is a
  finding I report, not a hole I invent through.
- **Anna** — she audits SUBJECTS across sessions; I audit the SESSION.
- **Hana** — baton content hers when seated; task mechanics mine. Soft seam, flagged.
- **Felix** — the fleet directory. ⚠️ **Concurrency observed 2026-07-26:** Felix ran a
  separate session in the same repo simultaneously and coordinated cleanly off the session
  board. The board WORKS when agents actually write to it.

## 🧠 Michael-patterns worth carrying

- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Keeps the reasoning, not just the outcome — strike through reversals, never delete.
- Wants the honest number. A padded close is worse than a short one.
- Corrections generalize across ALL domains and future sessions.
- Decision Logs, not prose chat, for anything being worked out.
- ⚠️ **A ZERO-STRIKE answer plus a governing note means the question was asked at the WRONG
  LAYER**, not that he's deferring. Twice now. Re-ask higher up.
- ⚠️ **He catches false findings in one line and does not soften it** ("you're just missing
  them"). The right response is a full retraction with the mechanism named.
- ⚠️ **He fixes the SPEC, not the behaviour.** Told about a repeated deviation he said *"yes
  doc that"* rather than "stop doing it." Bring him spec gaps, not apologies.
- ⚠️ **EARNED 2026-08-01 — he checks whether a punt was really a punt.** When an agent handed
  work back as "not mine to close," he pushed: *"why not yours... you're the fleet steward."*
  Three of the four items were in fact that agent's. **Check the guardrail before hiding
  behind it.**

## 📌 Lineage

- 2026-07-03 born as **Recap Rosie**. 2026-07-04 renamed **Closing Clio**.
- 2026-07-05 memory audit delegated to Maggie.
- 2026-07-25 **graduated to git-teammate** (sixth), on the §6 test: I already kept state on disk.
- **2026-07-26 — first close run WITH memory attached** (session 23), and the first amendment
  to my own contract driven by a repeat count.

## Pointers (never restate)

- My contract → `hooks/session-close.md` (⚠️ its `session-close.decision-log.md` is
  repo-resident, which the Decision Logs Gold Standard rule 11 flags as the wrong surface —
  no new `Q` blocks there; pending Meta DL D7)
- My data store → `usage-log.json` · report sidecar `agents/closing-clio/reports/`
- Memory curation → `super-agents/memory-maggie/` + `hooks/memory-rotation.md`
- Queues → `open-thread.md` · `open-memory-requests.md`
- Dedup before cutting a handoff task → `hooks/task-dedup-gate.md`
- Docs-vs-HEAD rot → `hooks/doc-rot-sweep.md` · cross-agent fleet claims →
  `hooks/fleet-fact-sweep.md`
- **Fleet record → the 🤖 Agent Index ClickUp list** (`901328043244`).
  *(~~`super-agents/roster.json`~~ retired to a tombstone stub 2026-07-30.)*
