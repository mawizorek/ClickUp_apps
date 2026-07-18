# THEME SYSTEM — 4-Vector Matrix

<banner background-color="blue" icon="🎨"><p><span>The canonical FileMaker and HTML artifact theme system. A <strong>Theme</strong> is no longer just Color × Feeling. It is a 4-vector matrix: <strong>Color</strong> × <strong>Typography</strong> × <strong>Forms</strong> × <strong>Spacing</strong>.</span></p></banner>

## The 4 Vectors (TSV Grids)

Instead of a mega-table of feelings, we isolate the four axes of UI that vary independently. This allows for mobile vs. desktop padding, or flat vs. soft shadows, without duplicating font settings.

1.  **`colors.tsv`**: The hue/paint. Backgrounds, surfaces, borders, and the explicit 2-stop gradient hex codes (`accent` → `accent-2`, a two-hue sweep).
2.  **`typography.tsv`**: The voice. Font families (display/body), size ramps (lead, body, sm, xs), and letter tracking.
3.  **`forms.tsv`**: The tactility + depth + motion. Border radii, border widths, the 2-stop gradient ANGLE, the shadow maps, a 3-step **elevation scale** (`elev-1` resting / `elev-2` raised+hover / `elev-3` floating+modal), and a **motion set** (`motion-fast`, `motion-med`, `ease` curve, `lift` = hover translate).
4.  **`spacing.tsv`**: The density. Padding (cells, cards), gap sizes, and touch target minimums.

*Note: The old `feelings.tsv` was dropped. It has been replaced by the Typography, Forms, and Spacing grids.*

### Why elevation + motion live in Forms (not a 5th vector) — 2026-07-18

**Motion and elevation are Forms' job, so they fold in as new columns rather than spinning up a new TSV.** Forms already owns tactility: radius, border weight, and the pressed/inset shadow behavior. Depth (an elevation scale) and how surfaces respond to touch (motion timing + hover lift) are the same axis of "how physical does this feel," so they belong here. Adding a whole motion TSV would be sprawl for ~4 values. The `sleek` preset is the flagship demo of the new columns: `border-w:0` (borderless, elevation separates surfaces), generous radius, deep layered `elev-*`, and smooth `motion-med`/`lift`. Consumers read `var(--elev-2)`, `var(--motion-med)`, `var(--ease)`, `var(--lift)` directly; the resolver + studio apply every Forms column automatically, so the objects reskin for free. All motion is wrapped by a `prefers-reduced-motion` guard.

## The Join Table (`_themes.json`)

Apps **do not** reference colors or forms directly. An app requests a **Theme Slug** (e.g., `sharp-mclaren`). 

`_themes.json` is the join table. It declares the named themes and maps them to exactly one token from each of the 4 vectors.

```json
{
  "slug": "mclaren-mobile",
  "name": "Mobile Racing · McLaren",
  "status": "draft",
  "color": "mclaren",
  "typography": "mobile-legible",
  "forms": "soft",
  "spacing": "loose"
}
```

## The Theme Studio (`preview.html`)

[**Launch the Theme Studio →**](https://mawizorek.github.io/ClickUp_apps/shared/themes/preview.html)

The Theme Studio allows you to mix the 4 vectors live. It renders all 20 canonical FileMaker objects, plus a composed "Full App" view. Pick the **Sleek** forms preset to see the borderless/elevated/animated flagship look.

**Resilience rule:** The studio HTML *embeds* a snapshot of the 4 grids for a safe, instant first paint (especially on mobile), and then does a best-effort `fetch()` of the live TSV grids to override the snapshot if they have changed.

## Adding a New Value

1.  Add the row to the appropriate TSV (e.g., add `pill-heavy` to `forms.tsv`).
2.  Add a new Theme entry in `_themes.json` that references it.
3.  **Mandatory:** Update the embedded snapshot variables inside `preview.data.js` (the first-paint fallback) so it stays current with the TSVs.

### Adding a new Forms COLUMN (not just a row)

If you add a whole new form token (like the elevation/motion columns), also add it to `FEEL_KEYS` in `resolve.js` so real apps (not just the studio) apply it. The studio applies every Forms column generically, so it needs no engine change — but `resolve.js` has an explicit key list that must be extended.
