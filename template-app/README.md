# <App Name>

<!--
  TEMPLATE: Replace <App Name>, <app-slug>, and every placeholder below.
  The authoritative standard lives in Brain Reference → "Apps / HTML Artifacts"
  → New-App Documentation Standard. If this template drifts, that doc wins.

  NON-NEGOTIABLE: the Launch block below stays at the very top of every app
  README and points at the CURRENT live version. Overwrite its URL each release.
-->

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/<app-slug>/)

[![Launch](https://img.shields.io/badge/Launch-Open_in_browser-1ea7a7?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/<app-slug>/)

> Opens the live app in your default browser (GitHub Pages). Nothing uploads; all processing is local.
> GitHub renders README markdown statically, so the app can't run *inside* this page — the launch link is the supported "docs → running app" path.

**Status:** Shipped v1 · **Live:** https://mawizorek.github.io/ClickUp_apps/<app-slug>/ · **Source of truth:** [`index.html`](./index.html) on `main` (commit history = version history)

---

## What it does

- [Feature 1]
- [Feature 2]

---

## How to use it

1. **[Launch the app](https://mawizorek.github.io/ClickUp_apps/<app-slug>/)** (opens in your browser).
2. [Step]
3. [Step]

---

## Architecture (critical infrastructure notes)

Permanent record of the non-obvious technical decisions. This replaces build notes that used to accrete on the ClickUp task description; the task holds only the next-build brief.

### Self-contained, offline-first

Single `index.html`, all CSS + JS inline. Works double-clicked from disk. `index.html` IS the app AND the folder's GitHub Pages entry point — never chunk it, never add a manifest.

### Library stack

- [e.g. JSZip via CDN, no other deps]

---

## Version history

Commit history on `main` is the authoritative changelog. Highlights:

- **v1** — Initial release.

---

## Related

- **ClickUp task (APPS list):** volatile next-build brief + Current Version / Artifact History fields only. No historical notes.
- **Revision History doc:** append-only per-version working notes; page 1 is the locked goals/constraints source of truth.
- **Brain tools:** [e.g. Chunked Document Review]

---

## Roadmap

- [Next planned feature]
