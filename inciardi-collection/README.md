# Inciardi Collection

📋 **Decision Log:** `Inciardi Collection — Decision Log` (ClickUp) — every call about this app, newest on top. **Checkbox polarity is INVERTED: a checked box is a REJECTED option.** Q1–Q3 (answered) live on the predecessor's `Inciardi Market — Rebuild Decision Log`; this app's log starts at **Q4**. Read it before touching anything here.

**Status: DEFINED AND SIGNED OFF (2026-07-25). Nothing is built yet.** The sign-off gate (§7) cleared when Q4–Q7 were answered. Code may start; §8 says in what order.

Successor to `inciardi-market/`, which stays live and untouched as a working reference until this replaces it. Clean room on purpose: a day of debugging proved that **inherited state is what fooled us**, so nothing carries over by accident — only by decision.

---

## 1. What this is

**A record of the Anastasia Inciardi prints Michael owns.** A binder. You open it and see what you have, what's missing from each collection, and what's gone forever.

The market lens is a *second* question asked on demand: *"and what's available right now?"* It is not the app's purpose and it is not built first.

Michael's framing, which governs every decision below:

> *"It becomes catalog searching the market for existence and logging itself, rather than the market defining what's in the catalog."*

And the reframe that goes one step further:

> *"A core idea needs to be that I could hand-input ALL of these artworks manually from day one if I wanted. In fact maybe that IS where we start. Any scrubbing and future worker automation is really just gravy on top of defined workflows and known used fields."*

### The acceptance test for the whole app

> **If every worker died tomorrow, could Michael still fully use this app?**

Today, in `inciardi-market`: no. Here: **yes, by construction.** Manual entry is the primary path; automation is additive. That is the answer to *"this just isn't reliable."*

---

## 2. The three entities

The predecessor had three tables named after **where data came from** (`catalog` = the shop, `market` = eBay, `inventory` = Michael). That is why a print in two sources got two rows and a print in no source had nowhere to live. Every table here is named after **what it is**.

| Entity | What it is | Cardinality |
| --- | --- | --- |
| **artwork** | The creative work. "Watermelon." | one, forever |
| **edition** | A specific impression or unique object. Ginkgo #4. | **≥ 1 per artwork, always** |
| **copy** | The physical thing in Michael's binder. | 0..N per edition |

### Why edition is never zero (Q1, decided)

Michael's ruling, which is a better statement of the principle than the question was:

> *"An artwork can't exist without an edition, regardless of it's named or numbered by Anna as an edition. We have to know it's the only edition and create it then."*

An edition is **not a numbering scheme** — it is the physical-instance layer. A thing that exists has at least one instance, whether or not the artist labelled it. So an open-run print gets exactly one edition with `implicit = 1`, and the chain `artwork → edition → copy` is never broken. `copy.edition_id` is `NOT NULL` and always satisfiable, one code path everywhere, no polymorphic parent.

The UI never shows an implicit edition (no "#1" badge on Luna Moth). If Anastasia ever numbers an open print later, the implicit row becomes explicit **with no migration.**

### Derived consequence: images attach to EDITION, not artwork

This falls straight out of Q1 and it is the opposite of the old schema. Each Brooklyn Ginkgo edition has **its own photograph** — they are visibly different objects. An open artwork has one implicit edition, so its photo attaches there. One rule, no special case: **a photograph is of an object, and the object is the edition.**

---

## 3. Authority model — DECIDED (Q4 = A)

```
app forms / capture     PRIMARY    Michael types it. Where data is BORN.
        ▼
D1 artwork·edition·copy SOURCE     the live record. The only authority.
        │
        └─► registry/*.json  EXPORT   generated snapshot → git history. Read by nothing.

Shopify harvest         PROPOSES   new products, availability, price. NEVER identity.
eBay                    OBSERVES   queried per-artwork. Shelved to P3.
```

### The correction that settled it

The registry-in-git idea was reached for as protection against the harvest. **But the protection was never "the file lives in git" — it was "the row knows who wrote it."** Those got conflated.

`provenance` on every row is what stops the harvest clobbering hand-entered truth. Once that exists, git is no longer needed for *authority* — only for *versioning*.

**Q4 = A. D1 is the source. `registry/artworks.json` is now a one-time SEED plus a generated export.** No loader route, no import path, no write key in a public bundle for imports, and **the 39KB `worker.js` chunk-walk is off the critical path.** This supersedes Q3 (*worker route*), which Michael flagged soft at the time.

### Does the git export earn its place? (Michael's Q4 note)

> *"Is the git json really necessary at all? If I can write to D1 from app from phone then that's fine? And that carries some roll-back anyway, doesn't it?"*

