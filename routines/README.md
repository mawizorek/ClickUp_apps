# Routines — Agent-Agnostic Runbook Standard

**The core idea: separate the WHAT from the WHO from the WHEN.** A routine is a repeatable job whose *procedure* lives as a runbook file here. Any agent could execute it by reading the file and following it literally. **Routine Ricky** is simply the agent we point at it. The *schedule* lives in `schedule.md`, never in the runbook. Change a procedure = edit the runbook. Change a cadence = edit `schedule.md` (or just tell Ricky). Change the executor = swap the agent. Three concerns, three homes, none entangled.

## 🚨 INVOKE-ONLY (LOCKED 2026-07-26, Michael)

**No routine runs on its own. There is no timer, no wake, no background sweep.** The executor is a **git-teammate**, which by definition has no autonomous triggers — it runs when a session invokes it and never otherwise. The native ClickUp Super Agent that used to hold the clock is being removed.

This is a real capability loss, stated plainly rather than papered over: **a routine is only as current as the last time Michael asked.** Everything below is written for that world. When reading anything in `routines/` that sounds like it assumes a clock, it is rot — flag it.

## Editing an executor agent — REQUIRED CHECK (do this before every executor edit)

This is a rule, not a suggestion. Before adding ANY instruction to an executor agent (Routine Ricky or any future executor), you MUST route the detail to its correct home instead of the agent:

- If it is **procedure** (what/how the work is done) → it goes in the routine's runbook `routines/<name>.md`. NOT the agent.
- If it is a **shared rule across refreshes** (verify-first, merge, never shrink coverage, platform honesty, source freshness) → it goes in the Data-Refresh Discipline below. NOT the agent.
- If it is **timing** → it goes in `schedule.md`. NOT the agent.
- Only **executor mechanics** (triage/due-math, idempotency, catch-up, commit+stamp, reporting shape, fail-loud, the data-only rail) may live in the agent profile.

**The test:** if any other agent could be dropped in as the executor and would need this same instruction, it is NOT an agent-level detail — it belongs in one of the files above so everyone inherits it. Making the executor “smarter” is almost always a sign the detail is in the wrong place. Keep executors dumb on purpose; their reliability is the product. (An executor writing procedure into its own profile is exactly this failure — relocate it here.)

> ⚠️ **This check has a bigger sibling, learned 2026-07-26: run it on the FRAMEWORK too, not just on the agent.** That day a second, parallel refresh framework was authored under `brain-config/` — its own schedule, its own timestamp store, its own registry — by someone who searched `brain-config/` for prior art, found none, and never looked in `routines/`. Nothing was wrong with the reasoning except where it looked. **Before building any state or scheduling machinery for a routine, read this directory first.** Two claimants on one truth is the failure mode this whole standard exists to prevent.

## The contract

- **Runbooks are the source of truth for the procedure** (the WHAT), and must be SELF-SUFFICIENT — any agent reads the runbook and knows exactly what to do, without inheriting behavior from a specific executor. Never put procedure in the agent; if it describes what/how the work is done, it lives here.
- **Schedules live in `schedule.md`** (the WHEN), not in runbook specs.
- **Stamps live in `routines/last-run/<routine>.txt`** (the STATE) — one file per routine, one writer per file, never a shared log. See `schedule.md` for the incident that locked this and the 2026-07-26 attempt to un-lock it.
- **APPROVED DATA SURFACES ONLY.** A routine may only write *data*, never app source, engine, or structure. The rail exists to keep routines away from `index.html`, JS, CSS, README, and repo/list structure — it is NOT a ban on writing data objects that happen to live on another platform. Approved write surfaces:
  - **(a) Repo data files** (e.g. `data.json`) — the primary store.
  - **(b) Designated ClickUp task fields** — only when a runbook explicitly names the list and the whitelisted fields (typically name, status, dates, and named custom fields), and only on *existing* tasks.
  - **(c) The routine's own `last-run` stamp file.**
  If a routine seems to need an engine/source/structure change, that's a build session — STOP and flag, never do it inside a routine.
