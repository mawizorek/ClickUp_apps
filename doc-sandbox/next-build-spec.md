# doc-sandbox — next build spec

**State:** ⚠️ SCOPED, NOT BUILT. Nothing exists in this folder but this file.
**Scoped:** 2026-09-18, from a Workshop round run 2026-09-17/18.
**Coordinate:** `mawizorek/ClickUp_apps@main` — this repo. 🚫 **NOT `doc-render-engine`.**

🚫 **NO VERSIONS.md ROW YET, AND THAT IS A MEASUREMENT RATHER THAN AN OVERSIGHT.** The ledger was **22,363 B** at the SHA this spec was written against, versus its own stated ~22,528 B ceiling — **165 B of headroom**, and its header already records a TRIM OWED of two parked row-moves. Adding a row would push the one file nobody may misread past the size where it can be read whole. **The row is owed the moment this folder holds an app; the trim is owed first.** See §9.

---

## 1. What this is

A browser tool that renders a single doc-render-format markdown file, or a single already-rendered page, with the **real** look of the published documentation sites — and prints it.

Michael, 2026-09-17:

> "a version of our standard doc renderer where I can upload a single markdown file written in our format and get the same layout properties (...) pulling default settings from a site selected in a dropdown to populate the header and images (...) basically creating an editable version of our renderer for a single page."

> "Its most basic and common function would be to avoid pulling up a full page. I could simply paste the raw text into the editor and get an export of our page nicely printed locally."

And on 2026-09-18, setting the bar: *"whatever it takes to make a realtime renderer of local content (...) typed or uploaded."*

**The primary job is PRINT.** Everything else serves getting one page onto paper looking like the real thing without waiting on a site build.

---

## 2. 🔴 THE MECHANISM, AND WHY THERE IS ONLY ONE

**The app reads a published page's `<head>`, reuses its stylesheet links verbatim in their existing order, and renders content into Material's DOM shape.**

Three independently sufficient reasons, all read out of `doc-render-engine@main` rather than assumed:

**a. Three of the stylesheets do not exist as files.** `docrender/assets.py:_plan()` inserts them between the screen group and the print group, built per build from the TSVs:

```
plan.append(("tokens.css", theme.build_css()...))   # what a colour IS
plan.append(("marks.css",  markers.build_css()...)) # which MARKER family uses it
plan.append(("blocks.css", blocks.build_css()...))  # which CALLOUT family uses it
```

There is nothing on disk to vendor. **Vendoring was never merely inelegant; it was impossible.**

**b. Every asset URL is content-fingerprinted and therefore unguessable.** `assets.py`: *"EVERY ASSET URL CARRIES A CONTENT FINGERPRINT — `assets/base.a41f7c92.css`. The URL changes when the bytes change."* No URL can be hardcoded.

**c. `--dr-*` tokens paint nothing on their own.** `assets/base.css` maps them onto Material's variables, and **Material does the painting**:

```
[data-md-color-scheme="slate"],
[data-md-color-scheme="default"] {
  --md-default-bg-color: var(--dr-surface);
  --md-typeset-color:    var(--dr-ink);
  --md-typeset-a-color:  var(--dr-link, var(--dr-accent));
  --md-code-bg-color:    var(--dr-surface-raised);
```

So the engine's CSS is a **patch layer on Material's stylesheet**, not a standalone one. Loading it into a blank page yields defined-but-unconsumed custom properties.

⭐ **And the `<head>` carries load ORDER, which is law in that repo with named live bugs attached.** `assets.py`: `chrome.css` before `base.css` and *"every dark-mode link reverts to Material's indigo"*; the print group before the generated sheets and *"paper comes out wrong with no error and no report"*; `data-list.css` must follow `data.css`. **A hand-assembled list is a chance to reintroduce one of those. A real `<head>` cannot get the order wrong.**

### Same origin, so no CORS and nothing to configure

Apps serve from `mawizorek.github.io/ClickUp_apps/<slug>/`; the doc sites serve from `mawizorek.github.io/<repo>/`. **One origin.** Includes `uritp-docs`, whose repo is private while its Pages site is public.

---

## 3. 🔴 THE TWO LEGAL COLOUR-SCHEME VALUES

The preview root **must** carry `data-md-color-scheme="slate"` or `data-md-color-scheme="default"`. **No other value matches anything** — the selector above is the whole gate.

⚠️ **Absent, and the sheet prints near-black.** This is a real bug the engine already shipped, diagnosed and fixed; `assets/print-md-bridge.css` exists solely because of it:

