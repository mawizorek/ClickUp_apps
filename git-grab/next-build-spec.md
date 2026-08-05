# git-grab — next build spec

**Current:** **v1.3** (`APP_VERSION` + `?v=7`), PR #745. Waves 0-4 + the name-transform stage shipped.
**Next:** nothing scheduled. The v2 private-repo gate is the only approved-shape item left.

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
- **Repo browsing, file preview, multi-folder zips, download history, globs.** One input, one output. If a feature needs the word "also," it is not this app.
- **A general find-and-replace rename box.** The two v1.3 transforms are named, bounded, reversible and previewed. An arbitrary regex over entry names has an unbounded collision surface and no preview strong enough to defend it.
- **Renaming anything that is not markdown.** See the safety rule above. This is the one refusal on this list that can destroy what somebody downloaded.

---

## Scratch intake

- **Per-file ticks stop at the 300-row render cap.** Rows past it follow the master toggles and the table says so. Nobody has asked to lift it; virtualising the table to do so would cost more than the problem.
- `shared/gh-fetch.js` extraction — **named, deliberately not built.** If Prism ever gets an "open from a GitHub URL" source adapter, it needs exactly this fetch layer, and that is the moment to extract. Not before: one consumer is not a shared module. `gh.js` stays DOM-free so the extraction is a file move rather than surgery.
- **`names.js` is a candidate for the same treatment** and for the same reason it should not move yet. It is pure, dependency-free and would drop into any app that hands a user a file. One consumer.
- The zipball-and-extract shortcut (`api.github.com/.../zipball` → unzip → filter → re-zip) was **struck during planning**, not tested. It rested on an untested CORS assumption about `codeload.github.com`. If rate limits ever actually bite, test it before designing it in.
- **`og.png` still does not exist** though the head tags point at it. Binary files cannot go through the agent write path; drop a 1200×630 PNG at the app root via the GitHub UI.
