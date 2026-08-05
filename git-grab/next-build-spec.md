# git-grab — next build spec

**Current:** **v1.3** (`APP_VERSION` + `?v=7`), PR #745. Waves 0-4 + the name-transform stage shipped.
**Next:** **v1.4 · the naming workbench** — the export options menu + editable filenames, below. ⚠️ SCOPED, NOT GREENLIT. Five rulings open.

Decision history: the ClickUp APPS task's **git-grab — Decision Log** subpage. Open questions get answered there (a checkbox in markdown is inert), resolved findings stay here.

---

## Known guardrails (read before touching anything)

1. 🔴 **A silently short zip is the only failure that matters.** Acceptance is `count on screen == entries in zip == count from GitHub`, with exclusions named. Everything else is a visible error.
2. 🔴 **`truncated: true` on the trees response means REFUSE**, loudly. Never ship a partial zip.
3. 🔴 **Filter tree modes `160000` (submodule/gitlink — no blob exists) and `120000` (symlink — the blob is the link target as text), and NAME them in the UI.** Dropping either quietly is failure mode #1.
4. **Pin the commit SHA once**, at parse time. Every later request uses it. No branch URLs — this repo has a long scar history of cache-frozen branch reads.
5. **Hostname allowlist wrapper.** `api.github.com` and `raw.githubusercontent.com` only; anything else throws. This is the app's entire trust claim and it must be readable in ten seconds.
6. **No new theme vector, no new canonical object, no colour literal.** If a token seems missing, raise it with the theme steward.
7. **`applyTheme()` takes a JOIN slug**, not a colour slug. `default-theme` is a colour, not a join.
8. **Five files stay split** — `zip.js`, `gh.js`, `names.js`, `view.js`, `app.js`. Each is a lane and each is under the 15KB line on its own.
9. 🔴 **The preview IS the correctness mechanism, not decoration.** Anything that changes a filename must change it **before the file table renders**, or the screen shows names the archive does not contain.
10. 🔴 **The generation counter in `app.js` (v1.2) is load-bearing.** Every async continuation captures `gen` and bails if superseded. Removing it lets one folder's zip be asserted against another folder's listing.
11. 🔴 **A rename never removes a file** (v1.3). `f.out` changes; `f.path` and the file's existence do not. The moment a transform can DROP something, both count assertions become meaningless and the app loses the only property it was built for.
12. 🔴 **git-grab RENAMES. IT DOES NOT CONVERT.** Every byte in the zip came out of the repo unaltered. This is the line the export menu is built against, and it is the reason the app can promise anything at all.
13. 🔴 **NOTHING IS AUTOMATIC. EVERY TRANSFORM IS OPT-IN AND SHIPS OFF.** A folder you grab without touching a control comes back byte-for-byte, name-for-name, as it is in the repo. That is the default and it is not negotiable — the moment an unrequested transform fires, every count on screen is describing something the user did not ask for.

---

## Next build — v1.4 · the naming workbench

⚠️ **SCOPED, NOT GREENLIT.** Two requests from Michael on 2026-08-04, and they are **one feature**: the file table stops being a report and becomes the place you decide what the archive is called.

---

### 0. The direct answer first: it is a BUTTON, and it is off

> *"I'm not sure if renaming all the index.markdown files is a button we press or if it happens automatically."*

**A checkbox, unticked, on the ready screen.** Both v1.3 transforms are opt-in and both ship off. Grab a folder, touch nothing, press download: you get exactly what is in the repo. **The panel does not even render if the folder holds no markdown.** That is now guardrail 13 rather than an implementation detail, because the question got asked — which means the app was not saying it loudly enough on screen.

**⏳ RULING NEEDED (cheap, unrelated to the rest): should the panel say so?** One line above the toggles — *"Nothing is renamed unless you ask. Untouched, this folder downloads exactly as it is."* Costs nothing, answers the question before it is asked.

---

### 1. Editable filenames — the typed third state

