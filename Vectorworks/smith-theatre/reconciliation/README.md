# Reconciliation — Smith Theatre (exports FROM the file: check, don't populate)

> **SECONDARY content (S-5).** This folder holds exports dumped **from** the Smith `.vwx` so you can check *does what I built match what we documented?* The git-side plan LEADS; these exports are a checking aid, **not** the source of the plan.

---

## The guardrail (S-5 / S-6)

- The **git CSV is authored first** (the plan — e.g. [`../standards/layers.csv`](../standards/layers.csv)). The VWX worksheet renders the file's **actual** state; export it here and **diff** against the plan.
- The worksheet **never becomes the source.** Building in VWX then dumping to git inverts S-5. Don't.
- Everything here is **comma-CSV** (S-6), or PDF/A-1b for plate snapshots.

## How to export from Vectorworks

**Structure manifests (CSV) — via a worksheet database row (F-011):**

1. `Tools > Reports > Create Report` (or `Spotlight > Reports`).
2. Set the **Criteria** (all design layers; or all symbols; or all classes).
3. Add **columns** for the fields (a column can emit an object's layer + class directly, plus record fields, count, dimensions).
4. `File > Export > Export Worksheet` -> **CSV, comma-delimited**.
5. Save here as `layers.csv` / `classes.csv` / `symbols.csv` / `record-<NAME>.csv` to match the plan file it checks.

**Drawing set (PDF) — via Publish (F-014):** `File > Publish` -> select sheet layers / saved views -> export **PDF/A-1b** (archival) for a frozen as-built plate set.

**Instrument data (optional):** `File > Export > Export Instrument Data` for a Lightwright-compatible dump.

## What belongs here

- Generated CSV manifests + optional PDF plate sets, named to match the plan they reconcile.
- Nothing hand-authored (that's `standards/` + `resources/`).

---

## Open (policy TBD)

- Whether snapshots are **committed** here as a dated record, or kept **throwaway** (shown in chat, not retained). Format settled (comma-CSV / PDF-A); retention not.

*Canonical: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-011 / F-014 / S-5 / S-6.*
