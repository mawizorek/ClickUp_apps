# Apps Index Template (template-app)

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/template-app/)

[![Launch](https://img.shields.io/badge/▶%20Launch%20Apps%20Index-Open%20in%20browser-ff8000?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/template-app/)

> Opens the live app in your default browser (GitHub Pages). Nothing uploads; all processing is local.
>
> GitHub renders README markdown statically, so the app can't run *inside* this page — the launch link is the supported "docs → running app" path.

**Status:** Shipped v3 · **Live:** https://mawizorek.github.io/ClickUp_apps/template-app/ · **Source of truth:** [`index.html`](./index.html) on `main` (commit history = version history)

---

## What it does

- Serves a live, auto-generated index of every app folder in `mawizorek/ClickUp_apps`.
- Pulls the folder list from the GitHub API in real time, so new app folders appear automatically when they land on `main`.
- Gives each app two shortcuts: the live GitHub Pages URL and the repo folder.
- Acts as the reference retrofit for a **semantic source schema**: the runtime stays self-contained in `index.html`, while the editable source is split into small files under `source/`.
- Proves theme isolation by keeping the visual system in a single team-style source file and restoring the current proof theme to a McLaren-inspired papaya palette.

---

## How to use it

1. **[Launch the app](https://mawizorek.github.io/ClickUp_apps/template-app/)**.
2. Browse the live card list and click **Open app** to jump straight to any app's GitHub Pages entry point.
3. Click **Repo folder** on any card when you want the source folder instead of the live app.
4. To start a new app from this template, copy the folder, rename it to your app slug, and then update the `source/` files first before regenerating `index.html`.
5. To re-theme the template later, edit `source/03_theme_team.css.txt`, then re-inline it into `index.html`.

---

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Self-contained runtime app (the shipped GitHub Pages entry point) | Version bumps |
| `source/01_structure.html` | Canonical shell/layout source | When structure changes |
| `source/02_base.css.txt` | Layout + component styling rules | When the UI system changes |
| `source/03_theme_team.css.txt` | Team-specific theme tokens and accents | When the theme changes |
| `source/04_app.js` | App logic (GitHub API fetch, caching, rendering) | When behavior changes |
| `source/source_index.md` | Human-readable composition order + guardrails | When schema rules change |

---

## Architecture (critical infrastructure notes)

Permanent record of the non-obvious technical decisions.

### Self-contained runtime, semantic editable source

The live app still ships as a single self-contained `index.html`, so GitHub Pages and local-file usage stay simple. The editing surface is now split into a semantic companion source under `source/`, which keeps each file comfortably small and makes theme swaps isolated instead of forcing direct edits against the runtime file.

### Theme isolation is intentional

The current proof theme is McLaren-inspired, and the team identity lives primarily in **one source file**: `source/03_theme_team.css.txt`. That means a future switch to another team should mostly be a single-file CSS edit plus a regenerated inline bundle.

### Live, unhardcoded app list

The app calls `https://api.github.com/repos/mawizorek/ClickUp_apps/contents?ref=main`, filters to directories, and turns them into cards automatically. If the GitHub API is unavailable, the app falls back to the last successful response cached in `localStorage` rather than failing silently.

### This folder is both template and real app

`template-app` is intentionally doing double duty: it remains the reference scaffold for future apps, but it is also a functioning repo index. Changes here should preserve both roles.

---

## Version history

Commit history on `main` is the authoritative changelog. Highlights:

- **v3** — restored the McLaren papaya theme while preserving the semantic source schema and runtime behavior.
- **v2** — semantic `source/` schema proof + isolated team theme + improved runtime UI for the live apps index.
- **v1** — initial lightweight live GitHub-API-driven apps index scaffold.

---

## Related

- **Repo root:** [mawizorek/ClickUp_apps](https://github.com/mawizorek/ClickUp_apps)
- **Reference page:** [Apps / HTML Artifacts](https://app.clickup.com/36074068/docs/12cwjm-54133/12cwjm-72233)
- **Operating standard:** [GitHub MCP — Operating Standard](https://app.clickup.com/36074068/docs/12cwjm-54133/12cwjm-73913)

---

## Roadmap

- Add optional per-app metadata badges (last update, status, or category) if a lightweight manifest becomes worth maintaining.
- Add a tiny regenerate checklist so future edits to `source/` are even harder to drift from the shipped `index.html`.
- Decide whether this semantic-source pattern should become the default for all sub-30KB apps, while over-cap apps continue to use chunked `/source/` renditions.
