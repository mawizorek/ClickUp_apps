# F1 Racetracks v5 — Build Spec

**Date:** 2026-07-02  
**Source chunk set:** `f1-racetracks/source/_index.md` (v4 baseline)  
**App task:** F1 Racetracks — circuit breakdown app (APPS list)  
**Live (v4):** https://mawizorek.github.io/ClickUp_apps/f1-racetracks/

---

## CORE ARCHITECTURAL CHANGE: Data Separation

The single biggest change in v5: **extract the `TRACKS` data array out of `index.html` into a standalone `data.json` file** in the same folder.

### New file structure

```
f1-racetracks/
  index.html      ← app engine (layout, render logic, styling). Rarely changes.
  data.json       ← TRACKS array + race results + historic winners. Updated weekly.
  README.md       ← (existing)
  source/         ← (existing chunk set, rebuild after v5 ships)
```

### How it works

- On load, `index.html` does `fetch('./data.json')` (same-origin on GitHub Pages, no CORS, no auth).
- Parsed JSON replaces what was the inline `TRACKS` constant.
- **Offline fallback:** after a successful fetch, cache the JSON in `localStorage`. On fetch failure (offline, `file://`), fall back to cached data. If no cache exists, show a friendly "Load data.json or connect to the internet" message.
- The app engine (`index.html`) only needs a new commit when features/layout change. Weekly data updates are just a `data.json` commit.

### data.json schema (top-level)

```json
{
  "version": "2026-07-02",
  "season": 2026,
  "tracks": [ ...existing TRACKS array objects... ],
  "raceResults": {
    "australia": { "winner": "Antonelli", "team": "Ferrari", "p2": "Hamilton", "p2Team": "Ferrari", "p3": "Russell", "p3Team": "Mercedes", "pole": { "driver": "Antonelli", "time": "1:15.096", "gapToP2": "+0.217" }, "fastestLap": { "driver": "Norris", "time": "1:19.813", "lap": 52 } },
    ...
  },
  "historicWinners": {
    "australia": [ { "year": 2024, "driver": "Sainz", "team": "Ferrari" }, { "year": 2023, "driver": "Verstappen", "team": "Red Bull" }, ... ],
    ...
  }
}
```

The `raceResults` and `historicWinners` keys are keyed by track slug (matching the existing `slug` field in each TRACKS object). Only tracks with `status: "done"` will have a `raceResults` entry. Every track gets a `historicWinners` entry (last ~10 years or whatever data is available).

---

## NEW FEATURE 1: Podium Graphic (completed races)

For any track with `status: "done"`, render a **podium block** near the top of the circuit view (after the header, before the lap profile).

### Visual spec

