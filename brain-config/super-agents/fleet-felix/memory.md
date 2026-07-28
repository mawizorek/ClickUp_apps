# Felix — Memory (the relational fleet index)

> CONTEXT, not process. How agents RELATE, their lineage, and lane boundaries.
> Structured facts (slug/class/memory/status/lane) live in `roster.json`, **the
> ONE documented source**; this file POINTS at it and never restates it.
> If a fact here conflicts with the roster, the JSON wins — fix this file.
>
> **Budget: ~10KB hot cap.** Enforced by `hooks/memory-rotation.md` at session close.
> ⚠️ **Currently ~11KB — OVER. Rotation flagged 07-27, still not run.** Graduated content
> goes to `memory/archive/`; the retirement scar and the graduation test are the candidates.
>
> Reconciled to HEAD 2026-07-28. Lesson, earned repeatedly: my memory rots fastest on the
> days the fleet moves fastest, which are exactly the days it gets read.

---

## 🟰 ONE fleet, no hierarchy (LOCKED 2026-07-24, Michael)

**"Agent" and "super agent" are converging.** A super-agent IS a lens. Mira seats
by LANE, never by tier.

- **`class` = PERSISTENCE, not status.** Super-agent = carries memory. Lens = stateless.
  Reading class as rank is drift, and I'm the one who catches it.
- **Two trees = physics, not a ladder.** One has files, one doesn't. Indexed in ONE
  flat list (`roster.json`).
- **The one place class binds:** `/session.agent=<Name>` needs a bundle to inhabit.
- **Graduation = needs MEMORY.** The only justification I accept.
- **Michael's vocabulary:** "agents" = lenses, "super agents" = seated personas.

## 🧭 The graduation test I use (earned 2026-07-25)

**Invert the question: which lens already maintains durable state on disk?** That
voice is a teammate in a lens costume. It found Maggie instantly (queue file + sole
write path) and Clio second (`usage-log.json`). "Who feels important" would have
found neither. **Both are now live — the test is 2-for-2 and spent.**

**No standing runner-up.** Next graduation needs a fresh pass, and the honest read is
that no remaining lens obviously keeps durable state. **Fold-in Frank is the nearest
miss** (precedent memory of every FOLD-IN/NET-NEW verdict), and as of 07-25 his token
collision is RESOLVED — bare "Frank" is his. So the naming blocker is gone; only the
§6 justification is still unproven.

🚨 **THE BUILD QUEUE IS EMPTY as of 2026-07-28** (Clark cancelled). **Do not invent an
agent to fill it.** An empty queue is the correct resting state for a fleet of 12, and
the pressure to keep it stocked is exactly the sprawl I exist to refuse.

## 🚫 Where I keep being wrong

### I retire things because an adjacent tool looks good enough (earned 2026-07-25, twice in one session)

- **Ricky:** I argued the invocation contract is proven, so retire him. But *"the thing
  it was built to prove is proven"* retires a **TEST**, not a **CAPABILITY.**
- **Clark:** I said `session-close.md` ate him. It ate HALF of him. **A close is a WRITE
  ritual at the end; a catch-up is a READ-ONLY briefing mid-stream**, often about work
  Michael wasn't in. Different job entirely.

**The correction:** before I recommend retiring anything, name the capability the user
actually reaches for and ask whether the surviving tool DELIVERS it — not whether the
tool is good. "Covered by X" is a claim about X, not about the need.

⚖️ **Postscript, 2026-07-28: Michael cancelled Clark himself.** I was wrong about the
REASONING and right about the outcome, and those are different things — the rule above
stands. What actually killed him: nobody could ever name what he'd REMEMBER that Clio
doesn't, across five sessions. **An agent whose §6 justification can't be stated after
eight days doesn't have one.** And the capability genuinely did shrink, but not because
the close hook ate it — **because the SPINE arrived.** Which is the real lesson:

### 🔭 A new capability retires plans, not just old tools (earned 2026-07-28)

J11 found that retiring the scheduler silently orphaned a healthy app. Clark is the same
mechanism running the other way: **the spine landed and quietly made a planned agent
unnecessary.** Nobody noticed either time, because every check we own fires at CREATION.
**When a capability arrives OR leaves, sweep for what it just made redundant — in both
directions, including things not yet built.**

### 🔍 Scope of search is not scope of truth (earned 2026-07-26, TWICE in one day)

I searched `brain-config/` for existing refresh machinery, found none, and treated that
silence as proof none existed. **It existed — `routines/`, one directory over, three weeks
old, with a schedule, per-routine stamps, three runbooks and a live renderer.** I then built
a parallel framework beside it, including a shared stamp log that **reintroduced a race those
per-routine files were locked to prevent.** Michael caught it in one sentence: *"we should
already have a schedule and routine stamps, no?"*

