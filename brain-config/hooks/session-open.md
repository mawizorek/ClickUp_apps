# Session Open

**Type:** MANDATORY gate for sessions that will produce workspace writes or deliverables, run in TWO phases (Prime, then Commit).
**Trigger:** First user message in a new conversation where work will be done (not single-question lookups or casual chat).
**Created:** 2026-07-18 (Michael directive: mirror session-close at the top).
**Updated:** 2026-07-20 (**invocation ≠ session**. Split into Prime + Commit; a bare invocation must not cut a task or scan the board. Rehomed after `/session start = felix` misfired the full open on zero context.)
**Updated:** 2026-07-28 (*"fix those spine hooks so you do the work you're supposed to be doing."* **Arming the spine became a numbered Commit step (C4).** A REOPEN is explicitly an OPEN. Presence posts for EVERY session, closing Q11 → D.)
**Updated:** 2026-07-31 (**C6 split.** The READ moved to `hooks/collision-check.md` and fires per work item; C6 keeps the WRITE.)
**Updated:** 2026-08-01 (**C6 is now a HARD PRE-WRITE GATE, not a one-time post.** Fourth collision: both sessions HAD rows, for different work, and neither moved one. See C6.)
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
- Look for: a parked `↪️ HANDOFF · …` task in the `to do` slot, a `🧧 STANDING ·` thread on the subject, an `in progress` session on the same subject, or a recently closed/done session on the same thread.

Because the scan now runs at Commit-time (subject known) instead of on bare invocation (no subject), it can actually match something. This is the whole point of the split.

### C2. Reopen over create (default bias, subject to the confidence bar)

If the scan turns up a genuine precursor, **REOPEN it as a continued session** rather than cutting a fresh task: flip it back to `in progress`, read its description + transcript to warm-start, post a resume comment ("Resumed <Mon DD> — continuing <what/why>"), and continue the record there. If it's a parked handoff, complete its warm-start prompt and keep going.

🚨 **A REOPEN IS AN OPEN. Continue to C4 and arm the spine.** The resume comment lands on a task that already has a transcript, which is the single most convincing false signal in this whole procedure — it *feels* like the record is live because half of it is. **A `🧧 STANDING ·` thread is the highest-risk case:** it is deliberately never closed, so it always looks open and always has history. It still needs a fresh spine header for THIS session.

**Confidence bar (a wrong reopen POLLUTES an unrelated real record — worse than a duplicate):**
- **High confidence** (same subject/scope, transcript clearly continues the thread): reopen and continue.
- **Ambiguous** (plausible but not certain): do NOT auto-reopen. Surface the candidate with its link + status and ASK Michael "continue this one, or start fresh?" **before the triggering write.**
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

**Why this is a numbered step and not a reminder:** until 2026-07-28, arming the spine appeared **only** in `session-transcript-gate.md`'s prose "Opening check" — and *never in any executable checklist.* Commit ran C1→C5 with nothing in it about the spine. **Four consecutive sessions walked this sequence and posted zero lines, and all four were following the procedure as written.** That is not four lapses; it is one missing step. The gate now points here for sequencing rather than restating it, so there is one ordered list and one claimant.

### C5. Backfill the scratch cache as the opening transcript

Replay the buffered beats (Prime read, pre-subject chatter, the forming subject) as the opening transcript comment(s) on the freshly reopened/created task — timestamped, flagged as backfilled-from-scratch, faithful-not-verbatim per the transcript gate. Nothing invented; gaps flagged. The session is now live; the spine accrues one line per reply thereafter.

### C6. 🔴 CLAIM your work on the session board — and it is a HARD PRE-WRITE GATE

Add ONE Active entry to `brain-config/session-board.md`: **your branch**, what you're doing, **which repo**, and **which files** if any. Edit in place; **DELETE on close.**

🔴 **THE GATE (LOCKED 2026-08-01, Michael): NO ROW NAMING YOUR BRANCH = NO WRITE.** Before any `create_or_update_file`, `push_files`, `create_branch`, `delete_file` or `merge_pull_request`, the board must carry a row that is yours, current, and names the branch + the directory. If it does not, the write does not happen yet. **Full contract, including how to test and clear another session's row: `hooks/collision-check.md` → THE HARD GATE.**

