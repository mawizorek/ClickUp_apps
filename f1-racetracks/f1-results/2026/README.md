# 2026 Results Store

> The prose that used to live inside `index_rounds.json`. It was moved here 2026-07-28 because that file is the **boot payload every consumer fetches first** and roughly 76% of it was documentation the app never reads.
>
> **✅ Verified 2026-10-03: every round r01-r15 checked row by row against the FIA final race classification, final starting grid and final qualifying classification, cross-checked with formula1.com (data at commit `7ccc347`).** Earlier stamp: all nine round files at `d27ce55`, 2026-07-28. If you change the data, re-verify and re-stamp `verified_at_commit` in the manifest. A status line nobody re-reads is worse than none — that is exactly how this store came to be described wrongly by its own metadata.

---

## 🚨 Read this before you trust any document about this store

On 2026-07-28 a nine-lens review read every file here and found the app's own README **stale in both directions**:

- it said `fastLap` covered **1 of 9 rounds** — it has been **complete for all nine since 2026-07-23**
- it said there was **nowhere to put a sprint result** — **four rounds carry full sprint blocks**

Both claims were true when written. Neither was true when read, and nothing in the document could say which of its other claims had expired. **Open the JSON before you believe the plan.** Findings and rulings: *F1 Racetracks App — Decision Log*, entry **W1**.

---

## Canon rule

**This store holds REAL, official 2026 F1 data.** There is no alternate or invented season canon. Any note claiming rounds diverge from the real-world 2026 season, or must be left absent to protect a private storyline, was a placeholder rationalization and is retired (corrected 2026-07-23, Michael).

Numbers come from official sources (FIA timing sheets, formula1.com) cross-checked against a second source. **This store is now canonical for the race STORY too** (2026-10-03): the round `summary` and the per-row notes below. The ClickUp race task holds circuit history and the frozen Race History year-line, not the weekend narrative. When in doubt, the real official result wins.

**Corollary, added 2026-07-28:** if you cannot source a value, leave it absent. A missing field renders as a dash and costs nothing. An invented one survives for months and gets rendered to the user as fact — see the `DETAIL` map that was deleted from `source/standings/data.js` in the same pass.

---

## 🏁 Race story standard (Michael, 2026-10-03)

> Why it exists: the Baku classification showed six DNF rows and not one line about what happened. *"It'd be nice to begin including more in the race history... can we consider adding that level of activity?"* A results table tells you WHO; the story tells you WHY, and the WHY is what makes the page worth opening.

**Every round file carries two layers of story.** The Race Weekend lens renders `summary` under the masthead and each row's note in italics under the driver in the classification table. Both already exist in the renderer; no code change is needed to show more.

### 1. Round `summary` (required)

3-5 sentences that tell the race, not list it: who won and **how** (the margin when it was close) · the defining incidents (Safety Car / VSC / red flag, crashes, weather, the strategy call that decided it) · the biggest recoveries and drops · how many retired · post-race penalties that moved anyone.

### 2. Row `stewardNote` — the row's one-liner

⚠️ **The field name is legacy.** It started as a stewarding note and now carries the row's race story. Renaming it touches `weekend/render.js`, `standings/data.js` and every round file, so it waits for the v20 port. **Write story into it anyway; do not invent a second field.**

**REQUIRED on:**

| Row | What the note says |
|---|---|
| every **non-finisher** (`DNF` / `DNS` / `DSQ`) | **Opens with exactly one cause word**, then what happened (when, where, consequence). |
| the **podium** (P1-P3) | How they got there. P1 opens `Won by X.XXXs.`; P2/P3 open with their gap `+X.XXXs.` when sourced. |
| any **penalty** (grid or time), **pit-lane start**, or `onRoadPos` ≠ `pos` | What the penalty was for and what it cost. |
| any **mover** with \|grid − pos\| ≥ 5 (numeric `grid` only) | How the places were won or lost. With no sourced story, a factual derived line is fine: `Gained N places from PX on the grid to PY.` |

