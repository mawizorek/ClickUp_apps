# Scripts — mirrors *Manage Scripts* in the FileMaker file

**A script's path here equals where it lives in the Script Workspace.** Open this folder and you should be looking at the same tree you see in FileMaker.

---

## ⚠️ 2026-07-29 — this README was WRONG and the correction is the point

It previously claimed:

> ~~"Subfolders match the actual FMP script-folder names (imports, navigation, utilities, triggers, …)"~~

**False.** Those four folders match nothing in the file. The real Manage Scripts tree — documented on the ClickUp Scripts page since June 2026, with per-folder roles and a naming convention — is the eleven-folder numbered tree below.

**Why this rot was the dangerous kind, worth stating so it is not repeated:** a doc that *asserts it mirrors a live system* while mirroring a different taxonomy is worse than a doc that admits it is a guess. It reads as authoritative, and it cannot be falsified without opening FileMaker. It survived because the git tree and the ClickUp page were never read in the same sitting. Struck rather than deleted, per house practice.

---

## The folder tree (canonical)

| Folder | Belongs here | Does NOT |
|---|---|---|
| `00_APP` | startup, first-window-open, app-wide guards, developer-mode toggles | layout-specific button handlers |
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

### 🔎 One open divergence — flagged, not guessed at

`utilities/` exists here and holds `commitRecord`, a **shared cross-app standard helper**. There is no `utilities` folder in the documented FMP tree, and a house-standard helper does not obviously belong in `90_ADMIN` (which is for one-offs and repair).

**Left in place and flagged rather than relocated**, because FMP-internal structure is Michael's to confirm: *does the live file have a `utilities` folder, or does `commitRecord` sit somewhere else?* Flag, don't fix another system's internals. Everything else here now matches the documented tree.

---

## The model (standard v1.4)

- **Body:** `<folder>/<ScriptName>.fmscript` — lean plain text: the exact steps to dictate into *Manage Scripts*, with narrative as native `#` comment lines (role, when-to-use, design notes, changelog). No per-script prose markdown.
- **Master index:** `_index.json` — ONE manifest for the whole tree, flat `scripts[]`. Minimal rows: `name`, `folder`, `calls[]`, `scriptRef`, `state`. The renderer builds the folder tree from each row's `folder` and the CALLS/CALLED-BY graph from `calls[]`. **`calledBy` is DERIVED at render time** by inverting `calls[]`, never stored.
- **Renderer:** reads `_index.json` to list + graph; lazy-loads one `.fmscript` only on drill-in. Adding a script or a folder is data-only, never a renderer change.

**Dictation, not paste-round-trip.** FileMaker's script clipboard is an XML snippet, so a `.fmscript` is the human-legible reference you TYPE into *Manage Scripts* — not a paste-back artifact. Unlike a `.fmcalc`, which does paste back verbatim. Legibility over round-trip, deliberately.

<br/>

### `state` — new field, 2026-07-29

Every row carries one of:

- **`golden`** — target design, build toward it.
- **`built`** — verified in the file on a named date.
- **`superseded`** — ⛔ **do not implement.** Written against an older schema.

The ClickUp pages these scripts came from carried a **2026-06-18 self-audit** naming five scripts as needing rewrite and two as needing review, and **six weeks passed with nothing moved** — because the finding lived in a status table instead of on the object. A `state` field on the row is the fix: the warning now travels with the thing it warns about.

---

## Status

Bodies are **pending a live-file DDR enumeration pass**. `_index.json` now carries the real script inventory with `state` per row, so the tree and the call graph are navigable before a single body is written — listing is not loading.

See [utilities/commitRecord.fmscript](./utilities/commitRecord.fmscript) as the canonical body example.
