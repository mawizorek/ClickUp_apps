# F1 Racetracks — semantic source index

**Status:** transition semantic source companion for the v4 runtime artifact.

## Purpose

This folder is now the preferred read/edit surface for Patch Penelope and other agents.

The shipped app remains `../index.html`, but the editable source is being broken apart into named files by concern so future edits stop depending on the runtime monolith.

## File order

1. `01_runtime_head.html` — document head, chrome helper, library includes, and wrapper opening
2. `02_styles_foundation_and_layout.css.txt` — tokens, layout, cards, charts, early panel rules
3. `03_styles_panels_tables_footer.css.txt` — panels, tables, footer toolbar, weather block, late UI rules
4. `04_runtime_shell.html` — topbar, jump select, app mount, footer shell, wrapper close
5. `05_legacy_track_data_map.md` — mapping for the remaining early-season plaintext handoff slices
6. `07_track_data_rounds_10_13.js` — promoted grouped data for Austria through Hungary
7. `08_track_data_rounds_14_24.js` — promoted grouped data for Zandvoort through Abu Dhabi stubs
8. `09_app_bootstrap_and_home.js` — version constants, helper setup, router, home render
9. `10_track_views_and_profile.js` — renderTrack, renderSoon, lap-profile builder
10. `11_weather_and_footer_exports.js` — weather fetch, footer metadata, source/data export actions, boot call

## Transition rule

- The **logic split is real now**.
- The **later-season grouped data split is now real too** (`07_*`, `08_*`).
- The **remaining early-season data (rounds 01–09)** is still mapped from the trusted plaintext handoff and is the next cleanup target.

## Budget notes

- Soft target: ~10–12 KB per source file
- Hard threshold: ~15 KB unless Michael explicitly approves an exception
- The data promotion is happening in manageable reviewable passes rather than one giant rewrite