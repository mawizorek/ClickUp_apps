# F1 Racetracks

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)

![Launch](https://img.shields.io/badge/Launch-F1_Racetracks-red?style=for-the-badge)

**Status:** v5 full spec in review · safe data split + podium / pole / winners panels

**Source of truth:** this repo folder

**ClickUp task:** F1 Racetracks — circuit breakdown app (APPS list)

---

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | App engine (UI, routing, render logic, styling) | Version bumps only |
| `data.json` | Runtime data manifest plus race-result / winners payload | Weekly / after each race via MCP |
| `source/` | Semantic source scaffold (shell, styles, grouped data, logic) | Maintained with engine changes |
| `next-build-spec.md` | Current build spec for the next version | Overwritten each version cycle |

**What changed in this PR:**

- completed-race podium block added to finished rounds
- pole position card added for finished rounds when qualifying data exists
- winners history section added to every circuit view
- external data payload now carries podium / pole / history content
- footer export now saves the resolved app dataset, not only the track array

---

## What it does

A single self-contained HTML app holding every 2026 F1 circuit breakdown in one place. The index is the home screen (grid of all 24 rounds); each track is a hash-routed view inside the same app. One shared render engine plus one externalized data payload, so layout changes stay in `index.html` and data refreshes stay in `data.json`.

**Per-circuit breakdown includes:**

- Lap profile chart with elevation, DRS zones, sector splits
- Tyre allocation + strategy analysis
- Pit lane data (entry/exit, loss time, windows)
- Overtaking analysis (score, hotspots, historical %)
- Corner guide (name, type, gear, speed)
- Live weather (Open-Meteo, keyless, fetched on view)
- Official Wikimedia circuit map
- Podium graphic with P1 / P2 / P3 for completed races
- Pole breakdown panel
- Winners history board

---

## How to use it

- Open the app → index grid shows all tracked rounds
- Click any enabled circuit card → full breakdown view
- Completed rounds now surface podium + qualifying context near the top
- Winners history sits lower on every circuit view and is updated from `data.json`
- Footer: Copy source / Prepare download / Open in new tab / Export data (.json)

---

## Architecture

- **Aesthetic:** dark telemetry dashboard. Sectors S1 cyan / S2 violet / S3 gold, DRS green, elevation amber, Ferrari-red accent. Fonts: Space Grotesk + IBM Plex Mono.
- **Routing:** `#/` = home (index grid). `#/slug` = circuit view. `renderHome()` / `renderTrack()` / `renderSoon()` driven by `router()` on `hashchange`.
- **Runtime data load:** `index.html` fetches `data.json`, resolves the grouped track source files listed there, then caches the resolved payload in `localStorage` for offline fallback.
- **Completed-race panels:** podium / pole / history all render from the `raceResults` and `historicWinners` objects in `data.json`.
- **Source scaffold:** `source/` holds named shell/style/logic files and grouped data files so the app no longer depends on the runtime monolith as its only readable source surface.
- **Shared engine:** `buildProfile()` (lap-profile chart), `loadWeather()` (live Open-Meteo fetch), table + panel renderers. Change the engine once, every track updates.
- **Maps:** official Wikimedia outline via `Special:FilePath/`; `onerror` shows the filename for debugging.
- **No looping animation;** hover / entry motion only.

---

## Version history

- **v5** (in review) — completed-race podium card, pole panel, winners history board, richer external data payload
- **v5 safe split** — runtime pulled track data out of the monolith and into the external payload path
- **v4.1 source scaffold** — semantic source scaffold added under `source/` for reliable agent editing; runtime unchanged
- **v4** — standalone offline-first build; footer source-export trio + Export data (.json), sandbox-safe
- v3 — +4 circuits (Hungary, Netherlands, Italy, Spain / Madrid); 14 of 24 built
- v2 — fixed four wrong Wikimedia map filenames
- v1 — initial single-file app: 10 circuit breakdowns, index + hash-routed track views

---

## Related

- **ClickUp task:** F1 Racetracks — circuit breakdown app (APPS list)
- **F1 Weekly Refresh guide:** Brain Reference Library > Formula 1
- **Generator spec:** Circuit Breakdown Report — Brain Reference (Generator Tool)

---

## Roadmap

- backfill deeper historic winners sets in `data.json`
- build the remaining 8 circuit breakdowns (Baku → Abu Dhabi)
- persist last-viewed circuit + add keyboard left / right between rounds
- split oversized grouped data source files under the 15 KB hard threshold
