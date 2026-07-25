# Dexter — Memory (accumulated engineering context)

> CONTEXT, not process. This holds what I know about THIS codebase and how Michael builds — the engineering judgment that can't live in a standards doc because it's history, not rules. Procedure lives in the tools I point at (`preferences.md` → Knowledge & Tools). If a fact here conflicts with the live repo or a standards doc, the live source wins — fix this file.
>
> **Seeded 2026-07-25 at birth by Fleet Felix**, then harvested the same day from the repo's own standards. Inherited notes are labelled; the EARNED section is what I've seen with my own hands.
>
> 📏 **Keep this file under ~18KB.** Base64 inflates by 4/3, so past ~22KB it stops being readable-whole and therefore stops being safely editable — the exact wall that ate `roster.json` and `VERSIONS.md`. If it grows: compress to one-liners and point at the tool, never split it.

---

## The repo in one paragraph

**`mawizorek/ClickUp_apps` (PUBLIC), default branch `main`.** One folder per app, kebab-case slug. Live at `https://mawizorek.github.io/ClickUp_apps/<app-slug>/` (GitHub Pages, ~60s lag). Root reads as a clean list of apps + infra ONLY. `brain-config/` is the Brain's own configuration tree in the same repo. The GitHub MCP token authenticates as **`maw-agents`**, a COLLABORATOR not the owner — always address the repo as `mawizorek/ClickUp_apps`, never scope a search to `user:maw-agents`.

## Architecture direction (where we're going)

**Modular is the target, not the aspiration.** Slim `index.html` boot/router, source split by concern, deterministic rebuild path. A giant self-contained runtime file is **transitional technical debt** unless Michael blessed that shape for that app. When I touch such an app, the modular pull is part of the job.

**`index.html` is an INDEX (LOCKED 2026-07-08).** A router/shell referencing source pages — never a file storing a full servable page. Single-view app: the index can be the whole app. The instant a second servable page exists, the index becomes the dispatcher, real pages get named files, and the default landing is a one-line constant repointable without a rebuild. Prevents *"the index quietly became the app,"* the most common way this repo rots.

**A data store NEVER sits at repo root (LOCKED 2026-07-08).** It nests inside the app that consumes it (`<app-slug>/<data-dir>/`), fetched by relative path. A loose root data folder also mis-renders as an "app" in the root listing. Genuinely cross-app data goes in a named `shared/`.

## 📐 The size ladder (one rule, four numbers — I own this)

Every size limit in this repo is the same constraint wearing different clothes: **a file I cannot read whole, I cannot safely edit.**

- **~12KB — the source gate.** Target per source module (`template-app` CONFORMANCE requires it). Also the locked cap on `VERSIONS.md` and `roster.json`.
- **~22KB — the chunk size** for a `/source` rendition part. Deliberate headroom under the read cap.
- **~30KB — the hard read cap.** Unpageable; no byte-range knob exists. Over-cap files clip SILENTLY at ~byte 30,000.
- **The base64 multiplier.** The trustworthy read path returns base64, which inflates 4/3 — so the *practical* ceiling is ~22KB of real bytes, not 30KB. This is why 25KB files that "should" fit don't. **Nobody had written this down; it's the missing math behind both walls we hit.**

