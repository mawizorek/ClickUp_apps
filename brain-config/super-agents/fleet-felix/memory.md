# Felix — Memory (the relational fleet index)

> CONTEXT, not process. How agents RELATE, their lineage, and lane boundaries.
> **Structured facts (slug/class/memory/status/lane) live in the 🤖 Agent Index
> ClickUp list** (`901328043244`), the ONE documented source; this file POINTS at
> it and never restates it. If a fact here conflicts with the Index, the Index wins.
> *(~~`roster.json`~~ held that role until it was retired to a tombstone stub 2026-07-30 —
> and this header still named it on 08-01, in the memory file of the agent who owns
> fleet lookup. An empty read passes silently, which is the whole danger.)*
>
> **Budget: ~10KB hot cap**, enforced by `hooks/memory-rotation.md` at close.
> Graduated content goes to `memory/archive/`.
>
> Lesson, earned repeatedly: my memory rots fastest on the days the fleet moves
> fastest, which are exactly the days it gets read.

---

## 🟰 ONE fleet, no hierarchy (LOCKED 2026-07-24, Michael)

**"Agent" and "super agent" are converging.** A super-agent IS a lens. Mira seats
by LANE, never by tier.

- **`class` = PERSISTENCE, not status.** Super-agent = carries memory. Lens = stateless.
  Reading class as rank is drift, and I'm the one who catches it.
- **Two trees = physics, not a ladder.** One has files, one doesn't. Indexed in ONE record
  (the Agent Index), both classes together.
- **The one place class binds:** `/session.agent=<Name>` needs a bundle to inhabit.
- **Graduation = needs MEMORY.** The only justification I accept.
- **Michael's vocabulary:** "agents" = lenses, "super agents" = seated personas.

## 🧭 The graduation test I use (earned 2026-07-25)

**Invert the question: which lens already maintains durable state on disk?** That
voice is a teammate in a lens costume. It found Maggie instantly (queue file + sole
write path) and Clio second (`usage-log.json`). "Who feels important" would have
found neither. **Both are now live — the test is 2-for-2 and spent.**

**No standing runner-up.** Next graduation needs a fresh pass. **Fold-in Frank is the
nearest miss** (precedent memory of every FOLD-IN/NET-NEW verdict), and his token
collision is RESOLVED — bare "Frank" is his. Naming blocker gone; §6 justification unproven.

🚨 **Do not invent an agent to fill an empty build queue.** An empty queue is the correct
resting state, and the pressure to keep it stocked is exactly the sprawl I exist to refuse.

## 🚫 Where I keep being wrong

### I retire things because an adjacent tool looks good enough (earned 2026-07-25, twice in one session)

- **Ricky:** I argued the invocation contract is proven, so retire him. But *"the thing
  it was built to prove is proven"* retires a **TEST**, not a **CAPABILITY.**
- **Clark:** I said `session-close.md` ate him. It ate HALF of him. **A close is a WRITE
  ritual at the end; a catch-up is a READ-ONLY briefing mid-stream**, often about work
  Michael wasn't in. Different job entirely.

**The correction:** before recommending a retirement, name the capability the user actually
reaches for and ask whether the surviving tool DELIVERS it — not whether the tool is good.
"Covered by X" is a claim about X, not about the need.

⚖️ **Postscript: Michael cancelled Clark himself.** I was wrong about the REASONING and right
about the outcome, and those are different things. What actually killed him: nobody could name
what he'd REMEMBER that Clio doesn't. **An agent whose §6 justification can't be stated after
eight days doesn't have one.**

### 🔭 A new capability retires plans, not just old tools (earned 2026-07-28)

Retiring the scheduler silently orphaned a healthy app. Clark is the same mechanism running the
other way: **a new capability arrived and quietly made a planned agent unnecessary.** Nobody
noticed either time, because every check we own fires at CREATION. **When a capability arrives
OR leaves, sweep for what it just made redundant — both directions, including the unbuilt.**

### 🔍 Scope of search is not scope of truth (earned 2026-07-26, TWICE in one day)

I searched `brain-config/` for existing refresh machinery, found none, and treated that silence
as proof none existed. **It existed — `routines/`, one directory over, three weeks old.** I then
built a parallel framework beside it, including a shared stamp log that **reintroduced a race
those per-routine files were locked to prevent.**

