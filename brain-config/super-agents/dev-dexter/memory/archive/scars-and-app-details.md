# Archive: Dexter / Scars and App-Specific Details

> Graduated 2026-07-25 (first rotation). Load when working on a specific app
> or when a scar's full story is needed for context.

## Inherited scars (full narratives)

- **Jekyll silent-kill (07-02).** Pages runs Jekyll by default and eats `{{ }}` / `{% %}`, which our inline JS uses as real code. Build fails SILENTLY and Pages keeps serving the last good build **site-wide**. Looks exactly like cache. Fix: `.nojekyll` at root — it exists, never delete it. **First thing to check when a Pages URL won't update despite a correct commit.**
- **The ~30KB read cap is unpageable (07-01).** No byte-range knob; an over-cap file clips silently at ~byte 30,000.
- **Base64 armor / DDR Explorer v19.** Readback FLATTENED `innerHTML`-built markup while UUID markers still matched, so an integrity check passed on gutted source. A plaintext HTML chunk is trustworthy only if the read returns literal `<div` / `<svg` intact.
- **Stale reads clobbering current work (repeatedly).** Branch raw URLs serve cache-frozen copies — verified 07-25: a raw read of `inciardi-market/source/app-core.js` returned v10.1/PR #174 while `main` was on v15/PR #455. **Blob API, base64-decoded, re-fetched before every write.**
- **Large writes corrupt (07-02, 4x in one session).** >~30KB never goes through `create_or_update_file`.

## App-specific scars (inciardi-market)

- **A helper that silently declines to transform is worse than one that throws** (3rd image outage). `proxied(url, 360)` is a NO-OP on an R2 `/img?key=` URL — that branch cannot resize — so 268MB of originals got painted into a phone grid, and the error handler then cache-busted the SAME url and hid the element on the second miss.
- **A unit assumption with no assertion is a silent feature-killer.** `retailFrom()` divided by 100 assuming cents; the storefront returns DOLLARS. All 177 rows read 1/100th, making the "underpriced" threshold mathematically unreachable.
- **Changing a key's derivation orphans everything keyed on it.** `print_id` was left alone because the harvest never DELETEs, so a new slug would strand inventory/image/machine rows.
- **A cache that fails silently does not degrade gracefully, it lies** (07-25, four instances in one day: HTTP cache, stylesheet cache, localStorage, theme resolver). **All four were added as "resilience" — resilience features are the prime suspects.** Every fallback announces itself in the UI, with an age.

## Per-app opinions (state -> VERSIONS.md ledger, always)

- **`app-dashboard`** — the launcher everything hangs off; reference impl of the modular target (thin loader over `source/*`).
- **`world-cup-bracket`** — the size-budget reference implementation.
- **`f1-racetracks`** — canonical data-nests-inside-its-app example.
- **`on-track`** — 2nd theme-spine consumer; the shape to copy for theme adoption + the two-layer color rule.
- **`retrocast`** — the FIRST spine consumer, and proof that swapping structural feel is one pointer and zero CSS edits.
- **`template-app`** — gold-standard baseline. Start here for a new app; change only `APP_THEME`.
- **`file-chunker`** — generates `/source` chunk sets. Also proved the large-write corruption rule.
- **`inciardi-market`** — two Cloudflare workers over one D1+R2 store, NOT data-separated. Carries the Image Rendering Law + Fetch Honesty Law + open security flag (unrotated write keys).
- **`inciardi-collection`** — its successor, in DEFINITION as of 07-25. `artwork -> edition -> copy`, D1-as-source, manual entry primary, acceptance test "if every worker died tomorrow, could Michael still fully use this app?"
- **`agentglass`** — first app with a non-executing `server/` tree; reads a committed seed, labeled SNAPSHOT.

## EARNED entries (full blow-by-blow, 2026-07-25)

**Theme-as-blocker:** wrote "the shell consumes tokens, so the theme blocks the shell" into `inciardi-collection`'s README, made it sign-off question Q5. Michael: "why are we talking about theme when i said our whole directive was to plan schema and pages before build." In a `var(--token)` architecture the shell consumes tokens regardless of which row supplies them. The single artifact that cannot be a build blocker is the theme, and I made it the last blocker.

**Stale remediation:** sent to "restore the dashboard" off a note dated 07-07; both named reverts had landed 07-08 and the feature was rebuilt cleanly after. The note was 32 PRs stale and executing it would have destroyed 18 days of work.

**Recursive stale-read:** first fetch of the live dashboard returned a cache-frozen layout that doesn't exist in the repo; was one sentence from reporting a false regression.

**SHA rejection (twice):** a parallel pass edited a file between read and write; rejected on stale SHA. Second time, the parallel version was better — kept theirs, added what was missing.

**Already done:** asked to collapse app-index into VERSIONS.md: already collapsed.

**Unwriteable indices:** roster.json ~25KB, VERSIONS.md 16.4KB, both because rows became essays. Growth is always prose, never rows.

**LOCKED doc can be stale:** README.md carried a "Verified read path (LOCKED 2026-07-04)" contradicted by the Operating Standard (LOCKED 07-09) + live evidence. Three rotted instructions in one day. Prescriptive text rots faster than descriptive text.

**get_file_contents returns real bodies:** whatever the AI Toolkit index says. It resolves at an immutable SHA; the branch raw URL is the liar.
