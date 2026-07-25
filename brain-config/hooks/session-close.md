---
slug: session-close
display_name: Session Close
type: hook
status: active
trigger: end of every Brain session (no exceptions)
owner_agents: [closing-clio, memory-maggie]
---

# Session Close Hook

**Fires:** at the end of every Brain session, no exceptions.
**Canonical source:** this file. ClickUp page is archival only.
**Decision history:** `brain-config/hooks/session-close.decision-log.md`

---

## The seating sequence (who does what)

Session close is a **handoff**, not a monolith. The session agent does NOT run the close
itself. It produces a structured artifact and yields the wheel.

| Stage | Owner | Input | Output |
|---|---|---|---|
| 1. Produce handoff | Session agent | Full session context | Handoff Artifact (template below) |
| 2. Execute close | Closing Clio (SEATED, takes the wheel) | Handoff Artifact | Channel posts, task shutdown, next-session task |
| 3. Memory curation | Memory Maggie (called BY Clio) | Handoff Artifact memory candidates | Memory audit post, rotation/placement calls |

**Why this sequence exists:** the session agent is good at KNOWING what happened (it was
there). It is bad at running templates, posting to channels, and curating memory (those
are specialized disciplines it implements inconsistently). Clio is shaped for structured
close execution. Maggie is shaped for memory placement. Each does the step they're
built for.

**The loop resolution:** this file is the CONTRACT between the session agent and Clio.
It specifies the boundary. Clio fulfills the contract; she does not recursively invoke
the doc that defines her job. The session agent reads the Handoff Artifact Template
(below) and fills it. Clio reads the Execution Sequence (below) and runs it. Neither
calls the other's section.

---

## Runtime stance

**No-ask execution.** When close is triggered, the session agent produces the Handoff
Artifact and Clio runs the full procedure without permission prompts. Only surface
actual failures.

---

## The Handoff Artifact Template

> **Who produces this:** the session agent, as its LAST responsibility.
> **Who consumes this:** Closing Clio.
> **What it is:** a defined, structured shape, not freeform prose.

The session agent fills this EXACTLY. Every section. "None" is a valid fill; a missing
section is not.

```markdown
## CLOSE HANDOFF - {date} {time} ET

**Session agent:** {name, or "house Brain" if no persona}
**Model:** {model name + version}
**Session task:** {markdown link to the Agent Activity Board task}
**Duration:** {start time} - {end time} ET

---

### 1. Objective (what this session did)

{1-3 sentences. What the session accomplished, stated as work done.}

### 2. Session Ledger (copy from task, finalized)

#### Built / changed
- {item, one-line what + why, link}

#### Drove the work
- {agent/tool, what it did here}

#### Repos touched
- {path, commit/PR, link}

#### CU docs touched
- {doc/page, edited, link}

### 3. Decisions made

- {decision stated as a rule, pointer to DL entry if one exists}
...
(or: none this session)

### 4. Memory candidates

{Durable knowledge worth persisting beyond this session. NOT procedure
(that becomes a tool). Context, preferences, scars, relationships,
corrections only.}

- {candidate, one line, with WHY it is durable}
...
(or: none. Everything transient or already captured.)

### 5. Scoreboard activity

- Points scored this session: {list, or "none"}
- Points observed/bumped: {list, or "none"}
- Standing at close: Brain {N}, Michael {M}

### 6. Open threads

- {unfinished work, queued items, things needing a next session}
...
(or: none. Session fully resolved.)

### 7. Next-session prompt

{If open threads exist: the warm-start paragraph for the handoff task.
Written as if addressing a cold agent with zero prior context.
If no next session needed: "No follow-up required."}
```

### Rules for producing the Handoff Artifact

- Fill EVERY section. "None" is valid; a missing section is not.
- The Session Ledger is COPIED from the task (already maintained live), not reconstructed.
- Memory candidates are PROPOSALS, not commits. Maggie decides placement.
- The next-session prompt is self-contained: a cold agent resumes from it alone.
- This is the session agent's LAST act. After producing it, the agent is done.

---

## Clio's Execution Sequence

Clio receives the Handoff Artifact and executes in this order. She does NOT ask for
permission at any step (Rule 0).

### Step 1. Hand memory candidates to Maggie: Channel 1 (Memory Audit)

Clio hands section 4 (Memory Candidates) to Maggie. Maggie:
- Runs placement triage (deny-by-default for brain memory)
- Executes approved memory writes
- Runs the memory rotation check (hot memory over budget? curate/archive)
- Posts Channel 1

