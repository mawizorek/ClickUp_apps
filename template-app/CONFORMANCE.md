# Template Conformance Checklist

**What this is:** the audit baseline. Recon Renata (or any reviewer) diffs a real app's folder against this list to find gaps. Every box is a rule the gold-standard template satisfies; a miss on a shipped app is a finding to fix.

## Folder shape
- [ ] `index.html` is a **slim router shell**, not a stored page or a monolith. Holds head, gate, boot constants, router. Well under 12KB.
- [ ] Real pages live in `pages/<route>.html` as content partials.
- [ ] **No `source/` folder** unless the app is a legacy pre-split monolith (itself a finding).
- [ ] `styles.css`, `chrome.js`, `config.json`, `manifest.webmanifest`, `icon.svg`, `README.md`, `CONFORMANCE.md`, `next-build-spec.md` all present.
- [ ] `README.md` opens with a launch button to the live Pages URL and carries the Infrastructure table.

## Theme spine (the color contract)
- [ ] Links `../shared/themes/themes.css` (static, instant paint) **and** `../shared/themes/resolve.js` (live switching).
- [ ] `<html data-theme="…" data-mode="…">` set for first-paint theming.
- [ ] **Every color is `var(--token)`** from the 17-token contract. Zero color literals in `styles.css`, `chrome.js`, or pages. (Sole exception: the neutral black-alpha drawer scrim.)
- [ ] Default is `default-theme` (deliberate gray) until a theme is chosen.
- [ ] Settings drawer theme picker auto-populates from `THEMES.list()` and persists to `localStorage`.
- [ ] Theme Expansion Flag honored: an unmet color need is flagged to the steward, never inlined (see README).

## Chrome (built once by chrome.js)
- [ ] Banner-logo header with the app name.
- [ ] Menu dropdown listing the `NAV` routes; collapses on mobile; closes after a pick.
- [ ] Settings gear opens a solid-surface drawer (no glassmorphism). Closes on ✕, scrim click, Esc, and gear re-toggle; `aria-expanded` tracks state.
- [ ] Footer carries the JS-written stamp `App Name v<N> · PR #<n>` (never hardcoded).
- [ ] Every interactive control has its full state lifecycle: entry, exit/reset, rest state, no gesture collisions.

## Head polish + access
- [ ] Tier 1: `theme-color`, `viewport-fit=cover`, `robots noindex`, `<title>`, description, Open Graph + Twitter (absolute `og.png` URL), emoji-SVG favicon, `<html lang>`.
- [ ] Tier 2: manifest + apple-touch-icon, `prefers-reduced-motion` guard, `<noscript>`, `:focus-visible`.
- [ ] 3-state access gate wired to `config.json` (`open`/`gated`/`down`) with an inline fallback.

## Build hygiene
- [ ] Every file under the ~12KB source gate; nothing near the 30KB read cap.
- [ ] Mobile clean at 320–390px: no horizontal overflow, ≥44px touch targets, chrome wraps/stacks.
- [ ] `.nojekyll` present at the repo root (site-wide, not per-app).
- [ ] Live values computed at runtime, not hardcoded (footer stamp, dates, states).
