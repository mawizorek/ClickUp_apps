# F1 Racetracks

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)

![Launch](https://img.shields.io/badge/Launch-F1_Racetracks-red?style=for-the-badge)

**Status:** v5 live · source surface synced and judged · winners history backfilled through Monza · live tracker slice shipped

**Source of truth:** this repo folder

---

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Shipped Pages runtime artifact | Version bumps / reviewed engine changes |
| `data.json` | Runtime data manifest plus race-result, winners, and freshness metadata payload | Weekly / after each race via MCP |
| `live-tracker.html` | First OpenF1 live-session companion page | Feature/versioned when the live layer expands |
| `source/` | Canonical editable source surface for spot edits and future feature work | Primary edit surface |
| `next-build-spec.md` | Forward-looking build queue only | Clear/reset until new work is queued |

**What changed in the current runtime:**

- completed-race podium block added to finished rounds
- pole position card added for finished rounds when qualifying data exists
- winners history section added to every circuit view
- runtime data now lives in `data.json` instead of the monolith
- footer export saves the resolved app dataset, not only the track array
- live tracking shipped as the first OpenF1 slice via `live-tracker.html`

---

## What it does

A single self-contained HTML app holding every 2026 F1 circuit breakdown in one place. The index is the home screen (grid of all 24 rounds); each track is a hash-routed view inside the same app. One shared render engine plus one externalized data payload, so layout changes stay in the synced `/source` surface and weekly/live upkeep stays in `data.json`.

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
- A first live-tracking companion page that follows the latest OpenF1 session without destabilizing the main runtime

---

## How to use it

- Open the app → index grid shows all tracked rounds
- Click any enabled circuit card → full breakdown view
- Completed rounds surface podium + qualifying context near the top
- Active and upcoming report-ready rounds can still show historical winners even before the race is run
- Footer: Copy source / Prepare download / Open in new tab / Export data (.json)
- For the live slice, open [**Live Tracker**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html)

---

## Architecture

- **Aesthetic:** dark telemetry dashboard. Sectors S1 cyan / S2 violet / S3 gold, DRS green, elevation amber, Ferrari-red accent. Fonts: Space Grotesk + IBM Plex Mono.
- **Routing:** `#/` = home (index grid). `#/slug` = circuit view. `renderHome()` / `renderTrack()` / `renderSoon()` driven by `router()` on `hashchange`.
- **Runtime data load:** `index.html` fetches `data.json`, resolves the grouped track source files listed there, then caches the resolved payload in `localStorage` for offline fallback.
- **Spot-edit workflow:** use `/source` first. The runtime artifact is no longer the thing agents should have to reconstruct just to make normal edits.
- **Completed-race panels:** podium / pole / history all render from the `raceResults` and `historicWinners` objects in `data.json`.
- **Live-tracking slice:** `live-tracker.html` is the first OpenF1-backed feature. It intentionally shipped as a companion page first so live tracking could go out immediately while the source sync was completed.
- **Source scaffold:** `source/` now reflects the current v5 runtime structure (boot/home logic, track-page logic, footer/export logic, results/mobile delta styles, and live-tracker companion helpers).
- **Shared engine:** `buildProfile()` (lap-profile chart), `loadWeather()` (live Open-Meteo fetch), table + panel renderers. Change the engine once, every track updates.
- **Maps:** official Wikimedia outline via `Special:FilePath/`; `onerror` shows the filename for debugging.
- **No looping animation;** hover / entry motion only.

---

## Version history

- **v5** — completed-race podium card, pole panel, winners history board, richer external data payload
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

- decide whether the next OpenF1 step folds the live slice into the main runtime or grows the companion surface first
- build the remaining 8 circuit breakdowns (Baku → Abu Dhabi)
- persist last-viewed circuit + add keyboard left / right between rounds
- split oversized grouped data source files under the 15 KB hard threshold
