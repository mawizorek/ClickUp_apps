# Routines Viewer — TOMBSTONE

> # 🗑️ APP DELETED — 2026-07-27 (PR #562)
>
> **`routines/index.html` no longer exists.** There is no Routines Viewer, no Pages URL, no renderer. `routines/schedule.md` is the single source of truth for the routine schedule and is meant to be read directly by a human.
>
> **This file is kept as the record of why**, and as the defect history for anyone tempted to build it again. It is not a build spec anymore. Nothing here is a live instruction.

---

## Why it was deleted

**Michael, 2026-07-27:** *"seems like this schedule app can be deleted and more neatly connected to Ricky as a markdown. i don't need the fancy app as long as the schedule is findable and legible."* Then, on the question that decided it — *how do you check staleness when you're not in a session?* — **"no i don't open the routines url ever. and it's more important to keep single source of truth for the schedule."**

**The structural reason: the app and Ricky's invoked triage answered the same question off the same two files** (`schedule.md` + `last-run/*.txt`). Two claimants on one truth — the same rot that retired `registry.json` and got `data-refresh-log.json` deleted.

**And the part worth carrying forward: nobody made a mistake.** The viewer was correct and useful while a timer ran routines unattended, because a passive glance was then the only way to see status without asking. **Retiring the scheduler (2026-07-26) is what turned a healthy app into a duplicate — overnight, silently, with no defect and no commit.**

> ⚠️ **The generalizable warning: a capability change UPSTREAM can orphan a downstream surface, and every duplicate-check we own runs at CREATION time.** None of them re-run when the world changes. When a capability is retired, ask what existed *only* to compensate for it.

## What was lost, recorded honestly

1. **The glance** — a URL openable on a phone with no agent, no session, no tokens. Accepted: Michael never opened it.
2. **The arithmetic** — the raw file says `2026-07-15` + "every Wednesday"; the app said **`Overdue 5d`**. Now a human does that subtraction, or asks Ricky.
3. **The join** — stamps live in one file per routine, so "is anything stale?" means opening this doc plus one file per routine. **This was the strongest keep-argument and it was not refuted, only outweighed.** It is now tracked as an open question on `schedule.md` (fold stamps back into the table?) — with the caveat that doing so revives the shared-file stamp race unless the SHA-checked-write mitigation is actually TESTED.

## What was gained

**`schedule.md` stopped being an API.** The four columns, the `Routine file` header cell, day names parsed out of the cadence text, and the literal phrase `through YYYY-MM-DD` were all load-bearing on a parser. **That constraint is gone**, and the table has been rewritten for human reading.

---

## Defect history (why a renderer over a markdown table kept lying)

All six were fixed in v2 (PR #560) hours before the app was deleted. Kept because **the pattern is the lesson**: *every one was caused by a **doc** edit that was correct in isolation.* Nobody broke the app; the table changed shape and the renderer quietly disagreed. **Two ran wrong for three weeks each, because a wrong render looks exactly like a right one.**

> **The rule they produced, worth inheriting anywhere: derive, don't declare — and never render a guess as a fact.** `never` vs unreadable, overdue vs never-run, retired vs active — each pair must stay visibly distinct. This has an agent-side twin already written into `schedule.md`'s due-math.

**D1 — the header card lied.** It hardcoded a wake timetable and printed *"Ricky wakes once daily at 06:00 ET"* after the scheduler was retired. It had *also* drifted from `schedule.md` before that (card: `06:00/15:00/21:00/03:00`; doc: `06:00/12:00/16:00/00:00`) — two hardcoded timetables, neither reading the other.

**D2 — every routine showed "Last run: never" from 2026-07-05 to 2026-07-27.** When stamps moved to per-routine files, column 4 stopped being a timestamp and became a path; the parser kept calling `new Date()` on it, got `NaN`, fell through to `never`. **Three weeks of a silently wrong core field in the app whose entire purpose was showing last-run** — failing in the worst direction, since `never` reads as "this never worked" when the truth was "ran Jul 15."

**D3 — F1's day strip showed 2 days for a 4-day routine.** `Thu–Sun` contains the tokens `thu` and `sun`, but not `fri` or `sat`.

**D4 — retirement was inferred from prose.** A `through YYYY-MM-DD` regex over a free-text notes cell. It nearly fired on 2026-07-26: rewriting that sentence more cleanly would have silently **un-retired** a dead routine. *(Fix note worth keeping: the first patch sniffed the word "retired" out of the notes instead — cut on review, because "replaces the retired X routine" would kill a live row. **The fix for prose-sniffing is not more prose-sniffing.**)*

**D5 — clock vocabulary** (`Due today`, `Active cycle`) for a system with no clock.

**D6 — the fallback rendered fake data.** On any fetch failure it silently displayed hardcoded sample rows as real, still describing the World Cup's 4×/day cadence. **A status board that invents plausible rows when it cannot reach its source is a lie generator.**

## Estimate miss, kept on the record

The v2 spec projected **+1.2KB**; the actual change was **+4.7KB** (16,094 → 20,802 bytes), ~4× off, pushing the file well over the 15KB split line. A `source/` split was queued, then frozen, then made moot by the deletion. **Lesson that outlives the app: re-check a size estimate at commit time, not just at spec time** — commit time is exactly when a budget is easiest to skip.