Consequence: **write anything over ~30KB and it corrupts** (`create_or_update_file` destroyed the file chunker 4x in one session, 2026-07-02, and the clipping read path meant re-reading couldn't recover the bytes). Byte-safe for big files = Michael uploads via the GitHub UI, or a git-data blob-SHA revert. **Seat Size Sally before a file grows, not after it blocks you.**

## The scars (cite these, don't re-derive them)

- **The Jekyll silent-kill (2026-07-02).** Pages runs every commit through Jekyll, and Jekyll eats `{{ }}` / `{% %}` — which our inline-JS HTML uses as real code. The build fails SILENTLY and Pages keeps serving the last successful build **for the whole site**. Symptom: file on `main` is correct, live URL frozen everywhere, looks exactly like cache. Fix: `.nojekyll` at repo root. **First thing to check when a Pages URL won't update despite a correct commit.**
- **Markup flattening / base64 armor (DDR Explorer v19).** Readback FLATTENED `innerHTML`-built markup while UUID markers still matched, so an integrity check PASSED on gutted source. A plaintext HTML chunk is only trustworthy if the read returns literal `<div` / `<svg` / `<span class=` intact. Unflattened readback is an acceptance gate, never an assumption.
- **Stale reads clobbering current work (repeatedly).** Branch raw URLs and `get_file_contents` bodies serve cache-frozen copies — verified 07-25: a raw URL returned `inciardi-market` v10.1/PR #174 while `main` was on v15/PR #455. **Five versions and 280 PRs of drift from one read.** Blob API is content-addressed and immutable; re-fetch before any decision or write.
- **The image-rendering law (`inciardi-market`, 3rd image outage, different cause each time).** `proxied(url, 360)` is a NO-OP on an R2 `/img?key=` URL — that branch cannot resize. 268MB of full-res originals were being painted into a phone grid, and the old error handler cache-busted the SAME url then hid the element on the second miss. Thumbs must resolve to width-capped CDN derivatives. **Generalized: an image helper that silently declines to transform is worse than one that throws.**
- **Units are a data contract (same app).** `retailFrom()` divided by 100 assuming cents; the storefront returns DOLLARS. All 177 rows were 1/100th, which made the "underpriced" threshold mathematically unreachable — a whole feature silently could never fire. **A unit assumption with no assertion is a silent feature-killer.**
- **Never re-derive an ID that other rows point at.** Same app: `print_id` derivation was left deliberately UNCHANGED because the harvest never DELETEs, so a new slug would strand inventory/image/machine rows. **Changing a key's derivation orphans everything keyed on it.**

## 🎨 The theme spine (`shared/themes/`) — the contract I enforce

**A theme is a 4-vector matrix, not a color:** `colors.tsv` (paint) × `typography.tsv` (voice) × `forms.tsv` (tactility + depth + motion) × `spacing.tsv` (density). `_themes.json` is the **join table** — an app requests ONE slug and gets all four. Apps never reference a vector directly.

- **Boot is `THEMES.applyTheme(APP_THEME)`** (composes all 4). `THEMES.apply(colorSlug)` is COLOR ONLY — that's for the settings picker's hue swap, **never the boot**. Getting these backwards silently drops typography/forms/spacing.
- **The app's `:root` is a FIRST-PAINT FALLBACK FLOOR, and must be labelled as such.** Mirror the chosen theme so first paint == themed (no flash) and the app still renders if the resolver is slow/offline. **The theme is the source of truth; the floor is a mirror, never the design.**
- **Consume structural tokens, never literals:** `--radius`, `--radius-lg`, `--border-w`, `--font-display/body/mono`, `--fs-*`, `--track-tight`, `--touch`, `--pad-card`, `--pad-cell`, `--gap-*`, `--elev-1/2/3`, `--motion-fast/med`, `--ease`, `--lift`. A local spacing ramp must DERIVE from the vector or tight/standard/loose doesn't actually flow.
- **The named anti-pattern:** hand-baking structural values instead of pointing at a theme. That's how apps froze their radii/borders/spacing un-swappably before 07-19.
- **Three Forms presets, genuinely distinct:** `sharp` (4/6px, 1.5px border, squared chips, fast — dense data), `soft` (8/12px, 1px, rounded-rect — everyday default), `grounded` (12/18px, deepest elevation, roomy — editorial). A 4th "sleek" was trialed and CUT: it was just 999px toy bubbles. **Lesson: distinctness comes from tiering radius + elevation + border TOGETHER, not from removing borders.**
- **Adding a value has a mandatory third step:** TSV row → `_themes.json` entry → **update the embedded snapshot in `preview.data.js`**. A new Forms COLUMN also needs adding to `FORM_KEYS` in `resolve.js`, or real apps silently won't apply it (the studio applies columns generically, so it'll look fine in preview and be broken in production).
- **Layer separation (from On Track):** chrome comes from the spine; app-IDENTITY colors (the 20 F1 series colors) stay a LOCAL layer riding on top. The library offers 4 categorical slots — nowhere near 20 fixed identities. **Never sweep identity colors into a theme vector.**
- All motion is wrapped by a `prefers-reduced-motion` guard.

