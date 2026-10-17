---
id: call-normalization
kind: hook
version: 1.0
status: LIVE (phase 1 -- run ONCE by hand, on two dates)
steward: Mainstage Milo
execution: morning briefing pre-pass, alongside report-normalization
born: 2026-09-19
repo: mawizorek/ClickUp_apps@main (brain-config, PUBLIC)
trigger: /morning (via morning-briefing.md) OR direct invocation on a `| calls |` task
sibling: brain-config/hooks/report-normalization.md -- SAME paperwork stream, OPPOSITE direction in time
---

# Call Normalization -- rehearsal call intake

Reads the stage manager's forwarded CALLS, puts what is being rehearsed onto the rehearsal event itself, reconciles the call's real hours against the stored event windows, and promotes the few genuinely noteworthy chunks to their own surface.

Michael, 2026-09-19:

> *"I have paperwork that forwards all the calls from the stage manager, and you should compare that to the events I have listed for our Big Love rehearsals. You don't need to create more work by adding tasks and subtasks for every call, but it would be nice if I clicked on a rehearsal and could see what they were rehearsing based on an import from that call."*

## 🔗 Sibling, not parent: `report-normalization.md`

Both hooks read forwarded stage-manager paperwork out of a `[SHOW] | ... |` task in the same Paperwork list, and both fire in the same morning pre-pass. **They are still two workflows and this file exists because Michael ruled them apart** (2026-09-19: *"call normalization is different from report normalization... There are two different hooks, even though they can be related and reference each other."*).

What actually differs:

| | report-normalization | call-normalization |
|---|---|---|
| Direction in time | RETROSPECTIVE -- what happened last night | PROSPECTIVE -- what is called today and tomorrow |
| Writes to | Production Reports instances + Production Notes tasks | rehearsal EVENT tasks, as comments |
| Primary product | structured fields + department notes, linked | call detail on the event + a window reconciliation |
| Nature of the work | field mapping, largely mechanical | **judgement** -- deciding what is noteworthy |
| Human checkoff | `Notes Done`, Michael's confirmation | none; the comment IS the artifact |

⚠️ **Shared machinery lives in the sibling and is not re-specified here:** the folder enumeration, the two-surface model (forward local / instance central), the after-midnight date rule, the intake-precondition finding. **Read both files on a run that does both.** A change to enumeration behaviour belongs in one place; when it moves, fix the pointer rather than copying the section.

⭐ **One cross-check is free and catches a schedule change nobody announced:** the report's `timings: NEXT Event Details` and the next day's CALL are the same information from two sources. When they disagree, **the call is fresher.**

---

## THE CANONICAL SOURCE

**`[SHOW] | calls |` in the production's Paperwork list.** Big Love's is `86ak1p328`, in Paperwork (BL) under the Breakdowns folder. Every forwarded call lives as a comment there; that comment is evidence and is never edited.

The rehearsal event tasks live in the show's own rehearsals list -- Big Love: `901327015236`, `[BL] Rehearsals` under the CALENDARS folder.

⚠️ **A production with no `| calls |` task cannot be swept**, exactly as with reports, and the sweep reports zero forever while looking healthy. Raise the missing surface as a finding before that show's first rehearsal. 🚫 The hook does not create the intake task; it needs a forwarding address confirmed against the sending account, which is Michael's setup step.

---

## 🔴 THIS IS A JUDGEMENT PASS WEARING A PARSER'S CLOTHES

Michael, one turn after the original ask, and this is the ruling that shapes everything below:

> *"that is almost request and would permit a subtask generated for... like noteworthy rehearsal chunks. pushing this squarely into your realm to fall out and check for - not a rote parser"*

Every line of every call can be binned mechanically. Doing so produces noise. **The deliverable is three things: the call detail visible on the rehearsal it belongs to, the window reconciliation, and the few chunks that are genuinely noteworthy promoted to their own surface.**

