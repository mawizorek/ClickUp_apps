# git-grab — next build spec

**Current:** **v1.3** (`APP_VERSION` + `?v=7`), PR #745.
**Next:** **v1.4 · the naming workbench** — full design in **[`naming-workbench.md`](naming-workbench.md)**. ⚠️ SCOPED, NOT GREENLIT. Eight rulings open, listed there.

Decision history: the ClickUp APPS task's **git-grab — Decision Log** subpage. Open questions get answered there (a checkbox in markdown is inert), resolved findings stay here.

⚠️ **This file hit 30,076 B on 2026-08-04 and was split.** 8KB over the ~22KB read-whole ceiling, grown across two pushes in one evening — while the section it was carrying said *"size forecast seated before the write."* The forecast covered the app's JS, not the document doing the forecasting. **This is now the ALWAYS-READ file** (state, guardrails, refusals, scratch); design detail lives beside it. **Target ~12KB.** ⚠️ It was pushed back to 16,136 B the same night by a single ruling and trimmed again in the same session — mostly by deleting a section that duplicated `naming-workbench.md` §6. **Point at the other file; do not restate it.**

---

## What this app is (the line, 2026-08-04)

> **git-grab may do anything to a filename and nothing to a file.**

Michael: *"GitGrab is no longer just a straight download; it's an actual mini sandbox. I think that's the rule we need to adjust."* **He is right that a rule changed, and it is not the one that looks most threatened.**

What changed is the Refused-list preamble — *"one input, one output."* That was written when this was a downloader. It is now a **naming workbench**: where you decide what an archive is called before committing to it. What did NOT change, and got stronger: **every byte in the zip came out of the repo unaltered.** A sandbox over NAMES is not a sandbox over CONTENT.

🔴 **The one-sentence test that settles every version of this question — *does the app need to know what is INSIDE the file?* — is written out in [`naming-workbench.md`](naming-workbench.md) §6.** It has now been applied three times in one evening (convert-on-export · the sandbox reframe · marker-strip) and held each time. **Apply it before designing, not after.**

---

## Known guardrails (read before touching anything)

1. 🔴 **A silently short zip is the only failure that matters.** Acceptance is `count on screen == entries in zip == count from GitHub`, with exclusions named. Everything else is a visible error.
2. 🔴 **`truncated: true` on the trees response means REFUSE**, loudly. Never ship a partial zip.
3. 🔴 **Filter tree modes `160000` (submodule/gitlink — no blob exists) and `120000` (symlink — the blob is the link target as text), and NAME them in the UI.** Dropping either quietly is failure mode #1.
4. **Pin the commit SHA once**, at parse time. Every later request uses it. No branch URLs — this repo has a long scar history of cache-frozen branch reads.
5. **Hostname allowlist wrapper.** `api.github.com` and `raw.githubusercontent.com` only; anything else throws. This is the app's entire trust claim and it must be readable in ten seconds.
6. **No new theme vector, no new canonical object, no colour literal.** If a token seems missing, raise it with the theme steward.
7. **`applyTheme()` takes a JOIN slug**, not a colour slug. `default-theme` is a colour, not a join.
8. **Five files stay split** — `zip.js`, `gh.js`, `names.js`, `view.js`, `app.js`. Each is a lane, each under the 15KB line on its own.
9. 🔴 **The preview IS the correctness mechanism, not decoration.** Anything that changes a filename must change it **before the file table renders**, or the screen shows names the archive does not contain.
10. 🔴 **The generation counter in `app.js` (v1.2) is load-bearing.** Every async continuation captures `gen` and bails if superseded. Removing it lets one folder's zip be asserted against another folder's listing.
11. 🔴 **A rename never removes a file** (v1.3). `f.out` changes; `f.path` and the file's existence do not. The moment a transform can DROP something, both count assertions become meaningless.
12. 🔴 **git-grab RENAMES. IT DOES NOT CONVERT — AND IT DOES NOT READ.** ⚠️ **There is no back end to "handle it on"**: every line runs in the tab, which IS the security claim. **The app never decodes a file it packs**, so it cannot inspect, scan, lint, strip or clean one. The moment it decodes, the one-sentence test stops returning *never*.
13. 🔴 **NOTHING IS AUTOMATIC. EVERY TRANSFORM IS OPT-IN AND SHIPS OFF.** A folder grabbed without touching a control comes back byte-for-byte, name-for-name. ⚠️ **A control being AVAILABLE is not a transform FIRING** — v1.4's editable field is always present and changes nothing until you type.
14. 🔴 **THE PATH IS THE ONLY THING GUARANTEED UNIQUE.** Two files can share a name; they cannot share a path. Every flatten, append and collision guarantee in v1.4 rests on this and nothing else.

