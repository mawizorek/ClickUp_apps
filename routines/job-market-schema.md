# Job Market Refresh — `accessibility` case log & provenance

> 🪦 **RETIRED AS A SCHEMA CLAIMANT, 2026-09-19.**
> **The canonical state-file schema is `routines/job-market-refresh.md` → *State file schema*** (v19,
> 17 columns, commit `86c4faa`). **The canonical tier TESTS are `routines/job-market-roles.json` →
> `global.highlight_tiers`.** This file defines nothing and asserts no rule. Do not read it to learn how
> the field works, and never copy a definition back into it.
>
> It was created on 2026-09-18 as a deliberate temporary second claimant, because the whole-file rewrite
> meant to land `accessibility` in the runbook was rejected in transit and retrying a large rewrite of a
> canonical procedure file risks a silent transcription error (`routines/README.md` rule 14). That
> condition is now discharged.
>
> ⚠️ **Why this is not a one-line tombstone, against its own former instruction:** the case log and the
> provenance below exist in no other file. Blanking them would swap a second-claimant defect for a
> destroyed-evidence defect, and that is the worse trade — a duplicate can be reconciled later, a deleted
> case cannot be recovered. **Next build session: fold this into `job-market-refresh.notes.md`, which
> already owns WHY for this routine, and delete this path.**

---

## 📒 Case log — three live false-positive traps for `remote` / `hybrid`

All three are illustrations of **one** rule, and that rule now lives in the runbook: *the posting must SAY
it, the words get quoted, and no quote means no tag.* These are the evidence behind it.

**1. The metadata card lies. The body wins.** 2026-09-18 — an Arts Admin Jobs result card read
`Washington, DC (Remote)` while the listing body read **`Work Location: In-office.`** A board's own card
is not the posting. **This is the case that made the rule non-negotiable rather than advisory.**

**2. Never infer from the DISCIPLINE.** CAD drafting is remote-friendly as a craft. That is a fact about
the trade and says nothing whatsoever about a specific seat. Two of the strongest drafting employers on
the list post strictly on-site shop roles.

**3. Never infer from a COLLEAGUE.** 2026-09-18 — two postings described a remote PERFORMER alongside an
on-site stage manager. Different person, different location. The posting you are rowing is the only one
whose location you know.

⭐ **Why a false positive is worse than a miss here:** the entire value of the tier is that it is
*immediately actionable*. A wrongly-tagged row sends Michael at a job that does not exist in the form
advertised. A missed remote row costs one find; a fake one costs trust in the whole block.

---

## 📜 Provenance

**2026-09-10, Michael:** *"i want to begin focusing more strongly on a highlight of remote or immediately
accessible jobs too."* → `global.highlight_tiers` created in `job-market-roles.json`.

🔍 **The diagnosis recorded that day is the important part, and it was correct:** `include_remote` had
been `true` all along. **Remote was never blocked by config.** It was invisible because no keyword asked
for it and every documented board is venue-bound. Measured: of 236 live rows on 09-10, **ZERO** were
remote or hybrid. *A sources-and-keywords problem wearing a filter's clothing.*

**2026-09-18, Michael:** *"add a special flag for remote jobs this time too"* → the `accessibility`
column, authorized in-session on an explicit preview, announced as a build act before the first
structural write per the risk tiers in `routines/README.md`.

**2026-09-18, same pass — the column fired.** First remote row in the routine's history: NETworks
Presentations Assistant Technical Director, $75-85k, tagged `remote|home` (remote by the posting's own
words, Buffalo warehouse anchor inside the 90mi radius). Final tier counts for that pass across 345 live
rows: **13 `home` · 7 `remote` · 6 `hybrid` · 10 `immediate`** — up from zero remote and zero hybrid
eight days earlier.

**2026-09-18 — `remote_sweep.owed` closed.** The blocker claimed remote sources were absent from
`job-market-sources.md` and that "this directive cannot be executed properly without them." A dedicated
probe returned eleven named, live-verified sources. **The blocker was real when written and stale when
cited** — the standing lesson that *a blocker is a claim, and claims expire.*

✅ **Fully discharged 2026-09-18** (this file previously still showed it as owed, which was itself the
same stale-claim failure): remote sources written to the new sibling
`routines/job-market-sources-remote.md` (`cd0a242`, 10 verified-live routes), parent pointers added to
`job-market-sources.md` (`7016c85`), and `global.remote_sweep.owed` discharged in `job-market-roles.json`
(`c2a2b06`). The probe crossed Scout Sage's research lane to get there, which is named rather than hidden.

**2026-09-19, Michael:** approved a `requirements` column. Landed as column 17 in the same runbook edit
that finally landed `accessibility` as column 16 (`86c4faa`) — because the runbook's schema section had
never been amended for column 16 at all, which is the defect this file was standing in for.

---

## 🔗 Where the truth actually lives now

| Question | File |
|----------|------|
| What columns exist, and what goes in them | `routines/job-market-refresh.md` → *State file schema* |
| The exact test for `remote` / `hybrid` / `home` / `immediate` | `routines/job-market-roles.json` → `global.highlight_tiers` |
| The home base and the accessible radius | `routines/job-market-roles.json` → `global.home_base` |
| Michael's dated rulings | `routines/job-market-roles.json` → `_meta._rulings` |
| How the ⚡ ACCESSIBLE block is written | `routines/job-market-templates.md` → Template 6 |
| Where remote-first jobs are actually found | `routines/job-market-sources-remote.md` |
