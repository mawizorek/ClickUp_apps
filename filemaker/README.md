# FileMaker Apps

**The FileMaker documentation window of `mawizorek/ClickUp_apps`.**

This tree is the second "window" of the repo portal. Where `clickup-apps` folders hold apps that *run* in the repo (`index.html` IS the app), `filemaker/` folders hold the **documented source of truth** for apps that run in FileMaker Pro. The apps are BUILT in FileMaker by Michael and DOCed here by Brain.

## The distinction (why this is its own window)

| | ClickUp apps | FileMaker apps |
|---|---|---|
| Where it runs | GitHub Pages (repo `index.html`) | FileMaker Pro (local file) |
| Primary builder | Brain | Michael |
| Primary documenter | Brain | Brain |
| Repo folder holds | the runnable app | schema source + docs |
| Rendered by | the app itself | (Phase 2) a passive viewer skin |

## Structure

Each FMP app is a folder here with the same shape (copy `_template-fmp-app/` to start):

```
filemaker/
  <app-slug>/
    README.md            cover page (Next Steps + Open Questions at top)
    schema/
      tables.json        structured, shareable table + field source
      relationships.json  the relationship graph as data
      value-lists.json   value lists
    docs/                the 11 standard documentation subpages, as markdown
    next-build-spec.md   overwritten each build cycle
```

## Source-of-truth principle

Git is canonical. The schema JSON + markdown are what Brain primarily edits and versions. The Phase 2 viewer skin is **purely aesthetic** — a passive renderer fed by `schema/*.json` + `docs/*.md`. Any app that ships that source format gets the pretty database map for free. Until the viewer exists, portal rows use the "view on repo" chevron.

## File budget

Same rules as the ClickUp apps: sub-12KB modules, split by concern, `.nojekyll` respected, no monoliths. Schema files stay well under the 30KB read cap so Brain reads them whole.

## Apps

| App | Status | Notes |
|---|---|---|
| [hml-llc](./hml-llc/) | Pilot / migrating | Hard Money Loan LLC. First app migrated into this window. |

## Roadmap

- **Phase 1 (now):** repo split live, schema-as-JSON + docs-as-markdown, repo-view chevron in the portal.
- **Phase 2:** passive viewer skin — parses `schema/*.json` into a colored/sorted/framed field map + relationships table.
- **Phase 3:** script notes as individual source files; shared `scripts/` + `functions/` library for reused FMP scripts and custom functions.
