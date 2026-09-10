# Job Market Evaluation Config

> **What this is:** Michael's declared preferences for evaluating job-market sweep results.
> Ricky sweeps blind from `job-market-roles.json`. Corso evaluates against THIS file.
> A cold agent reads this to understand what makes a listing interesting vs noise.
>
> **What this is NOT:** procedure (that's the hook at `brain-config/hooks/job-routine-response.md`),
> search config (that's `job-market-roles.json`), or earned intelligence (that's Corso's `memory.md`).
>
> **When they conflict:** evaluation.md is the STATED baseline. Corso's memory.md is the earned
> overlay. When they diverge, Corso names the tension rather than silently picking one.

---

## Career Thesis

Moving FROM: Production Manager at a university program (UR International Theatre Program, Rochester NY).
Moving TOWARD: Director of Production at a professional institution with scope, pay, and trajectory.

The market has proven the gap: PM-level comp clusters sub-$90K; DoP-level unlocks $100-170K+;
the aspirational tier (Lincoln Center, Apollo) sits at $150-250K. The title change is the bridge,
not more years at PM. The search is for the stepping-stone into that next band.

**Non-academic is a strong preference, not a hard filter.** The primary lane is professional
theatre, live entertainment, performing arts venue operations, and adjacent (event production,
touring infrastructure, cultural institutions). However: educational and institutional theatre
is credible work, and a non-academic position at a university or institution is not automatically
disqualifying if the role itself is compelling. "Man's gotta do what a man's gotta do" energy:
the filter exists to bias toward professional-track progression, not to wall off credible
opportunities.

> ⚠ **The thesis is the PRIMARY arc, not the only thing worth surfacing (clarified 2026-09-10).**
> Two things now sit deliberately outside it and must not be filtered out for failing it:
> the **niche-craft exception** (see ⭐ below) and the **accessibility tier** (see Flexibility).
> A pass that only reports thesis-advancing roles is under-reporting.

---

## Soft Filters (weighted, not hard constraints)

### Geography

- **Anywhere is live.** Relocation is on the table.
- NYC concentrates the upward moves (3x denser than any other market for DoP-level roles). Weight it.
- UK has opened as a real second market (ENO, Kit Kat Club). International is not disqualifying.
- Rochester is home base but not a constraint. Don't downweight non-Rochester.
- 🏠 **NEW 2026-09-10 — home-accessible work is now HIGHLIGHTED, not merely allowed.** Within ~90
  miles of Rochester (which reaches Syracuse and Buffalo) a role is *immediately actionable*: no
  relocation, no notice, no household disruption. That is a real advantage and the inventory had
  no way to express it. **This does not downweight anywhere else** — it adds a spotlight, it does
  not move the search home. Radius is defined once, in `job-market-roles.json` → `global.home_base`.
- ⚠ **Honest note on the local market:** measured 2026-09-10 against Geva Theatre's own careers
  page — Rochester's flagship LORT B house had **nothing at or near Michael's level.** Its live
  postings were a costume First Hand, a Donor Engagement Officer, run crew at $16.50/hr and
  show-by-show overhire. **Do not let the new home spotlight imply local depth that does not
  exist.** Near-home finds will skew to availability work, and that is the honest shape.

### Compensation

- **Floor (soft):** $90K is the benchmark for a primary career-progression move. Below that is
  usually lateral or backward. **But this is not a wall.** Below-floor is acceptable for:
  - A non-academic position that's genuinely cool or at a credible institution
  - Less responsibility but more/different experience (stepping sideways to step up later)
  - Touring work with appropriate credit (e.g., touring head electrician with proper title)
  - Prestige access that justifies the short-term trade
  - 🏠 **Home-accessible availability work — no floor at all.** Michael, 2026-09-02, on SM rates:
    *"good floor for sm jobs but open to far less esp if it's nearby."* Proximity substitutes for
    rate. A $16.50/hr overhire call 20 minutes away is a different proposition from the same rate
    three states over, and the comp filter must not treat them alike.
- **Target band:** $100-150K for the immediate next step.
- **Aspirational band:** $150K+ (Director-level, institution-scale).
- Weekly rates (SM/contract): convert and compare. $1,500/wk annualizes to ~$78K; needs to
  offer prestige access or unique experience that justifies being below the benchmark.

### Role Level

- **Primary target:** Director of Production, VP Production, Head of Production (the bridge titles).
- **Current level (Production Manager):** strong fit, obvious match.
- **Associate/Assistant PM: NOT automatically below.** At the right institution or for the right
  scope, an Associate or Assistant PM is still in play. The title alone does not disqualify.
- **TD roles:** Michael acknowledges a skill gap here, but the filter surfaces interesting things.
  Shop management is a viable adjacent lane he could fill. TD with management scope: note it,
  don't auto-skip.
- **SM roles: currently side work, not the primary path.** Broadway/West End SM is aspirational,
  not where Michael is scoped yet. He needs more scaled credible work before that's realistic
  as a primary move. **However:** ASM or PA on something cool is fine as availability work.
  Don't surface SM as a career-progression play; surface it as a network/experience side gig
  when the project is compelling.
- **Administration, Creative Assistant, and adjacent office roles:** a potential lane under
  consideration. Not yet active in the search config but may be added. Flag interesting finds
  if they surface naturally.
- 🏠 **Overhire and show-by-show crew: EXCLUDED far away, QUALIFYING near home** (2026-09-10).
  See the Noise-signals carve-out below and `global.exclude_overhire` in the roles config.

### Flexibility

- ⚡ **REMOTE AND HYBRID ARE NOW A HIGHLIGHT TIER** (Michael, 2026-09-10: *"i want to begin
  focusing more strongly on a highlight of remote or immediately accessible jobs too"*).
  <s>Remote and hybrid are worth noting but not required.</s> **Superseded.** Still not *required*
  — nothing is excluded for being onsite — but remote, hybrid, home-accessible and
  immediate-start roles now get called out explicitly in every pass summary under ⚡ **ACCESSIBLE**.
  Four tags, defined in `global.highlight_tiers`: `remote` · `hybrid` · `home` · `immediate`.
- 🔴 **Read the diagnosis before trying to satisfy this, because the obvious fix is wrong.**
  `include_remote` was **already true** and always had been. Remote work never appeared because
  (a) not one keyword in any lane asks for it, and (b) every board in `job-market-sources.md` is
  venue-bound by nature. **Measured: of 236 live rows on 2026-09-10, zero were remote or hybrid.**
  This is a sources-and-keywords problem, not a filter problem, and it needs Scout Sage to find
  new sources before it can be executed properly. Full directive: `global.remote_sweep`.
- ⚠ **`remote` and `immediate` are DIFFERENT axes and must never be collapsed.** One is *where*,
  the other is *how fast to work*. A rolling-applications overhire call is `immediate` and not
  remote; a distributed CAD contract is `remote` and might have a six-week hiring process.
- **Never infer a tag from a job title.** If the posting does not say remote, the row is not remote.
- Contract vs staff: staff preferred for progression; contract acceptable for prestige access
  or cool side work.
- Part-time: only if it's an add-on to something else, not a primary.

### Timeline

- No hard deadline. This is a strategic search, not a desperation exit.
- The right stepping-stone could take 3-12 months to materialize. Patience over panic.
- ⚡ **But `immediate`-tagged work is exempt from patience.** Rolling-application and
  start-now roles are availability income and network access; they do not compete with the
  strategic search and should not be paced against it.

---

## Evaluation Signals (what makes Corso lean forward)

### Strong positive signals

- Title is Director of Production or equivalent (the bridge title)
- Compensation in or above the target band
- Institution has reputation, scale, or network value (Broadway, Off-Broadway, LORT, major regional, West End)
- Role carries budget authority, team leadership, or multi-venue scope
- Listing has been open 30+ days (the org is stuck; leverage exists)
- Organization is known for promoting internal talent
- ⭐ **Rare-craft roles Michael is already tooled for** — see the niche-craft exception below

### Moderate positive signals

- NYC metro location (path density)
- New construction or venue expansion (growing scope)
- Role reports directly to ED/AD (proximity to decisions)
- Cross-department coordination in the description (strategic, not just execution)
- Educational/institutional theatre with non-academic reporting structure
- Shop management or facilities leadership at a producing org
- ⚡ Remote, hybrid, home-accessible, or immediate-start (2026-09-10)

### Noise signals (skip or note briefly)

- Pay below $70K with no prestige, experience, or institution justification
- Pure academic faculty position (teaching-focused, tenure-track)
- Manufacturing, logistics, industrial (wrong industry, should be caught by roles.json excludes)
- "Production Manager" at a sub-50-seat venue with no budget
- <s>Overhire or temp cover under 3 months</s> — 🏠 **AMENDED 2026-09-10. Still noise when it
  requires travel or relocation. NOT noise within ~90 miles of Rochester**, where it is
  availability income at zero relocation cost. Michael: *"i'm actually more interested in the
  geva per show overhire thing."* ⚠ **The trigger is worth remembering as a class of failure:**
  Geva's show-by-show overhire was structurally invisible to the sweep because `exclude_overhire`
  was a flat `true`, and Michael only saw it because he already knew about it from a July 2025
  task. **A filter that hides a thing Michael wants is indistinguishable from that thing not
  existing.**

### The prestige exception

- A listing that fails on comp but passes on institution gets noted as a network-access play,
  not a career-progression play. Worth tracking for what it opens, not what it pays.
- An ASM/PA gig at a cool project: note it as side work/availability play, not career arc.

### ⭐ The niche-craft exception (NEW 2026-09-10)

**A rare, technically-deep role Michael is already tooled for is worth surfacing loudly even
when it does nothing for the thesis.**

Established by the **Upstaging Rigging Designer** find (CAD draftsperson + project coordinator,
$60-90K, Vectorworks + Braceworks + 50% coordination). Michael, unprompted: *"that rigging job
is WILD and sounds amazing. i kinda want to apply"* and *"that's super niche and cool."*

What makes this class distinct — use these as the test, not the vibe:

1. **The tool list is already his.** Vectorworks and Lightwright named as requirements, not as
   things to learn. The qualification is existing craft, not a stretch.
2. **Genuinely rare.** Entertainment rigging design is a small discipline; few people hold both
   the CAD side and the live-production side. Scarcity is the value.
3. **Technically deep, not managerially broad.** This is the opposite of the DoP arc and that is
   *why* it appeals — do not try to reconcile the two.
4. **It is a fork, not a rung.** Say so plainly when surfacing one. Michael can choose a fork; he
   cannot choose one he was never shown.

⚠ **This partially answers a cold-start gap that had been open since the file was written**
(*"what 'cool' means to Michael"*). It is one data point, not a theory. Do not over-fit: the
answer so far is *rare + technically deep + already-tooled*, and the next data point may widen it.

---

## What Corso does NOT know yet (cold-start gaps)

These are things this file CANNOT pre-seed because they require interaction:

- What specific organizations excite Michael vs which are "meh" despite fitting the profile
- The relative weight of money vs scope vs geography vs culture (we know all four matter;
  we don't yet know the ranking)
- The real constraints around timing, dual income, family, etc.
- Whether international relocation is aspirational or genuinely operational
- <s>What "cool" means to Michael</s> — **partially answered 2026-09-10**, see the niche-craft
  exception. Working definition: rare + technically deep + already-tooled. One data point.
- The line between "side work I'd take" and "too much distraction from the primary search"
- 🔴 **NEW: how much the safety-credential build is actually worth pursuing.** Michael confirmed
  2026-09-10 he holds no ETCP / OSHA 30 / crowd-management certs and *wants* them: *"i don't hold
  those safety certs BUT I WANT TO."* So the OPS-safety half is a 12-18 month build, not an
  apply-list. **Unknown: whether that build is a real plan with a timeline, or an aspiration.**
  It changes whether safety postings are targets or market research.

**Partially resolved (from 2026-08-02 review):**
- Risk tolerance: Michael WOULD take a lateral or even a step-down for the right org/experience.
  Not upward-only. The filter is "does this build toward something" not "is this a title bump."
- The move is multi-factor: money matters but isn't sole driver. Experience, credit, and
  trajectory all justify going below the benchmark.

---

## Maintenance

- **Author:** Michael (declares preferences).
- **Proposer:** Corso (after debriefs, may propose amendments via the feedback loop in step 6 of the hook).
- **Editor:** only on explicit approval. This file changes slowly. A preference that shifts every week is not a preference, it's noise, and belongs in Corso's earned memory instead.
- **Consumers:** Corso (primary, at debrief step 2), any cold agent reviewing the routine architecture.

### Amendment log

- **2026-09-10 (Michael, explicit approval — *"Yes, of course. Do all those things!"*)** — four
  changes, all traceable to one conversation: (1) ⚡ **accessibility highlight tier** added
  (`remote` / `hybrid` / `home` / `immediate`), superseding *"worth noting but not required"*;
  (2) 🏠 **home-accessible overhire un-blocked** within ~90mi of Rochester, amending the
  overhire noise signal and lifting the comp floor for near-home availability work; (3) ⭐ the
  **niche-craft exception** written down off the Upstaging rigging find, which also partially
  closed the long-open *"what does cool mean"* gap; (4) the **safety-credential question**
  answered (no certs held, wants them) and reopened as a scope question. Companion commit:
  `job-market-roles.json` v5. ⚠ Recorded because the shape of the failure generalises: **two of
  these four were things Michael wanted that the config actively hid from the sweep.**
- **2026-08-02** — risk tolerance and multi-factor weighting partially resolved (see above).
