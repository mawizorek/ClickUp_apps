# Ricky — Activity Log

> **LIVE per-reply session record.** Start the entry at session Commit, append one line per
> qualifying reply (delivers content, answers a question, takes action, makes a decision, or issues a correction) as you go. At close it is already done — no batch reconstruction.
> Newest session on top, append-only. **Budget ~4-5KB for the ENTRIES ONLY** (sliding window);
> the LIVE STATE block sits OUTSIDE that window and is never rotated (`super-agent-base.md` §4a;
> `hooks/memory-rotation.md` as corrected 2026-08-10). Quarterly cold archives → `activity-log/YYYY-QN.md`.
>
> Format law: `_shared/super-agent-base.md` → Per-response logging mandate (LOCKED 2026-07-25).
>
> **🚨 HARD GATE (added 2026-08-03, Michael):** First line of every new session entry is the INVOCATION STAMP:
> `- HH:MM XM · INVOKED.` — written BEFORE triage, BEFORE reading schedule, BEFORE any work.
> The stamp IS proof of life. Without it, the next wake reads as first-time.
>
> 🚫 **NEVER write a ClickUp URL into this file, or any repo file** (learned the hard way 2026-08-06, below).
> Every ClickUp URL that passes through an agent's context is rewritten to an internal placeholder, so an agent
> cannot see or reproduce the real one. **Name the task and give its ID in backticks.** A bare ID is ugly; a
> link to a placeholder host is dead.
>
> 🗄️ **Cold archive:** `activity-log/2026-Q3.md` — the build session plus the 08-01 → 08-05 runs
> rotated there 2026-08-11 by Maggie. Whole entries moved, nothing condensed, nothing dropped.

---

# 🔴 LIVE STATE — read this FIRST on any pickup

> Permanent fixture, OUTSIDE the sliding window. Every number carries the moment it was measured.
> **Anything older than the last close gets RE-QUERIED, never reused.**
>
> ⚠️ **This block did not exist until 2026-08-11**, and most of what is in it was sitting in
> `memory.md` — where nothing re-reads it for expiry. Moved by Maggie's §4a sweep.
> 🔴 **THE STAMPS ARE NOT HERE AND NEVER WILL BE.** `routines/last-run/<routine>.txt` is the only
> home for last-run state, one file per routine, one writer. Anything below is a NOTE about a run,
> not the run's state. **Read the stamp files at triage; never trust a number on this page.**

## Routine standing — as of the 2026-08-09 pass

- **Job Market** · daily · last full pass 08-06 closed COMPLETE at **173 live**; the 08-04 pass landed
  108 PARTIAL. Left standing at a boundary on 08-09 by design (run order: heavy last).
- **On Track** · ~48h · 08-09 pass took the window 70 → **67 events** across ~19 series (5 added,
  8 aged out, 4 corrections).
- **F1** · session-aware · 08-09 was a clean verified NO-OP. Summer break runs to the Dutch GP 08-21,
  so expect no-ops until then.
- **World Cup** · retired. Never propose it.

## Open flags — all four need someone, none are mine to close alone

- 🔴 **The 40-listing density floor is decorative.** A pass can return 45 with half the sources
  unbrowsed and still "pass." Flagged to Michael 08-04, re-flagged 08-09, **still unruled.**
  Do not silently retune it — thresholds are config.
- ⬜ **The `operations-safety` lane needs that sector's own vocabulary**, which is not theatre
  vocabulary, and we expanded keywords by guessing. **That is a NEW question and it is Sage's.**
  Earned 08-04, still not handed over.
- ⬜ **The On Track registry says 18 series; the data file has ~19** (SailGP is in the file and not in
  the registry). Harmless, carried forward, **but one of them should move.**
- ⬜ **A debrief on the 173-listing pass is sitting on the board** (Compass Corso + Portfolio Paige,
  08-07). **Read it before drawing any Job Market band** — someone may already have explained the jump.

## Bundle health — measured 2026-08-11 00:40 ET (Maggie's rotation)

- ✅ **`memory.md` ROTATED: 15,613 B → 11,741 B.** Origins + contract reasoning → `memory/archive/origins-and-contract.md`.
  ⚠️ Still 11.47 KiB against ~10KB — **flagged, not forced.** What remains is the source ledger, the
  execution scars and how-Michael-works, all of which fire on a run.
- ✅ **`activity-log.md` ROTATED: 13,791 B → this file.** Seven sessions moved cold, LIVE STATE added,
  entries now under the ~5KB window.
- ⚠️ **`decision-log.md` 14,115 B** — no file cap, partial-load by TOC. Informational.
- 🔴 **`preferences.md` is 16,821 B — the largest file in this bundle**, exempt from rotation, read
  FULL on every seating, and measured by nothing. **Second bundle in a row where the profile outweighs
  the memory file.** Flagged for Michael.

---

## 2026-08-06 (evening) — Job Market, its own session, FRESH full pull

Session context: 🧭 STANDING · Routine Ricky — Run Reports (`86ajuhw1d`) · invoked by Michael ("/riky - pick this up!!!") · product lands on the standing Job Market thread (`86ajtgbt3`)

