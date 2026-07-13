# Inciardi Market — Catalog Refresh Runbook (v2, D1-aligned)

**What this covers:** the light, periodic top-up of the **catalog + machine data that lives in Cloudflare D1** ("a new drop landed, add it"; "a machine went empty"). This is the **session web-search pipe**, distinct from the eBay price pipe. For the deep 500+ excavation, see `catalog-research-routine.md`.

> **⚠️ Read this first — the store of truth moved.** The catalog is no longer a committed `catalog.json` file. It lives in the **D1 database** (`catalog`, `catalog_alias`, `print_image`, `machine`, `machine_print`, `machine_event`), read + written through the **Cloudflare Worker API**. `catalog.json` is now only a staging/export artifact and a human-readable mirror; **writing it does nothing to the live app.** Every real write goes through the worker's gated `POST` endpoints. Schema truth: `db/schema.sql`.

> **Two pipes, don't confuse them.**
> - `market.json` — eBay prices + listing diff. Refreshed by the **Worker cron** (every 6h). Structured API pull. NOT this doc.
> - **D1 catalog + machines** — the print universe, images, and machine locations. Refreshed by a **wide session web search**, run occasionally, by hand ("refresh the catalog"). Written via worker `POST`. THIS doc.

---

## When to refresh

No cron, no schedule. Run it when:

- A new drop lands (Anastasia posts a new collection / season).
- A new exclusive series appears (LACMA, Richard Scarry, a museum/retail partner).
- **A machine is announced, moves, or gets reported empty / out-of-stock / restocked.**
- The eBay scan keeps surfacing prints that show as `unmatched` (means the catalog is behind reality).
- Roughly monthly as hygiene.

---

## The write path (how data actually lands in the app)

All writes are gated: send header `x-write-key: <WRITE_KEY>` (the secret in the Worker env). Base URL is the deployed worker origin.

| Goal | Endpoint | Notes |
| --- | --- | --- |
| Add / edit a print | `POST /catalog` | Body uses the D1 field names (below). Slug + `ON CONFLICT(print_id)` upsert + aliases handled server-side. |
| Attach an image | `POST /catalog/image/scrub` | **Decision B (locked 2026-07-13): scrub the Shopify CDN image into R2**, don't just reference the URL. Body `{ print_id, source_url, make_primary }`. Host must be allowlisted (`cdn.shopify.com`). |
| Upload an image (base64) | `POST /catalog/image` | For non-CDN art (Instagram screenshot, etc.). |
| Add / edit a machine | `POST /machines` | `{ op:"upsert"|"delete", ...machine fields }`. |
| Flip machine stock status | `POST /machines/stock` | `{ machine_id, status, source, notes }`. Logs a `machine_event`. |
| Link a print to a machine | `POST /machines/print` | `{ op:"link"|"unlink", machine_id, print_id, in_stock, last_seen_at }`. |

> Worker endpoint code lives in `worker.js`; the machine handlers + router wiring are specified in `catalog-research-routine.md` → "Worker wiring." If an endpoint 404s, it isn't merged/deployed yet.

---

## D1 field contract (use THESE names, not the old JSON keys)

`catalog` row (via `POST /catalog`):

| Field | Was (old JSON) | Notes |
| --- | --- | --- |
| `print_id` | — | kebab slug, stable join key. Server derives from title if omitted. |
| `title` | `name` | Anastasia's official name. |
| `category` | `category` | `mini` \| `big-riso` \| `linocut` \| `exclusive` \| `pack` |
| `exclusive` | `exclusive` | `nyc` \| `lacma` \| `grand-central` \| `richard-scarry` \| `holiday` \| null |
| `retail` | `retail` | USD number or null (exclusives). |
| `in_print` | `available` | 0/1, currently sold new. |
| `pack_of` / `pack_from` | `packOf` / `packFrom` | pack size / draw-pool. |
| `source` | `source` | provenance: `shop-harvest` \| `press` \| `vending` \| `ebay-confirm` \| `manual` \| `seed`. |
| `locked` | — | 1 = hand-entered; harvest fills blanks but never clobbers. |
| aliases | `aliases[]` | go to the `catalog_alias` table, NOT a column. Pass `aliases: [...]` in the body; server writes them. |

**Gone for good:** there is no `image` column (images live in `print_image`), no `series`, no `year`, no `status` column on catalog. If you see those, you're looking at the retired pre-migration schema.

