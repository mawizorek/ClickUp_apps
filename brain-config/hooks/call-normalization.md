---
id: call-normalization
kind: hook
version: 1.0
status: LIVE (direct invocation on a Production Calls intake task, or a sweep of the list)
steward: Mainstage Milo
schema owner: FMP Fiona (CALLS / CALL_LINES are hers; this file may not rename a field)
execution: per intake task; sweep on request
born: 2026-11-16
repo: mawizorek/ClickUp_apps@main (brain-config, PUBLIC)
trigger: /call-normalize, /normalize-calls, "normalize the calls", "normalize this call", a forwarded call sitting in Production Calls
companion: hooks/report-normalization.md (the report half) - hooks/reports-intake.next-build-spec.md (the ruling record for identity, outcomes and accuracy checks)
---

# Call Normalization -- production call intake, normalized toward MAWnster

The call half of SM document intake. A forwarded call email lands as its own task in Production Calls (`1400600000005546`); this hook turns it into one legible call record whose shape is the shape Michael will enter in Production MAWnster, so entering it is transcription rather than interpretation.

## The target is the FMP schema, not a ClickUp convention (J28)

Michael, 2026-11-14: *"FileMaker will be the actual storage for the data and the build. ClickUp will be the working surface that receives and normalizes the data."* And 2026-11-16: the call and report hooks are normalization **toward the FMP methods and schema**.

