# Job Market Refresh — Output Templates

> **Split out of `job-market-refresh.md` on 2026-08-04 (v17).** This file holds the OUTPUT SHAPE only.
> Procedure, guardrails and steps stay in the runbook.
>
> 🚫 **Never restate a template in the runbook, in a ClickUp task description, or in an agent profile.**
> One claimant. If this file and anything else disagree, this file wins.

---

## 💬 Comment architecture

> ⚠️ **THE THREADING RULE.** The top-level comment stream on the standing task must contain ONLY role headers,
> checkpoints, and the pass summary. Nothing else. All listing data lives in threaded replies. This is not a
> suggestion. A pass that dumps SAME/NEW/GONE as root comments violates a locked decision and must be restructured.

**The top-level thread (what Michael sees when he opens the task):**

```
🎯 Production Manager · 2026-08-02 11:40 ET       <- ROOT
🎯 Technical Director · 2026-08-02 11:50 ET       <- ROOT
⏸️ CHECKPOINT · 2026-08-02 11:51 ET               <- ROOT (only if the pass stops here)
🎯 Stage Manager · 2026-08-02 11:52 ET            <- ROOT
🎯 Master Electrician · 2026-08-02 11:55 ET       <- ROOT
📋 PASS COMPLETE · 2026-08-02 11:55 ET            <- ROOT
```

That's IT at the top level. Clean, scannable, tight.

**Inside each role header's thread (expanded by tapping the header):**

```
🎯 ROLE HEADER  <- the root comment (contains stats + verdict)
   ├── 🔁 SAME · <n>              <- ONE reply (compressed block)
   ├── ↔️ ALSO IN THIS LANE · <n> <- ONE reply (if any; cross-lane pointers)
   ├── 🆕 <Listing 1 title>       <- individual reply (rich, reactable)
   ├── 🆕 <Listing 2 title>       <- individual reply (rich, reactable)
   ├── 🕳️ GONE · <n>              <- ONE reply (compressed block)
   └── 📌 NOTABLE                 <- ONE reply (if content)
```

**Inside the pass summary's thread:**

```
📋 PASS COMPLETE  <- root comment (includes ⚡ Spotlight)
   └── 🔌 SOURCES <- reply to summary
```

### Threading mechanics (HOW to do this)

1. Post the 🎯 ROLE HEADER as a **new root comment** on the standing task.
2. The post_comment response returns a **comment ID / URL**. CAPTURE IT. This is the parent.
3. Post SAME as a **reply** to that comment ID (`parent_comment`).
4. Post ALSO (if any) as a **reply** to that same comment ID.
5. Post each NEW listing as a **separate reply** to that same comment ID. One comment per listing.
6. Post GONE as a **reply** to that same comment ID.
7. Post NOTABLE (if any) as a **reply** to that same comment ID.
8. Commit that lane's state file (runbook step 11). Then move to the next role.

**If you cannot figure out how to reply to a comment (tool limitation, missing parameter), STOP and flag it.**
Do NOT fall back to posting flat root comments. A failed thread is visible; a flat dump looks intentional.

> 🩹 **Known failure, 2026-08-04:** threaded replies stopped resolving mid-pass with *"failed to find the parent
> comment"* on five consecutive attempts, leaving three orphan headers with no children. The correct recovery is
> what happened on the resume: **attach the missing blocks to the existing header, and correct the header's
> counts in place.** Never leave an orphan header, and never open a second header for the same role in one pass.

**Key rules:**
- Each role's comment block is self-contained. Reading the Production Manager block tells you everything about
  the PM market without reading any other block.
- **Role header comment URLs are captured at post time.** The Pass Summary's comment index links to each role
  header and the SOURCES comment. Threaded replies do NOT need individual links.
- **Individual NEW listing comments are the REACTION surface.** Michael taps 🔥/👍/👎/🤔 on these.

---

# 📐 TEMPLATES

## Template 1: 🎯 ROLE HEADER (root comment, one per role)

```
## 🎯 <ROLE DISPLAY NAME> · <YYYY-MM-DD HH:MM> ET

**Keywords:** <comma-separated from config>
**Live:** <n> · New: <n> · Gone: <n>
💵 Salary range across live: <low>-<high> (or "none posted")

### Verdict
<ONE line. Blunt. About THIS role's market only.>
```

⚠️ **The counts in the header are written BEFORE the block is posted and are the easiest thing in this routine
to get wrong.** If the sweep turns up anything after the header goes up, **edit the header** — do not let a
stale count stand. Three headers were understated on 2026-08-04 and had to be corrected on a later session.

