# STUDENTS_ext

**Role:** role-extension · **Status:** under-review · **App:** uritp-people

> Student role extension off PEOPLE (one-to-one via `fkPERSON`). Carries student-specific IDENTITY facts — student ID + class year — per the ruling that editable identity facts live in People. **Enrollment history does NOT live here**; that's a Courses-spoke link (person ↔ course ↔ term).

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| fkPERSON | text-uuid | fk | key | | → PEOPLE.PrimaryKey |
| fkGraduation_Year | text-uuid | fk | key | | → GRADUATION_CLASSES.PrimaryKey (class year) |
| studentID | text | plain | academic | pending | **PROPOSED** per ruling: student ID is an editable identity fact → lives People-side, not Courses |
| NotesStudent | text | plain | notes | | student-specific notes |
| CreationTimestamp | timestamp | audit | audit | | auto |

## Relationships

- `STUDENTS_ext.fkPERSON` → `PEOPLE.PrimaryKey` (one-to-one, under-review)
- `STUDENTS_ext.fkGraduation_Year` → `GRADUATION_CLASSES.PrimaryKey` (many-to-one, under-review)

## Open Items

- Confirm `studentID` belongs here vs a Courses-side academic record. Ruling leans HERE (identity fact you edit on the person).
- Class year = a reference to GRADUATION_CLASSES (stored fact), enrollment = a Courses link. Keep the line clean.
- Confirm one-to-one cardinality in the live file.

## Changelog

- 2026-07-18: First-pass migration. Added proposed `studentID` per the identity-vs-link ruling; enrollment explicitly excluded (Courses spoke).
