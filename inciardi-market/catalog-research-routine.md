# Inciardi Market — Catalog Research Routine (Deep Rebuild SOP)

**Purpose:** systematically rebuild `catalog.json` toward the *full* Ana Inciardi print universe (500+ prints) from legitimate primary sources, scrubbed and normalized, with provenance on every row. This is the **deep excavation** routine. Any agent should be able to pick this up cold and make real progress.

> **This is NOT `catalog-refresh.md`.** That doc is the light periodic top-up ("a new drop landed, add it"). THIS doc is the systematic dig-and-scrub campaign that grows a 37-row working seed into the real universe. Different depth, different cadence. Refresh = maintenance. Research = construction.

---

## Prime directives (read before touching anything)

1. **We recreate the universe ourselves. We do NOT reference Vault (miniprint.io).** It is a third-party paywalled competitor. It is allowed as an *answer key* only: glance at "they claim 500, we have N" to gauge coverage. Never lift their catalog, naming, or data. Everything we ship must trace to a source WE pulled.
2. **Anastasia's own footprint is canonical.** Her Shopify store, her social drop history, the official machine map, and press coverage are the truth. The live eBay market is a discovery signal (it reveals prints that exist), never a naming authority.
3. **Provenance on every row.** Every print carries a `source` (how we know it exists). If you can't source it, it doesn't go in canonical, it goes in the provisional lane.
4. **Naming is Anastasia's, not a seller's.** eBay titles are noisy. Normalize to her official names; fold seller variants in as aliases, never as new prints.

---

## The unlock: Shopify `/products.json` (primary harvest source)

inciardiprints.com is a Shopify store, so the entire live catalog is available as clean, paginated JSON with zero scraping. This is the backbone of the routine.

**Endpoints:**
- Full store: `https://inciardiprints.com/products.json?limit=250&page=1` (increment `page` until an empty `products` array).
- Per collection: `https://inciardiprints.com/collections/<handle>/products.json?limit=250&page=1`.

**Three layers of prints live in that JSON, mine ALL of them:**

| Layer | Where | Example (verified 2026-07-10) |
| --- | --- | --- |
| **Product** | `products[].title` | "Spring Mini Print Mystery Pack", "Pocket Potholder" |
| **Variant** | `products[].variants[].title` / `options[].values` | "8x10\" Risograph Prints" holds 9 print themes: Swiss Chard, Cake, Jello, Lowly, Pickle Car, Martini, Negroni, Hot Dog, Blueberries |
| **Mystery-pack contents** | `products[].body_html` prose | Spring pack body lists 15: gingko leaf, umbrellas, bunny, sunday afternoon bike flowers, crocus, wellie, robin's nest, spring peeper, daffodils, clippers, bee, slickers, watering can, luna moth. Winter lists 10 (Sock, Hat, Mitten, Pippa, Chimney, Hot Cocoa, Pickle Ornament, Pinecone, Sled, Spitzbuben Cookie). Valentine's lists 13, flagged "4 brand new prints." |

**Per-record fields worth capturing:** `title`, `handle`, variant `title`, `price` (in cents; `4800` = $48 pack, `600` mini, etc.), `available` (in-print vs sold-out signal), `images[].src` (real print art, canonical image URL), `created_at` / `published_at` (drop date = provenance + rarity signal), `tags`, `product_type`.

> **Why this beats scraping:** the storefront HTML lazy-loads product grids via JS, so a plain page fetch returns almost nothing. `/products.json` returns the whole structured truth. Always prefer it.

### Collection map (harvest each `/collections/<handle>/products.json`)