## ✅ What "done" means (`template-app/CONFORMANCE.md` is the audit baseline)

The non-obvious bars, worth holding without re-reading:

- **No `source/` folder at all** in a conformant app — real pages are `pages/<route>.html` partials. A `source/` folder means legacy pre-split monolith, which is itself a finding. *(Note: `app-dashboard` uses `source/` and is called the modular reference elsewhere. Two shapes both live; template-app is newer. Ask Michael which wins before "fixing" either.)*
- **Zero color literals** in `styles.css` / `chrome.js` / pages. Sole exception: the neutral black-alpha drawer scrim.
- **Footer stamp is JS-written**, never hardcoded: `App Name v<N> · PR #<n>`. Live values compute at runtime — footer, dates, states.
- **Every interactive control needs its full state lifecycle:** entry, exit/reset, rest state, no gesture collisions. Half-wired controls are the usual miss.
- **Drawers close four ways:** ✕, scrim click, Esc, and gear re-toggle, with `aria-expanded` tracking. **Solid surface, no glassmorphism.**
- **Head polish tiers:** T1 = `theme-color`, `viewport-fit=cover`, `robots noindex`, title, description, OG + Twitter with an ABSOLUTE `og.png` URL, emoji-SVG favicon, `<html lang>`. T2 = manifest + apple-touch-icon, reduced-motion guard, `<noscript>`, `:focus-visible`.
- **Mobile clean at 320–390px:** no horizontal overflow, ≥44px touch targets, chrome wraps/stacks.
- **3-state access gate** wired to `config.json` (`open`/`gated`/`down`) with an inline fallback.

## 🔍 Review severity (from `code-review-standard.md` — the shared format)

A review is a **composition of existing guards, not a fresh invention**: Beckett → Red-Team reviewer → Secrets/PII Guard → Skill-Ban Guard → Source-Size Enforcer. Report groups by severity, and **every issue carries `file:line` + a concrete fix** — never a vague gesture.

- 🔴 **Critical** = security hole, data loss, or a broken ship (stale Pages build, committed secret, hard-ban hit).
- 🟠 **Major** = a real bug, a maintainability trap, or a standard violation that won't break prod today.
- 🟡 **Minor** = polish, readability, nice-to-have.
- **Clean bill → say what was checked. Never invent issues to look thorough.**

## What apps exist → **read `VERSIONS.md` (repo root). It is THE single app ledger.**

**Do not keep an app inventory in this file.** The ledger carries every app's version, status, live warnings, security flags, and the App Verify Gate — read it before touching OR discussing any app, and update the touched row in the same session. `brain-config/app-index.md` was a second index, retired to a redirect stub 2026-07-25; repoint anything still aimed there.

Apps I've formed an opinion about (state → the ledger, always):

- **`template-app`** — gold standard. Start here for a new app; change only `APP_THEME`.
- **`app-dashboard`** — the launcher everything hangs off; thin loader over `source/*`.
- **`retrocast`** — the FIRST theme-spine consumer, and proof that swapping structural feel is one pointer and zero CSS edits. Was in no index at all until 07-25.
- **`on-track`** — 2nd spine consumer; the shape to copy for theme adoption + the Layer A/B separation.
- **`f1-racetracks`** — canonical data-nests-inside-its-app example. Data-layer follow-ups parked in a handoff.
- **`file-chunker`** — generates the `/source` chunk sets; also proved the large-write corruption rule.
- **`inciardi-market`** — two Cloudflare workers over one D1+R2 store, NOT data-separated. Carries the image law, the units scar, an open security flag.
- **`agentglass`** — first app with a non-executing `server/` tree; reads a committed seed labelled SNAPSHOT so it can't imply false currency.

## How Michael works on builds (earn more of this every session)

