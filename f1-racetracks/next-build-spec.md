# F1 Racetracks — next build spec

> **RECONCILED 2026-07-07.** The F1 results SCHEMA-SHIFT is now the primary next build. It was brainstormed on clean context (7-lens gate) before this spec was written. The prior module-refactor items were NOT discarded — they converge with the shift and are sequenced underneath it (splitting module `10` is the first step, because the new season-history render lands in the results-history submodule that split creates). Decisions below are LOCKED by Michael 2026-07-07; do not re-litigate.

## Build sequence (Michael, 2026-07-07)

1. **Data foundation** — `f1-results/2026.json`. ✅ **SHIPPED** (PR #55). Invisible, unblocks everything.
2. **Matrix + standings view, born in the pit-wall language** — greenfield championship points matrix; new aesthetic proven here. AESTHETIC BUILD — do WITH Michael, not solo.
3. **Driver-brief cell interaction** — click-through layer on the matrix.
4. **Propagate the pit-wall restyle** across the rest of the app (kill rounded corners globally, retabularize).

Michael's standing instruction: backend/data can proceed solo; **big aesthetic shifts (builds 2-4) happen with him in the room.**

## Locked decisions (Michael, 2026-07-07)

1. **Per-season results JSON, keyed by LOCATION not round number.** Location (track slug) is the durable identity; round number is a per-season ordering attribute that shuffles year to year. This also matches the racetracks file key, so the two JSON sources join cleanly cross-year.
2. **`points` on every classification row.** Standings (WDC + WCC) are COMPUTED live from the results (race + sprint), never stored separately. Live standings render is in-scope.
3. **ClickUp history = ONE slim year-labeled "Race History" text field per track.** Human-readable prose, one line per year. Full finishing order LEAVES ClickUp and lives only in JSON. This field is the FROZEN ARCHIVE LENS: written once per year (fill-if-blank), prior years immutable, conflicts STOP-and-flag.
4. **Migration = full verified 20-car order for all 9 completed rounds**, re-verified against primary sources. ✅ done in build 1.
5. **`routines/f1-refresh.md` mirror rework folded into this build.** Post-shift the mirror keeps slim writes (status-flip, dates, notifications) and its one data write becomes appending the frozen year-line to the Race History field, resolved by `cuTaskId`. Full order never touches ClickUp. STILL PENDING: mirror currently targets the retired per-year dropdown; Ricky runs Thu-Sun, so rework before next race weekend.
6. **Sprints = optional per-round block** reusing the race-classification shape + the sprint points scale (8-7-6-5-4-3-2-1, top 8). Non-sprint rounds omit the key entirely (zero bloat). Total points = race + sprint, computed live.
7. **Standings = ONE canonical final order** + per-row `onRoadPos`/`stewardNote` + a round-level amended flag. No multiple standings versions.
8. **Interaction: cell tap = driver race brief; flag tap = provenance popup.** Separate tap targets on the shared surface (collision handled). Full state lifecycle (entry/exit/reset/background) required per the Interaction-State Standard.
9. **Aesthetic = dark pit-wall:** sharp corners (a purposeful circle or two is fine — it's the rounded-everything nav-app feel we're killing), tabular/monospaced numerics, dense tables over cards, color-as-data (team accent, purple fastest lap, amber amended flag). Moving AWAY from the OnTrack navigation-app aesthetic. Design-skill hard bans still apply (no glassmorphism, gradient text, side-stripe borders, pure #000/#fff).

## Per-season JSON schema (`f1-results/2026.json`) — built to grow

```
{
  "season": 2026, "version": "YYYY-MM-DD",
  "rounds": [
    {
      "slug": "albert-park",          // LOCATION = identity (joins to racetracks file)
      "round": 1,                       // per-season ordering attribute
      "name": "...", "date": "...",
      "cuTaskId": "86ae52ghx",         // round-level anchor -> F1 Races task
      "sprint": {                        // OPTIONAL — present only on sprint weekends
        "classification": [ {pos, driverId, driver, team, status, points} ]  // 8-1 scale, top 8
      },
      "classification": [               // ARRAY ordered by finishing position
        { "pos": 1, "driverId": "86ae52qva", "driver": "...", "team": "...",
          "status": "FIN",             // FIN | DNF | DNS | DSQ | WD
          "points": 25,
          "onRoadPos": 3,               // OPTIONAL — only when stewards changed the order
          "stewardNote": "..."          // OPTIONAL — provenance for the amended flag
          // GROWTH (reserved, optional): grid, gap, laps, pits, stints, fastestLapTime, telemetry
        }
      ],
      "pole": { driverId, driver, team, time },
      "fastestLap": { driverId, driver, team, time, lap }
    }
  ]
}
```

- **Defensive read:** engine renders whatever fields are present, hides what's absent. Adding growth fields later is a data change, never an engine change.
- **Standings computed:** WDC = sum of race+sprint `points` per `driverId`; WCC = sum per `team`. No stored standings.
- **Two sources of truth, lensed by time horizon:** `f1-results/<year>.json` (per-season, live lens, canonical in-season) + `f1-racetracks/data.json` (persistent cross-year reference). Both carry anchors.

## Build 1 — SHIPPED (PR #55)

- All 9 rounds, full verified classification (P1->last + DNFs), race + sprint, pole, fastest lap, provenance.
- Verified vs formula1.com / FIA PDFs / RaceFans. Sprint points reconcile every driver's official season total to the exact figure.
- THREE store errors corrected: Austria (Russell won), Spain (Hamilton maiden Ferrari win; Antonelli DNF from P2), Monaco (Gasly P3, penalties overturned on appeal).

## OPEN FLAGS (carry into build 2)

- **🚩 Driver-anchor dedup (must resolve before any ClickUp mirror).** `driverId` is null (`_anchor: UNRESOLVED-DUP`) on Colapinto / Lindblad / Bottas / Perez rows: DUPLICATE tasks exist in the F1 Drivers list (two Colapinto, two Bottas, two Lindblad; Perez single but in the newer ID block). Not guessed, per anchor convention (resolve 1:1 or STOP). Likely-canonical originals (in the established 86ae52* block): Colapinto `86ae52rq5`, Bottas `86ae52rtd`, Lindblad `86ae52ryh`; Perez only `86aj1ra1z` exists. ACTION: dedup the list (🗑️ + DUPLICATE label on the extras), confirm canonical IDs, backfill the four null anchors in 2026.json.
- **🚩 36KB file vs 30KB agent-readback cap.** `2026.json` shipped at ~36KB. App fetch is unaffected (browsers read it whole); only AGENT/Ricky edit-readback is capped. Fine for now, but it only grows (22 rounds + eventual times/telemetry). DECISION NEEDED before telemetry lands: split growth path — likely per-round files (`f1-results/2026/<slug>.json`) with a season index, or a rounds-sharded set. Do NOT let a single season file balloon past readback into a silent-truncation trap.

## Next build (schema shift — remaining)

1. **Split `source/10_track_views_and_profile.js`** into stable submodules: track render / **results-history** / profile-helpers. FIRST step (load-bearing for the render).
2. **Championship points matrix + computed standings view** in the pit-wall language (build 2, WITH Michael).
3. **Driver-brief cell interaction** (build 3).
4. **Propagate pit-wall restyle** (build 4).
5. **ClickUp:** create the one slim "Race History" text field per track; backfill each year-line fill-if-blank; retire the per-year result dropdowns.
6. **Rework `routines/f1-refresh.md`:** slim writes only + append the frozen year-line by `cuTaskId`.

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

- rebalance grouped round-data files `06` / `07` / `08` under the 15 KB working threshold (carried from prior spec; do alongside the module-10 split where it overlaps)
- decide whether the companion `live-tracker.html` stays a separate surface or gets structurally narrowed now that the main app owns more weekend context (carried from prior spec)
- move more seeded weekend timing/replay content into canonical runtime data instead of JS-held seeds
- expand support-series schedule density only after the core F1 weekend surface is stable
- per-driver times/gaps, grid-vs-finish deltas, pit stops, telemetry — populate the reserved JSON growth fields as data becomes available (data change, not engine change)
- standings-progression chart (v2 of the matrix view) computed from per-round points
- `f1-results/2027.json` and beyond: independent per-year saves; racetracks file persists across years

## Known guardrails

- start normal edits from `source/`, not from `index.html`
- semantic source target stays ~10–12 KB soft / ~15 KB hard unless explicitly approved otherwise
- 30 KB is an absolute redline / failure state for readback, not a planning target
- do not create new temp-fix source buckets like `surface_rescue` / `compact_polish`; add or split permanent concern-based modules instead
- keep the visible footer build token useful during runtime verification so deploy refreshes are obvious from screenshots
- **anchor by inline `cuTaskId` / `driverId`; resolve by ID never by name; unresolved anchor = STOP-and-flag, never guess or create a filling object**
- **JSON is canonical data; ClickUp stays slim (events/triggers/notifications/mirrors), never a data store; no field-per-year growth in ClickUp**
- **do NOT trust the existing store during migration — primary-source re-verify every finishing position** (three silent errors found this session, all favoring one narrative)
