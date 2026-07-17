# Decision Log — Theming

Append-only record of decisions made in the theming space (`shared/themes/`). Newest at top. One decision per entry. Keep it generic and easy to parse: an agent entering this space should read this file to learn *why* things are the way they are, without digging through chat history.

> **Repo-wide convention:** a `decision-log.md` lives at the top of any area we make real decisions in (theme folder, each FileMaker app, each ClickUp app, brain-config, etc.). It records DECISIONS, not changelog (git history is the changelog) and not open work (`open-thread.md` / `next-build-spec.md` own that). When you enter an area with a `decision-log.md`, read it first; when you make or reverse a decision there, append an entry before you finish. Same entry shape everywhere.

**Entry shape:**
```
## YYYY-MM-DD · <short title>
**Decision:** <what was decided, one or two lines>
**Why:** <the reasoning / what problem it solves>
**Status:** locked | provisional | superseded
**Supersedes:** <prior entry, if any>
```

---

## 2026-07-17 · Three-entity vocabulary: Color, Feeling, Theme(=join)
**Decision:** The theme system is three distinct entities. **Color** = the 17-token palette (hue only). **Feeling** = a form language (fonts, sizes, radii, line weight, gradient character, shadow spec). **Theme** = the JOIN of exactly one color + one feeling, named, tracked in `_themes.json`. **Apps are skinned with a THEME, never a raw color or feeling.** Vocabulary is strict from here: the word "theme" means the join only. Documented in `THEME-SYSTEM.md`; feelings live in `feelings/`; the join table is `_themes.json`.
**Why:** Michael's explicit modeling call. Separating form (feeling) from hue (color) and binding them through a named join makes theme growth cheap and contained: a new theme is one row pairing an existing color + existing feeling (no new tokens/files), editing a feeling once updates every theme on it, and apps point at one stable slug instead of a color+feeling they must keep in sync. This is the anti-sprawl mechanism — grow by combining, not by authoring loose templates.
**Why (naming caveat):** the pre-existing palette layer (`mclaren.json`, `themes.css`, `data-theme`, `THEMES.apply()`) uses "theme" to mean what is now a COLOR. Flagged as a legacy mismatch to reconcile in a deliberate rename pass (touches resolve.js + every consumer); until then, existing "theme"=color in the color layer only.
**Status:** locked

## 2026-07-17 · One reference theme proven end-to-end before multiplying
**Decision:** `sharp-mclaren` (color `mclaren` × feeling `sharp-racing`) is the FIRST and reference theme, built all the way through (feeling JSON, join row, renderer, object recipes, FMP mapping). No second feeling or theme is authored until the process is proven on this one. A feeling is `locked` or it does not exist — no half-defined drafts left to backfill. `sharp-racing` values (Chakra Petch/Inter, 3px corners, crisp shadows, 100° gradient) chosen by Brain per Michael's "I don't care exactly which" latitude; all are editable in one file since everything is contained in the feeling.
**Why:** Michael's anti-sprawl directive: define one theme completely so a second theme or any edit becomes trivial and contained, and a cold agent has a worked example to copy rather than a pile of loose templates to reverse-engineer.
**Status:** locked

## 2026-07-17 · preview.html is the render board (pick color + feeling, see 20 objects)
**Decision:** Overwrote `preview.html` with the render board: a "pick a theme, or mix any color × feeling" page where every one of the 20 canonical objects renders as a copy-me **spec card** (live object + its exact FileMaker recipe: fill/gradient, corner, line weight, shadow, text). Buttons carry the full state set incl. pressed=inner-shadow. Color tokens load via `resolve.js` (single source); feelings embedded with `feelings/*.json` as canonical; join loaded from `_themes.json` with inline fallback. ~27KB, under the read cap.
**Why:** Michael wanted the single canonical page he rebuilds in FileMaker every time, not loose per-theme mockups. The spec card (shape + recipe) is the copy-me unit; the renderer proves any color×feeling composes correctly and is the acceptance surface for new themes.
**Status:** locked
**Supersedes:** the prior color-only `preview.html` theme×object gallery.

## 2026-07-17 · FileMaker Capability Handbook is the styling allowlist + passive gate
**Decision:** Added `FILEMAKER-CAPABILITIES.md`: the definitive list of layout-object styling FileMaker actually supports (fill/gradient, line, per-corner radius, outer+inner shadow, padding, four object states, Styles/Themes), an explicit NOT-ALLOWED list (motion, gradient text, glassmorphism, stacked shadows, runtime color math, pseudo-elements), button-look recipes, the axis→property split, and the native rebuild workflow. It is a passive gate: any theme visual that isn't in the allowlist is out of scope, not a workaround to invent. Same handbook serves agents (building renders/replicable apps) AND Michael (native rebuild).
**Why:** Before investing in the two-axis schema, the FileMaker-replicability constraint needed to be documented so future agents don't assume capabilities FileMaker lacks (or wrongly rule out ones it has). One instruction book both sides work from keeps the ClickUp render and the native FileMaker Theme in lockstep, and stops capability drift.
**Status:** locked

