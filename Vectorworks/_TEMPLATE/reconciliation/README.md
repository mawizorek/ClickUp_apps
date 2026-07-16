# Reconciliation — Exports FROM the File (Check, Don't Populate)

> **SECONDARY content (S-5).** This folder holds exports dumped **from** the Vectorworks file so you can check *does what I built match what we documented?* The git-side plan LEADS; these exports are a checking aid, **not** the source of the plan.

---

## The guardrail (S-5 / S-6)

- The **git CSV is authored first** (the plan). The VWX worksheet renders the file's **actual** state; you export it here and **diff** against the plan.
- The worksheet **never becomes the source.** Building in VWX then dumping to git (letting the file lead) inverts S-5. Don't.
- Everything here is **comma-CSV** (S-6), or PDF/A-1b for plate snapshots.

## How to export from Vectorworks

**Structure manifests (CSV) — via a worksheet database row (F-011):**

1. `Tools > Reports > Create Report` (or `Spotlight > Reports`).
2. Set the **Criteria** (e.g. all design layers; or all symbols; or all classes).
3. Add **columns** for the fields you want (a column can emit an object's **layer** and **class** directly, plus record fields, count, dimensions).
4. `File > Export > Export Worksheet` → **CSV, comma-delimited**.
5. Save here as `layers.csv` / `classes.csv` / `symbols.csv` / `record-<NAME>.csv` to match the plan file it checks.

**Drawing set (PDF) — via Publish (F-014):**

1. `File > Publish`.
2. Select the sheet layers / saved views.
3. Export as **PDF/A-1b** (archival, flattened) for a frozen as-built plate set.

**Instrument data (optional):** `File > Export > Export Instrument Data` for a Lightwright-compatible dump.

## What belongs here

- Generated CSV manifests + optional PDF plate sets, named to match the plan they reconcile against.
- Nothing hand-authored (that's `standards/` + `resources/`).

---

## Open (policy TBD)

- Whether snapshots are **committed** here as a dated record, or kept as **throwaway** diffs shown in chat and not retained. (Format is settled: comma-CSV / PDF-A; retention policy is not.)

*Canonical: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-011 / F-014 / S-5 / S-6.*
