# 2026 Results Store

> The prose that used to live inside `index_rounds.json`. It was moved here 2026-07-28 because that file is the **boot payload every consumer fetches first** and roughly 76% of it was documentation the app never reads.
>
> **Everything below was verified against all nine round files at commit `d27ce55` on 2026-07-28.** If you change the data, re-verify and re-stamp `verified_at_commit` in the manifest. A status line nobody re-reads is worse than none — that is exactly how this store came to be described wrongly by its own metadata.

---

## 🚨 Read this before you trust any document about this store

On 2026-07-28 a nine-lens review read every file here and found the app's own README **stale in both directions**:

- it said `fastLap` covered **1 of 9 rounds** — it has been **complete for all nine since 2026-07-23**
- it said there was **nowhere to put a sprint result** — **four rounds carry full sprint blocks**

Both claims were true when written. Neither was true when read, and nothing in the document could say which of its other claims had expired. **Open the JSON before you believe the plan.** Findings and rulings: *F1 Racetracks App — Decision Log*, entry **W1**.

---

## Canon rule

**This store holds REAL, official 2026 F1 data.** There is no alternate or invented season canon. Any note claiming rounds diverge from the real-world 2026 season, or must be left absent to protect a private storyline, was a placeholder rationalization and is retired (corrected 2026-07-23, Michael).

Numbers come from official sources (FIA timing sheets, formula1.com) cross-checked against a second source. **The ClickUp race task is canonical for NARRATIVE only.** When in doubt, the real official result wins.

**Corollary, added 2026-07-28:** if you cannot source a value, leave it absent. A missing field renders as a dash and costs nothing. An invented one survives for months and gets rendered to the user as fact — see the `DETAIL` map that was deleted from `source/standings/data.js` in the same pass.

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
| `qualifying` | `{ pos, q1, q2, q3 }` | `pos` is the grid slot earned in the session; lap times are strings, `null` when not set or eliminated earlier |
| `fastLap` | `{ time, lap }` or `null` | THIS driver's best race lap. `null` = no representative lap (early DNS/DNF) |
| `stewardNote` | string | free text, where relevant |
| `tyres` | `{ stops, stints[] }` | designed, **not populated anywhere** |

**The four position landmarks — `qualifying.pos` → `grid` → `onRoadPos` → `pos` — are stored separately on purpose.** The movement between them is the story. `positionsGained` is `grid - pos` and is **DERIVED at render, never stored.**

**🚨 The absence rule (`onRoadPos`).** Stored ONLY when it differs from `pos`. **Its absence is MEANINGFUL: missing means "same as pos," never "unknown."** Every consumer reads it as `onRoadPos ?? pos`.

All new fields are optional and degrade to dashes, so a round entered without qualifying still renders.

### Round level

`pole { driverId, driver, team, time }` and `fastestLap { driverId, driver, team, time, lap }` are the **official single-seat credits** — the headline awards — distinct from the per-driver `qualifying` / `fastLap` fields. Both may be present. The round-level `fastestLap` driver always equals the P1 row of the official F1.com per-race fastest-laps table.

---

## 📊 Field state table

**`live`** = present in the data and verified · **`live, partial`** = present on some rounds only, rounds named · **`documented-only`** = described in a schema and present in **no file** · **`planned`** = designed, not built.

A field with no state here has not been audited. All states verified at `d27ce55`, 2026-07-28.

