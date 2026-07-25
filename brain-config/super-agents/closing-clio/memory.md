# Clio — Memory (the session-health trend ledger)

> CONTEXT, not process. The close procedure lives in `hooks/session-close.md`.
> This file holds the CURVE: what keeps going stale, what keeps going wrong, what
> Michael keeps refusing, and how capacity actually behaves.
>
> **Every line below is INHERITED, not earned.** Seeded at graduation 2026-07-25 from
> the lens file, the close hook, and the steward's handoff. Nothing here was observed
> by me at a close I ran with memory attached. **First real close replaces
> reconstruction with lived observation** — when I confirm an inherited line myself,
> re-label it EARNED with the date. Treat an unconfirmed inherited line as a lead, not
> a fact.
>
> **Budget: ~10KB hot cap.** Enforced by `hooks/memory-rotation.md` at close (Maggie).
> Graduated content goes to `memory/archive/`.

---

## 🧭 Why I have memory (the whole point)

A close without memory is a snapshot. A close WITH memory is a trend line. The
question I exist to answer that a stateless lens cannot: **"is this the first time,
or the fourth?"** One stale doc is a note. The same doc stale four closes running is
a structural finding with a name.

So the discipline is: every close, check the session against the ledgers below, and
report repeats **with the count**. Then write back what I learned.

## 📉 Recurring stale references (INHERITED — counts unverified)

> Format: surface · times seen · last seen · status. Increment on sight; never reset.

- **`super-agents/roster.json` vs its own slim rule** — the file has NEVER met the ~12KB
  number since the number was locked, and the note *describing* its own size was itself
  stale. A guardrail that misreports its own subject is the highest-value class of rot.
  Last seen 2026-07-25 (18.6KB). Escalated to Michael/Dexter.
- **The AI Toolkit index (ClickUp)** — carries stale git-teammate counts and stale
  per-agent warnings. Named as an open follow-up in the steward's own index, which means
  it has been known and unfixed for more than one session.
- **`registry.json` pointers** — retired to a tombstone 2026-07-25 (PR #483), but files
  kept *instructing* agents to write to it. Found in the lifecycle runbook, then the
  authoring gate, then the git-teammate audit DoD. **A retirement is not done when the
  file dies; it is done when every instruction pointing at it dies.** Check this pattern
  on the next retirement.

## 🧱 Recurring hurdles (INHERITED — counts unverified)

- **Stale reads causing regressions.** Branch/raw URLs and carried-over SHAs served old
  copies repeatedly; the fix (blob-API-first, re-fetch before every decision) is locked
  in the GitHub standard. If I log this again, the standard is being skipped, not wrong.
- **Files growing past readability.** A file that cannot be read whole cannot be safely
  edited, which has BLOCKED work outright (Dev Dexter shipped unregistered). Size is a
  correctness problem, not tidiness. Size Sally forecasts it; I notice when it bites.
- **Thin transcripts at close.** When the per-response log lags the work, close quality
  collapses and reconstruction starts. Flag the gap; never quietly paper over it.

## 🔁 Doc drift that repeats structurally

- **Two claimants on one truth.** Every collapse (registry/roster, app-index/VERSIONS.md)
  came from a mirror pair drifting. Michael collapses duplicate sources on sight — so a
  second mirror is never the fix I propose.
- **Retirement half-done.** See above. The instructions outlive the file.

## 📊 Capacity / model curve

- (empty — first entry lands at my first real close. Record: model · closing capacity ·
  recall quality · whether it degraded and when.)

## ✅❌ Proposals: taken vs refused (INHERITED framing, no entries yet)

> The point: never re-pitch a refused idea cold. Cite the refusal and say what changed.

- **REFUSED — splitting `roster.json` by class** (2026-07-25, Michael). He chose ONE slim
  flat list instead. Do not re-propose a split; the class boundary moves on every
  graduation, which is the actual reason.
- **REFUSED — new ClickUp AI Skills** (LOCKED 2026-07-25). Tools live in git only. Never
  propose a Skill front door for a git tool while the hold stands.

## 🤝 How I work with the others (INHERITED)

- **Maggie** — memory is hers end to end. I hand her the agents-present table + memory
  candidates, she posts Channel 1 first, I pull her headline into Session Health without
  recomputing it. Delegated 2026-07-05; the boundary predates both our graduations.
- **Sana** — she keeps the transcript live; I work from what she left. A thin transcript
  is a finding I report, not a hole I invent my way through.
- **Anna** — she audits SUBJECTS with a ledger across sessions; I audit the SESSION.
  Findings that need a real audit get handed to her.
- **Hana** — the baton's content is hers when she's seated; the task mechanics are mine.
  Soft seam, flagged.
- **Felix** — the fleet directory. Fleet questions go to him; I'm a row in it.

## 🧠 Michael-patterns worth carrying (INHERITED)

- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Keeps the reasoning, not just the outcome — strike through reversals, never delete them.
- Wants the honest number, not the comfortable one. A padded close is worse than a short one.
- Corrections generalize: a note from him applies across ALL domains and future sessions,
  never just the session it happened in.
- Decision Logs, not prose chat, for anything being worked out.

## 📌 Lineage (INHERITED)

- 2026-07-03 born as **Recap Rosie** (`recap-rosie.md`).
- 2026-07-04 renamed **Closing Clio**; role pinned as Session Close Auditor.
- 2026-07-05 memory audit delegated to Maggie; I post the session log only.
- 2026-07-25 **graduated to git-teammate** — sixth (Wes → Anna → Mira → Maggie → Sage → me),
  stewarded by Felix, on the §6 test: I already kept durable state on disk.

## Pointers (never restate)

- My contract → `hooks/session-close.md` (+ `session-close.decision-log.md`)
- My data store → `usage-log.json` · report sidecar `agents/closing-clio/reports/`
- Memory curation → `super-agents/memory-maggie/` + `hooks/memory-rotation.md`
- Queues → `open-thread.md` · `open-memory-requests.md`
- Dedup before cutting a handoff task → `hooks/task-dedup-gate.md`
- Docs-vs-HEAD rot → `hooks/doc-rot-sweep.md`
- How to BE a teammate → `_shared/super-agent-base.md`
- Fleet roster → `super-agents/roster.json`
