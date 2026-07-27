# Routines Viewer — Next Build Spec

**App:** `routines/index.html` (single file, no `source/` split). **Live:** https://mawizorek.github.io/ClickUp_apps/routines/
**Ledger row:** `routines` in `/VERSIONS.md`.

> **What this app is:** a passive, zero-maintenance render of `routines/schedule.md`. It has no data file of its own and no build step. **Its only job is to tell the truth about what has run and what has not.**

---

## ⚠️ The standing hazard: this app and `schedule.md` are ONE SYSTEM

Every defect below was self-inflicted by a **doc** edit that was correct in isolation. Nobody broke the app; people edited a markdown table and the renderer quietly disagreed. **A change to `schedule.md`'s SHAPE is a change to this app.** Two of the five defects here went unnoticed for three weeks because a wrong render looks exactly like a right one.

**The design principle for v2, and the one thing to preserve in every future edit:**

> **Derive, don't declare. And never render a guess as a fact.**
> Anything the app can compute from parsed data, it computes. Anything it cannot read, it labels *unknown* — never `never`, never a plausible default, never sample data.

---

## Defects

### 🔴 D1 — The "Current wake window" card states something that is no longer true

`renderWindow()` never reads `schedule.md`. It hardcodes a wake timetable and branches on a hardcoded `2026-07-19` date, printing **"Ricky wakes once daily at 06:00 ET."**

**Nothing wakes.** The scheduler was retired 2026-07-26 (Michael: *"ricky no longer wakes at 6am unless I trigger him"*); routines are invoke-only. This is the largest, highest-contrast element on the page and it asserts the one fact that is now false — the worst possible thing for a status board to be wrong about, because a confident wrong status is worse than no status.

It was also drifting *before* the retirement: the card said `06:00/15:00/21:00/03:00`, `schedule.md` said `06:00/12:00/16:00/00:00`. Two hardcoded timetables, neither reading the other.

**Fix — do NOT swap one hardcoded claim for another.** Replace with a card that is *structurally incapable* of drifting:
- A fixed, non-numeric statement of the model: **INVOKE-ONLY — nothing runs on a timer.**
- Everything else **DERIVED from the parsed table**: active count, overdue count, never-run count, unreadable count.
- One line on how to actually trigger work.

### 🔴 D2 — Every routine has displayed "Last run: never" since 2026-07-05

On 2026-07-05 the stamp ledger moved out of `schedule.md` into per-routine files (`routines/last-run/<name>.txt`) to kill a shared-file stamp race. Column 4 stopped being a **timestamp** and became a **file path**. `parseLastRun()` was never updated: it runs `new Date('routines/last-run/on-track.txt')`, gets `NaN`, and falls through to `never`.

**Three weeks of a silently wrong core field in the app whose entire purpose is showing last-run.** And it fails in the most damaging direction available: `never` reads as *"this routine has never worked,"* when the truth was *"ran Jul 15."*

**Fix:** if the cell looks like a path, `fetch` it from the raw root and parse the contents. Three outcomes, three DISTINCT renders:

| File contents | Render | Why it must be distinct |
|---|---|---|
| `YYYY-MM-DD HH:MM` | the real date + relative age | the actual answer |
| `never` | **Never run** | a real, meaningful state |
| fetch failed / unparseable | **Stamp unreadable** | 🚫 **must NEVER collapse into `never`** — that is exactly the bug, and it is the same "lying with numbers" rule `schedule.md` already binds agents to |

### 🟠 D3 — F1's day strip has been missing Friday and Saturday *(found while speccing, pre-existing)*

`parseDays()` regexes individual day NAMES out of the cadence cell. F1's cell reads `Thu–Sun`, which contains the literal tokens `thu` and `sun` — **but not `fri` or `sat`.** The strip has been rendering a two-day cadence for a four-day routine.

**Fix:** detect the range form (`Thu–Sun`, `Thu-Sun`, `Thu to Sun`, en/em dash) and fill the span inclusively, wrapping the week. Keep the single-day scan as the fallback.

### 🟠 D4 — "Retired" is inferred from prose, so the retirement is one rewrite away from vanishing

`isInactive()` decides a routine is dead by regexing **`through YYYY-MM-DD`** out of the free-text notes cell. That is a load-bearing dependency on a turn of phrase. It nearly fired on 2026-07-26: a draft rewrote the World Cup notes into a cleaner sentence, which would have silently **un-retired** the card and rendered a dead routine as active — the exact opposite of the instruction being carried out.

**Fix:** read the **`Cadence`** cell first — literal `inactive` wins, because it is explicit and it is already what the row says. Keep the `through <past date>` regex as a secondary. **This lets `schedule.md` relax its "don't rephrase this cell" viewer contract**, which is the real win: a contract that depends on nobody editing prose is a contract that will be broken.

### 🟡 D5 — Status vocabulary is wake-timer language

`Due today` / `Done today` / `Active cycle` / `Next: Wed` all describe a thing that fires on a clock. Under invoke-only they mislead: "Due today" implies something will happen today.

**Fix — new vocabulary, matched to the due-math in `schedule.md`:** `Overdue Nd` · `Current` · `Never run` · `Eligible today` (session-aware only — the runbook decides if there is work) · `Next: <Day>` · `Retired` · `Stamp unreadable`.

### 🟡 D6 — The fallback renders fake data *(found while speccing)*

On any fetch failure the app silently falls back to `SAMPLE_MD`, a hardcoded sample table, and renders it as if real behind a small italic note. **A status board that invents plausible rows when it cannot reach its source is a lie generator** — and this one's sample still described the World Cup 4×/day cadence.

**Fix:** delete the sample. On failure, show an explicit error. **An empty screen is strictly better than a confident wrong one.** (Also reclaims ~600 bytes.)

---

## Out of scope for v2 (deliberate)

- **No `source/` split.** The file is ~16KB, already over the 15KB split line — see the size note below. Splitting is a real refactor and does not belong in a defect fix.
- **No timezone handling.** Stamps are ET and `new Date()` parses them as viewer-local. Correct for Michael in `America/New_York`, off by hours for anyone else. Pre-existing, out of scope, **named here so it is not rediscovered as a surprise.**
- **No write path.** The viewer stays strictly passive. It never stamps.

## 📏 Size

Over the 15KB split line **before** this work (~16.1KB). Net delta ≈ +1.2KB (D6's deletion pays for part of the new logic). Recorded, not hidden: **the next feature on this app should be the `source/` split, not another inline block.** Seat Size Sally before it.

## Verification (what "done" means, checked against real data at HEAD)

Stamps at the time of writing: `on-track.txt` = `2026-07-15 00:08`, `f1.txt` = `2026-07-11 18:06`, `world-cup.txt` frozen.

On **Mon 2026-07-27** a correct render shows:

1. **On Track** — cadence Wednesday, last run Jul 15. Most recent Wednesday was **Jul 22**, so → **`Overdue 5d`**, last run `12d ago`. *(Pre-fix this read "Last run: never · Next: Wed.")*
2. **F1** — Thu–Sun, last run Jul 11. Today is Monday → **`Next: Thu`**, last run `16d ago`, day strip highlighting **Thu, Fri, Sat, Sun** (four days, not two).
3. **World Cup** — **`Retired`**, dimmed, sorted last.
4. **Header card** — "INVOKE-ONLY, nothing runs on a timer" + derived counts (`2 active · 1 overdue`). **No time of day anywhere in it.**
5. Kill the network → explicit error, **no sample rows**.

**Post-Build Verify against the live Pages URL** (build lag ~30-60s; `main` via blob API is the source of truth if they disagree).
