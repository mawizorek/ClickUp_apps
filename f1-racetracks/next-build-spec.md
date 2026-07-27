# f1-racetracks — Next Build Spec

**Cycle:** v7 (unified shell + theme spine adoption)  
**Prior cycle:** v6 (Story Mode) — chunk set complete, splice moved OUT of this cycle  
**Status:** screens LOCKED 2026-07-26. Planning stage; build not started.

> **This file holds the HOW.** The ordered list of what to build lives in `README.md` ▸ **Build Order**, and that ordering is authoritative. This spec deliberately carries **no phase numbering of its own** — two rival orderings is what caused agents to pick differently. Step numbers below refer to Build Order steps.
>
> **The WHY lives in the Decision Log** (ClickUp ▸ Brain Reference Library ▸ Formula 1 ▸ *F1 Racetracks App — Decision Log*).

---

## Directive

Consolidate the app into the standard repo object structure so every screen reads as one app with one shared theme.

**Target state:** one `index.html` shell (template-app v5 pattern), `chrome.js` shared chrome, `pages/` partials, all consuming the theme spine via `THEMES.applyTheme('f1')`. The data layer and the JS logic modules are preserved, not rewritten.

**Scale check (corrected 2026-07-26):** this is a **four-loaders-to-one-router consolidation**, not a monolith rebuild. Measured at HEAD: `index.html` 7,509 · `weekend.html` 2,666 · `standings.html` 4,321 · `circuits.html` 8,818. Four of five top-level files are already thin loaders over `source/` chunk sets. The earlier "5 separate HTML files with duplicated chrome" / "the monolith" framing overstated the job and is retired.

---

## ✅ What the screen lock settled (do not relitigate)

Decided by Michael 2026-07-26 after a nine-voice Workshop pass. Full reasoning + the rejected options are in the Decision Log; this is the outcome.

| # | Decision |
|---|---|
| 1 | **Hierarchy holds, with two corrections.** The 3 lenses are a header **control** on the home route, not a nav tier. The **Weekend Center vs Weekend Race Detail** boundary is now written down: status widget vs result document. |
| 2 | **Standings folds into the router** as route 4, aggregating **on route entry** and caching in `12_results_store.js`. Never boot-warmed. |
| 3 | **`circuits.html` is killed** — field-diff against the [Circuits] lens first, then a redirect stub. |
| 4 | **`live-tracker.html` stays standalone but adopts the theme spine.** Router no, theme yes. |
| 5 | **Tyre analysis is a mode on route 3**, not a route of its own. |
| 6 | **Story Mode leaves the v7 cycle** and splices once into the finished route 3 (Build Order step 12). |
| 7 | **One ordering.** The Build Order in `README.md` governs; this spec carries none. |

**Governing rule that came out of it:** a screen earns a route when it owns a data shape nothing else owns. Otherwise it is a lens, a mode, or an overlay.

---

## ⚠️ What the screen lock did NOT settle

**This was a SCREEN lock, not a schema lock.** All seven questions were about screens. The following are still unvalidated and want their own pass before anything depends on them:

- The FM-style **table decomposition** (ROUNDS / CLASSIFICATIONS / CIRCUITS / INDEX_ROUNDS) as the right cut.
- The **field tiers** (1-4) and whether Tier 3/4 fields are worth their collection cost.
- **Relationship cardinality** as documented, particularly the `driverId` self-join across round files.
- The two **proposed tables** (COMPOUNDS, STINTS) — no code reads them yet.
- The **compute-once store/derive split**: is anything on the store list actually derivable?
- The **sprint-weekend boundary** (see README ▸ Known boundary). Route 3 is where it bites.

Do not stamp "schema validated" anywhere on the basis of the screen lock.

---

## How each port works

### Baseline parity capture (step 2) — the gate, rewritten 2026-07-27

**What this replaces, and why.** The old step 2 was *"v6.7 screenshots, every screen, 320px + desktop,"* feeding a *"visual diff passes"* acceptance criterion. **An agent cannot execute either one** — there is no screenshot or image-diff capability in this stack. The criterion was written by the party who could not satisfy it, and it sat in front of the rebuild as a blocker that looked like diligence. A gate its owner cannot pass is worse than no gate: it stalls the queue and teaches everyone to route around it.