**C6 is the FIRST claim of the session and never the last.** Commit fires once; the gate fires on every write. Treating C6 as done-at-Commit is precisely the 2026-08-01 failure: two sessions collided while **both had rows**, because both rows described earlier work nobody had moved. **A row that is not moved is worse than no row** — an absent row is honest ambiguity, a row naming the wrong files is a false negative that gets believed.

**Presence fires for every committed session, not only repo ops.** On 2026-07-25 the board read *"No active sessions"* for 98 minutes while a parallel session rewrote `_shared/super-agent-base.md` underneath a bundle being audited against it. Both agents followed the rule then in force. **An empty board is indistinguishable from nobody having posted** (Concurrency rule 5), so presence exists because a SESSION exists — not because an agent predicted it was about to touch git. A workspace-only session posts a row naming no files; that row is still the signal.

**C6 is the CLAIM. The CHECK and the enforcement are `hooks/collision-check.md`** (split 2026-07-31): reading protects YOU, writing protects EVERYONE ELSE, and welded together the cheap self-interested act was gated behind the expensive altruistic one. Two things matter from this file:

- **The check fires per WORK ITEM; the gate fires per WRITE.** A new ask mid-session → check again. Scope grows into files you had not claimed → **move this row before the write.**
- **A row is only true until your scope changes.** Fiona's moved four times in one session. That is correct behaviour, not fussiness.

---

## The scratch cache (what Prime opens, what Commit flushes)

- **What it is:** an in-context buffer, not a durable store. Session beats + a live provisional-subject line.
- **On Commit:** flushed as the opening transcript (C5).
- **Micro-flush at close:** if a session accrued real beats but never committed (thought hard, never wrote), session-close cuts a thin task and dumps the buffer so it's recoverable. A session with real work always ends with a record.
- **Accepted risk (named, not solved):** a crash between "real thinking" and any write loses an uncommitted buffer. We do NOT build a write-ahead log for chat. Only a pure sub-subject trivial buffer legitimately evaporates.

---

## When this gate fires (explicit conditions)

