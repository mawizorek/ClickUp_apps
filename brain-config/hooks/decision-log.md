# Decision Log Hook (repo-wide convention, 2026-07-16)

**Fires on:** any session that works in a repo area that has (or should have) a `decision-log.md`. This is a standing behavior, not a one-off. Michael wants these used a lot going forward, from FileMaker apps to ClickUp apps.

## What a decision log is (and isn't)

A `decision-log.md` at the top of an area records **decisions and their reasoning** so an agent entering cold learns *why* things are the way they are. It is deliberately narrow:

- **IS:** decisions, the reasoning behind them, their status (locked/provisional/superseded), and what they supersede.
- **IS NOT:** a changelog (git history owns that), open work (`open-thread.md` / `next-build-spec.md` own that), or a spec (the README / standard owns that).

Keep entries generic, basic, easy to parse. Newest at top. One decision per entry.

## The two rules (automatic)

1. **On ENTER:** when you start work in an area that has a `decision-log.md`, READ it first. It's the fastest way to avoid re-litigating settled calls or contradicting a locked decision.
2. **On DECIDE:** when you make, change, or reverse a real decision in that area, APPEND an entry before you finish the session. A reversal supersedes the prior entry (mark the old one `superseded`, reference it in the new one). Never rewrite history — append.

## Where they live

Top of any area with real decisions: `shared/themes/`, each FileMaker app (`filemaker/<app>/`), each ClickUp app (`<app-slug>/`), `brain-config/`, etc. If an area clearly warrants one and doesn't have it yet, create it (seed it from the decisions already visible in that area's docs + git history). Reference implementation: `shared/themes/decision-log.md`.

## Entry shape (identical everywhere)

```
## YYYY-MM-DD · <short title>
**Decision:** <what was decided, one or two lines>
**Why:** <the reasoning / what problem it solves>
**Status:** locked | provisional | superseded
**Supersedes:** <prior entry, if any>
```

## Relationship to other trails (don't duplicate)

- **git history** = what changed, when (changelog).
- **`open-thread.md`** = pending/unfinished work across sessions.
- **`next-build-spec.md`** = the contract for the next build of an app.
- **`decision-log.md`** = why the settled calls were made. The durable "why" layer the others don't carry.

When the same fact would fit two of these, put the *decision + reasoning* in the log and a one-line pointer elsewhere; don't stack the full text in both.
