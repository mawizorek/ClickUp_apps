# Felix — Memory (the relational fleet index)

> CONTEXT, not process. How agents RELATE, their lineage, and lane boundaries.
> Structured facts (slug/class/memory/status/lane) live in `roster.json`, **the
> ONE documented source**; this file POINTS at it and never restates it.
> If a fact here conflicts with the roster, the JSON wins — fix this file.
>
> **Budget: ~10KB hot cap.** Enforced by `hooks/memory-rotation.md` at session close.
> Graduated content lives in `memory/archive/` (loaded on-demand).
>
> Reconciled to HEAD 2026-07-25. Lesson: my memory rots fastest on the days the
> fleet moves fastest, which are exactly the days it gets read.

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
write path to a persistent file) with Clio second (`usage-log.json`). "Who feels
important" would have found neither.

**Standing runner-up: Closing Clio.** Memory turns a per-session health snapshot
into a trend line. She's next when Michael wants one.

## How the fleet is organized

Two trees on disk, ONE flat roster (`roster.json`, slimmed 2026-07-25 PR #483):
- `brain-config/agents/<slug>.md` = stateless lenses.
- `brain-config/super-agents/<slug>/` = persistent teammates (5-file bundle).
- Graduation = one-field flip (`class` + `memory`) + bundle + tombstone.

**Invocation is roster-first.** `/agent-name` resolves at STEP 0
(`gates/agent-invocation-gate.md`). Reading the roster is NOT invoking me.

## The teammate roster (9, one-line each)

- **Wes** — driving force, first teammate (07-19)
- **Corey** — ClickUp structure + space auditing (07-19)
- **Anna** — audit lead (07-21)
- **Mira** — orchestrator + default front door (07-21)
- **Milo** — URITP production ops, built fresh (07-21)
- **Dexter** — build/engineering lead, writes code (07-25)
- **Maggie** — memory steward, placement triage (07-25)
- **Felix** (me) — fleet steward + singularity guardian (07-20)
- **Fiona** — FileMaker, slug `fmp-frank`, needs-declaration (pending)
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
- FileMaker solution design = **Fiona** (pending)
- **Dexter ↔ Fiona seam (LOCKED):** Dexter owns REPO, Fiona owns FILEMAKER. Tandem,
  not hierarchy. Never split build memory of one codebase across two agents.

## Naming rules (derived, kept hot)

- A first name IS an invocation token. Check the token map, not just the name field.
- Two display names sharing a first name = a collision (even with different slugs).
- Slug is IMMUTABLE. Renames touch display_name only (Red Rhett lesson).
- Nicknames collide too (Routine Ricky lesson).
- Incumbent keeps the token when two names conflict (FMP Frank → Fiona lesson).
- [Full incident stories]: `memory/archive/naming-ledger-incidents.md`

## Michael-patterns worth carrying

- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Keeps the reasoning, not just the outcome.
- Overrules cleverness in favour of removing a bottleneck.
- Answers structural questions via Decision Log with INVERTED polarity.

## Open follow-ups

- `roster.json` ~15KB against its LOCKED ~12KB slim rule. Flagged.
- Fiona rebuild: Entry A, singular lane, tandem seam documented both sides.
- Routine Ricky: build or retire the queue item.
- Milo: confirm the full 7 URITP spaces.
- Blocked on Michael (manual UI): disable retired natives Corey/Milo/Fiona.
- AI Toolkit index: stale git-teammate count + stale Dexter warning.

## Pointers (never restate)

- Fleet roster → `super-agents/roster.json`
- Invocation → `gates/agent-invocation-gate.md`
- Build/migrate → `gates/git-teammate-lifecycle-runbook.md`
- How to BE a teammate → `_shared/super-agent-base.md` (§6)
- Naming gate → `gates/agent-name-collision-gate.md`
- Orchestration → `orchestration.md` (Class Parity)
- Doc-rot sweep → `hooks/doc-rot-sweep.md`
