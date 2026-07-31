# Batch Import — Inciardi Collection

**Purpose:** Turn photographs of a physical binder sheet into a batch file Michael can push through the app's back room, without the transcriber ever touching code.

**Mode:** Procedural (deterministic) — a fixed sequence with a fixed output shape.

**Invocation:** On demand. Fires when photographs of a mini-print sheet arrive, or on "import this sheet."

**Trigger:** One or more photographs of a 3×3 sheet of Anastasia Inciardi mini prints, front and/or back.

---

## What you produce

**Two files. Both JSON. Neither is code.**

1. `inciardi-collection/batches/<slug>.json` — the sheet
2. one line added to `inciardi-collection/batches/_index.json`

🔴 **If you find yourself editing a `.js` file, you have gone off the rails.** `batch.js` is a loader that reads and validates your file; it never changes for new data. A batch that needs a code change is a batch with a problem the hook has not anticipated — say so and stop, rather than reaching into the app.

**You do not run the import.** You prepare it; Michael presses the button. The back room shows him every row before anything is sent.

---

## Pass

### 1. Read the live catalog FIRST

`GET https://inciardi-collection.mawizorek-online.workers.dev/artworks` (open, no key needed).

🔴 **`artwork_id` is permanent identity and it is global, not per-sheet.** If a print already exists, reuse its exact existing id — the importer will skip creating it and just place it. If you mint a *new* id that collides with an existing print, you have silently placed **someone else's print** in this pocket and nothing will complain, because as far as the database is concerned that id is a print it already knows.

Also read `GET /sheets` so your new `sheet_id` does not collide with one that exists.

### 2. 🔴 ORIENT THE PHOTOGRAPH BEFORE YOU READ A SINGLE CARD

**This step exists because skipping it imported an entire sheet 90° out of true (2026-07-31, `ice-cream`), past a green validator, into the database.** The old text jumped straight to "the grid IS the photograph" — true only *after* you know which way is up, and nothing established that. All eighteen cards were wrong; not one of them was misread.

**Establish up GEOMETRICALLY, from the page, not from the art:**

| signal | reading | strength |
|---|---|---|
| **the punch strip** | A 9-pocket page's punched edge is a **long vertical edge**. A strip running horizontally across the frame means **the photo is rotated**, full stop. | 🔴 decisive — structural, and readable before any card is |
| ring/binder spine | Same edge, same conclusion. | decisive |
| caption orientation | Ana writes titles horizontally on the lower margin. **MAJORITY VOTE across all nine.** | strong, but see the trap |
| the pictures themselves | A cone points up, a truck sits flat. | weakest — a card can be printed sideways |

⚠️ **THE TRAP THAT ACTUALLY SPRUNG, and it will spring again: a LANDSCAPE image gets a VERTICAL caption.** `Mr. Softee` is a wide truck, so Ana wrote its title up the card's left edge. In a sideways photo that made it the one caption reading horizontally — and it was treated as the upright sample while the other eight were dismissed as quirks. **One card never establishes orientation. Count all nine and take the majority.** A card that disagrees with the majority is a card with a landscape image, not evidence about the page.

🔴 **A discrepancy you can explain is not a discrepancy you have resolved.** The oddity above was written into `notes` as a charming detail *by the same pass that got the rotation wrong*. Writing a contradiction down is not the same as acting on it. If two signals disagree, say so out loud and settle it before transcribing.

**Then rotate the image mentally until the punch strip is vertical, and only then read row-wise.** If you cannot establish orientation from the page at all, **say so in the handoff and in `source`** — Michael can fix a rotation in two taps (step 6), but only if he knows to look.

### 3. Transcribe, do not infer

Ana hand-writes the title on the lower margin of nearly every card. **Read it off the card.** That is what makes `confidence: "named"` honest.

If a title is genuinely unreadable and you are naming the card from its picture, set `"confidence": "inferred"` on the batch and **say so in the handoff**. The schema carries that value precisely so the distinction survives; using it costs nothing and hiding it costs trust.

