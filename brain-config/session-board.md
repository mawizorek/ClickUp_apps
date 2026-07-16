# Session Board

## Active

- **Brain** — building the first FileMaker layout render for maw-budget: `filemaker/maw-budget/layouts/utility/LAYOUT-global-variables/` (index.html + layout.json + README.md). Establishing the folder-per-layout + JSON-driven renderer convention. Touching only that layout folder + `layouts/_index.json` + `meta/changelog.md`. Via branch `maw-budget-layout-global-variables`.
- **Brain** — `inciardi-market` v12 on branch `fix/inciardi-catalog-landing-mobilenav-data`: (1) catalog.html becomes default landing in `index.html`; (2) mobile slide-out nav drawer built in `source/app-core.js` + styled in `source/base.css`; (3) DATA FIX — `apiGet` gets an AbortController timeout so a dead Worker fails fast and the `catalog.json` seed renders instead of hanging on “connecting…”. Only touching `inciardi-market/` files.
