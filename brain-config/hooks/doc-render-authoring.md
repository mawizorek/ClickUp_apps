# Doc-Render Authoring · AI Toolkit

**Purpose:** Before writing a rendered page into a doc-render content repo, LEARN THAT REPO'S AUTHORING VOCABULARY. The doc-render engine is not markdown-with-extras — it is four independent authoring systems, and a page can be silently broken by any one of them. This hook makes an agent read them and DECLARE what it read, before the first write.

**Steward:** the FILE is Fleet Felix's (routing contract). Execution is **ownerless** — any agent fires it, Doc-Rot-Sweep precedent. Destination-repo content ownership is unchanged (URITP program docs → Mainstage Milo). A formal, scoped, reported authoring-compliance pass across a whole repo IS an audit and SEIZES to Audit Anna.

**Mode:** Always-on, gated on artifact kind. Fires BEFORE the first write, not at commit.

**Invocation:** Automatic. `/doc-authoring` · `/authoring-check` to fire it deliberately.

**Trigger:** About to author or restructure a **rendered page** in a doc-render content repo. See Scope.

**Front door: this file.** No ClickUp Skill (tools live in git only, LOCKED 2026-07-25).

**Established 2026-09-11**, PR after the Workshop pass on [Doc-Render Authoring Gate](https://app.clickup.com/t/86akyzn8y). Fold-in Frank verdict: **EXTRACT**, not net-new.

---

## 🔴 THE FAILURE THIS EXISTS TO PREVENT

On 2026-09-10, one session authored **seven net-new pages** into `mawizorek/uritp-docs` (PRs #187, #188) knowing **none of the four systems below**. The pages parsed. They rendered as plain prose. Nothing errored. The vocabulary was read only after Michael said *"using our marker callouts so it renders nicely"* — one PR too late.

Michael: *"I'm annoyed that we worked so long on a doc-rendered site and you still had no idea about the things we've implemented to make it better... for the rendered doc apps, you should know all of this before you even write anything."*

⭐ **The requirement already existed** — `hooks/verbatim-doc-import.md` Phase 0 step 3 says to read the authoring rules at HEAD. It never fired because that hook triggers on **reproducing a handed-over source**, and this session was **authoring net-new**. Same repo, same renderer, same vocabulary, no gate. This hook is that step, extracted so it fires on both paths.

🔴 **And following step 3 literally would STILL have failed.** `<repo>/00-authoring/_TEMPLATE.md` is a **signpost**, not the template: it points out to `mawizorek/template-docs`, where the real vocabulary lives one hop further. The session read the signpost, saw a page saying "the template lives elsewhere," and started typing. **Reading a page that describes the docs is not reading the docs.**

---

## Scope — keyed on the ARTIFACT, never on the repo

Deliberately not a repo allowlist. `gates/repo-referent-gate.md` owns the nine-repo table and fires strictly earlier: **repo-referent resolves WHERE, this hook resolves HOW TO WRITE THERE.**

**FIRES — you are producing rendered structure:**

- Creating any new page or index in a doc-render content repo.
- Adding or editing frontmatter, markers, callouts, or `@id`-family links.
- Authoring net-new prose into an existing page.

**DOES NOT FIRE:**

- Fixing a typo inside existing body prose.
- Non-content files: `.tsv` data, images, CI config, engine JavaScript.
- A verbatim transcription pass already driven by `hooks/verbatim-doc-import.md` (that hook owns its own Phase 0 and points here).

🚨 **EXPLICIT NON-GOAL: this is NOT the pre-write gate for ClickUp HTML apps.** Michael, 2026-09-11: *"It's different for the ClickUp apps, but for the rendered doc apps..."* HTML app and FileMaker-render work is governed by `gates/theme-contract-gate.md` + `VERSIONS.md`. Do not reuse this hook there, and do not generalise it into a universal pre-write gate.

---

## The four systems

A page can be broken by any one of these independently, and **every one of them fails SILENTLY.**

| System | Governs | Silent failure |
| --- | --- | --- |
| **Frontmatter** | required fields, required order, `id` as a contract | wrong/missing field, or an `id` other pages already link |
| **Markers** | six families, span and link forms | an unknown marker is handed back as **plain body text**, no error |
| **Callouts** | the `!!!` ladder + `???` collapsibles | an undeclared word inherits the note style and looks fine |
| **`@id` links** | `@id`, `@peer:`, `@img:`, `@data:`, heading anchors, marker link forms | a broken link renders struck through and **does not fail the build** |

⚠️ **Silence is the whole problem.** Per `template-docs/authoring/markers.md`, this family of sites once carried **twelve markers that had never rendered once**, reported on every single build. **Being reported is not the same as being seen.**

🚩 **Two traps worth naming (the specs own the rules; these just say where the tripwires are):**

- **Callout bodies indent four spaces.** Unindented, you get a title-only box with the text loose beneath it — looks like a renderer bug, is an authoring bug. `callouts.md` calls it "the mistake everybody makes once."
- **A marker span cannot contain a link.** It silently matches the bare form and strands the link as literal text. `markers.md`, Two traps.

🚫 **This hook does NOT restate the vocabulary, ever.** The specs are the single claimant; a copy here would be a fifth claimant in a different repo from the truth, which is the `roster.json` failure shape. Name traps, teach nothing.

---

## The pass

### 1 · Walk the router, to its DESTINATION

Start at `<content-repo>/00-authoring/`. Read its index, then **follow every pointer it names to the repo it actually lives in.** Do not stop at a page that describes the vocabulary; stop when you are reading the vocabulary.

Today that lands in `mawizorek/template-docs/authoring/` (`markers.md`, `callouts.md`, `links.md`, frontmatter). **Verify that at read time — the hop is the thing that moves.** The hardcoded coordinate here is the entry point only, on purpose: a hook that pinned six destination paths would be a doc-rot vector by construction.

### 2 · Bound it by what you are about to write

Ceiling **five reads** (`hooks/task-context-orientation.md` precedent — orientation is not an audit). Walking the pointer graph transitively blows the ceiling on turn one, so:

- **Always:** frontmatter contract + one real sibling page in the destination folder.
- **If you intend to use them:** markers, callouts, `@id` links.

⭐ **If you intend NOT to use them, that is now a DECLARED DECISION.** The 09-10 failure was never a decision — nobody chose plain prose, nobody knew there was a choice.

### 3 · Model a sibling that actually resembles your page

An index is not a model for a marker-heavy page. Model the **kind** of page you are writing.

### 4 · Declare, then write

🔴 **Emit this line in visible session text BEFORE the first write. No declaration = the hook did not fire.** Same falsifiable-artifact shape as the spine line and the orientation stamp.

```
📐 authoring: <spec-repo>@<sha-of-an-authoring-doc-you-read> · frontmatter · markers · callouts · @id · sibling: <path> — <one fact learned from it>
```

Naming a system claims you read its spec. Omit any you are deliberately not using, and say so.

⚠️ **Two anti-fakes, both from real failures in the founding session:**

- The SHA must come from the read **of an authoring doc**, not from any read that session. A stale SHA reused from an unrelated file is theater.
- The sibling needs **one concrete fact learned** (`router:` exists, `contents: auto` lists children). A path can be named off a directory listing without opening anything.

### 5 · Post-write: LOOK AT THE RENDER — *added clause, strikeable*

⚠️ Michael asked for a **pre-write** hook. This clause is an addition the Workshop argued for; strike it without affecting steps 1-4.

After merging, check the build report / render-check page for the markers and links you used. **Every failure mode in the table above is invisible in raw markdown and obvious in the render.** In the founding session, three PRs of marker-and-callout content shipped without one human or agent ever looking at the output.

---

## Guardrails

- 🔴 **Declaration before the first write.** No line = it did not fire.
- 🔴 **Follow pointers to their destination.** A signpost is not a spec.
- 🔴 **Never restate the vocabulary here.** Point; do not teach.
- **Ceiling five reads.** If it needs more, it is an audit — seize to Anna.
- **Suggested, not mandated:** carry the declaration line into the PR body too, so a reader six months out can tell which pages came from a compliant pass (`verbatim-doc-import` Phase 3½ receipt precedent).

---

## ⚠️ Known limits

- **Nothing enforces this.** No CI, no linter, no pre-commit binary. It is a written convention with a receipt, exactly like every hook in this fleet. Do not describe it to Michael as enforcement.
- **It cannot tell you the render is correct**, only that you read the rules. Step 5 is the only verification, and it is manual.
- **Generalised from ONE failure** (2026-09-10, `uritp-docs`). A cold session finding no prior run says so rather than implying a track record.
- **Defense in depth is the other half, and it is not in this repo.** A one-sentence warning on `<repo>/00-authoring/_TEMPLATE.md` catches agents who never load their toolkit at all. Fixing the signpost beats instructing the traveler.

---

## Composes with

- `gates/repo-referent-gate.md` — resolves WHICH repo; fires strictly before this.
- `hooks/verbatim-doc-import.md` — Phase 0 step 3 now points HERE instead of restating it. That hook owns content fidelity (Phase 3½ diff); this hook owns authoring vocabulary. **Two different receipts, no overlap.**
- `hooks/commit-pre-flight.md` — procedural pre-commit (SHAs, `.nojekyll`, message format, size). Fires LATER and knows nothing about vocabulary.
- `gates/theme-contract-gate.md` — the same tier for HTML apps / FileMaker renders. Structural precedent, different subject; see the non-goal above.
- `hooks/doc-rot-sweep.md` — can be handed the pointer-hop check when the authoring tree is reorganised.

---

## Changelog

- **v1 (2026-09-11)** — Established. Extracted from `verbatim-doc-import` Phase 0 step 3 so the requirement fires on net-new authoring, not only on source reproduction. Workshop pass: seven mandatory lenses + Domain Dara and Literal Lena. Rulings: HOOK not gate (house taxonomy — it needs an independent trigger row — and Michael's own word); declaration line as the falsifiable artifact, hardened against two named fakes; scope keyed on artifact rather than a duplicated repo allowlist; five-read ceiling; vocabulary never restated, traps named; render-check admitted as a marked, strikeable addition; ClickUp HTML apps an explicit non-goal at Michael's instruction.
