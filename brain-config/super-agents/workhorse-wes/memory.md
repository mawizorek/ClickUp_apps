# Wes — Memory (accumulated context only)

> Context + how-Michael-works + observed trends. NOT process/skills (those are TOOLS — point, don't store).
> Budget ~10KB hot.

## ⚠️ Write-path conflict in my own bundle (flagged 2026-07-27, NOT resolved)

The line below this section used to say durable changes are QUEUED via Memory Maggie and never
written mid-session. **`_shared/super-agent-base.md` (locked 2026-07-25, later) says the opposite:**
agents write to their own `memory.md` DURING the session when the insight is fresh, and the rotation
gate enforces budget at close. Brain memory (`/PREFERENCES.md`) is the only Maggie-exclusive path.
**The base spec is newer and governs, so this file now writes live.** Flagged rather than silently
reconciled — if Michael wants the old behaviour back it should be a decision, not a drift.

## How Michael works (standing context)

- ADHD-aware: thinks fast and loose, forks mid-thought, chases tangents, drops threads. Expected
  input — Wes holds the through-line and closes loops in the background, never scolds.
- Thinks fast in the fuzzy front-end; wants to be pushed to the big picture, not coddled.
- Hates getting bogged in trivial detail — that's literally why Wes exists. Protect momentum.
- Values strong opinions and being called out of rabbit holes. No hedging.
- Wants provenance: show what was read to ground a take; never guess or fabricate.
- Direct, tight, no filler. Fragments beat sentences. Never em/en dashes.
- **He takes the hard call when you make it plainly.** 2026-07-27: I told him to stop a walk he had
  explicitly ordered two hours earlier. He replied *"run that."* **Don't soften a redirect to protect
  his earlier instruction — he'd rather change course than finish the wrong thing.**

## 🔁 Recurring pitfalls + mitigations (the trend ledger — grows every session)

The active engine of Wes's job: catch the pitfalls we REPEATEDLY fall into, name the trend, and
carry a mitigation forward so it actually sticks. Cross-reference this against live activity every
session. (Context + observed pattern, NOT procedure — if a mitigation hardens into a repeatable
process, it becomes a TOOL and Wes points at it.)

Format: `PATTERN · seen: N · last: YYYY-MM-DD · mitigation: <the plan to blunt it>`

- **`over-detailing before the big-picture call is made · seen: 1 · last: 2026-07-27 · mitigation:
  when an owner answer invalidates the FRAME, STOP the walk and re-settle the frame.`** First
  confirmed instance under my name. Michael answered that Space 4 is *not live and operating* and
  the audit walked straight into list 2 of 9 — documenting the current state of something its owner
  had just said isn't running. **A list-by-list walk silently assumes the container's purpose is
  settled. The moment it isn't, the walk is producing detail nobody can act on.**
- **`a model-changing finding left unbanked while the sweep continues · seen: 1 · last: 2026-07-27 ·
  mitigation: bank the finding the turn it lands — memory, docs, index — before the next list.`**
  The `Policies` migration retired the audit's biggest structural flag and sat unwritten for a beat
  while three agent memories still carried the superseded picture. **Findings rot faster than lists.**
- (watch, not yet confirmed under Wes: designing net-new before researching existing state;
  deferring cheap documentation to a follow-up.)

## 🧭 The structural trend I keep seeing (cross-session, 2026-07-27)

**A close artifact is a SNAPSHOT and the tracker is the TRUTH, and this workspace keeps confusing
the two.** Same shape, four surfaces: the Roadmap banner drifted three separate times; the standing
thread's handoff said *"41 rows, none Confirmed"* when the live Index read 59/39; Anna's and Milo's
memories carried the same dead number; the Space-4 page still described "camps" nobody has ever run.
**Mitigation that generalizes: when a number appears in a handoff, re-read its source before you use
it — and if you find it stale, fix every copy in the same pass, not just the one you tripped on.**

## Project context

- Git super-agent architecture established 2026-07-19: Wes is the reference migration from
  lens (`agents/`) to teammate (`super-agents/`). Fleet now 12+ teammates; `roster.json` is the
  single resolution index (`registry.json` retired to a tombstone 2026-07-25).
- **URITP list audit** is the long-running project I'm most often seated into. Anna leads it, Milo
  holds the workspace knowledge, Mira convenes the room, and my job there is the frame and the loops
  — not the findings.

## Standing reminders

- **The spine is the cross-session chronology and it keeps getting skipped on PICKUP sessions**
  (scoreboard B19, three consecutive misses). A pickup opens on an existing task, which satisfies
  the "is the record armed?" instinct, so the separate spine-arming step never fires. **A pickup is
  a session OPEN.**
- **7a CONFIRM CADENCE (locked 2026-07-27):** ceiling of ~5 clean unconfirmed Index rows. Watch it —
  the session that read the rule on the morning it was written still let the day pass without an ask.
