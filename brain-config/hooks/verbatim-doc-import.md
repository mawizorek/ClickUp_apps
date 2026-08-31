# Verbatim Doc Import · AI Toolkit

**Purpose:** Migrate a piece of existing paperwork (a PDF handbook, a scanned manual, a collection of articles) into the doc-render tree as a set of standalone rendered pages — **the words unchanged.** The output is the same document a reader could flip through in real life, now deep-linkable, searchable, and rendered on the house theme. This is a TRANSLATION of format, never a rewrite of content.

**Steward:** Mainstage Milo (`super-agents/mainstage-milo/`) for URITP program documents. The mechanical steps are ownerless — any agent may run them. A formal, scoped, reported full-document pass IS an audit and SEIZES to Audit Anna.

**Mode:** On-demand routine, PHASED (see below).

**Invocation:** "convert/translate/migrate this handbook," "bring this PDF into the repo as pages," "render this paperwork," or any hand-over of a source document to be reproduced as doc-render pages. `/doc-import` · `/verbatim-import`.

**Trigger:** A source document (PDF, scan, Word doc, article set) is handed over to become rendered pages in a content repo, AND the intent is to REPRODUCE it, not author something new from it.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-31** by Mainstage Milo, during the URITP Stage Manager's Handbook (Nigel Maister, 4th ed.) migration into `uritp-docs`.

---

## 🔴 THE ONE LAW: BRING THE ITEMS IN, DON'T EDIT THE CONTENT

Michael, 2026-08-31: *"Add connection, style, and form, but not content!"* and *"word-for-word verbatim transcriptions. I don't want added emojis or AI slop."*

<p><br/></p>

What you MAY add (this is form and connection, not content):

- **Structure** — splitting one document into one page per source section, folders per chapter.
- **Connection** — `@id` links wrapping cross-references the author ALREADY WROTE ("see Appendix A", "p.53"). You are linking their words, not writing new ones.
- **Form** — frontmatter, and the house's own markers (`!!! tip`, `!!! note`, `!!! warning`, abstracts, question blocks) **only where the source itself signals them** (it literally says "Tip!", "Note:").

What you MUST NOT add: new sentences, paraphrase, summaries in the body, "Related" footers the author never wrote, emoji, normalized pronouns, dropped author asides, cleaned-up typos (unless told). **A transcription that silently improves the source is not a transcription.** The reader must be able to hold the rendered page next to the original and find only: page splits, frontmatter, grounded markers, and links around existing references.

---

## Phases

### Phase 0 — SCOPE (before any write)

1. **Read the whole source.** Confirm text layer quality (extractable vs needs OCR). Detect duplicate uploads by hash before treating them as different versions.
2. **Resolve the target repo by AUDIENCE, not authorship** (`gates/repo-referent-gate.md`): program/role/guide documents → `uritp-docs`; safety articles → `uritp-safety`. State `owner/repo@branch` out loud.
3. **Read the repo at HEAD** — the authoring rules (`00-authoring/`), the `_template.md` frontmatter contract, folder-naming law (bare folder = content; ordering via `order:`, NEVER baked into folder names/URLs), and model an existing sibling folder.
4. **Confirm granularity + placement with Michael.** Page-per-line vs page-per-parent is the whole cost driver — do not assume it. Confirm the folder shape (e.g. a section `index` beside a `handbook/` folder).

### Phase 1 — SCAFFOLD

5. **Copy the source's table of contents into the destination index VERBATIM as a checklist** — one unchecked box per page to migrate, carrying the source's own page numbers. This index IS the migration tracker: a box gets checked and turned into an `@id` link as each page ships. Folder-per-chapter, page-per-line (or per the confirmed granularity).
6. **Lock the id scheme up front** (e.g. `sm-` prefix; `@sm-appendix-a`, `@sm-line-notes`) so forward links resolve the moment their target ships.

### Phase 2 — PILOT ONE CHAPTER

7. Build the first chapter end to end (chapter index + its pages), PR it, and let Michael eyeball the RENDER before scaling. Cheaper to fix the template on 6 pages than 60.

### Phase 3 — BULK, CHAPTER BY CHAPTER

8. One PR per chapter. Verbatim body, frontmatter per repo contract, markers only where the source signals them, forward `@id` links wired as you go.

### Phase 4 — ASSETS & LINK CLOSE-OUT

9. Extract diagrams/figures as `@img:` assets. Confirm every forward `@id` now resolves. Wire supporting-doc / template references if they have real targets.

### Phase 5 — DRIFT REVIEW (flag, never silently fix)

10. The source will contain stale facts (old room names, retired policy, dated logins). Migrate them FAITHFULLY and queue a separate drift list for the document's owner (and original author) to rule on. 🔴 Translating is not the moment to correct the source.

---

## Guardrails

- 🔴 **Content is frozen; only form/connection/structure move.** The one law above.
- 🔴 **Broken forward links are an INTENTIONAL FLAG, not a bug** (Michael, 2026-08-31: *"that is literally the point of the broken link."*). Wiring `@id` links to not-yet-built pages minimizes later work and marks the gap visibly. Do NOT hold off linking known-planned pages.
- **Markers are opt-in from the SOURCE.** A `!!! tip` is legal only where the author wrote "Tip!". Never sprinkle callouts for flavor.
- **Preserve verbatim quirks** — typos, stray parens, ALL-CAPS headings, author pronouns, "(video)"/"(article)" tags. Ask before cleaning anything. Default is leave it.
- **Credentials / PII:** a source may carry live logins or personal data. Confirm keep-vs-redact with Michael before committing; never assume a private repo makes it fine. Report the decision.
- **PR-Merge workflow** (branch → commit → PR → self-merge; never straight to `main`). Pilot chapter is its own PR; then one PR per chapter.
- **The destination index checklist is the source of truth for progress** — keep it current in the same pass a chapter ships.

---

## Composes with

- `gates/repo-referent-gate.md` — which repo, decided by audience.
- `hooks/devising-transcript-archive.md` — sibling verbatim-import routine (audio → text); same "archive raw, never editorialize" DNA, different input/output.
- `GitHub MCP — Operating Standard` — PR-Merge, commit format, blob-first reads.
- doc-render-engine authoring contract (`uritp-docs/00-authoring/`, `template-docs/_template.md`) — frontmatter, `@id`, `@img:`, folder-naming.

---

## Changelog

- **v1 (2026-08-31)** — Established by Milo during the URITP Stage Manager's Handbook migration. Captures the one law (form/connection/structure yes, content no), the TOC-as-checklist scaffold, page-per-line/folder-per-chapter, pilot-one-chapter-first, forward-links-are-an-intentional-flag, markers-only-where-signaled, verbatim-quirks-preserved, credentials-ask, and drift-flag-not-fix. Named the reusable pattern so future paperwork migrations (the Emergency Handbook next) route here without Michael re-explaining.
