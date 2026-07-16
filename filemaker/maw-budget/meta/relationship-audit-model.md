# Relationship + Layout Audit Model

_How maw-budget tracks which table occurrences relate to which, which layouts sit on which occurrence, and how we audit + expand that without maintaining a matrix. Generalizes to every FMP app in this repo._

**Status:** LOCKED direction (Michael, 2026-07-16). Applies to layout-first articulation going forward.

---

## Principle: derive, don't store (same rule as DD-003)

The app itself never stores a balance it can derive. The **docs** follow the same discipline: we do NOT keep a hand-maintained cross-reference ("which layouts use TO X"). That would be derived state that drifts. Instead we keep **two source-of-truth indexes joined on one key**, and every audit question is a *query* over them, not a stored file.

**Rejected:** a generated `layouts/_xref.json`. It was derived state needing regeneration; both answers below are already one hop from data we keep. Killed before it existed (Michael, 2026-07-16).

---

## The two indexes

### 1. `relationships/_index.json` — the Table Occurrence (TO) graph

**Source of truth for relationships.** FileMaker's real model is anchor-buoy: each layout sits on one **anchor** TO, and the related tables it can reach are **buoys** hanging off that anchor. This index encodes that graph.

Each node = one table occurrence:

- `occurrenceId` — stable join key (the TO name; unique across the app). **This is the spine.**
- `baseTable` — the table this TO is an occurrence of.
- `anchorGroup` — which anchor-buoy island it belongs to.
- `role` — `anchor` (a layout sits on it) or `buoy` (reached via a relationship).
- `edges[]` — relationships to other TOs: `{ toOccurrenceId, fromField, toField, cardinality, allowCreate, allowDelete }`.

A layout NEVER re-describes relationships. It references its anchor `occurrenceId` and the graph answers the rest.

### 2. `layouts/_index.json` — the combined layout roll-up

**Source of truth for "what layouts exist" + the cross-layout view.** Already exists; already lists every layout. Each layout entry carries its `occurrenceId` (the join key into the TO graph). **High-level cross-layout data lives ONLY here, never duplicated into each layout folder.** Each `layout.json` stays lean: its objects + its one `occurrenceId`.

---

## Every audit question is a one-hop query

| Question | How | Over |
|---|---|---|
| Which layouts use TO X? | filter layouts where `occurrenceId == X` | `layouts/_index.json` |
| What related tables does this layout reach? | take the layout's `occurrenceId` → read that node's `edges[]` | `relationships/_index.json` |
| What else sits on this layout's occurrence? | layout → its `occurrenceId` → filter layouts on the same id | both, joined |
| Is this occurrence orphaned (no layout)? | TO node with zero matching layout entries | both, joined |
| Blast radius of changing base table T? | TOs where `baseTable==T` → layouts on those `occurrenceId`s | both, joined |

By eye today. By the shared viewer (`z-fm-layout-object-viewer`) tomorrow — it computes these live from the two JSONs at load, so nothing is ever stale.

---

## Audit tracking

**Git is the audit log.** Every change is a PR + a `meta/changelog.md` line; history is the authoritative trail.

For at-a-glance "new / changed since," each object in `layout.json` may carry a light `provenance` block: `{ status: proposed|bound|locked, added: <date>, lastChanged: <date> }`. The viewer surfaces it without a git diff. This is display metadata, not a second source of truth.

---

## Flexible expansion

Adding is purely additive, no matrix to touch:

- **New layout** → new `layout.json` with an `occurrenceId` + an entry in `layouts/_index.json`. Its relationships are already described by the TO node it points at.
- **New relationship** → add an `edge` (and any buoy node) in `relationships/_index.json`. Every layout on that anchor inherits the new reach for free.
- **New TO** → new node. If a layout sits on it, it's an anchor; else a buoy.

---

## This layout (`GLOBAL_Settings`) as the worked example

- Anchor `occurrenceId`: **`Globals`** (base table `Globals`).
- **Island of one:** the settings screen edits a single set of global-storage fields; it has **no relationships yet** (`edges: []`). It is its own anchor group with no buoys. That's correct for a globals utility layout, not a gap.
- Value-list editing layouts (coming) will sit on their OWN occurrences (e.g. per value-list source table), NOT on `Globals`. Keeping them separate is why the join key matters: the audit will show each value-list layout on its own TO, and `Globals` staying an island.

---

## Rules

1. `occurrenceId` is the single join key between the two indexes. Never rename one without the other (git-visible, one PR).
2. Relationships live ONLY in `relationships/_index.json`. Layouts reference, never redescribe.
3. No hand-maintained cross-reference file. Audits are queries.
4. Cross-layout/high-level data lives only in `layouts/_index.json`. Layout folders stay lean.
5. `schema/relationships.json` remains the machine mirror; `relationships/_index.json` is the human/viewer-facing graph. Keep in sync in the same PR (existing `_index.json` rule).
