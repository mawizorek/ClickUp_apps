# The Theme System — how it's structured (read this first)

**Three entities, one join. This is the vocabulary the whole system uses; do not blur the terms.**

| Entity | What it is | Owns | Lives in | Example |
|---|---|---|---|---|
| **Color** | A palette (hue only) | the 17 color tokens | palette JSONs, registered in `_index.json` | `mclaren` |
| **Feeling** | A form language | fonts, sizes, radii, line weight, gradient character, shadow spec | `feelings/*.json` | `sharp-racing` |
| **Theme** | **The JOIN** of one color + one feeling | nothing of its own — it *references* one of each | `_themes.json` (the join table) | `sharp-mclaren` |

**An app is skinned with a THEME. Never a raw color, never a raw feeling.** The theme is the shared definition; it resolves to its color's tokens + its feeling's tokens.

> ⚠️ **Legacy naming mismatch (to reconcile):** the palette JSONs (`mclaren.json`, `themes.css`, the `data-theme` attribute, `THEMES.apply()` in `resolve.js`) predate this vocabulary and use the word "theme" to mean what we now call a **COLOR**. Until a deliberate rename pass, read every existing "theme" in the color layer as "color." The word **Theme** now means the color×feeling join only. New code uses the correct terms.

<p></p>

---

## Why a join, not two attributes glued on an app

A theme is a real, named, tracked thing so that:

- **Apps point at one slug** (`sharp-mclaren`), not a color + a feeling they have to remember to keep in sync.
- **A pairing can be blessed.** Not every color×feeling combination is one we endorse; the join table is the list of the ones we do.
- **Editing is contained.** Change the feeling `sharp-racing` once and every theme built on it updates. Change a color once and every theme on it updates. The theme itself is just the reference.
- **New themes are cheap and safe.** A new theme is one row in `_themes.json` pointing at an existing color + existing feeling. No new tokens, no new files. That is the whole anti-sprawl play: we grow themes by *combining*, not by authoring loose templates.

<p></p>

---

## Resolution order (how a theme becomes pixels)

1. App names a **theme** slug (e.g. `sharp-mclaren`).
2. Look it up in `_themes.json` → get its `color` + `feeling`.
3. Apply the **color** tokens (the 17 `--bg`/`--accent`/… via `resolve.js`, unchanged).
4. Apply the **feeling** tokens (the 18 form vars: `--font-*`, `--radius*`, `--border-w`, `--grad-*`, `--shadow-*`, `--fs-*`, `--track-*`, `--touch`).
5. Objects read both. The gradient recipe mixes the feeling's angle/intensity with the color's accent at render time; bake those two stops to concrete values for the FileMaker build.

FileMaker consumers inline both token sets at build time (no runtime fetch), same as today's color-only flow.

<p></p>

---

## The 18 feeling tokens (the form contract)

| Group | Tokens | FileMaker property |
|---|---|---|
| Type | `font-display` `font-body` `fs-lead` `fs-body` `fs-sm` `fs-xs` `track-tight` `track-btn` | Font + point size + tracking |
| Shape | `radius` `radius-lg` `radius-pill` `border-w` | Corner radius (per corner) + line weight |
| Depth | `shadow-out` `shadow-in` | Outer shadow / inner shadow (Advanced Graphic) |
| Gradient | `grad-angle` `grad-lift` `grad-drop` | Gradient fill: angle + 2 stops off accent |
| Touch | `touch` | Min object height |

Every token maps to a real FileMaker control (see `FILEMAKER-CAPABILITIES.md`). A feeling may not introduce a property outside that allowlist.

<p></p>

---

## Object templates (the copy-me set)

The **20 canonical objects** (`OBJECT-COVERAGE.md`) are the shapes every theme must style. `preview.html` renders each as a **spec card**: the live object + its exact recipe (fill, corner, line, shadow, padding, text). That rendered card IS the template you copy when building the native FileMaker Style. The recipe grid on each card is the build sheet.

**Template recipe shape (what each object card declares):**

```
object id        e.g. btn_primary
fill             solid <token> | gradient <angle + 2 stops off accent>
corner           <feeling radius>
line             <feeling border-w> + <border token>
shadow           none | outer <feeling shadow-out> | inner <feeling shadow-in>
text             <text token> + <feeling font/size>
states           the ones this object renders (Normal / Pressed / Focus / …)
```

Buttons carry the fullest set: primary (gradient + outer shadow), primary-pressed (inner shadow = the infill rounded-rect look), secondary, destructive, ghost, icon. Fields carry editable / focus (inner shadow) / readonly. Everything reads from the two token sets, so a spec card is correct for *any* theme the moment you pick one.

<p></p>

---

## Authoring process (the repeatable path — follow in order)

### To add a COLOR (unchanged)
Copy `_template.json` → fill 17 tokens → register in `_index.json` → `node build-themes.mjs`. (See `README.md`.)

### To add a FEELING
1. Copy `feelings/_template.json` → `feelings/<slug>.json`.
2. Fill all 18 form tokens. Every value must map to a FileMaker property.
3. Set `fmpMapping` (installed-font substitution, point sizes, radius, shadows).
4. Flip `status` to `locked`.

### To add a THEME (the cheap, preferred growth path)
1. Confirm the color exists (registered in `_index.json`) and the feeling exists (`feelings/`).
2. Add one row to `_themes.json`: `{ slug, name, color, feeling, status, intendedUse }`.
3. Open `preview.html`, select it, confirm all 20 objects render clean (17/17 color tokens, feeling applied, no fallback).

**Rule: prove ONE theme all the way through before multiplying.** The reference theme is **`sharp-mclaren`** (`mclaren` color × `sharp-racing` feeling). A second feeling or a second theme is a small, contained addition precisely because the reference already defined the shape. Do not spawn half-defined feelings/themes to backfill later — a feeling is `locked` or it does not exist.

<p></p>

---

## Files in this folder (map)

| File | Role |
|---|---|
| `THEME-SYSTEM.md` | this doc — the three-entity model + join + process |
| `README.md` | the color token contract + consumer wiring (legacy "theme"=color language) |
| `FILEMAKER-CAPABILITIES.md` | the styling allowlist / passive gate |
| `OBJECT-COVERAGE.md` | the 20 canonical objects a theme must style |
| `decision-log.md` | why the calls were made |
| `_index.json` | **color** registry (+ token roles, fmp role map) |
| `feelings/` | the **feeling** entity JSONs (+ `_template.json`) |
| `_themes.json` | the **theme** JOIN table (color × feeling) |
| `preview.html` | the renderer: pick a feeling + a color, see all 20 objects as copy-me spec cards |
| `resolve.js` | color-token resolver (applies the 17 color tokens) |
| `themes.css` | generated color-token CSS (never hand-edit) |