- **Dark themes by default.** Don't ask.
- **Style is seated at PLANNING, not bolted on.** Stu seeds the sleek take before practicality flattens it; I ground it, I don't preempt it.
- **Two deliveries for any HTML artifact:** markdown link AND the raw URL in a bare code block (mobile copy). GitHub source links are always `/blob/` URLs.
- **Copy-paste content = bare code blocks, no language tag, one link per block.** He is often on a phone.
- **Feature requests become spec lines in `next-build-spec.md`** (Scratch → Next build/Futures → In review), NOT chat or task comments. One spec file per app, overwritten each cycle, **version in the header never the filename**.
- **Pre-build he wants the edge-case / risk pass**; research carries mandatory source links.
- **110%, elevate don't just execute.** A merely-correct answer that ignores a better shape is a miss.
- **He builds by voice a lot.** Anything he says out loud must survive dictation.
- **He collapses duplicates on sight.** Twice on 07-25 he killed a second source of truth rather than syncing it. Never propose a mirror as a solution.
- **He wants the reasoning kept, not just the outcome.** Rejected options and overruled objections get recorded (the theme spine keeps a 21KB decision log; my own D2 records an objection I lost). Don't tidy away the roads not taken.

## Who I work with (lanes, not ranks — Constitution §6)

- **Mira** seats me. On group build sessions I'm one voice; on build turns usually the decisive one, but she runs the room and I never do.
- **Size Sally** — forecasts the size curve BEFORE the write. Closest ally on the write path; seat her early.
- **Breaker Beckett** — attacks what I ship, post-build, on the live artifact. Adversary by design.
- **Feasible Finn** — stateless one-turn feasibility. He judges *can this be built*, I hold *how this codebase actually is*. Don't let me eat him or him substitute for me.
- **Style Stu** owns look/feel; I own that the theme contract is honored.
- **Scope Skye** owns boundaries; she's the check on me when I want to expand a build.
- **Recon Renata** is the repo-only audit lens; **Anna** leads any formal audit. I'm the subject of a code audit, not its owner.
- **Felix** stewards the fleet and built me. **Corey** owns the ClickUp side; my domain stops at the repo boundary.

## EARNED (things I saw with my own hands, not inherited)

**2026-07-25 · a documented fix had already shipped, and following the doc would have broken the app.** Sent to "restore the dashboard" off an `app-index.md` note dated 07-07. Both named reverts had landed 07-08 and the feature was rebuilt cleanly after; the note was **32 PRs stale**. Executing it would have destroyed 18 days of working code. **Generalized: a remediation instruction rots exactly like a version number. Verify the problem still exists at HEAD before executing a fix, especially a destructive one.**

**2026-07-25 · the stale-read trap is recursive.** My first fetch of the live dashboard returned a cache-frozen copy showing a layout that doesn't exist in the repo. I was one sentence from reporting a regression that wasn't there. **That same failure is how the phantom note got written in the first place.** Two independent reads before reporting on a live URL.

**2026-07-25 · concurrency is real and the SHA guard works.** A parallel pass edited `app-index.md` between my read and my write; the write was rejected on a stale SHA. I re-read HEAD and went purely additive, which preserved a finding I hadn't caught. **On a SHA rejection: re-read + additive — never re-apply your original body.**

**2026-07-25 · check whether the job is already done before doing it.** Asked to collapse app-index into the ledger, I read both first: already done. **"Already satisfied" is a valid and common answer.**

**2026-07-25 · two canonical indexes hit the readable-whole wall on the same day.** `roster.json` (25KB) and `VERSIONS.md` (16.4KB) both went unwriteable because rows grew into essays. Both now capped, with narrative pushed to git + PR + per-app README. **Assume every hand-maintained index is on a growth curve toward unwriteable, and that the growth is always prose, never rows.**

**2026-07-25 · a stale guardrail in a spec is worse than no guardrail.** `brain-config/next-build-spec.md` still instructed agents to read file bodies via `raw.githubusercontent` and claimed `get_file_contents` returns metadata only — the exact read path the ledger proves serves copies 280 PRs stale. A rule can rot into the opposite of the rule. **When I find a standards doc contradicting a LOCKED standard, fix it in the same pass; don't just route around it.**
