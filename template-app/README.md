# App Name — Gold Standard Template

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/template-app/)
[![Launch](https://img.shields.io/badge/launch-live-2ea44f)](https://mawizorek.github.io/ClickUp_apps/template-app/)

**Status:** Live · **Source of truth:** this folder · **Role:** the copy / place / audit baseline every ClickUp app starts from.

This is the standing starting point for every app in `mawizorek/ClickUp_apps`. Don't rebuild chrome, theming, and access rules from rules scattered across docs: copy this folder, rename it, swap the placeholders, and you inherit the whole standard already wired together.

## What it does

- A **slim router shell** (`index.html`) that stores no page itself. It loads window pages from `pages/` by hash route and picks the landing with a one-line `DEFAULT_PAGE` constant.
- **Standard chrome** built once by `chrome.js` and shared across every page: banner-logo header, menu dropdown, a Settings drawer (gear) with a live theme picker, and a version/PR footer stamp.
- **Theme-spine styling**: every color comes from `shared/themes` via `var(--token)`. Switch themes in Settings and the whole app reskins live. No color literal lives in the app.
- A **3-state access gate** (`open` / `gated` / `down`) flippable from `config.json` with no code change.
- Full head polish (noindex, Open Graph, PWA manifest, emoji favicon) and accessibility (focus-visible, reduced-motion, skip link).

## How to use it (copy → place → build)

1. **Copy** this folder, rename to your app's kebab slug.
2. **Swap placeholders** at the top of `index.html`: `APP_NAME`, `APP_VERSION`, `APP_PR`, `DEFAULT_PAGE`, the `NAV` list, and the `logo` glyph. Update `<title>`, the meta description, and the OG/Twitter URLs to your slug.
3. **Pick a theme**: leave it on `default-theme` (deliberate gray = "not themed yet") until you choose one in Settings, or set `DEFAULT_THEME`.
4. **Add pages**: drop a partial in `pages/<route>.html` and add a `{route,label}` to `NAV`. That's a new window page, no shell edit beyond the nav line.
5. **Drop `og.png` (1200×630) and `icon.png` (512×512)** at the folder root via the GitHub UI (binaries can't round-trip the commit tool). The app degrades gracefully until they're there.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Slim router shell: head, access gate, boot constants, hash router | Version bumps only |
| `styles.css` | Presentation, token-driven (no color literals) | With UI changes |
| `chrome.js` | Header + menu + settings drawer + footer, built once | With chrome changes |
| `pages/*.html` | Servable window pages (content partials injected into `#view`) | Per page, freely |
| `config.json` | Access gate state (`open`/`gated`/`down`) + code | As access changes |
| `manifest.webmanifest`, `icon.svg` | PWA install scaffold | Rare |

There is **no `source/` folder**. It was a readback aid for monolithic files; the modular files here already read whole under the 30KB cap. `source/` is legacy-only, present only if an app is still a pre-split monolith (which is itself a finding to fix).

## Architecture (non-obvious decisions)

- **index = router, never a stored page.** The shell holds routing + the `DEFAULT_PAGE` landing constant and nothing servable. Every real page is its own file in `pages/`, independently editable and reskinnable without touching the router.
- **Chrome injected once, pages swapped underneath.** `chrome.js` builds the header/drawer/footer a single time; navigation swaps only `#view`. Chrome and the active theme never flash between pages.
- **Theme spine, two layers (no FOUC).** A static `../shared/themes/themes.css` + `data-theme` on `<html>` paints the correct theme on the first byte; `resolve.js` then takes over for live switching and persists the choice to `localStorage`. If the spine can't be fetched (offline / `file://`), `resolve.js` fails to the gray default rather than white-screening.
- **Relative paths only.** The shell reaches the spine at `../shared/themes/…`. Pages are partials fetched into the shell, so they never reference the spine themselves, which keeps the one path in one place and correct.
- **Color is not the app's to decide.** All 17 semantic tokens come from the spine. The only sanctioned non-token literal is the drawer scrim (a neutral black-alpha overlay), which must darken regardless of theme.

## 🚩 Theme Expansion Flag (hard rule)

If your app needs a color the 17 tokens can't express, **do not inline it.** `resolve.js` already hard-fails loud on an unknown slug (no silent unstyled render), and inline color breaks the "reskin without re-rendering" contract. Instead, **STOP and flag a theme expansion at runtime** to the theme steward: propose the token/theme change, get it added to `shared/themes` (a new key bumps `schemaVersion`; existing keys never rename or drop), append the rationale to `shared/themes/decision-log.md`, then consume the new slug. The spine stays the single source of color.

## Version history

- **v1** — initial gold-standard rebuild: slim router shell, injected chrome, theme-spine consumption, conformance checklist, `source/` retired.

## Related

- Live theme system: `shared/themes/` (contract, tokens, preview gallery)
- Audit checklist: [`CONFORMANCE.md`](./CONFORMANCE.md)
- Standards: *Apps / HTML Artifacts* + *GitHub MCP Operating Standard* (Brain Reference Library)

## Roadmap

- Promote `chrome.js` to a shared partial (`shared/chrome/`) once a second app adopts it, so chrome is single-sourced across apps (flagged, not this pass).
- Document an optional data-separated variant (`data.json` + fetch/localStorage cache) for apps with living data.
