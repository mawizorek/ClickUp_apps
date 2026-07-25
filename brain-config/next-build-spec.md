# brain-config viewer - next build spec

> **☑ WORK ITEM — `index.html` is a pointer, not content (DONE for this app).**
> Kept here as the standing pattern; already satisfied. The landing `index.html` is a toggle shell (Our AI Index / Platform Tools) that iframes `custom-tools.html` + `tool-index.html` and stores no tool content. Never fold the registry or platform list back into it.
>
> - [x] `index.html` redesigned into a pointer/router — now a toggle shell (done, PR #100, 2026-07-08)

**Current cycle:** viewer v2 (multi-file split + Run-me launcher). Shipped 2026-07-04.

One file per app, overwritten each cycle. Version lives in this header, never the filename.

---

## In review (shipped this commit, verify live)

- **Multi-file split.** `index.html` is now a thin shell; CSS -> `source/styles.css`, static tables -> `source/data.js`, engine -> `source/app.js`. Motivation: the monolith was ~28.4KB, ~1.5KB under the 30KB read cap; adding any feature pushed it over and broke whole-file readback. Each module now reads whole.
- **Run-me launcher.** Any tool profile with `**Shortcut:** true` + a `**Launch prompt:**` fenced block renders a Run-me button. Click copies the prompt (navigator.clipboard -> execCommand fallback) and opens `BRAIN_MAX_URL` in a new tab via a real anchor (no window.open). Paste + pick agent + send is intentional/manual.
- **Seeded:** `agents/recon-renata.md` is the first live shortcut.

## Next build (needs Michael)

- **Set `BRAIN_MAX_URL`** (top of `source/app.js`). Currently `https://app.clickup.com/` as a safe default. No documented web deep-link prefills a prompt; pick the real target: web workspace home or a `clickup://` desktop protocol. One-line change.
- **Seed more shortcuts.** Decide which agents/tools deserve a stored default prompt (Scout Sage research kickoff, Handoff Hana packager, etc.) and add the two keys to each profile.

## Futures

- Prompt preview on hover / long-press before launch.
- Per-shortcut target override (some prompts may want a specific workspace location, not just the global BRAIN_MAX_URL).
- Copy-only variant (no redirect) for when you're already in a Brain session.

## Known guardrails

> ⚠️ **Two guardrails in this section had ROTTED and were corrected 2026-07-25.** Both are preserved below as strikethrough-in-prose rather than deleted, because *what a stale rule used to say* is the useful part: a guardrail can decay into the exact opposite of the rule it was written to enforce, and it looks just as authoritative on the way down. Verify a guardrail against the live standard before you follow it.

- **~~registry.json is a generated manifest, do NOT hand-edit~~ → RETIRED 2026-07-25.** `registry.json` was a 2026-07-04 bootstrap manifest that predated git-teammates by eleven days and eventually grew unreadable; it is now a tombstone stub. **`brain-config/super-agents/roster.json` is THE single agent roster** — one flat list, hand-edited by design, capped at ~12KB precisely to stay hand-editable. The old "never hand-edit the generated manifest" caution is inverted now. The `shortcut | launchPrompt` fields belong on the tool profile's front-matter, which stays canonical.
- **~~Read path: file bodies via raw.githubusercontent URL~~ → WRONG, and dangerously so. CORRECTED 2026-07-25.** Read file bodies via the **git blob API** (`git/blobs/<sha>`, base64-decoded) or `get_file_contents` at an **immutable commit SHA**. A branch `raw.githubusercontent` URL serves cache-frozen copies — verified 2026-07-25, a raw read of `inciardi-market/source/app-core.js` returned **v10.1 / PR #174 while `main` was on v15 / PR #455** (five versions, ~280 PRs of drift from a single read) — and raw reads also flatten HTML/SVG out of template literals. This entry previously recommended exactly that path while the GitHub MCP Operating Standard (LOCKED 2026-07-09) forbade it. Canonical: the Operating Standard + `VERSIONS.md`. Still true and still important: never reconstruct source from an index summary, and **never rewrite a file from a truncated read.**
- **The read cap is on RETURNED bytes, not disk bytes.** The blob API returns base64, which inflates 4/3 — so the practical ceiling is **~22KB on disk**, not 30KB. Full math + the trim-don't-split remedy: `hooks/source-size-budget-enforcer.md`.
- **Pages lag ~60s** after commit before the live URL reflects the new build. `.nojekyll` at the repo root is what stops the build failing silently — if a URL won't update despite a correct commit, check that first.
- **Prose-metadata convention:** the viewer extracts `**Shortcut:**` / `**Launch prompt:**` by regex, matching how it already reads `**Purpose:**`. Keep the fenced-block form for the prompt so multi-line prompts survive.