> Material writes `data-md-color-scheme` from **localStorage** (...) so a scripted print is the one reader for whom the toggle has never been touched.

**This app is exactly that reader.** Set the attribute explicitly; never rely on a toggle having been used. 🚫 Do not set it to a theme name — that is the failure the engine logged twice (`applyTheme()` taking a colour slug instead of a join slug).

---

## 4. Two input modes, two honest promises

| mode | input | fidelity |
|---|---|---|
| **Paste** | raw markdown, rendered on a debounced keystroke (~150 ms) | prose + callouts. **No frontmatter furniture.** |
| **Upload** | an already-rendered page (view-source or downloaded) | **full** — re-skin only, no parsing |

⭐ **Upload mode is the one that keeps the "same layout properties" promise**, because the content is already in Material's DOM shape. Paste mode is the fast preview. Naming them separately is what makes both honest.

### ⚠️ What paste mode structurally cannot produce

The document furniture is **frontmatter-driven**, so no markdown parser can emit it:

| element | source | paste mode |
|---|---|---|
| `.dr-lede` | `summary:` via `lede.py` | ❌ |
| `.dr-aka` | `also_known_as:` | ❌ |
| `.dr-revised` | `revised:` | ❌ |
| `.dr-spec` table | the page's `type:` + `objects/*.yml` | ❌ |
| `.dr-mark` colour | 🔴 written **inline on the span** by the hook from `markers.tsv` | ❌ renders `currentColor` |

**The banner wording is therefore "prose and callouts, no frontmatter furniture"** — not a feature list, which would rot.

⭐ **ONE FREE WIN, WITH AN EXPIRY DATE.** `base.css` still carries the pre-migration positional rule:

```
.md-typeset h1 + p,
.md-typeset .dr-lede { font-size: var(--dr-lede-size); ... }
```

So a pasted page whose first paragraph follows an H1 gets correct lede styling for free. ⚠️ That selector is documented as **temporary** and slated for deletion once the content tree finishes migrating. **Use it; do not depend on it.**

---

## 5. The site picker IS the theme picker

`assets.py:_plan()` ends:

```
site_css = _read(Path(state.INSTANCE.get("dir", ".")) / "theme.css")
plan.append(("site.css", site_css))
```

Loaded **last**, after the print group, because *"a site keeps the final word on its own look, and paper is no exception."*

⭐ **So one `<head>` read resolves palette + chrome + print + site overrides together. Two planned features collapse into one mechanism**, and `instances.json` shrinks to six `{name, url}` rows because everything else is resolved live.

### 🔴 Six themes, not twenty — RULED

Michael, 2026-09-18: *"Fine with just having the themes that we actually use on a published site."*

`tokens.css` is generated per build, so the only palettes reachable are whatever the six live instances currently render: `template`, `uritp`, `uritp-safety`, `theatre`, `hml`, `mawprose`.

🚫 **No client-side theme resolver.** `theme.py` stays the sole emitter of `--dr-*`. A JS reimplementation would be a **second claimant on one vocabulary** — the defect that retired `roster.json`, `registry.json` and `app-index.md` — and it would render rows the live sites do not: the engine's own J28 finding is that `theme.py:_shared()` filters typography to `theme == "base"`, so the `eos` and `database` rows **have never been emitted on any build.**

⚠️ **Live corollary, stated so it reads as design:** change a site's theme and this app's offering for that site changes with no edit here. **It is a mirror, not a copy.**

---

## 6. 🚫 `doc-render-engine` GETS ZERO COMMITS

Three proposals wanted to touch it. All three are dead:

| proposal | status |
|---|---|
| a `sandbox-bundle.css` CI step | 🚫 unnecessary — a published `<head>` **is** the bundle |
| publishing `tokens.css` per theme | 🚫 declined, §5 |
| hand-authoring a print sheet | 🚫 struck — see §7 |

⭐ **So the blast radius on every existing system is zero.** Nothing in the doc pipeline moves, so no live site can regress from this build.

---

## 7. Print comes free, and hand-authoring it was never viable

**10 print stylesheets publish, ~155.8 KB**, and they arrive with the `<head>` at no cost:

`print.css` (how wide it runs) · `print-chrome.css` (what appears at all) · `print-flow.css` (where it breaks) · `print-type.css` (how big the type is) · `print-space.css` (how much air) · `print-callout.css` (what the box is) · `print-identity.css` (whose document it is) · `print-ink.css` (what colour the marks are) · `print-md-bridge.css` (whether Material can see our palette) — plus `print-packet.css`, which ships in its own group.

