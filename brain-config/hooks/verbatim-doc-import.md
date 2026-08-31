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

### 🔴 THE SLOP LEAKS THROUGH THE FRONTMATTER — GUARD THE TWO SLOTS THAT AREN'T THE SOURCE

Michael, 2026-08-31, on catching an invented lede in the SECOND sentence he read: *"there is already content that i KNOW is not from the original handbook. DO NOT EMBELLISH. and if you HAVE to put a summary in - keep it much much much tighter."* The verbatim law is easy to hold in the body and easy to VIOLATE in the two places the source doesn't supply words:

- **`summary:` is not a place to write.** The engine requires one for search, so it is the one unavoidable authored string. Keep it a **bare factual tag** — a few words naming what the section is (`"The audition and casting process."`, `"The three cardinal rules."`). NOT a flavor sentence, NOT "why it matters," NOT "who needs it." If it reads like marketing or like a lede, it is too long. When in doubt, restate the title.
- **Index pages carry LINKS, not prose.** A chapter/section `index.md` gets its child links (and the migration checklist on the handbook root) and nothing else. 🚩 **Do NOT write a descriptive body paragraph under the H1** — that paragraph is pure invention, it is not in the source, and on an index page it renders right under the `summary:` as a second authored blurb (the exact double-slop Michael caught: a flowery `summary` lede AND a body paragraph, neither Nigel's). `contents: auto` already lists children; the explicit link list is connection, a paragraph about them is content.
- The rule generalizes: **any string the source did not supply is suspect.** Frontmatter tags, index links, and grounded markers are the ONLY authored text allowed. Everything a reader sees as prose must be traceable to the original.

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

### 🔴 Phase 3½ — THE VERIFICATION GATE (MANDATORY, before every chapter PR merges)

⭐ **This is the step that makes the care survive a cold start.** "Be faithful" is a vibe and it does not survive a fresh session; a **diff you have to run and report** is a mechanical control that does. It exists because on 2026-08-31 the body text was in fact clean, but nobody could PROVE it until Michael pushed for a word-level diff — the proof was optional, so the trust was too. This gate makes the proof a required artifact, the same shape as the spine line or the orientation stamp on sibling hooks: **no diff report = the gate did not fire, and the chapter does not merge.**

For **every page** committed in the chapter, diff the committed BODY against the source extract at the WORD level and report the result:

1. **Extract the source** for the page's span (`pdftotext -f <start> -l <end>`), strip the running page-headers/footers.
2. **Normalize both sides** to a bare word stream: strip frontmatter, unwrap `[text](@id)` links to their text, drop `!!! marker` lines, remove markdown symbols (`* # ` `` ` `` ` >`), unify curly quotes/dashes, lowercase, one word per line.
3. **`diff` the two streams.** Every surviving difference MUST fall into one of these KNOWN-BENIGN classes, and you NAME which one each is:
   - running-header/footer leakage (`ur international theatre program`, the document's own title line, bare page numbers)
   - `tip` / `note` / `warning` present only on the source side = a marker you converted (approved form)
   - apostrophe/possessive splits from normalization (`asm's` → `asm` + `s`, `full-time` → `full` + `time`)
   - a heading phrase that only MOVED position (inline in source → `##` subhead), same words
4. **🔴 ANY word-level difference that is NOT one of those classes is CONTENT DRIFT — halt, fix, re-diff.** An added adjective, a smoothed clause, a dropped aside, a "helpfully" rephrased sentence: zero tolerance. A benign class you cannot name is not benign.
5. **Report the diff verdict in the PR body** — per page, either `verbatim ✓ (only <named benign classes>)` or the exact drift found and fixed. The report is the receipt; a chapter PR without it is not ready.

⚠️ The gate checks the BODY only. `summary:` and index prose are authored strings the diff cannot police — those are held by the frontmatter-slop rule above, not here. The two mechanisms are complementary: this proves the body IS the source; that proves nothing was invented where the source is silent.

### Phase 4 — ASSETS & LINK CLOSE-OUT

9. Extract diagrams/figures as `@img:` assets. Confirm every forward `@id` now resolves. Wire supporting-doc / template references if they have real targets.

### Phase 5 — DRIFT REVIEW (flag, never silently fix)

10. The source will contain stale facts (old room names, retired policy, dated logins). Migrate them FAITHFULLY and queue a separate drift list for the document's owner (and original author) to rule on. 🔴 Translating is not the moment to correct the source. (Distinct from Phase 3½: that proves you copied faithfully; this flags where the faithful copy is now WRONG about the world. Never conflate a verbatim win with a factual one.)

---

## Guardrails

- 🔴 **Content is frozen; only form/connection/structure move.** The one law above.
- 🔴 **Every chapter PR carries a word-level diff receipt** (Phase 3½). No diff report = the gate did not fire = do not merge. The proof is mandatory, not a favor asked for after the fact.
- 🔴 **Summaries are bare tags; index pages are links, not prose.** The two frontmatter/index slots are where invented content sneaks in — keep `summary:` to a few factual words and never write a descriptive body paragraph on an index page. (See the frontmatter-slop section above.)
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
- `hooks/de-slop-pass.md` — the general anti-embellishment sweep; this hook's frontmatter-slop rule is its doc-import-specific application.
- `GitHub MCP — Operating Standard` — PR-Merge, commit format, blob-first reads.
- doc-render-engine authoring contract (`uritp-docs/00-authoring/`, `template-docs/_template.md`) — frontmatter, `@id`, `@img:`, folder-naming.

---

## Changelog

- **v3 (2026-08-31)** — Added the MANDATORY Phase 3½ verification gate: every page's committed body is word-level diffed against the source, differences must be named benign classes or halt-and-fix, verdict reported in the PR body. Makes the fidelity PROVABLE rather than asserted — the control that survives a cold start, because it does not rely on the next agent caring. Answers Michael's question "how do you follow that care from a cold start." Guardrail line added.
- **v2 (2026-08-31)** — Added the frontmatter-slop rule after Michael caught an invented lede + descriptive index body on the Intro page ("already content that i KNOW is not from the original handbook"). `summary:` = bare factual tag only; index pages carry links, never a descriptive paragraph; any string the source didn't supply is suspect. Added a Guardrail line + `de-slop-pass.md` to Composes-with.
- **v1 (2026-08-31)** — Established by Milo during the URITP Stage Manager's Handbook migration. Captures the one law (form/connection/structure yes, content no), the TOC-as-checklist scaffold, page-per-line/folder-per-chapter, pilot-one-chapter-first, forward-links-are-an-intentional-flag, markers-only-where-signaled, verbatim-quirks-preserved, credentials-ask, and drift-flag-not-fix. Named the reusable pattern so future paperwork migrations (the Emergency Handbook next) route here without Michael re-explaining.
