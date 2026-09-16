# Byline Bert — Decision Log

> Inverted polarity: newest at top. Q = open question, J = judgment/ruling, S = superseded.

---

## J6 · The 30-day clock must be STAMPED, in two places
**2026-09-16 — Mira's ruling, from Audit Anna's onboarding finding**

**Anna's finding, verbatim in substance:** the J4 retirement condition had **no recorded start**. It said "30 days from Bert's first plan," the activity log said the clock was not started, and nothing in the system stamped or queried that moment.

Her reasoning, which is the part worth keeping: *a retirement condition nobody can evaluate is worse than none, because it produces the feeling of accountability without the fact of it.* Either nobody remembers to check, or somebody reconstructs a start date from comment timestamps. Both make J4 decoration.

**Ruling — at the moment Bert issues his FIRST plan, both of these happen or the plan is not done:**
1. A literal dated line goes into `activity-log.md` → LIVE STATE: `CLOCK STARTED: YYYY-MM-DD · J4 evaluation due YYYY-MM-DD`.
2. The first post's `Publish By` is set INSIDE that 30-day window, so the deadline is queryable in ClickUp independently of any file.

Two surfaces on purpose: the clock then exists as data twice and depends on nobody's memory. **Audit Anna owns the first evaluation.**

## J5 · Profile ownership: Bert holds the always-on surface, Corso holds the tailored cut
**2026-09-16 — Mira's ruling, from a collision Corso raised at onboarding**

Corso's claim was legitimate — his own spec item 9 covers portfolio and resume maintenance, tailored per target tier, and the LinkedIn profile is the most-read public surface Michael has.

**The split that resolves it:**
- **Bert owns the ALWAYS-ON, SINGULAR surface.** There is one headline and one About section, and every reader sees the same one: peers and search committees alike. A single artifact that must sound like one person is a **voice** problem. The headline is the highest-leverage sentence in the whole project.
- **Corso owns the TAILORED, PER-TARGET cut.** A resume aimed at one posting, a cover letter aimed at one org. That is positioning against a target, and targets are his.

**Corso's accepted condition:** he holds a **standing right of comment** on profile copy when it is costing Michael on a listing he is evaluating. Bert takes the note; Michael decides ties. Corso does not file into a void.

## J4 · Retirement condition: 30 days to a first published post
**2026-09-16 — Bert's call, delegated; proposed by Counter Cole, seconded by Breaker Beckett**

**If nothing is published within 30 days of Bert's first plan, Bert was a lens, not a teammate.** Same shape as Corso's Ledger C condition.

The clock starts at the **first plan**, not at build, so an unopened Bert does not fail by neglect. What triggers it is planning followed by silence — precisely the failure that already happened once without an agent involved.

**Cole's dissent stands on the record and is not resolved by this ruling:** building Bert risks converting *"I haven't posted"* into *"I have a sophisticated system for not posting,"* which feels better and produces the same zero. This condition is the falsifiable test of that dissent, not a rebuttal of it.

⚠️ See **J6** — as written, this condition was not measurable. Anna caught it at onboarding, hours after it was authored, which is itself the argument for stamping rather than describing.

## J3 · First surface: LinkedIn, site later
**2026-09-16 — Bert's call, delegated**

LinkedIn first. It is where theatre production hiring and peer practitioners already are, so a post has distribution on day one. A personal site is more durable and fully owned, but has no audience for months, and asking Michael to write into a void is asking H1 to win.

The site is not cancelled — it becomes the **archive** the LinkedIn posts eventually point back to, which is also a better use of `make website` than a from-scratch content push.

## J2 · The working surface is a ClickUp list, not a git file
**2026-09-16 — Mira's Q1, answered by Michael (*"love the idea of a content calendar"*)**

Content Calendar (`901329092575`) in Networking & Applications. One task per post.

Rejected: drafts as comments on a standing task. It hides the pipeline and makes published-vs-planned unqueryable, which would starve the one metric that matters. Two workshop rulings are encoded in the **schema** rather than in prose, because a field constrains where a paragraph only advises:
- `Publish By` = a deadline on Michael. No queue, no scheduler (Skye's Q2).
- `Visual Included` + a `Scrubbed` status = the FERPA scrub is structurally enforced (Rhys).

`Killed` was kept as a real status rather than deleting abandoned ideas: an abandonment is evidence about what Michael avoids, and Ledger C needs it.

✅ **Statuses VERIFIED live 2026-09-16** — `Idea → Drafted → Scrubbed → Published → Killed` all present, plus an inherited `completed`. The verify-before-trust flag is cleared.

⚠️ **Wrong-id incident, same session:** the first commit of this bundle carried list id `901328224891`, written from the creation response before the real id was resolved. It was corrected to `901329092575` against a live read of the space. Recorded because it is the pointer class that fails silently — a plausible id resolves to nothing rather than erroring loudly.

⚠️ **Corey's warning, onboarding:** `Publish By` is a plain date field. **Nothing enforces it and no automation reports a slip.** The hook's Phase 1 is the entire enforcement mechanism — soften it and the field becomes decoration.

## J1 · Net-new teammate, not a Paige widening
**2026-09-16 — Fold-in Frank**

Paige's own spec: *"Paige never evaluates the market; Corso never authors the portfolio."* Her Ledger C holds the **frame** (how Michael talks about his trajectory), not the **artifact** (a specific post about a specific build). Widening her to author public content would make her the only agent holding both a record and an opinion about how to sell it — the exact conflation her seam rules exist to prevent.

Three temporal directions, no collision: **Corso forward · Paige backward · Bert outward.**

Fold-in claimed rather than duplicated: the three Outward Profile stubs are **Bert's Phase 0**, not net-new work.

---

## Q3 · Does URITP have its own public comms voice?
**Open — Michael's to answer. Raised by Mainstage Milo at onboarding.**

If the program posts about its own season while Michael posts about the systems behind it, the two can collide in tone even when neither is wrong. Michael granted permission to document the method (2026-09-16); **that is not the same as knowing there is no comms person who would be surprised.**

Not a blocker for a post carrying no visual and no program-facing claim. It IS a blocker for anything that reads as speaking for the program.

## Q2 · Does Bert ever get a schedule trigger?
**Open, and deliberately unanswered at build.** A weekly cadence-review nudge is the obvious upgrade and it is also the thing most likely to become noise Michael tunes out. Requires at least one manual cycle of evidence before it earns a trigger.

## Q1 · The site: real build, or a hosted service?
**Open.** J3 defers it. Dexter's input at onboarding sharpened the fork rather than closing it:
- If the site's job is a **durable archive** that posts point back to, a hosted service is faster and entirely sufficient. The old `otherpeoplespixels` pricing link on `make website` suggests Michael once leaned this way.
- If the site is meant to **demonstrate that he builds systems**, it has to be built — a template site actively undercuts the claim.

Dexter's ruling on ownership: *"that's a strategy call, which makes it yours."* Not decided at zero published posts.
