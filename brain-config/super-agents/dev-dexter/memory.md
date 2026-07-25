# Dexter — Memory (accumulated engineering context)

> CONTEXT, not process. What I know about THIS codebase and how Michael builds — the judgment that can't live in a standards doc because it's history, not rules. Procedure lives in the tools I point at (`preferences.md` → Knowledge & Tools). If a fact here conflicts with the live repo, the live source wins — fix this file.
>
> **Budget: keep this under ~12KB** (my own size rule applies to me). Pointers, not prose. Seeded 2026-07-25 by Fleet Felix; the EARNED section is what I've seen with my own hands.

---

## The repo in one paragraph

**`mawizorek/ClickUp_apps` (PUBLIC), branch `main`.** One folder per app, kebab-case slug. Live at `https://mawizorek.github.io/ClickUp_apps/<slug>/` (Pages, ~60s lag). Root = apps + infra only. `brain-config/` is the Brain's own config tree in the same repo. The MCP token authenticates as **`maw-agents`** — a COLLABORATOR, not the owner. Always address the repo as `mawizorek/ClickUp_apps`; never scope a search to `user:maw-agents`.

## 📐 The numbers I enforce (from `hooks/source-size-budget-enforcer.md`)

**~10–12KB target · 15KB split line · ~30KB hard read/write cap.** Under 12 = silent pass. 12–15 = split now if a clean concern boundary exists. Over 15 = split by concern in the same commit pass, automatically. Over 30 = never round-trip `create_or_update_file` (it clips/corrupts); route to GitHub-UI upload or a chunk set.

**Operating posture (LOCKED, and this is the part agents get wrong):** modular is **just how we build** — invisible like indentation. Do NOT ask "should I split this?" and do NOT narrate routine splits. **The ONLY time size reaches Michael:** no clean seam exists and the only way under budget is hacking one coherent unit into arbitrary A/B/C fragments (a single giant lookup table, one indivisible function). *That* is the flag, because it signals a design tension only he resolves.

**Where clean seams usually are:** styles vs logic · render modules by screen · shared state/constants · pure helpers · entry/wiring. Reference implementation: `world-cup-bracket/` post-v3 (thin shell + 6 JS + 2 CSS, each <12KB).

## 🎯 Canonical / generated / projection — the model behind every duplicate mess

From `brain-config/README.md`'s surface map, and it generalizes far past agents. Every surface holding a fact is exactly one of:

- **CANONICAL** — authored here, wins on conflict.
- **GENERATED** — mechanically derived; NEVER hand-edit.
- **PROJECTION** — a read-optimized copy; may carry a **one-line summary + pointer**, must never grow into a second copy of the rule.

**Consolidation principle:** author once at the canonical layer; everything else points or is generated. If the same authored fact is maintained in two non-mirror places, one is trickle-down — delete it from the projection and point at the home. **This is the abstraction behind both collapses on 2026-07-25** (registry/roster, app-index/VERSIONS): in each case two surfaces both claimed canonical, and the duplicate was the one that rotted. When Michael says "why are there two of these," this is the frame.

**Exemplar to copy:** the Expression law — canonical in the transcript gate, one-line mirror in `council.md`, pointer in every profile.

**Deliberate exception, do NOT consolidate away:** the 4-line Standing-agent conduct block in every agent profile. It's a *personalization seed*, not duplicated fact — an agent loading only its own profile must see its conduct rules without a second fetch.

## ✅ Audit baselines that already exist (don't invent a new checklist)

- **`template-app/CONFORMANCE.md`** — THE app audit baseline. Diff any app folder against it to find gaps. Covers folder shape (slim router, `pages/<route>.html`, **no `source/` folder unless legacy pre-split**), the theme contract, chrome, head polish tiers, and build hygiene. `template-app` = gold standard v5, gate code `0426`.
- **`brain-config/code-review-standard.md`** — THE review method + report format, shared by Beckett, the Red-Team reviewer, and the `/code-review` skill. Method = compose existing guards in order (Beckett → Red-Team → Secrets/PII → Skill-Ban → Size Budget), never reinvent. Report = severity-grouped, **every issue carries `path/file:line` + a concrete fix**. Critical = security hole / data loss / broken ship. Clean bill → confirm what was checked, don't invent issues.
- **Consumer test** (from `skills-integration.md`): content any *other* agent could need lives in **git**; a skill is a thin trigger that points at it. That's why the review standard isn't inside the skill body.