### 🪦 READ THIS BEFORE BUILDING ANYTHING: A PARSER ALREADY EXISTED AND IT DIED SILENTLY

A ClickUp agent named **`[BL] Calls Reconciliation`** (plus a `(copy)` variant) did exactly the mechanical half of this job. It ran on `86ak1p328` from **2026-08-28 through 2026-09-10**: parsed each forwarded call, posted a `📋 Call detail` comment onto each matching rehearsal event, and filed a reconciliation report naming missing blocks. Its output is still in that task's comment threads and it is good work.

**It has not run since Sep 10.** Eight calls landed unprocessed before anyone noticed: Sep 11, 12, 13, 14, 16, 17, 18, 19.

🔴 **SO THIS HOOK'S FIRST JOB IS NOT PARSING. IT IS NOTICING THAT THE PARSER STOPPED.** A dead automation emits exactly the same signal as a quiet one: nothing. **Every run compares the newest call comment's timestamp against the newest reconciliation reply's timestamp and reports the gap in days.** Cheap, falsifiable, and the only thing that would have caught this.

⭐ **Generalizes past this hook:** no agent can read ClickUp automation config, so the only way to know an automation is alive is to find its OUTPUT and date it. Applies to any agent or automation whose product lands in a comment stream.

🚫 **Do NOT build a second parser next to the stopped one.** If that agent is revived, this hook's mechanical half becomes redundant and the judgement half does not. Check for its output first, every time.

---

## 🎯 THE NOTEWORTHY-CHUNK CRITERION -- four triggers, and scene work is never one

A chunk earns its own subtask **only** if one of these is true:

1. **A GUEST OR DEPARTMENT ENTERS THE ROOM** -- designers run, design presentations, photo call, a designer/consultant/department head in the building.
2. **THE SHOW RUNS END TO END** -- run-through, stumble-through, dress.
3. **A SAFETY-GOVERNED SPECIALTY IS WORKED** -- fight call, intimacy work, falls; anything with a fight choreographer or intimacy director in it.
4. **A COMPANY MILESTONE LANDS** -- off book, meet & greet, first day in the space, first day on the deck.

🚫 **"Scene 8" is Tuesday.** Scene work, notes, warm ups, character work and table work are the normal substance of a rehearsal and are NOT noteworthy. They belong in the call-detail comment, never in a subtask.

**The one-line test: does somebody outside the rehearsal room need to be there, or does the room change character?** If neither, it is a comment line.

⚠️ **The criterion is about CONSEQUENCE, not importance.** Same law as the morning briefing's relevance rule (consequence × sole-gatekeeper, never magnitude), arriving in a second container. A chunk is noteworthy because it pulls someone in or changes what the day IS, not because it sounds significant.

---

## The sweep, per run

1. **Enumerate live productions from the FOLDERS** -- shared with the sibling hook and the briefing's ROLL CALL. Run it once per pass, not once per hook.
2. **Read the show's `| calls |` task** for comments newer than the last processed call. ⚠️ The call routinely arrives after midnight: Bia's Sep 19 call landed 12:13 AM on Sep 19. **Key on the DATE NAMED IN THE CALL, never the comment timestamp.**
3. **Check the dead-parser gap** and report it in days.
4. **Match each call date to the rehearsal event tasks.** A day routinely has TWO blocks, a day session and an evening session. Bin the call's lines into the windows they fall inside.
5. **Post ONE `📋 Call detail` comment per event task**, carrying that window's time/description lines, who is called and released, and **the distribution date of the call it came from** -- so a newer call's comment visibly supersedes an older one.
6. **RECONCILE THE WINDOW.** See below; this is the part with the most value in it.
7. **Promote noteworthy chunks** to subtask events under the block they sit inside.
8. **Mark a preliminary as preliminary.** Bia sends weekly prelims and same-day finals. A prelim's comment says so on its face, so nobody plans off a draft.

---

