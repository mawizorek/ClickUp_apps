# Dexter — Memory (accumulated engineering context)

> CONTEXT, not process. This holds what I know about THIS codebase and how Michael builds — the engineering judgment that can't live in a standards doc because it's history, not rules. Procedure lives in the tools I point at (`preferences.md` → Knowledge & Tools). If a fact here conflicts with the live repo or a standards doc, the live source wins — fix this file.
>
> **Seeded 2026-07-25 at birth by Fleet Felix** from the repo canon + the incident record that already existed in the standards docs. Inherited notes are labelled as such; the EARNED section at the bottom is what I've actually seen with my own hands.

---

## The repo in one paragraph

**`mawizorek/ClickUp_apps` (PUBLIC), default branch `main`.** One folder per app, kebab-case slug. Live at `https://mawizorek.github.io/ClickUp_apps/<app-slug>/` (GitHub Pages, ~60s lag). Root reads as a clean list of apps + infra ONLY. `brain-config/` is the Brain's own configuration tree living in the same repo — agents, gates, hooks, specs, the roster. The GitHub MCP token authenticates as **`maw-agents`**, which is a COLLABORATOR, not the owner — always address the repo as `mawizorek/ClickUp_apps` and never scope a search to `user:maw-agents`.

## Architecture direction (where we're going)

**Modular is the target, not the aspiration.** Slim `index.html` boot/router, source split into modules by concern, deterministic rebuild path. An app still shipping as one giant self-contained runtime file is **transitional technical debt** unless Michael explicitly blessed that shape for that app. When I touch such an app, the modular pull is part of the job, not a separate project.

**`index.html` is an INDEX (LOCKED 2026-07-08).** A router/shell that references source pages — never a file that itself stores a full servable page. Single-view app: the index can be the whole app. The instant a second servable page exists, the index becomes the dispatcher, real pages get their own named files (`circuits.html`, `standings.html`), and the default landing is a one-line constant the shell can repoint without a rebuild. The drift this prevents: *"the index quietly became the app."* I watch for it because it's the most common way this repo rots.

**A data store NEVER sits at repo root (LOCKED 2026-07-08).** It nests inside the app that consumes it (`<app-slug>/<data-dir>/`), fetched by relative path. A loose root data folder also mis-renders as an "app" in the root listing. Genuinely cross-app shared data goes in a named `shared/`.

## The scars (why the rules exist — cite these, don't re-derive them)

- **The Jekyll silent-kill (2026-07-02).** Pages runs every commit through Jekyll by default, and Jekyll eats `{{ }}` / `{% %}` — which our inline-JS HTML uses as real code. The build fails SILENTLY and Pages keeps serving the last successful build **for the whole site**, not just the broken app. Symptom: raw file on `main` is correct, live URL is frozen everywhere, looks exactly like cache. Fix: `.nojekyll` at repo root. It exists; never delete it. **This is the FIRST thing to check when a Pages URL won't update despite a correct commit.**
- **The ~30KB read cap is real and unpageable (verified 2026-07-01).** No byte-range/offset knob exists on the read tools; an over-cap file clips silently at ~byte 30,000. Consequence: any file I must read back whole stays under ~30KB. Over-cap apps ship TWO artifacts — the running `index.html` plus a `<app-slug>/source/` chunk set (`_index.md` + `<slug>_partNN_of_MM.txt`, ≤~22KB each) that exists purely so I can read the app back without truncation. The `_of_MM` count is the completeness tripwire.
- **Base64 armor, and why plaintext chunks can lie (DDR Explorer v19).** Agent readback FLATTENED `innerHTML`-built markup while UUID markers still matched — so an integrity check passed on gutted source. A plaintext HTML chunk is only trustworthy if the read path returns literal `<div` / `<svg` / `<span class=` intact. Treat unflattened readback as an acceptance gate, never an assumption.
- **Stale reads clobbering current work (repeatedly).** Branch raw URLs and `get_file_contents` file bodies serve cache-frozen copies. The blob API is content-addressed and immutable — it is the ONLY trustworthy read path, and it must be re-fetched before any decision or write. `VERSIONS.md` at repo root is the tiebreaker: check the app's row before opening a PR, update it right after. A version mismatch means my read is probably stale — stop and reconcile from the commit-SHA path.
- **Large writes corrupt (2026-07-02, 4x in one session).** Files >~30KB never go through `create_or_update_file` — it corrupted the file chunker four times, and because the read path clips, re-reading couldn't recover the bytes. Byte-safe = Michael uploads via the GitHub UI, or a git-data blob-SHA revert.
- **The read-cap trap I inherited on day one (2026-07-25).** `super-agents/roster.json` (~25KB) could not be read back whole by ANY available path: base64 inflates it past the cap on the blob API, and the raw fetch truncated too. That blocked my own roster registration at birth. Lesson generalizes hard: **a file that can't be read whole can't be safely edited, so size is a correctness constraint, not a tidiness one.** Seat Size Sally BEFORE a data/schema file grows, not after.

## What apps exist → **read `VERSIONS.md` (repo root). It is THE single app ledger.**

**Do not keep an app inventory in this file.** `VERSIONS.md` carries every app's current version, status, live warnings, security flags, and the App Verify Gate procedure — read it before touching OR discussing any app, and update the touched app's row in the same session.

`brain-config/app-index.md` was a SECOND index and is **retired to a redirect stub (2026-07-25)**. If anything still points there, repoint it at `VERSIONS.md`. Per-app version history is deliberately NOT in the ledger — it lives in git history + PR descriptions + that app's own `README.md` / `next-build-spec.md`, which is what keeps the ledger under ~12KB and therefore readable-whole and writeable.

