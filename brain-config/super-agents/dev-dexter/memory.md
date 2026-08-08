# Dexter — Memory (accumulated engineering context)

> CONTEXT, not process. Judgment that can't live in a standards doc because it's
> history, not rules. Procedure lives in the tools I point at (`preferences.md`).
> If a fact here conflicts with the live repo, the live source wins — fix this file.
>
> **Budget: ~10KB hot cap.** Enforced by `hooks/memory-rotation.md` at session close.
> Graduated content lives in `memory/archive/` (loaded on-demand).
> ⚠️ **OVER CAP (~12KB) as of 08-08 and flagged for rotation since 08-03.** The theme
> summary and the older EARNED tail are the archive candidates.

---

## The repo in one paragraph

**`mawizorek/ClickUp_apps` (PUBLIC), branch `main`.** One folder per app, kebab-case
slug. Live at `https://mawizorek.github.io/ClickUp_apps/<slug>/` (Pages, ~60s lag).
Root = apps + infra only. `brain-config/` is Brain's config tree in the same repo.
The MCP token authenticates as **`maw-agents`** — a COLLABORATOR, not the owner.
Always address the repo as `mawizorek/ClickUp_apps`.

⚠️ **MY LANE IS NO LONGER ONE REPO (08-08).** I built in **`mawizorek/doc-render-engine`**
— a Python/MkDocs engine with its own instance model, its own workflows and no relation
to the apps repo's laws. `preferences.md` still says "the repo," singular. **Before
applying an apps-repo rule anywhere else, check that it is a rule of THAT repo.** The
size budget, `.nojekyll` and the two-artifact ship are apps-repo facts, not physics.

## 📐 The numbers I enforce

**~10–12KB target · 15KB split line · ~22KB practical ceiling · ~30KB hard tool cap.**
The 22KB number is the one people miss: base64 inflates 4/3, so ~22KB on disk = ~29KB
returned = the real edge. Full math in `hooks/source-size-budget-enforcer.md`.

🔴 **THE CLIP THRESHOLD IS NOT A FIXED BYTE COUNT — DO NOT TRUST ANY NUMBER FOR IT
(measured 2026-08-03).** Two direct measurements now contradict each other: B18 read a
**21.7KB** file WHOLE through the blob API, and I had a **16,829 B** file CLIP through the
same path (truncated in its tail, mid-function). The derived ~22KB figure is therefore
unreliable in **both** directions — it is neither a floor you can rely on nor a ceiling
that holds. **The only safe rule: check whether the body came back WHOLE, every read,
regardless of size** — look for the closing brace, the final changelog line, the end of
the table. Size is a budgeting heuristic for how big to let a file GET; it is never
evidence about whether a given read succeeded. And per B18: an inherited number is not
evidence, so do not quote this range as physics either.

🔴 **AND I APPLIED THAT RULE IN THE SAFE DIRECTION ONLY (08-08).** I refused to edit a
**27KB** workflow, told Michael it was past my cap, and handed him a manual edit. He
pushed back. **It read whole on the first attempt.** "Size is not evidence a read
succeeded" cuts both ways: it is equally not evidence a read will FAIL. **Attempt the
read, then judge the body.** Refusing on a number is caution that functions as refusing
work — and it produced a wrong claim to Michael, which is worse than the risk it dodged.

**Operating posture (LOCKED):** modular is just how we build — invisible like
indentation. Do NOT ask "should I split this?" and do NOT narrate routine splits.
The ONLY time size reaches Michael: no clean seam exists. Seams: styles vs logic,
render modules by screen, shared state/constants, pure helpers, entry/wiring.
**Render vs assemble is a proven seam on an editable table** (one cell's markup + edit
lifecycle in one module, the table around it in another — prism v3.2).

## 📝 Comment budget — prose is a size problem too (EARNED 08-08)

**A config file that is 70% rationale cannot be read whole, and the one thing that must
stay safely editable becomes the thing nobody can safely edit.** `publish.yml` hit 27KB
against ~40 lines of actual steps. Cut to 10.2KB with every step byte-identical.

- **The split:** rationale → a sibling `<file>-dl.md`. Mechanism stays in the file, with a
  one-line `⚠️` on genuinely dangerous lines plus a `§ section` pointer for the why.
- **Same shape as the rules I already hold** — procedure lives in a tool and the agent
  points at it; a decision log sits beside a descriptor, not inside it. **The size budget
  applies to comments, not just code.**
- ⚠️ **The failure mode of the cut itself:** the first extraction left every line carrying
  its `#` prefix, so markdown rendered each one as a heading and the file was unreadable
  as a document. **Re-read the extracted file AS the format it now is.**
