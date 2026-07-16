# shared/themes — the global theme system

**Status:** v1 · 2026-07-16 · **Source of truth:** this folder. **Scope:** GLOBAL (cross-consumer).

One set of themes, referenced the same way by **both** kinds of thing we build:

- **ClickUp HTML apps** (Pages-hosted) — link `resolve.js` (or `themes.css`) and reskin live.
- **FileMaker layout renders** (local design mockups, never hosted) — the same tokens, inlined into the render at build time.

Change a theme file once and every consumer that references its slug reskins. No per-app color code, ever. This folder was promoted here from `filemaker/z-themes/` on 2026-07-16 so a single home serves both consumers (the repo layout rule: genuinely cross-consumer assets live in `shared/`, never under one consumer).

---

## The constraint rule (LOCKED)

**Every app and every render references an existing theme slug from this folder. No ad-hoc inline color, ever.** A consumer names a slug; colors live here, in one place. This is the whole point: reskin without re-rendering.

## The token contract (v1, 17 semantic keys)

Semantic names, never literal (`--accent`, never `--f1-red`), so "switch F1 to gray + red" is a value change, not a rename. Every theme defines all 17. Bare `--name` custom properties, so a consumer just writes `var(--accent)`.

| Group | Tokens |
|---|---|
| Surfaces | `bg` `surface-1` `surface-2` `surface-3` `border` `field` |
| Text | `text` `text-soft` `text-faint` |
| Accent | `accent` `accent-2` `accent-soft` `on-accent` |
| Semantic | `good` `warn` `bad` `info` |

Roles are documented in `_index.json` (`tokenRoles`). Values are OKLCH. **These keys never rename or drop**; new keys bump `schemaVersion`. Structure (radius, spacing, type ratio, font stacks) lives in `_base.json` and is shared across all themes.

### FileMaker role mapping

The retired FileMaker `cv-*` layout roles map onto the global contract (`fmpRoleMap` in `_index.json`): `cv-part-header`→`surface-1`, `cv-field-fill`→`field`, `cv-label`→`text-soft`, `cv-title`→`text`, and so on. A render that wants the old local names passes an `aliasMap` to `resolve.js`. When you build the native FileMaker theme at year-end, map FMP object styles to these same 17 roles and the render and the solution stay in agreement.

## Object coverage (the theme acceptance test)

**A theme is only real if it can style all 20 canonical FileMaker objects** (the defensible cross-app set from the ClickUp *FileMaker Canonical Object Library*). This ties the two ends together: every object gets a defined style in every theme, and every theme is forced to define all 17 tokens. Full contract + the 20-object table + the acceptance checklist live in **[`OBJECT-COVERAGE.md`](./OBJECT-COVERAGE.md)**. `preview.html` renders all 20 (with their state matrix) and shows a live coverage readout per theme.

## How each consumer references a theme

**ClickUp app (live, primary path):**
```html
<script src="/shared/themes/resolve.js"></script>
<script> THEMES.apply('mclaren', { root: document.documentElement }); </script>
<!-- then in CSS: background: var(--accent); color: var(--text); -->
```
`resolve.js` also sets `data-mode="light|dark"` and `data-theme="slug"` on the root, so mode-conditional CSS keys off the theme. Static alternative: link `themes.css` and set `data-theme="slug"` on the root, no JS.

**FileMaker layout render (design mockup):** these are local documentation tools, never hosted, so a runtime fetch is the wrong path. The render inlines the resolved 17 tokens into its own `:root` block at build time. `resolve.js` is still the reference for what those values are; the render just bakes them in.

## Fallback trail (fail loud)

- **Unknown slug** → HARD FAIL, visible banner, no skin. Never a silent unstyled render.
- **Stub / tokens missing** → `_base` spine → ultimate fallback (`maw-dark-utility`).
- **Resolved, one key missing** → that key falls back to the spine.
- **Fetch fails (`file://`, offline)** → embedded ultimate fallback so nothing white-screens (reported `offline`).

`preview.html` demonstrates the trail and is the live theme picker / color tester.

## Tooling

- **`resolve.js`** — shared slug→tokens resolver. Every hosted consumer calls it; single source of resolution truth.
- **`build-themes.mjs`** — regenerates `themes.css` from the per-theme JSON and validates each set against the 17-key schema. **JSON is canonical; `themes.css` is generated — never hand-edit the CSS.** Run: `node build-themes.mjs`.
- **`preview.html`** — the **theme × object gallery**: renders all 20 canonical objects from the active theme with a live token-coverage readout. Pick a slug to reskin every object at once; this is the reskin/compare tool AND the coverage proof.

## Structure

```
shared/themes/
  README.md            this file (the standard)
  OBJECT-COVERAGE.md   the 20-object x theme coverage contract + acceptance test
  _index.json          contract + role map + fmp map + theme registry (groups → themes)
  _base.json           shared structure + fallback token spine
  themes.css           GENERATED by build-themes.mjs
  resolve.js           shared slug→tokens resolver
  build-themes.mjs     generator (JSON → themes.css, schema check)
  preview.html         theme × object gallery (20 objects, live coverage readout)
  maw-dark-utility.json  anchor theme + ultimate fallback
  f1/                  2026 constructor collection (11 themes)
    mclaren.json ferrari.json mercedes.json red-bull.json alpine.json
    aston-martin.json audi.json cadillac.json
    haas.json racing-bulls.json williams.json   (light-mode trio)
```

## Themes (v1)

| Group | Themes | Mode |
|---|---|---|
| Utility | `maw-dark-utility` (anchor + ultimate fallback) | dark |
| F1 2026 | `mclaren` `ferrari` `mercedes` `red-bull` `alpine` `aston-martin` `audi` `cadillac` | dark |
| F1 2026 | `haas` `racing-bulls` `williams` | light |

## Adding a theme

1. Add a `<slug>.json` (or `f1/<slug>.json`) with all 17 tokens in OKLCH.
2. Register it in `_index.json` under a group (`slug`, `name`, `file`, `status`, `mode`, `fmp`).
3. Run `node build-themes.mjs` to regenerate `themes.css` and schema-check.
4. Open `preview.html`, select it, confirm **17/17 tokens · all 20 objects styled** and eyeball each zone (see `OBJECT-COVERAGE.md` acceptance test).
