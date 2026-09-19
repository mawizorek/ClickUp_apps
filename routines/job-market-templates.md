# Job Market Refresh — Output Templates

> **Split out of `job-market-refresh.md` on 2026-08-04 (v17).** This file holds the OUTPUT SHAPE only.
> Procedure, guardrails and steps stay in the runbook.
>
> 🚫 **Never restate a template in the runbook, in a ClickUp task description, or in an agent profile.**
> One claimant. If this file and anything else disagree, this file wins.

---

## ⚓ THE PASS ANCHOR — the line that makes a pass resumable

**Every role header and the pass summary carry a machine anchor line as their LAST line:**

```
`<role_id>` · pass `<YYYY-MM-DD HH:MM>`
```

This is not decoration. **The Resume Scan derives "which roles are done" by reading these anchors off the
thread's root comments** and walking `roles.json` order to find the first role without one. A header posted
without its anchor is invisible to the next session, which will re-sweep that role.

- **`role_id` is the config slug** (`production-manager`), never the display name. Display names get edited;
  slugs don't. Matching on prose was the fragile version of this.
- **The pass timestamp is the one the pass OPENED with**, identical on every header in that pass, across every
  session it spans. That is what groups them.
- **A single-role top-up appends `· top-up`** so the scan never mistakes one role for an abandoned 8-role pass.
- **The 📋 PASS SUMMARY carries the same anchor** with `role_id` replaced by `PASS COMPLETE`. That anchor is the
  signal that the pass is closed.

---

## 🧮 WHAT IS DERIVABLE — read this before writing any status into prose

**Corrected 2026-08-04 (Michael).** An earlier version of this file claimed elapsed time and boards-hit "are
not derivable" and used that to justify a checkpoint comment. **That was wrong on both counts**, and the error
is worth keeping because it is the same instinct that produced every other prose-state defect in this routine:
*reaching for a note when the data was already sitting there.*

Michael, 2026-08-04: *"Literally all these comments have metadata tagged about when they were posted... You can
absolutely derive both of those things."*

| Fact | Derivable? | From what |
|------|-----------|-----------|
| Which roles are done | ✅ yes | role-header anchors + committed lane files |
| Whether the pass closed | ✅ yes | a `PASS COMPLETE` anchor / the stamp |
| **Elapsed time** | ✅ **yes** | **every comment carries a posted-at timestamp.** First role header of the pass → newest comment → now. Session gaps show up as gaps between comments. |
| **Time since last activity** | ✅ **yes** | newest comment timestamp vs now — this is what decides ABANDONED vs resumable |
| **Which boards YIELDED** | ✅ **yes** | the `site` column on rows whose `first_seen` = the pass anchor date. Every row names the board it came from. |
| Rows captured per role | ✅ yes | the lane file |
| **Which boards were swept and returned ZERO** | ❌ **no** | **a sweep that finds nothing leaves no artifact.** This is the one genuine gap. |

🔴 **The only non-derivable fact is a negative result.** Everything else is already written down somewhere
better than a comment. So the fix is not "write a better note" — it is **make the negative result leave an
artifact too**, which is what the ZERO-YIELD line below does.

**The generalizable rule: before you write a status into prose, ask what artifact already implies it.** If one
does, the prose is a second claimant and it will rot. Only absence of evidence needs to be stated explicitly.

---

## 💬 Comment architecture

> ⚠️ **THE THREADING RULE.** The top-level comment stream on the standing task must contain ONLY role headers,
> checkpoints, and the pass summary. Nothing else. All listing data lives in threaded replies. **This is now
> load-bearing twice: it keeps the thread readable on a phone, AND it keeps the root stream clean enough for
> the Resume Scan to read as evidence.**

**The top-level thread (what Michael sees when he opens the task):**

