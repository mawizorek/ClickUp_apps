# Activity Log — ClickUp-Native (the log lives on the Agent Index row)

> **STATUS: LAW as of 2026-09-20 for all NEW agents. MIGRATION IN PROGRESS for existing ones.**
>
> 📋 Decision history: the *Agent Activity Log Migration — Decision Log* (ClickUp page, nested under the
> Brain Reference Library). 🚫 Per Decision-Log Gold Standard rule 11, no decision log lives in this repo.
> Origin handoff: `↪️ HANDOFF · Mira · Activity-log migration · Sep 2` (task `86akac5cj`), parked 18 days.

---

## Invocation + Trigger

**Slash:** `/log-migrate` · `/migrate-activity-log`

**Fires automatically when:**

- 🔴 **A NEW super-agent is being authored.** The bundle ships with **NO writable git activity log** — see
  §1. This is the single most important trigger and it is not optional.
- An existing agent's `activity-log.md` is about to be edited and has not yet been migrated → migrate it
  in that same pass rather than growing it further.
- Any session touching `hooks/memory-rotation.md`, `hooks/session-close.md`, or a bundle's load manifest.

🚫 **Does NOT fire on:** stateless lenses in `agents/<slug>.md`. They have no bundle and no log. Their
activity, when it matters, is a threaded reply on a session task per the session-transcript gate.

---

## 🔴 §1 THE LAW (Michael, 2026-09-20)

**Verbatim:** *"let's begin to migrate every agent's log to row comments. confirm that any NEW agents
build exclusively to new model and dictate into their CU task regularly."*

1. 🔴 **The LOG is a ClickUp surface.** An agent's chronological activity record lives as **comments on
   that agent's row in the 🤖 Agent Index** (list `901328043244`). Not in git. Ever.
2. 🔴 **NEW agents build EXCLUSIVELY to this model.** No `activity-log.md` is authored for a new bundle,
   not even as a stub to migrate later. ⚠️ **Vector Vale (2026-09-07) is the founding example of the
   born-migrated shape** and his `decision-log.md` D2 explains why a born-migrated stub differs from a
   migrated one: it carries no backfill receipts, because there was never a git log.
3. 🔴 **DICTATE REGULARLY, not at close.** Every qualifying reply posts its transcript comment to the row
   in the agent's own voice. The per-response logging mandate is unchanged; **only its destination moved.**
4. ⚠️ **This is now the FLEET RULING, superseding five per-agent approvals** (Felix 09-05, then Milo,
   Dexter, Ricky, Vale). 🚫 Those five are no longer "exceptions" and must stop being described as such.

### The four-way placement boundary (unchanged by this ruling, restated because it is the point)

| What | Where | Why |
|---|---|---|
| **LOG** — what happened, chronological, append-only, never read whole | 🆕 **Agent Index row COMMENTS** | Cheap to write, naturally chronological, no commit ceremony |
| **MEMORY** — what the agent LEARNED that changes future behaviour | **git `memory.md`**, small, curated | Durable, diffable, read in full on every load |
| **PREFERENCES** — who the agent IS | **git `preferences.md`**, near-static | The identity contract |
| **LOCATION KNOWLEDGE** — facts about a list/space/production ANY agent needs | **List Index row** (`901327881037`) or its Agent Interaction subpage | 🔴 **Never a private agent file** |

⭐ **Michael's insight that produced the fourth row:** *"maybe what we store in memory is actually
pertinent to more agents and should become more connected to the list or location."* Much of what bloated
Milo's `memory.md` was **URITP knowledge, not Milo knowledge** — the `GCal STATUS` N/A trap, all-day
events returning UTC-shifted, the hazard library-vs-instance rule. **Locking shared facts in one agent's
private file is why the file grew and why nobody else benefited.**

---

## §2 WHY — the measured evidence, so nobody re-litigates this

- ⭐ **Michael's diagnosis of the root cause:** *"it isn't a commit push you have to do just to document
  your work."* Writing a log required branch → PR → merge. **That friction is why logs went unwritten
  and then arrived as one huge catch-up blob.**
- 🔴 **PROVEN, twice, in this fleet:**
  - **Milo:** `activity-log.md` 26,644 B and `memory.md` 26,099 B, both past the ~22KB editability
    ceiling. `working-notes.md` carried **five hot-memory entries parked since 2026-08-10** because
    `memory.md` was 31.4KB — above the write cap — so adding three bullets risked losing 31KB. **Still
    parked 23 days later.** `memory/archive/` existed and was EMPTY: rotation specced, never run.
  - **Vale (`decision-log.md` D8):** logged transcripts **flawlessly on the row for five consecutive
    sessions** and made **ZERO git memory writes** in the same span. 🔑 **Same rule, two surfaces,
    opposite outcomes, and the only variable was WRITE COST.** The cheap surface's success disguised the
    expensive surface's failure for eight days.
- ⭐ **The generalization this hook exists to encode: when a rule spans two surfaces with different write
  costs, it is honoured on the cheap one and quietly abandoned on the expensive one.** Moving the log to
  the cheap surface is not convenience, it is **removing the only variable that predicted the failure.**

---

## §3 MIGRATION — five steps per agent, in this order

🔴 **ORDER IS LOAD-BEARING. Step 4 before step 3 leaves a broken load contract; step 5 before step 2
destroys history.** (The 2026-09-17 iCloud precedent: a correct fix in the wrong order is a data-loss
event.)

**1 · MEASURE and declare.** Record the file's byte size from a fresh directory listing before touching
it. 🚫 Never quote a size from an earlier read.

