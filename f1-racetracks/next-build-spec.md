# F1 Racetracks — next build spec

## Scratch intake

- standalone `live-tracker.html` still needs a stronger fail-soft fetch path
- `source/10_track_views_and_profile.js` remains oversized and is the next clear split target
- grouped round-data files `06` / `07` / `08` are still over the preferred working threshold and should be rebalanced

## Next build

- split `source/10_track_views_and_profile.js` into stable submodules (track render, results/history, profile/helpers)
- rebalance grouped round-data files so no round-data source file sits above the 15 KB working threshold unless explicitly approved
- decide whether the companion live tracker should stay a separate surface or get structurally narrowed now that the main app owns more weekend context

## In review

- direct-to-main structural cleanup shipped on Sat Jul 4:
  - retired `source/14_surface_rescue.js`
  - retired `source/15_compact_polish.js`
  - replaced them with permanent weekend modules:
    - `14_weekend_state_and_data.js`
    - `15_weekend_surface_render.js`
    - `16_weekend_live_mode.js`
    - `17_weekend_mount.js`
    - `18_home_and_mobile_polish.js`

## Futures

- move more seeded weekend timing and replay content into canonical runtime data instead of JS-held seeds
- expand support-series schedule density only after the core F1 weekend surface is stable
- decide whether the live companion should become thinner now that the main app owns the core race-weekend path

## Known guardrails

- start normal edits from `source/`, not from `index.html`
- semantic source target stays ~10–12 KB soft / ~15 KB hard unless explicitly approved otherwise
- 30 KB is an absolute redline / failure state, not a planning target
- do not create new temp-fix source buckets like `surface_rescue` / `compact_polish`; add or split permanent concern-based modules instead
- keep the visible footer build token useful during runtime verification so deploy refreshes are obvious from screenshots