## 🔴 WINDOW RECONCILIATION -- worth more than the transcription

**Compare the call's real span against the event task's dates and report the delta.** Proven on the first run: on 2026-09-19 BOTH Big Love rehearsal blocks were an hour early in ClickUp. The call ran 11:00 AM-2:00 PM and 3:00-6:00 PM; the task rows read 10:00 AM-1:00 PM and 2:00-5:00 PM. **The afternoon row as dated STARTS DURING THE BREAK.**

- **A whole-day offset is ONE finding, not two.** Both blocks shifted by the same hour means the day was rebuilt, not that two rows drifted independently. Say "the whole day is shifted."
- **A line falling outside every window is a MISSING BLOCK.** The retired agent reported these correctly and constantly: the 6:30 PM crew/management call ahead of a 7:00 PM actor call has no event covering it on nearly every date. ⚠️ **That pattern is so consistent it is probably a modelling decision, not a gap** -- the events model the ACTOR call and stage management arrives earlier. **Report it once as a pattern, not once per date**, or the finding becomes wallpaper.
- ⭐ **Same seam as the crew-call reconciliation of 2026-09-18: the calendar stores one thing and the paperwork stores another.** There the calendar held CURTAIN and the email held CALL. Here the event holds the actor window and the call holds the whole day including management. **Neither surface is wrong. They answer different questions, and the reconciliation IS the deliverable.**

🚫 **NEVER WRITE A DATE FROM THIS HOOK.** Flag the offset and stop. An agent date edit is indistinguishable from Michael's, it knocks a `CURRENT` row to `OUTDATED` in the publish queue, and it manufactures the next run's reconciliation work. Same prohibition the morning briefing carries, for the same reason.

---

## Fields on a promoted noteworthy chunk

Create it as a **subtask of the rehearsal event block it falls inside**, task type `Event`, native start/due set to the chunk's real times.

🔴 **`GCal STATUS` (`d5961a7f-264b-4490-af59-815391b585ad`) = `CLOSED (N/A)` and `Info Sheet Status` (`e53f1210-5fc2-4cb5-9e25-0b5b79cdd25c`) = `n/a`. Both. Every time.** Michael's ruling, 2026-09-19, verbatim: *"These are internal notes for me. They never need to be updated on the Google Calendar, so their status would be not applicable for that and the production calendar field."*

⭐ **Why this is the correct use of `N/A` rather than the trap `prod-cal-reconcile.md` warns about:** the N/A test is about KIND -- *will this ever be a published event?* -- and here the answer is genuinely never, because **the PARENT rehearsal block is already published.** Publishing a child would double-book the Google calendar for the same hours. `N/A` means never publishes; `NEW` means not yet. A noteworthy chunk is the first case, permanently. **Leaving either field blank is NOT acceptable** -- a blank reads as UNVERIFIABLE in the publish-queue sweep, and these shows already carry dozens of those.

**The subtask body** names the trigger that qualified it, the chunk's lines verbatim from the call, who is called, and the call's distribution date. Link back to the `| calls |` task.

---

## 🚫 What this hook does not do

- **No subtask per call, and no subtask per line.** Michael said so explicitly. The comment is the default surface; a subtask is the exception the criterion earns.
- **No backfill without a ruling.** Michael ruled FORWARD-ONLY on 2026-09-19 when nine historical noteworthy chunks were surfaced. Name what was found; do not build it.
- **No writes to the `| calls |` task or its comments.**
- **No date writes, anywhere, ever.**
- **No Google Calendar writes.** Nothing in this hook touches an external calendar.

---

## Authority

**Two writes, both narrow:**

1. Posting `📋 Call detail` comments onto rehearsal event tasks.
2. Creating a noteworthy-chunk subtask event under its rehearsal block, with `GCal STATUS` = `CLOSED (N/A)` and `Info Sheet Status` = `n/a`.

