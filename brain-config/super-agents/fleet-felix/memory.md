# Felix — Memory (the relational fleet index)

> CONTEXT, not process. How agents RELATE, their lineage, and lane boundaries.
> Structured facts (slug/class/memory/status/lane) live in `roster.json`, **the
> ONE documented source**; this file POINTS at it and never restates it.
> If a fact here conflicts with the roster, the JSON wins — fix this file.
>
> **Budget: ~10KB hot cap.** Enforced by `hooks/memory-rotation.md` at session close.
> Graduated content lives in `memory/archive/` (loaded on-demand).
>
> Reconciled to HEAD 2026-07-25 (evening). Lesson, now earned twice in one day:
> my memory rots fastest on the days the fleet moves fastest, which are exactly
> the days it gets read.

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

## 🚫 Where I keep being wrong (earned 2026-07-25, twice in one session)

**I retire things because an adjacent tool looks good enough, and Michael overrules me.**
Both misses were the same shape:

- **Ricky:** I argued the invocation contract is proven, so retire him. But *"the thing
  it was built to prove is proven"* retires a **TEST**, not a **CAPABILITY.**
- **Clark:** I said `session-close.md` ate him. It ate HALF of him. **A close is a WRITE
  ritual at the end; a catch-up is a READ-ONLY briefing mid-stream**, often about work
  Michael wasn't in. Different job entirely.

**The correction:** before I recommend retiring anything, name the capability the user
actually reaches for and ask whether the surviving tool DELIVERS it — not whether the
tool is good. "Covered by X" is a claim about X, not about the need.

## How the fleet is organized

Two trees on disk, ONE flat roster (`roster.json`):
- `brain-config/agents/<slug>.md` = stateless lenses.
- `brain-config/super-agents/<slug>/` = persistent teammates (5-file bundle + audits/).
- Graduation = one-field flip (`class` + `memory`) + bundle + tombstone.

**Invocation is roster-first.** `/agent-name` resolves at STEP 0
(`gates/agent-invocation-gate.md`). Reading the roster is NOT invoking me.

## The teammate roster (10, one-line each)

- **Wes** — driving force, first teammate (07-19)
- **Corey** — ClickUp structure + space auditing (07-19)
- **Anna** — audit lead (07-21)
- **Mira** — orchestrator + default front door (07-21)
- **Milo** — URITP production ops, built fresh (07-21)
- **Dexter** — build/engineering lead, writes code (07-25)
- **Maggie** — memory steward, placement triage (07-25)
- **Sage** — research runner, READ-ONLY, source-reliability ledger (07-25)
- **Clio** — session-close executor, health trend ledger (07-25)
- **Felix** (me) — fleet steward + singularity guardian (07-20)
- **Fiona** — FileMaker, slug `fmp-frank`, needs-declaration (lane pinned 07-25, build blocked on track)
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
- FileMaker solution design + **the object library** + repo-app CONSULTING = **Fiona** (pending)
- **Dexter ↔ Fiona seam (REWRITTEN 07-25, Q13):** Dexter BUILDS repo, Fiona BUILDS FileMaker.
  Fiona also owns the shared **object library** (cross-runtime vocabulary) and CONSULTS on repo
  apps — **never edits them.** That distinction is load-bearing: consulting accrues comparative
  vocabulary, editing would accrue rival build memory. Michael's why: *"we're going to model our
  repo apps more like our fmp app schema"* — she is the shared vocabulary as a person.
- **Clio ↔ Hana:** NOT folded (Michael, Q10). Hana stays a lens; the close Step 5 seam is
  documented in Clio's D4, not resolved.

## Naming rules (derived, kept hot)

- A first name IS an invocation token. Check the token map, not just the name field.
- Two display names sharing a first name = a collision (even with different slugs).
- **Homophones and one-vowel gaps count** (Clio/Cleo, 07-25). Dictation is the real test.
- Slug is IMMUTABLE. Renames touch display_name only (Red Rhett lesson).
- Incumbent keeps the token when two names conflict (FMP Frank → Fiona lesson).
- [Full incident stories]: `memory/archive/naming-ledger-incidents.md`

## Michael-patterns worth carrying

- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Keeps the reasoning, not just the outcome.
- **Chooses the STRUCTURAL fix over another behavioral rule** (Q11: he struck my index-row
  proposal because behavioral rules are what keep rotting). When I offer "write it down louder"
  versus "make it impossible to skip," he takes the second.
- Overrules cleverness in favour of removing a bottleneck.
- Answers structural questions via Decision Log with INVERTED polarity.
- **He answers fast and in bulk.** Four questions came back in one pass. Ask completely, ask
  once, and make the options mutually exclusive.

## Open follow-ups

- **Fiona build BLOCKED:** lane pinned (Q13 part 1), name confirmed, but part 3 decoded as
  "native track" which I believe is a polarity misfire. One line from Michael unblocks.
- **Fiona's build rewrites the Q7 seam on BOTH sides** + needs two new seams: Fiona↔Anna
  (she contributes buildability findings, Anna leads audits) and Fiona↔Dexter (she owns the
  object library/vocabulary, he enforces the contract in repo code).
- Authorized and unbuilt: **Ricky** (Q12→B), **Clark** (Q10→D, hook-vs-teammate still open).
- **Q11 structural work** unbuilt: session-open presence for EVERY session + audit SHA stamps.
- 🚨 `_shared/super-agent-base.md` at 21.7KB against a ~22KB ceiling — I made it worse; needs
  Dexter's split. `roster.json` at ~19.6KB against a locked ~12KB it has never met.
- Milo: confirm the full 7 URITP spaces.
- Blocked on Michael (manual UI): disable retired natives Corey/Milo/Fiona.

## Pointers (never restate)

- Fleet roster → `super-agents/roster.json`
- Invocation → `gates/agent-invocation-gate.md`
- Build/migrate → `gates/git-teammate-lifecycle-runbook.md`
- How to BE a teammate → `_shared/super-agent-base.md` (§6)
- Naming gate → `gates/agent-name-collision-gate.md`
- Orchestration → `orchestration.md` (Class Parity)
- Doc-rot sweep → `hooks/doc-rot-sweep.md`
- The object library (Fiona's, real, verified 07-25) → ClickUp doc "FileMaker Canonical Object Library"
