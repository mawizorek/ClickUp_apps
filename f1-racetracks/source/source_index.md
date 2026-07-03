# F1 Racetracks — semantic source index

**Status:** active semantic source companion for the v4 runtime artifact.

## Purpose

This folder is now the preferred read/edit surface for Patch Penelope and other agents.

The shipped app remains `../index.html`, but the editable source is split by concern into files that stay below the GitHub/agent read cap and are substantially easier to inspect.

## File order

1. `01_runtime_head.html` — document head, chrome helper, library includes, and wrapper opening
2. `02_styles_foundation_and_layout.css.txt` — tokens, layout, cards, charts, early panel rules
3. `03_styles_panels_tables_footer.css.txt` — panels, tables, footer toolbar, weather block, late UI rules
4. `04_runtime_shell.html` — topbar, jump select, app mount, footer shell, wrapper close
5. `05_track_data_rounds_01_03.js` — Australia, China, Japan
6. `06_track_data_rounds_06_09.js` — Miami, Canada, Monaco, Catalunya
7. `07_track_data_rounds_10_13.js` — Austria, Britain, Spa, Hungary
8. `08_track_data_rounds_14_24.js` — Zandvoort, Monza, Madring, remaining stubs
9. `09_app_bootstrap_and_home.js` — version constants, TRACKS assembly notes, helpers, router, home render
10. `10_track_views_and_profile.js` — renderTrack, renderSoon, lap-profile builder
11. `11_weather_and_footer_exports.js` — weather fetch, footer metadata, source/data export actions, boot call

## Rebuild notes

- Runtime `index.html` remains the live artifact for GitHub Pages.
- Data files 05–08 are intended to be assembled in round order into the runtime `TRACKS` array.
- Files 09–11 are the main JS edit surfaces and should be treated as the canonical logic split.
- The outer HTML shell is intentionally minimal here because the rendered home grid is generated at runtime by `renderHome()`.

## Budget notes

- Soft target: ~10–12 KB per source file
- Hard threshold: ~15 KB unless Michael explicitly approves an exception
- Styles were split into two files immediately to avoid another unreadable monolith

## Legacy note

The old `index-7_partNN_of_11.txt` files remain in this folder as legacy migration inputs for now. This semantic set is the preferred surface going forward, and the legacy files can be removed in a later cleanup PR once this structure is trusted.