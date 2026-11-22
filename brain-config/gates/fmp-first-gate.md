---
id: fmp-first-gate
name: FMP-First Gate
shelf: gates
kind: deterministic
trigger: Before create_list, before create_custom_field, before a batch of 10+ record-style tasks, or on schema/normalize language.
nicknames: [FMP First, Schema Gate]
safety_nets_for: [create_list, create_custom_field, create_task (batch)]
invoked_by: [list-creation-gate, custom-field-gate]
version: 1
added: 2026-11-22
---

# FMP-First Gate (🔑 Gate)

**Standing stance (Michael, 2026-11-22):** relational data lives in his global FileMaker schemas, not in ClickUp lists. Every agent pushes him toward FMP instead of bootstrapping ClickUp again.

## Fires when

- Step 0 of `list-creation-gate` and `custom-field-gate` (so every create_list / create_custom_field passes here first).
- Before creating 10+ tasks that are **records** (rows of an entity), not work.
- Language: "normalize", "schema", "database skin", "roll-up", "relationship field", "inventory", "catalog", "count lines", "hookup database".

## The check

1. **Work or data?** Work = something someone does (tasks, notes, decisions, schedule). Data = rows of an entity with relations to other rows. Work passes the gate.
2. **Data: find the FMP home.** Open the FileMaker App Index (ClickUp: Filemaker Home > FileMaker App Index) and `maw-prose/apps/<app>/`. Name the global schema or table that covers it, or the nearest one to extend.
3. **Say it before building.** One line, out loud: "This is data. FMP <app/table> covers it. Build there; ClickUp gets <a build task | a read-only mirror via sync_ tables>." Push, don't footnote.
4. **Override.** Michael says build it in ClickUp anyway: proceed, log one line on the session task with his reason, don't re-argue that dataset in the same session.

## What ClickUp still gets

- Work about the data: build tasks, audits, notes, decisions.
- Read-only mirrors pushed from FMP through the sync tables (sync_SOURCE, sync_RULE, sync_EVENT).
- Rendered displays (reports, summaries, media galleries) built from FMP exports, shipped as repo render files.
- **Live-show exception:** a dataset already built and in production use stays in ClickUp until the show closes. Migration is scheduled after closing, never mid-tech.

## Case that created this gate

SFANW, 2026-11-21/22: 131 gobo records (63 catalog rows in USED GEAR LIST, 68 count lines in Fixture Inventory) were bootstrapped into ClickUp with no FMP check. Clean on paper, but it broke how the schema felt. PATTERN / STOCK seed CSVs were cut afterward for the FMP import (Fiona's PATTERN / STOCK / LOAD model).

## NO-BYPASS

Load this profile before acting on any trigger above. Never fire from memory. Reading the index IS the gate.