Pulled live 2026-07-10 from `/collections`:
`oysters` (Addison's Drawings, guest), `all-food`, `all`, `bigger-risograph-prints`, `catalog`, `drink`, `food-brands`, `food-tools`, `framed-minis`, `frames`, `side-dishes` (Guest Artist), `inciardi-hats`, `gct-holiday-market` (Holiday Merch / Grand Central), `not-food` (Inedible), `kitchen`, `holiday-print-drop` (Linocut Prints), `mini-print-collectors-club-subscriptions`, `clothing` (Mystery packs), `mystery-packs`, `pins-patches-keychains-etc`, `produce`, `savory`, `snacks`, `spring-drop-other-stuff`, `stickers-matches`, `sweets`, `t-shirts`, `the-classics`, `tomato-series`.

Collections give the **category/series classification** a flat product list can't. Cross-reference: a print's collection memberships tell you its `category` and whether it's part of an exclusive/seasonal series.

---

## Secondary sources (fill gaps the store doesn't show)

The store shows what's *currently listed*. Retired drops, sold-out seasonals, and exclusives that never hit the main store need these:

| Source | Pulls | Notes |
| --- | --- | --- |
| Anastasia's Instagram drop history | Retired/seasonal prints, brand-new-print announcements, drop dates | Primary for prints no longer for sale |
| Official store locator `inciardiprints.com/pages/store-locator` | **Canonical machine locations** | The machine truth; always link out rather than claim completeness |
| Vending info `inciardiprints.com/pages/mini-print-vending-machine-1` | Machine count, program background, exclusive-collection context | Refresh `machineCount` from here |
| Press (People, local news; search "Inciardi vending machine") | New machine openings, exclusive collections (Richard Scarry, LACMA, Grand Central) | Exclusives often break in press before the store |
| Host-shop posts (McCoy Kids, Tidal Pages, etc.) | Which shop has which machine + which exclusive | Machine-to-exclusive mapping |
| Live eBay `market.json` scan | **Discovery signal only** | A print showing `unmatched` there but absent from catalog = a real gap to research and add (under Anastasia's name, not the seller's) |

---

## Scrub & normalize discipline (the part that keeps the spine clean)

The normalized backbone is already built in `db/schema.sql` (`catalog` + `catalog_alias` + `inventory` + trend store, joined by `print_id`). This routine FEEDS that spine. Rules:

1. **One canonical row per real print, keyed by a permanent `print_id` slug.** "Framed Olive" and "Olive" and a seller's "olive mini print" are ONE print with one `print_id`. The framed-ness is a variant/attribute, not a new print.
2. **Every real-world name variant becomes an `alias`, never a new print.** The `catalog_alias` table exists exactly so the fuzzy matcher gets smarter over time. Feed it: every resolved eBay title, every seller spelling, every "Cheese #1 / slice of cheese / cheddar" variant.
3. **Manual/unverified entries NEVER write straight into canonical `catalog`.** They land provisional (the `provisional_label` pattern inventory already uses when `print_id` is null) and sit in a holding lane until a human confirms: promote to a real `print_id`, or merge as an alias/dupe of an existing print. This gate is what stops "Cheese #1 / cheese 1 / Chese" becoming three phantom prints.
4. **Correcting a bad entry = MERGE, not delete.** If two rows are the same print, merge: the wrong name becomes an alias of the right one, and any inventory/market/history rows re-point via the `print_id` FK. Nothing orphans, history survives. Same for machines/locations: a hand-entered machine is provisional until reconciled against the official map (wrong city, dup shop, misspelling caught at reconcile, never in canonical).
5. **Framed vs unframed, seasonal re-releases:** same image = same print. Don't let a re-release or a framed listing spawn a duplicate.

---

## How to run the routine cold (step by step)

1. **Pull the whole store.** Page through `/products.json?limit=250` until empty. Capture title + variants + body_html + images + dates + availability for every product.
2. **Explode the three layers.** Extract product-level prints, variant-level prints, AND parse mystery-pack `body_html` for embedded print-name lists. The mystery packs are where a lot of the 500 hide.
3. **Classify via collections.** Hit each `/collections/<handle>/products.json`; use membership to assign `category` (mini | pack | big-riso | linocut | exclusive | ...) and detect series/exclusives.
4. **Reconcile against existing `catalog.json`.** For each harvested print: exact/fuzzy match to a canonical row. Match -> add any new name as an alias, refresh retail/availability/image. No match -> new canonical row (sourced) OR provisional if uncertain.
5. **Sweep secondary sources** for retired/seasonal/exclusive prints the store no longer lists (Instagram history, press, host shops). Add with `source` noting where each came from.
6. **Cross-check eBay `unmatched`.** Anything the market surfaces that we still don't have = a targeted research item. Resolve to Anastasia's real name before adding.
7. **Coverage gauge (Vault as answer key only).** Note the delta vs the claimed 500+. Do NOT copy anything; just know how much universe is left to dig.
8. **Write `catalog.json`** with honest `source`/`note`, real per-print `retail` where known, `null` for exclusives with no standard retail. Update `machineCount` / `richardScarryMachineCount` from the vending page.
9. **Log the pass** in the Progress Log below (date, sources hit, print count before/after, known gaps). This is what makes the routine resumable.
10. **Commit** via branch -> PR -> self-merge (GitHub MCP Operating Standard). Data-only change: no app shell/version bump.

---

## Guardrails

- **Never reference/copy Vault.** Answer key only. Everything ships sourced from our own pulls.
- **Official names win.** Seller titles normalize to aliases.
- **Provenance or provisional.** Unsourced never enters canonical.
- **Merge, don't delete.** Corrections preserve `print_id` links and history.
- **Retail != market.** Retail is Anastasia's fixed price (belongs here). Market is eBay's rolling number (belongs in the trend store, not here).
- **Catalog is owner-agnostic.** The print *universe*, not anyone's collection. Ownership lives in the `inventory` plane, not here.
- **Honest completeness.** `catalog.json` is a growing working set until proven complete; keep the `note` and the official-map link honest.

---

## Progress Log

_Append one entry per research pass. Newest on top. This is what makes the routine resumable by any agent._

### 2026-07-10 — Routine established + first harvest pass begun

- **Sources hit:** `inciardiprints.com/products.json` (verified working, rich 3-layer data), `/collections` index (29 collections mapped), `/collections/all` + `/collections/minis` + `/collections/holiday-print-drop` (linocuts), spot press/store data.
- **Key discovery:** the Shopify `/products.json` endpoint is the excavation backbone (products + variants + mystery-pack body prose = three layers of prints). Storefront HTML lazy-loads and returns nothing to a plain fetch; the JSON endpoint returns everything. Documented above.
- **New prints surfaced this pass (not yet all in `catalog.json`):** 8x10 Riso themes (Swiss Chard, Cake, Jello, Lowly, Pickle Car, Martini, Blueberries); Spring pack set (gingko leaf, umbrellas, bunny, sunday afternoon bike flowers, crocus, wellie, robin's nest, spring peeper, daffodils, clippers, bee, slickers, watering can, luna moth); Winter pack set (Sock, Hat, Mitten, Pippa, Chimney, Hot Cocoa, Pickle Ornament, Pinecone, Sled, Spitzbuben Cookie); Valentine's pack set (Bow, Conversation Hearts, Box of Chocolates, Heart Cake, Valentine, Puppy Love, Queen of Hearts, Love Note, Wedding Chapel, Cherries, Tulips, Bouquet); Classics pack (10 from 50+); linocut additions (Tulip Bouquet, Carrots).
- **State:** `catalog.json` still the ~37-row seed. Full paginated harvest + explode + reconcile into `catalog.json` is the next execution step (not yet committed to `catalog.json` this pass; routine + method locked first).
- **Known gaps / next:** page through ALL `/products.json` pages; harvest every `/collections/<handle>/products.json`; parse ALL mystery-pack bodies; sweep Instagram drop history for retired seasonals; then do the big reconcile write into `catalog.json` and feed `catalog_alias` from eBay `unmatched` titles.

---

_Home: `inciardi-market/`. Sister doc: `catalog-refresh.md` (light periodic top-up). Spine: `db/schema.sql`. Consumers: the market tracker + the ownership/inventory side._
