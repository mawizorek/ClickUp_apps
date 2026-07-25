# Archive: Dexter / Theme System Detail

> Graduated from hot memory 2026-07-25 (first rotation). Load on-demand
> when working on theme/UI/styling turns. The one-line sequencing rule
> and boot-trap warning stay in hot memory.

---

## Theme contract (full detail)

17 tokens. **Every color is `var(--token)` — zero color literals** in `styles.css`,
`chrome.js`, or pages (sole exception: the neutral black-alpha drawer scrim).
Link `shared/themes/themes.css` (static, instant paint) **and** `resolve.js`
(live switching); set `<html data-theme data-mode>` for first paint; default
`default-theme` until one is chosen. Picker auto-populates from `THEMES.list()`.

**A theme is a 4-vector matrix**, not a color: colors x typography x forms x spacing,
joined by one slug in `_themes.json`. Apps request the slug, never a vector.

**The boot trap:** `THEMES.applyTheme(slug)` composes all four vectors — that is
the boot. `THEMES.apply(colorSlug)` is **COLOR ONLY**, for the picker's hue swap.
Using `apply` as the boot silently drops typography/forms/spacing and the app looks
fine while being unthemed. That exact bug is the documented pre-07-19 anti-pattern
(apps hand-baked structural CSS to compensate, freezing radii/borders un-swappably).
**The `:root` block is a first-paint FALLBACK FLOOR and must be labelled one — the
theme is the source of truth, the floor is a mirror, never the design.**

**Adding a theme value has a third step people skip:** TSV row -> `_themes.json`
entry -> **update the embedded snapshot in `preview.data.js`**. A new Forms *column*
also needs adding to `FORM_KEYS` in `resolve.js`, or it works in the Studio (which
applies columns generically) and is **silently broken in every real app**. Full
contract: `shared/themes/THEME-SYSTEM.md`.

**No silent path in `resolve.js` (fixed 07-25, PR #502).** Every unresolved
reference — unknown theme, unknown color, unknown or missing typography/forms/spacing
pointer, failed grid fetch — records to `THEMES.faults`, console.errors, and banners.
`opts.silent` is accepted and IGNORED. `THEMES.validate()` reports every broken join
reference without applying: run it after adding a row.

**Two-layer rule (from On Track, generalizes):** Layer A = chrome palette, from the
spine. Layer B = app-identity colors (On Track's 20 series colors) stays a LOCAL
block riding on top of any theme. **Never sweep identity colors into a theme vector**
— F1 stays F1-red on parchment. An unmet color need gets flagged to the steward,
never inlined.
