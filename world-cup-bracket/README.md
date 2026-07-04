# World Cup 2026 Bracket

### \u25b6\ufe0f [**Launch the app \u2192**](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

[![Launch](https://img.shields.io/badge/Launch-World%20Cup%20Bracket-brightgreen?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

**Status:** Live (v4.0) | **Source of truth:** this repo folder

---

## What it does

Mobile-first interactive World Cup 2026 bracket tracker with two views that share one detail popup:

- **Schedule view:** Match cards grouped by date with time filters. Completed matches show a compact result line; upcoming matches show each team's FIFA rank. **Tap any card** to open the shared detail sheet.
- **Bracket view:** Horizontal tournament tree, R32 through Final. **Tap any match card** for the same detail sheet. **Tap a team's \u2197 arrow** (right side of its row) to trace its path to the Final \u2014 the rest of the bracket dims.

**Shared detail sheet** (one component, served from both views) shows: when + where + live countdown, final score / who advanced (completed), the teams that can still reach the slot (future), a **"road to here"** trail of each team's prior-round results, and a for-fun win estimate. Concrete teams in the sheet carry a \u2197 that jumps to the bracket and highlights their path.

## How to use it

Tap any card (either view) for details. In the bracket, tap a team's \u2197 for the path highlight. Inside the sheet, a team's \u2197 jumps to the bracket and traces them. To update results/schedule, edit `data.json` only.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Thin shell: head + skeleton, links CSS, boots the ES module | Rarely |
| `source/styles.css` | Base + schedule styles | Style changes |
| `source/bracket.css` | Bracket view styles | Style changes |
| `source/sheet.css` | Shared detail-sheet + road-trail styles | Style changes |
| `source/store.js` | Shared constants + runtime state (`S`) | Rarely |
| `source/util.js` | Codes, resolvers, countdown, route history, odds | Logic changes |
| `source/sheet.js` | The ONE shared detail popup (both views) | Sheet feature changes |
| `source/schedule.js` | Schedule view rendering | Schedule changes |
| `source/bracket.js` | Bracket render + path highlight | Bracket changes |
| `source/app.js` | Entry: data load, view toggle, trace bridge, ticker | Rarely |
| `data.json` | Living dataset (matches, results, schedule, `rankings`) | After each match day via MCP |

**Multi-file ES-module architecture.** Every source file is kept under ~12KB. Pages-hosted; not for `file://` (module CORS) \u2014 use the live URL.

## Architecture

- **One popup, two entry points.** `sheet.js` renders the single detail sheet; both `schedule.js` and `bracket.js` call `openSheet(id)`. Never rebuilt per-view. This is the professionalism/standardization spine of v4.
- **Delivery model (v4):** card tap = detail sheet (the default); path highlight = a dedicated \u2197 arrow on the right of each team row. The old \u24d8 badge is gone (it was in the way). Path highlight stays first-class (one tap on the bracket).
- **Decoupling:** the sheet asks for a path trace via a `trace-team` CustomEvent; `app.js` catches it, switches to bracket view, and highlights \u2014 so `sheet.js` never imports `bracket.js` (no circular dep).
- **Road to here:** `routeHistory(team)` returns a team's prior completed matches (round + opponent + score), rendered as a compact trail. Kept minimal so the sheet stays clean.
- **Potential matchups:** `feedsTo` inverted into `fedBy`; TBD slots resolve to "winner of X/Y". The sheet expands the contender pool per side.
- **Odds heuristic:** rank \u2192 rough Elo-ish rating \u2192 logistic split, clamped 8-92%. Labeled EST / for-fun. Not real odds.
- **Countdowns:** ET-string kickoff parsed against EDT (UTC-4); one 30s interval updates all `[data-countdown]`.
- OKLCH dark theme, `prefers-reduced-motion` guard, palette locked.

## Version history

- **v4.0** (2026-07-04): Unified detail sheet across both views (extracted to `sheet.js`). Flipped delivery: card tap = details, \u2197 arrow = path highlight, \u24d8 removed. Added "road to here" trail (prior-round results per team). Schedule cards now open the shared sheet instead of an inline drawer.
- **v3.0** (2026-07-04): Modular ES-module split (fixed the 30KB monolith). Bracket-tap detail sheet + \u24d8 affordance.
- **v2.1** (2026-07-04): Condensed completed cards, FIFA ranks, tighter bracket rows.
- **v2.0** (2026-07-04): Potential matchups, tap drawers, path highlight, countdown chips, QF/SF/Final schedule.
- **v1** (2026-07-02): Initial dual-view build.

## Related

- ClickUp list: World Cup (MAW space)
- Built during the 2026 FIFA World Cup knockout stage

## Roadmap

- Flag emoji or small SVG flags per country
- Goal scorers / key moments in the road-to-here trail (needs new data fields)
