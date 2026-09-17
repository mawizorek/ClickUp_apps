# Scan Intake · AI Toolkit

**Purpose:** Turn a raw multifunction-printer scan (emailed into the SCANS list as a generic task + PDF) into a clean, correctly-oriented, letter-sized PDF and a descriptively-named task — and, for short documents, a readable text transcript AND a read of any handwriting/annotations, so Michael never has to open the file. **Then get it OUT of the list** (see Sweep Mode).

**Steward:** two-layer, because this scanner is used for URITP AND for personal/other work.
- **Mechanical intake** (measure → split → flip → trim → OCR → vision read) is domain-blind and **ownerless** — Fleet Felix housekeeps it, any agent fires it. It runs identically on a syllabus, a tax form, or a book.
- **URITP-context layer** (step 9's shorthand decoding, name resolution against the workspace, reading production-planning intent) is **Mainstage Milo's**. It fires ONLY when the scan is classified URITP.
- **Sweep mode** (disposition of the standing list) is **Milo's** — it is a routing judgement about where URITP work belongs.

**Mode:** Gated (fires on a scan-type attachment) + **SWEEP (v5, fires from the morning briefing).**

**Invocation:** `/scan-intake` · "normalize this scan" · "split this scan" · automatic via the Attachment Router PDF branch when a PDF reads as a copier scan (Xerox/AltaLink producer, tabloid two-up spreads, or upside-down pages). **Sweep:** `/scan-sweep` · "sweep the scans" · "what's sitting in scans" · or as a pointer line from `hooks/morning-briefing.md`.

**Trigger:** A PDF attachment on a task in URITP ▸ INBOX ▸ SCANS (or any task handed over as "a scan"), especially ones titled "Scanned from a Xerox Multifunction Printer."

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-09-03** by Dev Dexter.

---

## Coordinates

| Surface | Location |
| --- | --- |
| SCANS list | URITP ▸ INBOX ▸ SCANS (list `901327231551`) |
| Founding task | "Scanned from a Xerox Multifunction Printer" (URITP-13154) |
| Report-import landing (data reports) | `REPORTs Available to Import` (`901327637710`) · `Report Imports (Workday, NM, KT, etc)` (`901324196217`), both in URITP ▸ FMP Tables |
| Report-instance landing (rehearsal/performance reports) | `Production Reports` (`901328331141`) via `hooks/report-normalization.md` |
| Tooling | `pdfinfo` / `pypdf` / `pdftoppm` / `ghostscript` / `pdftotext` (poppler) / `tesseract-ocr`, all in the sandbox. Handwriting read uses the agent's own VISION on rendered page images — not a sandbox binary. |

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

9. **Handwriting & annotation pass (AI VISION — whenever the scan carries handwriting/marks, ANY page count).** This is the high-value read and the reason the hook exists past cleanup: OCR/tesseract cannot read cursive or interpret marks, but the agent's own vision CAN. Render each page to PNG (`pdftoppm -r 200`) and LOOK at it. Capture, per page:
   - **Handwritten text** — margin notes, titles written across the top, labels, question marks.
   - **Structural marks** — boxes, circles, brackets, arrows, underlines, strike-throughs, and WHAT they group or point at (a bracket around four sections is a grouping decision; a strike-through is a deletion). A mark's meaning is its target, so name the target.
   - **The throughline** — one line on what the annotations are collectively DOING (e.g. "working out how to model this roster in ClickUp: canonical vs per-show, per-production vs per-season"). This is the part Michael actually wants; the transcription is the means.
   - Post as a comment headed `✍️ Handwriting & annotation read`, labelled an AI-vision pass (not OCR). Uncertain reads get a `(?)`; never silent-guess a word.

9a. **CLASSIFY THE SCAN FIRST — URITP or not (decides whether the Milo layer fires).** This scanner is the URITP Todd Union machine but Michael also runs personal/other documents through it, so URITP is the COMMON case, never a safe assumption. Judge from CONTENT + context, not the source printer: URITP letterhead / "UR International Theatre Program" / a production name / program role codes / a URITP task association = **URITP**. A personal doc (bill, manual, medical, non-theatre) = **general**, even though it arrived in the SCANS list.
   - **URITP scan → seat Milo's context layer:** decode shorthand and expand it inline on first use — production codes (`BL` = Big Love, `TIM`/`TIM-D` = the TIME production + its Director track, `TS`, `OA` = One Acts, `KF`), role codes (`PSM`/`APSM`, `AD`, `ASM`, `SSA` = Scene Shop Assistant, `APS` = Assistant Props Supervisor, `HE`/`AHE` = (Assistant) Head Electrician, `LX` = lighting, `SND` = sound, `VID` = video, `AVE`/`AAVE` = (Assistant) Audiovisual Engineer, `LD`/`SD`/`CD` = Lighting/Sound/Costume Designer, `OC`/`EMI`/`P` = crew/enrollment tags). Resolve names against the URITP workspace, not phonetically. When a code does not resolve, say so and give the best candidate — never invent an expansion. Read the season from the folders, never recite it from memory (Milo's KNOW THE SEASON rule).
   - **General scan → NO URITP layer.** Read the handwriting plainly as what it says. 🚫 Do NOT map marks onto theatre codes or production names — forcing `LX`/`PSM`/a show onto a personal document is a fabrication, the exact failure this gate exists to prevent. When in doubt about classification, treat as general and ASK.

