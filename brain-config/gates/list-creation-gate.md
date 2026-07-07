---
id: list-creation-gate
name: List Creation Gate
shelf: gates
kind: deterministic
trigger: Before create_list.
nicknames: [List Gate]
safety_nets_for: [create_list]
version: 1
added: 2026-07-07
---

# List Creation Gate (🔑 Gate)

**Fires before `create_list`.** A new list is a new database with its own statuses + fields; spinning one up when an existing list (or a view/filter on one) would do creates fragmentation.

## The check
1. Check siblings 1–2 levels up: does a list already cover this, or would a view/filter serve better?
2. **WARN** on overlap; propose the lighter option (view instead of list) when it fits.
3. If creating: confirm the parent Space/Folder placement + whether it should inherit or define its own statuses/fields.

## NO-BYPASS
Before firing `create_list`, load THIS profile and act on it. Never fire from memory. Reading the index IS the gate.
