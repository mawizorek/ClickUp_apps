# File Chunker — Next Build Spec

> **☐ OPEN WORK ITEM — redesign `index.html` into a pointer, not content.**
> Any agent opening this app: treat this as ACTIVE WORK, not a passive rule. Refactor `index.html` into a thin pointer/router that references source pages/modules instead of storing servable content. **Check it off when done for this app** — then it clears.
> _Current state: `index.html` is a ~108KB monolith — a major offender. The base64 chunk set in `source/` is a readback aid, not the pointer split. High priority._
>
> - [ ] `index.html` redesigned into a pointer/router (not a content store)

**Rolling canonical spec for the next File Chunker build.** Version-agnostic filename on purpose: this file is always "what's queued next," overwritten each build rather than renamed. (Same lesson the current build enforces: don't bake the version into the name.)

- **Repo:** `mawizorek/ClickUp_apps` (branch `main`)
- **Current shipped version:** v18 — `file-chunker/index.html` · live at https://mawizorek.github.io/ClickUp_apps/file-chunker/
- **Readable source (chunk set):** `file-chunker/source/` — base64-armored, walk via `source/source_index.html` (as of v18) / `source_index.txt` index. Gated one-chunk-at-a-time walk still applies.
- **Full working-notes trail:** the ClickUp task (APPS list) description + Revision History doc.

---

## Next build: v19 — Top-Level Constants Pass

A **refactor, not a feature push.** Lift hard-coded values into named top-level constants (next to `APP_VERSION`) so future renames are one-line, drift-proof edits. Implements the Apps-doc standard: *export-structure strings live as top-level constants, never inlined in builder functions.*

Set `APP_VERSION = 'v19'`, `APP_DATE = '2026-07-02'`. Run the Pre-Ship Syntax Gate; state PASS in ship notes.

### Why this build exists

Two bugs, one root cause (values inlined instead of named once):

1. v18's single index rename (`_index.md` → `source_index.html`) required hunting **7 scattered occurrences** and dodging a find/replace that would have clobbered UI display text.
2. v18 shipped with a **stale v17 footer** — the footer version string was a hardcoded literal never wired to `APP_VERSION`.

### Tier 1 — already bit us, do first

1. **App identity constants + JS-driven footer.** `"File Chunker for AI Review"` is hardcoded in 3 spots (`<title>`, `<h1>`, footer). Add `APP_NAME`. **Drive footer text from JS** off `APP_NAME`/`APP_VERSION`/`APP_DATE` (`footerVersion.textContent = ...`) so the footer can never show a stale version again. Direct fix for the v18 stale-footer bug.
2. **Export-structure strings → consts.** Still-inlined literals across builders: `'source/'`, `'README.md'`, `'README.txt'`, `'_part'`, `'_of_'`, `.txt`/`.html` extensions, `-source.zip`, report + index filenames. Promote to `SOURCE_DIR`, `README_MD`, `README_TXT`, `PART_INFIX`, `PART_JOINER`, `CHUNK_EXT`, `REPORT_FILENAME`, `INDEX_FILENAME`. Reference the const everywhere.
3. **Fallback tokens → consts.** `repoSlug || 'app'` (~10x) and `fileName || 'file'` (~9x) → `FALLBACK_SLUG` / `FALLBACK_FILENAME`.

### Tier 2 — duplicated source-of-truth (silent drift risk)

4. **Repo owner/name fallbacks.** `repoOwner()` / `repoName()` hardcode `|| 'mawizorek'` and `|| 'ClickUp_apps'` on top of `DEFAULTS.targetRepo` — two places that can disagree. Derive the fallback from `DEFAULTS.targetRepo`.
5. **Split-mode hints written twice.** `{ smart, line, hard }` hint object is duplicated in `loadSettings()` and the `splitMode` change listener. Define once as top-level `SPLIT_HINTS`.
6. **Repo string in UI placeholders.** `mawizorek/ClickUp_apps` lives in input placeholders separate from `DEFAULTS`; source it from the const.

### Tier 3 — magic numbers (clarity, low urgency)

7. **UI timings** inline (toast `1600`, copy-revert `1500`/`2200`, saved-flash `1400`, debounces `450`/`400`) → a `TIMING` const block.
8. **Algorithmic constants:** `markerOverhead()`'s `1050`/`700`/`40`, smart-break `0.5` threshold, `looksLikeMarkup`'s `4000` slice, `describeChunk`'s `500`, base64 wrap-at-`76` → named consts so the chunking math self-documents.
9. **CDN URLs** (JSZip, mathjs) inline in `<head>` → optional consts if one-place version control is wanted.

**Priority:** Tier 1 + items 4–5 are the real headache-savers; Tier 3 is polish. Implement Tier 1 + Tier 2 at minimum.

### Do NOT break (carry over from v18 verbatim)

Gated one-chunk-at-a-time walk + mandatory final pause · two-layer UUID integrity · base64 armor (default ON in repo mode) · self-navigation · content-based `github-folder` auto-detect · three-path source recovery · localStorage settings + config panel · debug mode · >8-chunk flag · two-file source download · v18 additions (live GitHub header link, `<app-slug>/source/` zip structure, `v18-ChunkerReport.md`, `source_index.html`).
