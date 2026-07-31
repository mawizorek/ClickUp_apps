# Binder Sheet Intake

**Type:** procedure
**Purpose:** Turn photographs of one physical binder sheet into a validated transcript the Inciardi Collection app can import.
**Invocation:** `/binder-sheet-intake`, or when Michael sends photos of a mini-print sheet and asks for them in the app.
**Requires:** `githubmcp_get_file_contents`, `githubmcp_create_or_update_file`, `fetch_website`, `search_web`
**Produces:** one new `inciardi-collection/batches/<slug>.json` + one appended entry in `batches/_index.json`

---

## 🔴 THE HARD RULE

**You write DATA. You do not write code, and you do not press the button.**

Everything you produce lives in `inciardi-collection/batches/`. If you find yourself opening `batch.js`, `backroom.js`, `preview.js`, the worker, or anything ending in `.js`, **you have left this procedure.** Stop and say so.

And you never run the import. The reachable end state is **ready for Michael**, never **imported**. He presses it, from the back room, after reading the preview. That is not ceremony: the preview is the last place a human compares the screen against the physical object, and it is the only check that catches a print you named confidently and wrongly.

---

## Input Contract

| Parameter | Source | Required |
|---|---|---|
| `photos` | 1-2 images, one per face of a single sheet | Yes |
| `sheet_title` | What to call the sheet (Drinks, Veggies) | No — propose one from the contents |
| `face_order` | Which photo is the FRONT | No — see the assumption rule |
| `binder_id` | Defaults to `mini-binder` | No |

**One sheet per batch.** Two sheets is two files. A batch maps to one `sheet_id`, and the app's guard reasons about one target sheet.

---

## Steps

### 1. Read the existing catalog FIRST

```
GET https://inciardi-collection.mawizorek-online.workers.dev/artworks
GET https://inciardi-collection.mawizorek-online.workers.dev/sheets
```

Reads need no key. You need both before transcribing anything:

- **`/artworks` gives you every `artwork_id` that already exists.** A print appearing on two sheets is ONE artwork in two slots — reuse the existing id exactly. Minting `guinness-2` for the second one silently doubles a title in the collection, and there is no un-merge.
- **`/sheets` tells you which `sheet_id` values are taken**, so the one you choose is free.

⚠️ If `/artworks` fails, **stop.** Transcribing without it guarantees duplicate ids for anything Michael already owns.

### 2. Read the titles off the cards

Ana hand-writes the title on the **lower margin** of each card. Occasionally it runs vertically inside the image instead (see `the-black-barn`).

**Transcribe, do not interpret.** If the card reads `Wine*`, store the clean name and put the asterisk in `notes`.

Per print, decide honestly:

- title legible on the card → leave the default `confidence: named`
- title guessed from the artwork → that print gets `confidence: inferred`, and the preview flags it on the row
- title unreadable → **leave the slot out** and name the pocket in your handoff

> 🔴 The most important line in this hook: **the fields most likely to be wrong are the ones the photograph does not contain.** Titles are printed on the object and are rarely wrong. Which face is the front, which pocket is which, and whether he owns it are all inferences. Flag those, not the names.

### 3. Number the pockets

Reading order, **zero-based**, per face:

```
0  1  2
3  4  5
6  7  8
```

The app displays `position + 1`; the data is 0-based. **Counting from one shifts every card by a pocket** and looks entirely plausible on screen — the whole face is simply wrong by one.

### 4. Faces

`side` is `A` or `B`. That is what the database stores; Front and Back are only what a person reads.

Unless Michael says which photo is the front, **it is an assumption**: first photo → `A`, second → `B`, and set `faces_confidence` to `assumed`. That makes the preview say *front and back assumed* exactly where he is about to press the button. **Say it in your handoff too.** This has already been wrong once — 2026-07-30, corrected the next morning.

Only write `confirmed` if he told you, or a photo shows the binder rings in an unambiguous orientation.

### 5. Mint ids

Lowercase, `a-z 0-9 -`, derived from the name. Brooklyn Pilsner → `brooklyn-pilsner`.

**The id is permanent identity, and a bad one is permanently bad.** The app has no rename.

Refused by both the validator and the worker:

- fewer than 2 characters
- digits and dashes only — `#4` and `7/12` both collapse to numbers, the exact collision that forced the last rebuild
- anything outside `a-z 0-9 -`
- a duplicate of another id in the same file

### 6. Research what the photo hints at

Cheap, and it has already changed the data twice:

