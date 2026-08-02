# ARCHIVE — Fleet Felix's July scars, in full (rotated out of hot `memory.md` 2026-08-01)

> Rotated to bring the hot file back under its ~10KB cap. **Nothing here was dropped** —
> `memory.md` keeps a one-line rule for each and points here for the story. The stories matter:
> a rule without its incident is a rule the next reader can talk themselves out of.

---

## I retire things because an adjacent tool looks good enough (2026-07-25, twice in one session)

- **Ricky:** I argued the invocation contract was proven, so the agent demonstrating it could be
  retired. But *"the thing it was built to prove is proven"* retires a **TEST**, not a **CAPABILITY.**
- **Clark:** I said `session-close.md` had eaten him. It had eaten HALF of him. **A close is a WRITE
  ritual at the end of a session; a catch-up is a READ-ONLY briefing mid-stream**, often about work
  Michael was never in. Different job entirely.

**The correction:** before recommending any retirement, name the capability the user actually reaches
for, then ask whether the surviving tool DELIVERS it — not whether the surviving tool is good.
*"Covered by X"* is a claim about X, not about the need.

**⚖️ Postscript, 2026-07-28.** Michael cancelled Clark himself. **I was wrong about the REASONING and
right about the outcome, and those are different things** — the rule above still stands. What actually
killed Clark: across five sessions nobody could ever name what he would REMEMBER that Clio doesn't.
**An agent whose §6 justification cannot be stated after eight days does not have one.** And the
capability did genuinely shrink, but not because the close hook ate it — because the SPINE arrived.

## A new capability retires plans, not just old tools (2026-07-28)

J11 found that retiring the scheduler had silently orphaned a healthy app. Clark was the same mechanism
running the other direction: **the spine landed and quietly made a planned agent unnecessary.** Nobody
noticed either time, because every check we own fires at CREATION — nothing sweeps when something
arrives or leaves. **When a capability appears OR disappears, sweep both directions for what it just
made redundant, including things not yet built.**

## Scope of search is not scope of truth (2026-07-26, twice in one day)

I searched `brain-config/` for existing data-refresh machinery, found none, and treated that silence as
proof none existed. **It existed: `routines/` at repo root, one directory over, three weeks old, with a
schedule, per-routine stamps, three runbooks and a live renderer.** I then built a parallel framework
beside it — including a shared stamp log that **reintroduced the exact race those per-routine files had
been locked to prevent.** Michael caught it in one sentence: *"we should already have a schedule and
routine stamps, no?"*

The part that matters: **my reasoning was fine, only my search radius was wrong.** A clean negative
result inside one namespace feels identical to a clean negative result across the whole repo. It is not.
**Before building any state, registry, schedule or log: search the whole tree.** Sibling of B12 (research
existing state first) but distinct — B12 is not looking; this is looking in one place and calling it done.

## Documenting a fragility is not fixing it (2026-07-27)

I found a load-bearing prose dependency: a renderer inferred "retired" by regexing a phrase out of a
free-text cell, so rewording that sentence would silently un-retire a dead routine. My response was to
**write it up as a "viewer contract"** telling future editors not to touch the wording. The next day the
real fix took one line — read the explicit field instead — and the dependency was gone along with the
contract that guarded it.

**A warning where a fix belongs is a deferral wearing a diligence costume.** It even feels like rigor:
you documented the trap. You also left the trap. **Ask: can I remove this fragility, or am I about to
write a note asking people to be careful around it?**

## A rule nobody reaches is not a rule (2026-07-28)

Four consecutive sessions posted zero spine lines. I diagnosed it twice as a *behavioural* problem (a
task with history feels like an armed record). **It was mechanical: arming the spine appeared in NO
executable checklist** — `session-open.md` Commit ran C1→C5 with no spine step, while the instruction
sat as prose in a different document. Every one of those sessions was following the written procedure
correctly.

**When the same rule breaks the same way repeatedly, stop scoring discipline and check whether the step
is in the list that actually executes.** Corollary earned the same day: **a fallback that keeps firing
is a spec bug, not a save** — the close-time backfill rescued four sessions while the missing step went
unwritten, which is how the defect stayed invisible.
