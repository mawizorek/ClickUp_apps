# Ricky — Activity Log

> **LIVE per-reply session record.** Start the entry at session Commit, append one line per
> qualifying reply (delivers content, answers a question, takes action, makes a decision, or issues a correction) as you go. At close it is already done — no batch reconstruction.
> Newest session on top, append-only. Budget ~4-5KB (sliding window, last 10-15 sessions);
> quarterly cold archives to `activity-log/YYYY-QN.md` per `hooks/memory-rotation.md`.
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
  text; the original URL is unrecoverable from an agent's context and is in git history if anyone wants it.
  ⚠️ **Same reason the fresh-day rule could not go in `routines/README.md`, which is where it belongs.**
- ⚠️ Deviation, stated: no `session-board.md` presence row. Ran the substitute with a hit rate instead
  (path-filtered `list_commits --since today`, clean, immediately before each write) and no board row claims
  `on-track/**` or `routines/**`. Rationale on the run report. Ledger X1 says we survived on the backstop once;
  recording rather than repeating silently.
- **Left standing:** Job Market — DUE, and now unambiguously a **FRESH full pull**, not a resume. Not attempted
  in this session by design (Michael's 08-04 Option C: heavy routines get their own session).

---

## 2026-08-05 — Job Market, aborted at a role boundary (RECONSTRUCTED from the standing thread)

- 8:52 AM · INVOKED (`/ricky refresh`).
- 8:52 AM · Resume Scan: FRESH PASS, nothing to resume. 16h 32m since the 08-04 pass landed.
- ~9:00 AM · job-market-refresh v17.3 — ran 1 of 8 lanes. production-manager: 34 live, +4 new, 0 gone.
  Posted, threaded, committed (PR #750).
- ~9:02 AM · STOPPED at role boundary. Three board defects: Playbill `?category=` served Jan/Feb 2026
  listings (6 months stale); BroadwayWorld `?page=2` returns page 1; OffStageJobs `?department=X&page=2`
  returns page 1. Pagination is a known ceiling on OSJ + BWW via this fetch path.
- ~9:02 AM · ❌ NOT stamped. An aborted loop does not stamp. Roll-up posted to the standing thread.
- 10:10 AM · Second invocation, triage only. **Never answered — On Track went past its threshold unattended.**
- Ledger: BWW recovered after its 08-04 failure, so that was one bad day, not a rotting source — un-degraded.
  The ACG open-searches index is not a liveness check: fetch the search URL, never the index.
- ⚠️ **Under the 08-06 fresh-day rule this pass is now formally unresumable**, which is the right outcome: its
  one committed lane simply gets re-verified by the next full pass.
- Gap: no activity-log entry was written at the time. Backfilled 2026-08-06 from the standing thread.

---

## 2026-08-04 — Job Market, resumed and landed PARTIAL (RECONSTRUCTED from the standing thread)

- 8:56 AM · INVOKED. Triage: Job Market the only routine due.
- 9:43 AM · Job Market pass — 74 live (+6 new), 8 roles swept. Stamped `2026-08-04 09:43 ET`.
  7 of 14 boards reached; the rest carried from the 08-03 sweep.
- ~1:00 PM · Corso + Paige seated in-thread off the pass. Michael flagged that the roll-up read as a loose
  summary; the per-role formatted comments had in fact landed on `86ajtgbt3`. Visibility problem, not compliance.
- 4:20 PM · RESUME of the 13:20 pass — all 8 lanes complete and threaded, 108 live, +24 TSV rows, 0 gone.
  ⚠️ PARTIAL (BWW index failed outright; USITT + StageBoard unswept on the resume half). Product landed on
  every target surface, so it stamped: `2026-08-04 16:20 ET`.
- Ledger (the big one): OffStageJobs department indexes had never been opened by any pass. Three lanes that
  had read 0-4 for weeks jumped to 12, 9 and 4 off one page each. Every prior "thin lane" verdict is void.
  Also: the 13:20 checkpoint comment lied about TSV state — read the state file, never the note about it.
- Gap: no activity-log entry was written at the time. Backfilled 2026-08-06 from the standing thread.

---

## 2026-08-03 (continued) — Job Market full pass

Session context: [RECURRING] Agent Pushes task comment thread · invoked by Michael (second call)

- 3:56 PM · INVOKED. Michael: "pick it up exactly where you left off."
- 4:00 PM · Job Market full 8-lane sweep started. First pass on 4 new lanes (OPS, AUD, DFT, ADM).
- 4:20 PM · Pass complete. 69 live, +7 new, 0 gone. Density floor passed (69 > 40).
- 4:20 PM · TSV committed (SHA 84c8ec8). Friction column added to schema.
- 4:20 PM · Stamped: `2026-08-03 16:20 ET`.
- 4:20 PM · Roll-up posted to Run Reports thread.
- Source notes: Skene Callboard appears retired (editorial-only). Scenic Guild (jobs.scenicguild.org) needs board code for DFT lane. New lanes (OPS, ADM) thin on standard boards, need Indeed/LinkedIn targeted sweeps.

---

## 2026-08-03 — Invoked, corrected, running due routines

Session context: [RECURRING] Agent Pushes task comment thread · invoked by Michael

- 3:31 PM · INVOKED.
- 3:31 PM · Michael corrected: activity log empty since build despite real runs (Job Market stamped 08-02, On Track stamped 08-01). Added hard invocation-stamp gate to prevent this going forward.
- 3:31 PM · Running due routines: On Track (overdue ~14h past 48h cadence) and Job Market (overdue ~3.5h past daily cadence).

---

## 2026-08-02 — Ran (RECONSTRUCTED — no activity-log entry was written)

- ~11:55 AM · Job Market routine ran successfully (stamp file proves it).
- Gap: no activity log entry was created. This is the failure the 08-03 hard gate fixes.

---

## 2026-08-01 — Ran (RECONSTRUCTED — no activity-log entry was written)

- ~1:30 AM · On Track routine ran successfully (stamp file proves it).
- ~1:36 AM · F1 routine ran (stamp file: `2026-08-01 01:36 ET`).
- Gap: no activity log entry was created.

---

## 2026-07-26 — Built, then immediately redesigned around TRIAGE

Session task: **Fleet Build Queue** (Agent Activity Board) · agent: Fleet Felix (steward), building me

> 🔗 This line used to carry a link. It was destroyed on 2026-08-06 by a whole-file rewrite that wrote back the
> internal placeholder an agent sees instead of the real ClickUp URL. See the header rule and the 08-06 entry.
> The original is in git history.

- ~2:12 PM · Michael: *"let's do rocky next."* Referent clear, NAME not. Felix stopped on the fork instead of guessing — an unbuilt agent's name isn't locked, and the slug is immutable the moment a file is written.
- ~2:16 PM · **Felix fixed my contract before building me.** `gates/agent-invocation-gate.md` STEP 0 was telling every agent in the fleet to resolve tokens via `invocation_resolution.token_map` — **a field that does not exist** (it's `invocation.tokens`). First move of every invocation, wrong. Also: roster described as two arrays abolished on 07-25, three more dead `registry.json` pointers, and only 3 of 6 live migrations listed. Building against that would have baked the rot into me. PR #549.
- ~2:19 PM · Michael ruled: **Ricky.** The name survived a real challenge rather than defaulting through.
- ~2:20 PM · Board presence posted BEFORE any write — and the write **collided**, which is the system working: Memory Maggie mid-OMR-drain, Maestro Mira on a group Milo session. Felix re-fetched rather than forcing, confirmed no file overlap, and appended a row in THEIR new table format instead of clobbering it.
- ~2:21 PM · `hooks/data-refresh.md` **v1** authored FIRST, before the profile pointing at it (the Maggie phantom-pointer lesson). Registry EMPTY on purpose.
- ~2:22 PM · Bundle authored. `gate_strength: confirm` — read-only argued for auto, but v1's default FETCHED EXTERNAL DATA and the Soleil miss was one day old.
- ~2:30 PM · Shipped. PR #552. `roster.json` came out **net 1,572 bytes SMALLER** despite gaining my registration (it had touched 21,140 mid-build — ~900 from unreadable).
- ~2:35 PM · **Michael redesigned my default before I ever ran.** *"Check the refresh log, determine what needs to be run based on timestamp last run... we externally maintain schedule and other agents may do updates via timestamp... for now just say 'here's what needs to happen — proceed?'"*
- ~2:38 PM · `hooks/data-refresh.md` **v2**: TRIAGE is now the default. NEW `brain-config/data-refresh-log.json` (shared state, **any** agent may stamp it), `cadence` added to the registry as CONFIG while timestamps stay STATE in the log, mandatory stamp-after-run (**including failures**), and a written three-stage graduation path toward auto.
- ~2:41 PM · **`gate_strength` reversed `confirm` → `auto`** four hours after birth. Not a flip-flop: my default no longer fetches anything, it does arithmetic on our own log and ends in a question. **The dial tracks the blast radius of the default, not my age** (D8). The fetch caution moved to per-poll `auto_run`.

**State left:** callable via `/session.agent=Ricky`. Announce `🔄 ═══ RICKY · ON THE ROUNDS ═══`. A bare call now TRIAGES and proposes; it never runs a poll unasked.
