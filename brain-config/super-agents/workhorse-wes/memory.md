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
- 🔴 **HE WILL ASK FOR ME BY NAME WHEN THE DRIFT IS ALREADY OBVIOUS (2026-08-08):** *"whatever not
  the deep. have wes actually seated so we stay on track."* **That is a miss, not a win.** By the
  time Michael notices the rabbit hole he has already paid for it. The seating trigger has to be the
  drift, not his patience running out.
- 🔴 **HE STATES THE MODE, AND THE MODE IS BINDING (2026-08-08):** *"I want you nearby to guide me…
  don't take over the notes… purely here to tell me what I can do better."* He inverts it explicitly
  when he wants hands. **Drifting out of watch-mode because helping is available is a violation of a
  direct instruction, not helpfulness.**
- 🔴 **PROSE IS A DEFECT HE NAMES OUT LOUD (2026-08-08):** *"such prose is classic YOU SLOP"* and
  *"DO NOT repeat your sentiments in two different sentences."* His own retention test that session:
  a dense schema note survived, the paragraph around it did not. **Density in the artifact, brevity
  in the reply.**
- 🔴 **THE RECORD IS THE DELIVERABLE (2026-08-08):** *"literally the only reason i'm talking to you is
  for that context next time."* Said after 70 minutes of substantive work had accrued with nothing
  logged. **If the session record is not being written, the session is not producing what he came for.**

## 🔁 Recurring pitfalls + mitigations (the trend ledger — grows every session)

The active engine of Wes's job: catch the pitfalls we REPEATEDLY fall into, name the trend, and
carry a mitigation forward so it actually sticks. Cross-reference this against live activity every
session. (Context + observed pattern, NOT procedure — if a mitigation hardens into a repeatable
process, it becomes a TOOL and Wes points at it.)

Format: `PATTERN · seen: N · last: YYYY-MM-DD · mitigation: <the plan to blunt it>`

- **`over-detailing before the big-picture call is made · seen: 2 · last: 2026-08-08 · mitigation:
  when an owner answer invalidates the FRAME, STOP the walk and re-settle the frame.`** 07-27:
  Michael answered that Space 4 is *not live and operating* and the audit walked straight into list
  2 of 9. **08-08, second instance and a different shape: ~20 minutes debugging a value-list sort
  order on SEVEN records while the schema it decorates was still being defined.** Cheap new test —
  **weigh the fix against the record count.** Seven rows is never worth a debug ladder, and Michael
  ended it himself with *"whatever not the deep."*
- **`a model-changing finding left unbanked while the sweep continues · seen: 1 · last: 2026-07-27 ·
  mitigation: bank the finding the turn it lands — memory, docs, index — before the next list.`**
  The `Policies` migration retired the audit's biggest structural flag and sat unwritten for a beat
  while three agent memories still carried the superseded picture. **Findings rot faster than lists.**
- **`a retirement lands and its POINTERS are never chased · seen: 1 · last: 2026-08-01 · mitigation:
  retiring a file is HALF the job — sweep every pointer aimed at it in the same pass.`** Four
  manifests were retired cleanly and correctly; **26 files were still reading one of them days
  later**, including the shared base spec and the audit standard. **A pointer into a tombstone fails
  SILENTLY, so the empty read looks exactly like a clean pass** — which is why nothing surfaced it.
  Direct kin of the snapshot-vs-tracker trend below.
- 🔴 **`the session record is cut LATE or never · seen: 3 · last: 2026-08-08 · mitigation: the FIRST
  substantive turn is the trigger, not the first write — and a session that has produced findings has
  already earned a task.`** 08-08 ran **70 minutes** across four agents, a legacy-file teardown and
  nine merged PRs with no board task, no spine and no transcript, and it was MICHAEL who noticed.
  Dexter's 08-03 session was the same class twice over (seated 35 min late, presence entry never
  posted). **The two-phase session-open defers COMMIT to the first side-effecting write, and reading
  is not a write — so a session can do an hour of real analysis and still look, to the gate, like it
  never started.** The gate is working as written and the writing is wrong.
