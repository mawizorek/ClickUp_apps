# FileMaker Apps

> ## ➡️ FileMaker SPECS live in maw-prose now (D-041, 2026-10-04)
>
> Every FileMaker app's spec (tables, fields, relationships, scripts, layouts, value lists) lives in **[maw-prose `apps/<app>/`](https://github.com/mawizorek/maw-prose/tree/main/apps)**, written in the doc renderer's format: template-docs front matter, a `Grain` callout, the field register as a sibling `.tsv`. Read them through **[fmp-renderer](https://mawizorek.github.io/ClickUp_apps/fmp-renderer/)**, which draws them as FileMaker's own Manage Database dialog.
>
> - Moved 2026-10-04, verified byte-identical before removal: `maw-budget`, `uritp-global-setup`, `uritp-people`.
> - `hml-llc/` here is **superseded** by maw-prose `apps/hml-llc/` (migrated 2026-07-31). Do not edit it.
> - `DOCUMENTATION-STANDARD.md` here is a pointer. The one standard is maw-prose `CONVENTIONS.md` § FileMaker specs plus the template-docs authoring pages.
> - **Write no new spec here.** A spec anywhere but maw-prose is a second claimant.

## What still lives here

Code and build tools, never specs: HTML layout renders, `_viewer/`, `z-themes/`, `_template-fmp-app/`, and the render standards (`LAYOUT-RENDER-STANDARD.md`, `THEMING-INTEGRATION.md`).

> ## ⚠️ READ FIRST — what a FileMaker render IS (and is not)
>
> **Everything Brain builds under `filemaker/` is a DESIGN MOCKUP / BUILD TOOL ONLY. Never a production or hosted asset. Web viewing is NOT on the table.**
>
> These HTML renders exist to articulate *how a native FileMaker layout should look and behave*, so Michael can build it natively in FileMaker. An agent entering this space is building a **design tool to help Michael design**, not web content and not a web-viewer payload.
>
> - No live data, no runtime fetches, no hosting. Michael adds real placeholder text/fields himself during the native build.
> - The render's value is **communication**: layout, hierarchy, theming, and object behavior. Build-time affordances that make the native build faster are encouraged, e.g. a hover-over inspector on an object that surfaces its theme role + intended field definition.
> - Same *kind* of artifact as the ClickUp HTML apps, themed the same way; theme tokens are **inlined at build time**, never fetched, because these open from a local filesystem.
>
> Enforced by [`brain-config/gates/theme-contract-gate.md`](../brain-config/gates/theme-contract-gate.md).

## Theming (GLOBAL)

FileMaker renders and ClickUp apps share **one** theme system: **[`/shared/themes/`](../shared/themes/)**. One semantic contract, one set of themes, referenced by slug. A render inlines the resolved tokens for its chosen theme into its `:root`. When the native FileMaker theme gets built, map FMP object styles to the same roles (see `fmpRoleMap` in `shared/themes/_index.json`) so render and solution stay in agreement. **Do not define colors inline or per-app.**
