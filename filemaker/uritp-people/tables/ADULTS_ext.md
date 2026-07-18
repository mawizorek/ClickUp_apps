# ADULTS_ext

**Role:** role-extension · **Status:** pending · **App:** uritp-people

> Non-student role extension off PEOPLE (one-to-one via `fkPERSON`). Faculty, staff, adjuncts, guest artists, vendors, volunteers. Carries only the broad adult **classification** — the KIND of non-student. **Position/title/department are NOT here** (DG-005): those are operational assignment data owned by the **Labour** spoke. A contact sheet or any app needing this person's title joins THROUGH Labour at report time.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| fkPERSON | text-uuid | fk | key | | → PEOPLE.PrimaryKey |
| AdultType | text | plain | classification | | value list: Faculty, Staff, Adjunct, Guest Artist, Vendor, Volunteer. Broad kind-of-non-student, NOT a job title (titles live in Labour). |
| AdultStatus | text | plain | classification | | value list: Active, Inactive |
| NotesAdult | text | plain | notes | | |
| StartDate | date | plain | lifecycle | | when relationship began (optional) |
| EndDate | date | plain | lifecycle | | when it ended (optional) |
| CreationTimestamp | timestamp | audit | audit | | auto |
| CreatedBy | text | audit | audit | | auto |

**9 fields.** `fkStaffPosition` was removed (DG-005): positions + titles are Labour-owned assignment data, not an identity-hub field.

## Relationships

- `ADULTS_ext.fkPERSON` → `PEOPLE.PrimaryKey` (one-to-one, pending) — a person may hold BOTH student + adult extensions
- **No position link.** Labour references `PEOPLE.PrimaryKey` (and Global Setup `Departments`) from its own file to record who holds which position; People does not point back.

## Why positions are NOT here (DG-005)

A position/title is only meaningful as an **assignment** (this person holds this role, for pay/hours/a shop slot), and an assignment of any kind is operational, not identity. Storing a `fkStaffPosition` on the identity hub would pull employment data into the hub and scatter the positions domain across files. Labour owns positions + assignments end to end; People stays pure identity. (Reverses the earlier W1/DP-006 call that put positions in Global Setup.)

## Open Items

- `AdultType` + `AdultStatus` resolve to value lists (see `value-lists/`, pending).
- Confirm one-to-one cardinality against the live file.

## Changelog

- 2026-07-18 (DG-005): Dropped `fkStaffPosition`; positions/titles move to Labour. Field count 10→9. Supersedes the W1 "Global-Setup-owned positions" note.
- 2026-07-18 (W1): Staff-Positions layer ruled Global-Setup-owned (now superseded by DG-005).
- 2026-07-18 (target-state): Dept/Title graduated off free-text.
- 2026-07-18: First-pass migration from the ClickUp `URITP People FMP` doc "Fields to add for Layout C" spec.
