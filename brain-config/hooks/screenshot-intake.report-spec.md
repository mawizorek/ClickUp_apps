# Screenshot Intake · CLUSTER MAP — Report Spec

**Purpose:** The fixed output form for `hooks/screenshot-intake.md` Pass 1. **A cold agent copies this verbatim and fills the slots. It never invents report structure.**

**Steward:** Fleet Felix (inherited from the hook). ⚠️ **Proposed re-steward: Documentation Dave** (`documentation-dave`, Agent Index status `inventory-only`) — house-style output formatter is exactly his stated lane. Blocked until Michael activates him; until then Felix holds it.

**Established 2026-08-04.** Split out of the hook because (a) the hook was approaching the ~22KB measured read-whole ceiling and (b) a form is a thing you copy, so it should be fetchable alone.

---

## Why this file exists

Every agent that writes its own report writes a slightly different one. Across four passes on the same folder that produces four incomparable documents, and the fifth agent cannot tell what changed. **The form is fixed so the CONTENT is the only variable.**

Two hard rules on every field below:

1. **Every claim carries its evidence class.** `seen` (an image was opened) · `inferred` (derived from timestamps/adjacency) · `correlated` (matched to a dated workspace record, name it) · `unknown`. An unlabelled claim is a defect.
2. **Counts must reconcile.** `sorted + strays + unscanned = total`. If they do not, say so rather than adjusting a number.

---

## THE FORM — copy verbatim

```
# CLUSTER MAP · <folder> · pass <N> of <est. total>

## Run header
Total in folder:      <n>          (index read WHOLE — never partial)
Date span in folder:  <oldest> → <newest>
Clusters detected:    <n>          (from the time skeleton, whole folder)
This pass covered:    clusters <a>–<b>  ·  <n> files  ·  <n> images opened
Budget:               <n> of <n> image opens consumed
Carried forward:      clusters <c>–<z>  ·  <n> files  ·  see handoff
Cull flagging:        OFF (default) | ON (Michael requested)
Bytes changed:        0            (Pass 1 is read-only. If this is not 0, the pass ran wrong.)

## Clusters

### C<nn> · <project name | UNIDENTIFIED>
Files:      <n>
Span:       <YYYY-MM-DD HH:MM> → <YYYY-MM-DD HH:MM>  (<"4-min burst" | "3-hr session" | "recurring over 5 weeks">)
Shape:      burst | session | campaign | singleton
Subject:    <one line — what these are of>
Evidence:   seen (<n> of <n> opened) | inferred | correlated → <the record, with link>
Duplicates: <n> — <burst near-dupes | re-captures on <dates> | already captured on <task/doc + link> | none>
Sequence:   <"reads before → error → fix" | "no order" >
Likely lane: <resolved from Agent Index Lane, or "unresolved">
Notes:      <anything that would change how Michael reads it. Omit if none.>

(repeat per cluster, chronological, never re-sorted)

## Strays  (not screenshots — never image-classified)
- <filename> · <size> · <date> · <what it is> · <proposed real home, or "unknown">

## Judgement calls
- SPLIT C<nn> → C<nn>/C<nn> because <reason>
- MERGED C<nn> + C<nn> because <reason>
- (or "none — every cluster fell on a clean time gap")

## Unresolved
- C<nn> — <what you could not determine, and what would settle it>

## Reconciliation
<n> sorted + <n> strays + <n> not yet scanned = <n> total  ✅ | ❌ MISMATCH: <say so>

## Ask
Which clusters do you want worked, and how?
```

---

## Field rules

| Field | Rule |
| --- | --- |
| `Total in folder` | From a WHOLE index read, paginated to `has_more: false`. Never an estimate, never a partial. |
| `Clusters detected` | Across the **entire** folder, even the part this pass did not open. The skeleton is cheap; compute it all. |
| `Bytes changed` | Always `0` in Pass 1. It is printed precisely so a violation is visible. |
| `C<nn>` ids | Assigned once, chronologically, in pass 1. **Immutable across passes** — a later pass never renumbers, or the handoff stops resolving. |
| `Shape` | `burst` <2 min · `session` one sitting · `campaign` same subject recurring across dates · `singleton` one shot alone. |
| `Evidence` | Mandatory. `correlated` must NAME the record it matched. "Probably the theme migration" is `inferred`, not `correlated`. |
| `Subject` | Describe only what is visible. Never infer content from a filename. |
| `Duplicates` | A finding. Never a recommendation to delete. See THE CULL RULE in the hook. |
| `UNIDENTIFIED` | A legitimate, expected outcome. Never invent a project to make the map look complete. |
| `Notes` | Omit when empty. An empty field is noise; a missing one is clean. |

---

## Where it goes

Post the map as a **comment on the session task** on the 🟢 Agent Activity Board, never only in chat. Chat is not a record and a multi-pass job needs one. Michael gets the highlights in prose in the reply; the full form lives on the task.

---

## Changelog

- **v1 (2026-08-04)** — Established. Split from `screenshot-intake.md` at v4 on two grounds: the hook was nearing the measured ~22KB read-whole ceiling, and a form should be fetchable without its procedure. Evidence-class labelling and count reconciliation are mandatory from birth because the failure this prevents is a confident map nobody can check.