⚠️ **On a multi-session pass, every role header carries the timestamp the PASS OPENED**, not the time that
session ran. The pass is one event.

## Template 2: 🔁 SAME (THREADED REPLY to role header) — SLIM FORMAT

> One line per listing. No separators, no stacking. Scannable in seconds.

```
### 🔁 SAME · <n>

<friction> [<Role>](<url>) — <Org> · <location> · **<n>d** · 💵 <salary or —>
<repeat, one line per listing>
```

Friction icons: ✅ = direct apply · 📝 = email · 🔒 = gated

## Template 2b: ↔️ ALSO (THREADED REPLY to role header, if any) — CROSS-LANE POINTERS

> A listing that also matches this lane but is HOMED in another lane appears here as a one-line pointer.
> 🚫 **Never copy the row into this lane's state file.** One listing = one row = one home file.

```
### ↔️ ALSO IN THIS LANE · <n>

<friction> [<Role>](<url>) — <Org> · <location> · **<n>d** · 💵 <salary or —> · homed in `<role_id>` (`<JM-ID>`)
<repeat>
```

Source the list by scanning every lane file for `also_lanes` containing this role's `role_id`.

## Template 3: 🆕 NEW (INDIVIDUAL THREADED REPLIES to role header)

> ⚠️ Each NEW listing is its OWN SEPARATE threaded reply. NOT lumped into one block.
> This is what enables reaction-based rating.

```
🆕 **[<Role>](<url>)** — <Org>
`<JM-ID>` · <location>
💵 <salary or —> · 📅 <posted> · <friction>
✅ <why qualifies, <10 words>
```

Use ⚠️ instead of ✅ on the qualification line when the listing qualifies but carries a caveat
(academic-adjacent, around-the-clock hours, below the level floor but justified).

## Template 4: 🕳️ GONE (THREADED REPLY to role header) — SLIM FORMAT

```
### 🕳️ GONE · <n>

**<Role>** — <Org> · `<JM-ID>` · lived <n>d · <likely cause>
<repeat, one line per listing>

<or if none: "None. Full inventory carried.">
```

## Template 5: 📌 NOTABLE (THREADED REPLY to role header, if content)

```
### 📌 NOTABLE

- <pattern or observation for THIS role only>
- **Unlinked:** <Role> — <Org> · <board> · <why no URL>
- **Not admitted, logged:** <Role> — <Org> · <board> · <date> · <why it failed the filter>
```

NOTABLE is where REJECTED finds live, as prose. They never become rows, and they never go in `_unfiled.tsv`.

⚠️ **If a lane came back thin, NOTABLE is where you say what you TRIED** — which boards, which keyword
permutations, which department indexes. "Thin" with no method statement is indistinguishable from a lazy sweep,
and the reader cannot tell whether the market or the sweep was the problem.

## Template 6: 📋 PASS SUMMARY (root comment, AFTER all role loops complete)

```
## 📋 PASS COMPLETE · <YYYY-MM-DD HH:MM> ET

**Roles searched:** <n> · **Total live:** <n> · **Total new:** <n> · **Total gone:** <n>
**Prev pass:** <timestamp> (<elapsed>)
**Sessions:** <n> (<if >1: opened <time>, landed <time>>)
[State files](https://github.com/mawizorek/ClickUp_apps/tree/main/routines/job-market-state) · [Roles config](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-roles.json) · [Runbook](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-refresh.md) v17.1

<Density verdict: one line.>

### ⚡ Spotlight
<Top 3 across ALL roles: newest + highest-salary + best-fit. Informed by accumulated reactions.>
1. [<Role>](<url>) — <Org> · <location> · 💵 <salary> · <friction>
2. ...
3. ...

### 🗃️ Unfiled
<Only if _unfiled.tsv gained rows this pass. One line each. Omit the section entirely if none.>
- [<Role>](<url>) — <Org> · <location> · 💵 <salary> · <why no lane fits>

### 🗂️ Comment index
- 🎯 [<Role 1 display>](<role header comment URL>) — <n> live, +<n>
- <repeat for each role>
- 🔌 [SOURCES](<sources comment URL>)
```

⚠️ **The comment index is MANDATORY.** Every role HEADER posted during the run gets a hyperlink, plus SOURCES.

## Template 7: 🔌 SOURCES (THREADED REPLY to pass summary)

> ⚠️ Every board name MUST hyperlink to its homepage. No plain-text board names.
> Mark honestly: ✅ swept · ⚠️ degraded/partial · ❌ not hit this pass. **`❌ not hit` is a required
> admission, not an omission** — a source silently skipped reads as a source that returned nothing.
> ⚠️ On a multi-session pass this block covers **every session's** coverage, not just the last one's.

