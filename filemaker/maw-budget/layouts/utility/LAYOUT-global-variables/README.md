# LAYOUT-global-variables — `GLOBAL_Settings`

**Render + spec for one FileMaker layout.** First artifact of maw-budget's **layout-first articulation**: we articulate the app layout-by-layout via real HTML renders of FileMaker layouts, *before* writing table docs, so each render surfaces exactly which fields, value lists, and scripts the backend will need.

## Files in this folder

| File | Role |
|---|---|
| `layout.json` | **Canonical manifest.** Every object with control style, part/section, theme, geometry, and (proposed) field binding. Both HTML files render from it; keep in sync in the same PR (same rule as `_index.json`). |
| `preview.html` | **The real layout.** A pure, chrome-free, **interactive** Browse-mode render: the themed layout at its design width on FileMaker window-gray, with live fields (type in them), working selects, toggling checkboxes, selectable radios, and pressable buttons. No layout bar, no ruler, no metadata strip. This is meant to feel exactly like the built FileMaker layout. |
| `index.html` | **The object / JSON inspector.** Annotated dev view: numbered badges, object list, per-object bindings (`Table::field`, storage, value list, notes). The generic auto-extending skin. (Migrating out — see viewer note below.) |
| `README.md` | This doc. |

## Viewer decision (Michael, 2026-07-16)

The inspector graduates into a **standalone shared app: `z-fm-layout-object-viewer`**, living at the **`filemaker/` folder level** (`filemaker/z-fm-layout-object-viewer/`), alongside the FileMaker apps — **not** at the repo root with the ClickUp apps. It loads any FMP app's `layout.json` by slug + path, so every layout folder stops shipping its own inspector copy. `preview.html` stays in each layout folder as the pure render. **Build pending an explicit go-ahead** (net-new app).

## Layout facts

- **FileMaker layout name (view):** `SYS | Global Settings [DSK]` *(provisional — naming convention below)*
- **Internal name:** `GLOBAL_Settings` · **FMP layout folder:** `utility`
- **Platform:** Computer (Desktop) · **Target screen stencil:** `Desktop: 1024 × 768` · **Design width:** `1024 pt`
- **Table occurrence:** `Globals` (base table `Globals`) — a single-record utility table holding global-storage (`g_`) fields
- **Mode:** Browse · **Theme:** `MAW Dark Utility` *(**PROVISIONAL** — pending the FMP themes doc-set migration)*

### FileMaker layout sizing (researched)

FileMaker layouts have **no hard width property** — effective width is implied by object placement. The design discipline is to target a **screen stencil** (Claris's nonprinting device guides). Desktop stencils: **640×480, 1024×768, 1280×960, 1600×1200**. We target **1024×768** and design a hair inside it (Claris notes stencils overstate usable space — they ignore toolbars, scroll bars, the status area). A FileMaker Go (iOS) variant, if wanted later, is a **separate layout** (`[GO]`) at an iOS stencil, not a reflow of this one.

## Layout naming convention (provisional)

`<AREA> | <Name> [<Platform>]` — AREA groups layouts in the Layouts menu (`SYS`, `LDGR`, `RPT`, `IMPORT`, `NAV`, `DASH`); Platform suffix `[DSK]` or `[GO]`. This layout: **`SYS | Global Settings [DSK]`**. Internal/manifest name stays `GLOBAL_Settings`; folder stays `LAYOUT-global-variables`. Confirm to graduate from provisional.

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

The render is themed with **MAW Dark Utility** (tokens in `layout.json` → `layout.theme.tokens`). **Provisional**: available themes should be a governed FMP git doc set (`filemaker/themes/` or `filemaker/meta/themes.md`) that every render is constrained to, mirroring the ClickUp themes doc but repo-native. That migration is **handed to a separate agent** so this session stays on maw-budget. Once it exists, `theme.themeRef` resolves and `themeStatus` flips to `locked`.

## Field bindings & the automation path

Bindings live as **data** in `layout.json`, not prose. Today every binding is `status: "proposed"` (no table yet). Roadmap: when `schema/tables.json` exists, a validator diffs each binding — green (exists + type match) / amber (proposed) / red (missing field). No hand-maintained MD binding tables.

## Backend this layout implies (feeds field articulation)

- **Table `Globals`** — single-record utility table, all fields global storage: `g_CurrentUser`, `g_AppVersion` (calc), `g_Environment`, `g_DebugMode`, `g_ThemeMode`, `g_DefaultAccount`, `g_CurrentBudgetMonth`, `g_DateToday` (calc), `gLIST_AccountTypes`, `gLIST_TransactionStates`, `g_ImportInProgress`, `g_LastImportSession`.
- **Value lists:** `gLIST_Environment`, `gLIST_ThemeMode`, `gLIST_Accounts` (+ field-based lists fed by the `gLIST_` globals).
- **Scripts (scripts/utilities/):** `util_ResetGlobals`, `util_ToggleTheme`.

## Open items

- [ ] Green-light building **`z-fm-layout-object-viewer`** at `filemaker/` level; then retire the per-folder `index.html` inspector copies.
- [ ] Confirm the **layout naming convention** (`<AREA> | <Name> [<Platform>]`).
- [ ] Confirm **`Globals`** as the utility table name (vs `Settings` / `Prefs`).
- [ ] Confirm **folder-per-layout**, then update `DOCUMENTATION-STANDARD.md`.
- [ ] Themes doc-set migration (separate agent) → flip theme provisional → locked.

## Changelog

- **2026-07-16 — v0.3.** Rebuilt `preview.html` as a pure, chrome-free, **interactive** Browse-mode render (killed the layout bar / ruler / metadata strip). Live fields, selects, checkboxes, radios, buttons. Logged the `z-fm-layout-object-viewer` placement decision (at `filemaker/` level).
- **2026-07-16 — v0.2.** Added first `preview.html` (with layout bar / ruler / zoom — superseded same day) + manifest geometry (`platform`/`targetStencil`/`layoutWidth`) + provisional `viewName`.
- **2026-07-15 — v0.1.** Initial inspector render + manifest. 16 objects, all bindings proposed. Established the folder-per-layout + JSON-driven renderer convention.
