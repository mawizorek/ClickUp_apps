# Source-Size Budget Enforcer — AI Toolkit

**Purpose:** keep committed source inside the readable/maintainable budget so an agent can always read a file back whole AND modular structure stays the default. **MAINTAINABILITY gate first, read-cap backstop second.**

**Mode:** Contextual (deterministic) — fires on any repo write.
**Invocation:** Automatic. (*"check the size budget"* forces a manual run.)
**Trigger:** before committing any source file to `mawizorek/ClickUp_apps`.
**Why-history, measurements, diagnostics, worked cases:** [`source-size-budget-enforcer.notes.md`](./source-size-budget-enforcer.notes.md)
**Decision history:** ClickUp ▸ Brain Reference Library ▸ AI Toolkit ▸ 🎯 Triggers ▸ *Source-Size Budget Enforcer — Decision Log*. (Decision logs are ClickUp docs, never repo files — the repo path is a stub.)

---

## ⚙️ IT IS ENFORCED BY A BUILD NOW, NOT BY WHOEVER REMEMBERS (v7, 2026-08-11)

| Piece | Path | Job |
|---|---|---|
| **The gate** | `.github/workflows/size-budget.yml` | Runs on every PR. No path filter, deliberately. |
| **The maths** | `.github/scripts/size_budget.py` | Measures, matches scope, applies waivers. **No numbers in it.** |
| **The numbers** | `brain-config/size-budget.tsv` | Thresholds, scope rules, waivers — **each with a NOTE column, so every change lands in a diff.** |
| **The judgement** | this file | When to split, what to split, and when to ask Michael. |

🔴 **Why it exists: for a fortnight this hook was correct, measured, locked, and outrun.** Six `brain-config` files sat over its FAILING line, the worst at **60,133 B — 2.7× the ceiling.** ⭐ **A rule that lives in prose and appears in no executable step is reached by memory or not at all** (third instance in a week, after the spine and the session-board clear). **Behavioural hooks are for judgement; mechanical gates are for numbers.**

**Two things about the gate to know before you "improve" it:**

1. ⚠️ **It fails ONLY on files the PR touched.** Not leniency — a gate that failed day one on pre-existing debt would be switched off inside a week. Standing debt prints as a warning inventory on every run instead, and touching one of those files inherits the failure. **Read the notes before tightening this.**
2. 🚫 **It budgets neither data files nor app runtime files.** A data file is not source. Apps already have an older, locked mechanism (`<app>/source/` chunk set + `_index.md`). Reasoning is in the TSV's `scope` rows.

---

## ⭐ OPERATING POSTURE (LOCKED 2026-07-04): split automatically, don't narrate it

**Michael's directive:** modular structure is just how Brain builds — not a decision to surface each time. Do NOT ask *"should I split this out?"* and do NOT report every routine split. Splitting a file by concern as it approaches budget is the **DEFAULT WORKFLOW, invisible like indentation.** Build modular from the start; when an edit would push a file past budget, split it in the same pass and keep moving.

**The ONLY time size reaches Michael:** when a clean split is NOT possible — you would be forced to hack one genuinely coherent unit into arbitrary `fileA`/`fileB`/`fileC` fragments with no real concern boundary (a giant single data table, one indivisible function, a monolithic content blob). **That signals a design tension only Michael should resolve.**

**Restated:** silent auto-split = normal. Flag = *"I can only make this fit by chopping one thing into ugly A/B/C pieces; how do you want to handle it?"*

---

## The numbers

| Line | KB | Behaviour |
|---|---|---|
| target | **12** | Under it, silent. |
| split line | **15** | Split by concern in the same pass. Silently. |
| read ceiling | **22** | **FAILING** on a hand-edited canonical file. |
| write cap | **30** | Never round-trip the write tool. |

⚠️ **These are POLICY LINES, not measured walls.** Measured: **21.7KB read whole** (2026-07-26); **~25KB truncated** (2026-07-25); **34.9KB clipped silently across four reads with no error** (2026-08-01). The blob API returns base64 (4/3 inflation), which is where 22 comes from. Nobody has characterised 21.7→25. **`VERSIONS.md` still calls 22KB "physics"; it is not.** Full table and the measurement story: the notes sidecar.

