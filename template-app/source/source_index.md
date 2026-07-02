# template-app semantic source index

This is the canonical composition order for the `template-app` proof build.

## Order

1. `01_structure.html`
2. `02_base.css.txt`
3. `03_theme_team.css.txt`
4. `04_app.js`

## Rebuild contract

- `01_structure.html` contains the HTML shell and placeholder markers.
- Inline `02_base.css.txt` first inside the `<style>` block.
- Inline `03_theme_team.css.txt` immediately after the base CSS.
- Inline `04_app.js` inside the closing `<script>` block.
- The finished result is committed as `../index.html`.

## Size guardrails

- Target each source file to stay under **12 KB**.
- Treat **15 KB** as a hard stop.
- If a file exceeds that, split it by concern instead of letting one source file become the new monolith.

## Theme rule

`03_theme_team.css.txt` is the primary team-identity file.

If the app needs to switch from Red Bull back to McLaren later, start there first. The goal is for most team-specific visual changes to live in that one file.