- 9:25 PM · INVOKED.
- ⚠️ Deviation, stated: this stamp was written a few minutes late, after the bundle + `routines/schedule.md`
  + all four stamps were read. The gate says BEFORE triage. Recording it rather than backdating it.
- 9:32 PM · Triage, arithmetic shown: **job-market** last stamp `2026-08-04 16:20 ET`, daily cadence, ~53h →
  **DUE, catch-up.** **on-track** `2026-08-06 16:47 ET`, ~48h cadence, ~4.6h old → **current**, next ~Aug 8.
  **f1** `2026-08-01 01:36 ET`, break pulse once/week → next eligible ~Aug 8; session-gated, clean no-op until
  Zandvoort Aug 21. **world-cup** retired, not proposed. **One routine due.**
- 9:32 PM · Resume Scan: **FRESH PASS**, not a resume. The 08-05 08:52 pass died at a role boundary on a
  previous calendar day, so the 08-06 locked fresh-day rule makes it formally unresumable. Orphan to name in
  the report: one `production-manager` role header from 08-05 with no pass summary, and its committed lane data
  (PR #750) — that data stays and gets re-verified as SAME.

---

## 2026-08-06 — Invoked, triage, On Track run, then a locked ruling

Session context: 🧭 STANDING · Routine Ricky — Run Reports (`86ajuhw1d`) · invoked by Michael ("routine ricky time!!!")

- 8:27 AM · INVOKED.
- 8:30 AM · Bundle steeped, `hooks/data-refresh.md` v3.4 read, `routines/schedule.md` + all four stamps read fresh.
- 8:33 AM · Triage: On Track DUE (catch-up), Job Market DUE, F1 not due until ~Aug 8, World Cup retired.
  🔴 **Called Job Market "a RESUME of the parked 08-05 pass" — WRONG.** The 08-05 pass's newest comment was
  ~31h old, past the runbook's own >24h abandoned test, so the correct answer was already FRESH. **The rule
  existed and I did not apply it**; I inferred position from the shape of the story instead of computing it.
- 8:33 AM · Invocation stamp + 08-04/08-05 backfill committed (PR #759).
- 4:38 PM · Michael: proceed. On Track inline, Job Market to its own session.
- 4:46 PM · **On Track pass complete.** 48 → 70 events, window rebuilt Aug 7 → Sep 6. Verify pass found ZERO
  errors in the existing 48. Added MotoGP Aragón (9), F1/F2/F3 Monza (9), IMSA VIR (2), WSBK Magny-Cours (2).
  PR #761.
- 4:47 PM · Stamped `2026-08-06 16:47 ET` (PR #762). Roll-up posted to the standing thread.
- 4:52 PM · 🔴 **Near-miss worth more than the run:** almost "corrected" all six Silverstone MotoGP events by an
  hour off a crash.net EVENT PAGE that disagrees with crash.net's own dated ARTICLE. Three independent origins
  confirmed the file was already right. **A buggy template inside a good source is not a source.**
- 4:52 PM · 🔴 **Bare GitHub Pages URL served a copy a month stale** (version 2026-07-08) while the same URL
  cache-busted served 2026-08-03. Un-busted Pages reads are not evidence. Reported; new version had not
  propagated at report time, flagged for next pass rather than assumed.
- 4:54 PM · **Michael RULED, standard practice for every routine:** *"Don't pick up yesterday's failed attempt.
  Start fresh with a full pull from today... you still need to start fresh today from ground one!"* Calendar-day
  unit, not a rolling interval. Locked into `routines/schedule.md` (PR #763) with the inheritor audit done in the
  same pass (job-market AFFECTED, on-track + f1 COMPLIANT) and the correction above recorded beside it.
- 5:02 PM · 🔴 **Self-inflicted, found while writing that PR: I wrote a placeholder ClickUp URL into THIS FILE**
  during the 8:33 AM commit. The 07-26 entry's `Fleet Build Queue` link became a dead internal placeholder, and
  I even changed its number. Root cause is now a header rule above: **an agent cannot see a real ClickUp URL**,
  so a whole-file rewrite of any repo file containing one silently kills the link. Link replaced with plain
  text; the original is in git history.
  ⚠️ **Same reason the fresh-day rule could not go in `routines/README.md`, which is where it belongs.**
- ⚠️ Deviation, stated: no `session-board.md` presence row. Ran the substitute with a hit rate instead
  (path-filtered `list_commits --since today`, clean, immediately before each write) and no board row claims
  `on-track/**` or `routines/**`. Ledger X1 says we survived on the backstop once; recording rather than
  repeating silently.
- **Left standing:** Job Market — DUE, and now unambiguously a **FRESH full pull**, not a resume. Not attempted
  in this session by design (Michael's 08-04 Option C: heavy routines get their own session).

---

_Older sessions (2026-08-05, 08-04, 08-03 ×2, 08-02, 08-01, 07-26 build) → `activity-log/2026-Q3.md`._
