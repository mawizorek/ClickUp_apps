# app-dashboard / source

Modular source for the App Dashboard (v4+). The repo-root `../index.html` is a slim loader that pulls two stylesheets and four scripts. Every file is kept under the ~12KB source-size gate.

## Module map

| File | Role | Update when |
|------|------|-------------|
| `styles.css` | Core styling: tokens, masthead, window toggle, launcher rows, states, footer, responsive. | Layout/visual changes. |
| `sheet.css` | Detail bottom-sheet styling (split out to stay under the gate). | Sheet visual changes. |
| `data.js` | `APP_META` + `SAMPLE` (ClickUp) and `FM_META` + `FM_SAMPLE` (FileMaker). Metadata + offline fallback. | New app/solution, description edits. |
| `render.js` | List rendering: `render`, `tileMarkup`, `displayName`, `monogram`, `renderFromData`, `buildFromSample`. | Row/list changes. |
| `sheet.js` | Detail sheet: open/close, commit timeline, swipe-to-dismiss. | Sheet behavior changes. |
| `app.js` | Core engine + boot: window switching, GitHub fetch, cache, health, stats, helpers. Holds `APP_VERSION` + `APP_PR`. | Engine changes (version bump). |

## Load order (matters)

`data.js → render.js → sheet.js → app.js`. Only `app.js` runs boot logic at the bottom; the other three just declare functions/data pulled in at call time. Classic scripts share one global scope, so cross-file references resolve as long as this order holds.

## Windows

- **ClickUp** (orange): repo-root app folders minus `EXCLUDED` (includes `filemaker`), Pages health checks, primary action opens the live app.
- **FileMaker** (purple): mirror reading `filemaker/` subfolders, no health/Pages check, primary action is "View on repo".
