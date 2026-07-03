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
5. `05_legacy_track_data_map.md` — mapping from trusted plaintext handoff slices to round regions during the transition
6. `09_app_bootstrap_and_home.js` — version constants, helper setup, router, home render
7. `10_track_views_and_profile.js` — renderTrack, renderSoon, lap-profile builder
8. `11_weather_and_footer_exports.js` — weather fetch, footer metadata, source/data export actions, boot call

## Transition rule

- The **logic split is real now**.
- The **data split is mapped and trusted from the plaintext handoff**, but not yet promoted into named grouped data files in this PR.
- Once this scaffold is trusted, the next cleanup PR can replace the legacy data slices with grouped round-data source files and remove the old `index-7_partNN_of_11.txt` inputs.

## Budget notes

- Soft target: ~10–12 KB per source file
- Hard threshold: ~15 KB unless Michael explicitly approves an exception
- Styles were split immediately to avoid another unreadable monolith

## Legacy note

The old `index-7_partNN_of_11.txt` files remain in this folder as trusted migration inputs for now. This semantic scaffold is the preferred direction going forward.