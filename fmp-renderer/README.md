# fmp-renderer

FileMaker's Manage Database dialog, rebuilt as a reader for the specs in **maw-prose**. Open an app, flip Tables and Fields, click a field, see what was documented as the plan. No FileMaker needed.

Live: https://mawizorek.github.io/ClickUp_apps/fmp-renderer/

## What it is (and isn't)

- **Holds no spec content.** It reads `mawizorek/maw-prose` `apps/<app>/` live at page load (maw-prose D-040). Write a note there, push, hit *Re-read repo*.
- **Shows the target, not the file.** The spec is the gold standard; nothing here claims what exists in a .fmp12 (Sep 25 ruling). No per-table state is read or shown. Counts on the launch tiles are files in the repo, derived, never typed.
- **Validation renders, never fails.** Issues (no grain, no fields table, duplicate field, unknown type, a TO pointing at a table with no note) paint in place as red badges.

## Data contract: the table note

`apps/<app>/tables/<Table>.md`, no front matter (D-030):

    # Table
    Manage → Database → Tables → Table
    Grain: what one record means.
    ## Fields
    | Field | Type | FMP Comment | TO | ⚠️ |

Columns are matched by header name, not position. Types: `text`, `text-uuid`, `number`, `date`, `time`, `timestamp`, `container`, `(c→Number)` calc, `(s→…)` summary. A field name linked to `../calculations/*.fmcalc` gets a calc-file link. `tables/README.md` links set the Tables order; unlisted notes sort after, A to Z.

## Seams

| File | Job |
|---|---|
| `source/github.js` | the only network code. 2 API calls per load (commit, tree), cached 5 min; bodies from raw, pinned to the commit SHA |
| `source/repo.js` | apps and counts from the file list |
| `source/parse.js` | one note in, data out; validation |
| `source/md.js` | just enough markdown for note prose |
| `source/views.js` | HTML for every screen, pure |
| `source/app.js` | routing (`#/<app>/fields/<Table>/<Field>`), events |

Theme: `database` join via `shared/themes/resolve.js`; `app.css` carries a floor copy of every token.

## Known limits (v1)

- Relationships tab: placeholder. Script Workspace: not built.
- Unauthenticated GitHub API: 60 reads an hour per IP. Normal use spends 2 per 5 minutes.
- Refuses to render if GitHub truncates the tree, rather than show a spec with holes.