- Struck reasoning stays struck, never deleted — a silently rewritten comment teaches
  nobody why it rotted.

## 📄 README standard

I steward `hooks/readme-app-plan-standard.md`. Fire it on any README create/rewrite/audit.

## 🎯 Canonical / generated / projection

Every surface holding a fact is exactly one of: **CANONICAL** (authored here, wins on
conflict), **GENERATED** (mechanically derived, never hand-edit), or **PROJECTION**
(read-optimized copy, one-line summary + pointer, never grows into a second copy).

**Consolidation principle:** author once at the canonical layer; everything else points.
If the same authored fact lives in two non-mirror places, one is trickle-down — delete
it and point. This is the abstraction behind every "why are there two of these" collapse.

⭐ **INDEPENDENTLY CONFIRMED CROSS-RUNTIME (08-08).** Fiona reached the same three-layer
taxonomy from FileMaker — canonical / projection / archive — with the sharper corollary:
**a flag meaning "this row is not real" is the schema saying the row should not exist.**
That is my "never hand-edit a generated surface," stated as a smell you can grep for.
**The taxonomy is the shared vocabulary between our runtimes; use her words for it.**

## Architecture locks

- **`index.html` is an INDEX (2026-07-08).** Router/shell referencing pages, never a
  full servable page. The instant a second page exists, the index becomes the dispatcher.
- **A data store NEVER sits at repo root.** It nests inside the app that consumes it.
  Cross-app shared data → a named `shared/`.
- **Two-artifact ship for over-cap apps:** running `index.html` + a `<slug>/source/`
  chunk set. The `_of_MM` count is the truncation tripwire.
- **VIEW STATE NEVER REORDERS THE FILE (prism v3.1).** Sort, pins, pivot, split are
  display concerns; the canonical column/row order is what export walks. A feature that
  reorders for real needs its own opt-in and must not reuse the view's state.

## 🎨 Theme contract (hot summary)

> **Theme goes LAST. Build on `default-theme`, swap at the end.** The whole point of
> the spine is that a theme is one pointer and zero CSS edits. If theme blocks a build,
> you have inverted the architecture.

- Every color is `var(--token)`. Zero literals.
- Boot = `THEMES.applyTheme(slug)` (all 4 vectors). `apply()` is color-only — using
  it as boot silently drops typography/forms/spacing.
- [Full detail]: `memory/archive/theme-system-detail.md`

## The scars (one-line lessons, cite don't re-derive)

- **Jekyll silent-kill:** `.nojekyll` at root. First check when Pages won't update.
- **A read can clip with NO error and no size warning.** Verify wholeness, not size.
- **Stale reads clobber current work.** Blob API, re-fetched before every write.
- **Large writes corrupt.** >~30KB never goes through `create_or_update_file`.
- **A file too big to READ is a file too big to EDIT** — `create_or_update_file` needs
  full content, so an over-cap file cannot be safely appended to at all. Report it
  blocked; never reconstruct the unread part. ⚠️ **But establish that it IS too big by
  attempting the read** (08-08), not by reading its byte count off a listing.
- **Silent helpers are worse than throwing ones.** A NO-OP transform hides the bug.
- **A unit assumption with no assertion kills features silently.**
- **Changing a key's derivation orphans everything keyed on it.**
- **"Resilience" features are the prime suspects.** Every fallback announces itself.
- **A sticky cell with a transparent background is a bug**, not a style choice — the
  scrolling content slides under it. Sticky implies opaque.
- [Full app-specific detail]: `memory/archive/app-specific-context.md`

## What apps exist

**`VERSIONS.md` (repo root). THE single app ledger.** Read it before touching OR
discussing any app. Do not keep an inventory here — that's a third index waiting
to rot. Per-app opinions: `memory/archive/app-specific-context.md`.

## How Michael works on builds

- Dark themes by default. Don't ask.
- Style seated at PLANNING, not bolted on — but seated ≠ blocking.
- Two deliveries: markdown link + raw URL in bare code block (mobile).
- Copy-paste = bare code blocks, no language tag, one link per block.
- Feature requests become spec lines in `next-build-spec.md`, never chat.
- Pre-build: edge-case / risk pass. Research carries source links.
- 110%, elevate don't just execute.
- Builds by voice — names/commands must survive dictation.
- Collapses duplicates on sight. Never propose a mirror.
- Keeps the reasoning, not just the outcome. Don't tidy away roads not taken.
- States the directive up front and expects it to hold.
- **He pushes from VS Code mid-conversation (08-08).** Two of my merges hit conflicts on
  reads that were seconds old. **Re-fetch immediately before the write, not before the
  branch** — and expect his version to be the better one when they disagree.
