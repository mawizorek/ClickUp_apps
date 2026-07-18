# CONTACT_INFORMATION

**Role:** contact · **Status:** under-review · **App:** uritp-people

> One record per person. Holds the primary phone + email, and is the parent of the child `Emails` / `PhoneNumbers` tables for people with multiple. **Q4 ruling: keep the full tree** (not collapsed to a single primary on the person). Lean People = lean on *domain* fields, not on reachability.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| fkPERSON | text-uuid | fk | key | | → PEOPLE.PrimaryKey |
| primaryPhone | text | plain | contact | | |
| primaryEmail | text | plain | contact | | lowercase |
| CreationTimestamp | timestamp | audit | audit | | auto |
| CreatedBy | text | audit | audit | | auto |
| ModificationTimestamp | timestamp | audit | audit | | auto |
| ModifiedBy | text | audit | audit | | auto |

## Relationships

- `CONTACT_INFORMATION.fkPERSON` → `PEOPLE.PrimaryKey` (one-to-one, under-review)
- Parent of `Emails.fkCONTACT` (one-to-many, under-review)
- Parent of `PhoneNumbers.fkContact` (one-to-many, under-review)

## Open Items

- **Cascade delete** of child Emails/Phones when a person is deleted is currently ON, flagged temporary in the as-built file. Keep or reverse?
- `emailTEMP` on PEOPLE should migrate in here, then be deprecated.
- FK casing: `Emails.fkCONTACT` vs `PhoneNumbers.fkContact` differ as-built; reconcile to one casing on the rename pass.

## Changelog

- 2026-07-18: First-pass migration. Kept the full contact tree per Q4 ruling.