## 2026-07-17 · Shadows + gradients ARE in scope (FileMaker-native)
**Decision:** Depth via shadows and gradient fills is explicitly IN the themeable toolbox. FileMaker's Advanced Graphic area provides one outer + one inner shadow per object (color, opacity, blur, spread, offset) and Fill supports multi-stop gradients with an angle. The "infill rounded-rectangle shadow" = an inner shadow on a rounded rect (the pressed/inset button look). Budget is one outer + one inner per object (no stacked shadows), and gradient stop colors must be baked to concrete values (no runtime `color-mix`).
**Why:** Corrects an earlier working assumption that FileMaker couldn't do shadows, which had pushed the theme design toward borders-only depth. FileMaker does support them natively, so professional depth/elevation is a legitimate theme tool, not an app-only extra. Michael flagged this directly.
**Status:** locked

## 2026-07-16 · default-theme tuned to MID-gray, high-contrast, mode `mid`
**Decision:** Lightened `default-theme` from a dark gray (bg L=0.28) to a true MID-gray (bg L=0.62) with near-black text (L=0.16) and a dark charcoal accent for higher contrast than the F1-style slick dark themes. Introduced a third `mode` value, **`mid`** (neither `light` nor `dark`), used only by this default; it renders type at full weight (no dark-mode weight reduction) so the higher contrast reads crisp. Updated the JSON, the `themes.css` block + `:root` spine, and the `resolve.js` embedded ULTIMATE together.
**Why:** Michael's nitpick: the first cut read as a dark theme. The default should feel like an in-between gray placeholder, not dark and not a light/paper theme, and carry more contrast than the polished dark skins. `mid` mode encodes "in-between" honestly (the picker badge shows · mid) and keeps font weight full for contrast; it's harmless to consumers (matches neither `[data-mode=light]` nor `[data-mode=dark]`, so full default weight applies).
**Status:** locked
**Supersedes:** the initial dark-gray default values + `dark` mode from the entry below.

## 2026-07-16 · `default-theme` is the standing default pointer + ultimate fallback
**Decision:** Added `default-theme`: a deliberately grayscale (zero-chroma) skin — medium-gray canvas, lighter gray surfaces, gray highlight accent (NOT black-on-white paper). It is the standing DEFAULT: new apps/renders point at it unless Michael names a theme or there's an intentional reason to diverge. Also set as the resolver's `ultimateFallback` + `defaultTheme` in `_index.json`, and the embedded ULTIMATE in `resolve.js`. `preview.html` opens on it.
**Why:** Michael wants a default that visibly reads as UNSKINNED ("if it's still gray, it hasn't been themed yet"), so agents always start from a theme pointer instead of designing colors from scratch, and swapping to a real theme is a one-line slug change. Making it the ultimate fallback means a failed/stub resolve lands on the honest gray placeholder, never a broken or arbitrary skin. The build instruction lives in the theme-contract gate + root README.
**Status:** locked
**Supersedes:** `maw-dark-utility` as the resolver's ultimateFallback (maw-dark-utility remains a normal utility theme).

## 2026-07-16 · Theming backbone is the repo-root law for ALL future designs
**Decision:** The theme system is now stated as a standing law at the repo ROOT (`README.md`, top section): every visual thing built here — ClickUp HTML apps, FileMaker layout renders, standalone artifacts, quickfire pages, any layout — draws color from `shared/themes/` by slug. No agent invents a palette, hardcodes color, or rolls its own theme. Root README doubles as the cold-agent orientation map.
**Why:** The theme-contract gate enforced this on build, but the highest-level doc an agent hits on entering the Git (root README) was empty, so a fresh agent could design in a vacuum before ever seeing the gate. Putting the backbone at the front door makes it the first thing read and the default posture, not a rule discovered late.
**Status:** locked

## 2026-07-16 · `_template.json` is the canonical copy-me start for a new theme
**Decision:** New themes start by copying `_template.json` (all 17 tokens present with role-hint values + an inline `_README` of the 4 steps). The README "Adding a theme" section is the crisp procedure: copy → fill 17 → register one line in `_index.json` → `node build-themes.mjs`.
**Why:** A cold agent had no obvious file to copy and would clone an existing theme (and might miss the register/regen steps). A named template + a 4-step README makes the instruction literal and unmissable, and states plainly that themes.css is generated (not the 1-file mental model, but close).
**Status:** locked

