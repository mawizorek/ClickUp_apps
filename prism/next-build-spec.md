# Prism — next build spec

**Status: SCOPED, NOT GREENLIT.** r2, 2026-08-04. Nothing built. Ledger row stays v3.2.

> Michael, 2026-08-04:
> *"Prism should know what the renderer is building and read that same canonical file… when we add
> new features later — maybe department colors or something — we don't have to update the Prism
> reader… we are basically rebuilding our own version of a scripting markdown language with custom
> tags for custom properties."*

---

## The correction r2 makes to r1

r1 scoped *"teach MDLens about markers."* **That was the wrong altitude and Michael caught it.** Any
list of marker classes typed into `prism.md.js` is a **second copy of a vocabulary the engine already
owns**, and it rots the first time a class is added. Same defect as `tokenKeys`, as `data:` declared
twice, as the lede declared three times.

**The correct frame: Prism does not learn the vocabulary. Prism READS it.**

---

## 🔴 The seam, and it is DATA vs CODE

This is the line the whole design rests on, so it is stated before any file list.

**The renderer is two things stacked:**

| Layer | Lives in | Can Prism share it? |
|---|---|---|
| **VOCABULARY** — which marker classes exist, what colour each is, what shape, which prefixes are reserved, which slots a type allows | **TSV + YAML**, declarative | ✅ **YES. Fetch it.** |
| **RESOLUTION** — turning `@data:x` into a link by walking the site's page graph | **Python**, at build time | ❌ **NO. There is no graph in a browser.** |

⭐ **Michael's ask lands entirely in the first row, which is why it works.** "Department colours"
is a new ROW in a TSV. A shared-vocabulary Prism picks it up with **zero code changes**, exactly as he
said. ⚠️ A new *kind* of thing — a new prefix family with its own resolution rules — still needs a JS
renderer, and pretending otherwise is how the second engine gets built by accident.

---

## 🌟 THE DIALECT MANIFEST — the piece that makes this scale

**The engine already derives its own vocabulary and does not hand-type it.** `docrender/prefixes.py`
(J8) is a **derived** reserved-prefix registry: each hook declares the prefix it owns via
`prefixes.claim(...)` at import, and the list is assembled from those declarations. J8's whole
argument was *derive it, never type it.*

**So the build already knows the complete vocabulary. It just never writes it down.**

**Proposal: the build emits `dialect.json`.** One generated file, derived from what is already in
memory at build time:

```
marker classes   ← theme/marker-classes.tsv + theme/markers.tsv
reserved prefixes ← prefixes.py's registry (derived, not typed)
colour tokens    ← theme/colors.tsv
data slots       ← objects/*.yml
admonition types ← mkdocs.yml + the reserved `data` type
```

**Prism fetches that one file and knows the entire dialect.** Add a marker class, add a prefix, add a
department colour — regenerate, and **Prism knows about it without a commit.** That is the literal
answer to *"we don't have to update the Prism reader."*

**Why a manifest rather than Prism fetching five TSVs directly:**

- One request, one shape, one cache key.
- **It is the only version that also carries the DERIVED half.** `prefixes.py`'s registry is not a
  file Prism could fetch — it only exists once Python has imported the hooks.
- It is honest about staleness: stamp it with the build time, and Prism can say *"dialect as of X."*

⚠️ **And it must be GENERATED, never authored.** A hand-written `dialect.json` is the fourth
hand-maintained index in a system whose thesis is that hand-maintained indexes rot.

---

## 🚨 BLOCKER FOUND WHILE SCOPING: there are TWO `colors.tsv`

Measured at HEAD, 2026-08-04:

- **`doc-render-engine` → `theme/colors.tsv`** · 3,628 B · nine tokens · what the docs site paints from.
- **`ClickUp_apps` → `shared/themes/colors.tsv`** · the 4-vector app theme spine · what `on-track`,
  `f1-racetracks`, `git-grab` and `inciardi-collection` paint from.

**They are different files, in different repos, with different token sets** — the engine's log already
notes `accent-soft` is *"absent from this engine's nine-token colors.tsv."*

🔴 **So "read the same canonical file" has no answer today for colour, and picking wrong builds the
exact drift this whole architecture exists to prevent.** Three options, Michael's call, **not ours:**

1. **The engine's TSV wins for document rendering**, the app spine wins for app chrome, and Prism holds
   both — a doc renders in doc colours inside an app themed in app colours. Honest, and two vocabularies
   stay two.
2. **One shared colour source**, one repo, both consume it. Cleanest end state, largest migration, and
   it touches four live apps.
3. **Defer.** Prism reads the engine's TSV for document content only, and the app spine question stays
   open. Cheapest, and it does not foreclose 1 or 2.

**Recommendation: 3 now, 2 as the end state.** Do not migrate four live apps to unblock a print button.

