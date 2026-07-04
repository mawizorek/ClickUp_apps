# Session Board

**This is the live presence channel for agents working in `mawizorek/ClickUp_apps`.** Think of it as a group chat where everyone posts what they're currently touching. It is NOT a to-do list (that's `open-thread.md`) and NOT version history (that's git). It answers one question: *who is in the repo right now, and what are they in the middle of?*

The point is to stop the "oh yeah, I had another agent on that, you may see some changes" conversation from having to happen out-of-band. If Brain, Recon Renata, Patch Penelope, or any other agent is mid-edit on a file, that fact lives here in real time so the next agent reads it before they touch the same thing.

---

## How to use it (the rule)

**Read this file immediately before any git-touching operation, and update your own entry immediately after.** This is a pre-write step in the same slot as Commit Pre-Flight, not a session-open check. Move quickly in and out: fetch, read, post/refresh your line, get back to work. The goal is to minimize the window where your presence info is stale.

1. **Before you write anything to the repo:** pull this file fresh. Scan the Active section. If another agent's entry says they're editing a file you're about to touch, hold off, coordinate, or work somewhere else until their entry clears. This is advisory, not a hard lock: it won't prevent a race, but it tells you when one is likely so you can avoid it.
2. **When you start work:** add or update your entry under Active with what you're doing and which files/areas you expect to touch. Be as detailed as is useful. A future agent reading your line should understand your intent, not just your filenames.
3. **As your work evolves:** refresh your entry so it reflects what you're actually touching now, not what you planned twenty minutes ago.
4. **On session close:** remove your entry (or move a durable follow-up to `open-thread.md`). A stale presence line is worse than none, it makes agents dodge files nobody's actually on.

**Collision reality:** even with the board, two writes racing the same branch can throw a non-fast-forward. That's expected. Fetch a fresh blob SHA right before each write and accept last-writer-wins. The board reduces overlap; it doesn't eliminate it.

**Note on this file itself:** because everyone reads AND overwrites it constantly, it's the one file most likely to collide. Keep edits tiny and fast. If your update to the board bounces with a non-fast-forward, just re-fetch and retry, don't hold a lock on it.

---

## Active

### Brain · session 0704a · started 2026-07-04 ~01:45 EDT (last update 02:15 EDT)

Working with Michael on **agent-structure hardening** in `brain-config/`. What I've touched this session, all on `main`, all committed:

- **`agents/workshop-wes.md`** — rewrote with a front-matter identity block (`slug` / `display_name` / `nicknames` / `role` / `accent`). The `slug` is now the permanent identity and equals the filename; renames change `display_name` only. This is the new naming standard for all agent profiles, so if you're creating or renaming an agent, follow this pattern and read the Tool Authoring Guidebook first.
- **Deleted orphans `agents/red-rhett.md` and `agents/repo-renata.md`** — these were superseded by `workshop-wes.md` and `recon-renata.md` respectively. If you have a stale pointer to either, update it. The live files are `workshop-wes.md` and `recon-renata.md`.
- **`open-thread.md`** — appended a migration item flagging every surface that still hand-copies agent names (Toolkit doc roster, `index.html` NICKNAMES map, per-agent report folders) so they can be repointed to read from profile headers.
- **This file (`session-board.md`)** — just created it. That's this.

Also edited two ClickUp docs (outside the repo, FYI not git): the AI Toolkit index (roster + trigger table now point at the correct current agent slugs) and the Tool Authoring Guidebook (added the immutable-slug naming rule).

**Heads-up for other agents:** `brain-config/index.html` is 37KB, over the ~30KB read/write cap. It still has a hard-coded NICKNAMES map and a stale `repo-renata.md` pointer, but I did NOT edit it, it needs a UI upload or blob-SHA path. Leave it alone unless you're equipped to handle the over-cap write safely. Status: **active**, wrapping up this session shortly.

---

## Format reference

```markdown
### <AgentName> · session <id> · started <date time EDT> (last update <time>)

<A few sentences: what you're working on and why, which files/areas you're
touching, anything another agent should know before they edit near you.
Be as detailed as is useful, this is a conversation, not a status code.>

**Status:** active | paused | wrapping up
```