---

## 🔴 SWEEP MODE — THE DISPOSITION SWEEP (v5, 2026-09-17)

**Steps 1-9 make a scan READABLE. This makes it LEAVE.** Added because normalization was running well and the list was still growing: 138 tasks, 70 of them sitting in `new`, as of 2026-09-17.

### 🎯 THE MODEL: SCANS IS A TRANSIT LIST, NOT A HOME

Michael, 2026-09-17, and this is the whole design:

> *"Scans are different because I generally don't want them to live here. Once a scan is closed, it's out of the way, and I don't need to look at it anymore. I prefer to merge tasks out or, if it's a new report that needs to be imported, it should land in the report import to get the appropriate normalization... Sometimes the information can just be linked out; we capture the data, put it where it needs to be, and close the scan. It can also just live in this task list, which is fine for some things!"*

🚫 **THE PROPOSAL THIS KILLS, recorded because it was wrong in a specific and instructive way:** a `Links OUT` relationship field on the SCANS list, proposed earlier the same session on the reasoning that ~40 normalized scans had no outbound wire and were therefore "orphans by construction."

⭐ **They are not orphans. They are IN TRANSIT.** A scan does not need an outbound relationship because **the task itself goes away** — it merges into its destination, moves out of the list, or closes once its content has landed somewhere. Adding a relationship field would have built a permanent home for something designed to be temporary, and every filled field would have been a scan that failed to leave.

🔁 **The analyst error is worth more than the fix:** Milo's own `memory.md` thesis 2 says **CONTAINER = MATURITY STATE — a thing MOVES BETWEEN CONTAINERS AS IT MATURES, location is a lifecycle field nobody declared, and emptiness is information.** That thesis describes this list exactly. **A pattern in memory that does not fire is worth nothing**, and this one had to be corrected by Michael in the turn after it was quoted. Same species as the ONE ACTS roll-call miss: *writing a rule is not obeying it.*

### The four dispositions

Every scan resolves to exactly one. **The sweep PROPOSES; Michael rules.**

| # | Disposition | When | Mechanism |
|---|---|---|---|
| 1 | **MERGE OUT** | The scan IS a document that belongs to an existing canonical task (a receipt for a purchase request, a plot for a Show Design element, paperwork for a `Paperwork (<SHOW>)` row). | `merge_tasks` into the canonical task. 🔴 **DESTRUCTIVE — the source scan task is deleted.** Attachments and comments carry over. Michael's stated preference and the most common right answer. |
| 2 | **MOVE OUT to report import** | The scan is a NEW REPORT that needs normalizing. | Move to the correct report surface. ⚠️ **TWO destinations, do not conflate:** a **data report** (Workday, budget, FOA, roster export) → `REPORTs Available to Import` / `Report Imports`. A **rehearsal or performance report** → `Production Reports` via `hooks/report-normalization.md`, which is a different normalization entirely. |
| 3 | **LINK OUT + CLOSE** | The scan's INFORMATION is what matters, not the file. Capture the data into its real home, then close. | Write the value into the destination (a field, a task body, a note), link the destination, set the scan `library`. **The scan becomes evidence, not work.** |
| 4 | **STAY** | Legitimately fine for some things — reference material with no better home. | Leave it. 🚫 **This is a real answer, not a failure to decide** — but say WHY it stays, or it is indistinguishable from a scan nobody triaged. |

