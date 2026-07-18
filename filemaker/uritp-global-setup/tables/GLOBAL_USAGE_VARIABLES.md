# GLOBAL_USAGE_VARIABLES

**Role:** singleton-config · **Status:** under-review · **App:** uritp-global-setup

> Single-row org config. Branding (logo, names, acronym) + the three fiscal-year pointers every app reads. This is what other files pull instead of hardcoding org identity locally.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| Header_Logo | container | plain | branding | | URITP logo used across all files |
| FULL_COMPANY_NAME | text | plain | branding | | "University of Rochester International Theatre Program" |
| SHORT_COMPANY_NAME | text | plain | branding | | |
| COMPANY_ACRONYM | text | plain | branding | | "URITP" |
| fkCURRENT_FISCAL_YEAR | text-uuid | fk | fiscal | | → Fiscal_Years; set by the rollover step-scripts |
| fkPREVIOUS_FISCAL_YEAR | text-uuid | fk | fiscal | | → Fiscal_Years |
| fkNEXT_FISCAL_YEAR | text-uuid | fk | fiscal | | → Fiscal_Years |

## Relationships

- `fkCURRENT_FISCAL_YEAR` / `fkPREVIOUS_FISCAL_YEAR` / `fkNEXT_FISCAL_YEAR` → `Fiscal_Years.PrimaryKey` (many-to-one each, under-review)
- **Cross-app:** every consuming app creates a TO against this table (logo, company name) via external data source.

## Fiscal rollover (RULED 2026-07-18)

The three fiscal-year pointers are updated **manually each year**, via **discrete stepped scripts** (set-current / shift-previous / set-next) authored to compose into a single automated rollover later. Not scripted-automatic yet by design — a once-a-year event doesn't warrant full automation up front, but the steps are built to combine cleanly.

## Open Items

- Confirm single-row enforcement mechanism in the live file.
- Build the three rollover step-scripts in `scripts/`.

## Changelog

- 2026-07-18: First-pass target-state migration from the ClickUp `URITP Global Usage` doc.