So the rule that governs every choice in this file: **normalize to MAWnster's grain, in MAWnster's vocabulary, and write nothing MAWnster would not hold.** A field that exists only because ClickUp cannot do something is marked a workaround the moment it goes in (J26's house rule), so it does not survive the migration it was meant to precede.

J24 is the framing to keep: *"you're just doing the FileMaker automation until we have the FileMaker schema built."*

## The target tables (J22, J27, J31)

Calls are deliberately thin. Two tables, no extensions.

**`CALLS`** -- one row per event call document, permanently. Carries the production link, the event link, the author, the issued time, and the source. State is live or cancelled.

**`CALL_LINES`** -- one row per event x group-or-person x call time. Per-person exceptions (arrives late, leaves early, absent-notified) are their own lines, never a note squeezed onto someone else's.

A call line targets **`fkRole` XOR `fkAssignment`**, never both (W1).

No call type field. Event type lives once, on `EVENTS`, read through `fkEvent` (J22). A single call document routinely spans dry tech, techs, dresses and a show, so a type on the call would describe the email's shape rather than the work.

`CALL_LINES` and `REPORT_ATTENDANCE` share the person x event grain on purpose: called-versus-attended is a comparison between two tables, not a status field on either.

### Field names, conformed to MAWnster data standards

Read `apps/production-mawster/data-standards.md` in `mawizorek/maw-prose` before using any name from an older block. The conventions that bind this hook:

- `PrimaryKey`, UUID, never a serial. Never `pk_`-prefixed, never `pkCallID`.
- `fk<Parent>` for foreign keys: `fkProduction`, `fkEvent`, `fkRole`, `fkAssignment`, `fkCall`.
- `date_` + CamelCase for dates, `bool_` for booleans, `calc_` for calculations, `ovr_` for overrides where empty means inherit.
- `cu` prefix, camel, no underscore, for integration keys: **`cuEventTaskID`**, `cuProductionID`.
- Five audit fields spelled out on every table: `PrimaryKey`, `CreationTimestamp`, `CreatedBy`, `ModificationTimestamp`, `ModifiedBy`.

**Why this is not pedantry:** `ExecuteSQL` embeds table and field names as text, so a rename returns empty rather than an error. Names lock before any calc queries them. J20's original spellings (`pkReportID`, `date_start`, `notes_done`) were already corrected by Fiona on exactly this ground; do not reintroduce them from the old blocks.

`fkSupersedes` is **dropped** (J31). There are no call version rows.

## Identity: one call per event, permanently (J30)

Key = **`Production`** (the exact show, J26, narrowest) **+ the Production EVENTS task the call summons people to** (`cuEventTaskID`).

- An email covering several days is split into one candidate per event **before** matching.
- The umbrella (`URITP Productions` label) is derived by walking the relationship's parent chain. Never hand-set. It does not port to MAWnster; `PRODUCTIONS::fkParentProduction` replaces it.
- **No event match = UNMATCHED.** Flag it. Never create a call for it, never invent an event: only ClickUp authors events (W1).

## Authority over a call

- **Only the Production Calls intake address creates or changes a call.**
- **A report's next-call block is a WITNESS, never a source.** It corroborates the call or raises a named mismatch. It cannot create, edit or cancel one.
- **Order changes by the SM's send time** read from the forwarded header. Never by ClickUp's created time: forwards arrive late and out of order.

## Update in place (J31)

The first call email for an event becomes the call task. Every later email edits that call's lines in place and appends one receipt line. The later intake task is closed and task-linked to the call. History lives in the surviving source emails and the receipt, not in version records. There is no superseded state.

## Outcomes -- every intake task gets exactly one

Lines are compared as a normalized set: target as written, resolved role or assignment, time, location, note.

1. **NEW** -- no call exists for the key. This task becomes the call.
2. **APPLIED** -- differs from the call and was sent later. Lines updated, diff written in plain words (`+ Actor A 6:00p`, `Crew B 6:30p -> 7:00p`, `- Actor C removed`), task closed as applied and linked.
3. **APPLIED (DELTA)** -- an email listing only changes. Applied onto the current lines, marked delta. A delta **never** replaces the full set; that silently un-calls everyone it does not mention.
4. **DUPLICATE** -- same line set. Task closed as duplicate and linked, source added to the receipt, nothing on the call changes. Not merged: a merge destroys a separate source object.
5. **STALE** -- differs but was sent earlier than the last applied email. Noted, flagged, changes nothing.
6. **CANCELLATION** -- call or event cancelled. The call's state becomes cancelled. Never a deletion.
7. **UNMATCHED** -- no event. Flagged, not imported.

## Accuracy checks -- run on every NEW and APPLIED change

Each failure is a named flag on the receipt. Never a silent fix; source wording is preserved verbatim.

- **Date / weekday agreement.** `Tuesday 9/29` must be a Tuesday. A disagreement is flagged, not resolved by picking one.
- **Event fit.** Call times sit at or before the event window from Production EVENTS. A call after the event ends, or on a different date, is flagged.
- **AM/PM sanity.** Times read against the event's time of day: a `6:00` call for an evening rehearsal is 6:00p.
- **Target resolution.** Each line resolves to exactly one role XOR one assignment. Ambiguous or unresolved names are flagged and spelling is kept as written.
- **Dropped people.** Anyone on the call before the change and absent after it is listed by name. An unannounced drop is the most dangerous error a call can carry.
- **Witness cross-check.** The most recent report's next-call block against the call, each disagreeing line named.
- **Missing call.** An event in the next 48 hours that calls people and has no call is a finding, the same species as a report that never arrived.
- **Restricted content.** Health, body, injury, allergy, accommodation text stays fenced and restricted (J23). Default when unsure is restricted.

## Receipt -- one comment on the call, appended per source email

```
<SM send time> - outcome - source: <intake task link> - diff: <plain words> - dropped: <names or none> - flags: <named checks or none>
```

## What ClickUp holds, and what it does not (J27)

**No new ClickUp fields for calls.** Normalization uses what the list already has, plus task links and the receipt comment.

- The raw forwarded email stays as a comment. The description becomes the clean record: the house's own **Original Statement / CUT & TRIMMED** vocabulary (FMP Tables, Report Imports), not invented source/record names.
- The call -> event link is a task link.
- A standardized source filename is recorded on the task as text. ClickUp attachments cannot be renamed by an agent; the name is applied when the file goes into an FMP container.
- Inherited `BASELINE_*` fields are unwanted. Never build on them. `_Temp` is fine (Michael: *"_temp i love"*).
- **Call targets are never built as `URITP People` or `URITP Assignee`.** Both are flagged duplicate "who" fields; the real target is a role or an assignment, resolved in MAWnster.

### Fields on Production Calls worth using

- `Event Begins` `ce248b20-c746-4ee1-8eba-c4e3136bf427` and `Event Ends` `149454b1-ba25-4d3a-8787-f340361f69e9` -- the event window the call is checked against.
- Notes `63506962-b7ee-4f06-855d-a66c03b4947a` -- the condensed one-liner.
- Resolve every option ID from the live field before writing a dropdown or label value. Option IDs are not recorded here on purpose: a stale ID writes the wrong value silently.

## Authority -- what this hook may write

1. Normalizing an intake task: description, the existing fields above, task links, the receipt comment.
2. Closing an intake task as applied, duplicate or flagged, and linking it to the call.
3. Editing the call's lines in place when a later source says so.

**NEVER:** delete a call or an intake task, edit or delete the raw forwarded comment, invent an event, create a call for an unmatched email, merge two sources, attach a new field to the list, define a status, send or draft any email, or write live call content into this public repo.

## Idempotence

A rerun over the same intake tasks changes nothing: no line edits, no new links, no repeated receipt lines. A source already closed and linked is left alone.

## Known limits -- verified 2026-11-16, say them out loud when they bite

- **This hook has never run.** No call has been normalized under these rules. The first run is a first run and reports itself as one.
- **Production Calls has no `Production` relationship and no `URITP Productions` label attached.** Until Michael attaches the existing fields (J29, a manual step, an agent cannot attach a field to a list), identity can be resolved and stated but not stored. Normalization still runs; the link is recorded in the description and the receipt.
- **Three forwarded calls are sitting in the list unnormalized** and every custom field on all three is empty.
- **There is no per-show `| calls |` intake surface.** Big Love, One Acts and the SHOW template have call tasks; Becoming Curious, T.I.M.E., The Secretary and Songs for a New World have none. Calls arrive centrally instead, which is the J28 model working, but the asymmetry with reports is real and the report hook's intake-precondition finding does not transfer.
- **`fkEvent` requires EVENTS to exist in MAWnster** before a call can be entered. J19's hub path is blocked on URITP People's `SYNC_Run`, so events arrive by CSV or by hand until it is not.
- **Call generation from rehearsal blocks is future work.** `fkUnit` is nullable and the script-breakdown schema is undefined.
- Call statuses for live / cancelled, and source states for applied / duplicate / flagged, are Michael's to define. An agent cannot define a list's status set.

## Provenance

Built 2026-11-16 in the REPORT + CALL bulk dump session, on Michael's instruction that both hooks normalize toward the FMP methods and schema. The rules are not new: identity, authority, outcomes, the accuracy checks and the receipt were ruled as J30 and J31 on 2026-11-14 and recorded in `hooks/reports-intake.next-build-spec.md`. **That spec remains the ruling record; this file is the procedure.** Where they disagree, the spec and the Decision Log win and this file gets corrected.

The schema is Fiona's (J20 as amended by J22, J27 and J31, with the data-standards names). The W1 workshop converged on *one intake, one parser, two record types*; shipping the call side as its own file is a deliberate departure in favour of a legible pair of hooks, and it is flagged for Michael rather than quietly decided.
