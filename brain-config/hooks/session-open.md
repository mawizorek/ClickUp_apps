# Session Open

**Type:** MANDATORY gate — fires at the START of every substantive session.  
**Trigger:** First user message in a new conversation where work will be done (not single-question lookups or casual chat).  
**Created:** 2026-07-18 (Michael directive: mirror session-close at the top).  
**Companion:** `session-close.md` (the bookend at session end).

---

## When to fire

Fire this gate when ANY of these are true:
- The user asks you to do work (create, update, build, audit, research, plan)
- The conversation will involve multiple tool calls or task manipulation
- An agent config is loaded (Mira, Anna, etc.)
- The session is a pickup/handoff resume

Do NOT fire for:
- Single-question lookups ("what's the status of X?")
- Casual conversation with no workspace action
- Quick one-off answers that don't touch tasks/docs/repo

---

## Steps (execute in order)

### 1. Create session task on the Agent Activity Board

**List:** `4026861396055493779` (🟢 Agent Activity Board)  
**Title format:** `Brain (Opus <version>) · <what you're doing, concise> · <Mon DD>`  
**Description:** Agent Activity Board Gold Standard format:
- Objective (what the session aims to accomplish)
- Key context links (tasks, docs, repos being worked)
- Status: in progress
- Start date: today

This task is your LIVE working record. Transcript accrues as comments. Close = summary at session end (per session-close hook).

### 2. Read the Session Board (git presence channel)

**Path:** `brain-config/session-board.md` in `mawizorek/ClickUp_apps`  
**Purpose:** Check who else is working in the repo right now.

- If another agent has an active entry claiming files you'll touch, coordinate or work elsewhere.
- If clear, proceed.

### 3. Post your presence (if doing git work)

If your session will touch the repo:
- Add ONE entry to the Active section of `session-board.md`
- Include: what you're doing, which files/areas you expect to touch
- Edit in place as work evolves; don't append a trail
- DELETE your entry on session close (mandatory, per session-close)

If your session is workspace-only (no git), skip this step.

### 4. Load mandatory context

Per memory rules:
- AI Toolkit index
- Brain Reference Library
- Any domain-specific pointers triggered by the request

---

## What "substantive" means

The line is: will this conversation produce changes to the workspace, repo, or generate deliverables? If yes, open a session task. If you're unsure, err on the side of opening one. A session task that ends up being short is fine; a session with no record is not.

---

## Failure mode this prevents

- Sessions with no Activity Board record (invisible work, no transcript, can't be resumed or audited)
- Git collisions from missing presence posts
- Stale context from skipping the mandatory load step
- Orphaned sessions that can't be picked up by a fresh agent

---

## Relationship to session-close

| session-open | session-close |
|---|---|
| Create session task | Close/summarize session task |
| Post presence on session-board | Delete presence from session-board |
| Load context | Memory audit + save |
| Start the work | Report what was done |

They are bookends. Neither is optional for substantive sessions.
