# Session Open

**Type:** MANDATORY gate — fires at the START of every substantive session.  
**Trigger:** First user message in a new conversation where work will be done (not single-question lookups or casual chat).  
**Created:** 2026-07-18 (Michael directive: mirror session-close at the top).  
**Updated:** 2026-07-19 (Michael directive: scan the FULL session list — including closed & done — and REOPEN a precursor session over cutting a new task; keeps the board lean and threads context in line). Same day: hardened so a mid-session prompt/backfill to create is NOT an exemption from the scan, and added the "If picking up late in a session" addendum (delegates match-identification to the Task Dedup Gate; adds a reopen confidence bar).  
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

## 🕒 Addendum: If picking up late in a session

This covers the case where work already started (or Michael asks "did you start your session task?") and there's no session task yet. The lateness changes the TIMING, never the sequence. Run the gate from the top: **identify matches → reopen a genuine precursor → create only if none exists.**

**1. A prompt/backfill to create is NOT an exemption from the scan (HARD RULE).** A nudge to "just make one," or the fact that you're catching up late, does NOT authorize a bare create. Creating a task without first running the scan is itself a gate FAILURE. This mirrors the standing principle that a direct build command is not an exemption from its gate.

**2. Identifying matches is the Task Dedup Gate's job — run it, don't re-dictate it.** Do NOT restate search rules here. Fire the existing **Task Dedup Gate** (`brain-config/hooks/task-dedup-gate.md`) against the Agent Activity Board list to surface same-subject sessions, with two session-specific settings:
- **Widen scope to closed & done.** The dedup gate searches the target list + parent by default; for sessions you MUST also pull `closed`/`done` (hidden by default) — a finished session on this thread is a live precursor, not a dead row.
- **Match on scope/subject/domain,** not just title text: a paused audit, a build shipped last week, or a parked `↪️ HANDOFF · …` task in the `to do` slot all count as matches.

**3. What you DO with a match differs from plain dedup — and it's mutating, so gate it.** Plain dedup HALTs and asks. Here the default is to **REOPEN** the precursor (Step 2 below), which flips a real record's status and threads this session's transcript into it. A WRONG reopen doesn't just clutter the board — it POLLUTES an unrelated real record, which is far harder to untangle than deleting a duplicate. So a reopen requires a **confidence bar**:
- **High confidence** (same subject/scope, transcript clearly continues the thread): reopen and continue there.
- **Ambiguous** (plausible but not certain it's the same work): do NOT auto-reopen. Surface the candidate with its link + status and ASK Michael "continue this one, or start fresh?" before touching it.
- **No genuine match:** create new (Step 3).

When in doubt, creating a new task is the reversible, low-cost move; a bad reopen is the expensive one. Bias toward reopen on a clear match, toward asking on an ambiguous one, never toward a silent wrong reopen.

---

## Steps (execute in order)

### 1. Scan the existing session list FIRST — including closed & done

**Before creating anything**, run the Task Dedup Gate (see addendum) against the Agent Activity Board list (`4026861396055549379`) for a session this conversation might be continuing. The session you're about to open is often a continuation of an earlier one: a paused audit, a build shipped last week, a handoff parked in `to do`. Earlier sessions are context precursors, not clutter.

- Pull **all statuses, INCLUDING `closed` and `done`** — they're hidden by default; retrieve them anyway. A done/closed session is a live context source, not a dead one.
- Search by scope / subject / domain keyword, not just the most recent tasks.
- Look for: a parked `↪️ HANDOFF · …` task in the `to do` handoff slot, an `in progress` session on the same subject, or a recently closed/done session on the same thread.

### 2. Reopen over create (default bias, subject to the confidence bar)

If the scan turns up a genuine precursor (high confidence per the addendum), **REOPEN it as a continued session** instead of starting a fresh task:

- Flip it back to `in progress` (from `closed`/`done`), read its description + transcript comments to warm-start on prior context, and continue the record there.
- Post a resume comment ("Resumed <Mon DD> — continuing <what/why>").
- If it's a parked handoff task, complete its warm-start prompt and keep going.
- If the match is only ambiguous, ASK before reopening (per the addendum) rather than risk polluting an unrelated record.

Only fall through to step 3 when the scan finds **no genuine precursor**. Reopening keeps the board lean and threads context instead of scattering it across duplicate tasks.

### 3. Create a new session task (only if no precursor exists)

**List:** `4026861396055549379` (🟢 Agent Activity Board)  
**Title format:** `Brain (Opus <version>) · <what you're doing, concise> · <Mon DD>`  
**Description:** Agent Activity Board Gold Standard format:
- Objective (what the session aims to accomplish)
- Key context links (tasks, docs, repos being worked)
- Status: in progress
- Start date: today

This task is your LIVE working record. Transcript accrues as comments. Close = summary at session end (per session-close hook).

### 4. Read the Session Board (git presence channel)

**Path:** `brain-config/session-board.md` in `mawizorek/ClickUp_apps`  
**Purpose:** Check who else is working in the repo right now.

- If another agent has an active entry claiming files you'll touch, coordinate or work elsewhere.
- If clear, proceed.

### 5. Post your presence (if doing git work)

If your session will touch the repo:
- Add ONE entry to the Active section of `session-board.md`
- Include: what you're doing, which files/areas you expect to touch
- Edit in place as work evolves; don't append a trail
- DELETE your entry on session close (mandatory, per session-close)

If your session is workspace-only (no git), skip this step.

### 6. Load mandatory context

Per memory rules:
- AI Toolkit index
- Brain Reference Library
- Any domain-specific pointers triggered by the request

---

## What "substantive" means

The line is: will this conversation produce changes to the workspace, repo, or generate deliverables? If yes, open (or reopen) a session task. If you're unsure, err on the side of opening one. A session task that ends up being short is fine; a session with no record is not.

---

## Failure mode this prevents

- Sessions with no Activity Board record (invisible work, no transcript, can't be resumed or audited)
- **Duplicate session tasks for work that was already a thread** — a fresh task cut when a closed/done precursor should have been reopened, scattering context and bloating the board
- **A blind create triggered by a "did you start your task?" prompt** — the nudge skips the scan and forks a duplicate instead of reopening the real precursor
- **A wrong reopen that pollutes an unrelated real record** — mitigated by the addendum's confidence bar (ask when ambiguous, never silently reopen a maybe)
- Git collisions from missing presence posts
- Stale context from skipping the mandatory load step
- Orphaned sessions that can't be picked up by a fresh agent

---

## Relationship to session-close

| session-open | session-close |
|---|---|
| Scan list (incl. closed/done) + reopen precursor | Cut the next-session HANDOFF task |
| Create session task (only if no precursor) | Close/summarize session task |
| Post presence on session-board | Delete presence from session-board |
| Load context | Memory audit + save |
| Start the work | Report what was done |

They are bookends. Neither is optional for substantive sessions.