The question: will this conversation produce changes to the workspace, repo, or generate deliverables? Specifically:
- **FIRES (Commit triggers):** the session is about to create/update a task, post a comment, write to a repo, move a task, create a doc, or produce any persistent artifact.
- **DOES NOT FIRE:** single-question lookups, casual chat, bare acknowledgements, sessions that stay read-only from start to finish.
- **If unsure:** err toward priming (it's free) and let the first write decide. A session that ends up short is fine; a session with real work and no record is not.

---

## Edge-case ledger (all handled by the one rule: prime read-only, first write commits)

- **Blank session, no agent:** Prime runs house-voice Brain; identical split.
- **Bare agent invocation, never becomes work:** stays primed, read-only, leaves nothing.
- **Work with NO invocation** ("move these 3 tasks"): first write commits, identical path.
- **First message IS the whole job** (10-sec lookup): read-only, never writes, never commits — no litter.
- **Genuine pickup / handoff resume:** Commit resolves to REOPEN (C2), **and still runs C4–C6.** A pickup is an open.
- **Standing thread** (`🧧 STANDING ·`, never closed): always looks open, always has history. Reopen it, and **still arm a fresh spine header for this session.**
- **Mid-session persona swap** (`/session.agent=`): idempotency guard — no re-commit, same task, same spine header, new voice. ⚠️ **The board row still moves if the scope does.**
- **Second session on the same task, same day:** C4's idempotency check finds the existing header. Thread under it; do not split one task across two roots.
- **Concurrent sessions, same agent:** each commits its own task, its own header, and **its own row naming its own branch.** Two Felix sessions collided on 08-01 precisely here.
- **Michael asks for something NEW mid-session:** Commit does NOT re-fire — but `collision-check` does, **and the row moves before the next write.** A committed session is not a claim on work it had not thought of yet.
- **Ambiguous precursor:** Commit PAUSES and asks before the write (C2 confidence bar).
- **Workspace-only session, no repo op:** still posts presence (C6), naming no files.

---

## Failure modes this prevents

- **Premature task on bare invocation** — the `/session start = felix` misfire. Prime is now read-only; nothing is cut until a write.
- 🌿 **A session that runs its whole length with no chronology** — the spine is C4, inside the sequence that actually executes, instead of a reminder in another document.
- 🌿 **A pickup taking a shorter path than a fresh open** — "a reopen is an open" is stated in C2 and in its own top-level rule.
- **Sessions with no Activity Board record** — the first write always commits one; micro-flush catches the write-less-but-substantive case.
- **Duplicate session tasks for work that was already a thread** — C1 scans closed/done; C2 reopens.
- **Two headers for one session** — C4's idempotency check.
- **A wrong reopen polluting an unrelated real record** — the C2 confidence bar.
- **A board that lies by being empty** — C6, now every session.
- **A board that lies by being STALE** — C6's gate: a row names its branch, so it can be tested and cleared with evidence.
- 🔀 **Two sessions building the same thing** — NOT prevented by anything in this file alone. C6 is a CLAIM, and a claim only helps someone who looks. **`hooks/collision-check.md` is the looking**, and it fires per work item precisely because this file's Commit fires once, early, when scope is smallest.
- **Front-loading a scan into Prime** (re-introducing the bug) — Prime is defined read-only; the scan lives only in Commit.

---

## Relationship to session-close

| session-open | session-close |
|---|---|
| PRIME: persona + context + scratch + "ready" (read-only) | Cut/reopen the next-session handoff, or rewrite the standing thread |
| COMMIT C1–C3: scan incl. closed/done + reopen-or-create | Close the session task (or return a standing thread to `to do`) |
| **COMMIT C4: arm the spine header** | **Post the spine close line + reconcile replies vs lines** |
| COMMIT C5: backfill scratch as opening transcript | Finalize the Session Ledger |
| **COMMIT C6: claim on session-board (gate: re-claim on every write)** | **Delete your row from session-board** |
| Start the work | Memory audit + report what was done |

They are bookends. Neither is optional for sessions that produce workspace writes or deliverables. **Every open-time step has a close-time counterpart; if you never armed the spine, close has nothing to reconcile and will say so.**

---

## Changelog

- **2026-08-02 — kill-substantive pass.** Replaced 'substantive' throughout with explicit conditions. Type header now states what fires this gate (workspace writes or deliverables). The old "What 'substantive' means" section replaced with "When this gate fires" using explicit enumerated conditions. Relationship table updated.
- **2026-08-01 — C6 BECAME A HARD PRE-WRITE GATE.** Michael: *"make the board row a hard pre-write gate."* Fourth collision, and the first one v1's fixes could not have caught: two Fleet Felix sessions ran the same 16-file remediation thirteen seconds apart while **both had board rows — for different, already-merged work.** The check fired, the claim existed, and the claim was about something else. So the enforcement moved from the session (fires once) and the work item (a judgement call) to **the write tool** (a tool invocation with a path in it), and a row must now name its **BRANCH** so staleness is testable in one call. Contract: `hooks/collision-check.md` → THE HARD GATE.
- **2026-07-31 — C6 SPLIT: the claim and the check are two steps.** Two sessions built batch-import simultaneously; surfaced only at merge. C6 already mandated presence and **neither session reached it**, so the diagnosis was not a missing rule. Three design faults, written up in `hooks/collision-check.md`: the check rode on the announcement; it fired once at Commit when scope is smallest; and the `create_branch` "Reference already exists" signal was investigated and explained away. **C6 kept the write; the read moved out and fires per work item.**
- **2026-07-28 — THE SPINE BECAME A COMMIT STEP (C4).** Root cause was mechanical, not behavioural: arming the spine existed only as prose in `gates/session-transcript-gate.md` and appeared in NO executable checklist, so four consecutive sessions posted **zero spine lines while correctly following this hook.** Also: **"a REOPEN is an OPEN"** promoted to a top-level rule, Commit declared **a sequence and not a menu**, and the standing-thread + same-day-second-session edge cases named. **The lesson banked above all of it: when the same rule breaks the same way four times, the rule is not being broken — it is not being reached. Put the step in the list that executes.**
- **2026-07-28 — Q11 → D EXECUTED.** C6 presence fires for EVERY committed session, not only repo ops. Authorized 07-25 after the board read "No active sessions" for 98 minutes during a live parallel rewrite of the base spec.
- **2026-07-20 — Prime/Commit split.** See the Updated header.
- **2026-07-19 — Scan closed & done; reopen over create.** Preserved inside Commit (C1/C2).
- **2026-07-18 — Created** to mirror session-close at the top of a session.
