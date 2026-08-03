# git-grab — next build spec

**Current:** v0.1 (Wave 0 scaffold, PR #713). **Next:** Wave 1 — `zip.js`.

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

---

## Next build — Wave 1 · `zip.js`

Standalone ZIP container writer. **No network, no DOM, no imports.**

- CRC32 (table-driven), local file headers, central directory, end-of-central-directory record.
- Deflate via native `CompressionStream('deflate-raw')`; **stored (method 0) fallback** when unavailable — a larger file that still opens everywhere, not an error path.
- Set the **UTF-8 general-purpose flag bit (bit 11)** on every header or non-ASCII filenames mangle on Windows.
- Sanitize entry paths: no leading `/`, no `..` segments.
- API: `makeZip([{ path, bytes }]) -> Blob`.

**Acceptance (must be able to fail):** a hand-fed two-file zip, one ASCII name and one with an emoji, opens correctly in **both** macOS Archive Utility and Windows Explorer. This is the riskiest code in the app and it ships before anything depends on it.

---

## In review

Nothing.

---

## Futures (approved shape, not scheduled)

### Wave 2 · `gh.js` — list only, still no DOM
URL parse covering `/tree/`, `/blob/`, bare repo root, commit permalinks, and **branch names containing slashes** (do not split on `/` and take element 0). Resolve ref → commit SHA. One recursive trees call, filter by path prefix client-side. `truncated` refusal. Gitlink + symlink filtering with an exclusions list returned alongside the manifest.
*Acceptance:* a known permalink returns the exact expected file list; a submodule-bearing repo reports its exclusions.

### Wave 3 · `app.js` — wire the pipeline
One `job` record (`url, owner, repo, ref, sha, path, files[], fetched, totalBytes, stage, error`); every stage is job-in/job-out. Concurrency pool of **8** against the raw host. Preview screen before download. Progress meter.
*Acceptance:* the count assertion holds on three real folders of different sizes.

### Wave 4 · Polish + attack
Reset path (return to idle without a refresh — the state everyone skips). Five distinct error sentences: rate-limited, not found, truncated, too big, network dropped. **"Something went wrong" is a bug, not a state.** Confirm prompt above ~250MB (the whole zip is assembled in RAM; that is the cost of having no server). Mobile clean at 320px. Breaker Beckett re-run. Full `CONFORMANCE.md` audit.

### v2 · private-repo gate
Token UI appears only when needed. In-memory by default; `sessionStorage` behind an explicit opt-in, **never `localStorage` unless asked**; visible "token active" pill with one-click wipe; fine-grained PAT, contents-read-only, scoped to the repo.

⚠️ **The gate can never truthfully say "this repo is private."** GitHub returns **404, not 403**, for a private repo you are not authenticated for — it refuses to confirm existence. Copy must hold both possibilities: *"Couldn't reach that path. It may not exist, or it may be private."* Same message a typo earns.

The seam is already in place: the fetch function takes an optional auth argument from day one and threads it into the header builder even though nothing passes it.

---

## Refused — do not add these without a real wall to point at

- **Streaming / Web Worker / File System Access API.** All three solve the big-folder problem properly and all three triple the app. The byte guard covers the real case.
- **Infinite retry.** One retry with backoff, then fail with a name. Infinite retry turns a rate limit into a hang.
- **A caching layer.** You download a folder twice a month.
- **Repo browsing, file preview, multi-folder zips, download history, globs.** One input, one output. If a feature needs the word "also," it is not this app.

---

## Scratch intake

- `shared/gh-fetch.js` extraction — **named, deliberately not built.** If Prism ever gets an "open from a GitHub URL" source adapter, it needs exactly this fetch layer, and that is the moment to extract. Not before: one consumer is not a shared module. `gh.js` stays DOM-free so the extraction is a file move rather than surgery.
- The zipball-and-extract shortcut (`api.github.com/.../zipball` → unzip → filter → re-zip) was **struck during planning**, not tested. It rested on an untested CORS assumption about `codeload.github.com`. If rate limits ever actually bite, test it before designing it in.
