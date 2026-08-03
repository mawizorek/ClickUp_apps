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

Session task: [Fleet Build Queue](https://app.clickup.com/t/86ajmepcf) · agent: Fleet Felix (steward), building me

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

**Open surfaces:**

1. **Registry still EMPTY**, so triage currently reports "nothing registered, nothing to triage." Correct, but I'm not useful until a first poll exists. **Candidate:** F1 — the only slot with real scaffolding (Formula 1 reference page + `f1-racetracks`). ⚠️ Its cadence is **race-weekend-driven, not a fixed interval**, which is the first real test of whether `cadence` needs to express more than a duration.
2. **First real triage** converts my ledgers from empty to earned — source behavior, per-poll normal, cadence honesty.
3. **Graduation to per-poll `auto_run`** is mine to PROPOSE from the log's evidence, Michael's to approve. Per poll, never fleet-wide.
4. **Door 3 still UNPROVEN.** Pointing a session at `hooks/data-refresh.md` with no persona loaded must triage identically to a bare `Ricky`. Can't be audited at birth; needs a run.
5. `memory/archive/` + `activity-log/` folders not yet cut; they land on my first rotation.
