# Vectorworks Base Show File — Phase Plan

> **What this file is:** the **phase plan** and "where are we right now" tracker for the Vectorworks base-show-file project. It defines the phases from brainstorming through closing & archiving a show, and marks the current phase.
>
> **Companions:** [`DECISION-LOG.md`](./DECISION-LOG.md) = the **journal** (decisions D-001..D-017, dated) · [`VWX-BEST-PRACTICES.md`](./VWX-BEST-PRACTICES.md) = research + **Standards S-1..S-6** · [`BUILD-PLAN.md`](./BUILD-PLAN.md) = the one-page build-from artifact · [`_TEMPLATE/`](./_TEMPLATE/) = the **gold-standard package skeleton** to clone. This README is the **map**.
>
> **Status: PHASE 1 — TEMPLATE BUILD.** Phase 0 planning complete (Standards S-1..S-6 adopted, D-001..D-017). The `_TEMPLATE/` documentation tree is stood up (2026-07-16). Next: clone `_TEMPLATE/` → `smith-theatre/` and begin the Smith notes/plan.

---

## Current position

**▶ Active phase: Phase 1 — Template Build.**
The reusable package skeleton [`_TEMPLATE/`](./_TEMPLATE/) exists with all prose standards + resource docs written as RULES (not venue lists). Remaining Phase-1/handoff work: the next agent clones it for Smith and fills the per-instance placeholders (layer list, class tree, symbol inventory, sheet list).

---

## Lifecycle phases

The full arc, brainstorming → closing & archiving. **Ratified 2026-07-16.**

### Phase 0 — Brainstorming & Planning  ✅ *complete*
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

### Phase 1 — Template Build  ▶ *active*
Stand up the reusable package skeleton every show file clones from. Universal standards live here (classes, layers, sheet layers, title block, drafting conventions), pointing up to MAW's general Vectorworks standards.
- [x] **`_TEMPLATE/` documentation tree stood up** (2026-07-16) — standards/, resources/ (segmented, per-record CSV pattern), reference-notes/, reconciliation/, CHANGELOG. Every file states the RULE; venue content marked `TODO (per-instance)`.
- [ ] Exhaustive lists (object-class tree, house layer list) — filled per-instance, deferred to the Smith build.
- Note: prefer **generating** the layer/class/resource manifests *from* the VWX file (worksheet/report export) over hand-transcription, so the docs stay in sync with the file. The VWX worksheet mirrors the git CSV as a *check*, never the source (S-5).

### Phase 2 — Base Show File Build (Smith Theatre)
Build the first real instance: dimensionally-accurate architecture shell, standards applied, rigging & hang positions, inventory/resources. This is the current VWX work, given a defined endpoint.
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
