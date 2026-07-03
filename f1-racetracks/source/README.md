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

## Budget watch

- Target ~10–12 KB per source file.
- Split at ~15 KB unless explicitly approved otherwise.
- Current watch list:
  - `06_track_data_rounds_06_09.js`
  - `07_track_data_rounds_10_13.js`
  - `08_track_data_rounds_14_24.js`

## Notes

- Legacy migration-blocker language is retired.
- `index.html` remains the shipped runtime artifact.
- `data.json` remains the runtime data entry point for live content.