### What CLOSED means here

**`library` = out of the way, handled, not to be looked at again.** 🚫 **A closed scan is NEVER a finding.** Do not resurface it, do not audit it for missing links, do not count it as backlog. The whole point of the disposition is that it ends.

⚠️ **Known limit, stated rather than solved:** `library` does not record WHICH disposition happened, so a linked-out-and-closed scan is indistinguishable from a stays-here scan. Both are correct outcomes and Michael has ruled both acceptable, so **this is not worth a field.** Read the comments if provenance matters.

### The sweep, per run

1. **Read the OPEN scans only** (`new`, `researching`, `working`). Closed is done.
2. **Skip anything not yet normalized** — a task still carrying the raw printer title needs steps 1-9 first. Normalization is a prerequisite for disposition, not part of it.
3. **Classify URITP vs general** (step 9a). A general scan's disposition is almost always STAY or a personal-surface link; **never route a personal document into a production surface.**
4. **Propose ONE disposition per scan** with its destination named and linked. Group by destination — six receipts heading for the same Purchase Request row is one decision, not six.
5. **Report as links.** Cap the proposal set at ~10 per run; a longer list is a work session, not a sweep (same ceiling as the briefing's drill batch).

### 🚫 Authority

**PROPOSE-ONLY. The sweep executes NOTHING on its own.**

- 🔴 **MERGE DELETES THE SOURCE TASK.** It is irreversible, it is Michael's call every time, and it goes through the standard preview-then-confirm flow. **Never merge on inference about where a scan belongs.**
- **MOVE** crosses lists with different statuses and fields — fires the Task Move Impact Gate first.
- **CLOSE** is only correct once the content has verifiably landed somewhere else. **Closing a scan whose data went nowhere is data loss wearing a tidy list.**
- The sweep MAY write the normalization products of steps 1-9 (rename, transcript comment, vision read) unprompted, per the existing hook. **Disposition is a different class of write and is gated.**

### Morning-briefing integration

ONE pointer line, in the REPORTS PROCESSED block: how many open scans, how many are un-normalized, and how many have an obvious destination. 🚫 **Never enumerate the scan list in the brief** — that is Ricky's-data-routines-eating-the-brief shaped, and Rule 0's threshold fix applies (raise the bar, do not compress the writing).

---

## Guardrails

- **Never destroy the source.** The original scan PDF stays on the task; the normalized file is additive. *(Disposition #1 deliberately deletes the TASK after merging its contents — that is Michael's ruling, executed only on his confirmation, and is not a licence to drop an attachment.)*
- **Measure, don't guess.** Split / flip / trim decisions come from actual geometry plus a rendered inspection pass, never from the file name.
- **Confirm the rename shape once.** `SCAN · date · descriptor` is the default; if Michael wants a different shape it's set once and reused. Rename is reversible, so apply it and let him veto.
- **Interior pages are sacred.** Only leading/trailing blanks are dropped, and only after confirming they are truly blank.
- **OCR is a machine read, not ground truth.** Always label the transcript as auto-extracted. Handwriting, highlights, and low-contrast marks are NOT captured by OCR — that is what the step-9 vision pass is for. The embedded Xerox layer DOES make errors (live example: it flipped a "no internet access" policy line to its opposite); when a value matters, verify against the rendered page and flag the correction inline.
- **Vision handwriting read is interpretation, labelled as such.** Mark it an AI-vision read, tag uncertain words `(?)`, never silent-guess, and separate what is WRITTEN from what it MEANS. A decoded abbreviation that does not resolve is stated as unresolved with a best candidate, never invented (same rule as never inventing OCR content).
- **URITP decoding is GATED, never default (step 9a).** The scanner serves URITP and personal work both. Apply the Milo context layer only to a scan classified URITP; on a general scan, read marks literally and never map them onto theatre codes or a production. Misclassifying a personal doc as URITP invents content.
- 🔴 **A SCAN LEAVING THE LIST IS THE SYSTEM WORKING.** Do not measure the health of SCANS by how much is in it, and never treat an emptying list as lost data. The backlog metric is **open scans with no disposition**, nothing else.
- **PII / public repo.** This repo is PUBLIC. Scan CONTENT, OCR text, and handwriting reads (which routinely carry names, emails, phone extensions, and Michael's private planning notes) never enter the repo, an artifact, or a channel — they live only on the ClickUp task. Only the mechanical procedure lives here.

---

## Composes with

- **Attachment Router → PDF branch** — the router hands scan-type PDFs here; the PDF Split Markdown Packager owns the OTHER PDF branch (splitting a doc into markdown for doc-import). Different verbs, do not merge.
- **Task-Context Orientation Gate** — orient to the SCANS list before acting.
- **Mainstage Milo** — stewards the step-9a URITP-context layer AND sweep mode; seat him (or his knowledge) when a scan is classified URITP.
- **`hooks/report-normalization.md`** — disposition #2's rehearsal/performance-report branch hands off to it. ⚠️ Its `[XX] | reports |` intake is the CANONICAL source for emailed reports; a SCANNED report is a different arrival path to the same Production Reports list.
- **Task Move Impact Gate** — fires before disposition #2.
- **de-slop-pass** — on the rename descriptor and the comments.
- 🚫 **NOT `hooks/sweep-for-links.md`.** NAME COLLISION, recorded because it is a live trap: that hook hyperlinks entity names inside a composed REPLY before posting. It has nothing to do with linking tasks to each other or with this list. Different verb, different object.

---

## Changelog

- **v5 (2026-09-17)** — Added **SWEEP MODE** and the four dispositions (MERGE OUT / MOVE OUT to report import / LINK OUT + CLOSE / STAY), from Michael's ruling that **SCANS is a transit list and he does not want scans living there.** Kills the same session's earlier proposal to add a `Links OUT` relationship field — recorded in place, with the reason: a scan needs no outbound wire because the TASK leaves. Records the analyst error (Milo's own thesis 2, CONTAINER = MATURITY STATE, already described this list and did not fire), the two distinct report-import destinations (data reports vs rehearsal reports), and the `hooks/sweep-for-links.md` name collision. PROPOSE-ONLY; merge is destructive and gated. Backlog measured at 138 tasks / 70 open on the day.
- **v4 (2026-09-03)** — Split stewardship: mechanical intake stays ownerless/Felix, the URITP-context layer becomes **Mainstage Milo's** (URITP is his organization). Added step 9a: CLASSIFY the scan URITP-vs-general BEFORE decoding, because the Todd Union scanner is also used for personal/other work — URITP shorthand decoding now fires only on URITP scans, and forcing theatre codes onto a personal document is called out as the failure this gate prevents. Prompted by Michael seating Milo as the URITP agent while noting the scanner's mixed use.
- **v3 (2026-09-03)** — Added the AI-vision handwriting & annotation pass (step 9): reads cursive, boxes/arrows/brackets/strike-throughs and their targets, states the throughline, and decodes URITP shorthand (production + role codes) inline. Fires on any page count when marks are present (unlike OCR's <5-page gate). Proven on the 8-page annotated production-staff roster (URITP-13148) where tesseract returned only noise for the notes — vision recovered the full canonical-vs-per-show data-model thinking and identified the page-8 ClickUp export with its broken lookups.
- **v2 (2026-09-03)** — Added the OCR text-surfacing step (step 8) so short scans land as a readable transcript comment without opening the file. Embedded-layer-first (`pdftotext`), tesseract fallback. < 5-page gate (on the normalized count). Proven on the THTR 295/299 syllabus (4 pp, clean) and correctly declined on the 8-page contacts roster and the 39-page book. Records the live embedded-OCR error class (a policy line read as its opposite).
- **v1 (2026-09-03)** — Established by Dev Dexter, from the URITP-13154 scan (a stage-lighting book, *The Magic of Light*): 20 tabloid spreads → 39 letter pages, four upside-down spreads flipped + re-sequenced, blank cover dropped. Documents the Attachments-panel tool limit found live.
