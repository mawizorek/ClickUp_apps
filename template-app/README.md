# Apps Index (template-app)

<!--
  TEMPLATE SCAFFOLD + LIVE APP. This folder does double duty:
  (1) the copy-me scaffold for every new app, and
  (2) a real shipped app — the live index of everything in mawizorek/ClickUp_apps.

  To start a new app: copy this folder, rename it to your app's kebab-case slug,
  swap `template-app` for that slug in EVERY launch URL below, and replace the
  content sections. The authoritative version of this standard lives in
  Brain Reference → "Apps / HTML Artifacts" → New-App Documentation Standard.
  If this template and that section ever drift, the reference doc wins.

  NON-NEGOTIABLE: the ▶︎ Launch block below stays at the very top of every app
  README and points at the CURRENT live version. Overwrite its URL each release.
-->

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/template-app/)

[![Launch](https://img.shields.io/badge/▶%20Launch%20Apps%20Index-Open%20in%20browser-1ea7a7?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/template-app/)

> Opens the live app in your default browser (GitHub Pages). Nothing uploads; all processing is local.
> GitHub renders README markdown statically, so the app can't run *inside* this page — the launch link is the supported "docs → running app" path.

**Status:** Shipped v1 · **Live:** https://mawizorek.github.io/ClickUp_apps/template-app/ · **Source of truth:** [`index.html`](./index.html) on `main` (commit history = version history)

---

## What it does

- Serves a live, auto-generated index of every app folder in `mawizorek/ClickUp_apps`.
- Pulls the folder list from the **GitHub API in real time** — nothing is hardcoded, so new apps appear automatically the moment their folder lands on `main`.
- Each card links straight to that app's live GitHub Pages URL (and its repo folder).
- Doubles as the copy-me scaffold/template for new apps.

---

## How to use it

1. **[Launch the app](https://mawizorek.github.io/ClickUp_apps/template-app/)** (opens in your browser).
2. Browse the auto-generated card list; click any card to open that app's live page.
3. To start a new app, copy this folder, rename it to your app's kebab-case slug, and swap `template-app` for that slug in every launch URL above.

---

## Architecture (critical infrastructure notes)

Permanent record of the non-obvious technical decisions.

### Self-contained, offline-first

Single `index.html`, all CSS + JS inline. Works double-clicked from disk. `index.html` IS the app AND the folder's GitHub Pages entry point — never chunk it, never add a manifest.

### Live, unhardcoded app list

The index calls `https://api.github.com/repos/mawizorek/ClickUp_apps/contents?ref=main`, filters to directories, and skips `template-app` and `.github`. The folder list is therefore always current with no code edits. Names are prettified (kebab → Title Case) for display only; links use the raw folder name. The unauthenticated GitHub API allows ~60 requests/hour per IP, which is plenty for a personal index; if it ever rate-limits, the page shows the API error inline rather than failing silently.

---

## Version history

Commit history on `main` is the authoritative changelog. Highlights:

- **v1** — live GitHub-API-driven apps index + working launch link.

---

## Related

- **ClickUp task (APPS list):** volatile next-build brief + Current Version / Artifact History fields only. No historical notes.
- **Revision History doc:** append-only per-version working notes; page 1 is the locked goals/constraints source of truth.
- **Brain tools:** When Building Apps, HTML Artifact Regeneration.

---

## Roadmap

- Optional: show last-updated date per app (from the GitHub commits API).
- Optional: group apps by status (shipped / in-progress) via a small manifest.