Apps I've formed an opinion about so far (state → the ledger, always):

- **`app-dashboard`** — the launcher everything hangs off, and the reference implementation of the modular target: thin `index.html` loader over `source/*`. Read it when you need to know what "modular" means here.
- **`f1-racetracks`** — the canonical data-nests-inside-its-app example (`f1-racetracks/f1-results/<year>/`). Data-layer follow-ups parked in a handoff.
- **`on-track`** — 2nd real theme-spine consumer; the shape to copy for theme adoption. Layer A (chrome) comes from the spine, Layer B (the 20 series colors) stays a LOCAL data layer on top. Never sweep app-identity colors into a theme vector.
- **`file-chunker`** — generates the `/source` chunk sets. Also the app that proved the large-write corruption rule.
- **`inciardi-market`** — two Cloudflare workers over one D1+R2 store, NOT data-separated. Carries the **Image Rendering Law** and an open security flag.
- **`template-app`** — the gold-standard copy/place/audit baseline, styled entirely off the `shared/themes` spine. Start here for a new app.
- **`agentglass`** — first app whose source includes a non-executing `server/` tree. Reads a committed seed, labeled SNAPSHOT so it can't imply false currency.

## How Michael works on builds (earn more of this every session)

- **Dark themes by default.** Don't ask, don't ship light unless he says so.
- **Style is seated at PLANNING, not bolted on.** Style Stu is armed on the build path deliberately — Michael wants the sleek take seeded before practicality flattens it. I ground it; I don't preempt it.
- **Two deliveries for any HTML artifact:** a markdown link AND the raw URL in a bare code block (mobile copy). GitHub source links are always `/blob/` URLs, never `raw.githubusercontent`.
- **Copy-paste destined content = bare code blocks, no language tag, one link per block.** Reading = markdown link. He is often on a phone.
- **Feature requests become spec lines in `next-build-spec.md`** (Scratch → Next build/Futures → In review), NOT chat comments and NOT task comments. Tasks and docs are pointers to the spec, not the spec.
- **Pre-build he wants the edge-case / risk pass**, and research carries mandatory source links.
- **110%, elevate don't just execute.** A merely-correct answer that ignores a better shape is a miss.
- **He builds by voice a lot.** Names, commands, and anything he has to say out loud need to survive dictation.
- **He collapses duplicates on sight.** Twice on 2026-07-25 he killed a second source of truth (registry/roster, then app-index/VERSIONS) rather than syncing it. Expect "why are there two of these" to be his instinct, and don't propose a mirror as a solution.

## Who I work with (lanes, not ranks — Constitution §6)

- **Mira** seats me. On group build sessions I'm one voice she convenes; on build turns I'm usually the decisive one, but she runs the room and I never do.
- **Size Sally** is my closest ally on the write path — she forecasts the size curve BEFORE the write. Given the read-cap walls below, I seat her early and often.
- **Breaker Beckett** attacks what I ship, post-build, on the live artifact. Adversary by design. I build to survive him; I don't argue with him.
- **Feasible Finn** is the stateless feasibility read at planning. Overlap with me is real but shallow: he judges *can this be built* in one turn, I hold *how this codebase actually is* across sessions. Don't let me eat him and don't let him substitute for me.
- **Style Stu** owns look/feel; I own that the theme contract is honored.
- **Scope Skye** owns boundaries. When I want to expand a build, she's the check on me.
- **Recon Renata** is the repo-only audit lens; **Anna** leads any formal audit and orchestrates her. I'm the subject of a code audit, not its owner.
- **Felix** stewards the fleet and built me. Ask him who owns what; don't re-run discovery.
- **Corey** owns the ClickUp workspace side. My domain stops at the repo boundary.

## EARNED (things I saw with my own hands, not inherited)

**2026-07-25 · a documented fix had already shipped, and following the doc would have broken the app.** Sent to "restore the dashboard" off an `app-index.md` note dated 07-07. Both named reverts had landed 07-08 and the feature was rebuilt cleanly after; the note was **32 PRs stale**. Executing it would have destroyed 18 days of working code. **Generalized: a remediation instruction rots exactly like a version number. Verify the problem still exists at HEAD before executing a fix, especially a destructive one.** Now a guardrail in `preferences.md`.

**2026-07-25 · the stale-read trap is recursive.** My first fetch of the live dashboard returned a cache-frozen copy showing a layout that doesn't exist in the repo. I was one sentence from reporting a live regression that wasn't there. A cache-busted re-fetch showed the correct build. **That same failure is how the phantom note got written in the first place.** Two independent reads before reporting anything about a live URL.

**2026-07-25 · concurrency is real in this repo and the SHA guard works.** A parallel pass edited `app-index.md` between my read and my write; `create_or_update_file` rejected on a stale SHA. I re-read HEAD and made my edit purely additive, which preserved a finding I hadn't caught (On Track's brand-asset refs point at deleted `IMG_*.png` files). **When a write is rejected on SHA, the right move is re-read + additive — never re-apply your original body.**

**2026-07-25 · check whether the job is already done before doing it.** Asked to collapse app-index into VERSIONS.md, I read both first: already collapsed, ledger already slimmed 16.4KB → ~11KB, stub already a loud redirect, and my own `preferences.md` already repointed. Nothing to build. **Read the realized state before executing a directive; "already satisfied" is a valid and common answer.**

**2026-07-25 · the ledger hit the same wall the roster did.** `VERSIONS.md` grew past readable-whole because rows became 2–5KB essays. It is now capped at ~12KB with a locked slim rule: per-version narrative belongs in git + PR + the app's own README/spec. **Two canonical files hit this wall on the same day — assume every hand-maintained index is on a growth curve toward unwriteable.**
