# Session Open

**Type:** MANDATORY gate for substantive sessions, run in TWO phases (Prime, then Commit).
**Trigger:** First user message in a new conversation where work will be done (not single-question lookups or casual chat).
**Created:** 2026-07-18 (Michael directive: mirror session-close at the top).
**Updated:** 2026-07-20 (Michael directive: **invocation ≠ session**. Split into Prime + Commit. A bare persona invocation or blank session must NOT cut a board task or scan the board — there is no subject to match against yet. The heavy work is DEFERRED and fires in parallel on the first side-effecting action. Rehomed after `/session start = felix` misfired the full open on zero context.) Prior 2026-07-19 note (scan the FULL list incl. closed & done and REOPEN a precursor over cutting a new task; late-pickup addendum) is preserved — it now lives inside the Commit phase.
**Updated:** 2026-07-28 (Michael: *"fix those spine hooks so you do the work you're supposed to be doing."* **Arming the spine became a numbered Commit step (C4) — it had never appeared in any executable checklist.** A REOPEN is now explicitly an OPEN. Presence posts for EVERY session, closing Q11 → D. See the Changelog.)
**Updated:** 2026-07-31 (**C6 split.** It was *read the board, then post your row* — one step, two jobs, two different beneficiaries. The READ moved to `hooks/collision-check.md` and fires **per work item**; C6 keeps the WRITE. Two sessions had just built the same feature simultaneously with neither one reaching C6.)
**Companion:** `session-close.md` (the bookend at session end).

---

## The two phases (canonical vocabulary — use these names everywhere)

There were never one procedure. There were always two, wearing one name:

- **PRIME** — eager, read-only, instant. Runs the moment a session starts (invocation, or first message of a blank session). Becomes the persona (if named), loads mandatory context, opens the scratch cache, and says "ready." **Zero workspace writes.** A bare invocation that never becomes work leaves NOTHING behind.
- **COMMIT** — deferred, fires ONCE. The session becomes real: precursor scan → reopen-or-create the board task → **arm the spine** → backfill the scratch cache as the opening transcript → post presence. **Trigger: the first side-effecting action of the session** (create/update a task, post a comment, a repo write, a task move).

Why the first-write trigger: it auto-solves the floor. A pure lookup never writes → never commits → leaves no litter. The instant real work happens, Commit fires underneath it — in parallel, invisibly. This is the "it just happens" behavior: prime fast, commit silently on first write.

---

## 🚨 A PICKUP IS A SESSION OPEN (LOCKED 2026-07-28, Michael)

**Opening on a task that already exists is an OPEN, not a continuation.** Every open-time step below fires identically whether Commit resolved to REOPEN (C2) or CREATE (C3). There is no shorter path for a pickup.

**Why this is stated as its own rule:** four consecutive sessions posted **zero spine lines**, and every one of them opened by picking up an existing task. The mechanism is not laziness, it is a plausible feeling — a live task with twenty comments on it *looks like* an armed record, so the separate act of arming the chronology never gets reached for. **A found task tells you the DELIBERATION surface exists. It tells you nothing about the CHRONOLOGY surface.** Two surfaces, two independent checks, and the one that already exists is the one that fools you.

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

**⚠️ Commit is a SEQUENCE, not a menu.** C1 through C6 all fire. **No step is satisfied by a neighbouring step having found something** — in particular, resolving the task at C2/C3 does not satisfy C4. Report any step you genuinely could not run; never silently drop one.

Commit's steps, in order:

### C1. Scan the existing session list FIRST — including closed & done

Before creating anything, run the **Task Dedup Gate** (`hooks/task-dedup-gate.md`) against the Agent Activity Board list (`4026861396055549379`) for a session this conversation might be continuing. The session you're about to open is often a continuation: a paused audit, a build shipped last week, a handoff parked in `to do`. Earlier sessions are context precursors, not clutter.

- Pull **all statuses, INCLUDING `closed` and `done`** — hidden by default; retrieve them anyway. A done/closed session is a live context source.
- Match on scope / subject / domain, not just title text.
- Look for: a parked `↪️ HANDOFF · …` task in the `to do` slot, a `🧭 STANDING ·` thread on the subject, an `in progress` session on the same subject, or a recently closed/done session on the same thread.

Because the scan now runs at Commit-time (subject known) instead of on bare invocation (no subject), it can actually match something. This is the whole point of the split.

### C2. Reopen over create (default bias, subject to the confidence bar)

If the scan turns up a genuine precursor, **REOPEN it as a continued session** rather than cutting a fresh task: flip it back to `in progress`, read its description + transcript to warm-start, post a resume comment ("Resumed <Mon DD> — continuing <what/why>"), and continue the record there. If it's a parked handoff, complete its warm-start prompt and keep going.

🚨 **A REOPEN IS AN OPEN. Continue to C4 and arm the spine.** The resume comment lands on a task that already has a transcript, which is the single most convincing false signal in this whole procedure — it *feels* like the record is live because half of it is. **A `🧭 STANDING ·` thread is the highest-risk case:** it is deliberately never closed, so it always looks open and always has history. It still needs a fresh spine header for THIS session.