> *"The file names should be fields that I can edit directly in a mini file browser... I should be able to do it all in GitGrab!"*

**Yes, and it belongs here rather than anywhere else.** The table already shows every name, already previews every change, and already runs a collision planner over the results. An editable field is the smallest possible addition to a surface that was built for exactly this.

🔴 **First, the obvious objection, answered.** The Refused list says *"a general find-and-replace rename box — an arbitrary regex over entry names has an unbounded collision surface and no preview strong enough to defend it."* **A direct edit on one filename is not that, and the difference is not cosmetic:** a regex acts on files you did not look at, and its blast radius is discovered after the fact. A typed name acts on exactly one row, in front of you, with the result rendered in place and the planner re-running against it. **Bounded, visible, one file.** The refusal stands and this passes it.

#### 🔴 It introduces a state class the plan model does not have

Everything in v1.3 is **derived**: given `f.rel` and the options bag, the plan recomputes identically forever. That property is why toggling costs nothing and why off→on is byte-identical.

**A typed name cannot be derived from anything.** It is the first piece of state in this app that must be *stored* rather than *computed*, and every consequence below falls out of that one fact.

**Precedence, most specific wins:** `typed name` → `row option` → `master option` → `original`.

#### 🔴 A master toggle must NOT wipe a typed name

v1.3 clears per-row ticks when a master flips, deliberately: a two-state row with an invisible origin is confusing, and re-ticking a box is free.

**Re-typing a filename is not free.** Wiping typed work because someone flipped an unrelated master is the app throwing away something you cannot recover by clicking. So typed names **survive every master change**, which breaks the symmetry with ticks and therefore has to be visible: a typed row is **visually distinct** (marked as edited, with a **↺ revert** control) and the master toggle reports what it left alone — *"3 files you renamed by hand were not changed."*

#### 🔴 Collision handling INVERTS for a typed name

v1.3's rule: a rename that collides is skipped, the file keeps its original name, and it is flagged. **Correct for an automatic transform — wrong for an instruction you typed.**

An automatic rule silently falling back is a rule declining to act. **A typed name silently falling back is the app ignoring you**, and you would find out when the zip landed. So a colliding manual rename is a **loud, blocking, in-place error on that field**, naming the file it collides with. It does not revert, it does not disappear, and it does not let the download proceed until it is resolved. **The field stays wrong so you can fix it.**

#### 🔴 The validation table — the actual work in this feature

A typed name is untrusted input in a way a computed one never is, and **most of these fail on someone else's machine, weeks later**, which is exactly the failure class this app exists to prevent.

| Input | What happens unguarded | Rule |
|---|---|---|
| empty | entry with no name; `zip.js` throws and kills the whole download | **block**, keep the field focused |
| `..` segment | 🔴 **`safeName()` strips it SILENTLY** — the entry lands somewhere you did not type | **block at the field**, where it is visible |
| leading `/` | also silently stripped by `safeName()` | **block** |
| contains `/` | a folder move, which may be exactly what is wanted | **⏳ ruling — see below** |
| `< > : " \| ? *` | fine on macOS; **Windows refuses to extract the entry** | **block**, name the platform |
| trailing `.` or space | silently mangled or refused by Windows | **block** |
| `CON` `PRN` `AUX` `NUL` `COM1`-`COM9` `LPT1`-`LPT9` | reserved device names — **extraction fails on Windows even with an extension** (`CON.txt` too) | **block**, and say why, because nobody knows this one |
| case-fold twin of another entry | macOS/Windows fold case, so one silently overwrites the other on extract | **block** — this is the collision rule above |
| no extension at all | opens as unknown; may be intentional | **warn, do not block** |
| non-ASCII (`café`, emoji) | fine — `zip.js` sets UTF-8 flag bit 11 | **allow**, and `NAMES.selftest()` already proves it |

