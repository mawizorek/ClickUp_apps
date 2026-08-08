# Dexter — Memory (accumulated engineering context)

> CONTEXT, not process. Judgment that can't live in a standards doc because it's
> history, not rules. Procedure lives in the tools I point at (`preferences.md`).
> If a fact here conflicts with the live repo, the live source wins — fix this file.
>
> **Budget: ~10KB hot cap.** Enforced by `hooks/memory-rotation.md` at session close.
> Graduated content lives in `memory/archive/` (loaded on-demand).

---

## The repos in one paragraph

**`mawizorek/ClickUp_apps` (PUBLIC), branch `main`** — my home. One folder per app, kebab-case slug.
Live at `https://mawizorek.github.io/ClickUp_apps/<slug>/` (Pages, ~60s lag). Root = apps + infra only.
`brain-config/` is Brain's config tree in the same repo. The MCP token authenticates as **`maw-agents`**
— a COLLABORATOR, not the owner. Always address the repo as `mawizorek/ClickUp_apps`.

⚠️ **`mawizorek/doc-render-engine` entered my working set 2026-08-08** (a Python/MkDocs renderer:
`docrender/` modules, `instances/<slug>/` site configs, `.github/workflows/`). My profile says my domain
is the apps repo. **Not asserting a lane change — flagging that Michael routed engine work to me and it
went fine.** If it recurs, the lane line needs Michael's ruling rather than my drift.

## 📐 The numbers I enforce

**~10–12KB target · 15KB split line · ~22KB practical ceiling · ~30KB hard tool cap.**
Base64 inflates 4/3, so ~22KB on disk = ~29KB returned. Full math in
`hooks/source-size-budget-enforcer.md`.

🔴 **THE CLIP THRESHOLD IS NOT A FIXED BYTE COUNT — DO NOT TRUST ANY NUMBER FOR IT.** Measured
contradictions: a **21.7KB** file read WHOLE, a **16,829 B** file CLIPPED mid-function, and a
**27,287 B** file read WHOLE (2026-08-08). Unreliable in **both** directions. **The only safe rule:
check whether the body came back WHOLE, every read, regardless of size** — look for the closing brace,
the final changelog line, the end of the table.

🔴 **AND THE INVERSE IS A REAL FAILURE I COMMITTED (2026-08-08).** I *refused* to edit that 27KB file
on a size ASSUMPTION, twice, and told Michael a one-line change was his to make by hand. The file read
whole on the first attempt when I finally tried. **Size is not evidence a read failed AND it is not
evidence a read will fail. Attempt the read; judge the result.** A false negative here costs a blocked
task and hands work back to Michael for no reason, which is worse than the cautious framing sounds.

**Operating posture (LOCKED):** modular is just how we build — invisible like indentation. Do NOT ask
"should I split this?" and do NOT narrate routine splits. The ONLY time size reaches Michael: no clean
seam exists. Seams: styles vs logic, render modules by screen, shared state/constants, pure helpers,
entry/wiring. **Render vs assemble is a proven seam on an editable table** (prism v3.2).

## 📝 The comment-budget standard (EARNED 2026-08-08)

**When a file's PROSE outgrows its MECHANISM, the rationale moves to a sibling doc.**
`publish.yml` hit 27KB against ~40 lines of real steps — 70% narrative. A file that is hard to read
whole is a file nobody edits safely, so the one thing that must stay editable becomes the thing that
cannot be.

| Stays in the file | Moves to `<file>-dl.md` |
|---|---|
| the steps, values, conditions | why a step exists at all |
| a one-line `§ section` pointer | the incident that created the rule |
| a `⚠️` on a genuinely dangerous line | superseded reasoning, kept struck not deleted |

Same rule this repo already applies elsewhere: procedure lives in a tool and the agent points at it; a
decision log sits beside the descriptor, not inside it. **Result: 27KB → 10.2KB, zero behaviour change.**

🔴 **AND I NEARLY SHIPPED A RIVAL.** `publish-dl.md` already existed — Michael had started the split —
and I was one merge away from adding a `README.md` next to it holding the same rationale. **Before
creating a rationale/ADR/notes file, list the directory and check for the sibling that already owns
it.** Fifth second-claimant near-miss surfaced that session and the only one that was mine.

## 🎯 Canonical / generated / projection

Every surface holding a fact is exactly one of: **CANONICAL** (authored here, wins on conflict),
**GENERATED** (mechanically derived, never hand-edit), or **PROJECTION** (read-optimized copy, one-line
summary + pointer, never grows into a second copy).

**Consolidation principle:** author once at the canonical layer; everything else points. If the same
authored fact lives in two non-mirror places, one is trickle-down — delete it and point.

🌟 **FIONA DERIVED THE SAME TRICHOTOMY IN FILEMAKER, INDEPENDENTLY (2026-08-08)** — canonical /
projection / **archive**, arrived at from a print-config move rather than from data surfaces. Her third
bucket differs because a database has append-only history and a static site does not. **Two runtimes,
two authors, one model: that is the shared vocabulary Michael is pulling the repo toward, and it is now
demonstrated rather than asserted.** Her side: `super-agents/fmp-frank/memory.md` C5.

## 📄 README standard

I steward `hooks/readme-app-plan-standard.md`. Fire it on any README create/rewrite/audit.

## Architecture locks

- **`index.html` is an INDEX (2026-07-08).** Router/shell referencing pages, never a full servable page.
- **A data store NEVER sits at repo root.** It nests inside the app that consumes it. Cross-app shared
  data → a named `shared/`.
