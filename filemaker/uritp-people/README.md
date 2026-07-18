# URITP People — Identity Hub (FileMaker App)

**Status:** Target-state schema in progress · **Runs in:** FileMaker Pro · **Source of truth:** this repo folder (see [INDEX.md](./INDEX.md))

The **identity hub** of the URITP FileMaker app package. Single canonical record per human (student, faculty, staff, guest artist, vendor) plus how to reach them. Every other URITP app (Productions/Contact Sheets, Safety Programs, Courses, Labour) references People for identity and **never restates a person's fields**. Think "the contacts app on your phone": names, how to reach them, a broad Student/Non-Student classification. Nothing production-, safety-, course-, or labour-specific lives here.

> 🎯 **This is the build-TOWARD source of truth**, not a mirror of the old file. The schema was researched from the ClickUp `URITP People FMP` doc, then edited: every field earns its place or gets cut, drift is corrected (not preserved), and decisions are recorded in `meta/design-decisions.md`. Build the native FileMaker file to match THIS.

---

## Next Steps

- Confirm live-file field names against the actual FMP file (reconciliation pass — the file is the tiebreaker on names/types only, not on what SHOULD exist).
- Design the **Staff-Positions layer** that Department/Title reference (see Resolved Decisions); decide whether it's a dedicated positions table or lives in the Labour spoke.
- Migrate the three typo renames + drop the two cut fields when the native file is edited.
- Enumerate real scripts (import, batch-create, chooser) into `scripts/`.
- Migrate URITP Global Setup docs next session (separate app/file — the OTHER shared spine).
- Stand up the Productions / Company builder as its own app (owns person↔role↔show; contact sheet = one export view).

## Resolved Decisions (Michael, 2026-07-18)

- **Adult dept/title → Staff-Positions layer.** Department + Title do NOT live as resident fields on `ADULTS_ext`; they reference a Staff-Positions layer. (Remaining sub-question: dedicated positions table vs. the Labour spoke — the as-built file had `_setup_Staff Positions` / `URJobProfileLevels` / `Supervisors`.)
- **Naming house style: keep bare `PrimaryKey` / `fkPERSON`.** This app does NOT adopt the URITP `pk_`/`fk_` prefixes (matches HML's bare style). Ledger A1/A2 resolved.
- **`emailTEMP`: cut.** Confirmed — it's a legacy import-staging field; drop it (migrate any live value into CONTACT_INFORMATION first).
- **`hiddenLatestImport`: cut.** Import-batch cruft, not identity.

## Open Questions

- **CONTACT INFORMATION cascade delete** — *(what it means:)* in the as-built file, deleting a PEOPLE record auto-deletes that person's child Email + Phone records, and the file flagged this as temporary. **Decision needed:** keep the auto-delete (clean, but destroys contact history on any accidental person delete) or reverse it (child records orphan/soft-delete instead)?
- **`broadClassification`**: store an explicit Student/Non-Student flag on PEOPLE, or derive it from which extension a person has? (Powers the chooser start context.)

## Purpose

Background utility / identity backbone. Owns canonical human records + reusable person-selection tooling (the chooser card window). App-specific roles, enrollments, and compliance states live in the spoke apps, not here.

## Goals

- One canonical PEOPLE record per person regardless of how many roles they hold.
- Deliberate four-input name model (true / preferred / alternate / playbill), each solving a real case — see `meta/design-decisions.md` DP-004.
- Fast person lookup + controlled person creation from external files without duplicating identity logic (chooser returns only a person PK).
- Broad chooser-oriented classification (Student / Non-Student) — NOT app-owned or term-specific roles.
- Stay lean: it is the hub; every spoke references it.

## Imports

- Student roster CSVs (registrar / department records).
- Scanned class-year updates (admin PDFs).
- Manual additions (guest artists, vendors, new hires).

## Reports / Exports

- Canonical person directory (students / non-students / staff).
- Playbill credit names (`NameDisplayInPlaybills`).
- ClickUp merge feeds keyed on `customID` (CRM-###) + `primaryEmail`.
- Broad person-chooser lists + reusable selection contexts for external files.
- (Contact sheets themselves are a Productions-app export, NOT a People export — they compose a join off this hub.)

## Build Status

Reference source: as-built file had 7 core People tables (~341 People, ~306 Students). Contact Sheets is a SEPARATE file whose production-role joins graduate to the Productions builder (hub-and-spoke ruling — they do NOT merge into People). Layouts A (ALL PEOPLE) + B (STUDENTS) built in-file; C (ADULTS) designed. This repo pass = target-state schema + relationships documented; layouts stubbed.

## Workflow

Utility file — you don't "work in" it daily. It's the identity layer + the reusable person-selection service. External files open a People-owned chooser card, pass a broad context (Students / Non-Students), filter, and return a person PK.

## Architecture Notes

Hub-and-spoke. People = the identity hub (lean). Spokes (Productions, Safety, Courses, Labour) each own their join tables and reference People by person PK. **Rule:** editable identity facts (name, pronoun, email, class year, student ID) live in People; a relationship to a thing with its own lifecycle (a course offering, a show, a training) lives in the spoke. See `meta/design-decisions.md`.

## Artifacts

| Date | Artifact | Link | Description |
|---|---|---|---|
| 2026-06-11 | DB graph screenshots | ClickUp People DOCUMENTATION subpage | People file + Contact Sheets file table graphs (research source for the target-state pass) |

---

**Related:** ClickUp source doc `URITP People FMP`; shared FMP build decisions in the [FMP Apps — Shared Build & Behaviour Decision Log](https://app.clickup.com/36074068) (ClickUp) and durable rulings in [../DECISIONS.md](../DECISIONS.md).