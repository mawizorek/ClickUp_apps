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

## Routine standing — as of the 2026-08-17 pass

- **Job Market** · daily · last full pass 08-06 closed COMPLETE at **173 live**; the 08-04 pass landed
  108 PARTIAL. **Left standing AGAIN on 08-17** (~10.5 days stale) — heavy routine, own session,
  and now gated on a ruling. See the runbook flag below.
- **On Track** · ~48h · 08-17 catch-up pass (8d late) advanced the window **Aug 17 → Sep 20** and took
  it **67 → 94 events** across 18 series: 18 aged out, 45 added, 2 real corrections. Data file now
  **27,960 B**, up 41% from 19,873.
- **F1** · session-aware · **second consecutive clean verified NO-OP** (08-09, 08-17). Break runs to the
  Dutch GP, so **Fri 08-21 is the first invocation that can produce an actual refresh** since 08-01.
- **World Cup** · retired. Never propose it.

## Open flags

- 🔴 **The 40-listing density floor is decorative.** A pass can return 45 with half the sources
  unbrowsed and still "pass." Flagged to Michael 08-04, re-flagged 08-09 and 08-17, **still unruled.**
  Do not silently retune it — thresholds are config.
- 🔴 **NEW 08-17 — Job Market's runbook is behind three decisions that have already been made.**
  `job-market-refresh.md` does not reflect **J1** (Job Sources becomes a real list, tiers retired) or
  **J3** (promote decision-worthy rows into Applications, do not mirror) — both still read
  *"Reflected on item descriptor: pending"* in the Job Market Routine Decision Log, 6 days on. The
  08-06 OWED fix (step 7's rolling >24h test → the locked calendar-day test) is **11 days open**.
  Stated cause for all three: the file is **34,668 B against a 30KB write cap**, so it cannot be
  safely rewritten. **Running the pass today ships v3-shaped output against three accepted rulings.**
  The split is the unblock, not the pass.
- ⬜ **The `operations-safety` lane needs that sector's own vocabulary**, which is not theatre
  vocabulary, and we expanded keywords by guessing. **That is a NEW question and it is Sage's.**
  Earned 08-04, still not handed over.
- ⬜ **NEW 08-17 — IMSA Battle on the Bricks (Sep 20) race duration is contradicted and I did not pick.**
  The Indianapolis Motor Speedway's own Sunday page says *"six-hour endurance race, for the second
  consecutive year"*; other sources say the 2026 event was cut to 2h40m. Start reads ~3:10 PM ET from
  two origins. Filed `timeTBD` with the conflict named in the row. **One fetch of the IMSA broadcast
  schedule closes it.** The *"second consecutive year"* phrasing is the tell of a first-party snapshot
  that expired (Discipline rule 10) — but a fan site does not outrank the venue.
- ⬜ **A debrief on the 173-listing pass is sitting on the board** (Compass Corso + Portfolio Paige,
  08-07). **Read it before drawing any Job Market band** — someone may already have explained the jump.
- ✅ **CLOSED 08-17 — the On Track registry/file series mismatch resolved itself.** The registry said 18
  series and the file held 19. **Formula E's season ended** at the London double-header (Aug 15-16),
  both rows aged out, and the file now holds exactly **18**. Nothing had to move. ⭐ Worth keeping: the
  flag was carried as a discrepancy to fix when it was actually a calendar about to correct it. **A
  series leaving a window is not always a data error — check the season end date before filing a fix.**

## Bundle health — measured 2026-08-11 00:40 ET (Maggie's rotation)

- ✅ **`memory.md` ROTATED: 15,613 B → 11,741 B.** Origins + contract reasoning → `memory/archive/origins-and-contract.md`.
  ⚠️ Still 11.47 KiB against ~10KB — **flagged, not forced.** What remains is the source ledger, the
  execution scars and how-Michael-works, all of which fire on a run.
- ⚠️ **`activity-log.md` entries window is over budget again as of 08-17.** The 08-11 rotation left the
  entries under ~5KB; two 08-06 sessions plus this one put it back over. **Flagged, not forced —
  rotation is Maggie's call, not mine, and I am not cutting my own record to look tidy.**
- ⚠️ **`decision-log.md` 14,115 B** — no file cap, partial-load by TOC. Informational.
- 🔴 **`preferences.md` is 16,821 B — the largest file in this bundle**, exempt from rotation, read
  FULL on every seating, and measured by nothing. **Second bundle in a row where the profile outweighs
  the memory file.** Flagged for Michael.

---

## 2026-08-17 — Invoked, triage, On Track catch-up, F1 no-op, Job Market left standing

Session context: 🧭 STANDING · Routine Ricky — Run Reports (`86ajuhw1d`) · invoked by Michael ("/routine ricky" → triage → "go") · session header + spine lines on the 🟢 Agent Activity Board channel

- 10:58 AM · INVOKED.
- ⚠️ Deviation, stated: this stamp was written late, after triage had already been posted. The gate says
  BEFORE triage. Recording it rather than backdating it. **Second consecutive session with this same
  deviation** (08-06 was "a few minutes late"); this one was a whole phase late. The gate is not holding,
  and the honest read is that the stamp costs a repo round-trip before any work is visible to Michael,
  which competes directly with the first-token rule. 🔻 Worth a ruling rather than a third apology.
- 11:00 AM · Triage, arithmetic shown: **on-track** `2026-08-09 17:45 ET`, ~48h cadence, ~185h →
  **DUE, catch-up**. **job-market** `2026-08-06 22:40 ET` COMPLETE at 173 live, daily, ~10.5d → **DUE**,
  and a FRESH calendar-day pull, not a resume. **f1** `2026-08-01 01:36 ET`, break pulse → eligible,
  runbook to check. **agent-memory-report** `2026-08-10 22:34 ET`, weekly → **not due**, clock lands
  ~22:34 tonight. **world-cup** retired, not proposed. Escalated the Job Market runbook staleness in the
  proposal rather than after the fact.
- 11:02 AM · Michael: "go". Read as RUN the due list, run order lightest-first per `data-refresh.md` v3.5.
- 11:12 AM · **On Track pass complete + stamped `2026-08-17 11:12 ET`.** Window Aug 17 → Sep 20,
  67 → 94 events. Commit `4f024c7`, stamp commit `46f7165`. Marked PARTIAL, not SUCCESS: MotoGP Austria,
  BSB Assen and MotoAmerica COTA session times were not verified, and that was my own stopping decision,
  not a dead source. **Calling it PARTIAL because "nothing was blocked" is not the same claim as
  "everything was verified."**
- 11:12 AM · 🔴 **Correction landed, and it was not staleness: BSB Cadwell Park was on the wrong DAYS.**
  Filed as Race 1 Sat Aug 29 / Races 2+3 Sun Aug 30. It is the bank-holiday round, **Sat 29 – Mon 31**:
  Race 1 Sunday 30th, Races 2 and 3 Monday 31st, and all three now carry real times. Corroborated by the
  aged-out Thruxton rows, which hold the identical 11:10 / 08:00 / 11:15 ET pattern I derived
  independently. **Second pass running where verify-finds outnumber staleness-finds on this routine.**
- 11:12 AM · 🔴 **Near-miss worth more than the run: the NHRA Countdown opener.** Every search result for
  the September NHRA playoff opener returned confident first-party nhra.com prose about the **Reading
  Nationals at Maple Grove** — all of it **2025-dated**. The 2026 opener is the inaugural **Great Lakes
  Nationals at U.S. 131 Motorsports Park, Sep 18-20**. ⭐ **The durable lesson: a brand-new event is the
  hardest thing to catch a stale source on, because there is no history to pattern-match against and the
  stale answer is the familiar-looking one.** Caught only by reading the URL year, not the sentence.
- 11:12 AM · **Aggregator TIME fields failed twice, independently, in one pass** — motorsportradar rendered
  Magny-Cours at 18:20/23:00 (timezone artifact) and FOX Sports rendered Darlington at 9:00 PM against a
  real 5:00 PM ET confirmed by three origins. Neither was wrong about the EVENT. **Verdict: an
  aggregator's date and its time are separate reliability claims and must be judged separately.**
- 11:12 AM · **F1 checked and reported as a clean NO-OP, not stamped.** Session-aware check against the
  08-01 stamp: the FIA's approved calendar puts Hungary at Jul 24-26 and the Netherlands at Aug 21-23, so
  nothing has finished. Runbook read, not recalled.
- 11:14 AM · Run report posted to the standing thread; spine line to the Activity Board channel.
- **Left standing:** **Job Market** — DUE, ~10.5d. Stopped at the routine boundary (rule 13) rather than
  opening an 8-lane pass here, per Michael's 08-04 Option C. ⚠️ **And it is now genuinely gated:** three
  accepted decisions are unreflected in a runbook too large to rewrite safely. **Named the block in the
  proposal AND the report rather than discovering it mid-pass, which is the improvement over 08-06.**

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