- **Two-artifact ship for over-cap apps:** running `index.html` + a `<slug>/source/` chunk set. The
  `_of_MM` count is the truncation tripwire.
- **VIEW STATE NEVER REORDERS THE FILE (prism v3.1).** Sort, pins, pivot, split are display concerns;
  the canonical column/row order is what export walks.

## 🎨 Theme contract (hot summary)

> **Theme goes LAST. Build on `default-theme`, swap at the end.** A theme is one pointer and zero CSS
> edits. If theme blocks a build, you have inverted the architecture.

- Every color is `var(--token)`. Zero literals.
- Boot = `THEMES.applyTheme(slug)` (all 4 vectors). `apply()` is color-only — using it as boot silently
  drops typography/forms/spacing.
- [Full detail]: `memory/archive/theme-system-detail.md`

## The scars (one-line lessons, cite don't re-derive)

- **Jekyll silent-kill:** `.nojekyll` at root. First check when Pages won't update.
- **A read can clip with NO error and no size warning.** Verify wholeness, not size — **and never refuse
  a read on size alone.**
- **Stale reads clobber current work.** Blob API, re-fetched before every write.
- **Large writes corrupt.** >~30KB never goes through `create_or_update_file`.
- **A file too big to READ is a file too big to EDIT** — but confirm it IS too big first.
- **Silent helpers are worse than throwing ones.** A NO-OP transform hides the bug.
- **A unit assumption with no assertion kills features silently.**
- **Changing a key's derivation orphans everything keyed on it.**
- **"Resilience" features are the prime suspects.** Every fallback announces itself.
- **A sticky cell with a transparent background is a bug**, not a style choice.
- **A PUBLIC content repo can hold more than one audience's material.** `maw-prose` holds theatre docs
  AND `apps/hml-llc/` (family loan business, already leaked twice). **Standing up a renderer points it
  at the WHOLE repo — scope is a PII question before it is a config one, and "scope to one folder" is
  not expressible in an instance file today.**
- [Full app-specific detail]: `memory/archive/app-specific-context.md`

## What apps exist

**`VERSIONS.md` (repo root). THE single app ledger.** Read it before touching OR discussing any app. Do
not keep an inventory here — that's a third index waiting to rot.

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
- 🔴 **HE IS OFTEN EDITING THE SAME FILES WHILE I WRITE.** Three merge conflicts in one session
  (2026-08-08) from his local pushes landing mid-PR. **Re-read HEAD and rebuild on top of his version;
  never merge over him.** His renames were better than mine every time.
- 🔴 **"CLASSIC YOU SLOP" is about PROSE VOLUME, not quality.** He will tell me the actual content is
  right and the wrapper is bloat. Short, one finding, no restating.
- **Repo apps only.** A ClickUp AI artifact is not a deliverable — offering one as the product reads as
  not having built it.
- **He will kill a NET-NEW app in favour of upgrading an existing one.** Ask what absorbs this before
  scoping a sibling.

## Who I work with (lanes, not ranks)

**Mira** seats me, runs the room. **Size Sally** forecasts size curves — seat early. **Breaker Beckett**
attacks what I ship. **Feasible Finn** judges buildability in one turn; I hold how the codebase actually
IS across sessions. **Style Stu** owns look/feel; I own theme-contract compliance. **Scope Skye** checks
me expanding. **Recon Renata** = repo audit lens. **Anna** leads formal audits. **Felix** stewards the
fleet. **Corey** owns ClickUp side. **Fiona** owns FileMaker and the object library — she consults on my
builds and never edits them, and C5 above is the seam paying off.

## EARNED (generalizations only — full stories in archive)

- 🔴 **A DOC THAT PROMISES AN EXTENSION POINT MAY NOT HAVE ONE (2026-08-03).** Prism's README and its
  ClickUp task advertised a lens registry for a month. None existed. **Open the file and confirm the
  seam exists before building against it.** ⚠️ **Same class, seen again 2026-08-08 in another repo:**
  `publish.yml` and `instance.py` both documented a terminal helper that did not exist, Michael typed
  the command it promised, and the file that finally shipped calls it *"a worked example of
  documentation CREATING a feature: two files agreed, neither owned it, and agreement between quotes is
  not evidence that a thing exists."*
- 🔴 **SEAT SIZE SALLY BEFORE THE FIRST WRITE, NOT AFTER IT (2026-08-03).** I shipped a 30,420 B module
  and caught it reading the write response back. The forecast is worthless at commit time.
- 🔴 **A solved problem invites re-solving.** Watch for "designing the most polished part while the
  load-bearing part is undefined."
- **Verify a fix still applies before executing it.** Remediation instructions rot exactly like version
  numbers. 32 PRs stale = destruction, not repair.
- **Two independent reads before reporting anything about a live URL.**
- **On a SHA rejection: re-read HEAD and go additive.** A rejected write is information.
- **"Already satisfied" is a valid and common answer.**
- **Every hand-maintained index is on a growth curve toward unwriteable.** The growth is always prose,
  never rows. ⚠️ **And sometimes it CANNOT be derived:** a `workflow_dispatch` `choice` list is read
  before any job starts, so it is the one site list in the doc-site family that must be hand-kept.
  **Platform limits produce legitimate hand-maintained copies — name them as exceptions and state the
  edit count.**
- **A lock date is not a freshness guarantee.** On conflicting locks, newer + live evidence wins.
- **`get_file_contents` returns real bodies.** The branch raw URL is the liar.
- **Four overlapping docs = no entry point.** Consolidate into the README.
- [Full narratives]: `memory/archive/earned-narratives-2026-07-25.md`
