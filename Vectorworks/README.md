# Vectorworks Base Show File — Phase Plan

> **What this file is:** the **phase plan** and "where are we right now" tracker for the Vectorworks base-show-file project. It defines the phases from brainstorming through closing & archiving a show, and marks the current phase.
>
> **Companion:** [`DECISION-LOG.md`](./DECISION-LOG.md) is the **activity log** — the running record of decisions, dates, and reasoning. This README is the **map** (the phases and our position on them); the decision log is the **journal** (what we decided and when). Update both as we go.
>
> **Status: BRAINSTORMING.** Phase spine **ratified 2026-07-16** (D-007). Still in Phase 0; sub-items being worked.

---

## Current position

**▶ Active phase: Phase 0 — Brainstorming & Planning.**
Open work: (a) deep-dive into Vectorworks best practices + how to set up reports/worksheets for export, (b) define what goes in the packages, (c) lock the package schema.

---

## Lifecycle phases

The full arc, brainstorming → closing & archiving. **Ratified 2026-07-16.**

### Phase 0 — Brainstorming & Planning  ▶ *active*
Define what the file is, what it accomplishes, and what we build. Set structure and intent in broad strokes before building schema.
- [x] Reframe the deliverable as a versioned package (D-001)
- [x] Repo home + `Vectorworks/` structure (D-003 / D-004)
- [x] Ratify this phase plan (D-007)
- [ ] **Vectorworks best-practices deep dive + deep research** — do this *before* designing our workflow, so we build on established practice, not habit (D-010)
- [ ] **Design how reports/worksheets export from Vectorworks → git** — the mechanism that produces the documentation trail (layers/classes/resources manifests) (D-009)
- [ ] **Define what goes in the packages** (contents / documentation manifest) — *in progress*
- [ ] Decide the package folder/file schema (broad strokes; build later)

### Phase 1 — Template Build
Stand up the reusable package skeleton every show file clones from. Universal standards live here (classes, layers, sheet layers, title block, drafting conventions), pointing up to MAW's general Vectorworks standards.
- Note: prefer **generating** the layer/class/resource manifests *from* the VWX file (worksheet/report export) over hand-transcription, so the docs stay in sync with the file.

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