```
🎯 Production Manager · 2026-08-02 11:40 ET       <- ROOT
🎯 Technical Director · 2026-08-02 11:40 ET       <- ROOT (same anchor: same pass)
⏸️ CHECKPOINT · 2026-08-02 11:51 ET               <- ROOT (optional courtesy)
🎯 Stage Manager · 2026-08-02 11:40 ET            <- ROOT (resumed session, SAME anchor)
🎯 Master Electrician · 2026-08-02 11:40 ET       <- ROOT
📋 PASS COMPLETE · 2026-08-02 11:40 ET            <- ROOT (closes the pass)
```

**Inside each role header's thread (expanded by tapping the header):**

```
🎯 ROLE HEADER  <- the root comment (stats + verdict + zero-yield + anchor)
   ├── 🔁 SAME · <n>              <- ONE reply (compressed block)
   ├── ↔️ ALSO IN THIS LANE · <n> <- ONE reply (if any; cross-lane pointers)
   ├── 🆕 <Listing 1 title>       <- individual reply (rich, reactable)
   ├── 🆕 <Listing 2 title>       <- individual reply (rich, reactable)
   ├── 🕳️ GONE · <n>              <- ONE reply (compressed block)
   └── 📌 NOTABLE                 <- ONE reply (if content)
```

**Inside the pass summary's thread:**

```
📋 PASS COMPLETE  <- root comment (includes ⚡ Spotlight + anchor)
   └── 🔌 SOURCES <- reply to summary
```

### Threading mechanics (HOW to do this)

1. Post the 🎯 ROLE HEADER as a **new root comment**, zero-yield and anchor lines included.
2. The post_comment response returns a **comment ID / URL**. CAPTURE IT. This is the parent.
3. Post SAME as a **reply** to that comment ID (`parent_comment`).
4. Post ALSO (if any) as a **reply** to that same comment ID.
5. Post each NEW listing as a **separate reply** to that same comment ID. One comment per listing.
6. Post GONE as a **reply** to that same comment ID.
7. Post NOTABLE (if any) as a **reply** to that same comment ID.
8. Commit that lane's state file. Then move to the next role.

**If you cannot figure out how to reply to a comment (tool limitation, missing parameter), STOP and flag it.**
Do NOT fall back to posting flat root comments. A failed thread is visible; a flat dump looks intentional —
**and it poisons the Resume Scan, which reads root comments as its evidence.**

> 🩹 **Known failure, 2026-08-04:** threaded replies stopped resolving mid-pass with *"failed to find the parent
> comment"* on five consecutive attempts, leaving three orphan headers with no children. The correct recovery is
> what happened on the resume: **attach the missing blocks to the existing header, and correct the header's
> counts in place.** Never leave an orphan header, never open a second header for the same role in one pass.
> ⚠️ **The Resume Scan now treats "header with no block" as NOT DONE** and sends the next session back to it.
> 🔴 **RECURRED 2026-09-18, on the CHAT CHANNEL rather than the task:** three separate spine-line replies to a
> board session header failed with the same *"failed to find the parent message"* across three ID forms (message
> URL, prefixed `comment:<id>`, bare id). Recovery was to post at channel ROOT carrying an explicit
> `⚠️ thread write failed` marker naming every attempt, so it could not read as a silent flat-post defect.
> **Two surfaces, same failure, fourteen months apart: assume threading can fail at any moment and always leave
> the failure visible.**

---

# 📐 TEMPLATES

## Template 1: 🎯 ROLE HEADER (root comment, one per role)

```
## 🎯 <ROLE DISPLAY NAME> · <YYYY-MM-DD HH:MM> ET

**Keywords:** <comma-separated from config>
**Live:** <n> · New: <n> · Gone: <n>
💵 Salary range across live: <low>-<high> (or "none posted")
🚫 Swept, zero yield: <board codes, comma-separated>  (or "none — every board swept returned something")

### Verdict
<ONE line. Blunt. About THIS role's market only.>

`<role_id>` · pass `<YYYY-MM-DD HH:MM>`
```

⚠️ **The anchor line is mandatory.** Without it the next Resume Scan cannot see that this role was done.

