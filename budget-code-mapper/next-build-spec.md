# Budget Code Mapper v6 — Build Spec (Data Separation Retrofit)

**Date:** 2026-07-02  
**Source chunk set:** `budget-code-mapper/source/_index.md` (v5 baseline)  
**App task:** Budget Code Mapper (APPS list)  
**Live (v5):** https://mawizorek.github.io/ClickUp_apps/budget-code-mapper/

---

## ARCHITECTURAL CHANGE: Data Separation Retrofit

Per the locked Data Separation Pattern (Apps/HTML Artifacts reference, 2026-07-02): extract the budget code schema, mappings, and authority data out of `index.html` into a standalone `data.json`.

The Budget Code Mapper's code data (families, categories, subcategories, fiscal-year rendering rules) changes independently of the app's UI logic. This makes it a textbook candidate for the split.

### New file structure

```
budget-code-mapper/
 index.html <- app engine (schema sandbox UI, mapping panel, export logic). Version-bumped only on feature changes.
 data.json <- budget code schema + authority mappings. Updated via MCP when codes change.
 README.md <- (existing)
 source/ <- (existing chunk set, rebuild after v6 ships)
```

### How it works

- On load, `index.html` does `fetch('./data.json')` (same-origin on GitHub Pages, no CORS, no auth).
- Parsed JSON provides the full budget code authority: families, categories, subcategories, semantic buckets, fiscal-year rules, and any pre-configured mappings.
- **Offline fallback:** after a successful fetch, cache JSON in `localStorage`. On fetch failure, fall back to cached data. If no cache, show instructions.
- **Inline fallback (minimal):** embed just the top-level family list so the app skeleton always renders.

### data.json schema (top-level)

```json
{
  "version": "2026-07-02",
  "fiscalYear": "FY2026",
  "families": [
    {
      "code": "1000",
      "name": "Personnel",
      "categories": [
        {
          "code": "1100",
          "name": "Salaries",
          "subcategories": [
            { "code": "1110", "name": "Full-Time Staff" },
            { "code": "1120", "name": "Part-Time Staff" }
          ]
        }
      ]
    }
  ],
  "semanticBuckets": {
    "overhead": ["1000", "2000"],
    "program": ["3000", "4000"],
    "capital": ["5000"]
  },
  "renderRules": {
    "prefix": "FY26",
    "separator": "-",
    "format": "{prefix}{separator}{family}{separator}{category}{separator}{subcategory}"
  }
}
```

Note: the exact schema above is illustrative. The render agent should extract the actual data structure from the current v5 source and preserve it in this shape.

---

## EXISTING v6 FEATURE WORK (Schema Sandbox + JSON Round-Trip)

The data separation is additive to the existing v6 plans documented in the task description:

- **Schema Sandbox reframe:** v6 becomes a schema optimization sandbox. Win condition = fewest manual overrides.
- **JSON Round-Trip:** import/export the full authority as JSON (this now maps directly to `data.json` — the export IS the data file, the import loads from it).
- **Mapping panel** as the primary interaction surface.

The data-separation retrofit makes the JSON round-trip native: the app's runtime data IS the `data.json` file. Export = download the current schema. Import = load a modified schema. The weekly update workflow = Brain commits a new `data.json` reflecting any ClickUp changes.

---

## DATA PIPELINE

1. Michael maintains budget code structure in ClickUp (URITP Budget Codes task/docs).
2. When codes change, Michael tells Brain to refresh.
3. Brain reads the ClickUp source, rebuilds `data.json`, commits via MCP.
4. Live app picks up changes on next load (~60s Pages lag).

---

## RETROFIT STEPS (for the render agent)

1. Read the v5 source via the chunk set at `budget-code-mapper/source/_index.md`.
2. Identify the inline data block(s): the budget code families, categories, mappings, rendering config.
3. Extract into the `data.json` schema above.
4. Replace the inline data with a `fetch('./data.json')` loader + localStorage cache + inline fallback.
5. Preserve ALL existing v5 UI functionality unchanged.
6. Deliver both the modified `index.html` and the extracted `data.json` as artifacts.
7. Do NOT commit to the repo (files >30KB are uploaded manually).

---

## SUCCESS CRITERIA

- App loads from GitHub Pages and fetches `data.json` successfully.
- All existing budget code mapping, rendering, and export features work as before.
- JSON export produces a file compatible with `data.json` schema (round-trip).
- Offline: works fully from localStorage cache after first load.
- Mobile: existing responsive behavior preserved.
- Data file stays well under 30KB (budget code schema is compact).

---

## Index = pointer, not a store (LOCKED 2026-07-08, standing)

`index.html` is an INDEX: a thin shell/router that references source pages, never a file that itself stores a full servable page. The moment this app has more than one servable page/view, `index.html` becomes the dispatcher that points at them (real pages live as their own named files; the default landing is a one-line constant it can repoint without a rebuild). Keep the shell well under the read cap and never grow `index.html` into a multi-page store. Mirror of the locked rule in the Apps / HTML Artifacts standard + GitHub MCP Operating Standard.
