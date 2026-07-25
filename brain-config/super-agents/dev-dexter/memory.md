# Dexter — Memory (accumulated engineering context)

> CONTEXT, not process. What I know about THIS codebase and how Michael builds — judgment that can't live in a standards doc because it's history, not rules. Procedure lives in the tools `preferences.md` points at. **If a fact here conflicts with the live repo, the live source wins — fix this file.**
>
> **Budget ~12KB** (my own size rule applies to me). Pointers, not prose. Blow-by-blow belongs in `activity-log.md` + the session task, never here. Seeded 2026-07-25 by Fleet Felix; EARNED is what I've seen with my own hands.

---

## 🚦 SEQUENCE BY REVERSIBILITY — the order law (Michael, 2026-07-25)

**Order work by COST TO REVERSE, not by what's visible, fun, or nearly done.** Schema, identity keys, and page contracts are expensive and load-bearing. Theme, copy, spacing, icons are one pointer each. **Do the expensive-to-reverse work first, on defaults.**

> *"Theming should be the lightest thing to change later because we've decided that default structure already. So use defaults for now for all I care cos the whole point is we can change it later."*

**The tell: if I could build it on a default and swap later, it is NOT a gate.** Say so instead of scheduling it.

**The subtle version:** *"X blocks the build"* about a late-binding concern is never a schedule fact — it's a **conformance bug report about my own plan.** Theme can only block a shell if the shell isn't token-pure, and token purity is already law. I wrote *"the shell consumes tokens, so this blocks the shell"* into a README while the schema sat unpromoted. The contract disproving it was in this file.

**Watchdog duty (mine, assigned):** hold a build to its own stated order, including when *I* am the one drifting. "Schema and pages before we build anything" is a commitment I enforce, not a preamble. Style is still seated at planning — **but banking a direction is not blocking on it.**

---

## The repo in one paragraph

**`mawizorek/ClickUp_apps` (PUBLIC), branch `main`.** One folder per app, kebab-case slug. Live at `https://mawizorek.github.io/ClickUp_apps/<slug>/` (Pages, ~60s lag). Root = apps + infra only. `brain-config/` is the Brain's config tree in the same repo. The MCP token authenticates as **`maw-agents`** — a COLLABORATOR, not the owner. Always address the repo as `mawizorek/ClickUp_apps`; never scope a search to `user:maw-agents`.

## 📐 The numbers I enforce (`hooks/source-size-budget-enforcer.md`)

**~10–12KB target · 15KB split line · ~22KB practical ceiling · ~30KB hard tool cap.** Under 12 = silent pass. 12–15 = split if a clean seam exists. Over 15 = split by concern same pass. Over 30 = never round-trip `create_or_update_file`.

**Why 22KB:** the cap is on bytes the read tool RETURNS, and the blob API returns base64, inflating 4/3. ~22KB on disk ≈ 29KB returned = the real edge.

**Posture (LOCKED, and the part agents get wrong):** modular is **just how we build** — invisible like indentation. Don't ask "should I split this?", don't narrate routine splits. **Size reaches Michael in ONE case:** no clean seam exists and the only way under budget is hacking a coherent unit into arbitrary A/B/C fragments.

**Seams:** styles vs logic · render modules by screen · shared state/constants · pure helpers · entry/wiring. Reference: `world-cup-bracket/` post-v3. **For a document-shaped file the seam is narrative vs current state — trim the prose, never split the list.**

## 🎯 Canonical / generated / projection — the model behind every duplicate mess

From `brain-config/README.md`'s surface map; generalizes far past agents. Every surface holding a fact is exactly one of:

- **CANONICAL** — authored here, wins on conflict.
- **GENERATED** — mechanically derived; NEVER hand-edit.
- **PROJECTION** — read-optimized copy; may carry a one-line summary + pointer, must never grow into a second copy of the rule.

**Author once at the canonical layer; everything else points or is generated.** Same authored fact maintained in two non-mirror places = trickle-down; delete from the projection, point home. **The abstraction behind both 07-25 collapses** (registry/roster, app-index/VERSIONS): two surfaces both claimed canonical, and the duplicate rotted. When Michael says "why are there two of these," this is the frame.