**Optional:** any other real story (team-mate fights, first points, last-lap passes, a stand-in driver).

**Cause words** (the first word of every non-finisher note, so the reason scans at a glance):

| Word | Means |
|---|---|
| `Collision.` | contact with another car ended the race |
| `Crash.` | solo accident |
| `Technical.` | mechanical, power unit, hydraulics, brakes, electrical |
| `Retired.` | team withdrew the car, **or the cause is not confirmed by sources** |
| `DNS.` | did not start |
| `DSQ.` | disqualified |

### 3. Sourcing law

- **Read at least two full race reports**, not just a results table (formula1.com, FIA, Sky Sports, Autosport, The Race, Crash.net, team race reports).
- A retirement **cause** needs two independent sources or one official one. Otherwise use `Retired.` and say no cause was confirmed.
- **Sources disagree on a lap or corner number → omit the number.** Never pick one.
- Quotes: verbatim, short, published only.
- **Never invent.** An absent note costs nothing.
- A story pass **never changes result data** (pos, grid, points, status, times). If a number looks wrong, flag it in the run report. Correcting results is a separate, primary-sourced data fix (precedent: the 2026-10-03 verification pass below).

### 4. House style

1-2 sentences, ideally under ~240 characters, past tense, plain English. Straight apostrophes, no em dashes. **No process commentary in a note** ("recorded verbatim," "the sources reviewed," "the supplied row"): the note is read by a fan, not an auditor. Data-integrity remarks go in the provenance key instead.

### 5. Provenance

Each story pass adds a round-level `sources_<YYYY_MM_DD>` key on its own line directly under the first line (outlets + dates, plus any `Data notes:` for future agents) and bumps the round's `version` to that date. Reference example: `r15-baku.json`.

---

## Structure

Per-round season store. Each round is its own file and is the canonical record for that round. `index_rounds.json` lists round order, the `sprint` flag, the points scales, and the `cuTaskId` join key back to the ClickUp race task. The engine fetches the index, then loads round files.

**Standings, podium, pole and fastest-lap credits are COMPUTED live, never stored twice.**

**Filename convention:** `r<NN>-<slug>.json`. The round prefix future-proofs circuits hosting multiple races in one season (Bahrain 2020 had two). The slug alone is not a unique key across years; round + slug is.

**Scope:** 2026 only. The year lives in the path, so this file never goes cumulative. A cross-season pointer would be a separate `f1-results/index_seasons.json` at the store root, added only when a second season exists.

**Renamed** from `index.json` on 2026-07-09: there is exactly one bare `index.*` in the repo (the root dashboard); every other index carries a suffix saying what it indexes.

---

## Row schema

Each entry in a round's `classification` (and `sprint.classification`) is ONE driver's whole weekend, keyed by `driverId`.

| Field | Shape | Notes |
|---|---|---|
| `pos` | int, `null` on DNF/DNS | finished / classified position |
| `driverId` | string | ClickUp task ID — the join key for the season self-join |
| `driver` · `team` | string | |
| `status` | `FIN` / `DNF` / `DNS` / `DSQ` | |
| `points` | number | |
| `grid` | int, or the string `'PL'` | where they STARTED, post-penalty. `'PL'` = pit-lane start and has **no meaningful numeric delta** |
| `onRoadPos` | int, **absent when equal to `pos`** | see the absence rule below |
| `qualifying` | `{ pos, q1, q2, q3 }` | `pos` is the position in the FIA final qualifying classification (before grid penalties); lap times are strings, `null` when not set or eliminated earlier. `pos: null` = no time set |
| `fastLap` | `{ time, lap }` or `null` | THIS driver's best race lap. `null` = no representative lap (early DNS/DNF) |
| `stewardNote` | string | **the row's race-story one-liner** — see Race story standard (legacy name) |
| `tyres` | `{ stops, stints[] }` | designed, **not populated anywhere** |