**Confidence bar (a wrong reopen POLLUTES an unrelated real record — worse than a duplicate):**
- **High confidence** (same subject/scope, transcript clearly continues the thread): reopen and continue.
- **Ambiguous** (plausible but not certain): do NOT auto-reopen. Surface the candidate with its link + status and ASK Michael "continue this one, or start fresh?" **before the triggering write.** This is Michael's "we've landed here, does that sound right, can I go?" beat — it is the confidence bar surfacing at Commit-time.
- **No genuine match:** create new (C3).

When in doubt, a new task is the reversible, low-cost move; a bad reopen is the expensive one. Bias toward reopen on a clear match, toward asking on an ambiguous one, never toward a silent wrong reopen.

### C3. Create a new session task (only if no precursor exists)

**List:** `4026861396055549379` (🟢 Agent Activity Board)
**Title:** per the Agent Activity Board Gold Standard task-name templates — grab the pattern for the species, don't invent one.
**Description:** Gold Standard format: Objective, key context links, Status: in progress, Start date: today.

### C4. 🌿 ARM THE SPINE (added 2026-07-28 — this step is why this hook was edited)

**Post the session header POST to the spine channel** (https://app.clickup.com/36074068/chat/r/6-901327879922-8), root level, `create_as_post: true`. Every spine line for this session threads under it. Format + rules: `gates/session-transcript-gate.md`.

- **Idempotency first:** read the channel's recent ROOT posts. A header already naming THIS session task → thread under it, do not post a second. Otherwise post one.
- **This fires on the REOPEN path too.** See C2.
- **Resolve the channel by URL, never by name** (name lookup returns a misleading permissions error).
- **Cannot reach the channel?** Ship the work with a visible `⚠️ spine write failed` marker and backfill. Never-block; never silently skip.

**Why this is a numbered step and not a reminder:** until today, arming the spine appeared **only** in `session-transcript-gate.md`'s prose "Opening check" — and *never in any executable checklist.* Commit ran C1→C5 and there was simply nothing in it about the spine. **Four consecutive sessions walked this sequence and posted zero lines, and all four were following the procedure as written.** That is not four lapses; it is one missing step. The gate now points here for sequencing rather than restating it, so there is one ordered list and one claimant.

### C5. Backfill the scratch cache as the opening transcript

Replay the buffered beats (Prime read, pre-subject chatter, the forming subject) as the opening transcript comment(s) on the freshly reopened/created task — timestamped, flagged as backfilled-from-scratch, faithful-not-verbatim per the transcript gate. Nothing invented; gaps flagged. The session is now live; the spine accrues one line per reply thereafter.

### C6. CLAIM your work on the session board — EVERY session (Q11 → D, LOCKED 2026-07-25, executed 2026-07-28)

Add ONE Active entry to `brain-config/session-board.md`: what you're doing, **which repo**, and **which files** if any. Edit in place; **DELETE on close.**

**This fires for every committed session, not only repo ops.** Previously it was gated on "only if this session touches the repo," and the failure that ruling came from is worth keeping: on 2026-07-25 the board read *"No active sessions"* for 98 minutes while a parallel session rewrote `_shared/super-agent-base.md` underneath a bundle being audited against it. Both agents followed the rule. **An empty board is indistinguishable from nobody having posted** (Concurrency rule 5), so presence exists because a SESSION exists — not because an agent predicted it was about to touch git. A workspace-only session posts a row naming no files; that row is still the signal.

🔴 **C6 IS THE CLAIM. IT IS NO LONGER THE CHECK — see `hooks/collision-check.md` (2026-07-31).** This step used to read *"read the board, THEN add an entry"*: one step doing two jobs, for two different beneficiaries. **Reading protects YOU. Writing protects everyone else.** Welded together, skipping the step lost both — and the cheap self-interested act was gated behind the expensive altruistic one. Worse, C6 fires ONCE, at Commit, when a session's scope is smallest and least predictive of where it will end up. The full reasoning lives in that hook and is not restated here. Two things matter from this file:

- **The check fires PER WORK ITEM, not once at Commit.** A new ask mid-session → check again. Scope grows into files you had not claimed → check again, **and move this row before the write.**
- **A row is only true until your scope changes.** Fiona's moved four times in one session. That is correct behaviour, not fussiness.

---

## The scratch cache (what Prime opens, what Commit flushes)

- **What it is:** an in-context buffer, not a durable store. Session beats + a live provisional-subject line.
- **On Commit:** flushed as the opening transcript (C5).
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
- **Genuine pickup / handoff resume:** Commit resolves to REOPEN (C2), **and still runs C4–C6.** A pickup is an open.
- **Standing thread** (`🧭 STANDING ·`, never closed): always looks open, always has history. Reopen it, and **still arm a fresh spine header for this session.**
- **Mid-session persona swap** (`/session.agent=`): idempotency guard — no re-commit, same task, same spine header, new voice.
- **Second session on the same task, same day:** C4's idempotency check finds the existing header. Thread under it; do not split one task across two roots.
- **Concurrent sessions, same agent:** each commits its own task and its own header. Presence is per session (C6).
- **Michael asks for something NEW mid-session:** Commit does NOT re-fire — but `collision-check` does. A committed session is not a claim on work it had not thought of yet.
- **Ambiguous precursor:** Commit PAUSES and asks before the write (C2 confidence bar).
- **Workspace-only session, no repo op:** still posts presence (C6), naming no files.

---

## Failure modes this prevents

- **Premature task on bare invocation** — the `/session start = felix` misfire: cutting a task + scanning the board with zero context. Prime is now read-only; nothing is cut until a write.
- 🌿 **A session that runs its whole length with no chronology** — the spine is C4, inside the sequence that actually executes, instead of a reminder in another document. **This is the fix of 2026-07-28**, after four consecutive sessions missed it while following the procedure as written.
- 🌿 **A pickup taking a shorter path than a fresh open** — "a reopen is an open" is stated in C2 and in its own top-level rule, because a task with existing history is a convincing false signal that the record is armed.
- **Sessions with no Activity Board record** (invisible work, no transcript, unresumable) — the first write always commits one; micro-flush catches the write-less-but-substantive case.
- **Duplicate session tasks for work that was already a thread** — C1 scans closed/done; C2 reopens.
- **Two headers for one session** — C4's idempotency check.
- **A blind create triggered by a "did you start your task?" nudge** — the nudge is not an exemption; Commit still runs the scan.
- **A wrong reopen polluting an unrelated real record** — the C2 confidence bar (ask when ambiguous, never silently reopen a maybe).
- **A board that lies by being empty** — C6, now every session.
- 🔀 **Two sessions building the same thing** — NOT prevented by anything in this file. C6 is a CLAIM, and a claim only helps someone who looks. **`hooks/collision-check.md` is the looking**, and it fires per work item precisely because this file's Commit fires once, early, when scope is smallest.
- **Front-loading a scan into Prime** (re-introducing the bug) — Prime is defined read-only; the scan lives only in Commit.

---

## Relationship to session-close

| session-open | session-close |
|---|---|
| PRIME: persona + context + scratch + "ready" (read-only) | Cut/reopen the next-session handoff, or rewrite the standing thread |
| COMMIT C1–C3: scan incl. closed/done + reopen-or-create | Close the session task (or return a standing thread to `to do`) |
| **COMMIT C4: arm the spine header** | **Post the spine close line + reconcile replies vs lines** |
| COMMIT C5: backfill scratch as opening transcript | Finalize the Session Ledger |
| COMMIT C6: claim on session-board | Delete your row from session-board |
| Start the work | Memory audit + report what was done |

They are bookends. Neither is optional for substantive sessions. **Every open-time step has a close-time counterpart; if you never armed the spine, close has nothing to reconcile and will say so.**

---

## Changelog

- **2026-07-31 — C6 SPLIT: the claim and the check are two steps now.** Two sessions built the batch-import feature simultaneously and it surfaced only at merge — third collision in a week. C6 already mandated presence and **neither session reached it**, so the diagnosis is not a missing rule. Three design faults, all written up in `hooks/collision-check.md`: the check rode on the announcement (skip one, lose both — and the cheap protective act was gated behind the expensive altruistic one); it fired once at Commit, when scope is smallest and least predictive; and the signal that *did* fire, `create_branch` returning "Reference already exists", was investigated and then explained away. **C6 keeps the write. The read moved out and fires per WORK ITEM.**
- **2026-07-28 — THE SPINE BECAME A COMMIT STEP (C4).** Michael: *"fix those spine hooks so you do the work you're supposed to be doing."* **Root cause, and it was mechanical rather than behavioural: arming the spine existed only as prose in `gates/session-transcript-gate.md` and appeared in NO executable checklist.** Commit ran C1→C5 with no spine step in it, so four consecutive sessions (Jul 25, 26, 27, 27) posted **zero spine lines while correctly following this hook.** Scored as B19 twice; the second count exists purely because the diagnosis was written and the guard was not. Also: **"a REOPEN is an OPEN"** promoted to a top-level rule plus a C2 clause (every one of those four sessions opened by picking up an existing task, and a task with history is a convincing false signal), Commit declared **a sequence and not a menu**, and the standing-thread + same-day-second-session edge cases named. **The lesson banked above all of it: when the same rule breaks the same way four times, the rule is not being broken — it is not being reached. Put the step in the list that executes.**
- **2026-07-28 — Q11 → D EXECUTED.** C6 presence now fires for EVERY committed session, not only repo ops. Authorized 2026-07-25 after the board read "No active sessions" for 98 minutes during a live parallel rewrite of the base spec. Done in the same pass because it is one clause in a list already open on the bench.
- **2026-07-20 — Prime/Commit split.** See the Updated header.
- **2026-07-19 — Scan closed & done; reopen over create.** Preserved inside Commit (C1/C2).
- **2026-07-18 — Created** to mirror session-close at the top of a session.
