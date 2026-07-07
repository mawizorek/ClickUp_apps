# Routines — Agent-Agnostic Runbook Standard

**The core idea: separate the WHAT from the WHO from the WHEN.** A routine is a repeatable job whose *procedure* lives as a runbook file here. Any agent could execute it by reading the file and following it literally. **Routine Ricky** is simply the agent we put on the clock. The *schedule* lives in `schedule.md`, never in the runbook. Change a procedure = edit the runbook. Change a cadence = edit `schedule.md` (or just tell Ricky). Change the executor = swap the agent. Three concerns, three homes, none entangled.

## Editing an executor agent — REQUIRED CHECK (do this before every executor edit)

This is a rule, not a suggestion. Before adding ANY instruction to an executor agent (Routine Ricky or any future executor), you MUST route the detail to its correct home instead of the agent:

- If it is **procedure** (what/how the work is done) → it goes in the routine's runbook `routines/.md`. NOT the agent.
- If it is a **shared rule across refreshes** (verify-first, merge, never shrink coverage, platform honesty) → it goes in the Data-Refresh Discipline below. NOT the agent.
- If it is **timing** → it goes in `schedule.md`. NOT the agent.
- Only **executor mechanics** (wake logic, idempotency, catch-up, commit+stamp, reporting shape, fail-loud, the data-only rail) may live in the agent profile.

**The test:** if any other agent could be dropped in as the executor and would need this same instruction, it is NOT an agent-level detail — it belongs in one of the files above so everyone inherits it. Making the executor “smarter” is almost always a sign the detail is in the wrong place. Keep executors dumb on purpose; their reliability is the product. (An executor writing procedure into its own profile is exactly this failure — relocate it here.)

## The contract

- **Runbooks are the source of truth for the procedure** (the WHAT), and must be SELF-SUFFICIENT — any agent reads the runbook and knows exactly what to do, without inheriting behavior from a specific executor. Never put procedure in the agent; if it describes what/how the work is done, it lives here.
- **Schedules live in `schedule.md`** (the WHEN), not in runbook specs.
- **APPROVED DATA SURFACES ONLY.** A routine may only write *data*, never app source, engine, or structure. The rail exists to keep routines away from `index.html`, JS, CSS, README, and repo/list structure — it is NOT a ban on writing data objects that happen to live on another platform. Approved write surfaces:
  - **(a) Repo data files** (e.g. `data.json`) — the primary store.
  - **(b) Designated ClickUp task fields** — only when a runbook explicitly names the list and the whitelisted fields (typically name, status, dates, and named custom fields), and only on *existing* tasks.
  If a routine seems to need an engine/source/structure change, that's a build session — STOP and flag, never do it inside a routine.
- **ClickUp object writes are field-scoped and non-structural.** A routine may update whitelisted fields on existing tasks; it may NEVER create, delete, move, reparent, or restructure tasks or lists. Unlike a git commit, a ClickUp write is not auto-revertible, so the mapping from data → task MUST be an explicit key defined in the data (e.g. a `cuTaskId` on each record) — never fuzzy name-matching. On any ambiguity (missing key, task not found, field missing) the routine STOPS and flags instead of guessing.
- **Auto-commit / auto-write is allowed because scope is data-only and non-structural** — git commits are self-correcting, and ClickUp writes are field-scoped and mapping-keyed. This safety only holds while those rails hold.
- **Fail loud, never guess.** Unclear runbook, unverifiable data, failed step, an unresolved mapping, or a non-data/structural target: STOP and report.

## Data-Refresh Discipline (UNIVERSAL — applies to every refresh routine)

This is process, not executor behavior — it lives here so ANY agent running ANY refresh routine does the right thing. A “refresh” is a **verify-and-merge**, never a blank-slate rebuild:

1. **Read the current data file first.** It is the baseline you extend and correct, not something you overwrite from scratch. Preserve any join keys (e.g. `cuTaskId`) that link records to other surfaces — they are structural glue, never drop them.
2. **Verify existing entries, don't just trust them.** Double/triple-check that each existing entry's time, platform, and status are still accurate — times shift, sessions get added, events get canceled or delayed. The primary job is keeping what's there ACCURATE; second is scraping in new entries that belong. (Two 2026 F1 results sat silently WRONG in the store until a verify pass caught them — trust nothing unverified.)
3. **Merge, don't replace.** Add newly-found entries, correct changed ones, drop only what has truly aged out of the window.
4. **Never shrink coverage silently.** A category/series represented last run must not vanish this run. If you can't find its data, KEEP the prior entries and flag the gap — deleting coverage is a STOP-and-flag event, not a quiet outcome.
5. **Confirmed event > complete metadata. Do NOT omit a confirmed event just because platform or exact time is missing:**
 - **Event date confirmed** (official/reliable source) → eligible for inclusion, even if platform or exact time is still open.
 - **Exact time confirmed** → use normal `start`/`end`.
 - **Time still TBD** (event too far out) → include it honestly with a TBD-style handling pattern in the existing schema. NEVER invent or guess an exact time.
