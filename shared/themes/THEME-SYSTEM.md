# THEME SYSTEM — 4-Vector Matrix

<banner background-color="blue" icon="🎨"><p><span>The canonical FileMaker and HTML artifact theme system. A <strong>Theme</strong> is no longer just Color × Feeling. It is a 4-vector matrix: <strong>Color</strong> × <strong>Typography</strong> × <strong>Forms</strong> × <strong>Spacing</strong>.</span></p></banner>

## The 4 Vectors (TSV Grids)

Instead of a mega-table of feelings, we isolate the four axes of UI that vary independently. This allows for mobile vs. desktop padding, or flat vs. soft shadows, without duplicating font settings.

1.  **`colors.tsv`**: The hue/paint. Backgrounds, surfaces, borders, and the explicit 2-stop gradient hex codes.
2.  **`typography.tsv`**: The voice. Font families (display/body), size ramps (lead, body, sm, xs), and letter tracking.
3.  **`forms.tsv`**: The tactility. Border radii, border widths, inner/outer shadow maps, and gradient angles.
4.  **`spacing.tsv`**: The density. Padding (cells, cards), gap sizes, and touch target minimums.

*Note: The old `feelings.tsv` was dropped. It has been replaced by the Typography, Forms, and Spacing grids.*

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

The Theme Studio allows you to mix the 4 vectors live. It renders all 20 canonical FileMaker objects, plus a composed "Full App" view. 

**Resilience rule:** The studio HTML *embeds* a snapshot of the 4 grids for a safe, instant first paint (especially on mobile), and then does a best-effort `fetch()` of the live TSV grids to override the snapshot if they have changed.

## Adding a New Value

1.  Add the row to the appropriate TSV (e.g., add `pill-heavy` to `forms.tsv`).
2.  Add a new Theme entry in `_themes.json` that references it.
3.  **Mandatory:** Update the embedded snapshot variables inside the `<script>` tag of `preview.html` so the first-paint fallback stays current.