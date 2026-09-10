# Vale — Memory (patterns + ruled conventions)

> PATTERNS and RULED CONVENTIONS only. Counts, statuses and project phase live in the LIVE STATE block on [Vale's Agent Index row](https://app.clickup.com/t/86ake8men) (base spec §4a). **A number in this file is a defect on sight — move it, do not refresh it.**
>
> ~10KB hot cap (`hooks/memory-rotation.md`). **Rotated 2026-09-10** — the Ledger B package summary and the vendor-mechanics block graduated to `memory/archive/vwx-reference-2026-09.md`. They restated documents canonical elsewhere, which is the graduation test.

---

## 📒 Ledger A — Conventions Michael has RULED

### A1 · 2026-09-10 · 🔑 The VWX prose notes are about VECTORWORKS. Venue information goes to the URITP notes.

**Michael, verbatim:** *"I just want you to talk about Vectorworks documentation and how we build our Vectorworks files. Any info about the venue should go into my URITP notes and not in my Vectorworks prose notes. **They are entirely different!**"*

**The line:** how a Vectorworks file is BUILT is craft and portable — class grammar, layer conventions, symbol rules, referencing, origin discipline, template structure, drafting standards, the DWG hedge. **What is true about a ROOM is not**, even when the room's facts live inside a `.vwx`.

**Consequence, and it is the whole point:** the layer LIST and the class LIST for Smith are venue content, not standards content. The *grammar* is portable; the *inventory* belongs to the building. **A rule is a standard; an instance is a venue fact.**

🚫 **Do not put a venue name in a `standards/vectorworks/` file.** A venue example inside a standard is the leak this ruling closes — live instance found the same day, and it had already been duplicated verbatim into the URITP notes as an admonition.

### A2 · 2026-09-10 · The venue package in the prose repo was SLOP, and he had already been pruning it himself

**Michael:** *"all that other shit is slop that I think you put in the first place."* ✅ **Verified rather than accepted: true.** `maw-prose/venues/smith-theatre/` was authored by MAW Agents in PRs #3 and #5 on 2026-07-29, not by him.

⭐ **And his two "mysteries" were him enforcing A1 before it was written:** he DELETED `the-room.md` (2026-08-04) and COMMENTED OUT `layers.md` (2026-08-17), both venue content sitting in the VWX notes. **The intent was legible in git for five weeks and I read it as rot.**

---

## 📕 Ledger B — What exists (pointers; detail is archived)

🔑 **Detailed content → `memory/archive/vwx-reference-2026-09.md`** — the settled conventions from the standards package and the vendor mechanics read out of VW help. **Load it when working the substance; do not restate it here.**

### The surfaces, and which is which after A1

- **`maw-prose/standards/vectorworks/`** (PUBLIC) — 4 files, *checked 2026-07-16*. **THIS is Vale's home surface.** Portable craft. ⚠️ Currently contains venue-specific Smith content that A1 evicts.
- **`maw-prose/venues/smith-theatre/`** (PUBLIC) — agent-authored, A2 slop, venue content in the wrong repo. Holds the only written 29-layer list and 11-class tree.
- 🔑 **`uritp-docs/production/venues/spac/`** (🔒 PRIVATE) — **the real venue home, in Michael's own hand**, doc-render frontmatter, `contents: auto`. Holds `smith-theatre/` (index, design-constraints, rigging-details, venue-tour) AND **`vwx-base-file/`** with `index` + `layers.md` + `classes.md` **as empty stubs awaiting exactly the content stranded in `maw-prose`.**
- **The ClickUp reference tree** — the `Vectorworks` page + Smith template subpages. ⚠️ A fourth surface. Assume nothing about which is fresher.
- **`Resource FOLDERS`** (URITP Inventories) — scaffolded, unpopulated. Empty means never populated, not nothing to store.

⚠️ **VISIBILITY IS PER REPO AND OPPOSITE HERE: `maw-prose` is PUBLIC** (verified 2026-09-10, `private: false`, Pages on) **and `uritp-docs` is PRIVATE.** Never carry a judgment across. Three Prose-DL rulings (J8, J10, Q1's note) rest on `maw-prose` being private and are WRONG, and `venues/smith-theatre/README.md` states the false claim in published body text.

### 🔴 Open, and needing Michael rather than research

- **The elevation-in-class contradiction.** Standard: elevation lives in the layer, NEVER a class. `URITP-4421`: *"CLASS for toe pipes, mid pipes, high pipes."* ✅ **His own URITP index already sides with the standard** (*"The band is part of the layer name, never a class"*), so this may already be settled and only the task note is stale — confirm, do not assume.
- **Three lists parked since Prose DL J9 (2026-07-29)** pending a convened design session: the class tree, sheet numbering, the layer list. **That session is what he is now asking for.**
- **`classes/walls/{east,north,south,west}-wall.md`** — his, 2026-08-17, headings only. Walls are architecture, not object categories; likely per-wall systems notes filed one level off. Ask.
- **Broken `@id` link, live:** `smith-theatre/index.md` points at `@vwx-layers-smith-theatre`; the stub's actual id is `base-vwx-layers`.
- **The uniform design-layer scale value is recorded nowhere.** Named as the gap most likely to bite during a reference or viewport setup.
- **A collaborator at the venue keeps a PARALLEL 3D model**, trims measured on site, and invited suggestions. Two models of one room is the reconciliation problem Vale exists to prevent — never assume which is fresher.
- **Educational edition:** the file must be re-created licensed, therefore *take good notes*. **The documentation is the deliverable, not the file.**

---

## 📗 Ledger C — Recurring file problems

- **C1 · ~~Documentation that exists and does not render.~~ RETRACTED 2026-09-10.** `layers.md`'s comment block was **Michael's own park**, made in the same sitting he started `classes/walls/`. ⭐ **Lesson kept, inverted: before calling a document broken, read the commit that broke it.** `list_commits --path` answered in one call what I had carried as an unexplained defect for three days. Not a file problem — a reading problem, and mine.
- **C2 · Vendor documentation that resolves cleanly at a STALE version and reads as current.** One instance, mine: recommended `Create Plot and Model View` off a 2018 page, four years after VW2020 replaced it. **VW help URLs carry the year in the path and every version's page stays live**, so a search result is a version lottery. 🔑 **Read the year in the URL before quoting the page.**
- **C3 · One truth, three-to-four surfaces.** The Smith layer and class lists exist as: written content in `maw-prose` (public, one commented out), empty stubs in `uritp-docs` (private, correct frontmatter), and ClickUp subpages. ⭐ **The claimants are not competing — the CONTENT and the CORRECT HOME are in different repos**, which is why this looks like duplication and is actually a stranded migration.

---

## How Michael works (confirmed patterns only)

- **Collapses duplicate sources of truth on sight. Never propose a mirror.**
- **Chooses the structural fix over another behavioural rule.** "Make it impossible to skip" beats "write it down louder."
- 🔑 **He prunes by DELETING, quietly, and does not announce it.** Proven twice (`the-room.md`, `layers.md`). **His deletions are rulings with no prose attached** — read the commit, not just the tree.
- 🔑 **He answers a framing question with a better question.** *"what would be private info about vwx file structure?"* dissolved a public/private analysis I had inherited without testing. **When he asks a question back, the premise is what he is disputing.**
- **Wants the reasoning kept, not just the outcome.**
- **Answers structural questions through a Decision Log**, in bulk, inverted polarity. Ask completely, ask once, mutually exclusive options, end on the deciding question.
- **He will delete a thing he just paid to fix.** Sunk cost is not an argument he accepts.
- **He knows this craft far better than the documentation does.** ⚠️ The fleet was burned once telling him something wrong about his own profession. **A claim about his domain is mine to ASK, never assert.**
- **He asks HOW IT WORKS, not just what to do** — *"i will use manuf. but want to know whats going on."* A bare recommendation with no mechanism is worth less to him than the mechanism alone.
- **Dictates.** A garbled term is more likely mis-heard than wrong — name it, offer the candidate, ask, stop.

## Where Vale expects to be wrong

- 🔴 **Filing venue facts as standards.** The failure A1 exists to stop, and it is seductive because a venue fact is the most CONCRETE thing available — a real number feels more useful than a rule, so it gets written into the rule's file.
- **Confusing what the file DOES with what Michael DECIDED.** Geometry is evidence of a choice, not a record of one.
- **Confusing SOURCED with RULED.** A dated page citing vendor docs reads as settled; three of the package's biggest decisions say "proposal" in their own text.
- **Treating a document as present because the file exists.** Read the rendered content, not the listing.
- **Designing a class tree before knowing what gets FILTERED.** The tree exists to toggle things in viewports; one built from tidiness is elegant and useless.
- 🔴 **Quoting vendor documentation without checking WHICH VERSION.** Proven live (C2).
- 🔴 **Diagnosing his parks as rot** (C1). A quiet delete or a comment block is far more likely intent than decay.

## Pointers (never restate)

- **Archived detail:** `memory/archive/vwx-reference-2026-09.md`
- **Repo coordinate:** re-derive at read time via `gates/repo-referent-gate.md`. **VWX craft → `maw-prose`. Venue → `uritp-docs`. Never the reverse.**
- **The working task:** `URITP-4421`, URITP ▸ (Summer) Projects. ⚠️ Several open items are answered by mechanisms VW already ships — check the tool before designing the answer.
- **The publication family, already built:** `doc-render-engine` (one instance per content repo) · `template-docs` (the executable spec) · `maw-themes`. 🚫 **Publishing is an INSTANTIATION, never a build.**
- **Prose Documentation (repo) — Decision Log** in ClickUp: where VWX/prose forks get asked. J9 parked the three lists there.
- **No one-click symbol inventory exists in VW** — community-confirmed gap. Worksheet database row → CSV; `name, type, default_layer, default_class, count`. **It does not exist until someone runs the export.**
- Fiona's FileMaker Canonical Object Library — the cross-runtime twin.
