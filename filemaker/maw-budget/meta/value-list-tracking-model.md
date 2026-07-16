# Value-List Tracking Model + Generic Render-Shell Family

_How maw-budget (and every FMP app in this repo) tracks its value lists as documented data, and how a small family of generic render shells displays that data. Companion to `relationship-audit-model.md`; same derive-dont-store discipline._

**Status:** value-list index + renderer LOCKED direction and built (2026-07-16). The broader render-shell family (field/table renderer, cross-app consolidation) is **PROPOSED, pending Michael's go-ahead** (net-new, flagged below).

---

## Part 1 — Tracking value lists (the third index)

We already track two things as joined indexes: **layouts** (`layouts/_index.json`) and **table occurrences / relationships** (`relationships/_index.json`), keyed on `occurrenceId`. Value lists are the natural third: like fields and relationships, they are structural metadata worth documenting once and auditing by query.

### `value-lists/_index.json` — source of truth

Each entry = one value list, carrying **how it derives** and **what it may contain**:

| Field | Meaning |
|---|---|
| `valueListId` | stable key (e.g. `VL_AccountTypes`) — the join key |
| `name` | display name ("Account Types") |
| `derivation` | `custom` · `fromField` · `globalSeed` · `relatedTable` (see below) |
| `flags` | `isActive`, `isStatusList`, `enforce1to1` (the three per-list checkboxes) |
| `values[]` | literal values for `custom`/`globalSeed`; **null** for `fromField` (derived, never stored) |
| `items[]` | for `relatedTable`: `{sort, value, statusCategory}` per member |
| `source` | for `fromField`: `{occurrenceId, displayField, keyField, useRelated, sort}` |
| `storage` | where keys live, e.g. `Globals::gLIST_AccountTypes` |
| `globalKeys[]` | which `gLIST_` globals point at this list (the GLOBALS panel assignments) |
| `provenance` | `{status, added, lastChanged, note}` |

### The four derivation types

- **`custom`** — FileMaker "Use custom values." Hand-typed, stored in `values[]`.
- **`fromField`** — "Use values from field." Derived from a `TO::field` at runtime; `values[]` is null. Same rule as DD-003: never store what you can derive.
- **`globalSeed`** — the status-style seed: a `gLIST_` global on `Globals` holds newline-delimited keys, and a from-field list points at that global. `values[]` mirrors the seed for docs.
- **`relatedTable`** — backed by a real table (`ValueListItems`), portal-edited on the Value Lists layout. The only type that supports per-item metadata (sort, status mapping, notes).

### Status lists (the clever part, from the URITP prior art)

A list with `isStatusList=true` maps each member onto a **canonical status category** (`New / Error / Active / Done / Closed`, from `VL_StatusCategories`). `enforce1to1=true` requires exactly one mapping per value. This lets any custom vocabulary roll up to canonical states (e.g. import `needs_review` -> `Error`). `VL_StatusCategories` is the canonical master every status list maps onto.

### Audits are queries, never a stored xref

Layout objects already carry `binding.valueList` in each `layout.json`. So:

| Question | Query over |
|---|---|
| How does list X derive / what's in it? | the value-lists node |
| Where is list X used? | layout objects where `binding.valueList == X` |
| Which lists pull from field F on TO T? | value-lists where `source == {T,F}` |
| Which globals seed list X? | the node's `globalKeys[]` |
| Orphan list (defined, bound nowhere)? | node with zero binding matches |

No `_xref.json`. Three indexes, joined on keys, audited by query. The future viewer computes these live.

---

## Part 2 — The generic render-shell family (PROPOSED)

**Michael's framing:** collapse the things we audit and parse (layouts, value lists, fields, tables, relationships) into appropriately-sized **data files**, and let **generic render shells** display them. This forces documentation compliance (fill the JSON, the shell renders it) and limits editing to data, not per-app HTML.

### The pattern (already emerging)

| Concern | Data file | Render shell | Status |
|---|---|---|---|
| Layout | `layouts/<...>/layout.json` | `preview.html` (interactive) + `index.html` (inspector) | BUILT |
| Value lists | `value-lists/_index.json` | `LAYOUT-value-lists/preview.html` (generic, data-driven) | BUILT (this PR) |
| Fields / tables | `schema/tables.json` + `tables/*` | field/table render shell | **PROPOSED** |
| Relationships | `relationships/_index.json` | TO-graph render shell | **PROPOSED** |

Each shell is **generic**: it renders from the manifest, so the same file serves every app. The value-list `preview.html` already proves this — point it at any app's `value-lists/_index.json` and it renders unchanged.

### Consolidation target

All shells converge into the decided **`z-fm-layout-object-viewer`** at `filemaker/` level: load any app's data files by slug+path, render the right shell per concern, compute the cross-index joins live. The per-folder `index.html` inspectors retire into it.

### Why this is flagged, not just built

The value-list renderer is in-scope for "wire the value list index" and is built. But a **cross-app render-shell family + a field/table renderer** is net-new structure spanning every FMP app. Per the anti-sprawl gate, that gets a ruling before it is committed as a framework. **This doc captures the direction; the field/table renderer + the cross-app shell contract await an explicit go-ahead.**

### Open questions for the ruling

1. One shell per concern, or one polymorphic shell that switches on a `kind` field?
2. Do shells `fetch()` the data files (clean, but file:// on Pages is fussy) or embed a mirror (works everywhere, must stay in sync)? Today: embed-a-mirror, like the theme tokens.
3. Sizing: per-app `_index.json` until a concern outgrows it, then per-object files (mirrors the layout folder split). Who forecasts the split (Size Sally)?
4. Does the field/table renderer wait for `tables/` to exist, or do we render proposed fields first (layout-first spirit)?
