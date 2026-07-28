# Inciardi Collection

📋 **Decision Log:** `Inciardi Collection — Decision Log` (ClickUp) — every call about this app, newest on top. **Checkbox polarity is INVERTED: a checked box is a REJECTED option.** Q1–Q3 (answered) live on the predecessor's `Inciardi Market — Rebuild Decision Log`; this app's log runs **Q4 → Q12** plus journal entries **J1 → J6**. Read it before touching anything here.

**Status: DEFINED. Schema authored, not applied. Nothing built.** Sign-off gate (§8) cleared. Build order in §9 — and step 0 is a **verification**, not a code change.

Successor to `inciardi-market/`, which stays live and untouched as a working reference until Michael calls its retirement. Clean room on purpose: a day of debugging proved that **inherited state is what fooled us**, so nothing carries over by accident — only by decision.

> 🔴 **The directive that governs sequencing, in Michael's words:** *"our whole directive was to plan schema and pages before build… theming should be the lightest thing to change later because we've decided that default structure already. so use defaults for now for all i care cos the whole point is we can change it later."* **Schema and pages are the gate. Nothing else is.**

---

## 1. What this is

**A faithful digital twin of Michael's physical mini-print binder.** In his words:

> *"I only care about her mini prints really, that's what we collect. And I have an existing physical binder of card sheets — 3x3 cards with double sided pages for a real flip through experience. v1 of the app could be a faithful recreation of the physical binder using real sorted catalog data, and serves as the real planning and positioning interface of the binder. I can tack a slot as a print I have, one I know I want, or even just comment on a page. And we then begin to title and order pages."*

That is the whole product. Not a collection database with a binder skin on top: **the binder is the interface, and laying it out is the work.**

**Scope: MINI PRINTS.** Other categories exist in the data and are not what this is for.

**The binder is the CURATED part of the collection, not all of it.** Everything owned but unplaced lives in the **shoe-box** — a real object in Michael's house, not a UI convenience. A print lives in the box until it earns a slot.

The market lens is a *second* question asked on demand: *"and what's available right now?"* Michael's framing, which governs everything below:

> *"It becomes catalog searching the market for existence and logging itself, rather than the market defining what's in the catalog."*

And the reframe that goes further:

> *"A core idea needs to be that I could hand-input ALL of these artworks manually from day one if I wanted. In fact maybe that IS where we start. Any scrubbing and future worker automation is really just gravy."*

### The acceptance test for the whole app

> **If every worker died tomorrow, could Michael still fully use this app?**

Today, in `inciardi-market`: no. Here: **yes, by construction.** Manual entry is the primary path; automation is additive. That is the answer to *"this just isn't reliable."*

---

## 2. The model — two axes

The predecessor had three tables named after **where data came from** (`catalog` = the shop, `market` = eBay, `inventory` = Michael). That is why a print in two sources got two rows and a print in no source had nowhere to live. Every table here is named after **what it is**.

### Axis one — what exists, and what Michael owns

| Entity | What it is | Cardinality |
| --- | --- | --- |
| **artwork** | The creative work. "Watermelon." | one, forever |
| **edition** | A specific impression or unique object. Ginkgo #4. | **≥ 1 per artwork, always** |
| **copy** | The physical thing he holds. | 0..N per edition |

### Axis two — where it sits in the binder

| Entity | What it is | Cardinality |
| --- | --- | --- |
| **binder** | The physical binder. | 1+ (minis today) |
| **sheet** | One sheet protector. Titled and ordered by Michael. | N per binder |
| **slot** | One pocket. **Nine per side, two sides per sheet.** | 0..18 per sheet, sparse |

**VOCABULARY, LOCKED (Q11 = A): SHEET · SIDE · SLOT.** *"Sheet 3, side B, slot 5."* The word **"page" is reserved for app routes** (`pages/*.html`) and is never used for binder structure — a binder page and an app page in one codebase is a collision that costs real confusion later.

### Why edition is never zero (Q1)

> *"An artwork can't exist without an edition, regardless of it's named or numbered by Anna as an edition. We have to know it's the only edition and create it then."*

An edition is **not a numbering scheme** — it is the physical-instance layer. A thing that exists has at least one instance, whether or not the artist labelled it. So an open-run print gets exactly one edition with `implicit = 1`, the chain `artwork → edition → copy` is never broken, and `copy.edition_id` is `NOT NULL` and always satisfiable. One code path, no polymorphic parent.