```
### 🔌 SOURCES

- [**OffStageJobs**](https://staging.offstagejobs.com) `OSJ` — ✅/⚠️/❌ · <n> qualifying · <note>
- [**Playbill**](https://playbill.com/jobs) `PB` — ✅/⚠️/❌ · <n> qualifying
- [**BroadwayWorld**](https://www.broadwayworld.com/jobs/) `BWW` — ✅/⚠️/❌ · <n> qualifying
- [**StageLync**](https://www.stagelync.com) `SL` — ✅/⚠️/❌ · <n> qualifying
- [**USITT**](https://www.usitt.org/industry-resources/jobs) `USITT` — ✅/⚠️/❌ · <n> qualifying
- [**StageBoard**](https://stageboard.app) `SB` — ✅/⚠️/❌ · <n> qualifying
- [**Arts Consulting Group**](https://artsconsulting.com/opensearches/) `ACG` — ✅/⚠️/❌ · <n> qualifying
- [**TOC Arts Partners**](https://tocartspartners.com) `TOC` — ✅/⚠️/❌ · <n> qualifying
- [**League of Chicago Theatres**](https://chicagoplays.com/jobs/) `LCTJ` — ✅/⚠️/❌ · <n> qualifying
- [**The Stage Jobs**](https://jobs.thestage.co.uk) `TSJ` — ✅/⚠️/❌ · <n> qualifying
- [**Skene Callboard**](https://skene.pub/callboard) `SKN` — ✅/⚠️/❌ · <n> qualifying
- [**HireCulture**](https://www.hireculture.org) `HC` — ✅/⚠️/❌ · <n> qualifying
- [**APAP**](https://www.apap365.org/resources/job-bank) `APAP` — ✅/⚠️/❌ · <n> qualifying
- [**Indeed**](https://www.indeed.com) `IND` — ✅/⚠️/❌ · <n> qualifying
<repeat per board in the source list, including the venue/arena/municipal boards swept for operations-safety>
```

## Template 8: ⏸️ CHECKPOINT (root comment, only when stopping mid-loop)

> ⚠️ **REWRITTEN v17. The old version carried a `📋 TSV DELTA` block listing rows as inline text for the next
> session to apply. That block is DELETED and must never come back.** Under per-role commits every finished lane
> is already at HEAD, so a checkpoint carries POSITION only, never DATA.
>
> On 2026-08-04 a checkpoint's delta was applied by one session, the comment was never corrected, and the
> resuming session was told rows were uncommitted when they were already live. A resume that trusted the note
> would have double-appended nine rows.

```
## ⏸️ CHECKPOINT · <YYYY-MM-DD HH:MM> ET

**Pass opened:** <original pass timestamp> ET
**Roles complete and COMMITTED:** <list> (<commit SHA>)
**Next role:** <role_id>
**Boards hit so far:** <list>
**Elapsed:** <time>
**Stamp:** NOT written — that is deliberate, and it is what makes this resumable.

**Resume instruction:** Run the Resume Test. This checkpoint is newer than the stamp, so RESUME at
`<role_id>`. All prior lanes are at HEAD — read the state files, never this comment, for what is captured.
Keep the pass timestamp above on every remaining role header.
```

🚫 **A checkpoint never carries row data.** If you are tempted to paste a row into a comment so the next session
can apply it, commit it instead. That is the entire reason per-role commits exist.

🚫 **Never stamp when you post a checkpoint.** The missing stamp IS the resume signal. Stamping here tells the
next session the pass finished, and four unswept lanes vanish silently.

## Template 9: ✅ SPENT (an EDIT to a checkpoint, not a new comment)

> When a session consumes a checkpoint, it **edits that comment in place.** Never post a second comment saying
> the first one is done — that is two claimants on one status.

```
## ✅ CHECKPOINT · <original time> ET — SPENT, DO NOT RESUME FROM THIS

**Consumed by the <time> ET resume.** That pass completed and stamped at `<stamp value>`.
All <n> lanes swept, posted and committed. Superseded by [📋 PASS COMPLETE](<url>).

🚫 Start a fresh pass. The test is arithmetic, not the date on this comment: the stamp is NEWER than this
checkpoint, so the pass this belonged to has landed.
```

**Why the edit matters even though the arithmetic already covers it:** the Resume Test protects the AGENT.
This edit protects the HUMAN scrolling the thread on a phone, who has no stamp file in front of him.
