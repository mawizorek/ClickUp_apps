# LAYOUT-value-lists — `VALUE_Lists`

**Render + spec for the Value Lists editor layout.** Second layout in maw-budget's **layout-first articulation**, and the app's central **value-list registry**: it documents every value list, how it derives, its members, its status-category mapping, and which `gLIST_` global keys point at it.

Modeled directly on Michael's existing **URITP Budget → Value Lists** page (prior art, screenshotted 2026-07-16): master-detail with a left rail of lists, a right portal of members, three per-list flags, and a GLOBALS assignment popover.

## Files

| File | Role |
|---|---|
| `layout.json` | Canonical manifest: the layout's objects, parts/sections, portal spec, theme, and (proposed) bindings. |
| `preview.html` | **The real layout.** Pure, chrome-free, interactive master-detail render: click a list on the left, its members + flags render on the right; status lists show the canonical STATUS mapping column; the GLOBALS button toggles the `gLIST_` assignment grid. Generic + data-driven — it renders from an embedded mirror of `value-lists/_index.json`, so the same shell renders any app's value lists. |
| `index.html` | Object / data inspector: each value list as a card (derivation, flags, members, mapping). Reads the same manifest. Migrates into `z-fm-layout-object-viewer` later. |
| `README.md` | This doc. |

## The status-style model (what makes this more than a pick-list)

Three flags per list: **`IS_ACTIVE`**, **`IS_STATUS_LIST`**, **`ENFORCE 1-TO-1`**. When a list is a status list, each member maps onto a **canonical status category** (New / Error / Active / Done / Closed). So any custom vocabulary (`needs_review`, `carry_forward`, ...) rolls up to a canonical state, and `ENFORCE 1-TO-1` guarantees exactly one mapping per value. `VL_StatusCategories` is the canonical master; every other status list maps onto it.

## Backend this layout implies (feeds field articulation)

- **Table `ValueLists`** (anchor TO): `PrimaryKey`, `Name`, `IsActive`, `IsStatusList`, `Enforce1to1`, `IsCanonical`, audit quad.
- **Table `ValueListItems`** (child, portal): `PrimaryKey`, `fkValueList`, `SortOrder`, `Value`, `fkStatusCategory` (or `StatusCategory` text holding a canonical value), `Notes`, audit quad.
- **Relationship**: `ValueLists::PrimaryKey = ValueListItems::fkValueList` (one-to-many, allow create/delete).
- **Globals**: `gLIST_*` keys point at value lists by name; edited in the GLOBALS panel, not on GLOBAL_Settings.
- **Value list**: the STATUS dropdown uses `VL_StatusCategories`.

## Layout facts

- **View name:** `SYS | Value Lists [DSK]` *(provisional)* · **internal:** `VALUE_Lists` · **folder:** `utility`
- **Occurrence:** `ValueLists` (anchor) · **Platform:** Computer · **Stencil:** `Desktop 1024×768` · **Theme:** MAW Dark Utility *(provisional)*

> **Theme note:** the URITP prior art uses an amber-action + teal-label scheme on near-black. This render uses maw-budget's provisional MAW Dark Utility (cyan accent) to stay inside the app's set theme. The themes doc-set migration (separate agent) decides the real palette; `theme.status` flips to `locked` then.

## Value lists documented (10)

Canonical status master + 3 status lists + 6 non-status. Full data (derivation, members, mappings, provenance) lives in `../../../value-lists/_index.json`. See `../../../meta/value-list-tracking-model.md` for how value lists are tracked/audited across apps.

## Open items

- [ ] Confirm `ValueLists` / `ValueListItems` table names + whether status mapping is a text field (canonical value) or `fkStatusCategory` to a real table.
- [ ] Confirm the value-list layout belongs under `utility` (vs a dedicated `SYS`/`admin` folder).
- [ ] Ruling on the **generic render-shell family** (field/table renderer, cross-app consolidation) — see the tracking-model doc.

## Changelog

- **2026-07-16 — v0.1.** First render. Master-detail value-list editor from URITP prior art; 10 lists documented; wired `value-lists/_index.json` + `ValueLists`/`ValueListItems` TOs.
