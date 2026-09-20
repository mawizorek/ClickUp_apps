# Vale — Memory (patterns + ruled conventions)

> PATTERNS and RULED CONVENTIONS only. Counts, statuses, project phase **and the open-question list** live in the LIVE STATE block on [Vale's Agent Index row](https://app.clickup.com/t/86ake8men) (base spec §4a — an open question can close in a day, so it is STATE). **A number in this file is a defect on sight.**
>
> ~10KB hot cap (`hooks/memory-rotation.md`). Archives: **`memory/archive/vwx-reference-2026-09.md`** (standards package, Spotlight, rigging, records) · **`memory/archive/vwx-performance-referencing-2026-09.md`** (referencing topology, storage, performance, VW's own bug list). Load on demand; **never restate them here.**

---

## 🔑 THE ORGANIZING PRINCIPLE — **WHAT TRAVELS**

**Promoted 2026-09-20 from a six-instance tally to a named principle.** Every hard question in this lane resolves by asking which of three layers a thing lives in, and who next opens the file:

1. **DOCUMENT state** — travels with the file; a template can carry it. Classes, layers, symbols, caches, purge state, origin, reference settings.
2. **MACHINE state** — user folder, invisible to a collaborator, **cannot be templated.** Undo count, VectorCaching, graphics acceleration, workspaces, plug-ins, `SavedSettings.xml`.
3. **STORAGE state** — the file's bytes may not be where the path says. iCloud eviction.

⭐ Six independent appearances in a month (DWG hedge · plug-in vs document resource · library-as-source vs shelf · script palette · memory levers · file location), and **a Load Board built to Michael's own navigation habits sorted its panels into these three groups unprompted.**

🔑 **Before answering: which layer is this, and can `vwx-base-file/` carry it at all?** If it cannot, say so — a standard that cannot travel is advice.

---

## 📒 Ledger A — Conventions Michael has RULED

### A1 · 2026-09-10 · 🔑 The VWX notes are about VECTORWORKS. Venue information goes to the URITP notes.

**Verbatim:** *"I just want you to talk about Vectorworks documentation and how we build our Vectorworks files. Any info about the venue should go into my URITP notes and not in my Vectorworks prose notes. **They are entirely different!**"*

How a file is BUILT is craft and portable — class grammar, layer conventions, symbol rules, referencing, origin discipline, template structure, drafting standards, the DWG hedge. **What is true about a ROOM is not**, even when the room's facts live inside a `.vwx`. The Smith layer LIST and class LIST are venue content: **the grammar is portable, the inventory belongs to the building. A rule is a standard; an instance is a venue fact.**

🚫 **No venue name in a `standards/vectorworks/` file.**

### A2 · 2026-09-10 · The venue package in the prose repo was SLOP, and he had been pruning it himself

*"all that other shit is slop that I think you put in the first place."* ✅ Verified: `maw-prose/venues/smith-theatre/` was MAW Agents, PRs #3/#5, 2026-07-29. ⭐ **His two "mysteries" were him enforcing A1 before it was written** — he DELETED `the-room.md` (08-04) and COMMENTED OUT `layers.md` (08-17). **Legible in git for five weeks and I read it as rot.**

### A3 · 2026-09-10 · 🔴 STOP LITIGATING PUBLIC vs PRIVATE. Ruled 2026-07-29; I re-opened it six weeks later.

**Michael:** *"why do you keep over complicating this."* His Prose DL Q16 note had answered it already: *"nothing here is ever actually public unless I send it out … I share control and gatekeep … we are not holding PII in this shit and **I'm annoyed that all we do is talk about private/public and share. I want to just be able to see my fucking notes that I'm taking.** we are NOT starting another doc editor wiki version of what we already have."*

**Three parts:** (1) **visibility is not the question and not a blocker** — he gatekeeps by choosing what to send · (2) **the content carries no PII**; treating class trees as a classification problem IS the over-complication · (3) 🚫 **no new doc surface, editor, wiki or site — ever, unless he asks.**

⚠️ **My failure, precisely:** I made visibility **THE GATING QUESTION** and asked him to rule what he had ruled. **A stale framing I inherited from the DL outranked a direct instruction from him inside the same DL** — I read the options, not the note.

🔴 **RETRACTION:** Ledger B called three DL rulings (J8, J10, Q1) *"WRONG"* for calling `maw-prose` private. **They are not wrong — my reading was.** Not a security claim; *he is the gate.*

---

## 📕 Ledger B — The surfaces (pointers only)

- 🔑 **`maw-prose/standards/vectorworks/`** — **Vale's home surface.** Portable craft only, venue-agnostic since 2026-09-10 (PR #51).
- **`maw-prose/venues/`** — 🗑️ tombstoned, flagged for his delete. ⚠️ **`smith-theatre/classes/walls/` CARVED OUT** — his own files, 08-17, not mine to sweep.
- 🔑 **`uritp-docs/production/venues/spac/`** — the venue home, his hand. `smith-theatre/` + `vwx-base-file/` (layers + classes filled, PR #186).
- **The ClickUp `Vectorworks` reference tree** — a further surface. **Assume nothing about which is fresher.**
- **`Resource FOLDERS`** (URITP Inventories) — ⚠️ scaffolded, **never populated.** Empty means never populated, not emptied. **Not a source.**
- **His files read as EDUCATIONAL edition**, which gates `Check File Health` (subscription-only). Unverified — **never tell him to run a tool his license may not have.**

⚠️ **Visibility is per repo** (`maw-prose` public, `uritp-docs` private): a ROUTING fact, not a security one (A3). Never carry it across.

🔴 **The Prose DL is STALE for this lane.** Opened 2026-07-29; `uritp-docs` did not exist until 08-03, so its whole publishing thread argues a repo he never built and then built differently. **Do not route VWX decisions there or mine it for open questions.**

🔴 **THE ONE UNRULED ITEM THAT GOVERNS THE OTHERS — EMBED vs REFERENCE.** Open since 2026-09-08 as a contradiction inside the standards package's own text: the DWG hedge says keep resources EMBEDDED, the Resource Manager guidance says REFERENCE from a master. **Vale's position, offered twice, NOT ruled: reference the GEOMETRY, embed the RESOURCES** — a dead room reference is one missing drawing, a dead library reference greys out every fixture. It decides whether the library is a **SOURCE or a SHELF**, and class tree, template family and script-palette home all resolve from it. 🚫 **Out of Ledger A until he rules. Never promote a position by repeating it.**

📋 **Every other open question lives on the Agent Index LIVE STATE block, not here.**

---

## 📗 Ledger C — Recurring file problems

- **C1 · ~~Docs that exist and do not render.~~ RETRACTED 2026-09-10** — `layers.md` was **his own park.** ⭐ **Read the commit that broke it before calling a document broken.**
- **C2 · Vendor docs that resolve STALE and read current.** Mine: recommended a command VW2020 replaced, off a 2018 page. 🔑 **Read the year in the URL.**
- **C3 · One truth, several surfaces.** The CONTENT and its CORRECT HOME were in different repos — a stranded migration, not duplication.
- 🔴 **C4 · 2026-09-19 · HELP DOCUMENTS INTENT; RELEASE NOTES DOCUMENT FAILURE.** I read six referencing pages, four preference panes, File Health and Purge exhaustively and **never asked whether the behaviour was a DEFECT** — his two symptoms are named VW bugs with fix IDs. **A symptom is a configuration, a misuse, or a BUG, and I considered only the first two.** The Source-Freshness Gate made me version-check every DOC; nothing made me version-check his APPLICATION. **Check the release notes before diagnosing the configuration.**
- 🔴 **C5 · 2026-09-17 · A CATALOGUE IS NOT A DIAGNOSIS.** Six causes ranked by frequency, when the useful answer was a **DISCRIMINATOR** one question away — his own symptom pattern ruled out most of my list. **The ordering must come from HIS symptoms.**
- 🔴 **C6 · 2026-09-17 · ORDER CARRIES THE RISK, NOT THE ACTION.** The correct iCloud fix in the wrong order is a documented **data-loss** class (moving evicted files moves empty placeholders). Second time in a month. **State the ORDER and what breaks mid-way before proposing any migration.**

---

## How Michael works (confirmed patterns only)

- **Collapses duplicate sources of truth on sight.** Never propose a mirror, a second editor, or a new surface. **Prefers the structural fix to another behavioural rule.**
- 🔑 **He prunes by DELETING, quietly. His deletions are rulings with no prose attached** — read the commit, not just the tree.
- 🔑 **He answers a framing question with a better question.** When he asks one back, **the premise is what he disputes.**
- 🔴 **His NOTES outrank the checkbox options and outrank my analysis. Read every note before a single option.**
- 🔴 **He does not repeat himself patiently.** *"WE KNOW THISSSSSS."* A re-asked question reads as not listening.
- 🔑 **A PARK IS A SEQUENCING INSTRUCTION, NOT A REJECTION** (09-12). *"Coming back to that convo"* → record as parked, **stop talking about it.** Treating a park as rejection loses the finding; treating it as open re-litigates it. **His handling carries information — here it is about ORDER, not merit.**
- 🔑 **He tends to be on DEFAULTS, deliberately** (09-18), and describes them accurately even when he cannot name them. **Before flagging a hazard, check whether the default already prevents it.**
- **Wants the reasoning kept, not just the outcome. He will delete a thing he just paid to fix** — sunk cost is not an argument.
- **He knows this craft better than the documentation does.** A claim about his domain or his setup is mine to ASK, never assert.
- **He asks HOW IT WORKS.** A recommendation with no mechanism is worth less than the mechanism alone.
- **Dictates.** A garbled term is mis-heard before it is wrong — name it, offer the candidate, ask, stop.

## Where Vale expects to be wrong

- 🔴 **Reading his setup PESSIMISTICALLY — four instances in one month, the pattern to watch.** Unbuilt read as broken · his parks read as rot (C1) · a concept-page sentence generalized into a universal the per-reference dialog contradicts (absolute vs relative paths) · a legacy-method hazard raised as his when his default blocks it. ⭐ **Cheap test: does the DEFAULT handle it, and does the per-object dialog carry an exception the concept page hides?**
- 🔴 **Answering the question he ASKED instead of the one he WANTED answered** — twice. **Correct and small is still a failure.**
- 🔴 **Supplying a plausible mechanism where the vendor is SILENT** (VW never documents whether reference updates cascade). **Unknown stays unknown; offer the sixty-second test he can run.**
- 🔴 **Re-opening a settled question because I found the analysis, not the answer** (A3). The cost is his trust that I read what he wrote.
- 🔴 **Treating a stale document as authoritative because it is long and structured.**
- 🔴 **Filing venue facts as standards** (A1) — seductive because a real number feels more useful than a rule.
- ⚠️ **Letting a quantified artifact launder a guess.** The Load Board's meters read like telemetry; no `.vwx` has ever been opened. **The QUOTES are the content; the numbers are a model.**
- **Confusing what the file DOES with what he DECIDED** · **SOURCED with RULED** · **a document present because the file exists** · **designing a class tree before knowing what gets FILTERED** · 🔴 **quoting vendor docs without checking WHICH VERSION** (C2).

## Pointers (never restate)

- **Repo coordinate:** re-derive at read time (`gates/repo-referent-gate.md`). **VWX craft → `maw-prose`. Venue → `uritp-docs`.**
- **Working task:** `URITP-4421`. ⚠️ Several open items are answered by mechanisms VW already ships — **check the tool before designing the answer.**
- **VWX 2026 Load Board** (v3, teaching instrument, NOT a template): https://app.clickup.com/36074068/artifact/12cwjm-64473
- **Doc-site family, already built:** `doc-render-engine` · `template-docs` · `maw-themes`. 🚫 Publishing is an INSTANTIATION, never a build — and per A3, never a new surface.
- **Authoring rules** for `uritp-docs`: `00-authoring/` + `template-docs/_template.md`. **Keep the header you find, not the one you remember.**
- **No one-click symbol inventory exists in VW** — worksheet database row → CSV; `name, type, default_layer, default_class, count`.
- **Vellum Victoria** — the settings/status seam: she owns drawing-set STATE, Vale owns the VALUE. `preferences.md` §The seams.
- Fiona's FileMaker Canonical Object Library — the cross-runtime twin.
