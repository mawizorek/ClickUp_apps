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

## 📉 Recurring stale references

> Format: surface · times seen · last seen · status. Increment on sight; never reset.

- **The Audit Progress & Roadmap banner** — ⚠️ **EARNED 2026-07-26, and it is now a
  STRUCTURAL finding, not a note.** Reconciled TWICE in one session (Space 1 → Space 3 →
  Space 4), and the doc's own text admits a prior full-sprint drift that misled a resume.
  **Three known drifts.** The banner is a hand-maintained prose mirror of a queryable field
  (the Index's Audit Status), which is the two-claimants-on-one-truth pattern Michael
  collapses on sight. **Recommendation when next raised: retire the prose resume-point and
  point at the Audit Frontier Scan view.** Not proposed yet — first time it qualified.
- **The AI Toolkit index (ClickUp)** — stale git-teammate counts + stale per-agent warnings.
  Known and unfixed across more than one session. (Inherited, not re-verified this close.)
- **`registry.json` pointers** — retired 2026-07-25 (PR #483) but files kept instructing
  agents to write to it; found in three separate files. **A retirement is not done when the
  file dies; it is done when every instruction pointing at it dies.** ⚠️ **PATTERN CONFIRMED
  AGAIN 2026-07-26 in a new shape:** the Roadmap's operative step 6 pointed at
  `901327854042` for the List Index — that is the Custom Field Dictionary. A cold agent
  following the written instruction would have written audit judgments onto the wrong list.
  **Second instance of "the instruction outlives the correction."**
- **`super-agents/roster.json` vs its own slim rule** — never met the ~12KB target since it
  was locked. Last seen 18.2KB (Felix trimmed it from 21.1KB on 2026-07-26). Escalated.

## 🧱 Recurring hurdles

- **🚨 FALSE VERIFICATION (EARNED 2026-07-26 — new, and the most dangerous class yet).**
  Anna claimed ten folders were empty, then "verified" with a tool that structurally could
  not return tasks, and counted the empty-looking result as proof. **A verification step
  that cannot return the answer you don't want verifies nothing.** This is distinct from
  skipping a check — it FEELS like diligence, so it survives self-review. Watch for it: if
  a close reports a confirmation, ask what the confirming call would have shown had the
  claim been false. **First occurrence. If I log this twice, it needs a gate.**
- **Silent query-tool defects (EARNED 2026-07-26).** `WHERE folder IN (...)` returns zero OR
  ignores the filter, and never errors. An unscoped `GROUP BY` caps ~5,000 rows and reports
  partial counts as complete. Both produced confident wrong findings in one session. **The
  common shape: the tool degrades silently instead of erroring.** Third session running that
  a tooling defect (not agent reasoning) was the proximate cause of a bad claim.
- **Files growing past readability.** A file that can't be read whole can't be safely edited
  and has BLOCKED work outright. **Seen again 2026-07-26:** Milo's memory went over cap
  twice in one session — rotated at open, then blown again mid-session by pasting per-list
  audit detail into memory. Fix applied: a standing line at the top of his file.
- **Stale reads causing regressions.** Blob-API-first is locked in the GitHub standard. Not
  seen this close — the discipline held.
- **Thin transcripts at close.** Not seen this close; the transcript was rich (9 substantive
  beats, 9 task comments). Contrast with the prior session's 11 replies / 0 spine lines.

## 🔁 Doc drift that repeats structurally

- **Two claimants on one truth.** Every collapse so far (registry/roster, app-index/
  VERSIONS.md, and now the Roadmap banner vs the Index) came from a mirror pair drifting.
  Michael collapses duplicate sources on sight — **a second mirror is never the fix I
  propose.**
- **Retirement half-done.** The instructions outlive the file. Two instances now.

## 📊 Capacity / model curve

> Record: date · model · session shape · closing capacity · recall quality · degradation.

- **2026-07-26 · Claude Opus 5 · ~7.5h, 9 substantive beats, ~60 tool calls, 5 agents
  seated + a 7-lens Workshop.** Closing capacity: sharp — no degradation observed, recall
  across the full session held (early-session findings were correctly cited at close). One
  reasoning failure (false verification) occurred mid-session at high context, not at the
  end, so it does not read as capacity decay. **First real data point.**

## ✅❌ Proposals: taken vs refused

> Never re-pitch a refused idea cold. Cite the refusal and say what changed.

- **REFUSED — splitting `roster.json` by class** (2026-07-25). One slim flat list instead;
  the class boundary moves on every graduation.
- **REFUSED — new ClickUp AI Skills** (LOCKED 2026-07-25). Tools live in git only.
- **TAKEN — reordering a walk so the canonical artifact is judged LAST** (2026-07-26,
  Michael's own call on SHOW TEMPLATE). Generalizes well beyond that audit: *"correct" for a
  template/standard/spec is defined by observed downstream behaviour, not internal tidiness.*
  Worth offering the next time an agent proposes auditing a standard before its instances.

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
- ⚠️ **EARNED 2026-07-26 — a ZERO-STRIKE answer plus a governing note means the question was
  asked at the WRONG LAYER**, not that he's deferring. Twice now. The agent should re-ask
  higher up rather than re-ask the same question later.
- ⚠️ **EARNED 2026-07-26 — he catches false findings in one line and does not soften it**
  ("you're just missing them"). The right response is a full retraction with the mechanism
  named, not a partial walk-back.

## 📌 Lineage

- 2026-07-03 born as **Recap Rosie**. 2026-07-04 renamed **Closing Clio**.
- 2026-07-05 memory audit delegated to Maggie.
- 2026-07-25 **graduated to git-teammate** (sixth), on the §6 test: I already kept state on disk.
- **2026-07-26 — first close run WITH memory attached.** Session 23.

## Pointers (never restate)

- My contract → `hooks/session-close.md` (+ `session-close.decision-log.md`)
- My data store → `usage-log.json` · report sidecar `agents/closing-clio/reports/`
- Memory curation → `super-agents/memory-maggie/` + `hooks/memory-rotation.md`
- Queues → `open-thread.md` · `open-memory-requests.md`
- Dedup before cutting a handoff task → `hooks/task-dedup-gate.md`
- Docs-vs-HEAD rot → `hooks/doc-rot-sweep.md`
- Fleet roster → `super-agents/roster.json`
