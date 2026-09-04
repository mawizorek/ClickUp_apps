# Parts Assembly · AI Toolkit

**Purpose:** Turn a set of SUBTASK parts (each carrying a fragment of one document) into ONE compiled, correctly-ordered deliverable surfaced on the PARENT task, so the parent stands alone as the complete unit and the parts become archive.

**Steward:** Mechanical assembly (gather → order → join → publish → reconcile) is domain-blind and **ownerless** — any agent fires it, Doc-Rot-Sweep precedent. The DESTINATION's domain owner rules on content questions (is this the right pairing, is this the right title) and resolves through the 🤖 Agent Index `Lane` field **at read time, never hardcoded here** (Known-Drift Register D14). A formal, scoped, reported full-list pass IS an audit and **SEIZES to Audit Anna**.

**Mode:** Gated (fires on a parent task whose subtasks are document parts).

**Invocation:** `/parts-assembly` · `/assemble-parts` · `/compile-parts` · "combine these subtasks" · "make one final doc from these parts" · "compile the parent" · ALSO proactively offered when `scan-intake` normalizes a part and finds sibling parts of the same document under one parent.

**Trigger:** A parent task in a PARTS-style list whose subtasks each carry one attachment that is a FRAGMENT of a single document (multi-batch scans, chaptered exports, a book fed through a copier in sittings). ⚠️ The tell is that the parts are **not independently useful** — sequence matters.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-09-04**, from The Christian's Blocking Book run.

---

## Coordinates

| Surface | Location |
| --- | --- |
| Founding parts list | MAW Documents ▸ SCHEMA ▸ **VERSIONS / PARTS** (`4026812683997136686`) |
| Companion doc list | MAW Documents ▸ SCHEMA ▸ **DOCUMENTS / TEXTS / BOOKS** (`4026863652670771764`) |
| Raw scan replica | **SCANS** (`4026855573866409995`) — parts are multi-homed here; leave that alone |
| `BOOK` relationship (parent → doc record) | field `321610b4-a892-4317-9ea4-60c158d1e3f2` · **bidirectional**, surfaces on the doc record as `VERSIONS / PARTS` |
| `🌐 Attachments` (where the compiled file lands) | field `c87d74d7-b069-4bea-8570-156530c271db` |
| `Standard Dox` (on the doc record) | field `8663a173-d7b4-4a00-8750-79b768321994` |
| Tooling | `pdfinfo` / `pypdf` / `qpdf` / `pdftoppm` / `pdftotext` / `tesseract` / `ghostscript`, all sandbox. Orientation + pairing judgement uses the agent's own VISION on rendered pages. |

⚠️ **The list IDs above are the FOUNDING case, not the scope.** This hook is list-blind: resolve the actual parent/parts/relationship fields from the task in hand via the Task-Context Orientation Gate. Never assume a document lives in VERSIONS / PARTS.

---

## Procedure

### Phase 0 — Orient and inventory (READ-ONLY)

Run the Task-Context Orientation Gate first. Then enumerate the parts with **subtasks explicitly included** — ClickUp task queries exclude subtasks AND closed tasks by default, so a naive pull returns the parent alone and looks like there is nothing to assemble. Record per part: title, attachment id, page count, and stated order.

🔴 **ORDER COMES FROM EVIDENCE, NEVER FROM THE TITLE.** "Part 1..4" is a claim. Confirm against printed folios, creation timestamps of the scans, and content continuity across the seam. State which of the three you used. A mis-ordered assembly is worse than no assembly: it reads as authoritative and nobody re-checks it.

### Phase 1 — Normalize each part

Hand every part to **`hooks/scan-intake.md`** (measure → flatten rotation → split → orient → trim → verify). This hook does NOT re-implement that work. Assembly operates on normalized parts only; assembling raw parts bakes each part's defects into the deliverable permanently.

### Phase 2 — Merge and classify pages

Merge in the Phase-0 order, then classify EVERY page mechanically before compositing. Render low-res grayscale (`pdftoppm -r 50`) and measure:

- **BLANK** — ink coverage below ~0.001 at threshold 200. 🔴 **Judge blankness by INK, never by extracted text length**: duplex versos on a Xerox scan still return 1–6 characters of OCR noise, so a text-length test passes them as content.
- **Page KIND** — cluster content pages by ink density band + left-margin ink start + extracted char count. Repeating template pages (a blocking mini, a form, a header sheet) land in a tight band and are near-identical to each other; prose/script pages scatter. Sample-verify the classifier by eye on 3–4 pages per class before trusting it across the book.

**Reconcile the arithmetic and PUBLISH it:** `total in = content + blanks`, and `content = openings × pages-per-opening + solos`. A count that does not close means the classifier is wrong — stop, do not ship.

### Phase 3 — Prove orientation (do not eyeball it)

For each page class, render one sample and OCR it at all four rotations, scoring hits against a domain word list; sum across a multi-page sample and take the winner. ⚠️ **`tesseract --psm 0` OSD is NOT reliable here** — on the founding run it returned confidence 0.10–1.09 and disagreed with the correct answer. Word-hit scoring across a sample is the method.

🔑 **Known scanner defect (Xerox AltaLink C8130, duplex flatbed): pages arrive with ALTERNATING `/Rotate` — odd pages 270, even pages 90 — so every page is 90° off and the two sides are off in OPPOSITE directions.** Adding 270 to each page's existing value fixes both in one pass. Check for this first; it presents as "the scan is sideways" and a single global rotate will fix half the book and break the other half.

### Phase 4 — Compose the unit

