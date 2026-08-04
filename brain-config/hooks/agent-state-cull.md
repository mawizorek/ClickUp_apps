# Agent State Cull

**Purpose:** drains the volatile Agent Index task description into canonical git memory, on a
bounded cadence, so the whiteboard never becomes a document.
**Mode:** triggered, not always-on.
**Owner:** Memory Maggie. She rules on placement; any agent may FIRE the hook, none may decide
where an entry lands.
**Companion:** `gates/agent-surface-allocation.md` (defines the surfaces this drains between).
**Status:** ⚠️ **PROPOSED — ships or dies with surface 3.** See the collision note in the gate.

---

## The one-sentence justification

**A cap with no drain is a slower leak.** Surface 3 is only defensible because this hook
exists, and if this hook is not running, surface 3 should be switched off rather than left to
grow. That is the entire relationship between the two files.

---

## Triggers (any one fires it)

1. **Cap pressure** — an agent's Index description reaches ~1,200 chars (80% of the 1,500 cap).
   Fires automatically. **The agent does NOT trim to make room.** Trimming-to-fit is the
   documented death spiral and it is banned here by name.
2. **Session close** — `hooks/session-close.md` fires the cull for every agent that wrote to a
   description during the session.
3. **Staleness** — the `stamped` timestamp is older than 7 days. A stale whiteboard is worse
   than an empty one: empty reads as "nothing in flight," stale reads as "this is current."
4. **Manual** — `/cull-agent-state`, `/cull <slug>`, "fold the whiteboards," "drain the OMR."
5. **Pre-graduation** — before a lens graduates to a teammate, or a bundle is migrated.

---

## The routine (five steps, in order)

### C1 · Read both ends

Load the agent's Index row (description + recent comments) **and** its git bundle
(`memory.md`, `activity-log.md`, `decision-log.md`). ⚠️ **Re-fetch git SHAs now.** Cached SHAs
have burned this workspace repeatedly; a cull writing against a stale blob silently reverts
somebody else's session.

### C2 · Classify every line

Run `gates/agent-surface-allocation.md` → the placement test on each line. Deny-by-default:
unclassifiable goes to `activity-log.md`, never to `memory.md`.

| Line looks like | Lands in |
|---|---|
| Pattern, scar, proven defect, preference, lane relationship | `memory.md` |
| Project state, count, status, park, what-is-owed | `activity-log.md` → LIVE STATE block |
| Reasoning about the AGENT'S OWN shape | `decision-log.md` |
| Reasoning about a TOPIC | that topic's Decision Log (§4) |
| Procedure or how-to | 🚫 **HALT.** It is a tool. Author it; do not fold it. |
| Brain-memory candidate | `open-memory-requests.md` — never `/PREFERENCES.md` directly |
| Already captured, or expired unremarkably | discard, and say so in the receipt |

### C3 · Mine the comments before you write

**Do not fold the description in isolation.** Read the WHY comments from the same window
first. The description says an agent is blocked; the comments say why, what it already tried,
and what would unblock it. **Only the second one is worth keeping**, and folding state without
its reasoning produces exactly the contextless memory this redesign exists to fix.

The test for promoting a WHY comment into `memory.md`: **has this reasoning now appeared
three times across separate sessions?** Three occurrences is a pattern. One is an anecdote and
stays in the comment trail, which is append-only and loses nothing.

### C4 · Write, then clear (never the reverse)

One git commit per agent, all files together. **Verify the commit landed before touching the
description.** Clearing first and failing the write loses the state outright, and there is no
second copy.

Then rewrite the description to the clean schema — carrying forward only what is genuinely
still live, and re-stamping. **`Now:` survives a cull; `Owes:`, `OMR:` and `Blocked:` are
emptied of everything folded.**

### C5 · Receipt

Post one comment to the agent's Index task:

```
**[CULL · YYYY-MM-DD HH:MM ET]** by Maggie

- **Folded:** <n> lines → memory.md <n>, activity-log.md <n>, decision-log.md <n>
- **Queued to OMR:** <n>
- **Discarded:** <n> (<one clause on why>)
- **Refused:** <any procedure caught by the C2 halt, and where it should be authored>
- **Commit:** <PR or commit URL>

Description reset · <n> chars remain
```

The receipt is the falsifiable artifact. **No receipt means the cull did not run** — same
logic as the spine line and the orientation stamp, and for the same reason: an unverifiable
maintenance routine is indistinguishable from one that quietly stopped.

---

## Escalation: push it up the tree

When a folded line is not really about the one agent, do not bury it in that agent's bundle:

- Applies to **every** agent → `_shared/super-agent-base.md` *(⚠️ at its 22KB ceiling — it
  goes in a tool with a pointer, or it does not go)*
- A fleet fact about **someone else** → `super-agents/fleet-known-drift-register.md` (Felix)
- A repeated cross-agent behavior → a hook or gate, authored properly
- A Michael-wide preference → the OMR queue, and only the OMR queue

**A pattern found in three different agents' whiteboards is a house-level fact wearing three
costumes.** Fold it once, upward, and leave pointers.

---

## Guardrails

- 🚫 Never write `/PREFERENCES.md` from a cull. OMR queue only, always.
- 🚫 Never fold procedure. C2 halts it and names where it should be authored instead.
- 🚫 Never let a number reach `memory.md` (§4a — defect on sight, move it, do not refresh it).
- 🚫 Never clear a description before the commit is verified.
- 🚫 Never raise the cap to avoid a cull. **The cap is the forcing function; raising it removes
  the only pressure that makes this hook fire.** If the cap is genuinely too small for a real
  agent's live state, that is evidence surface 3 is the wrong shape — escalate to Michael,
  don't quietly widen it.
- ⚠️ Concurrency: a twin session on the same agent means the description may change mid-cull.
  Re-read immediately before C4 and fold only what you actually read.

---

## Composes with

- `gates/agent-surface-allocation.md` · `hooks/session-close.md` ·
  `hooks/memory-rotation.md` · `hooks/memory-edit-guard.md` ·
  `agents/memory-maggie/open-memory-request-protocol.md` · `hooks/fleet-fact-sweep.md`
