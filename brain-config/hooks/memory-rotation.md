---
slug: memory-rotation
display_name: Memory Rotation
type: hook
status: active
trigger: session close (called by Clio via the session-close seating sequence)
owner_agents: [memory-maggie]
---

# Memory Rotation Hook

**Fires:** at session close, called by Closing Clio as part of Step 1 of the session-close
seating sequence. Maggie runs this after placement triage on memory candidates.
**Canonical source:** this file.
**Steward:** Memory Maggie (`super-agents/memory-maggie/`).
**Companion:** `hooks/session-close.md` (the contract that invokes this).

---

## Purpose in one line

Keep every agent's memory files parseable under the ~30KB read cap by enforcing
size budgets and rotating cold content to archives, so the hot layer stays small,
opinionated, and loadable in a single read.

---

## Core principle

**Curation IS the memory.** A file that only grows is a transcript, and we already have
transcripts (the session task comments). The reason an agent has memory is to hold
*judgment*: the distilled, opinionated, compressed version of what happened. Every
rotation pass asks one question: *"what here changes how I'd act tomorrow?"* Only
that stays hot. Everything else is archive.

---

## The three tiers

| Tier | What lives here | Load behavior | Budget |
|---|---|---|---|
| **Hot** | What you need EVERY session. Personality-level context, active pointers, live working knowledge, recent scars. | Always loaded (deep steep on session open). | ~10KB per file |
| **Warm** | Valuable but not needed by default. Graduated entries, resolved topics, older scars now encoded in tools. | Loaded on-demand when the session touches that domain. | ~10KB per archive file |
| **Cold** | Raw session history. Quarterly activity-log archives, old decision-log entries. | Never re-read unless explicitly resuming old work or searching for a specific past decision. | No cap (append-only, never edited) |

---

## Per-file budgets and rotation mechanics

### `memory.md` (the hot layer)

**Budget:** ~10KB hard cap.

**What stays hot:**
- How Michael works (preferences that affect every session)
- Active relationships with other agents (who I call, who calls me)
- Live scars (mistakes that would repeat without the reminder)
- Pointers to stewarded tools (one line each, never procedure)
- Working context for in-flight projects

**What gets graduated to warm:**
- Resolved project context (the project shipped, the scar is now a tool)
- Historical relationships (an agent that was retired or merged)
- Detail that's encoded elsewhere (a scar that became a gate)
- Anything where a one-line pointer would serve as well as the full entry

**Archive location:** `<agent-slug>/memory/archive/<topic-slug>.md`

Example: `dev-dexter/memory/archive/inciardi-market-scars.md`

**Rotation mechanic:**
1. After all memory writes land, measure `memory.md` size.
2. If over ~10KB: identify entries that are resolved, encoded elsewhere, or
   replaceable by a pointer. Move them to the appropriate archive file
   (create it if new; append if existing).
3. Replace each moved entry with a one-line pointer:
   `- [topic]: see memory/archive/<file>.md`
