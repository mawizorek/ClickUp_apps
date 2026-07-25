# Artwork Registry — the authored canon

**This folder is the SOURCE OF TRUTH for what artworks exist.** Not the Shopify harvest. Not eBay. Not D1.

Established 2026-07-25 after a day in which every single failure had the same shape: **a downstream consumer inventing upstream truth.** The harvest generated identity (`slug("#1") === "1"`, so every product's `#1` collided), the market fuzzy-matched listing titles backwards onto catalog names (so unmatched listings vanished silently), and the CSS decided whether data was visible at all. Nothing owned its own layer.

The inversion, in Michael's words: *"catalog searching the market for existence and logging itself, rather than the market defining what's in the catalog."*

---

## The three entities (this is the part that was missing)

The old schema had two tables trying to hold three concepts, which is why "each print should exist once" was literally un-answerable.

| Entity | What it is | Cardinality | Home |
| --- | --- | --- | --- |
| **ARTWORK** | The creative work. "Watermelon." "Brooklyn Ginkgo." | one, forever | **this registry** |
| **EDITION** | A specific impression or unique object. Ginkgo #4. Linocut 7/12. | 1..N per artwork | this registry (`editions[]`) |
| **COPY** | The physical thing Michael holds. | 0..N per edition | D1 `inventory` (runtime) |

`ARTWORK` had never existed as a first-class thing. That's the whole fix.

## Authority model

```
registry/*.json   AUTHORED   what exists, what it's called, how many editions   ← git, versioned, diffable
      ↓
D1 catalog        RUNTIME    a loaded projection of the above
      ↓
D1 inventory      RUNTIME    what Michael owns (the binder)
      ↑
Shopify harvest   PROPOSES   availability, price, new-product suggestions — NEVER identity
eBay market       OBSERVES    listings, queried PER ARTWORK from the registry
```

**Rules that follow from that diagram:**

1. **The harvest may never mint an artwork.** It proposes; Michael adopts. A feed that suggests can be wrong harmlessly. A feed that authors cannot.
2. **`artwork_id` and `edition_id` are HAND-WRITTEN and permanent.** No generated slugs, ever — that's the bug class this folder exists to kill. Never renumber; add and retire.
3. **A display name change is never an identity change.** Rename freely; the id is the identity.
4. **Every edition carries `source_url`** (the Shopify CDN original). This is a hard requirement, not a nicety: R2 image bytes are the only unrecoverable asset in the system (snapshots carry image *rows*, not bytes), and the CDN passthrough is what keeps the binder from being blank for ~15 hours after any rebuild.

## `edition_type` — the domain distinction that changes behavior

A `#4` and a `7/12` are **not the same kind of number** and must not be rendered or scored the same way.

| Type | Meaning | "#7 sold" means | "Do I own it?" |
| --- | --- | --- | --- |
| `unique` | Monoprint. Each numbered object is genuinely different. Anastasia: *"one of a kind, no two are the same."* | **Gone forever, unrepeatable.** | Owning #4 ≠ complete. #2 is still open. |
| `limited` | Run of N near-identical impressions. `7/12`. | N-1 remain. Mildly interesting. | Any impression satisfies. Done. |
| `open` | Reprinted freely. Most minis. | n/a | Own one, own the artwork. |

Without this the binder cannot answer *"is my Watermelon complete?"* — which is the single question a binder exists to answer.

## Field spec

```jsonc
{
  "artwork_id": "brooklyn-ginkgo",   // HAND-WRITTEN, permanent, kebab-case
  "name": "Brooklyn Ginkgo",         // display; change freely
  "aliases": ["Alex's Brooklyn Ginko", "gingko leaf"],  // eBay matching + old names
  "artist": "Alex Inciardi",         // omit for Anastasia (the default)
  "category": "mini",                 // mini | big-riso | linocut | pack
  "collection": "spring",             // the shop's own grouping = a binder SHEET
  "exclusive": null,                  // nyc | lacma | grand-central | richard-scarry | holiday
  "edition_type": "unique",
  "edition_of": 13,                   // known run length; null if unknown
  "retail": 15,                       // DOLLARS. never cents. see README price trap.
  "shop_handle": "alexs-brooklyn-ginko",  // links harvest enrichment back; stable across renames
  "editions": [
    { "edition_id": "brooklyn-ginkgo-1", "label": "#1", "size": "3x4", "available": false,
      "source_url": "https://cdn.shopify.com/..." }
  ],
  "provenance": "pack-roster",        // how we learned this exists — see below
  "confidence": "named"               // named | inferred | placeholder
}
```

`provenance` values: `shop-product` (its own listing) · `pack-roster` (named in a mystery-pack description) · `owned` (Michael has it, no listing) · `market` (seen only on eBay) · `manual`.

**`confidence` is load-bearing and honest:** `named` = we have the real title. `inferred` = derived from a roster but not yet matched to a product/photo. `placeholder` = a row that exists so the object can be tracked, awaiting real data. **The binder must show `inferred`/`placeholder` differently** — a registry that hides its own uncertainty is how the harvest earned its distrust in the first place.

## Files

- `artworks.json` — the canon. Seeded 2026-07-25.
- Future: split per collection if it outgrows one file (Size Sally's call at ~500 artworks; it is nowhere near that).

## Status of this seed (read this before trusting a count)

**54 artwork names are VERIFIED REAL**, extracted from mystery-pack descriptions that enumerate their contents — the shop was already telling us every print name and `parsePack()` was reading those exact blobs for counts while discarding the roster.

**Not yet done, deliberately not invented:**
- Matching each roster name to its product photo + `source_url`. Needs a per-product walk; the names are right but most `editions[]` are empty.
- Beach (13), Ice Cream (16), Whitney (15) rosters: the pack descriptions give **counts but no names**. 44 artworks known to exist, unnamed. Recorded as counts, not fabricated.
- The full ginkgo edition list (11 known: #1-6, #8-11, #13 — #7 and #12 sold).

**A `placeholder` row is more honest than a guessed name.** Do not fill these in from imagination.

## ⚠️ Merch is leaking into `mini`

Live D1 currently contains `panther-nylon-cap`, `baseball-cap`, `blueberries-cap`, `oyster-lemon-cap`, `oyster-beanie` — all categorized **`mini`** at $25-30. `MERCH_TOKENS` in `cron-worker.js` has `"hat"` but **not `"cap"` or `"beanie"`**, so headwear sails through as a mini print. That's ~5 of the 105 "minis" being clothing.

The registry fixes this structurally — merch simply never gets adopted — but the token list should also be patched so proposals stay clean.
