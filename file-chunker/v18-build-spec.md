# File Chunker v18 — Build Spec (Surgical Diffs)

**For the rendering agent.** Read the v17 source from `file-chunker/source/` (base64-armored chunk set, 10 parts), then apply these exact changes. Do NOT re-architect anything else. Ship as v18.

## Source location

- **Chunk index:** `file-chunker/source/source_index.txt`
- **Repo:** `mawizorek/ClickUp_apps` (branch `main`)
- **Commit (pinned, reliable):** `914a690b38822364a417f4a4bcfe16fb57e5b2f9`
- **Encoding:** base64 armored, 10 chunks @ ~10–16KB each
- **Total source:** 106,906 bytes / ~26,711 tokens

## What v18 does (summary)

1. Live GitHub repo link in the app UI header (from config values)
2. Zip export restructure: single wrapper folder, report + source at predictable paths
3. Report renamed to `v{version}-ChunkerReport.md`
4. Source index renamed to `source_index.html` (was `_index.md` / `_index.txt`)
5. Base64 encoding ON by default
6. Download link carry-forward (already in v17)

---

## Diff 1: Version constants

```javascript
// FIND:
const APP_VERSION = 'v17';
const APP_DATE = '2026-07-01';
// REPLACE WITH:
const APP_VERSION = 'v18';
const APP_DATE = '2026-07-02';
```

---

## Diff 2: `indexFileName()` — rename the repo-mode index

```javascript
// FIND:
function indexFileName() { return repoMode() ? '_index.md' : `${fileName || 'file'}_index.txt`; }
// REPLACE WITH:
function indexFileName() { return repoMode() ? 'source_index.html' : `${fileName || 'file'}_index.txt`; }
```

---

## Diff 3: `buildExportLinks()` — repo-mode zip structure

The repo-mode branch currently puts `report.md` at zip root and chunks inside `<slug>/source/`. Replace the entire repo-mode zip block:

```javascript
// FIND (repo-mode branch inside buildExportLinks):
zip.file('report.md', buildReportContent(total));
zip.file(cleanOriginalRepoName(), currentText);
const src = `${repoSlug || 'app'}/source/`;
zip.file(src + '_index.md', indexContent);
zip.file(src + 'README.md', buildRepoReadme(total));
wrappedChunks.forEach((wrapped, idx) => zip.file(src + chunkFileName(idx, total), wrapped));

// REPLACE WITH:
const wrapper = `${repoSlug || 'app'}/`;
zip.file(wrapper + `${APP_VERSION}-ChunkerReport.md`, buildReportContent(total));
zip.file(wrapper + cleanOriginalRepoName(), currentText);
const src = wrapper + 'source/';
zip.file(src + 'source_index.html', indexContent);
zip.file(src + 'README.md', buildRepoReadme(total));
wrappedChunks.forEach((wrapped, idx) => zip.file(src + chunkFileName(idx, total), wrapped));
```

Also update the downloadNote text in that same branch:
```javascript
downloadNote.textContent = `Zip: ${APP_VERSION}-ChunkerReport.md + clean original (root) + source/ (index + chunks + README). Right-click \u2192 "Download Linked File" if click doesn't work.`;
```

---

## Diff 4: `buildExportLinks()` — non-repo (else) zip structure

Currently flat. Wrap in a single folder:

```javascript
// FIND (non-repo else branch):
zip.file(originalFileName(), currentText);
wrappedChunks.forEach((wrapped, idx) => zip.file(chunkFileName(idx, total), wrapped));
zip.file(indexFileName(), indexContent);
zip.file('README.txt', buildLegacyReadme(total));

// REPLACE WITH:
const wrapper = `${fileName || 'file'}/`;
zip.file(wrapper + originalFileName(), currentText);
zip.file(wrapper + `${APP_VERSION}-ChunkerReport.md`, buildReportContent(total));
const src = wrapper + 'source/';
wrappedChunks.forEach((wrapped, idx) => zip.file(src + chunkFileName(idx, total), wrapped));
zip.file(src + indexFileName(), indexContent);
zip.file(src + 'README.txt', buildLegacyReadme(total));
```

---

## Diff 5: Live GitHub repo link in the header

In the HTML body, after the `<span class="mode-pill ..." id="modePill">` element, add:

```html
<a id="repoLink" href="#" target="_blank" rel="noopener" style="display:none; margin-top:var(--space-sm); font-size:0.78rem; color:var(--repo); text-decoration:underline;">View on GitHub</a>
```

At the bottom of the JS, after the `loadSettings();` call (just before the closing `})();`), add:

```javascript
// v18: live repo link from config
(function initRepoLink() {
  const link = document.getElementById('repoLink');
  const slug = document.querySelector('meta[name="github-folder"]');
  const folder = slug && slug.getAttribute('content');
  if (folder && folder.trim()) {
    link.href = `https://github.com/${targetRepo()}/tree/${branchName()}/${folder.trim()}`;
    link.textContent = `\u{1F4C2} ${targetRepo()}/${folder.trim()}`;
    link.style.display = 'inline-flex';
  }
})();
```

---

## Diff 6: Base64 encoding ON by default

In `loadSettings()`, find the encode restore line:

```javascript
// FIND:
if (typeof s.encode === 'boolean') encodeToggle.checked = s.encode;
// REPLACE WITH:
if (typeof s.encode === 'boolean') encodeToggle.checked = s.encode;
else encodeToggle.checked = true; // v18: base64 default ON
```

---

## Diff 7: String references to `_index.md` → `source_index.html`

In `buildRepoReadme()` and `buildRepoIndexContent()`, replace every occurrence of the string `_index.md` with `source_index.html`. Key locations:

- `buildRepoReadme`: the "Entry point" line and the Contents list
- `buildRepoIndexContent`: the preamble ("handed ONLY this `_index.md`" → "handed ONLY this `source_index.html`")
- `buildReportContent`: the Upload section reference
- `downloadIndexLink.textContent`: the button label in `buildExportLinks` (change `'_index.md'` to `'source_index.html'`)

---

## Zip structure target (visual)

```
file-chunker-v18_YYYY-MM-DD-HHMM.zip
└── file-chunker/
    ├── v18-ChunkerReport.md
    ├── file-chunker-v18.html
    └── source/
        ├── file-chunker_part01_of_N.txt
        ├── ...
        ├── README.md
        └── source_index.html
```

---

## Agent instructions

1. Read the chunk set from `file-chunker/source/source_index.txt` (the index). Follow the gated walk.
2. After reading all chunks, apply the 7 diffs above.
3. Deliver the modified full source as a ClickUp artifact.
4. Do NOT commit to the repo (file is >30KB, Brain can't safely write it). Michael uploads manually.
5. Post the standard version comment on the File Chunker task.

---

## Known snags from the v17 test walk (2026-07-01)

- **Plaintext chunks get tag-flattened** by fetch tools. Base64 armor is mandatory for HTML source.
- **`main` branch raw URLs intermittently 404** after recent commits. Use the pinned commit SHA above, or retry once.
- **GitHub MCP `get_file_contents` returns no readable content** for large files. Use `fetch_website` on the raw URL instead.
- **The index's hosted URLs point to the wrong path** (missing `/source/` subfolder). Use repo-relative paths via raw.githubusercontent, not github.io Pages URLs.
