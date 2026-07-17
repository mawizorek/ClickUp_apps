# Vectorworks Base Show File — Phase Plan

> **What this file is:** the **phase plan** and "where are we right now" tracker for the Vectorworks base-show-file project. It defines the phases from brainstorming through closing & archiving a show, and marks the current phase.
>
> **Companions:** [`DECISION-LOG.md`](./DECISION-LOG.md) = the **journal** (decisions D-001..D-023, newest at top) · [`VWX-BEST-PRACTICES.md`](./VWX-BEST-PRACTICES.md) = research + **Standards S-1..S-6** · [`BUILD-PLAN.md`](./BUILD-PLAN.md) = the one-page build-from artifact · [`_TEMPLATE/`](./_TEMPLATE/) = the **gold-standard package skeleton** to clone · [`smith-theatre/`](./smith-theatre/) = the **first real instance**. This README is the **map**.
>
> **Status: PHASE 2 — BASE SHOW FILE BUILD (Smith Theatre).** Phase 0 planning + Phase 1 template build complete. `_TEMPLATE/` cloned → `smith-theatre/` and per-instance placeholders filled (2026-07-16, D-019..D-023): house layer list, Smith reference-plane rule, sheet-list draft, proposed class tree. Next: Michael rules the open candidates, then build the `.vwx` from the plan.

---

## Current position

**▶ Active phase: Phase 2 — Base Show File Build (Smith Theatre).**
The reusable skeleton [`_TEMPLATE/`](./_TEMPLATE/) is complete, and the first instance [`smith-theatre/`](./smith-theatre/) is authored: layers (`layers.md` + `layers.csv`), datums/reference-planes rule, sheet-layer draft, and a proposed class tree. Remaining before/at the `.vwx` build: Michael's rulings on the open candidates (class tree, sheet-numbering promotion, layer-list lock), then draft the file from the plan.

---

## Lifecycle phases

The full arc, brainstorming → closing & archiving. **Ratified 2026-07-16.**

### Phase 0 — Brainstorming & Planning ✅ *complete*
Define what the file is, what it accomplishes, and what we build. Set structure and intent in broad strokes before building schema.
- [x] Reframe the deliverable as a versioned package (D-001)
- [x] Repo home + `Vectorworks/` structure (D-003 / D-004)
- [x] Ratify this phase plan (D-007)
- [x] **Vectorworks best-practices deep dive + deep research** (D-010) — Findings F-001..F-016 logged
- [x] **Direction of truth: Git = plan, VWX = realization, export = reconciliation** (D-015 / S-5)
- [x] **Design how reports/worksheets export from Vectorworks → git** (D-009) — mechanism documented (F-011/F-014), reframed as a reconciliation check
- [x] **Define what goes in the packages** — four buckets + resource-capture list (D-017)
- [x] **File formats** — Markdown prose / comma-CSV manifests (D-016 / S-6)
- [x] **Package folder/file schema** — settled in BUILD-PLAN + realized in `_TEMPLATE/`

### Phase 1 — Template Build ✅ *complete*
Stand up the reusable package skeleton every show file clones from. Universal standards live here (classes, layers, sheet layers, title block, drafting conventions), pointing up to MAW's general Vectorworks standards.
- [x] **`_TEMPLATE/` documentation tree stood up** (2026-07-16) — standards/, resources/ (segmented, per-record CSV pattern), reference-notes/, reconciliation/, CHANGELOG. Every file states the RULE; venue content marked `TODO (per-instance)`.
- [x] **Cloned `_TEMPLATE/` → `smith-theatre/`** (2026-07-16, D-019) and filled per-instance placeholders (D-020..D-023).
- Note: prefer **generating** the layer/class/resource manifests *from* the VWX file (worksheet/report export) over hand-transcription, so the docs stay in sync with the file. The VWX worksheet mirrors the git CSV as a *check*, never the source (S-5).

### Phase 2 — Base Show File Build (Smith Theatre) ▶ *active*
Build the first real instance: dimensionally-accurate architecture shell, standards applied, rigging & hang positions, inventory/resources. This is the current VWX work, given a defined endpoint. The plan is authored in [`smith-theatre/`](./smith-theatre/) (D-019..D-023); the `.vwx` is built from it.
- [x] **Plan authored** — house layer list (D-020), Smith reference-plane rule (D-021), sheet-list draft (D-022), proposed class tree (D-023).
- [ ] **Michael's rulings** on the open candidates (class tree, sheet-numbering promotion, layer-list lock) — see DECISION-LOG § 8 + § 10.
- [ ] **Build the `.vwx`** from the authored plan.
- **Rebuild risk (accepted, D-008):** file is built in VWX Educational and must eventually be re-created in a licensed version. Mitigation: **DWG export** directly from the file. As long as resources are embedded and laid out, re-importing a DWG should de-skin but bring the content back in. Keep resources embedded + cleanly laid out throughout so this path stays viable.

### Phase 3 — Package & Publish
Assemble the discrete downloadable bundle and version its **documentation** in git.
- **The `.vwx` files do NOT live in git (D-009).** Git holds the documentation trail only (READMEs, markdown, exported CSVs/reports). The Vectorworks file itself lives elsewhere; the bundle references it.

### Phase 4 — Per-Show Instantiation
Clone the template/base into a specific production's file. Swap in show specifics; productions become sub-references, not top-level clutter.

### Phase 5 — Production Use
Designers (scenic / lighting / sound / video) work on top of the trusted shell during the show's build and tech. *(Lifecycle context; ownership boundary is an open question — see decision log.)*

### Phase 6 — Closing & Archiving
Strike-side wrap: finalize as-built, capture revisions back into standards where relevant, version + archive the show package. Define what "archived" means (frozen bundle, tagged release, etc.).

---

## How we track progress

- Mark the **active phase** with ▶ and move it as we advance.
- Check off items within a phase as they land.
- Every real decision gets a dated row in [`DECISION-LOG.md`](./DECISION-LOG.md); this README just reflects the resulting position.

*Last updated: 2026-07-16.*
