---
id: doc-dedup-placement-gate
name: Doc Dedup & Placement Gate
shelf: gates
kind: deterministic
trigger: Before create_document or create_document_page.
nicknames: [Doc Gate]
safety_nets_for: [create_document, create_document_page]
version: 2
added: 2026-07-07
---

# Doc Dedup & Placement Gate (🔑 Gate)

**Fires before `create_document` / `create_document_page`.** Promotes the prose-only "When Documenting" habit into a deterministic gate, mirroring Task Dedup.

## ⚠️ RE-DOCUMENTING RULE (v2 — the #1 failure mode)
**If a page for this subject already exists, you OVERWRITE it in place — you do NOT create a new one.** Auditing, refreshing, or expanding an existing list/doc/subject means editing the EXISTING page (via `str_replace_based_edit_tool` on its virtual path/URL), never spawning a parallel page. Spawning a second page forks the truth and leaves a stale copy behind.
- **Before creating ANY page, ask: does this subject already have a page?** (search target location → parent → workspace, AND check any index/registry pointer such as a List Index `Doc Page` field). If yes → edit that one.
- **The keeper is always the page an index/registry field points at.** Anything else with the same title in that container is a dupe → run the Deletion-Flag Gate on it (🔴 DELETE ME rename).
- Only create a NET-NEW page when the subject genuinely has none.
*(Born from the 2026-07-18 PRP audit: each list got a fresh audited page created alongside its stale 7/15 scaffold instead of overwriting it — fmp Solutions forked THREE times because it kept getting re-scaffolded. Overwriting in place would have prevented all of it.)*

## The check
1. Search for an existing doc/page covering this topic (target location → parent → workspace + index/registry pointer).
2. **Exact/overlapping match = HALT** + surface it. If this is a re-doc/refresh, EDIT the existing page in place (see Re-documenting Rule). Never fork truth.
3. **Near match = WARN + ask.**
4. Verify correct hierarchy placement before creating (right Space/Folder/List/parent page).
5. New content: current truth at top, document WHY not just WHAT.

## NO-BYPASS
Before firing either doc-creation tool, load THIS profile and act on it. Never fire from memory. Reading the index IS the gate.
