# f1-racetracks — Next Build Spec

**Cycle:** v7 (unified shell + theme spine adoption)
**Prior cycle:** v6 (Story Mode) — chunk set complete, splice parked until this rebuild lands

---

## Directive

Rebuild the F1 app into the standard repo object structure so all screens read as one app with one shared theme. Currently 5 separate HTML files with duplicated chrome, hardcoded hue-268 colors, and no connection to the shared theme spine.

**Target state:** one `index.html` shell (template-app pattern), `chrome.js` shared chrome, `pages/` partials, all consuming the theme spine via `THEMES.applyTheme('f1')`. The data layer and JS logic modules are preserved unchanged.

---

## Pre-build: Schema validation (DO THIS FIRST)

Before touching any code, validate the README schema section against reality. The FM-style schema (Tables, Fields, Relationships, Screen Contexts) was authored 2026-07-25. It needs to survive a week of Michael looking at it before we build a shell around it.

**Questions to settle:**

- Does the screen hierarchy (3 lenses → circuit breakdown → weekend detail) still feel right?
- Should standings remain a satellite or fold into the main router?
- Is `circuits.html` redundant with the [Circuits] lens? Kill it or keep it?
- Does live-tracker stay standalone or join the shell?
- Where does the future tyre analysis page land (its own page in the router, or a mode on the circuit breakdown)?

**When these are answered, update the README Screens section and proceed.**

---

## Build plan (after schema is locked)

### Phase 1: Shell scaffold
- New `index.html` following template-app v5 pattern (slim hash-router, `<html data-theme data-mode>`)
- `chrome.js` with header (lens toggle + nav links), settings drawer (theme picker), footer
- Link `shared/themes/themes.css` + `resolve.js`
- Boot with `THEMES.applyTheme('f1')` — compose the F1 theme join from whatever exists in `shared/themes/f1/`
- `:root` fallback floor = current hue-268 tokens (so a failed theme load doesn't white-screen)
- **Team colors (the 20-series) are a LOCAL identity layer.** They ride on top of any theme, never inside it. Same pattern as On Track.

### Phase 2: Port Home Grid
- Move `09_app_bootstrap_and_home.js` logic into the new shell
- Split it on the way (it's 26KB, over budget): router logic vs home-grid render vs lens-filter logic
- Home grid becomes `pages/home.html` or inline in the router (TBD based on size)
- Lens toggle moves into `chrome.js` header

### Phase 3: Port Circuit Breakdown
- `10_track_views_and_profile.js` + `11_weather_and_footer_exports.js` become a `pages/circuit.html` partial
- Weekend Center (14-17) renders inside the circuit page as before
- Driver Popup stays as an overlay within the circuit context

### Phase 4: Port Standings
- `source/standings/` chunk set renders into a `pages/standings.html` partial
- No longer a separate HTML file; lives in the router

### Phase 5: Port Weekend Race Detail
- The monolith (`weekend.html`) becomes `pages/weekend.html` partial
- On this port, the Story Mode splice can happen naturally (it's the same partial, just adding the story chunks)
- This is where Story Mode v6 finally ships

### Phase 6: Retire satellites
- Delete `standings.html`, `circuits.html` (if decided to fold), `weekend.html` as top-level files
- Redirect any external links (app-dashboard, ClickUp tasks) to the new hash routes
- Update VERSIONS.md to v7

---

## What stays unchanged

- **All data files** (`data.json`, `f1-results/2026/`, `circuits/`, `index_rounds.json`)
- **All JS logic modules** (09-18) — they get LOADED by the new shell, not rewritten
- **`live-tracker.html`** — stays standalone (separate context: OpenF1 real-time, no store dependency)
- **`story-mode-reference.html`** — stays as splice reference until Phase 5 absorbs it

---

## Theme: the F1 join

The theme is a 4-vector: colors × typography × forms × spacing.

| Vector | Current (hardcoded) | Target (spine join) |
|--------|--------------------|-----------|
| Colors | hue-268 custom palette | `shared/themes/f1/<color>.json` (to be authored) |
| Typography | Chakra Petch + Inter + JetBrains Mono | `shared/themes/f1/typography` row in `typography.tsv` or standalone |
| Forms | sharp corners, 1px lines | `shared/themes/f1/forms` row |
| Spacing | custom per-file | inherit from spine default (standard spacing) |

**The F1 identity layer (ON TOP of theme):**
- Team colors (`--t-mercedes`, `--t-ferrari`, etc.) — the 20 named team vars
- Sector colors (`--s1`, `--s2`, `--s3`)
- Status colors (purple FL, green personal best, yellow sector)
- These are LOCAL and never swept into the theme vector

---

## Acceptance criteria (full rebuild)

- [ ] Single `index.html` serves all screens via hash router
- [ ] `chrome.js` renders shared header/footer/settings on every page
- [ ] Theme loads from spine (`THEMES.applyTheme('f1')`) — picker in settings works
- [ ] All current screens render identically (visual diff pass)
- [ ] Story Mode splice is included in the weekend page (v6 acceptance criteria met)
- [ ] No horizontal overflow at 320px on any screen
- [ ] `live-tracker.html` still works standalone
- [ ] Data refresh procedure unchanged (data-only PRs still work, no shell bump)
- [ ] Source modules under budget (the 26KB `09` file is split)

---

## Standing rules (carry forward)

- Mobile-first. 320px clean. Touch targets 44px.
- `var(--token)` everywhere. Zero color literals.
- Theme goes LAST. Build on `default-theme`, apply the F1 join at the end.
- Data nests inside its app.
- Two-artifact ship for over-cap files.
