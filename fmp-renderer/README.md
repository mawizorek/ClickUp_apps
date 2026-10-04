# fmp-renderer

FileMaker's Manage Database dialog, rebuilt as a reader for the specs in **maw-prose**. Open an app, flip Tables and Fields, click a field, see what was documented as the plan. No FileMaker needed.

Live: https://mawizorek.github.io/ClickUp_apps/fmp-renderer/

## What it is (and isn't)

- **Holds no spec content.** It reads `mawizorek/maw-prose` `apps/<app>/` live at page load (maw-prose D-040). Write a note there, push, hit *Re-read repo*.
- **Shows the target, not the file.** The spec is the gold standard; nothing here claims what exists in a .fmp12 (Sep 25 ruling). No per-table state is read or shown. Counts on the launch tiles are files in the repo, derived, never typed.
- **Validation renders, never fails.** Issues (no grain, no fields table, duplicate field, unknown type, a TO pointing at a table with no note) paint in place as red badges.

## Data contract: the table note

`apps/<app>/tables/<Table>.md` in maw-prose. Two shapes read; the first is the target (maw-prose D-041).

**Doc-renderer shape** (Production MAWster's): template-docs front matter (`id`, `title`, `status`, `type`, `summary`, optional `order`, `revised`, `data`), a `!!! abstract "Grain"` callout, and the field register as a sibling `.tsv` declared under `data:` and placed with `!!! data "<slot>"`. TSV columns by header name: `Field_Name`, `Type`, `Options`, `Notes`, `status` (a field GROUP, never build state). `name::type.role` header declarations are ignored for matching; `- EOF -` rows are skipped.

**Older shape** (still renders, amber notice): no front matter, a `Grain:` line, and a markdown table under `## Fields` (Field | Type | FMP Comment | TO | ⚠️).

Types: `text`, `text-uuid`, `number`, `date`, `time`, `timestamp`, `container`, `(c→Number)` calc, `(s→…)` summary. Sort: `order:`, then the tables index's link order, then A to Z. Routes use the file stem. `[text](@id)` links resolve in-app when the id is a table in the same app; `[text]{.marker}` renders as a marker chip; `!!!` callouts render.

**Red** = a spec problem (no grain, missing or unnamed register rows, unknown type, duplicate field, a TO with no table note, an unquoted `: ` in the header that drops the page from the doc site). **Amber** = old shape or missing header keys.

## Seams

| File | Job |
|---|---|
| `source/github.js` | the only network code. 2 API calls per load (commit, tree), cached 5 min; bodies from raw, pinned to the commit SHA |
| `source/repo.js` | apps and counts from the file list |
| `source/front.js` | the template-docs header, just far enough |
| `source/parse.js` | one note in, data out (both shapes, TSV registers); validation |
| `source/md.js` | just enough markdown for note prose, plus callouts, markers, `@id` links |
| `source/views.js` | HTML for every screen, pure |
| `source/app.js` | routing (`#/<app>/fields/<Table>/<Field>`), events |

Theme: `database` join via `shared/themes/resolve.js`; `app.css` carries a floor copy of every token.

## Known limits (v1)

- Relationships tab: placeholder. Script Workspace: not built.
- Unauthenticated GitHub API: 60 reads an hour per IP. Normal use spends 2 per 5 minutes.
- Refuses to render if GitHub truncates the tree, rather than show a spec with holes.
