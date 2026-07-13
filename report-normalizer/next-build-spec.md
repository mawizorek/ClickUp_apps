# Report Normalizer — next-build-spec

**Version target:** v1 (spec only — NO build yet, per Michael 2026-07-13)
**Status:** Scratch intake → Next build (documented, brainstorm woven in, awaiting build green-light)
**Home:** own app folder `report-normalizer/` (own Cloudflare Worker + own D1). NOT a Prism lens.
**Pattern lineage:** `inciardi-market` (Worker + D1 + write-gate, secrets in Cloudflare dashboard).

---

## 0. One-liner

A pre-filter that takes any messy Excel/CSV export and normalizes it — remap headers,
transform values, split/route rows — into a clean, standard-named output that downstream
apps (FileMaker Beta Budget first) ingest with zero import logic. Manual upload only.

**The load-bearing design principle (Michael, 2026-07-13):** _zero-config is the floor,
profiles are the ceiling._ With no saved profile, it is a clean skinned CSV viewer/editor
(rename headers, drop columns, filter rows, export). A saved profile is only an
accelerator that pre-applies all of that for a report it recognizes. Same app, two speeds.
It should be allowed to "just feel like a skinned CSV viewer" and that is a feature.

---

## 1. Brainstorm (documented as we go — Workshop 6 lenses)

- **Risk Rhys (failure pre-mortem):** the killer is a profile silently mis-mapping a
  column after a source report changes its headers (Workday adds/renames a column). A
  stale profile applied blind = wrong numbers imported to Beta Budget, worse than no tool.
  MITIGATION: header-fingerprint match must be exact-or-warn; on drift, drop to manual
  and flag the delta, never auto-apply a partial match. Also: debit/credit sign errors
  are silent and financial — every sign transform gets a visible before/after preview.
- **Clever Cleo (elevate):** the split step (labor vs purchases on `Ledger Account < 6000`)
  is the sleeper feature — one upload → two clean outputs routed to two target schemas.
  A plain viewer can't do that. Also: a "semantic assignment" hook (resolve a budget code
  from production→area→suffix meaning, per the FMP workflow doc) is where it stops being
  cleanup and becomes intelligence.
- **Polish Polly:** the 3-step rail (Source → Map → Output) must read without instruction.
  Every transform shows a live before/after on real rows. Confirm-state on upload (drop
  zone flips to done). Honest empty/error states. No dev language in UI.
- **Feasible Finn:** v1 is achievable on the proven inciardi stack. CSV parse in-browser
  (PapaParse-class), transforms client-side, Worker only stores/reads profiles+schemas+runs
  in D1. No server-side file processing needed for v1 = small Worker, low risk.
- **Scope Skye (the ship-it lens / "what Stu would say"):** DO NOT build the semantic
  code-resolver, the split-router, or Workday API pull in v1. v1 = manual upload, single
  target, manual remap, save/recall profile, debit-credit + rename + drop + filter
  transforms, CSV out, run log. Everything else is Futures. Architect for them day 1
  (schema leaves room), build them later. One report proven end-to-end (URF0985→Beta
  Budget) before generalizing.
- **Eco Enzo (systems fit):** overlaps Budget Code Mapper (assigns codes) and the Prism
  JSON/CSV lens (views data). Bounded: Normalizer CLEANS+REMAPS arbitrary exports; it is
  neither a code-authority tool nor a stateless viewer. Feeds the whole FMP fleet, not just
  budget. Reuses inciardi's Worker+D1 pattern rather than inventing a stack.

**Fold-in Frank verdict:** NET-NEW app, FOLD-IN pattern. New app (owns its state/DB), but
reuses the existing Cloudflare Worker + D1 architecture tier — no new infrastructure kind.

---

## 2. Architecture (build larger from day 1; ship narrow)

```
report-normalizer/
  index.html          slim shell / router
  source/             concern-split modules (<12KB each): upload, map-editor,
                      transforms, catalog-drawer, output, api-client
  worker.js           Cloudflare Worker: REST over D1. Open reads, GATED writes.
  wrangler.toml       own D1 binding (own database, NOT shared)
  db/schema.sql       canonical tables + URF0985→Beta Budget seed
  README.md           standard (launch link, Infrastructure table, architecture)
  next-build-spec.md  this file
```

