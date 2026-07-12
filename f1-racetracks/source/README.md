# F1 Racetracks — source companion

This folder holds the **shell / style / logic source** for the two F1 Racetracks lenses. Both lenses run live on GitHub Pages and read ONE canonical results store; no runtime data is duplicated here.

## The two lenses

- **Circuit guide** — `../circuits.html` (slim runtime entrypoint) + the numbered modules in this folder.
- **Championship Matrix / History / Standings** — `../standings.html` + the modules in `./standings/`.
- `../index.html` is a slim router that lands on the Championship Matrix and forwards legacy `#/<slug>` hashes to `circuits.html`.
- `../live-tracker.html` is the standalone live companion surface.

## Canonical data (no `data.json`)

- **Results:** `../f1-results/2026/` — per-round files + `index_rounds.json`. Standings/WDC/WCC and podium/pole/fastest-lap are COMPUTED live, never stored twice.
- **Circuits:** `../circuits/` — one `<slug>.json` per circuit (timeless identity + layout) + `index_circuits.json` (per-year map: round/date/status/sessions, keyed by slug).
- The old `data.json` monolith and the grouped round-band `TRACK_DATA` source files were retired. Do not reintroduce them.

## Important rule

Read **`source_index.md` first** before editing — it is the authoritative map of what each file does.

## Documentation rule

When runtime structure, shell behavior, or data architecture changes, update the README / `source_index.md` / `exact_source_path.md` / runtime header comments in the same pass as the code change.

## Budget note

- target ~10–12 KB per source file
- split at ~15 KB unless an exception is explicitly approved
- documented exception: `10_track_views_and_profile.js`
