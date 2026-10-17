# vwx-renderer — next build spec

⚠️ **SPEC ONLY. NOTHING BUILT.** No `index.html`, no `source/`, no ledger row yet. Do not treat any statement below as a claim about shipped code.

Vectorworks' **Organization** dialog and **Resource Manager**, rebuilt as a reader for the VWX documentation in **maw-prose**. Open a file, flip Classes / Design Layers / Sheet Layers / Resources / Record Formats, click a class, see what was documented as the plan. No Vectorworks licence needed.

**A deliberate fold of [`fmp-renderer`](../fmp-renderer/README.md)**, not a net-new pattern. Fold-in verdict: NET-NEW APP, FOLD-IN PATTERN. Where this file is silent, fmp-renderer's contract governs.

## Why it exists

The Smith class and layer lists have been **parked since 2026-07-29** (Prose Documentation DL **J9**) pending "a convened design session, gold-standard doc as the output, then build to it." This is that output. J9 named **FMP Fiona** on the object library and **Dev Dexter** on structure.

## Inherited verbatim from fmp-renderer — do not re-litigate

1. **Holds no spec content.** Reads maw-prose live at page load (maw-prose **D-040**). Write a note, push, hit *Re-read repo*.
2. **Shows the TARGET, not the file.** Nothing here claims what a `.vwx` currently contains. This is the Sep 25 FileMaker ruling, and `standards/vectorworks/getting-data-out.md` already states it in VWX terms: *"an export tells you what the file currently is. Our documentation says what it is supposed to be. When they disagree, that is information, not an error to paper over."*
3. **Validation renders, never fails.** Problems paint in place as red badges.
4. **Bodies pinned to the commit SHA.** 2 API calls per load, cached 5 min.
5. **A truncated tree REFUSES to render** rather than showing a spec with holes.
6. **No local styling.** Theme join via `shared/themes/resolve.js`; `app.css` carries a floor copy of every token. The content repo has zero say in how this looks (doc-render-engine DL **J30**).

## Where the content lives

**`mawizorek/maw-prose` → `vectorworks/<file>/`.** One folder per documented Vectorworks file (a venue base file, a show file, the `_TEMPLATE`).

maw-prose because DL **Q15** ruled `standards/` fully portable — *"Vectorworks setup is Vectorworks setup at any employer"* — and because fmp-renderer already reads this repo for exactly this job. The repo-referent gate decides by AUDIENCE, and the audience for a class tree is whoever opens the file, at any employer.

### 🔴 Four claimants exist today. None is ratified.

| Path | Repo | State |
|---|---|---|
| `venues/smith-theatre/{classes,layers}.md` | maw-prose | the J9 proposals, still labelled draft / proposal |
| `production/venues/spac/vwx-base-file/{classes,layers}.md` | uritp-docs | per-venue, SPAC |
| `doc-specs/software/vectorworks/base/{classes,layers}.md` | uritp-docs | **frontmatter only, `status: public`, LIVE and EMPTY** |
| `Vectorworks/{_TEMPLATE,smith-theatre}/standards/` | **ClickUp_apps** | the original tree |

🪦 **`ClickUp_apps/Vectorworks/` is the same defect D-041 already fixed for `filemaker`:** theatre-craft spec content sitting in the agent-reader repo. The ledger independently flags it *"unverified, never indexed"* and as the only capitalized folder in a kebab-case repo. **Flagged for retirement on the D-041 precedent, NOT deleted** — Michael's call, and nothing moves until he rules.

⚠️ **The migration is a prerequisite, not a build step.** Four claimants on one truth is the defect that killed `roster.json`, `registry.json` and `app-index.md`. Building a reader over an unresolved set of four would make it five.

## Ratified decisions

**D1 · The grain is the LEAF CLASS. One file per class, flat directory.** *Michael, 2026-10-05.*

**D2 · Hierarchy lives in a frontmatter `parent:` key, NEVER in the folder tree.** The renderer derives the tree at load. This is the flexibility requirement, answered structurally: DL **Q13**'s still-open question — is Steel / Wood / Framing / Masking the right top-level set — becomes a frontmatter edit instead of a file migration. Nest the folders and that question costs a refactor every time it is reopened.

**D3 · A register TSV was PROPOSED AND REJECTED.** Recorded because the reasoning should not have to be rediscovered. A TSV row forces completeness to exist at all, has nowhere to put a note, gives a class no `@id` so no class can link to another, and is ONE edit surface for every author — the collision doc-render-engine DL **J24** ate twice on a single header line. Files fix all four.

**D4 · The worksheet export NEVER scaffolds these files. It RECONCILES against them.** Scaffolding the spec from an export turns the spec into a mirror of current reality and deletes the only signal worth having. This is `ddr-reconcile` with a different ground truth — **a fold-in, a fifth member of the reconcile family, and out of scope for v1.**

## Sustainability: a file is ALLOWED to be a stub

The authoring-cost failure is documented and real: **thirteen safety programs written in one evening, two in the seven weeks after** (DL **Q19**, Finding 2), because the template demanded a finished document.

So a class file with frontmatter, `status: gap`, and no prose at all is a **complete and legitimate record**. The renderer badges it amber. It does not nag, and it does not hide it either — a thin folder that looks authoritative forever is the failure Beckett named at DL Q17.

**Nine blank statuses, the unrecorded uniform scale value and the missing default class attributes are already recorded as stated GAPS** in the existing files. They stay gaps. Nothing gets invented to fill a frontmatter key.

## The templated tree