**Exemplar:** the Expression law — canonical in the transcript gate, one-line mirror in `council.md`, pointer in every profile. **Deliberate exception, do NOT consolidate:** the 4-line Standing-agent conduct block in every profile — a *personalization seed*, not duplicated fact.

## ✅ Audit baselines that already exist (don't invent a checklist)

- **`template-app/CONFORMANCE.md`** — THE app audit baseline. Diff any app folder against it: folder shape (slim router, `pages/<route>.html`, **no `source/` unless legacy pre-split**), theme contract, chrome, head polish, build hygiene. Gold standard v5, gate `0426`. ⚠️ **Open conflict for Michael:** it says no `source/`, but `app-dashboard` uses `source/` and is called the modular reference. template-app is newer (v5, PR #300) so it probably wins — his call, not mine.
- **`brain-config/code-review-standard.md`** — THE review method + report format (Beckett, Red-Team, `/code-review` all share it). Compose existing guards in order (Beckett → Red-Team → Secrets/PII → Skill-Ban → Size Budget), never reinvent. Every issue carries `path/file:line` + a concrete fix. Clean bill → confirm what was checked, don't invent issues.
- **Consumer test** (`skills-integration.md`): content any *other* agent could need lives in **git**; a skill is a thin trigger pointing at it.

## 🎨 Theme contract (the styling law)

**This is why theme is LATE-BINDING and never a build dependency.** 17 tokens. **Every color is `var(--token)` — zero literals** in `styles.css`, `chrome.js`, or pages (sole exception: the neutral black-alpha drawer scrim). Link `shared/themes/themes.css` (static, instant paint) **and** `resolve.js` (live switching); set `<html data-theme data-mode>` for first paint; **default `default-theme` until one is chosen — a working state, not a placeholder.** Picker auto-populates from `THEMES.list()`.

**A theme is a 4-vector matrix**, not a color: colors × typography × forms × spacing, joined by one slug in `_themes.json`. Apps request the slug, never a vector. Swapping the slug is the whole reskin.

**⚠️ The boot trap:** `applyTheme(slug)` composes all four vectors — that is the boot. `apply(colorSlug)` is **COLOR ONLY**, for the picker's hue swap. Using `apply` as the boot silently drops typography/forms/spacing and the app looks fine while unthemed — the pre-07-19 anti-pattern that made apps hand-bake structural CSS, freezing radii/borders un-swappably. **The `:root` block is a first-paint FALLBACK FLOOR and must be labelled one.**

**Adding a theme value has a third step people skip:** TSV row → `_themes.json` entry → **update the embedded snapshot in `preview.data.js`**. A new Forms *column* also needs `FORM_KEYS` in `resolve.js`, or it works in the Studio (which applies columns generically) and is **silently broken in every real app**. Contract: `shared/themes/THEME-SYSTEM.md`.

**No silent path (fixed 07-25, PR #502):** every unresolved theme reference faults — `THEMES.faults` + console + one combined banner. `opts.silent` is accepted and ignored. `THEMES.validate()` reports broken join references without applying. Before this, a typo'd vector pointer inside a valid join applied nothing and **announced nothing.**

**Two-layer rule (from On Track, generalizes):** Layer A = chrome palette from the spine. Layer B = app-identity colors (On Track's 20 series colors) stays a LOCAL block riding on top of any theme. **Never sweep identity colors into a theme vector** — F1 stays F1-red on parchment. An unmet color need is flagged to the steward, never inlined.

## Architecture locks

- **`index.html` is an INDEX (07-08).** A router/shell referencing pages, never a file storing a full servable page. Single-view app: the index can be the whole app. The instant a second page exists, the index becomes the dispatcher and the default landing is a one-line constant. Stops: *"the index quietly became the app."*
- **A data store NEVER sits at repo root (07-08).** It nests inside the app consuming it (`f1-racetracks/f1-results/<year>/`). A loose root data folder also mis-renders as an "app." Cross-app → a named `shared/`.
- **Two-artifact ship for over-cap apps:** running `index.html` + a `<slug>/source/` chunk set (`_index.md` + `<slug>_partNN_of_MM.txt`, ≤~22KB each). The `_of_MM` count is the truncation tripwire.

## The scars (cite these, don't re-derive them)

- **Jekyll silent-kill (07-02).** Pages runs Jekyll by default and eats `{{ }}` / `{% %}`, which our inline JS uses as code. Build fails SILENTLY and Pages keeps serving the last good build **site-wide**. Looks exactly like cache. `.nojekyll` at root fixes it — it exists, never delete it. **First thing to check when a Pages URL won't update despite a correct commit.**
- **The ~30KB read cap is unpageable (07-01).** No byte-range knob; an over-cap file clips silently at ~byte 30,000.
- **Base64 armor / DDR Explorer v19.** Readback FLATTENED `innerHTML`-built markup while UUID markers still matched, so an integrity check passed on gutted source. A plaintext HTML chunk is trustworthy only if the read returns literal `<div` / `<svg` intact.
- **Stale reads clobber current work (repeatedly).** Branch raw URLs serve cache-frozen copies — 07-25: a raw read of `inciardi-market/source/app-core.js` returned v10.1/PR #174 while `main` was v15/PR #455. **Blob API, base64-decoded, re-fetched before every write.**
- **Large writes corrupt (07-02, 4× in one session).** >~30KB never goes through `create_or_update_file`.
- **A helper that silently declines to transform is worse than one that throws.** `proxied(url, 360)` is a NO-OP on an R2 `/img?key=` URL — that branch cannot resize — so 268MB of originals got painted into a phone grid, and the error handler then cache-busted the SAME url and hid the element on the second miss.
- **A unit assumption with no assertion is a silent feature-killer.** `retailFrom()` divided by 100 assuming cents; the storefront returns DOLLARS. All 177 rows read 1/100th, making the "underpriced" threshold mathematically unreachable — a whole feature could never fire, no error anywhere.
- **Changing a key's derivation orphans everything keyed on it.** `print_id` was left alone because the harvest never DELETEs, so a new slug would strand inventory/image/machine rows.
- **A silent fallback is a lie, and "resilience" is where they hide.** Four in one day (07-25): HTTP cache, stylesheet cache, localStorage, theme resolver — **every one added to make something more robust.** Any cache/retry/default/degraded path must announce itself in the UI, with an age where one exists.

## What apps exist → **`VERSIONS.md` (repo root). THE single app ledger.**

**No app inventory in this file** — a memory that lists apps is a third index waiting to rot. The ledger holds versions, live warnings, security flags, the App Verify Gate; read it before touching OR discussing any app and update the touched row same-session. `brain-config/app-index.md` is a retired stub (07-25). Per-app history → git + PR + that app's README/spec.

Apps I have an opinion about (state → the ledger, always):

- **`app-dashboard`** — the launcher everything hangs off; modular reference impl.
- **`world-cup-bracket`** — the size-budget reference implementation.
- **`f1-racetracks`** — canonical data-nests-inside-its-app example.
- **`on-track`** — 2nd spine consumer; the shape to copy for theme adoption + the two-layer color rule.
- **`retrocast`** — the FIRST spine consumer; proof that swapping structural feel is one pointer and zero CSS edits.
- **`template-app`** — gold-standard baseline. Start here for a new app; change only `APP_THEME`.
- **`file-chunker`** — generates `/source` chunk sets; also proved the large-write corruption rule.
- **`inciardi-market`** — two Cloudflare workers over one D1+R2 store, NOT data-separated. Carries the **Image Rendering Law** + an open security flag. Being replaced.
- **`inciardi-collection`** — DEFINITION stage, founded 07-25. `artwork → edition → copy`; D1 is the source, git JSON an export; manual entry primary (acceptance test: *if every worker died tomorrow, could Michael still fully use this app?*). Builds on `default-theme`; `inciardi-prints` is banked, not blocking.
- **`agentglass`** — first app with a non-executing `server/` tree; reads a committed seed, labeled SNAPSHOT so it can't imply false currency.

## How Michael works on builds

- **Plan the expensive-to-reverse things first.** Schema and page contracts before anything cosmetic. See the order law at the top — the correction I'm most likely to need again.
- **Dark themes by default.** Don't ask.
- **Style is seated at PLANNING**, not bolted on. I ground Stu, never preempt him. **A banked direction is not a blocker.**
- **Two deliveries for any HTML artifact:** markdown link + the raw URL in a bare code block (mobile copy). GitHub source links are always `/blob/` URLs.
- **Copy-paste content = bare code blocks, no language tag, one link per block.** He's often on a phone.
- **Feature requests become spec lines** in `next-build-spec.md` (Scratch → Next build/Futures → In review), never chat or task comments. One spec per app, overwritten each cycle, **version in the header never the filename**.
- **Pre-build:** edge-case / risk pass. Research carries source links.
- **110%, elevate don't just execute.** A correct answer that ignores a better shape is a miss.
- **He builds by voice a lot** — names and commands must survive dictation.
- **He collapses duplicates on sight.** Twice on 07-25 he killed a second source of truth rather than syncing it. Never propose a mirror as a solution.
- **He keeps the reasoning, not just the outcome.** The theme spine carries a 21KB decision log; rejected options and overruled objections stay in the record. Don't tidy away the roads not taken.

## Who I work with (lanes, not ranks — Constitution §6)

**Mira** seats me and runs the room; I never do. **Size Sally** forecasts the size curve before a write — closest ally, seat her early. **Breaker Beckett** attacks what I ship; adversary by design. **Feasible Finn** judges *can this be built* in one turn, I hold *how this codebase actually is* across sessions — neither substitutes for the other. **Style Stu** owns look/feel; I own that the theme contract is honored. **Scope Skye** checks me expanding a build. **Recon Renata** is the repo-only audit lens; **Anna** leads formal audits. **Felix** stewards the fleet. **Corey** owns the ClickUp side — my domain stops at the repo boundary.

## EARNED (seen with my own hands)

**Late-binding made into a blocker (07-25).** Listed the theme as the sole gate on M1 and built a palette while the schema sat unpromoted, in a build whose directive was *schema and pages first*. **Ask what a thing actually blocks and what it costs to reverse before it enters a critical path. "One pointer" = backlog.** Now the order law at the top.

**A commit message that lied about its own diff (07-25).** Claimed "net smaller despite the additions" on an edit to this file that went 15.9KB → 19.2KB. **Never assert a size, version, or state I haven't measured post-write.** Same rule as "version stamps must not lie," and I broke it in the file that records it.

**A documented fix had already shipped, and following the doc would have broken the app (07-25).** Note dated 07-07, both named reverts landed 07-08, feature rebuilt cleanly after: **32 PRs stale**, and executing it would have destroyed 18 days of work. **A remediation instruction rots like a version number — verify the problem still exists at HEAD before executing a fix, especially a destructive one.**

**The stale-read trap is recursive (07-25).** My first fetch of the live dashboard returned a cache-frozen layout that doesn't exist in the repo; I was one sentence from reporting a phantom regression. **Two independent reads before reporting anything about a live URL.**

**Concurrency is real and the SHA guard works (07-25, twice).** **On a SHA rejection: re-read HEAD and go additive — never re-apply the original body.** Second time was a merge conflict on this very file where the parallel version was *better*, so I kept theirs and added only what was missing. **A rejected write is information, not an obstacle.**

**Check whether the job is already done (07-25).** Sent to collapse app-index into VERSIONS.md: already collapsed. **"Already satisfied" is a valid and common answer.**

**Two canonical files crossed unwriteable in one day (07-25):** `roster.json` ~25KB, `VERSIONS.md` 16.4KB, both grown because rows became essays. **Assume every hand-maintained index is on a curve toward unwriteable; the growth is always prose, never rows; its own registration/verify flow breaks first.** This file hit 19.2KB the same day.

**A LOCKED doc can be the stale one (07-25).** `brain-config/README.md` carried a "Verified read path (LOCKED 07-04)" naming raw githubusercontent as canonical for file bodies — contradicted by the GitHub MCP Operating Standard (LOCKED 07-09) and by live evidence; `next-build-spec.md` carried the same rot. **A lock date is not a freshness guarantee; on conflicting locks the NEWER one plus live evidence wins, and a standards doc contradicting a locked standard gets fixed in the same pass.** Three rotted instructions in one day, all instructions rather than data: **prescriptive text rots faster than descriptive text, because nobody re-verifies a rule.**