⚠️ **The first three are the important ones and they share a shape: `zip.js safeName()` already sanitises them, so today they fail SAFELY BUT SILENTLY.** You would type `../notes.md`, get `notes.md`, and never be told. Validating at the field turns a silent correction into a visible one. **A guard that fixes your input without telling you is a guard that lies.**

**⏳ RULING NEEDED: is a `/` in a typed name a folder move, or a blocked character?**
Allowing it is genuinely useful (`index.md` → `archive/index.md` reorganises on the way out) and zip entries carry paths natively, so it costs nothing mechanically. But it means a text field can silently restructure the archive, and the table is sorted by name so the row would appear to jump. **Recommendation: allow it, render the moved row with its new path highlighted, and count moves separately in the summary** — *"4 renamed, 1 moved."*

#### 🔴 Typed name vs the format dropdown: split the STEM from the EXTENSION

The two features collide precisely here, and this is why v1.4 is one build rather than two.

If you hand-rename `notes.md` → `meeting-2026-08-04.md` while the master markdown→`.txt` option is on, what wins? Two models:

- **A · you edit the whole name, and it is final.** Intuitive, but a hand-rename silently opts that file out of the format option — a second invisible-origin problem, exactly what the *Same as above* label was invented to kill.
- **B · you edit the STEM. The dropdown owns the extension.** They compose: rename the stem, the format option still applies. `meeting-2026-08-04.txt`.

**Recommendation: B**, with the extension rendered as static text immediately after the input so it is obvious at a glance which half you own and which half the dropdown owns. It also makes the validation table shorter — half the extension hazards cannot be typed at all.

#### Mechanics that matter

- **Commit on blur or Enter. NEVER on keystroke.** Re-planning per character re-runs the collision pass over the whole listing on every letter, and worse, a half-typed name is transiently colliding and transiently invalid — the field would fight you as you type. Escape reverts the field.
- **`rows[rel]` grows from a boolean to a record** (`{ opt, name }`), still keyed on the original name, still the sole input to `plan()`. **Idempotence survives**: same options bag in, same plan out. The bag just has more in it.
- **Delegated listener, same as v1.3.** `change` on `#ggOut` already catches inputs; no new wiring, and the in-place patching that keeps a checkbox from being destroyed mid-click keeps a text field from losing its cursor.
- **300-row cap unchanged**, and now it has teeth: rows past it cannot be hand-renamed. If a rename-by-hand session ever needs row 400, that is the moment to talk about virtualising, not before.

#### ⚠️ "Mini file browser" — where the line is

The file table **is** the mini browser, and making its names editable is the ask. A **folder tree with expand/collapse** is a different thing and it is on the Refused list as *repo browsing*. Not sneaking across that line inside a rename feature: if a tree is wanted, it gets its own ruling with its own reasons.

#### Acceptance (must be able to fail)

1. Hand-rename one file, download, and the zip entry carries the typed name.
2. Type a name that collides → **blocking error naming the other file**, download disabled, nothing silently reverts.
3. Type `../escape.md` → **blocked at the field**, not silently corrected to `escape.md`.
4. Type `CON.txt` → blocked with the Windows reason stated.
5. Flip a master toggle → typed names **survive**, and the summary says how many were left alone.
6. Revert a typed row → returns to exactly its computed name, and the plan matches a session where it was never typed.
7. `café.md` hand-renamed to `résumé.md` survives into the archive intact.

#### Size forecast (Sally, before the write)

`view.js` is **13,853 B** and this adds an input, an error slot and a revert control per row. It crosses 15KB. **The validator is pure logic and belongs in `names.js` (12,439 B) regardless**, which absorbs most of it; if `view.js` still crosses, the seam is **panel markup vs table markup**, and it gets cut deliberately rather than discovered on the write. `gh.js` is untouched by all of this — it still reads `f.out` on one line.

---

### 2. The export options menu

