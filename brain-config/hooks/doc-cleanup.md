# Doc Cleanup · AI Toolkit

**Purpose:** Every rendered page you touch leaves cleaner than you found it, checked against a register of ruled shape defects.

**Steward:** Documentation Dave (the register and its rulings). Execution is **ownerless**: any agent fires it mid-task. A formal, scoped, reported repo-wide sweep IS an audit and SEIZES to Audit Anna.

**Mode:** Gated. Fires on touch; also on-demand per folder.

**Invocation:** Automatic on touch · `/doc-cleanup` · `/doc-cleanup <repo>/<folder>` · "clean up this folder" · "run the cleanup checklist".

**Trigger:** About to edit any rendered page in a doc-render content repo (resolve WHICH repo via `gates/repo-referent-gate.md`). Does NOT fire on ClickUp HTML apps, app READMEs in this repo, `.tsv` data, or engine code.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-10-10** by Documentation Dave + Michael Wizorek.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Detectors** | `mawizorek/doc-render-engine` build report (each item names its check) |
| **Vocabulary** | `mawizorek/template-docs/authoring/`, read via `hooks/doc-render-authoring.md` |
| **Pilot** | `uritp-docs` #212 (first-aid) · `template-docs` #32 (templates) |

---

## Procedure

1. **Scope** = the pages you are already touching. A folder sweep only on request, **one PR per folder**.
2. **Templates first.** If a template teaches the defect, fix the template in the same pass or the cleanup gets copied back in.
3. Run every register item below against each page in scope.
4. **Fix** what is a pure move (same words, new place). **Flag** anything that adds words, removes a sentence, or needs a fact.
5. PR body carries three lists: fixed (by item) · flagged (by item, with the reason) · `N/A — <reason>`.
6. Merge, then look at the render (`doc-render-authoring.md` step 5).

---

## The register

An item enters ONLY by Michael's ruling, and each item names its detector. No detector = it is a flag, not an item.

### C1 · Hand-typed Related footer — RULED 2026-10-10

- **Defect:** a `## Related` / `See also` / `Related pages` heading in the body.
- **Detector:** engine `body_related` (`docrender/related.py` → `check`).
- **Fix:** move the ids into `related: [id, id]` in declared order (first entry = the page a reader wants next); delete the block. The engine draws the line at the foot, above Keywords and Revised.
- **Hover:** for each destination id, if the destination has a `summary:` and no `gloss:`, add `gloss_from_summary: true`. Every auto-listed Related link then hovers with that summary. Inline `{hover=}` is refused on `@`-links by design; `gloss` on the destination is the only claimant.
- **Flag instead when:** the block carries prose beyond links ("— the floor this policy sits on", "Part of X"); a destination has no `summary`; a destination's summary is too long to read as a popup.

### Candidates — observed, NOT ruled

Promote only on Michael's ruling. Until then these are flags.

- **C2?** Missing required `summary:`. Content, so always a flag. (11 of 11 first-aid policy pages, 2026-10-10; the folder index has one.)
- **C3?** Paragraph under the H1, which `authoring/frontmatter.md` calls a reported defect. A move into an empty `summary` is a candidate fix only when the line is plain text.
- **C4?** Unknown or retired keys: `index: expanded` where `nav:` is meant; `also_known_as`.

---

## Guardrails

- 🔴 **Shape, never substance.** No new words, no cut sentences. Meaning would change → stop and flag.
- **One folder per PR, one repo per PR.**
- **Never restate the vocabulary here.** Point at the spec.
- **PII:** `uritp-docs` is PRIVATE, this repo is PUBLIC. Findings copied here name pages and items, never people.
- **Count once, from the rows** of the sweep, never from an earlier search.

---

## Known limits

- GitHub code search found ~115 `## Related` hits family-wide on 2026-10-10 (~80 in `uritp-docs`). Search under-reports private repos; the engine report is the real count.
- Leaf pages carrying `hide: footer`: whether the Related line still renders is unverified. Check the pilot render.
- `mawizorek/uritp-safety` turned up in search and is absent from the repo-referent gate's nine-repo table. Live or dead is unconfirmed.
- Nothing enforces this. It is a convention with a receipt (the PR body lists).

---

## Composes with

- `gates/repo-referent-gate.md` — WHICH repo. Fires first.
- `hooks/doc-render-authoring.md` — learn the vocabulary before writing. This hook clears known defects while you are there.
- `hooks/verbatim-doc-import.md` — already bans Related footers on import; this catches what predates it.
- `hooks/doc-rot-sweep.md` — docs vs HEAD (prescriptive rot). This is shape debt, not rot.
- `hooks/de-slop-pass.md` · `hooks/commit-pre-flight.md`.

---

## Changelog

- **v1 (2026-10-10)** — Established by Documentation Dave + Michael. Fold-in check: the engine already detects C1 and `doc-render-authoring` only covers pre-write vocabulary, so this is a thin net-new register that points at detectors. C1 ruled. Pilot: `uritp-docs` #212 (12 first-aid pages + `gloss_from_summary` on Basic First Aid Response), `template-docs` #32 (both templates stop teaching the footer). C2–C4 logged as candidates from the pilot.
