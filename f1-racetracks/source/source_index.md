# F1 Racetracks — semantic source index

**Status:** shell/style/logic companion for the **v5** runtime artifact.

## Purpose

This folder is the preferred read/edit surface for Patch Penelope and other agents when working on the app shell, styles, routing, track views, weather/footer behavior, and live session UI.

The shipped app remains `../index.html`, and the authoritative runtime data surface is `../data.json`.

## File order

1. `01_runtime_head.html` — document head, runtime identity, library includes, and wrapper opening
2. `02_styles_foundation_and_layout.css.txt` — tokens, layout, cards, charts, and responsive foundation
3. `03_styles_panels_tables_footer.css.txt` — panels, tables, footer toolbar, weather block, and late UI rules
4. `03b_styles_results_and_mobile.css.txt` — results styling and mobile-specific layout rules
5. `03c_live_session_panel.css.txt` — integrated live-session panel styling
6. `04_runtime_shell.html` — topbar, jump select, app mount, footer shell, wrapper close
7. `09_app_bootstrap_and_home.js` — version constants, hash router, home render, jump handling
8. `10_track_views_and_profile.js` — track views, soon-state render, lap-profile rendering
9. `11_weather_and_footer_exports.js` — weather fetch, footer metadata, source/data export actions, boot call
10. `13_live_session_panel.js` — OpenF1-backed live-session panel logic

## Data surface

- `../data.json` is the canonical runtime data source for tracks, race results, winners history, and freshness metadata.
- Do not reintroduce duplicated round-band track data files into `source/`.

## Notes

- `index.html` is the shipped runtime artifact.
- `live-tracker.html` is the standalone companion surface.
- Runtime identity / infrastructure comments should stay aligned with the top-level README and `next-build-spec.md`.

## Budget note

- target: ~10–12 KB per semantic source file
- split threshold: ~15 KB unless explicitly approved otherwise
- current documented exception: `10_track_views_and_profile.js`