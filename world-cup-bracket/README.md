# World Cup 2026 Bracket

### \u25b6\ufe0f [**Launch the app \u2192**](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

[![Launch](https://img.shields.io/badge/Launch-World%20Cup%20Bracket-brightgreen?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

**Status:** Live (v4.1) | **Source of truth:** this repo folder

---

## What it does

Mobile-first interactive World Cup 2026 bracket tracker with two views that share one detail popup:

- **Schedule view:** Match cards grouped by date with time filters. Completed matches show a compact result line; upcoming matches show each team's FIFA rank. **Tap any card** to open the shared detail sheet.
- **Bracket view:** Horizontal tournament tree, R32 through Final. **Tap any match card** for the same detail sheet. **Tap a team's \u2197 arrow** to trace its path to the Final (rest of the bracket dims). **Tap empty space to clear** the highlight.

**Shared detail sheet** shows when + where + live countdown, final score / who advanced, the teams that can still reach a future slot, a "road to here" trail of each team's prior results, and a for-fun win estimate.

A small **version footer** (`vX.X \u00b7 PR#NN`) sits at the bottom so you can always tell which build you're looking at.

## How to use it

Tap any card (either view) for details. In the bracket, tap a team's \u2197 for the path highlight, tap empty space to clear it. Inside the sheet, a team's \u2197 jumps to the bracket and traces them. To update results/schedule, edit `data.json` only.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Thin shell: head + skeleton + footer, links CSS, boots the ES module | Rarely |
| `source/styles.css` | Base + schedule + footer styles | Style changes |
| `source/bracket.css` | Bracket view styles | Style changes |
| `source/sheet.css` | Shared detail-sheet + road-trail styles | Style changes |
| `source/store.js` | Shared constants (incl. `APP_VERSION`, `BUILD_PR`) + runtime state | Version bumps |
| `source/util.js` | Codes, resolvers, countdown, route history, odds | Logic changes |
| `source/sheet.js` | The ONE shared detail popup (both views) | Sheet changes |
| `source/schedule.js` | Schedule view rendering | Schedule changes |
| `source/bracket.js` | Bracket render + path highlight + deselect | Bracket changes |
| `source/app.js` | Entry: data load, view toggle, trace bridge, footer, ticker | Rarely |
| `data.json` | Living dataset (matches, results, schedule, `rankings`) | After each match day via MCP |

**Multi-file ES-module architecture.** Every source file under ~12KB. Pages-hosted; not for `file://` (module CORS).

## Architecture

- **Version footer** reads `APP_VERSION` + `BUILD_PR` from `store.js`, rendered on load. Bump both when shipping; `BUILD_PR` is set to the merged PR number so the running build is always identifiable at a glance.
- **One popup, two entry points.** `sheet.js` renders the single detail sheet; both views call `openSheet(id)`.
- **Delivery model:** card tap = detail sheet; path highlight = \u2197 arrow per team; **empty-space tap clears the highlight** (restored in v4.1 after a v4 refactor dropped it). The `bindReset` listener sits on `#bracketView` and ignores taps on cards / arrows.
- **Decoupling:** the sheet requests a path trace via a `trace-team` CustomEvent; `app.js` catches it and drives the bracket view + highlight.
- **Road to here / potential matchups / odds / countdowns:** see v3-v4 notes below; unchanged.
- OKLCH dark theme, `prefers-reduced-motion` guard, palette locked.

## Version history

- **v4.1** (2026-07-04): Version footer stamp (`vX.X \u00b7 PR#NN`). Restored tap-empty-space-to-deselect on the bracket path highlight (regressed in v4's refactor).
- **v4.0** (2026-07-04): Unified detail sheet across both views (`sheet.js`). Flipped delivery: card tap = details, \u2197 = path highlight, \u24d8 removed. Added "road to here" trail.
- **v3.0** (2026-07-04): Modular ES-module split (fixed the 30KB monolith). Bracket-tap detail sheet.
- **v2.1** (2026-07-04): Condensed completed cards, FIFA ranks, tighter bracket rows.
- **v2.0** (2026-07-04): Potential matchups, tap drawers, path highlight, countdown chips, QF/SF/Final schedule.
- **v1** (2026-07-02): Initial dual-view build.

## Related

- ClickUp list: World Cup (MAW space)
- Built during the 2026 FIFA World Cup knockout stage

## Roadmap

- Flag emoji or small SVG flags per country
- Goal scorers / key moments in the road-to-here trail (needs new data fields)
