# app-dashboard / source

Modular source for the App Dashboard (v4+). The repo-root `../index.html` is a slim loader that pulls three stylesheets and five scripts. Every file is kept under the ~12KB source-size gate.

## Module map

| File | Role | Update when |
|------|------|-------------|
| `styles.css` | Core styling: tokens (dark default), masthead, window toggle, launcher rows, states, footer, responsive. | Layout/visual changes. |
| `sheet.css` | Detail bottom-sheet styling. | Sheet visual changes. |
| `settings.css` | Light-theme token overrides + settings gear/panel styling. | Theme or drawer visual changes. |
| `data.js` | `APP_META` + `SAMPLE` (ClickUp) and `FM_META` + `FM_SAMPLE` (FileMaker). Optional `label`/`mono` overrides. | New app/solution, description edits. |
| `render.js` | List rendering: `render`, `tileMarkup`, `displayName`/`labelFor`, `monogram`/`monoFor`, `renderFromData`, `buildFromSample`. | Row/list changes. |
| `sheet.js` | Detail sheet: open/close, commit timeline, swipe-to-dismiss. | Sheet behavior changes. |
| `settings.js` | Settings drawer + light/dark theme toggle (persisted to localStorage). | Theme/drawer behavior. |
| `app.js` | Core engine + boot: window switching, GitHub fetch, cache, health, stats, helpers. Holds `APP_VERSION` + `APP_PR`. | Engine changes (version bump). |

## Load order (matters)

`data.js → render.js → sheet.js → settings.js → app.js`. Only `app.js` runs the boot/init at the bottom; the others declare functions/data (or self-wire, in settings.js's case) pulled in at call time. Classic scripts share one global scope, so cross-file references resolve as long as this order holds.

## Theming

Dark is the default (tokens in `styles.css`). The settings gear toggles light mode: an inline script in the loader `<head>` applies the saved theme pre-paint (no flash), and `settings.js` wires the gear + persists the choice. Light-mode tokens live in `settings.css` under `html[data-theme="light"]`. Matches the locked Settings-drawer + theme-toggle app standard.

## Windows

- **ClickUp** (orange): repo-root app folders minus `EXCLUDED` (includes `filemaker`), Pages health checks, primary action opens the live app.
- **FileMaker** (purple): mirror reading `filemaker/` subfolders, no health/Pages check, primary action is "View on repo".
