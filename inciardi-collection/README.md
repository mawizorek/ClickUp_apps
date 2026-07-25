# Inciardi Collection

**Status: DEFINITION. Nothing is built. No HTML, no worker, no data.** This folder holds the app's definition and its proposed schema. Code starts when §7 is signed off.

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

## 3. Authority model

```
app forms / capture     PRIMARY    Michael types it. Where data is BORN.
        ▼
D1 artwork·edition·copy SOURCE     the live record
        │
        └─► registry/*.json  EXPORT   periodic versioned snapshot → git history

Shopify harvest         PROPOSES   new products, availability, price. NEVER identity.
eBay                    OBSERVES   queried per-artwork. Shelved until §7.4.
```

### 🔴 The correction that matters (and it changes Q3)

The registry-in-git idea was reached for as protection against the harvest. **But the protection was never "the file lives in git" — it was "the row knows who wrote it."** Those got conflated, understandably.

`provenance` on every row is what stops the harvest clobbering hand-entered truth. Once that exists, git is no longer needed for *authority* — only for *versioning*, which an export satisfies completely.

So: **D1 is the source, git JSON is a generated snapshot.** Manual input is primary, and you cannot write to git from a phone. This dissolves the loader question rather than answering it: the registry becomes a one-time **seed** plus an ongoing **export**, not a routine import path.

**Michael answered Q3 = worker route but flagged it soft and pointed at his Q2 note. This is that note's consequence. It needs his confirmation, not my assumption** — see §7.

---

## 4. Pages

| P | Page | The one question it answers |
| --- | --- | --- |
| **P0** | **Binder** | *What do I have, and what's missing?* Sheet per collection, fixed pockets, visible gaps, `SPRING · 11 / 15` header. The front door. |
| **P0** | **Enter** | *Add what I own, by hand.* The primary input path. Must accept a print no feed has ever heard of (vending machine, trade, museum shop). |
| **P1** | **Capture** | *Log a lot, fast.* The swipe deck. Ported from `inciardi-market`, not rewritten — drag physics, undo, serialized writes all work. |
| **P1** | **Index** | *What exists at all?* Every artwork including ones Michael will never own. |
| **P2** | **Artwork** | *Everything about this one.* Editions, photos, provenance, history. |
| **P2** | **Adopt** | *What did the shop add that I haven't ruled on?* |
| **P3** | Market | *What's available right now?* Registry-driven. Last. |

**Retired from the predecessor:** `terminal.html` (never had a definable job), `collection.html` (superseded by Binder), `market.html` (deferred to P3).

**Enter is P0 and that is the whole reframe made concrete.** Capture drops to P1 because bulk state entry is worthless until single-item entry is trustworthy.

---

## 5. Standards target

This app is a **theme-registry consumer from commit one** — Michael's call, and he wants a unique theme set defined for it.

- Links `../shared/themes/themes.css` (static first paint) + `resolve.js` (live switching).
- **Every color is `var(--token)`.** Zero literals in any stylesheet. `default-theme` until a theme is chosen.
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

Machines layer. Sold comps. Multi-source discovery (Poshmark, Stockist). Per-write actor attribution. eBay until P3. All real, all parked, none blocking.

---

## 7. Sign-off gate — code starts when these four are answered

1. **Confirm D1-as-source vs registry-as-source** (§3). Michael's Q3 answer predates his own reframe; the reframe appears to supersede it. If D1 is the source, no worker route is needed and the `worker.js` chunk-walk drops out of the critical path entirely.
2. **Theme definition.** He wants a unique set for this app. Needs a name and a direction before the shell is built, because the shell consumes tokens.
3. **Does `Enter` need photo upload on day one,** or is a name-and-collection row enough to start? Decides whether R2 is in the first milestone.
4. **Slug + URL.** `inciardi-collection` is assumed. The launcher entry and the old app's retirement are a separate, later move.

---

*Founded 2026-07-25. Definition by Dev Dexter. Entity model from Clever Cleo; `edition_type` semantics from Domain Dara; binder-as-sheet from Style Stu; 7 pre-commit findings from Breaker Beckett; boundaries from Scope Skye. Conducted by Maestro Mira. Decisions: `Inciardi Market — Rebuild Decision Log`. Predecessor's charter: `inciardi-market/REBUILD-CHARTER.md`.*