6. **Platform honesty — `Stream` vs `Unknown` are distinct and NOT interchangeable:**
 - **`Stream`** = a confirmed streaming-only / direct-to-consumer source exists, but no traditional TV channel should be named.
 - **`Unknown`** = the event is confirmed but no reliable viewing platform has been verified yet.
 - Never collapse one into the other, and never invent a channel to fill an `Unknown`.
7. **Schema stability.** Prefer working within the current schema; do NOT change it unless absolutely necessary. If a confirmed-date / TBD-time (or platform-`Unknown`) entry genuinely can't be represented cleanly, that's the SMALLEST-possible schema/engine change — STOP, flag it as a build task (engine work, out of routine scope), and describe it. Never expand the schema inside a data refresh.
8. **Mirror writes follow the source.** When a routine mirrors data to a second surface (e.g. ClickUp tasks), the repo data file is the source of truth and the mirror is derived. Only push whitelisted fields, only on records whose mapping key resolves 1:1, and reflect the same verify-and-merge outcome. A mapping that doesn't resolve is a STOP-and-flag, never a create. NOTE: direction of truth can INVERT by time horizon — see the Anchor Convention in the Apps/Artifacts reference (live lens canonical in-season; a frozen archive lens canonical for closed periods, fill-if-blank + conflict-flag, never clobber).
9. **Notable changes are worth surfacing.** If an entry materially shifted (delay, moved session, cancellation), note it in the run report. Rendering a “was X → now Y” callout in the UI needs an engine field + render support → that's a BUILD task, out of routine scope; flag it, don't attempt it in a data refresh. (Rare.)

Runbooks may add domain specifics on top of this, but this discipline is the floor for all of them.

## Runbook shape (every routine file uses this exact structure)

```
# <Routine Name>

goal:       <one sentence, what a successful run produces>
target:     <exact surface(s) this writes — repo data file(s) and/or a named ClickUp list + whitelisted fields>
report-to:  <where the run report goes>

## Steps
1. <literal, ordered, unambiguous step>
2. ...

## Guardrails (STOP + flag if any is true)
- Target is app source/engine/structure, or would create/delete/move a ClickUp task or list.
- A required value can't be verified.
- A mapping key doesn't resolve 1:1.
- Coverage would shrink vs the current file.
- The schema would need to change.
- <routine-specific tripwires>

## Report format
<commit link, live URL, count previous → new, categories covered, mirror surface touched, anomalies, Files touched>
```

## Risk tiers (locked)

- **Data-only refresh** → auto-commit to `main`. (All current routines.)
- **ClickUp task-field refresh** (whitelisted fields on existing tasks, keyed mapping) → allowed within a routine, same tier as data-only — it's field-scoped and non-structural.
- **Anything touching engine/source, or creating/deleting/moving/reparenting tasks or lists** → NOT a routine. Route to a build session.

## Adding a routine

1. Drop a new runbook file in `routines/` using the shape above (procedure only).
2. Add one row to `schedule.md` for its cadence.
Zero agent changes. If adding a routine requires editing the executor, the framework is wrong; fix the framework.

## Current routines

| Routine | Target | Cadence (see schedule.md) |
|---------|--------|---------------------------|
| `on-track-refresh.md` | `on-track/data.json` | every Wednesday |
| `f1-refresh.md` | `f1-racetracks/data.json` + ClickUp “F1 Races” list (mirror) | Thu–Sun |
| `world-cup-refresh.md` | `world-cup-bracket/data.json` + ClickUp “World Cup” list (mirror) | every 2h, through 2026-07-19 |

## Executor

**Routine Ricky** — the live ClickUp Super Agent is the source of truth for his behavior; the repo profile `brain-config/agents/routine-ricky.md` is a non-canonical reference. Deliberately minimal: scheduled hands, not a brain. He holds executor mechanics only (when to wake, idempotency, commit+stamp, report, fail-loud, and respecting the approved-surfaces rail). All refresh *procedure* — including any ClickUp mirror mapping — lives in the runbooks, not in him. Before editing him, run the **Editing an executor agent** check above.
