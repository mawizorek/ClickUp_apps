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

## Page Hierarchy

### `index.html` — THE MAIN WINDOW

The app shell. Header with lens toggle, router, footer. Everything inside it is a view, not a separate page. This is what you're looking at when the app is open.

```
index.html
├── Header (lens switcher: Matrix / History / Circuits)
├── #/ ..................... Home Grid
│   ├── Current-round highlight card
│   └── 24-round card grid (filtered by active lens)
│
├── #/<slug> ............... Circuit Breakdown
│   ├── Track map + lap profile + sector character
│   ├── Tyre strategy + overtaking notes
│   ├── Weather
│   ├── Race history (podium/winners)
│   ├── Weekend Center
│   │   ├── Schedule tab
│   │   ├── Live tab (OpenF1 hydration during sessions)
│   │   └── Replay tab (post-race)
│   └── Driver Popup (tap a driver → per-driver detail)
│       ├── Position + team + fast lap
│       ├── Qualifying times
│       └── 🟡 Arc Visualization (PLANNED: grid→finish spine)
│
└── Footer (source tools, export, new-tab)
```

**Source:** `app-shell.js`, `09_app_bootstrap_and_home.js`, `10_track_views_and_profile.js`, `11_weather_and_footer_exports.js`, `14-17_weekend_*.js`, `18_home_and_mobile_polish.js`  
**Data:** `data.json`, `circuits/<slug>.json`, `f1-results/2026/<slug>.json`

---

### `weekend.html` — RACE DETAIL (drilldown from Weekend Center)

The deep-dive into a single completed race. Reached from the circuit breakdown's Weekend Center. Self-contained (30KB+ monolith, backed by `source/weekend/` chunk set).

```
weekend.html
├── Race Mast (round name, date, circuit)
├── Mode Toggle: Results / Story
│
├── Results (default, LIVE)
│   ├── Podium panel
│   ├── Pole position
│   ├── Fastest lap
│   ├── Starting grid
│   ├── Qualifying tiers (Q1/Q2/Q3 eliminations)
│   ├── Sprint classification (sprint weekends)
│   ├── Full race classification (20 cars)
│   ├── Championship swing
│   └── Driver Popup → per-driver race detail
│       ├── Position, grid, qualifying times, fast lap
│       ├── 🟡 Arc Visualization (PLANNED)
│       ├── 🟡 Race Narrative: stewardNote + summary (PLANNED)
│       ├── 🔒 Strategy row: stint chips (Tier 3, HELD)
│       └── 🟡 DNF/gap detail (Tier 4, PLANNED)
│
└── Story (IN PROGRESS)
    ├── Position ladder (scrubber-driven, continuous-time)
    ├── Timing tower
    ├── Starting-grid wheel-cards
    ├── Pit lane timeline
    └── Team radio feed
```