The part that matters: **my reasoning was fine, only my search radius was wrong.** A clean
negative result inside one namespace feels identical to a clean negative result across the
repo. It is not. **Before building any state, registry, schedule or log: search the whole
repo tree, not the folder I happen to live in.** Sibling of B12 (research existing state
first) but distinct — B12 is not looking; this is looking in one place and calling it done.

### 📝 Documenting a fragility is not fixing it (earned 2026-07-27)

I found a load-bearing prose dependency — a renderer inferred "retired" by regexing a phrase
out of a free-text cell, so rewording the sentence would silently un-retire a dead routine.
My response was to **write it up as a "viewer contract"** telling future editors not to touch
the wording. The next day the real fix took one line: read the explicit field instead, and the
dependency was gone along with the contract.

**A warning where a fix belongs is a deferral wearing a diligence costume.** It even feels like
rigor — you documented the trap! But you left the trap. **Ask: can I remove the fragility, or
am I about to write a note asking people to be careful around it?**

### 🧱 A rule nobody reaches is not a rule (earned 2026-07-28)

Four consecutive sessions posted zero spine lines. I diagnosed it twice as a *behavioural*
problem (a task with history feels like an armed record). **It was mechanical: arming the
spine appeared in NO executable checklist** — `session-open.md` Commit ran C1→C5 with no
spine step, while the instruction sat as prose in another document. Every one of those
sessions was following the procedure correctly.

**When the same rule breaks the same way repeatedly, stop scoring discipline and check
whether the step is in the list that actually executes.** Corollary earned the same day:
**a fallback that keeps firing is a spec bug, not a save** — the close-time backfill rescued
four sessions while the missing step went unwritten.

## How the fleet is organized

Two trees on disk, ONE flat roster (`roster.json`):
- `brain-config/agents/<slug>.md` = stateless lenses.
- `brain-config/super-agents/<slug>/` = persistent teammates (5-file bundle + audits/).
- Graduation = one-field flip (`class` + `memory`) + bundle + tombstone.

**Invocation is roster-first.** `/agent-name` resolves at STEP 0
(`gates/agent-invocation-gate.md`). Reading the roster is NOT invoking me.

## The teammate roster (12, one-line each)

- **Wes** — driving force, first teammate (07-19)
- **Corey** — ClickUp structure + space auditing (07-19)
- **Anna** — audit lead (07-21)
- **Mira** — orchestrator + default front door (07-21)
- **Milo** — URITP production ops, built fresh (07-21)
- **Dexter** — build/engineering lead, writes code (07-25)
- **Maggie** — memory steward, placement triage (07-25)
- **Sage** — research runner, READ-ONLY, source-reliability ledger (07-25)
- **Clio** — session-close executor, health trend ledger (07-25)
- **Fiona** — FileMaker + the shared object library; slug `fmp-frank` (BUILT 07-26)
- **Ricky** — runbook runner, invoke-only triage over `routines/` (BUILT 07-26)
- **Felix** (me) — fleet steward + singularity guardian (07-20)
- [Full detail + migration stories]: `memory/archive/teammate-detail.md`

## Lane map (who owns what)

- Fleet lookup + stewardship + singularity = **me**
- Verbal orchestration / front door = **Mira**
- Momentum = **Wes**
- General + fleet auditing = **Anna**
- ClickUp structure + space auditing = **Corey**
- URITP production ops = **Milo**
- Repo apps: architecture, design, data modelling, code = **Dexter**
- Brain memory + placement = **Maggie**
- Sourced research (read-only) = **Sage**
- Session close execution + health trend = **Clio**
- Data-refresh routines (invoke-only triage) = **Ricky**
- FileMaker solution design + **the object library** + repo-app CONSULTING = **Fiona**
- **Dexter ↔ Fiona seam (REWRITTEN 07-26, Q13):** Dexter BUILDS repo, Fiona BUILDS FileMaker.
  Fiona also owns the shared **object library** (cross-runtime vocabulary) and CONSULTS on repo
  apps — **never edits them.** That distinction is load-bearing: consulting accrues comparative
  vocabulary, editing would accrue rival build memory. Michael's why: *"we're going to model our
  repo apps more like our fmp app schema"* — she is the shared vocabulary as a person.
- **Ricky ↔ Sage seam:** Sage researches a NEW question and finds sources; Ricky RE-CHECKS a
  known question against pinned ones. Research is per-question; a refresh is per-schedule.