---

## 🔴 RULED 2026-08-04 · marker detection + stripping — NOT HERE, and it is already built elsewhere

> Michael: *"a flag that parses any TSV, CSV, or data file … to see if any cells contain the existing marker tags we know. Then offer to strip those marker tags if they are present."*

**The instinct is right and the destination is wrong. This would be the THIRD implementation of one transform**, and both others are further along.

| # | Where | State |
|---|---|---|
| 1 | **`docrender/cells.py` → `cells.plain()`** (9,660 B, `doc-render-engine`) | **Written, in production, tested.** Extracts a marked cell's plaintext; exists because `sort:` needed to order rows without markup reordering the sheet. |
| 2 | **`docrender/clean.py`** — emit `<name>.clean.tsv` beside every marked TSV | **Scoped, step 2** in `prism/next-build-spec.md`, which says: ***"Wraps `cells.plain()`, which already exists. Do not write a stripper."*** |
| 3 | git-grab, in JS | ⛔ this ask |

**1. It breaks the one-sentence test in the same evening it was written.** Detection is not a lighter version of stripping — **both require decoding the file.** git-grab has never decoded anything it packs, and the moment it parses cells looking for markers, the Prism boundary evaporates.

**2. The vocabulary does not live here, and a copy would rot.** Marker classes are declared in `theme/marker-classes.tsv` + `theme/markers.tsv`; reserved prefixes are **derived** by `docrender/prefixes.py` from `prefixes.claim(...)` at import — *derive it, never type it* (J8). A marker list hand-typed into `names.js` is a **fourth hand-maintained copy of a vocabulary whose architecture exists to prevent copies**, wrong the first time a class is added, with nothing failing loudly.

⚠️ **The strongest counter-argument, stated because it still loses:** the proposed `dialect.json` would sit in a public repo, so `raw.githubusercontent.com` **is** on the allowlist and git-grab *could* legitimately fetch the vocabulary. That defeats reason 2 outright. It does nothing for 1 or 3.

**3. A JS reimplementation will disagree with the Python one the first time a marker nests** — already the strongest call in the Prism fold-in. Two implementations of one design is a bug with a delay on it.

### 🔴 The actual answer: fix it UPSTREAM, and git-grab needs ZERO new code

`clean.py` emits the stripped sibling **at build time**, so the clean file is **a real file in the repo** — it appears in the listing, the table, the count and the zip with no new capability here. **Grab the folder and both versions are already there.** The transform happens once, where the vocabulary is derived, in the language that owns it.

⭐ **That is also why it was specced as a distinct filename rather than a stripped download under the existing link:** `01-utility/automatic-revision-log.md` promises in Michael's own words that the table and the download *"cannot disagree."* A silent strip on the way out breaks that; a distinct filename makes the transform visible.

**Demand signal worth acting on: he has asked for marker-stripping twice in one day, in two different apps.** `clean.py` is explicitly *"independent of Prism"* — **it can ship alone, before anything else in that sequence.** That is the thing to build.

---

## In review

Nothing.

---

## Futures (approved shape, not scheduled)

### v2 · private-repo gate

Token UI appears only when needed. In-memory by default; `sessionStorage` behind an explicit opt-in, **never `localStorage` unless asked**; visible "token active" pill with one-click wipe; fine-grained PAT, contents-read-only, scoped to the repo.

⚠️ **The gate can never truthfully say "this repo is private."** GitHub returns **404, not 403**, for a private repo you are not authenticated for — it refuses to confirm existence. Copy must hold both possibilities: *"Couldn't reach that path. It may not exist, or it may be private."* Same message a typo earns.

The seam is in place: `ghFetch()` takes an optional token argument and threads it into the header builder even though nothing passes it.

---

## Shipped

### v1.3 · the name-transform stage (PR #745)

`.md`/`.markdown` → `.txt` and `index.md` → `<parent-folder>_index.md`, as one rename pass in `names.js` planned before the table renders. Master toggle each, plus per-file ticks.

