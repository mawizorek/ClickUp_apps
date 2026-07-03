# F1 Racetracks — semantic source index

**Status:** full semantic source companion for the **v5** runtime artifact.

## Purpose

This folder is the preferred read/edit surface for Patch Penelope and other agents.

The shipped app remains `../index.html`, but the editable source is broken apart into named files by concern so future edits do not depend on the runtime monolith or older chunk-set workflows.

## File order

1. `01_runtime_head.html` — document head, runtime identity, library includes, and wrapper opening
2. `02_styles_foundation_and_layout.css.txt` — tokens, layout, cards, charts, early panel rules, responsive foundation
3. `03_styles_panels_tables_footer.css.txt` — panels, tables, footer toolbar, weather block, late UI rules
4. `04_runtime_shell.html` — topbar, jump select, app mount, footer shell, wrapper close
5. `05_track_data_rounds_01_03.js` — grouped data for Australia, China, Japan
6. `06_track_data_rounds_06_09.js` — grouped data for Miami, Canada, Monaco, Catalunya
7. `07_track_data_rounds_10_13.js` — grouped data for Austria through Hungary
8. `08_track_data_rounds_14_24.js` — grouped data for Zandvoort through Abu Dhabi stubs
9. `09_app_bootstrap_and_home.js` — version constants, data boot, router, home render
10. `10_track_views_and_profile.js` — renderTrack, renderSoon, lap-profile builder
11. `11_weather_and_footer_exports.js` — weather fetch, footer metadata, source/data export actions, boot call

## Notes

- `index.html` is the shipped runtime artifact.
- `data.json` is the runtime payload entry point.
- `source/` is the canonical edit surface for agents.
- Runtime identity / infrastructure comments should stay aligned with README + source docs.

## Budget note

Current grouped data files still exceed the preferred budget in places.

- soft target: ~10–12 KB per semantic source file
- hard threshold: ~15 KB unless explicitly approved otherwise

Next structural cleanup should split the larger grouped data files by smaller round bands or concern.