He is right about the control and right about the generalisation. **The checkbox was always a degenerate dropdown** — it worked only because markdown happens to have exactly two destinations (`.txt`, or leave it). The instant a family has three, the checkbox breaks. Building the dropdown now is cheaper than building it later, and the registry underneath it is the part that actually matters.

But the same request bundles two operations that are NOT the same thing, and the whole design turns on separating them.

#### 🔴 The line: RENAME vs CONVERT

| | Tier A · RENAME | Tier B · CONVERT |
|---|---|---|
| Example | `.md` → `.txt` | `.tsv` → `.csv` / `.json` / `.xlsx` |
| Bytes | **identical** | **rewritten** |
| Reversible | rename it back | maybe, maybe not |
| In the zip | the repo's file | a file that does not exist in the repo |
| Can it lose data | no | yes, and quietly |

v1.3 is entirely Tier A, and that is why it was safe to ship in an afternoon.

**RECOMMENDATION: git-grab offers Tier A only. Tier B is Prism's lane.** Three independent reasons, any one of which is sufficient:

**1. It breaks the app's founding premise.** `zip.js` is ~250 hand-written lines with a comment explaining exactly why: *"this app exists because Michael did not want to hand a third party's page a GitHub token. Vendoring a zip library would satisfy that on a technicality while re-introducing a supply chain."* True `.xlsx` needs SheetJS. Adding it puts back precisely the dependency the app was built to eliminate — and it would be the only third-party code in the bundle.

**2. It breaks the correctness bar.** The promise is *the zip is what the repo has, and the count proves it.* A rename preserves that: same bytes, different label. A conversion does not — the archive now holds derived artifacts, and `zip entries == listing count` stops being a statement about completeness and starts being a coincidence. **Guardrail 11 was written for exactly this pressure.**

**3. Excel's type coercion is a silent data destroyer**, and silent corruption is the one thing this app is religious about. Leading zeros stripped (`00742` → `742`). Dates reformatted to the machine locale. Long numbers to scientific notation. A cell starting with `=` becomes a formula. `TRUE`/`FALSE` become booleans. Every one of those is invisible until the file matters. **Shipping a quiet corrupter inside the app whose entire thesis is "no quiet corruption" is backwards.**

⚠️ **And a fact worth having before anyone says "just do what Prism does":** Prism's Excel export is **an HTML table with an `.xls` extension**, not a real workbook. *True `.xlsx` via SheetJS* has been open on its roadmap since v1 and is still open at v3.2. So the shortcut is to ship a fake xlsx from a second app.

**⏳ RULING NEEDED.** Tier A only (recommended), or does git-grab grow a converter?

#### 🔴 "Prose" is the wrong family. The predicate is PLAIN-READABLE.

Michael grouped *"Markdown, RTF, or other generic text files."* **RTF does not belong in that group, and it is the most useful thing to catch before building.**

The test is not *is this text-ish*. It is: **does the file read correctly with no renderer at all?**

- **Markdown passes**, and that IS the premise. `# Heading` and `**bold**` are readable as-is; markdown is prose that happens to carry markup.
- `.rst`, `.txt`, `.json`, `.yaml`, `.xml`, `.csv`, `.tsv` pass. Ugly in places, never unreadable.
- 🔴 **RTF FAILS.** A `.rtf` opens as `{\rtf1\ansi\deff0{\fonttbl{\f0 Times;}}\par\f0\fs24` wrapped around the words. It is the **inverse** of markdown: markup that happens to contain prose. Renaming it to `.txt` takes a file that opens correctly in TextEdit, Word and Pages *today* and turns it into a screenful of control words. **That is a downgrade dressed as a convenience.**
- `.docx`, `.odt`, `.pages`, `.ipynb` fail harder — they are zips or JSON containers. Renaming one to `.txt` yields binary noise.

So the family is **`plain-readable`**, and the predicate is one line that anyone can apply to a new extension without asking. It also explains v1.3's index rule as a general case rather than a special one: **code is not plain-readable in the sense that matters, because its correctness depends on its name.**

