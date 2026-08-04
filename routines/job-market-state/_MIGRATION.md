# Job Market state — per-lane split MIGRATION

**Status: ✅ COMPLETE (2026-08-04).** Kept as the record of what changed and why. If you are a cold agent, read this before touching any file in this directory.

> Authorized by Michael 2026-08-04 as a **build session**, not a routine run. `routines/README.md` Data-Refresh Discipline rule 7 forbids schema changes inside a refresh and routes them here — that is why the `also_lanes` column could be added at all, and why it must never be added again mid-pass.

---

## The problem this fixed

On the 2026-08-04 13:20 ET pass the routine capped out mid-loop, posted a `⏸️ CHECKPOINT` carrying **nine TSV rows as inline text** for the next session to apply, and did not commit. A later session applied them. The checkpoint comment was never corrected, so when the pass was resumed at 16:20 ET the note still said *"TSV committed: ❌ no"* while the rows were already at HEAD.

**A resume that trusted the note would have double-appended nine rows.** It only didn't because the resuming session read the state file instead of the note about the state file.

Three separate defects, one root cause — **state was being handed between sessions as prose**:

1. **The runbook contradicted itself.** The complete-loops lock says *"stop at a role boundary, commit the rows you have."* Step 13 says commit once, post-loop. Every mid-loop stop landed in that gap.
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
  production-manager.tsv     30 rows
  technical-director.tsv     16
  stage-manager.tsv          21
  electrician.tsv            12
  audio-sound.tsv            12
  operations-safety.tsv       4
  drafting-design.tsv         4
  creative-admin.tsv          9
  _unfiled.tsv                0 (header only at migration)
  _MIGRATION.md              this file
```

One file per entry in `job-market-roles.json` → `roles[]`. **Filename is the `role_id`, exactly.** Adding a role to the config means adding a file with the same stem; there is no mapping table to keep in sync, and there must never be one.

`routines/job-market-state.tsv` (the old combined file) is a **tombstone stub**, not deleted — pointers elsewhere resolve to an explanation instead of a 404. Same treatment as `roster.json`. Git history holds the original.

### Schema (unchanged except the last column)

`id · role_id · lane · title · org · location · site · url · posted · first_seen · salary · level · status · friction · also_lanes`

**`also_lanes` is appended at the END** so every existing column keeps its position.

### 🔑 The cross-listing rule (the one that matters)

**One listing = one row = one home file. Never two.**

A listing that matches more than one lane's keywords stays in its home lane's file and names the others in `also_lanes` (pipe-separated). The second lane's comment block gets a one-line `↔️ ALSO` pointer referencing the `JM-ID` — **a pointer, never a duplicated row.**

*Why:* duplicating a row into two files creates two claimants on one truth. The day it goes GONE you update one and miss the other, and the inventory quietly starts lying. This is the same failure that retired `registry.json` and got `data-refresh-log.json` deleted the day it was created.

**Home lane = the lane whose keyword actually produced the find.** On a genuine tie, the lane matching the *senior* half of the title wins (a "Technical Director/Production Manager" is a TD who also manages, so TD is home). Ties that keep recurring are a config problem — raise them, do not re-adjudicate them every pass.

### 🗃️ `_unfiled.tsv` — the holding pen

For a find that **qualifies on merit but has no lane yet**. `role_id = unfiled`, `lane = UNF`, otherwise identical schema. It has no role block, so it is reported in the Pass Summary.

🚫 **It is NOT for rejected finds.** Overhire, below-floor, box office, academic-teaching and out-of-industry all stay as prose in NOTABLE, exactly as before. Miss that distinction and this becomes a junk drawer inside a month — that is the whole risk of the file and it is the only thing that will kill it.

**Three of a kind in `_unfiled` is evidence to add a role to `job-market-roles.json`.** That routes to Corso's feedback loop; it is not Ricky's call.

---

## Invariant to check if you are auditing this migration

**108 rows moved, 108 rows landed.** 30+16+21+12+12+4+4+9 = 108, matching the 2026-08-04 combined file exactly (commit `16bb42b`).

**A migration MOVES rows. It does not add them.** Three genuinely-qualifying finds were surfaced in prose during the 08-04 pass and deliberately **left out** so the count stays verifiable. They are the first actions for the next pass, listed here so they are not lost:

- **Technical Director – Scenic Lead** — Mills James · Hilliard, OH · $70,000-80,000 · OSJ `jobID=72449` → `technical-director`
- **Project Manager** — Rose Brand · Sun Valley, CA · $80,000-99,000 · OSJ `jobID=72453` → likely `_unfiled` (theatre-adjacent fabrication PM)
- **Technical Director, Theater Arts** — Ampa Events · Henrico, VA · $45,000-55,000 + benefits · OSJ `jobID=63615` → `technical-director`

## Known open questions this migration did NOT settle

1. **`company manager` is claimed by two lanes.** It is a `stage-manager` keyword in the config, but all four live hits posted under Administration and are homed in `creative-admin` with `also_lanes=stage-manager`. **Needs a ruling from Michael**, not a quiet default.
2. **`drafting-design` may not be worth a loop.** Four rows, all seasonal contract, top of lane $800/wk. Corso proposed deprioritising or retiring it. Unanswered.
3. **`operations-safety` carries six structurally dead keywords** (safety coordinator, safety manager, health and safety officer, production safety, risk manager performing arts, and arguably front of house manager). Zero returns across every board, every pass. US theatres fold safety into PM/TD/ops descriptions.

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
