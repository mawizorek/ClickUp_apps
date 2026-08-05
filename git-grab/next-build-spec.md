# git-grab — next build spec

**Current:** **v1.2** (`APP_VERSION` + `?v=6`), Waves 0-4 shipped, PRs #713 → #722, verified end-to-end by Michael 2026-08-03.
**Next:** the **name-transform stage** below — ⚠️ SCOPED, NOT GREENLIT.

⚠️ **Doc rot corrected 2026-08-04.** This file's header said *"v0.1 (Wave 0 scaffold). Next: Wave 1 — `zip.js`"* and its Futures block listed Waves 2-4 as unbuilt — **nine PRs after all four shipped**. `README.md` carried the identical rot and was fixed in the same pass. The ledger row (`VERSIONS.md`) was correct throughout; these two files were the liars. A Futures block describing code that already runs is how a reader concludes the exact opposite of the truth.

Decision history: the ClickUp APPS task's **git-grab — Decision Log** subpage. Open questions get answered there (a checkbox in markdown is inert), resolved findings stay here.

---

## Known guardrails (read before touching anything)

1. 🔴 **A silently short zip is the only failure that matters.** Acceptance is `count on screen == entries in zip == count from GitHub`, with exclusions named. Everything else is a visible error.
2. 🔴 **`truncated: true` on the trees response means REFUSE**, loudly, and fall back to a per-directory walk. Never ship a partial zip.
3. 🔴 **Filter tree modes `160000` (submodule/gitlink — no blob exists) and `120000` (symlink — the blob is the link target as text), and NAME them in the UI.** Dropping either quietly is failure mode #1.
4. **Pin the commit SHA once**, at parse time. Every later request uses it. No branch URLs — this repo has a long scar history of cache-frozen branch reads.
5. **Hostname allowlist wrapper.** `api.github.com` and `raw.githubusercontent.com` only; anything else throws. This is the app's entire trust claim and it must be readable in ten seconds.
6. **No new theme vector, no new canonical object, no colour literal.** If a token seems missing, raise it with the theme steward.
7. **`applyTheme()` takes a JOIN slug**, not a colour slug. `default-theme` is a colour, not a join.
8. **Three files stay split** — `zip.js`, `gh.js`, `app.js`. Merging them puts the pipeline past the 15KB line before the v2 token gate lands.
9. 🔴 **The preview IS the correctness mechanism, not decoration.** Anything that changes a filename must change it **before the file table renders**, or the screen shows names the archive does not contain. Added 2026-08-04 with the rename work.
10. 🔴 **The generation counter in `app.js` (v1.2) is load-bearing.** Every async continuation captures `gen` and bails if superseded. Removing it lets one folder's zip be asserted against another folder's listing.

---

## Next build — the name-transform stage

⚠️ **SCOPED, NOT GREENLIT.** Two rulings are open at the bottom of this section.

Michael, 2026-08-04, asked for two things. **They are one seam, not two features:** a rename pass over `file.rel` sitting between the listing and the packer.

- **A · rewrite `.md` to `.txt` on export.** Markdown has no guaranteed handler on a machine without a markdown editor, so a double-click is a coin flip and the failure is silent-ish and annoying. `.txt` opens the same way everywhere. Nothing is protected by this: the source is public, the formatting is already stripped, and renaming back to `.md` to get the rendering is a two-second fix for anyone who wants it. **Michael's authoring markers staying visible in an IDE is INTENDED, not a leak** — they exist to be parsed by the compiler/renderer.
- **B · rename `index` files to `<parent-folder>_index`.** Ten files called `index` in one Downloads folder are ten files you cannot tell apart.

### Where it goes, and why exactly there

Inside `gh.js` → `listTree()`, applied to `rel` **immediately before the case-fold dedupe**. Never at pack time.

- `rel` is what the preview table prints. Rename at pack time and the preview lies about the archive — the single thing this app refuses to do.
- `f.path` (the true repo path) is **untouched**, so `rawURL()` still fetches the correct blob. Only the ZIP ENTRY NAME moves. This is the whole reason the change is cheap.
- The case-fold dedupe that already exists catches every collision the rename creates, and reports it through the `skipped` panel that already exists. No new failure surface, no new UI object.

### Toggling must not re-hit GitHub

Unauthenticated budget is 60 API calls an hour. A checkbox that re-lists the tree is a rate limit waiting to happen. So the transform is a **pure, idempotent function over an already-fetched listing**:

- `listTree()` stores the untransformed name as **`rel0`** and never overwrites it.
- **`GH.applyNames(listing, opts) -> listing`** recomputes `rel`, the `renamed` list, and any rename-collision entries **from `rel0` every time**. Toggle off restores exactly. Synchronous, zero network, re-render only.

### Order is fixed: index rename FIRST, extension rewrite SECOND

Run the extension rewrite first and the index rule has to recognise `index.txt` — which is a different file that might legitimately exist in the folder. Correct order: `docs/index.md` → `docs/docs_index.md` → `docs/docs_index.txt`.

### Resolving `<parent-folder>`

The immediate parent segment of `rel0`. When `rel0` has no slash — the file sits at the root of the grabbed folder — there is no parent segment, so fall back to the grabbed folder's leaf. **`suggestName()` already computes that expression:** `job.path.split("/").filter(Boolean).pop() || job.repo`. **Reuse it; do not write a second one.** Two implementations of one name is how they drift apart, and this repo has the scar tissue to prove it.

### 🔴 Scope the index rename to `index.md`. DO NOT touch `index.html`.

`index.html` is the directory-default file. Rename it and a downloaded site folder stops loading — you get a 404 or a bare directory listing instead of the page. `index.js` / `index.ts` are worse: module resolution finds `foo/index.js` for `require("./foo")`, so the rename silently breaks the import graph of whatever you grabbed to read. `__init__.py` is the same shape.