| Field | State | Detail |
|---|---|---|
| `pos` · `driverId` · `driver` · `team` · `status` · `points` | **live** | all 9 rounds, every row |
| `fastLap { time, lap }` | **live** | all 9 rounds. Backfilled 2026-07-23 from the official per-race FL tables; shape upgraded from a bare string in the same pass. `null` only for genuine no-lap retirements |
| `grid` | **live, partial** | 6 of 9 — **absent on r03 suzuka, r04 miami, r07 catalunya** |
| `qualifying { pos, q1, q2, q3 }` | **live, partial** | 6 of 9, same three rounds absent — **and uneven within the six**, see below |
| `onRoadPos` | **live** | correctly sparse by design. Also honoured inside a sprint block (r04 Miami, Antonelli) |
| `stewardNote` | **live** | sparse by design |
| `sprint.classification` | **live** | all 4 sprint rounds run so far (r02, r04, r05, r09), top 8 scoring |
| `sprintQualifying { pos, sq1, sq2, sq3 }` | **documented-only** | described in the old row schema, present in **no file**. Ruled 2026-07-28 (Q10): sprint gets its own full treatment as a distinct activity entry within the weekend — this is now **planned**, with the shape settled before any backfill |
| sprint `grid` | **planned** | same ruling |
| `pole.gapToP2` | **documented-only** | **read by live code** — `12_results_store.js` does `data.pole.gapToP2 \|\| ''` — and stored in no round file |
| `tyres.stints[]` | **planned** | designed; nothing reads or writes it. It is a nested repeating FIELD, **not a table** (ruled 2026-07-28) |
| `dnf { lap, reason }` · `finishGap` | **planned** | Tier 4 |

### ⚠️ Qualifying completeness is a spectrum, not a binary

The old status line said three rounds were flat and implied the rest were complete. They are not. Within the six enriched rounds:

| Round | State |
|---|---|
| r09 silverstone · r08 red-bull-ring | near-complete Q1/Q2/Q3 |
| r06 monaco · r01 albert-park | mixed — several rows carry `pos` with partial or no lap times |
| r02 shanghai | **9 of 22 rows** carry `qualifying.pos` with all three lap times `null` |
| r05 gilles-villeneuve | **4 drivers** (Leclerc, Hadjar, Colapinto, Lindblad) carry a **Q3 time with null Q1 and Q2** — a partial dig wearing the shape of a complete record |

**Why it matters:** `null` currently means two different things. A driver eliminated in Q1 legitimately has null Q2/Q3. A driver whose Q1 was never dug also has null Q1. `q.q1 ?? '—'` renders both identically, and a render path built against r09 never exercises the shapes in between.

**Ruled 2026-07-28 (Q12):** dig it AND render the difference — with the **completeness data pass assigned to Routine Ricky as a later job**, not a v7 blocker.

### Known single-round gaps

- **r07 catalunya:** round-level `pole` has `driverId` / `driver` / `team` and **no `time`**. Every other round has one. `12_results_store.js` already guards this (`data.pole.time || 'TBC'`), so it renders as TBC rather than breaking.

---

## Backfill status

| Pass | State |
|---|---|
| Tier 1 spine (`pos` / `driverId` / `status` / `points`) | ✅ r1-9 |
| Per-driver `fastLap` | ✅ r1-9, complete 2026-07-23 |
| `grid` + `qualifying` | ⚠️ 6 of 9 — **r03, r04, r07 outstanding** |
| Qualifying lap-time completeness within the enriched six | ⚠️ uneven — assigned to Routine Ricky |
| Sprint arc (`sprintQualifying` + sprint grid) | 🟡 planned, shape ruled 2026-07-28 |
| Tyre strategy (Tier 3) · Tier 4 colour | ⬜ not dug |

**Provenance:** finishing positions and points re-verified against the ClickUp race tasks (2026-07-09). **This store is canonical for RESULTS; the ClickUp task is canonical for NARRATIVE.**

---

## Sprint weekends

2026 runs **six sprint weekends** — Shanghai, Miami, Montreal, Silverstone, Zandvoort, Singapore (formula1.com, 2025-09-16). Four have been run and **all four are in this store**, scoring the top eight on `8-7-6-5-4-3-2-1`. Zandvoort and Singapore are still to come.

A sprint result lives under the round's `sprint.classification`, a separate array in the same round file. Standings aggregate it (`total = race + sprint`) — verified in `source/standings/data.js`.

---

## Size

Round files run 4.2KB to 7.6KB; the largest is under a third of the proven read cap (≥26,175 bytes, measured 2026-07-27). A full 23-round season is ~168KB total, **fetched per round, never whole.** No file here has a size problem. Flat per file, linear in count — this per-round split is the fix for the 36KB `2026.json` monolith retired 2026-07-07.
