# Handoff — Migrate HML_LLC script docs from ClickUp into the Git .fmscript model

**Created:** 2026-07-16 · **For:** the next FileMaker-docs session (fresh agent) · **Type:** data migration, NOT design (the format is locked). · **Prereq reading:** this file, then the three SOT docs in section 1.

---

## TL;DR

The scripts doc **model** is locked + the renderer is live (v1.4, shipped 2026-07-16). What's missing is **content**: the Git side has exactly ONE script (`commitRecord`, the reference example). Meanwhile ClickUp holds an **extensive, real HML script library** that was never migrated to Git. Your job: take the ClickUp script documentation and convert each script into the confirmed Git format (`.fmscript` body + a row in the master `scripts/_index.json`). Nothing needs to be *designed*; it needs to be *converted* — carefully, because parts of the ClickUp source are stale (see ⚠️ section 4).

---

## 1. Source-of-truth docs to load FIRST (in order)

1. `filemaker/DOCUMENTATION-STANDARD.md` (v1.4) — the mechanical rules. The **Script bodies live in lean .fmscript files** section + the **Script file format** section are your target spec.
2. `filemaker/DECISIONS.md` — **D-005** (scripts ride the calc model as dictation refs) is the WHY. Do not relitigate it.
3. `filemaker/hml-llc/scripts/utilities/commitRecord.fmscript` + `filemaker/hml-llc/scripts/_index.json` — the canonical worked example + the master manifest shape. Copy this pattern exactly.

Then skim `filemaker/_viewer/scripts.html` (the renderer you're feeding) and `brain-config/open-thread.md` (top two entries: the v1.4 lock + the calc-externalization prereqs).

## 2. The migration SOURCE in ClickUp (the thing to convert)

**Canonical index page:** ClickUp → `Hard Money Loan LLC FMP` → `DOCUMENTATION` → **`Scripts and Automations`** (doc id `12cwjm-63993`). That page is the HML script-system index: it holds the real Script Workspace folder tree, the v1 build order, the naming convention, the per-script doc template, a 2026-06-18 contract audit, and links to every per-script page. START THERE.

Under it (the actual content to migrate):
- **Folder pages** mirroring the FileMaker Script Workspace: `00_APP`, `10_UI`, `20_NAV`, `30_CONTEXT`, `40_BINDER`, `50_RECEIPTS`, `60_PAYMENTS`, `70_SCHEDULE`, `80_PAYOFF`, `90_ADMIN`, `zz_DEV_ARCHIVE`, plus `zOld <Scripts>`.
- **First-wave v1 per-script pages (10):** `30_CONTEXT__Select_Property_Context`, `10_UI__Set_Hub_Tab`, `40_BINDER__New_Document_From_Capture`, `50_RECEIPTS__Create_ReceivedFunds_From_Document`, `70_SCHEDULE__Generate_Expected_Schedule`, `60_PAYMENTS__Post_ReceivedFunds_Batch`, `60_PAYMENTS__Auto_Apply_Waterfall`, `80_PAYOFF__Create_Payoff_From_Prior_Version`, `80_PAYOFF__Save_Issued_Payoff_To_Binder`, `20_NAV__Open_Related_Loan_From_Property`.
- **90_ADMIN API quartet:** `Create_ClickUp_Task`, `Push_ClickUp_Task_Summary`, `Set_ClickUp_Task_Custom_Field`, `Update_ClickUp_Task_Core_Properties`.
- **90_ADMIN field-ID utility trio:** `Refresh_ClickUp_Field_Catalog_For_Scope`, `Resolve_ClickUp_Field_ID_By_Key`, `Refresh_ClickUp_Field_Map_IDs_For_Target`. Plus `Push_Property_To_ClickUp_Task` (the publish-first integration contract), `Seed_Standard_Transactions`, and status-utility helpers.
- **App-specific narrative:** `HML Scripting Practices (app-specific)` + `Script Organization Review — HML v1 first pass` — these are narrative context, likely destined for `meta/`, not per-script bodies.

## 3. The conversion recipe (per script)

For each ClickUp per-script page, produce TWO things (mirror `commitRecord`):

**a) The body file** `filemaker/hml-llc/scripts/<folder>/<ScriptName>.fmscript` — lean plain text:
- Native `#` comment header carrying the narrative. Map the ClickUp per-script template (purpose / trigger-caller / parameters in / globals-context / records touched / happy-path / guard rails / error handling / called sub-scripts / refactor notes) onto the `#` header fields: `# SCRIPT`, `# FOLDER`, `# ROLE`, `# CALLED BY`, `# CALLS`, `# INPUTS`, `# GLOBALS IN`, `# RETURNS`, `# SIDE EFFECTS`, then `# WHEN TO USE` / `# DESIGN NOTES` / `# CANDIDATE UPGRADES` / `# CHANGELOG`.
- Then the step text to dictate into Manage Scripts. Where ClickUp only has pseudo-code (several pages are pseudo-code, not real FileMaker steps), transcribe the pseudo-code under a `# --- (PSEUDO-CODE, not yet real FMP steps) ---` divider and flag it, rather than inventing steps.
- Remember: `.fmscript` is a **dictation reference, NOT paste-round-trippable** (D-005). Do not claim otherwise.

