# f1-racetracks — next build brief

## Source location

- Runtime app: `f1-racetracks/index.html`
- Runtime data: `f1-racetracks/data.json`
- Live-tracking companion: `f1-racetracks/live-tracker.html`
- Preferred shell/style/logic edit surface: `f1-racetracks/source/`
- Current live version: `v5`

## Scratch intake

- _Empty._

## Next build

- _Empty._

## In review

- _Empty._

## Futures

### Race Weekend Schedule Panel

**Theme:** each circuit page shows the full weekend timetable so the app becomes a weekend companion, not just a static circuit reference.

**What it adds:**

- schedule panel on each circuit detail view for F1 and support-series sessions where applicable
- sessions grouped by day with series badge, session name, and local time
- visual status states for `done`, `upcoming`, and `live`

**Data shape:**

```json
"schedule": [
  {
    "series": "F1",
    "session": "FP1",
    "datetime": "2026-07-04T13:30:00+01:00",
    "status": "upcoming"
  }
]
```

**Implementation note:** this is a `data.json`-first feature. Only touch the shell/style/logic source modules if the panel UI truly needs new runtime code.

## Known guardrails

- Start shell/style/logic edits from `source/`, not from `index.html`.
- Start data edits from `data.json`, not from retired round-band source bundles.
- Keep semantic source files near the ~10–12 KB planning target and split at ~15 KB unless an exception is explicitly approved.
- Current documented exception: `source/10_track_views_and_profile.js` remains oversized and should be the first split target on the next structural touch.