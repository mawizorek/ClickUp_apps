# Routines Viewer — Next Build Spec

**App:** `routines/index.html` (single file, no `source/` split). **Live:** https://mawizorek.github.io/ClickUp_apps/routines/
**Ledger row:** `routines` in `/VERSIONS.md`. **Status: v2 SHIPPED 2026-07-27** — D1-D6 all closed.

> **What this app is:** a passive, zero-maintenance render of `routines/schedule.md`. It has no data file of its own and no build step. **Its only job is to tell the truth about what has run and what has not.**

---

## ⚠️ The standing hazard: this app and `schedule.md` are ONE SYSTEM

Every defect below was self-inflicted by a **doc** edit that was correct in isolation. Nobody broke the app; people edited a markdown table and the renderer quietly disagreed. **A change to `schedule.md`'s SHAPE is a change to this app.** Two of the six defects went unnoticed for three weeks because a wrong render looks exactly like a right one.

**The design rule for v2, and the thing to preserve in every future edit:**

> **Derive, don't declare. And never render a guess as a fact.**
> Anything the app can compute from parsed data, it computes. Anything it cannot read, it labels *unknown* — never `never`, never a plausible default, never sample data.

---

## Defects — all fixed in v2

### 🔴 D1 — The "Current wake window" card stated something that was no longer true ✅

`renderWindow()` never read `schedule.md`. It hardcoded a wake timetable and branched on a hardcoded `2026-07-19` date, printing **"Ricky wakes once daily at 06:00 ET."**

**Nothing wakes.** The scheduler was retired 2026-07-26 (Michael: *"ricky no longer wakes at 6am unless I trigger him"*). This was the largest, highest-contrast element on the page asserting the one fact that had become false — the worst thing for a status board to be wrong about, because a confident wrong status is worse than no status. It was also drifting *before* the retirement: the card said `06:00/15:00/21:00/03:00`, `schedule.md` said `06:00/12:00/16:00/00:00`. Two hardcoded timetables, neither reading the other.

**Fixed — not by swapping one hardcoded claim for another.** The card is now structurally incapable of drifting: a fixed, non-numeric statement of the MODEL (*invoke-only, nothing runs on a timer*), with active / overdue / unreadable / retired counts **derived from the parsed table**. There is no time of day anywhere in it, by rule.

### 🔴 D2 — Every routine displayed "Last run: never" from 2026-07-05 to 2026-07-27 ✅

On 2026-07-05 the stamp ledger moved out of `schedule.md` into per-routine files to kill a shared-file stamp race. Column 4 stopped being a **timestamp** and became a **file path**. `parseLastRun()` was never updated: it ran `new Date('routines/last-run/on-track.txt')`, got `NaN`, and fell through to `never`.

**Three weeks of a silently wrong core field in the app whose entire purpose is showing last-run** — failing in the most damaging direction available, since `never` reads as *"this has never worked"* when the truth was *"ran Jul 15."*

**Fixed:** path-shaped cells are fetched from the raw root and parsed. Three outcomes, three DISTINCT renders:

| File contents | Render | Why it must be distinct |
|---|---|---|
| `YYYY-MM-DD HH:MM` | real date + relative age | the actual answer |
| `never` | **Never run** | a real, meaningful state |
| fetch failed / unparseable | **Stamp unreadable** | 🚫 **must NEVER collapse into `never`** — that IS the bug, and it is the same "lying with numbers" rule `schedule.md` binds agents to |

### 🟠 D3 — F1's day strip was missing Friday and Saturday ✅ *(found while speccing, pre-existing)*

`parseDays()` regexed individual day NAMES out of the cadence cell. F1's cell reads `Thu–Sun`, which contains the literal tokens `thu` and `sun` — **but not `fri` or `sat`.** A four-day routine rendered as two.

**Fixed:** range forms (`Thu–Sun`, `Thu-Sun`, `Thu to Sun`, en/em dash) expand inclusively with week wrap; the single-day scan stays as fallback.

### 🟠 D4 — "Retired" was inferred from prose ✅