**Partly yes.** D1 ships [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/): always on, no cost, no setup, restores the database to **any minute within the last 30 days** via automatic bookmarks. That is real point-in-time recovery and it covers the scary cases — a bad migration, an `UPDATE` with no `WHERE`.

Three things it does **not** cover, which is exactly what the export is for:

| Gap | Consequence |
| --- | --- |
| **Whole-database only.** | Fat-finger one artwork name, notice three days later, and restoring to fix it discards three days of every *other* entry. There is no per-row recovery. |
| **The 30-day cliff.** | Beyond 30 days there is no history at all. A binder built over two years cannot answer "what did this row say last spring." |
| **Same-account single point of failure.** | Time Travel lives inside the same D1 database. If the binding, the database, or the account goes, the backup goes with it. It is not an off-platform copy. |

So the export survives, **demoted and honest**: a diffable identity ledger, an off-platform copy, and history past 30 days. It is written by a cron job, read by nothing, and hand-edited never. **If it vanished, the app would not notice — that is the test of a real export.** Cut from milestone 1 (§8): there is no data worth exporting yet.

*(Noted for later: Time Travel restore is a REST endpoint, not wrangler-only, so a "restore to…" control in the Settings drawer is buildable. It needs a Cloudflare API token — broader privilege than the D1 binding — so it is parked, not planned.)*

---

## 4. Pages

| P | Page | The one question it answers |
| --- | --- | --- |
| **P0** | **Binder** | *What do I have, and what's missing?* Sheet per collection, fixed pockets, visible gaps, `SPRING · 11 / 15` header. The front door. |
| **P0** | **Enter** | *Add what I own, by hand.* The primary input path. Must accept a print no feed has ever heard of (vending machine, trade, museum shop). |
| **P1** | **Artwork / Edition detail** | *Everything about this one.* Editions, photos, provenance, history. **Promoted from P2 by Q6** — it is where a photo gets added after entry, so it cannot wait. |
| **P1** | **Capture** | *Log a lot, fast.* The swipe deck. Ported from `inciardi-market`, not rewritten — drag physics, undo, serialized writes all work. |
| **P1** | **Index** | *What exists at all?* Every artwork including ones Michael will never own. |
| **P2** | **Adopt** | *What did the shop add that I haven't ruled on?* |
| **P3** | Market | *What's available right now?* Registry-driven. Last. |

**Retired from the predecessor:** `terminal.html` (never had a definable job), `collection.html` (superseded by Binder), `market.html` (deferred to P3).

**Enter is P0 and that is the whole reframe made concrete.** Capture drops to P1 because bulk state entry is worthless until single-item entry is trustworthy.

### Photo entry — DECIDED (Q6 = A + B, per the note)

> *"I'm fine with just A if the assumption is that I can go to the edition detail menu and input a photo later from day one. I don't want to force a photo on entry from day 1, but I want to be able to add a photo at entry or post entry from day one and the app should be able to handle bare images, yes."*

Three rules fall out, and they are not the same as "A":

1. **A photo is never required.** `Enter` saves with a name and a collection alone. A photo-less row renders as an initials tile (Image Rendering Law rule 7) and is a first-class citizen forever, not a stub.
2. **A photo is always possible** — optional field on `Enter`, and addable afterwards from edition detail.
3. **The app accepts a photograph with no source record behind it.** No product, no listing, no feed. Beckett's vending-machine print, satisfied.

⚠️ **Honest consequence: this is not the cheap option.** A is labelled "fastest" because it defers R2 — but the condition attached to it (*add a photo later, from day one*) pulls **R2 upload and an edition-detail surface into milestone 1 anyway.** The saving is one optional field on one form, not a milestone. Named here so nobody later reads "Michael chose A" and plans a text-only first release.

---

## 5. Standards target

This app is a **theme-registry consumer from commit one** — Michael's call.

### The theme — DECIDED (Q5 = B) · slug `inciardi-prints`

**Direction: archival / specimen.** Near-neutral warm paper ground, one restrained ink accent, mono type for all data. Riso-ink (A) was rejected precisely because it competes with the photographs, which already carry the terracotta, cobalt and kale. Reusing an existing theme (C) was rejected — this app gets its own identity.

Stu's brief, now binding: *the binder reads as a specimen catalogue — precise, gridded, faintly scientific — because her photographs supply all the warmth the page needs.* **Let the prints be the only soft thing on the page.**

Still open, and Michael sees these before anything lands in `shared/themes/`: the 22-token color row itself, and which `typography × forms × spacing` rows the join points at. A new color row is cheap; a new typography row must justify itself against what already exists.

