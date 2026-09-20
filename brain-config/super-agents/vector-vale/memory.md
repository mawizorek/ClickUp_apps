# Vale — Memory (patterns + ruled conventions)

> PATTERNS and RULED CONVENTIONS only. Counts, statuses and project phase live in the LIVE STATE block on [Vale's Agent Index row](https://app.clickup.com/t/86ake8men) (base spec §4a). **A number in this file is a defect on sight — move it, do not refresh it.**
>
> ~10KB hot cap (`hooks/memory-rotation.md`). **Rotated 2026-09-10** → `memory/archive/vwx-reference-2026-09.md`. **Rotated 2026-09-20** → `memory/archive/vwx-performance-referencing-2026-09.md`.

---

## 🔑 THE ORGANIZING PRINCIPLE OF THIS LANE — **WHAT TRAVELS**

**Promoted 2026-09-20 from a six-instance tally to a named principle, because appending a seventh
instance was never going to be worth more than naming it once.** Every hard question in this lane has
resolved by asking **which of three places a thing lives in, and who the next person to open the file
is:**

1. **DOCUMENT state** — travels with the file. A template can carry it. Classes, layers, symbols,
   caches, purge state, origin discipline, reference settings.
2. **MACHINE state** — lives in the user folder, invisible to a collaborator, cannot be templated.
   Undo count, VectorCaching, graphics acceleration, workspaces, plug-ins, `SavedSettings.xml`.
3. **STORAGE state** — the file's own bytes may not be where the path says they are. iCloud eviction.

⭐ **Six independent appearances in one month**: the DWG hedge · document-resource vs user-folder
plug-in · library-as-source vs library-as-shelf · the script palette · the memory levers · file
location. **A Load Board built to Michael's own navigation habits sorted its panels into these three
groups unprompted**, which is the strongest evidence it is real and not a tidy story.

🔑 **Practical form: before answering, ask which layer the answer lives in, and whether
`vwx-base-file/` can carry it at all.** If it cannot, say so — a standard that cannot travel is advice.

---

## 📒 Ledger A — Conventions Michael has RULED

### A1 · 2026-09-10 · 🔑 The VWX prose notes are about VECTORWORKS. Venue information goes to the URITP notes.

**Michael, verbatim:** *"I just want you to talk about Vectorworks documentation and how we build our Vectorworks files. Any info about the venue should go into my URITP notes and not in my Vectorworks prose notes. **They are entirely different!**"*

**The line:** how a Vectorworks file is BUILT is craft and portable — class grammar, layer conventions, symbol rules, referencing, origin discipline, template structure, drafting standards, the DWG hedge. **What is true about a ROOM is not**, even when the room's facts live inside a `.vwx`.

**Consequence:** the layer LIST and the class LIST for Smith are venue content. The *grammar* is portable; the *inventory* belongs to the building. **A rule is a standard; an instance is a venue fact.**

🚫 **Do not put a venue name in a `standards/vectorworks/` file.**

### A2 · 2026-09-10 · The venue package in the prose repo was SLOP, and he had been pruning it himself

**Michael:** *"all that other shit is slop that I think you put in the first place."* ✅ Verified: `maw-prose/venues/smith-theatre/` was MAW Agents, PRs #3/#5, 2026-07-29.

⭐ **His two "mysteries" were him enforcing A1 before it was written** — he DELETED `the-room.md` (08-04) and COMMENTED OUT `layers.md` (08-17). **The intent was legible in git for five weeks and I read it as rot.**

### A3 · 2026-09-10 · 🔴 STOP LITIGATING PUBLIC vs PRIVATE. He ruled it 2026-07-29 and I re-opened it six weeks later.

**Michael:** *"why do you keep over complicating this."* **His Prose DL Q16 note, 2026-07-29, sitting there the whole time:** *"nothing here is ever actually public unless I send it out and give it to someone … they're all mine. I share control and gatekeep … I understand technically they're publicly findable BUT … we are not holding PII in this shit and **I'm annoyed that all we do is talk about private/public and share. I want to just be able to see my fucking notes that I'm taking.** we are NOT starting another doc editor wiki version of what we already have."*

**The ruling, three parts:** (1) **visibility is not the interesting question and is not a blocker** — he gatekeeps by choosing what to send, findability is understood and accepted · (2) **the content carries no PII**; treating layer names and class trees as a classification problem IS the over-complication · (3) 🚫 **no new doc surface, editor, wiki or site. Ever, unless he asks.**

⚠️ **What I did wrong, precisely:** I opened 09-10 by making visibility **THE GATING QUESTION** and asked him to rule on what he had already ruled. **A stale framing I inherited from the DL outranked a direct instruction from him inside the same DL** — I read the Q blocks and the options and did not read the note where he answered.

🔴 **RETRACTION, same pass:** Ledger B called three DL rulings (J8, J10, Q1) *"WRONG"* for saying `maw-prose` is private. **They are not wrong — my reading was.** He is not making a security claim; he is saying *I am the gate.* The only false artifact was one README sentence, now gone.

---

## 📕 Ledger B — What exists (pointers; detail is archived)

🔑 **Detail → `memory/archive/vwx-reference-2026-09.md`** (standards package, Spotlight, rigging, records) **and `memory/archive/vwx-performance-referencing-2026-09.md`** (referencing topology, storage, performance, VW's own bug list). Load on demand; **do not restate here.**

### The surfaces, after A1

- 🔑 **`maw-prose/standards/vectorworks/`** — 4 files. **Vale's home surface.** Portable craft only, venue-agnostic as of 2026-09-10 (PR #51).
- **`maw-prose/venues/`** — 🗑️ tombstoned, flagged for his delete. ⚠️ **`smith-theatre/classes/walls/` is CARVED OUT** — four files he authored 08-17, headings only, not mine to sweep.
- 🔑 **`uritp-docs/production/venues/spac/`** — the venue home, his hand, doc-render frontmatter. `smith-theatre/` + `vwx-base-file/` (layers + classes **now filled**, PR #186).
- **The ClickUp `Vectorworks` reference tree** — a further surface. Assume nothing about which is fresher.
- **`Resource FOLDERS`** (URITP Inventories) — ⚠️ **scaffolded, never populated, and still empty as of 2026-09-20.** Empty means never populated, not emptied. **Do not read it as a source.**
- **His files read as EDUCATIONAL edition** — which gates `Check File Health` (subscription-only per VW's own page). Unverified; never tell him to run a tool his license may not have.

⚠️ **Visibility is per repo** (`maw-prose` public, `uritp-docs` private) and is a ROUTING fact, not a security one — see A3. Never carry it across; never re-open it.

🔴 **The Prose DL is STALE for this lane.** Opened 2026-07-29; `uritp-docs` did not exist until 2026-08-03. Its publishing thread (Q14 · Q16 · Q17, arguing a `uritp-wiki`) debates a repo he never built and then built differently. **Do not route VWX decisions there; do not mine it for open questions.**

### 🔴 Genuinely open, one line each

- 🔴 **EMBED vs REFERENCE is the highest-value unruled item in this lane.** Open since 2026-09-08 as a contradiction inside the standards package's OWN text: the DWG hedge says keep resources EMBEDDED, the Resource Manager guidance says REFERENCE from a master. **Vale's position, offered twice and NOT ruled: reference the GEOMETRY, embed the RESOURCES** — a dead room reference is one missing drawing, a dead library reference greys out every fixture on the plot. It decides whether the library is a **SOURCE or a SHELF**, and the class tree, template family and script-palette home all resolve differently from that one answer. 🚫 **Stays out of Ledger A until he rules it. Do not promote a position by repeating it.**
- 🔴 **His VW update level is unknown** and VW2026 Update 2.1 names his exact two symptoms as fixed bugs. **Ask before diagnosing configuration.** His macOS version is also in scope (`VB-216202`).
- 🔴 **`Update class definitions` default state is undocumented**, it lives only in Edit on the References tab, and it writes class attributes from masters into an **unratified class tree**.
- **Whether his MASTERS use DLVP or layer import** (decides circular-reference exposure at depth), **whether any chain is already circular**, and **his real tier-two count.** All his to answer.
- **The uniform design-layer scale value is recorded nowhere.** Most likely to bite during a reference or viewport setup.
- **The class tree has no default attributes**, so the first person to draw sets them by accident. ⚠️ Parked by Michael 2026-09-12 (*"fine with holding in my current class/layer practices and coming back to that convo"*) — **parked, not rejected. Do not re-raise it.**
- **`classes/walls/` — what were those four files meant to be?** Walls are architecture, not object categories.
- **A collaborator at the venue keeps a PARALLEL 3D model.** Never assume which is fresher.
- ✅ **Elevation-in-class: SETTLED.** His URITP Smith index: *"the band is part of the layer name, never a class."* Only the `URITP-4421` note is stale.

---

## 📗 Ledger C — Recurring file problems

- **C1 · ~~Documentation that exists and does not render.~~ RETRACTED 2026-09-10.** `layers.md` was **his own park**. ⭐ **Before calling a document broken, read the commit that broke it.**
- **C2 · Vendor docs that resolve at a STALE version and read as current.** Mine: recommended a command VW2020 had replaced, off a 2018 page. 🔑 **Read the year in the URL.**
- **C3 · One truth, several surfaces.** ⭐ The CONTENT and its CORRECT HOME were in different repos — a stranded migration, not duplication. Resolved for layers/classes 2026-09-10.
- 🔴 **C4 · 2026-09-19 · HELP DOCUMENTS INTENT; RELEASE NOTES DOCUMENT FAILURE.** I read six referencing pages, four preference panes, File Health and Purge — exhaustively — and **never asked whether the behaviour was a DEFECT.** His two symptoms are named, acknowledged VW bugs with fix IDs. **A symptom is a configuration, a misuse, or a BUG, and I only ever considered the first two.** The Source-Freshness Gate made me check the version of every DOC I quoted; nothing made me check the version of his APPLICATION against a known-issues list. **Check the release notes before diagnosing the configuration.**
- 🔴 **C5 · 2026-09-17 · A CATALOGUE IS NOT A DIAGNOSIS.** Asked what consumes memory, I returned six causes ranked by frequency when the useful answer was a **DISCRIMINATOR** one question away. His pattern — slow open, fast working, acceptable render — ruled out most of my list on its own. **The ordering has to come from HIS symptoms, not from frequency.**
- 🔴 **C6 · 2026-09-17 · ORDER CARRIES THE RISK, NOT THE ACTION.** The correct iCloud fix executed in the wrong order is a **documented data-loss class** (moving evicted files can move empty placeholders while iCloud treats it as a deletion). **Second time in one month that order, not the action, carried the risk.** Before proposing any migration or re-organization, **state the ORDER and what breaks mid-way.**

---

## How Michael works (confirmed patterns only)

- **Collapses duplicate sources of truth on sight. Never propose a mirror, a second editor, or a new surface.**
- **Chooses the structural fix over another behavioural rule.**
- 🔑 **He prunes by DELETING, quietly. His deletions are rulings with no prose attached** — read the commit, not just the tree.
- 🔑 **He answers a framing question with a better question.** When he asks one back, **the premise is what he is disputing.**
- 🔴 **His NOTES outrank the checkbox options, and they outrank my analysis.** **Read every note before reading a single option.**
- 🔴 **He does not repeat himself patiently.** *"WE KNOW THISSSSSS."* A question he has answered, re-asked, reads as not listening.
- 🔑 **A PARK IS A SEQUENCING INSTRUCTION, NOT A REJECTION** (2026-09-12). *"Coming back to that convo"* means record it as parked at his instruction **and stop talking about it.** Treating a park as a rejection loses the finding; treating it as still-open re-litigates it and reads as not listening. **His handling of an item carries information, and here the information is about ORDER, not merit.**
- 🔑 **He tends to be on DEFAULTS, deliberately** (2026-09-18) — and he describes them accurately even when he cannot name them. **Before flagging a hazard, check whether the default already prevents it.**
- **Wants the reasoning kept, not just the outcome.** **He will delete a thing he just paid to fix** — sunk cost is not an argument he accepts.
- **He knows this craft far better than the documentation does.** A claim about his domain or his setup is mine to ASK, never assert.
- **He asks HOW IT WORKS, not just what to do.** A bare recommendation with no mechanism is worth less than the mechanism alone.
- **Dictates.** A garbled term is more likely mis-heard than wrong — name it, offer the candidate, ask, stop.

## Where Vale expects to be wrong

- 🔴 **Reading his setup PESSIMISTICALLY — four instances in one month, and it is the pattern to watch.** Unbuilt read as broken · his parks read as rot (C1) · one concept-page sentence generalized into a universal when the per-reference dialog carried the exception (absolute vs relative paths) · a legacy-method hazard raised as his when his default already blocked it. ⭐ **The cheap test: check whether the DEFAULT handles it, and check the per-object dialog before trusting the concept page.**
- 🔴 **Answering the question he ASKED instead of the one he WANTED answered** — twice (09-12 script palette, 09-17 memory catalogue). **Correct and small is still a failure.**
- 🔴 **Supplying a plausible mechanism where the vendor is SILENT.** VW does not document whether reference updates cascade down a chain. **Unknown stays unknown; the useful move is the sixty-second test he can run himself.**
- 🔴 **Re-opening a settled question because I found the analysis rather than the answer** (A3). The cost is his trust that I read what he wrote.
- 🔴 **Treating a stale document as authoritative because it is long and structured.**
- 🔴 **Filing venue facts as standards** (A1). Seductive because a real number feels more useful than a rule.
- ⚠️ **Letting a quantified artifact launder a guess.** The Load Board's meters read like telemetry and no `.vwx` has ever been opened. **The QUOTES are the content; the numbers are a model.**
- **Confusing what the file DOES with what he DECIDED** · **confusing SOURCED with RULED** · **treating a document as present because the file exists** · **designing a class tree before knowing what gets FILTERED** · 🔴 **quoting vendor docs without checking WHICH VERSION** (C2).

## Pointers (never restate)

- **Archives:** `memory/archive/vwx-reference-2026-09.md` · `memory/archive/vwx-performance-referencing-2026-09.md`
- **Repo coordinate:** re-derive at read time via `gates/repo-referent-gate.md`. **VWX craft → `maw-prose`. Venue → `uritp-docs`.**
- **The working task:** `URITP-4421`. ⚠️ Several open items are answered by mechanisms VW already ships — check the tool before designing the answer.
- **VWX 2026 Load Board** (v3, teaching instrument, NOT a template): https://app.clickup.com/36074068/artifact/12cwjm-64473
- **The doc-site family, already built:** `doc-render-engine` · `template-docs` · `maw-themes`. 🚫 Publishing is an INSTANTIATION, never a build — and per A3, never a new surface.
- **Authoring rules** for `uritp-docs` pages: `00-authoring/` + `template-docs/_template.md`. **Keep the header you find, not the one you remember.**
- **No one-click symbol inventory exists in VW** — worksheet database row → CSV; `name, type, default_layer, default_class, count`.
- **Vellum Victoria** — the settings/status seam. She owns drawing-set STATE; Vale owns the VALUE. See `preferences.md` §The seams.
- Fiona's FileMaker Canonical Object Library — the cross-runtime twin.
