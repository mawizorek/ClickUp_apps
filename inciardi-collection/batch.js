/* Inciardi Collection — A BATCH. Data only, zero behaviour.
 *
 * Sheet 3 of the mini binder, transcribed from two photographs Michael sent on 2026-07-30:
 * nine cards a face, both faces of one sheet.
 *
 * ============================================================================
 * WHY THIS IS A SEPARATE FILE FROM THE THING THAT WRITES IT.
 *
 * `backroom.js` is machinery: preflight, guards, sequential apply, logging. This is a
 * TRANSCRIPT. They change for completely different reasons and on completely different
 * schedules — the next batch replaces every byte of this file and must not be able to touch a
 * single line of the runner. Keeping them together would mean editing the code that performs
 * irreversible writes every time a new photo arrives, which is the worst possible reason to
 * open that file.
 * ============================================================================
 *
 * 🔴 FRONT AND BACK WERE SWAPPED FOR ONE DAY, AND THE INTERESTING PART IS WHY.
 * Michael, 2026-07-31: "just swap what you called front and back."
 *
 * Two photographs arrived in a message. I called the first one the front. Nothing in either
 * image says which face of the sheet it is — no numbering, no binder rings visible in a
 * consistent orientation, nothing. It was an ASSUMPTION about message order, and I wrote it into
 * the data as a fact, in the same file where I had been careful to mark every TITLE as
 * transcribed-not-inferred.
 *
 * So: confidence discipline applied to the field that was written on the card, and skipped
 * entirely on the field that was not in the photograph at all. The `confidence` column exists
 * for exactly this and covers names only, because names were the part I was thinking about.
 * GENERALIZABLE: the fields most likely to be wrong in a transcription are the ones the source
 * does not contain. Those are the ones to flag, and they are the easiest ones to forget to.
 *
 * FIXED BY EDITING THE ROWS, not by adding a `flip: true` flag to the batch. A transform layer
 * would mean this file no longer says what it means, and the next reader would have to run the
 * flag in their head to know what is actually going in the binder. A transcript should be
 * literally true. The array is also reordered so it reads front-then-back, in binder order.
 *
 * 🔴 FOUR FIELD DECISIONS, each of which could have been wrong quietly.
 *
 *   retail: 1.00 — SOURCED, not assumed. inciardiprints.com/pages/mini-print-vending-machine-1
 *     states that the Mini Print Vending Machine prices each mini print at one dollar. This is
 *     the ARTWORK's retail. What Michael actually paid is `copy.acquired_price`, and it is left
 *     empty because nobody knows it.
 *
 *   collection_id: null — and this is CORRECT, not a workaround. `artwork.collection_id` is a
 *     real FK into `collection`, D1 enforces it, and there is no POST /collection route — so a
 *     made-up drinks id would be an unwriteable row. But the deeper reason is schema.sql's own
 *     line: a collection is WHAT THE ARTIST RELEASED, a sheet is HOW MICHAEL LAID IT OUT. These
 *     eighteen are an arrangement he made, not a set she dropped. The SHEET carries the
 *     grouping. Do not fix this by inventing a collection.
 *
 *   edition_type: 'open' — including the three Brooklyn Brewery pieces. The brewery called them
 *     a limited edition design, but in this schema 'limited' means A RUN OF N NUMBERED
 *     IMPRESSIONS. Vending machine minis are not numbered. Marketing language is not an edition
 *     type, and writing 'limited' here would put a run length in the data that does not exist.
 *
 *   exclusive: NOT SET, and it should be. Three of these are Brooklyn Brewery tasting-room
 *     exclusives and `artwork.exclusive` is the column for exactly that. POST /artwork does not
 *     accept the field, so the fact lives in `notes` instead. ⚠️ Adding it means editing
 *     worker.js, which is 29.3KB against a 30KB read cap — a full blind retype. Do it in the
 *     same pass that splits the worker, not before.
 *
 * SIGNATURES. Ana signs these two ways: a compact AI monogram, or a stacked ANA INC block. Both
 * appear on this one sheet, so it is not a per-sheet or per-run marker in any obvious way.
 * Recorded per print in `notes` because it is a real, visible property of the object and costs
 * nothing to keep. It describes THE COPY IN THE BINDER, not the artwork in the abstract —
 * strictly it belongs on `copy.notes`, but POST /artwork hardcodes that field to null. Minor.
 *
 * ⚠️ NOT INVENTED: `acquired_where` is left empty on every copy. Vending machine, pop-up, shop
 * and trade are all plausible and none is known. A plausible guess in a data field is worse than
 * a blank, because the blank is honest and the guess is indistinguishable from a fact.
 */
