---
id: deletion-flag-gate
name: Deletion-Flag Gate
shelf: gates
kind: deterministic
trigger: Whenever asked to "flag", "mark", or "nominate" any asset for deletion (doc, page, task, list, view, field, file).
nicknames: [Delete Flag, Flag-for-Deletion]
version: 1
added: 2026-07-18
---

# Deletion-Flag Gate (🔑 Gate)

**Fires whenever Michael (or a workflow) asks to flag / mark / nominate something for deletion.** "Flagging for deletion" is NOT a prose mention in chat — it is a **literal rename of the asset itself** so it's visually unmissable in the sidebar/list and Michael can find-and-delete at a glance.

## The rule (do this, not just say it)
1. **Rename the asset in place** so the title starts with a red marker and a delete tag:
   `🔴 DELETE ME — <original title> (<one-line why + keeper pointer>)`
   - Red circle 🔴 at the FRONT for visual scanning.
   - `DELETE ME` in the title so it's literal, searchable, and unambiguous.
   - Keep the original title text so it's still identifiable, and append the reason + where the live/keeper version lives (e.g. "superseded by doc-page-XX").
2. **Never delete it yourself.** Renaming is the agent's job; the actual delete is Michael's (deletion is irreversible — same discipline as any destructive action). Hand back the links.
3. **Batch:** when flagging several, rename every one, then return the full list of renamed links in one block so Michael can sweep them.
4. **Verify before flagging:** read each candidate first (it may hold unique/live content). Only flag true dupes/stale/superseded assets, and say what the keeper is.

## Why
A prose "you could delete these" makes Michael hunt; a 🔴 DELETE ME rename turns the sidebar itself into the to-delete queue. The rename is the deliverable.

## NO-BYPASS
Before replying to any "flag for deletion" request, load THIS profile and perform the renames. A chat-only list of deletion candidates without the in-place rename = the gate FAILED.
