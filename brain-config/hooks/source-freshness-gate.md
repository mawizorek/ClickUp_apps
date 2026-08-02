# Source Freshness Gate · AI Toolkit

**Purpose:** A fire-always hook on any lookup that produces a volatile fact (hours, dates, prices, addresses, availability, status, staffing, "is this still true"). Ranks sources by freshness-provenance, not by how close the source sits to the subject.

**Steward:** Scout Sage

**Mode:** Always-on (deterministic). Fires for EVERY agent, not just Scout Sage. That is the whole point: the failure that created this hook happened while Brain was NOT wearing Sage. Procedure lives in tools, never in a persona (Constitution §2–§3). Sage STEWARDS this file; she does not store it.

**Invocation:** Automatic (fires on volatile-fact output). Explicit forms: `/source-check` · `/freshness-check` · "how fresh is that" · "where did you get that" · "verify that source."

**Trigger:** Whenever a response will state a volatile fact: hours, open/closed, seasonal schedules, event dates, deadlines, prices, fees, admission, ticketing, addresses, locations, availability, stock, staffing, contact details, any "is X still true" about the outside world. Does NOT fire on: stable facts (history, definitions, settled math), or internal workspace lookups where the workspace IS the source of truth.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-07-25** by Brain, alongside Scout Sage's graduation to git-teammate (Fleet Build Queue Decision Log Q8 → option B).

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Scope** | Any response containing a volatile external fact |
| **Source-reliability ledger** | `super-agents/scout-sage/memory.md` |
| **Lane seams** | Doc-Rot Sweep (docs vs HEAD), Recon Renata (repo vs standard) |

---

## The founding failure (2026-07-25)

Brain told Michael that **Soleil** (550 Congress St, Portland — the OG Inciardi mini-print machine) was **closed Tuesdays**, on a trip that had exactly one workable day left. It nearly cut the single most significant stop from the itinerary.

**Google said open. Google was right.**

| Source Brain trusted | Why it lost |
|---|---|
| Inciardi's own machine-listing Instagram post ("Hours: Wed–Sun 11am–6pm") | **First-party, but published July 2024.** Two years stale. It is also the ARTIST describing a HOST BUSINESS — not the business. |
| Apple Maps entry (Mon–Tue closed) | Unclaimed listing, undated. |
| **Google Business Profile (Mon closed, Tue–Sat 11–6)** | **Owner-supplied and stamped *"updated by this business 1 week ago."*** |

Brain ranked **first-party over dated.** The correct rule is the reverse. Soleil expanded its days sometime after 2024 and every undated aggregator is still echoing the old schedule at each other. Soleil's own website has **no hours page at all**, which is exactly why the stale copy propagated.

---

## Procedure

### Rule 1 — The freshness ladder (rank by dated provenance, not proximity)

Highest to lowest. **A lower tier NEVER overrides a higher one just for being closer to the subject.**

1. **Owner-updated profile carrying a visible date stamp.** Google Business Profile "updated by this business N ago," a verified listing with an edit date, a business's own dated social post.
2. **The business's own page, IF the claim is dated or the page is demonstrably maintained.** Undated = drops to tier 4.
3. **A third party reporting its OWN operation** (an event page about its own event, a venue about its own hours). First-party for the thing it owns.
4. **A third party reporting SOMEONE ELSE'S facts**, or any undated first-party snapshot.
5. **Undated aggregators** (MapQuest, loc8nearme, Yelp mirrors, scraped directories). **Near worthless.**

**Call the tier out loud when the answer is volatile.** "Tier 1, updated last week" is a different claim from "tier 5, undated," and Michael can price the difference instantly.

### Rule 2 — A first-party snapshot EXPIRES

The trap that actually fired. "First-party" is a property of the CLAIM at the moment it was made, not a permanent license.

- An artist's 2024 post about a shop's hours **is not the shop.** It is a two-year-old photograph of the shop's sign.
- The correct authority for a host business's hours is **the host business**, not the brand/artist/event that placed something inside it.
- **Ask "how old is this claim?" before "who made it?"** An undated first-party source and an undated aggregator are the same tier, because neither can tell you whether it is still true.

