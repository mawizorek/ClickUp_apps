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
| **Detectors** | `mawizorek/doc-render-engine` build report (each item names its bucket) |
| **Vocabulary** | `mawizorek/template-docs/authoring/`, read via `hooks/doc-render-authoring.md` |
| **Pilot** | `uritp-docs` #212 (first-aid) · `template-docs` #32 (templates) |

---

## Procedure

1. **Scope** = the pages you are already touching. A folder sweep only on request, **one PR per folder**.
2. **Templates first.** If a template teaches the defect, fix the template in the same pass or the cleanup gets copied back in.
3. Run every register item below against each page in scope, **in order** (C3 before C2: a lede that can be moved is not a lede that has to be written).
4. **Fix** what the item says is a fix. **Flag** everything else.
5. PR body carries three lists: fixed (by item) · flagged (by item, with the reason) · `N/A — <reason>`.
6. Merge, then look at the render (`doc-render-authoring.md` step 5).

---

## The register

An item enters ONLY by Michael's ruling, or a ruling he delegated. Each item names its detector. No detector = it is a flag, not an item.

### C1 · Hand-typed Related footer — RULED 2026-10-10 (Michael)

- **Defect:** a `## Related` / `See also` / `Related pages` heading in the body.
- **Detector:** `body_related` (`docrender/related.py` → `check`).
- **Fix:** move the ids into `related: [id, id]` in declared order (first entry = the page a reader wants next); delete the block. The engine draws the line at the foot, above Keywords and Revised.
- **Hover:** for each destination id, if the destination has a plain-text `summary:` and no `gloss:`, add `gloss_from_summary: true`. Inline `{hover=}` is refused on `@`-links by design; `gloss` on the destination is the only claimant.
- **Flag instead when:** the block carries prose beyond links ("— the floor this policy sits on", "Part of X"); a destination has no `summary`; a destination's summary is too long to read as a popup.

### C3 · Lede in the body — RULED 2026-10-10 (delegated to Dave)

- **Defect:** a paragraph directly under the H1.
- **Detector:** `body_lede` (`docrender/lede.py` → `check`). The engine's own instruction: *"Move it into `summary:` and delete the paragraph."* Positional fallback was refused by Michael 2026-08-03.
- **Fix, `summary:` empty:** move the paragraph verbatim into `summary:` (quoted) and delete it from the body. Same words, same slot on screen. Links and markup may move with it; the lede renders markdown.
- **Fix, `summary:` already set and the paragraph says the same thing:** delete the paragraph.
- **Flag instead when:** `summary:` is set and the paragraph says something the summary does not (that is a merge, which is writing).
- **Hover consequence:** a summary carrying links or markup does NOT get `gloss_from_summary` (popups are plain text only, hover-inline R4). Flag it for a plain `gloss:`.

### C2 · Missing `summary:` — RULED 2026-10-10 (delegated to Dave)

- **Defect:** no `summary:`, and no body lede for C3 to move.
- **Detector:** `missing_required` (`objects.py`), plus `body_lede` reporting *"This lede has to be WRITTEN, not moved."*
- **Fix:** none. **A summary is content.** Draft one line per page from the page's own words (title, Recognize/purpose line), put the drafts in the PR body under `C2 drafts`, and commit nothing for C2 until Michael approves. Approved drafts land as a follow-up commit on the same PR.
- **Why not commit drafts:** the summary is the lede, the search result and the hover text at once. On a safety page an agent-authored lede is an agent-authored safety claim shown in three places.

### C4 · Retired or unknown frontmatter keys — RULED 2026-10-10 (delegated to Dave)

- **C4a, retired keys.** Detector: `duplicate_key` bucket via `objects.py` `_LEGACY_KEYS` (today `listed`→`indexed`, `also_known_as`→`keywords`). **Fix:** rename the key, value untouched. That restores the behaviour the author already wrote.
- **C4b, unknown keys** (e.g. `index: expanded` where `nav:` was meant). **No detector:** the engine never reads its `optional` list, so an unknown key is silently ignored. **Always a flag, never a fix.** The page is currently behaving as though the line were absent; "fixing" it switches on behaviour nobody has seen. Live case: `nav: expanded` anywhere turns off nav pruning for the WHOLE site (~33% page weight, `authoring/frontmatter.md`).
- **Not unknown:** `hide:` is Material's own key. Leave it alone.
- **Owed (Dexter's lane, not done):** an engine report for unknown keys would give C4b a detector.

---

## Guardrails

- 🔴 **Shape, never substance.** No new words, no cut sentences except an exact duplicate (C3). Meaning would change → stop and flag.
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

- **v1.1 (2026-10-10)** — C2, C3, C4 ruled by Dave on Michael's delegation (*"Rule on C2, C3, and C4"*). Detectors verified at engine HEAD `4821b95`: `missing_required`, `body_lede`, `_LEGACY_KEYS`. C3 runs before C2. C4 split: retired keys are a fix, unknown keys are flag-only because the obvious fix for the live case would have disabled nav pruning site-wide.
- **v1 (2026-10-10)** — Established by Documentation Dave + Michael. Fold-in check: the engine already detects C1 and `doc-render-authoring` only covers pre-write vocabulary, so this is a thin net-new register that points at detectors. C1 ruled. Pilot: `uritp-docs` #212 (12 first-aid pages + `gloss_from_summary` on Basic First Aid Response), `template-docs` #32 (both templates stop teaching the footer). C2–C4 logged as candidates from the pilot.