`isInactive()` decided a routine was dead by regexing **`through YYYY-MM-DD`** out of the free-text notes cell — a load-bearing dependency on a turn of phrase. It nearly fired on 2026-07-26: a draft rewrote the World Cup notes into a cleaner sentence, which would have silently **un-retired** the card and rendered a dead routine as active, the exact opposite of the instruction being carried out.

**Fixed:** the **`Cadence`** cell is read first — literal `inactive` wins, because it is explicit and already what the row says. The dated regex stays as a secondary. **`schedule.md`'s "don't rephrase this cell" contract has been relaxed accordingly** — that is the real win, because a contract depending on nobody editing prose is a contract that will be broken.

**Deliberately NOT done:** sniffing the word *"retired"* out of the notes. It was in the first draft of v2 and removed on review — a note reading *"replaces the retired X routine"* would kill a live row, which is the same fragility D4 exists to remove. **The fix for prose-sniffing is not more prose-sniffing.**

### 🟡 D5 — Status vocabulary was wake-timer language ✅

`Due today` / `Done today` / `Active cycle` / `Next: Wed` all describe something that fires on a clock; under invoke-only, "Due today" implies something will happen today.

**Fixed — vocabulary matched to the due-math in `schedule.md`:** `Overdue Nd` · `Current · next <Day>` · `Never run` · `Eligible today` (session-aware only — the runbook decides if there is work) · `Next: <Day>` · `Retired` · `Stamp unreadable`.

### 🟡 D6 — The fallback rendered fake data ✅ *(found while speccing)*

On any fetch failure the app silently fell back to `SAMPLE_MD`, a hardcoded sample table, and rendered it as real behind a small italic note. **A status board that invents plausible rows when it cannot reach its source is a lie generator** — and the sample still described the World Cup 4×/day cadence.

**Fixed:** sample deleted; explicit error instead. **An empty screen is strictly better than a confident wrong one.**

---

## Out of scope for v2 (deliberate)

- **No `source/` split** — see the size note; splitting is a real refactor and does not belong in a defect fix.
- **No timezone handling.** Stamps are ET and `new Date()` parses them as viewer-local. Correct for Michael in `America/New_York`, off by hours elsewhere. Pre-existing, **named so it is not rediscovered as a surprise.**
- **No write path.** The viewer stays strictly passive. It never stamps.

## 📏 Size — ⚠️ my estimate was wrong, recorded rather than quietly corrected

**Spec projected ≈ +1.2KB. Actual: 16,094 → 20,802 bytes (+4.7KB, ~4× the estimate.)** D6's deletion paid for less than expected and the inline comments cost more; a review pass condensing them to spec pointers clawed back 520 bytes. **Under the 22KB ceiling, well over the 15KB split line.**

**The next change to this app is the `source/` split — not another inline block.** Seat Size Sally before it. Estimating a delta before writing the code was still right; the lesson is that the estimate needs re-checking at commit time, which is exactly when a budget is easiest to skip.

## Verification — checked against real data at HEAD

Stamps: `on-track.txt` = `2026-07-15 00:08`, `f1.txt` = `2026-07-11 18:06`, `world-cup.txt` frozen.

On **Mon 2026-07-27** a correct render shows:

1. **On Track refresh** — cadence Wednesday, last run Jul 15. Most recent Wednesday was **Jul 22** → **`Overdue 5d`** (red), last run `12d ago`. *(Pre-fix: "Last run: never · Next: Wed.")*
2. **F1 refresh** — Thu–Sun session-aware, last run Jul 11. Today is Monday → **`Next: Thu`**, last run `16d ago`, day strip highlighting **Thu, Fri, Sat, Sun** — four days, not two.
3. **World Cup refresh** — **`Retired`**, dimmed, sorted last, no day strip.
4. **Header** — "Invoke-only, nothing runs on a timer" + `2 active · 1 overdue · 1 retired`. **No time of day anywhere.**
5. Kill the network → explicit error, **no sample rows**.

**Post-Build Verify against the live Pages URL** (build lag ~30-60s; `main` via blob API is the source of truth if they disagree).
