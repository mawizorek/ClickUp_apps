# World Cup 2026 Bracket

### ▶️ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

[![Launch](https://img.shields.io/badge/Launch-World%20Cup%20Bracket-brightgreen?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

**Status:** Live (v1) | **Source of truth:** this repo folder

---

## What it does

Mobile-first interactive World Cup 2026 bracket tracker with two views:

- **Schedule view:** Match cards grouped by date with time-period filters (Today, Weekend, R32, R16, QF+, All). Full detail: venue, kickoff time, scores, penalty/AET notes, winner highlighting.
- **Bracket view:** Horizontal scrollable tournament tree showing the full R32 through Final progression. Compact country-code format for at-a-glance path tracking.

Designed for phone-in-hand use during the tournament.

## How to use it

Open the app. Default is Schedule view showing today's matches. Use the time filter tabs to see upcoming days or full rounds. Toggle to Bracket view for the global tournament picture.

To update results: edit the `allMatches` array in the source. Set `hs`/`as` (scores), `status` ('ft', 'aet', 'pso'), `winner` ('home' or 'away'), and optional `psoNote`.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Self-contained app (engine + data) | After each match day |

## Architecture

- Single self-contained HTML file, all CSS/JS inline.
- Only external resource: Google Fonts (Inter).
- OKLCH color system, dark theme.
- Data is a flat array of match objects with `feedsTo` IDs linking rounds together.
- Under 30KB, no `/source` chunk set needed.
- Future consideration: split to `data.json` if update frequency warrants it (Brain could auto-commit results after each match day).

## Version history

- **v1** (2026-07-02): Initial build. Dual-view (schedule + bracket). R32 results through Jul 2, R16 confirmed matchups, QF/SF/Final stubs.

## Related

- ClickUp list: World Cup (in Formula 1 space)
- Built during the 2026 FIFA World Cup knockout stage

## Roadmap

- Data separation (`data.json`) for automated result updates via Brain
- Flag emoji or small SVG flags per country
- Tap-to-expand match cards with goal scorers / key moments
- Auto-highlight "today's matches" based on system date
