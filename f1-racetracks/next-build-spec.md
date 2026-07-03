# f1-racetracks — next build brief

## Source location

- Runtime app: `f1-racetracks/index.html`
- Runtime data: `f1-racetracks/data.json`
- Live-tracking companion: `f1-racetracks/live-tracker.html`
- Preferred edit surface: `f1-racetracks/source/`
- Current live version: `v5`

## Scratch intake

- Reserved for the next approved idea after the current live-tracker slice is reviewed.

## Next build

- _Empty._ Waiting for the next approved build brief.

## In review

- First live-tracking slice shipped as a companion page in [PR #15](https://github.com/mawizorek/ClickUp_apps/pull/15)
  - latest session state via OpenF1
  - running order / interval table
  - race-control message feed
  - circuit-slug handoff back into the main app when a match exists

## Futures

- Integrate the live tracker slice into the main circuit runtime once the first OpenF1 path is approved
- Broaden live data surfaces after that first merge
  - position tower inside the track page
  - race control ticker in the main runtime
  - tyre strategy strip
- Split grouped source data files that are over the size budget
- Add further season-analytics surfaces after the next build is chosen

## Known guardrails

- `index.html` is the live runtime artifact and is currently above the safe small-file-write comfort zone, so runtime-wide rewrites should stay tightly scoped.
- Prefer `source/` as the editable surface for logic/docs work.
- Keep semantic source files near the ~10–12 KB soft target and split at ~15 KB unless explicitly approved otherwise.
- Current budget-watch files:
  - `source/06_track_data_rounds_06_09.js`
  - `source/07_track_data_rounds_10_13.js`
  - `source/08_track_data_rounds_14_24.js`
- Use data-only updates where possible; engine/runtime changes should be narrowly scoped and reviewable.
