# shared-surface-session

> Standard hook for the **shared-surface multi-session** pattern:
> one task holds the work, multiple agent sessions operate on it in sequence or parallel.

---

## Mode

SIGNAL — fires on invocation.

## Signals

`/shared-surface` · `/workshop-surface` · "shared working surface" · "multi-session workshop" · "multiple sessions on one task" · "point the sessions at this task"

## Shape

```
1 TASK  ←  the working surface (lives on 🟢 Agent Activity Board)
N SESSIONS  →  separate Brain conversations, each seating one agent
```

- The task description holds the **manifest**: scope, deliverables, ordering, and current state.
- Each session posts its output as **root-level comments** on the shared task, stamped with the agent's banner.
- Session chat is the **feedback loop** (Michael ↔ agent). The task is the **record**.

## Opening a shared surface

1. **Create one task** on the Agent Activity Board. Title: `{Project} — Workshop`.
   - Description = the manifest: what the project is, what each session is responsible for, and the session dependency order (which must run before which).
   - Status: `in progress`.

2. **For each session**, open a new Brain conversation and seat the agent:
   - First message includes the task URL as the working surface pointer.
   - State: "This is a shared-surface session. Your working surface is [task URL]. Post all deliverables as comments on that task. Use your standard banner stamp. Read existing comments before starting: other sessions may have posted ahead of you."

3. **Dependency order** is declared in the manifest, not enforced by tooling.
   - Sequential: Session 1 posts → Michael reviews → opens Session 2 with "Session 1 output is on the task, proceed."
   - Parallel: manifest marks sessions as independent; both post; a later session reconciles.

## Comment conventions on the shared task

Each agent posts at root level (not threaded under another agent's comment) with its standard banner:

```
🔍 ═══ ANNA · AUDIT ═══

[deliverable content]
```

Threaded replies under an agent's root comment = that agent's own revisions or Michael's inline feedback.

Cross-agent responses go as NEW root comments referencing the prior one:

```
🎭 ═══ MILO · REVIEW ═══

Re: Anna's manifest (comment posted 10-12 19:xx)
[review content]
```

## Closing

- Each session closes normally per session-close.
- The shared task stays open until the full project is done.
- Final comment on the task = the project close-out stamp (who ran, what shipped, what's still open).
- Task status → `complete` only when all sessions have closed AND Michael confirms.

## Ordering pattern (canonical example)

```
Session 1: Audit Anna     →  inventory + manifest
             ↓ (Michael reviews manifest on the task)
Session 2: Mainstage Milo →  domain review + rulings
             ↓ (Michael approves rulings on the task)
Session 3: Doc Dave        →  execution + stamps
             ↓
Task close-out
```

Michael is the gate between sessions. No agent opens the next phase: Michael does, by opening a new conversation and saying "go."

## Anti-patterns

- 🚫 Do NOT create subtasks for each session. The task is flat.
- 🚫 Do NOT duplicate the manifest into session chat. Point at the task.
- 🚫 Do NOT let an agent modify the task description. Michael owns the manifest. Agents propose edits as comments; Michael applies.
- 🚫 Do NOT thread deliverables under another agent's comment. Root level, always.

## Steward

Maestro Mira (pattern ownership). Any agent may fire it.

## Known gaps

- No tooling enforces session ordering. Michael is the sequencer.
- Comment volume on a single task can get long. If a project exceeds ~20 agent root comments, consider splitting into phases with one task per phase.
- Session-close currently writes to the session task, which in this pattern does not exist as a separate task. Session-close should post to the shared surface instead. **This is a session-close hook amendment, not yet written.**