⚠️ **Write 2 needs a ruling per BATCH, not per chunk.** A comment is reversible and cheap. A subtask is a structural object: one is fine, nine is a build, and a build gets asked about first. **Precedent for a shape is never consent to instantiate it** -- earned the hard way on 2026-09-19, same morning, on a different surface.

---

## Morning briefing integration

Fires in the same pre-pass as `report-normalization.md`, sharing its enumeration. Report:

- the **dead-parser gap in days**
- call detail posted, per event task
- **any window offset between the call and the event tasks**
- noteworthy chunks promoted, or found-and-not-built under a forward-only ruling
- any production with a `| calls |` task but no rehearsal events to reconcile against, and vice versa

🔴 **A window offset on TODAY belongs in THE ROOM, not in the maintenance block.** A rehearsal whose stored times are wrong by an hour is a collision risk for anyone planning around it, which is exactly what THE ROOM's schedule lane is for. The maintenance receipt stays in the pre-pass block; **the consequence goes to the top of the brief.**

---

## Known limits

- ⚠️ **Run ONCE, by hand, on two dates (Sep 19-20), with ONE chunk ever built.** The criterion was applied retrospectively across a season but almost nothing was instantiated. **A cold session is running this nearly cold and says so.**
- ⚠️ **It cannot tell a modelling decision from a gap.** The recurring 6:30 PM management call with no event block is almost certainly deliberate. When a "missing block" repeats on nearly every date, that is a question for Michael, not a defect.
- 🚫 **It cannot know whether a preliminary call will hold.** Anything built off a prelim is provisional and must say so on its face.
- ⚠️ **Call paperwork is unreliably labelled and worse than the reports.** Observed: `16. Daily Call 9_13_26` attached to a Sep 14 call, two consecutive `18.` files for Sep 16 and Sep 18, and a Sep 20 line reading `4:00 AM Run Through` for an obvious 4:00 PM. **Read the day's contents, cross-check against the previous call's next-day block, and state a typo as a typo rather than reproducing it as fact.**
- ⚠️ **It cannot read the retired agent's configuration**, only its output. Whether that agent is disabled, erroring or waiting on something is unknowable from inside ClickUp.
- **Only as complete as the folder enumeration**, inheriting the ROLL CALL's limit exactly.

---

## Provenance

Born 2026-09-19 during a live `/milo` morning wakeup + email triage session, from Michael's request for a calls sweep and his immediate correction of its genre. **First written as a v1.2 section inside `report-normalization.md`; split out the same session on Michael's ruling** that call normalization and report normalization are two distinct workflows that should reference each other rather than share a file. The merged file had also reached 34,846 bytes, past this repo's read-whole ceiling -- **so the ruling and the byte count agreed, and the ruling is the reason.**

Three rulings recorded: **it is a judgement pass, not a rote parser** · **noteworthy chunks are internal notes and carry `N/A` on BOTH calendar fields** · **forward-only** on the nine historical chunks.

⭐ **The lesson that outranks everything else here: READ THE EXISTING COMMENTS BEFORE PROPOSING A MECHANISM.** This session was one turn from speccing a second parser alongside a stopped one -- the same two-punch-lists defect `ddr-reaudit.md` warns about, in a new container.

⚠️ **Recorded and NOT acted on, because it is Michael's to rule:** nine chunks passed the criterion earlier in the season and only one has any surface -- Aug 28 design presentations · Aug 29 intimacy workshop · Sep 1 meet & greet + design presentations · Sep 9 fall practice plus two intimacy blocks · Sep 12 off book · Sep 13 run-through · Sep 14 fight call + designers run · Sep 17 dance/movement workshop · Sep 20 run-through (built). **The heaviest is Sep 9**: fall practice with the fight choreographer running in TWO rooms simultaneously, plus two intimacy blocks, in one night, with nothing in ClickUp recording that it happened. Hazard Hawthorne's incident memory is empty; so is the record of the nights most likely to fill it.
