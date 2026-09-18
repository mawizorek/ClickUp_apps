# Job Market Refresh — the `accessibility` column

> 🔴 **THIS FILE IS A TEMPORARY SECOND CLAIMANT AND MUST BE REDUCED TO A TOMBSTONE POINTER.**
> `routines/job-market-refresh.md` → *State file schema* is the canonical schema definition. This file
> exists only because a whole-file rewrite of that runbook was rejected in transit on 2026-09-18 and
> retrying a large rewrite of a canonical procedure file risks a silent transcription error, which
> `routines/README.md` rule 14 explicitly warns against. **The moment the runbook's schema section is
> amended by a narrow edit, delete everything below and leave a one-line pointer.**
> A second claimant on one truth is the exact rot this repo retired `registry.json` and `roster.json` for.

**Authorized by Michael, 2026-09-18, in-session on an explicit preview.** Announced as a build act before
the first structural write, per the risk tiers in `routines/README.md`.

---

## The column

The state file schema gains ONE column, appended **LAST** so every existing column index is unchanged and
nothing downstream shifts:

```
id · role_id · lane · title · org · location · site · url · posted · first_seen ·
salary · level · status · friction · also_lanes · accessibility
```

`accessibility` is **pipe-separated**, or **EMPTY**. Example: `remote|immediate`.

**The four tiers and their exact tests live in `routines/job-market-roles.json` →
`global.highlight_tiers`, which is the single claimant. They are NOT restated here.** In brief:
`remote` · `hybrid` · `home` · `immediate`.

---

## The rules that matter on this field

- 🔴 **`remote` and `hybrid` are NEVER INFERRED.** The posting must SAY it. No quote, no tag. **A false
  positive is worse than a miss**, because the entire value of the tier is that it is immediately
  actionable — a wrongly-tagged row sends Michael at a job that does not exist in the form advertised.
  - ⚠️ **Never tag off a board's metadata card.** Live case, 2026-09-18: an Arts Admin Jobs card read
    "Washington, DC (Remote)" while the listing body read **"Work Location: In-office."** **The body wins.**
  - ⚠️ **Never infer it from the discipline.** CAD drafting is remote-friendly as a craft; that says
    nothing about a specific posting.
  - ⚠️ **Never infer it from a colleague being remote.** Two 2026-09-18 postings had a remote PERFORMER
    and an on-site stage manager. Different person, different location.
- ⚠️ **`immediate` is about SPEED TO WORK, not geography.** Keep it strictly separate from the other
  three; collapsing them was named as a defect in the ruling that created the tiers.
- **`home` is the one derivable tier** — a geographic test against `global.home_base`
  (`accessible_radius_miles`, currently 90 from Rochester NY, deliberately reaching Syracuse ~87mi and
  Buffalo ~75mi). 🚫 **Do not widen that radius to make a find qualify.** That is Michael's call.
- **These are REPORTING tiers, NOT filters.** Nothing is excluded for lacking one, a row may carry
  several, and an untagged row is completely normal.
- **Quote the justifying words** in the `🆕` listing comment for any `remote` or `hybrid` tag.

---

## Where it is consumed

- **The ⚡ ACCESSIBLE block in the pass summary** (Template 6). 🔴 **Mandatory, and not optional when
  empty:** if nothing qualified, say so explicitly AND say which sources were swept for it. An absent
  block and a swept-empty one are different facts, and conflating them is the single most-repeated
  failure in this routine.
- **The overhire exception** (`global.exclude_overhire`): near-home show-by-show work is rowed with
  `level=contract` and `accessibility=home`, which is what lets it be filtered out of career-arc
  reporting without being hidden from the sweep. **This is the instruction that was unexecutable until
  this column existed.**

---

## Migration

**Existing lane files gain the column as each is rewritten in its own commit during the loop** — which
every lane gets anyway. No separate migration commit, and therefore no window where a file sits
half-migrated by a pass that never touched it.

⚠️ A lane file not yet rewritten since 2026-09-18 will still have 15 columns. That is expected, not
corruption. Read the header row, never assume the column count.

---

## Provenance

- **2026-09-10, Michael:** *"i want to begin focusing more strongly on a highlight of remote or
  immediately accessible jobs too."* → `global.highlight_tiers` created in `job-market-roles.json`.
  ⚠️ The diagnosis recorded that day is the important part and it was correct: `include_remote` had been
  `true` all along. **Remote was never blocked by config** — it was invisible because no keyword asked
  for it and every documented board is venue-bound. Measured: of 236 live rows on 09-10, ZERO were remote
  or hybrid. **A sources-and-keywords problem wearing a filter's clothing.**
- **2026-09-18, Michael:** *"add a special flag for remote jobs this time too"* → this column, on an
  explicit preview of the options.
- ✅ **Same day, the `remote_sweep.owed` blocker was largely closed:** it claimed remote sources were not
  in `job-market-sources.md` and "this directive cannot be executed properly without them." A dedicated
  probe returned eleven named, live-verified sources. **The blocker was real when written and stale when
  cited** — the standing lesson that a blocker is a claim, and claims expire.
  🔻 Those sources still need writing into `job-market-sources.md`; the probe crossed Scout Sage's
  research lane to get them, which is named rather than hidden.