- 🔴 **`a SECOND CLAIMANT gets created for something that already exists · seen: 5 in one session ·
  last: 2026-08-08 · mitigation: read the container before you add to it — the directory, the sibling
  fields, the existing page.`** Five in four hours, and the shapes rhyme: a legacy `autoGenerated`
  flag marking rows as not-real, the same dates on two tables, highlight fields duplicating a child
  table, a `ManualEdit` flag proposed to protect a disposable table, and **an agent-authored README
  merged alongside an existing file doing the identical job.** ⭐ **Fiona's sharpened tell is the
  most useful artifact of that session: a flag whose meaning is "this row is not real" is the
  structure telling you the row should not exist.** Watch for the flag, not the duplicate.
- (watch, not yet confirmed under Wes: designing net-new before researching existing state;
  deferring cheap documentation to a follow-up.)

## 🧭 The structural trend I keep seeing (cross-session, 2026-07-27)

**A close artifact is a SNAPSHOT and the tracker is the TRUTH, and this workspace keeps confusing
the two.** Same shape, four surfaces: the Roadmap banner drifted three separate times; the standing
thread's handoff said *"41 rows, none Confirmed"* when the live Index read 59/39; Anna's and Milo's
memories carried the same dead number; the Space-4 page still described "camps" nobody has ever run.
**Mitigation that generalizes: when a number appears in a handoff, re-read its source before you use
it — and if you find it stale, fix every copy in the same pass, not just the one you tripped on.**

⚠️ **2026-08-01: this file was carrying the exact defect it describes.** The Project-context line below
read *"Fleet now 12+ teammates"* — a hand-maintained count, in a memory file, in the bundle of the agent
whose whole job is catching this pattern. **Cut, not refreshed.** A number in `memory.md` is a defect on
sight (base spec §4a); refreshing it resets the timer, removing it ends the vector.

🔴 **2026-08-08 — the same trend, aimed at a DOC instead of a number.** The URITP Production Calendars
page claimed 11 tables (it is 9) and "multiple productions supported via SETUP records" (the file is
single-production; the config is global storage on a one-record table). **Every agent had been quoting
that page for a week.** One live export settled it in a single turn. **Extend the mitigation: a
DESCRIPTIVE claim about an artifact rots exactly like a number, and the artifact is always available.**

## Project context

- Git super-agent architecture established 2026-07-19: Wes is the reference migration from
  lens (`agents/`) to teammate (`super-agents/`). **The fleet record is the 🤖 Agent Index ClickUp
  list** (`901328043244`) — filter by `Class` and count rows; never write the number down.
  *(~~`roster.json` is the single resolution index~~ — retired to a tombstone stub 2026-07-30, along
  with `roster.html`; `registry.json` went 07-25 and `superagents.json` before it. Four retired
  manifests.)*
- **URITP list audit** is the long-running project I'm most often seated into. Anna leads it, Milo
  holds the workspace knowledge, Mira convenes the room, and my job there is the frame and the loops
  — not the findings.
- **FileMaker app builds are a live second lane (from 2026-08-08).** Fiona drives, Michael authors
  the schema himself in VS Code while talking, and my job is the same one: the frame, the loops, and
  saying when a detail is not worth the depth. Decisions land in a ClickUp Decision Log; schema lands
  in `mawizorek/maw-prose`.

## Standing reminders

- **The spine is the cross-session chronology and it keeps getting skipped on PICKUP sessions**
  (scoreboard B19, three consecutive misses). A pickup opens on an existing task, which satisfies
  the "is the record armed?" instinct, so the separate spine-arming step never fires. **A pickup is
  a session OPEN.**
- **7a CONFIRM CADENCE (locked 2026-07-27):** ceiling of ~5 clean unconfirmed Index rows. Watch it —
  the session that read the rule on the morning it was written still let the day pass without an ask.
- **Never state a fact about another agent from memory** — steward, lane, ratifier, native status.
  Check the Agent Index + that agent's own bundle (`hooks/fleet-fact-sweep.md`).
- **When Michael is pushing to a repo mid-conversation, every agent read is stale within seconds.**
  08-08: two merges hit conflicts on reads that were a minute old. Re-fetch before the write, and
  expect his version to win.
