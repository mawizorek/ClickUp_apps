# Changelog — Smith Theatre

> This package's version history (the plan's evolution). Distinct from [`../DECISION-LOG.md`](../DECISION-LOG.md) (cross-package decisions D-0xx). Newest at top.

---

## Format

```
## vN — YYYY-MM-DD
- what changed in the plan / standards / manifests
```

---

## v1 — 2026-07-16

- **Cloned from `_TEMPLATE/`** (D-018); `_TEMPLATE/` left pristine.
- **standards/layers.md + layers.csv:** filled the actual **27-layer** Smith list (DEPARTMENT × elevation band), sourced from the Google Sheet "URITP VWX Smith Theatre BASE FILE Worksheets" (D-019). Git CSV authored first as the plan (S-5).
- **standards/datums-and-reference-planes.md:** filled the Smith reference-plane RULE — deck off interior trim face; mezz/catwalk off nominal wall structure. Origin documented per D-013 (not re-derived). No dimension values (S-4) (D-020).
- **standards/naming.md:** confirmed the Smith department vocabulary (UR / SCENIC / LX DESIGNER / HEAD ELECTRICIAN / AUDIO / RIGGING / VIDEO / UTILITY / PM).
- **standards/classes.md + classes.csv:** authored a **PROPOSED** object-class tree (steel / wood / framing / masking + dash-nested children). Marked DRAFT — awaits Michael's ruling before promotion to a Standard (candidate #1).
- **standards/sheet-layers.md:** drafted the per-department sheet list from the existing ClickUp scheme (UR0–6, S1–7, L/A/R/V). Flagged that the layer-department set is richer than the UR/S/L/A/R/V prefix draft (LX split; UTILITY/PM working layers). DRAFT — F-016 promotion pending Michael.
- **resources/:** filled `records.md` with the Smith record types; added `record-lighting-device.csv` + `record-rigging-point.csv` schema examples. `symbols.md`, `title-blocks.md`, `hatches.md`, `saved-views.md` carry Smith notes where known, TODOs where deferred to the build.
- **reference-notes/** + **reconciliation/**: cloned as-is (venue-agnostic export/handout guidance); handouts + generated manifests land at build time.
