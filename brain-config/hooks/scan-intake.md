# Scan Intake · AI Toolkit

**Purpose:** Turn a raw multifunction-printer scan (emailed into the SCANS list as a generic task + PDF) into a clean, correctly-oriented, letter-sized PDF and a descriptively-named task — and, for short documents, a readable text transcript so Michael never has to open the file.

**Steward:** Fleet Felix (mechanical intake, sibling to screenshot-intake). Execution ownerless — any agent fires it.

**Mode:** Gated (fires on a scan-type attachment).

**Invocation:** `/scan-intake` · "normalize this scan" · "split this scan" · automatic via the Attachment Router PDF branch when a PDF reads as a copier scan (Xerox/AltaLink producer, tabloid two-up spreads, or upside-down pages).

**Trigger:** A PDF attachment on a task in URITP ▸ INBOX ▸ SCANS (or any task handed over as "a scan"), especially ones titled "Scanned from a Xerox Multifunction Printer."

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-09-03** by Dev Dexter.

---

## Coordinates

| Surface | Location |
| --- | --- |
| SCANS list | URITP ▸ INBOX ▸ SCANS (list `4026855573866409995`) |
| Founding task | "Scanned from a Xerox Multifunction Printer" (URITP-13154) |
| Tooling | `pdfinfo` / `pypdf` / `pdftoppm` / `ghostscript` / `pdftotext` (poppler) / `tesseract-ocr`, all in the sandbox |

---

## Procedure

Run in the sandbox. Load the source PDF from the task attachment.

1. **Measure.** `pdfinfo` + `pypdf` per page: page size (pts → in) and `/Rotate`. A copier "spread" displays landscape ≈ 17×11 (often stored 11×17 portrait with `/Rotate 270`). Flatten rotation into content first (`transfer_rotation_to_content`) so geometry is true before you cut.

2. **Decide the split.** If the displayed page is a landscape tabloid two-up (≈ 17×11), split each sheet down the vertical center into two 8.5×11 pages, LEFT half first then RIGHT (reading order). If pages are already single letter/portrait, skip the split. Never assume from the file name — measure.

3. **Fix orientation.** Render a low-res contact sheet (`pdftoppm`) and look. Any spread scanned upside down: rotate its halves 180° AND swap the half order (on a flipped spread the left-hand page sits on the scan's right). Confirm by reading page folios — they must run continuous.

4. **Trim blanks.** Drop blank leading/trailing pages (e.g. the blank verso that opens a book scan). Confirm against folios/content; never drop an interior page.

5. **Verify.** Re-render a contact sheet: every page upright, letter-sized, folios sequential. Compress with ghostscript (`-dPDFSETTINGS=/ebook`) to keep the size sane.

6. **Rename the task.** From the generic printer title to `SCAN · <YYYY-MM-DD> · <content descriptor>` (date = scan/intake date; descriptor = short human summary of what the scan is). `SCAN ·` is a functional prefix in the grandfathered `↪️ HANDOFF ·` family.

7. **Surface the clean PDF on the task.** Write the normalized PDF to the sandbox output dir and post it to the task as a downloadable comment link. ⚠️ TOOL LIMIT (found live): a sandbox-produced file cannot be pushed into ClickUp's Attachments panel with available tools, and `attachment_ids` only forwards attachments the user already shared. Surface it as a comment link and say so plainly — do not claim it landed in the Attachments panel. Never delete or overwrite the original source attachment.

8. **OCR → surface the text (SHORT DOCS ONLY: final page count < 5).** So Michael can read the scan without opening it. Count pages on the NORMALIZED PDF, after split/trim (a 20-spread book becomes 39 pages and does NOT qualify; a 4-page syllabus does). For qualifying docs:
   - **Extract per page.** Try the embedded text layer first: `pdftotext -layout -f N -l N file.pdf -`. Xerox AltaLink scans already carry an OCR layer, so this usually returns clean text with zero rendering. If a page returns < ~40 chars (no/sparse layer), FALL BACK to rendering it at 300 DPI (`pdftoppm -r 300`) and running `tesseract <png> stdout`.
   - **Post as a comment**, headed `🔎 Auto-OCR transcript` with the machine-extracted / may-contain-errors disclaimer. Keep page markers (`--- Page N ---`). Light cleanup of OCR noise and reflowing to readable prose is fine; do NOT invent content.
   - **Comment vs description:** default to a COMMENT (the description keeps the original scan-email boilerplate as archive). Only overwrite the description when Michael asks for the text to be the task's primary reference surface.
   - **≥ 5 pages:** skip OCR by default (too long for a comment); offer it on request. A long transcript belongs in a doc page, not a comment.

---

## Guardrails

- **Never destroy the source.** The original scan PDF stays on the task; the normalized file is additive.
- **Measure, don't guess.** Split / flip / trim decisions come from actual geometry plus a rendered inspection pass, never from the file name.
- **Confirm the rename shape once.** `SCAN · date · descriptor` is the default; if Michael wants a different shape it's set once and reused. Rename is reversible, so apply it and let him veto.
- **Interior pages are sacred.** Only leading/trailing blanks are dropped, and only after confirming they are truly blank.
- **OCR is a machine read, not ground truth.** Always label the transcript as auto-extracted. Handwriting, highlights, and low-contrast marks are NOT reliably captured — say so. The embedded Xerox layer DOES make errors (live example: it flipped a "no internet access" policy line to its opposite); when a value matters, verify against the rendered page before asserting it, and flag the correction inline.
- **PII / public repo.** This repo is PUBLIC. Scan CONTENT and OCR text (which routinely carry names, emails, phone extensions) never enter the repo, an artifact, or a channel — they live only on the ClickUp task. Only the mechanical procedure lives here.

---

## Composes with

- **Attachment Router → PDF branch** — the router hands scan-type PDFs here; the PDF Split Markdown Packager owns the OTHER PDF branch (splitting a doc into markdown for doc-import). Different verbs, do not merge.
- **Task-Context Orientation Gate** — orient to the SCANS list before acting.
- **de-slop-pass** — on the rename descriptor and the comment.

---

## Changelog

- **v2 (2026-09-03)** — Added the OCR text-surfacing step (step 8) so short scans land as a readable transcript comment without opening the file. Embedded-layer-first (`pdftotext`), tesseract fallback. < 5-page gate (on the normalized count). Proven on the THTR 295/299 syllabus (4 pp, clean) and correctly declined on the 8-page contacts roster and the 39-page book. Records the live embedded-OCR error class (a policy line read as its opposite).
- **v1 (2026-09-03)** — Established by Dev Dexter, from the URITP-13154 scan (a stage-lighting book, *The Magic of Light*): 20 tabloid spreads → 39 letter pages, four upside-down spreads flipped + re-sequenced, blank cover dropped. Documents the Attachments-panel tool limit found live.
