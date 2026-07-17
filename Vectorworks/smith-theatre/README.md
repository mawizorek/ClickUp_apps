# Vectorworks Documentation Package — Smith Theatre

> Cloned from [`../_TEMPLATE/`](../_TEMPLATE/) (2026-07-16, D-019). This is the **first real package instance** and the base show file for URITP's Smith Theatre (SPAC). Prose files state the RULE; the exhaustive lists (layers, class tree, sheets, resources) are the per-instance content filled here. **Git is the plan; the `.vwx` is the realization** (S-5).
>
> **Scope:** the standards are org-agnostic (they live in the template); this package captures only what is **Smith-specific** and points up to the template + [`../VWX-BEST-PRACTICES.md`](../VWX-BEST-PRACTICES.md).

---

## What Smith is

A **blackbox** house at the Sarah B. Performing Arts Center: a nominal rectangle, room-center set on the Vectorworks **internal origin (0,0)** (S-3, already built, D-013). Departments live as design layers on a dense **MASTER** file; department/show files **reference** it (S-2). Elevation bands in play: `0 NOTES / 1 DECK / 1.5 MEZZ / 2 TOE / 3 CATWALK`.

---

## The standards this package follows

Canonical detail lives in [`../VWX-BEST-PRACTICES.md`](../VWX-BEST-PRACTICES.md); the one-line version:

| # | Standard | One-line |
|---|----------|----------|
| S-1 | Hybrid layer/class | **Layers** = location + department + elevation. **Classes** = object category for filtering. Elevation never in classes. |
| S-2 | Master-reference model | One dense **master** file; department/show files **reference** it (Design Layer Viewport), staying thin. |
| S-3 | Origin datum | Room-center, coincident with the **internal origin (0,0)** — built. |
| S-4 | Datums & reference planes | Document the **rule**, never the numbers; values live in the file. |
| S-5 | Direction of truth | **Git leads** (plan + hand-drawn notes), VWX realizes, export = reconciliation check. |
| S-6 | File-format split | **Prose → Markdown**, **data manifests → comma-CSV**. No `.txt`. |

---

## What's filled vs. still open

| Area | State |
|---|---|
| `standards/layers.md` + `layers.csv` | **Filled** — the ~26-layer house list (dept × elevation) as a comma-CSV manifest (D-020). Working draft (per-row status), not a ratified Standard. |
| `standards/datums-and-reference-planes.md` | **Filled** — Smith's reference-plane rule (deck-off-trim / upper-off-nominal-wall), RULE only (D-021, S-4). |
| `standards/sheet-layers.md` | **Drafted** — full per-department sheet list from the ClickUp scheme; stays an F-016 **DRAFT** pending Michael's ruling to promote (D-022). |
| `standards/classes.md` | **Proposed** — object-class tree (steel/wood/framing/masking + dash children) as a per-instance PROPOSAL, NOT promoted (D-023). Needs Michael's ruling. |
| `standards/naming.md`, `drafting.md` | Rule prose kept; venue vocabulary noted; drafting tiers still TODO. |
| `resources/*` | Smith categories noted; per-record CSV examples seeded; inventories still TODO. |
| `reference-notes/` | Awaiting the hand-drawn handouts (S-5 primary). |
| `reconciliation/` | Empty until the file is built and worksheets are exported to check the plan. |

---

**Package:** smith-theatre · **Status:** Phase 2 (base-file build) — plan authored, `.vwx` follows · **Venue:** Smith Theatre, SPAC (URITP)

*See [`CHANGELOG.md`](./CHANGELOG.md) for this package's version history and [`../DECISION-LOG.md`](../DECISION-LOG.md) (D-019..D-023) for the decisions behind it.*