(function () {

  /* One sheet. `sheet_order` is deliberately ABSENT — the worker computes MAX+1 for the binder,
   * so this lands after whatever Michael has at the moment it runs, rather than at a position
   * this file guessed in advance. `sheet_id` is explicit and NON-POSITIONAL on purpose: the
   * existing `mini-binder-s1` is the SECOND sheet, an id minted from a 0-based order, and that
   * off-by-one lie is not worth repeating. An id should say what a thing is, not where it sat
   * on the day it was made. */
  var SHEET = {
    sheet_id: 'sheet-drinks',
    binder_id: 'mini-binder',
    title: 'Drinks'
  };

  /* side · position · id · name · notes.
   * Position is 0-8 in READING ORDER, left to right then top to bottom, matching the 3x3 grid in
   * the photographs. The UI shows position + 1; the data is 0-based (CHECK position BETWEEN 0
   * AND 8).
   * ⚠️ 'A' and 'B' are what the DATABASE stores (CHECK side IN ('A','B')). FRONT and BACK are
   * what a person reads, and `FACE` in binder.js is the only place the two vocabularies meet.
   * The swap below moved the letters. It did not rename anything. */
  var PRINTS = [
    /* ---------- FRONT (side A) — all beer ---------- */
    { side: 'A', position: 0, id: 'pbr', name: 'PBR',
      notes: 'A Pabst Blue Ribbon can. Signed AI.' },
    { side: 'A', position: 1, id: 'rainier-beer', name: 'Rainier Beer',
      notes: 'A Rainier can. Signed ANA INC.' },
    { side: 'A', position: 2, id: 'brooklyn-pilsner', name: 'Brooklyn Pilsner',
      notes: 'A yellow Brooklyn Brewery pilsner can. Brooklyn Brewery tasting-room collab, May 2024 — announced as a teeny Pilsner can. Signed AI.' },
    { side: 'A', position: 3, id: 'brooklyn-lager', name: 'Brooklyn Lager',
      notes: 'A Brooklyn Lager bottle. Brooklyn Brewery collab. Signed AI.' },
    { side: 'A', position: 4, id: 'sportini', name: 'Sportini',
      notes: 'A martini with a soccer ball and a basketball where the olives go. Signed ANA INC.' },
    { side: 'A', position: 5, id: 'allagash', name: 'Allagash',
      notes: 'An Allagash White can, mountains on the label. Signed ANA INC.' },
    { side: 'A', position: 6, id: 'lunch-bottle', name: 'Lunch Bottle',
      notes: 'A Maine Beer Company Lunch IPA bottle. Signed ANA INC.' },
    { side: 'A', position: 7, id: 'guinness', name: 'Guinness',
      notes: 'A pint of Guinness, full head. Signed ANA INC.' },
    { side: 'A', position: 8, id: 'pony', name: 'Pony',
      notes: 'A Miller High Life pony bottle. Signed AI.' },

    /* ---------- BACK (side B) — wine, cocktails, one barn ---------- */
    { side: 'B', position: 0, id: 'wine', name: 'Wine',
      notes: 'Four bottles in a row. The card is captioned Wine* , asterisk and all; stored as Wine. Signed ANA INC.' },
    { side: 'B', position: 1, id: 'six-pack', name: 'Six Pack',
      notes: 'A Corona Extra six-pack in its carrier. Signed ANA INC.' },
    { side: 'B', position: 2, id: 'champagne-tower', name: 'Champagne Tower',
      notes: 'A stacked tower of coupe glasses. Signed ANA INC.' },
    { side: 'B', position: 3, id: 'cocktail-shaker', name: 'Cocktail Shaker',
      notes: 'A steel three-piece cobbler shaker. Signed ANA INC.' },
    { side: 'B', position: 4, id: 'the-black-barn', name: 'The Black Barn',
      notes: 'A dark timber barn, the one non-drink on the sheet. Its title is hand-written VERTICALLY inside the image rather than on the lower margin like every other card here. Signed ANA INC.' },
    { side: 'B', position: 5, id: 'martini', name: 'Martini',
      notes: 'A dirty martini, three olives on the pick. Signed AI.' },
    { side: 'B', position: 6, id: 'topo-chico', name: 'Topo Chico',
      notes: 'A Topo Chico mineral water bottle. Signed AI.' },
    { side: 'B', position: 7, id: 'best-friends', name: 'Best Friends!',
      notes: 'A barley stalk and a hop cone holding hands. Brooklyn Brewery tasting-room collab, May 2024 — the brewery announced the run as containing a sweet meeting between hops and barley, which is this card. Signed AI.' },
    { side: 'B', position: 8, id: 'bottle-cap', name: 'Bottle Cap',
      notes: 'A single crimped bottle cap, seen face on. Signed AI.' }
  ];

  /* Applied to every print. Kept as one object rather than repeated eighteen times: a field that
   * is the same for all of them should be stated once, or the seventeenth copy is where the typo
   * lives. */
  var DEFAULTS = {
    category: 'mini',            // size/format. NOT the same axis as edition_type.
    edition_type: 'open',        // read the header before changing any of these to limited
    retail: 1.00,                // DOLLARS. Never cents.
    provenance: 'owned',         // a CHECK-listed value; the one that fits a binder find
    confidence: 'named',         // the title is written on the card — see the header
    own: true,                   // photographed in his binder, so he has it
    qty: 1
  };

  window.Batch = {
    /* Shown on the back-room screen so a person can see WHAT they are about to run before they
     * run it, without reading this file. */
    label: 'Sheet 3 \u00b7 Drinks',
    source: 'Two photographs, 2026-07-30. Beer face is the FRONT (corrected 07-31).',
    sheet: SHEET,
    defaults: DEFAULTS,
    prints: PRINTS,

    /* The body for POST /artwork. Built here rather than in the runner, so the runner never has
     * to know the shape of a print — it only knows how to send things and read the answer. */
    artworkBody: function (p) {
      return {
        artwork_id: p.id,
        name: p.name,
        category: DEFAULTS.category,
        edition_type: DEFAULTS.edition_type,
        retail: DEFAULTS.retail,
        provenance: DEFAULTS.provenance,
        confidence: DEFAULTS.confidence,
        notes: p.notes || null,
        own: DEFAULTS.own,
        qty: DEFAULTS.qty
      };
    },

    /* The body for POST /slot. `edition_id` is deliberately omitted: NULL is the normal case
     * (Q12 = B) and means this print is in this pocket, without claiming to know WHICH
     * impression. Naming an edition here would be inventing a fact about a physical object. */
    slotBody: function (p) {
      return {
        sheet_id: SHEET.sheet_id,
        side: p.side,
        position: p.position,
        artwork_id: p.id
      };
    }
  };
})();