4. Re-measure. If STILL over budget after reasonable curation, flag to Michael
   ("memory.md is at XKB after curation; needs a manual review to identify
   what can be dropped vs what I genuinely need every session").
5. Close is NOT blocked by a flag, only by a file that can't be read whole (~22KB).

**The 10KB number:** chosen because it leaves headroom under the 22KB practical
ceiling (base64 inflation), allows for temporary growth between rotations, and
is small enough that deep-steeping the whole file on session open is fast.

---

### `activity-log.md` (sliding window)

**Budget:** ~4-5KB (roughly 10-15 session entries).

**What stays in the window:**
- The most recent 10-15 session entries (one condensed entry per session:
  date, what, key decisions, state left, session task link).

**What rotates to cold:**
- Oldest entries, moved to quarterly archive files.

**Archive location:** `<agent-slug>/activity-log/YYYY-QN.md`

Example: `dev-dexter/activity-log/2026-Q3.md`

**Rotation mechanic:**
1. After appending the current session's entry (newest on top), measure file size.
2. If over ~5KB: move the OLDEST entries (from the bottom) to the current
   quarter's archive file. Move enough to bring the main file under budget.
3. Archive files are append-only and never re-read unless explicitly resuming
   old work.
4. The main file always has the most recent sessions. It never has gaps.

**Why a sliding window:** the activity log's job is "what did I do recently?"
Anything older than ~15 sessions is cold context that a specific lookup can
retrieve if needed, but shouldn't cost load time every session.

---

### `decision-log.md` (partial load with TOC)

**Budget:** no hard cap on the FILE (decisions accumulate forever), but a
**load budget** of ~5-8KB at session open.

**Load behavior:**
- On session open (deep steep): load the **last 5-8 entries** (newest first)
  plus a **table of contents** listing every entry by ID + one-line summary.
- On-demand: when a specific older entry is referenced (by ID, topic, or
  keyword), load it individually.

**Why no rotation:** decision logs are reasoning about the agent's own shape.
  They don't grow fast (one entry per decision, not per session), and old
  decisions stay relevant longer than old activity entries. Partial loading
  solves the read-cap problem without losing the record.

**TOC format (maintained at the top of the file):**
```markdown
## Table of Contents

| ID | Date | One-line summary |
|---|---|---|
| D5 | 2026-07-25 | Born half-wired, roster registration open |
| D4 | 2026-07-25 | Seated through Mira, class-blind |
| D3 | 2026-07-24 | Name: Dev Dexter |
| D2 | 2026-07-25 | Primarily engineer, writes code |
| D1 | 2026-07-24 | NET-NEW teammate for build lane |
```

**Maintenance:** when a new entry is added, add a TOC row. When the decision
log is first loaded, if no TOC exists, generate one from the entries present.

---

## The gate (what makes this non-optional)

This rotation is a **GATE on session close**, not a suggestion. Clio cannot
complete the close sequence while any agent bundle is in a state that would
prevent a full read on next session open.

**Blocking condition:** any file that cannot be read whole (~22KB on disk,
which inflates to ~29KB via base64 and hits the ~30KB tool cap).

**Non-blocking warning:** a file over its TARGET budget (~10KB memory,
~5KB activity) but still under the read cap. Maggie curates in the same
pass and reports what she did. Close proceeds.

**Hard block (requires Michael):** a file that cannot be brought under
the read cap by automated curation (e.g. a memory.md where everything
still seems hot). Flag it, report it in Channel 1, but do NOT delete
content without Michael's review. Close proceeds with the flag.

---

## What Maggie does at each close (the execution steps)

This is the PROCEDURE Maggie runs. She reads it from here (Constitution
\S2-\S3: agents are hands executing written tools).

1. **Receive the agents-present table** (section 0 of the Handoff Artifact).
   Identify every row where `Memory-relevant? = yes`.

2. **For each memory-relevant agent, in order:**

   a. **Read `memory.md`** (blob API, fresh SHA). Note the size.
   b. **Process any tagged memory candidates** from section 4 of the
      Handoff Artifact. Run placement triage:
      - Is this procedure? -> route to a tool, not memory.
      - Is this already captured? -> skip (dedupe).
      - Is this durable? -> write it to the agent's `memory.md`.
      - Deny-by-default for brain `/PREFERENCES.md`.
   c. **Re-measure `memory.md`.** If over ~10KB: run the rotation mechanic
      (identify graduated entries, move to archive, leave pointers).
   d. **Read `activity-log.md`.** If over ~5KB: rotate oldest entries to
      the quarterly archive.
   e. **Note the state** (size before/after, actions taken) for the
      Channel 1 report.

3. **Handle brain memory** (`/PREFERENCES.md`):
   - Same placement triage on any brain-memory candidates.
   - Size check against 2000 token cap.
   - Report in the standard Memory Audit format.

4. **Post Channel 1** (Memory Audit) with both brain-memory health AND
   per-agent bundle health (the "Agent bundle health" sub-section in
   the thread reply template from `session-close.md`).

5. **Return control to Clio** to continue the execution sequence.

---

## Archive file conventions

- Archive files are CREATED by Maggie when needed (first rotation into
  that topic/quarter). They do not pre-exist.
- Naming: topic-sharded for memory (`<topic-slug>.md`), quarterly for
  activity (`YYYY-QN.md`).
- Each archive file opens with a one-line header stating what it is:
  `# Archive: <agent> / <topic or quarter>`
- Archive files are append-only. Never edit, never reorganize.
- Archive files themselves have a soft cap of ~10KB. If one grows past
  that, start a new shard (`<topic-slug>-2.md` or next quarter).

---

## Folder structure (per agent, after rotation is active)

```
brain-config/super-agents/<slug>/
  memory.md                  # HOT: always loaded (~10KB cap)
  memory/
    archive/
      <topic-slug>.md        # WARM: on-demand
      <topic-slug>-2.md      # WARM: shard overflow
  activity-log.md            # SLIDING WINDOW (~5KB cap)
  activity-log/
    2026-Q3.md               # COLD: quarterly archive
    2026-Q4.md
  decision-log.md            # PARTIAL LOAD (TOC + last N)
  preferences.md             # identity/voice/lane (not rotated)
  README.md                  # steward metadata (not rotated)
```

---

## What this does NOT cover

- **Brain memory** (`/PREFERENCES.md`): that's the Memory Edit Guard +
  Memory Write Relay. This hook calls those, it doesn't replace them.
- **When to graduate a lens to a teammate:** that's Fleet Felix.
- **What goes IN memory vs a tool:** that's the Procedure-is-a-tool gate
  (Constitution \S3). This hook enforces SIZE, not content type.
- **The session-close sequence itself:** that's `hooks/session-close.md`.
  This hook is one step within it.

---

## Invocation + Trigger

This hook is NOT independently invocable. It fires ONLY as part of the
session-close seating sequence (Clio calls Maggie, Maggie runs this).
There is no `/memory-rotation` command. If an agent needs an ad-hoc
rotation mid-session (unlikely), it queues the request for close.

---

## Changelog

- 2026-07-25 - created. Born from a Dev Dexter session on agent memory
  architecture. Design: hot/warm/cold tiering, per-file budgets, rotation
  as a gate on close. Fills the TBD pointer in session-close.md and
  orchestration.md. Session task: Brain (Opus 4.6) Dev Dexter, agent
  memory/close architecture, Jul 25.
