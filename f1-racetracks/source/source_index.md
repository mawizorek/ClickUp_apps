# F1 Racetracks — semantic source index

**Status:** authoritative map of the shell/style/logic source for both lenses. Read this first before editing.

## Data surfaces (canonical, not duplicated in source)

- **Results:** `../f1-results/2026/` — `index_rounds.json` + per-round files. WDC/WCC + podium/pole/fastest-lap are computed live.
- **Circuits:** `../circuits/` — `index_circuits.json` (per-year map keyed by slug) + one `<slug>.json` per circuit (timeless identity + layout).
- There is no `data.json` (retired). Do not reintroduce round-band `TRACK_DATA` files.

## Circuit guide — `../circuits.html` + this folder

The entrypoint is self-contained (inline head + shell). It fetches the style band in order, then the logic modules. Cache-busting: bump `BUILD_STAMP` in `circuits.html` AND the `?v=` token on every module tag on each deploy.

**Style band (fetched in this order by `RUNTIME_STYLE_SOURCES`):**

1. `02_styles_foundation_and_layout.css.txt` — tokens, layout, cards, charts, responsive foundation
2. `03_styles_panels_tables_footer.css.txt` — panels, tables, footer toolbar, weather block
3. `04_styles_results_and_mobile.css.txt` — race classification / pole / history board + mobile fixes
4. `05_styles_live_session_panel.css.txt` — live-session + weekend-center panel styling
5. `06_styles_technical_index.css.txt` — dense index grid, compact cards, header carousel (high-specificity `#app`/`#grid`)
6. `07_styles_lens_switcher.css.txt` — cross-lens switcher chrome (Matrix / History / Circuits)

**Logic modules (loaded as `<script>` tags):**

- `09_app_bootstrap_and_home.js` — version constant, hash router, home render, per-circuit boot (fetch index + each circuit file, merge per-year fields), jump handling
- `10_track_views_and_profile.js` — track detail views, soon-state, lap-profile rendering
- `11_weather_and_footer_exports.js` — weather fetch, footer metadata, source/data export actions
- `12_results_store.js` — loads `../f1-results/2026/`, exposes `window.raceResults` + meta for the guide
- `13_live_session_panel.js` — live-session panel logic
- `14_weekend_state_and_data.js` — weekend surface state + data
- `15_weekend_surface_render.js` — weekend surface render
- `16_weekend_live_mode.js` — weekend live mode
- `17_weekend_mount.js` — weekend surface mount
- `18_home_and_mobile_polish.js` — home + mobile polish

**Numbering note:** styles occupy `02–07`, logic occupies `09–18` (the `01`/`08` gaps are historical band boundaries, not missing files; the head/shell partials that once held `01`/`04` are gone — the entrypoint inlines them).

## Standings / Matrix / History — `../standings.html` + `./standings/`

- `base.css` — tokens, layout, matrix table, constructors table chrome
- `panel.css` — race-brief / season-brief side panel
- `data.js` — fetches the results store, computes standings, shared helpers + `APP_VERSION` (footer stamp flows from here via `matrix.js`)
- `matrix.js` — leader strip, drivers points matrix, constructors table
- `trajectory.js` — season trajectory chart (points / gap / position)
- `panel.js` — race + season brief panels, event wiring, boot (`load()`)
- `nav.js` — cross-lens switcher (Matrix · Circuits) + jump-to-round menu
- `history.js` — Season History lens (adds the History segment; `#history` deep-link)

## Budget note

- target: ~10–12 KB per source file
- split threshold: ~15 KB unless explicitly approved
- documented exception: `10_track_views_and_profile.js`