**The four position landmarks — `qualifying.pos` → `grid` → `onRoadPos` → `pos` — are stored separately on purpose.** The movement between them is the story. `positionsGained` is `grid - pos` and is **DERIVED at render, never stored.**

**🚨 The absence rule (`onRoadPos`).** Stored ONLY when it differs from `pos`. **Its absence is MEANINGFUL: missing means "same as pos," never "unknown."** Every consumer reads it as `onRoadPos ?? pos`.

**📏 `fastLap.lap` convention (2026-10-03).** Lap numbers follow the **formula1.com fastest-laps table**. The FIA timing sheet often reads one lap (sometimes two) lower for the same lap time. Both are official; they count differently. **Do not "correct" between the two conventions.** Times always match.

All new fields are optional and degrade to dashes, so a round entered without qualifying still renders.

### Round level

`pole { driverId, driver, team, time }` and `fastestLap { driverId, driver, team, time, lap }` are the **official single-seat credits** — the headline awards — distinct from the per-driver `qualifying` / `fastLap` fields. Both may be present. The round-level `fastestLap` driver always equals the P1 row of the official F1.com per-race fastest-laps table (checked against the minimum per-row `fastLap` on every round, 2026-10-03). `summary` is the race story (required, see above); `sources_<date>` is story provenance.

---

## 📊 Field state table

**`live`** = present in the data and verified · **`live, partial`** = present on some rounds only, rounds named · **`documented-only`** = described in a schema and present in **no file** · **`planned`** = designed, not built.

States verified 2026-10-03 across r01-r15.

| Field | State | Detail |
|---|---|---|
| `pos` · `driverId` · `driver` · `team` · `status` · `points` | **live** | all rounds, every row; verified against FIA final classifications 2026-10-03 |
| `fastLap { time, lap }` | **live** | r01-r15 complete (r13-r15 backfilled 2026-10-03). `null` only for genuine no-lap rows (DNS, lap-one retirements, Leclerc at Monza) |
| `grid` | **live** | r01-r15 complete (r03, r04, r07 backfilled 2026-10-03); pit-lane starts stored as `'PL'` |
| `qualifying { pos, q1, q2, q3 }` | **live** | r01-r15 complete against FIA final qualifying classifications. One known gap: r04 Hadjar `q1` (qualifying DSQ; sheet not reconciled) |
| `onRoadPos` | **live** | correctly sparse by design. Also honoured inside a sprint block (r04 Miami, Antonelli) |
| `summary` | **live, r01-r15** (2026-10-03) | race-story standard |
| `stewardNote` | **live, r01-r15 to standard** (2026-10-03) | every non-finisher carries a cause word; every podium, penalty, pit-lane start and ≥5-place mover carries a note |
| `sprint.classification` | **live** | every sprint round run, top 8 scoring |
| `sprintQualifying { pos, sq1, sq2, sq3 }` | **documented-only** | described in the old row schema, present in **no file**. Ruled 2026-07-28 (Q10): sprint gets its own full treatment as a distinct activity entry within the weekend — this is now **planned**, with the shape settled before any backfill |
| sprint `grid` | **planned** | same ruling |
| `pole.gapToP2` | **documented-only** | **read by live code** — `12_results_store.js` does `data.pole.gapToP2 \|\| ''` — and stored in no round file |
| `tyres.stints[]` | **planned** | designed; nothing reads or writes it. It is a nested repeating FIELD, **not a table** (ruled 2026-07-28) |
| `dnf { lap, reason }` · `finishGap` | **planned** | Tier 4. Until then the cause word + note carry the reason |

### Qualifying completeness (resolved 2026-10-03)

The 2026-07-28 audit found qualifying uneven: r02 rows with `pos` and no times, r05 Q3 times with null Q1/Q2, r01 and r06 partial. All of it is now filled from the FIA final qualifying classifications, and a structural sweep passes on every round (top 10 carry Q2, P11-P16 carry Q2 and no Q3, P17+ carry Q1 only, each segment sorts by lap time). Legitimate exceptions: drivers who set no time in a segment they reached (e.g. Bortoleto at Monaco after his Q1 crash, Antonelli at Baku). `null` now means "not set," not "not dug."

