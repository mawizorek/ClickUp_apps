# F1 Racetracks source surface

This folder is the canonical editable source surface for `f1-racetracks`.

## Read order

1. `source_index.md`
2. The specific source files named there
3. `../next-build-spec.md` only if there is active future work queued

## Current source shape

- `01` / `04` define the slim runtime entrypoint shell
- `02` / `03` / `03b` / `03c` define the runtime styling surface
- `05`–`08` hold grouped track data
- `09`–`11` hold the current v5 main-runtime logic surface
- `13` holds the main-app live session integration slice
- `12` remains the standalone live-tracker companion helper layer

## Budget watch

- Target ~10–12 KB per source file.
- Split at ~15 KB unless explicitly approved otherwise.
- Current watch list:
  - `06_track_data_rounds_06_09.js`
  - `07_track_data_rounds_10_13.js`
  - `08_track_data_rounds_14_24.js`

## Judgement

- The current v5 app is wired to run from the source surface instead of a giant monolithic runtime file.
- There is no remaining old-structure carryover blocking normal spot edits.
- The main app and the live tracker now both have dedicated source surfaces.
- Future main-app work should edit the relevant files here first, not reverse-engineer `index.html`.
