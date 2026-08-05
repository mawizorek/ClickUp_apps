# Agent Surface Allocation

**Purpose:** decides WHICH of the four agent-facing surfaces a given piece of knowledge is written to. Placement layer.
**Mode:** always-on, deterministic. Fires before any agent self-write.
**Owner:** Memory Maggie (placement authority). Any agent executes it; nobody negotiates it.
**Companion:** `hooks/agent-state-cull.md` (the fold loop that keeps surface 3 bounded).
**Status:** ⚠️ **PROPOSED — unratified.** See the Size Sally collision at the bottom before relying on surface 3.

---

## Why this exists (the actual diagnosis, stated plainly)

The per-response logging mandate has been law since 2026-07-25 and has never held.
Sessions were scored for it repeatedly. The fix attempted every time was more emphasis:
bolder text, harder locks, the word NON-NEGOTIABLE. It did not work, and it was never
going to, because **the failure was never about willingness.**

Measure the two surfaces that carry the same rule:

| Surface | Rule | Tool calls per write | Actually happens |
|---|---|---|---|
| Spine channel | one line per reply | **1** (`post_comment`) | yes |
| `activity-log.md` | one line per reply | **~4** (list dir → read SHA → fetch body → commit) | no |

Same agent. Same session. Same mandate. Same model. The only variable that differs is
what the write COSTS, and compliance tracked cost with almost no residual.

**The rule that comes out of this and generalizes past this document: an instruction whose
compliance cost exceeds its perceived value gets skipped, and no amount of emphasis in the
text changes the arithmetic.** If a mandate is not being followed, price the write before
you rewrite the mandate. Emphasis is the cheapest fix to reach for and the least likely to
work.

Second-order finding, same root: git was also the wrong shape for CONCURRENT reads. Two
sessions of one agent could not see each other's live state without SHA resolution against a
branch that may be cache-frozen. Every concurrency rule in the base spec (`session-board.md`
presence lines, the Maggie serialization point) is a band-aid over a surface that was never
built for real-time reads by a twin.

---

## The four surfaces

Allocation is by **volatility × write cost**, never by importance. Importance is not a
placement signal and reasoning from it is the most common way this gate gets misapplied.

### 1 · SPINE — the chronology

**Where:** 🟢 Agent Activity Board CHANNEL, threaded under the session header post.
**Cost:** 1 call. **Holds:** WHAT happened, when, in what order.
**Reads across:** sessions. **Governed by:** `gates/session-transcript-gate.md` → THE SPINE.

One line per substantive reply. Unchanged by this spec. It works, it is cheap, leave it alone.

### 2 · AGENT INDEX TASK COMMENTS — the live WHY

**Where:** a comment on the agent's own row in the 🤖 Agent Index list (`901328043244`).
**Cost:** 1 call (`post_comment`). **Holds:** WHY. Decision-block notes.
**Reads across:** sessions AND lanes, for one agent. **Replaces:** the per-reply
`activity-log.md` append.

This is the surface the whole redesign turns on. **It carries reasoning, not inventory.**
What shipped is already in the canonical references and the spine; what is NOT captured
anywhere cheap is *why the agent chose this over the alternative, what it rejected, what it
assumed, what it is worried about.* That is the thing these agents are supposed to be good at
holding and the thing that evaporates first when a session ends.

**Format** (one comment per qualifying reply):

```
**[WHY · YYYY-MM-DD HH:MM ET]** <short beat title>

- **Did:** <one clause — the action, not the narrative>
- **Why:** <the reasoning. THIS IS THE POINT OF THE COMMENT.>
- **Rejected:** <the road not taken, and what would flip it back>
- **Watch:** <the assumption most likely to be wrong>

_Session: <session task URL>_
```

`Rejected` and `Watch` may be omitted when genuinely empty. `Why` may never be omitted — a
comment with no `Why` is a changelog entry in the wrong place, and the spine already has it.

**Never** put counts, statuses, or current state here. Comments are an append-only historical
record; state that changes belongs in surface 3, where it can be overwritten.

### 3 · AGENT INDEX TASK DESCRIPTION — the volatile whiteboard

**Where:** the description field of that same Agent Index row.
**Cost:** 0 extra reads (arrives with the task load), 1 call to write.
**Holds:** what is true RIGHT NOW. **Lifespan:** hours to days. Overwritten freely.

This is the agent's live commitment surface and its OMR staging area. It is deliberately
**volatile and deliberately capped** — it is a whiteboard, not a document, and the difference
is that a whiteboard gets erased.

**Fixed schema. No free-text area, by design** (a free-text area is exactly what let the old
roster file regrow +6.7KB in a day):

```markdown
**Live State** · stamped <YYYY-MM-DD HH:MM ET>

**Now:** <one line — what this agent is mid-way through>
**Owes:** <bullets, max 5 — commitments made this session, not yet folded>
**OMR:** <bullets, max 5 — memory candidates queued for Maggie>
**Blocked:** <bullets, max 3 — or omit the block entirely>

_Canonical memory: `super-agents/<slug>/` · culled by `hooks/agent-state-cull.md`_
```