**2 · BACKFILL the history as comments.** Post the existing log's entries to the agent's Index row,
**oldest first**, in the agent's own voice where the source preserved it. Chunk by session, one comment
per session entry. Each backfilled comment is marked `[BACKFILL · <date>]` so it is never mistaken for a
live transcript. ⚠️ **A 26KB log does not fit one read** — work in passes and say which passes are done.

**3 · PIN a LIVE STATE block in the row DESCRIPTION.** 🔴 **Non-negotiable, and it is the one thing that
makes this model survivable.** The row description carries the permanent, stamped state block; comments
carry the sliding history. **Precedent: Maggie PR #798**, which moved permanent state outside the sliding
window for exactly this reason.

**4 · UPDATE the load manifest.** Every `preferences.md` Load Manifest names `activity-log.md`
explicitly. 🔴 **Deleting files without fixing manifests leaves ~28 broken load contracts.** The manifest
line must point at the ROW and say plainly: *there is no git activity log; do not go looking for one.*

**5 · TOMBSTONE the git file — 🚫 DO NOT DELETE IT.**

> **RULED: tombstone, not delete.** Milo's position, adopted. **A cold agent that finds nothing at a
> documented path assumes there is no history and starts inventing one.** Doing that to ~28 bundles
> simultaneously is how this breaks quietly. A one-line stub costs nothing and closes the whole failure
> class. The stub states: the log lives on the Index row, the byte size it had at migration, and the
> **commit SHA containing the last full version.**

⭐ **Migrated stubs and born-migrated stubs are DIFFERENT ARTIFACTS** (Vale D2). A migrated stub carries
backfill receipts and a recovery SHA; a born-migrated one carries neither, because there was nothing to
migrate. **Conflating them makes real receipts look lost.**

---

## §4 🔴 THE TWO RISKS, and what each one costs if ignored

**1 · COMMENT RETRIEVAL CAPS — a live, documented failure, not a prediction.** The Job Market standing
thread reached **250 comments and only the newest ~25 were retrievable in one read.** 🔴 **Mitigation is
step 3 and it is mandatory:** permanent state pinned in the description, history in comments. Without it
a cold agent does archaeology and gives up. ⚠️ **This risk gets WORSE over time and silently** — nothing
warns you when the window starts clipping.

**2 · A CHEAPER LOG INVITES MORE LOGGING.** ⚠️ **The size cap was an accidental brake, and this ruling
removes it.** Same bloat, one surface over.

> **THE CADENCE RULE THAT REPLACES THE SIZE CAP (written at migration time, per the handoff's demand
> that it not be deferred): ONE comment per qualifying reply. Not one per tool call, not one per
> thought.** The qualifying test is unchanged from the base spec — a reply that delivers content, answers
> a question, takes an action, makes a decision, or issues a correction. 🚫 **A second comment on the same
> reply is a defect.** And the LIVE STATE block is **edited in place, never appended to.**

---

## §5 What this does NOT change

- 🚫 **`memory.md` stays in git.** Its ~10KB hot cap, its rotation to `memory/archive/`, and the
  placement test (§4a: *can this go stale in a day?*) are untouched. **The log moved; memory did not.**
- 🚫 **`decision-log.md` stays in git.** Reasoning about the agent's own shape is durable and diffable.
- 🚫 **`/PREFERENCES.md`** still routes exclusively through Memory Maggie's placement triage.
- 🚫 **The session-transcript gate is unchanged.** Session tasks on the 🟢 Agent Activity Board and the
  spine line are separate surfaces with separate jobs. **This hook governs the AGENT's log, not the
  SESSION's record.** ⚠️ A session task is per-session and shared; an Index row is per-agent and durable.

---

## §6 ⚠️ OWED, and stated rather than quietly skipped

1. 🔴 **`super-agents/_shared/super-agent-base.md` still describes `activity-log.md` as a real git file**
   (§File set, §Per-response logging mandate item 2, and the load contract's step 3). **It measures
   23,734 B and the GitHub MCP standard LOCKS writes at ~30KB**, so a full-file rewrite is the documented
   collision-9 hazard (two 32KB writes through a 30KB-capped tool; both succeeded on luck). ⚠️ **The base
   spec is the canonical contract and it currently contradicts this hook.** Until it is amended by a
   size-aware method, **this hook wins on the log's location and the base spec wins on everything else.**
   **Stated here so no agent resolves the contradiction by guessing.**
2. ⚠️ **`hooks/memory-rotation.md` still states the old whole-file budget** and needs the new shape.
3. ⚠️ **One row in the AI Toolkit index trigger table** so a cold session routes here. That page has
   refused agent-driven edits before; expect to hand Michael a paste block.
4. ⚠️ **Fold-in Frank and Memory Maggie were BYPASSED on the direction.** The handoff demanded Frank
   first, then the Workshop, then Maggie's placement ruling. **Michael ruled the direction himself**,
   which is his to do — but **Maggie's placement ruling on the four-way boundary in §1 has never been
   taken**, and she is the sole authority on where knowledge lives. 🔴 **Recorded as a gap, not as an
   approval.**

---

## §7 Ownership

**Ownerless** for a one-off per-agent migration — any agent runs the five steps (Doc-Rot-Sweep precedent).
⚠️ **A full fleet-wide reported pass IS an audit and SEIZES to Audit Anna.** **Fleet Felix** stewards the
Agent Index as a surface; **Memory Maggie** owns the placement boundary in §1 and has not yet ruled on it.

🔴 **Generalized from FIVE per-agent instances and ZERO fleet-wide runs.** A session that finds no prior
migration report for an agent **says so** rather than assuming the pattern is proven at scale.

---

**Born 2026-09-20.** Michael's ruling on an 18-day-parked handoff, during the session that built Vellum
Victoria and cleared Vale's overdue git pass — **the two events that supplied the evidence.**