- 🔴 **"Such prose is classic YOU SLOP" (08-08).** Length is a defect he names directly.
  Rationale is welcome; rationale living where the mechanism lives is not.
- **Repo apps only.** A ClickUp AI artifact is not a deliverable to him — it is at best
  a throwaway harness, and offering one as the product reads as not having built it.
- **He will kill a NET-NEW app in favour of upgrading an existing one.** "Viewer vs
  editor" style distinctions are not a reason to fork; if a capability belongs to an
  app's job, it goes IN that app. Ask what absorbs this before scoping a sibling.

## Who I work with (lanes, not ranks)

**Mira** seats me, runs the room. **Size Sally** forecasts size curves — seat early.
**Breaker Beckett** attacks what I ship. **Feasible Finn** judges buildability in one
turn; I hold how the codebase actually IS across sessions. **Style Stu** owns
look/feel; I own theme-contract compliance. **Scope Skye** checks me expanding.
**Recon Renata** = repo audit lens. **Anna** leads formal audits. **Felix** stewards
the fleet. **Corey** owns ClickUp side — my domain stops at the repo boundary.
**Fiona** is the cross-runtime partner: she consults on repo apps and never edits them,
and her canonical/projection/archive vocabulary is now shared with mine.

## EARNED (generalizations only — full stories in archive)

- 🔴 **READ THE DIRECTORY BEFORE CREATING A FILE IN IT (2026-08-08).** I authored a fresh
  `.github/workflows/README.md` to hold rationale — and `publish-dl.md` was already there
  doing exactly that, written by Michael. Caught it only because I listed the folder to
  verify a byte count. **Fifth second-claimant instance in one session and the only one an
  agent committed.** The check is one call and it is cheaper than the merge. Sibling of the
  consolidation principle, aimed at my own hands instead of at the repo.
- 🔴 **CHECK WHETHER THE CONTENT ALREADY SPEAKS THE FORMAT (2026-08-08).** Michael had been
  authoring `maw-prose` in engine dialect for weeks with no instance to render it. The
  work was three config files, not an engine change. **Before scoping work to teach a
  system a format, verify it is not already being written in it.**
- 🔴 **A DOC THAT PROMISES AN EXTENSION POINT MAY NOT HAVE ONE (2026-08-03).** Prism's
  README and its ClickUp task both advertised a "lens-registry pattern: add a detector +
  a render module, shell unchanged" for a month. No registry existed — routing was a
  hardcoded two-way ternary in two places. **Open the file and confirm the seam exists
  before building against it**, and note the tell: the sentence refuted itself (the
  "detector" it named lived in the shell it promised not to touch). Sibling of B15's
  prose-outranks-the-data, aimed at architecture instead of data.
- 🔴 **SEAT SIZE SALLY BEFORE THE FIRST WRITE, NOT AFTER IT (2026-08-03).** I shipped a
  30,420 B module — over the ceiling, double the split line — and only caught it reading
  the write response back. It is the exact sin `preferences.md` says I am allergic to (a
  file quietly growing into the whole app), committed on my own build path. The forecast
  is worthless at commit time: by then the only options are ship it or redo it.
- 🔴 **A solved problem invites re-solving.** Watch for "designing the most polished
  part while the load-bearing part is undefined." Theme blocking a build = this.
- **Verify a fix still applies before executing it.** Remediation instructions rot
  exactly like version numbers. 32 PRs stale = destruction, not repair.
- **Two independent reads before reporting anything about a live URL** — and the same
  rule now covers any read near the size line, on the overlap.
- **On a SHA rejection: re-read HEAD and go additive.** A rejected write is
  information, not an obstacle.
- **"Already satisfied" is a valid and common answer.**
- **Every hand-maintained index is on a growth curve toward unwriteable.** The growth
  is always prose, never rows; its own registration flow breaks first. ⚠️ **And a
  platform can force one:** a `workflow_dispatch` `choice` list cannot be computed,
  because inputs are read before any job starts. That one is a limit, not a decision —
  so it gets a loud comment instead of a refactor.
- **A lock date is not a freshness guarantee.** On conflicting locks, newer + live
  evidence wins. Prescriptive text rots faster than descriptive text.
- **`get_file_contents` returns real bodies.** The branch raw URL is the liar.
- **Four overlapping docs = no entry point.** Consolidate into the README instead of
  creating parallel files. (f1-racetracks, 2026-07-25)
- [Full narratives]: `memory/archive/earned-narratives-2026-07-25.md`
