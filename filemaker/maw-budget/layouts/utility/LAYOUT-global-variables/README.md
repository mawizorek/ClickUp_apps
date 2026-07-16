# LAYOUT-global-variables — `GLOBAL_Settings`

**Render + spec for one FileMaker layout.** First artifact of maw-budget's **layout-first articulation**: we articulate the app layout-by-layout via real HTML renders of FileMaker layouts, *before* writing table docs, so each render surfaces exactly which fields, value lists, and scripts the backend will need.

## Files in this folder

| File | Role |
|---|---|
| `layout.json` | **Canonical manifest.** Every object with control style, part/section, theme, geometry, and (proposed) field binding. Both HTML files render from it; keep all three in sync in the same PR (same rule as `_index.json`). |
| `preview.html` | **The real, to-scale, as-built render.** What the layout looks like when built in FileMaker: themed, at the defined layout width, with the FileMaker layout bar, a ruler, zoom, and toggleable layout-part guides. No annotations. |
| `index.html` | **The object / JSON inspector.** Annotated view: numbered badges, an object list, and per-object bindings (`Table::field`, storage, value list, notes). The generic auto-extending skin — add objects to the manifest and it grows. |
| `README.md` | This doc. |

> **Heads-up (naming in flux):** Michael's direction is to extract the inspector into a **single shared repo-root app** (proposed slug `fm-layout-viewer`) that loads any app's `layout.json` by slug+path, so each layout folder stops shipping an inspector copy. Once that exists, `index.html` here becomes the real render and the shared app holds the inspector. Until then, `preview.html` = render, `index.html` = inspector. Pending Michael's green light.

## Layout facts

- **FileMaker layout name (view):** `SYS | Global Settings [DSK]` *(provisional — see naming convention below)*
- **Internal name:** `GLOBAL_Settings` · **FMP layout folder:** `utility`
- **Platform:** Computer (Desktop) · **Target screen stencil:** `Desktop: 1024 × 768` · **Design width:** `1024 pt`
- **Table occurrence:** `Globals` (base table `Globals`) — a single-record utility table holding global-storage (`g_`) fields
- **Mode:** Browse
- **Theme:** `MAW Dark Utility` *(**PROVISIONAL** — pending the FMP themes doc-set migration; see below)*

### FileMaker layout sizing (researched)

FileMaker layouts have **no hard width property** — effective width is implied by object placement. The design discipline is to target a **screen stencil** (Claris's nonprinting device guides). Desktop stencils: **640×480, 1024×768, 1280×960, 1600×1200**. We target **1024×768** for this utility screen and design a hair inside it (Claris notes stencils overstate usable space — they ignore toolbars, scroll bars, and the status area). A FileMaker Go (iOS) variant, if wanted later, is a **separate layout** at an iOS stencil, not a reflow of this one.

## Proposed app-wide layout naming convention (provisional)

`<AREA> | <Name> [<Platform>]`

- **AREA** groups layouts in the Layouts menu: `SYS` (utility/setup), `LDGR` (ledger/registers), `RPT` (reports), `IMPORT`, `NAV`, `DASH`.
- **Platform** suffix: `[DSK]` (Computer) or `[GO]` (FileMaker Go / iOS).
- This layout: **`SYS | Global Settings [DSK]`**. Internal/manifest name stays `GLOBAL_Settings`; the folder stays `LAYOUT-global-variables`.

> Confirm the convention and it graduates from provisional; then it applies to every future layout render.

## Object inventory (16)

| # | Object | Control | Binds to (proposed) |
|---|---|---|---|
| 1 | Global Settings | static text | — |
| 2 | Env / version merge | merge text | `Globals::g_Environment` (+`g_AppVersion`) |
| 3 | Current User | edit box | `Globals::g_CurrentUser` |
| 4 | App Version | display | `Globals::g_AppVersion` |
| 5 | Environment | pop-up menu | `Globals::g_Environment` (VL `gLIST_Environment`) |
| 6 | Debug Mode | checkbox | `Globals::g_DebugMode` |
| 7 | Theme | radio set | `Globals::g_ThemeMode` (VL `gLIST_ThemeMode`) |
| 8 | Default Account | drop-down | `Globals::g_DefaultAccount` (VL `gLIST_Accounts`) |
| 9 | Current Budget Month | edit box (date) | `Globals::g_CurrentBudgetMonth` |
| 10 | Today | display | `Globals::g_DateToday` |
| 11 | Account Types (seed) | display (multi) | `Globals::gLIST_AccountTypes` |
| 12 | Transaction States | display (multi) | `Globals::gLIST_TransactionStates` |
| 13 | Import In Progress | checkbox | `Globals::g_ImportInProgress` |
| 14 | Last Import Session | display | `Globals::g_LastImportSession` |
| 15 | Reset Session Globals | button | script `util_ResetGlobals` |
| 16 | Toggle Theme | button | script `util_ToggleTheme` |

## Theme (provisional) & the themes doc-set

The render is themed with **MAW Dark Utility** (tokens live in `layout.json` → `layout.theme.tokens`). This is **provisional**: available themes should be a **governed FMP git documentation set** (`filemaker/meta/themes.md` or a `filemaker/themes/` doc set) that every layout render is constrained to, mirroring the ClickUp themes doc but repo-native. That migration is being **handed to a separate agent** (Michael's call) so this session stays on maw-budget. Once `themes.md` exists, `layout.theme.themeRef` resolves to a real anchor and `themeStatus` flips to `locked`.

## Field bindings & the automation path

Bindings live as **data** in `layout.json`, not prose. Today every binding is `status: "proposed"` (no table articulated yet). Roadmap: when `schema/tables.json` exists, a validator diffs each binding — green (exists + type match) / amber (proposed) / red (missing field). No hand-maintained MD binding tables.

## Backend this layout implies (feeds field articulation)

- **Table `Globals`** — single-record utility table, all fields global storage: `g_CurrentUser`, `g_AppVersion` (calc), `g_Environment`, `g_DebugMode`, `g_ThemeMode`, `g_DefaultAccount`, `g_CurrentBudgetMonth`, `g_DateToday` (calc), `gLIST_AccountTypes`, `gLIST_TransactionStates`, `g_ImportInProgress`, `g_LastImportSession`.
- **Value lists:** `gLIST_Environment`, `gLIST_ThemeMode`, `gLIST_Accounts` (+ field-based lists fed by the `gLIST_` globals).
- **Scripts (scripts/utilities/):** `util_ResetGlobals`, `util_ToggleTheme`.

## Open items

- [ ] Green-light the **shared `fm-layout-viewer` app** + the eventual `index.html` → render / inspector → shared-app swap.
- [ ] Confirm the **layout naming convention** (`<AREA> | <Name> [<Platform>]`).
- [ ] Confirm **`Globals`** as the utility table name (vs `Settings` / `Prefs`).
- [ ] Confirm **folder-per-layout**, then update `DOCUMENTATION-STANDARD.md`.
- [ ] Themes doc-set migration (handed to a separate agent) → flip theme from provisional to locked.
- [ ] Decide where the JSON binding-validator runs (in-render vs a repo check against `schema/tables.json`).

## Changelog

- **2026-07-16 — v0.2.** Added `preview.html` (real to-scale themed render; Computer / 1024×768 stencil / 1024pt). Added geometry + `viewName` (`SYS | Global Settings [DSK]`, provisional) + provisional theme ref to `layout.json`. Documented the naming convention + shared-viewer proposal.
- **2026-07-15 — v0.1.** Initial inspector render + manifest. 16 objects, all bindings proposed. Established the folder-per-layout + JSON-driven renderer convention.
