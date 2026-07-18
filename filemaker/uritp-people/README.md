# URITP People — Identity Hub (FileMaker App)

**Status:** Built (split), migrating to repo-native docs · **Runs in:** FileMaker Pro · **Source of truth:** this repo folder (see [INDEX.md](./INDEX.md))

The **identity hub** of the URITP FileMaker app package. Single canonical record per human (student, faculty, staff, guest artist, vendor) plus how to reach them. Every other URITP app (Productions/Contact Sheets, Safety Programs, Courses, Labour) references People for identity and **never restates a person's fields**. Think "the contacts app on your phone": names, how to reach them, a broad Student/Non-Student classification. Nothing production-, safety-, course-, or labour-specific lives here.

> ⚠️ First-pass migration from the ClickUp doc `URITP People FMP`. Documents the schema **as-built**, flags naming drift + open items, and does NOT silently rewrite to convention. Easy to overwrite/revert — this is a review surface, not a lock.

---

## Next Steps

- Review this first pass; confirm the lean-hub table set below matches intent.
- Confirm live-file field names against the actual FMP file (this pass is from the ClickUp doc, not the file).
- Resolve the naming-drift audit (see `meta/design-decisions.md`): `PrimaryKey`→`pk_`, `fkPERSON`→`fk_Person`, typo fixes, `emailTEMP` disposition.
- Enumerate real scripts (import, batch-create, chooser) into `scripts/`.
- Migrate URITP Global Setup docs next session (separate app/file — the OTHER shared spine).
- Stand up the Productions / Company builder as its own app (owns person↔role↔show; contact sheet = one export view).

## Open Questions

- **Adult dept/title**: does department + job title live on the Adults extension, or graduate to a Staff-Positions layer? (The one genuinely fuzzy field — parked, non-blocking.)
<graduate to a Staff-Positions layer>
  
- **Naming house style**: adopt URITP `pk_`/`fk_` for this file, or keep the as-built bare `PrimaryKey`/`fkPERSON`? (Cross-app governance item; HML uses bare, URITP standard says prefixed.)
<`PrimaryKey`/`fkPERSON`>
- 
- **CONTACT INFORMATION cascade delete** of child Emails/Phones is currently ON, flagged temporary in the as-built file. Keep or reverse?
<i don't know what this means>
- 
- **`emailTEMP`**: migrate into CONTACT INFORMATION then deprecate, or drop?
<where did you find this? what's it hold? sounds like something to delete or is part of an import workflow - thus needs renaming.>
- 

## Purpose

Background utility / identity backbone. Owns canonical human records + reusable person-selection tooling (the chooser card window). App-specific roles, enrollments, and compliance states live in the spoke apps, not here.

## Goals

- One canonical PEOPLE record per person regardless of how many roles they hold.
- Flexible name handling (preferred, true, alternate, playbill credit) with a clear priority cascade.
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
- Broad person-chooser lists + reusable selection contexts for external files.
- (Contact sheets themselves are a Productions-app export, NOT a People export — they compose a join off this hub.)

## Build Status

As-built: 7 core People tables (~341 People, ~306 Students). Contact Sheets currently a SEPARATE file (its production-role joins graduate to the Productions builder, per the hub-and-spoke ruling — they do NOT merge into People). Layouts A (ALL PEOPLE) + B (STUDENTS) built; C (ADULTS) designed. Scripts basic. This repo pass = schema + relationships documented; layouts stubbed.

## Workflow

Utility file — you don't "work in" it daily. It's the identity layer + the reusable person-selection service. External files open a People-owned chooser card, pass a broad context (Students / Non-Students), filter, and return a person PK.

## Architecture Notes

Hub-and-spoke. People = the identity hub (lean). Spokes (Productions, Safety, Courses, Labour) each own their join tables and reference People by person PK. **Rule:** editable identity facts (name, pronoun, email, class year, student ID) live in People; a relationship to a thing with its own lifecycle (a course offering, a show, a training) lives in the spoke. See `meta/design-decisions.md`.

## Artifacts

| Date | Artifact | Link | Description |
|---|---|---|---|
| 2026-06-11 | DB graph screenshots | ClickUp People DOCUMENTATION subpage | People file + Contact Sheets file table graphs (as-built source for this pass) |

---

**Related:** ClickUp source doc `URITP People FMP`; shared FMP build decisions in the [FMP Apps — Shared Build & Behaviour Decision Log](https://app.clickup.com/36074068) (ClickUp) and durable rulings in [../DECISIONS.md](../DECISIONS.md).
