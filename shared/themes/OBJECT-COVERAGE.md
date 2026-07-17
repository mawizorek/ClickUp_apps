# Object Coverage Contract

**Every theme must be able to style all 20 canonical FileMaker objects. That is the theme acceptance test.**

The defensible object set comes from the ClickUp **FileMaker Canonical Object Library** (the constrained cross-app families that can appear in any layout). A theme isn't "done" until it renders all 20 correctly. `preview.html` is the live proof: pick a theme, every object below reskins from the 17 tokens; if one looks wrong or a token falls back, that theme fails coverage for that object.

**Single source of truth:** the machine-readable version of this list is [`_objects.json`](./_objects.json). `preview.html` renders that file dynamically, and this document is its human-readable contract. **The count must stay identical across all three** (this doc, `_objects.json`, and the studio's coverage readout). If you change the set, change it in `_objects.json` and here in the same pass.

## Why this exists

A theme is only real if it can dress the whole object system, not just a hero button. Tying themes to the canonical 20 guarantees two things at once: (1) every object has a defined style in every theme, and (2) every theme is forced to define all 17 tokens the objects consume. When Michael builds these natively in FileMaker, each object maps to the same token roles, so the render and the native solution agree.

## The 20 canonical objects (grouped by zone)

| # | Object | Zone | States rendered | Primary tokens |
|---|--------|------|-----------------|----------------|
| 1 | `cnt_page_shell` | Shell | base | `bg`, `border` |
| 2 | `cnt_section_card` | Shell | base | `surface-2`, `border`, `text-soft` |
| 3 | `cnt_toolbar` | Shell | base | `surface-1`, `accent`, `text` |
| 4 | `cnt_filter_bar` | Shell | base + active chip | `surface-1`, `surface-3`, `accent-soft`, `accent` |
| 5 | `card_modal_standard` | Shell | base | `surface-3`, `border`, `text`, `text-soft` |
| 6 | `nav_tab` | Nav | active / inactive | `surface-2`, `accent`, `text-faint`, `border` |
| 7 | `nav_mode` | Nav | active / inactive | `accent`, `on-accent`, `text-soft`, `border` |
| 8 | `nav_back` | Nav | base | `accent` |
| 9 | `tx_page_title` | Type | base | `text` |
| 10 | `tx_section_header` (+ subsection) | Type | base | `text` |
| 11 | `tx_field_label` | Type | base | `text-soft` |
| 12 | `tx_body` | Type | base | `text` |
| 13 | `tx_helper_muted` | Type | base | `text-soft`, `text-faint` |
| 14 | `tx_badge` | Type | base | `accent`, `accent-soft` |
| 15 | `btn_family` (primary / secondary / quiet / destructive / icon) | Buttons | normal / pressed | `accent`, `on-accent`, `surface-2`, `bad` |
| 16 | `fd_text_standard` | Fields | editable / focus / readonly | `field`, `border`, `text`, `accent`, `accent-soft`, `surface-2` |
| 17 | `fd_dropdown_standard` | Fields | base | `field`, `border`, `text-soft` |
| 18 | `fd_readonly_display` | Fields | base | `surface-2`, `text-soft` |
| 19 | `fd_search_filter` | Fields | base | `field`, `text-faint` |
| 20 | `row_tile_badge` (portal rows / metric tiles / status badges) | Data | rows / tiles / badges | `surface-1/2/3`, `accent`, `accent-soft`, `warn`, `good`, `bad`, `border` |

> Objects 15 and 20 are families that render multiple members/states in one card, so the gallery shows more than 20 rendered pieces; the 20 rows above are the canonical families and are the count of record. This matches the Canonical Object Library's "minimum viable library" — the set that must exist before any app is built.

## The state matrix (from the Canonical Object Library, unchanged)

- **Buttons** — normal / hover / pressed
- **Nav** — inactive / active / (optional hover)
- **Fields** — editable / in focus / readonly
- **Portal rows** — standard / selected / (optional alternate)
- **Containers / cards / shells** — base only

Themes never add states; they only reskin the existing ones.

## Adding a new object (not a cap)

**The 20 are the shared design vocabulary, not a ceiling.** No agent should ever feel constrained by the current set. If a design genuinely needs an object that isn't here, add it — that is a normal, welcome move, not a special request. The only rule is: **add it AND document it, in the same pass.**

The process is deliberately cheap:

1. **Append it to [`_objects.json`](./_objects.json)** under the right zone group (`shells` / `nav` / `type` / `buttons` / `fields` / `data`, or a new group), with an `id`, `name`, `rowLayout`, and one or more `states` (each with `html` + a `props` map of label → token role).
2. **Add a row to the table above** so the human contract and the machine file stay in lockstep.
3. That's it. `preview.html` renders the registry dynamically, so the new object appears in the studio with **no code change**, and the coverage readout count updates itself.

Keep new objects theme-driven: style them from the token roles (`var(--accent)`, `var(--surface-2)`, etc.), never hard-coded colors, so every theme reskins them for free. If a new object needs a token role that doesn't exist yet, that's a Canonical Object Library decision — raise it, don't silently invent a one-off token.

## Acceptance test for a new theme

1. Add the theme JSON with all 17 tokens (see `README.md`).
2. Open `preview.html`, select the theme.
3. Confirm every object renders with no token falling back to a placeholder.
4. Eyeball each zone: shells read as distinct elevation, nav active vs inactive is obvious, buttons show clear hierarchy, fields distinguish editable/focus/readonly, the selected portal row stands out, badge semantics are legible.
5. If any object reads wrong, fix the theme's tokens — not the object. The object is canonical; the theme bends to it.

This contract is the bridge to the native build: when the FileMaker theme gets built end-of-year, each of these objects maps to the same token roles via `fmpRoleMap` in `_index.json`, so the mockup and the solution stay in lockstep.