🚫 **The numbers live in `brain-config/size-budget.tsv`. Do not restate them anywhere else** — this table is the one duplicate, and it exists so a reader here is not sent hunting. If the TSV and this table disagree, **the TSV wins** and this table is the defect.

---

## Pass

1. Measure the outgoing file size.
2. **Under target:** pass, silent.
3. **Target → 15KB:** split now if a clean concern boundary exists, silently, no question. If none exists (indivisible unit), note it briefly and carry on.
4. **Over 15KB:** split by concern automatically, same commit pass. Not a question. **Exception → flag:** no clean boundary and the only way under is arbitrary fragmentation of one coherent thing → STOP and ask Michael.
5. **Over 22KB on a file that must be read whole and hand-edited** (index / ledger / roster / schema / profile / hook): **FAILING, not warning.** Trim prose in the same pass. 🚫 **Do not split a list-shaped canonical file** — move narrative out of the rows.
6. **Over 30KB:** never round-trip the write tool. Auto-split if cleanly separable; if one indivisible blob, flag for GitHub-UI upload or chunk-set routing.
7. **Shape check before trimming any canonical file:** project the floor at 2× rows. If it nears the ceiling, **stop trimming and fix the SHAPE** — the file is carrying content that belongs in the records it indexes. (Floor formula + the diagnostic: notes sidecar.)
8. Confirm `.nojekyll` at repo root on any new-app commit.

**🚫 Two things that are never a remedy:** deleting a live warning, security flag or do-not-do rule to hit a byte count; and quietly rewriting a locked number. **A stated target that has never once been met is ROT — fix the TARGET, in place, out loud.**

---

## Choosing the remedy: which SHAPE is this file?

| Shape | Remedy | Never |
|---|---|---|
| **App / module** | Thin shell + `source/*` modules | — |
| **Prose with concern seams** (constitution, long profile, hook) | **Split** — the seam is **narrative vs current state**, so why-history goes to a `.notes.md` sidecar | Fragment mid-argument |
| **Prose without seams** | Trim and re-point | Fragment |
| **List / index** | **Give the content back to the records.** A field belongs in an index only if you need it to decide WHICH RECORD TO OPEN | Split the list |

⭐ **The sidecar split is the highest-yield move in this hook and it has run three times in two days** — `trip-triage` (#793), `session-board` 32,393 B → 4,953 B (#808), and this file. ⚠️ **The prose is never the problem and must not be deleted as one:** it is why those failures stopped recurring. **It moves; it does not die.**

⭐ **The index remedy is the cheapest fix here when it applies, because nothing moves and nothing is lost** — the content already exists in the records. `roster.json` 18.4KB → 12.3KB, floor ~2KB, and it did not come back.

---

## Monolith-growth gate (build modular by default)

- **Single-file is a size privilege, not an architecture.** Fine only while under target; the moment an edit crosses it, convert to thin shell + `source/*` modules in the same pass, no permission-seeking.
- **Growth check on every edit:** the split happens in the pass that causes it. **Never ship the bloat "just this once."**
- **Reference implementation:** `world-cup-bracket/` post-v3 (thin shell + 6 JS + 2 CSS, each <12KB).
- **Where clean boundaries usually are:** styles vs logic; render modules by screen; shared state/constants; pure helpers; entry/wiring.
- **The tell that a hand-maintained index is heading for the ceiling:** growth is always **prose, not rows.** Per-item narrative belongs in git history, the PR body, and that item's own README. **An index cites and stops.**

---

**Output:** silent for routine splitting. Brief note at the target→15KB indivisible edge. Real FLAG + question ONLY when forced to fragment one coherent unit, or an indivisible >30KB blob needs upload routing. **Name it out loud** when a canonical hand-edited file crosses 22KB, when a file's stated target sits below its floor, or when a projected floor nears the ceiling (that one is a shape problem — say so plainly).

**Composes with:** runs after Secrets Guard, before the commit. **Size Sally** (`agents/size-sally.md`) is the forecasting counterpart — she seats on the build path with Fold-in Frank and projects the curve ahead; this hook is the reactive per-write gate; the workflow is the backstop that catches what both miss. Defers to the **GitHub MCP Operating Standard** for split/chunk mechanics and for app `source/` renditions.

**Changelog:** in the [notes sidecar](./source-size-budget-enforcer.notes.md). Current: **v7 (2026-08-11)** — mechanical gate added; this file slimmed to procedure.