### Objects

- Links `../shared/themes/themes.css` (static first paint) + `resolve.js` (live switching).
- **Every color is `var(--token)`.** Zero literals in any stylesheet. `default-theme` until `inciardi-prints` exists.
- Composes from the **42 canonical objects** (`shared/themes/_objects.json`). The binder needs `cnt_page_shell`, `cnt_filter_bar`, `row_tile_badge`, `viz_meter`, `tx_badge`, `fb_empty`, `panel_drawer`, `fb_toast` — **all eight already exist** with defined tokens and states.
- One genuinely new object expected: **`pocket_binder`** (owned / missing / wanted / gone-forever). Per `OBJECT-COVERAGE.md` the set is a vocabulary, not a ceiling — but a new object lands in `_objects.json` + `preview.data.js` + the coverage table **in the same pass.**
- Audited against `template-app/CONFORMANCE.md`. Derived from that shape, not from the predecessor.

### Module layout, decided at founding rather than refactored later

`inciardi-market` grew a single 29KB `app-core.js` doing six jobs, one feature away from crossing the 30KB read cap — the threshold past which **a file cannot be safely rewritten** (the trap `worker.js` at 39KB has been stuck behind all day).

```
index.html     slim router shell + boot constants     < 8KB
chrome.js      header, nav, settings drawer           < 8KB
core.js        api client + formatters                < 8KB
images.js      the image ladder                       < 6KB
account.js     login + backups — LAZY, on gear tap    < 8KB
pages/*.html   content partials
```

`account.js` is lazy because the predecessor shipped ~7KB of backup UI to every page to populate a drawer most visits never open.

### Laws carried forward — paid for in hours, not inherited by habit

Both are documented in `inciardi-market/README.md` and both apply here:

- **Image Rendering Law** (7 rules, 5 outages). Never paint an archival original into a grid. Never gate visibility on a JS class. A placeholder always carries identifying content.
- **Fetch Honesty Law.** A cache that fails silently does not degrade gracefully, it lies. Every fallback announces itself in the UI, with an age.

---

## 6. What is deliberately NOT here

Machines layer. Sold comps. Multi-source discovery (Poshmark, Stockist). Per-write actor attribution. eBay until P3. A Time-Travel restore button. All real, all parked, none blocking.

---

## 7. Sign-off gate — CLEARED 2026-07-25

All four answered on the Decision Log. Decoded, read back, and folded in above.

| Q | Decided | Where it landed |
| --- | --- | --- |
| **Q4 · Where authored truth lives** | **A · D1 is the source, git JSON is an export.** Supersedes Q3. | §3 |
| **Q5 · Theme** | **B · archival / specimen**, slug **`inciardi-prints`**. Palette still to be approved. | §5 |
| **Q6 · Photo on entry** | **A + B.** Never required, always possible, at entry or after. R2 in milestone 1. | §4 |
| **Q7 · Predecessor retirement** | **A, deferred.** *"Keep it live for now but we will kill it soon."* Never "indefinitely" (B); the folder is never deleted (C). | §8 |

---

## 8. Milestones

Ordered so that **the acceptance test passes at the end of M1** — a working binder that needs no worker alive.

**M1 · The binder works by hand.** `inciardi-prints` theme row → shell + `chrome.js`/`core.js` → schema promoted from `.proposed` and applied → `Enter` (photo optional) → `Binder` sheet with visible gaps → edition detail with photo add → R2 upload + the image ladder. **Exit test: enter a print that exists in no feed, from a phone, with a photo, and see it in its sheet.**

**M2 · Volume and coverage.** `Capture` ported from the predecessor. `Index`. Registry seeded as a one-time load. The 54 verified names in.

**M3 · Automation as gravy.** Shopify harvest wired to PROPOSE only. `Adopt` queue. The cron export to `registry/artworks.json`.

**M4 · The market lens.** eBay per-artwork. Registry-driven, never identity-defining.

**Then:** `inciardi-market` retires per Q7 — launcher flips, `status:'retired'` in `app-dashboard`, README becomes a redirect stub, folder kept for the git-blame trail. Michael calls the timing.

---

*Founded 2026-07-25. Definition by Dev Dexter. Entity model from Clever Cleo; `edition_type` semantics from Domain Dara; binder-as-sheet from Style Stu; 7 pre-commit findings from Breaker Beckett; boundaries from Scope Skye. Conducted by Maestro Mira. Decisions: `Inciardi Collection — Decision Log` (Q4→) and `Inciardi Market — Rebuild Decision Log` (Q1–Q3). Predecessor's charter: `inciardi-market/REBUILD-CHARTER.md`.*
