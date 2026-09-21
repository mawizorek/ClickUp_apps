# agent-load — RATIONALE

> **Read this ONCE. The thing you must obey is [`next-build-spec.md`](./next-build-spec.md).**
>
> Split from the contract at birth, on Size Sally's forecast: the contract is what a future session must read whole, the rationale is what it reads once. **Every file in this repo that blew its editability ceiling did so by keeping both in one place until neither could be edited.** `f1-racetracks`' `source/09` (29,446 B) and `README.md` (26,076 B) now need a full port to change a footer string. Do not merge these two files.

---

## Why an app at all

Because ClickUp cannot do it. Not "does it awkwardly" — **cannot.** The native Workload view measures real assignees, and `Agent Assignee` is a multi-select **Labels** field. A row with four agents belongs in four groups at once, which no grouping can express. This was checked before proposing a build, and the check is the reason the build is justified.

What *did* exist: Michael's own **Agent Assignments** view, cut 2026-09-21 03:52, filtered `Agent Assignee IS SET` with closed shown. **Reported rather than duplicated.** The View Sprawl Gate is why anyone looked.

## Why not AgentGlass

AgentGlass's purpose is LOCKED (2026-07-25) to making **agent work** visible: liveness, narrative legibility, shadow cost. Its ingest is a comment pipe parsing telemetry blocks off the Activity Board.

This app's noun is **assignments** — a custom field on production tasks. Different subject, different source, different read. Folding it in would have meant expanding a locked spec to reach a thing it was not built for. **Frank's verdict was MERGE with `inbox-digest-report`'s shape, not FOLD-IN to AgentGlass.**

What we did take from AgentGlass, because it is a hard-won lesson and not a feature: **the snapshot pill, and its second documented limitation — *silence reads as health*.** A crashed feeder emits nothing and renders as calm.

---

## The three arguments that changed the build

### 1 · Lena: the paste step was a strawman

Michael wrote *"pull the data from the cu view, paste it into the json."* The first reply read that as *Michael pastes by hand* and argued against hand-copied snapshots going stale.

**He never said that.** He described **a hook that pulls, then pastes** — one actor, two steps. The rebuttal answered a position nobody held.

The correction matters beyond politeness: it relocated the real question. **Not who pastes. What fires.** That question was genuinely open and had been buried under the strawman.

### 2 · Cleo: delete the corpus, and the dictionary dies with it

The forecast was 529 rows ≈ 32KB, over the read cap, so the plan was 2-char codes plus a dictionary ≈ 17KB.

Cleo asked why the file stores 529 rows when the screen shows ~35 agent records, a co-occurrence matrix, a histogram and one drill-down. **That is ~7KB of sums.** The 32KB problem was self-inflicted: storing *source rows* in a *presentation file*.

What the aggregates cut bought, and it is more than bytes:

- **The rename-fragility class is gone, not mitigated.** No dictionary means nothing to look up.
- **Sharding is moot**, so the one-production beta needs no multi-show index.
- **The file is human-readable.** Michael can open it and see whether it is sane.

What it cost, recorded honestly because two of these are real:

- **No re-slicing without re-running the hook.** No new cut from stored data, ever.
- **No per-row provenance.** When it says Quinn has 219, you cannot click to which 219. Mitigated once: drill-downs kept **only** for narrative panels (tens of rows).
- 🔴 **Enzo's catch: the report becomes unfalsifiable by inspection.** The corpus version could be diffed row-by-row against ClickUp. An aggregates file can only be checked by re-running the thing that produced it. **This is why reconcile-or-abort is not a guardrail but a load-bearing member — it is the only verification this system will ever have.**

### 3 · Finn: there is no clock, and that is the product

The scheduler was retired 2026-07-26. The `routines` app was deleted 07-27 **because** that retirement turned a healthy app into a duplicate — *overnight, silently, with no defect and no commit.*

So *"renders on an audit or routine hook"* cannot mean scheduled. It means **a hook a session runs.** The honest guarantee is *"as fresh as the last session that worked this show"*: daily in tech, never in January.

**That is not a defect to hide, it is a property to disclose — which is what makes the stamp the entire safety mechanism rather than a nice touch.**

---

## Why the dictionary was never going to survive

Beckett did not theorise this. He pointed at an incident **in the session that produced this spec**: a hand-typed label ID was wrong (`51d213a5-4a71-…` for `51d213a5-41fa-4711-af83-cee837eed031`) and only surfaced because the API rejected it and listed all 45 valid labels.

