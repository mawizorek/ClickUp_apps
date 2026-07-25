# Inciardi Mini Print Market Tracker

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/inciardi-market/)

![launch](https://img.shields.io/badge/▶︎_Launch-Inciardi_Market-c65a3a)

**Status:** live · front-end **v19** · main worker **v1.4** · harvest cron worker **v1.4** (deployed and running).
**Source of truth:** D1 database `inciardi-market`, written via the Cloudflare workers. This repo folder is canonical for code + schema; `catalog.json` is a human-readable export mirror only.

> It's **Anastasia Inciardi / Inciardi Prints** (Portland, ME). Not "Inciarid."

## What it does

Tracks and sources **Anastasia Inciardi mini prints** on eBay, backed by a self-filling print catalog + a vending-machine location layer.

- **Deal Radar (buy):** live eBay listings scored against a baseline, underpriced surfaced first. Packs judged on per-print value.
- **Sell Signal (sell):** exclusives (NYC / LACMA / Grand Central / Richard Scarry / holiday) with current asks, sparklines, and a "vanished since last scan" rarity proxy.
- **Catalog:** the master print universe in D1 (one row per print), each with versioned images, aliases, retail, availability. Self-fills from Anastasia's Shopify store. NOT a personal-collection inventory.
- **Swipe:** the mobile bulk-input funnel into the Collection — right = own, up = want, left = skip.
- **Collection:** the owned-copies ledger (one row per physical print, cost basis, P/L, own/want/sold).
- **Machines:** the vending-machine location layer — filter prints by which machine/city carries them, with live + historical stock status.

## CATALOG vs MARKET — what feeds what

These are two different pipelines that happen to meet in the UI. Keep them straight:

| | CATALOG | MARKET |
| --- | --- | --- |
| **What it is** | The canonical universe of prints that exist | Live eBay listings, right now |
| **Source** | `inciardiprints.com/products.json` (her own Shopify) | eBay Browse API |
| **Written by** | `cron-worker.js`, daily 09:00 UTC | `worker.js`, cron every 6h |
| **Stored in** | D1 `catalog` + `catalog_alias` + `print_image` | KV snapshot, diffed to new/changed/live/gone |
| **eBay involvement** | **None** | All of it |

They join in exactly one place: `marketFor()` in `app-core.js`, which fuzzy-matches a catalog print to live listings on normalized name + aliases. That's why a rename folds the old name into `aliases` — break the alias and you break the join.

**Known limitation:** the catalog is sourced from ONE site. A print that never appeared on her Shopify (vending-machine-only, museum-shop exclusives, anything retired before the harvest existed) will never enter the catalog on its own. Multi-source discovery is on the roadmap, not built.

<a name="image-law"></a>
## 🖼️ IMAGE RENDERING LAW — read before touching any `<img>`

**Photos have disappeared from this app FIVE times, with five different root causes and one identical symptom.** That track record is the reason this section exists and is worded as law rather than advice. Enforcing code: the image block in `source/app-core.js` + the annotated rules in `source/catalog.css` and `cardHTML()` in `source/catalog.js`.

### The five incidents

| # | Date | Root cause | Layer | Fix |
| --- | --- | --- | --- | --- |
| 1 | 2026-07-13 | Raw `cdn.shopify.com` hotlinks blocked | network | `/img?u=` worker proxy |
| 2 | 2026-07-13 | Worker sent a bare User-Agent, Shopify 403'd it | network | `BROWSER_HEADERS` |
| 3 | 2026-07-25 | 260 MB of full-res originals painted into a phone grid; `w` silently ignored on the R2 branch | payload | derivative thumbs + `imgLadder` |
| 4 | 2026-07-25 | Error handler cache-busted the SAME failing URL, then hid the element | logic | ladder walks to a DIFFERENT source |
| 5 | 2026-07-25 | **`opacity:0` in CSS** waiting on a JS class that never arrived | presentation | inline `opacity:1`, visible by default |

Incident 5 was the one that had been masking all the others: *any* failure anywhere in the stack produced the same blank tile, so three consecutive rounds of diagnosis went to the wrong layer.

### The rules

1. **Never paint an archival original into a list or grid.** Originals here run 1–3 MB; 177 of them is ~260 MB. A phone decodes a handful (*the flash*) then purges or times out the rest (*the vanish*). Grids get a **width-capped derivative** via `thumbSrc()` / `imgLadder()`. Only a detail hero may load the original (`heroSrc()`).
2. **If an image route takes a size param, every branch must honor it — or the param is a lie.** Cards politely called `proxied(url, 360)` and got the full-res file anyway, because the Worker's `/img?key=` (R2) branch reads `w` and can't act on it — you cannot resize a stored blob for free. Thumbnails therefore resolve against the Shopify CDN `source_url`, where `width=` genuinely resizes, server-side, edge-cached 7 days.
3. **An error handler may NEVER retry the same URL with a cache-bust.** The old one re-downloaded the multi-MB file that had just failed, then hid the element on the second miss — converting a slow image into a permanently missing one. A retry moves **down the ladder to a different source**; only the last rung may give up.
4. **Grid images are always `loading="lazy"` + `decoding="async"`,** so 177 cards don't all request at once.
5. **Store derivatives, not camera originals.** The harvest asks the CDN for `width=1600&format=jpg` before writing to R2 — which also converts HEIC uploads into something Chrome can decode. ⚠️ This applies **going forward only**; it never retroactively shrinks what's already in R2. The 177 pre-2026-07-25 originals are still full-res. That's *why* thumbs resolve to the CDN: it makes the grid correct today, independent of a re-scrub that hasn't run.
6. **🔴 NEVER gate visibility on a JavaScript class.** No `opacity:0` + `.loaded`, no skeleton swap, no fade-in that starts from invisible. If the mechanism can fail, the content disappears **and the failure is invisible in every log** — no network error, no console error, no bad database row. It looks exactly like a data problem, which is how this cost three misdiagnoses. Default to visible; let the placeholder sit *behind* the image. **Corollary: when content doesn't appear, read the CSS that governs its visibility BEFORE the pipeline that produces it.** `opacity`, `display`, `visibility`, `z-index`, `overflow` and `height:0` can each hide correct data, and none of them leave a trace anywhere but the stylesheet.
7. **A placeholder must always carry identifying content** — initials, a label, alt text. A featureless colored box makes "failed to load" and "nothing to load" indistinguishable. That ambiguity is a diagnostic dead end: during incident 5, the *absence* of initials was the only clue that an `<img>` existed at all, and it was far too subtle to read.

### Delivery rule (learned the hardest way)

**A fix that lives only in CSS can be defeated by the very cache it is fixing.** A stylesheet can be served stale while the HTML and JS around it are fresh, so the bug appears to survive its own fix — pushing you toward re-diagnosing instead of re-delivering. Two consequences:

- **Belt and braces:** critical visibility guarantees are duplicated as an **inline style** in `cardHTML()`. An inline style beats any cached stylesheet rule. It is not redundant. Do not "clean it up."
- **A `?v=` token cannot fix a stale copy of the document that contains the token.** If the HTML itself is cached, bumping the token inside it changes nothing. Break the loop with a fresh document URL: `catalog.html?fresh=1`.

### Version stamps must not lie

`#f-build` is rewritten at runtime by `app-core.js` from its own `BUILD` constant — so it reports the **JS** version and nothing else. During incident 5 it read "v17" on a fully-updated v18 page and sent the diagnosis down the wrong path for a round. `#f-assets` is static HTML that nothing overwrites and reports the **HTML/CSS** generation. Keep both, keep them independent, and **never treat a version stamp as a freshness signal for a file it doesn't live in.**

## 📸 Working with print photos

Every image lives in `print_image` (one row per photo, many per print) with bytes in R2. Nothing is ever silently replaced — the model is **additive with an explicit primary**, so a bad photo is always recoverable.

**Where:** Catalog → tap a print → **Images** section (requires sign-in).

| Goal | How | What happens |
| --- | --- | --- |
| **Add a photo** | **Upload photo** | Downscaled to 1400px client-side, stored in R2, inserted as a NEW row, and made primary. Prior photos are untouched. |
| **"Overwrite" the catalog photo** | Upload the new one, then **Arch** the old | There is deliberately no destructive overwrite. The new upload becomes primary; archiving the old hides it from the app while keeping the bytes. |
| **Switch which photo shows** | **Set** on any active thumb | Flips `is_primary`. Instant, reversible, no upload. |
| **Hide without losing** | **Arch** | `status='archived'`. Drops out of the grid + hero, stays listed under the archived strip with **Restore**. |
| **Delete for real** | **Arch**, then **Del** | Only reachable from the archived state — a deliberate two-step. Removes the R2 blob AND the row. Not undoable via app backups (snapshots carry image *metadata*, not bytes). |
| **Pull the shop's original** | **Scrub & store original** | Fetches the Shopify CDN file server-side into R2 so it survives the shop changing or removing it. |

**Confirming a change landed:** the Images header counts active + archived, the primary thumb carries a **Main** badge, and the drawer re-renders from a fresh `/catalog` read (`no-store`, so never cached) immediately after any write. If the count and the badge match what you intended, D1 agrees. The grid tile behind the drawer updates in the same pass.

**Snapshots do NOT protect image bytes.** `POST /snapshot` dumps `print_image` *rows* — ids, keys, flags — not the binaries. A restore reinstates which photo is primary; it cannot resurrect a blob that **Del** removed. Archive is the safe action; Del is the irreversible one.

## 🆔 One print, one catalog row (identity model)

`print_id` is a slug of the raw source title and it keys `inventory`, `print_image` and `machine_print`. Because the harvest **never DELETEs**, changing how an id is derived doesn't rename rows — it mints a parallel set and strands the originals along with every collection entry pointing at them. Change display titles freely; **never change id derivation without a migration.**

**Where duplicates legitimately come from:** the shop sells some artwork as one product with numbered variants, and the harvest turns each variant into its own catalog row. For `Alex's Brooklyn Ginko`, variants `#1`–`#4` are **one-of-a-kind monoprints** ("no two are the same," and #1/#3 are 3×4 while the rest are 6×6) — genuinely distinct physical objects that share a subject. For other products, numbered variants are just copies of the identical image.

So "each print exists once" needs a ruling on what a *print* is — the artwork, or the individual object. That's a product decision, not a bug, and it lives in the Decision Log. Until it's settled, the harvest keeps one row per variant (the conservative choice: it never merges away a row that might be a unique object, and merging later is reversible where un-merging is not).

## 💵 Price units (the other trap)

Shopify's **storefront** `products.json` returns `price` as a decimal string **in dollars** (`"25.00"`). The Admin API and Stripe use integer **cents** and look identical at a glance. A `/100` in `retailFrom()` turned every $25 print into `0.25`, rendered as "$0" on every card, and — the part that actually hurt — made `underpriced` (`landed <= 85% of baseline`) mathematically unreachable, so **Deal Radar silently could never flag a buy.** Fixed 2026-07-25. Do not reintroduce a divide or a `Math.round` there.

**Why some rows still show cents:** the harvest only sees products **currently published** on the shop. A retired / sold-out print is never revisited, so it keeps its pre-fix value **forever** — no amount of re-running the cron will correct it. The app flags any row with `0 < retail < 1` and offers a one-tap "Set to $N & lock" repair in the detail drawer. Per-row and opt-in rather than a bulk `retail*100` migration: reversible, visible, and a blind multiply would corrupt any row that legitimately holds a small value.

## How to use it

Open the app; it reads the live D1 catalog + eBay market through the Cloudflare worker. The catalog auto-refreshes daily from the shop and print images backfill within a day — no manual data entry to keep it current. Hand-add or edit a print in the Catalog tab; hand-entered rows are `locked` and the harvest won't clobber them (except availability, which always tracks the live store).

**Naming:** the catalog is MIXED. Many mini variants carry real names in the shop data ("Watermelon", "Jules' Rooster", "Kale"); some are bare numbers, which the harvest composes as `Product Title #N` so they stay sortable and matchable. Rename anything (catalog pencil, or swipe long-press → ✎ Edit); that sets `locked:1` so the nightly harvest leaves your title alone forever, with the old name kept as an alias so eBay matching survives.

## Architecture

**Two Cloudflare workers, one shared store (D1 + R2):**

- **`worker.js` (v1.4) — the live API + market feed.** Reads: `/market` (eBay, diffed vs KV snapshot), `/catalog`, `/inventory`, `/history`, `/machines`, `/usage`, `/img`. Gated writes (`x-write-key`, multi-key → actor `michael`/`nick`): catalog/image/inventory/machine upserts. Backups: `POST /snapshot`, `GET /snapshots`, `POST /restore` (soft restore, auto pre-restore snapshot). Cron every 6h banks eBay market history into D1.
  - ⚠️ **Sets no `Cache-Control` on JSON.** A repaired database was invisible behind a cached response for hours on 2026-07-25. The client compensates with `cache:"no-store"` in `apiGet`/`apiPost`; the real fix is a header here, which needs a chunk-walk because this file is 39 KB (over the safe single-read cap).
- **`cron-worker.js` (v1.4) — the unattended catalog harvest.** Shares the SAME D1 + R2 by binding. Two crons:
  - **Daily 09:00 UTC** — pages Anastasia's Shopify `/products.json`, explodes the product / variant / mystery-pack layers into catalog rows (prints only; merch filtered), tags category + exclusive, upserts via a **locked-aware** path (fills blanks on locked rows, always refreshes `in_print`).
  - **Hourly, self-idling** — scrubs 12 print images per tick from `cdn.shopify.com` into R2 as `width=1600&format=jpg` derivatives, honors the 4.5GB storage cap, no-ops once caught up. New prints render instantly via CDN passthrough, then harden to R2.
  - ⚠️ `SCRUB_BATCH` must stay ≤ ~12 on the Workers free tier: 3 subrequests per image against a ~50/invocation cap.
  - ⚠️ **Stamp a `version` into `/health` on every bump.** `/run/harvest` returns `ok:true` whichever code version is deployed, so a green run proves the route ran, NOT that the fix shipped. That ambiguity cost a wrong diagnosis on 2026-07-25.

**Data model (D1, `db/schema.sql`):** `catalog` + `catalog_alias` + `print_image` (multi-image, R2-backed, archive/restore) + `inventory` + `market_point`/`print_point`/`gone_event` (time series) + `machine` + `machine_print` + `machine_event` (location layer). `provenance` + `locked` flags protect hand-entered rows.

**No sold comps:** baseline = retail + active-listing spread (eBay gates sold history behind the restricted Marketplace Insights API).

## Front-end conventions

- `source/app-core.js` is loaded first on every page and owns the API client, chrome, settings/backup UI, and the image ladder. Page files (`catalog.js`, `swipe.js`, …) build on it — they never re-implement it.
- **Bump the `?v=` token** on every `source/*` script AND link tag whenever any of those files change — **CSS counts.** A browser holding a stale `app-core.js` next to a fresh `catalog.js` is a ReferenceError and a blank page, not a cosmetic lag. (`app-dashboard` learned this in PR #74; this app re-learned it when a CSS-only fix appeared to fail.)
- Dark by default, mobile-first, no fixed-width tables.

## Deploy notes

- **Main worker:** `wrangler.toml` → `worker.js`. Secrets (Cloudflare dashboard): `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `WRITE_KEY`, optional `WRITE_KEY_NICK`. Bindings: KV `SNAPSHOTS`, D1 `DB`, R2 `IMAGES`.
- **Cron worker:** `wrangler-cron.toml` → `cron-worker.js`, deployed as a SECOND Workers Builds project on this repo. Manual triggers: `/run/harvest`, `/run/images`, `/debug` (read-only peek), `/health`.
- **Schema:** `wrangler d1 execute inciardi-market --remote --file=inciardi-market/db/schema.sql`, then `seed-catalog.sql`, then `seed-machines.sql`.
- **Restore paths, in order of reach:** in-app Settings → Backups (R2 snapshots, everyday undo — metadata only, NOT image bytes) → `wrangler d1 time-travel` (30-day point-in-time, catastrophic).

## Version history

- **front-end v19** — cache-proof image visibility: inline `opacity:1` on grid images (survives a stale stylesheet), initials always rendered behind the image so failures are legible, `#f-assets` static version marker that nothing overwrites, one-tap 100x retail repair for retired prints the harvest can't reach, `step="0.01"` on the retail field.
- **front-end v18** — removed the `opacity:0` gate in `catalog.css` that was hiding every grid image until JS added a class. The root cause behind three rounds of misdiagnosis.
- **front-end v17** — `cache:"no-store"` on all data reads. A repaired D1 was invisible behind a cached `/catalog` response.
- **front-end v16 / cron v1.4** — catalog cleanup: width-capped derivative thumbnails + fallback ladder, `retailFrom` `/100` removed (Deal Radar was mathematically unable to flag), numeric variant titles composed as `Product #N` with a stable `print_id`, natural sort, Minis default filter, serialized swipe write queue.
- **front-end v15 / worker v1.4** — R2 snapshot backups + restore, soft two-person login (baked `LOGINS`), multi-key worker auth with actor tagging.
- **front-end v14** — catalog rename + swipe edit-in-place, harvest-safe via `locked:1` + alias fold-in.
- **front-end v13** — swipe-to-sort bulk-input page.
- **worker v1.3 / cron-worker** — unattended Shopify catalog-harvest cron, locked-aware upsert. Separate worker sharing D1/R2.
- **worker v1.2** — machine location endpoints (`/machines*`).
- **worker v1.1** — hard 4.5GB R2 storage cap + `/usage` meter.
- **worker v1.0 / app v10** — ground-up relational rebuild: D1 schema + R2 image store + full API; terminal front-end.
- Earlier: eBay Browse worker + sample-data app. Commit history is authoritative.

## Related

- ClickUp task: Inciardi Mini Print Market Tracker (APPS list).
- Research SOP: `catalog-research-routine.md` (deep rebuild) + `catalog-refresh.md` (light top-up).
- Build spec: `next-build-spec.md`.

## Roadmap

- 🔴 **Rotate the baked write keys.** The accepted-tradeoff decision covered baking a key into a public bundle; it did not cover a guessable one. Long random strings via `wrangler secret put`.
- **Duplicate-identity ruling** (see the identity model above) — then a merge tool if the answer is "one row per artwork."
- **Pack-roster name harvest.** Mystery-pack `body_html` already lists every real print name ("gingko leaf, umbrellas, bunny, crocus, luna moth…", "Lowly Worm, Egg Car, Pickle Car, Goldbug…") and `parsePack()` already reads those blobs for counts while discarding the roster. Turning it into a per-collection candidate-name pool makes naming a tap instead of typing.
- `?v=` tokens on `terminal.html` / `collection.html` / `market.html` — they currently have none at all and can serve a stale core.
- Scheduled auto-snapshot (daily cron → `/snapshot`) + retention/pruning, so backups don't depend on remembering to tap.
- D1 skip-state for swipe (currently localStorage, so it dies every time a browser is cleared — which is the documented reason the login feature exists).
- Multi-source catalog discovery: Poshmark, the Stockist ~120-machine geo list, eBay `unmatched` → auto-research → alias feedback loop.
- One-time re-scrub of the 177 existing R2 originals as 1600px derivatives (~268MB → ~30MB).
- Worker-side `Cache-Control` + fold the harvest into a single worker (both need a chunk-walk of the over-cap `worker.js`).
- Marketplace Insights sold comps if partner access lands.
