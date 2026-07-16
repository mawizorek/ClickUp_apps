# Vectorworks Base Show File — Phase Plan

> **What this file is:** the **phase plan** and "where are we right now" tracker for the Vectorworks base-show-file project. It defines the phases from brainstorming through closing & archiving a show, and marks the current phase.
>
> **Companion:** [`DECISION-LOG.md`](./DECISION-LOG.md) is the **activity log** — the running record of decisions, dates, and reasoning. This README is the **map** (the phases and our position on them); the decision log is the **journal** (what we decided and when). Update both as we go.
>
> **Status: BRAINSTORMING.** Phases below are being dictated/refined this session. Treat as a living scaffold until ratified.

---

## Current position

**▶ Active phase: Phase 0 — Brainstorming & Planning.**
Within it, the open work is defining *what goes in the packages* (contents/schema) and locking the phase plan itself.

---

## Lifecycle phases

The full arc, brainstorming → closing & archiving. (Proposed spine — Michael is dictating the definitive list; edit freely.)

### Phase 0 — Brainstorming & Planning  ▶ *active*
Define what the file is, what it accomplishes, and what we build. Set structure and intent in broad strokes before building schema.
- [ ] Reframe the deliverable as a versioned package (done — see D-001)
- [ ] Repo home + `Vectorworks/` structure (done — see D-003/D-004)
- [ ] **Define what goes in the packages** (contents / documentation manifest) — *in progress*
- [ ] Ratify this phase plan
- [ ] Decide the package folder/file schema (broad strokes; build later)

### Phase 1 — Template Build
Stand up the reusable package skeleton every show file clones from. Universal standards live here (classes, layers, sheet layers, title block, drafting conventions), pointing up to MAW's general Vectorworks standards.

### Phase 2 — Base Show File Build (Smith Theatre)
Build the first real instance: dimensionally-accurate architecture shell, standards applied, rigging & hang positions, inventory/resources. This is the current VWX work, given a defined endpoint.

### Phase 3 — Package & Publish
Assemble the discrete downloadable bundle (`.vwx` + READMEs + markdown + CSVs), version it in git, confirm it's shippable and browsable.

### Phase 4 — Per-Show Instantiation
Clone the template/base into a specific production's file. Swap in show specifics; productions become sub-references, not top-level clutter.

### Phase 5 — Production Use
Designers (scenic / lighting / sound / video) work on top of the trusted shell during the show's build and tech.

### Phase 6 — Closing & Archiving
Strike-side wrap: finalize as-built, capture revisions back into standards where relevant, version + archive the show package. Define what "archived" means (frozen bundle, tagged release, etc.).

---

## How we track progress

- Mark the **active phase** with ▶ and move it as we advance.
- Check off items within a phase as they land.
- Every real decision gets a dated row in [`DECISION-LOG.md`](./DECISION-LOG.md); this README just reflects the resulting position.

*Last updated: 2026-07-16.*
