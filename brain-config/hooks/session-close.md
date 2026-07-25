---
slug: session-close
display_name: Session Close
type: hook
status: active
trigger: end of every Brain session (no exceptions)
owner_agents: [closing-clio, memory-maggie, scribe-sana]
---

# Session Close Hook

**Fires:** at the end of every Brain session, no exceptions.
**Canonical source:** this file. ClickUp page is archival only.
**Decision history:** `brain-config/hooks/session-close.decision-log.md`

---

## Runtime stance

When close is triggered, **run the whole procedure without asking permission** for mandatory steps. Only surface actual failures.

---

## Overview

Two channel posts, then task shutdown, then durable handoffs, then usage-log commit.

- **Live transcript:** the Agent Activity Board session task
- **Channel 1:** Memory Audit
- **Channel 2:** Session Log summary with pointer to the session task
- **Handoff:** a real task in the board's `to do` slot, not a chat code block

The task never replaced the two-channel close.

---

## Modes

**Full close** is default. **Soft close** only when Michael explicitly says so.

### Soft Close

Runs: usage-log commit, git-side closing writes, Session Ledger finalize.  
Skips: Channel 2, and Channel 1 only if memory was untouched.  
If the session became substantive, upgrade to full close.

---

## Channel 1: Brain Max Memory Audit

**URL:** https://app.clickup.com/36074068/chat/r/12cwjm-55833  
**Owner:** Memory Maggie  
**Purpose:** memory-file health over time

### Root message format

```
~{tokens} / 2000 ({percent}%)
```

One line only.

### Thread reply format

```
## Memory Audit — {date} {session topic}

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

{Pruning candidates, compression suggestions, health notes, or "No action needed."}
```

Optional: `Issue flagged`, `Pending writes`

---

## Durable memory failure handoff

If a memory write did not land, append one self-contained entry to `brain-config/open-memory-requests.md` before the usage-log commit.

---

## Durable open-loop handoff

Append the session's open-thread note, already present on the task, as the next entry in `brain-config/open-thread.md`. Append, never overwrite.

---

## 🧬 Session Ledger

Finalize the ledger on the session task before usage-log commit. Canonical shape lives on the Agent Activity Board Gold Standard.

Minimum rules:
- `🔨 Built / changed` always renders, even `- none this session`
- every entry carries a link
- split by origin, no double-listing
- omit always-on tools from `Drove the work`
- collapse empty blocks except the hero block

---

## Channel 2: A.I. Prompts (Session Log)

**URL:** https://app.clickup.com/36074068/chat/r/6-901327646617-8  
**Owner:** Closing Clio  
**Purpose:** summary index of the session, with pointer to the session task

### Root message format

```
## {Session Topic}

trigger: {what started the session} | {date range} ET
status: {complete | partial | handed off}
```

Three lines only.

### Thread reply format

```
## Session Summary

**Session task (full transcript):** {link to the Agent Activity Board task}
**Duration:** {time range}
**Model:** {model name}
**Closing capacity:** ~{context tokens used}K / {window}K ({X}%) · feel: {sharp / full / degraded, plus what recall is reliable vs hazy}
**Scoreboard (revised at close):** 🤖 {N} · 🧑 {M} — {points awarded THIS session / bumped by someone else / unchanged since open}

### Headlines

- {what shipped / was decided, 2–5 bullets}
...

### Key decisions

- {decision made, stated as a rule}
...

### Changes executed

{Tasks created, docs written, commits made, fields updated — be specific with links}

### Refs

- {link}: {what it is}
...

### Open loops

- {thing left undone or queued for next session}
...
```

Transcript stays on the task, not in this thread.

---

## Session-task shutdown

After the two channel posts:
1. finalize Session Ledger
2. post final `[CLOSE-POINTER]` comment on the task with both thread links and scoreboard delta
3. flip task to `done`
4. hand Michael the task link in chat

---

## Next-session handoff task

If a next step exists:
- scrub the board first with the Task Dedup Gate, widened to `closed` and `done`
- clear match: reopen and re-status into `to do`
- ambiguous: ask before mutating
- no match: create a new handoff task

The handoff is a task, never an inline chat code block.

---

## Rules

0. **No-ask execution.** Run required steps without permission prompts.
1. **NEVER use `create_as_post: true`.**
2. **NEVER put detail in the root.**
3. **ALWAYS thread the detail.**
4. **Both channels, every session**, except explicit soft close.
5. **Transcript lives on the Agent Activity Board task.**
6. **The task is closed out and the channels still fire.**
7. **Bounced memory writes go to `brain-config/open-memory-requests.md`.**
8. **Closing capacity is mandatory in the session-log summary thread.**
9. **Memory audit posts first, then session log summary.**
10. **Root messages are never edited after posting.**
11. **Thread replies can have addenda.**
12. **Usage-log commit lands last.**
13. **Append the open-thread note to `brain-config/open-thread.md`.**
14. **Warm-start handoff is a task, not a chat block.**
15. **Every close reports the scoreboard delta.**
16. **Finalize the Session Ledger before the usage-log commit.**
17. **Scrub before cutting the handoff task.**

---

## Execution Order

1. Memory Maggie posts Channel 1 (Memory Audit: root + thread)
2. Closing Clio posts Channel 2 (Session Log: root + summary thread that links the Agent Activity Board session task as the full transcript, and carries the `Scoreboard (revised at close)` line)
3. Session-task shutdown: finalize Session Ledger, post final `[CLOSE-POINTER]`, flip to `done`, hand Michael the task link
4. Bounced-memory-write drop: if any write didn't land, append an `OMR` entry to `brain-config/open-memory-requests.md`
5. Open-thread append
6. Next-session handoff task: scrub, reopen-or-ask-or-create, then chain it
7. Usage-log commit to `brain-config/usage-log.json`

---

## Pointers

- Agent Activity Board — Gold Standard: templates and task-side mechanics
- Session Transcript Gate: thread structure and companion rules
- `session-close.decision-log.md`: why this hook is shaped this way