- **ClickUp object writes are field-scoped and non-structural.** A routine may update whitelisted fields on existing tasks; it may NEVER create, delete, move, reparent, or restructure tasks or lists. Unlike a git commit, a ClickUp write is not auto-revertible, so the mapping from data → task MUST be an explicit key defined in the data (e.g. a `cuTaskId` on each record) — never fuzzy name-matching. On any ambiguity (missing key, task not found, field missing) the routine STOPS and flags instead of guessing.
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
10. **SOURCE FRESHNESS — rank by dated provenance, never by proximity** *(added 2026-07-26 from `brain-config/hooks/source-freshness-gate.md`, itself born from a live wrong-answer on 07-25).* Fires the moment a routine FETCHES anything:
 - **Ranking:** owner-updated dated profile > the subject's own dated page > a third party about its OWN operation > a third party reporting someone else's facts > undated aggregators (near worthless).
 - **A first-party snapshot EXPIRES.** A two-year-old post by the owner is not current.
 - **Agreeing aggregators are ONE source, not five.** Count ORIGINS, not rows.
 - **Never assert a volatile fact without knowing the AGE of the claim.** Say “unverified” instead. Age is part of the fact, not a footnote.
 - **Confirm you matched the right ENTITY** before trusting anything it says.
11. **Never substitute a source silently** (`brain-config/hooks/silent-fallback-law.md`). If a pinned source is dead, say so, mark the run incomplete, and stamp anyway. Do not quietly answer from a different source and report as if the pinned one answered.
12. **ALWAYS stamp after a run — including a FAILURE.** Write `routines/last-run/<routine>.txt` on success. On failure, leave it untouched (so it stays overdue) and say so in the report. With no scheduler, an unreported failure is indistinguishable from a routine nobody invoked.

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
N-1. Stamp routines/last-run/<routine>.txt
N.   Report

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

## Risk tiers (locked; re-scoped 2026-07-26)

These were written when the executor ran unattended, so “auto-commit” meant *without a human in the loop*. **Under invoke-only there is always a human in the loop** — the invocation itself. The tiers now describe what may proceed **once the invoked run is approved**, not what may happen unsupervised:

- **Data-only refresh** → commit to `main` without further confirmation. (All current routines.)
- **ClickUp task-field refresh** (whitelisted fields on existing tasks, keyed mapping) → same tier — field-scoped and non-structural.
- **Anything touching engine/source, or creating/deleting/moving/reparenting tasks or lists** → NOT a routine. Route to a build session.

**Do not re-gate an approved run.** Asking again inside a run the human just authorized is a confirmation in front of a confirmation, and it trains people to click through.

## Adding a routine

1. Drop a new runbook file in `routines/` using the shape above (procedure only).
2. Add one row to `schedule.md` for its cadence — and if it is date-bounded, put the **end date in the row**, not only in the runbook. (The World Cup stand-down instruction lived only in its runbook and went seven days unexecuted.)
3. Create `routines/last-run/<routine>.txt` containing `never`.

Zero agent changes. **If adding a routine requires editing the executor, the framework is wrong; fix the framework.**

## Current routines

| Routine | Target | Cadence (see schedule.md) | Status |
|---------|--------|---------------------------|--------|
| `on-track-refresh.md` | `on-track/data.json` | every Wednesday | active |
| `f1-refresh.md` | `f1-racetracks/f1-results/2026/` + ClickUp “Race History” field (slim mirror) | Thu–Sun, session-aware | active |
| `world-cup-refresh.md` | `world-cup-bracket/data.json` + ClickUp “World Cup” list (mirror) | — | 🏁 **RETIRED 2026-07-26** (tournament ended Jul 19; app stays live) |

## Executor

**Routine Ricky** — a **git-teammate**. The canonical definition is the repo bundle at **`brain-config/super-agents/routine-ricky/`**, invoked with `/session.agent=Ricky`. His runbook door is `brain-config/hooks/data-refresh.md`, which triages against THIS directory.

> ⚠️ **Reversed 2026-07-26.** This section used to read: *“the live ClickUp Super Agent is the source of truth for his behavior; the repo profile is a non-canonical reference.”* **That is now backwards.** The native ClickUp agent is being removed, a workspace sweep found no native agents at all, and the repo bundle is the only definition that exists. Anything still describing a live native Ricky is rot.

He is deliberately minimal: **invoked hands, not a brain.** He holds executor mechanics only — triage/due-math, idempotency, catch-up, commit+stamp, report, fail-loud, and respecting the approved-surfaces rail. All refresh *procedure*, including any ClickUp mirror mapping, lives in the runbooks. All *timing* lives in `schedule.md`. Before editing him, run the **Editing an executor agent** check above.

**Any agent may run any routine.** That is the point of the standard, and it matters more now: with no clock, whoever is already in a session is the cheapest executor. Read the runbook, follow it literally, stamp the last-run file. You do not need to be Ricky.