**A mapping layer failed by hand, under a careful operator, on a 45-row set, while building this app's own feeder.**

And the live roster is actively hostile to string keys: 45 options, **16 registered this week** at `needs-declaration`, and `🖼️ Image Irene (Video Designer(` carries an **unclosed paren right now**. Fixing that typo changes the label string. Under a dictionary, **Irene does not error — she evaporates**, and the report reads as a real finding: *"Irene isn't doing anything."*

That is why `unmapped` renders loudly instead of being made impossible. Aggregates remove the dictionary; the bucket catches the roster moving anyway.

## Why the ugly-state fixture is mandatory

The fill finished at **zero unassigned**. So the report's headline number has **never once rendered anything but green**, because reality has not produced anything else.

Rhys's F1 is the shape of the eventual failure: eleven rows get added to Props next week (of course they do, it is September), they have no `Agent Assignee`, the JSON still says 529 / 0, and the board renders perfect. **The report is most wrong exactly when the folder is most active** — and a green board on a busy week actively suppresses the signal that would have made someone look.

**Every status board breaks first in a state it has never rendered.** Hence a committed fixture, not a runtime flag.

## Why the theme join is named in writing

`applyTheme()` takes a **JOIN** slug; `data-theme` takes a **COLOR** slug. Overlapping names, different namespaces. It has bitten `inciardi-collection`, bitten `f1-racetracks`, and was caught inside `git-grab`'s **already-reviewed plan** on 08-03 — the plan named a colour and got to review before anyone noticed.

So the contract names `eos` and marks it JOIN. `eos` is also correct on the merits, not taste: its stated use is *"Lighting/theatrical apps — ETC Eos console grammar."* A theatrical production report, for a lighting designer.

All four vectors were read at HEAD and confirmed populated, because `resolve.js` → `applyVector()` **faults on a missing row but never on a blank cell** — an open steward's-call defect sitting inside the file whose own header is a manifesto against silent fallbacks. And per the ledger, **`themes.css` has no generated `eos` block**, so a static join would have shipped an unthemed app.

---

## The warning this spec exists to answer

From the routines tombstone, and it is the most useful sentence in this repo:

> *a capability change UPSTREAM can orphan a downstream surface, and every duplicate-check we own runs at CREATION time. None of them re-run when the world changes.*

Frank ruled MERGE against the world **as it is today**, and his gate never fires again. So Enzo ran the question forward and found the orphan risk is not the app — **it is the `unassigned` number inside it**, which Morning Wake Up will also answer once wired.

Hence the seam in §7 of the contract, written while it is cheap: **count here, list there.**

## Scope discipline

Skye's observation, kept because it is the correct ratio and will look wrong to a future reader: **this build has more test scaffolding than feature surface.** Fixture, reconcile check, unmapped bucket, first-paint verify, four-vector theme check.

That is right for a status board specifically. All six routines defects were **honesty failures, not feature gaps** — D2 ran a wrong core field for three weeks in the app whose entire purpose was displaying that field. **You cannot test your way out of a wrong feature. You can absolutely test your way out of a lying one.**

So: scaffolding stays, features stay cut.

---

## Provenance

**Session:** Big Love (F26) Agent Assignee beta, 2026-09-20 → 21. All 529 rows tagged; 1,674 tag instances; 35 of 45 roster options in play.

**Frank:** MERGE (`inbox-digest-report` shape, not AgentGlass).

**Workshop, 7 mandatory + 2 supplemental:** Rhys (confident staleness, F1-F3) · Beckett (three attacks, the live dictionary incident) · Cleo (the aggregates cut) · Polly (five standards traps) · Finn (no clock, reconcile-or-abort, blob SHA) · Skye (boundaries, the scaffolding ratio) · Enzo (the Wake Up seam, PII) · **Sally** (re-forecast, the contract/rationale split) · **Lena** (the strawman, the theming requirement).

**Per-voice deliberation lives on the session task in the 🟢 Agent Activity Board, not here.** A working doc gets a synthesis and a pointer; the transcript stays on the task.

**Errors made and corrected in the originating session, recorded because the spec's rules descend from them:** the folder was reported as ~620 rows for most of the session (it is 529, caught by `COUNT(*)`) · closed rows were silently excluded until a subtask question prompted an audit · a label ID was typo'd · a stray invalid attribute shipped in the first artifact render.
