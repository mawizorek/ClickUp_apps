# 10_UI__Set_Hub_Tab — notes

**STATE: GOLDEN.** The only script that came through the 2026-06-18 audit unscathed — because it does exactly one thing.

Copy text: [`10_UI__Set_Hub_Tab.fmscript`](./10_UI__Set_Hub_Tab.fmscript)

---

## The rule that keeps it useful

**No data mutation. Ever.** The moment a tab switch starts posting records or generating schedules, every button on the hub becomes unpredictable and you can no longer reason about what a click costs. Tab switching is display state.

If a tab needs data prepared, **the caller prepares it and then calls this.** That is why `70_SCHEDULE__Generate_Expected_Schedule` calls it last rather than the reverse.

## Why it validates the tab name

A typo'd tab name would otherwise set the global to garbage and leave the hub on a **blank panel with no error** — the layout object simply fails to match anything. Failing loudly on an unknown tab is much cheaper than debugging an empty screen.

⚠️ **Maintenance cost, stated honestly:** the `$known` list is a hardcoded mirror of the hub layout's panel names. Add a tab to the layout and forget this list, and the new tab is unreachable. That is a real duplication and the trade was made deliberately — a wrong-but-silent global is worse than a list that occasionally needs syncing. If the panel set starts churning, move it to a value list.

## Callers

- Hub tab buttons (direct)
- `30_CONTEXT__Select_Property_Context` — when a `tab` param is passed
- `70_SCHEDULE__Generate_Expected_Schedule` — returns the user to Schedule posture after generating

## History

- **2026-06-18** — audited, kept as-is. Called "current enough."
- **2026-07-29** — ported from ClickUp into a real body; tab-name validation added, because a silent blank panel is the failure mode this script would otherwise have.
- **2026-07-29 (later)** — body stripped to pure copy text; this sidecar created.