Run `qpdf --flatten-rotation` BEFORE measuring geometry or compositing. An unflattened `/Rotate` makes `mediabox` and every transform lie, and the error is invisible until the output is already wrong.

**Pick the sheet by arithmetic, not by taste.** Two letter-landscape pages (11×8.5) stack to EXACTLY 11×17 portrait at 1:1 — zero downscaling. The same two side-by-side on 17×11 landscape forces ~77% scale, which costs legibility on handwritten annotation for no gain. Compute the scale factor for each candidate layout and state it; choose 1:1 whenever a layout achieves it.

**Preserve the text layer** — composite the source pages, never a re-render to image. A scan that arrives searchable must leave searchable.

### Phase 5 — Publish on the parent

1. **Attach the compiled file to the PARENT.** Sandbox output files return a real ClickUp attachment id/URL, which `update_task.attachments` and attachment-type custom fields accept. ⚠️ **UNVERIFIED on this path — test it on the first run and report the result.** `hooks/scan-intake.md` v1 records this as impossible ("cannot be pushed into the Attachments panel"); that claim predates the attachment-id path and may be stale. Do NOT quote either position as settled: try the write, then correct whichever file is wrong.
2. **Write the parent description as a clean reference surface** — deliverable name, the page arithmetic, what was fixed, open items, links to every part. The parent is the thing a cold reader opens; it must answer "what is this and is it complete" without opening the file.
3. **Wire the relationship** to the companion doc record if the schema has one, and confirm it resolves in BOTH directions (a bidirectional field set from one side still needs verifying from the other).
4. **Close the parts, do not cull them.** Parts move to the list's done/closed status and the raw attachments STAY. 🚫 Never delete a part, never strip its attachment, never merge parts into the parent — the raw scan is the only evidence the assembly can be re-derived from.

### Phase 6 — Report the seams

Name every page that could not be paired or placed, and say why. 🔴 **A solo page is REPORTED, never padded, force-paired, or quietly dropped.** Front matter and tail pages legitimately have no mate. Ask ONE blunt question when the pairing rule itself is uncertain ("mini above or below its script page?") and let Michael rule once; the answer then applies to the whole book.

---

## Guardrails

- 🚫 **Never destroys a source.** Parts keep their attachments; the compiled file is ADDITIVE and lands on the parent.
- 🔴 **Measure, don't guess.** Order, blankness, page kind, orientation, and sheet size all come from measurement plus a rendered inspection pass. Filenames and part numbers are claims.
- 🔴 **Publish the count reconciliation.** Every run states `in → content + blanks → openings + solos`. This is the tripwire that catches a wrong classifier, and it is the one number a reader can check without opening the PDF.
- ⚠️ **The pairing rule is a DOMAIN decision, not a mechanical one.** The lattice tells you which pages are adjacent; it cannot tell you which of the pair is the recto. Confirm once per document type.
- ⚠️ **Interior pages are sacred.** Only blanks come out, and only after the ink test plus a rendered look.
- 🚫 **PII / public repo.** `brain-config` is PUBLIC. Scan CONTENT, names, phone numbers, annotations and transcripts never enter the repo, an artifact, or a channel — they live only on the ClickUp task. Only the mechanical procedure lives here.
- ⚠️ **One parent, one deliverable.** Re-running SUPERSEDES the attached file; never accumulate `-v2`, `-final`, `-FINAL2` siblings on the parent. Two candidate compiled files means neither is trusted.

---

## Known limits (stated, not hidden)

- **Generalized from ONE live run** (4 parts, 168 pages, uniform page geometry, one production). A cold session that finds no prior run report for a document type SAYS SO rather than implying the method is proven there.
- It cannot read a page's INTENT. It knows two pages are adjacent; it does not know one annotates the other.
- The ink-density classifier is tuned to letter-size copier scans. Mixed page sizes, colour inserts, or photographs inside a document will need the bands re-derived, and that re-derivation must be declared in the run report.
- It cannot recover a part that was never scanned. A gap in the folio run is reported as a gap, never interpolated.

---

## Composes with

- **`hooks/scan-intake.md`** — 🔑 **THE SEAM, read it before firing either:** scan-intake NORMALIZES ONE FILE (per-part geometry, OCR, handwriting read); this hook ASSEMBLES MANY into one parent deliverable. Run order is one-way: **normalize every part first, assemble second.** They are two verbs on one noun; do not merge them, and do not let this hook re-implement the split/flip/trim logic that lives there.
- **Task-Context Orientation Gate** (`hooks/task-context-orientation.md`) — orient to the parts list before acting.
- **Attachment Router → PDF branch** — routes a lone scan to scan-intake; this hook is what fires when that scan turns out to have siblings.
- **PDF Split Markdown Packager** — the opposite verb (one doc → many chunks for doc-import). Do not confuse.
- **Custom Field Gate / Multi-Home Gate** — if assembly reveals the parts schema needs a new field or home, that is Corey's call, not this hook's.

---

## Changelog

- **v1 (2026-09-04)** — Established from The Christian's Blocking Book (URITP Spring '26, Hnath / dir. Maister): 4 emailed Xerox parts, 168 pages → 44 openings on 11×17 at 1:1, 82 duplex blanks dropped, text layer preserved. Every numbered rule traces to something that actually bit in that run: the alternating-`/Rotate` scanner defect, OSD confidence being useless, blank detection needing ink rather than text length, `--flatten-rotation` before compositing, the 1:1-vs-77% sheet arithmetic, and two solo pages that had to be reported rather than paired. Records the Attachments-panel write path as UNVERIFIED and in direct conflict with scan-intake v1.
