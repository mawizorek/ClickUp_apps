# Layout Render Standard (FMP HTML renders)

_Cross-app standard for every `preview.html` layout render in `filemaker/`. Companion to `DOCUMENTATION-STANDARD.md` (repo mirror rules) and each app's `meta/relationship-audit-model.md` + `meta/value-list-tracking-model.md` (the data indexes). This doc dictates exactly what a layout render must BE, how it must BEHAVE, and how it must LOOK. Dictated by Michael, 2026-07-16, after the value-list render iterations._

**Status:** LOCKED direction. Applies to all FMP layout renders going forward. Retro-fit existing renders (GLOBAL_Settings) to match.

---

## What these renders are (the one-line version)

**The render IS the layout.** Not a screenshot, not a scaled picture of a FileMaker window on gray, not a dev mockup with chrome. It is the actual, runnable screen: it looks like the built FileMaker layout and behaves like it in Browse mode, even though it leads nowhere. We build a usable app page each time (that references real documented data) so that building the render forces us to articulate the fields, value lists, and scripts the backend will need. Michael can then recreate it 1:1 in FileMaker.

---

## The rules (render decision log)

### DD-R01 — The render IS the layout; no chrome, no mockup framing `LOCKED`
Full-bleed. The whole artifact is the screen. NO dev chrome (no FileMaker layout bar, ruler, zoom UI, status area, or metadata strip) and NO "window floating on gray canvas" framing. Chrome/inspection belongs only in `index.html` / the future `z-fm-layout-object-viewer`, never in `preview.html`.

### DD-R02 — Behaves like a FileMaker layout in Browse mode `LOCKED`
Controls are live: editable fields, working pop-up/drop-down menus, toggleable checkbox sets, selectable radio sets, pressable buttons (script stubs flash a confirmation), portals that select a row and drive a detail region, an add-row that reads as record creation. Selecting a list on the left changes the detail on the right (found-set → current record → related portal). It does real UI things; it just doesn't persist or navigate anywhere.

### DD-R03 — Looks like the built layout: Excel/spreadsheet density `LOCKED`
This is the correction that took several tries. Renders must feel like a **spreadsheet / the real FileMaker layout Michael designed**, NOT a padded web app.
- **Zero border-radius.** Sharp corners everywhere (fields, buttons, cells, popovers).
- **Collapsed gridlines, no gaps.** Cells abut and share 1px borders like Excel. No gutters between columns, no margins between rows, no floating rounded input boxes.
- **Tight padding, dense rows.** ~30px row height. Minimal cell padding.
- **Reproduce, don't reinterpret.** When Michael provides a screenshot of the real layout, match it: element placement, columns, flag clusters, button row, footer. Do not invent a "nicer" web version.

### DD-R04 — Desktop-scaled fixed canvas `LOCKED`
Design at the layout's real width (e.g. 1180px), fixed. Do NOT mobile-reflow. Michael zooms on small screens; "it looks tiny on mobile" is fine and expected. `<meta name=viewport content="width=<designWidth>">`.

### DD-R05 — Manifest-driven + generic; data stored as JSON `LOCKED`
The render is a **generic shell** that reads an embedded JSON manifest (a mirror of the canonical data index) and draws itself. NO hand-coded, layout-instance-specific HTML — to add/change content you edit the DATA, not the markup. The value lists live as data in `value-lists/_index.json`; the render reads a mirror of that. One shell renders any number of value lists, and the same shell serves any app's data. This is what makes the render reusable and keeps documentation compliant (fill the JSON → the shell renders it; you cannot skip documenting the data).

### DD-R06 — Theme via a single token block; provisional until the themes standard lands `LOCKED`
All color/spacing sits in one `:root` token block. The **themes-standard session** (separate agent) owns the real palette; until then the theme is PROVISIONAL and the render just carries a token mirror. When the standard lands, a render swaps its token block only — no structural change. This is the **theme-generic** axis (see below).

**DESIGN-UI hard bans still apply:** no gradient text, no side-stripe borders, no glassmorphism, no pure #000/#fff.

---

## The two generic renderers (the direction)

Michael's framing: collapse everything we audit/parse into right-sized **data files**, and let **generic render shells** display them. Two axes of "generic":

1. **Value-list-generic renderer** (BUILT, this layout). One shell + `value-lists/_index.json` → renders any number of value lists, for any app. Point it at a different app's index, it renders unchanged.
2. **Theme-generic renderer** (PENDING themes standard). Same shell, swap the token block → reskinned with zero structural edits.

The same pattern extends to other concerns (each = a data file + a generic shell):

| Concern | Data file | Shell | Status |
|---|---|---|---|
| Layout | `layouts/<...>/layout.json` | `preview.html` | BUILT |
| Value lists | `value-lists/_index.json` | value-list shell (this render) | BUILT |
| Fields / tables | `schema/tables.json` + `tables/*` | field/table shell | PROPOSED (needs go-ahead) |
| Relationships | `relationships/_index.json` | TO-graph shell | PROPOSED |

All shells converge into the decided **`z-fm-layout-object-viewer`** at `filemaker/` level, which loads any app's data files by slug+path, renders the right shell per concern, and computes cross-index joins live. Per-folder `index.html` inspectors retire into it.

**Anti-sprawl note:** the value-list + theme-generic renderer for THIS layout is in scope and built. A cross-app field/table renderer + the shell framework spanning every app is net-new and awaits Michael's explicit go-ahead before being committed as a framework.

---

## Interaction vocabulary (maps render → FileMaker)

| Render element | FileMaker equivalent |
|---|---|
| Left rail, click to select | Found set of the anchor TO; go-to-record |
| Detail region that swaps on select | Current record's fields |
| Item grid (spreadsheet) | Portal of related records (child TO) |
| Add-row at the bottom | Portal "add" (allow-create relationship) |
| Flag checkboxes | Boolean fields on the record |
| Native dropdown | Field formatted as pop-up/drop-down bound to a value list |
| Button (flashes stub) | Script trigger |
| GLOBALS popover | `gLIST_` global assignments editor |
| Footer PK + version + last-save | The record's PrimaryKey + solution version/status |

---

## Checklist before shipping a render

- [ ] Full-bleed, no chrome, no gray-window framing (DD-R01).
- [ ] Every control is live (DD-R02).
- [ ] Zero radius, collapsed gridlines, no gaps, dense (DD-R03).
- [ ] Fixed desktop canvas, no mobile reflow (DD-R04).
- [ ] Draws from an embedded JSON manifest mirroring the canonical index; no instance-specific HTML (DD-R05).
- [ ] Single `:root` token block; theme marked provisional (DD-R06).
- [ ] No DESIGN-UI banned patterns.
- [ ] Matches Michael's screenshot of the real layout when one exists.
