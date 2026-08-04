# Job Market state — per-lane split MIGRATION

**Status: ✅ COMPLETE (2026-08-04).** Kept as the record of what changed and why. If you are a cold agent, read this before touching any file in this directory.

> Authorized by Michael 2026-08-04 as a **build session**, not a routine run. `routines/README.md` Data-Refresh Discipline rule 7 forbids schema changes inside a refresh and routes them here — that is why the `also_lanes` column could be added at all, and why it must never be added again mid-pass.

---

## The problem this fixed

On the 2026-08-04 13:20 ET pass the routine capped out mid-loop, posted a `⏸️ CHECKPOINT` carrying **nine TSV rows as inline text** for the next session to apply, and did not commit. A later session applied them. The checkpoint comment was never corrected, so when the pass was resumed at 16:20 ET the note still said *"TSV committed: ❌ no"* while the rows were already at HEAD.

**A resume that trusted the note would have double-appended nine rows.** It only didn't because the resuming session read the state file instead of the note about the state file.

Three separate defects, one root cause — **state was being handed between sessions as prose**:

1. **The runbook contradicted itself.** The complete-loops lock said *"stop at a role boundary, commit the rows you have."* Step 13 said commit once, post-loop. Every mid-loop stop landed in that gap.
2. **The CHECKPOINT format had a `📋 TSV DELTA` block**, which institutionalised passing data as text.
3. **The single state file was 25,403 bytes against a ~22KB read-truncation line.** A truncated read followed by a full-file write silently destroys rows. It read back whole on 08-04, but that was a coin flip inside a month at daily cadence.

**Michael, 2026-08-04:** *"Each session should complete its loop fully and not try to pass TSV data between sessions for exactly the reasons you found."*

## Why per-lane files and not just per-role commits

Per-role commits alone were the ask. Costed out: tool count is cheap (+14 calls on a pass that already fires 40-60 fetches). **Payload is not.** A GitHub write replaces the whole file, so eight commits against one 25KB file means eight full rewrites plus eight reads back — **~400KB of TSV churn per pass**, growing daily.

Splitting by lane means a role's commit touches only its own ~3-7KB file. Same durability, roughly today's payload, and the ~22KB truncation risk is retired permanently for every lane. The runbook already filters to one lane at step 5, so the seam was already there.

---

## The design

### Files

```
routines/job-market-state/
  production-manager.tsv
  technical-director.tsv
  stage-manager.tsv
  electrician.tsv
  audio-sound.tsv
  operations-safety.tsv
  drafting-design.tsv
  creative-admin.tsv
  _unfiled.tsv               qualifying finds with no lane yet
  _MIGRATION.md              this file
```

One file per entry in `job-market-roles.json` → `roles[]`. **Filename is the `role_id`, exactly.** Adding a role to the config means adding a file with the same stem; there is no mapping table to keep in sync, and there must never be one.

⚠️ **Row counts are deliberately NOT recorded in this file.** They were, briefly, and went stale within the hour. The files are the count.

`routines/job-market-state.tsv` (the old combined file) is a **tombstone stub**, not deleted — pointers elsewhere resolve to an explanation instead of a 404. Same treatment as `roster.json`. Git history holds the original.

### Schema (unchanged except the last column)

`id · role_id · lane · title · org · location · site · url · posted · first_seen · salary · level · status · friction · also_lanes`

**`also_lanes` is appended at the END** so every existing column keeps its position.

### 🔑 The cross-listing rule (the one that matters)

**One listing = one row = one home file. Never two.**

A listing that matches more than one lane's keywords stays in its home lane's file and names the others in `also_lanes` (pipe-separated). The second lane's comment block gets a one-line `↔️ ALSO` pointer referencing the `JM-ID` — **a pointer, never a duplicated row.**

*Why:* duplicating a row into two files creates two claimants on one truth. The day it goes GONE you update one and miss the other, and the inventory quietly starts lying. This is the same failure that retired `registry.json` and got `data-refresh-log.json` deleted the day it was created.

**Home lane = the lane whose keyword actually produced the find.** On a genuine tie, the lane matching the *senior* half of the title wins (a "Technical Director/Production Manager" is a TD who also manages, so TD is home).

⚠️ **`also_lanes` is for genuine dual-nature ROLES, not for unresolved CONFIG.** If the same title keeps landing in two lanes, that is a keyword-placement problem and it gets ruled on once — see the company-manager ruling below, which was briefly (and wrongly) carried as an `also_lanes` flag before Michael settled it. A flag is not a decision.

### 🗃️ `_unfiled.tsv` — the holding pen

For a find that **qualifies on merit but has no lane yet**. `role_id = unfiled`, `lane = UNF`, otherwise identical schema. It has no role block, so it is reported in the Pass Summary.

