# F1 Racetracks source index

Read this page first when working on the app from source.

## Runtime / layout surface

1. `01_runtime_head.html` — head / preload / style-loader fragment for the slim runtime entrypoint
2. `02_styles_foundation_and_layout.css.txt` — tokens, shell, home layout, shared structural styles
3. `03_styles_panels_tables_footer.css.txt` — panels, tables, footer, shared late UI rules
4. `03b_styles_results_and_mobile.css.txt` — results panels + post-v5 mobile/runtime fixes
5. `04_runtime_shell.html` — shell / footer / runtime script include fragment for the slim entrypoint

## Data source groups

6. `05_track_data_rounds_01_03.js` — rounds 01–03
7. `06_track_data_rounds_06_09.js` — rounds 06–09
8. `07_track_data_rounds_10_13.js` — rounds 10–13
9. `08_track_data_rounds_14_24.js` — rounds 14–24

## Runtime logic

10. `09_app_bootstrap_and_home.js` — current v5 boot helpers, data load, cache, home grid, router, shared helpers
11. `10_track_views_and_profile.js` — current v5 track render, results panels, winners history, lap profile, soon view
12. `11_weather_and_footer_exports.js` — current v5 weather, footer metadata, source/data export actions, final boot call

## Live slice companion

13. `12_live_tracker_companion.js` — isolated OpenF1 helper logic for the first live-tracking companion page (`../live-tracker.html`)

## Judgement

- F1 Racetracks is now **demonolithized at runtime structure** for the current v5 state: `index.html` is a slim fireable entrypoint, not the primary code container.
- The live app now loads its runtime styles and JS directly from `/source` plus `data.json`.
- Spot edits should start from the source files above.
- `index.html` remains the GitHub Pages entrypoint, but it is no longer a giant self-contained runtime blob.
