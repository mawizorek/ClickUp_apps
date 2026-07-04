# On Track

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/on-track/)

[![Launch](https://img.shields.io/badge/▶︎_Launch-On_Track-e10600?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/on-track/)

**Status:** Live · **Source of truth:** this repo folder · **Live:** https://mawizorek.github.io/ClickUp_apps/on-track/

A live, at-a-glance motorsport TV schedule. Our own served + skinnable answer to RacingTvSchedule.com: it reads the clock and surfaces what's racing **right now**, what's **next** (live countdown), and **where to watch** it across every series and platform.

## What it does

- **ON NOW hero** — shows live sessions with a pulsing LIVE badge + channel; when nothing's live, counts down to the next session (updates every second).
- **Today/now is the top focus.** Past sessions are hidden by default and revealed with a “Show earlier” toggle (discoverable, not gone).
- **Jump-to-date dropdown** — hop to any day with events across the loaded month.
- **Per-series color identity** across the hero, schedule bars, and chips.
- **Filters** — series chips + platform (where-to-watch) chips + live search. All persist via localStorage.
- **ET / My time** timezone toggle (auto-localizes).
- **Racing Bulls dark theme** default with a one-tap light-theme switch. Fully skinnable via CSS custom properties + the series registry.

## How to use it

Open the launch link. It shows what's on now (or the countdown to next) up top, then the schedule grouped by day. Tap series/platform chips to filter, use the search box for a track or session, use **Jump to date** to skip ahead, and the theme toggle (top right) to flip light/dark.

## Architecture

- **Data Separation Pattern:** `index.html` (engine) + `data.json` (living feed). The engine renders immediately from a built-in dataset, then enhances from `data.json` when served — it never blocks on the fetch (this was the fix for the empty-shell bug in early builds).
- Everything time-based is computed live off the clock (live/next/past state, countdown, “X ago”). Nothing about “now” is hardcoded.
- **Series registry** (`SERIES` const + `--s-*` color tokens) is the single extension point: onboard a series by adding one entry + one color token.
- Mobile-first + desktop, single self-contained engine file, offline-first (cached data.json + built-in fallback).
- Theme is a set of CSS custom properties on `:root[data-theme]`; light mode is a full token swap (including the hero card).

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | App engine (UI, logic, styling, built-in fallback data) | Version bumps only |
| `data.json` | Living schedule feed | As-needed via MCP commit (no version bump) |

**Updating the schedule = commit `data.json` only.** No engine touch, no version bump. Event shape:

```json
{ "series": "F1", "kind": "Race", "title": "Belgian Grand Prix", "detail": "Spa-Francorchamps",
  "start": "2026-07-19T09:00:00-04:00", "end": "2026-07-19T11:00:00-04:00", "platforms": ["Apple TV"] }
```

## Version history

- **v1.3** — light-mode hero fix (card + text now flip together), jump-to-date dropdown, expanded to a full month of listings (Jul 3–26), F1 corrected to Apple TV, MotoGP to FS1, MotoGP German GP moved to its real date (Jul 12), added WEC/IMSA, +6 motorcycle series in the registry (Moto2, Moto3, MotoAmerica, MXGP, British Superbike, FIM Speedway).
- v1.2 — today/now top focus, past sessions hidden-but-discoverable, expanded series registry.
- v1.1 — render immediately from built-in data; data.json enhances (fixed empty-shell fetch gating).
- v1 — initial build: ON NOW hero, per-series colors, series + platform filters, search, TZ toggle, theme switch.

## Related

- ClickUp task: On Track (APPS list)
- Inspiration: RacingTvSchedule.com (this is our own served, controllable, skinnable version)

## Roadmap

- Keep the feed rolling forward as weekends land (Brain is the feed; one-line `data.json` commit each refresh).
- Fold more series into the live feed as their events arrive (WEC São Paulo Jul 12, MotoAmerica/WSBK/MXGP rounds).
- Consider: `.ics` calendar export per session, week nav, “remind me” hooks, PWA manifest for home-screen install.
