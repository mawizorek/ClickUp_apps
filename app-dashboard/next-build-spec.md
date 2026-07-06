# App Dashboard — Next Build Spec

**Current shipped:** v4 (modular split + FileMaker window + clean labels + settings drawer). Engine in `source/app.js`, styling in `source/{styles,sheet,settings}.css`, data in `source/data.js`.

---

## Scratch intake

_(raw ideas, unsorted)_

---

## Next build

_(approved, near-term — nothing committed yet)_

---

## In review

_(nothing open)_

---

## Futures

Captured from the v4 team review (Beckett / Professional / Creative). None urgent; the build is correct and shipping as-is.

### 1. Consistent "live" truth across data sources (Beckett)
The status line shows **"N live"** instantly in sample/preview mode (sample fakes all-green), but real GitHub-API mode shows **"…"** until per-app health checks resolve. Same app, different truth depending on data source. Options: (a) hold sample mode at "…" too and resolve it the same way, or (b) label the preview count as sample-derived so it never reads as verified. Cosmetic, honesty-of-state issue.

### 2. Reduced-motion guard on swipe-to-dismiss (Beckett)
The bottom-sheet swipe-down applies a live `translateY` transform during the drag with no `prefers-reduced-motion` branch. Our standard wants motion guarded. The CSS transition is already guarded; the JS drag transform is not. Low effort: skip/att enuate the drag-follow when reduced-motion is set.

### 3. FileMaker window: schema stat instead of commit count (Creative)
FileMaker solutions carry real structure (schema JSON). The FileMaker window could surface a **table/field count** parsed from each solution's schema JSON in place of (or alongside) the commit count, which is more meaningful for FMP work than commit velocity. Requires reading each `filemaker/<slug>/schema*.json` and a small parse. Nice-to-have, not core.

---

## Known guardrails

- **Source-size gate (~12KB/file):** every `source/` module must stay under it. If a change pushes a file over, split by concern first (that's how we got `render.js` / `sheet.js` / `settings.js` / `settings.css`).
- **Footer stamps version + PR** (`app-dashboard v<N> · PR #<n> · <time>`), written by JS so a stale bundle shows a stale stamp.
- **Load order is load-bearing:** `data → render → sheet → settings → app`. Only app.js boots.
- **FileMaker window** never does health/Pages checks; ClickUp window always does.
- **Theme:** dark default; light tokens in `settings.css` under `html[data-theme="light"]`; pre-paint applied by the inline loader script; persisted to `localStorage['appDashboard_theme']`.
