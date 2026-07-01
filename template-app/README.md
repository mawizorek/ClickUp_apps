# <App Name>

<!--
  GOLD-STANDARD APP README TEMPLATE.
  Copy this whole folder to start a new app. Replace <App Name>, <app-folder>,
  and every placeholder below. The authoritative version of this standard lives
  in Brain Reference → "Apps / HTML Artifacts" → New-App Documentation Standard.
  If this template and that section ever drift, the reference doc wins.

  NON-NEGOTIABLE: the ▶︎ Launch block below stays at the very top of every app
  README and points at the CURRENT live version. Overwrite its URL each release.
-->

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/<app-folder>/)

[![Launch](https://img.shields.io/badge/▶%20Launch%20<App%20Name>-Open%20in%20browser-1ea7a7?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/<app-folder>/)

> Opens the live app in your default browser (GitHub Pages). Nothing uploads; all processing is local.
> GitHub renders README markdown statically, so the app can't run *inside* this page — the launch link is the supported "docs → running app" path.

**Status:** <e.g. Shipped v1> · **Live:** https://mawizorek.github.io/ClickUp_apps/<app-folder>/ · **Source of truth:** [`index.html`](./index.html) on `main` (commit history = version history)

<One-paragraph summary: what it does, how you use it (drop in X, get Y), the key constraint — offline, client-side, no backend, etc.>

---

## What it does

- <Bullet per capability. Include interaction details: click X to get Y.>
- <Note any export/download behaviors.>

---

## How to use it

1. **[Launch the app](https://mawizorek.github.io/ClickUp_apps/<app-folder>/)** (opens in your browser).
2. <Step.>
3. <Step.>

---

## Architecture (critical infrastructure notes)

Permanent record of the non-obvious technical decisions. This replaces build notes that used to accrete on the ClickUp task description; the task holds only the next-build brief.

### Self-contained, offline-first

Single `index.html`, all CSS + JS inline. Works double-clicked from disk. `index.html` IS the app AND the folder's GitHub Pages entry point — never chunk it, never add a manifest.

### Library stack

<List any CDN libs and the exact job each does. Call out non-obvious choices and anything that FAILED so it isn't re-attempted. Note the first-run CDN caching caveat if libs are external.>

### Downloads (if the app emits files)

Real same-origin `blob:` `<a download>`. Build a Blob → `URL.createObjectURL` → real anchor with `download`. Desktop: fire once. iOS Safari top-level: long-press → "Download Linked File" → Files › Downloads; keep `-webkit-touch-callout: default`. NEVER synthetic `.click()` in sandbox, `data:` URIs, `navigator.share({files})`, `window.open`, or a cross-origin file link (saves a 135-byte `.url` shortcut). See Brain Reference → Apps / HTML Artifacts → Mobile File Export for the full locked pattern.

### <Other decisions>

<Data model, layout rules, reactivity choke points, anything future sessions shouldn't re-learn.>

---

## Version history

Commit history on `main` is the authoritative changelog. Highlights:

- **v1** — <one-line summary of the initial build>.

---

## Related

- **ClickUp task (APPS list):** volatile next-build brief + Current Version / Artifact History fields only. No historical notes.
- **Revision History doc:** append-only per-version working notes; page 1 is the locked goals/constraints source of truth.
- **Brain tools:** <any associated Triggered Tools>.

---

## Roadmap

- <Planned features / known improvements.>
