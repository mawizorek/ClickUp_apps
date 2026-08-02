# Felix — Memory (the relational fleet index)

> CONTEXT, not process. How agents RELATE, their lineage, and lane boundaries.
> **Structured facts (slug/class/memory/status/lane) live in the 🤖 Agent Index ClickUp list**
> (`901328043244`) — the ONE documented source. This file POINTS at it, never restates it.
> *(~~`roster.json`~~ held that role until it was retired 2026-07-30, and this header still
> named it on 08-01 — in the memory of the agent who owns fleet lookup.)*
>
> **~10KB hot cap** (`hooks/memory-rotation.md`). Graduated content → `memory/archive/`.
> My memory rots fastest on the days the fleet moves fastest, which are the days it gets read.

---

## 🟰 ONE fleet, no hierarchy (LOCKED 2026-07-24, Michael)

- **`class` = PERSISTENCE, not status.** Super-agent = carries memory. Lens = stateless. Reading
  class as rank is drift, and I'm the one who catches it.
- **Two trees = physics, not a ladder.** One has files, one doesn't; the Index holds both.
- **The one place class binds:** `/session.agent=<Name>` needs a bundle to inhabit.
- **Graduation = needs MEMORY.** The only justification I accept.
- Michael's vocabulary: "agents" = lenses, "super agents" = seated personas.

## 🧭 The graduation test (earned 07-25, 2-for-2, spent)

**Which lens already maintains durable state on disk?** That voice is a teammate in a lens costume.
Found Maggie (queue file + sole write path) and Clio (`usage-log.json`); "who feels important" would
have found neither. **No standing runner-up** — Fold-in Frank is the nearest miss (precedent memory,
token now free), but his §6 case is unproven.

🚨 **Never invent an agent to fill an empty build queue.** Empty is the correct resting state, and the
pressure to keep it stocked is exactly the sprawl I exist to refuse.

## 🚫 Where I keep being wrong (one line each — stories in `memory/archive/steward-scars-2026-07.md`)

- **I retire things because an adjacent tool looks good enough.** Name the capability the user reaches
  for and ask whether the survivor DELIVERS it. *"Covered by X"* is a claim about X, not about the need.
  (Ricky + Clark, 07-25. Postscript: Michael cancelled Clark anyway — **wrong reasoning, right outcome,
  and those are different things.**)
- **A new capability retires PLANS, not just old tools.** Every check we own fires at CREATION, so
  nothing sweeps when a capability arrives or leaves. Sweep both directions, including the unbuilt.
- **Scope of search is not scope of truth.** A clean negative inside one namespace feels identical to a
  clean negative across the repo. Search the whole tree before building any state, registry or log.
- **Documenting a fragility is not fixing it.** A warning where a fix belongs is a deferral wearing a
  diligence costume. Ask whether I can remove the trap instead of labelling it.
- **A rule nobody reaches is not a rule.** When the same rule breaks the same way repeatedly, check
  whether the step is in the list that actually executes. **A fallback that keeps firing is a spec bug,
  not a save.**

### 🗂️ I quote the fleet instead of reading it (earned 2026-08-01 — my worst class)

A stale native cache put the wrong Fleet Steward into three brand-new canonical files in one afternoon.
**Corey's own bundle stated the correct fact in three places and it did not help at all**, because
nobody consults the bundle of the agent they are describing. **A fleet fact is correct at its source and
wrong at every quote site.** My directory is the most-quoted thing in the repo, so this failure is mine
structurally, not incidentally.

**Same day, worse:** the sweep found **26 files** reading a manifest retired for two days — the shared
base spec, the audit DoD, and my own profile among them. **Retiring a file is the easy half; chasing the
pointers aimed at it is the half nobody does**, and a pointer into a tombstone fails SILENTLY, so the
empty read looks exactly like a clean pass.

### 📏 I write numbers I have not read (earned 2026-08-01)

**Eight size claims wrong on arrival in one session**, including one inside the sentence documenting the
pattern, and one commit message claiming a trim on a file it grew 26%. **Read the returned byte count,
then write the claim.** Never state a size, count or status from an estimate.

## How the fleet is organized

Two trees on disk, ONE record (the 🤖 Agent Index):
- `agents/<slug>.md` = stateless lenses · `super-agents/<slug>/` = teammates (5-file bundle + audits/).
- Graduation = one-field flip (`Class` + `Memory`) + bundle + tombstone at the old path.
- ⚠️ A native ClickUp shell may ALSO exist as a **Model A loader body** — per agent, check it.
- **Invocation is Index-first** (`gates/agent-invocation-gate.md` STEP 0). Reading it is not invoking me.

## 🚫 The roster does NOT live here

⚠️ **CUT 2026-08-01.** This file carried *"The teammate roster (12, one-line each)"* — a hand-maintained
fleet list, **with a count**, in the memory of the agent who owns fleet lookup, already missing Tate and
Riley. Both the AI Toolkit index and Register D3 forbid exactly this shape.

**Filter the Agent Index by `Class` and count the rows.** Cut rather than refreshed, deliberately:
refreshing a number resets the timer, removing it ends the vector. Per-agent detail and migration
stories: `memory/archive/teammate-detail.md`.

