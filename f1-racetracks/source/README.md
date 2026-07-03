# F1 Racetracks source surface

This folder is the preferred editable source companion for `f1-racetracks`.

## Read order

1. `source_index.md`
2. The specific source files named there
3. `../next-build-spec.md` only if there is active future work queued

## Current source shape

- `01`–`04` runtime shell and base styles
- `03b` results/mobile delta styles synced from the shipped v5 app
- `05`–`08` grouped track data
- `09`–`11` current v5 runtime logic surface
- `12` live-tracker companion helpers for the first OpenF1 slice

## Budget watch

- Target ~10–12 KB per source file.
- Split at ~15 KB unless explicitly approved otherwise.
- Current watch list:
  - `06_track_data_rounds_06_09.js`
  - `07_track_data_rounds_10_13.js`
  - `08_track_data_rounds_14_24.js`

## Judgement

- The source surface is now synced to the current live v5 runtime structure.
- There is no remaining old-structure carryover that other agents need to reconstruct before making normal spot edits.
- Main-app edits should begin from these source files first; the live `index.html` should be treated as the shipped artifact, not the planning surface.
