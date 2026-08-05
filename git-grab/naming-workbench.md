# git-grab v1.4 — the naming workbench

⚠️ **SCOPED, NOT GREENLIT.** Design detail for the next build. State, guardrails and refusals live in [`next-build-spec.md`](next-build-spec.md) — **read that first**; this file assumes it.

Four asks from Michael on 2026-08-04, and they are **one feature**: the file table stops being a report and becomes the place you decide what the archive is called.

1. Per-type **export dropdowns** instead of a checkbox.
2. **Editable filenames**, typed directly in the table.
3. **Append the full path** to a filename.
4. **Flatten the tree** into one folder.

---

## 0. The direct answers first

**"Is renaming index files a button or automatic?"** → **A checkbox, unticked.** Nothing in this app has ever fired on its own. Guardrail 13. The panel does not even render for a folder with no markdown. ⏳ *Cheap ruling: add a line above the panel saying so?* The question getting asked is evidence the app is not saying it.

**"File renaming is something I can do by default."** → Read as *the field is always there*, and that is compatible with guardrail 13: **a control being available is not a transform firing.** The field sits on every row, prefilled with the current name, and changes nothing until you type.

**"Handle all the conversion on the back end."** → 🔴 **There is no back end.** Every line runs in your tab, and that IS the security claim — no server sees your URLs, and nothing is uploaded anywhere. Moving work "into the code" does not change what a conversion is: rewriting bytes the repo does not contain. Guardrail 12 stands, and §5 is the full argument.

---

## 1. Path-append and flatten are ONE feature, and this is the sharpest thing in the document

Michael proposed them as two ideas. They are two halves of one mechanism, and each is nearly useless without the other.

**Flatten alone is a collision massacre.** A real docs tree has `guides/head-electrician/index.md`, `guides/sound/index.md`, `guides/rigging/index.md`. Drop the folders and all three become `index.md`. The v1.3 planner would let the first one through and block two — technically safe, practically a disaster, and a report full of failures rather than a useful archive.

**Path-append makes collisions mathematically impossible.** Not unlikely: *impossible*. Guardrail 14 — two files can share a name, they cannot share a path. If the flattened name is derived from the full path, uniqueness is inherited from the thing that was already guaranteed unique.

> 🔴 **Therefore: flatten REQUIRES path-append, and in that mode the collision planner is PROVABLY a no-op.** The riskiest machinery in the app goes quiet exactly where the feature looks most dangerous. That is worth building.

**And the free property that makes it genuinely good rather than just convenient:** a flat list sorted by name reproduces the tree's depth-first order. `guides-head-electrician-phase-zero.md` sorts next to `guides-head-electrician-callsheet.md` and both sort under `guides-`. **You do not lose the organisation, you encode it in the name.** Michael: *"the file tree would be relegated to one solid list organized by file name instead."* That works because of this, not by accident.

### The two controls

| Toggle | Does | `guides/head-electrician/phase-zero.md` becomes |
|---|---|---|
| *(neither)* | nothing | `guides/head-electrician/phase-zero.md` |
| **Append path to name** | renames in place, tree intact | `guides/head-electrician/guides-head-electrician-phase-zero.md` |
| **Flatten into one folder** | forces append on, drops folders | `guides-head-electrician-phase-zero.md` |

**Flatten implies append and the UI must SAY so** — tick flatten and the append box ticks itself, disabled, with *"required for flattening: without it, every index file in the folder collides."* A dependency that fires invisibly is the invisible-origin problem again.

### ⏳ RULING — the separator

Michael wrote it with spaces: *"guide head electrician phase zero pre-production."* Three candidates, and none is free:

- **Spaces** — reads best, breaks every unquoted shell command. Recommend against.
- **`-` hyphen** — matches how he said "hyphenated", but segments **already contain hyphens** (`head-electrician`), so the boundary between folder and file becomes invisible on read-back. Cannot be un-joined by eye or by script.
- **`_` underscore** — segment boundaries stay legible against hyphenated names, and it matches the `<folder>_index` convention v1.3 already shipped. **Recommended.**

`guides_head-electrician_phase-zero.md`. Ugly for about four seconds, then permanently legible.

### 🔴 The 255-byte wall, and it is BYTES not characters

Nearly every filesystem caps a single path component at **255 bytes**. Appending a deep path into one name is exactly how you hit it — and non-ASCII spends it faster, since `café` is 5 bytes for 4 characters. **A name that exceeds it fails at extraction time, on someone else's machine, which is this app's defining failure class.**

