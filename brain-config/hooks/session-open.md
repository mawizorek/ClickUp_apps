# Session Open

**Type:** MANDATORY gate for substantive sessions, run in TWO phases (Prime, then Commit).
**Trigger:** First user message in a new conversation where work will be done (not single-question lookups or casual chat).
**Created:** 2026-07-18 (Michael directive: mirror session-close at the top).
**Updated:** 2026-07-20 (Michael directive: **invocation ≠ session**. Split into Prime + Commit. A bare persona invocation or blank session must NOT cut a board task or scan the board — there is no subject to match against yet. The heavy work is DEFERRED and fires in parallel on the first side-effecting action. Rehomed after `/session start = felix` misfired the full open on zero context.) Prior 2026-07-19 note (scan the FULL list incl. closed & done and REOPEN a precursor over cutting a new task; late-pickup addendum) is preserved — it now lives inside the Commit phase.
**Companion:** `session-close.md` (the bookend at session end).

---

## The two phases (canonical vocabulary — use these names everywhere)

There were never one procedure. There were always two, wearing one name:

- **PRIME** — eager, read-only, instant. Runs the moment a session starts (invocation, or first message of a blank session). Becomes the persona (if named), loads mandatory context, opens the scratch cache, and says "ready." **Zero workspace writes.** A bare invocation that never becomes work leaves NOTHING behind.
- **COMMIT** — deferred, fires ONCE. The session becomes real: precursor scan → reopen-or-create the board task → backfill the scratch cache as the opening transcript → post presence (if a repo op). **Trigger: the first side-effecting action of the session** (create/update a task, post a comment, a repo write, a task move). Read-only stays in Prime; the first write commits the session.

Why the first-write trigger: it auto-solves the floor. A pure lookup never writes → never commits → leaves no litter. The instant real work happens, Commit fires underneath it — in parallel, invisibly. This is the "it just happens" behavior: prime fast, commit silently on first write.

---

## PHASE 1 — PRIME (eager, read-only, every session)

Run the moment the session opens. Fast. Satisfies the FIRST TOKEN RULE: minimal or zero visible tool calls before "ready."

1. **Become the persona (if one was invoked).** For `/session.agent=<Name>` or `/session-start=<Name>`, run the persona load contract (`super-agents/_shared/super-agent-base.md`): load base spec + profile + steep the agent's history files. If no persona, run house-voice Brain. Announce.
2. **Load mandatory context.** AI Toolkit index + Brain Reference Library + any domain pointers triggered by the request. This stays EAGER — a primed persona without context loaded is hollow. "Lazy" applies to the board task, NEVER to the context load.
3. **Open the scratch cache.** An in-context running buffer of session beats: the priming read, any pre-subject chatter, and a one-line provisional-subject guess kept updated every turn. Costs nothing; means Commit is never a cold start.
4. **Say ready.** "Ready to go — where do you want to begin?" Then stop. Do not scan the board. Do not cut a task. There is no subject yet.

Prime does not write to the workspace, the repo, or the board. If the session ends here (no work), there is correctly no record and no litter.

---

## PHASE 2 — COMMIT (deferred, fires once, on the first side-effecting action)

**Trigger:** the first time this session is about to fire a side-effecting tool — create_task, update_task, post_comment, move_task_to_list, any repo write, etc. Commit runs as a PRE-STEP before that write, then the write proceeds.

**Idempotency:** Commit fires exactly ONCE per session. Set a guard flag once it runs. Second and later writes do NOT re-commit. A mid-session persona swap (`/session.agent=<Other>`) does NOT re-commit — same session task, new voice. When Commit fires, log it in the transcript ("session committed at first write: <the triggering action>") so the promote moment is auditable.

Commit's steps, in order:

### C1. Scan the existing session list FIRST — including closed & done

Before creating anything, run the **Task Dedup Gate** (`hooks/task-dedup-gate.md`) against the Agent Activity Board list (`4026861396055549379`) for a session this conversation might be continuing. The session you're about to open is often a continuation: a paused audit, a build shipped last week, a handoff parked in `to do`. Earlier sessions are context precursors, not clutter.

- Pull **all statuses, INCLUDING `closed` and `done`** — hidden by default; retrieve them anyway. A done/closed session is a live context source.
- Match on scope / subject / domain, not just title text.
- Look for: a parked `↪️ HANDOFF · …` task in the `to do` slot, an `in progress` session on the same subject, or a recently closed/done session on the same thread.

Because the scan now runs at Commit-time (subject known) instead of on bare invocation (no subject), it can actually match something. This is the whole point of the split.

### C2. Reopen over create (default bias, subject to the confidence bar)

If the scan turns up a genuine precursor, **REOPEN it as a continued session** rather than cutting a fresh task: flip it back to `in progress`, read its description + transcript to warm-start, post a resume comment ("Resumed <Mon DD> — continuing <what/why>"), and continue the record there. If it's a parked handoff, complete its warm-start prompt and keep going.

