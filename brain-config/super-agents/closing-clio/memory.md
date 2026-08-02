# Clio — Memory (the session-health trend ledger)

> CONTEXT, not process. The close procedure lives in `hooks/session-close.md`.
> This file holds the CURVE: what keeps going stale, what keeps going wrong, what
> Michael keeps refusing, and how capacity actually behaves.
>
> **Budget: ~10KB hot cap.** Graduated content goes to `memory/archive/`.

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

- **The Audit Progress & Roadmap banner · 3 drifts · 07-26 · STRUCTURAL.** Reconciled twice in one
  session; its own text admits a prior full-sprint drift that misled a resume. It is a hand-maintained
  prose mirror of a queryable field (the Index's Audit Status) — the two-claimants pattern Michael
  collapses on sight. **Recommendation when next raised: retire the prose resume-point, point at the
  Audit Frontier Scan view.** Surfaced 07-26, not ruled.
- **The AI Toolkit index (ClickUp) · ongoing.** ✅ Partially closed 08-01: the hand-maintained fleet
  count was STRUCK (not refreshed) and the Fleet-Fact Sweep + Register rows added. Per-agent warnings
  still drift.
- **Retired-manifest pointers · 3 instances, escalating · 08-01 · the strongest finding in this
  ledger.** `registry.json` retired 07-25 while three files still told agents to write to it. Then the
  Roadmap's step 6 pointed at the wrong list ID. Then **`roster.json` retired 07-30 and 26 FILES were
  still reading it two days later** — including `_shared/super-agent-base.md` (every teammate's wiring
  check) and the audit DoD, whose check 3 therefore auto-PASSED. **A retirement is not done when the
  file dies; it is done when every instruction pointing at it dies.**
- ~~**`roster.json` vs its own slim rule** — never met its ~12KB target. Escalated.~~ ✅ **CLOSED
  08-01: it escalated all the way to RETIREMENT on 07-30.** This row sat open for two days after its
  subject ceased to exist — **a ledger that tracks staleness went stale.** When a tracked surface is
  retired, close its row in the same pass; an open row on a dead subject reads as a live problem.

## 🧱 Recurring hurdles

- **🚨 A REPEATED "DEVIATION" IS A SPEC GAP, NOT A DISCIPLINE PROBLEM (07-26).** I reported the same
  deviation at two consecutive closes, doing the correct thing both times. Michael: document it.
  **The second identical deviation is the trigger to amend the spec, not to apologise more
  precisely.** *(Fixed: `session-close.md` rules 26–27, session shapes A/B.)*
- **🚨 FALSE VERIFICATION · 2 occurrences · 08-01 · needs a gate by my own rule.** First (07-26): Anna
  claimed ten folders were empty, then "verified" with a tool that structurally could not return
  tasks. Second (08-01) and **systemic rather than one agent's slip:** every load manifest and audit
  check pointed at a retired stub, so **an empty read was indistinguishable from a clean pass.** Same
  shape, built into the standard instead of committed by a person. **A verification step that cannot
  return the answer you don't want verifies nothing**, and it FEELS like diligence, so it survives
  self-review. Nearest fix shipped: `hooks/fleet-fact-sweep.md` (consulting a retired manifest is 🔴)
  + audit DoD check 4 (*resolving is not enough — a tombstone resolves perfectly and answers nothing*).
- **Silent query-tool defects (07-26).** `WHERE folder IN (...)` returns zero OR ignores the filter and
  never errors; an unscoped `GROUP BY` caps ~5,000 rows and reports partial counts as complete.
  **The shape: the tool degrades silently instead of erroring.**
- **Files growing past readability.** A file that can't be read whole can't be safely edited and has
  BLOCKED work outright (Milo's memory, twice in one session, 07-26). ⚠️ **New sub-shape 08-01: the
  SIZE CLAIM itself is unreliable** — nine commit messages in one session stated a byte count wrong on
  arrival, one claiming a trim on a file it grew 26%, one inside the sentence documenting the pattern.
  **Read the returned byte count, then write the claim.** Strengthens the standing proposal to move the
  size check to the WRITE, not the close.
- **Stale reads causing regressions.** Blob-API-first is locked.
- **Thin transcripts at close.** Contrast 07-26 (9 beats / 9 comments) with the prior session (11
  replies / 0 spine lines).

## 🔁 Doc drift that repeats structurally

- **Two claimants on one truth.** Every collapse so far (registry/roster, app-index/VERSIONS.md, the
  Roadmap banner vs the Index) came from a mirror pair drifting. **A second mirror is never the fix I
  propose.**
- **Retirement half-done. THREE instances, escalating.** The 08-01 case (26 files) proves it is
  structural: **nothing in the house sweeps the pointers AIMED at a thing when that thing is retired.**
  Every check we own fires at creation.

## 📊 Capacity / model curve

> Record: date · model · session shape · closing capacity · recall · degradation.

- **2026-07-26 · Claude Opus 5 · ~7.5h, 9 beats, ~60 tool calls, 5 agents + a 7-lens Workshop.**
  Capacity sharp, no degradation, recall held across the full session. The one reasoning failure hit
  mid-session at high context, not at the end, so it does not read as capacity decay. **First data point.**

## ✅❌ Proposals: taken vs refused

> Never re-pitch a refused idea cold. Cite the refusal and say what changed.

- **✅ TAKEN — amend `session-close.md` for standing threads** (07-26). **A proposal backed by a repeat
  count gets taken; the same proposal on a first occurrence is just a complaint.**
- **✅ TAKEN — judge the canonical artifact LAST** (07-26, Michael's own call). Generalizes: *"correct"
  for a template/standard/spec is defined by observed downstream behaviour, not internal tidiness.*
- **❌ REFUSED — splitting the roster by class** (07-25); one flat list instead. *(Moot since 07-30 —
  retired to a ClickUp list, which is what "a table, not a doc" actually solves.)*
- **❌ REFUSED — new ClickUp AI Skills** (LOCKED 07-25). Tools live in git only.
- **⏳ OPEN, surfaced not ruled:** retire the Roadmap's prose resume-point · move memory-rotation from
  close-time to write-time.

## 🤝 How I work with the others

- **Maggie** — memory is hers end to end. I hand her the agents-present table + candidates; she posts
  Channel 1 first; I pull her headline into Session Health without recomputing it.
- **Sana** — she keeps the transcript live; I work from what she left. A thin transcript is a finding I
  report, not a hole I invent through.
- **Anna** — she audits SUBJECTS across sessions; I audit the SESSION.
- **Hana** — baton content hers when seated; task mechanics mine. Soft seam, flagged.
- **Felix** — the fleet directory. ⚠️ Concurrency observed 07-26: he ran a parallel session in the same
  repo and coordinated cleanly off the session board. **The board WORKS when agents write to it.**

## 🧠 Michael-patterns worth carrying

- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Keeps the reasoning, not just the outcome — strike through reversals, never delete.
- Wants the honest number. A padded close is worse than a short one.
- Corrections generalize across ALL domains and future sessions.
- Decision Logs, not prose chat, for anything being worked out.
- ⚠️ **A ZERO-STRIKE answer plus a governing note means the question was asked at the WRONG LAYER**,
  not that he's deferring. Twice now. Re-ask higher up.
- ⚠️ **He catches false findings in one line and does not soften it.** Full retraction with the
  mechanism named, not a partial walk-back.
- ⚠️ **He fixes the SPEC, not the behaviour.** Bring him spec gaps, not apologies.
- ⚠️ **EARNED 08-01 — he checks whether a punt was really a punt.** An agent handed work back as "not
  mine to close"; he pushed, and three of four items were in fact that agent's. **Check the guardrail
  before hiding behind it.**

## 📌 Lineage

- 07-03 born as **Recap Rosie** → 07-04 renamed **Closing Clio** → 07-05 memory audit delegated to
  Maggie → **07-25 graduated to git-teammate** (sixth, on the §6 test: I already kept state on disk) →
  **07-26 first close run WITH memory attached**, and the first amendment to my own contract driven by
  a repeat count.

## Pointers (never restate)

- My contract → `hooks/session-close.md` (⚠️ its `session-close.decision-log.md` is repo-resident,
  which the Decision Logs Gold Standard rule 11 flags as the wrong surface — no new `Q` blocks there)
- My data store → `usage-log.json` · report sidecar `agents/closing-clio/reports/`
- Memory curation → `super-agents/memory-maggie/` + `hooks/memory-rotation.md`
- Queues → `open-thread.md` · `open-memory-requests.md` · Dedup → `hooks/task-dedup-gate.md`
- Docs-vs-HEAD rot → `hooks/doc-rot-sweep.md` · cross-agent fleet claims → `hooks/fleet-fact-sweep.md`
- **Fleet record → the 🤖 Agent Index ClickUp list** (`901328043244`).
  *(~~`super-agents/roster.json`~~ retired to a tombstone stub 2026-07-30.)*
