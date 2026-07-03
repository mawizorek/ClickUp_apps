# App Dashboard

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/app-dashboard/)

[![Launch](https://img.shields.io/badge/launch-app--dashboard-orange?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/app-dashboard/)

**Status:** Live  
**Source of truth:** This folder (`app-dashboard/index.html`)

## What it does

A quick-launch dashboard for every app hosted in this repo. Pulls live data from the GitHub API on every load: folder listing, health checks (Pages reachability), commit recency, and metadata.

- Displays all app folders as cards with health indicators
- Shows last-updated timestamps and commit counts per app
- One-tap launch to the live GitHub Pages URL for each app
- Direct links to each app's repo folder for source access
- Stats bar: total apps, healthy count, recently updated (7-day window)
- McLaren papaya accent theme, dark mode, mobile-first

## How to use it

Open the Pages URL. It loads instantly and fetches the repo state on every visit. Hit "Refresh" to re-pull without reloading the page. Tap "Open app" on any card to launch that app.

This is designed as a phone home screen shortcut: add it to your home screen for one-tap access to the full app grid.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Self-contained app (engine + data) | Version bumps |

## Architecture

- **Single self-contained HTML.** No external dependencies, no build step.
- **Live API fetch on every load.** No hardcoded app list; discovers folders from the repo root via `GET /repos/{owner}/{repo}/contents/`.
- **Health checks via `no-cors` HEAD requests** to each app's Pages URL. Opaque response = live; network error = dead.
- **Commit matching by folder name** in commit messages (heuristic; works for standard commit-msg format).
- **`EXCLUDED` array** at the top of the script defines folders that aren't apps (template-app, app-dashboard itself, config files).
- **`APP_META` object** provides optional per-app descriptions and badge overrides.
- **Responsive:** fluid layout, `clamp()` headings, safe-area padding, 44px+ touch targets.

## Version history

- **v1** (2026-07-02) — Initial standalone build. Split from template-app which previously served dual duty as both the template scaffold and the app dashboard. Clean launcher UI, zero dev narration.

## Related

- **Template App** (`/template-app/`) — the repo's build standard reference (no longer renders the dashboard)
- **Root `index.html`** — earlier prototype (may be repurposed or removed)

## Roadmap

- Favorites / recently-opened sort via localStorage
- Richer stats (total commits this week, last deploy timestamp)
- Per-app commit-path filtering via GitHub API (more accurate than message-matching)
- Config object extracted to a separate constant block for easier maintenance