---

## Machines (first-class now)

Machines are their own layer and a **filter dimension for prints**: filter prints by location (which machine/city/state carries them) and by machine status. Machines go empty / out-of-stock constantly, so `status` is first-class.

- `machine`: `machine_id, name, address, city, state, country, lat, lng, collection, status, status_checked_at, source, locked, notes`. `status` ∈ `active | empty | out-of-stock | restocked | removed | unknown`.
- `machine_print`: the M:N join (`machine_id, print_id, in_stock, last_seen_at`). This is what powers "filter prints by location."
- `machine_event`: status timeline (`restocked | emptied | out-of-stock | installed | removed | seen`). Restock rhythm = buy-side signal.

**Machine sources (priority):** official store locator (`inciardiprints.com/pages/store-locator`) is canonical for locations; vending-info page for machine count/background; press + host-shop posts for sightings and which machine carries which exclusive.

---

## Starting-point sources (in priority order)

### Canonical (Anastasia's own, always check first)

| Source | URL | Pulls |
| --- | --- | --- |
| Inciardi Prints — store JSON | https://inciardiprints.com/products.json?limit=250 | Master product list (see research routine for the 3-layer harvest) |
| Collections index | https://inciardiprints.com/collections | Category structure |
| Store Locator (MAP) | https://inciardiprints.com/pages/store-locator | **Canonical machine locations** |
| Vending Machine Info | https://inciardiprints.com/pages/mini-print-vending-machine-1 | Machine count + program background |

### Press / host shops (exclusives + machine sightings)

| Source | Pulls |
| --- | --- |
| People / local-news (search "Inciardi vending machine") | New machine openings, exclusive collection news, empty/restock reports |
| Host-shop posts (McCoy Kids, Tidal Pages, etc.) | Which shop has which machine + which exclusive |

### Community / reference (answer key ONLY)

| Source | Note |
| --- | --- |
| miniprint.io | Competitor, paywalled. Coverage gauge only ("they claim 500, we have N"). **Never lift their catalog, naming, or data.** |

### Market signal (cross-check only)

- The live `market.json` eBay scan. If a print name shows there but not in the catalog, research it and add under Anastasia's official name. Never treat an eBay seller's title as canonical.

---

## How to run a refresh

1. **Search wide.** Canonical sources first, then press/host shops, then miniprint.io as a coverage gauge only.
2. **Reconcile, don't duplicate.** Match against the live D1 catalog (`GET /catalog`). Same print under a variant name = one canonical row + the variant as an **alias** (never a new print). Watch framed-vs-unframed and seasonal re-releases (same image = same print).
3. **Upsert prints** via `POST /catalog` using the D1 field names above. Set `category`, `exclusive`, `retail`, `in_print`, pack fields; pass `aliases[]`.
4. **Scrub images** into R2 via `POST /catalog/image/scrub` (decision B). No image found → leave imageless + flag provisional; never borrow a Vault/seller image as canonical.
5. **Update machines:** `POST /machines` for new/moved machines; `POST /machines/stock` when one is reported empty/restocked; `POST /machines/print` to link prints to a machine.
6. **Cross-check eBay `unmatched`** and feed resolved titles into `catalog_alias`.
7. **Mirror to `catalog.json`** (optional, human-readable export) and **log the pass** in the research routine's Progress Log.
8. **Commit** any file changes via branch → PR → self-merge (data-only, no app version bump). Remember: the commit is the mirror; the `POST`s are what the app reads.

---

## Guardrails

- **D1 is the store of truth, written via the worker.** `catalog.json` is a mirror/export; committing it does not update the app.
- **Official names win.** eBay seller titles normalize to aliases.
- **Provenance or provisional.** Unsourced never enters canonical; `locked=1` protects hand-entered values from harvest clobber.
- **Images scrubbed to R2 (decision B).** Canonical art is stored, not hotlinked. Storage cap enforced by the worker (4.5GB); 500 thumbnails is trivial against it.
- **Merge, don't delete.** Corrections re-point `print_id` FKs; nothing orphans.
- **Retail != market.** Retail is Anastasia's fixed price (catalog). Market is eBay's rolling number (trend store).
- **Catalog is owner-agnostic.** The print *universe*, not anyone's collection. Ownership lives in `inventory`.
- **Machines are canonical on Anastasia's locator.** Track a working set; always link out to the official map.