🚫 **The zero-yield line is mandatory too, and it is the ONLY fact in this whole routine that nothing else
records.** Boards that produced a row are already named in the `site` column of the lane file; boards that were
swept and came back empty leave no trace anywhere. Omit this line and the next session cannot distinguish
*"swept, nothing there"* from *"never looked."* That distinction is the entire lesson of the safety-keyword
error (`job-market-sources.md` → the Department-Index Law).

⚠️ **The counts are written BEFORE the block is posted and are the easiest thing in this routine to get wrong.**
If the sweep turns up anything after the header goes up, **edit the header** — do not let a stale count stand.
Three headers were understated on 2026-08-04 and had to be corrected on a later session.

⚠️ **On a multi-session pass, every role header carries the timestamp the PASS OPENED**, not the time that
session ran. The pass is one event, and the shared anchor is what proves it. *(Wall-clock progress is not lost —
the comment's own posted-at metadata records when this header actually went up.)*

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

⚠️ **If a lane came back thin, NOTABLE is where you say what you TRIED** — which keyword permutations, which
department indexes, which alternate entry points. The header's zero-yield line names WHICH boards came back
empty; NOTABLE explains HOW hard you looked. "Thin" with neither is indistinguishable from a lazy sweep.

## Template 6: 📋 PASS SUMMARY (root comment, AFTER all role loops complete)

```
## 📋 PASS COMPLETE · <YYYY-MM-DD HH:MM> ET

**Roles searched:** <n> · **Total live:** <n> · **Total new:** <n> · **Total gone:** <n>
**Prev pass:** <timestamp> (<elapsed>)
**Sessions:** <n> · opened <time>, landed <time> (<elapsed>)
[State files](https://github.com/mawizorek/ClickUp_apps/tree/main/routines/job-market-state) · [Roles config](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-roles.json) · [Runbook](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-refresh.md) v17.3

<Density verdict: one line.>

### ⚡ Spotlight
<Top 3 across ALL roles: newest + highest-salary + best-fit. Informed by accumulated reactions.>
1. [<Role>](<url>) — <Org> · <location> · 💵 <salary> · <friction>
2. ...
3. ...

### ⚡ ACCESSIBLE
<MANDATORY, and mandatory EVEN WHEN EMPTY. Every row tagged remote / hybrid / home / immediate in the
`accessibility` column (added 2026-09-18). Tiers are defined in job-market-roles.json → global.highlight_tiers,
which is the single claimant for their tests.>
- 💻 `remote` · [<Role>](<url>) — <Org> · 💵 <salary> · *"<exact quoted words from the posting body>"*
- 🏠 `home` · [<Role>](<url>) — <Org> · <location, ~<n>mi> · 💵 <salary>
- ⚡ `immediate` · [<Role>](<url>) — <Org> · <why: rolling / open until filled>

<If NOTHING qualified, say so explicitly AND name which sources were swept for it. An absent block and a
swept-empty one are different facts, and conflating them is the single most-repeated failure in this routine.>
```

🔴 **`remote` and `hybrid` must carry the QUOTED WORDS that justify them.** Never inferred, never taken from a
board's metadata card over a posting body. Live case, 2026-09-18: a card read *"Washington, DC (Remote)"* while
the body read *"Work Location: In-office."* Two more the same day advertised "Remote" on the card while the
employer feeds said Kansas City and Denver. **All three were refused. The body wins.**

```
### 🗃️ Unfiled
<Only if _unfiled.tsv gained rows this pass. One line each. Omit the section entirely if none.>
- [<Role>](<url>) — <Org> · <location> · 💵 <salary> · <why no lane fits>

### 🗂️ Comment index
- 🎯 [<Role 1 display>](<role header comment URL>) — <n> live, +<n>
- <repeat for each role>
- 🔌 [SOURCES](<sources comment URL>)

`PASS COMPLETE` · pass `<YYYY-MM-DD HH:MM>`
```

⚠️ **Two mandatory lines here.** The **comment index** (every role header + SOURCES, hyperlinked) is the
reader's navigation layer. The **anchor line** is what tells the next Resume Scan this pass is closed — without
it, the next session sees 8 role headers and no completion and tries to resume a finished pass.

📌 **`Sessions` and both elapsed figures are COMPUTED, not remembered** — first role header's posted-at, this
comment's posted-at, and the gaps between comments. Never carry them forward in a note.

## Template 7: 🔌 SOURCES (THREADED REPLY to pass summary)

> ⚠️ Every board name MUST hyperlink to its homepage. No plain-text board names.
> Mark honestly: ✅ swept, yielded · ⚪ swept, zero yield · ⚠️ degraded/blocked · ❌ not hit this pass.
> **`⚪` and `❌` are different facts and collapsing them is the failure this routine keeps making.**
> ⚠️ On a multi-session pass this block covers **every session's** coverage. Roll up each role header's
> zero-yield line rather than recalling it — that is what those lines are for.

```
### 🔌 SOURCES

- [**OffStageJobs**](https://staging.offstagejobs.com) `OSJ` — ✅/⚪/⚠️/❌ · <n> qualifying · <note>
- [**Playbill**](https://playbill.com/jobs) `PB` — ✅/⚪/⚠️/❌ · <n> qualifying
- [**BroadwayWorld**](https://www.broadwayworld.com/jobs/) `BWW` — ✅/⚪/⚠️/❌ · <n> qualifying
- [**StageLync**](https://www.stagelync.com) `SL` — ✅/⚪/⚠️/❌ · <n> qualifying
- [**USITT**](https://www.usitt.org/industry-resources/jobs) `USITT` — ✅/⚪/⚠️/❌ · <n> qualifying
- [**StageBoard**](https://stageboard.app) `SB` — ✅/⚪/⚠️/❌ · <n> qualifying
- [**Arts Consulting Group**](https://artsconsulting.com/opensearches/) `ACG` — ✅/⚪/⚠️/❌ · <n> qualifying
- [**TOC Arts Partners**](https://tocartspartners.com) `TOC` — ✅/⚪/⚠️/❌ · <n> qualifying
- [**League of Chicago Theatres**](https://chicagoplays.com/jobs/) `LCTJ` — ✅/⚪/⚠️/❌ · <n> qualifying
- [**The Stage Jobs**](https://jobs.thestage.co.uk) `TSJ` — ✅/⚪/⚠️/❌ · <n> qualifying
- [**Skene Callboard**](https://skene.pub/callboard) `SKN` — ✅/⚪/⚠️/❌ · <n> qualifying
- [**HireCulture**](https://www.hireculture.org) `HC` — ✅/⚪/⚠️/❌ · <n> qualifying
- [**APAP**](https://www.apap365.org/resources/job-bank) `APAP` — ✅/⚪/⚠️/❌ · <n> qualifying
- [**Indeed**](https://www.indeed.com) `IND` — ✅/⚪/⚠️/❌ · <n> qualifying
<repeat per board, including the venue/arena/municipal boards swept for operations-safety>
```

### 🔍 THE OSJ DEPARTMENT-INDEX QUERY STRINGS (added 2026-09-19 — this file is their claimant too)

**Browsing these indexes is REQUIRED every pass** (`job-market-sources.md` → the Department-Index Law). The
exact query strings live HERE, because a wrong one fails UPWARD: it silently returns the unfiltered board
formatted exactly like a successful department browse.

```
https://staging.offstagejobs.com/jobs.php?department=scenic+%2F+sets
https://staging.offstagejobs.com/jobs.php?department=lighting+%2F+electrics
https://staging.offstagejobs.com/jobs.php?department=sound
https://staging.offstagejobs.com/jobs.php?department=management
https://staging.offstagejobs.com/jobs.php?department=administration
https://staging.offstagejobs.com/jobs.php?department=properties
```

🔴 **THE BROKEN FORM, AND IT HAS COST TWO PASSES: `?department=Scenic`.** It returns the ENTIRE BOARD — 612 of
612 on 2026-09-18 — and nothing about the response looks wrong. The label is **lowercase**, the slash is
**`%2F`**, and spaces are **`+`**. Truncating `scenic / sets` to `Scenic` is the specific mistake.

**Expected filtered counts, so a future agent can verify a filter applied WITHOUT first establishing a
baseline.** If your filtered count is ~600, the filter did not apply:

| Department | Filtered | Unfiltered | Observed |
|---|---|---|---|
| Scenic / Sets | **339** | 602 | 2026-09-19 |
| Lighting / Electrics | 142 | 601 | 2026-09-18 |
| Sound | 95 | 635 | 2026-09-18 |
| Management | 112 | 614 | 2026-09-18 |
| Administration | 51 | 612 | 2026-09-18 |
| Properties | 38 | 615 | 2026-09-18 |

⚠️ **Two board defects found the same day, both of which limit what a sweep can honestly claim:**

1. **Pagination is broken past page 2.** Scenic / Sets advertises **17 pages**; requests for pages 3-17 return
   page-1 content repeatedly. So an OSJ department harvest is **structurally partial** and must be reported as
   such. This compounds the existing rule that an OSJ row can be confirmed live but **never proved GONE** by
   absence from an index.
2. **The board is NOT snapshot-consistent.** Two correctly-encoded requests minutes apart returned
   *310 of 612* and *339 of 602*. Both prove filtering; **neither is authoritative on totals.** Do not treat a
   changed count between passes as market movement.

## Template 8: ⏸️ CHECKPOINT (root comment, optional) — **A HUMAN COURTESY, NOTHING MORE**

> 🔴 **Reduced to near-nothing at v17.3, and the reduction is the point.** Every field this comment used to
> justify itself turned out to be derivable:
>
> | Field it carried | Where it actually lives |
> |---|---|
> | roles complete | role-header anchors + committed lane files |
> | next role | first role in `roles.json` order without a header |
> | commit SHA | git log on the lane files |
> | ~~elapsed~~ | **comment posted-at metadata** |
> | ~~boards hit~~ | **`site` column on rows with this pass's `first_seen`** |
> | boards swept with ZERO yield | **the role header's zero-yield line** (added v17.3) |
>
> **Nothing is left that only this comment knows.** Write it so a human scrolling on a phone can see the pass
> is paused. Do not write it so an agent can resume — the agent derives.

```
## ⏸️ CHECKPOINT · <YYYY-MM-DD HH:MM> ET  ·  reference only — DERIVE, don't obey

**Pass anchor:** <original pass timestamp> ET
**Paused after:** `<role_id>` (committed)
**Believed next:** `<role_id>`  ← *a hint. Run the Resume Scan; if it disagrees, IT is right.*
**Why it stopped:** <context — capacity, a blocked board, an open question. THIS is the part worth writing.>
**Stamp:** NOT written — deliberate. An unfinished pass must not stamp.
```

🚫 **A checkpoint never carries row data.** If you are tempted to paste a row into a comment so the next session
can apply it, commit it instead.

🚫 **Never stamp when you post a checkpoint.** An unfinished pass that stamps tells every later reader — human
and agent — that it finished.

📌 **A pass that stops WITHOUT a checkpoint is still fully resumable.** That is the acceptance test for this
whole design. If a missing checkpoint ever breaks a resume, the Resume Scan is broken, not the note.

## Template 9: ✅ SPENT (an EDIT to a checkpoint, not a new comment)

> When a session consumes or supersedes a checkpoint, it **edits that comment in place.** Never post a second
> comment saying the first one is done — that is two claimants on one status.

```
## ✅ CHECKPOINT · <original time> ET — SPENT, DO NOT RESUME FROM THIS

**Consumed by the <time> ET session.** That pass completed and stamped at `<stamp value>`.
All <n> lanes swept, posted and committed. Superseded by [📋 PASS COMPLETE](<url>).
```

**Why bother, if the scan already ignores it?** The scan protects the AGENT. This edit protects the HUMAN
scrolling the thread on a phone, who has no lane files or stamp in front of him.
