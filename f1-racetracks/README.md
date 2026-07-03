# F1 Racetracks

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)

![Launch](https://img.shields.io/badge/Launch-F1_Racetracks-red?style=for-the-badge)

**Status:** v5 live · main app + live tracker companion shipped · repo/task/source docs aligned in this close-out pass

**Source of truth:** this repo folder

---

## What it does

F1 Racetracks is a browser app for the 2026 Formula 1 circuit breakdowns. It gives you a home grid of rounds, per-circuit detail views, completed-race panels, winners history, live weather, and an OpenF1-backed live-session slice inside the main app.

It also ships a separate live-tracking companion page for broader session monitoring.

## How to use it

1. Open the main app and choose a round from the home grid or jump menu.
2. Read the circuit profile, pit and tyre notes, overtaking notes, corner-by-corner table, and live weather on the circuit page.
3. Use the standalone `live-tracker.html` companion when you want a broader live-session surface outside the main circuit view.
4. Treat `data.json` as the canonical runtime data surface for schedule/result/history updates.

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

### Source model

- `source/` is the canonical repo-managed shell/style/logic companion for future edits.
- The older grouped round-band source data files have been retired from `source/`; runtime data now lives in `data.json`.
- Agents should start from `source/source_index.md` for shell/style/logic edits and from `data.json` for data changes.

### Interaction / rendering notes

- Hash routing drives the main app (`#/` for home, `#/slug` for circuit views).
- The main circuit experience integrates the first live-session panel directly into matching race pages.
- Shared helpers such as lap-profile rendering, weather loading, and footer export behavior keep the track views consistent.

### Budget note

- Semantic source files target ~10–12 KB and split at ~15 KB unless an exception is explicitly approved.
- One documented exception remains in the close-out state: `source/10_track_views_and_profile.js` is still a merged view/profile module and should be the first split target on the next structural touch.

## Version history

- **v5** — integrated the live session panel into the main app, externalized runtime data into `data.json`, aligned the repo/source/task surfaces, and kept the standalone live tracker companion.
- **v4** — shipped the full standalone circuit breakdown app as the stable pre-repo artifact baseline.

## Related

- ClickUp task: [F1 Racetracks — circuit breakdown app](https://app.clickup.com/t/86aj9wgx0)
- Live tracker companion: [Open live tracker](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html)
- Source index: [`source/source_index.md`](https://github.com/mawizorek/ClickUp_apps/blob/main/f1-racetracks/source/source_index.md)
- Next build brief: [`next-build-spec.md`](https://github.com/mawizorek/ClickUp_apps/blob/main/f1-racetracks/next-build-spec.md)

## Roadmap

- No active build is queued right now.
- Future feature work belongs in `next-build-spec.md`.
- The next structural cleanup target is splitting `source/10_track_views_and_profile.js` when that module is touched again.