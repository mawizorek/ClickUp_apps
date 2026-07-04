# F1 Racetracks

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)

![Launch](https://img.shields.io/badge/Launch-F1_Racetracks-red?style=for-the-badge)

**Status:** V1.6 main live · active runtime debug gate on `main`: `V1.6b dbg1` · upgraded main-app Weekend Center in repair loop until it visibly mounts on the live page

**Source of truth:** this repo folder

---

## What it does

F1 Racetracks is a browser app for the 2026 Formula 1 circuit breakdowns. It gives you a home grid of rounds, per-circuit detail views, completed-race panels, winners history, live weather, and an OpenF1-backed live-session slice inside the main app.

The intended current live direction is a stronger race-weekend layer directly in the **main app itself**:
- a **Weekend Center** on track pages
- a **homepage current-round highlight** that points into the relevant circuit page
- real current/near-term session timing on the active weekend surface
- the standalone live tracker kept as a secondary tool rather than the primary user path

## How to use it

1. Open the main app and use the home grid or jump menu to open a circuit.
2. On active weekend pages, look for the main-page weekend layer rather than the separate companion first.
3. Use the standalone `live-tracker.html` companion when you want a broader separate monitoring surface.
4. Treat `data.json` as the canonical runtime data surface for result/history updates.

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
- `live-tracker.html` is a separate companion experience, not a replacement for the main app.
- Current debugging focus: ensure the shipped runtime visibly mounts the current-round card and Weekend Center from the real render path on the live Pages surface.

### Source model

- `source/` is the canonical repo-managed shell/style/logic companion for future edits.
- The grouped manifest source files are still required because the rescued runtime continues to load them from `data.json`.
- Agents should start from `source/source_index.md` for shell/style/logic edits and from `data.json` for data changes.

### Interaction / rendering notes

- Hash routing drives the main app (`#/` for home, `#/slug` for circuit views).
- The footer/build label is being used as the current refresh gate while the runtime exposure bug is being debugged.
- The Weekend Center/current-round work should be treated as incomplete until the live page visibly exposes it, not just until the repo code exists.

### Budget note

- Semantic source files target ~10–12 KB and split at ~15 KB unless an exception is explicitly approved.
- `source/10_track_views_and_profile.js` remains an existing oversized module.
- `source/11_weather_and_footer_exports.js` is the current source-budget risk and should be split after the runtime exposure issue is resolved.

## Version history

- **V1.6 main** — stronger main-app Weekend Center direction, live/current-weekend data push, and product-copy cleanup (repo-side), with follow-up runtime mounting repairs still in progress.
- **V1.5 PR22** — added the first main-app Weekend Center shell, the homepage current-round highlight card, and the visible build-label convention.
- **v5** — integrated the live session panel into the main app, externalized runtime data into `data.json`, aligned the repo/source/task surfaces, and kept the standalone live tracker companion.
- **v4** — shipped the full standalone circuit breakdown app as the stable pre-repo artifact baseline.

## Related

- ClickUp task: [F1 Racetracks — circuit breakdown app](https://app.clickup.com/t/86aj9wgx0)
- Live tracker companion: [Open live tracker](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html)
- Source index: [`source/source_index.md`](https://github.com/mawizorek/ClickUp_apps/blob/main/f1-racetracks/source/source_index.md)
- Next build brief: [`next-build-spec.md`](https://github.com/mawizorek/ClickUp_apps/blob/main/f1-racetracks/next-build-spec.md)

## Roadmap

- finish the active runtime exposure repair so the current-round card + Weekend Center visibly mount on the live page
- split `source/11_weather_and_footer_exports.js` into dedicated Weekend Center / homepage-current-round modules
- seed explicit timed schedules for more report-ready rounds directly in `data.json`
- enrich replay density once the stronger main-app playback feel is judged
