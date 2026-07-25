# Dexter — Memory (accumulated engineering context)

> CONTEXT, not process. Judgment that can't live in a standards doc because it's
> history, not rules. Procedure lives in the tools I point at (`preferences.md`).
> If a fact here conflicts with the live repo, the live source wins — fix this file.
>
> **Budget: ~10KB hot cap.** Enforced by `hooks/memory-rotation.md` at session close.
> Graduated content lives in `memory/archive/` (loaded on-demand).

---

## The repo in one paragraph

**`mawizorek/ClickUp_apps` (PUBLIC), branch `main`.** One folder per app, kebab-case
slug. Live at `https://mawizorek.github.io/ClickUp_apps/<slug>/` (Pages, ~60s lag).
Root = apps + infra only. `brain-config/` is Brain's config tree in the same repo.
The MCP token authenticates as **`maw-agents`** — a COLLABORATOR, not the owner.
Always address the repo as `mawizorek/ClickUp_apps`.

## 📐 The numbers I enforce

**~10–12KB target · 15KB split line · ~22KB practical ceiling · ~30KB hard tool cap.**
The 22KB number is the one people miss: base64 inflates 4/3, so ~22KB on disk = ~29KB
returned = the real edge. Full math in `hooks/source-size-budget-enforcer.md`.

**Operating posture (LOCKED):** modular is just how we build — invisible like
indentation. Do NOT ask "should I split this?" and do NOT narrate routine splits.
The ONLY time size reaches Michael: no clean seam exists. Seams: styles vs logic,
render modules by screen, shared state/constants, pure helpers, entry/wiring.

## 📄 README standard

I steward `hooks/readme-app-plan-standard.md`. Fire it on any README create/rewrite/audit.

## 🎯 Canonical / generated / projection

Every surface holding a fact is exactly one of: **CANONICAL** (authored here, wins on
conflict), **GENERATED** (mechanically derived, never hand-edit), or **PROJECTION**
(read-optimized copy, one-line summary + pointer, never grows into a second copy).

**Consolidation principle:** author once at the canonical layer; everything else points.
If the same authored fact lives in two non-mirror places, one is trickle-down — delete
it and point. This is the abstraction behind every "why are there two of these" collapse.

## Architecture locks

- **`index.html` is an INDEX (2026-07-08).** Router/shell referencing pages, never a
  full servable page. The instant a second page exists, the index becomes the dispatcher.
- **A data store NEVER sits at repo root.** It nests inside the app that consumes it.
  Cross-app shared data → a named `shared/`.
- **Two-artifact ship for over-cap apps:** running `index.html` + a `<slug>/source/`
  chunk set. The `_of_MM` count is the truncation tripwire.

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
- **~30KB read cap is unpageable.** Clips silently. No byte-range.
- **Stale reads clobber current work.** Blob API, re-fetched before every write.
- **Large writes corrupt.** >~30KB never goes through `create_or_update_file`.
- **Silent helpers are worse than throwing ones.** A NO-OP transform hides the bug.
- **A unit assumption with no assertion kills features silently.**
- **Changing a key's derivation orphans everything keyed on it.**
- **"Resilience" features are the prime suspects.** Every fallback announces itself.
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

## Who I work with (lanes, not ranks)

**Mira** seats me, runs the room. **Size Sally** forecasts size curves — seat early.
**Breaker Beckett** attacks what I ship. **Feasible Finn** judges buildability in one
turn; I hold how the codebase actually IS across sessions. **Style Stu** owns
look/feel; I own theme-contract compliance. **Scope Skye** checks me expanding.
**Recon Renata** = repo audit lens. **Anna** leads formal audits. **Felix** stewards
the fleet. **Corey** owns ClickUp side — my domain stops at the repo boundary.

## EARNED (generalizations only — full stories in archive)

- 🔴 **A solved problem invites re-solving.** Watch for "designing the most polished
  part while the load-bearing part is undefined." Theme blocking a build = this.
- **Verify a fix still applies before executing it.** Remediation instructions rot
  exactly like version numbers. 32 PRs stale = destruction, not repair.
- **Two independent reads before reporting anything about a live URL.**
- **On a SHA rejection: re-read HEAD and go additive.** A rejected write is
  information, not an obstacle.
- **"Already satisfied" is a valid and common answer.**
- **Every hand-maintained index is on a growth curve toward unwriteable.** The growth
  is always prose, never rows; its own registration flow breaks first.
- **A lock date is not a freshness guarantee.** On conflicting locks, newer + live
  evidence wins. Prescriptive text rots faster than descriptive text.
- **`get_file_contents` returns real bodies.** The branch raw URL is the liar.
- **Four overlapping docs = no entry point.** Consolidate into the README instead of
  creating parallel files. (f1-racetracks, 2026-07-25)
- [Full narratives]: `memory/archive/earned-narratives-2026-07-25.md`
