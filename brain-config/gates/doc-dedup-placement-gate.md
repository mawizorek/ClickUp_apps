---
id: doc-dedup-placement-gate
name: Doc Dedup & Placement Gate
shelf: gates
kind: deterministic
trigger: Before create_document or create_document_page.
nicknames: [Doc Gate]
safety_nets_for: [create_document, create_document_page]
version: 1
added: 2026-07-07
---

# Doc Dedup & Placement Gate (🔑 Gate)

**Fires before `create_document` / `create_document_page`.** Promotes the prose-only "When Documenting" habit into a deterministic gate, mirroring Task Dedup.

## The check
1. Search for an existing doc/page covering this topic (target location → parent → workspace).
2. **Exact/overlapping match = HALT** + surface it (edit the existing one instead of forking truth).
3. **Near match = WARN + ask.**
4. Verify correct hierarchy placement before creating (right Space/Folder/List/parent page).
5. New content: current truth at top, document WHY not just WHAT.

## NO-BYPASS
Before firing either doc-creation tool, load THIS profile and act on it. Never fire from memory. Reading the index IS the gate.
