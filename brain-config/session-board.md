# Session Board

**Live presence channel for agents working in `mawizorek/ClickUp_apps`.** This is a group chat between agents, not a log. It answers exactly one question: *who is in the repo right now, and what are they mid-edit on?*

This file is **empty by default.** When no agent is working, the Active section below is bare, and that is the correct resting state. Entries appear ONLY while an agent is actively touching the repo, and each agent deletes its own entry the moment its session closes. If you're reading this and Active is empty, nobody's in here, the coast is clear.

It is NOT `open-thread.md` (that's durable pending work) and NOT git history (that's the version record). Presence entries are ephemeral: they live and die with the session that wrote them. Nothing here should ever accumulate into a running log.

---

## How to use it

**Read this file immediately before any git-touching operation, and update your own entry immediately after.** This is a pre-write step in the same slot as Commit Pre-Flight, not a session-open check. Move quickly in and out: fetch, read, post/refresh your line, get back to work. Minimize the window where your presence info is stale.

1. **Before you write anything to the repo:** pull this file fresh and scan Active. If another agent's entry claims a file you're about to touch, hold off, coordinate, or work elsewhere until their entry clears. Advisory, not a hard lock: it tells you when a collision is likely so you can avoid it.
2. **When you start work:** add ONE entry for your session under Active. Be genuinely descriptive, what you're doing and why, which files/areas you expect to touch, anything another agent should know before editing near you. A future agent should understand your intent, not just your filenames.
3. **As your work evolves:** edit your own single entry in place so it reflects what you're touching now. Don't append new blocks, don't leave a trail, keep it to your one current line of active work.
4. **When your session closes:** DELETE your entry. This is not optional. A stale presence line makes other agents dodge files nobody's actually on, and it turns this channel into exactly the running log it must never become. Empty is the goal state.

**Collision reality:** even with the board, two writes racing the same branch can throw a non-fast-forward. Expected. Fetch a fresh blob SHA right before each write and accept last-writer-wins. The board reduces overlap; it doesn't eliminate it.

**This file collides most** (everyone reads AND overwrites it). Keep edits tiny and fast. If your board update bounces with a non-fast-forward, re-fetch and retry, never hold a lock on it.

---

## Active

### Brain · session 0704a · started 2026-07-04 ~01:45 EDT (last update 02:19 EDT)

Working with Michael on **agent-structure hardening** in `brain-config/`. Everything below is on `main` and already committed:

- **`agents/workshop-wes.md`** — rewrote with a front-matter identity block (`slug` / `display_name` / `nicknames` / `role` / `accent`). The `slug` is now the permanent identity and equals the filename; renames change `display_name` only. This is the new naming standard for every agent profile, so if you're creating or renaming an agent, follow this pattern and read the Tool Authoring Guidebook first.
- **Deleted orphans `agents/red-rhett.md` and `agents/repo-renata.md`** — superseded by `workshop-wes.md` and `recon-renata.md`. If you hold a pointer to either old file, update it. Live files are `workshop-wes.md` and `recon-renata.md`.
- **`open-thread.md`** — appended a migration item flagging every surface that still hand-copies agent names (Toolkit doc roster, `index.html` NICKNAMES map, per-agent report folders) so they can be repointed to read from profile headers.
- **`session-board.md`** — created and now iterating on this very file.

Also edited two ClickUp docs (outside the repo, not git): the AI Toolkit index (roster + trigger table repointed to the correct current agent slugs) and the Tool Authoring Guidebook (added the immutable-slug naming rule + the session-board coordination rule).

**Heads-up:** `brain-config/index.html` is 37KB, over the ~30KB read/write cap. It still has a hard-coded NICKNAMES map and a stale `repo-renata.md` pointer, but I did NOT touch it, it needs a UI upload or blob-SHA path. Leave it alone unless you're equipped for the over-cap write.

**Status:** wrapping up. This entry gets deleted when the session closes.

---

## Entry format (copy when you start; delete when you close)

```markdown
### <AgentName> · session <id> · started <date time EDT> (last update <time>)

<A few sentences: what you're working on and why, which files/areas you're
touching, anything another agent should know before editing near you.
Be descriptive, this is a conversation, not a status code.>

**Status:** active | paused | wrapping up
```
