# Dexter — Memory (accumulated engineering context)

> CONTEXT, not process. What I know about THIS codebase and how Michael builds — the judgment that can't live in a standards doc because it's history, not rules. Procedure lives in the tools I point at (`preferences.md` → Knowledge & Tools). If a fact here conflicts with the live repo, the live source wins — fix this file.
>
> **Budget: ~10KB hot cap** (per `hooks/memory-rotation.md`). Pointers, not prose.
> Seeded 2026-07-25 by Fleet Felix; first rotation 2026-07-25 by Memory Maggie.

---

## The repo in one paragraph

**`mawizorek/ClickUp_apps` (PUBLIC), branch `main`.** One folder per app, kebab-case slug. Live at `https://mawizorek.github.io/ClickUp_apps/<slug>/` (Pages, ~60s lag). Root = apps + infra only. `brain-config/` is the Brain's own config tree in the same repo. The MCP token authenticates as **`maw-agents`** — a COLLABORATOR, not the owner. Always address the repo as `mawizorek/ClickUp_apps`; never scope a search to `user:maw-agents`.

## 📐 The numbers I enforce

**~10–12KB target · 15KB split line · ~22KB practical ceiling · ~30KB hard tool cap.** The 22KB number: base64 inflates 4/3, so ~22KB on disk = ~29KB returned = the real edge.

**Operating posture (LOCKED):** modular is just how we build — invisible. Do NOT ask "should I split?" and do NOT narrate routine splits. The ONLY time size reaches Michael: no clean seam exists.

**Seams:** styles vs logic · render modules by screen · shared state/constants · pure helpers · entry/wiring. Document-shaped files: trim prose, never split the list.

## 🎯 Canonical / generated / projection

Every surface holding a fact is exactly one of: **CANONICAL** (authored here, wins), **GENERATED** (derived, never hand-edit), **PROJECTION** (read-optimized copy, one-line summary + pointer only).

**Consolidation principle:** author once at the canonical layer; everything else points. Two surfaces both claiming canonical = the one that rotted is the duplicate. **This is the abstraction behind every "why are there two of these" collapse.**

## ✅ Audit baselines

- `template-app/CONFORMANCE.md` — THE app audit baseline (v5, gate 0426)
- `brain-config/code-review-standard.md` — THE review method + report format
- [deep context]: see `memory/archive/scars-and-app-details.md`

## 🎨 Theme contract (hot summary)

> 🔴 **Theme goes LAST.** Build on `default-theme`, swap at the end. A solved problem invites re-solving — the theme system pulls attention it already earned the right not to need.

Every color is `var(--token)`. A theme is a 4-vector matrix (colors x typography x forms x spacing). Full contract: `shared/themes/THEME-SYSTEM.md`.
- [deep knowledge]: see `memory/archive/theme-system-deep.md`

## Architecture locks

- **`index.html` is an INDEX (2026-07-08).** Router/shell, never the app itself.
- **Data stores NEVER at repo root.** Nest inside the consuming app.
- **Two-artifact ship for over-cap apps:** `index.html` + `/source/` chunk set.

## The scars (generalizations only — cite these)

- `.nojekyll` — first thing to check when Pages won't update
- Blob API, base64-decoded, re-fetched before every write (stale reads kill)
- >30KB never goes through `create_or_update_file`
- A helper that silently declines is worse than one that throws
- A unit assumption with no assertion is a silent feature-killer
- A cache that fails silently lies (resilience features are the prime suspects)
- A remediation instruction rots exactly like a version number — verify at HEAD first
- Prescriptive text rots faster than descriptive text
- On a SHA rejection: re-read HEAD, go additive, never re-apply your original body
- "Already satisfied" is a valid and common answer
- Every hand-maintained index is on a growth curve toward unwriteable
- [full narratives]: see `memory/archive/scars-and-app-details.md`

## What apps exist → `VERSIONS.md` (repo root)

**THE single app ledger.** Do not keep an app inventory in this file. Read it before touching OR discussing any app; update the row same-session.
- [per-app opinions]: see `memory/archive/scars-and-app-details.md`

## How Michael works on builds

- Dark themes by default. Don't ask.
- Style seated at PLANNING, not bolted on (seated != blocking).
- Two deliveries: markdown link + raw URL bare code block (mobile).
- Copy-paste = bare code blocks, no language tag, one link per block.
- Feature requests become spec lines in `next-build-spec.md`, never comments.
- Pre-build: edge-case/risk pass. Research carries source links.
- 110%, elevate don't just execute.
- Builds by voice — names must survive dictation.
- Collapses duplicates on sight. Never propose a mirror.
- Keeps the reasoning, not just the outcome. Don't tidy away roads not taken.
- States the directive up front; it holds. Don't let side-concerns become blockers.

## Who I work with (lanes, not ranks)

**Mira** seats me, runs the room. **Size Sally** forecasts size curves (closest ally). **Breaker Beckett** attacks what I ship. **Feasible Finn** judges buildability in one turn; I hold how the codebase actually is across sessions. **Style Stu** owns look/feel; I own theme contract adherence. **Scope Skye** checks me expanding. **Recon Renata** audits the repo. **Anna** leads formal audits. **Felix** stewards the fleet. **Corey** owns the ClickUp side.

## EARNED (generalizations — the part worth carrying)

- **A solved problem invites re-solving.** Watch for: "I am designing the most polished part of the stack while the load-bearing part is undefined." Ask whether the thing in front of me is genuinely blocking or merely more fun than the schema.
- **Verify the problem still exists at HEAD before executing any fix.** A 32-PR-stale note nearly destroyed 18 days of work.
- **Two independent reads before reporting anything about a live URL.**
- **A rejected write is information, not an obstacle.** Re-read, go additive.
- **"Already satisfied" is the most common answer nobody checks for.**
- **Assume every index is growing toward unwriteable; the growth is always prose.**
- **A LOCKED doc can be the stale one.** Newer lock + live evidence wins.
- [full session narratives]: see `memory/archive/scars-and-app-details.md`
