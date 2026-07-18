# PEOPLE

**Role:** identity-hub · **Status:** under-review · **App:** uritp-people

> The identity hub. One canonical record per human. Lean by design: names + display cascade + pronunciation + playbill credit + broad classification + audit. Every spoke app references this by person PK and never restates these fields.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | UUID, auto |
| First Name | text | plain | name | | true first |
| Last Name | text | plain | name | | true last |
| prefferedFirstName | text | plain | name | pending | **TYPO** → preferredFirstName; wins over true name in displays |
| prefferedLastName | text | plain | name | pending | **TYPO** → preferredLastName |
| alternateName | text | plain | name | | additive; playbill only when included |
| useAlternateNameGlobally | boolean | plain | name | | |
| NameDisplayInPlaybills | text | plain | name | | semi-manual; auto-seeded then hand-edited |
| namePronounciation | text | plain | name | pending | **TYPO** → namePronunciation |
| autoFirstLast | calc | plain | name | | "First Last" working name (preferred if set) |
| autoLastFirst | calc | plain | name | | "Last, First" working name |
| customID | text | plain | id | | CRM-### format |
| broadClassification | text | plain | classification | pending | **PROPOSED**: Student / Non-Student, powers chooser start context. As-built inferred class from extension existence; confirm whether to store an explicit flag |
| emailTEMP | text | plain | legacy | pending | migrate into CONTACT_INFORMATION then deprecate |
| summary_CountPeople | summary | plain | meta | | |
| ScratchNotes | text | plain | notes | | freeform |
| hiddenLatestImport | text | plain | meta | | import tracking |
| CreationTimestamp | timestamp | audit | audit | | auto |
| CreatedBy | text | audit | audit | | auto |
| ModificationTimestamp | timestamp | audit | audit | | auto |
| ModifiedBy | text | audit | audit | | auto |

## Relationships

- Parent of `STUDENTS_ext.fkPERSON` (one-to-one, under-review)
- Parent of `ADULTS_ext.fkPERSON` (one-to-one, pending) — a person may hold BOTH student + adult extensions
- Parent of `CONTACT_INFORMATION.fkPERSON` (one-to-one, under-review)
- **Cross-app (hub-and-spoke):** spoke apps (Productions, Safety, Courses, Labour) reference `PEOPLE.PrimaryKey` from their own files. Those edges live in each spoke's `relationships.json`, not here.

## Name Display Priority (cascade)

1. Preferred name wins if populated (drives `autoFirstLast` / `autoLastFirst`).
2. True name is the fallback when preferred is empty.
3. Alternate name is additive: appears in playbill generation only when "include alternate" is set; never replaces preferred/true in general displays.
4. `NameDisplayInPlaybills` is semi-manual: auto-seeded on create, then hand-editable; a refresh recalculates from the cascade.

## Open Items

- **Typos** to fix on the rename pass: `prefferedFirstName`, `prefferedLastName`, `namePronounciation`.
- **`broadClassification`**: store an explicit Student/Non-Student flag on PEOPLE (powers the chooser start context), or keep deriving from extension existence? As-built did the latter.
- **`emailTEMP`** disposition.
- **Naming house style** (`PrimaryKey`→`pk_`?) — cross-app governance, see `meta/design-decisions.md`.
- Confirm all field names/types against the live FMP file.

## Changelog

- 2026-07-18: First-pass migration from the ClickUp `URITP People FMP` doc. As-built fields, typos + drift flagged, not rewritten. Removed role-specific bloat (employees/job-postings/supervisors) from the hub per hub-and-spoke ruling; those graduate to Labour.
