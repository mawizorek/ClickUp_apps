# Job Market Refresh — Output Templates

> v21 (2026-11-22). This file owns output shape only. Procedure remains in `routines/job-market-refresh.md`; lane contracts live on the matching task in [ClickUp Lanes](https://app.clickup.com/36074068/v/li/1400600000006271); listing records live in [Job Census](https://app.clickup.com/36074068/v/li/1400600000006272); source records live in [Job Sources](https://app.clickup.com/36074068/v/li/901328152493).

## The pass anchor

Every role header and the pass summary ends with a machine anchor:

```text
`<role_id>` · pass `<YYYY-MM-DD HH:MM>`
```

Use the fixed order: `production-manager`, `technical-director`, `stage-manager`, `electrician`, `operations-safety`, `audio-sound`, `drafting-design`, `creative-admin`, `producing-artistic`. A single-role top-up appends `· top-up`; the pass summary uses `PASS COMPLETE`.

## Comment architecture

The top-level standing-task stream contains only role headers, checkpoints, and the pass summary. SAME, ALSO, NEW, GONE, and NOTABLE are threaded replies. Each NEW is a separate reply and links its Job Census task. The role header records swept-zero boards because a negative result otherwise leaves no artifact.

## Template 1 — role header

```text
## 🎯 <ROLE DISPLAY NAME> · <YYYY-MM-DD HH:MM> ET

**Keywords:** <keywords copied from the matching Lanes task>
**Live:** <n> · New: <n> · Gone: <n>
💵 Salary range across live: <low>-<high> (or "none posted")
🚫 Swept, zero yield: <board codes> (or "none")

### Verdict
<one line about this lane's market>

`<role_id>` · pass `<YYYY-MM-DD HH:MM>`
```

## Template 2 — SAME reply

```text
### 🔁 SAME · <n>

<friction> [<Role>](<url>) · <Org> · <location> · **<n>d** · 💵 <salary or —>
```

## Template 2b — ALSO reply

```text
### ↔️ ALSO IN THIS LANE · <n>

<friction> [<Role>](<url>) · <Org> · <location> · **<n>d** · 💵 <salary or —> · homed in `<role_id>` (Job Census task)
```

This is a relationship pointer, not a second row. Cross-lane postings use one Census task with multiple Lane links.

## Template 3 — NEW reply

```text
🆕 **[<Role>](<url>)** · <Org>
Job Census: <task URL>
<location> · 💵 <salary or —> · 📅 <posted> · <friction>
✅ <why qualifies, <10 words>
```

Use ⚠️ for a caveat. Before creating a Census task, dedupe on `Posting URL`.

## Template 4 — GONE reply

```text
### 🕳️ GONE · <n>

**<Role>** · <Org> · <Job Census task URL> · lived <n>d · <Rule 7 closure proof>
```

A missed search, unreachable board, stale cache, or partial pagination is not closure proof.

## Template 5 — NOTABLE reply

```text
### 📌 NOTABLE

- <pattern or observation>
- **Unlinked:** <Role> · <Org> · <board> · <why no URL>
- **Not admitted, logged:** <Role> · <Org> · <board> · <date> · <filter failure>
- **Lane-misfit:** <Role> · <Org> · config gap; no Census row
```

There is no `_unfiled` store. Rejected and lane-misfit finds remain prose.

## Template 6 — pass summary

```text
## 📋 PASS COMPLETE · <YYYY-MM-DD HH:MM> ET

**Roles searched:** 9 · **Total live:** <n> · **Total new:** <n> · **Total gone:** <n>
**Prev pass:** <timestamp> (<elapsed>)
**Sessions:** <n> · opened <time>, landed <time> (<elapsed>)
[Job Census](https://app.clickup.com/36074068/v/li/1400600000006272) · [Lanes](https://app.clickup.com/36074068/v/li/1400600000006271) · [Runbook](https://github.com/mawizorek/ClickUp_apps/blob/main/routines/job-market-refresh.md) v21

<Density verdict.>

### ⚡ Spotlight
<top 3 across all lanes>

### ⚡ ACCESSIBLE
<every remote, hybrid, home, and immediate row, with body quote for remote/hybrid; say explicitly if empty>

### 🗂️ Comment index
- 🎯 <each role header URL> · <n> live, +<n>
- 🔌 <SOURCES reply URL>

`PASS COMPLETE` · pass `<YYYY-MM-DD HH:MM>`
```

## Template 7 — SOURCES reply

```text
### 🔌 SOURCES

- [**<Board>**](<Job Sources Entry URL>) `<code>` · ✅/⚪/🕐/⚠️/❌ · <n> qualifying · <note>
```

Use `✅` swept/yielded, `⚪` swept/zero, `🕐` reachable but stale, `⚠️` degraded/blocked, and `❌` not hit. Build this from Census `Source` relationships created this pass and every role's zero-yield line, not memory. Every board name links to its Job Sources entry or homepage.

## Template 8 — checkpoint

```text
## ⏸️ CHECKPOINT · <YYYY-MM-DD HH:MM> ET · reference only, DERIVE, don't obey

**Pass anchor:** <original pass timestamp> ET
**Paused after:** `<role_id>` (Census writes and Last Pass landed)
**Believed next:** `<role_id>`
**Why it stopped:** <human context>
**Stamp:** NOT written
```

A checkpoint carries position, never listing data. The landed Census rows and Lanes `Last Pass` are the handoff.

## Template 9 — spent checkpoint

```text
## ✅ CHECKPOINT · <original time> ET · SPENT, DO NOT RESUME FROM THIS

**Consumed by the <time> ET session.** Superseded by [📋 PASS COMPLETE](<url>).
```

## Accessibility evidence

`remote` and `hybrid` require quoted words from the posting body; never infer them from a card or title. `home` is calculated from the 90-mile Rochester radius. `immediate` is a speed-to-work label and is separate from geography. All four are Census `Accessibility` labels and are listed in the pass summary.
