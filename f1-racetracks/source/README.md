# F1 Racetracks — semantic source companion

This folder is the **preferred shell/style/logic source surface** for F1 Racetracks.

The shipped app still runs from `../index.html`, and the canonical runtime data now lives in `../data.json`.

## Current state

- current live runtime target: **v5**
- runtime architecture: `index.html` shell + `data.json` payload + `live-tracker.html` companion
- `source/` now focuses on shell, styles, bootstrap, track views, weather/footer behavior, and the live session panel logic
- the old grouped round-band source data files have been retired from this folder; runtime data belongs in `../data.json`

## Important rule

Read **`source_index.md` first** before editing.

## Documentation rule

When runtime structure, shell behavior, or live architecture changes, update the corresponding README / spec / runtime header comments in the same pass as the code change.

## Budget note

- target ~10–12 KB per semantic source file
- split at ~15 KB unless an exception is explicitly approved
- current documented exception: `10_track_views_and_profile.js`

## Goal

Keep the runtime, source layout, and documentation surfaces aligned so future app work starts from the actual shell/style/logic source files plus `../data.json`, not from stale migration notes or guesswork over the monolith.