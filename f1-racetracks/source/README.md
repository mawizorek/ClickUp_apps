# F1 Racetracks — semantic source companion

This folder is now the **preferred agent-readable/editable source surface** for F1 Racetracks.

The live app still ships from `../index.html`, but the source is no longer treated as a single opaque monolith for day-to-day work.

## Why this exists

The runtime artifact is ~125 KB and too large to trust through monolithic read paths. This companion splits the app into named files by concern so future edits are:

- easier to inspect
- easier to reason about
- easier to diff in PRs
- less likely to silently truncate in agent tooling

## Current structure

- runtime shell: `01_runtime_head.html`, `04_runtime_shell.html`
- styles: `02_*`, `03_*`
- data groups: `05_*` through `08_*`
- logic: `09_*` through `11_*`
- manifest / rebuild order: `source_index.md`

## Important rule

For source work, read **`source_index.md` first**.

## Runtime vs source

- `../index.html` = shipped runtime artifact
- `source/` = canonical edit surface for the next wave of agent work

## Legacy note

The older `index-7_partNN_of_11.txt` plaintext chunks are retained temporarily as migration inputs. They are no longer the preferred structure.