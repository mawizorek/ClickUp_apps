# F1 Racetracks source index

Read this page first when working on the app from source.

## Runtime / layout surface

1. `01_runtime_head.html` — head / preload / style-loader fragment for the slim runtime entrypoint
2. `02_styles_foundation_and_layout.css.txt` — tokens, shell, home layout, shared structural styles
3. `03_styles_panels_tables_footer.css.txt` — panels, tables, footer, shared late UI rules
4. `03b_styles_results_and_mobile.css.txt` — results panels + post-v5 mobile/runtime fixes
5. `03c_live_session_panel.css.txt` — integrated main-app live session panel styles
6. `04_runtime_shell.html` — shell / footer / runtime script include fragment for the slim entrypoint

## Data source groups

7. `05_track_data_rounds_01_03.js` — rounds 01–03
8. `06_track_data_rounds_06_09.js` — rounds 06–09
9. `07_track_data_rounds_10_13.js` — rounds 10–13
10. `08_track_data_rounds_14_24.js` — rounds 14–24

## Runtime logic

11. `09_app_bootstrap_and_home.js` — current v5 boot helpers, data load, cache, home grid, router, shared helpers
12. `10_track_views_and_profile.js` — current v5 track render, results panels, winners history, lap profile, soon view
13. `11_weather_and_footer_exports.js` — current v5 weather, footer metadata, source/data export actions, final boot call
14. `13_live_session_panel.js` — integrated main-app OpenF1 status / positions / race-control panel for matching circuit pages

## Live slice companion

15. `12_live_tracker_companion.js` — isolated OpenF1 helper logic for the standalone `../live-tracker.html` companion page

## Judgement

- There is one canonical F1 Racetracks app folder on `main`: `f1-racetracks/`.
- The live v5 app is demonolithized at runtime structure: `index.html` is a slim fireable entrypoint, not the primary code container.
- The main app now loads runtime styles and JS directly from `/source` plus `data.json`.
- The main circuit experience also includes the first integrated live session panel for matching OpenF1 circuit pages.
- Spot edits should start from the source files above.
