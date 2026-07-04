# World Cup 2026 Bracket

### \u25b6\ufe0f [**Launch the app \u2192**](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

[![Launch](https://img.shields.io/badge/Launch-World%20Cup%20Bracket-brightgreen?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

**Status:** Live (v3.0) | **Source of truth:** this repo folder

---

## What it does

Mobile-first interactive World Cup 2026 bracket tracker with two views:

- **Schedule view:** Match cards grouped by date with time-period filters. Completed matches collapse to a compact result line (tap to expand); upcoming matches show each team's FIFA ranking in the score dead-space. Tap any card for a detail drawer (kickoff countdown, path in, advances-to-face).
- **Bracket view:** Horizontal tournament tree, R32 through Final. **Tap a team** to trace its path to the Final (rest of the bracket dims). **Tap the \u24d8 on any match** for a detail sheet: when + where it's played, a live countdown, the possible teams that can reach that slot, and a for-fun win estimate. Works for future rounds too \u2014 tap the Final and it tells you it's Sun Jul 19 at MetLife.

Future-round slots without confirmed teams render their live contenders ("winner of MAR/CAN").

## How to use it

Open the app. Schedule view defaults to today. Tap cards to expand. In Bracket view, tap a team for the path highlight or the \u24d8 badge for match details. To update results/schedule, edit `data.json` only.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Thin shell: head + skeleton, links CSS, boots the ES module | Rarely (structure only) |
| `source/styles.css` | Base + schedule styles | Style changes |
| `source/bracket.css` | Bracket view + detail-sheet styles | Style changes |
| `source/store.js` | Shared constants + runtime state (`S`) | Rarely |
| `source/util.js` | Codes, resolvers, countdown, odds heuristic | Logic changes |
| `source/schedule.js` | Schedule view rendering | Schedule feature changes |
| `source/bracket.js` | Bracket render + path highlight + detail sheet | Bracket feature changes |
| `source/app.js` | Entry: data load, view toggle, countdown ticker | Rarely |
| `data.json` | Living dataset (matches, results, schedule, `rankings`) | After each match day via MCP |

**Multi-file ES-module architecture (v3).** GitHub Pages-hosted; `index.html` links the CSS and boots `source/app.js` as an ES module, which imports the rest. Not for `file://` (module CORS) \u2014 use the live URL. Data still fetches with a localStorage fallback for offline once cached.

## Architecture

- **Every source file is kept UNDER ~12KB** (target 10-12, hard cap 15). The monolith hit 30KB at v2.1; v3 split it so no single file goes near the read cap again. This app is now the reference implementation of the modular standard.
- ES modules with a single shared state object (`store.js` exports `S`); all modules import it. No globals, no build step \u2014 native browser modules.
- OKLCH dark theme, `prefers-reduced-motion` guard. Palette locked.
- **Potential matchups:** `feedsTo` inverted into `fedBy` at load; TBD slots resolve to "winner of X/Y" (depth-1 in cards; the bracket detail sheet expands the contender pool).
- **Detail sheet (v3):** bottom sheet, gesture-separated from the path highlight \u2014 team-row tap = highlight, \u24d8 tap = sheet. Shows when/where/countdown, candidate teams per side, and a labeled win estimate.
- **Odds heuristic:** rank \u2192 rough Elo-ish rating \u2192 logistic head-to-head, clamped 8-92%. Clearly labeled EST / for-fun. NOT real odds, no API.
- **Countdowns:** ET-string kickoff parsed against EDT (UTC-4); one 30s interval updates all `[data-countdown]` elements (chips, drawer, sheet).

## Version history

- **v3.0** (2026-07-04): Modular ES-module split (was a 30KB monolith) \u2014 thin shell + 6 JS modules + 2 CSS files, each under 12KB. Bracket-tap detail sheet: when/where/countdown/possible matchups + for-fun win estimate. Path highlight preserved.
- **v2.1** (2026-07-04): Condensed completed cards, FIFA ranks in dead-space, tighter bracket rows.
- **v2.0** (2026-07-04): Potential matchups, tap-to-expand drawers, path highlight, countdown chips, QF/SF/Final schedule.
- **v1** (2026-07-02): Initial dual-view build.

## Related

- ClickUp list: World Cup (MAW space)
- Built during the 2026 FIFA World Cup knockout stage

## Roadmap

- Flag emoji or small SVG flags per country
- Goal scorers / key moments in the detail sheet (needs new data fields)
- Real odds feed (would need an API + key; out of scope for offline-first static hosting)