## 2026-07-16 · Americana light theme added
**Decision:** Added `americana` (light) to the Neutral & Natural group: soft white surfaces, Old Glory Blue (#3C3B6E) ink + secondary, Old Glory Red (#B22234) actionable accent.
**Why:** Requested; also the first theme built via the copy-`_template.json` flow, validating the cold-agent path end to end.
**Status:** locked

## 2026-07-16 · preview.html auto-populates its menu from the registry
**Decision:** The gallery's theme menu builds itself from `_index.json` (the theme registry) at load, with a baked-in list as fallback; each swatch color is read from `themes.css` via a hidden probe. Adding a theme (JSON + register + regen CSS) makes it appear in the menu with NO edit to `preview.html`.
**Why:** "Themes should auto-populate into this index." A hand-maintained theme list in the preview would drift from the registry. Reading the registry + probing the CSS for swatches means the menu can never fall out of sync, and no accent is ever hand-copied. Styling still comes from the static `themes.css` so the page can't white-screen if the fetch fails.
**Status:** locked
**Supersedes:** the temporary fully-baked-in theme list introduced when the menu was hardened against the resolve.js load failure.

## 2026-07-16 · Neutral & Natural light pair added (paper-mono, papyrus)
**Decision:** Added two light themes in a new `neutral` group: `paper-mono` (plain white surfaces, near-black monochrome ink, accent = ink) and `papyrus` (warm parchment surfaces, sepia ink, burnt-ochre wooded accent).
**Why:** First non-F1 light themes; gives a clean neutral baseline and a warm natural option, and proves the "drop in a theme by filling 17 variables" flow end to end (JSON → register → regen CSS → auto-appears in the menu).
**Status:** locked

## 2026-07-16 · 20-object coverage is the theme acceptance test
**Decision:** A theme is only "done" when it styles all 20 canonical FileMaker objects with no token fallback (17/17). `preview.html` is the theme × object gallery that proves it; `OBJECT-COVERAGE.md` is the contract.
**Why:** Guarantees every object has a defined style in every theme AND forces every theme to define all 17 tokens. Ties the object system and the token system together so neither can drift.
**Status:** locked

## 2026-07-16 · One shared token vocabulary for both consumers
**Decision:** ClickUp HTML apps and FileMaker layout renders share ONE 17-key semantic token contract (`bg`, `surface-1/2/3`, `border`, `field`, `text`, `text-soft`, `text-faint`, `accent`, `accent-2`, `accent-soft`, `on-accent`, `good/warn/bad/info`). Bare `--name` custom properties. Old FileMaker `cv-*` 10-key vocab merged in via `fmpRoleMap`.
**Why:** Michael's call: don't recreate colors every time. One vocabulary means an app and a render theme identically, and "switch F1 to gray + red" is a value change, not a rename. Semantic names, never literal (`--accent`, never `--f1-red`).
**Status:** locked

## 2026-07-16 · Theme system is GLOBAL, lives in `shared/themes/`
**Decision:** Promoted the theme system out of `filemaker/z-themes/` up to `shared/themes/`. Old folder retired to a MOVED pointer; duplicates deleted.
**Why:** The system serves both ClickUp apps and FileMaker renders, so it's cross-consumer. Repo layout rule: cross-consumer assets live in `shared/`, never nested under one consumer (`filemaker/`).
**Status:** locked
**Supersedes:** the FileMaker-scoped `z-themes` location.

## 2026-07-16 · Delivery differs by consumer (resolve live vs inline)
**Decision:** ClickUp apps (hosted) resolve themes live via `resolve.js` and reskin without a rebuild. FileMaker renders inline the resolved 17 tokens at build time — no runtime fetch.
**Why:** FileMaker renders are local design mockups opened from a filesystem, never hosted, so a runtime `fetch()` is the wrong path for them. Hosted apps get live reskin; local mockups get baked tokens. Same vocabulary, different plumbing.
**Status:** locked
**Supersedes:** the earlier four-option integration menu in `filemaker/THEMING-INTEGRATION.md` (now RESOLVED).

## 2026-07-16 · FileMaker renders are design mockups ONLY
**Decision:** Everything under `filemaker/` is a design mockup / build tool, never a production or hosted asset. Web viewing is off the table. Renders articulate how a NATIVE FileMaker layout should look/behave (Michael builds native end-of-year).
**Why:** Removes the whole web-viewer/OKLCH-fallback problem class — these aren't web content. Their job is communication (layout, hierarchy, theming, object behavior), and build-time affordances that speed the native build are encouraged. Enforced by `brain-config/gates/theme-contract-gate.md`.
**Status:** locked

## 2026-07-16 · No ad-hoc inline color; reference a slug
**Decision:** Every app and every render references an existing theme slug from `shared/themes/`. No hardcoded hex/oklch for a role a token covers; no per-app inline themes. A needed-but-missing role is a contract change (new token + `schemaVersion` bump), not an inline override.
**Why:** Colors in one place = reskin without re-rendering, which is the entire point of the system. Enforced by the theme-contract gate.
**Status:** locked

## 2026-07-16 · F1 constructor grid is the first theme batch
**Decision:** Seed set is `maw-dark-utility` (anchor + ultimate fallback) plus the full 2026 F1 constructor grid (11 themes: mclaren, ferrari, mercedes, red-bull, alpine, aston-martin, audi, cadillac dark; haas, racing-bulls, williams light).
**Why:** F1 is Michael's chosen proving ground and gives a wide, opinionated color range (dark + light, warm + cool) that stress-tests whether one object system can carry clearly distinct brands. All shipped with real OKLCH tokens, not stubs.
**Status:** locked
