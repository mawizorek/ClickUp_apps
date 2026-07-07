# F1 Racetracks — next build spec

> **RECONCILED 2026-07-07.** The F1 results SCHEMA-SHIFT is now the primary next build. It was brainstormed on clean context (7-lens gate) before this spec was written. The prior module-refactor items were NOT discarded — they converge with the shift and are sequenced underneath it (splitting module `10` is the first step of the shift, because the new season-history render lands in the results-history submodule that split creates). Decisions below are LOCKED by Michael 2026-07-07; do not re-litigate.

## Locked decisions (Michael, 2026-07-07)

1. **Per-season results JSON, keyed by LOCATION not round number.** Location (track slug) is the durable identity; round number is a per-season ordering attribute that shuffles year to year. This also matches the racetracks file key, so the two JSON sources join cleanly cross-year.
2. **`points` on every classification row.** Standings (WDC + WCC) are COMPUTED live from the results, never stored separately. Live standings render is in-scope for this update.
3. **ClickUp history = ONE slim year-labeled "Race History" text field per track.** Human-readable prose, one line per year. Full finishing order LEAVES ClickUp and lives only in JSON. This field is the FROZEN ARCHIVE LENS: written once per year (fill-if-blank), prior years immutable, conflicts STOP-and-flag.
4. **Migration = full verified 20-car order for all 9 completed rounds**, re-verified against a primary source (formula1.com / FIA). Do NOT trust the current store — two silent errors (Austria, Spain) already found, both erasing the same Antonelli-streak storyline. Re-verify even the seven marked "clean" (they were verified at podium only, never full order).
5. **`routines/f1-refresh.md` mirror rework folded into THIS build.** Post-shift the mirror keeps slim writes (status-flip, dates, notifications) and its one data write becomes appending the frozen year-line to the Race History field, resolved by `cuTaskId`. Full order never touches ClickUp. Time-sensitive: Ricky runs Thu–Sun against the CURRENT per-year dropdown; that field is being retired.

## Per-season JSON schema (`f1-results/2026.json`) — built to grow

```
{
  "season": 2026,
  "version": "YYYY-MM-DD",           // datestamp, Ricky/data-commit convention
  "rounds": [
    {
      "slug": "albert-park",          // LOCATION = identity (joins to racetracks file)
      "round": 1,                       // per-season ordering attribute
      "name": "Australian Grand Prix",
      "date": "YYYY-MM-DD",
      "cuTaskId": "86ae52ghx",         // round-level anchor -> F1 Races task
      "classification": [               // ARRAY ordered by finishing position
        {
          "pos": 1,                     // finishing position (int); DNF/DNS rows keep null or classified pos
          "driverId": "86ae52qva",      // ROW-LEVEL anchor -> F1 Drivers task (resolve by ID)
          "driver": "George Russell",
          "team": "Mercedes",
          "grid": 1,                    // starting position (grid vs finish is a growth axis)
          "status": "FIN",             // FIN | DNF | DNS | DSQ | WD
          "gap": "WINNER",             // "+1.9s" / "+1 LAP" / "DNF (lap 62, hydraulics)"
          "points": 25
          // GROWTH (reserved, optional, absent today; engine reads defensively):
          // "laps": [...], "pits": [...], "stints": [...], "fastestLapTime": "...", "telemetry": {...}
        }
        // ... one row per driver, full field
      ],
      "pole": { "driverId": "...", "driver": "...", "team": "...", "time": "...", "gapToP2": "...", "top5": [...] },
      "fastestLap": { "driverId": "...", "driver": "...", "team": "...", "time": "...", "lap": 0 }
    }
  ]
}
```

- **Defensive read:** engine renders whatever growth fields are present and hides what's absent. Adding `laps`/`pits`/`telemetry` later is a data change, never an engine change.
- **Two sources of truth, lensed by time horizon:** `f1-results/<year>.json` = time-boxed per-season store (live lens, canonical in-season). `f1-racetracks/data.json` = persistent cross-year reference (unchanged, keeps its `raceResults` podium summary as the racetracks-view lens OR trims to pointers — decide at build; do not break the racetracks app). Both carry `cuTaskId` anchors.
- **Standings computed:** WDC = sum of `points` per `driverId` across rounds; WCC = sum per `team`. No stored standings.

## Next build (schema shift — primary)

1. **Split `source/10_track_views_and_profile.js`** into stable submodules: track render / **results-history** / profile-helpers. This is the FIRST step (was already queued below as a refactor; it is now load-bearing for the shift).
2. **Author `f1-results/2026.json`** in the schema above.
3. **Migrate all 9 completed rounds** into it with full 20-car verified order. Re-verify every position against formula1.com / FIA. Carry driver `cuTaskId`s from the F1 Weekly Refresh driver table as `driverId`.
4. **Build the season-history render** into the new results-history submodule: v1 = winners/podium ledger with expand-to-full-classification per round + honest partial-data states. v2 (not blocking v1) = standings-progression chart from computed points. Mobile-first pass (no overflow at 320px; watch the historical footer-clip trap).
5. **Wire live standings** in the app from computed `points`.
6. **ClickUp:** create the one slim "Race History" text field per track; backfill each year-line fill-if-blank; retire the per-year result dropdowns.
7. **Rework `routines/f1-refresh.md`:** mirror writes slim only + appends the frozen year-line by `cuTaskId`; full order stays in JSON.

## In review

- direct-to-main structural cleanup shipped on Sat Jul 4:
  - retired `source/14_surface_rescue.js`
  - retired `source/15_compact_polish.js`
  - replaced them with permanent weekend modules:
    - `14_weekend_state_and_data.js`
    - `15_weekend_surface_render.js`
    - `16_weekend_live_mode.js`
    - `17_weekend_mount.js`
    - `18_home_and_mobile_polish.js`

## Futures

- rebalance grouped round-data files `06` / `07` / `08` so no round-data source file sits above the 15 KB working threshold unless explicitly approved (carried from prior spec; do alongside the module-10 split where it overlaps)
- decide whether the companion `live-tracker.html` should stay a separate surface or get structurally narrowed now that the main app owns more weekend context (carried from prior spec)
- move more seeded weekend timing and replay content into canonical runtime data instead of JS-held seeds
- expand support-series schedule density only after the core F1 weekend surface is stable
- per-driver times/gaps, grid-vs-finish deltas, pit stops, telemetry — populate the reserved JSON growth fields as data becomes available (data change, not engine change)
- `f1-results/2027.json` and beyond: independent per-year saves; racetracks file persists across years

## Known guardrails

- start normal edits from `source/`, not from `index.html`
- semantic source target stays ~10–12 KB soft / ~15 KB hard unless explicitly approved otherwise
- 30 KB is an absolute redline / failure state, not a planning target
- do not create new temp-fix source buckets like `surface_rescue` / `compact_polish`; add or split permanent concern-based modules instead
- keep the visible footer build token useful during runtime verification so deploy refreshes are obvious from screenshots
- **anchor by inline `cuTaskId` / `driverId`; resolve by ID never by name; unresolved anchor = STOP-and-flag, never guess or create a filling object**
- **JSON is canonical data; ClickUp stays slim (events/triggers/notifications/mirrors), never a data store; no field-per-year growth in ClickUp**
- **do NOT trust the existing store during migration — primary-source re-verify every finishing position**
