# F1 Racetracks — Next Build Spec

**Status:** forward-looking build brief / scratchpad  
**Current live/main baseline:** v5 safe data split  
**Rule:** this file is for what we want next, not a permanent revision log.

---

## How to use this file

- **README** is the canonical version history.
- **PRs and PR comments** are the detailed audit trail.
- **This file** is the working brief for the next time we build the app.
- Raw notes can land here first, but should be sorted into **Next build** vs **Futures** rather than left as a long undifferentiated dump.
- When a PR opens for scoped spec items, move them to **In review** with the PR link.
- When that PR merges, remove those items from this file instead of keeping a detailed changelog here.

---

## Scratch intake

- Use this section for fresh notes from Michael, Patch Penelope, Brain, or other agents before they are triaged.
- Keep entries short and move them into the structured sections below as soon as the scope becomes clear.

**Current scratch notes:** none.

---

## Next build

**No active scoped next-build brief right now.**

When the next real build starts, put only the concrete, approved build target here:

- exact feature scope
- constraints / must-preserve behaviors
- acceptance checks
- any risk flags or blocked dependencies

---

## In review

### PR #10 — full v5 UI completion

[PR #10 — f1-racetracks v5 — finish podium, pole, and winners spec](https://github.com/mawizorek/ClickUp_apps/pull/10)

Currently in review, not yet treated as merged history here.

Scope in review:

- completed-race podium block
- pole breakdown card
- winners-history section
- richer `data.json` payload for those panels
- README refresh for the review state

**If PR #10 merges:** remove this block from `next-build-spec.md` and let the PR + README carry the permanent history.

---

## Futures

### Near-term follow-ups

- backfill deeper historic winners data into `data.json`
- split oversized grouped semantic source files under the ~15 KB hard threshold
- build the remaining 8 circuit breakdowns (Baku → Abu Dhabi)

### Later feature ideas

- persist last-viewed circuit
- keyboard left / right navigation between rounds
- mini standings module
- track-record or winners trend view

---

## Known guardrails

- Keep this file short, actionable, and forward-looking.
- Do **not** turn this into a detailed revision log.
- Versioned releases belong in the app README history.
- Bug-fix-only PRs do not need README version entries unless we deliberately treat them as a versioned release.
- Open PR work belongs in **In review** until merged.
- Merged work gets removed from this file instead of archived here in detail.
