# f1-racetracks — next build brief

## Source location
- Runtime app: `f1-racetracks/index.html`
- Runtime data: `f1-racetracks/data.json`
- Live-tracking companion: `f1-racetracks/live-tracker.html`
- Preferred shell/style/logic edit surface: `f1-racetracks/source/`
- Current live version on `main`: `v5`

## Scratch intake
- richer support-series schedule detail once the first Weekend Center pass is judged
- denser replay/event cadence if the first race-control / leaderboard playback feels too thin
- possible later fold of more live-tracker surface into the main app once the main-app Weekend Center shape is proven

## Next build
- _Empty._

## In review
### Main-app Weekend Center + current round highlight
- [PR #22](https://github.com/mawizorek/ClickUp_apps/pull/22)
- high-placement **Weekend Center** is being added directly into the main circuit page flow
- segmented `Schedule | Replay` shell is being used as the first main-app weekend layer
- homepage gets a **current round highlight card** above the unchanged chronological grid
- standalone `live-tracker.html` remains supplemental, not the primary user path

**Current branch direction**
- `Schedule` mode is the default for upcoming / active rounds and uses the existing weekend session metadata as the first calendar surface
- `Replay` mode is the default for completed rounds where editorial replay beats are seeded
- replay feel is intentionally narrow in v1: race-control / leaderboard playback first, not a fake simulator

**Outstanding judgement after review**
- whether the seeded replay cadence is rich enough
- whether the schedule fallback is good enough before explicit per-session timed schedule rows are added to `data.json`
- whether the homepage highlight card needs deeper live status or remains a clean shortcut surface

## Futures
- explicit per-session timed schedule rows in `data.json`
- broader support-series coverage where it materially improves the running-calendar feel
- replay density upgrades (more beats, clearer phase changes, richer event rhythm)
- stronger bridge between the main Weekend Center and the standalone `live-tracker.html` companion
- source-budget cleanup by moving Weekend Center logic out of `source/11_weather_and_footer_exports.js` into a dedicated module

## Known guardrails
- start shell/style/logic edits from `source/`, not from `index.html`
- keep semantic source files near the ~10–12 KB planning target and split at ~15 KB unless an exception is explicitly approved
- the grouped manifest source files remain required until the runtime data path is changed in a fully aligned pass
- `source/10_track_views_and_profile.js` remains oversized
- this branch also makes `source/11_weather_and_footer_exports.js` a new source-budget risk because Weekend Center logic currently lives there for speed; that should be split in the follow-up cleanup pass