So: measure the encoded byte length, not `.length`. Over the line → **flag the row, keep the original name, name the actual number**. Never truncate silently; a truncated name can also collide, which would re-introduce the exact problem append exists to eliminate.

### 🔴 Flatten breaks every relative link, and it must say so once, loudly

`[see the rig plot](../rigging/plot.md)` resolves to nothing once the folders are gone. An HTML site folder is destroyed outright. Same species as the `index.html` rule, one level up: **flatten is for a pile of documents you are going to READ, never for a working tree you intend to USE.** One warning line when the toggle goes on. Not a block — it is a legitimate thing to want, he wants it for a real reason, and the app should say the cost once and then get out of the way.

---

## 2. Editable filenames — the typed third state

🔴 **First, the objection, answered.** The Refused list bans a find-and-replace rename box. **A typed name on one row is not that:** a regex acts on files you never looked at and its blast radius is discovered afterwards; a typed name acts on the row in front of you, rendered in place, with the planner re-running against it. Bounded, visible, one file. The refusal stands and this passes it.

### 🔴 It introduces the first state this app cannot DERIVE

Everything in v1.3 recomputes from `f.rel` + the options bag, forever, identically. That property is why toggling is free and why off→on is byte-identical. **A typed name cannot be computed from anything.** It must be *stored*, and every consequence below falls out of that one fact.

**Precedence, most specific wins:** `typed name` → `row option` → `master option` → `original`.

**A master toggle must NOT wipe a typed name.** v1.3 clears per-row ticks on a master change, correctly: re-ticking a box is free. **Re-typing a filename is not.** So typed names survive every master change — which breaks the symmetry and therefore must be visible. A typed row is marked as edited, carries a **↺ revert**, and the master reports what it left alone: *"3 files you renamed by hand were not changed."*

**Collision handling INVERTS.** v1.3: a colliding rename is skipped and flagged. Correct for an automatic rule — *wrong for an instruction you typed*. A rule declining to act is fine; **the app ignoring what you typed is not**, and you would find out when the zip landed. A colliding manual rename is a **loud, blocking, in-place error** naming the other file. It does not revert and does not let the download proceed. **The field stays wrong so you can fix it.**

### 🔴 The validation table — the actual work in this feature

A typed name is untrusted input in a way a computed one never is, and **most of these fail on someone else's machine, weeks later.**

| Input | Unguarded | Rule |
|---|---|---|
| empty | `zip.js` throws, killing the whole download | **block**, keep focus |
| `..` segment | 🔴 **`safeName()` strips it SILENTLY** — entry lands somewhere you did not type | **block at the field** |
| leading `/` | also silently stripped | **block** |
| contains `/` | a folder move — may be exactly what is wanted | ⏳ **ruling below** |
| `< > : " \| ? *` | fine on macOS, **Windows refuses to extract** | **block**, name the platform |
| trailing `.` or space | silently mangled or refused by Windows | **block** |
| `CON` `PRN` `AUX` `NUL` `COM1`-`9` `LPT1`-`9` | reserved device names — **extraction fails on Windows even with an extension** (`CON.txt` too) | **block** and say why; nobody knows this one |
| case-fold twin | macOS/Windows fold case → one silently overwrites the other | **block** |
| over 255 bytes | fails at extraction | **block**, show the count |
| no extension | opens as unknown; may be intentional | **warn, do not block** |
| non-ASCII | fine — UTF-8 flag bit 11 is set | **allow**; selftest already proves it |

⚠️ **The first three share a shape and it is the sharpest finding here: `zip.js safeName()` already sanitises them, so today they fail SAFELY BUT SILENTLY.** Type `../notes.md`, get `notes.md`, never be told. **A guard that fixes your input without telling you is a guard that lies.** Validating at the field turns a silent correction into a visible one.

**⏳ RULING: is `/` in a typed name a folder move or a blocked character?** Allowing it is useful (`index.md` → `archive/index.md` reorganises on the way out) and zip entries carry paths natively, so it is mechanically free. But a text field could then silently restructure the archive, and the table sorts by name so the row appears to jump. **Recommend: allow, highlight the moved row, count moves separately** — *"4 renamed, 1 moved."*

**⏳ RULING: stem-only or whole-name editing?** If you hand-rename `notes.md` → `meeting-2026-08-04.md` while markdown→`.txt` is on, who wins? **(A)** you edit the whole name and it is final — intuitive, but silently opts that file out of the format option, another invisible origin. **(B)** you edit the STEM, the dropdown owns the extension, and they compose → `meeting-2026-08-04.txt`. **Recommend B**, with the extension rendered as static text right after the input so it is obvious which half you own. It also shortens the validation table: half the extension hazards become untypeable.

