# F1 Racetracks

> **The app plan.** Load this at the start of every build session.  
> One file answers: what pages exist, what data feeds them, what's not done yet.

**Live:** https://mawizorek.github.io/ClickUp_apps/f1-racetracks/  
**Source of truth:** this repo folder  
**Shell version:** v6.7 | **Data:** 2026-07-23c (9 rounds)

---

## What this app is

A browser-based 2026 F1 race-control companion. Circuit breakdowns, live weekend integration, full championship standings, and per-race deep-dive results, all driven by a structured per-round JSON store designed to grow into lap times, telemetry, and strategy data.

Not a results table. A race story told through data.

---

## Pages

### Home Grid — LIVE
- **Route:** `index.html` → `#/`
- **Does:** 24-round card grid with current-round highlight card and lens switcher (Matrix / History / Circuits)
- **Source:** `09_app_bootstrap_and_home.js`, `18_home_and_mobile_polish.js`
- **Data:** `data.json`

### Circuit Breakdown — LIVE
- **Route:** `index.html` → `#/<slug>`
- **Does:** Per-circuit deep view: track map, lap profile, sectors, tyre/overtaking character, weather, race history. Includes Weekend Center (schedule / live / replay)
- **Source:** `10_track_views_and_profile.js`, `11_weather_and_footer_exports.js`, `14–17_weekend_*.js`
- **Data:** `data.json` + `circuits/<slug>.json` + `f1-results/2026/<slug>.json`

### Standings — LIVE
- **Route:** `standings.html`
- **Does:** Drivers + Constructors championship tables. Points, position deltas, round-by-round breakdown.
- **Source:** `source/standings/` (chunked)
- **Data:** `f1-results/2026/index_rounds.json` + all round files

### Circuits Index — LIVE
- **Route:** `circuits.html`
- **Does:** Standalone circuit listing (country, length, laps, type). Alternative entry to circuit views.
- **Data:** `data.json`

### Weekend Race Detail — LIVE
- **Route:** `weekend.html`
- **Does:** Full race-detail for a completed round. 8 panels: podium, pole, fastest lap, grid, qualifying tiers, sprint, classification, championship swing. Driver popup with per-driver results.
- **Source:** `source/weekend/` (chunked)
- **Data:** `f1-results/2026/<round>.json`
- **Architecture note:** self-contained monolith (30KB+), now backed by a chunk set for safe edits

### Live Tracker — LIVE
- **Route:** `live-tracker.html`
- **Does:** Standalone OpenF1 companion. Timing tower, position changes, session status. Independent of main app routing.
- **Source:** `13_live_session_panel.js`

---

## Golden state (what's not there yet)

These are the planned surfaces and upgrades that make this app feel like race control instead of a results browser.

### Story Mode — IN PROGRESS
- **Where:** Results/Story toggle inside `weekend.html`
- **Does:** Scrubber-driven position ladder, starting-grid wheel-cards, pit lane timeline, team radio feed. Continuous-time replay of the race as an arc.
- **Status:** Reference build exists (`story-mode-reference.html`). Weekend chunk set exists. Splice into live `weekend.html` not yet done.
- **Blocked on:** Reassembly verification (confirm chunks round-trip clean before adding new code)
- **Spec:** `next-build-spec.md`

### Driver Arc Visualization — PLANNED
- **Where:** Driver popup (existing, on circuit/weekend pages)
- **Does:** Qualifying pos → grid → finish as a visual spine. Positions-gained signal. Penalty annotations from grid vs qualifying.pos mismatch. Steward narrative surfaced as headlines.
- **Status:** Data exists for all 9 rounds (Tier 1 complete). Pure render job, no new schema needed.
- **Spec:** Data-Story Layer doc §6

### Race Narrative Section — PLANNED
- **Where:** Circuit breakdown and/or weekend detail
- **Does:** Promotes `summary` and `stewardNote` (already in round JSON) into a visible "what happened and why" section. Race control tells you the story behind the order.
- **Status:** Data exists. Needs a render surface.

### Tyre Analysis Page — FUTURE
- **Where:** New standalone page
- **Does:** Compare compound characteristics across weekends. What actually differs between C3 and C4, with stint-length and degradation data.
- **Needs:** `tyre-compounds.json` (proposed, not built), Tier 3 data backfill
- **Spec:** Data-Story Layer doc §4B

### Season History View — FUTURE
- **Where:** TBD (possibly a lens on the home grid)
- **Does:** Cross-year comparison. Previous winners at each circuit, season-over-season performance.
- **Needs:** Per-season folder population beyond 2026

---

## Data Model

### Two data surfaces (by design)

| File | Role | Scope |
|------|------|-------|
| `data.json` | Persistent cross-year track reference | All 24 rounds, circuit metadata, maps, podium history, cuTaskId anchors |
| `f1-results/2026/<slug>.json` | Time-boxed season results | Per-round full classification, one file per completed race |
| `f1-results/2026/index_rounds.json` | Season manifest | Which rounds have data, version stamps, slugs |

### Per-round schema (enrichment tiers)

| Tier | Fields | Status |
|------|--------|--------|
| **1: Spine** | pos, driverId, driver, team, status, points, grid, qualifying {pos, q1, q2, q3}, onRoadPos | ✅ Complete r1–9 |
| **2: Race Pace** | fastLap {time, lap} per driver | ⚠️ Silverstone only; r1–8 need backfill (Pass A) |
| **3: Strategy** | tyres {stops, stints: [{compound, laps}]} + round-level tyreNomination | 🔒 Design locked, backfill held (Pass B) |
| **4: Color** | dnf {lap, reason}, finishGap ("+1.611" / "+1 lap") | Planned, cheap, high narrative payoff |

