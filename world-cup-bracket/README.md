# World Cup 2026 Bracket

### \u25b6\ufe0f [**Launch the app \u2192**](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

[![Launch](https://img.shields.io/badge/Launch-World%20Cup%20Bracket-brightgreen?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

**Status:** Live (v2.1) | **Source of truth:** this repo folder

---

## What it does

Mobile-first interactive World Cup 2026 bracket tracker with two views:

- **Schedule view:** Match cards grouped by date with time-period filters (Today, This Week, R32, R16, QF+, All). Completed matches collapse to a compact result line; tap to expand full detail. Upcoming matches show each team's FIFA ranking in the score dead-space. Tap any card for the detail drawer (kickoff countdown, path in, or who the winner advances to face).
- **Bracket view:** Horizontal scrollable tournament tree from R32 through the Final. Completed matches render in a tighter, winner-forward row so early rounds don't run long. Tap any team to trace its full path to the Final; the rest of the bracket dims.

Future-round slots without confirmed teams render their live contenders (e.g. "winner of MAR/CAN") instead of blank placeholders.

## How to use it

Open the app. Default is Schedule view showing today's matches. Use the time filter tabs to see upcoming days or full rounds. Tap a completed match to expand it, or any card for its detail drawer. Toggle to Bracket view for the global picture, and tap a team there to trace its route to the Final.

To update results/schedule: edit `data.json` (see Infrastructure). Engine/UI changes are a version bump to `index.html`.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | App engine (UI, logic, styling) | Version bumps only |
| `data.json` | Living dataset (matches, results, schedule, `rankings` map) | After each match day via MCP |

Data separation is live: the engine `fetch`es `./data.json` on load, caches to localStorage, and falls back to cache offline. Data updates commit `data.json` only (no version bump); engine changes version-bump `index.html`.

## Architecture

- Single self-contained HTML file, all CSS/JS inline + `data.json`. **~30KB and near the read cap** \u2014 the next engine feature likely warrants a `/source` chunk set or a modular split.
- Only external resource: Google Fonts (Inter) + the GitHub API call for the "data updated" relative timestamp.
- OKLCH color system, dark theme. `prefers-reduced-motion` guard on all motion.
- **Potential matchups:** `feedsTo` inverted once into a `fedBy` map at load; any TBD slot resolves its feeder(s) to a "winner of X/Y" label. **Depth-1 only** \u2014 an unresolved feeder falls back to plain TBD (no nested contender soup).
- **Rankings (v2.1):** `data.rankings` maps team name \u2192 FIFA rank; shown italic in the score slot for upcoming teams only. Source: FIFA/USA TODAY June 2026. (South Africa rank is an estimate; not in the published top-47.)
- **Condensed completed cards (v2.1):** completed matches render a compact winner/score/loser summary; `.open` swaps to the full team rows + drawer. Same tap target, one open at a time.
- **Countdowns:** kickoff times stored as ET strings, parsed against EDT (UTC-4) so the countdown is correct in any viewer timezone. Single 30s interval updates all `[data-countdown]`.
- **Path highlight:** tapping a bracket team walks the `feedsTo` chain forward, stopping if the team lost a completed match.

## Version history

- **v2.1** (2026-07-04): Completed cards condense to a result line (tap to expand). FIFA rankings in the dead-space for upcoming teams. Tighter completed bracket rows so R32 reads slicker. Data: Canada 0-3 Morocco FT (Morocco to QF).
- **v2.0** (2026-07-04): Potential-matchup rendering (depth-1 `fedBy`). Tap-to-expand schedule drawers. Bracket path-highlight. Countdown chips. QF/SF/Final dates/times/venues. Head-block polish.
- **v1** (2026-07-02): Initial dual-view build.

## Related

- ClickUp list: World Cup (MAW space)
- Built during the 2026 FIFA World Cup knockout stage

## Roadmap

- Modular split / `/source` chunk set (engine is at the 30KB read cap)
- Full contender-POOL rendering (depth-N) \u2014 only if depth-1 proves too thin
- Flag emoji or small SVG flags per country
- Goal scorers / key moments in the tap drawer (needs new data fields)