The UI never renders an implicit edition as a badge (no "#1" on Luna Moth). If she numbers an open print later, the row flips to explicit **with no migration.**

### Three consequences worth stating outright

**Images attach to the EDITION, not the artwork.** Opposite of the old schema, and it falls straight out of Q1: each Brooklyn Ginkgo edition has its own photograph because they are visibly different objects. One rule, no special case — a photograph is of an object, and the object is the edition.

**A slot names an artwork, and OPTIONALLY the exact edition (Q12 = B).** The artwork is what the card renders and what makes the slot placeable; `edition_id` is set only when Michael cares which impression is in the sleeve — so a Watermelon slot stays generic while the Ginkgo slot reads **#4**. NULL is the normal case, which is what keeps *"place a print I haven't identified yet"* possible.

**Ownership is quantity OR identity, in one table (Q10 = A).** `copy` carries `qty`. Six Watermelons is one row at `qty:6`; Ginkgo #4 is its own row at `qty:1`. Nobody types six rows, and uniques stay identifiable. 🔴 **Every ownership count is therefore `SUM(qty)`, never `COUNT(*)`** — which is why `v_owned` exists rather than a comment telling you to remember.

---

## 3. Authority model — DECIDED (Q4 = A)

```
app forms / binder      PRIMARY    Michael types it. Where data is BORN.
        ▼
D1 (see db/_index.md)   SOURCE     the live record. The only authority.
        │
        └─► registry/*.json  EXPORT   generated snapshot → git history. Read by nothing.

Shopify harvest         PROPOSES   new products, availability, price. NEVER identity.
eBay                    OBSERVES   queried per-artwork. Deferred to M4.
```

**The correction that settled it:** the registry-in-git idea was reached for as protection against the harvest. But the protection was never *"the file lives in git"* — it was ***"the row knows who wrote it."*** Those got conflated. `provenance` on every row does the protecting; git was only ever supplying versioning.

So `registry/artworks.json` is a one-time **SEED** plus a generated **export**. No loader route, no import path, no write key in a public bundle — and **the 39KB `worker.js` chunk-walk is off the critical path.** Supersedes Q3.

### Backups — DECIDED (Q8 = A + C)

D1 [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/) is always on, free, and restores to **any minute within the last 30 days**. That is the rollback story for rows, and it covers the scary cases. Four things it does not do:

1. **Whole-database only** — no per-row restore. Fixing last Tuesday's typo costs everything entered since.
2. **30-day cliff** — beyond that, no history at all.
3. **Same account as the data it protects** — not an off-platform copy.
4. 🔴 **It covers rows, not bytes.** 268 MB of photographs live in R2, entirely outside it. Losing an image *row* is recoverable; losing the *object* is permanent and **silent** — you find out when a tile goes blank.

So the export **lives, demoted**: cron-written, read by nothing, hand-edited never. *If it vanished the app would not notice — that is the test of a real export.* And it carries an **R2 image manifest** (key, size, `sha256`, `edition_id`) so a lost photograph becomes a re-shoot list that names the print instead of a blank tile. **Required before the R2 path counts as finished** — a manifest that starts existing after the photographs do is worthless.

---

## 4. Pages

🔴 **The reframe that collapsed two pages into one (J2).** An earlier draft had "Binder" and "Enter" as separate features. Michael: *"why are they so different tho? it seems like binder layout is just gridded ability of 'enter or edit one print' from the catalog."* He is right. **A slot card IS the entry form.** Tap an empty slot and either enter a new catalog print or pick from the known catalog — same control, two paths.

| P | Route | The one question it answers |
| --- | --- | --- |
| **P0** | **Binder** | *What do I have, what's missing, and what goes where?* Sheet spreads, nine slots a side, visible gaps. **The front door, the layout tool, and the entry surface.** |
| **P0** | **Shoe-box** | *What do I own that isn't placed yet?* The unhoused tray. Drag or tap from here into a slot: the primary curation gesture. |
| **P1** | **Artwork detail** | *Everything about this one.* Editions, photos, **owned count, and every slot it sits in.** Where a photo gets added after entry. |
| **P1** | **Capture** | *Log a lot, fast.* The swipe deck, ported not rewritten. **Writes into the shoe-box** — swipe a stack in, place them later. |
| **P1** | **Index** | *What exists at all?* Every artwork, including ones he will never own. |
| **P2** | **Adopt** | *What did the shop add that I haven't ruled on?* Also the triage queue for unmatched sightings. |
| **P3** | Market | *What's available right now?* Last. |

