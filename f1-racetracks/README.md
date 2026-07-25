# F1 Racetracks

> **The app plan.** Load this at the start of every build session.  
> One file answers: what screens exist, what data feeds them, what's not done yet.

**Live:** https://mawizorek.github.io/ClickUp_apps/f1-racetracks/  
**Source of truth:** this repo folder  
**Shell version:** v6.7 | **Data:** 2026-07-23c (9 rounds)

---

## What this app is

A browser-based 2026 F1 race-control companion. Circuit breakdowns, live weekend integration, full championship standings, and per-race deep-dive results, all driven by a structured per-round JSON store designed to grow into lap times, telemetry, and strategy data.

Not a results table. A race story told through data.

---

## Screens (the Layout tab)

What screens exist, what data context each sits on, and how you navigate between them.

```
index.html — MAIN WINDOW (app shell + router)
│
├── [Matrix] lens (default) ......... Home grid, calendar order, result summaries
├── [History] lens .................. Home grid, race-history framing, past winners
├── [Circuits] lens ................. Home grid, technical reference (length/laps/type)
│       │
│       └── tap any round card →
│
├── Circuit Breakdown (#/<slug>) .... Per-circuit deep view
│   │   Context: ROUNDS + CIRCUITS (joined on slug)
│   │
│   ├── Weekend Center .............. Schedule / Live / Replay tabs
│   │       │
│   │       └── drill into completed race → weekend.html
│   │
│   └── Driver Popup ................ Per-driver detail overlay
│           Context: CLASSIFICATIONS (filtered to this round)
│           🟡 Arc Visualization here (PLANNED)
│
└── Footer
```

```
weekend.html — RACE DETAIL
│   Context: CLASSIFICATIONS (full round, all 20 drivers)
│   Reached from: Circuit Breakdown → Weekend Center
│
├── Results mode (default, LIVE) .... 8 static panels + driver popup
│       🟡 Arc Visualization in popup (PLANNED)
│       🟡 Race Narrative in popup (PLANNED)
│       🔒 Strategy row in popup (HELD)
│       🟡 DNF/gap detail in popup (PLANNED)
│
└── Story mode (IN PROGRESS) ....... Scrubber-driven race replay
        Ref build: story-mode-reference.html
```

```
standings.html — CHAMPIONSHIP STANDINGS (satellite)
    Context: CLASSIFICATIONS (all rounds, aggregated by driverId/team)
    Reached from: header nav link
```

```
circuits.html — CIRCUIT DIRECTORY (satellite)
    Context: ROUNDS (summary fields only)
    Reached from: header nav link
    Links back to: index.html#/<slug>
```

```
live-tracker.html — LIVE SESSION COMPANION (standalone)
    Context: OpenF1 API (real-time, external)
    Reached from: direct link (not in main nav)
```

```
🟡 Tyre Analysis (FUTURE)
    Context: COMPOUNDS + STINTS
    Spec: Data-Story Layer doc §4B

🟡 Season History (FUTURE)
    Context: ROUNDS (multi-year)
    Possibly a new lens on home grid rather than a new page
```

---

## Schema (the Relationship Graph)

### Tables

| Table | Stored as | Records | Key | Role |
|-------|-----------|---------|-----|------|
| **ROUNDS** | `data.json` (rounds array) | 24 per season | `slug` | Card-face summary per circuit. Cross-year, persistent. |
| **CLASSIFICATIONS** | `f1-results/2026/<slug>.json` (classification array) | ~20 per round | `slug` + `driverId` | Per-driver race result. Time-boxed per season. |
| **CIRCUITS** | `circuits/<slug>.json` | 1 per circuit | `slug` | Track geometry, sectors, character. Static reference. |
| **INDEX_ROUNDS** | `f1-results/2026/index_rounds.json` | 1 per completed round | `slug` | Season manifest: which rounds have data, version stamps. |
| 🟡 **COMPOUNDS** | `f1-results/tyre-compounds.json` (proposed) | 7 | `key` (C1-C5, INT, WET) | Tyre reference: hardness, character, use case. Season-keyed. |
| 🟡 **STINTS** | nested in CLASSIFICATIONS as `tyres.stints[]` | ~2-4 per driver per round | (parent driverId + stint index) | Per-stint compound + lap range. |

### Fields (CLASSIFICATIONS, the main working table)

