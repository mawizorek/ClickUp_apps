# Theming Integration — Handoff to the Themes-Standard Agent

_Written for the agent building maw's FMP theming standard, so it can pick this up cold. Explains how the layout renders currently carry theme, what is provisional, what to reconcile, and concrete options for integrating the themeing job with the render work. Companion to `LAYOUT-RENDER-STANDARD.md` (DD-R06 owns theming)._

**Author:** render/layout session, 2026-07-16. **Status:** open handoff. Nothing here is locked on the theme side; the themeing agent decides the standard and this doc bends to it.

---

## TL;DR for the themeing agent

Every layout render (`preview.html`) is a **generic, manifest-driven shell** whose entire look comes from **one `:root` token block**. Swap that block and the render reskins with **zero structural change**. Your job and mine meet at exactly one seam: **the token vocabulary.** Agree on token names + a source-of-truth theme file, and the renders consume it.

---

## Where theme lives today (two places, currently drifting)

1. **In each render (`preview.html`)** — a `:root` block of **bare semantic tokens** actually used to paint the UI:
   `--bg --header --rail --sel --grid --grid-soft --cell --cell-alt --cell-focus --hcell --text --muted --dim --orange --orange-hi --teal --green` (value-list render; the Globals skeleton uses a subset). All OKLCH. Near-black canvas, orange actions, teal titles/labels, green check-state.
2. **In `layout.json` → `layout.theme`** — a MIRROR block using **`cv-*` names** (`cv-bg`, `cv-part-header`, `cv-field-fill`, `cv-accent`, `cv-title`, ...) with a `themeRef` pointing at `../../../../z-themes/maw-dark-utility.json#maw-dark-utility` and `themeSlug: maw-dark-utility`, `status: provisional|locked` (inconsistent between the two layouts, see below).

**The drift to reconcile (first task):** the render's real tokens (`--orange`, `--teal`, ...) and the manifest's mirror tokens (`cv-accent`, `cv-title`, ...) are NOT the same names, and the `z-themes/maw-dark-utility.json` file the `themeRef` points at **does not exist yet**. So today the tokens are hand-mirrored and can drift. Picking the canonical token vocabulary + creating the real theme file is the core integration.

---

## The contract (what the render guarantees you)

- **One token block per render**, at `:root`. No colors are hard-coded outside it (spot-check: a few `oklch(...)` literals remain inline for shadows/overlays — those should migrate into tokens as part of your pass).
- **Structure is theme-independent.** Zero-radius grid, densities, and layout come from non-token CSS (DD-R03/R04); theme only supplies color. You can reskin light/dark/brand without touching markup or the manifest.
- **DD-R06:** theme is PROVISIONAL until you lock it; when locked, a render swaps only its token block and `layout.json.theme.status` flips `provisional -> locked`, `themeRef` resolves.
- **DESIGN-UI bans hold** regardless of theme: no gradient text, no side-stripe borders, no glassmorphism, no pure #000/#fff.

---

## Four ways to integrate (your call)

1. **Canonical theme JSON + build-time inline.** `z-themes/maw-dark-utility.json` holds the token set; a tiny step inlines it into each render's `:root` at commit. Renders stay standalone (work on Pages, file://, FileMaker WebViewer). **Recommended** — matches the existing `themeRef`/mirror intent and the 'data file + generic shell' pattern.
2. **Runtime fetch.** Renders `fetch()` the theme JSON and set CSS vars at load. Cleaner source, but fragile on file:// / WebViewer. Not recommended for these embedded renders.
3. **Shared `<link>` stylesheet of tokens.** One `theme.css` of `:root` vars, linked by every render. Simple, but breaks the 'single self-contained file' property the artifacts rely on.
4. **Token block as a documented copy-paste contract.** You publish the canonical `:root` block; renders paste it verbatim. Lowest tech, highest drift risk. Fine as an interim.

Whatever you pick, the **token NAMES are the API.** If you rename `--orange -> --color-action` etc., give me the map and I sweep every render in one PR.

---

## Suggested token roles (starting point, rename freely)

| Current | Role |
|---|---|
| `--bg` | app canvas (near-black) |
| `--header` | top/bottom bars, popover chrome |
| `--rail` / `--sel` | left rail, selected-row fill |
| `--grid` / `--grid-soft` | cell borders (strong / soft) |
| `--cell` / `--cell-alt` / `--hcell` / `--cell-focus` | cell fills (row, zebra, header, focus) |
| `--field` / `--field-border` | input fill + border |
| `--text` / `--muted` / `--dim` | text primary / secondary / tertiary |
| `--orange` / `--orange-hi` | primary action + hover |
| `--teal` | titles, labels, focus ring |
| `--green` | positive/check state |

---

## Files to look at

- `filemaker/LAYOUT-RENDER-STANDARD.md` — DD-R06 (theming rule) + the whole render contract.
- `filemaker/maw-budget/layouts/utility/LAYOUT-value-lists/preview.html` — the fullest token set in use (the Excel-grid render).
- `filemaker/maw-budget/layouts/utility/LAYOUT-global-variables/preview.html` — the 315px skeleton (subset).
- `filemaker/maw-budget/layouts/utility/LAYOUT-value-lists/layout.json` — the `cv-*` mirror + `themeRef` intent.
- (to create) `filemaker/z-themes/maw-dark-utility.json` — the canonical theme file the `themeRef` already expects.