- **Own D1 database** (Michael's call 2026-07-13). Not the shared idea — this app owns
  enough state (schemas, profiles, run history) to justify its own DB, mirroring inciardi.
- **Write-gate mandatory** (integrity, not secrecy): `WRITE_KEY` secret in the Cloudflare
  dashboard, server-side check on every mutating route. Public app can't POST garbage
  profiles. Reads open.
- **Manual upload only** (locked). No cron, no Workday API pull in any near-term version.
  The Worker exists for persistence (profiles/schemas/runs), NOT for fetching source files.
- **Files are transient.** Upload → normalize in-browser → download. The DB stores the
  CONFIG and the HISTORY, never the raw report data.

### D1 schema (v1 tables — roomy for Futures)

- **`schema`** — target contracts. `schema_id, name, notes, locked, created_at, updated_at`.
  Child `schema_field(schema_id, field, order, required, type)`. Beta Budget is one row.
- **`profile`** — saved mappings. `profile_id, name, schema_id (FK), header_fingerprint,
  filename_hint, locked, source, created_at, updated_at`. Children:
  `profile_map(profile_id, source_col, target_field | DROP)` and
  `profile_transform(profile_id, target_field, op, args_json, order)`.
- **`run`** — audit log. `run_id, profile_id (nullable), source_filename, row_count_in,
  row_count_out, target_schema, ran_at, notes`. (Reconciliation memory: "did I import Jan?")
- Roomy-for-Futures (defined, unused in v1): `profile.split_rule_json` (labor/purchase cut),
  a `resolver` table stub for semantic code resolution. Present so the split + semantic
  features drop in without a schema migration.

### Transform ops (named, reusable — the transform library)

`renameColumn` · `dropColumn` · `debitCreditToSigned` · `signFlip` · `dateReformat` ·
`trimWhitespace` · `caseNormalize` · `constant` · `derived` · `filterRows`. Each profile
lists which ops run and in what order. New bank/report quirk = new op or new profile,
never an engine change.

---

## 3. Menus / UX

- **3-step rail: Source → Map → Output.**
  - **Source:** drop a file. App fingerprints headers. Known → auto-load profile, jump to a
    filled Map step (with a visible "matched profile X" banner + a way to override to manual).
    Unknown → blank Map step (pure viewer mode).
  - **Map:** two columns — incoming headers (left) ↔ target schema fields (right). Per source
    column: pick target field or DROP. Attach transform ops per column. Live before/after on
    real rows. Pick target schema up top; row filters at bottom. Name + Save = writes profile
    to D1 (gated).
  - **Output:** clean CSV download (blob-link pattern per Apps standard). Logs a `run` row.
- **Mappings catalog drawer** (header button): list of saved profiles — name, target schema,
  last used. Row actions: New · Edit · Duplicate · Delete. This is the self-expanding report
  catalog; over time it's the actual product.
- **Settings gear:** theme toggle + Worker URL field + honest data-freshness note (inciardi
  pattern). Zero-config mode works with no Worker at all (viewer-only, no save).

---

## 4. Seed: URF0985 → Beta Budget (pulled from task BETA-361 + the closed Jan report)

Target schema **Beta Budget (Purchases)** fields + the mapping, verbatim from Michael's
hand-cleaning routine:

| Target field | Source (URF0985) | Transform |
|---|---|---|
| RECEIPT# | (none) | `constant`/manual add |
| DATE | Accounting Date | `dateReformat` |
| VENDOR | Supplier | `trimWhitespace` |
| DESCRIPTION | Line Memo | — |
| METHOD | Journal Source | — |
| AMOUNT | Amount | pass-through (sign check preview) |
| CODE | (none) | manual/semantic (Futures) |
| NOTES | Header Memo | — |

Plus documented (Futures, schema leaves room): drop the column run company→cost center /
FAO Name / PO Number / Award→Fiscal Time Period End; merge Reference into Business Doc;
split rows on `Ledger Account < 6000 = labor` vs purchases.

---

## 5. Next build (v1 scope — the ship-it line)

Manual upload · single target schema · manual remap · save/recall profile ·
ops: rename, drop, debitCreditToSigned, signFlip, dateReformat, trim, case, constant,
filterRows · CSV out · run log · Beta Budget schema + URF0985 profile seeded.

## 6. Futures (architected day 1, built later)

Split-router (labor vs purchases, two outputs) · semantic budget-code resolver
(production→area→suffix → code) · multi-destination schemas (calendar, personnel, CL
Receipts) · run-history reconciliation views · (long horizon) Worker-side report pull.

## 7. Known guardrails

- Manual upload only — no auto-fetch.
- Header-fingerprint match is exact-or-warn; never auto-apply a partial/stale profile.
- Every sign/amount transform shows before/after; financial errors are silent otherwise.
- Write-gate on all mutations. Reads open. Non-sensitive data only (cosmetic gate rules apply).
- Own D1. Files transient; DB holds config + history, never raw report rows.
- Modular source, each file <12KB. index.html = shell/router, never a stored page.
- No build until Michael green-lights v1. This file is idea + spec only.
