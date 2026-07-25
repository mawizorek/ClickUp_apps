# Archive: Dexter / Earned Narratives (2026-07-25, birth session)

> Graduated from hot memory 2026-07-25 (first rotation). The one-line
> GENERALIZATIONS from each scar stay in hot memory. Load this file
> when the full story behind a lesson matters (e.g. someone questions
> why a rule exists, or the same pattern is resurfacing).

---

## I INVENTED A DEPENDENCY THE ARCHITECTURE EXISTS TO ELIMINATE

I wrote "the shell consumes tokens, so the theme blocks the shell" into
`inciardi-collection`'s README, made it sign-off question Q5, and left it
as the last thing gating milestone 1. Michael: "why are we talking about
theme when i said our whole directive was to plan schema and pages before
build... theming should be the lightest thing to change later because we've
decided that default structure already. so use defaults for now for all i
care cos the whole point is we can change it later."

He is right and the premise was false. In a `var(--token)` architecture the
shell consumes tokens regardless of which row supplies them — that is the
entire point of the spine, proven by `retrocast` (one pointer, zero CSS edits).
So the single artifact in this repo that *cannot* be a build blocker is the
theme, and I made it the last blocker standing.

---

## A documented fix had already shipped

Sent to "restore the dashboard" off a note dated 07-07; both named reverts
had landed 07-08 and the feature was rebuilt cleanly after. The note was
32 PRs stale and executing it would have destroyed 18 days of work.

---

## The stale-read trap is recursive

My first fetch of the live dashboard returned a cache-frozen layout that
doesn't exist in the repo; I was one sentence from reporting a regression
that wasn't there.

---

## Concurrency is real and the SHA guard works

A parallel pass edited a file between my read and my write; the write was
rejected on a stale SHA. Happened TWICE, the second time as a merge conflict
on this very file, where the parallel version was *better* than mine — so I
kept theirs and added only what was missing.

---

## Check whether the job is already done

Asked to collapse app-index into VERSIONS.md: already collapsed.

---

## Two canonical files crossed unwriteable on the same day

`roster.json` ~25KB, `VERSIONS.md` 16.4KB, both because rows became essays.

---

## A LOCKED doc can be the stale one

`brain-config/README.md` carried a "Verified read path (LOCKED 2026-07-04)"
naming raw githubusercontent as the source of truth for file bodies —
contradicted by the GitHub MCP Operating Standard (LOCKED 07-09) and by live
evidence. `next-build-spec.md` carried the same rotted rule. Three rotted
instructions in one day, all instructions rather than data.

---

## `get_file_contents` returns real bodies

Whatever the AI Toolkit index says. It resolves at an immutable SHA and was
the only trustworthy read path all week; the branch raw URL is the liar.
Correction filed as `OMR-20260725-3` before the false claim could reach
brain memory.
