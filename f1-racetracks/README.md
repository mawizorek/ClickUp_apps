# F1 Racetracks

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)

![Launch](https://img.shields.io/badge/Launch-F1_Racetracks-red?style=for-the-badge)

**Status:** V1.6 main live · upgraded main-app Weekend Center shipped · current-round highlight refined · live tracker companion still available as secondary surface

**Source of truth:** this repo folder

---

## What it does

F1 Racetracks is a browser app for the 2026 Formula 1 circuit breakdowns. It gives you a home grid of rounds, per-circuit detail views, completed-race panels, winners history, live weather, and an OpenF1-backed live-session slice inside the main app.

The current live build pushes the race-weekend layer much harder into the **main app itself**:
- a stronger **Weekend Center** on track pages with `Schedule`, `Live`, and `Replay` modes
- a cleaner **homepage current-round highlight** that points straight into the relevant circuit page
- seeded real session times for the active and near-term report-ready weekends
- live-session state, next-session context, and race-control messaging surfaced directly on the main track page

A separate live-tracking companion page still exists for broader monitoring, but the main app is now the primary weekend experience.

## How to use it

1. Open the main app and use the current-round card or the home grid to jump into a circuit.
2. On a circuit page, use **Weekend Center** to move between `Schedule`, `Live`, and `Replay` where available.
3. Read the circuit profile, pit and tyre notes, overtaking notes, corner-by-corner table, race history, and live weather on the same page.
4. Use the standalone `live-tracker.html` companion only when you want a separate broader session-monitoring surface.
5. Treat `data.json` as the canonical runtime data surface for result/history updates; schedule precision is currently a mix of seeded session-time data and existing weekend metadata.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Slim shipped Pages entrypoint that wires together the runtime modules | Rare structural changes only |
| `data.json` | Canonical runtime data payload for tracks, results, winners, and freshness metadata | Weekly / after each race via MCP |
| `live-tracker.html` | Standalone OpenF1 live-session companion page | Iterated when the live layer expands |
| `source/` | Canonical shell/style/logic edit surface for repo-managed spot edits | Primary edit surface |
| `next-build-spec.md` | Forward-looking build brief and queue | Clear/reset between active builds |

## Architecture

### Runtime model

- `index.html` is the shipped Pages runtime.
- `data.json` is the authoritative runtime data surface.
- `live-tracker.html` is now a secondary companion experience, not the preferred primary path for current-race usage.

### Source model

- `source/` is the canonical repo-managed shell/style/logic companion for future edits.
- The grouped manifest source files are still required because the rescued runtime continues to load them from `data.json`.
- Agents should start from `source/source_index.md` for shell/style/logic edits and from `data.json` for data changes.

### Interaction / rendering notes

- Hash routing drives the main app (`#/` for home, `#/slug` for circuit views).
- The main circuit experience now layers **Weekend Center** above the rest of the page for stronger weekend-first navigation.
- `Schedule` uses seeded real session times where available and falls back to existing weekend metadata elsewhere.
- `Live` attempts to pull the latest OpenF1 state, timing, and race-control feed directly into the track page.
- `Replay` stays editorial / curated rather than pretending to be a full simulator.
- The footer/build label carries the shipped app version plus the current build reference so live Pages states stay easy to track.

### Budget note

- Semantic source files target ~10–12 KB and split at ~15 KB unless an exception is explicitly approved.
- `source/10_track_views_and_profile.js` remains an oversized module.
- `source/11_weather_and_footer_exports.js` is now the most obvious source-budget risk and should be split on the next cleanup pass into dedicated Weekend Center / current-round modules.

## Version history

- **V1.6 main** — upgraded the main-app Weekend Center with `Schedule | Live | Replay`, removed internal-facing public copy, seeded real current/near-term weekend times, and refined the homepage current-round experience.
- **V1.5 PR22** — added the first main-app Weekend Center shell, the homepage current-round highlight card, and the visible build-label convention.
- **v5** — integrated the live session panel into the main app, externalized runtime data into `data.json`, aligned the repo/source/task surfaces, and kept the standalone live tracker companion.
- **v4** — shipped the full standalone circuit breakdown app as the stable pre-repo artifact baseline.

## Related

- ClickUp task: [F1 Racetracks — circuit breakdown app](https://app.clickup.com/t/86aj9wgx0)
- Live tracker companion: [Open live tracker](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html)
- Source index: [`source/source_index.md`](https://github.com/mawizorek/ClickUp_apps/blob/main/f1-racetracks/source/source_index.md)
- Next build brief: [`next-build-spec.md`](https://github.com/mawizorek/ClickUp_apps/blob/main/f1-racetracks/next-build-spec.md)

## Roadmap

- split `source/11_weather_and_footer_exports.js` into dedicated Weekend Center / homepage-current-round modules
- seed explicit timed schedules for more report-ready rounds directly in `data.json`
- enrich replay density once the first stronger main-app playback feel is judged
- decide whether the remaining standalone live-tracker surface should stay broad or be partially absorbed into the main track page over time
