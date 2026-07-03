# f1-racetracks — next build brief

## Source location

- Runtime app: `f1-racetracks/index.html`
- Runtime data: `f1-racetracks/data.json`
- Live-tracking companion: `f1-racetracks/live-tracker.html`
- Preferred edit surface: `f1-racetracks/source/`
- Current live version: `v5`

## Scratch intake

- _Empty._

## Next build

- _Empty._

## In review

- Main-app live session integration in [PR #17](https://github.com/mawizorek/ClickUp_apps/pull/17)
  - matching-circuit OpenF1 session card inside the main app
  - top running order + race-control context in circuit view
  - no duplicate app versions on `main`; one canonical `f1-racetracks/` app folder

## Futures

- _Empty._ Queue the next feature idea only after this live-integration pass lands.

## Known guardrails

- Spot edits should start from `/source`, not from `index.html`.
- Keep semantic source files near the ~10–12 KB soft target and split at ~15 KB unless explicitly approved otherwise.
- Current budget-watch files:
  - `source/06_track_data_rounds_06_09.js`
  - `source/07_track_data_rounds_10_13.js`
  - `source/08_track_data_rounds_14_24.js`