```
vectorworks/
  README.md              what this tree is, and the back-pocket test
  _TEMPLATE/             copy this for a new file
  <file>/                e.g. smith-theatre, spac
    INDEX.md             the file's own note: what it is for, scale, units, origin
    classes/             one .md per leaf class, FLAT
    design-layers/       one .md per design layer
    sheet-layers/        one .md per sheet layer
    resources/
      symbols/
      hatches/
      record-formats/
    meta/                revision notes, export stamps
```

Mirrors `apps/<app>/` in shape and intent (`INDEX.md` · `README.md` · `next-build-spec.md` · per-noun folders) so one habit covers both renderers.

⚠️ **Resources stay split by TYPE.** A symbol and a hatch do not share columns, and flattening them would force a union frontmatter schema where most keys are blank on most files.

## Data contract — a class file

`vectorworks/<file>/classes/<Class-Name>.md`

```yaml
---
id: smith-class-steel-pipe        # stable, kebab, the @id link target
name: Steel-Pipe                  # EXACT class name as it must appear in the file
parent: steel                     # @id of the band, or omitted for a top-level band
type: class
status: public | gap | draft
visibility: on | off              # default visibility in the base file
use: one line. what belongs in this class and nothing else.
---

Prose, optional. Why the class is split the way it is, what bites you,
what it is NOT for. Absent is fine.
```

**Attributes** (fill, pen, line weight, line type, texture) render as a sibling `.tsv` under `data:` in the fmp-renderer register pattern, or are omitted entirely and reported as a gap. **They are not frontmatter keys** — there are too many, most are inherited, and a blank key reads as a decision.

### 🔴 The one new validation rule, and it is the valuable one

**Vectorworks derives class hierarchy from the NAME delimiter.** `Steel-Pipe` is a child of `Steel` because of the hyphen, not because anything declared it.

So a `parent:` key can **disagree** with the name-derived parent. **That disagreement is RED**, and it means exactly one thing: the class was re-banded in the documentation and never renamed in the file. That is a real, silent, expensive drift and nothing today can see it.

⚠️ **Consequence to state plainly: re-banding the class tree in docs is free, re-banding it in the `.vwx` is not.** D2 buys cheap documentation changes, not cheap file changes. The red badge is the bill arriving on time instead of in six months.

## Routes

`#/<file>/classes/<Class>` · `#/<file>/design-layers/<Layer>` · `#/<file>/resources/symbols/<Symbol>`

Routes use the file stem, as fmp-renderer does. `[text](@id)` resolves in-app when the id is in the same file folder. `[text]{.marker}` renders as a marker chip. `!!!` callouts render.

## Validation grammar

**RED** — no `use:` line · no `name:` · `parent:` naming an id that does not exist · `parent:` disagreeing with the name-derived parent · duplicate `name:` across two files · an unquoted `: ` in a frontmatter value (drops the page from the doc site) · a layer or class referenced by a resource file with no note of its own.

**AMBER** — `status: gap` · no attributes register · old shape · missing optional header keys.

## Seams (planned, copied from fmp-renderer)

| File | Job |
|---|---|
| `source/github.js` | the only network code |
| `source/repo.js` | files and counts from the tree listing |
| `source/front.js` | frontmatter, just far enough |
| `source/parse.js` | one note in, data out; validation |
| `source/tree.js` | **new** — derive the class hierarchy from `parent:`, and diff it against the name-derived one |
| `source/md.js` | just enough markdown, plus callouts, markers, `@id` links |
| `source/views.js` | HTML for every screen, pure |
| `source/app.js` | routing, events |

📏 Every module under the 15KB line. Slim shell + `source/*`. Bump `?v=` on every source change.

## Open questions — DO NOT BUILD PAST THESE

All five are DL **Q13**, still unanswered, and all five are about CONTENT rather than the renderer. The app can be built without them; the Smith tree cannot be filled without them.

1. Is `2D 2 [SPAC] Mezzanine` cut or kept? Flagged `CUT?` since authoring.
2. Are the three unbanded rows (`>import 3D`, `VID - REP`, and the above) deliberately unbanded, or an omission?
3. Is the `LX DESIGNER` vs `HEAD ELECTRICIAN` split intentional? It puts `LX - REP` and `LX - PLOT SECTIONS` under one department and the plots under the other.
4. Is Steel / Wood / Framing / Masking the right top-level set, or are there gaps — soft goods, hardware, electrics infrastructure, deck treatment?
5. Do `Framing` and `Masking` get the bare parent classes that `Steel` and `Wood` have?

**Plus, from this session:** which of the four claimants is the keeper, and does `ClickUp_apps/Vectorworks/` retire.

## Known limits, stated up front

- **Relationships has no analogue and that is fine.** The VWX equivalent of a relationship graph is class × layer occupancy, which only an export knows. Out of v1 by D4.
- Unauthenticated GitHub API: 60 reads an hour per IP.
- **The reconcile half does not exist.** Until it does, this app cannot tell you that a documented class is absent from the file — only that it is documented.
- **Generalised from one real tree (Smith) and one half-built one (SPAC).** A cold session that finds no filled file SAYS SO rather than assuming the shape works.

## Owed, not done

⚠️ **A `vwx-renderer` ledger row in `VERSIONS.md` is owed by the ledger's own procedure** (`SPEC ONLY — nothing built`, on the `agent-load` precedent). **Not written in this PR:** the ledger is near its ~22KB ceiling, its rule is that every addition trims in the same commit, and Size Sally gates that. Flagged rather than silently skipped.