| Field | Type | Tier | Status |
|-------|------|------|--------|
| `pos` | int (null = DNF) | 1 | ✅ |
| `driverId` | string (ClickUp task ID) | 1 | ✅ |
| `driver` | string | 1 | ✅ |
| `team` | string | 1 | ✅ |
| `status` | enum (FIN/DNF/DNS/DSQ) | 1 | ✅ |
| `points` | number | 1 | ✅ |
| `grid` | int or "PL" | 1 | ✅ |
| `qualifying` | object {pos, q1, q2, q3} | 1 | ✅ |
| `onRoadPos` | int (only when ≠ pos) | 1 | ✅ |
| `fastLap` | object {time, lap} | 2 | ⚠️ r9 only |
| `stewardNote` | string | 1 | ✅ (where relevant) |
| `tyres` | object {stops, stints[]} | 3 | 🔒 design locked |
| `dnf` | object {lap, reason} | 4 | 🟡 planned |
| `finishGap` | string ("+1.611" / "+1 lap") | 4 | 🟡 planned |

### Relationships

```
ROUNDS ────< CLASSIFICATIONS     (one round has many driver results)
  key: slug

ROUNDS ───── CIRCUITS            (one round sits on one circuit)
  key: slug

CLASSIFICATIONS >---< ROUNDS      (same driverId across rounds = season arc)
  key: driverId (self-join across round files)

CLASSIFICATIONS ──< STINTS       (one driver result has many stints)
  key: parent record

STINTS >---- COMPOUNDS             (each stint references one compound)
  key: compound → COMPOUNDS.key
  Resolved via round-level tyreNomination for display colour
```

### Screen Contexts (which screens consume which tables)

| Screen | Primary table | Joins |
|--------|--------------|-------|
| Home Grid (all 3 lenses) | ROUNDS | none (summary fields only) |
| Circuit Breakdown | ROUNDS | CIRCUITS (track detail), CLASSIFICATIONS (race results) |
| Driver Popup | CLASSIFICATIONS | filtered to one round + one driver |
| Weekend Race Detail | CLASSIFICATIONS | full round (all drivers), joined to ROUNDS for round-level fields |
| Standings | CLASSIFICATIONS | aggregated across all rounds by driverId and team |
| Circuits Directory | ROUNDS | summary fields only |
| Live Tracker | (external: OpenF1) | none |
| 🟡 Tyre Analysis | COMPOUNDS + STINTS | joined via compound key |

### Compute-once law

Store raw facts, derive everything else at render. A correction to one stored field fixes every derived view.

- **Store:** pos, grid, qualifying, fastLap, compound + laps per stint, tyreNomination (round-level), finishGap, status, points
- **Derive:** positionsGained (`grid - pos`), stop count (`stints.length - 1`), compound colour (via tyreNomination lookup), stint lengths, cumulative gaps, championship points totals

### The story model (the arc)

**qualifying.pos → grid → onRoadPos → pos**

Four position landmarks per driver per round. The movement between them IS the story. Everything else (fast lap, strategy, DNF, penalties) is texture on that arc.

---

## Status Key

- **LIVE** = shipped, working
- **IN PROGRESS** = reference/spec exists, integration not done
- 🟡 **PLANNED** = data exists or spec exists, not built
- 🔒 **HELD** = design locked, execution waiting on Michael's call
- **FUTURE** = needs new data + new screen

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
- **The 3 lenses (Matrix/History/Circuits) are the primary nav.** They filter the home grid; tapping a card drills into the circuit breakdown.
- **Satellites are separate HTML files** with their own render, linked from nav.
- **Data nests inside its app.** `f1-racetracks/f1-results/2026/` — never a loose root folder.
- **Data-only changes = no shell version bump.**
- **Two-artifact ship for over-cap files.** Running file + `source/` chunk set.
- **Mobile-first.** No overflow at 320px. Touch targets 44px. Fluid sizing.
- **Weekend hue-268 tokens.** Chakra Petch + Inter + JetBrains Mono. 1px lines. Race control, not sports news.
- **No file renames for schema alignment.** The documentation IS the translation layer. `data.json` = ROUNDS, stated once, understood everywhere.

---

## Links

- [Launch the app](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)
- [Live Tracker](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html)
- [Repo folder](https://github.com/mawizorek/ClickUp_apps/tree/main/f1-racetracks)
- [VERSIONS.md (app ledger)](https://github.com/mawizorek/ClickUp_apps/blob/main/VERSIONS.md)
