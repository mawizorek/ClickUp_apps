# World Cup 2026 Bracket

### \u25b6\ufe0f [**Launch the app \u2192**](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

[![Launch](https://img.shields.io/badge/Launch-World%20Cup%20Bracket-brightgreen?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/)

**Status:** Live (v4.2) | **Source of truth:** this repo folder | **Access:** gated (family code `2026`)

---

## What it does

Mobile-first interactive World Cup 2026 bracket tracker with two views that share one detail popup:

- **Schedule view:** Match cards grouped by date with time filters. Completed matches show a compact result line; upcoming matches show each team's FIFA rank. **Tap any card** for the shared detail sheet.
- **Bracket view:** Horizontal tournament tree, R32 through Final. **Tap any match card** for the same detail sheet. **Tap a team's \u2197 arrow** to trace its path to the Final; **tap empty space to clear**.

**Shared detail sheet** shows when + where + live countdown, final score / who advanced, teams that can still reach a future slot, a "road to here" trail, and a for-fun win estimate.

**Private-share ready (v4.2):** link-preview card when texted, installable to home screen, and a cosmetic access gate (family code `2026`).

## How to use it

Open the app, enter the family code (`2026`) once per session. Tap any card for details. In the bracket, tap a team's \u2197 to trace its path, empty space to clear. Update results/schedule by editing `data.json` only.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Thin shell: head (OG/Twitter/manifest/gate) + skeleton + footer | Rarely |
| `config.json` | Access gate state (`open`/`gated`/`down`) + code | Flip to share/lock |
| `manifest.webmanifest` | PWA install metadata | Rarely |
| `icon.svg` | App/tile/favicon icon | Rarely |
| `og-image.png` | **Link-preview image (1200x630). Binary \u2014 drag-dropped via GitHub UI, not committed by tooling.** | On rebrand |
| `source/*.css` | Base+schedule / bracket / sheet styles | Style changes |
| `source/*.js` | store, util, sheet, schedule, bracket, app | Logic changes |
| `data.json` | Living dataset (matches, results, schedule, `rankings`) | After each match day |

**Multi-file ES-module architecture.** Every source file under ~12KB. Pages-hosted; not for `file://` (module CORS).

## Sharing & access

- **Gate:** `config.json` \u2192 `access` is `gated` with code `2026`. Flip to `open` to drop the cover, or `down` to hard-close. One-line commit, no rebuild. Cosmetic only (public repo, no sensitive data) \u2014 keeps casual eyes out, nothing more.
- **Link preview:** OG + Twitter tags point at `og-image.png`. Until that PNG is dropped in, the unfurl still shows title + description and just omits the image.
- **Install:** `manifest.webmanifest` + apple tags make it "Add to Home Screen"-able. SVG icon installs on Android/Chrome; a PNG icon set would sharpen iOS home-screen fidelity (optional).

## Architecture

- Version footer reads `APP_VERSION` + `BUILD_PR` from `store.js`.
- One shared detail sheet (`sheet.js`) served from both views. Card tap = details; \u2197 arrow = path highlight; empty-space tap clears.
- Potential matchups (`fedBy` depth-1), road-to-here trail, odds heuristic, live countdowns \u2014 see prior version notes.
- OKLCH dark theme, `prefers-reduced-motion` guard, palette locked.

## Version history

- **v4.2** (2026-07-04): Share polish for private family sharing \u2014 OG + Twitter link-preview card, PWA manifest + apple tags + `icon.svg` (installable), cosmetic access gate (`config.json`, code `2026`), `<noscript>` fallback. og-image.png dropped separately (binary).
- **v4.1** (2026-07-04): Version footer; restored tap-empty-to-deselect.
- **v4.0** (2026-07-04): Unified detail sheet across views; flipped delivery (card=details, \u2197=highlight); road-to-here trail.
- **v3.0** (2026-07-04): Modular ES-module split (fixed the 30KB monolith); bracket-tap detail.
- **v2.1 / v2.0** (2026-07-04): Condensed cards, ranks, potential matchups, path highlight, countdowns, QF/SF/Final schedule.
- **v1** (2026-07-02): Initial dual-view build.

## Related

- ClickUp list: World Cup (MAW space)
- Built during the 2026 FIFA World Cup knockout stage

## Roadmap

- PNG icon set for crisp iOS home-screen install
- Flag emoji / SVG flags per country
- Goal scorers / key moments in the road-to-here trail (needs new data fields)