**Retired from the predecessor:** `terminal.html` (never had a definable job), `collection.html` (superseded by Binder), `market.html` (deferred).

**A real binder opens to a SPREAD** — the back of one sheet facing the front of the next. Stu: *"an app that shows one side at a time is a grid with pagination, not a binder."* That is a read-model requirement, not a CSS one; `v_binder_spread` implements it.

### Slot states — DERIVED, never stored (J3)

| State | How it is known |
| --- | --- |
| **empty** | **No row.** The UI renders nine positions; absence is the empty slot. Rows are sparse. |
| **owned** | Derived — slot has an artwork, and that artwork has ≥1 copy. |
| **wanted** | Derived — slot has an artwork and zero copies. The ghosted slot. **This is the visible-gap feature**, and it costs no storage. |
| **note** | Stored — `artwork_id` NULL plus note text. The only reason that column is nullable. |

**There is no `state` column and there must never be one.** It would be a second source of truth for a fact `copy` already owns, and two surfaces claiming one fact is precisely the disease that produced the predecessor's phantom duplicates.

**Marking a slot owned is an INPUT, not a state change.** Tapping *"I have this"* writes a `copy` row and the slot fills as a consequence. Minimal tracking, nothing recorded twice, no inventory screen to visit.

### Photo entry — DECIDED (Q6 = A + B, per the note)

> *"I don't want to force a photo on entry from day 1, but I want to be able to add a photo at entry or post entry from day one and the app should be able to handle bare images, yes."*

1. **Never required.** Name and collection is a complete row. A photo-less row renders as an initials tile (Image Rendering Law rule 7) and is first-class forever.
2. **Always possible** — at entry, and afterwards from artwork detail.
3. **A photograph with no source record behind it is legal.** No product, no listing, no feed.

⚠️ **This is not the cheap option.** "A" is labelled fastest because it defers R2, but the condition attached to it pulls **R2 upload and a detail surface into M1 anyway.** The saving is one optional field, not a milestone. Said plainly so nobody reads "he chose A" and plans a text-only release.

---

## 5. Standards target

A **theme-registry consumer from commit one** — which is exactly why the theme itself is not urgent.

### 🔴 Sequencing law: the theme goes LAST, and never blocks anything

A theme is swappable at any time for **one pointer and zero CSS edits** (`retrocast` proved it). Every color being `var(--token)` means the shell consumes tokens *regardless of which row supplies them*.

**Build on `default-theme`, swap when the app works.** An earlier draft claimed *"the shell consumes tokens, so this blocks the shell"* and made the theme a sign-off question. That premise was false, and it left the most cosmetic artifact in the stack as the last thing gating the build. Corrected on Michael's call, 2026-07-25 (J1). If a future pass finds itself designing the palette before the schema is applied, it has reproduced the inversion.

### The theme — PARKED, and ready

**Direction decided (Q5 = B): archival / specimen.** Warm near-neutral paper ground, one restrained ink accent, mono for all data. Riso-ink was rejected because her terracotta, cobalt and kale are already *in the photographs*, so chrome built from them fights the work. **Let the prints be the only soft thing on the page.**

**Michael approved the palette on sight** (2026-07-25, *"yes this is it"*). Slug `inciardi-prints` = new color row × new `specimen` typography × new `specimen` forms × reused `standard` spacing. Full rationale and token values: the artifact linked from the decision log. Deferrable sub-questions: whether three new rows is one too many, light or dark landing, and whether overriding `data-1..4` is care or scope creep.

