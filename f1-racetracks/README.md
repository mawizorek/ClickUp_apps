# F1 Racetracks

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)

![Launch](https://img.shields.io/badge/Launch-F1_Racetracks-red?style=for-the-badge)

**Status:** v5 live · properly demonolithized runtime structure · source surface synced and judged · main-app live session panel added · winners history backfilled through Monza

**Source of truth:** this repo folder

---

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Slim shipped Pages entrypoint that wires together the runtime modules | Rare structural changes only |
| `data.json` | Runtime data manifest plus race-result, winners, and freshness metadata payload | Weekly / after each race via MCP |
| `live-tracker.html` | Standalone OpenF1 live-session companion page | Iterated when the live layer expands |
| `source/` | Canonical editable source surface for spot edits and future feature work | Primary edit surface |
| `next-build-spec.md` | Forward-looking build queue only | Clear/reset until new work is queued |

**What changed in the current runtime:**

- completed-race podium block added to finished rounds
- pole position card added for finished rounds when qualifying data exists
- winners history section added to every circuit view
- runtime data now lives in `data.json`
- live tracking shipped as the first OpenF1 slice via `live-tracker.html`
- the main app runtime is loaded from modular files in `/source`, with `index.html` reduced to a slim fireable entrypoint
- matching circuit pages now show an integrated live session card with OpenF1 status, top running order, and race-control context

---

## What it does

A single browser app holding every 2026 F1 circuit breakdown in one place. The index is the home screen (grid of all 24 rounds); each track is a hash-routed view inside the same app. One shared render engine plus one externalized data payload, so layout changes stay in the synced `/source` surface and weekly/live upkeep stays in `data.json`.

**Per-circuit breakdown includes:**

- Lap profile chart with elevation, DRS zones, sector splits
- Tyre allocation + strategy analysis
- Pit lane data (entry/exit, loss time, windows)
- Overtaking analysis (score, hotspots, historical %)
- Corner guide (name, type, gear, speed)
- Live weather (Open-Meteo, keyless, fetched on view)
- Official Wikimedia circuit map
- Podium graphic with P1 / P2 / P3 for completed races
- Pole breakdown panel for rounds with qualifying data
- Winners history board, backfilled through the current report-ready stretch from Silverstone to Monza
- Integrated OpenF1 live session panel on matching circuit pages
- Standalone live tracker companion page for the wider session view

---

## How to use it

- Open the app → index grid shows all tracked rounds
- Click any enabled circuit card → full breakdown view
- Completed rounds surface podium + qualifying context near the top
- If OpenF1 has a current/recent matching session for the viewed circuit, the page shows a live session card with status, top running order, and recent race-control messages
- Active and upcoming report-ready rounds can still show historical winners even before the race is run
- Footer: Live tracker / Copy source / Prepare download / Open in new tab / Export data (.json)
- For the wider session view, open [**Live Tracker**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html)

---

## Architecture

- **Aesthetic:** dark telemetry dashboard. Sectors S1 cyan / S2 violet / S3 gold, DRS green, elevation amber, Ferrari-red accent. Fonts: Space Grotesk + IBM Plex Mono.
- **Routing:** `#/` = home (index grid). `#/slug` = circuit view. `renderHome()` / `renderTrack()` / `renderSoon()` driven by `router()` on `hashchange`.
- **Runtime structure:** the app is not a giant monolithic runtime file. `index.html` is a slim entrypoint that loads runtime styles and JS directly from `/source` plus data from `data.json`.
- **Spot-edit workflow:** use `/source` first. The runtime entrypoint is not the primary editing surface.
- **Completed-race panels:** podium / pole / history all render from the `raceResults` and `historicWinners` objects in `data.json`.
- **Live-tracking integration:** `13_live_session_panel.js` adds the first integrated OpenF1 slice inside the main circuit experience. `live-tracker.html` remains the standalone broader companion surface.
- **Shared engine:** `buildProfile()` (lap-profile chart), `loadWeather()` (live Open-Meteo fetch), live session panel renderers, table + panel renderers. Change the engine once, every track updates.
- **Maps:** official Wikimedia outline via `Special:FilePath/`; `onerror` shows the filename for debugging.
- **No looping animation;** hover / entry motion only.

---

## Version history

- **v5** — completed-race podium card, pole panel, winners history board, richer external data payload
- **v5 structural cleanup** — source surface synced, runtime demonolithized into a slim entrypoint plus modular source files
- **v5 live slice** — OpenF1 live tracker companion and matching-circuit live panel in the main app
- **v5 safe split** — runtime pulled track data out of the monolith and into the external payload path
- **v4.1 source scaffold** — initial semantic source scaffold added under `source/`
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

- decide whether the next OpenF1 step expands the in-page live panel or graduates more of the companion tracker into the main circuit view
- build the remaining 8 circuit breakdowns (Baku → Abu Dhabi)
- persist last-viewed circuit + add keyboard left / right between rounds
- split oversized grouped data source files under the 15 KB hard threshold