---

## Files this touches

### `doc-render-engine` — the emitters

| File | Change | Why |
|---|---|---|
| **NEW** `docrender/dialect.py` | emit `dialect.json` at build | ~3–4 KB. Reads registries already in memory; writes one file. |
| `docrender/prefixes.py` (4,385 B) | expose the registry for read | Small. It already holds the map; nothing today can ask it for the whole thing. |
| `mkdocs.yml` | register the hook | One line. ⚠️ Its own comment records a hook that has been dead exactly this way. |
| **NEW** `docrender/clean.py` *(or a flag on the datatable hook)* | emit `<name>.clean.tsv` beside every marked TSV | **Wraps `cells.plain()`, which already exists.** Do not write a stripper. |
| `objects/reference.yml` | ✅ already done — `catalog` slot, PR #53 | — |

⚠️ **`docrender/datatable.py` is 16,410 B and `docrender/markers.py` is 16,241 B.** Both near the line.
**The clean-emitter goes in its own module; do not append to either.**

### `prism` — the reader

| File | Now | Change |
|---|---|---|
| **NEW** `prism.vocab.js` | — | ~4–6 KB. Fetches + caches `dialect.json`, exposes `V.markerClass()`, `V.colour()`, `V.isPrefix()`. **Both lenses read it; neither owns it.** Falls back to a labelled degraded mode if the fetch fails. |
| `prism.md.js` | 4,434 B | → ~10–12 KB. Frontmatter card · marker spans painted **from vocab** · admonitions · **visible declines** for `!!! data` and `@`-refs. |
| `prism.table.cell.js` | 6,842 B | +~1 KB. Its hex→swatch gate becomes a vocab lookup, so a marked cell paints the same as a marked sentence. **This is the file that makes Michael's hex-chip-in-prose case work in both directions.** |
| `prism.core.js` | 12,773 B | +~1–2 KB. Theme dropdown (copy `on-track`), print button, vocab boot. |
| **NEW** `prism.print.css` | — | ~2–3 KB. 🔴 **A SIBLING SHEET.** `prism.css` is 17,183 B and **clips on a full read** — appending to it is unsafe by the repo's own rule. |
| `index.html` | 11,303 B | 2 script tags, 1 link tag, `?v=` bump. |
| `README.md` | 14,839 B | Architecture + the vocab contract. |
| `VERSIONS.md` | 17,953 B | Prism row → v4, same session as the PR. |

**Untouched:** `prism.json.js` · `prism.table.js` · `prism.table.grid.js` · `prism.table.panels.js` ·
`prism.mobile.js` · `prism.table.css` · `prism.css`.

**Every new file is under the 15KB split line and no existing file crosses it.** Sally seated before
the first write, not after.

---

## The hard limits, written down before they are discovered

1. 🔴 **Prism cannot resolve `@`-references or `!!! data` embeds.** No page graph in a browser. It
   **declines visibly** — a placeholder naming the slot — and never renders one wrong or drops one
   silently. Precedent: a dead `@term:` renders as the broken-reference span, never as an accessory.
2. 🔴 **Print forces the LIGHT vector** regardless of selected theme. Michael defaults to dark and a
   dark theme prints as a solid ink block. This is why print is not `window.print()`.
3. ⚠️ **`applyTheme()` takes a JOIN slug; `data-theme` takes a COLOR slug.** Has faulted three apps.
4. ⚠️ **`dialect.json` is a snapshot.** Prism reads a published file; if the site has not rebuilt, the
   dialect is old. **Stamp it and show the stamp.**

---

## Where this lands long-term (Michael's *"see how this could grow"*)

He is right that this is a dialect. Naming it honestly changes what to build:

- **A dialect needs ONE published contract, not two implementations.** `dialect.json` is that contract.
  Python writes it; every consumer reads it. A third consumer — a ClickUp view, a FileMaker layout, an
  export script — costs a fetch, not a port.
- **The extension point already exists and is proven.** `prefixes.claim()` is how `@term:` shipped
  without touching `links.py`'s core. Department colours are a TSV row; a department *prefix* is a
  `claim()`.
- ⚠️ **The failure mode to design against is a SECOND RENDERER.** The moment JS starts resolving
  references rather than reading vocabulary, there are two engines and they will disagree. **The
  manifest is the wall that keeps that from happening by accident.**

## Sequence

1. `dialect.py` + the manifest. Unblocks everything and is testable alone.
2. `clean.py`. Unblocks Excel, independent of Prism.
3. `prism.vocab.js` + MDLens.
4. Cell-gate vocab swap.
5. Theme picker + print. **Theme last, by house rule.**

## Not in scope

Markdown EDITING in Prism. TableLens edits tabular data because tabular data has a schema. A markdown
editor is a different product and nobody asked for one.