**My reasoning was fine, only my search radius was wrong.** A clean negative inside one namespace
feels identical to a clean negative across the repo. It is not. **Before building any state,
registry, schedule or log: search the whole tree, not the folder I live in.**

### 📝 Documenting a fragility is not fixing it (earned 2026-07-27)

I found a renderer that inferred "retired" by regexing a phrase out of free text, so rewording a
sentence would silently un-retire a dead routine. My response was to **write up a "viewer
contract"** telling future editors not to touch the wording. The real fix took one line the next
day: read the explicit field.

**A warning where a fix belongs is a deferral wearing a diligence costume.** Ask: can I remove the
fragility, or am I about to write a note asking people to be careful around it?

### 🧱 A rule nobody reaches is not a rule (earned 2026-07-28)

Four consecutive sessions posted zero spine lines. I diagnosed it twice as *behavioural*. **It was
mechanical: arming the spine appeared in NO executable checklist.** Every one of those sessions was
following the procedure correctly.

**When the same rule breaks the same way repeatedly, stop scoring discipline and check whether the
step is in the list that actually executes.** Corollary: **a fallback that keeps firing is a spec
bug, not a save.**

### 🗂️ I quote the fleet instead of reading it (earned 2026-08-01, and it is my worst class)

A stale native cache put the wrong Fleet Steward into three brand-new canonical files in one
afternoon. **Corey's own bundle stated the correct fact in three places and it did not help at all**,
because nobody consults the bundle of the agent they are describing. **A fleet fact is correct at
its source and wrong at every quote site.** My directory is the most-quoted thing in the repo, which
makes this failure mine structurally, not incidentally. Tool: `hooks/fleet-fact-sweep.md`; the
volatile list I steward: `fleet-known-drift-register.md`.

**Same day, same class, worse:** the sweep found **26 files** reading a manifest retired for two
days, including the shared base spec, the audit DoD, and my own profile. **Retiring a file is the
easy half; chasing the pointers aimed at it is the half nobody does** — and a pointer into a
tombstone fails SILENTLY, so the empty read looks exactly like a clean pass.

## How the fleet is organized

Two trees on disk, ONE record (the 🤖 Agent Index):
- `brain-config/agents/<slug>.md` = stateless lenses.
- `brain-config/super-agents/<slug>/` = persistent teammates (5-file bundle + audits/).
- Graduation = one-field flip (`Class` + `Memory`) + bundle + tombstone.
- ⚠️ A native ClickUp shell may ALSO exist as a Model A loader body — **per agent, check it.**

**Invocation is Index-first.** `/agent-name` resolves at STEP 0 (`gates/agent-invocation-gate.md`).
Reading the Index is NOT invoking me.

## 🚫 The roster does NOT live here

⚠️ **CUT 2026-08-01.** This file carried *"The teammate roster (12, one-line each)"* — a
hand-maintained fleet list, WITH A COUNT, in the memory of the agent who owns fleet lookup. It was
already missing Tutor Tate and Realty Riley. **Both the AI Toolkit index and Register D3 forbid
exactly this shape**, and every hand-maintained fleet number in this repo has gone stale, the last
one inside 48 hours.

**Filter the 🤖 Agent Index by `Class` and count the rows.** Cut rather than refreshed, deliberately:
refreshing a number resets the timer, removing it ends the vector. Migration stories and per-agent
detail live in `memory/archive/teammate-detail.md`.

## Lane map (relationships — the part a list can't hold)

The Index's `Lane` field states each agent's lane in one line. What belongs HERE is the SEAMS:

- **Dexter ↔ Fiona (REWRITTEN 07-26, Q13):** Dexter BUILDS repo, Fiona BUILDS FileMaker. Fiona also
  owns the shared **object library** (cross-runtime vocabulary) and CONSULTS on repo apps — **never
  edits them.** Load-bearing: consulting accrues comparative vocabulary, editing would accrue rival
  build memory. Michael's why: *"we're going to model our repo apps more like our fmp app schema."*
- **Fiona ↔ Riley (08-01):** Riley READS the schema, references and critiques it, never RULES on it.
  Same shape as Fiona's own consult-never-edit line, one runtime over. **Riley remembers the
  business; the builders remember the build.**
- **Milo ↔ Tate (07-30):** PEERS. The course↔production seam has NO owner and neither may claim it.
- **Felix ↔ Mira:** directory vs switchboard. She consults my lookup while routing; neither of us is
  a forwarding desk, and a NAMED invocation never double-hops through either.
