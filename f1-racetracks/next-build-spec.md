# f1-racetracks — next build brief

## Source location
- Runtime app: `f1-racetracks/index.html`
- Runtime data: `f1-racetracks/data.json`
- Live-tracking companion: `f1-racetracks/live-tracker.html`
- Preferred shell/style/logic edit surface: `f1-racetracks/source/`
- Current live version on `main`: `V1.6 main`

## Scratch intake
- richer support-series schedule detail once the stronger Weekend Center pass is judged
- denser replay/event cadence if the first elevated playback still feels too thin
- possible further absorption of live-tracker-only affordances into the main circuit page
- continue the `Version reference` footer/build-label convention across future apps and future F1 iterations

## Next build
- _Empty._

## In review
- _Empty._

## Futures
- split `source/11_weather_and_footer_exports.js` into dedicated Weekend Center / homepage current-round modules
- move more timed session data out of seeded JS and into the canonical `data.json` structure
- broaden support-series coverage where it materially improves the weekend-companion feel
- enrich replay density with clearer phase changes and stronger event rhythm
- decide how much of the standalone `live-tracker.html` should remain distinct versus being absorbed into the main app

## Known guardrails
- start shell/style/logic edits from `source/`, not from `index.html`
- keep semantic source files near the ~10–12 KB planning target and split at ~15 KB unless an exception is explicitly approved
- the grouped manifest source files remain required until the runtime data path is changed in a fully aligned pass
- `source/10_track_views_and_profile.js` remains oversized
- `source/11_weather_and_footer_exports.js` is now the strongest budget-risk file after V1.6 main and should be the first cleanup split target