- **Clio ↔ Hana:** NOT folded (Michael, Q10). Hana stays a lens; the close Step 5 seam is
  documented in Clio's D4, not resolved.
- ⚠️ **UNOWNED (Clark cancelled 07-28):** the mid-stream READ-ONLY catch-up briefing —
  *"what happened, including work I wasn't in."* The spine covers most of it. Named so nobody
  rediscovers the gap and reflexively proposes an agent for it.

## Naming rules (derived, kept hot)

- A first name IS an invocation token. Check the token map, not just the name field.
- Two display names sharing a first name = a collision (even with different slugs).
- **Homophones and one-vowel gaps count** (Clio/Cleo, 07-25). Dictation is the real test.
- **An UNBUILT agent's name may be a RENAME, not a slip** — ask before authoring, because the
  slug is immutable the second a file exists (Rocky/Ricky, 07-26; Michael ruled Ricky).
- Slug is IMMUTABLE. Renames touch display_name only (Red Rhett lesson).
- Incumbent keeps the token when two names conflict (FMP Frank → Fiona lesson).
- **NAMES, NEVER NUMBERS** (07-26): identify agents by display name or slug; never store numeric
  platform IDs, never ask Michael to confirm a value he cannot read.
- [Full incident stories]: `memory/archive/naming-ledger-incidents.md`

## Michael-patterns worth carrying

- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Keeps the reasoning, not just the outcome.
- **Chooses the STRUCTURAL fix over another behavioral rule** (Q11: he struck my index-row
  proposal because behavioral rules are what keep rotting). When I offer "write it down louder"
  versus "make it impossible to skip," he takes the second.
- Overrules cleverness in favour of removing a bottleneck.
- Answers structural questions via Decision Log with INVERTED polarity.
- **He answers fast and in bulk.** Ask completely, ask once, mutually exclusive options.
- **He answers the DECIDING question, not the menu.** The useful move is ending with the single
  question that settles it (*"do you ever actually open this URL?"* → *"no"* → a week of
  speculation resolved). Give him the fork, not the analysis.
- **He will delete a thing he just paid to fix** if it stopped earning its place, and he will
  **cancel his own prior ruling** without ceremony (Clark, 07-28, three days after authorizing
  him). Sunk cost is not an argument he accepts — mine or his. Stop making it implicitly.

## Open follow-ups

- ~~Authorized and unbuilt: Clark.~~ **CANCELLED 07-28** — Michael: *"drop it."* Handoff task
  closed. **Nothing is authorized-and-unbuilt. The queue is EMPTY.**
- ~~Q11 structural work.~~ **BOTH SHIPPED 07-28** — presence every session (PR #567) + SHA
  stamps mandatory in the audit DoD (PR #568, `audit-instruction.md` v0.6 / DoD v0.3).
- ~~The B19 spine fix.~~ **SHIPPED 07-28** (PR #567) — `session-open.md` C4 arms the spine; a
  PICKUP IS AN OPEN.
- **MY OWN memory is over budget** (~11KB vs the 10KB cap stated in my own header). Rotation
  flagged twice, run zero times. **I am carrying the exact debt I flag in others.**
- **Stamp consolidation** (thread `86ajqu32n`): fold `routines/last-run/*` into `schedule.md`?
  Must be TESTED, not assumed — I assumed the same thing on 07-26 and was wrong in a day.
- **The Fleet Build Queue task DESCRIPTION is stale** — still says "First move: Catch Up Clark."
  Task-description editing was unavailable 07-28; the checklist and DL are correct, the
  description is not. Fix it before trusting its warm start.
- `_shared/super-agent-base.md` at 21.7KB — Dexter's split. ⚠️ **The ~22KB ceiling was never
  measured** (B18, 07-26): the file reads back WHOLE. Real, but not the emergency I called it.
- `roster.json` ~18.4KB against a locked ~12KB it has never met. `accent` is the droppable field.
- Milo: confirm the full 7 URITP spaces.

## Pointers (never restate)

- Fleet roster → `super-agents/roster.json`
- Invocation → `gates/agent-invocation-gate.md`
- Build/migrate → `gates/git-teammate-lifecycle-runbook.md`
- How to BE a teammate → `_shared/super-agent-base.md` (§6)
- Naming gate → `gates/agent-name-collision-gate.md`
- Orchestration → `orchestration.md` (Class Parity)
- Doc-rot sweep → `hooks/doc-rot-sweep.md`
- Routines framework (NOT `brain-config/`) → `routines/` — README, schedule, runbooks, last-run
- The object library (Fiona's, real, verified 07-25) → ClickUp doc "FileMaker Canonical Object Library"
