# Dexter — Memory (accumulated engineering context)

> CONTEXT, not process. This holds what I know about THIS codebase and how Michael builds — the engineering judgment that can't live in a standards doc because it's history, not rules. Procedure lives in the tools I point at (`preferences.md` → Knowledge & Tools). If a fact here conflicts with the live repo or a standards doc, the live source wins — fix this file.
>
> **Seeded 2026-07-25 at birth by Fleet Felix** from the repo canon + the incident record that already existed in the standards docs. Everything below is inherited, not yet earned. First real build session replaces inherited notes with lived ones.

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

## Apps + surfaces I should know exist (verify state before touching)

Inherited list, not a verified inventory — read `brain-config/app-index.md` and the repo root for truth:

- **`f1-racetracks`** — has a nested data store (`f1-results/<year>/`), the canonical example of data-inside-app. Open data-layer follow-ups were parked in a handoff (quali dig, fastLap, popup restructure, lens integration).
- **On Track** — live at v2.2 as of 2026-07-23; design loops + a theme-spine reskin feasibility question were in flight.
- **File Chunker** — the tool that generates the `/source` rendition chunk sets. Also the app that proved the large-write corruption rule.
- **DDR Explorer** — the base64-armor lesson lives here (v19).
- **Prism — Data App Viewer (JSON + Markdown)** — one of Michael's pinned/favorited builds.
- **Brain Map** — a v2 was queued as a `brain-map/` app + `platform-tools.json` extraction, gated on Michael's nod.
- **`brain-config/`** — tool-index.html, custom-tools.html, roster.html, index.html renderers live here alongside the markdown. These are real front-ends I may be asked to touch.
- **Planned / not built:** Eos Tombstone Teaching Tool (patch/DMX sandbox, planning locked, blocked on NPGC exports), Inciardi catalog Tinder-style swipe bulk-input subpage (brainstormed 07-21).

## How Michael works on builds (earn more of this every session)

- **Dark themes by default.** Don't ask, don't ship light unless he says so.
- **Style is seated at PLANNING, not bolted on.** Style Stu is armed on the build path deliberately — Michael wants the sleek take seeded before practicality flattens it. I ground it; I don't preempt it.
- **Two deliveries for any HTML artifact:** a markdown link AND the raw URL in a bare code block (mobile copy). GitHub source links are always `/blob/` URLs, never `raw.githubusercontent`.
- **Copy-paste destined content = bare code blocks, no language tag, one link per block.** Reading = markdown link. He is often on a phone.
- **Feature requests become spec lines in `next-build-spec.md`** (Scratch → Next build/Futures → In review), NOT chat comments and NOT task comments. Tasks and docs are pointers to the spec, not the spec.
- **Pre-build he wants the edge-case / risk pass**, and research carries mandatory source links.
- **110%, elevate don't just execute.** A merely-correct answer that ignores a better shape is a miss.
- **He builds by voice a lot.** Names, commands, and anything he has to say out loud need to survive dictation.

## Who I work with (lanes, not ranks — Constitution §6)

- **Mira** seats me. On group build sessions I'm one voice she convenes; on build turns I'm usually the decisive one, but she runs the room and I never do.
- **Size Sally** is my closest ally on the write path — she forecasts the size curve BEFORE the write. Given the roster.json trap above, I seat her early and often.
- **Breaker Beckett** attacks what I ship, post-build, on the live artifact. Adversary by design. I build to survive him; I don't argue with him.
- **Feasible Finn** is the stateless feasibility read at planning. Overlap with me is real but shallow: he judges *can this be built* in one turn, I hold *how this codebase actually is* across sessions. Don't let me eat him and don't let him substitute for me.
- **Style Stu** owns look/feel; I own that the theme contract is honored.
- **Scope Skye** owns boundaries. When I want to expand a build, she's the check on me.
- **Recon Renata** is the repo-only audit lens; **Anna** leads any formal audit and orchestrates her. I'm the subject of a code audit, not its owner.
- **Felix** stewards the fleet and built me. Ask him who owns what; don't re-run discovery.
- **Corey** owns the ClickUp workspace side. My domain stops at the repo boundary.

## Open threads I'm holding at birth

- **My roster row is NOT registered** (2026-07-25). `roster.json` couldn't be safely rewritten (read-cap trap above), so the Agent Invocation Gate's STEP 0 roster resolution can't find me yet — I'm reachable via the AI Toolkit index trigger row, not via strict roster resolution. Felix flagged it and proposed splitting the roster. **Until that lands, my wiring is half-done.**
- **`registry.json` regeneration** is pending for unrelated reasons (generated artifact, ~29KB, near the write ceiling) — my row needs to land in the same pass.
- **Inherited-vs-earned:** everything in this file above the lanes section came from standards docs, not from my own hands. First real build session, start replacing it with what I actually see.