### 4. Write the batch file

```json
{
  "id": "drinks",
  "label": "Sheet 3 · Drinks",
  "source": "Two photographs, 2026-07-30. Beer face is the FRONT.",

  "sheet": {
    "sheet_id": "sheet-drinks",
    "binder_id": "mini-binder",
    "title": "Drinks"
  },

  "faces_assumed": true,

  "defaults": {
    "category": "mini",
    "edition_type": "open",
    "retail": 1.00,
    "provenance": "owned",
    "confidence": "named",
    "own": true,
    "qty": 1
  },

  "prints": {
    "pbr": { "name": "PBR", "notes": "A Pabst Blue Ribbon can. Signed AI." }
  },

  "front": [
    ["pbr", "rainier-beer", "brooklyn-pilsner"],
    ["brooklyn-lager", "sportini", "allagash"],
    ["lunch-bottle", "guinness", "pony"]
  ],

  "back": [
    ["wine", "six-pack", "champagne-tower"],
    ["cocktail-shaker", "the-black-barn", "martini"],
    ["topo-chico", "best-friends", "bottle-cap"]
  ]
}
```

`batches/drinks.json` is the live worked example. Copy its shape.

**The grids are the photograph — ONCE STEP 2 IS DONE.** Three rows of three, left to right, top to bottom. Where a print sits in the array *is* where it sits on the sheet, so there are no position numbers to get wrong. Use `null` for an empty pocket. Omit `front` or `back` entirely for a one-sided sheet.

**Field rules:**

