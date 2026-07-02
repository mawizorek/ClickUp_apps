# File Chunker for AI Review

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/file-chunker/)

[![Launch](https://img.shields.io/badge/Launch-File_Chunker-blue?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/file-chunker/)

**Status:** Shipped (v17) | **Source of truth:** this repo folder | **Live:** [GitHub Pages](https://mawizorek.github.io/ClickUp_apps/file-chunker/)

---

## What it does

A single-file, offline HTML tool that splits a large file (HTML apps, scripts, transcripts, docs) into small, verifiable chunks an AI agent can read back reliably.

Drop a file in, pick a chunk size/mode, and get a downloadable set: a self-instructing index + numbered chunk files + README, each chunk wrapped in tamper-evident markers so an agent can walk them one at a time without silently losing or corrupting content.

**Why it exists:** a single long file read back through an agent silently truncates (~30KB per-fetch cap) and raw HTML/SVG gets tag-flattened on readback. Chunking + Base64 armor fixes both.

---

## How to use it

1. Open the app (link above) or double-click the local `index.html`.
2. Drop or select any file (HTML, scripts, transcripts, docs).
3. Configure chunk size (default 22KB), split mode (smart/line/hard), and encoding (auto-arms Base64 on markup).
4. Export: download a zip containing a self-instructing index, numbered chunks, README, report, and (optionally) the original source file.
5. Hand the index to a fresh AI agent. It carries reading rules, manifest, and integrity UUIDs. The agent reads one chunk at a time, pausing for go-ahead.

---

## Architecture

- **Single self-contained HTML file.** All CSS and JS inline. No backend, no uploads, no external dependencies beyond JSZip (CDN with offline fallback).
- **Offline-first.** Works when double-clicked from a local filesystem.
- **Two-layer UUID integrity:** each chunk carries its own START/END boundary UUID plus a shared set UUID for completeness checking.
- **Base64 armor ("Encoded" mode):** base64-encodes each chunk's payload so raw HTML/SVG survives readback intact. Markers stay plain text outside the blob.
- **Force-.txt toggle (default ON):** all chunks export as .txt regardless of source type, preventing OS rendering on open.
- **Smart split:** respects function/class/section boundaries; falls back to line-break split when structure isn't detected.
- **Config system:** app-level settings (GitHub folder, version, repo URL) stored in meta tags and a config object for export naming and linking.

---

## Version history

- **v17** — zip export restructure (single wrapper folder, report rename, source_index rename, download link), GitHub repo link in config
- **v16.2** — two-file source download (html + txt twin), export naming/dating standard, source preservation
- **v16** — gated one-chunk-at-a-time walk, mandatory final pause, set configs
- **v15** — self-instructing index with integrity header, reading directives, set UUID
- **v14** — Base64 armor transport encoding
- **v9** — standing footer trio (copy source, prepare download, right-click save)

---

## Related

- **ClickUp task:** File Chunker for AI Review (APPS list)
- **Revision History doc:** linked from the ClickUp task
- **Brain tool:** Chunked Document Review (AI Toolkit)
- **Repo:** [mawizorek/ClickUp_apps/file-chunker](https://github.com/mawizorek/ClickUp_apps/tree/main/file-chunker)

---

## Roadmap

- v18: live repo link on the HTML UI, zip structure cleanup (single wrapper folder for header docs), report rename to `v{version}-ChunkerReport.md`, source index rename to `source_index.html`
- Sectioned/grouped chunk numbering
- Multi-file batch input