## 🎨 Theme contract (the styling law)

17 tokens. **Every color is `var(--token)` — zero color literals** in `styles.css`, `chrome.js`, or pages (sole exception: the neutral black-alpha drawer scrim). Link `shared/themes/themes.css` (static, instant paint) **and** `resolve.js` (live switching); set `<html data-theme data-mode>` for first paint; default `default-theme` until one is chosen. Picker auto-populates from `THEMES.list()`.

**Two-layer rule (from On Track, generalizes):** Layer A = chrome palette, comes from the spine. Layer B = app-identity colors (On Track's 20 series colors) stays a LOCAL block riding on top of any theme. **Never sweep identity colors into a theme vector** — F1 stays F1-red on parchment. An unmet color need gets flagged to the steward, never inlined.

## Architecture locks

- **`index.html` is an INDEX (2026-07-08).** A router/shell referencing pages — never a file storing a full servable page. Single-view app: the index can be the whole app. The instant a second page exists, the index becomes the dispatcher and the default landing is a one-line constant. The drift this stops: *"the index quietly became the app."*
- **A data store NEVER sits at repo root (2026-07-08).** It nests inside the app that consumes it (`f1-racetracks/f1-results/<year>/`). A loose root data folder also mis-renders as an "app." Cross-app shared data → a named `shared/`.
- **Two-artifact ship for over-cap apps:** running `index.html` + a `<slug>/source/` chunk set (`_index.md` + `<slug>_partNN_of_MM.txt`, ≤~22KB each). The `_of_MM` count is the truncation tripwire.

## The scars (cite these, don't re-derive them)

- **Jekyll silent-kill (07-02).** Pages runs Jekyll by default and eats `{{ }}` / `{% %}`, which our inline JS uses as real code. Build fails SILENTLY and Pages keeps serving the last good build **site-wide**. Looks exactly like cache. Fix: `.nojekyll` at root — it exists, never delete it. **First thing to check when a Pages URL won't update despite a correct commit.**
- **The ~30KB read cap is unpageable (07-01).** No byte-range knob; an over-cap file clips silently at ~byte 30,000.
- **Base64 armor / DDR Explorer v19.** Readback FLATTENED `innerHTML`-built markup while UUID markers still matched, so an integrity check passed on gutted source. A plaintext HTML chunk is trustworthy only if the read returns literal `<div` / `<svg` intact.
- **Stale reads clobbering current work (repeatedly).** Branch raw URLs serve cache-frozen copies — verified 07-25: a raw read of `inciardi-market/source/app-core.js` returned v10.1/PR #174 while `main` was on v15/PR #455. **Blob API, base64-decoded, re-fetched before every write.**
- **Large writes corrupt (07-02, 4× in one session).** >~30KB never goes through `create_or_update_file`.

## What apps exist → **`VERSIONS.md` (repo root). THE single app ledger.**

**Do not keep an app inventory in this file** — a memory that lists apps is a third index waiting to rot. The ledger holds current versions, live warnings, security flags, and the App Verify Gate; read it before touching OR discussing any app and update the touched row same-session. `brain-config/app-index.md` is a retired redirect stub (07-25). Per-app history → git + PR + that app's own README/spec.

Apps I have an opinion about (state → the ledger, always):

- **`app-dashboard`** — the launcher everything hangs off; reference impl of the modular target (thin loader over `source/*`).
- **`world-cup-bracket`** — the size-budget reference implementation.
- **`f1-racetracks`** — canonical data-nests-inside-its-app example.
- **`on-track`** — 2nd theme-spine consumer; the shape to copy for theme adoption + the two-layer color rule.
- **`template-app`** — gold-standard baseline. Start here for a new app.
- **`file-chunker`** — generates `/source` chunk sets. Also proved the large-write corruption rule.
- **`inciardi-market`** — two Cloudflare workers over one D1+R2 store, NOT data-separated. Carries the **Image Rendering Law** + an open security flag.
- **`agentglass`** — first app with a non-executing `server/` tree; reads a committed seed, labeled SNAPSHOT so it can't imply false currency.

## How Michael works on builds

- **Dark themes by default.** Don't ask.
- **Style is seated at PLANNING**, not bolted on. I ground Stu; I don't preempt him.
- **Two deliveries for any HTML artifact:** markdown link + the raw URL in a bare code block (mobile copy). GitHub source links are always `/blob/` URLs.
- **Copy-paste content = bare code blocks, no language tag, one link per block.** He's often on a phone.
- **Feature requests become spec lines** in `next-build-spec.md` (Scratch → Next build/Futures → In review), never chat or task comments.
- **Pre-build:** edge-case / risk pass. Research carries source links.
- **110%, elevate don't just execute.** A correct answer that ignores a better shape is a miss.
- **He builds by voice a lot** — names and commands must survive dictation.
- **He collapses duplicates on sight.** Twice on 07-25 he killed a second source of truth rather than syncing it. Never propose a mirror as a solution.

## Who I work with (lanes, not ranks — Constitution §6)

**Mira** seats me and runs the room; I never do. **Size Sally** forecasts the size curve before a write — my closest ally, seat her early. **Breaker Beckett** attacks what I ship; adversary by design. **Feasible Finn** judges *can this be built* in one turn, I hold *how this codebase actually is* across sessions — don't let either substitute for the other. **Style Stu** owns look/feel; I own that the theme contract is honored. **Scope Skye** is the check on me expanding a build. **Recon Renata** is the repo-only audit lens; **Anna** leads any formal audit. **Felix** stewards the fleet. **Corey** owns the ClickUp side — my domain stops at the repo boundary.

## EARNED (seen with my own hands, not inherited)

**2026-07-25 · a documented fix had already shipped, and following the doc would have broken the app.** Sent to "restore the dashboard" off a note dated 07-07; both named reverts had landed 07-08 and the feature was rebuilt cleanly after. The note was **32 PRs stale** and executing it would have destroyed 18 days of work. **A remediation instruction rots exactly like a version number — verify the problem still exists at HEAD before executing a fix, especially a destructive one.**

**2026-07-25 · the stale-read trap is recursive.** My first fetch of the live dashboard returned a cache-frozen layout that doesn't exist in the repo. I was one sentence from reporting a regression that wasn't there. **Two independent reads before reporting anything about a live URL** — that same failure is how the phantom note got written.

**2026-07-25 · concurrency is real and the SHA guard works.** A parallel pass edited a file between my read and my write; the write was rejected on a stale SHA. **On a SHA rejection: re-read HEAD and go additive — never re-apply your original body.** That preserved a finding I'd missed.

**2026-07-25 · check whether the job is already done.** Asked to collapse app-index into VERSIONS.md: already collapsed. **"Already satisfied" is a valid and common answer.**

**2026-07-25 · two canonical files crossed unwriteable on the same day** (`roster.json` ~25KB, `VERSIONS.md` 16.4KB). Both had grown because rows became essays. **Assume every hand-maintained index is on a growth curve toward unwriteable, and that its own registration/verify flow is what breaks first.**

**2026-07-25 · a LOCKED doc can be the stale one.** `brain-config/README.md` carried a "Verified read path (LOCKED 2026-07-04)" naming raw githubusercontent as the source of truth for file bodies — directly contradicted by the GitHub MCP Operating Standard (LOCKED 07-09) and by today's evidence. **A lock date is not a freshness guarantee; on two conflicting locks the NEWER one plus live evidence wins.**
