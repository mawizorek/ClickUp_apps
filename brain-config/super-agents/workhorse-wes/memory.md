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
- 🔴 **WHEN HE IS BUILDING, HE IS NOT READING** (2026-08-08). *"my attention is not with you — but I'm
  trying to keep you in the loop."* He wants to be watched over, not narrated at: **two or three lines,
  one finding, no restating.** He escalated three times in one session (*"need more conversational
  replies"* → *"you used so many words"* → *"classic YOU SLOP"*) before it held. **The content was right
  every time; the volume was the defect.** ⚠️ This is the SAME rule as `team-standard.md` v1.8's DO NOT
  RESTATE, arrived at from a second direction — so it is a house-wide floor, not a Milo-session quirk.

## 🔁 Recurring pitfalls + mitigations (the trend ledger — grows every session)

The active engine of Wes's job: catch the pitfalls we REPEATEDLY fall into, name the trend, and
carry a mitigation forward so it actually sticks. Cross-reference this against live activity every
session. (Context + observed pattern, NOT procedure.)

Format: `PATTERN · seen: N · last: YYYY-MM-DD · mitigation: <the plan to blunt it>`

- **`over-detailing before the big-picture call is made · seen: 2 · last: 2026-08-08 · mitigation:
  when an owner answer invalidates the FRAME, STOP the walk and re-settle the frame.`** (1) 07-27, an
  audit walked into list 2 of 9 after Michael had said the Space isn't running. (2) **08-08, and this
  one was cosmetic:** a value-list sort order on SEVEN records did not work, and three more debug
  suspects were offered before Michael killed it himself — *"whatever not the deep. have wes actually
  seated so we stay on track."* **He had to call me in to end a rabbit hole. That is the job failing at
  its one job.** ⚠️ New tell to watch: **a cosmetic problem that resists two fixes is a park, not a
  puzzle.**
- **`a model-changing finding left unbanked while the sweep continues · seen: 1 · last: 2026-07-27 ·
  mitigation: bank the finding the turn it lands — memory, docs, index — before the next list.`**
  **Findings rot faster than lists.**
- **`a retirement lands and its POINTERS are never chased · seen: 1 · last: 2026-08-01 · mitigation:
  retiring a file is HALF the job — sweep every pointer aimed at it in the same pass.`** Four
  manifests retired cleanly; **26 files were still reading one days later.** **A pointer into a
  tombstone fails SILENTLY, so the empty read looks exactly like a clean pass.**
- 🆕 **`real work runs with NO session record until Michael asks · seen: 3 · last: 2026-08-08 ·
  mitigation: the record is armed at the FIRST substantive turn, not when the work feels big enough.`**
  08-06 Milo: *"are you updating your activity or your memory at all?"* after four hours. 08-08: **70
  minutes of live schema work with four agents and zero board task** until *"why is nothing open????
  this is a massive build convo… literally the only reason I'm talking to you is for that context next
  time."* ⚠️ **The tell is identical both times: a session that starts as a QUESTION and grows into a
  BUILD never re-evaluates whether it needs a record.** The two-phase session-open already covers this
  and is being skipped, not misunderstood.

## 🧭 THE structural trend, now the strongest signal I hold (updated 2026-08-08)

**TWO SURFACES CLAIMING ONE FACT. Every variant looks locally reasonable and fails silently.** Started
as *a close artifact is a SNAPSHOT and the tracker is the TRUTH* (07-27: a Roadmap banner drifted three
times, a handoff said 41 rows when the live Index read 59, two agent memories carried the dead number).

🔴 **2026-08-08 produced FIVE instances in a single session, across three different shapes** — which
promotes this from a documentation problem to the workspace's default failure mode:

1. a schema flag (`autoGenerated`) marking rows as not-real
2. the same dates on a parent AND child table
3. six fixed fields doing what N rows should
4. two whole `tables/` trees after a rename
5. **an agent about to write a second rationale doc beside one that already existed** (Dexter's, caught pre-merge)

**Mitigation that generalizes: before creating ANY surface that holds a fact — a table, a field, a doc,
a tracker — list what is already there and ask what already owns it.** And when a number appears in a
handoff, re-read its source before using it; if it is stale, fix every copy in the same pass.

⚠️ **2026-08-01: this file was carrying the exact defect it describes.** The Project-context line below
read *"Fleet now 12+ teammates"* — a hand-maintained count, in the memory of the agent whose job is
catching this. **Cut, not refreshed.** Refreshing a number resets the timer; removing it ends the vector.

## Project context

- Git super-agent architecture established 2026-07-19: Wes is the reference migration from
  lens (`agents/`) to teammate (`super-agents/`). **The fleet record is the 🤖 Agent Index ClickUp
  list** (`901328043244`) — filter by `Class` and count rows; never write the number down.
  *(Four retired manifests: `roster.json` + `roster.html` 07-30, `registry.json` 07-25,
  `superagents.json` before it.)*
- **URITP list audit** is the long-running project I'm most often seated into. Anna leads it, Milo
  holds the workspace knowledge, Mira convenes the room, and my job there is the frame and the loops
  — not the findings.
- 🆕 **FMP app builds are a new seating context** (Production MAWster, 08-08). Fiona drives the schema;
  I get called in when a detail eats the session. **Michael building in the app while an agent writes
  the docs is the shape** — expect his pushes to land mid-write and expect the loops to be architectural
  rather than procedural.

## Standing reminders

- **The spine is the cross-session chronology and it keeps getting skipped on PICKUP sessions**
  (scoreboard B19, three consecutive misses). A pickup opens on an existing task, which satisfies
  the "is the record armed?" instinct, so the separate spine-arming step never fires. **A pickup is
  a session OPEN.**
- **7a CONFIRM CADENCE (locked 2026-07-27):** ceiling of ~5 clean unconfirmed Index rows.
- **Never state a fact about another agent from memory** — steward, lane, ratifier, native status.
  Check the Agent Index + that agent's own bundle (`hooks/fleet-fact-sweep.md`).
