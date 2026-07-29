# Scripts — mirrors *Manage Scripts* in the FileMaker file

**A script's path here equals where it lives in the Script Workspace.** Open this folder and you should be looking at the same tree you see in FileMaker.

---

## 🔒 THE COPY-TARGET RULE (LOCKED 2026-07-29, Michael)

> *"every script needs to be known to be hand copied by me into fmp. so no changelogs in the script. less status bullshit in the header. that's all valuable, but not actually script text."*

**Two files per script. The split axis is NOT prose-vs-code. It is TYPED-vs-NOT-TYPED.**

| File | Is | Rule |
|---|---|---|
| `<Name>.fmscript` | **the copy target** | Select all, copy, dictate into *Manage Scripts*. **Everything in it is meant to be typed.** Nothing else may live here. |
| `<Name>.notes.md` | **everything else** | Status, defects, history, design reasoning, rewrite checklists, fixture expectations, relationship requirements. Read on a phone. Never typed. |

**Why the split has to be at the file boundary and not a section header:** if the copy zone ends partway down a file, every copy becomes a judgement call, and a `#` line is a *valid FileMaker comment step* — so over-selecting pastes silently-wrong garbage into a script rather than failing. **Whole-file copy is the only version that cannot be got wrong at 2am.**

### What DOES belong in the `.fmscript`

A **short** header of 4–6 `#` lines, because a FileMaker script with no comments is bad and these end up genuinely useful in *Manage Scripts*:

- what the script does, one line
- `Param (JSON):` the contract in
- `Returns (JSON):` the contract out
- at most one line naming the single most dangerous thing about it

Plus inline `#` comments where a step needs explaining. **These are real script steps.** Typing them is the point.

### What NEVER belongs in the `.fmscript`

Changelogs · `STATE:` stamps · `supersededWhy` · migration notes · candidate upgrades · fixture expectations · open-bug flags · relationship tables · rewrite checklists · anything dated.

**Test before you add a line to a body: "do I want to type this into FileMaker?"** If no, it goes in the sidecar. A script header that grows a changelog has become documentation wearing script clothing, and it rots inside the FileMaker file where nobody will ever diff it.

### Amends D-005, does not overrule it

`meta/design-decisions.md` **D-005 — "one script, one home"** drove the narrative INTO the `.fmscript` header and left `utilities/commitRecord.md` as a tombstone saying *"do not re-add prose here."*

D-005's intent was **no duplicate prose homes**, and that intent is intact: there is still exactly **one** prose home per script. What D-005 did not anticipate is that **the `.fmscript` is a COPY TARGET, not a reading surface.** Once a file gets hand-typed into another application, anything in it that is not meant to be typed is a defect. So the prose moved out of the copy target and into a sidecar — one home, different address.

**`.notes.md`, not `.md`**, deliberately: `commitRecord.md` still exists as a retired breadcrumb, and reusing that exact extension would resurrect a tombstone. `.notes.md` also says what it is.

---

## The folder tree (canonical)

| Folder | Belongs here | Does NOT |
|---|---|---|
| `00_APP` | startup, first-window-open, app-wide guards, the `txn_*` trio | layout-specific button handlers |
| `10_UI` | tab switching, card open/close, refresh shell, visual state | data posting |
| `20_NAV` | found-set navigation, next/prev, jump to related record | business calculations |
| `30_CONTEXT` | set current property, resolve current loan, update globals | document capture, payoff generation |
| `40_BINDER` | new document, new version, document linking, cleanup queue | loan schedule logic |
| `50_RECEIPTS` | create `ReceivedFunds`, proof-first intake, unassigned receipts | payoff output |
| `60_PAYMENTS` | post money rows, waterfall application, reversals, reconciliation | hub tab switching |
| `70_SCHEDULE` | generate/regenerate expected rows, defer, late-fee assessment | document versioning |
| `80_PAYOFF` | duplicate prior payoff, snapshot math, preview, issue, save to binder | generic receipt capture |
| `90_ADMIN` | migration helpers, data repair, seed metadata, surviving one-offs | normal daily workflow scripts |
| `zz_DEV_ARCHIVE` | retired experiments, kept temporarily | anything a live button still calls |

**Naming:** `<FOLDER_CODE>__<Verb_Object>` — e.g. `60_PAYMENTS__Post_ReceivedFunds_Batch`. Two underscores after the code. Name by JOB, never by button label.

<br/>

### ⚠️ 2026-07-29 — this README previously claimed a folder tree it did not have

It said:

> ~~"Subfolders match the actual FMP script-folder names (imports, navigation, utilities, triggers, …)"~~

**False.** Those four match nothing in the file. The real tree is the eleven numbered folders above, documented since June 2026 with per-folder roles.

**Why this rot was the dangerous kind:** a doc that *asserts it mirrors a live system* while mirroring a different taxonomy reads as authoritative and cannot be falsified without opening FileMaker. It survived because the git tree and the ClickUp pages were never read in the same sitting. Struck rather than deleted.

### 🔎 One open divergence — flagged, not guessed at

`utilities/` exists here holding `commitRecord`, a **shared cross-app standard helper**. There is no `utilities` folder in the documented FMP tree, and a house-standard helper does not obviously belong in `90_ADMIN` (which is for one-offs and repair).

Left in place and flagged rather than relocated: **does the live file have a `utilities` folder, or does `commitRecord` sit somewhere else?** Flag, don't fix another system's internals.

---

## The master index

`_index.json` — ONE manifest for the whole tree, flat `scripts[]`. Rows carry `name`, `folder`, `state`, `body`, `calls[]`, `scriptRef`. The renderer builds the folder tree from each row's `folder` and the CALLS/CALLED-BY graph from `calls[]`. **`calledBy` is DERIVED at render time** by inverting `calls[]`, never stored.

**`body`** is `present` or `pending` and it exists because of a real failure: a previous version of this manifest carried 20 rows with `scriptRef` paths when **exactly one of those files existed.** A pointer is a claim. Never write one for a file you have not created.

**`state`** (`golden` / `built` / `superseded`) describes the SCRIPT's standing in FileMaker. `body` describes whether documentation exists here. They are independent: a superseded script can have a full body worth reading, and a golden script can have no body yet.

**Dictation, not paste-round-trip.** FileMaker's script clipboard is an XML snippet, so a `.fmscript` is the human-legible reference you TYPE into *Manage Scripts* — not a paste-back artifact. Unlike a `.fmcalc`, which does paste back verbatim. Legibility over round-trip, deliberately, and the copy-target rule above is the consequence of that trade.

## Status

**7 of 20 bodies present.** The 13 pending ones have real content on their old ClickUp pages; porting is mechanical, not a design task. See `_index.json` → `_meta.coverage`.
