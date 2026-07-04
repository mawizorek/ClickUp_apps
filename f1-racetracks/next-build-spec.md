# f1-racetracks — next build brief

## Source location
- Runtime app: `f1-racetracks/index.html`
- Runtime data: `f1-racetracks/data.json`
- Live-tracking companion: `f1-racetracks/live-tracker.html`
- Preferred shell/style/logic edit surface: `f1-racetracks/source/`
- Current live version on `main`: `V1.5 PR22`

## Scratch intake
- richer support-series schedule detail once the first Weekend Center pass is judged
- denser replay/event cadence if the first race-control / leaderboard playback feels too thin
- possible later fold of more live-tracker surface into the main app once the main-app Weekend Center shape is proven
- continue the `Version PR##` footer/build-label convention across future apps and future F1 iterations

## Next build
- _Empty._

## In review
- _Empty._

## Futures
- explicit per-session timed schedule rows in `data.json`
- broader support-series coverage where it materially improves the running-calendar feel
- replay density upgrades (more beats, clearer phase changes, richer event rhythm)
- stronger bridge between the main Weekend Center and the standalone `live-tracker.html` companion
- source-budget cleanup by moving Weekend Center/home-highlight logic out of `source/11_weather_and_footer_exports.js` into a dedicated module

## Known guardrails
- start shell/style/logic edits from `source/`, not from `index.html`
- keep semantic source files near the ~10–12 KB planning target and split at ~15 KB unless an exception is explicitly approved
- the grouped manifest source files remain required until the runtime data path is changed in a fully aligned pass
- `source/10_track_views_and_profile.js` remains oversized
- `source/11_weather_and_footer_exports.js` is also a budget-risk file after V1.5 PR22 and should be split in the next cleanup pass
