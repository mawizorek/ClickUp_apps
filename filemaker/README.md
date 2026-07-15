# FileMaker Apps

**The FileMaker documentation window of `mawizorek/ClickUp_apps`.**

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
