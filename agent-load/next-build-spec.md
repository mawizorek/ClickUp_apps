# agent-load — BUILD CONTRACT

> **STATUS: SPEC ONLY. Nothing is built.** No `index.html`, no Pages URL, no renderer, no JSON. This file is the contract a build must satisfy.
>
> **This file is the CONTRACT. The reasoning is in [`RATIONALE.md`](./RATIONALE.md) and is read ONCE.** Split at birth on Size Sally's forecast: every file in this repo that blew its ceiling did so by keeping contract and rationale together until neither could be edited. **Do not merge them back.**

**What it is:** a passive, rendered report of who is carrying a production, read from the ClickUp `Agent Assignee` labels field. Michael's ask, verbatim: *"a specified json in the repo and read by an app to give a similar report (in my object and theming standards) that renders on an audit or routine hook."*

**Beta scope: Big Love (F26) ONLY.** One production, one JSON, one renderer, one hook. Out of scope and deliberately so: multi-production, any season index, a fleet-wide roll-up, Morning Wake Up coupling, the queued Rodis lane fix.

---

## 0 🔴 BLOCKER — THIS APP CANNOT BE LEDGERED YET

**`VERSIONS.md` measured 22,363 B at HEAD 2026-09-21** (root listing, `agent-load-spec` branch). Its own stated budget is *"target ~16KB, ceiling ~22KB"*. **It is AT its ceiling with ~165 B of headroom.**

Consequences, both real:

1. **A full read clips.** 22,363 B base64-inflates to ~29.8KB against a ~30KB return cap — the exact trap the ledger documents (*"a blob-API read CLIPPED a 16,829 B file on 08-03"*). A read of it during this session returned a table **missing `audio-compressor` and `doc-sandbox`**, both live root folders. Either the read clipped or the coverage rule is already breached. **Do not rewrite that file from a single read; that is how content gets silently deleted.**
2. **So the `agent-load` row is OWED BUT NOT WRITTEN.** The coverage rule (*every root folder is in the table or on the not-apps line*) is unsatisfied for this folder, deliberately and visibly, rather than satisfied by a risky whole-file rewrite.

**Unblock, in this order:** take one of the two parked row-moves (`f1-racetracks` ~2.7KB or `inciardi-collection` ~2.8KB → their app READMEs) → re-measure → reconcile the two missing folders → then add this app's row. **That is a ledger maintenance task, not part of this build, and it needs Michael.**

⚠️ **Any future session that builds this app must still satisfy §6's ship gate item 4. It cannot, until the above is done.** This is the honest state, recorded rather than worked around.

---

## 1 · Precedent (follow it, do not reinvent it)

**`inbox-digest-report`.** A pure renderer over a `data/*.json` the app never writes. Its `data/README.md` is the field spec. Copy that shape.

🚫 **NOT AgentGlass.** AgentGlass's purpose is LOCKED to agent **runs** — liveness, narrative, shadow cost. This is **assignments**. Different noun, different ingest. Do not fold this in; do not extend that spec to reach it.

🪦 **READ [`../routines/next-build-spec.md`](../routines/next-build-spec.md) BEFORE BUILDING.** It is the tombstone of a deleted app of exactly this shape, and its six defects are this app's test plan. Section 6 below inherits them explicitly.

---

## 2 · Source of truth

