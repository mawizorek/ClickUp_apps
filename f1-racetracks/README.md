# F1 Racetracks

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)

[![Launch](https://img.shields.io/badge/%E2%96%B6%EF%B8%8E_Launch_the_app-e00000?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)

---

**Status:** v4 shipped · migrating into the repo (source of truth transition in progress).
**Live:** https://mawizorek.github.io/ClickUp_apps/f1-racetracks/
**Source of truth:** this repo folder. The `index.html` here is the app; commit history is the changelog.

> ⚠️ **Migration note (2026-07-01):** the current `index.html` is a **placeholder scaffold**. The full self-contained v4 app (~124KB) has not yet been committed. It will be replaced either by a direct drag-drop of the saved app file, or reassembled from a `source/` chunk set. Until then, the live launch link renders the placeholder, not the real app.

---

## What it does

A single self-contained HTML file that holds **every 2026 F1 circuit breakdown in one app**. The index is the home screen; each track is a view inside the same app via hash routing. One shared render engine + one `TRACKS` data array, so a layout change applies to **all** circuits at once. It replaces the old one-file-per-track approach.

Each circuit breakdown includes: official Wikimedia circuit map, lap profile with elevation, DRS zones and sectors, pit and tyre strategy, overtaking analysis, corner notes, and live weather (Open-Meteo).

Aesthetic: dark telemetry dashboard. Sectors S1 cyan / S2 violet / S3 gold, DRS green, elevation amber, Ferrari-red accent. Fonts: Space Grotesk + IBM Plex Mono. No looping animation; hover/interaction only.

**Build status:** 14 of 24 rounds built as full breakdowns (Australia, China, Japan, Miami, Canada, Monaco, Spain/Catalunya, Austria, Britain/Silverstone, Belgium/Spa, Hungary, Netherlands/Zandvoort, Italy/Monza, Spain/Madrid). 8 remaining are stubbed as "Soon" cards (Baku → Abu Dhabi).

## How to use it

- **Launch** via the link at the top (opens live on GitHub Pages).
- **Offline:** the app is offline-first. Right-click → Save As to keep a local copy; double-click the saved file and it runs, no host needed.
- **Navigate:** the home grid lists all rounds. Click a circuit to open its full breakdown. URL hash routes: `#/` = home, `#/<slug>` = a circuit view.
- **Export:** footer toolbar offers Copy source, Prepare download, Open in new tab, and Export data (`.json`) for the `TRACKS` array.

## Architecture (critical infrastructure notes)

- **One file.** All CSS + JS inline. External deps: Google Fonts, D3 (auto-injected), Lucide icons.
- **Routing:** `#/` = home (index grid). `#/<slug>` = that circuit's view. `renderHome()` / `renderTrack()` / `renderSoon()` driven by `router()` on `hashchange`.
- **Data:** the `TRACKS` array is the single source of truth. Each entry has `slug, round, gp, flag, date, status, report` plus (when `report:true`) the full data block: meta, map file, lap profile (`profile` elevation points, `drs`, `marks`, `sectorsBar`), `sectors`, `pit`, `tyres`/`tyreAlloc`/`strat`, overtaking (`otScore/otWord/otPct/spots/otNote`), `corners`, `geo`, and weather config (`lat/lng/tz/sessions`).
- **Shared engine:** `buildProfile()` (lap-profile chart where the sector bar is the x-axis), `loadWeather()` (live Open-Meteo fetch, re-runs on every view open), plus table + panel renderers. Change the engine once, every track updates.
- **Footer toolbar (source export, v4):** Copy source (clipboard — the reliable sandbox path), Prepare download (reveals a real `<a download>` Save link), Open in new tab (raw source as text/plain to escape the sandbox), plus Export data (.json). Blob built only on click, revoked after ~90s, never parked in the DOM (this kills the old footer-source-leak failure mode).
- **Maps:** official Wikimedia outline via `Special:FilePath/<file>`; `onerror` prints the filename on a blank plate so a bad file is obvious. Never hand-trace (layout drift was rejected). Always confirm a circuit's exact Commons filename via `Special:FilePath` before shipping.
- **Accuracy caveats:** per-sector times and elevation shapes are **approximate** (labelled in-app). Pole/record figures are **real**. Madring is inaugural (no race data): lap record, tyre allocation, stops, and overtaking are flagged TBC/provisional in-app.

### How to add / edit a circuit

1. Research the swap fields (FIA event notes for DRS/pit, Pirelli for tyres, circuit guide for corners/elevation, Wikimedia for the map file).
2. Add or edit that circuit's object in `TRACKS`. Set `report:true` and fill the full block. Keep the engine untouched.
3. Regenerate via the DESIGN-UI skill, commit the updated `index.html`.
4. Verify the map renders and the profile/weather load.

Reference spec: **Circuit Breakdown Report — Brain Reference (Generator Tool)** in the Formula 1 reference library.

## Version history

Commit history is authoritative. Highlights:

- **v4** — standalone offline-first build; footer source-export trio (Copy source / Prepare download / Open in new tab) + Export data (.json), sandbox-safe blob-on-click. Same 14 breakdowns as v3.
- **v3** — +4 circuits (Hungary, Netherlands, Italy, Spain/Madrid); 14 of 24 built.
- **v2** — fixed four wrong Wikimedia map filenames that showed blank plates.
- **v1** — initial single-file app: 10 breakdowns, index + hash-routed track views.

## Related

- **ClickUp task (APPS list):** F1 Racetracks — circuit breakdown app (living spec + next-build brief).
- **Revision History doc:** append-only per-version working-notes trail (page 1 = locked goals/constraints).
- **Weekly refresh:** F1 Weekly Refresh — Brain Operations Guide (Step 4 covers the app pass).

## Roadmap

- Build the remaining 8 breakdowns (Baku → Abu Dhabi) ahead of each weekend; stay at least one round ahead.
- Persist last-viewed circuit (localStorage) + keyboard ←/→ between rounds.
- Optional: in-view mini standings, historic winners, or a track-record trend chart.
