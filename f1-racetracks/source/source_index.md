# F1 Racetracks source index

Read this page first when working on the app from source.

## Runtime / layout surface

1. `01_runtime_head.html` — document head + external includes
2. `02_styles_foundation_and_layout.css.txt` — tokens, shell, home layout, shared structural styles
3. `03_styles_panels_tables_footer.css.txt` — panels, tables, footer, winners-history and late UI rules
4. `04_runtime_shell.html` — wrapper shell + footer markup close

## Data source groups

5. `05_track_data_rounds_01_03.js` — rounds 01–03
6. `06_track_data_rounds_06_09.js` — rounds 06–09
7. `07_track_data_rounds_10_13.js` — rounds 10–13
8. `08_track_data_rounds_14_24.js` — rounds 14–24

## Runtime logic

9. `09_app_bootstrap_and_home.js` — boot, router, home grid, shared helpers
10. `10_track_views_and_profile.js` — track render, soon render, lap profile
11. `11_weather_and_footer_exports.js` — weather fetch, footer metadata, source/data export actions

## Live slice companion

12. `12_live_tracker_companion.js` — isolated OpenF1 helper logic for the first live-tracking companion page (`../live-tracker.html`)

## Current reality check

- `index.html` is still the shipped v5 runtime artifact.
- The source scaffold is useful, but it is **not yet a perfect byte-for-byte mirror of the shipped runtime**.
- The live-tracker companion was added as the first OpenF1 slice because it ships safely now while the main source/runtime sync work is completed.