- **Collabs.** Three prints on the Drinks sheet are Brooklyn Brewery tasting-room exclusives — [the brewery's own May 2024 post](https://brooklynbrewery.com/news/art-on-tap-find-the-inciardi-prints-mini-print-vending-machine-in-the-tasting-room/) names *a teeny Pilsner can* and *a sweet meeting between hops and barley*. Both went into `notes`.
- **Retail.** [inciardiprints.com](https://inciardiprints.com/pages/mini-print-vending-machine-1) states the vending machine prices each mini at **one dollar**. Sourced, not assumed. **Dollars, never cents.**

Every claim in `notes` needs a source or a direct observation. **Never a plausible guess** — see step 8.

### 7. Write `batches/<slug>.json`

Shape, with quotes shown as they appear in the file:

- `slug` — must equal the filename. The loader refuses a mismatch rather than guessing which one is right.
- `label` — what the picker and the preview show.
- `source` — where the images came from and when.
- `captured` — ISO date of the photographs.
- `faces_confidence` — `assumed` or `confirmed`.
- `sheet` — `sheet_id`, `binder_id`, `title`.
- `defaults` — `category` (mini), `edition_type` (open), `retail` (1.00), `provenance` (owned), `confidence` (named), `own` (true), `qty` (1).
- `prints` — array of `side`, `position`, `id`, `name`, `notes`, and optionally `confidence`.

**Copy `batches/drinks.json` as your starting point.** It is a complete, working, commented example, and copying it beats reconstructing the shape from this list.

**`sheet_id` should be non-positional** — `sheet-drinks`, not `sheet-3`. The existing `mini-binder-s1` is the *second* sheet, because its id was minted from a 0-based order and then everything moved. An id says what a thing **is**, not where it sat that day.

**Never set `sheet_order`.** The worker computes `MAX + 1` at run time so the sheet lands after whatever exists when Michael runs it. A guessed order collides with `UNIQUE (binder_id, sheet_order)`.

Any key starting with `_` is a note to a human and is ignored by the loader. Use them freely.

### 8. Do not invent these

| Field | Why not |
|---|---|
| `acquired_where` | Vending machine, pop-up, shop, trade — all plausible, none known. **A blank is honest; a guess is indistinguishable from a fact.** |
| `acquired_price` | Unknown. `retail` is the artwork's list price, not what he paid. |
| `collection_id` | Real FK with no POST route, so an invented one is an unwriteable row. Deeper reason: `schema.sql` says a collection is *what the artist released* and a sheet is *how Michael laid it out*. A sheet you assembled is not a release. **The sheet carries the grouping.** |
| `edition_type: limited` | Means **a run of N numbered impressions**. Vending machine minis are not numbered. Marketing copy saying limited edition is not an edition type. |
| `edition_id` on a slot | NULL is the normal case. Naming one invents a fact about which physical impression sits in the sleeve. |

### 9. Append to `batches/_index.json`

One object on the `batches` array: `slug`, `label`, `status`, `pushed`.

`status` is `ready` (not yet pushed), `pushed` (already in D1), or `draft` (incomplete — the loader will not offer it).

**Never delete a pushed batch.** It is the only durable record of those photographs; the photos themselves live in a chat message.

### 10. Self-check before handing off

- [ ] `/artworks` was read, and every already-existing print reuses its id
- [ ] `slug` matches the filename
- [ ] Positions are 0-8, and every side+position pair appears **once**
- [ ] No duplicate ids, none digits-only, none under two characters
- [ ] `sheet_id` is free and non-positional, and there is **no `sheet_order`**
- [ ] `faces_confidence` is honest
- [ ] Every inferred title carries `confidence: inferred`
- [ ] Nothing from the step-8 table was invented
- [ ] The file is **valid JSON** — paste it through a parser, because a trailing comma survives review and fails the app
- [ ] Manifest updated
- [ ] **You did not touch a `.js` file**

---

## Output Template — the handoff

```
Transcribed [N] prints from [sheet] into batches/<slug>.json

FRONT (A): [1] · [2] · [3] · [4] · [5] · [6] · [7] · [8] · [9]
BACK  (B): [1] · [2] · [3] · [4] · [5] · [6] · [7] · [8] · [9]

[X] new to the catalog · [Y] already there, reusing existing ids
Front/back: [assumed from photo order | confirmed by you]

Flagged:
- [inferred titles, skipped pockets, judgment calls]

Settings → Back room → [label]. Check the preview before you press it.
```

Give him **the face contents in reading order**. That is what he can check against the sheet in his hand in about five seconds, and it is where a front/back swap becomes obvious.

---

## Edge Cases

- **One face only** — nine prints, all `side: A`. Set `faces_confidence` honestly; the preview drops the *front and back assumed* clause when only one face is present.
- **Partially filled sheet** — include only the filled pockets. Absence IS the empty slot; the schema stores no row for one, and pre-seeding empties is explicitly forbidden.
- **A pocket holding a note rather than a print** — leave it out. The batch format has no note support. Tell Michael; he taps the slot.
- **Print already on another sheet** — reuse the id. Legal and intended; the card will read `own 1 · placed 2`.
- **A wanted print he does not own** — ⚠️ `own` is a batch-wide default and there is **no per-print override yet**. Either give it its own batch, or tell Michael to mark it afterwards.
- **More than 18 prints** — not an ambitious sheet, a transcription that lost track of itself. The validator refuses it.
- **A pocket too blurry to read** — skip it and name it in the handoff. **Never guess a title to fill a hole.**

---

## Does NOT

- Run the import, or tell Michael it has been imported
- Touch any `.js`, the worker, the schema, or `_themes.json`
- Edit an already-pushed batch file — write a correction as a new one, because a pushed file records what happened
- Create collections, binders or sheets by any route other than the batch
- Delete or rename an existing artwork
- Invent provenance, price, acquisition or edition facts

---

## Composes With

- **commit-pre-flight** — before the two file writes
- **link-provenance** — for any research URL landing in `notes`
- **doc-rot-sweep** — if a schema fact quoted here stops being true

---

## Why the validator exists

You cannot break the app with a bad transcript; that was the point of moving these out of `.js`. But you can absolutely describe a **wrong import**, and those succeed silently:

- **Two prints in one pocket** — `POST /slot` is `ON CONFLICT DO UPDATE`. The second wins, the first vanishes, every call returns 200. Nothing anywhere reports a missing card.
- **A bad id** — the worker rejects it on call 12 of 37, and the run stops with a half-populated sheet.
- **Positions off by one** — imports perfectly, and is simply not the sheet in the photograph.

`batch.js` catches all three before anything renders, and names the offending row. It mirrors the schema, which means it *can* drift from it — the database remains the authority. If they disagree, the database is right and the validator is the bug.

---

## Changelog

- 2026-07-31 — created, alongside app v16, which moved transcripts out of `batch.js` into `batches/*.json`. Michael: *it should be cold-agentable and ideally jst a reference data file so they're never actualyl touchuing code.*
