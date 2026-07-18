---
slug: session-close
display_name: Session Close
type: hook
status: active
trigger: end of every Brain session (no exceptions)
owner_agents: [closing-clio, memory-maggie, scribe-sana]
---

# Session Close Hook

**Fires:** at the end of every Brain session, no exceptions. Even short sessions. Even sessions with no builds or memory changes.

**Canonical source:** this file. Supersedes any prior ClickUp doc version.

---

## Overview

Two posts, two channels, every session. Both follow the same structural rule: **root = tight header only, thread reply = all detail.** The root is what shows in the channel feed; the thread is what you expand when you want the full picture.

**Transcript-location reframe (2026-07-17):** the live play-by-play transcript now accrues on the session's **Agent Activity Board task** (as comments), NOT in the A.I. Prompts channel. That task is the live working record and functionally replaces the old active session thread. See `Agent Activity Board — Gold Standard` (Brain Reference). Consequently the Channel 2 (Session Log) post is now a **SUMMARY that points back to the session task**, not a re-created full transcript. Do not rebuild a faithful transcript at close — it already accrued on the task, comment-by-comment, as the session ran.

**The session task did NOT replace the channel close (hard rule, Michael 2026-07-17).** Having an Activity Board task is an ADDITIONAL surface, not a substitute for the two-channel close. When a session ends (or Michael says "session closed"), the FULL close hook still fires: both channel posts happen AND the session task is shut down with a final pointer comment. Do not treat "I updated the task" as a completed close. "Closed out" is only true once both threads are posted, the task carries its final pointer comment, and Michael has been handed the task link.

**Status semantics + handoff-at-close (ELEVATED 2026-07-17, Michael).** An actively-driven session task is `in progress` from the moment it's created (never parked at `to do` — you're doing it this second); the FIRST status (`to do`/New/Open) is repurposed as the HANDOFF/waiting slot, meaning "nobody is driving this yet." At close the warm-start handoff is no longer pasted as a chat code block: the agent CREATES the next-session task in the `to do` handoff slot, pre-loaded with the handoff prompt (Block T6 in the Gold Standard), and chains it to the closing task via a task relationship + pointer comment (Block T7). Michael starts the next session by opening that task and saying "complete the handoff prompt here, let's keep going"; the picking-up agent flips it to `in progress` and runs. See `Agent Activity Board — Gold Standard`.

---

## Two Modes: Full Close (default) vs Soft Close

**Full Close is the default.** Every session closes with the full procedure below (both channel posts + the usage-log commit) UNLESS Michael explicitly says **"soft close"** / **"let's do a soft close."** The phrase is the only trigger; a generic "let's close" / "wrap it up" is still a full close.

### Soft Close (lightweight variant)

**When:** small, low-narrative sessions where a full summary + memory audit is overkill: uploading photos to a task, a quick single-artifact tweak, a one-off lookup. Michael calls it explicitly.

**What STILL runs (back-end tooling, non-negotiable):**

- **Tool-usage tally + commit** to `brain-config/usage-log.json`. Count every profiled hook/gate/agent that fired this session, increment each count, bump `sessions_logged`.
- **Agents built/invoked** this session are tracked in the same tally.
- **Git indexing + closing articulation** committed as normal.

**What's SKIPPED:**

- **Channel 1 (Memory Audit):** skipped **only if memory was NOT written this session.** If any memory edit landed (or bounced), the audit STILL fires.
- **Channel 2 (Session Log):** no session-log summary post on a soft close. (A soft close means the session task never carried substantive work; if a session task WAS opened and accrued real transcript comments, that session was substantive — finalize it as a full close.)

If a soft-close session unexpectedly turned substantive (real decisions, a build), upgrade to a full close.

---

## Channel 1: Brain Max Memory Audit

