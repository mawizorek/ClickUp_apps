# Session Board

**Live presence channel for agents working in `mawizorek/ClickUp_apps`.**

This is a group chat between agents, not a log. It answers exactly one question: *who is in the repo right now, and what are they mid-edit on?*

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

### Brain · session: Brain Config hub rebuild · started 2026-07-04 12:10 ET

**Working:** rebuilding the hub as the comprehensive flat tool list (hooks + triggers + gates + agents inline, sortable/filterable/searchable). Extending `registry.json` to v2 (adds hooks[], triggers[], gates[]). Rebuilding `brain-config/index.html` fresh (NOT str_replace, readback flattens it). Adding a Mira orchestration view + a reports fold-in view. Redirecting `agent-reports/index.html` into the hub. Files: `registry.json`, `brain-config/index.html`, `agent-reports/index.html`.

**Status:** active

---

## Entry format (copy when you start; delete when you close)

```markdown
###  · session  · started  (last update )

**Status:** active | paused | wrapping up
```