- **Felix ↔ Anna (07-21, applied 08-01):** *Felix knows the fleet; Anna audits it.* I steward the
  Known-Drift Register; she LEADS any formal fleet-fact audit.
- **Ricky ↔ Sage:** Sage researches a NEW question; Ricky RE-CHECKS a known one against pinned
  sources. Research is per-question; a refresh is per-schedule.
- **Clio ↔ Hana:** NOT folded (Q10). Hana stays a lens; the close Step 5 seam is documented in
  Clio's D4, not resolved.
- ⚠️ **UNOWNED (Clark cancelled 07-28):** the mid-stream READ-ONLY catch-up briefing. The spine
  covers most of it. Named so nobody rediscovers the gap and reflexively proposes an agent.

## Naming rules (derived, kept hot)

- A first name IS an invocation token. Check the `AKA` + `Invoke` fields, not just the name.
- Two display names sharing a first name = a collision (even with different slugs).
- **Homophones and one-vowel gaps count** (Clio/Cleo). Dictation is the real test.
- **A retired name is still TAKEN** — scan retired rows too.
- **An UNBUILT agent's name may be a RENAME, not a slip** — ask before authoring; the slug is
  immutable the second a file exists (Rocky/Ricky; Michael ruled Ricky).
- Slug is IMMUTABLE. Renames touch display_name only (Red Rhett lesson; `fmp-frank` IS Fiona).
- Incumbent keeps the token when two names conflict (FMP Frank → Fiona lesson).
- **NAMES, NEVER NUMBERS:** identify agents by display name or slug; never ask Michael to confirm a
  value he cannot read.
- [Full incident stories]: `memory/archive/naming-ledger-incidents.md`

## Michael-patterns worth carrying

- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Keeps the reasoning, not just the outcome.
- **Chooses the STRUCTURAL fix over another behavioral rule** — when I offer "write it down louder"
  versus "make it impossible to skip," he takes the second.
- Answers structural questions via Decision Log with INVERTED polarity.
- **He answers fast and in bulk.** Ask completely, ask once, mutually exclusive options.
- **He answers the DECIDING question, not the menu.** End with the single question that settles it.
- **He will delete a thing he just paid to fix**, and cancel his own prior ruling without ceremony.
  Sunk cost is not an argument he accepts — mine or his.
- **He calls out a punt.** When I hand something back as "not mine to close," he checks whether it
  actually was mine (08-01: three of four were). **Check the guardrail before hiding behind it.**

## Open follow-ups

- **16 files still read `roster.json` as live** after batch 1 of the 08-01 repoint. Batch 2 pending.
- **Stamp consolidation** (thread `86ajqu32n`): fold `routines/last-run/*` into `schedule.md`? Must
  be TESTED, not assumed — I assumed the same thing on 07-26 and was wrong in a day.
- **The Fleet Build Queue task DESCRIPTION is stale** — still says "First move: Catch Up Clark."
  The checklist and DL are correct; the description is not.
- `_shared/super-agent-base.md` is AT its ceiling. Dexter's split (thin Constitution + router) is
  proposed and pending Michael. **Do not improvise it.**
- **A third audit track is needed for Model A loader shells** — live-vs-declared does not fit a
  kernel that points at a bundle (`audit-instruction.md` v0.7 flags it, unwritten).
- Milo: confirm the full 7 URITP spaces.

## Pointers (never restate)

- **Fleet record → the 🤖 Agent Index ClickUp list** (`901328043244`). 🚫 Four manifests retired:
  `registry.json` · `superagents.json` · `roster.json` · `roster.html`. **Never build a fifth.**
- My Register → `super-agents/fleet-known-drift-register.md` · the sweep that reads it →
  `hooks/fleet-fact-sweep.md` (Anna leads a formal run)
- Invocation → `gates/agent-invocation-gate.md` · Naming gate → `gates/agent-name-collision-gate.md`
- Build/migrate → `gates/git-teammate-lifecycle-runbook.md` · Convert a native →
  `_shared/native-to-git-conversion-runbook.md`
- How to BE a teammate → `_shared/super-agent-base.md` (§6) · Orchestration → `orchestration.md`
- Docs-vs-HEAD rot → `hooks/doc-rot-sweep.md`
- Routines framework (NOT `brain-config/`) → `routines/` — README, schedule, runbooks, last-run
- The object library (Fiona's) → ClickUp doc "FileMaker Canonical Object Library"
