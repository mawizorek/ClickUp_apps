# Fiona — Archive · Inherited URITP landscape + lineage detail

**Rotated out of hot `memory.md` on 2026-07-29**, my first session, because the hot file hit
**12.4KB against a ~10KB cap** the moment real EARNED content arrived. Load on demand.

**Why this content and not the new content:** every line here is INHERITED and unverified, and
none of it changes how I act tomorrow — it is reference detail about modules I have not touched.
The hot file keeps what is live (HML_LLC, the object library, the correlations, the behavioral
guardrails). Per the fleet note of 07-26: *memory holds only what changes how the agent acts
tomorrow.*

⚠️ **Everything below is a LEAD, not a fact.** Especially any record COUNT. Verify against the
live source before quoting — that is the B15 failure mode and I inherited zero verification.

---

## URITP FMP solution landscape (INHERITED 2026-07-26, seeded by Fleet Felix)

Modules planned or in build on the **URITP fmp Solutions** list:

- Production Calendar
- Inventory (+ GOBO)
- Signage
- Budget
- People
- Global Setup
- Safety Programs
- Risk Assessments (+ Builder)
- House Reports
- Paperwork Archive
- Patchbay Doc
- Contact Sheets
- Labour / Hours Worked

Big modules are milestones; individual build steps are tasks underneath them.

### People — the deepest and most instructive module

A **7-table map** around `PEOPLE_setup`, with **STUDENTS / ADULTS / EMPLOYEES as extensions**,
a name-display cascade, and a standing known-issues list.

**FMP People is the canonical people system-of-record; the ClickUp "URITP People" CRM is the
projection.** Inherited record count **~341** — stale until verified.

### Safety Suite — a split worth reusing

**ClickUp = public intake source of truth. FileMaker = private internal reporting truth.**
This is a deliberate two-system split rather than a duplication, and it is a shape to reuse when
a module has both a public-facing intake and a private reporting need.

### Intake pattern

Work arrives as **forwarded emails becoming subtasks** — scanned PDFs, class-year updates.

---

## Full lineage detail (INHERITED — reasoning lives in `decision-log.md` D1–D6)

- **2026-07-15** — declaration folder scaffolded as **FMP Frank**. Native ClickUp agent
  `-39958890` slated for retirement. Status `needs-declaration`.
- **Blocked TEN DAYS** by a stub demanding a verbatim paste of the live native config — a model
  the fleet had already abandoned when Mainstage Milo was built fresh from the Definition
  Playbook. **The lesson (D5): a stub that waits forever on an input nobody will supply is not a
  blocker, it is rot wearing a blocker's clothes.**
- **2026-07-25** — RENAMED **FMP Frank → FMP Fiona** (display only; slug `fmp-frank` is immutable)
  so bare "Frank" could resolve to **Fold-in Frank**, the live anti-sprawl gate. Q6 → A. The
  native-mirror blocker was struck the same day.
- **2026-07-26** — **BUILT** on the git track, trigger scaffolding waived (*"he's no native
  agent"*). Lane pinned by Fleet Build Queue **Q13 → B** plus Michael's governing note. First live
  teammate whose lane includes cross-runtime consulting.
- **Still open, Michael's manual step:** disabling native ClickUp agent `-39958890` in the UI. The
  roster's `retired_native_id` was left in place rather than deleting a fact nobody could verify.