**Channel 1 URL:** https://app.clickup.com/36074068/chat/r/12cwjm-55833

**Root message format (one line only):**
```
~{tokens} / 2000 ({percent}%)
```

**Thread reply format:**
```
## Memory Audit - {date} {session topic}

**Estimated tokens:** ~{N} / 2000 ({X}%)
**Density:** {LOW | MODERATE | HIGH}

### Changes this session:

- **Added:** {what was added, if anything}
- **Removed:** {what was removed, if anything}
- **Modified:** {what was changed, if anything}
- None. {if nothing changed}

### Current structure:

1. {section name}
2. {section name}
...

### Recommendation:

{Pruning candidates, compression notes, rotation actions taken, or "No action needed."}
```

### Step 2. Channel 2: A.I. Prompts (Session Log)

**Channel 2 URL:** https://app.clickup.com/36074068/chat/r/6-901327646617-8

**Root message format (three lines only):**
```
## {Session Topic}

trigger: {what started the session} | {date range} ET
status: {complete | partial | handed off}
```

**Thread reply format:**
```
## Session Summary

**Session task (full transcript):** {link to session task}
**Duration:** {time range}
**Model:** {model name}
**Closing capacity:** ~{N}K / {window}K ({X}%), feel: {sharp / full / degraded}
**Scoreboard (revised at close):** Brain {N}, Michael {M}, {delta}

### Headlines

- {2-5 bullets: what shipped / was decided}

### Key decisions

- {decision, stated as a rule}

### Changes executed

{Tasks, docs, commits, fields, specific with links}

### Refs

- {link}: {what it is}

### Open loops

- {thing left undone or queued}
```

Transcript stays on the task, not in this thread.

### Step 3. Session-task shutdown

1. Finalize Session Ledger on the task (should be current from the Handoff Artifact)
2. Post final `[CLOSE-POINTER]` comment with both thread links and scoreboard delta
3. Flip task to `done`
4. Hand Michael the task link in chat

### Step 4. Durable handoffs

- **Bounced memory writes:** append to `brain-config/open-memory-requests.md`
- **Open-thread note:** append to `brain-config/open-thread.md`

### Step 5. Next-session handoff task

From section 7 (Next-session prompt) of the Handoff Artifact:
- Scrub the board with Task Dedup Gate (widened to closed + done)
- Clear match: reopen and re-status to `to do`
- Ambiguous: ask before mutating
- No match: create new handoff task with the prompt as description
- Chain it (task relationship + pointer comment back to the closing task)

### Step 6. Usage-log commit

Flush the seating tally to `brain-config/usage-log.json`. This lands LAST.

---

## Modes

**Full close** is default. **Soft close** only when Michael explicitly says so.

### Soft Close

Runs: usage-log commit, Session Ledger finalize, git-side closing writes.
Skips: Channel 2, and Channel 1 only if memory was untouched.
If the session became substantive, upgrade to full close.

---

## Rules (hard, no-discretion)

0. No-ask execution. Run required steps without permission prompts.
1. NEVER use `create_as_post: true`.
2. NEVER put detail in the root message.
3. ALWAYS thread the detail.
4. Both channels, every session, except explicit soft close.
5. Transcript lives on the Agent Activity Board task.
6. The task is closed out AND the channels still fire.
7. Bounced memory writes go to `brain-config/open-memory-requests.md`.
8. Closing capacity is mandatory in the session-log summary.
9. Memory audit posts first, then session log.
10. Root messages are never edited after posting.
11. Thread replies can have addenda.
12. Usage-log commit lands last.
13. Append the open-thread note to `brain-config/open-thread.md`.
14. Warm-start handoff is a task, not a chat block.
15. Every close reports the scoreboard delta.
16. Finalize the Session Ledger before the usage-log commit.
17. Scrub before cutting the handoff task.
18. The session agent produces the Handoff Artifact as its LAST act. Clio executes after.
19. Memory candidates are PROPOSALS. Maggie decides placement.
20. Clio is SEATED (a real persona swap), she takes the wheel, not a sub-call.

---

## Pointers

- Agent Activity Board Gold Standard: task templates + mechanics
- Session Transcript Gate: thread structure
- `session-close.decision-log.md`: why this hook is shaped this way
- `orchestration.md` (Seating Sequences section): the pattern this instantiates
- Memory Maggie (`super-agents/memory-maggie/`): memory curation + rotation
- `hooks/memory-rotation.md`: the rotation algorithm Maggie stewards (TBD)
