# World Cup 2026 Bracket

### \u25b6\ufe0f [**Launch the app \u2192**](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

[![Launch](https://img.shields.io/badge/Launch-World%20Cup%20Bracket-brightgreen?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

**Status:** Live (v5.0) | **Source of truth:** this repo folder | **Access:** open

---

## What it does

Mobile-first interactive World Cup 2026 bracket tracker with two views that share one detail popup:

- **Schedule view:** Match cards by date with time filters. Completed matches show a compact result line; upcoming matches show FIFA rank. Chevron points down = tap to open details. **Tap any card** for the shared detail sheet.
- **Bracket view:** Horizontal tournament tree, R32 through Final. **Tap any match card** for the detail sheet. **Tap teams' \u2192 arrows to compare up to 4 paths at once**, each in its own color; the \u2694 marker shows where two selected teams' paths first collide (the round they'd knock each other out). Tap empty space to clear all.

**Shared detail sheet** shows when + where + live countdown, final score / who advanced, teams that can still reach a future slot, a "road to here" trail, and a for-fun win estimate.

## How to use it

Tap any card (either view) for details. In the bracket, tap teams' \u2192 to add them to the path compare (up to 4, each colored); a legend row shows who's selected with per-chip \u00d7 and Clear all. Empty-space tap clears everything. Update results/schedule by editing `data.json` only.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Thin shell: head + skeleton + legend + footer | Rarely |
| `config.json` | Access gate (open/gated/down) + code | Flip to share/lock |
| `manifest.webmanifest` / `icon.svg` / `icon.png` / `og.png` | PWA install + link preview | Rarely |
| `source/styles.css` | Base + schedule + footer styles | Style changes |
| `source/bracket.css` | Bracket + path colors + convergence + legend | Style changes |
| `source/sheet.css` | Shared detail-sheet + road-trail styles | Style changes |
| `source/store.js` | Constants (`APP_VERSION`, `BUILD_PR`, `PATH_PALETTE`) + state | Version bumps |
| `source/util.js` | Codes, resolvers, countdown, route history, odds | Logic changes |
| `source/paths.js` | Multi-team path sets, convergence, legend, color apply | Path-feature changes |
| `source/sheet.js` | The ONE shared detail popup (both views) | Sheet changes |
| `source/schedule.js` | Schedule view rendering | Schedule changes |
| `source/bracket.js` | Bracket render + trace-arrow selection + reset | Bracket changes |
| `source/app.js` | Entry: data load, view toggle, trace bridge, footer, ticker | Rarely |
| `data.json` | Living dataset (matches, results, schedule, `rankings`) | After each match day |

**Multi-file ES-module architecture.** Every source file under ~12KB (the path/color logic was split into `paths.js` to keep `bracket.js` under budget). Pages-hosted; not for `file://` (module CORS).

## Architecture

- **Multi-team path compare (v5):** `store.S.picks` is an ordered team list; index \u2192 `PATH_PALETTE` color (mint/amber/violet/cyan, OKLCH, colorblind-considerate, max 4). `paths.js` computes each team's forward path, finds convergence (earliest shared match per pair), and sets per-match CSS color vars. Chose per-team colors + convergence over round-based coloring: round colors can't distinguish whose path is whose, convergence answers "where do they meet."
- **Path walk is hardened (v5):** `pathForTeam` walks the `feedsTo` graph from a team's single earliest node rather than name-matching every node, so a future data mismatch can't double-light two cards (the v4.3 artifact's root cause was cross-wired `feedsTo`, fixed in data + this walk change).
- **One popup, two entry points** (`sheet.js`); card tap = details, \u2192 = path select. Sheet \u2192 arrow adds that team to the compare and jumps to the bracket.
- **Interaction states:** \u2192 toggles a team on/off; per-chip \u00d7 removes one; Clear all / empty-space tap resets everything; at the 4-team cap, adding nudges "clear one first."
- OKLCH dark theme, `prefers-reduced-motion` guard, palette locked (path hues are an additive OKLCH set).

## Version history

- **v5.0** (2026-07-04): Multi-team path compare (up to 4, per-team colors) + \u2694 convergence marker + legend chip row. New `paths.js` module. Hardened path walk (fixes the double-light class of bug at the engine level).
- **v4.3** (2026-07-04): Arrow clarity \u2014 schedule chevron down, bracket trace arrow forward \u2192. (Data fix: cross-wired R16 feedsTo.)
- **v4.2 / v4.1 / v4.0**: Private-share polish (OG, PWA, gate); version footer + deselect; unified detail sheet + road-to-here.
- **v3.0**: Modular ES-module split (fixed 30KB monolith) + bracket-tap detail.
- **v2.x / v1**: Potential matchups, ranks, condensed cards, path highlight, initial dual-view.

## Related

- ClickUp list: World Cup (MAW space)
- Built during the 2026 FIFA World Cup knockout stage

## Roadmap

- Optional round-tint ambient layer (Michael parked round-colors as secondary)
- Flag emoji / SVG flags per country
- Goal scorers / key moments in the road-to-here trail (needs new data fields)
