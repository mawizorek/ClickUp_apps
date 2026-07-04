# World Cup 2026 Bracket

### \u25b6\ufe0f [**Launch the app \u2192**](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

[![Launch](https://img.shields.io/badge/Launch-World%20Cup%20Bracket-brightgreen?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

**Status:** Live (v2.0) | **Source of truth:** this repo folder

---

## What it does

Mobile-first interactive World Cup 2026 bracket tracker with two views:

- **Schedule view:** Match cards grouped by date with time-period filters (Today, This Week, R32, R16, QF+, All). Full detail: venue, kickoff time, scores, penalty/AET notes, winner highlighting. Tap any card to expand a detail drawer (kickoff countdown, path in, or who the winner advances to face).
- **Bracket view:** Horizontal scrollable tournament tree from R32 through the Final. Tap any team to trace its full path to the Final; the rest of the bracket dims.

Future-round slots that don't have confirmed teams yet render their live contenders (e.g. "winner of MAR/CAN") instead of blank placeholders.

Designed for phone-in-hand use during the tournament.

## How to use it

Open the app. Default is Schedule view showing today's matches. Use the time filter tabs to see upcoming days or full rounds. Tap a match card to expand its detail drawer. Toggle to Bracket view for the global picture, and tap a team there to trace its route to the Final.

To update results/schedule: edit `data.json` (see Infrastructure). Engine/UI changes are a version bump to `index.html`.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | App engine (UI, logic, styling) | Version bumps only |
| `data.json` | Living dataset (matches, results, schedule) | After each match day via MCP |

Data separation is live: the engine `fetch`es `./data.json` on load, caches to localStorage, and falls back to cache offline. Data updates commit `data.json` only (no version bump); engine changes version-bump `index.html`.

## Architecture

- Single self-contained HTML file, all CSS/JS inline + `data.json`.
- Only external resource: Google Fonts (Inter) + the GitHub API call for the "data updated" relative timestamp.
- OKLCH color system, dark theme. `prefers-reduced-motion` guard on all motion.
- **Potential matchups (v2):** `feedsTo` is inverted once into a `fedBy` map at load; any TBD slot resolves its feeder(s) to a "winner of X/Y" label. **Depth-1 only** by design \u2014 an unresolved feeder falls back to plain TBD rather than rendering nested contender soup.
- **Countdowns:** kickoff times are stored as ET strings and parsed against EDT (UTC-4) so the countdown is correct in any viewer timezone. A single 30s interval updates all `[data-countdown]` elements.
- **Path highlight (v2):** tapping a bracket team walks the `feedsTo` chain forward, stopping if the team was eliminated in a completed match.
- Under 30KB, no `/source` chunk set needed.

## Version history

- **v2.0** (2026-07-04): Potential-matchup rendering (depth-1 `fedBy` resolver). Tap-to-expand schedule drawers (countdown / path-in / advances-to-face). Bracket path-highlight on team tap. Live countdown chips on today's upcoming cards. QF/SF/Final dates, times, and venues filled. Head-block polish (theme-color, robots noindex, emoji favicon, reduced-motion guard).
- **v1** (2026-07-02): Initial build. Dual-view (schedule + bracket). R32 results, R16 confirmed matchups, QF/SF/Final stubs.

## Related

- ClickUp list: World Cup (MAW space)
- Built during the 2026 FIFA World Cup knockout stage

## Roadmap

- Full contender-POOL rendering (depth-N: SF shows 4 possible, Final shows 8) \u2014 revisit only if depth-1 proves too thin
- Flag emoji or small SVG flags per country
- Goal scorers / key moments in the tap drawer (needs new data fields)
