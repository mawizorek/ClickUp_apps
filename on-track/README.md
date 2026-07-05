# On Track

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/on-track/)

[![Launch](https://img.shields.io/badge/▶︎_Launch-On_Track-e10600?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/on-track/)

**Status:** Live · **Source of truth:** this repo folder · **Live:** https://mawizorek.github.io/ClickUp_apps/on-track/

A live, at-a-glance motorsport TV schedule. Our own served + skinnable answer to RacingTvSchedule.com: it reads the clock and surfaces what's racing **right now**, what's **next** (live countdown), and **where to watch** it across every series and platform.

## What it does

- **ON NOW hero** — shows live sessions with a pulsing LIVE badge + channel; when nothing's live, counts down to the next session (updates every second).
- **Today/now is the top focus.** Past sessions are hidden by default and revealed with a “Show earlier” toggle (discoverable, not gone).
- **Collapsible filter sections** — Series and Where-to-watch collapse (collapsed by default on mobile) with a live count badge of active filters, so the front page lands on schedule content instead of a wall of chips. Expanded by default on desktop; open/closed state persists per section.
- **Jump-to-date dropdown** — hop to any day with events across the loaded month.
- **Per-series color identity** across the hero, schedule bars, and chips.
- **Filters** — series chips + platform (where-to-watch) chips + live search. All persist via localStorage.
- **ET / My time** timezone toggle (auto-localizes).
- **Racing Bulls dark theme** default with a one-tap light-theme switch. Fully skinnable via CSS custom properties + the series registry.

## How to use it

Open the launch link. It shows what's on now (or the countdown to next) up top, then the schedule grouped by day. Tap the Series / Where-to-watch headers to expand the filter chips, use the search box for a track or session, use **Jump to date** to skip ahead, and the theme toggle (top right) to flip light/dark.

## Architecture

- **Multi-file (Pages-hosted), LOCKED v1.8.** The app is a thin `index.html` shell that loads `source/styles.css` + `source/render.js` + `source/app.js` at runtime, plus `data.json` for the living feed. Each source file reads whole under the 30KB MCP cap, so the app is agent-editable directly — no base64 chunk set, no monolith. `render.js` = engine (constants, data model, date helpers, all paint logic); `app.js` = shell (filter toggles, event binding, export, bootstrap).
- **Self-contained export preserved.** The footer's Copy source / Prepare download / Open-in-new-tab re-inline all three source files (and the current `DATA`) at runtime, so a downloaded copy is a single standalone file that still works offline. This is why the split doesn't cost the “your own served + skinnable” portability.
- **Data Separation Pattern:** the engine renders immediately from a built-in fallback dataset, then enhances from `data.json` when served — it never blocks on the fetch (this was the fix for the empty-shell bug in early builds).
- Everything time-based is computed live off the clock (live/next/past state, countdown, “X ago”). Nothing about “now” is hardcoded.
- **Series registry** (`SERIES` const + `--s-*` color tokens) is the single extension point: onboard a series by adding one entry + one color token.
- **Touch-safe interaction:** all `:hover` styling is gated behind `@media (hover: hover)` so hover borders never stick on tap (fixed the chip-won't-deselect artifact on iOS). Respects `prefers-reduced-motion`.
- Mobile-first + desktop. Multi-file requires Pages hosting; offline is covered by localStorage-cached `data.json` + the built-in fallback + downloadable self-contained copies.
- Theme is a set of CSS custom properties on `:root[data-theme]`; light mode is a full token swap (including the hero card).

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Thin shell: head, body skeleton, loads source + data | Rarely (structure changes only) |
| `source/styles.css` | All styling + theme tokens | Version bumps (visual/engine changes) |
| `source/render.js` | Engine: constants, data model, helpers, render/paint | Version bumps (engine changes) |
| `source/app.js` | Shell: filter toggles, event binding, export, bootstrap | Version bumps (engine changes) |
| `data.json` | Living schedule feed | As-needed via MCP commit (no version bump) |

**Updating the schedule = commit `data.json` only.** No engine touch, no version bump. Event shape:

```json
{ "series": "F1", "kind": "Race", "title": "Belgian Grand Prix", "detail": "Spa-Francorchamps",
  "start": "2026-07-19T09:00:00-04:00", "end": "2026-07-19T11:00:00-04:00", "platforms": ["Apple TV"] }
```

**Editing the engine:** edit the relevant `source/*` file directly (each reads whole under the cap) and bump `APP_VERSION` in `source/render.js`. No chunk set to regenerate.

## Version history

- **v1.8** — architecture refactor: split the self-contained monolith into a thin `index.html` shell + `source/{styles.css,render.js,app.js}`. No behavior change. Export buttons now re-inline source at runtime so downloads stay standalone. Retires the 30KB read-cap chunk dance (source is now directly agent-readable).
- **v1.7** — fixed sticky-hover chip border on touch (gated all `:hover` behind `@media (hover: hover)`); added collapsible Series / Where-to-watch filter sections with live count badges (mobile density), collapsed-by-default on mobile, state persisted per section.
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
