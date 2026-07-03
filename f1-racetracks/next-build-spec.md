# f1-racetracks — next build brief

## Source location

- Runtime app: `f1-racetracks/index.html`
- Runtime data: `f1-racetracks/data.json`
- Preferred edit surface: `f1-racetracks/source/`
- Current live version: `v5`

## Scratch intake

- Reserved for the next approved idea.
- The previously discussed OpenF1 contextual live/replay layer was not started here and has been parked in `Futures` so this file is clear for the next scoped brief.

## Next build

- _Empty._ Waiting for the next approved build brief.

## In review

- _Empty._

## Futures

- OpenF1 contextual session layer:
  - overlay live/replay-aware session context on supported rounds
  - candidate surfaces: position tower, race control ticker, tyre strategy strip
  - likely start with a narrow first slice instead of a full multi-panel live layer
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