🚫 **It is NOT for rejected finds.** Overhire, below-floor, box office, academic-teaching and out-of-industry all stay as prose in NOTABLE, exactly as before. Miss that distinction and this becomes a junk drawer inside a month — that is the whole risk of the file and it is the only thing that will kill it.

**Three of a kind in `_unfiled` is evidence to add a role to `job-market-roles.json`.** That routes to Corso's feedback loop; it is not the executor's call.

---

## Invariant, for anyone auditing the migration commits

**108 rows moved, 108 rows landed.** 30 PM + 16 TD + 21 SM + 12 ME + 12 AUD + 4 OPS + 4 DFT + 9 ADM = 108, matching the combined file at commit `16bb42b` exactly.

**A migration MOVES rows. It does not add them.** Three genuinely-qualifying finds that had been surfaced in prose during the 08-04 pass were deliberately EXCLUDED from the migration so the count stayed verifiable. ✅ **All three were filed immediately afterwards, in a separate commit:**

- **Technical Director – Scenic Lead** — Mills James · Hilliard, OH · $70,000-80,000 → `JM-OSJ-millsjames-sl` in `technical-director`
- **Technical Director, Theater Arts** — Ampa Events · Henrico, VA · $45,000-55,000 + benefits → `JM-OSJ-ampa-td` in `technical-director`
- **Project Manager** — Rose Brand · Sun Valley, CA · $80,000-99,000 → `JM-OSJ-rosebrand-pm` in `_unfiled` (theatre-adjacent fabrication PM; the first row the holding pen ever took)

**Do not use the 108 figure as a current total.** It is the migration invariant and nothing else.

---

## ✅ Open questions — ALL THREE RULED by Michael, 2026-08-04

These were parked unresolved by the migration and settled the same evening. Recorded here in full because two of the three overturned a proposal, and the reasoning is the useful part.

**1. `company manager` — RULED: it belongs to Creative Administration.**
The keyword sat in `stage-manager` while every hit on every board posted under Administration. Michael: *"the company manager should be on the theater administration table."* `company manager` and `assistant company manager` moved to `creative-admin` in `roles.json` v3; the four live rows are homed in ADM and their `also_lanes=stage-manager` flags are **cleared**. This is no longer a cross-lane listing, it was a misfiled keyword.

**2. `drafting-design` — RULED: it STAYS, swept in full every pass.**
Proposed for deprioritisation or retirement after one thin pass (4 rows, all seasonal, top of lane $800/wk). **Overruled.** Michael: *"If we need to do another job search on it because we were short the first time, then absolutely do that."* A thin result is a reason to sweep harder, not a reason to stop looking. ⚠️ The proposal also conflated two different things — *career value* (Corso's lane, and a fair critique) with *whether to search* (not a reason to drop coverage). **Low career value is never grounds to retire a lane.**

**3. The `operations-safety` safety keywords — RULED: they STAY, and they are EXPANDED.**
Six keywords (safety coordinator · safety manager · health and safety officer · production safety · risk manager performing arts · and the OPS half of front of house manager) had returned zero across every board, every pass, and were called "structurally dead weight." **That was wrong, and it was wrong in an important way.** Michael: *"It is a very niche thing, but that is kind of the point."*

> 🩹 **The error worth inheriting: zero returns is evidence about your SOURCES, not about the world.** Live-event safety is a real discipline with real, well-paid seats. It does not post on theatre boards, because it is not a theatre job — it lives on venue, arena, stadium, festival and municipal boards. The routine had concluded "these roles do not exist" from a source set that could never have found them. Five event/venue-safety keywords were ADDED rather than removed, and the boards to sweep them against are named in `job-market-sources.md`. **Expect this lane to be THIN, not EMPTY — and a rare find in a niche Michael is qualified for outranks another Production Manager row.**

⚠️ **Never read "Operations & Safety" as demoted.** It is a full role entry in `roles.json`, it owns `operations-safety.tsv`, it gets its own loop iteration, its own comment header and its own commit, exactly like the other seven.

## Rollback

The pre-split file is intact in git at `16bb42b`. Restoring it means reverting the runbook to v16 and un-stubbing `job-market-state.tsv`. Nothing else read the combined file directly.

## Change log for this migration

| # | File | What |
|---|------|------|
| 1 | `job-market-state/_MIGRATION.md` | this plan, committed FIRST so a stalled session is resumable |
| 2 | `job-market-state/*.tsv` | 8 lane files + `_unfiled`, 108 rows |
| 3 | `job-market-state.tsv` | → tombstone stub |
| 4 | `job-market-refresh.md` | → v17: per-role commit, split state, `also_lanes`, `_unfiled`, CHECKPOINT rewritten |
| 5 | `README.md` | Current-routines target updated + universal Discipline rule 14 |
| 6 | `brain-config/super-agents/compass-corso/preferences.md` | state-file pointer corrected |
| 7 | `job-market-roles.json` | → v3: the three rulings above, plus `_rulings` provenance in `_meta` |
