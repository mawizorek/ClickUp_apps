# URITP People — Next Build Spec

**Version:** v1 (first migration pass) · **Date:** 2026-07-18 · overwritten each build cycle.

## This pass shipped

- Repo-native scaffold for `uritp-people`, schema-first (layouts stubbed).
- Lean identity-hub table set documented as-built (7 tables).
- Hub-and-spoke architecture ruling captured in `meta/design-decisions.md`.
- Naming-drift audit ledger seeded (as-built vs URITP convention).

## Next cycle (in order)

1. **Live-file reconciliation** — open the actual FMP file, confirm every field name/type against these docs. The file is the tiebreaker; both docs update to match reality.
2. **Resolve naming house style** (governance): adopt `pk_`/`fk_` or keep bare. Whichever wins, apply uniformly + record in `schema/tables.json` `_meta.conventions`.
3. **Fix the typo trio**: `prefferedFirstName`→`preferredFirstName`, `prefferedLastName`→`preferredLastName`, `namePronounciation`→`namePronunciation`.
4. **`emailTEMP` disposition**: migrate into CONTACT INFORMATION, then deprecate.
5. **Adult dept/title placement** (Open Question): Adults extension vs Staff-Positions layer.
6. **Enumerate scripts** into `scripts/` (import, batch-create person, chooser card).
7. **Chooser contract** doc: passed-in context → filter header → return person PK.

## Explicitly deferred (belongs to spokes, not here)

- Production roles / assignments / confirmations / revisions → **Productions builder**.
- Employees / job postings / supervisors → **Labour**.
- Course enrollments / rosters → **Courses**.
- Org constants / PRODUCTIONS / fiscal / departments → **Global Setup**.
