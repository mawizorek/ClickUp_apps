# Markdown Viewer

<!--
  App header page. Launch block stays at the very top and points at the CURRENT
  live version. Overwrite its URL each release. Authoritative standard lives in
  Brain Reference → "Apps / HTML Artifacts" → New-App Documentation Standard.
-->

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/markdown-viewer/)

[![Launch](https://img.shields.io/badge/▶%20Launch%20Markdown%20Viewer-Open%20in%20browser-ff8000?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/markdown-viewer/)

> Opens the live app in your default browser (GitHub Pages). Nothing uploads; all processing is local.
> GitHub renders README markdown statically, so the app can't run *inside* this page — the launch link is the supported "docs → running app" path.

**Status:** Migrating (v3 shipped as artifact; repo `index.html` pending manual upload) · **Live:** https://mawizorek.github.io/ClickUp_apps/markdown-viewer/ · **Source of truth:** [`index.html`](./index.html) on `main` (commit history = version history)

> ⚠︎ **Scaffold state:** `index.html` is currently a placeholder landing page. Drop the real v3 build in via the GitHub UI to go live (the file is over the ~30KB commit-read cap, so it gets added manually).

---

## What it does

Mobile-first reader for plain-text markdown containers (session transcripts, handoff docs). Import a file and it renders with structure-aware panels:

- **Context Card** parsing — pulls `## Context Card` key/value pairs, surfaces the AI Summary up top.
- **References panel** — turns markdown tables from a `## References` section into tappable links.
- **Standing Decisions / Deferred Threads / Follow-Up Sessions** rendered as color-coded action cards.
- Headline nav drawer (H2/H3 TOC, slide-in, tap to jump), full-text search with highlight + prev/next.
- **Boundary UUID** start/end integrity check; tags stripped from display.
- `localStorage` remembers the last-opened file + date. Fully offline, zero dependencies.

---

## How to use it

1. **[Launch the app](https://mawizorek.github.io/ClickUp_apps/markdown-viewer/)** (opens in your browser).
2. Tap the file picker and choose a `.txt`, `.md`, or `.markdown` file.
3. Read it: use the nav drawer to jump headings, the search bar to find text, the panels for references/decisions.

---

## Architecture (critical infrastructure notes)

Permanent record of the non-obvious technical decisions.

### Self-contained, offline-first

Single `index.html`, all CSS + JS inline. Works double-clicked from disk. `index.html` IS the app AND the folder's GitHub Pages entry point — never chunk it, never add a manifest. Moving to GitHub Pages (top-level page, no iframe) removes the whole class of file-API problems below.

### File input on iOS (hard-won)

- File picker is triggered by a **native `<label for="input">`**, never a JS `.click()` (Safari blocks synthetic clicks). The file input sits at `opacity:0` in the DOM (iOS needs it "visible," not `display:none`).
- ClickUp's artifact **iframe sandbox is hostile to file APIs on mobile**: the picker opens but the `FileReader`/change event data may never come back. That was the reason for the old "Open outside ClickUp" escape banner. **On GitHub Pages this is moot** — the app runs top-level, so file APIs work unrestricted. The escape-hatch banner can be retired once hosted here.

### Parse by content, not extension (v4 standing practice)

Session transcripts now ship as `.txt` containers holding pure markdown (`.md` was unreliable to open across devices). The parser must treat `.txt`, `.md`, `.markdown`, and `text/plain` **identically** — render by file *content*, never branch on extension. The boundary UUID integrity check must still fire on `.txt`.

---

## Version history

Commit history on `main` is the authoritative changelog. Highlights:

- **v3** — removed conditional iframe detection; "Open outside ClickUp" escape link always visible on the input screen (`target=_blank`, points at `window.location.href`).
- **v2** — file picker moved to native label-for-input; iframe-detection escape banner added.
- **v1** — initial build: Context Card / References / decision-card parsing, nav drawer, full-text search, offline.
- **v4 (planned)** — accept `.txt`/`.md`/`.markdown`/`text/plain` identically, parse by content; confirm UUID check on `.txt`.

---

## Related

- **ClickUp task (APPS list):** [Markdown Viewer (Mobile-First .md Reader)](https://app.clickup.com/t/86aja5kp3) — living spec + next-build brief.
- **Session Transcript Format spec** (v0.4) — defines the `.txt` container this reads.
- **Brain tools:** When Building Apps, HTML Artifact Regeneration.

---

## Roadmap

- Ship v4 (extension-agnostic parsing).
- Retire the iframe escape banner now that it runs on Pages top-level.
- Optional: collapsible Context Card, recent-files list, swipe section nav, dark-mode toggle.
