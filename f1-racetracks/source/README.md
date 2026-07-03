# F1 Racetracks source surface

This folder is the preferred editable source companion for `f1-racetracks`.

## Read order

1. `source_index.md`
2. The specific source files named there
3. `../next-build-spec.md` for the current approved build brief

## Current source shape

- `01`–`04` runtime shell and styles
- `05`–`08` grouped track data
- `09`–`11` bootstrap, track views, weather/footer logic
- `12` live-tracker companion helpers for the first OpenF1 slice

## Budget watch

- Target ~10–12 KB per source file.
- Split at ~15 KB unless explicitly approved otherwise.
- Current watch list:
  - `06_track_data_rounds_06_09.js`
  - `07_track_data_rounds_10_13.js`
  - `08_track_data_rounds_14_24.js`

## Important state note

- `index.html` remains the shipped runtime artifact.
- `data.json` remains the runtime data entry point for live content.
- The source scaffold still needs a fuller sync pass against the shipped v5 runtime so future main-app feature work can move faster and more safely.
- `12_live_tracker_companion.js` is the first step in that direction: OpenF1 logic now has a dedicated source surface instead of living only in a one-off page.