### Mechanics

- **Commit on blur or Enter, NEVER on keystroke.** Per-character replanning re-runs the collision pass over the whole listing every letter, and a half-typed name is transiently invalid and transiently colliding — the field would fight you as you type. Escape reverts.
- **`rows[rel]` grows from boolean to record** (`{ opt, name }`), still keyed on the original name, still the sole input to `plan()`. **Idempotence survives**; the bag just holds more.
- **Delegated listener, unchanged.** `change` on `#ggOut` already catches inputs. The in-place patching that keeps a checkbox alive mid-click keeps a text field from losing its cursor.
- **300-row cap unchanged**, now with teeth: rows past it cannot be hand-renamed.

---

## 3. The metadata table

Michael: *"I want the file table to feel like a metadata reference table... the file extension could feel like a dropdown."*

**Columns:** name (editable stem + static extension) · **type** (a dropdown when the family offers options, static text when it does not) · size. Plus the second line already shipped in v1.3 showing what the entry will be CALLED.

**Format and naming stay separate controls.** The index rename is not a format option — it changes what a file is *called*, not what it *is*. Folding them into one dropdown is a category error. So: a **Format** section (one dropdown per family present in the listing) and a **Naming** section (checkboxes: index rename, append path, flatten).

**Inheritance must be visible.** A row's select reads `Same as above (.txt)` as its first option rather than a blank — inheriting and overriding then look different at a glance, and the master's value is legible from any row without scrolling.

---

## 4. The family registry

`names.js` hardcodes two regexes today. Replace with a table, so **adding a type is a ROW rather than a function** and the reasoning travels with the data.

🔴 **The predicate is not "is this text-ish." It is: does the file read correctly with NO renderer at all?**

Michael grouped *"Markdown, RTF, or other generic text files."* **RTF does not belong there.** A `.rtf` opens as `{\rtf1\ansi\deff0{\fonttbl{\f0 Times;}}\par` wrapped around the words — it is the **inverse** of markdown: markup that happens to contain prose, where markdown is prose that happens to carry markup. Renaming it to `.txt` takes a file that opens correctly in TextEdit, Word and Pages *today* and turns it into control words. **A downgrade dressed as a convenience.**

| Family | Extensions | Offered | Why |
|---|---|---|---|
| `plain-readable` | `.md` `.markdown` `.rst` `.adoc` `.org` | as-is · `.txt` | reads fine with no renderer |
| `already-plain` | `.txt` `.text` | as-is | nothing to offer |
| `structured-text` | `.json` `.yaml` `.yml` `.xml` `.toml` | as-is · `.txt` | readable, but the extension is load-bearing for tooling — ⏳ **offered, never defaulted?** |
| `tabular` | `.tsv` `.csv` `.psv` | as-is | §5 lives here |
| `rich-text` | `.rtf` `.docx` `.odt` `.pages` | **none** | renaming produces garbage |
| `code` | `.html` `.js` `.py` `.css` `.ts` … | **none, ever** | the name is part of how it runs |
| `binary` | everything else | **none** | — |

**An empty option list is a real answer, not a gap.** ⚠️ **A family blocks the DROPDOWN, never the typed field.** Bulk rules exist to stop unexamined destruction; an explicit instruction about one file is the user's call and the app should not argue.

---

## 5. Tier A vs Tier B — rename vs convert

| | Tier A · RENAME | Tier B · CONVERT |
|---|---|---|
| Example | `.md` → `.txt` | `.tsv` → `.csv` / `.xlsx` |
| Bytes | **identical** | **rewritten** |
| In the zip | the repo's file | a file the repo does not contain |
| Loses data | no | yes, and quietly |

**RECOMMENDATION: Tier A only.** Three independent reasons, any one sufficient:

1. **It breaks the founding premise.** True `.xlsx` needs SheetJS. `zip.js` is ~250 hand-written lines whose header says why: vendoring *"would satisfy that on a technicality while re-introducing a supply chain."*
2. **It breaks the correctness bar.** With derived artifacts in the archive, `zip entries == listing count` stops being a completeness statement and becomes a coincidence.
3. **Excel's type coercion is a silent data destroyer.** Leading zeros stripped (`00742` → `742`), dates re-localised, long numbers to scientific notation, a leading `=` becomes a formula. **Shipping a quiet corrupter inside the app whose thesis is "no quiet corruption" is backwards.**

