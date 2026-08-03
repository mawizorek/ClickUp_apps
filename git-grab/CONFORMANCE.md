# git-grab — Conformance Checklist

Copied from `template-app/CONFORMANCE.md` (the audit baseline). Boxes are ticked against the **Wave 0 scaffold**; unticked boxes are honest gaps, not oversights. Re-run this in full at Wave 4.

## Folder shape
- [x] `index.html` is a **slim router shell**, not a stored page or a monolith. **7,624 B**, read back at HEAD.
- [x] Real pages live in `pages/<route>.html` as content partials.
- [x] **No `source/` folder** (not a legacy monolith).
- [x] `styles.css`, `chrome.js`, `config.json`, `manifest.webmanifest`, `icon.svg`, `README.md`, `CONFORMANCE.md`, `next-build-spec.md` all present.
- [x] `README.md` opens with a launch button to the live Pages URL and carries the Infrastructure table.

## Theme spine (the color contract)
- [x] Links `../shared/themes/themes.css` (static, instant paint) **and** `../shared/themes/resolve.js` (live switching).
- [x] `<html data-theme="maw-dark-utility" data-mode="dark">` set for first-paint theming.
- [x] **Every color is `var(--token)`** in `styles.css`, `chrome.js`, and pages. Zero literals. *(Exceptions, both deliberate: the neutral black-alpha drawer scrim, and `icon.svg`, a standalone image asset that cannot read CSS variables when used as a favicon.)*
- [ ] ⚠️ **Default is `default-theme` (deliberate gray) until a theme is chosen.** — **NOT met, deliberately, and this is the one checklist line worth reading.** `default-theme` is a **COLOR** entity in `_index.json`; it does not exist as a **JOIN** in `_themes.json`, and `applyTheme()` takes a join. Passing it would fault. This app therefore points at `soft-utility`, which `_themes.json` describes verbatim as the *"balanced everyday default for new apps copied from template-app."* **The checklist line is ambiguous between the two vectors and should be reworded at the source** — flagged for the theme steward, not patched here.
- [x] Settings drawer theme picker auto-populates from `THEMES.list()` and persists to `localStorage`.
- [x] Theme Expansion Flag honored: no unmet color need was inlined; zero new vectors, zero new objects.

## Chrome (built once by chrome.js)
- [x] Banner-logo header with the app name.
- [x] Menu dropdown listing the `NAV` routes; collapses on mobile; closes after a pick.
- [x] Settings gear opens a solid-surface drawer (no glassmorphism). Closes on ✕, scrim click, Esc, and gear re-toggle; `aria-expanded` tracks state.
- [x] Footer carries the JS-written stamp `git-grab v0.1 · PR #713` (never hardcoded).
- [ ] Every interactive control has its full state lifecycle. **Wave 4** — the app's own controls are inert in Wave 0. The chrome's controls do pass.

## Head polish + access
- [x] Tier 1: `theme-color`, `viewport-fit=cover`, `robots noindex`, `<title>`, description, Open Graph + Twitter (absolute URL), emoji-SVG favicon, `<html lang>`.
- [ ] ⚠️ **`og.png` does not exist yet.** The tags point at it correctly; the binary must be dropped via the GitHub UI (the agent write path cannot commit binaries).
- [x] Tier 2: manifest + apple-touch-icon, `prefers-reduced-motion` guard, `<noscript>`, `:focus-visible`.
- [x] 3-state access gate wired to `config.json` (`open`/`gated`/`down`) with an inline fallback. Currently `open`: no data, no secrets, `noindex`, and gating a tool Michael runs himself is friction with no payoff.

## Build hygiene
- [ ] ⚠️ Every file under the ~12KB source gate. **`chrome.js` is 10,934 B (pass) but `styles.css` is 14,130 B — over the ~12KB target, under the 15KB split line.** Read back at HEAD, not estimated. Watch it: it does not grow again without a split.
- [ ] Mobile clean at 320–390px. **Wave 4**, untested.
- [x] `.nojekyll` present at the repo root (site-wide, pre-existing).
- [x] Live values computed at runtime, not hardcoded (footer stamp is JS-written from `cfg`).
