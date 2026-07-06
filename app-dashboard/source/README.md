# app-dashboard / source

Modular source for the App Dashboard (v4+). The repo-root `../index.html` is a slim loader that pulls these three modules.

## Module map

| File | Role | Update when |
|------|------|-------------|
| `styles.css` | All styling: tokens, masthead, window toggle, launcher rows, detail sheet, responsive + reduced-motion. | Visual/layout changes. |
| `data.js` | `APP_META` + `SAMPLE` (ClickUp window) and `FM_META` + `FM_SAMPLE` (FileMaker window). Metadata + offline fallback datasets. | New app/solution, description edits. |
| `app.js` | Engine: window switching, GitHub tree/commits fetch, cache, render, health checks, detail sheet, footer stamp. Holds `APP_VERSION` + `APP_PR`. | Feature/engine changes (version bump). |

## Windows

- **ClickUp** (orange): reads repo-root app folders (minus `EXCLUDED`), health-checks each via its Pages URL, primary action opens the live app.
- **FileMaker** (purple): mirror that reads `filemaker/` subfolders, no health/Pages check, primary action is "View on repo".

## Reading it back

Each module is well under the ~30KB per-fetch cap, so an agent reads any file whole via raw URL or MCP. No base64 chunk set needed anymore (the old `_of_N.txt` rendition was retired when this went modular).