### The story model

Each driver's weekend is an arc across four position landmarks:

**qualifying.pos → grid → onRoadPos → pos**

- `qualifying.pos` = the slot they earned
- `grid` = where they started (after penalties)
- `onRoadPos` = where they crossed the line before post-race penalties (only stored when it differs)
- `pos` = final classified position

`positionsGained` = `grid - pos`, always DERIVED, never stored.

### Compute-once law

Store raw facts, derive everything else at render. Never hand-store a value computable from what's already in the file. A correction to one raw fact fixes every derived view.

- **Store:** per-stint compound + laps, round tyreNomination, fastLap {time, lap}, pos/grid/status/points, finishGap
- **Derive:** positionsGained, stop count, compound colour, stint lengths, cumulative gaps

### Proposed additions (not in repo)

- `f1-results/tyre-compounds.json` — 7 types (C1–C5, INT, WET), season-keyed
- Round-level `tyreNomination` — per-weekend compound-to-colour mapping (store absolute C-number, derive soft/med/hard label)

---

## Source Modules

### Main app (`source/`)

| File | Concern | Size | Notes |
|------|---------|------|-------|
| `app-shell.js` | Header/footer/nav chrome | 3.9KB | |
| `09_app_bootstrap_and_home.js` | Router + home grid | 26KB | ⚠️ Over budget, split candidate |
| `10_track_views_and_profile.js` | Circuit breakdown render | 18KB | ⚠️ Over budget |
| `11_weather_and_footer_exports.js` | Weather + export tools | 11KB | |
| `12_results_store.js` | Results data fetch/cache | 2.9KB | |
| `13_live_session_panel.js` | OpenF1 live session | 10.5KB | |
| `14_weekend_state_and_data.js` | Weekend state/schedule/replay | 11KB | |
| `15_weekend_surface_render.js` | Weekend panels + current-round card | 15KB | ⚠️ At split line |
| `16_weekend_live_mode.js` | OpenF1 live hydration | 5.8KB | |
| `17_weekend_mount.js` | Weekend lifecycle/mount | 4.2KB | |
| `18_home_and_mobile_polish.js` | Mobile polish/table fixes | 1.5KB | |

### Sub-surfaces (chunked)
- `source/standings/` — standings page modules
- `source/weekend/` — weekend.html chunk set (base.css, panels.css, story.css, data.js, render.js, nav.js, story.js)

### Budget rule
~10–12KB target per module. 15KB = split now. Over 30KB = never round-trip through a single read. `09` is the worst offender and the next structural split candidate.

---

## Priority Queue

What to build next, in order:

1. **Pass A: fastLap backfill r1–8** — data-only PR, single source (F1.com /fastest-laps per race page)
2. **Driver arc visualization** — pure render on existing Tier 1 data, biggest UX upgrade for zero schema work
3. **Race narrative section** — surface `summary` + `stewardNote` as visible race story, not buried in JSON
4. **Tier 4: dnf + finishGap** — cheap data dig, high narrative payoff
5. **Story Mode splice** — reassemble weekend.html from chunks, verify round-trip, splice reference build
6. **Tyres Pass B** — when Michael calls it; design locked, execution held
7. **Source split: 09_app_bootstrap** — structural health, no user-facing change

---

## Related Docs

These files carry detail that this README points at but doesn't duplicate:

| File | What it holds | Status |
|------|---------------|--------|
| `next-build-spec.md` | Detailed spec for the current build cycle (Story Mode v6) | Needs rewrite to match priority queue |
| `story-mode-handoff.md` | Story Mode integration spec (toggle mechanism, data derivation, LOD tiers, theme) | Valid spec; blocker language outdated (chunk set now exists) |
| `schema-shift-handoff.md` | Original JSON-shape brainstorm from Jul 7 | Superseded by Data-Story Layer doc; retain for provenance |
| `story-mode-reference.html` | Working Story Mode build in weekend.html's exact tokens | Reference to splice from, not to reinvent |
| Data-Story Layer (ClickUp doc) | Field scope, sources, tyre model, refresh procedure, UI story layer plan | The cleanest and most current data spec |
| `source/source_index.md` | Source module descriptions | Should be verified against current file list |

---

## Architecture Rules (carry forward)

- **`index.html` is an INDEX.** Router/shell referencing pages. Never stores a full app.
- **Data nests inside its app.** `f1-racetracks/f1-results/2026/` — never a loose root folder.
- **Data-only changes = no shell version bump.** Refresh the store without touching the app code.
- **Two-artifact ship for over-cap files.** Running `index.html` + `source/` chunk set.
- **Mobile-first.** No horizontal overflow at 320px. Touch targets 44px. Fluid clamp/min/%.
- **Weekend hue-268 tokens throughout.** Chakra Petch + Inter + JetBrains Mono. 1px lines. The aesthetic is race control, not sports news.

---

## Links

- [Launch the app](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)
- [Live Tracker](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html)
- [Repo folder](https://github.com/mawizorek/ClickUp_apps/tree/main/f1-racetracks)
- [VERSIONS.md (app ledger)](https://github.com/mawizorek/ClickUp_apps/blob/main/VERSIONS.md)
