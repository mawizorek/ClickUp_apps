# F1 Racetracks source surface

This folder is the canonical editable source surface for `f1-racetracks`.

## Read order

1. `source_index.md`
2. The specific source files named there
3. `../next-build-spec.md` only if there is active future work queued

## Current source shape

- `01` / `04` define the slim runtime entrypoint shell
- `02` / `03` / `03b` define the runtime styling surface
- `05`–`08` hold grouped track data
- `09`–`11` hold the current v5 main-runtime logic surface
- `12` holds the first OpenF1 live-tracker companion helpers

## Budget watch

- Target ~10–12 KB per source file.
- Split at ~15 KB unless explicitly approved otherwise.
- Current watch list:
  - `06_track_data_rounds_06_09.js`
  - `07_track_data_rounds_10_13.js`
  - `08_track_data_rounds_14_24.js`

## Judgement

- The current v5 app is now wired to run from the source surface instead of a giant monolithic runtime file.
- There is no remaining old-structure carryover blocking normal spot edits.
- Future main-app work should edit the relevant files here first, not reverse-engineer `index.html`.
