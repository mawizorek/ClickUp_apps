# Prism — next build spec

**Status: SCOPED, NOT GREENLIT.** Written 2026-08-04 from two asks Michael made in chat. Nothing
built. Ledger row stays at v3.2 until something ships.

> Michael, 2026-08-04:
> *"we need to develop a tool that takes a TSV with those markers and strips them out… similar to
> another tool I want to build: one that takes any markdown file fitting our gold template and feeds
> it directly into a renderer interface… a dropdown menu to pick a theme for the page and a print
> button… If the site isn't rendering or publishing, I should still be able to drop a functional
> markdown file into this tool."*

---

## 🔴 Fold-in ruling: BOTH asks are Prism, neither is a new app

He described two tools. **Prism already is both of them, minus three features.**

| The ask | What already exists | What is actually missing |
|---|---|---|
| Strip markers out of a TSV | **TableLens** — imports TSV, edits cells, exports TSV / CSV / JSON / Excel | one transform on the export path |
| Render a gold-template markdown file | **MDLens** — `prism.md.js`, renders markdown, shipped since v1 | marker + frontmatter awareness |
| Theme dropdown | **`on-track`** is the ledger's named *"reference implementation for a theme picker"* — passive, reads `_themes.json` live | copy it into Prism's chrome |
| Print button | nothing | `window.print()` + a print sheet |

**Standing rule this follows** (Dexter, earned): *he will kill a NET-NEW app in favour of upgrading an
existing one; viewer-vs-editor distinctions are not a reason to fork. Ask what absorbs this before
scoping a sibling.* Two new apps here would fork the markdown renderer Prism already owns — the same
mistake Markdown Viewer's retirement already corrected once.

**And the registry makes it cheap.** As of v3 `window.PrismLenses` is real, so a lens is
`{id, label, accent, priority, detect, load, defaultView, render}`. **Nothing below needs a shell edit.**

---

## A · The marker stripper — build it in the ENGINE, not in Prism

🔴 **Recommendation: DO NOT write marker-stripping JavaScript.** `doc-render-engine` already has
`cells.plain()` (`docrender/cells.py`), which extracts the plaintext of a marked cell. It exists
because `sort:` had to order rows without markup reordering the sheet. **The stripper is that function
applied to a whole file — it is written, tested and in production.**

A JS reimplementation is a **second implementation of one design**, which the engine's own log calls
strictly worse than one. It will disagree with the Python one the first time a marker nests.

**Proposed shape — a GENERATED sibling:**

```
02-courses/course-index.tsv         CANONICAL  · authored, carries markers
02-courses/course-index.clean.tsv   GENERATED  · emitted at build, markers stripped, never hand-edited
```

Why a sibling rather than stripping the download in place:

- ⚠️ **`01-utility/automatic-revision-log.md` states the opposite promise in Michael's own docs** —
  *"The table above is that file… the download link under it is that file, handed over whole. So they
  cannot disagree."* Silently serving a different file under the same link breaks that.
- A distinct filename makes the transform visible. `.clean` says what happened to it.
- It fits the canonical / generated / projection taxonomy exactly, and it is the same shape as
  `automatic-revision-log.tsv`, which is already generated.

**Then Prism needs nothing for this ask** beyond opening the clean file, which it already does.

⚠️ **Open, Michael's call:** does the page offer BOTH downloads (marked + clean), or only clean?
Two download links on one table is a small confusion; one link that is not the rendered file is a
bigger one.

---

## B · MDLens gains gold-template awareness

**The need is real and it is RESILIENCE:** when Pages is down or a build is broken, a markdown file
should still be readable and printable. Today MDLens renders it as plain markdown — the frontmatter
prints as a wall of text and the markers render as literal `[4]{.conf}`.

**Scope:**

1. **Frontmatter** — parse the `---` block, render it as a header card, never as body text.
2. **Marker classes** — `[text]{.conf}` / `{.verify}` / `{.was}` / `{.est}` paint from the same
   `theme/markers.tsv` vocabulary. **Read the classes; do not invent a second list.**
3. **Admonitions** — `!!! note "Title"` renders as a callout. Already the one block grammar this
   content set writes.

🔴 **AND THE HARD LIMIT, which must be built as a VISIBLE DECLINE rather than a silent gap.**

A browser cannot resolve `!!! data "catalog"` or `@term:` / `@data:` references. Those are Python
hooks reading the site's page graph at build time; the file on your desktop has no graph. **A JS
reimplementation would be a second rendering engine, and the two would drift.**

So MDLens **shows a placeholder** where an embed or a cross-reference would be — naming the slot, and
saying it resolves at build. **It must never render one wrong and it must never drop one silently.**
The engine's own rule for a dead `@term:` is the precedent: *renders as the broken-reference span,
never as an accessory.*

---

## C · Theme picker + print

**Theme picker: copy `on-track`, do not design one.** The ledger names it the reference
implementation — passive, reads `_themes.json` live, so new themes appear without an app edit.

⚠️ **Prism is NOT on the theme spine today.** It has a light/dark toggle in localStorage. Joining the
spine is the actual work, and it carries two known traps:

- 🔴 **`applyTheme()` takes a JOIN slug; the `data-theme` DOM attribute takes a COLOR slug.** Passing a
  colour to `applyTheme()` faults. It has bitten three apps.
- 🔴 **Boot must be `THEMES.applyTheme(slug)`, all four vectors.** `apply()` is colour-only and
  silently drops typography, forms and spacing.

**Print:**

- ⚠️ **A dark theme prints as a solid ink block.** Michael's default is dark. **Print must force the
  light vector regardless of the selected theme** — this is the whole reason a print button is not
  just `window.print()`.
- Print sheet: drop chrome, drawers and buttons; keep the frontmatter card; ensure tables do not clip
  at the page edge; `break-inside: avoid` on callouts.

---

## Size forecast (Sally, before the first write — not after)

| File | Now | After | Note |
|---|---|---|---|
| `prism.md.js` | 4,434 B | ~11–13 KB | frontmatter + markers + admonitions + declines. Still under the 15KB split line. |
| `prism.core.js` | 12,773 B | +~1 KB | theme picker wiring only |
| `prism.css` | **17,183 B** | **DO NOT APPEND** | already over the split line and **clips on a full read**. Print + markers go in a SIBLING sheet, same rule table styles already follow. |

---

## Sequence

1. **A** first — it is a build-time change in another repo and unblocks Excel immediately.
2. **B** next — the resilience win, and the biggest single chunk.
3. **C** last — theme is a pointer, and it goes last by house rule.

## Not in scope

Editing markdown in Prism. It is a viewer for this lane; TableLens edits tabular data because tabular
data has a schema. **A markdown editor is a different product and nobody asked for one.**
