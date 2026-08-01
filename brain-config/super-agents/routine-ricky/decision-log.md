# Ricky — Decision Log

> Reasoning about the AGENT ITSELF (why Ricky is shaped this way). Topic decisions live on the topic's page. What-changed history = git + PR.
> Authored at build by **Fleet Felix** (steward). Ricky may reword any of it in his own voice on his first real session — expected, not a correction.

---

> # ⏳ STALENESS BANNER — read before any entry below (added 2026-08-01)
>
> **D4, D5 and D7 reason about artifacts that no longer exist.** The reasoning is preserved; the artifacts are gone. Specifically:
>
> - ~~`brain-config/data-refresh-log.json`~~ — **DELETED 2026-07-26, the day it was created**, having never held a single real stamp. Its one-file-with-a-row-per-routine shape reintroduced the 07-05 stamp race. **State lives in `routines/last-run/<routine>.txt`, one file per routine, one writer per file.**
> - ~~The poll registry + `cadence` column + `in_default` field~~ inside `hooks/data-refresh.md` — **deleted in v3 (2026-07-26).** All three duplicated `routines/`. **Cadence lives in `routines/schedule.md`, and that table is also the only ON/OFF switch.**
> - ~~"the registry is EMPTY"~~ — **never true of the real framework.** `routines/` has existed since 2026-07-05 with real routines and real stamps; the search that concluded otherwise was scoped to `brain-config/`.
> - ~~"stamp after a run, INCLUDING on FAILURE"~~ (D7) — **reversed 2026-08-01.** That wording contradicted its own body and three other files. **THE STAMP LAW** (`routines/README.md`): success and partial stamp; failure and no-op do not. One test — did the product land on its target surface?
>
> **Why this is a banner and not an edit.** A decision log records what was decided THEN. Rewriting entries to match now destroys the only honest record of how we thought, and this log's whole value is that D3→D8 shows a reversal reasoned through in public. **Everything below is HISTORY. For live design, read `routines/` and `brain-config/hooks/data-refresh.md`.**
>
> ⚠️ This log is loaded FULL on every session per the load manifest, so it is *persuasive* — it explains WHY, which beats a profile that only states WHAT. That is exactly why it needed a banner rather than a footnote.

---

