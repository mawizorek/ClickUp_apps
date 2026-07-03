# F1 Racetracks — semantic source index

**Status:** semantic source companion with runtime data manifest split.

## File order

1. `01_runtime_head.html`
2. `02_styles_foundation_and_layout.css.txt`
3. `03_styles_panels_tables_footer.css.txt`
4. `04_runtime_shell.html`
5. `05_track_data_rounds_01_03.js`
6. `06_track_data_rounds_06_09.js`
7. `07_track_data_rounds_10_13.js`
8. `08_track_data_rounds_14_24.js`
9. `09_app_bootstrap_and_home.js`
10. `10_track_views_and_profile.js`
11. `11_weather_and_footer_exports.js`
12. `exact_source_path.md`

## Runtime note

- `index.html` now fetches `data.json`
- `data.json` points at the grouped data sources used to preserve safe exact-source paths
- footer default/home metadata should now reflect the real loaded round count