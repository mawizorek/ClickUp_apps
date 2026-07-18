# PEOPLE

**Role:** identity-hub · **Status:** under-review · **App:** uritp-people

> The identity hub — the one canonical record per human. This is the **target-state** definition (what we build toward), not a dump of the old file. Lean by design: names + display cascade + pronunciation + playbill credit + broad classification + the ClickUp merge handle + audit. Every spoke app references this by person PK and never restates these fields.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | UUID, auto |
| First Name | text | plain | name | | true legal first |
| Last Name | text | plain | name | | true legal last |
| preferredFirstName | text | plain | name | | working name; wins over true name in displays. (Rename from as-built `prefferedFirstName` typo.) |
| preferredLastName | text | plain | name | | (Rename from as-built `prefferedLastName` typo.) |
| alternateName | text | plain | name | | **KEEP** — real case: foreign-exchange students who go by a different name than their legal/preferred. Additive, feeds playbill generation. |
| useAlternateNameGlobally | boolean | plain | name | | toggles whether `alternateName` overrides in general displays vs. playbill-only |
| NameDisplayInPlaybills | text | plain | name | | **KEEP** — hard-coded, never-scripted manual source of truth for exactly what prints in a playbill. Often NOT any combination of real/preferred/alternate, so it must be its own editable field. |
| namePronunciation | text | plain | name | | (Rename from as-built `namePronounciation` typo.) |
| autoFirstLast | calc | plain | name | | "First Last" working name (preferred if set, else true) |
| autoLastFirst | calc | plain | name | | "Last, First" working name |
| customID | text | plain | id | | **KEEP** — CRM-### human-readable handle; the merge key to ClickUp (alongside email). Distinct from the UUID PK, which is machine-only. |
| broadClassification | text | plain | classification | pending | Student / Non-Student. Powers the chooser start context. Confirm: explicit stored flag vs. derived from extension existence. |
| summary_CountPeople | summary | plain | meta | | |
| ScratchNotes | text | plain | notes | | freeform |
| CreationTimestamp | timestamp | audit | audit | | auto |
| CreatedBy | text | audit | audit | | auto |
| ModificationTimestamp | timestamp | audit | audit | | auto |
| ModifiedBy | text | audit | audit | | auto |

**19 fields.** Two as-built fields were deliberately CUT this pass (see Changelog + `meta/design-decisions.md` ledger): `emailTEMP` (legacy import staging) and `hiddenLatestImport` (import-batch cruft that doesn't belong on the canonical identity record).

## The name model (why FOUR name inputs, none redundant)

This is intentional, not over-built. Each input solves a distinct real case:

1. **True name** (`First Name` / `Last Name`) — legal identity, the fallback.
2. **Preferred name** (`preferredFirstName` / `preferredLastName`) — the everyday working name; overrides true in all general displays (drives the auto calcs).
3. **Alternate name** (`alternateName` + `useAlternateNameGlobally`) — exists for the foreign-exchange-student case where the person goes by something distinct from both legal and preferred. Additive; the toggle controls whether it overrides globally or only feeds playbill generation.
4. **Playbill credit** (`NameDisplayInPlaybills`) — the manual, hard-coded, never-scripted string that prints in a program. Frequently NOT any combination of the above three, so it is its own editable source of truth. A refresh can seed it from the cascade, but it is never forced to recompute.

**Display priority for general (non-playbill) use:** preferred → (alternate, if `useAlternateNameGlobally`) → true. Playbill is independent.

## Relationships

- Parent of `STUDENTS_ext.fkPERSON` (one-to-one, under-review)
- Parent of `ADULTS_ext.fkPERSON` (one-to-one, pending) — a person may hold BOTH student + adult extensions
- Parent of `CONTACT_INFORMATION.fkPERSON` (one-to-one, under-review)
- **Cross-app (hub-and-spoke):** spoke apps (Productions, Safety, Courses, Labour) reference `PEOPLE.PrimaryKey` from their own files. Those edges live in each spoke's `relationships.json`, not here.

## Open Items

- **`broadClassification`**: store an explicit Student/Non-Student flag on PEOPLE (powers the chooser start context), or derive from extension existence? Confirm target.
- **Naming house style** (`PrimaryKey`→`pk_`?) — cross-app governance, see `meta/design-decisions.md` ledger A1/A2.
- Confirm all field names/types against the live FMP file (reconciliation pass).

## Changelog

- 2026-07-18 (target-state pass): Reframed from as-built to build-toward. **Cut** `emailTEMP` + `hiddenLatestImport` from the hub. Applied the three typo renames inline (`preferred*`, `namePronunciation`). Documented the four-input name model with the real case behind each (Michael: alternate = foreign-exchange; playbill = manual print source of truth; customID = ClickUp merge handle). All three defended fields KEPT.
- 2026-07-18: First-pass migration from the ClickUp `URITP People FMP` doc.
