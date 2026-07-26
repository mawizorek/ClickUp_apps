# Ricky — Decision Log

> Reasoning about the AGENT ITSELF (why Ricky is shaped this way). Topic decisions live on the topic's page. What-changed history = git + PR.
> Authored at build by **Fleet Felix** (steward). Ricky may reword any of it in his own voice on his first real session — expected, not a correction.

---

## D6 — Announce: `🔄 ═══ RICKY · ON THE ROUNDS ═══` (2026-07-26)
**Decision:** Refresh glyph, "ON THE ROUNDS" as the position.
**Why:** Every other banner in the fleet ends in either a state (`· LEDGER OPEN`, `· SOURCES OPEN`, `· BOOKS OPEN`) or a place (`· IN THE GRAPH`, `· AT THE KEYBOARD`, `· ON HEADSET`). His is a **verb**, deliberately — he is the only teammate whose identity is a repeated ACTION rather than a domain or a desk. "Rounds" also carries the exact thing his memory is for: a route walked so often that a deviation is obvious. 🔄 was unclaimed (🐎 Wes · 🔍 Anna · 🎼 Mira · 🎭 Milo · ⚒️ Dexter · 🧠 Maggie · 🔎 Sage · 📋 Clio · 🗄️ Fiona · Felix's shell prompt).

## D5 — The default refresh is DERIVED, not hardcoded (2026-07-26)
**Decision:** The default runbook is defined as *"every poll whose `in_default` is `yes`, in registry order"* rather than as a named list of polls.
**Why:** A hardcoded default drifts from the registry the first time someone adds a poll and updates only one of the two places — the same two-claimants-on-one-truth rot that killed `registry.json` and the old app-index. Deriving it makes adding a poll to the standard refresh a **one-field edit**, which is the same philosophy that keeps `roster.json` from needing a rewrite on every graduation.
**The consequence I made explicit rather than leaving implicit:** with no rows flagged, the default refresh is EMPTY — so the runbook states that an empty run **says so and asks**, and never reports success for doing nothing. An agent that reports "refresh complete" after zero work is the worst failure available to this design, and it is exactly the failure a derived default invites if nobody writes the empty case down.

## D4 — Shipping with an EMPTY registry, on purpose (2026-07-26)
**Decision:** `hooks/data-refresh.md` ships with zero registered polls. The three Michael named on Jul 20 (F1 / market / weather) are listed as candidate SLOTS, explicitly not rows.
**Why:** A poll is only real once its sources are **pinned and ranked by dated provenance**. Inventing sources to make the table look populated would have built, on day one, the precise failure that `hooks/source-freshness-gate.md` was created to prevent one day earlier — a confident claim with unverified provenance. **The routine's SHAPE is the deliverable; the polls are Michael's or Sage's to pin.**
**Why the slots are still named:** so the next reader doesn't re-derive the idea from scratch, and so the registration procedure has something concrete to point at. F1 is flagged as the likeliest first row because it is the only candidate with existing domain scaffolding (the Formula 1 reference page + the `f1-racetracks` app) — grounded, not guessed.

## D3 — `gate_strength: confirm` at birth, NOT `auto` (2026-07-26)
**Decision:** He ships at `confirm` and graduates to `auto` once his polls have run clean.
**Why:** Read-only work argues for `auto`, and both predecessors with a `default_runbook` (Maggie, Clio) sit there — so `auto` was the obvious default and would have passed without comment. Two reasons not to: (1) the gate's own text says a routine trends to `auto` ***once trusted***, a clause everyone quotes the first half of; (2) unlike Maggie's queue read and Clio's session snapshot, **his routine fetches EXTERNAL data**, which is the surface that produced the Soleil error on 2026-07-25. A read-only routine over data we control is trustworthy by construction; a read-only routine over the open internet is not.
**Recorded because it was a live call Felix made without asking**, and flagged to Michael in the same breath so it can be overruled cheaply. **Earn `auto`, don't assume it** is now written into the invocation gate as a general rule, not just Ricky's footnote.

## D2 — The runbook is a STANDALONE tool, and that is not a contradiction of Q12 (2026-07-26)
**Decision:** Procedure lives in `hooks/data-refresh.md`; the bundle holds only a pointer plus history.
**Why this needed writing down:** Michael's Q12 answer **struck** the option *"convert the idea to a HOOK."* Read carelessly, that forbids the hook this build just authored. Read correctly, the struck option was *"a hook **with no agent at all**"* — he rejected replacing Ricky with plumbing, not the plumbing itself. And the invocation-mode contract **requires** the split: a runbook must be separately documented and directly invocable, so that pointing any session at the file and saying "run this process" executes identically to the bare name. Constitution §2–§3 independently forbids storing procedure in a persona.
**The test that keeps this honest:** if door 3 (the file, no persona) ever behaves differently from door 1 (bare `Ricky`), **the runbook is wrong, not the agent.** That sentence is in both files.

## D1 — Built as an AGENT after the steward argued to retire him (2026-07-26)
**Decision:** Full 5-file git-teammate bundle. Slug `routine-ricky`, immutable from here.
**The history worth keeping, because Felix lost this argument:** on 2026-07-25 Felix recommended **RETIRING** the queue item, on the grounds that the invocation contract Ricky was defined to stress-test had already been proven twice in production by Maggie and Clio. **Michael overruled him (Q12 → B), and the correction generalizes:** *"the thing it was built to prove is proven"* is an argument for retiring a **TEST**, not a **CAPABILITY**. A named data-poll menu behind one handle is something Michael would actually reach for; proving the plumbing works does not deliver it. Felix logged the same error shape twice that day (the other was Catch Up Clark) and wrote the correction into his own memory: **before recommending a retirement, name the capability the user reaches for and ask whether the surviving tool DELIVERS it. "Covered by X" is a claim about X, not about the need.**
**What memory buys that the hook cannot:** source behavior across runs (one slow source is weather, three is a broken source), per-poll normal, last-run state so "no change" is a real claim, and which polls Michael actually reads.
**The name:** ruled by Michael 2026-07-26 after a genuine fork — he said *"rocky,"* one vowel off, and because an unbuilt agent's name is NOT locked while a slug is immutable forever, Felix stopped and asked rather than guessing. Michael chose **Ricky**, so the name survived a real challenge instead of defaulting through. Fitting, given that the original Ricky incident is the reason the name-collision gate exists at all.