### Rule 3 — Agreeing aggregators are ONE source, not many

Aggregators scrape each other. Five listings showing identical stale hours is **one stale record with four reflections**, and it will read as overwhelming consensus if you count rows instead of origins.

- Before counting a source toward Sage's 3-source minimum, ask **where it got the fact.**
- Identical wording or identical field structure across "independent" sites = same origin. Count once.
- **One dated tier-1 source beats five undated tier-5 sources.** Consensus among echoes is not evidence; it is the same evidence, louder.

### Rule 4 — Never assert a volatile fact without knowing the age of the claim

If you cannot establish when the claim was last true, you may not state it flatly.

- Say **"unverified — check before you go"** and move on. That is a complete, useful answer.
- This is already the honest default: on the same itinerary, Back Cove Books and The Post were both flagged *hours unverified* and neither caused a problem. **Soleil was asserted, and that is the one that broke.** The hook exists to make the flag the default rather than the exception.
- A confident wrong answer costs more than an admitted gap. Fetch Honesty Law: **a fallback that does not announce itself lies.**

### Rule 5 — Confirm you matched the right ENTITY

Same search that produced the Soleil error also surfaced **"Soliel, LLC" — a cybersecurity firm in Vienna, Virginia** — in the same results panel. One transposed vowel.

- Verify **name + city + street address** agree before trusting any record.
- Common-word and misspelling collisions are how the wrong record gets scraped into the right answer.
- Chains and franchises: the location matters more than the brand. A brand page's hours are not a branch's hours.

### Rule 6 — When sources conflict, say WHO and say WHY

Do not silently pick a winner.

- Name both claims, name their tiers, name their dates, then rule — and **show the tiebreaker.**
- The tiebreaker is almost always a date stamp. If Michael can see the stamp, he can overrule you.
- **If a user contradicts you with a screenshot, they are probably holding a fresher source than yours.** Re-verify from scratch before defending the original answer. Do not argue from the stale source you already committed to.

---

## Corollary — where the FACT goes afterward

A verified volatile fact belongs **on the work item** (the task, the itinerary, the reference doc) where Michael can read it — never only in an agent's memory. An agent privately remembering shop hours is a second, unauditable copy of something that already has a home.

**What an agent SHOULD carry forward is source RELIABILITY, not the fact itself:** *"Inciardi's IG machine listings go stale — verify against the host business."* That is method memory, and it lives in `super-agents/scout-sage/memory.md`.

---

## Guardrails

- Never assert a volatile fact flatly without knowing the age of the claim. "Unverified" is a complete answer.
- A lower-tier source NEVER overrides a higher one just for being closer to the subject.
- A first-party snapshot EXPIRES. Ask "how old?" before "who said it?"
- Count ORIGINS, not rows. Agreeing aggregators are one source.
- On conflict: show both, show dates, show the tiebreaker. Never silently pick.
- If Michael contradicts with a screenshot: he is probably fresher. Re-verify from scratch.

---

## Composes with

- `hooks/doc-rot-sweep.md` — different lane (docs vs HEAD freshness; this is WORLD vs claim freshness)
- `agents/recon-renata.md` — different lane (repo shape vs standard)
- `hooks/silent-fallback-law.md` — a source swap that doesn't announce itself is a lie
- Routine Ricky's refresh runs fire this gate the moment a poll actually FETCHES
- Scout Sage's `memory.md` — accumulated source-reliability precedent

---

## Changelog

- **v2 (2026-08-02)** — Header normalized to hook template standard (Audit Anna fix-spec, wave 1). Restructured: title fixed, blockquote converted to proper header fields, Steward moved to header position, added Front door, Established, Coordinates, Guardrails, Composes with sections.
- **v1 (2026-07-25)** — Created. Born from the Soleil hours error on the Inciardi Maine machine run, where a two-year-old first-party Instagram post outranked an owner-updated Google profile stamped one week old. Authored alongside Scout Sage's graduation to git-teammate (Fleet Build Queue Decision Log Q8 → option B).
