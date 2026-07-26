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
4. **Priority Queue** — ordered list of what to build next. **One ordering per app, and this is it.** If a spec file also carries a phase order, they will diverge and two agents will pick differently — the spec holds the *how*, the README holds the *order*.
5. **Related Docs** — pointer table to detailed specs (with freshness status).
6. **Architecture Rules** — carry-forward constraints specific to this app.

---

## What does NOT belong in a README

- Version history (git does that)
- How-to-use instructions (the app is self-evident)
- Duplicated spec content (point at it)
- Changelogs of any kind (PR descriptions are the narrative)
- **Argumentation.** The README states WHAT the app is; the app's **Decision Log** states WHY. Rationale, rejected options, and per-voice reasoning go to the log, with the README carrying a pointer line to it. This is the single fastest way a README bloats, because every decision feels worth explaining in place.

---

## 📏 Size (ADDED 2026-07-26)

**A README is a hand-maintained canonical file, so it is governed by `hooks/source-size-budget-enforcer.md` like any other — same target, same floor rule, same ~22KB ceiling.** Nothing about being a README exempts it, and the numbers live in the Enforcer only. **Do not restate byte figures here**; two places stating a budget is two places for it to rot apart.

**The remedy is trim-and-point, never split.** A README is the single entry point convention loads first, so fragmenting it defeats its whole purpose. When it grows: push argumentation to the Decision Log, per-version narrative to git, and detailed spec content to the spec.

**The tell, and it is specific to READMEs:** growth comes from *reasoning*, not structure. A README that has picked up a paragraph explaining why each decision was made is on its way past budget while looking more thorough, not more bloated.

---

## Why this shape

README is the file convention loads first (GitHub renders it, agents read it first). One file that makes every session start clean instead of rediscovering the app. Without this, apps accumulate parallel handoff docs / specs / indices that overlap, rot at different rates, and leave no single entry point.

---

## Reference implementation

`f1-racetracks/README.md` (PR #529/#530, 2026-07-25; screen-lock rewrite PR #543, 2026-07-26).

⚠️ **The exemplar is load-bearing — bloat it and you teach the pattern wrong.** On 2026-07-26 the screen-lock rewrite drafted that file to 20.8KB by writing the Workshop's reasoning into it, then trimmed to 16.9KB and moved the argumentation to the app's Decision Log. An agent reading a bloated exemplar copies the bloat, which is why the size clause above exists at all.

---

## Provenance

Born from the f1-racetracks documentation cleanup session. The app had 4+ overlapping docs with no entry point. Workshop consensus + Michael's ruling: the README becomes the plan, the changelog is git, handoff docs get consolidated or retired. Locked after the hierarchy tree format was confirmed as the right read.

**Amended 2026-07-26** (Michael's "ok doc it"): added the size clause as a pointer, the no-argumentation rule, the one-ordering-per-app clause in section 4, and the exemplar-bloat warning. All four came out of the f1 v7 screen lock, where this hook's own reference implementation nearly shipped over budget. Fold-in Frank ruled POINTER, not a second budget spec.
