# Relationships

Narrative only. The edge list is data and lives in [`../schema/relationships.json`](../schema/relationships.json) (the single edge surface, per DOCUMENTATION-STANDARD v1.4 / D-006). The viewer + linter read that file directly.

## The shape (hub-and-spoke, People-internal)

```
                 GRADUATION_CLASSES
                        ↑ (fkGraduation_Year)
   STUDENTS_ext ──fkPERSON──┐
   ADULTS_ext  ──fkPERSON──┼──►  PEOPLE  (identity hub, one row per human)
   CONTACT_INFORMATION ─fkPERSON─┘        ▲
         │                                 │ (cross-app, NOT in this file)
     ┌──┴──┐                    Productions / Safety / Courses / Labour
  Emails  PhoneNumbers              each reference PEOPLE.PrimaryKey
```

- **PEOPLE** is the hub. Role extensions (`STUDENTS_ext`, `ADULTS_ext`) and `CONTACT_INFORMATION` hang off it one-to-one via `fkPERSON`. A person may hold BOTH role extensions.
- **Contact tree**: `CONTACT_INFORMATION` parents child `Emails` + `PhoneNumbers` (one-to-many).
- **Class year**: `STUDENTS_ext.fkGraduation_Year` → `GRADUATION_CLASSES`.
- **Spokes reference, never restate.** Productions/Safety/Courses/Labour point at `PEOPLE.PrimaryKey` from their own files; those edges are documented in each spoke's `relationships.json`, not here. That's the whole payoff of hub-and-spoke: People never bloats, spokes carry their own joins.

## Open Items

- Confirm one-to-one cardinalities against the live file.
- Reconcile `Emails.fkCONTACT` vs `PhoneNumbers.fkContact` casing.