**Source:** `source/weekend/` (base.css, panels.css, story.css, data.js, render.js, nav.js, story.js)  
**Data:** `f1-results/2026/<round>.json`  
**Story ref build:** `story-mode-reference.html` (splice from this, don't reinvent)

---

### Satellite Pages (standalone, linked from header/nav)

Separate HTML files with their own rendering. Not views inside index.html.

#### `standings.html` — LIVE
```
standings.html
├── Drivers Championship (ranked table, cumulative points, delta)
└── Constructors Championship (team totals, driver splits)
```
**Source:** `source/standings/` (chunked)  
**Data:** `f1-results/2026/index_rounds.json` + all round files

#### `circuits.html` — LIVE
```
circuits.html
└── Circuit listing (country, length, laps, type)
    └── Each entry links back to index.html#/<slug>
```
**Data:** `data.json`  
Alt-entry to the hash-routed circuit views. Useful as a directory.

#### `live-tracker.html` — LIVE
```
live-tracker.html
└── OpenF1 companion (timing tower, position changes, session status)
```
**Source:** `13_live_session_panel.js`  
Standalone. Not part of main nav. Used during live sessions for the broader view.

---

### Future Pages (no code yet)

#### Tyre Analysis — FUTURE
```
(new page TBD)
└── Compound comparison across weekends
    ├── C1-C5 characteristics + stint data
    └── Per-weekend nomination context
```
**Needs:** `tyre-compounds.json`, Tier 3 backfill  
**Spec:** Data-Story Layer doc §4B

#### Season History — FUTURE
```
(lens on home grid, or new page TBD)
└── Cross-year comparison
    ├── Previous winners per circuit
    └── Season-over-season performance
```
**Needs:** Per-season folder population beyond 2026

---

## Status Key

- **LIVE** = shipped, working
- **IN PROGRESS** = reference/spec exists, integration not done
- 🟡 **PLANNED** = data exists, render surface not built
- 🔒 **HELD** = design locked, execution waiting on Michael's call
- **FUTURE** = needs new data + new page

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
| **1: Spine** | pos, driverId, driver, team, status, points, grid, qualifying {pos, q1, q2, q3}, onRoadPos | ✅ Complete r1-9 |
| **2: Race Pace** | fastLap {time, lap} per driver | ⚠️ Silverstone only; r1-8 need backfill (Pass A) |
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

Store raw facts, derive everything else at render. Never hand-store a value computable from what's already in the file.

- **Store:** per-stint compound + laps, round tyreNomination, fastLap {time, lap}, pos/grid/status/points, finishGap
- **Derive:** positionsGained, stop count, compound colour, stint lengths, cumulative gaps

### Proposed additions (not in repo)

- `f1-results/tyre-compounds.json` — 7 types (C1-C5, INT, WET), season-keyed
- Round-level `tyreNomination` — per-weekend compound-to-colour mapping

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
~10-12KB target per module. 15KB = split now. Over 30KB = never round-trip through a single read. `09` is the worst offender.

---

## Priority Queue

What to build next, in order:

1. **Pass A: fastLap backfill r1-8** — data-only PR, single source (F1.com /fastest-laps)
2. **Driver arc visualization** — pure render on existing Tier 1 data, biggest UX upgrade
3. **Race narrative section** — surface summary + stewardNote as visible story
4. **Tier 4: dnf + finishGap** — cheap data dig, high narrative payoff
5. **Story Mode splice** — reassemble weekend.html, verify round-trip, splice reference
6. **Tyres Pass B** — when Michael calls it
7. **Source split: 09_app_bootstrap** — structural health, no user-facing change

---

## Related Docs

| File | What it holds | Status |
|------|---------------|--------|
| `next-build-spec.md` | Detailed spec for Story Mode v6 cycle | Needs rewrite to match priority queue |
| `story-mode-handoff.md` | Story integration spec (toggle, data derivation, LOD, theme) | Valid; blocker language outdated |
| `schema-shift-handoff.md` | Original JSON-shape brainstorm (Jul 7) | Superseded by Data-Story Layer doc |
| `story-mode-reference.html` | Working Story Mode in weekend.html's exact tokens | Splice from this |
| Data-Story Layer (ClickUp doc) | Field scope, sources, tyre model, refresh procedure | Cleanest current data spec |

---

## Architecture Rules

- **`index.html` is the app shell.** Router + header + footer. Views render inside it.
- **Satellites are separate HTML files** with their own render, linked from nav.
- **Data nests inside its app.** `f1-racetracks/f1-results/2026/` — never a loose root folder.
- **Data-only changes = no shell version bump.**
- **Two-artifact ship for over-cap files.** Running file + `source/` chunk set.
- **Mobile-first.** No overflow at 320px. Touch targets 44px. Fluid sizing.
- **Weekend hue-268 tokens.** Chakra Petch + Inter + JetBrains Mono. 1px lines. Race control, not sports news.

---

## Links

- [Launch the app](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)
- [Live Tracker](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html)
- [Repo folder](https://github.com/mawizorek/ClickUp_apps/tree/main/f1-racetracks)
- [VERSIONS.md (app ledger)](https://github.com/mawizorek/ClickUp_apps/blob/main/VERSIONS.md)
