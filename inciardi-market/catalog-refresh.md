# Inciardi Market — Catalog Refresh Runbook

**What this covers:** how to refresh `catalog.json` (the master print list + vending-machine locations). This is the **session web-search pipe**, distinct from the eBay price pipe.

> **Two pipes, don't confuse them.**
> - `market.json` — eBay prices + listing diff. Refreshed by the **Cloudflare Worker** on a cron (every 6h). Structured API pull. NOT this doc.
> - `catalog.json` — master print universe + machine locations. Refreshed by a **wide session web search**, run occasionally, by hand (ask Brain: "refresh the catalog"). Messy, broad, human-triggered. THIS doc.
>
> They update on different cadences because the data lives differently: eBay has an API, the catalog is scattered across the web with none.

---

## When to refresh

No cron, no schedule. Run it when:

- A new drop lands (Anastasia posts a new collection / season).
- A new exclusive series appears (LACMA, Richard Scarry, a museum/retail partner).
- New vending machines are announced or the store-locator map changes.
- The eBay scan keeps surfacing prints that show as `unmatched` (means the catalog is behind reality).
- Roughly monthly as hygiene, even if nothing obvious changed.

---

## Starting-point sources (in priority order)

These are the seeds. Start here every refresh; branch out as needed.

### Canonical (Anastasia's own, always check first)

| Source | URL | Pulls |
| --- | --- | --- |
| Inciardi Prints — All Prints | https://inciardiprints.com/collections/all | Master product list |
| Inciardi Prints — Collections index | https://inciardiprints.com/collections | Category structure (minis, big riso, linocuts, framed, seasonal drops) |
| Framed Minis | https://inciardiprints.com/collections/framed-minis | Framed mini variants |
| Bigger Risograph Prints | https://inciardiprints.com/collections/bigger-risograph-prints | "Big mini" risographs |
| Store Locator (MAP) | https://inciardiprints.com/pages/store-locator | **Canonical machine locations** |
| Vending Machine Info | https://inciardiprints.com/pages/mini-print-vending-machine-1 | Machine count + program background |

### Community / reference

| Source | URL | Pulls |
| --- | --- | --- |
| miniprint.io print list | https://miniprint.io/ana-inciardi-print-list | 500+ community-catalogued prints, "unicorns" / OOC flags. **Competitor + best coverage reference.** |

### Press / host shops (exclusives + machine sightings)

| Source | Pulls |
| --- | --- |
| People / local-news features (search "Inciardi vending machine") | New machine openings, exclusive collection news |
| Host-shop posts (Instagram, shop blogs, e.g. McCoy Kids, Tidal Pages) | Which shop has which machine + which exclusive collection |

### Market signal (cross-check only, NOT a catalog source)

- The live `market.json` eBay scan. If a print name shows up there but not in `catalog.json`, add it. Never treat an eBay seller's made-up title as canonical naming — reconcile against Anastasia's official names.

---

## How to run a refresh

1. **Search wide.** Hit the canonical sources first, then miniprint.io, then press/host-shop results. Prefer Anastasia's official print names as canonical; use miniprint.io to fill gaps and catch OOC/unicorn rarity.
2. **Reconcile, don't duplicate.** Match against the existing `catalog.json`. Same print under a variant name = keep one canonical entry. Watch for framed-vs-unframed and seasonal re-releases of the same image.
3. **Classify each print** into a `category`: `mini`, `pack`, `big-riso`, `linocut`, `exclusive`. Set `exclusive` to one of `nyc` / `lacma` / `holiday` / `richard-scarry` (or add a new token) when it's a limited/partner edition, else `null`.
4. **Set `retail`** from the official shop price when known; `null` for exclusives with no standard retail.
5. **Update machines** from the store-locator + any new sightings. Each machine: `name`, `city`, `state`, `collection`, `notes`, `source`.
6. **Update the header:** bump `refreshedAt` (ISO), refresh `machineCount` / `richardScarryMachineCount` from the vending-info page, and keep `source` honest about what was actually searched this run.
7. **Commit** `catalog.json` via the standard PR-merge flow. Data-only change, no version bump on the app engine.

---

## `catalog.json` schema (the contract)

```jsonc
{
  "refreshedAt": "ISO timestamp of this refresh",
  "source": "one-line note: what was actually searched this run",
  "note": "standing caveat: session-refreshed, not an API pull; master is 500+",
  "officialMap": "https://inciardiprints.com/pages/store-locator",
  "machineCount": 120,
  "richardScarryMachineCount": 42,
  "prints": [
    { "name": "Negroni", "category": "mini", "exclusive": null, "retail": 6 }
    // category: mini | pack | big-riso | linocut | exclusive
    // exclusive: null | nyc | lacma | holiday | richard-scarry
    // retail: number (USD) or null
  ],
  "machines": [
    { "name": "McCoy Kids", "city": "Tacoma", "state": "WA",
      "collection": "Richard Scarry", "notes": "Quarters only", "source": "shopmccoykids.com" }
  ]
}
```

The app derives everything else. `prints[].name` is the join key against `market.json` (`listing.print.name`), so **naming consistency between the two files is what makes the Catalog tab's price-matching work.** If a print reads `unmatched` in the app, the eBay title didn't map to a catalog `name` — that's a naming reconciliation to fix here.

---

## Guardrails

- **Official names win.** eBay seller titles are noisy; normalize to Anastasia's naming.
- **Session refresh is a snapshot, not live.** The doc + the app both say so; don't imply the catalog auto-updates.
- **The full map is canonical on Anastasia's site.** This file tracks a working subset (weighted toward exclusive-carrying machines); always link out to the official locator rather than claiming completeness.
- **500+ is the real universe.** `catalog.json` is a growing working seed, not the whole thing. Keep the `note` honest.
- **Don't fold in personal collection.** That's the separate ~200-print inventory (Nick's DB) + the device-local My Stock tab. The catalog is the print *universe*, owner-agnostic.
