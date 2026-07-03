# F1 Racetracks — semantic source index

**Status:** full semantic source companion for the v4 runtime artifact.

## Purpose

This folder is now the preferred read/edit surface for Patch Penelope and other agents.

The shipped app remains `../index.html`, but the editable source is now broken apart into named files by concern so future edits no longer depend on the runtime monolith or the older repo chunk-set.

## File order

1. `01_runtime_head.html` — document head, chrome helper, library includes, and wrapper opening
2. `02_styles_foundation_and_layout.css.txt` — tokens, layout, cards, charts, early panel rules
3. `03_styles_panels_tables_footer.css.txt` — panels, tables, footer toolbar, weather block, late UI rules
4. `04_runtime_shell.html` — topbar, jump select, app mount, footer shell, wrapper close
5. `05_track_data_rounds_01_03.js` — grouped data for Australia, China, Japan
6. `06_track_data_rounds_06_09.js` — grouped data for Miami, Canada, Monaco, Catalunya
7. `07_track_data_rounds_10_13.js` — grouped data for Austria through Hungary
8. `08_track_data_rounds_14_24.js` — grouped data for Zandvoort through Abu Dhabi stubs
9. `09_app_bootstrap_and_home.js` — version constants, helper setup, router, home render
10. `10_track_views_and_profile.js` — renderTrack, renderSoon, lap-profile builder
11. `11_weather_and_footer_exports.js` — weather fetch, footer metadata, source/data export actions, boot call

## Notes

- `index.html` is still the shipped runtime artifact.
- `source/` is now the canonical edit surface for agents.
- The old repo chunk-set files are superseded and can be removed in this branch once deletion is committed.

## Budget note

Some grouped data files are still larger than the ideal hard threshold. They are already dramatically more navigable than the monolith, but the next refinement should split oversized data groups further by round count or concern.