**HARD CAP: 1,500 characters.** At cap the agent does not trim to make room — it fires
`hooks/agent-state-cull.md` and lets Maggie fold the oldest entries into git. **Trimming to fit
is the failure mode, not the fix**, and it is precisely the six-trims-in-four-days death spiral
that killed `roster.json`. A cap without a drain is just a slower leak.

### 4 · GIT BUNDLE — the canonical truth

**Where:** `brain-config/super-agents/<slug>/`.
**Cost:** ~4 calls. **Holds:** what does not expire. **Written:** in batches, by the cull loop.

Unchanged in content, changed in cadence. `memory.md` still holds patterns, scars, proven
defects, lane relationships, personality. `decision-log.md` still holds reasoning about the
agent's own shape. `activity-log.md` keeps its LIVE STATE block as the durable snapshot.

**What changed: git is no longer on the per-reply write path.** Its cost was never the real
problem — the problem was pricing a 4-call write into a per-reply loop. At session-close and
cull cadence, 4 calls is nothing.

---

## The placement test (run it in order, stop at the first yes)

1. **Is it a step, a routine, a how-to?** → It is a TOOL. Author it in `hooks/` or `gates/`
   and point at it. Never any of the four surfaces. *(Constitution §2–§3, unchanged and
   untouched by this spec.)*
2. **Is it just "what happened, when"?** → **Surface 1**, the spine. One line.
3. **Does it carry a count, a status, or a current position?** → **Surface 3**, the
   description. Stamped. *(§4a: can it go stale in a day.)*
4. **Is it reasoning — why, rejected, assumed?** → **Surface 2**, a task comment.
5. **Would it change how this agent acts a month from now?** → **Surface 4**, git. Queue it
   through the cull, do not hand-write it mid-session.
6. **None of the above?** → It is noise. Do not write it. *"When in doubt, log it" governs
   surfaces 1 and 2 only; it has never applied to durable memory and must not be imported here.*

---

## What a cold seating reads (the payoff)

```
1. Agent Index row  →  ONE load_assets
                       ├─ fields (Slug, Class, Lane, Home, Invoke, ...)
                       ├─ description  → live state, right now
                       └─ comments     → the full WHY trail, newest first
2. Git bundle       →  preferences.md + memory.md (canonical, cold-safe)
3. Session task     →  only if resuming a specific thread
```

Step 1 is a single call and it is the freshest data in the system. **A twin session of the
same agent in another lane sees the first agent's live state on its own seating read, with no
coordination step and no SHA resolution.** That is the requirement that started this whole
redesign, and it is satisfied by the surface choice rather than by a protocol.

---

## Surface seams (memorize these, they are the whole spec)

- Spine = **WHEN**. Index comments = **WHY**. Index description = **NOW**. Git = **ALWAYS**.
- Session task = one SESSION across many agents. Agent Index task = one AGENT across many
  sessions. **They are transposes of each other and neither substitutes for the other.**
- A number in a COMMENT is a defect (comments are immutable history; numbers move).
- Reasoning in the DESCRIPTION is a defect (it gets erased; reasoning must not).
- Anything in git that can go stale in a day is a defect (§4a, unchanged).

---

## ⚠️ The Size Sally collision — READ BEFORE RELYING ON SURFACE 3

The AI Toolkit index states, dated 2026-07-30:

> *"`Lane` is ONE line, hard rule, and no long-form description field may be added. Prose
> creeping into task descriptions beyond a one-line pointer means the problem was rebuilt
> inside ClickUp. Seat Size Sally if anyone proposes a new text field there."*

**Surface 3 is that proposal. It is not a loophole and this spec does not pretend otherwise.**

The argument for proceeding anyway, stated so it can be attacked:

- What killed `roster.json` was an **unbounded free-text area with no drain**. Six trims in
  four days, +6.7KB regrowth in one day, and it eventually shipped an agent built-but-
  unregistered because the file could no longer be read whole.
- Surface 3 differs on all three counts: **fixed schema** (no free-text area exists),
  **hard cap** (1,500 chars), **automated drain** (`hooks/agent-state-cull.md` folds to git and
  clears). The lock's own reasoning was *"a document has an unbounded free-text area and no
  schema to refuse an essay."* This has a schema and it refuses.
- It is also **per-row**, not one shared file. A 39-record table simulated in one document was
  the shape that failed; 39 independent 1.5KB whiteboards do not have that failure mode.

**What would prove this wrong, and the honest tell to watch for:** if any agent's description
exceeds the cap twice between culls, the cull cadence is too slow OR the schema is leaking, and
the correct response is to kill surface 3 and move live state back to the session task — **not**
to raise the cap. Raising the cap is how the last one died.

**Michael ratifies this or it does not ship.** He locked the rule this violates; only he
unlocks it. Until then surfaces 1, 2 and 4 stand on their own and are worth shipping
independently of the ruling on 3.

---

## Composes with

- `gates/session-transcript-gate.md` — owns surface 1 entirely.
- `hooks/agent-state-cull.md` — owns the surface 3 → surface 4 drain.
- `super-agents/_shared/super-agent-base.md` — the per-response mandate that points here.
- `agents/memory-maggie/open-memory-request-protocol.md` — the OMR block feeds it.
- `hooks/memory-rotation.md` — still governs git-side budgets. ⚠️ Its whole-file budget text
  already needed updating for the LIVE STATE block and still does. Flagged, not silently
  reinterpreted.