| field | rule |
|---|---|
| `prints` keys | The permanent `artwork_id`. Lowercase, hyphenated, ≥2 chars, **never digits-only** (`"4"` and `"7/12"` both collapse to numbers — the collision that killed the predecessor app). Derive from the name. |
| `name` | Required. Exactly as written on the card. |
| `notes` | What the picture shows, plus how it is signed (`AI` or `ANA INC`), plus anything sourced. Optional but wanted. |
| `sheet_id` | Must not exist yet. **Non-positional** — `sheet-drinks`, not `sheet-3`. An id should say what a thing is, not where it sat the day it was made. |
| `faces_assumed` | `true` unless you genuinely know which physical face is the front. A photo of a loose sheet does not tell you. Setting it `false` drops the caveat from the confirm screen, so only set it on real evidence. |
| `source` | Say how you oriented the sheet (step 2) and anything you could not settle. This is where a future correction starts. |
| `defaults.retail` | `1.00` for vending-machine minis ([sourced](https://inciardiprints.com/pages/mini-print-vending-machine-1)). Different for a shop print — check. |
| `defaults.edition_type` | `open` unless the run is genuinely **numbered**. Marketing language saying "limited edition" is not an edition type. |
| `collection_id` | **Do not set it.** No route creates collections, and a sheet is Michael's arrangement, not an artist release. The sheet carries the grouping. |

**🔴 Leave unknowns EMPTY.** Where a print was acquired, what he paid, the edition number — if the photo does not say and no source says, omit it. *A plausible guess in a data field is worse than a blank, because the blank is honest and the guess is indistinguishable from a fact.* This is not hypothetical: on 2026-07-30 the front/back assignment was assumed from the order two photos arrived in, written down as fact, and was wrong.

### 5. Research what is cheaply knowable

A collab, an exclusive, a real retail price — one search is often enough and it lands in `notes`. Three prints in the Drinks sheet turned out to be [Brooklyn Brewery tasting-room pieces](https://brooklynbrewery.com/news/art-on-tap-find-the-inciardi-prints-mini-print-vending-machine-in-the-tasting-room/), which the brewery's own announcement confirms. **Cite the source in `notes`.** Do not enrich past what a source supports.

### 6. Register it

Add the filename to `batches/_index.json`. A static site cannot list a directory, so that file **is** the directory.

⚠️ **This is the likeliest mistake in the whole procedure** — the batch will sit in the repo, perfectly correct and completely invisible. Check it twice.

### 7. Hand off

One branch, one PR, squash-merged. Then tell Michael, in this order:

- how many prints, into how many slots, over how many sheets
- which are **new to the catalog** versus already known (you read `/artworks` in step 1, so you know)
- **every assumption you made** — orientation first, then front/back
- anything you could not read and left out

Then: *Settings → Back room → confirm the build stamp → check the grid against the sheet → Import.*

---

## 🔴 The arrangement is fixable on screen, and that creates an obligation on YOU

Since **v17** the confirm screen renders both faces as editable 3×3 grids: rotate a face, mirror it, swap front ↔ back, or tap two pockets to swap them. **The run writes what is on screen.** So a rotation you got wrong costs Michael two taps rather than a re-push.

⚠️ **But it edits the RUN, not the FILE.** A static site cannot write to the repo. The moment he corrects something and imports, **D1 is right and your batch file is wrong** — and slots are written `ON CONFLICT DO UPDATE`, so the next import from that unfixed file would silently put every print back where it was and log a clean run doing it. The app warns and offers the corrected grids for copy-paste.

**If Michael tells you he fixed an arrangement on screen: get the corrected grids from him and commit them to the batch file in the same session.** Two claimants on one truth is the failure this repo collapses on sight, and here the losing claimant is the one in version control.

🚫 **The editor is not a substitute for step 2.** It can only permute placements that are already there — it cannot invent a name, split a card, or fix a misread title. Handing over a rotation you knew was uncertain and expecting him to sort it out is not a workflow.

## Output

A merged PR containing exactly two changed files, plus a handoff message covering the four points above. **No writes to the database.** The importer is Michael's to press.

## What the app checks for you

Before anything is sent, the back room validates and reports **every** problem at once: grids that are not 3×3, ids that are too short or digits-only, names left blank, a grid naming a print that is not in `prints`, a print described but never placed, the same print placed twice. A batch that fails renders **no run button at all** — not a disabled one.

So a mistake costs you a push and a re-read, never a half-applied import. The batch is also fetched `no-store`, so it can never be served stale.

⚠️ **What it CANNOT check is whether your transcription is TRUE.** Validation proves a batch is well formed. `ice-cream` was flawless JSON, validated green, and 90° wrong. **The grid on the confirm screen is the only check that catches that, and it only works if someone looks at it next to the physical sheet.** Say so in the handoff.

## Composes with / overrides

Runs before **Commit Pre-flight** and **Post-Build Verify** (both apply to the PR as normal). Does **not** compose with the size-budget enforcer — batch files are data, they are never read whole to be edited safely, and editing one cannot break the app.

## Examples

- **Two photos, one sheet, all new prints.** → `batches/spring.json`, 18 prints, index updated, handoff naming the orientation evidence and the front/back assumption. Michael checks the grid, imports.
- **A photo containing three prints already in the catalog.** → reuse their existing ids exactly; the preview will show them as `place only` and no duplicate is created.
- **A card whose caption is obscured.** → leave the pocket `null`, tell Michael which one and why. Never invent a name to fill a hole.
- **A sheet that is only half full.** → `null` in the empty pockets. Sparse is the design; absence *is* the empty slot.
- **A photo you cannot orient** (no punch strip in frame, captions split 5–4). → transcribe your best reading, say in `source` and in the handoff that orientation is unverified, and point him at the rotate buttons. An unflagged guess is the failure; a flagged one is a two-tap fix.

## Changelog

- v2 (2026-07-31) — **added step 2, ORIENT BEFORE YOU READ.** `ice-cream` was imported 90° out of true because the hook asserted "the grid IS the photograph" without ever establishing which way was up, and the one caption that read horizontally belonged to the one landscape card. Also: caption orientation is a majority vote; a discrepancy explained in `notes` is not a discrepancy resolved; `source` must record the orientation call; and the new v17 on-screen editor comes with an obligation to commit the correction back.
- v1 (2026-07-31) — initial. Replaces the previous procedure, which was "edit `batch.js`" and made every transcription a code change in the file feeding an irreversible bulk write.
