# F1 Racetracks

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)

![Launch](https://img.shields.io/badge/Launch-F1_Racetracks-red?style=for-the-badge)

**Status:** v4 shipped · semantic source companion added · v5 spec committed

**Source of truth:** this repo folder

**ClickUp task:** F1 Racetracks — circuit breakdown app (APPS list)

---

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | App engine (UI, routing, render logic, styling) | Version bumps only |
| `data.json` | Living dataset (tracks, race results, historic winners, pole data) | Weekly / after each race via MCP |
| `source/` | Semantic source companion (head, shell, styles, data groups, view logic) | Maintained with engine changes |
| `next-build-spec.md` | Current build spec for the next version | Overwritten each version cycle |

**What "update the app" means here:**

- Updating race results, standings, or track data → commit `data.json` only. No version bump.
- Adding features, changing layout, fixing bugs → update `index.html` via the two-agent workflow. Version bump.
- Editing the agent-readable source structure → update `source/` in the same PR as the related engine change when possible.

> **Note:** v4 (current) is still a single-file app with data inline. v5 introduces the data separation. Once v5 ships, the above routing applies.

---

## What it does

A single self-contained HTML app holding every 2026 F1 circuit breakdown in one place. The index is the home screen (grid of all 24 rounds); each track is a hash-routed view inside the same app. One shared render engine + one data array, so a layout change applies to all circuits at once.

**Per-circuit breakdown includes:**

- Lap profile chart with elevation, DRS zones, sector splits
- Tyre allocation + strategy analysis
- Pit lane data (entry/exit, loss time, windows)
- Overtaking analysis (score, hotspots, historical %)
- Corner guide (name, type, gear, speed)
- Live weather (Open-Meteo, keyless, fetched on view)
- Official Wikimedia circuit map
- Podium graphic with P1/P2/P3 (completed races, v5)
- Pole breakdown panel (v5)
- Historic winners section (v5)

---

## How to use it

- Open the app → index grid shows all 24 rounds
- Click any circuit card → full breakdown view
- Completed races show with a checkmark; upcoming races show date
- "Soon" stubs route to a coming-soon view until the breakdown is built
- Footer: Copy source / Prepare download / Open in new tab / Export data (.json)

---

## Architecture

- **Aesthetic:** dark telemetry dashboard. Sectors S1 cyan / S2 violet / S3 gold, DRS green, elevation amber, Ferrari-red accent. Fonts: Space Grotesk + IBM Plex Mono.
- **Routing:** `#/` = home (index grid). `#/<slug>` = circuit view. `renderHome()` / `renderTrack()` / `renderSoon()` driven by `router()` on `hashchange`.
- **Data (v4):** inline `TRACKS` array is the single source of truth. Each entry has slug, round, gp, flag, date, status, report, plus full data block when report:true.
- **Data (v5+):** `fetch('./data.json')` on load with localStorage offline cache. The TRACKS array + race results + historic winners live in the JSON file.
- **Source companion:** `source/` now mirrors the runtime by concern — shell, styles, grouped track data, home/bootstrap logic, track-view/profile logic, and weather/footer-export logic. This is the preferred agent read/edit surface.
- **Shared engine:** `buildProfile()` (lap-profile chart), `loadWeather()` (live Open-Meteo fetch), table + panel renderers. Change the engine once, every track updates.
- **Maps:** official Wikimedia outline via `Special:FilePath/`; `onerror` shows the filename for debugging.
- **No looping animation;** hover/interaction only.
- **External deps:** Google Fonts, D3 (auto-injected), Lucide icons.

---

## Version history

- **v5** (in progress) — data separation (`data.json`), podium graphic, pole breakdown, historic winners section
- **v4.1 source companion** — semantic source companion added under `source/` for reliable agent editing; runtime unchanged
- **v4** — standalone offline-first build; footer source-export trio + Export data (.json), sandbox-safe
- v3 — +4 circuits (Hungary, Netherlands, Italy, Spain/Madrid); 14 of 24 built
- v2 — fixed four wrong Wikimedia map filenames
- v1 — initial single-file app: 10 breakdowns, index + hash-routed track views

---

## Related

- **ClickUp task:** F1 Racetracks — circuit breakdown app (APPS list)
- **F1 Weekly Refresh guide:** Brain Reference Library > Formula 1
- **Generator spec:** Circuit Breakdown Report — Brain Reference (Generator Tool)
- **Data source:** F1 Drivers list (race result dropdowns), F1 Races list (race award comments)

---

## Roadmap

- Build remaining 8 circuit breakdowns (Baku → Abu Dhabi)
- Persist last-viewed circuit (localStorage) + keyboard ←/→ between rounds
- Ship v5 data separation (`data.json`) and completed-race history blocks
- Remove legacy plaintext migration chunks from `source/` once the semantic companion is fully trusted