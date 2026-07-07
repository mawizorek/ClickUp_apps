# Handoff — Next-Gates Brainstorm

**Packaged by:** Handoff Hana · **Date:** 2026-07-07 · **For:** a fresh brainstorm session with Michael

## Warm-start prompt (paste to open the session)

> “Let’s brainstorm a light load of new auto-firing gates. Review this handoff, the unguarded tools in the Platform index, and the session logs. Bring Fold-in Frank in first on each idea (FOLD-IN / NET-NEW / MERGE), then we pick 2–3 to build.”

## Context (where we just were)

Just shipped the **Custom Field Gate** (write-once dropdown/label preview → approve → create → catalog), **Size Sally** (pre-build data-model forecaster), the **51-swatch dropdown replica + catalog**, and the **Tools Hub** (`tools.html` toggle: `index.html` = Our AI Index, `tool-index.html` = Platform Tools). Gate is live in the AI Toolkit index; usage-log bumped to session 2.

**Edit-safety note for agents:** the three tool-index files are independent. `tools.html` = controller/toggle only. `index.html` = authored tools (hands-off, Michael-curated). `tool-index.html` = platform tools. Never cross-edit.

## The opportunity: unguarded tools

The Platform index shows which native tools have zero safety net. That coverage gap IS the brainstorm surface. Candidates below are drawn from real friction in the session logs, not invented.

### Candidate gates (ranked, for Frank to triage)

1. **Agent Name-Collision Gate** → `create_new_agent` / `update_existing_agent`
   - **Log basis:** the Routine Ricky saga (open-thread). Ricky was created mid-session, collided with the registry/name single-source-of-truth, left a whole cleanup trail.
   - **Gate:** before creating an agent, check the name against live Super Agents AND the registry/sidecars; HALT on collision, WARN on near-match. Reconcile prefs-as-source-of-truth before reuse.
   - Likely **NET-NEW**. Strongest candidate.

2. **Doc Placement & Dedup Gate** → `create_document` / `create_document_page`
   - **Log basis:** “When Documenting” is currently prose-only (load existing first, no duplicates, current truth at top). Promote to a real deterministic gate mirroring Task Dedup.
   - **Gate:** before creating a doc/page, search for an existing one; HALT on exact, WARN on near, verify correct hierarchy placement.
   - Likely **MERGE** into the existing prose hook, or NET-NEW if it earns a profile.

3. **Task Move Impact Gate** → `move_task_to_list`
   - **Log basis:** moving a task changes its Home List → status remap + custom-field loss when the target list lacks them. Quietly destructive, same family as the write-once concern that birthed the Custom Field Gate.
   - **Gate:** before moving, diff source vs target statuses + custom fields; WARN on any field/status that won’t survive the move.
   - Likely **NET-NEW**.

4. **View Sprawl Gate** → `create_view` (lighter)
   - **Gate:** before creating a view, list existing views on the location; WARN if a near-identical view already exists. Views proliferate silently.
   - Likely **NET-NEW**, low priority.

5. **Send-Confirm Gate** → `post_comment` / `gmail_send_email` (lighter)
   - Complements Link Provenance: an explicit confirm-before-send checkpoint for outbound messages. May already be covered by execution rules; Frank should check for redundancy.

## Recommended cut

Build **#1 (Agent Name-Collision)** and **#3 (Task Move Impact)** first: both NET-NEW, both grounded in real destructive-action risk. Treat **#2** as a MERGE candidate into the Documenting hook. Park #4/#5 unless the session wants them.

## Open threads to fold in (from open-thread.md)

- Three-Shelf Reconciliation: AI Toolkit subpages still named “Every-Run/Triggered Tools”; rename on next Toolkit pass.
- Agent-Name single-source-of-truth: ClickUp roster + viewer NICKNAMES map still hard-code names. (Directly relevant to gate #1.)
