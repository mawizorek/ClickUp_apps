# brain-config viewer - next build spec

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

- **registry.json is a generated manifest** - do NOT hand-edit it as part of a feature. The agent `schema` string should gain `shortcut | launchPrompt` and the `recon-renata` entry should carry the two fields on the NEXT regen pass (Scribe Sana / Closing Clio verify at session close). Front-matter/profile prose stays canonical.
- **Read path:** file bodies via raw.githubusercontent URL; `githubmcp_get_file_contents` returns metadata/SHA only on a file path. Do not reconstruct source from the index summary.
- **Pages lag ~60s** after commit before the live URL reflects the new build.
- **Prose-metadata convention:** the viewer extracts `**Shortcut:**` / `**Launch prompt:**` by regex, matching how it already reads `**Purpose:**`. Keep the fenced-block form for the prompt so multi-line prompts survive.
- **Index = pointer, not a store (LOCKED 2026-07-08).** The landing `index.html` is a toggle shell (Our AI Index / Platform Tools) that iframes `custom-tools.html` + `tool-index.html`; it stores no tool content. Keep it a pointer; never fold the registry or platform list back into it. Mirror of the Apps / HTML Artifacts + GitHub MCP standards.
