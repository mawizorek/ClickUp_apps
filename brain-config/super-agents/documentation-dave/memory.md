# 🗂️ Documentation Dave — memory

**This ledger is the reason Dave is a teammate and not a lens.** A formatter without a
memory re-litigates the same convention every session.

---

## Ledger A — house conventions (RULED, enforce these)

Seeded 2026-08-05 from the THTR 120 session. Every entry below was earned in a real
session, not inherited or assumed.

**A1 · The stamp is two artifacts.** The FACT is the final commit on the branch. The CONTENT
is a comment on the session task. No frontmatter key — `stamped_by:` fails the gold
standard's away-from-the-page test on its first clause. *(Cleo + Polly, 2026-08-05.)*

**A2 · 🔴 A stamped branch MERGES, it never squashes.** Squash collapses the commit history
and therefore destroys A1's mechanism. Found at ship time, after three brainstorm loops
missed it. **This constraint must travel with A1 or the next person silently deletes the
evidence.** *(PR #41.)*

**A3 · `N/A` is not `✅`.** A check that could not run is reported as `N/A — <reason>`.
Rhys's F3: a stamp that always passes stops being read.

**A4 · Provenance in HTML comments, never visible prose.** The reader does not need our
reasoning. The next author does. *(Extends Michael's standing slop rule, 2026-08-04.)*

**A5 · An invariant is not content.** A sentence that does not vary across the set, and
whose repeal would land on the rule rather than on N copies, belongs in a template and
renders on every page. Test: **where does a correction land?** *(Polly, 2026-08-05.)*

**A6 · Check the constraint against its purpose, not only the artifact against the
constraint.** A constraint written as a measurement can measure the wrong thing and pass
forever. Found twice in one session. *(Anna's OS-4, 2026-08-05.)*

**A7 · The first artifact in a declared set is a precedent.** Hold it to the rule that has
no exception; every later member inherits whatever exception was allowed. *(Frank +
Beckett, 2026-08-05.)*

**A8 · A template must obey the rule it teaches.** Caught live: the PM course template
specified `keywords` for every page it generates and carried none itself.

**A9 · Sparseness means the ASK, not the bytes.** How many decisions the template forces on
an author. A file can grow while getting sparser, because rules are not blanks.

**A10 · 🔴 NO EMOJI IN REPO DOCUMENTATION. HARD LINE.** *(Michael, 2026-08-14: "We need to
stop putting emojis in the documentation that goes into the repo. That needs to be a hard
line because it just looks gross! We have callouts for a reason, and they already have SVG
markers.")*

Emphasis in a rendered doc has exactly **two** sanctioned mechanisms, and both ship their
own art:

1. **Callouts** — `!!! danger` · `warning` · `failure` · `note` · `tip` · `abstract`.
   Block-level. Material renders an SVG icon per type.
2. **Inline marker spans** — `{.conf}` `{.tbc}` `{.gap}` `{.verify}` `{.hi}` `.calc` `.rel`
   `.script` `.global` `.portal` `.button` `.field` `.vl` `.alias`, defined in
   `doc-render-engine/theme/markers.tsv`. Rendered as chips from generated CSS **and counted
   in the build report.**

⭐ **The argument is structural, not aesthetic, which is why it generalizes:** a literal
emoji is a **THIRD CLAIMANT on emphasis**, duplicating two mechanisms that already exist —
the same defect class this fleet has deleted five times elsewhere. It is also strictly worse
than either. A callout states *what kind* of warning; a marker span is *queryable*; `⚠️` is
neither, and it renders as a coloured picture that a reader cannot filter, count or click.

🔴 **ROOT CAUSE, and the reason this is not a taste dispute: the emoji were standing in for
structure the author did not reach for.** Same root as the 2026-08-09 defect where eleven
pages shipped carrying literal `⬜`/`🔴` and **zero** marker spans, so the build report
called the tree clean. **That was caught as a REPORTING failure; this was caught as an
AESTHETIC one. One cause, two symptoms, five days apart** — which is what promotes it from
a preference to a rule.

**Conversion table (reference implementation:
`uritp-docs/production-mawster/print-first-runbook.md`, PR #98):**

| Was | Now |
|---|---|
| `🔴` hard stop | `!!! danger` |
| `⚠️` caution | `!!! warning` |
| `🚫` prohibition | `!!! failure` |
| `⭐` insight | promoted into the callout it belonged in, or plain bold |
| `✅` decided | nothing — `{.conf}` already says it |
| `⬜` open | nothing — `{.tbc}` / `{.gap}` say it AND report it |
| emoji in a heading | plain heading |

⚠️ **SCOPE IS REPO DOCS, and do not widen it without a ruling.** NOT ClickUp comments, NOT
Decision Logs (whose Gold Standard uses emoji as a documented convention), NOT agent announce
headers, NOT chat. Different surfaces, different rules, and Michael ruled on one of them.
**This file is itself outside the scope** — it is an agent bundle, not rendered documentation.

⭐ **The tell that a page needs this pass: an emoji immediately followed by a bold sentence.**
That is a callout that never got written. Converting it usually makes the rule read *harder*,
not softer, which is the argument for the change rather than against it.

---

## Ledger B — Michael's revealed preferences (observed, NOT ruled)

⚠️ **Leads to verify, not facts to quote.**

**B1 · He states constraints as ranges and expects a choice.** "3–10 headers" was tolerance
for a page; applying it to a template required picking one number. He was told it was an
inference. **Whether he accepts that pattern is unconfirmed.**

**B2 · He names benchmarks by pointing at an existing artifact** ("as sparse as the one we
made for course index") rather than by giving a number. The benchmark file is the spec.

### 🆕 B3–B10 · FMP APP DOCS — read off his own EDITS, 2026-08-08

**How these were obtained, because the method matters more than the list:** Michael asked
Fiona and Dexter to *"review the pushes i made during this session and see what I EDITED
from what you made."* Eleven tables and six prose pages were drafted by agents and then
rewritten by him in-place, five times, mid-session. **The diff is the style guide** — and it
is a far better source than asking him to describe his preferences, which B2 already says he
does not do.

🚦 **Every entry here is a LEAD, not a ruling.** He edited; he did not legislate. Confirm
before enforcing against anyone.

**B3 · 🔴 FOLDER NUMBERING GOES IN TENS, NOT UNITS.** Agents wrote `02-tables`, `07-scripts`,
`09-file-imports-temp`. He renamed all three to **`20-`, `70-`, `90-`.** Units leave no room
to insert; tens do, and he immediately used the space (`10-user-experience`, `11-runtime`).
**Sequence numbers are an ordering INTERFACE, so leave gaps.**

**B4 · 🔴 THE FIRST COLUMN OF A FIELD MENU IS A STATE, NOT AN ORDINAL.** Agents wrote `1, 2,
3…` as an `id`. He replaced the numbers with **`{.conf}`** — a confirmation marker, the
sibling of the `{.tbc}` already in use. ⭐ **This is the single biggest miss of the session:**
the column was read as "sort order" and it is actually **"has this field been confirmed
against the live build."** A `.tsv` is not a static list, it is a build tracker.

**B5 · Field names carry a LOWERCASE TYPE PREFIX.** `DateFirstRehearsal` → `date_FirstRehearsal`
· `AddPreProWeek` → `bool_AddPreProWeek` · `CU_ProductionToken` → `cuProductionToken`. So:
`date_` · `bool_` · `calc_` · `g_` · `fk` · `cu` (integration keys, camel, no underscore).
⚠️ **`data-standards.md` in that app documents only `calc_`, `g_`, `fk` and is therefore
STALE against his own live practice.** The doc lost to the diff.

**B6 · The `.tsv` mirrors FMP's actual field dialog, column for column.** He added an
**`Options`** column between `Type` and `Notes`, because that is what the Manage Database
window shows. **The document is a facsimile of the tool's own screen**, which is why an
agent-invented column order reads wrong immediately.

**B7 · CASE CARRIES MEANING ACROSS THE PAIR.** `PRODUCTIONS.tsv` (uppercase — it is the FMP
table name, verbatim) beside `productions.md` (lowercase — it is a document, not a table).
Agents wrote both uppercase and he corrected the `.md` side four times.

**B8 · Sections are BARE ROWS in the tsv, and singular.** `NORMALIZED FIELDS` · `INTEGRATION
KEYS` · `RELATIONSHIP` (**not** RELATIONSHIPS) · `CHILDREN` · `AUDIT FIELDS`, closed by a
**`- EOF -`** row. The EOF marker is a truncation tripwire in a format with no closing brace.

**B9 · Audit fields are SPELLED OUT, not referenced.** Agents wrote
`[[Audit Fields](@audit-fields)]{.hi}`; he expanded all five (`PrimaryKey`,
`CreationTimestamp`, `CreatedBy`, `ModificationTimestamp`, `ModifiedBy`) on every table.
⚠️ **Reads as a deliberate exception to point-never-copy:** the tsv is a BUILD CHECKLIST, and
you cannot check off a pointer while sitting in the field dialog.

**B10 · A field name states the CONCEPT, never the current format.** `PDF_Path` →
**`ExportPath`**, because the output might not be a PDF. Also his `*Display` pattern —
`TitleDisplay`, `NameDisplay`, auto-enter calc — appears on every entity table.

### The one that cost a near-miss

**B11 · 🔴 HIS RATIONALE-SPLIT SUFFIX IS `<file>-dl.md`.** Dexter independently invented
`README.md` for the same job and was one merge from shipping a rival beside `publish-dl.md`,
which Michael had already created. **Before writing a rationale / notes / ADR file, list the
directory and look for the sibling that already owns it.** *(Fifth second-claimant near-miss
of that session and the only one an agent caused.)*

### The meta-lead, and it is the useful one

**B12 · ⭐ HE EDITS IN PLACE, MID-WRITE, AND HIS VERSION IS BETTER EVERY TIME.** Five merge
conflicts in one session from his local pushes landing inside an open PR. **Both Fiona and
Dexter independently recorded the same rule: re-read HEAD and rebuild on top of his version;
never merge over him.** For Dave specifically: **a stamp taken against a diff is void, and on
this workspace that is not theoretical.** Load the artifact at HEAD, always — which his own
load manifest item 7 already says.

---

## Ledger C — where documents actually go wrong here

🔴 **STILL EMPTY OF RECURRENCE.** This ledger fills from failures observed across MULTIPLE
sessions. The 08-08 material above is one night of one project, so it is filed as revealed
preference (B) rather than as a documented failure mode (C). **A cold session that finds this
empty says so rather than inventing a pattern.**

⚠️ **One candidate now has two sightings and is worth watching:** *a naming/format convention
is invented by an agent while the human's own convention already exists in the tree* — the
`README.md`-vs-`publish-dl.md` near-miss (08-08) and the `keywords`-keyword incident (08-05,
logged in the guardrails). **Third sighting promotes it to C1.**

⚠️ **Second candidate, two sightings, 2026-08-09 and 2026-08-14:** *an author reaches for a
literal emoji instead of the structural mechanism that exists* — once surfacing as a silent
reporting failure (zero marker spans across eleven pages), once as Michael's aesthetic
objection. Filed here rather than promoted because both sightings are the same author on the
same project. **A third sighting by a different agent, or in a different tree, promotes it to
C1** — and if it does, the fix is a pre-write check, not another ledger line. See A10.

---

## Ledger D — open questions Dave owes Michael

**D1 · Does the stamp apply to every shipped document, or only to declared sets?** Stamping
everything makes it routine, and routine is how A3 dies. Unruled.

**D2 · Where does the checklist itself live long-term?** It is currently prose in this
bundle. If it becomes a tool it belongs in `hooks/`, not in a person. **Procedure-is-a-tool
gate applies and has not been run on it.**

**D3 · Should B3–B10 be promoted out of Dave and into the FMP app-doc standard?** They are
conventions for a DOCUMENT TYPE (an FMP table doc), which sounds like Fiona's documentation
standard or `data-standards.md`, not a person's memory. ⚠️ **`data-standards.md` is already
provably stale against B5**, so promoting them would also fix that. **Placement is Maggie's
call, the content is Fiona's domain, the FORM is mine. Unruled — do not self-authorize.**

**D4 · 🆕 🔴 A10 HAS NO FIRING SURFACE, AND THAT IS THE WHOLE PROBLEM WITH IT LIVING HERE.**
Dave has **no autonomous triggers** and is *"seated, usually last"* — so a rule that exists
only in this ledger does not fire when another agent writes a page at 2am unseated, **which
is exactly how the 08-13 runbook shipped covered in emoji.** A10 is filed here because Ledger
A is the precedent-matched home (A4 is the identical class of rule) and because a hard line
unwritten is not a line. **But precedent-matched is not the same as load-bearing.**

The fork, stated so it is not re-derived: leave A10 here and accept it only fires when Dave
is seated · **or** promote it to a pre-write check that fires on every repo doc write, which
by the procedure-is-a-tool gate means a `hooks/` file with a pointer left here. The second is
probably right and is **a net-new tool, so it needs Fold-in Frank and Michael's yes** rather
than Dave's own judgment. ⚠️ **Until that is ruled, A10 is a convention an unseated agent can
miss without anything catching it** — say so rather than implying the line is enforced.
