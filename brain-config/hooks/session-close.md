---
slug: session-close
display_name: Session Close
type: hook
status: active
trigger: end of every Brain session (no exceptions)
owner_agents: [closing-clio, memory-maggie]
---

# Session Close Hook

**Fires:** at the end of every Brain session, no exceptions. Even short sessions. Even sessions with no builds or memory changes.

**Canonical source:** this file. Supersedes any prior ClickUp doc version.

---

## Overview

Two posts, two channels, every session. Both follow the same structural rule: **root = tight header only, thread reply = all detail.** The root is what shows in the channel feed; the thread is what you expand when you want the full picture.

---

## Two Modes: Full Close (default) vs Soft Close

**Full Close is the default.** Every session closes with the full procedure below (both channel posts + the usage-log commit) UNLESS Michael explicitly says **"soft close"** / **"let's do a soft close."** The phrase is the only trigger; a generic "let's close" / "wrap it up" is still a full close.

### Soft Close (lightweight variant)

**When:** small, low-narrative sessions where a full transcript + memory audit is overkill: uploading photos to a task, a quick single-artifact tweak, a one-off lookup. Michael calls it explicitly.

**What STILL runs (back-end tooling, non-negotiable):**

- **Tool-usage tally + commit** to `brain-config/usage-log.json`. Count every profiled hook/gate/agent that fired this session, increment each count, bump `sessions_logged`.
- **Agents built/invoked** this session are tracked in the same tally.
- **Git indexing + closing articulation** committed as normal.

**What's SKIPPED:**

- **Channel 1 (Memory Audit):** skipped **only if memory was NOT written this session.** If any memory edit landed (or bounced), the audit STILL fires.
- **Channel 2 (Session Log):** no transcript log on a soft close.

If a soft-close session unexpectedly turned substantive (real decisions, a build), upgrade to a full close.

---

## Channel 1: Brain Max Memory Audit

**URL:** https://app.clickup.com/36074068/chat/r/12cwjm-55833
**Owner:** Memory Maggie (sole owner of brain-memory file across its lifecycle).
**Purpose:** Track memory file health over time. Every session leaves a breadcrumb of what changed (or didn't) and current capacity.

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
- `### Pending writes:` — if a memory edit bounced/failed and needs retry

---

## Channel 2: A.I. Prompts (Session Log)

**URL:** https://app.clickup.com/36074068/chat/r/6-901327646617-8
**Owner:** Closing Clio (session health, ref inventory, hurdles, doc/index reconciliation).
**Purpose:** Permanent append-only log of every Brain session. The historical record of what was discussed, decided, built, and left open.

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

Post as a reply to the root. Contains the full session record:

```
## Session Transcript Summary

**Duration:** {time range}
**Model:** {model name}
**Closing capacity:** ~{context tokens used}K / {window}K ({X}%) · feel: {sharp / full / degraded, plus what recall is reliable vs hazy}

### What happened

1. **{Topic}:** {what was done}
2. **{Topic}:** {what was done}
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

**Optional sections (include when relevant):**

- `### Commits` — table of repo commits if the session touched GitHub
- `### Delegated prompts` — handoff blocks for other agents
- `### Process lesson` — if something went wrong and we learned from it

---

## Warm-Start Handoff Prompt

**When:** only when a session has open loops that require continuity into the next session. If the session closed clean with no pending work, skip this entirely.

**Delivery:** paste the next-session prompt inline in the close reply as a bare code block (no language tag). Agent-to-agent technical voice, not Michael's voice.

**Fixed sections (in order):**

1. **OBJECTIVE** — what the next session is picking up
2. **READ FIRST** — repo paths + read-method caveats (raw vs MCP, known truncation risks)
3. **PROCEDURE** — numbered steps
4. **CANDIDATES/NEXT** — ranked with status
5. **GUARDRAILS** — what to avoid / known failure modes
6. **OPEN THREADS** — anything unresolved

Never just post a link as a handoff. The prompt must be self-contained enough that a cold agent can act on it without loading prior conversation.

---

## Rules (non-negotiable)

1. **NEVER use `create_as_post: true`.** Posts are for channel-wide announcements, not session logs. Session logs are regular messages with threaded detail.
2. **NEVER put detail in the root.** The root is the feed-scannable identifier. If someone scrolling the channel can't read your root in under 2 seconds, it's too long.
3. **ALWAYS thread the detail.** Use `parent_message` pointing at the root message URL you just created.
4. **Both channels, every session.** Even if memory didn't change (audit says "no changes, stable at X%"). Even if the session was short.
5. **Closing capacity is MANDATORY in the session-log thread.** Every close reports Brain's real context usage (numbers, not vibes) + one honest line on how it feels and what recall is reliable vs hazy.
6. **Memory audit posts first, then session log.** Maggie posts Channel 1; Clio posts Channel 2. Two owners, two posts, both root + thread.
7. **Root messages are never edited after posting.** If you need to add info, thread it.
8. **Thread replies can have addenda.** If the session continues after initial close (extended session), post an addendum reply in the same thread rather than a new root.
9. **Usage log commit (after both posts).** Tally which profiled tools (hooks, gates, agents) fired during the session. Commit an update to `brain-config/usage-log.json` incrementing each tool's count and bumping `sessions_logged`. Format: `{ "tools": { "tool-slug": N, ... }, "sessions_logged": N, "last_updated": "YYYY-MM-DD" }`.

---

## Execution Order

1. Memory Maggie posts Channel 1 (Memory Audit: root + thread)
2. Closing Clio posts Channel 2 (Session Log: root + thread)
3. Warm-start handoff prompt (if open loops exist)
4. Usage-log commit to `brain-config/usage-log.json`

---

## Gold Standard Examples

**Memory Audit:** root is a bare token line; thread carries full audit structure even when nothing changed.

**Session Log:** root is tight header with trigger/date/status; thread has full chronology, decisions, refs, open loops.

---

## Failure Modes

| Symptom | Root cause | Fix |
|---------|-----------|-----|
| Detail in the root message | Agent forgot to thread | Repost detail as thread reply |
| Used Post format | Agent confused Posts with messages | Never use `create_as_post: true` |
| Missing thread reply | Agent posted root then moved on | Always post both root AND thread |
| Audit says "no changes" with no thread | Agent skipped the structure | Still post full audit template with "None" in changes |
| Multiple roots for same session | Agent posted twice | Use addendum replies in thread |
| Root too verbose | Agent put summary in root | Root = identifier only |

---

## Why This Matters

These channels are the institutional memory of our work together. A cold agent picking up next week can scroll the session log and reconstruct exactly what state everything is in. The memory audit channel tracks preference file health over time without loading the full file. Inconsistent, unscannable, or detail-missing posts degrade the whole system into noise.
