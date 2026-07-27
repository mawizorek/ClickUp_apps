# Routines Viewer — Next Build Spec

**App:** `routines/index.html` (single file, no `source/` split). **Live:** https://mawizorek.github.io/ClickUp_apps/routines/
**Ledger row:** `routines` in `/VERSIONS.md`. **Status: v2 SHIPPED 2026-07-27** — D1-D6 all closed.

> **What this app is:** a passive, zero-maintenance render of `routines/schedule.md`. It has no data file of its own and no build step. **Its only job is to tell the truth about what has run and what has not.**

---

# 🗑️ DELETION CANDIDATE — parked 2026-07-27, NOT decided

> **Michael, hours after v2 shipped:** *"seems like this schedule app can be deleted and more neatly connected to Ricky as a markdown. i don't need the fancy app as long as the schedule is findable and legible."*

**Status: OPEN QUESTION. The app is live and untouched. Nothing here authorizes a deletion.**

🛑 **INVESTMENT FREEZE while this is open — and this specifically cancels the standing next-action below.** Do **NOT** do the `source/` split, do not add features, do not "tidy" it. Fixing a live defect is still fine. **Spending a refactor on an app that may be deleted is the waste this note exists to prevent.**

**Steward: Fleet Felix** (Michael's call). Unusual for an app question — the reason it is his is that the core issue is *two things claiming one job*, which is the singularity lane, not an engineering one.

## The case FOR deleting (it is stronger than it first looks)

1. 🎯 **The app and Ricky's triage answer the SAME question.** "What's stale and what's due" is now computed by a bare `Ricky` from the same two inputs (`schedule.md` + `last-run/*.txt`), on invocation, in chat. **That is two claimants on one truth** — the exact rot pattern that killed `registry.json`, that `data-refresh-log.json` was deleted for, and that this repo has spent a week hunting. It just happens to be a claimant with a nice dark UI. **The scheduler's retirement is what created the overlap:** when a timer ran things unattended, a passive glance-surface was the only way to see status without asking. Now asking IS the interface.
2. **The renderer was the sole source of every defect. The markdown was never wrong.** Six defects in v2, two of them lying for three weeks — and in every case `schedule.md` held the correct answer while the app misreported it. **20.8KB of code whose only failure mode is misrepresenting a file you could just read.**
3. **Deleting the app FREES the doc.** Right now that table's shape is an API: four columns, a `Routine file` header, day names parsed out of a cell. Kill the renderer and `schedule.md` can be optimized purely for a human reading it — which is precisely Michael's stated bar, *"findable and legible."* **The parser is the only reason the doc isn't already shaped for people.**
4. **It is over the split line**, so *keeping* it means paying for a `source/` refactor of a 3-row table viewer.
5. **GitHub already renders markdown**, so "findable and legible" is satisfied by the file itself at zero cost, zero build, zero drift.

## The case AGAINST (what genuinely dies with it)

1. **The glance.** A URL you can open on a phone with no agent, no session, no tokens. Ricky's triage requires invoking Ricky.
2. **Derived arithmetic.** Raw markdown shows `2026-07-15` and a cadence of "every Wednesday." The app shows **`Overdue 5d`**. That subtraction is the entire product — and a human reading the raw file has to do the date math in their head, which is exactly the kind of thing people skip.
3. **The stamps are in three separate files.** Reading raw markdown means opening `schedule.md` plus one `last-run/*.txt` per routine to answer "is anything stale." The app joins them. **This is the strongest keep argument** and it should be answered honestly before deleting, not waved off.

## The middle option nobody has costed yet

**Fold the glance into the doc.** If whoever runs a routine also wrote the stamp *into `schedule.md`'s last column as a date* (instead of a path), the raw file would be self-contained and legible — no app, no join, no parser. **That was the pre-2026-07-05 design**, and it was abandoned for a real reason: the shared-file stamp race (see `schedule.md`). **So this option is only viable if concurrent stamping is genuinely no longer a risk** — plausible now that nothing fires on a timer and stamps only happen inside an invoked session, but it is a claim that must be *tested*, not assumed. **The last agent who assumed a shared stamp file was safe was me, and it was wrong within a day.**

## If the answer is DELETE, this is the checklist

1. `routines/index.html` removed; `routines/` keeps README + schedule + runbooks + `last-run/`.
2. `VERSIONS.md` row → **RETIRED** with a dated reason. Do not silently drop the row (see `markdown-viewer` for the pattern).
3. `app-dashboard` `source/data.js` → `status:'retired'` so the launcher stops offering a dead tile.
4. `schedule.md`: **delete the Viewer section and the VIEWER CONTRACT block**, then reshape the table for humans. *That is the payoff — do not skip it, or we keep the constraint and lose the feature.*
5. Check `brain-config/` + the AI Toolkit index + the Brain Reference Library for pointers at the live URL. **A retired app with live pointers is worse than the app.**

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

- **No `source/` split** — see the size note; splitting is a real refactor and does not belong in a defect fix. ⚠️ **Now also frozen behind the deletion question above.**
- **No timezone handling.** Stamps are ET and `new Date()` parses them as viewer-local. Correct for Michael in `America/New_York`, off by hours elsewhere. Pre-existing, **named so it is not rediscovered as a surprise.**
- **No write path.** The viewer stays strictly passive. It never stamps.

## 📏 Size — ⚠️ my estimate was wrong, recorded rather than quietly corrected

**Spec projected ≈ +1.2KB. Actual: 16,094 → 20,802 bytes (+4.7KB, ~4× the estimate.)** D6's deletion paid for less than expected and the inline comments cost more; a review pass condensing them to spec pointers clawed back 520 bytes. **Under the 22KB ceiling, well over the 15KB split line.**

~~The next change to this app is the `source/` split.~~ 🛑 **SUPERSEDED 2026-07-27 — frozen pending the deletion question.** Splitting a 20.8KB file we may delete is exactly backwards. Estimating a delta before writing the code was still right; the lesson stands that the estimate needs re-checking at commit time, which is exactly when a budget is easiest to skip.

## Verification — checked against real data at HEAD

Stamps: `on-track.txt` = `2026-07-15 00:08`, `f1.txt` = `2026-07-11 18:06`, `world-cup.txt` frozen.

On **Mon 2026-07-27** a correct render shows:

1. **On Track refresh** — cadence Wednesday, last run Jul 15. Most recent Wednesday was **Jul 22** → **`Overdue 5d`** (red), last run `12d ago`. *(Pre-fix: "Last run: never · Next: Wed.")*
2. **F1 refresh** — Thu–Sun session-aware, last run Jul 11. Today is Monday → **`Next: Thu`**, last run `16d ago`, day strip highlighting **Thu, Fri, Sat, Sun** — four days, not two.
3. **World Cup refresh** — **`Retired`**, dimmed, sorted last, no day strip.
4. **Header** — "Invoke-only, nothing runs on a timer" + `2 active · 1 overdue · 1 retired`. **No time of day anywhere.**
5. Kill the network → explicit error, **no sample rows**.

**Post-Build Verify:** `main` confirmed at HEAD via blob API; Pages served the cached v1 shell for several minutes, then **v2 confirmed rendering live**.
