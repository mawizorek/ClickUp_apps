# FileMaker Apps

**The FileMaker documentation window of `mawizorek/ClickUp_apps`.**

> ## ⚠️ READ FIRST — what a FileMaker render IS (and is not)
>
> **Everything Brain builds under `filemaker/` is a DESIGN MOCKUP / BUILD TOOL ONLY. Never a production or hosted asset. Web viewing is NOT on the table.**
>
> These HTML renders exist to articulate *how a native FileMaker layout should look and behave*, so Michael can build it natively in FileMaker (the real native work lands end-of-year). An agent entering this space is building a **design tool to help Michael design**, not web content and not a web-viewer payload.
>
> - No live data, no runtime fetches, no hosting. Michael adds real placeholder text/fields himself during the native build.
> - The render's value is **communication**: layout, hierarchy, theming, and object behavior. Encouraged — build-time affordances that make the native build faster, e.g. a hover-over inspector on an object that surfaces its theme role + intended field definition (“surface-1 chrome · pulls `Race.Winner`”). That is build documentation, not app behavior.
> - Same *kind* of artifact as the ClickUp HTML apps, themed the same way (see below); they differ only in purpose (documentation vs running product) and delivery (theme tokens are **inlined at build time**, never fetched, because these open from a local filesystem).
>
> Enforced by [`brain-config/gates/theme-contract-gate.md`](../brain-config/gates/theme-contract-gate.md).

## Theming (GLOBAL)

FileMaker renders and ClickUp apps share **one** theme system: **[`/shared/themes/`](../shared/themes/)**. One 17-token semantic contract, one set of themes, referenced by slug. A render inlines the resolved tokens for its chosen theme into its `:root`; changing the theme file reskins every consumer that references that slug. When the native FileMaker theme gets built end-of-year, map FMP object styles to the same 17 roles (see `fmpRoleMap` in `shared/themes/_index.json`) so render and solution stay in agreement. **Do not define colors inline or per-app.**

Where `clickup-apps` folders hold apps that *run* in the repo (`index.html` IS the app), `filemaker/` folders hold the **documented source of truth** for apps that run in FileMaker Pro. Apps are BUILT in FileMaker by Michael and DOCed here by Brain. **Git is canonical**; ClickUp FMP docs are being culled to pointers.

## Documentation model (repo-native, v1 — 2026-07-14)

The repo is a **1:1 mirror of the FileMaker solution**: one file per object, navigated like *Manage Database* / *Manage Scripts*, edited by PR. This replaced the old 11-fixed-pages model. Full rules: **[DOCUMENTATION-STANDARD.md](./DOCUMENTATION-STANDARD.md)**.

## Per-app structure

```
filemaker/<app-slug>/
  README.md          cover (Next Steps + Open Questions on top)
  INDEX.md           rendering manifest — links every object
  next-build-spec.md
  schema/            machine mirror (generated JSON)
  tables/            one file per table (+ README, _index.json)
  relationships/     graph + prose (+ README, _index.json)
  layouts/           one file per layout (+ README, _index.json)
  scripts/           mirrors FMP script folders (+ README, _index.json)
  functions/         one file per custom function (+ README, _index.json)
  value-lists/       (+ README)
  meta/              narrative docs (design/architecture/data-standards/changelog/graph-log/import-export)
  notes/             per-build / session notes
```

Copy `_template-fmp-app/` to start a new app.

## Source-of-truth principle

Git is canonical. The schema JSON + object markdown are what Brain edits and versions. The Phase 2 viewer skin is **purely aesthetic** — a passive renderer fed by `_index.json` + `schema/*.json` + `*.md`. Any app that ships this format gets the pretty database map for free.

## File budget

Same as the ClickUp apps: sub-12KB modules, split by concern, `.nojekyll` respected, no monoliths. Object files stay well under the 30KB read cap so Brain reads them whole.

## Apps

| App | Status | Notes |
|---|---|---|
| [hml-llc](./hml-llc/) | Pilot / migrating · **reference implementation** | Hard Money Loan LLC. First app on the repo-native mirror model. |

## Roadmap

- **Phase 1 (done):** repo split live, schema-as-JSON + docs-as-markdown.
- **Phase 2 (now):** repo-native one-file-per-object mirror + `_index.json` manifests + standard in git. HML prototype.
- **Phase 3:** passive viewer skin parses `_index.json`/`schema/*.json` into a colored/sorted field map + relationships table + script/function browser.
- **Phase 4:** shared `scripts/` + `functions/` library for reused FMP code across apps.
