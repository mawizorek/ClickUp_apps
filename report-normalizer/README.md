# Report Normalizer

### \u25b6\ufe0e [**Launch the app \u2192**](https://mawizorek.github.io/ClickUp_apps/report-normalizer/)

![launch](https://img.shields.io/badge/\u25b6\ufe0e_Launch-Report_Normalizer-e08a3c)

**Status:** v1 (front end) \u00b7 runs local-only until the Cloudflare Worker + D1 are wired.
**Source of truth:** this repo folder. Live at the Pages URL above.

## What it does

A pre-filter that turns any messy Excel/CSV export into clean, standard-named output for
downstream import (FileMaker Beta Budget first). Manual upload only.

- **Zero-config floor:** drop any CSV and it's instantly a clean viewer/editor \u2014 rename
  headers, drop columns, filter rows, export. No schema or profile required.
- **Profiles ceiling:** save a mapping (header remap + transforms + row filter) once, and the
  app auto-recognizes that report next time by header fingerprint (or filename hint) and
  pre-fills everything. This is the self-expanding report catalog.
- **Transform ops:** trim, UPPER, flip sign, debit/credit \u2192 signed, date reformat, constant,
  merge. Attached per target field.
- **Seeded:** ships with the **Beta Budget (Purchases)** target schema + the **URF0985 \u2192
  Beta Budget** profile, taken from the BETA-361 hand-cleaning routine.

## How to use it

1. Open the app, drop a CSV. If it recognizes the report, the mapping is pre-filled.
2. **Map:** pick a target schema, map each column (or drop it), attach transform ops, set an
   optional row filter. Watch the live before/after preview. Name it and Save profile.
3. **Output:** download the clean CSV (long-press \u2192 Download Linked File on iPhone).

Profiles/schemas/runs persist in this browser (localStorage) until you point the app at a
Worker. Open the Settings gear \u2192 paste your Worker URL + write key to persist to D1 instead.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Slim shell / router | Version bumps |
| `styles.css` | Styling (dark default + light) | As needed |
| `source/*.js` | Engine modules (state, csv, transforms, engine, api, seed, ui-*) | Feature work |
| `config.json` | Access gate (open) | Flip as needed |
| `worker.js` / `wrangler.toml` / `db/schema.sql` | Cloudflare Worker + D1 backend (NOT served by Pages) | When wiring persistence |

## Architecture

- **Modular, Pages-hosted.** `index.html` fetches `source/` modules at runtime; not offline / not `file://`.
- **Own D1 database** (mirrors `inciardi-market`). ClickUp is not involved; this app owns its state.
- **Files are transient.** CSV is parsed and transformed in-browser and never stored. Only
  mapping profiles, target schemas, and run history persist.
- **Backend-optional by design.** Local-only mode uses localStorage with the seeded schema +
  profile. Setting a Worker URL switches the same method surface to the D1 REST Worker.
- **Write-gate (integrity, not secrecy):** the Worker checks an `X-Write-Key` header on every
  mutation. Reads open. Non-sensitive data only.
- **Header fingerprint match is exact-or-warn** \u2014 never auto-applies a partial/stale profile.

## Version history

- **v1** \u2014 front end: 3-step Source \u2192 Map \u2192 Output rail, transform op library, live preview,
  catalog drawer, seeded Beta Budget schema + URF0985 profile, local-only persistence,
  Worker-ready client. Commit history is authoritative.

## Related

- ClickUp task: Report Normalizer (APPS list).
- Spec: `report-normalizer/next-build-spec.md`.
- Source workflow: ClickUp task BETA-361 (URF0985 \u2192 Beta Budget cleaning routine).
- Pattern lineage: `inciardi-market` (Cloudflare Worker + D1 + write-gate).

## Roadmap

- Wire the Cloudflare Worker + D1 (schema in `db/schema.sql`), migrate profiles off localStorage.
- Split-router (labor vs purchases on `Ledger Account < 6000`, two outputs).
- Semantic budget-code resolver (production \u2192 area \u2192 suffix \u2192 code).
- Multi-destination schemas (calendar, personnel, CL Receipts).
- Run-history reconciliation views.