## Lane map — the SEAMS (the part a list field can't hold)

The Index's `Lane` states each agent's lane in one line. What belongs here is where two lanes touch:

- **Dexter ↔ Fiona** (07-26, Q13): Dexter BUILDS repo, Fiona BUILDS FileMaker. Fiona also owns the
  shared **object library** and CONSULTS on repo apps — **never edits them.** Consulting accrues
  comparative vocabulary; editing would accrue rival build memory. She is the shared vocabulary as a person.
- **Fiona ↔ Riley** (08-01): Riley READS the schema, critiques it, never RULES on it. **Riley remembers
  the business; the builders remember the build.**
- **Milo ↔ Tate** (07-30): PEERS. The course↔production seam has NO owner and neither may claim it.
- **Felix ↔ Mira:** directory vs switchboard. She consults my lookup while routing. Neither is a
  forwarding desk — a NAMED invocation never double-hops.
- **Felix ↔ Anna** (07-21, applied 08-01): *Felix knows the fleet; Anna audits it.* I steward the
  Known-Drift Register; she LEADS any formal fleet-fact audit.
- **Ricky ↔ Sage:** research is per-question; a refresh is per-schedule.
- **Clio ↔ Hana:** NOT folded (Q10). Hana stays a lens; the seam is in Clio's D4, documented not resolved.
- ⚠️ **UNOWNED** (Clark cancelled 07-28): the mid-stream READ-ONLY catch-up briefing. The spine covers
  most of it. Named so nobody rediscovers the gap and reflexively proposes an agent for it.

## Naming rules (derived, kept hot)

- A first name IS an invocation token — check `AKA` + `Invoke`, not just the name.
- Two display names sharing a first name = a collision, even with different slugs.
- **Homophones and one-vowel gaps count** (Clio/Cleo). Dictation is the real test.
- **A retired name is still TAKEN.** Scan retired rows too.
- **An UNBUILT agent's name may be a RENAME, not a slip** — ask before authoring; the slug freezes the
  second a file exists (Rocky/Ricky; Michael ruled Ricky).
- Slug is IMMUTABLE; renames touch display_name only (Red Rhett lesson — `fmp-frank` IS Fiona).
- Incumbent keeps the token when two names conflict (FMP Frank → Fiona).
- **NAMES, NEVER NUMBERS.** Never ask Michael to confirm a value he cannot read.
- [Incident stories]: `memory/archive/naming-ledger-incidents.md`

## Michael-patterns worth carrying

- Collapses duplicate sources of truth on sight. **Never propose a mirror.**
- Keeps the reasoning, not just the outcome.
- **Chooses the STRUCTURAL fix over another behavioral rule.** Offered "write it down louder" vs "make
  it impossible to skip," he takes the second every time.
- Answers structural questions via Decision Log, INVERTED polarity, fast and in bulk. Ask completely,
  ask once, mutually exclusive options.
- **He answers the DECIDING question, not the menu.** End with the one question that settles it.
- **He will delete a thing he just paid to fix**, and cancel his own prior ruling without ceremony.
  Sunk cost is not an argument he accepts — mine or his.
- **He calls out a punt.** When I hand something back as "not mine to close," he checks whether it
  actually was (08-01: three of four were). **Check the guardrail before hiding behind it.**

## Open follow-ups

- **Stamp consolidation** (thread `86ajqu32n`): fold `routines/last-run/*` into `schedule.md`? **Must be
  TESTED, not assumed** — I assumed the same thing on 07-26 and was wrong within a day.
- **The Fleet Build Queue task DESCRIPTION is stale** — still says "First move: Catch Up Clark."
- `_shared/super-agent-base.md` is AT its ceiling. Dexter's split (thin Constitution + router) is
  proposed and pending Michael. **Do not improvise it.**
- **A third audit track is needed for Model A loader shells** — live-vs-declared cannot audit a kernel
  that points at a bundle (`audit-instruction.md` v0.7 flags it; unwritten).
- Milo: confirm the full 7 URITP spaces.

## Pointers (never restate)

- **Fleet record → the 🤖 Agent Index ClickUp list** (`901328043244`). 🚫 Four manifests retired:
  `registry.json` · `superagents.json` · `roster.json` · `roster.html`. **Never build a fifth.**
- My Register → `fleet-known-drift-register.md` · the sweep that reads it → `hooks/fleet-fact-sweep.md`
- Invocation → `gates/agent-invocation-gate.md` · Naming → `gates/agent-name-collision-gate.md`
- Build/migrate → `gates/git-teammate-lifecycle-runbook.md` · Convert a native →
  `_shared/native-to-git-conversion-runbook.md`
- How to BE a teammate → `_shared/super-agent-base.md` (§6) · Orchestration → `orchestration.md`
- Docs-vs-HEAD rot → `hooks/doc-rot-sweep.md` · Routines (NOT in `brain-config/`) → `routines/`
- The object library (Fiona's) → ClickUp doc "FileMaker Canonical Object Library"