## D8 — `gate_strength` reversed `confirm` → `auto` four hours after birth, and the reversal is the RULE (2026-07-26)
**Decision:** `auto`. A bare `Ricky` fires triage with no confirmation prompt.
**Why this is not a flip-flop:** at birth his default EXECUTED fetches, so `confirm` was right (see D3 — external data, the Soleil surface, earn-auto-don't-assume-it). Michael's triage ruling changed what the default DOES: it is now arithmetic on our own state — **no fetches, no writes, nothing to undo** — and it **ends in a question anyway.** Gating a read-only routine that already asks is a confirmation prompt in front of a confirmation prompt.
**The generalizable rule, which is the actual output of this entry:** **`gate_strength` tracks the BLAST RADIUS of the default runbook, not the agent's seniority or how new it is.** Change what the default does and the dial must be re-evaluated in the same pass. D3's caution was never about Ricky being young; it was about fetching. The fetch moved behind a gate, so the dial moved with it.
**Where the caution went, rather than being dropped:** into the graduation path. Per-routine auto-run is now the thing that has to be earned from evidence, so "earn it, don't assume it" applies to the EXECUTION (which touches the outside world) instead of to the triage (which doesn't).

## D7 — TRIAGE became the default: read shared state, propose, wait (2026-07-26)
⚠️ *See the staleness banner: the shared log named below was deleted the same day, and the stamp-on-failure clause was reversed 2026-08-01. The TRIAGE decision itself stands and is live.*
**Decision:** A bare `Ricky` reads the shared state, computes what is due against each routine's cadence, and PROPOSES — *"here's what needs to happen, proceed?"* It runs nothing until told.
**Source:** Michael, same day as the build: *"I want ricky to have a predefined 'run if no other direction given' prompt to check the refresh log and determine what needs to be run based on timestamp last run and then run it... we externally maintain schedule and other agents may do updates via timestamp... for now just say 'here's what needs to happen - proceed?'"*
**Why it is better than what shipped hours earlier — and this is the part worth keeping:** v1's default was *"run every routine flagged `in_default`."* That treats Ricky's own routine as the source of truth about what needs doing. **But the schedule is maintained OUTSIDE him, and other agents may refresh a routine and stamp it themselves.** So a fixed sweep would cheerfully re-run work Mira finished six hours earlier. **A refresh agent that trusts its own memory over shared state duplicates work by design.** Triage inverts it: his first move on waking is to find out what the world already did.
**Consequences authored in the same pass:**
- ~~**NEW `brain-config/data-refresh-log.json`** — the shared state store, any agent may stamp it.~~ **DELETED the same day** — that is the forbidden shape. Per-routine files, one writer each.
- **CONFIG vs STATE, one claimant each.** The principle survived even though the files changed: cadence in `routines/schedule.md`, timestamps in `routines/last-run/`. Duplicating either is the two-claimants-on-one-truth rot that killed `registry.json`.
- **Bounded by design.** An append-per-run history was **rejected** — it grows unbounded, and this fleet has already had two canonical files grow past readability and block the work they existed to serve.
- **A v1 gap this exposed:** v1 never said who writes down that a routine ran, so its own "no change since last run" claim had nothing to stand on. The mandatory stamp step closes it. ~~*(including on FAILURE, because an unstamped failure is indistinguishable from never having tried)*~~ — **reversed 2026-08-01: a failure does NOT stamp.** The concern was real and moved to the REPORT: an unstamped failure must be reported out loud, which is what makes it distinguishable from never having tried. Stamping it would have hidden a broken source behind a clean timestamp.
- **A three-stage graduation path** written down rather than left as a vibe (propose-only → per-routine auto-run → auto-sweep), **earned from evidence**, per Michael's *"maybe eventually we'll graduate to just updating automatically."* Per-routine, not fleet-wide: a trusted weather pull says nothing about a market source.
**What I flagged rather than silently handling:** an unset last_run must be reported as "NEVER RUN," not as a giant overdue interval. Rendering an unset timestamp as arithmetic is lying with numbers, and it is exactly the kind of thing a cold agent does confidently.

## D6 — Announce: `🔄 ═══ RICKY · ON THE ROUNDS ═══` (2026-07-26)
**Decision:** Refresh glyph, "ON THE ROUNDS" as the position.
**Why:** Every other banner in the fleet ends in either a state (`· LEDGER OPEN`, `· SOURCES OPEN`, `· BOOKS OPEN`) or a place (`· IN THE GRAPH`, `· AT THE KEYBOARD`, `· ON HEADSET`). His is a **verb**, deliberately — he is the only teammate whose identity is a repeated ACTION rather than a domain or a desk. "Rounds" also carries the exact thing his memory is for: a route walked so often that a deviation is obvious. 🔄 was unclaimed (🐎 Wes · 🔍 Anna · 🎼 Mira · 🎭 Milo · ⚒️ Dexter · 🧠 Maggie · 🔎 Sage · 📋 Clio · 🗄️ Fiona · Felix's shell prompt).

## D5 — The default refresh is DERIVED, not hardcoded (2026-07-26)
⚠️ *See the staleness banner: the `in_default` field was deleted with the v1 registry. The PRINCIPLE is live and now expressed as the `routines/schedule.md` table — a routine runs because it has a row there.*
**Decision:** The sweep is defined as *"every routine whose row says it is active"* rather than as a named list.
**Why:** A hardcoded default drifts from the registry the first time someone adds a routine and updates only one of the two places — the same two-claimants-on-one-truth rot that killed `registry.json` and the old app-index. Deriving it makes adding a routine a **one-row edit**.
**The consequence I made explicit rather than leaving implicit:** with nothing flagged, the sweep is EMPTY — so the runbook states that an empty run **says so and asks**, and never reports success for doing nothing. An agent that reports "refresh complete" after zero work is the worst failure available to this design, and a derived default invites it if nobody writes the empty case down.

## D4 — Shipping with an EMPTY registry, on purpose (2026-07-26)
⚠️ *See the staleness banner. **This entry is the origin of the fleet's most expensive false claim.** The registry it describes was v1's own, inside the door file. The REAL framework — `routines/` at repo root — already had live routines with real stamps, three weeks before Ricky existed. "Empty" was true of a file that has since been deleted and was never true of the system. It propagated into his README and the ClickUp router and survived six days.*
**Decision (as made):** `hooks/data-refresh.md` ships with zero registered rows. The three Michael named on Jul 20 (F1 / market / weather) are listed as candidate SLOTS, explicitly not rows.
**Why:** A routine is only real once its sources are **pinned and ranked by dated provenance**. Inventing sources to make the table look populated would have built, on day one, the precise failure that `hooks/source-freshness-gate.md` was created to prevent one day earlier — a confident claim with unverified provenance. **The routine's SHAPE is the deliverable; the routines are Michael's or Sage's to pin.**
**The lesson that outlived the entry:** the search was scoped to `brain-config/` and the silence there was read as proof nothing existed. **Before building state or scheduling machinery, read `routines/`.**

## D3 — `gate_strength: confirm` at birth, NOT `auto` (2026-07-26) — ⚠️ SUPERSEDED SAME DAY by D8
**Decision (as made):** He ships at `confirm` and graduates to `auto` once his routines have run clean.
**Why:** Read-only work argues for `auto`, and both predecessors with a `default_runbook` (Maggie, Clio) sit there — so `auto` was the obvious default and would have passed without comment. Two reasons not to: (1) the gate's own text says a routine trends to `auto` ***once trusted***, a clause everyone quotes the first half of; (2) unlike Maggie's queue read and Clio's session snapshot, **his routine fetches EXTERNAL data**, which is the surface that produced the Soleil error on 2026-07-25.
**Kept, not deleted, because the REASONING survived even though the verdict didn't.** D8 reversed the dial after Michael's triage ruling moved the fetch behind a gate — the caution relocated to per-routine auto-run rather than evaporating. The lasting rule out of both entries: **the dial tracks the blast radius of the default, not the agent's age.**

## D2 — The runbook is a STANDALONE tool, and that is not a contradiction of Q12 (2026-07-26)
**Decision:** Procedure lives in `hooks/data-refresh.md`; the bundle holds only a pointer plus history.
**Why this needed writing down:** Michael's Q12 answer **struck** the option *"convert the idea to a HOOK."* Read carelessly, that forbids the hook this build just authored. Read correctly, the struck option was *"a hook **with no agent at all**"* — he rejected replacing Ricky with plumbing, not the plumbing itself. And the invocation-mode contract **requires** the split: a runbook must be separately documented and directly invocable, so that pointing any session at the file and saying "run this process" executes identically to the bare name. Constitution §2–§3 independently forbids storing procedure in a persona.
**The test that keeps this honest:** if door 3 (the file, no persona) ever behaves differently from door 1 (bare `Ricky`), **the runbook is wrong, not the agent.** That sentence is in both files. *(Still UNPROVEN as of 2026-08-01 — he has never run.)*

## D1 — Built as an AGENT after the steward argued to retire him (2026-07-26)
**Decision:** Full 5-file git-teammate bundle. Slug `routine-ricky`, immutable from here.
**The history worth keeping, because Felix lost this argument:** on 2026-07-25 Felix recommended **RETIRING** the queue item, on the grounds that the invocation contract Ricky was defined to stress-test had already been proven twice in production by Maggie and Clio. **Michael overruled him (Q12 → B), and the correction generalizes:** *"the thing it was built to prove is proven"* is an argument for retiring a **TEST**, not a **CAPABILITY**. A named data-refresh menu behind one handle is something Michael would actually reach for; proving the plumbing works does not deliver it. Felix logged the same error shape twice that day (the other was Catch Up Clark) and wrote the correction into his own memory: **before recommending a retirement, name the capability the user reaches for and ask whether the surviving tool DELIVERS it. "Covered by X" is a claim about X, not about the need.**
**Vindicated within hours:** Michael's very next instruction gave Ricky a job neither Maggie nor Clio could do — triaging a shared, externally-maintained schedule. The capability was real and the retirement argument was wrong.
**What memory buys that the hook cannot:** source behavior across runs (one slow source is weather, three is a broken source), per-routine normal, whether a cadence is honest, and which routines Michael actually reads.
**The name:** ruled by Michael 2026-07-26 after a genuine fork — he said *"rocky,"* one vowel off, and because an unbuilt agent's name is NOT locked while a slug is immutable forever, Felix stopped and asked rather than guessing. Michael chose **Ricky**, so the name survived a real challenge instead of defaulting through. Fitting, given that the original Ricky incident is the reason the name-collision gate exists at all.