| Thing | Value |
| --- | --- |
| Field | `Agent Assignee`, workspace-scoped **Labels** (multi-select) |
| Field id | `70384078-b97f-40c9-b626-3cdf4dcf9cc2` |
| Folder | Big Love (F26) · `901317863893` |
| Browsing view | **Agent Assignments** · `12cwjm-65093` (Michael's, cut 2026-09-21) |
| Roster | 🤖 Agent Index list `901328043244` — the `Lane` field, read at run time |
| Scope | **subtasks AND closed rows INCLUDED** (Michael's ruling) |

⚠️ **ClickUp's native Workload view cannot do this job.** It measures real assignees (users). `Agent Assignee` is a Labels field, and a multi-select cannot group cleanly — one row with four agents belongs in four groups at once. **A rendered report is the only available mechanism, not a preference.** Do not "simplify" this app into a native view; it was tried and it is structurally impossible.

---

## 3 · The JSON — AGGREGATES, NEVER THE CORPUS

🔴 **THE FILE STORES SUMS, NOT SOURCE ROWS. THIS IS THE LOAD-BEARING DESIGN DECISION.**

The renderer displays ~35 agent records, one co-occurrence matrix, a seat histogram and one drill-down. That is **~7KB of aggregates**. Storing the 529 source rows instead costs ~32KB (over the read cap), forces a 2-char-code dictionary, and that dictionary is a rename-fragility surface with a **live incident already on file** (see RATIONALE). Storing sums deletes that entire failure class rather than mitigating it.

🔴 **THE KEY IS THE FULL LABEL STRING. There is no dictionary, no code map, no id table.** Never add one.

Path: `agent-load/data/big-love-f26.json`

```json
{
  "schema_version": "1.0",
  "generated_at": "2026-09-21T11:40:00Z",
  "generated_by": "Brain",
  "scope": {
    "production": "Big Love (F26)",
    "folder_id": "901317863893",
    "source_view_id": "12cwjm-65093",
    "field_id": "70384078-b97f-40c9-b626-3cdf4dcf9cc2",
    "includes_subtasks": true,
    "includes_closed": true
  },
  "reconcile": { "count_query": 529, "rows_received": 529, "agreed": true },
  "totals": {
    "rows": 529, "tag_instances": 1674, "avg_seats": 3.16,
    "unassigned": 0, "unmapped": 0,
    "agents_present": 35, "roster_options": 45
  },
  "groups": ["HOUSE / OFFICE", "BODIES", "ROOM", "LIGHT / SOUND / VIDEO", "CLOTH / OBJECT"],
  "agents": [
    {
      "label": "🔦 Callboard Quinn",
      "group": "HOUSE / OFFICE",
      "total": 219, "primary": 109, "support": 110,
      "co": [["🎬 Intent Ilya (Director)", 82], ["🎭 Mainstage Milo", 65]]
    }
  ],
  "seat_distribution": [[1, 10], [2, 49], [3, 314], [4, 156]],
  "drilldown": {
    "unassigned": [],
    "unmapped": [],
    "spotlight": { "label": "🤝 Rapport Rodis (Consent & Intimacy)", "rows": [] }
  }
}
```

### Field rules

| Field | Rule |
| --- | --- |
| `generated_at` | ISO-8601 UTC. **Drives the stamp and the pill. Never omit, never fake.** |
| `reconcile` | Written by the hook from its own two reads. `agreed:false` must never reach a committed file (§5 aborts first). |
| `totals.unassigned` | A **COUNT**. See the seam in §7. |
| `totals.unmapped` | Tag strings on rows that matched no Agent Index roster row. **Renders loudly or the app is lying.** |
| `agents[].total` | `primary + support`. Order of the labels on a task decides primary: **index 0 is primary**, the rest are support. |
| `agents[].co` | Top 8 collaborators, descending. Capped at 8 to hold the size forecast. |
| `drilldown` | The ONLY place individual rows appear, and only for narrative panels (tens of rows, never hundreds). |

⚠️ **When the app is built, `data/README.md` becomes the field spec and this section is struck with a pointer to it. ONE claimant on the schema, always.** Two claimants on one truth is what retired `registry.json` and killed the routines app.

---

## 4 · Theming — VERIFIED, NOT GUESSED

🔴 **JOIN SLUG: `eos`. It is a JOIN, not a colour.** Pass it to `THEMES.applyTheme('eos')`. The `data-theme` DOM attribute takes a **COLOR** slug and these are different namespaces with overlapping names. Passing a colour to `applyTheme()` faults — it has bitten `inciardi-collection`, bitten `f1-racetracks`, and was caught inside `git-grab`'s *already-reviewed* plan. **Three strikes on this one line. Do not be the fourth.**

**Why `eos`:** its stated intended use is *"Lighting/theatrical apps — ETC Eos console grammar."* This is a theatrical production report for a lighting designer. It is the correct join on the merits, not on taste.

✅ **All four vectors verified populated at HEAD 2026-09-21** (Polly's pre-write check, because `resolve.js` → `applyVector()` faults on a missing ROW but **never on a blank CELL**, so a half-filled row applies a half theme in silence):

| Vector | Row | Verified |
| --- | --- | --- |
| color | `eos` | 35/35 columns · dark · accent `#e0459b` · `text` `#ecbd5b` (tombstone gold) |
| typography | `eos` | 9/9 · Chakra Petch display / Inter body / JetBrains Mono |
| forms | `eos` | 14/14 · radius 3px, fast 90ms motion |
| spacing | `eos` | 6/6 · touch 40px, pad-cell 6px |

⚠️ **`themes.css` was GENERATED 2026-07-16 and has NO BLOCK FOR `eos`.** A static stylesheet join will silently produce an unthemed app. **This app MUST resolve at runtime through `resolve.js`.** Verified against the ledger, do not skip.

🚫 **Do NOT inherit `template-app`'s `--s1`…`--s8` spacing ramp.** It uses bare `var()` with no fallbacks; one unresolved token invalidates the whole declaration and reverts padding to `0`, silently collapsing every gutter. **Copy `qr-forge`'s refusal:** local tokens with labelled fallback floors.

🔴 **Ship `[hidden] { display: none !important }` in this app's own CSS.** `qr-forge` v1.0 shipped a class `display` that silently defeated the `hidden` attribute on six elements; the access gate covered the whole app on every load while config correctly said `open`, and the DOM read as perfect. One line prevents it.

---

## 5 · The hook — WHAT FIRES, AND WHAT IT REFUSES TO DO

🔴 **THERE IS NO CLOCK IN THIS SYSTEM.** The routine scheduler was retired 2026-07-26 and the `routines` app was deleted the next day *because* that retirement orphaned it. There is no cron, no worker, no timer. **A hook is something a session runs.**

**Therefore the freshness guarantee is, exactly: "as fresh as the last session that worked this show."** Daily during tech. Never in January. **This is a disclosed property, not a defect — and the stamp in §6 is the entire mechanism that makes it honest.**

**Fires on:** Big Love session close · manual `/agent-load`.

🚫 **Does NOT fire on workspace-wide session close.** A feeder that taxes unrelated work gets resented and then disabled.

### Steps

1. `SELECT COUNT(*)` scoped to the folder, subtasks and closed included → **the denominator.**
2. Paginated row pulls (~200/180/150 observed) → sum what actually arrived.
3. 🔴 **RECONCILE OR ABORT.** Denominator ≠ received means **write nothing** and report the mismatch. **Never write a partial: a short file renders as real.** This check is proven on live data — it is what caught the 620-vs-529 error.
4. Resolve every tag against the Agent Index roster. Unmatched strings → `totals.unmapped` + `drilldown.unmapped`. **Never drop one silently.**
5. Aggregate. Compute `avg_seats` from `tag_instances / rows`, never carry it forward from a previous run.
6. 🔴 **Fetch the blob SHA at `refs/heads/main` IMMEDIATELY before the write, every run.** Never a cached SHA. **Never a raw branch URL** — it is cache-frozen and has served content ~280 PRs stale.
7. Write via branch → PR → self-merge. **Never straight to `main`.**

🚫 **The hook writes ONE file: the JSON.** It never edits the renderer, never edits this spec, never writes a second log.

---

## 6 · The honesty layer — INHERITED DEFECTS

Each row is a defect that actually shipped in the deleted `routines` app. **The governing rule it produced: derive, don't declare — and never render a guess as a fact.**

| # | What shipped | What stops it here |
| --- | --- | --- |
| **D1** | A hardcoded header card that kept printing a schedule after the scheduler was retired | **Nothing in the renderer is hardcoded.** Every number comes from the JSON. No literals. |
| **D2** | *"Last run: never"* for **three weeks**, in the app whose whole job was showing last-run | **`generated_at` is mandatory.** A missing/unparseable stamp renders **`⚠️ CANNOT READ STAMP`**, never a date, never "never". |
| **D3** | A day-strip showing 2 days for a 4-day routine (substring matching) | No string-sniffing anywhere. Labels are matched **whole**, never by substring. |
| **D4** | Retirement inferred from prose by regex | No prose parsing. Roster state comes from the Agent Index **field**. |
| **D5** | Clock vocabulary for a system with no clock | **No "today", no "overdue", no "due".** The only time word this app may use is the stamp and its age. |
| **D6** | 🔴 On fetch failure it rendered **hardcoded sample rows as real** | **On any fetch/parse failure the app renders an ERROR STATE and no data.** *A status board that invents plausible rows when it cannot reach its source is a lie generator.* |

### Three states that must never look alike

**`0 unassigned` (verified) · `unassigned unknown` (stale or unreadable) · `cannot reach the JSON` (broken).** D2 is proof that collapsing two of these runs wrong for weeks without anyone noticing.

### Required surfaces

- **STAMP** — `generated_at` + its age, always visible. Never *"529 rows"*; always *"529 rows as of &lt;stamp&gt;"*. **A count with no asof is a claim pretending to be a fact.**
- **SNAPSHOT PILL** — reads `snapshot`, never `live`. Borrowed from AgentGlass, which carries the sibling warning: **silence reads as health.** A crashed feeder must not render as a calm green board.
- **UNMAPPED BUCKET** — renders loudly: red row, count, raw string. "3 tags on 2 rows could not be mapped" is trustworthy. Silently showing 1,671 instead of 1,674 makes every number below it quietly wrong.

### Ship gate

1. 🔴 **A COMMITTED UGLY-STATE FIXTURE** — `data/_fixture-ugly.json`: non-zero unassigned, a populated unmapped bucket, an old stamp. **It must be a committed FILE, not a runtime flag** (a flag is a code path that rots; a fixture is data that either renders or does not). **Reason it is mandatory: the live folder is at zero-unassigned, so the app's normal state has NEVER been rendered against anything else, and every status board breaks first in a state it has never rendered.**
2. 🔴 **VERIFY MUST SEE FIRST PAINT.** Render the real JSON and the fixture, on screen, before ship. *`qr-forge` v1.0's ship check fetched `config.json` and never a rendered page — a verify that cannot see first paint is not a verify.*
3. Confirm `applyTheme('eos')` resolves and all four vectors applied.
4. `VERSIONS.md` row updated **in the same session as the PR** — 🔴 **currently BLOCKED, see §0.**

---

## 7 · Seams (write these down now, they are cheap now and expensive later)

🔴 **UNASSIGNED IS A COUNT HERE, NEVER A LIST.**

Three surfaces will soon answer *"who is doing what in Big Love"*: this app (aggregate, historical), **Agent Assignments** (live, per-row, browsable), and **Morning Wake Up** (specced, unwired — it routes new/unassigned rows).

Today they are genuinely distinct. The moment the Wake Up is wired, **two surfaces answer "what is unassigned" off the same field** — the two-claimants-on-one-truth shape that retired `registry.json`, deleted `data-refresh-log.json`, and killed the routines app.

**The line: unassigned is a HEALTH INDICATOR here (a count, with an asof). The WORK QUEUE (an actionable list) belongs to Morning Wake Up.** If this app ever grows a clickable list of unassigned rows it has taken the Wake Up's job, and one of them must die.

**Other seams:** `Agent Assignments` view = live browsing, this app = trend and shape · AgentGlass = runs, this = assignments · Agent Index = the roster's truth, this app only ever **reads** it.

---

## 8 · PII

⚠️ **This repo is PUBLIC.** The aggregates carry agent labels and production task names only — **checked 2026-09-21, no student names, no contact data, no PII.** A future production may not be as clean: **re-check before adding a second show**, and never route a drill-down that carries a real person's contact detail into this file.

---

## 9 · Open, for Michael

1. 🔴 **The `VERSIONS.md` ceiling — §0.** Needs a trim decision before this app can be ledgered, and the two missing root folders (`audio-compressor`, `doc-sandbox`) need reconciling. **The biggest open item, and it is not about this app.**
2. **Slug + Pages URL** — `agent-load` assumed. Confirm or rename before a folder is populated.
3. **Second production** — deferred, not refused. The answer should be *copy the file*, never *build an index*.

---

*Contract born 2026-09-21 from the Big Love (F26) Agent Assignee beta. Frank verdict **MERGE**. Workshop: 7 mandatory lenses + Size Sally + Literal Lena. Deliberation: the session task on the 🟢 Agent Activity Board. Reasoning: [`RATIONALE.md`](./RATIONALE.md).*
