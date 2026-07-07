---
id: multi-home-gate
name: Multi-Home Gate
shelf: gates
kind: deterministic
trigger: Before add_task_to_list (adding a task to an additional list).
nicknames: [Multi-Home Gate]
safety_nets_for: [add_task_to_list]
version: 1
added: 2026-07-07
---

# Multi-Home Gate (🔑 Gate)

**Fires before `add_task_to_list`.** Adding a task to extra lists is useful but easy to overdo; a task living in many lists gets confusing statuses and duplicate-looking entries.

## The check
1. Confirm the task genuinely belongs in the additional list (reference vs true membership).
2. **WARN** if the task is already in several lists, or if the target uses a different status set that will read oddly.
3. Prefer a view/filter over a second home when the goal is just visibility.

## NO-BYPASS
Before firing `add_task_to_list`, load THIS profile and act on it. Never fire from memory. Reading the index IS the gate.