**Confidence bar (a wrong reopen POLLUTES an unrelated real record — worse than a duplicate):**
- **High confidence** (same subject/scope, transcript clearly continues the thread): reopen and continue.
- **Ambiguous** (plausible but not certain): do NOT auto-reopen. Surface the candidate with its link + status and ASK Michael "continue this one, or start fresh?" **before the triggering write.** This is Michael's "we've landed here, does that sound right, can I go?" beat — it is the confidence bar surfacing at Commit-time.
- **No genuine match:** create new (C3).

When in doubt, a new task is the reversible, low-cost move; a bad reopen is the expensive one. Bias toward reopen on a clear match, toward asking on an ambiguous one, never toward a silent wrong reopen.

### C3. Create a new session task (only if no precursor exists)

**List:** `4026861396055549379` (🟢 Agent Activity Board)
**Title:** `Brain (Opus <version>) · <what you're doing, concise> · <Mon DD>`
**Description:** Agent Activity Board Gold Standard format: Objective, key context links, Status: in progress, Start date: today.

### C4. Backfill the scratch cache as the opening transcript

Replay the buffered beats (Prime read, pre-subject chatter, the forming subject) as the opening transcript comment(s) on the freshly reopened/created task — timestamped, flagged as backfilled-from-scratch, faithful-not-verbatim per the transcript gate. Nothing invented; gaps flagged. The session is now live; transcript accrues per reply thereafter.

### C5. Post presence (only if this session touches the repo)

If the triggering write (or upcoming work) is a repo op: read `brain-config/session-board.md` (who else is live — coordinate, don't stomp), then add ONE Active entry (what you're doing, which files). Edit in place; DELETE on close. Presence is tied to first-repo-op, NOT to Commit in general — a workspace-only session skips it.

---

## The scratch cache (what Prime opens, what Commit flushes)

- **What it is:** an in-context buffer, not a durable store. Session beats + a live provisional-subject line.
- **On Commit:** flushed as the opening transcript (C4).
- **Micro-flush at close:** if a session accrued real beats but never committed (thought hard, never wrote), session-close cuts a thin task and dumps the buffer so it's recoverable. A session with real work always ends with a record.
- **Accepted risk (named, not solved):** a crash between "real thinking" and any write loses an uncommitted buffer. We do NOT build a write-ahead log for chat. Only a pure sub-subject trivial buffer legitimately evaporates.

---

## What "substantive" means

The line: will this conversation produce changes to the workspace, repo, or generate deliverables? If yes, it will eventually write → Commit will fire. If you're unsure, err toward priming (it's free) and let the first write decide. A session that ends up short is fine; a session with real work and no record is not.

---

## Edge-case ledger (all handled by the one rule: prime read-only, first write commits)

- **Blank session, no agent:** Prime runs house-voice Brain; identical split.
- **Bare agent invocation, never becomes work:** stays primed, read-only, leaves nothing.
- **Work with NO invocation** ("move these 3 tasks"): first write commits, identical path.
- **First message IS the whole job** (10-sec lookup): read-only, never writes, never commits — no litter.
- **Genuine pickup / handoff resume:** Commit resolves to REOPEN (C2), not create.
- **Mid-session persona swap** (`/session.agent=`): idempotency guard — no re-commit, same task, new voice.
- **Concurrent sessions, same agent:** each commits its own task; presence decoupled to first-repo-op.
- **Ambiguous precursor:** Commit PAUSES and asks before the write (C2 confidence bar).

---

## Failure modes this prevents

- **Premature task on bare invocation** — the `/session start = felix` misfire: cutting a task + scanning the board with zero context. Prime is now read-only; nothing is cut until a write.
- **Sessions with no Activity Board record** (invisible work, no transcript, unresumable) — the first write always commits one; micro-flush catches the write-less-but-substantive case.
- **Duplicate session tasks for work that was already a thread** — C1 scans closed/done; C2 reopens.
- **A blind create triggered by a "did you start your task?" nudge** — the nudge is not an exemption; Commit still runs the scan.
- **A wrong reopen polluting an unrelated real record** — the C2 confidence bar (ask when ambiguous, never silently reopen a maybe).
- **Git collisions from missing presence posts** — C5 on first repo op.
- **Front-loading a scan into Prime** (re-introducing the bug) — Prime is defined read-only; the scan lives only in Commit.

---

## Relationship to session-close

| session-open | session-close |
|---|---|
| PRIME: persona + context + scratch + "ready" (read-only) | Cut the next-session HANDOFF task |
| COMMIT (on first write): scan incl. closed/done + reopen-or-create | Close/summarize session task |
| COMMIT: post presence on session-board (if repo op) | Delete presence from session-board |
| COMMIT: backfill scratch as opening transcript | Memory audit + save |
| Start the work | Report what was done + micro-flush any uncommitted buffer |

They are bookends. Neither is optional for substantive sessions.