⚠️ **`print-scheme.css` (1,938 B) is NOT among them.** It sits in `assets/` **unregistered on purpose** — a comment-only tombstone; `theme.py` emits the paper palette inside `tokens.css`. 🔴 **Counted from the DIRECTORY it reads as an eleventh sheet, and this spec's first draft made exactly that error.** Count from `_PRINT_ASSETS`, never from the folder. `assets.py`'s own warning: *"A file in assets/ absent from these tuples is never published and does nothing"* — a sentence that *"came true BY ACCIDENT once and cost every printed page for two days."*

**Print button prints the preview pane only**; `@media print` hides the editor pane outright.

---

## 8. v1 scope

### Ships

1. Two-pane layout — editor | preview. Preview-first vertical stack on mobile.
2. **Paste mode** — debounced realtime render (~150 ms).
3. **Upload mode** — re-skin a rendered page.
4. **Site picker** — six `{name, url}` rows; one `<head>` read resolves everything.
5. **Print** — preview pane only.
6. 🔴 `data-md-color-scheme` set explicitly to `slate` or `default`.
7. **Fidelity banner** in paste mode (§4 wording).
8. **`<head>`-read status** — which site, resolved or failed. ⚠️ A silent fallback that renders *slightly* wrong is the failure mode to design against; say which source is live.
9. `access: open` + `config.json`. Justified: no credentials anywhere, and pasted content never leaves the tab.
10. App chrome joined to `shared/themes` via `resolve.js`, per the `on-track` pattern. Default dark.

### Deferred — 🅿️ futures, not gaps

Batch/multi-file processing · editable chrome and logo swap · `!!! data` TSV tables · `{.marker}` attribute rendering · `@id` and `@peer:id` resolution · `chain:` navigation · frontmatter furniture (§4).

### Build order — 🔴 parser first, and this is a gate

1. **Build the markdown parser and test it against ~20 real pages** from the content repos, not toy examples. Measure the gap before any UI is wrapped around it. *If paste fidelity is poor, upload mode carries the promise and paste is labelled accordingly.*
2. `<head>` read + stylesheet injection + the scheme attribute. **Provable before any input layer exists** — point it at a live site and compare.
3. Site picker, then app-chrome theme join.
4. Two-pane shell, then upload mode.
5. Print pass, on paper, against a real printed sheet from a live site.
6. Ship paperwork (§9).

---

## 9. 🅿️ Owed before or at ship

1. 🔴 **`VERSIONS.md` row — and the TRIM it is blocked behind.** The ledger measured **22,363 B** against a ~22,528 B ceiling. Its header names the two parked row-moves (`f1-racetracks` ~2.7 KB, `inciardi-collection` ~2.8 KB, both marked *detail belongs in the app README*). 🚫 **Not done here: migrating another app's detail into that app's README is a different decision than scoping this one**, and doing it blind would mean writing claims about files not read at HEAD. **Michael's call, and it blocks the row rather than this spec.**
2. **A decision sidecar.** The arguments live in the Workshop session task on the 🟢 Agent Activity Board (*"Workshop the doc-sandbox app"*, 2026-09-17/18) — nine seated voices, Frank's NET-NEW verdict, and the rulings. 🚫 **Deliberation does not belong in a spec.** If this file starts accumulating arguments, cut a `doc-sandbox/decision-log.md` and move them.
3. **Session board row cleared** at close (`session-board.md` rule 7).

---

## 10. ⚠️ Known limits, stated now rather than discovered

- **No page chrome.** Material's header, sidebar and TOC are not reproduced. This renders the **content column**. Correct for print; worth knowing before expecting a full-page mockup.
- **A `<head>` read is a live dependency.** If a site is mid-deploy or unreachable, the app degrades — and must **say so** (§8.8) rather than render something plausible.
- **`status: gated` does not exist in the engine** and nothing here changes that.
- 🔴 **Paste-mode fidelity is UNMEASURED.** No parser has been written or tested. Every claim in §4 about what paste mode can do is a **design intent**, not a measurement, until step 1 of the build order runs. **A session reading this file before that step must not quote §4 as a result.**

---

## 11. Findings raised in passing, not fixed here

🚩 **`audio-compressor/` is unindexed.** It is a root folder in this repo and appears **neither in `VERSIONS.md`'s table nor on its non-app line**, which that file's own coverage rule forbids: *"every folder in the repo root is either in the table above or on the not-apps line (...) An app nobody indexes is an app nobody verifies."* 🚫 **Not stamped here** — the ledger's own rule is never to write a version or a claim about files not read back at HEAD, and this session did not read that app. **Named so it stops being invisible.**