### Open data flags

- **r04 miami:** Hadjar's `qualifying.q1` is null while his Q2/Q3 times are stored (qualifying DSQ). Reconcile against the FIA sheet.
- **r13 monza:** Audi lodged an appeal over the stewards' ruling on Tsunoda's extra formation lap. No outcome published as of 2026-10-03; the classification is unchanged until one is.

### Resolved 2026-10-03 (verification pass, r01-r15)

- **r01-r02-r05 DNS:** Piastri and Hulkenberg (r01), Norris, Piastri, Bortoleto and Albon (r02), Lindblad (r05) corrected `DNF` → `DNS`.
- **r03 suzuka:** Stroll and Bearman not classified (`DNF`, `pos: null`); P16-P20 reordered to the FIA result.
- **r06 monaco:** FIA International Court of Appeal reinstated Gasly's two pit-lane penalties on 2026-09-04. Final order Hadjar P3 · Piastri P4 · Lawson P5 · Lindblad P6 · Gasly P7 (on-road P3).
- **r07 catalunya:** pole time 1:14.679 added; Bearman `DNF` (classified P17) confirmed.
- **r08 red-bull-ring:** Alonso P18 `FIN` (68 laps) confirmed.
- **r09 silverstone:** P12-P17 reordered to the FIA final classification after Sainz's one-lap penalty (Sainz P17, onRoadPos 12); Verstappen `DNF`, classified P20.
- **r11 hungaroring:** Leclerc 1:22.000 fastest lap confirmed by FIA and formula1.com.
- **Grid:** about 30 slots corrected across r01, r02, r05, r06, r12, r13, r14 and pit-lane starts set to `'PL'`.

---

## Backfill status

| Pass | State |
|---|---|
| Tier 1 spine (`pos` / `driverId` / `status` / `points`) | ✅ all rounds, FIA-verified 2026-10-03 |
| Per-driver `fastLap` | ✅ r01-r15 (r13-r15 added 2026-10-03) |
| `grid` + `qualifying` | ✅ r01-r15 (r03, r04, r07 added 2026-10-03; one r04 gap flagged above) |
| Qualifying lap-time completeness | ✅ resolved 2026-10-03 |
| **Race story (`summary` + notes to standard)** | ✅ **r01-r15** (2026-10-03, r15 on 10-02) |
| Sprint arc (`sprintQualifying` + sprint grid) | 🟡 planned, shape ruled 2026-07-28 |
| Tyre strategy (Tier 3) · Tier 4 colour | ⬜ not dug |

**Provenance:** finishing positions and points re-verified against the ClickUp race tasks (2026-07-09), then every round r01-r15 verified against FIA final classifications, starting grids and qualifying classifications (2026-10-03, PR #966 plus follow-up commits). **This store is canonical for RESULTS and for the race STORY.**

---

## Sprint weekends

2026 runs **six sprint weekends** — Shanghai, Miami, Montreal, Silverstone, Zandvoort, Singapore (formula1.com, 2025-09-16). A sprint result lives under the round's `sprint.classification`, a separate array in the same round file, scoring the top eight on `8-7-6-5-4-3-2-1`. Standings aggregate it (`total = race + sprint`) — verified in `source/standings/data.js`.

---

## Size

Round files ran 4.2KB to 7.6KB before the story pass and 7.7KB to 12.2KB after the 2026-10-03 verification pass (r12 zandvoort, with a sprint block, is the largest). All are well under the proven read cap (≥26,175 bytes, measured 2026-07-27), **fetched per round, never whole.** Flat per file, linear in count — this per-round split is the fix for the 36KB `2026.json` monolith retired 2026-07-07. ⚠️ The story layer roughly doubles a file; a round that passes ~20KB should trim its notes, not split.