**What replaces it: a STRUCTURAL baseline, read from source at a pinned SHA.** For each of the four routes plus the Weekend Center and the Driver Popup, capture into `f1-racetracks/baseline-v6.7.md`:

1. **Every field rendered on screen**, by its store key (`pos`, `grid`, `qualifying.q3`, `fastLap.time`, …) — the field list IS the contract.
2. **Every control**, with what it does (lens buttons, tabs, sort headers, the popup trigger, export tools).
3. **Every data binding**, as `<source module> → <store path> → <screen element>`.
4. **Every empty/null path** the screen handles, and what it renders instead — specifically `fastLap` (8 of 9 rounds null) and `onRoadPos` (the absence rule).
5. **Every outbound link and URL shape**, so redirect stubs can be checked against real targets.

Captured **before** step 3, from source, at a recorded commit SHA. Diffed after each port.

**Why this is better than what it replaces, not just cheaper:** it catches what a port actually breaks — a dropped field, a lost null branch, a binding pointed at a renamed key — and each line either matches or does not. The old criterion could be waved through with "looks the same to me."

🚨 **What it does NOT catch, stated so nobody assumes otherwise:** visual regressions. Spacing, alignment, overflow, color, z-order, anything that renders wrong while binding correctly. **That is Michael's step, not an agent's.** If pixel confidence is wanted, Michael takes screenshots of the four routes at 320px and desktop before step 3 and eyeballs them after step 8. Thirty seconds, and it is genuinely uncapturable from this side. **Do not invent an agent-shaped substitute for it** — that is precisely how the criterion became unfalsifiable the first time.

### Shell scaffold (step 3)

- New `index.html` on the template-app v5 pattern: slim hash router, `<html data-theme data-mode>`.
- `chrome.js`: header (**lens control** + nav links), settings drawer (theme picker), footer.
- Link `shared/themes/themes.css` + `resolve.js`; boot with `THEMES.applyTheme('f1')`.
- `:root` fallback floor = the current hue-268 tokens, explicitly labelled as a first-paint floor, so a failed theme load cannot white-screen.
- **Team colors (the 20-series) are a LOCAL identity layer.** They ride on top of any theme, never inside it. Same pattern as On Track.

### Router extraction (step 4) — its own job

`09_app_bootstrap_and_home.js` (26KB) holds **three** concerns: the router, the home-grid render, and the lens-filter logic. The new shell **replaces** the router concern. So this is not a port, it is an extraction plus a rewrite of the extracted half, and it was previously hidden inside a one-line "port the home grid" bullet. Extract first, in isolation, and confirm the app still boots on the old grid before touching the grid itself.

### Home grid (step 5)

The remaining two concerns of `09` become the home page (a `pages/` partial or inline in the router, decided by resulting size). The lens control moves into `chrome.js`.

### Circuit breakdown (step 6)

`10_track_views_and_profile.js` + `11_weather_and_footer_exports.js` become a `pages/circuit.html` partial. Weekend Center (`14`-`17`) renders inside it as before. Driver Popup stays an overlay within the circuit context.

### Standings (step 7)

`source/standings/` renders into a `pages/standings.html` partial.

- **Aggregation runs on route entry, caches in `12_results_store.js`, and is never warmed at boot.** This is an acceptance criterion, not a preference: it is the only screen that fetches every round file, and boot-warming makes the home grid pay for standings on every cold load.
- **Execute the `panel.js` split here** (18,033 bytes, over the 15KB line). Seam: render vs row-building.

### Weekend race detail (step 8)

`weekend.html`'s chunk set becomes `pages/weekend.html`. Then retire the satellites:

- `standings.html`, `circuits.html`, `weekend.html` → **two-line redirect stubs**, not deletions. Their URLs are bookmarked, pasted into ClickUp tasks, and linked from the app dashboard.
- Update `VERSIONS.md` to v7 in the same session as the PR.

---

## What stays unchanged

- **All data files** (`data.json`, `f1-results/2026/`, `circuits/`, `index_rounds.json`).
- **All JS logic modules** (`09`-`18`) — the new shell LOADS them, it does not rewrite them.
- **`live-tracker.html`** — standalone (separate context: OpenF1 real-time, no store dependency). It gains the theme spine and nothing else.
- **`story-mode-reference.html`** — the splice reference, held until step 12.

