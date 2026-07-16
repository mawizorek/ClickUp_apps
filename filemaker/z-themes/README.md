# z-themes — FileMaker theme doc-set

**Status:** v1 · created 2026-07-16 · **Source of truth:** this repo.
**Scope:** cross-app. Themes are shared across every FileMaker app (maw-budget, hml-llc, future apps). They do NOT live in one app's `meta/`.

This is the *executable* layer for the theme system whose narrative prior-art lives in the ClickUp "FileMaker Theme System" docs (object families, reduced state matrix, qualitative palettes). Those docs describe; this doc-set is machine-readable and renderer-consumable. Per the cull sequence in the FileMaker Documentation Standard, the ClickUp theme docs become one-line pointers here after one full cycle proves this flow.

---

## The constraint rule (LOCKED)

**Every layout render references an existing theme slug from this doc-set. No ad-hoc inline themes, ever.** A `layout.json` carries `layout.theme.themeRef` (a slug) and `layout.theme.status`, never raw token values. Colors live here, in one place, so changing a theme once reskins every layout that references it.

## Token contract (stable, versioned)

Each theme defines a machine-readable token set the HTML renderers consume directly as CSS custom properties. The 10 canonical keys (matching `layout.theme.tokens` already in use):

```
cv-bg  cv-part-header  cv-part-body  cv-part-footer
cv-field-fill  cv-field-border  cv-field-text
cv-label  cv-accent  cv-title
```

Values are OKLCH strings. **These keys never rename or drop.** New keys bump `schemaVersion` (currently `1`). Optional driver micro-accent sub-tokens (e.g. `cv-accent-2`) are additive and non-breaking.

## How a renderer resolves a slug → tokens

1. Link the compiled stylesheet `themes.css` (one `[data-theme="<slug>"]` block per theme) and set `data-theme="<slug>"` on the render root. Every element skins off `var(--cv-*)`.
2. To read tokens as data instead, load `<slug>.json` (or `f1/<slug>.json`) and read `.tokens`.

**JSON is canonical. `themes.css` is GENERATED from the JSON — never hand-edit the CSS.** Keep both in sync in the same PR (same rule as `_index.json`).

## Fallback trail (fail loud)

- **Unknown slug** → HARD FAIL. Render halts, surfaces a visible `unknown theme: <slug>` error. No silent unstyled render.
- **Known slug, `status: stub`** (no tokens yet) → render the `_base.json` fallback spine, which resolves to the ultimate fallback `maw-dark-utility`. Surface a visible "stub, showing base fallback" notice.
- **Known slug, resolved, individual key missing** → that key falls back to `_base`, then to `maw-dark-utility`.

`preview.html` implements exactly this trail and shows it in the resolution bar.

## Structure

```
z-themes/
  README.md            this file
  _index.json          machine manifest (groups → themes), what the previewer reads
  _base.json           shared structural + fallback tokens
  themes.css           GENERATED: one [data-theme=slug] block per theme
  preview.html         live preview harness (slug picker + fallback demo)
  maw-dark-utility.json
  f1/                  the 2026 constructor collection
    mclaren.json       (draft, real tokens)
    mercedes.json ...  (stubs, awaiting token definition)
```

## App-usage registry

| App | Layout | Theme slug | Status |
|-----|--------|-----------|--------|
| maw-budget | GLOBAL_Settings (utility) | `maw-dark-utility` | locked |

## Seed set (v1)

- **maw-dark-utility** — locked. Tokens lifted verbatim from the maw-budget GLOBAL_Settings layout. FMP theme: **MAW Dark**.
- **f1/mclaren** — draft. Real tokens derived from the ClickUp McLaren palette (papaya accent, cyan labels, carbon board).
- **f1/** (10 more constructors) — stubbed. Registered, awaiting deliberate OKLCH token definition. They render the base fallback until defined.

## Phase 2 (not in this PR)

Rewire the layout renderers (index.html / preview.html per app) to resolve slug → tokens at load and inject CSS vars, then drop any inline token mirrors from `layout.json`. This delivers change-once-reskin-everywhere for structure-stable edits. Out of scope here per the migration task; tracked separately.