#### The registry — the actual architectural change

`names.js` currently hardcodes two regexes. Replace them with a table. **Adding RTF, or `.adoc`, or anything else, becomes a ROW rather than a function**, and the reasoning travels with the data:

| Family | Extensions | Offered | Why |
|---|---|---|---|
| `plain-readable` | `.md` `.markdown` `.rst` `.adoc` `.org` | leave as-is · `.txt` | reads fine with no renderer |
| `already-plain` | `.txt` `.text` | leave as-is | nothing to offer |
| `structured-text` | `.json` `.yaml` `.yml` `.xml` `.toml` | leave as-is · `.txt` | readable, but the extension is load-bearing for tooling — **offered, not defaulted** |
| `tabular` | `.tsv` `.csv` `.psv` | leave as-is | Tier B lives here. See the ruling. |
| `rich-text` | `.rtf` `.docx` `.odt` `.pages` | **leave as-is, no options** | renaming produces garbage |
| `code` | `.html` `.js` `.py` `.css` `.ts` `.rb` `.go` … | **leave as-is, no options, ever** | the name is part of how it runs |
| `binary` | everything else | **leave as-is, no options** | — |

**An empty option list is a real answer, not a gap.** Three families have one deliberately, and each carries its sentence.

⚠️ **The `code` family blocks the DROPDOWN, never the typed field.** A hand-rename is an explicit instruction about one file; the family rules exist to stop a bulk transform doing something destructive nobody looked at. If you want to rename an `index.html` by hand, that is your call and the app should not argue.

#### 🔴 Format and naming are two different decisions and must not share a control

The v1.3 index rename is **not** a format option. It changes what a file is CALLED for disambiguation; it says nothing about what the file IS. Folding it into a format dropdown is a category error that will confuse every future reader.

So the panel has two sections:

- **Format** — one dropdown per family *actually present in this listing*. A folder of md + tsv + js shows two dropdowns and no control on the js rows. Zero families with options = **no panel at all**, exactly as v1.3 already does when a folder holds no markdown.
- **Naming** — checkboxes, cross-cutting. `index.md` → `<folder>_index` lives here, and any future naming rule joins it.

#### Inheritance has to be VISIBLE

v1.3 sidestepped it: flipping a master wipes the per-row overrides, because a two-state row whose state has an invisible origin is confusing. With *n* options that dodge stops being enough.

**The fix is in the option label, not in more UI.** A row's select reads `Same as above (.txt)` as its first option rather than showing a blank or a duplicate. Inheriting and overriding then LOOK different at a glance, and the master's current value is legible from any row without scrolling back up. Keep the wipe-on-master-change for OPTIONS — but see above: **typed names are exempt.**

#### What generalises for free

- **The two-round collision planner is already name-based.** Any transform that produces a target name feeds it unchanged — including a typed one. This is the reusable part of v1.3 and the reason both halves of v1.4 are mostly data changes.
- **`plan()` already takes an options bag and derives everything from `f.rel`.**
- **`f.out` is already the single seam.** One line in `gh.js` reads it. Nothing else in the pipeline needs to know either feature exists.
- **`NAMES.selftest()` extends by table** rather than by hand-written case, once families are data.

#### ⏳ The only shape in which Tier B could ever live here

Recorded because it is genuinely defensible and someone will re-derive it later: **a converted file could be an ADDITION rather than a replacement.** `data.tsv` AND `data.csv` both in the zip. Nothing from the repo is altered or lost, so guardrail 12 survives — but the done panel then needs a third number, *"142 from GitHub, 142 in the zip, plus 3 generated,"* and the repo count still has to match exactly on its own.

It works. It is still not recommended, because reasons 1 and 3 above are untouched by it: a real `.xlsx` still needs a vendored library, and Excel still eats leading zeros whether the original file is next to it or not.

#### If the answer is "convert"