**URL:** https://app.clickup.com/36074068/chat/r/12cwjm-55833
**Owner:** Memory Maggie (sole owner of brain-memory file across its lifecycle).
**Purpose:** Track memory file health over time. Every session leaves a breadcrumb of what changed (or didn't) and current capacity.

*(Unchanged by the 2026-07-17 reframe.)*

### Root message format (EXACT)

```
~{tokens} / 2000 ({percent}%)
```

One line. No markdown headers, no emoji, no session title. Just the number.

**Correct:** `~1855 / 2000 (93%)`
**Wrong:** `## Memory Audit — session name` (detail belongs in thread)

### Thread reply format

Post as a reply to the root. Contains the full audit:

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

**Optional sections (include when relevant):**

- `### Issue flagged:` — process gaps or drift caught during the session
- `### Pending writes:` — if a memory edit bounced/failed and needs retry. **If a write bounced, ALSO drop it in `brain-config/open-memory-requests.md` (see the bounced-write rule below) so a later agent lands it — the audit note alone is not enough.**

---

## Bounced / unlanded memory writes — drop them in the open queue (2026-07-17)

If a memory write was attempted this session but did NOT land (no memory manager available, edit-guard bounce, tool failure), closing the session includes **dropping it into `brain-config/open-memory-requests.md`** (Door 1: append ONE `OMR-<date>-<n>` entry under Open, self-contained, with a non-binding placement guess). Do NOT silently leave it as only a chat mention or an audit footnote — those don't survive into the next session. The open-memory-requests queue is the durable handoff; Memory Maggie drains it in a fresh session. This step runs before the usage-log commit. Michael's directive: "if you have a memory addition request, drop it in the open memory thread in the Git for another agent to pick up later."

---

## Open-thread note → also append to open-thread.md (2026-07-17, Michael)

The open-loop / open-thread note for a session is ALREADY posted as a comment on the session's Agent Activity Board task — that's part of the normal in-session workflow and does not change. At close, that SAME note is ALSO appended as the next entry in `brain-config/open-thread.md`.

- **No review required.** Do not gate this on a review pass or ask permission — just post it as the next line/entry, same as any other close step. Michael's directive (2026-07-17): "take the same open-thread note and just post it in the open thread section... we won't require a review of that; just post it as the next line."
- **Two surfaces, one note, different jobs:** the task comment is the in-session record where the loop was raised; `brain-config/open-thread.md` is the durable cross-session queue a cold agent reads at the Session Open trigger. The append is what carries the loop into the next session — a comment alone doesn't get read at session open.
- **Format:** follow the existing `open-thread.md` entry shape (heading + `**Added:** YYYY-MM-DD` + the note body). Append; never overwrite existing entries. Repo write, so it goes through the normal branch → PR → self-merge flow like any other close-time commit.
- Parallel to the bounced-memory-write drop above: both are durable handoffs written at close so nothing that's still open dies inside a single session's chat/comments.

---

## Channel 2: A.I. Prompts (Session Log)

**URL:** https://app.clickup.com/36074068/chat/r/6-901327646617-8
**Owner:** Closing Clio (session health, ref inventory, hurdles, doc/index reconciliation).
**Purpose:** Permanent append-only INDEX of every Brain session — a scannable summary + a pointer to the session's Agent Activity Board task, which holds the full live transcript.

**Transcript lives on the task, not here (2026-07-17).** The session's Agent Activity Board task accrued the play-by-play live, as comments, throughout the session. At close the channel post is a concise SUMMARY (headlines + decisions + open loops) that **links to that task** as the full record. Do NOT paste a full chronological transcript into the channel and do NOT rebuild one from memory — point to the task instead.

### Root message format (EXACT)

```
## {Session Topic}

trigger: {what started the session} | {date range} ET
status: {complete | partial | handed off}
```

Three lines. Header, trigger line, status line. No detail, no bullet points, no refs.

**Correct:**
```
## File Chunker v17 — build, ship, repo-commit fumble

trigger: v17 build handoff | 2026-07-01 21:22 ET
status: v17 built + shipped as artifact; repo commit walked back
```

**Wrong:** putting the full summary in the root (detail belongs in thread).

### Thread reply format

The thread is a SUMMARY that leads with a pointer to the session task, then the closing structure. No full transcript.

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

The `Scoreboard (revised at close)` line is the close-side bookend of the opening transcript comment's `Current scoreboard at:` reading (posted on the session task at open — see the Agent Activity Board — Gold Standard cold-agent path). It states, in one line, whether any scoreboard points were awarded during THIS session, were bumped by someone else while it ran, or the standing is unchanged since open. Pull the current standing from the Scoreboard page.

**Optional sections (include when relevant):**

- `### Commits` — table of repo commits if the session touched GitHub
- `### Delegated prompts` — handoff blocks for other agents
- `### Process lesson` — if something went wrong and we learned from it

---

## Session-task shutdown (the fourth close surface, 2026-07-17)

After both channel posts, the session's Agent Activity Board task is CLOSED OUT, not just left open:

1. **Post the final task comment** — its last comment is a `[CLOSE-POINTER]` that links the two threads you just posted (Memory Audit + Session Log) and states that the task holds the full transcript. It also carries the **scoreboard-revised-at-close line** (🤖 N · 🧑 M + whether points were awarded THIS session, bumped by someone else, or unchanged since open) — the bookend to the opening transcript comment's `Current scoreboard at:` reading. Template `T4` lives in the Agent Activity Board — Gold Standard.
2. **Flip the task status to `done`.**
3. **Hand Michael the task link in chat** — the ONE link that matters, since the task now contains the full transcript from open through close, including links out to both channel threads. Template `T5` (the chat close message) lives in the Agent Activity Board — Gold Standard.

The task pointer comment and the channel posts cross-link: the channel Session Log points INTO the task (full transcript); the task's final comment points OUT to the two channel threads.

---

## Warm-Start Handoff → the next-session handoff TASK (reframed 2026-07-17)

**When:** whenever a session has a next step / open loops that continue into the next session. Skip only on a genuinely clean close with no next step.

**Delivery (CHANGED 2026-07-17).** Do NOT paste the next-session prompt as a bare code block in chat anymore. Instead **create the next-session task on the Agent Activity Board**, in the FIRST status (`to do` = handoff/waiting slot — no agent is driving it yet), pre-loaded with the handoff prompt in its description (Block T6 in the Gold Standard). Then **chain it to the closing session:** (1) a task **relationship** (follow-up of the closing task) and (2) a **pointer comment** on both tasks (Block T7). Michael triggers the next session by opening that task and saying "complete the handoff prompt here, let's keep going"; the picking-up agent flips it to `in progress`, posts its opening transcript comment (referencing the handoff), and runs. It's fine for a handoff task to sit open and untouched — it's the queue, not debt.

**The handoff prompt content — fixed sections (in order), written into the task description so a cold agent can act without loading prior conversation:**

1. **OBJECTIVE** — what the next session is picking up
2. **READ FIRST** — repo paths + read-method caveats (raw vs MCP, known truncation risks)
3. **PROCEDURE** — numbered steps
4. **CANDIDATES/NEXT** — ranked with status
5. **GUARDRAILS** — what to avoid / known failure modes
6. **OPEN THREADS** — anything unresolved

Never just post a bare link as a handoff. The prompt in the task must be self-contained enough that a cold agent can act on it without loading prior conversation.

---

## Rules (non-negotiable)

1. **NEVER use `create_as_post: true`.** Posts are for channel-wide announcements, not session logs. Session logs are regular messages with threaded detail.
2. **NEVER put detail in the root.** The root is the feed-scannable identifier. If someone scrolling the channel can't read your root in under 2 seconds, it's too long.
3. **ALWAYS thread the detail.** Use `parent_message` pointing at the root message URL you just created.
4. **Both channels, every session.** Even if memory didn't change (audit says "no changes, stable at X%"). Even if the session was short.
5. **The full transcript lives on the Agent Activity Board session task, not the channel.** It accrued live as comments during the session. At close, the channel Session Log is a SUMMARY that links to that task. Rebuilding a faithful transcript in the channel at close is a failure mode, not the procedure — point to the task.
6. **The session task is CLOSED OUT at close, and the channel close STILL fires.** The task never replaced the two-channel close; both happen. Shut the task (final `[CLOSE-POINTER]` comment + status `done`) AND post both channels AND hand Michael the task link. "Closed out" is false until all of that is done — if any piece is missing, say what's missing instead of claiming closure.
7. **A bounced/unlanded memory write is dropped in `brain-config/open-memory-requests.md`** as part of close, not left as only a chat mention or audit footnote.
8. **Closing capacity is MANDATORY in the session-log summary thread.** Every close reports Brain's real context usage (numbers, not vibes) + one honest line on how it feels and what recall is reliable vs hazy.
9. **Memory audit posts first, then session log summary.** Maggie posts Channel 1; Clio posts Channel 2 (summary + task pointer). Two owners on the posts, both root + thread.
10. **Root messages are never edited after posting.** Add info by threading.
11. **Thread replies can have addenda.** If the session continues after initial close (extended session), post an addendum reply in the same thread rather than a new root.
12. **Usage log commit (after both posts + task shutdown).** Tally which profiled tools (hooks, gates, agents) fired during the session. Commit an update to `brain-config/usage-log.json` incrementing each tool's count and bumping `sessions_logged`. Format: `{ "tools": { "tool-slug": N, ... }, "sessions_logged": N, "last_updated": "YYYY-MM-DD" }`.
13. **The session's open-thread note is appended to `brain-config/open-thread.md` at close, no review.** It's already a comment on the session task (in-session record); the append is the durable cross-session queue a cold agent reads at Session Open. Append the next entry, never overwrite; commit via the normal branch → PR → self-merge flow.
14. **The warm-start handoff is a TASK, not a chat code block (2026-07-17).** At close, create the next-session task in the first status (`to do` = handoff/waiting slot), pre-load the handoff prompt (Block T6), and chain it to the closing task (relationship + pointer comment T7). Active session tasks are `in progress` from creation; the first status is reserved for handoff/waiting. Don't paste the next-session prompt inline in chat anymore.
15. **Every close reports the scoreboard delta (2026-07-18, Michael).** The opening transcript comment carried a `Current scoreboard at: 🤖 N · 🧑 M` reading; the close carries the matching `Scoreboard revised at close:` line in BOTH the Session Log summary thread and the task's `[CLOSE-POINTER]` comment. One line stating whether points were awarded THIS session, bumped by someone else while it ran, or unchanged since open. Open reading and close reading are bookends; never post one without the other.

---

## Execution Order

1. Memory Maggie posts Channel 1 (Memory Audit: root + thread)
2. Closing Clio posts Channel 2 (Session Log: root + summary thread that links the Agent Activity Board session task as the full transcript, and carries the `Scoreboard (revised at close)` line)
3. Session-task shutdown: final `[CLOSE-POINTER]` comment (links both threads + carries the scoreboard-revised-at-close line) + flip status to `done` + hand Michael the task link in chat (templates T4/T5)
4. Bounced-memory-write drop: if any write didn't land, append an `OMR` entry to `brain-config/open-memory-requests.md`
5. Open-thread append: take the session's open-thread note (already a comment on the session task) and append it as the next entry in `brain-config/open-thread.md`. No review.
6. Next-session handoff TASK (if a next step exists): create it on the Agent Activity Board in `to do` (handoff slot), pre-loaded with the handoff prompt (Block T6), linked to the closing task as a follow-up (relationship + pointer comment T7). Replaces the old inline chat code block.
7. Usage-log commit to `brain-config/usage-log.json`

---

## Gold Standard Examples

**Memory Audit:** root is a bare token line; thread carries full audit structure even when nothing changed.

**Session Log:** root is tight header with trigger/date/status; thread leads with the session-task pointer, then headlines, decisions, refs, open loops. The task holds the transcript.

---

## Failure Modes

| Symptom | Root cause | Fix |
|---------|-----------|-----|
| Detail in the root message | Agent forgot to thread | Repost detail as thread reply |
| Used Post format | Agent confused Posts with messages | Never use `create_as_post: true` |
| Missing thread reply | Agent posted root then moved on | Always post both root AND thread |
| Full transcript pasted/rebuilt in the channel | Agent ignored the reframe | Transcript lives on the session task; channel = summary + task pointer |
| Closed the task but skipped the channel posts | Agent treated the task as a replacement for the channel close | Both fire; the task is an additional surface, not a substitute |
| Said "closed out" without handing Michael the links | Agent stopped after the task update | Not closed until both threads posted + task shut + task link given |
| Bounced memory write left as only a chat/audit mention | Agent skipped the durable drop | Append an OMR entry to open-memory-requests.md at close |
| Open-thread note left only as a task comment | Agent skipped the durable append | Also append it as the next entry in open-thread.md at close (no review) |
| Warm-start handoff pasted as a chat code block | Agent used the retired inline-prompt path | Create the next-session handoff TASK in `to do`, pre-load the prompt, chain it to the closing task |
| Active session task left at `to do` | Agent didn't flip on start | Active work is `in progress` from creation; `to do` = handoff/waiting only |
| No session task opened, so no transcript exists | Startup gate missed | Open the Agent Activity Board task at session start; comment near-per-prompt |
| Close missing the scoreboard delta | Agent posted the open reading but skipped the close bookend | Post `Scoreboard revised at close:` in both the Session Log summary and the task `[CLOSE-POINTER]` — awarded this session / bumped by someone else / unchanged |
| Audit says "no changes" with no thread | Agent skipped the structure | Still post full audit template with "None" in changes |
| Multiple roots for same session | Agent posted twice | Use addendum replies in thread |
| Root too verbose | Agent put summary in root | Root = identifier only |

---

## Companion files — reconciled ✅ (verified 2026-07-17, Audit Anna)

The transcript-location reframe touched two companion specs; an audit this session verified BOTH have since been migrated to the session-task model. No open reconciliation remains:

- `gates/session-transcript-gate.md` — reconciled (rev e→i): "the thread" is the session task's comment stream on the 🟢 Agent Activity Board; #A.I. Prompts is demoted to backup + the permanent close-transcript home. Adds the two-tier Workshop Post Protocol.
- Scribe Sana's agent profile — reconciled (rev e→h): her live-transcript role targets the session task's comments, not the channel thread; canonical board pointer corrected to `901327879922`.

*(This note previously read "should be reconciled next repo session" — that was stale; the work had already landed. Corrected to the realized state per the missed-gate/drift protocol.)*

---

## Why This Matters

These channels are the institutional memory of our work together. The session task now holds the true, live, comment-by-comment record of a session; the channel Session Log is the scannable index that points to it. A cold agent picking up next week scrolls the channel for the summary, then opens the linked task for the full back-and-forth. The memory audit channel tracks preference file health over time without loading the full file.