---

## Theme: the F1 join

The theme is a 4-vector: colors × typography × forms × spacing.

| Vector | Current (hardcoded) | Target (spine join) |
|--------|--------------------|-----------|
| Colors | hue-268 custom palette | `shared/themes/f1/<color>.json` |
| Typography | Chakra Petch + Inter + JetBrains Mono | `shared/themes/f1/typography` row |
| Forms | sharp corners, 1px lines | `shared/themes/f1/forms` row |
| Spacing | custom per-file | inherit the spine default |

**The F1 identity layer (ON TOP of theme, never swept in):** team colors (`--t-mercedes`, `--t-ferrari`, the 20 named vars), sector colors (`--s1`, `--s2`, `--s3`), status colors (purple FL, green personal best, yellow sector).

🚨 **"Compose from whatever exists in `shared/themes/f1/`" is not a plan.** That directory is started, not complete. Composing from whatever is there is how a screen loads with half a theme applied and looks fine to the person who built it — the `:root` floor catches a TOTAL load failure, not a partial one. **Define what "the F1 join is complete" means (which vector files must exist) before step 3 depends on it.**

---

## Acceptance criteria

Rewritten 2026-07-26 so each one can actually fail. **Amended 2026-07-27:** the visual-diff criterion was struck because no party to this build can execute it — see Baseline parity capture above.

- [ ] Single `index.html` serves all four routes via hash router
- [ ] `chrome.js` renders shared header/footer/settings on every route
- [ ] Theme loads from the spine (`THEMES.applyTheme('f1')`); the settings picker works; **every one of the four theme vectors resolves from a real file** (no silent partial)
- [ ] **Structural parity against `baseline-v6.7.md`:** every rendered field, control, binding, null path, and link present before the port is present after it, or its removal is named in the PR. Diffed per route, not in aggregate.
- [ ] **No null path silently changed behaviour** — specifically `fastLap` (8 of 9 rounds null) and `onRoadPos` (absent means *same as pos*, never *unknown*).
- [ ] ~~Visual diff passes against the step-2 baseline capture, every screen, 320px and desktop.~~ **STRUCK 2026-07-27: not agent-executable** (no screenshot or image-diff capability exists in this stack). Visual confirmation is Michael's manual step and is deliberately NOT an agent acceptance criterion. Struck rather than deleted so nobody re-adds it in good faith.
- [ ] No horizontal overflow at 320px on any route *(checkable from source: no fixed widths, no unwrapped tables, no `min-width` above 320 on a container)*
- [ ] `live-tracker.html` still works standalone AND now resolves the F1 theme
- [ ] Data refresh procedure unchanged: data-only PRs still work with no shell bump
- [ ] **All FOUR over-budget modules are under the 15KB line:** `09`, `10`, `standings/panel.js`, `15`. *(The old criterion named only `09`, which would have let v7 ship claiming "under budget" with three violations standing.)*
- [ ] `standings.html`, `circuits.html`, `weekend.html` resolve as redirect stubs, not 404s
- [ ] `.nojekyll` still present at repo root (large inline-JS shells are exactly what silently fails under Jekyll, and a failed build freezes the WHOLE Pages site on the last good version)
- [ ] `VERSIONS.md` row updated to v7 in the same session as the PR
- [ ] Story Mode is NOT in this cycle — its absence is intentional, not an oversight

**Standing rule that came out of this amendment:** *do not write an acceptance criterion the party responsible for passing it cannot execute.* Before locking any criterion, name who checks it and with what. If the answer is "a human looks at it," say so and take it off the agent's list rather than dressing it up as a gate.

---

## Standing rules (carry forward)

- Mobile-first. 320px clean. Touch targets 44px.
- `var(--token)` everywhere. Zero color literals.
- Theme goes LAST. Build on `default-theme`, apply the F1 join at the end.
- Data nests inside its app.
- Two-artifact ship for over-cap files.
- Retiring a top-level file = delete **plus** a redirect stub.
- Read source through the git blob API at a fresh SHA. Never build an edit on a branch raw read.