Then it does not belong in git-grab, and the shape is a **handoff, not a feature**. Prism is already the workbench that reads TSV/CSV/JSON and writes the others; it is honest about being an editor, which git-grab is not. The seam is named in Scratch below: `shared/gh-fetch.js` is *"deliberately not built — one consumer is not a shared module."* **A Prism "open from a GitHub URL" source adapter is the second consumer, and that is the moment the extraction is justified.** Cheapest useful version in the meantime is one line under a tabular file: *need this as CSV or Excel? Open it in Prism* — zero code, correct routing, and it teaches the app matrix.

---

### ⏳ RULINGS NEEDED (all five)

1. **Tier A only?** (recommended) Or does git-grab convert?
2. **RTF** — accept the `rich-text` family with no options? (recommended) Or force it into `plain-readable` and accept that `.txt` shows control words?
3. **`structured-text`** (`.json`, `.yaml`, `.xml`) — offer `.txt` at all? Offered-but-never-defaulted is the middle path.
4. **A `/` in a typed name — folder move, or blocked?** (recommended: allow, highlight, count moves separately)
5. **Stem-only editing with the extension owned by the dropdown** (recommended), or whole-name editing that opts the file out of its format option?

Plus the cheap one: **a "nothing is renamed unless you ask" line above the panel?**

---

## In review

Nothing.

---

## Futures (approved shape, not scheduled)

### v2 · private-repo gate

Token UI appears only when needed. In-memory by default; `sessionStorage` behind an explicit opt-in, **never `localStorage` unless asked**; visible "token active" pill with one-click wipe; fine-grained PAT, contents-read-only, scoped to the repo.

⚠️ **The gate can never truthfully say "this repo is private."** GitHub returns **404, not 403**, for a private repo you are not authenticated for — it refuses to confirm existence. Copy must hold both possibilities: *"Couldn't reach that path. It may not exist, or it may be private."* Same message a typo earns.

The seam is already in place: `ghFetch()` takes an optional token argument and threads it into the header builder even though nothing passes it.

---

## Shipped

### v1.3 · the name-transform stage (PR #745)

Two export options Michael asked for, built as ONE seam rather than two features: a rename pass over the zip entry name, in `names.js`, planned before the file table renders.

- **`.md` / `.markdown` -> `.txt`**, and **`index.md` -> `<parent-folder>_index.md`.** Master toggle for each, plus per-file ticks in the table. Index rename runs first, so `docs/index.md` becomes `docs/docs_index.txt` and not something that has to recognise `index.txt`.
- 🔴 **MARKDOWN ONLY, AND THAT IS A SAFETY RULE.** `index.html` is the directory default — rename it and an extracted site folder stops loading. `index.js` is worse: module resolution finds `foo/index.js` for `require("./foo")`. Same shape as `__init__.py`. The rename is a documents convenience and it is destructive on code.
- 🔴 **A COLLISION SKIPS ONE RENAME AND KEEPS BOTH FILES** (Michael: *"it's not like we're refusing all markdowns!"*). Two-round planner: stayers reserve their names, then movers claim in listing order, and a mover whose target is taken keeps its own name and is flagged in the table. Nothing is excluded, so the count assertions never move.
- **Toggling costs zero API calls.** Every plan is derived from `f.rel`, never from `f.out`, so it is idempotent and off->on is byte-identical. That matters: the unauthenticated budget is 60 calls an hour and a checkbox that re-listed the tree would eat it.
- **`view.js` split out of `app.js`** at the reducer/render seam. `app.js` was 14,841 B against the 15KB line and the UI would have pushed it over.
- **`NAMES.selftest()` runs on the Self test page** beside `ZIP.selftest()`, covering all six acceptance criteria. It caught a real bug before ship: a `[^\w]` scrub in `parentName()` turned `café` into `caf-`.

### Waves 1-4 (PRs #713 -> #722)

Specs removed rather than archived, because a Futures block describing running code is worse than no block at all. What survives lives in the guardrails above and in `README.md` ▸ Infrastructure.

