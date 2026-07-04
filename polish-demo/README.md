# Polish Standard Demo (polish-demo)

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/polish-demo/)

[![Launch](https://img.shields.io/badge/▶%20Launch%20Polish%20Demo-Open%20in%20browser-7c9cff?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/polish-demo/)

**Status:** Live v1 · **Live:** https://mawizorek.github.io/ClickUp_apps/polish-demo/ · **Source of truth:** [`index.html`](./index.html) on `main`

> Ships **gated** by default. Access code: **2026**. Enter it to lift the smokescreen cover and see the app.

---

## What it does

A living reference of the app-build polish standard. Every item it lists is actually wired into this file's own `<head>` and behavior, so the demo IS an example of the standard it documents.

## The 3-state access layer

Edit `config.json`, one-line commit, and every copy reacts on next open:

| `access` | Behavior |
|----------|----------|
| `open`   | App shows to everyone. |
| `gated`  | Smokescreen cover; the per-app `code` lifts it for the session. (Default.) |
| `down`   | Cover with no way through. Hard kill switch. |

Cosmetic soft-lock by design: source is public and no PII goes in these apps, so it keeps out casual eyes, not determined ones.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Self-contained demo app | Version bumps |
| `config.json` | Access state + code + cover copy | Flip anytime |
| `manifest.webmanifest` | PWA install metadata | Rarely |
| `icon.svg` | Manifest + apple-touch icon | Rarely |

## Related

- **Standard head block:** [`template-app/app-standard-head.html`](../template-app/app-standard-head.html)
- **Reference doc:** [Apps / HTML Artifacts](https://app.clickup.com/36074068/docs/12cwjm-54133/12cwjm-72233)