**The rename is a DOCUMENTS convenience and it is DESTRUCTIVE ON CODE.** Default target: `index.md` and `index.markdown`, nothing else. Anything wider is a separate opt-in toggle carrying that sentence verbatim as its warning, and it ships **off**.

### 🔴 Rename collisions are real, and they are the entire risk

Three new ways two files become one name:

| Transform | Collides when | Example |
|---|---|---|
| `.md` → `.txt` | the folder already holds the `.txt` twin | `notes.md` + `notes.txt` → `notes.txt` |
| index rename | the folder already holds the renamed form | `docs/index.md` + `docs/docs_index.md` |
| both together | either of the above, after the first pass | `docs/index.md` → `docs_index.txt` |

Unguarded, `zip.js build()` throws `duplicate path after case-folding` and **the whole download dies on one filename.** That is a loud failure rather than a silent one, so it does not breach the correctness bar — but it is a miserable outcome on a 300-file folder, and it is trivially avoidable by renaming before the dedupe (above).

**⏳ RULING NEEDED — collision policy.** Two candidates:

1. **Exclude and name it (RECOMMENDED).** The collided file drops out of the archive and appears in the existing skipped panel with both filenames and the sentence *"turn the rename off and both come back."* Consistent with how submodules and symlinks are already handled; this app's religion is naming what it left out.
2. **Auto-suffix** — `notes-1.txt`. Nothing is lost, but the app invents a filename nobody asked for, and because the count still matches it is easy to miss entirely.

Explicitly **not** recommended: refusing the whole job over one collision.

**⏳ RULING NEEDED — index scope.** `index.md` only (recommended, per the section above), or a second toggle that reaches `index.html` / `index.js` with a warning?

### UI

- **Two checkboxes on the `ready` screen**, above the download button. **Off by default** — a transform you did not ask for is a bug.
- Ticking either **re-renders the file table with the new names**, so you see the archive's real contents before committing to the download. This is guardrail 9 in practice.
- A `renamed` count line — *"12 files will be renamed"* — with the list expandable.
- `suggestName()` appends a marker (`-txt`, `-idx`) so two exports of the same folder do not collide in `~/Downloads`.
- ⚠️ **The done panel needs a third number.** It currently prints *"GitHub reported N, the zip contains N."* With rename exclusions in play those two legitimately differ, and the app would accuse itself of the exact failure it exists to prevent.

### Acceptance (must be able to fail)

1. A folder holding `index.md` at two different nesting depths yields two distinctly-named entries, both opening as plain text.
2. A folder holding both `notes.md` and `notes.txt`, rewrite ON, **does not throw** — it reports.
3. Toggling both checkboxes on → off → on produces byte-identical listings each time (idempotence from `rel0`).
4. With default toggles, `index.html` is untouched and a grabbed app folder still loads from the extracted zip.
5. The count assertion still holds with rename exclusions present, and all three numbers print on screen.
6. A non-ASCII folder name (`café/index.md`) survives into `café_index.txt` — UTF-8 flag bit 11 is already set in `zip.js`, so this should pass for free. Verify rather than assume.

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

## Shipped (formerly listed here as Futures)

Waves 1-4 all landed in PRs #713 → #722. Their specs are removed rather than archived, because a Futures block describing running code is worse than no block at all. What survives from them lives in the guardrails above and in `README.md` ▸ Infrastructure.

- **Wave 1 · `zip.js`** — hand-written ZIP container writer, CRC32, deflate-raw with a stored fallback, UTF-8 flag bit 11, Zip-Slip-safe paths, plus a `selftest()` that parses its own output back out.
- **Wave 2 · `gh.js`** — URL parse (slashed branch names resolved against the real branch/tag lists, never split-and-guess), ref → commit SHA pinning, one recursive trees call, `truncated` refusal, gitlink/symlink exclusion with a named list.
- **Wave 3 · `app.js`** — one `job` record, every stage job-in/job-out, preview before download, concurrency pool of 8.
- **Wave 4 · polish + adversarial pass** — reset path, five distinct error sentences, size guards (warn 100MB / confirm 250MB / refuse >1GB), 320px mobile, `CONFORMANCE.md` audit. The generation counter came out of this pass.

---

## Refused — do not add these without a real wall to point at

- **Streaming / Web Worker / File System Access API.** All three solve the big-folder problem properly and all three triple the app. The byte guard covers the real case.
- **Infinite retry.** One retry with backoff, then fail with a name. Infinite retry turns a rate limit into a hang.
- **A caching layer.** You download a folder twice a month.
- **Repo browsing, file preview, multi-folder zips, download history, globs.** One input, one output. If a feature needs the word "also," it is not this app.
- **A general find-and-replace rename box.** The two transforms above are named, bounded and reversible. An arbitrary regex over entry names is a footgun with no preview strong enough to defend it, and it would make the collision surface unbounded.

---

## Scratch intake

- `shared/gh-fetch.js` extraction — **named, deliberately not built.** If Prism ever gets an "open from a GitHub URL" source adapter, it needs exactly this fetch layer, and that is the moment to extract. Not before: one consumer is not a shared module. `gh.js` stays DOM-free so the extraction is a file move rather than surgery.
- The zipball-and-extract shortcut (`api.github.com/.../zipball` → unzip → filter → re-zip) was **struck during planning**, not tested. It rested on an untested CORS assumption about `codeload.github.com`. If rate limits ever actually bite, test it before designing it in.
- **`og.png` still does not exist** though the head tags point at it. Binary files cannot go through the agent write path; drop a 1200×630 PNG at the app root via the GitHub UI.