- **Wave 1 · `zip.js`** — hand-written ZIP container writer, CRC32, deflate-raw with a stored fallback, UTF-8 flag bit 11, Zip-Slip-safe paths, plus a `selftest()` that parses its own output back out.
- **Wave 2 · `gh.js`** — URL parse (slashed branch names resolved against the real branch/tag lists, never split-and-guess), ref → commit SHA pinning, one recursive trees call, `truncated` refusal, gitlink/symlink exclusion with a named list.
- **Wave 3 · `app.js`** — one `job` record, every stage job-in/job-out, preview before download, concurrency pool of 8.
- **Wave 4 · polish + adversarial pass** — reset path, five distinct error sentences, size guards (warn 100MB / confirm 250MB / refuse >1GB), 320px mobile, `CONFORMANCE.md` audit. The generation counter came out of this pass.

---

## Refused — do not add these without a real wall to point at

- **Streaming / Web Worker / File System Access API.** All three solve the big-folder problem properly and all three triple the app. The byte guard covers the real case.
- **Infinite retry.** One retry with backoff, then fail with a name. Infinite retry turns a rate limit into a hang.
- **A caching layer.** You download a folder twice a month.
- **Repo browsing** (a folder tree with expand/collapse), **file preview, multi-folder zips, download history, globs.** One input, one output. If a feature needs the word "also," it is not this app. ⚠️ **The v1.4 editable field is NOT this** — the flat file table is the browser, and making its names editable does not make it a tree.
- **A general find-and-replace rename box.** An arbitrary regex over entry names has an unbounded collision surface and no preview strong enough to defend it. ⚠️ **A typed name on ONE row is not this either**, and the distinction is written out in v1.4 §1: a regex acts on files you never looked at, a typed name acts on the row in front of you.
- **Renaming anything that is not markdown, in BULK.** ⚠️ v1.4 would replace this with the family registry — the rule survives, the mechanism changes, and it constrains the dropdown only. A hand-rename of a single file is always allowed.
- **Vendoring any third-party library, for any reason.** `zip.js` was written by hand rather than imported, and the header says why. The first `<script src="https://cdn...">` in this app deletes its entire justification.

---

## Scratch intake

- **Per-file controls stop at the 300-row render cap.** Rows past it follow the master toggles and the table says so. v1.4 gives the cap teeth — a row past it cannot be hand-renamed — and that is the first real argument for virtualising the table. Not yet.
- `shared/gh-fetch.js` extraction — **named, deliberately not built.** If Prism ever gets an "open from a GitHub URL" source adapter, it needs exactly this fetch layer, and that is the moment to extract. Not before: one consumer is not a shared module. `gh.js` stays DOM-free so the extraction is a file move rather than surgery. ⚠️ **The Tier A/B ruling may create that second consumer.**
- **`names.js` is a candidate for the same treatment** and for the same reason it should not move yet. It is pure, dependency-free and would drop into any app that hands a user a file. ⚠️ **The v1.4 filename validator makes it more broadly useful, not less** — every app that lets a user name a file needs the Windows reserved-name check, and almost none of them have it.
- **`gh.js` is 15,216 B** — a hair over the 15KB split line, self-caught on read-back during the v1.3 ship after two comment trims. Next split candidate. The clean seam is **resolve/list** (parseURL, resolveRef, listTree) vs **fetch** (rawURL, grabOne, fetchAll) — and that second half is exactly what `shared/gh-fetch.js` would be, so the split and the extraction are the same cut made once.
- The zipball-and-extract shortcut (`api.github.com/.../zipball` → unzip → filter → re-zip) was **struck during planning**, not tested. It rested on an untested CORS assumption about `codeload.github.com`. If rate limits ever actually bite, test it before designing it in.
- **`og.png` still does not exist** though the head tags point at it. Binary files cannot go through the agent write path; drop a 1200×630 PNG at the app root via the GitHub UI.
