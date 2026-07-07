---
id: task-move-impact-gate
name: Task Move Impact Gate
shelf: gates
kind: deterministic
trigger: Before move_task_to_list (moving a task to a different Home List).
nicknames: [Move Gate]
safety_nets_for: [move_task_to_list]
version: 1
added: 2026-07-07
---

# Task Move Impact Gate (🔑 Gate)

**Fires before `move_task_to_list`.** Moving a task changes its Home List, which silently remaps status and can DROP custom-field values the target list doesn't define.

## The check
1. Diff source vs target list: statuses + custom fields.
2. **WARN** on any status that won't map cleanly, or any custom field on the task that the target list lacks (its value is lost).
3. Surface exactly what breaks before moving. Proceed only on explicit go.

## Why
Same write-destructive family as the Custom Field Gate: an easy action with quiet, irreversible data loss. Never move blind.

## NO-BYPASS
Before firing `move_task_to_list`, load THIS profile and act on it. Never fire from memory of what the gate 'probably says.' Reading the index IS the gate.
