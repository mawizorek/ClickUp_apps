# LAYOUT-global-variables — `GLOBAL_Settings`

**Render + spec for one FileMaker layout.** First artifact of maw-budget's **layout-first articulation**: we articulate the app layout-by-layout via real HTML renders of FileMaker layouts, *before* writing table docs. Each layout render surfaces exactly which fields, value lists, and scripts the backend will need.

## Folder-per-layout convention (new)

Each layout is its **own folder** inside `layouts/`, mirroring where it lives in FileMaker's Layouts menu (`layouts/<folder>/LAYOUT-<name>/`). The folder holds three files:

| File | Role |
|---|---|
| `index.html` | The render. Open it. A self-contained, JSON-driven FileMaker-layout renderer: parts (Header/Body/Footer), field controls, an object inspector, and annotation overlays. |
| `layout.json` | **Canonical manifest.** Every object with its control style, theme, and field binding. `index.html` embeds a copy and renders it; keep the two in sync in the same PR (same rule as `_index.json`). |
| `README.md` | This doc. |

> **Standard divergence, flagged:** `DOCUMENTATION-STANDARD.md` v1.1 says "one file per layout." This folder-per-layout shape supersedes that for renders. The standard should be updated once Michael signs off on the convention.

## Layout facts

- **Name:** `GLOBAL_Settings`
- **FMP layout folder:** `utility`
- **Table occurrence:** `Globals` (base table `Globals`) — a **single-record utility table** holding global-storage (`g_`) fields
- **Mode:** Browse
- **Theme:** `MAW Dark Utility` (tokens declared in `layout.json` → `layout.theme.tokens`)
- **Purpose:** the one screen where app-wide `g_` globals live so they can be seen and set: session identity, preferences (theme, default account, budget month), value-list seeds, and import/process state.

## Object inventory (16)

| # | Object | Control | Binds to (proposed) | Notes |
|---|---|---|---|---|
| 1 | Global Settings | static text | — | Layout title |
| 2 | Env / version merge | merge text | `Globals::g_Environment` (+`g_AppVersion`) | Read-only merge |
| 3 | Current User | edit box | `Globals::g_CurrentUser` | From `Get(AccountName)`; drives audit quad |
| 4 | App Version | display | `Globals::g_AppVersion` | Unstored calc |
| 5 | Environment | pop-up menu | `Globals::g_Environment` | VL `gLIST_Environment` (DEV/PROD) |
| 6 | Debug Mode | checkbox | `Globals::g_DebugMode` | 1/0 flag |
| 7 | Theme | radio set | `Globals::g_ThemeMode` | VL `gLIST_ThemeMode`; default Dark |
| 8 | Default Account | drop-down | `Globals::g_DefaultAccount` | Holds `fkAccount`; VL `gLIST_Accounts` |
| 9 | Current Budget Month | edit box (date) | `Globals::g_CurrentBudgetMonth` | Phase-3 seed |
| 10 | Today | display | `Globals::g_DateToday` | `Get(CurrentDate)`; DD-018 anchor |
| 11 | Account Types (seed) | display (multi) | `Globals::gLIST_AccountTypes` | Seeds Account taxonomy (DD-011/013) |
| 12 | Transaction States | display (multi) | `Globals::gLIST_TransactionStates` | Cleared/Pending seed (DD-021) |
| 13 | Import In Progress | checkbox | `Globals::g_ImportInProgress` | Re-entrancy guard (DD-012) |
| 14 | Last Import Session | display | `Globals::g_LastImportSession` | Holds `fkImportSession` |
| 15 | Reset Session Globals | button | script `util_ResetGlobals` | scripts/utilities/ |
| 16 | Toggle Theme | button | script `util_ToggleTheme` | scripts/utilities/ |

## Field bindings & the automation path (the "cool factor")

Bindings live as **data** in `layout.json`, not prose. Today every binding is `status: "proposed"` because no table is articulated yet (rendered with amber badges). The roadmap:

1. **Now:** the render *declares demand* — each object names the `Table::field` it will need. This layout-first pass is the input to the eventual field-articulation session.
2. **Next:** when `schema/tables.json` exists, a validator diffs every `layout.json` binding against it. Green = field exists and types match; amber = proposed; red = references a field that doesn't exist. No hand-maintained MD binding tables.
3. The renderer stays generic: drop a new `layout.json` beside a copy of `index.html` and any layout renders.

## Backend this layout implies (feeds field articulation)

- **Table `Globals`** — single-record utility table, all fields global storage: `g_CurrentUser`, `g_AppVersion` (calc), `g_Environment`, `g_DebugMode`, `g_ThemeMode`, `g_DefaultAccount`, `g_CurrentBudgetMonth`, `g_DateToday` (calc), `gLIST_AccountTypes`, `gLIST_TransactionStates`, `g_ImportInProgress`, `g_LastImportSession`.
- **Value lists:** `gLIST_Environment`, `gLIST_ThemeMode`, `gLIST_Accounts` (plus the field-based lists fed by the `gLIST_` globals).
- **Scripts (scripts/utilities/):** `util_ResetGlobals`, `util_ToggleTheme`.

## Open items

- [ ] Confirm the **folder-per-layout** convention, then update `DOCUMENTATION-STANDARD.md`.
- [ ] Confirm the utility table name **`Globals`** (vs `Settings` / `Prefs`).
- [ ] Decide: should the JSON binding-validator run in the render itself, or as a repo check against `schema/tables.json`?
- [ ] Confirm `g_DefaultAccount` stores an `fkAccount` value vs. resolving via a relationship.

## Changelog

- **2026-07-15 — v0.1.** Initial render + manifest. 16 objects, all bindings proposed. Establishes the folder-per-layout + JSON-driven renderer convention.
