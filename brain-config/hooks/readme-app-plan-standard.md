# README = App Plan (LOCKED 2026-07-25, Michael)

> **Invocation:** any time a README is created, rewritten, or audited for any app.
> **Trigger:** "write/rewrite/audit a README", new app scaffolding, or touching an app whose README doesn't match this shape.

---

## The rule

Every app's `README.md` IS its app plan. Not a changelog, not a how-to-use, not a secondary file alongside the plan. THE plan.

---

## Standard shape

1. **Page Hierarchy** — ASCII tree showing navigation structure. `index.html` is the main window (shell + router); views nest inside it. Satellites (separate HTML files) listed separately. Planned/future features placed IN the tree where they'll live, marked with status indicators (🟡 PLANNED / 🔒 HELD / FUTURE).
2. **Data Model** — what feeds the pages, schema tiers, enrichment status.
3. **Source Modules** — file map with sizes and budget warnings.
4. **Priority Queue** — ordered list of what to build next.
5. **Related Docs** — pointer table to detailed specs (with freshness status).
6. **Architecture Rules** — carry-forward constraints specific to this app.

---

## What does NOT belong in a README

- Version history (git does that)
- How-to-use instructions (the app is self-evident)
- Duplicated spec content (point at it)
- Changelogs of any kind (PR descriptions are the narrative)

---

## Why this shape

README is the file convention loads first (GitHub renders it, agents read it first). One file that makes every session start clean instead of rediscovering the app. Without this, apps accumulate parallel handoff docs / specs / indices that overlap, rot at different rates, and leave no single entry point.

---

## Reference implementation

`f1-racetracks/README.md` (PR #529/#530, 2026-07-25).

---

## Provenance

Born from the f1-racetracks documentation cleanup session. The app had 4+ overlapping docs with no entry point. Workshop consensus + Michael's ruling: the README becomes the plan, the changelog is git, handoff docs get consolidated or retired. Locked after the hierarchy tree format was confirmed as the right read.
