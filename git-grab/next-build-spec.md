# git-grab — next build spec

**Current:** **v1.3** (`APP_VERSION` + `?v=7`), PR #745.
**Next:** **v1.4 · the naming workbench** — full design in **[`naming-workbench.md`](naming-workbench.md)**. ⚠️ SCOPED, NOT GREENLIT. Eight rulings open, listed there.

Decision history: the ClickUp APPS task's **git-grab — Decision Log** subpage. Open questions get answered there (a checkbox in markdown is inert), resolved findings stay here.

⚠️ **This file hit 30,076 B on 2026-08-04 and was split** — 8KB over the ~22KB read-whole ceiling, grown past it across two pushes in one evening while the v1.4 section it was carrying said *"size forecast seated before the write."* The forecast was seated for the app's JS and not for the document doing the forecasting. **This file is now the ALWAYS-READ file** (state, guardrails, refusals, scratch); the design detail lives beside it and is read when building. Keep this one under ~12KB.

---

## What this app is (the line, restated 2026-08-04)

> **git-grab may do anything to a filename and nothing to a file.**

Michael, 2026-08-04: *"GitGrab is no longer just a straight download; it's an actual mini sandbox. I think that's the rule we need to adjust."* **He is right that a rule changed, and it is not the one that looks most threatened.**

What changed is the Refused-list preamble — *"one input, one output; if a feature needs the word 'also', it is not this app."* That was written when the app was a downloader. It is now a **naming workbench**: a place you decide what an archive is called before you commit to it.

**What did NOT change, and gets stronger:** every byte in the zip came out of the repo unaltered. A sandbox over NAMES is not a sandbox over CONTENT. See `naming-workbench.md` ▸ *Does this make it Prism* for the full answer — short version, **no**, and the test is one sentence: *does the app need to know what is inside the file?* git-grab never has and must never start.

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
12. 🔴 **git-grab RENAMES. IT DOES NOT CONVERT.** ⚠️ **There is no back end to "handle it on"** — every line of this app runs in the tab, which IS the security claim. Moving a conversion "into the code" does not change what a conversion is: rewriting bytes the repo does not contain.
13. 🔴 **NOTHING IS AUTOMATIC. EVERY TRANSFORM IS OPT-IN AND SHIPS OFF.** A folder you grab without touching a control comes back byte-for-byte, name-for-name, as the repo has it. ⚠️ **A control being AVAILABLE is not a transform FIRING** — the v1.4 editable field is always present and changes nothing until you type in it.
14. 🔴 **THE PATH IS THE ONLY THING GUARANTEED UNIQUE.** Two files can share a name; they cannot share a path. Every flatten, every append, every collision guarantee in v1.4 rests on this and on nothing else.

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

`.md`/`.markdown` → `.txt` and `index.md` → `<parent-folder>_index.md`, as one rename pass in `names.js` planned before the file table renders. Master toggle each, plus per-file ticks.

- 🔴 **MARKDOWN ONLY IS A SAFETY RULE.** `index.html` is the directory default; `index.js` is module resolution. The rename is a documents convenience and it is destructive on code.
- 🔴 **A COLLISION SKIPS ONE RENAME AND KEEPS BOTH FILES** (Michael: *"it's not like we're refusing all markdowns!"*). Two-round planner: stayers reserve names, movers claim in listing order, a blocked mover keeps its own name and is flagged. Nothing is excluded, so the count assertions never move.
- **Toggling costs zero API calls** — every plan derives from `f.rel`, never `f.out`, so it is idempotent and off→on is byte-identical. The unauthenticated budget is 60 calls an hour.
- **`view.js` split out of `app.js`** at the reducer/render seam (`app.js` was 14,841 B against the 15KB line).
- **`NAMES.selftest()` runs on the Self test page.** It caught a real bug before ship: a `[^\w]` scrub in `parentName()` turned `café` into `caf-`.

