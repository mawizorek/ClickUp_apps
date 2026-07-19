# Retrocast — Data Refresh Runbook

> Agent-agnostic runbook for the “import step” that keeps Retrocast's stored data table current. **The app never writes repo files; it only reads them + its own client cache.** This job is the only thing that touches `retrocast/data/`. Spec: `retrocast/next-build-spec.md` §4 (storage) + §9.5 (the refresh helper).

## The rule that governs everything here

Retrocast reads OUR OWN stored data table, never an external API directly at render. Two tiers:

1. **Durable floor** — committed repo files: the weather **baseline** (`data/<slug>/baseline.tsv`) and the shared **almanac** (`data/almanac-global.json`). This runbook produces them.
2. **Client cache** — the app live-fetches only what the repo file is missing (today's forecast value, recent days inside the ~5-day ERA5 lag, a not-yet-seeded location) and merges it into `localStorage`. That's runtime, not this job.

**v1 note:** the app is fully functional on live-fetch + cache alone. The durable floor is an optimization (faster first paint, offline/outage fallback). Seeding it is this runbook; it is not a blocker for the app running.

## Two-endpoint truth (never violate)

- **History** (baseline, spread, records) = the **ARCHIVE** endpoint (ERA5, `archive-api.open-meteo.com`). ~5-day lag.
- **Today** = the **FORECAST** endpoint, fetched live by the app at render. **Never seed “today” into a durable file.**
- These are separate models on separate endpoints. Do not blur them in the stored table.

## Honesty (non-negotiable)

- Every baseline row carries its true `sampleYears`. A sparse or Feb-29 row reports the real (smaller) count. **Never fabricate a baseline from thin data** — if ERA5 has 22 years for a row, the row says 22.
- Values are written straight from ERA5, rounded to 1 decimal. No smoothing that invents precision.

---

## Job A — Weather baselines (`build-baselines.mjs`)

Generates one 366-row TSV per location: this-day normal + spread (min/max) + records, aggregated across a 30-year archive window ending last complete year.

```
node retrocast/routines/build-baselines.mjs            # all seed locations
node retrocast/routines/build-baselines.mjs rochester-ny   # one location
```

- Requires Node 18+ (global `fetch`).
- Writes `retrocast/data/<slug>/baseline.tsv`, then **commit those files**.
- Seed locations live in the script's `LOCATIONS` array — keep it in lockstep with `js/store.js` `SEEDS`.
- TSV columns: `mmdd`, per-variable `*_normal`, per-variable `*_min`/`*_max` spread, `sampleYears`, `recordHigh`/`recordHighYear`, `recordLow`/`recordLowYear`.
- Adding a location the user pinned in the app? Add it to `LOCATIONS`, run for that slug, commit. Until then the app just live-fetches it (cache tier), so there's no rush.

## Job B — Global almanac (`data/almanac-global.json`) [spec’d, not yet scripted]

The “on this day” layer is keyed by **MM-DD alone**, so ONE global file is shared across every location (only the weather baseline multiplies per location). Shape:

```json
{ "MM-DD": { "events": [], "births": [], "deaths": [], "holidays": [] } }
```

- Source: Wikimedia `onthisday/all/<MM>/<DD>` (free, keyless, CORS). Present as “notable per Wikipedia,” English-centric — not authoritative truth.
- Public holidays: Nager.Date per country/year, filtered to the location's country at render.
- **Status:** v1 relies on the app's live Wikimedia/Nager fetch + cache. A `build-almanac.mjs` that walks all 366 MM-DD keys once and writes the global JSON is the natural follow-up; not required for the app to run. When built, it lives beside this file and this runbook gets its invocation block.

## Cadence

- **Baselines:** rarely. Re-run when the 30-year window rolls to a new complete year (annually), or when a location is added to the durable floor.
- **Almanac:** MM-DD keyed and year-agnostic, so effectively static once seeded; refresh only to pick up new Wikipedia entries. The app's live fetch already covers day-to-day.
- This is NOT a live cron in v1 (spec §10 Futures). Run it manually or wire it into CI later.

## What this job must NEVER do

- Never let the app call it or write repo files at render.
- Never seed “today” (forecast) into a durable file.
- Never fabricate or smooth-over missing history to fake a fuller sample.
