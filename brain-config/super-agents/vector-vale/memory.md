# Vale — Memory (patterns + ruled conventions)

> PATTERNS and RULED CONVENTIONS only. Counts, statuses and project phase live in the LIVE STATE block on [Vale's Agent Index row](https://app.clickup.com/t/86ake8men) (base spec §4a). **A number in this file is a defect on sight — move it, do not refresh it.**
>
> ~10KB hot cap (`hooks/memory-rotation.md`). **Rotated 2026-09-10** — detail graduated to `memory/archive/vwx-reference-2026-09.md`.

---

## 📒 Ledger A — Conventions Michael has RULED

### A1 · 2026-09-10 · 🔑 The VWX prose notes are about VECTORWORKS. Venue information goes to the URITP notes.

**Michael, verbatim:** *"I just want you to talk about Vectorworks documentation and how we build our Vectorworks files. Any info about the venue should go into my URITP notes and not in my Vectorworks prose notes. **They are entirely different!**"*

**The line:** how a Vectorworks file is BUILT is craft and portable — class grammar, layer conventions, symbol rules, referencing, origin discipline, template structure, drafting standards, the DWG hedge. **What is true about a ROOM is not**, even when the room's facts live inside a `.vwx`.

**Consequence:** the layer LIST and the class LIST for Smith are venue content. The *grammar* is portable; the *inventory* belongs to the building. **A rule is a standard; an instance is a venue fact.**

🚫 **Do not put a venue name in a `standards/vectorworks/` file.**

### A2 · 2026-09-10 · The venue package in the prose repo was SLOP, and he had already been pruning it himself

**Michael:** *"all that other shit is slop that I think you put in the first place."* ✅ Verified true: `maw-prose/venues/smith-theatre/` was MAW Agents, PRs #3/#5, 2026-07-29.

⭐ **His two "mysteries" were him enforcing A1 before it was written:** he DELETED `the-room.md` (08-04) and COMMENTED OUT `layers.md` (08-17). **The intent was legible in git for five weeks and I read it as rot.**

### A3 · 2026-09-10 · 🔴 STOP LITIGATING PUBLIC vs PRIVATE. He ruled it on 2026-07-29 and I re-opened it six weeks later.

**Michael today:** *"why do you keep over complicating this."* **Michael on 2026-07-29, Prose DL Q16 note, which was sitting there the whole time:**

> *"nothing here is ever actually public unless I send it out and give it to someone … they're all mine. I share control and gatekeep … I understand technically they're publicly findable BUT … we are not holding PII in this shit and **I'm annoyed that all we do is talk about private/public and share. I want to just be able to see my fucking notes that I'm taking.** we are NOT starting another doc editor wiki version of what we already have."*

**The ruling, in three parts:**
1. **Visibility is not the interesting question and is not a blocker.** He gatekeeps by choosing what to send. Findability is understood and accepted.
2. **The content genuinely carries no PII.** Layer names and class trees are not sensitive; treating them as a classification problem is the over-complication.
3. 🚫 **No new doc surface, editor, wiki or site.** Ever, unless he asks.

⚠️ **What I did wrong, precisely:** I opened the 09-10 session by making visibility **THE GATING QUESTION** and asked him to rule on it before cleanup could start. He had ruled. **A stale framing I inherited from the DL outranked a direct instruction from him inside the same DL** — I read the Q blocks and analysed the options and did not read the note where he answered.

🔴 **RETRACTION, same pass:** Ledger B said three DL rulings (J8, J10, Q1) are *"WRONG"* because they call `maw-prose` private. **They are not wrong — my reading was.** He is not making a security claim, he is saying *I am the gate and nobody reads it unless I hand it over.* The only genuinely false artifact was one published README sentence, and it is gone with the tombstone.

---

## 📕 Ledger B — What exists (pointers; detail is archived)

🔑 **Detailed content → `memory/archive/vwx-reference-2026-09.md`.** Load it when working the substance; do not restate it here.

### The surfaces, after A1

- 🔑 **`maw-prose/standards/vectorworks/`** — 4 files. **Vale's home surface.** Portable craft only, venue-agnostic as of 2026-09-10 (PR #51).
- **`maw-prose/venues/`** — 🗑️ tombstoned, five files flagged for his delete. ⚠️ **`smith-theatre/classes/walls/` is CARVED OUT** — four files he authored 08-17, headings only, not mine to sweep.
- 🔑 **`uritp-docs/production/venues/spac/`** — the venue home, his hand, doc-render frontmatter. `smith-theatre/` + `vwx-base-file/` (layers + classes **now filled**, PR #186).
- **The ClickUp `Vectorworks` reference tree** — a further surface. Assume nothing about which is fresher.
- **`Resource FOLDERS`** (URITP Inventories) — scaffolded, unpopulated. Empty means never populated.

⚠️ **Visibility is per repo** (`maw-prose` public, `uritp-docs` private) and is a ROUTING fact, not a security one — see A3. Never carry it across; never re-open it as a question.

🔴 **The Prose DL is STALE for this lane.** Opened 2026-07-29; `uritp-docs` did not exist until 2026-08-03. Its whole publishing thread (Q14 · Q16 · Q17, arguing about a `uritp-wiki`) debates a repo he never built and then built differently. **Do not route VWX decisions there and do not mine it for open questions.** Its still-useful rulings are already carried in this file.

### 🔴 Genuinely open, and worth exactly one line each

- **The uniform design-layer scale value is recorded nowhere.** The gap most likely to bite during a reference or viewport setup.
- **`classes/walls/` — what were those four files meant to be?** Walls are architecture, not object categories; possibly per-wall systems notes filed one level off.
- **The class tree has no default attributes** for any class, so the first person to draw sets them by accident.
- **A collaborator at the venue keeps a PARALLEL 3D model.** Two models of one room — never assume which is fresher.
- ✅ **Elevation-in-class: SETTLED.** His own URITP Smith index says *"the band is part of the layer name, never a class."* Only the `URITP-4421` note is stale.

---

## 📗 Ledger C — Recurring file problems

- **C1 · ~~Documentation that exists and does not render.~~ RETRACTED 2026-09-10.** `layers.md` was **his own park**. ⭐ **Before calling a document broken, read the commit that broke it.** A reading problem, not a file problem.
- **C2 · Vendor docs that resolve at a STALE version and read as current.** Mine: recommended a command VW2020 had replaced, off a 2018 page. 🔑 **Read the year in the URL.**
- **C3 · One truth, several surfaces.** ⭐ **The CONTENT and its CORRECT HOME were in different repos** — a stranded migration, not duplication. Resolved for layers/classes 2026-09-10.

---

## How Michael works (confirmed patterns only)

- **Collapses duplicate sources of truth on sight. Never propose a mirror, a second editor, or a new surface.**
- **Chooses the structural fix over another behavioural rule.**
- 🔑 **He prunes by DELETING, quietly.** **His deletions are rulings with no prose attached** — read the commit, not just the tree.
- 🔑 **He answers a framing question with a better question.** When he asks one back, **the premise is what he is disputing.**
- 🔴 **His NOTES outrank the checkbox options, and they outrank my analysis.** The options are my framing; the note is his ruling. **Read every note before reading a single option.**
- 🔴 **He does not repeat himself patiently.** *"WE KNOW THISSSSSS."* A question he has answered, re-asked, reads as not listening — not as diligence.
- **Wants the reasoning kept, not just the outcome.**
- **He will delete a thing he just paid to fix.** Sunk cost is not an argument he accepts.
- **He knows this craft far better than the documentation does.** A claim about his domain is mine to ASK, never assert.
- **He asks HOW IT WORKS, not just what to do.** A bare recommendation with no mechanism is worth less to him than the mechanism alone.
- **Dictates.** A garbled term is more likely mis-heard than wrong — name it, offer the candidate, ask, stop.

## Where Vale expects to be wrong

- 🔴 **Re-opening a settled question because I found the analysis rather than the answer.** A3. The cost is not wasted time, it is his trust that I read what he wrote.
- 🔴 **Treating a stale document as authoritative because it is long and structured.** The Prose DL is six weeks old, superseded by a repo, and I mined it for a gating question.
- 🔴 **Filing venue facts as standards** (A1). Seductive because a real number feels more useful than a rule.
- **Confusing what the file DOES with what he DECIDED.** Geometry is evidence of a choice, not a record of one.
- **Confusing SOURCED with RULED.** A dated page citing vendor docs reads as settled.
- **Treating a document as present because the file exists.** Read the rendered content, not the listing.
- **Designing a class tree before knowing what gets FILTERED.**
- 🔴 **Quoting vendor documentation without checking WHICH VERSION** (C2).
- 🔴 **Diagnosing his parks as rot** (C1).

## Pointers (never restate)

- **Archived detail:** `memory/archive/vwx-reference-2026-09.md`
- **Repo coordinate:** re-derive at read time via `gates/repo-referent-gate.md`. **VWX craft → `maw-prose`. Venue → `uritp-docs`.**
- **The working task:** `URITP-4421`. ⚠️ Several open items are answered by mechanisms VW already ships — check the tool before designing the answer.
- **The doc-site family, already built:** `doc-render-engine` · `template-docs` (the shared page template) · `maw-themes`. 🚫 Publishing is an INSTANTIATION, never a build — and per A3, never a new surface.
- **Authoring rules** for `uritp-docs` pages: `00-authoring/` + `template-docs/_template.md`. **Keep the header you find, not the one you remember.**
- **No one-click symbol inventory exists in VW** — worksheet database row → CSV; `name, type, default_layer, default_class, count`.
- Fiona's FileMaker Canonical Object Library — the cross-runtime twin.