### Waves 1-4 (PRs #713 → #722)

- **`zip.js`** — hand-written ZIP writer, CRC32, deflate-raw + stored fallback, UTF-8 flag bit 11, Zip-Slip-safe paths, a `selftest()` that parses its own output back out.
- **`gh.js`** — URL parse (slashed branch names resolved against real branch/tag lists), ref → commit SHA pinning, one recursive trees call, `truncated` refusal, gitlink/symlink exclusion with a named list.
- **`app.js`** — one `job` record, every stage job-in/job-out, preview before download, concurrency pool of 8.
- **Wave 4 polish** — reset path, five distinct error sentences, size guards (warn 100MB / confirm 250MB / refuse >1GB), 320px mobile. The generation counter came out of this pass.

---

## Refused — do not add these without a real wall to point at

⚠️ **The old preamble (*"one input, one output"*) was retired 2026-08-04.** The governing line is now at the top of this file: **anything to a filename, nothing to a file.** Every refusal below survives that change; two got sharper.

- **Converting file CONTENT — any format, any direction, any implementation.** Guardrail 12. This is the load-bearing refusal and everything else is detail.
- **Vendoring any third-party library, for any reason.** `zip.js` was written by hand rather than imported and its header says why. The first `<script src="https://cdn...">` deletes the app's entire justification. (True `.xlsx` needs SheetJS. That is the whole argument.)
- **Repo browsing** — a folder tree with expand/collapse. ⚠️ **The v1.4 editable field is NOT this.** The flat table is the browser; making its names editable does not make it a tree.
- **A general find-and-replace rename box.** An arbitrary regex has an unbounded collision surface and no preview strong enough to defend it. ⚠️ **A typed name on ONE row is not this either** — a regex acts on files you never looked at, a typed name acts on the row in front of you.
- **Renaming non-markdown in BULK.** v1.4 replaces this with the family registry: the rule survives, the mechanism changes, and it constrains the DROPDOWN only. A hand-rename of a single file is always allowed.
- **File preview, multi-folder zips, download history, globs.**
- **Streaming / Web Worker / File System Access API.** All three solve the big-folder problem properly and all three triple the app. The byte guard covers the real case.
- **Infinite retry.** One retry with backoff, then fail with a name. Infinite retry turns a rate limit into a hang.
- **A caching layer.** You download a folder twice a month.

---

## Scratch intake

- **Per-file controls stop at the 300-row render cap.** Rows past it follow the masters and the table says so. v1.4 gives the cap teeth — a row past it cannot be hand-renamed — and that is the first real argument for virtualising. Not yet.
- **`gh.js` is 15,216 B**, a hair over the split line, self-caught on read-back during the v1.3 ship. Next split candidate. The clean seam is **resolve/list** vs **fetch** — and that second half is exactly what `shared/gh-fetch.js` would be, **so the split and the extraction are the same cut made once.**
- `shared/gh-fetch.js` extraction — **named, deliberately not built.** One consumer is not a shared module. A Prism "open from a GitHub URL" adapter is the second consumer and the moment it is justified. `gh.js` stays DOM-free so the extraction is a file move rather than surgery.
- **`names.js` is a candidate for the same treatment**, same reason not yet. ⚠️ The v1.4 filename validator makes it *more* broadly useful — every app that lets a user name a file needs the Windows reserved-name check and almost none of them have it.
- **This spec file is now split.** If `naming-workbench.md` crosses ~22KB, cut it by feature rather than letting it grow; the same rot that hit this file will hit that one.
- The zipball-and-extract shortcut (`api.github.com/.../zipball` → unzip → filter → re-zip) was **struck during planning, not tested.** It rested on an untested CORS assumption about `codeload.github.com`. If rate limits ever bite, test it before designing it in.
- **`og.png` still does not exist** though the head tags point at it. Binaries cannot go through the agent write path; drop a 1200×630 PNG at the app root via the GitHub UI.