- 🔴 **MARKDOWN ONLY IS A SAFETY RULE.** `index.html` is the directory default; `index.js` is module resolution. The rename is a documents convenience and it is destructive on code.
- 🔴 **A COLLISION SKIPS ONE RENAME AND KEEPS BOTH FILES** (Michael: *"it's not like we're refusing all markdowns!"*). Two-round planner: stayers reserve names, movers claim in listing order, a blocked mover keeps its own and is flagged. Nothing is excluded, so the count assertions never move.
- **Toggling costs zero API calls** — every plan derives from `f.rel`, never `f.out`, so it is idempotent and off→on is byte-identical. The unauthenticated budget is 60/hr.
- **`view.js` split out of `app.js`** at the reducer/render seam (`app.js` was 14,841 B against the 15KB line).
- **`NAMES.selftest()` runs on the Self test page.** It caught a real bug before ship: a `[^\w]` scrub in `parentName()` turned `café` into `caf-`.

### Waves 1-4 (PRs #713 → #722)

- **`zip.js`** — hand-written ZIP writer, CRC32, deflate-raw + stored fallback, UTF-8 flag bit 11, Zip-Slip-safe paths, a `selftest()` that parses its own output back out.
- **`gh.js`** — URL parse (slashed branch names resolved against real branch/tag lists), ref → commit SHA pinning, one recursive trees call, `truncated` refusal, gitlink/symlink exclusion with a named list.
- **`app.js`** — one `job` record, every stage job-in/job-out, preview before download, concurrency pool of 8.
- **Wave 4 polish** — reset path, five distinct error sentences, size guards (warn 100MB / confirm 250MB / refuse >1GB), 320px mobile. The generation counter came out of this pass.

---

## Refused — do not add these without a real wall to point at

⚠️ **The old preamble (*"one input, one output"*) was retired 2026-08-04.** The governing line is at the top: **anything to a filename, nothing to a file.** Every refusal survives that change; three got sharper.

- **Converting file CONTENT — any format, any direction, any implementation.** Guardrail 12. Load-bearing; everything else is detail.
- **READING file content — parsing, scanning, linting, marker detection, stripping.** ⚠️ **Not a lighter version of converting: it is the same door.** Detection requires decoding and the boundary is that nothing is decoded. Full ruling above; the transform belongs in `docrender/clean.py`.
- **Vendoring any third-party library, for any reason.** `zip.js` was hand-written rather than imported and its header says why. The first `<script src="https://cdn...">` deletes the app's justification. (True `.xlsx` needs SheetJS. That is the whole argument.)
- **Repo browsing** — a folder tree with expand/collapse. ⚠️ **v1.4's editable field is NOT this.** The flat table is the browser; editable names do not make it a tree.
- **A general find-and-replace rename box.** Unbounded collision surface, no preview strong enough to defend it. ⚠️ **A typed name on ONE row is not this either** — a regex acts on files you never looked at, a typed name acts on the row in front of you.
- **Renaming non-markdown in BULK.** v1.4 replaces this with the family registry: rule survives, mechanism changes, and it constrains the DROPDOWN only. A hand-rename of one file is always allowed.
- **File preview, multi-folder zips, download history, globs.**
- **Streaming / Web Worker / File System Access API.** All three solve the big-folder problem properly and all three triple the app. The byte guard covers the real case.
- **Infinite retry.** One retry with backoff, then fail with a name. Infinite retry turns a rate limit into a hang.
- **A caching layer.** You download a folder twice a month.

---

## Scratch intake

- **Per-file controls stop at the 300-row render cap.** Rows past it follow the masters and the table says so. v1.4 gives the cap teeth — a row past it cannot be hand-renamed — the first real argument for virtualising. Not yet.
- **`gh.js` is 15,216 B**, a hair over the split line, self-caught on read-back during the v1.3 ship. Next split candidate. The clean seam is **resolve/list** vs **fetch** — and that second half is exactly `shared/gh-fetch.js`, **so the split and the extraction are the same cut made once.**
- `shared/gh-fetch.js` — **named, deliberately not built.** One consumer is not a shared module. A Prism "open from a GitHub URL" adapter is the second consumer and the moment it is justified. `gh.js` stays DOM-free so the extraction is a file move, not surgery.
- **`names.js` is a candidate for the same treatment**, same reason not yet. ⚠️ The v1.4 validator makes it *more* broadly useful — every app that lets a user name a file needs the Windows reserved-name check and almost none have it.
- **This spec is split.** If `naming-workbench.md` crosses ~22KB, cut it by feature. The same rot that hit this file will hit that one.
- The zipball-and-extract shortcut (`.../zipball` → unzip → filter → re-zip) was **struck during planning, not tested.** It rested on an untested CORS assumption about `codeload.github.com`. If rate limits ever bite, test it before designing it in.
- **`og.png` still does not exist** though the head tags point at it. Binaries cannot go through the agent write path; drop a 1200×630 PNG at the app root via the GitHub UI.