⚠️ **Before anyone says "just do what Prism does": Prism's Excel export is an HTML table with an `.xls` extension**, not a real workbook. True `.xlsx` has been open on its roadmap since v1 and is still open at v3.2.

**The one shape Tier B could ever take**, recorded because someone will re-derive it: a converted file as an **ADDITION**, not a replacement — `data.tsv` AND `data.csv` both in the zip. Guardrail 12 survives, but the done panel needs a third number and the repo count must still match on its own. It works. Still not recommended: reasons 1 and 3 are untouched by it.

**If the answer is "convert," it is a handoff, not a feature.** Cheapest useful version today is one line under a tabular row: *need this as CSV or Excel? Open it in Prism.* Zero code, correct routing, teaches the app matrix.

---

## 6. "Does that make it part of Prism again?"

**No. And the test is one sentence: does the app need to know what is INSIDE the file?**

- **git-grab: never.** It moves opaque bytes. `fetchAll()` hands `zip.js` a `Uint8Array` straight off an `arrayBuffer` — the app has no parser for any format and never decodes a single file it packs. **It could pack a format that has not been invented yet.** Everything v1.4 adds operates on a *string that happens to be a filename*.
- **Prism: always.** Parsing content is the entire job. It reads TSV into cells, detects hex, edits values, writes formats back out.

**git-grab is a sandbox over NAMES. Prism is a sandbox over CONTENT.** Michael is right that it became a sandbox; that does not make it the same sandbox.

**Merging costs both.** Prism would gain a fetch layer and a ZIP writer it has no use for, and its bundle is already at the ceiling — `prism.css` is 17,183 B and **clips on a full read**, which is why its table styles had to go in a sibling sheet. git-grab would gain parsers, and with them the vendored dependency its existence is a protest against.

**The correct relationship is already written down**: `shared/gh-fetch.js`, extracted the day Prism gets an "open from a GitHub URL" source adapter. Two apps, one shared fetch layer, an explicit handoff between them. **git-grab gets it out of GitHub; Prism opens it up.** That is a clean seam and it is one line of routing, not a merge.

---

## 7. Acceptance (must be able to fail)

1. Hand-rename one file, download, the zip entry carries the typed name.
2. A colliding typed name → **blocking error naming the other file**, download disabled, nothing silently reverts.
3. `../escape.md` → **blocked at the field**, not silently corrected to `escape.md`.
4. `CON.txt` → blocked, with the Windows reason stated.
5. Flip a master toggle → typed names **survive**, and the summary says how many were left alone.
6. Revert a typed row → exactly its computed name, matching a session where it was never typed.
7. **Flatten a tree with three `index.md` files at different depths → three distinct entries, ZERO blocked renames.** This is the proof that append makes collisions impossible; a single block here means the derivation is wrong.
8. **Flatten, then sort by name → depth-first tree order.** The organisation survived the flattening.
9. A path appended past 255 bytes → flagged, original kept, the real number shown.
10. `café/index.md` hand-renamed to `résumé.md` survives into the archive intact.
11. **Every toggle off → the archive is byte-identical and name-identical to a v1.3 grab.** Guardrail 13, testable.

---

## 8. Size forecast (Sally, before the write)

`view.js` **13,853 B** — an input, an error slot, a revert control and a type dropdown per row **crosses 15KB**. The validator is pure logic and belongs in `names.js` (**12,439 B**) regardless, which absorbs most of it. If `view.js` still crosses, the seam is **panel markup vs table markup**, cut deliberately rather than discovered on the write. `gh.js` (**15,216 B**, already over) is untouched by all of this — it still reads `f.out` on one line.

⚠️ **This file is 20KB-ish against a ~22KB ceiling. If it grows, split it by feature.** Its parent hit 30,076 B tonight by accreting exactly this kind of section, twice, in one evening.

---

## ⏳ Rulings needed (eight)

1. **Tier A only?** (rec: yes) Or does git-grab convert?
2. **RTF** → `rich-text`, no options? (rec: yes)
3. **`structured-text`** — offer `.txt` at all? (rec: offered, never defaulted)
4. **`/` in a typed name** — folder move or blocked? (rec: allow, highlight, count separately)
5. **Stem-only editing** with the dropdown owning the extension? (rec: yes)
6. **Separator for appended paths** — `_` (rec), `-`, or spaces?
7. **Does flatten force append on**, disabled and explained? (rec: yes)
8. **A "nothing is renamed unless you ask" line** above the panel? (rec: yes, it is free)