**Before swap day:** boot with `THEMES.applyTheme(slug)` and never `THEMES.apply()` (color-only, silently leaves three vectors unthemed) · adding a row is three steps, TSV → `_themes.json` → the `preview.data.js` snapshot · run `THEMES.validate()` after. `resolve.js` no longer has a silent path (PR #502, prompted by Michael's own Q5 note).

### Objects

- Links `../shared/themes/themes.css` (static first paint) + `resolve.js` (live switching). **Zero color literals** in any stylesheet.
- Composes from the **42 canonical objects** (`shared/themes/_objects.json`). The binder needs `cnt_page_shell`, `cnt_filter_bar`, `row_tile_badge`, `viz_meter`, `tx_badge`, `fb_empty`, `panel_drawer`, `fb_toast` — **all eight already exist.**
- One genuinely new object: **`slot_binder`** (owned / wanted / empty / gone-forever). *Renamed from `pocket_binder` by Q11 — free today, expensive after it ships.* A new object lands in `_objects.json` + `preview.data.js` + the coverage table **in the same pass.**
- Audited against `template-app/CONFORMANCE.md`.

### Module layout, decided at founding rather than refactored later

`inciardi-market` grew a single 29KB `app-core.js` doing six jobs, one feature from the 30KB read cap — past which **a file cannot be safely rewritten** (the trap `worker.js` is stuck in).

```
index.html     slim router shell + boot constants     < 8KB
chrome.js      header, nav, settings drawer           < 8KB
core.js        api client + formatters                < 8KB
images.js      the image ladder                       < 6KB
account.js     login + backups — LAZY, on gear tap    < 8KB
pages/*.html   content partials
```

### Laws carried forward — paid for in hours, not inherited by habit

- **Image Rendering Law** (7 rules, 5 outages). Never paint an archival original into a grid. Never gate visibility on a JS class. A placeholder always carries identifying content.
- **Fetch Honesty Law.** A cache that fails silently does not degrade gracefully, **it lies.** Every fallback announces itself in the UI, with an age. *(Now enforced in the theme spine too — PR #502.)*

---

## 6. 🔴 The design law: don't police disagreement, make it unrepresentable

J6, and the thing a future pass is most likely to undo by accident. Every consistency rule climbs to the **highest rung it can reach**:

| # | Rung | When it applies |
| --- | --- | --- |
| **1** | **Don't store it. Derive it.** | A computed fact cannot disagree with itself. Used for owned / wanted / shoe-box. **Try this first, always.** |
| **2** | **Structurally impossible.** | Composite FK, UNIQUE, NOT NULL, CHECK. The database refuses. No code path bypasses it. |
| **3** | **Trigger.** | Invariants SQL can't express. Still in the DB, but invisible unless you read the schema. |
| **4** | **One write path.** | Only as good as never adding a second door. |
| **5** | **Detect and announce.** | Backstop, **never the plan.** Silent detection is the Fetch Honesty sin. |

**Nothing in this app lands on "the application will be careful."** It won't be, at 3am, in the D1 console.

**The move worth copying:** two pointers that can disagree (a slot naming Watermelon while pointing at a Ginkgo edition) *looks* like it needs a cross-table `CHECK`, which SQLite cannot express. It doesn't. Name the **pair**:

```sql
FOREIGN KEY (edition_id, artwork_id) REFERENCES edition (edition_id, artwork_id)
```

The bad row stops being a validation failure and becomes **unwriteable**. The same trick carries `edition_type` down `artwork → edition → copy` with `ON UPDATE CASCADE`, which turns *"a one-of-a-kind cannot be owned six times"* into a plain single-table `CHECK`. Cost: two redundant columns and a few indexes. Worth it — the alternative was a trigger.

**Exactly one trigger exists** in the whole design: an artwork must never exist without an edition (Q1). A `CHECK` can't see another table and a FK points the wrong way, and doing it in the app means two writes with a permanent violation possible in between.

---

## 7. What is deliberately NOT here

`slot.state` (derived) · `copy.location` (no per-object allocation) · `copy.disposition='want'` (a want is a slot with no copies — one way to say it, not two) · a shoe-box table (it is `v_shoebox`) · pre-seeded empty slots (absence is the state) · the machines layer · sold comps · multi-source discovery · per-write actor attribution · eBay until M4 · a Time-Travel restore button · byte-level R2 replication. All real, all parked, none blocking.

---

## 8. Sign-off gate — CLEARED

| Q | Decided | Landed |
| --- | --- | --- |
| **Q4 · Where authored truth lives** | **D1 is the source, git JSON is an export.** Supersedes Q3. | §3 |
| **Q5 · Theme** | **Archival / specimen**, `inciardi-prints`. Approved, **parked, not blocking.** | §5 |
| **Q6 · Photo on entry** | **Never required, always possible**, at entry or after. | §4 |
| **Q7 · Predecessor retirement** | Stays live for now; Michael calls it; folder never deleted. | §9 |
| **Q8 · Does the export survive?** | **Yes, demoted — and it carries an R2 image manifest.** | §3 |
| **Q10 · Ownership shape** | **`copy` carries `qty`.** Quantity and identity in one table. | §2 |
| **Q11 · Vocabulary** | **SHEET · SIDE · SLOT.** "Page" means an app route. | §2 |
| **Q12 · What a slot points at** | **Artwork, plus an optional `edition_id`.** | §2 |

---

## 9. Build order

**Schema first. It is what the whole definition exercise was for.** Everything runs on `default-theme`.

### M1 · The binder works by hand

**0. 🔴 VERIFY FOREIGN-KEY ENFORCEMENT. This is the gate, and it is not a formality.** SQLite enforces FKs **per connection** and has historically defaulted them **OFF**. Every rung-2 rule in §6 is decorative if D1 isn't enforcing — and **an unenforced constraint is worse than none, because it looks like protection.** Same failure shape as the three silent caches that cost a full day. `db/_index.md` carries three copy-pasteable violating INSERTs that **must all be rejected**, plus a trigger check. If any succeeds, the composite FKs demote to triggers and the DDL gets rewritten.

1. **Schema applied** to a **new** D1 database, in the order `db/_index.md` specifies (it is FK-significant). `inciardi-market` keeps its own, untouched.
2. **Shell** — `index.html` router + `chrome.js` + `core.js`, audited against `template-app/CONFORMANCE.md`.
3. **Binder** — sheet spreads, the `slot_binder` object, visible gaps, and slot-card entry. The front door and the input surface at once.
4. **Shoe-box** — the unhoused tray, and the drag-to-slot gesture.
5. **Artwork detail** — editions, `own N · placed M`, photo add.
6. **Images** — `images.js` ported, upload at entry and after, plus the manifest query.

**Exit test: enter a print that exists in no feed, from a phone, with a photo, place it in a slot, and see the sheet count change.** No worker alive.

### Later

**M2 · Volume.** `Capture` ported (writes to the shoe-box). `Index`. The 54 verified names seeded.

**Theme swap · whenever.** `inciardi-prints` rows land, the boot constant changes, `THEMES.validate()` runs. **Never blocks another step** — before, between, or long after any milestone.

**M3 · Automation as gravy.** Harvest wired to PROPOSE only. `Adopt` queue. The cron export plus manifest.

**M4 · The market lens.** eBay per-artwork, registry-driven, never identity-defining.

**Then:** `inciardi-market` retires per Q7 — launcher flips, `status:'retired'` in `app-dashboard`, README becomes a redirect stub, folder kept for the blame trail. Michael calls the timing.

---

## 10. Accepted imprecision — recorded so nobody re-files it as a bug

Both come from the same root: **Michael cut per-object allocation** (*"minimal singular tracking"*), and the binder is a layout and planning surface rather than a map of which physical card is in which sleeve.

**One owned Watermelon placed in three slots reads `owned` in all three.** Beckett's objection, accepted. 🔴 **But the card badge must read `own 1 · placed 3`, never a bare `3`** — `v_slot` returns both numbers precisely so the UI can be honest. *The imprecision is only acceptable while it stays legible.*

**Own six Watermelons, place one, and Watermelon vanishes from the shoe-box** even though five are physically in the box. `v_shoebox` answers *"what have I not placed at all?"*, never *"how many of these are in the box?"*

If per-object location ever matters, that is a **schema change**, not a view tweak.

---

## 11. Open, not blocking

**Q9 · theme slug hygiene.** Should the registry record which apps consume which theme, or make renames impossible? Decided **both** — `aliases: []` on the join row (a slug is identity, so alias it rather than rename it) plus a generated reverse index from an `applyTheme('…')` grep. **Parked deliberately:** it is `shared/themes/` infrastructure, not this app, and schema-and-pages comes first. Moves to a `shared/themes` container log once one exists. The silent-vector half already shipped (PR #502).

---

*Founded 2026-07-25. Definition by Dev Dexter. Entity model from Clever Cleo; `edition_type` semantics from Domain Dara; binder-as-sheet and the specimen palette from Style Stu; pre-commit attacks from Breaker Beckett; boundaries from Scope Skye. Conducted by Maestro Mira. Decisions: `Inciardi Collection — Decision Log` (Q4→Q12, J1→J6). Schema: `db/_index.md`.*