- Classic stepped podium shape: P1 center elevated highest, P2 left at medium height, P3 right at lowest.
- Each podium step shows:
  - Position badge (gold P1, silver P2, bronze P3)
  - Driver surname (bold, white)
  - Team name (smaller, colored with team's identity color)
- The podium block itself uses subtle gradients or depth to sell the 3D "steps" look. Keep it in the dark telemetry aesthetic (no bright white surfaces).
- Below the podium, a single line: race winner's full result context (e.g. "Won by +4.2s, led 48 of 57 laps") if available in the data.
- Animate on view entry: steps slide up into place (staggered, fast, ease-out). No looping.

### Data source

`raceResults[slug]` from `data.json`. If no entry exists for a track, the podium block is simply not rendered.

---

## NEW FEATURE 2: Pole Breakdown Panel

A new panel/card on completed circuit views showing qualifying/pole data.

### Content

- **Pole sitter** (driver name + team)
- **Pole time** (formatted lap time)
- **Gap to P2** (e.g. "+0.217s")
- Optional: top 5 qualifying times as a compact mini-table if data is provided

### Visual spec

- Card-style panel in the existing layout grid (near the podium or in the stats row).
- Accent color: sector-1 cyan or a dedicated qualifying purple.
- Small "POLE POSITION" header label.

### Data source

`raceResults[slug].pole` from `data.json`.

---

## NEW FEATURE 3: Historic Winners Section

A new section on EVERY circuit view (both done and pending) showing past race winners at that track.

### Visual spec

- **Low-fi timing-board aesthetic.** Think: monospace font, minimal decoration, like a printed timing sheet pinned to the garage wall.
- Simple columnar layout: `YEAR | DRIVER | TEAM`
- No colors per row (keep it deliberately plain/archival). Maybe a subtle alternating-row tint.
- Header: "WINNERS" or "RACE HISTORY" in a stamped/stencil style.
- Show the last 10 years (or however many entries exist). Most recent at top.
- If the 2026 race is complete, it appears as the top row (connecting to the podium data above).

### Placement

- Below the main data panels, above the footer. A distinct section break.
- On mobile, full-width single column.

### Data source

`historicWinners[slug]` from `data.json`.

---

## DATA PIPELINE (how data.json gets updated)

This is NOT a runtime concern for the app, but documents the intended workflow:

1. Michael updates race results in ClickUp (R1-R24 dropdown fields on the F1 Drivers list, Race Awards in comments on race tasks).
2. Michael tells Brain to refresh the app data.
3. Brain reads the ClickUp custom fields + race task comments, assembles the JSON, and commits `data.json` to `f1-racetracks/` via MCP.
4. GitHub Pages serves the updated JSON within ~60s. The live app reflects the new data on next load.

The app itself never calls ClickUp. ClickUp is the source of truth for data; GitHub Pages is the delivery layer.

---

## THINGS TO KEEP UNCHANGED

- All existing v4 functionality: index grid, hash routing, lap profile chart, DRS zones, sector breakdown, pit data, tyre allocation, strategy, overtaking analysis, corner guide, live weather, map plates.
- Dark telemetry aesthetic, color language (S1 cyan, S2 violet, S3 gold, DRS green, elevation amber, Ferrari-red accent).
- Footer source-export trio (Copy source / Prepare download / Open in new tab) + Export data.
- Responsive/mobile-first layout. All new features must work at 320px.
- Offline-first philosophy (with the localStorage cache fallback described above).

---

## KNOWN SNAGS / EDGE CASES

- **First load on `file://`:** fetch('./data.json') will fail due to CORS on local filesystem in some browsers. The localStorage fallback handles repeat offline use, but the very first open from a downloaded file won't have cached data. Consider: embed a minimal inline fallback dataset (just track metadata, no results) so the index grid always renders.
- **Madring (inaugural circuit):** no historic winners, no 2026 result yet. Both sections should gracefully hide when data is empty.
- **Sprint weekends:** the `raceResults` schema may need a `sprintWinner` field. Include it in the schema but don't require it for the render.

---

## RENDER AGENT INSTRUCTIONS

1. Read the v4 source via the chunk set at `f1-racetracks/source/_index.md`.
2. Extract the existing `TRACKS` array into the `data.json` schema above (keep all existing track data intact in the `tracks` key).
3. Modify `index.html` to: remove the inline TRACKS array, add the `fetch('./data.json')` loader with localStorage cache, add the three new render components (podium, pole panel, historic winners section).
4. Deliver the complete modified `index.html` as a ClickUp artifact.
5. Separately deliver `data.json` (populated with the existing track data + placeholder structure for `raceResults` and `historicWinners` that will be filled by Brain on the first data refresh).
6. Do NOT commit to the repo (files >30KB are uploaded manually by Michael).

---

## SUCCESS CRITERIA

- App loads from GitHub Pages and fetches `data.json` successfully.
- Index grid renders as before.
- Completed circuit views show the podium graphic, pole panel, and historic winners.
- Pending circuit views show historic winners only (no podium/pole since the race hasn't happened).
- Offline: after one successful load, app works fully from localStorage cache.
- All existing functionality preserved.
- Mobile: all new features render cleanly at 320-390px.
