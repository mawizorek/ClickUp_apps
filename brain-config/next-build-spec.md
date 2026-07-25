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

- **registry.json is RETIRED (2026-07-25)** - it was a 2026-07-04 bootstrap manifest that predated git-teammates by eleven days, and it grew unreadable. It is now a tombstone stub. **`brain-config/super-agents/roster.json` is THE single agent roster.** Anything that pointed at registry.json points there instead. The old "do not hand-edit the generated manifest" caution is moot; the roster is hand-edited by design and capped at ~12KB to stay that way. The `shortcut | launchPrompt` fields belong on the tool profile's front-matter, which stays canonical.
- **⚠️ Read path — CORRECTED 2026-07-25 (this entry previously said the opposite and was dangerous).** Read file bodies via the **git blob API** (`git/blobs/<sha>`, base64-decoded), or `get_file_contents` at an **immutable commit SHA**. Do **NOT** read bodies from a `raw.githubusercontent` branch URL: verified 2026-07-25, a branch raw URL served `inciardi-market/source/app-core.js` at v10.1/PR #174 while `main` was on v15/PR #455, and raw reads also flatten HTML/SVG out of template literals. The previous guardrail here recommended exactly that path — a rule that had rotted into the opposite of the rule. Canonical ladder: `VERSIONS.md` + the GitHub MCP Operating Standard. Still true: never reconstruct source from an index summary, and never rewrite a file from a truncated read.
- **Pages lag ~60s** after commit before the live URL reflects the new build. `.nojekyll` at the repo root is what keeps the build from failing silently.
- **Prose-metadata convention:** the viewer extracts `**Shortcut:**` / `**Launch prompt:**` by regex, matching how it already reads `**Purpose:**`. Keep the fenced-block form for the prompt so multi-line prompts survive.