**b) A row in** `filemaker/hml-llc/scripts/_index.json` (the ONE master flat `scripts[]`): `{ name, folder, calls[], scriptRef }`. Minimal only. `calledBy` is DERIVED by the renderer — never add it. `calls[]` may name a script OR a custom function (functions render hollow). Keep rows tiny to stay under the ~30KB cap.

Update the folder `README.md` breadcrumbs as you populate (see `utilities/README.md` for the pattern).

## 4. ⚠️ TRAPS — read before you convert a single script

1. **Folder-name mismatch (reconcile FIRST).** The Git skeleton currently has `scripts/imports`, `navigation`, `triggers`, `utilities` (placeholder guesses). The REAL FileMaker tree (per the ClickUp index) is numbered: `00_APP`, `10_UI`, `20_NAV`, `30_CONTEXT`, `40_BINDER`, `50_RECEIPTS`, `60_PAYMENTS`, `70_SCHEDULE`, `80_PAYOFF`, `90_ADMIN`, `zz_DEV_ARCHIVE`. The standard says folders mirror the actual Manage Scripts tree → **the numbered folders win.** Decide with Michael: rename the placeholder folders to the numbered set (and move `commitRecord` — it's a `utilities` helper, likely lands in `90_ADMIN` or a utilities equivalent; confirm where it lives in the real file). Do this reconciliation BEFORE bulk-populating so you don't migrate into folders that then get renamed.
2. **Stale content — do NOT blind-copy.** The 2026-06-18 contract audit on the `Scripts and Automations` page marks several pages outdated against the now-locked loan-first + real-`Payoffs`-table architecture:
   - `Needs rewrite` (red): `50_RECEIPTS__Create_ReceivedFunds_From_Document`, `60_PAYMENTS__Post_ReceivedFunds_Batch`, `60_PAYMENTS__Auto_Apply_Waterfall`, `80_PAYOFF__Create_Payoff_From_Prior_Version`, `80_PAYOFF__Save_Issued_Payoff_To_Binder` (still property-centered / pre-Payoffs-table / key off `fkProperty`).
   - `Needs update` (yellow): `40_BINDER__New_Document_From_Capture`, `20_NAV__Open_Related_Loan_From_Property`.
   - `Current enough` / `Rewritten` (green): `10_UI__Set_Hub_Tab`, `30_CONTEXT__Select_Property_Context`, `70_SCHEDULE__Generate_Expected_Schedule`.
   **Migrate the documentation faithfully, but stamp each converted `.fmscript` CHANGELOG with the audit status**, so the Git copy carries the staleness flag instead of laundering old logic into a fresh-looking file. Ask Michael whether red-status scripts should be migrated as-is-with-a-warning or held until rewritten.
3. **Pseudo-code vs real steps.** Some pages (e.g. `Push_Property_To_ClickUp_Task`) are contracts + pseudo-code, not literal FileMaker step text. That's fine to migrate as a dictation reference, but mark it clearly (section 3a) so nobody mistakes it for confirmed steps. The live FileMaker file is the tiebreaker for real step text.
4. **Naming convention already matches us.** ClickUp scripts use `60_PAYMENTS__Post_ReceivedFunds_Batch` — double-underscore namespace sep, same as our `.fmscript` convention. `name` in the index = the full script name; it's unique per file so it's a safe graph key. Keep the exact names.
5. **`meta/` vs per-script.** `HML Scripting Practices` and `Script Organization Review` are narrative, not scripts → land them in `filemaker/hml-llc/meta/`, not as `.fmscript` files.

## 5. Definition of done

- Folder tree reconciled to the real numbered Manage Scripts structure (trap #1 resolved with Michael).
- Every non-archived ClickUp script page → a `.fmscript` body + an `_index.json` row, names verbatim, `calls[]` populated (scripts + functions).
- Each converted file's CHANGELOG carries its 2026-06-18 audit status where one exists.
- App-specific narrative pages migrated to `meta/`.
- `scripts.html?app=hml-llc` renders the populated tree + a real call graph (today it shows only `commitRecord`).
- `_index.json` still well under ~30KB (minimal rows). If the real inventory is large, confirm it fits; shard by top-level folder behind a pointer only if it crosses.
- Open-thread updated: flip the scripts item from "skeleton only" to "populated," note any red-status scripts left pending rewrite.

## 6. What NOT to do

- Do NOT redesign the model (D-005 is locked; `.fmscript` + master index + derived `calledBy`, no sidecars, no per-folder indexes).
- Do NOT claim `.fmscript` round-trips into FileMaker (it's dictation-only).
- Do NOT invent FileMaker step text to fill gaps — mark pseudo-code as pseudo-code; the live file is the tiebreaker.
- Do NOT launder stale (red-status) logic into clean-looking files without the staleness flag.
- Do NOT touch the calc renderer/linter promotion (separate open-thread item); the scripts + relationships renderers already shipped as baseline v1 (PR #272).

---

*Cross-ref: standard v1.4 + DECISIONS D-005/D-006 (PR #270); scripts + relationships renderers baseline v1 (PR #272). ClickUp source of truth: `DOCUMENTATION → Scripts and Automations`.*
