# Archive: Dexter / App-Specific Context

> Graduated from hot memory 2026-07-25 (first rotation). Load on-demand
> when working on a specific app or running an audit. The generalized
> scar lessons (one line each) stay in hot memory.

---

## Audit baselines

- **`template-app/CONFORMANCE.md`** — THE app audit baseline. Diff any app folder
  against it. Folder shape (slim router, `pages/<route>.html`, **no `source/` folder
  unless legacy pre-split**), theme contract, chrome, head polish tiers, build hygiene.
  `template-app` = gold standard v5, gate `0426`. Open conflict for Michael: this says
  no `source/`, but `app-dashboard` uses `source/` and is called the modular reference.
  Two blessed shapes. template-app is newer (v5, PR #300) so it probably wins.
- **`brain-config/code-review-standard.md`** — THE review method + report format,
  shared by Beckett, the Red-Team reviewer, and `/code-review`. Method = compose
  existing guards in order. Report = severity-grouped, every issue carries
  `path/file:line` + a concrete fix. Critical = security hole / data loss / broken ship.
  Clean bill -> confirm what was checked, don't invent issues.
- **Consumer test** (`skills-integration.md`): content any other agent could need
  lives in git; a skill is a thin trigger pointing at it.

---

## App-specific scars (inciardi-market, 07-25)

- **A helper that silently declines to transform is worse than one that throws.**
  `proxied(url, 360)` is a NO-OP on an R2 `/img?key=` URL — that branch cannot
  resize — so 268MB of originals got painted into a phone grid, and the error handler
  then cache-busted the SAME url and hid the element on the second miss.
- **A unit assumption with no assertion is a silent feature-killer.** `retailFrom()`
  divided by 100 assuming cents; the storefront returns DOLLARS. All 177 rows read
  1/100th, making the "underpriced" threshold mathematically unreachable.
- **Changing a key's derivation orphans everything keyed on it.** `print_id` was left
  alone because the harvest never DELETEs, so a new slug would strand
  inventory/image/machine rows.
- **A cache that fails silently does not degrade gracefully, it lies** (four instances
  in one day: HTTP cache, stylesheet cache, localStorage, theme resolver). All four
  were added as "resilience" — resilience features are the prime suspects. Every
  fallback announces itself in the UI, with an age.

---

## Apps I have an opinion about

State lives in `VERSIONS.md` (repo root), THE single app ledger. These are my
engineering takes on each app's significance:

- **`app-dashboard`** — the launcher; reference modular target (thin loader over `source/*`).
- **`world-cup-bracket`** — size-budget reference implementation.
- **`f1-racetracks`** — canonical data-nests-inside-its-app example.
- **`on-track`** — 2nd theme-spine consumer; two-layer color rule exemplar.
- **`retrocast`** — FIRST spine consumer; proof one pointer = zero CSS edits.
- **`template-app`** — gold-standard baseline. Start here.
- **`file-chunker`** — generates `/source` chunk sets. Proved large-write corruption.
- **`inciardi-market`** — two CF workers over D1+R2. Image Rendering Law + Fetch Honesty Law + open security flag (unrotated write keys).
- **`inciardi-collection`** — successor, in DEFINITION as of 07-25. `artwork -> edition -> copy`, D1-as-source, manual entry primary.
- **`agentglass`** — first app with non-executing `server/` tree; committed SNAPSHOT seed.
