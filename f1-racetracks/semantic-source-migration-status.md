# f1-racetracks — semantic source migration status

## Status

- Archived / superseded on 2026-07-03.
- The original blocker note about lacking a trusted exact-source handoff is no longer the active state for this app.

## Current state

- `f1-racetracks/source/` now exists as a working semantic companion for the app.
- `data.json` is live as the externalized runtime data payload.
- The remaining source concern is file-size budgeting and cleanup, not source establishment.

## Remaining cleanup

- Split the oversized grouped data files:
  - `source/06_track_data_rounds_06_09.js`
  - `source/07_track_data_rounds_10_13.js`
  - `source/08_track_data_rounds_14_24.js`
- Keep `source/source_index.md` aligned if the source surface changes again.

## Why this file still exists

- Historical pointer only.
- Do not use this file as the active next-build brief.
- Use `next-build-spec.md` for the next approved build.
